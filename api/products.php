<?php
// ==========================================================================
// PRODUCTS REST API & ADMIN CONTROLLER - VELAVA MEDICAL STORE
// ==========================================================================

header('Content-Type: application/json');
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Public or Admin Actions
if ($method === 'GET') {
    handleGetProducts($pdo);
} elseif ($method === 'POST') {
    handlePostActions($pdo, $action);
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}

function handleGetProducts($pdo) {
    $category = trim($_GET['category'] ?? '');
    $search = trim($_GET['search'] ?? '');
    $offersOnly = isset($_GET['offers_only']) && ($_GET['offers_only'] === '1' || $_GET['offers_only'] === 'true');
    $isAdmin = isset($_GET['admin']) && isAdminLoggedIn();

    $sql = "SELECT * FROM `medical_products` WHERE 1=1";
    $params = [];

    if (!$isAdmin) {
        // Public storefront query
        if ($category !== '' && strtolower($category) !== 'all') {
            $sql .= " AND `category` = :category";
            $params[':category'] = $category;
        }

        if ($offersOnly) {
            $sql .= " AND (`offer_price` < `mrp_price` OR `badge` != '')";
        }

        if ($search !== '') {
            $sql .= " AND (`name` LIKE :search OR `description` LIKE :search OR `category` LIKE :search)";
            $params[':search'] = '%' . $search . '%';
        }

        $sql .= " ORDER BY `is_featured` DESC, `id` DESC";
    } else {
        // Admin dashboard query
        if ($category !== '' && strtolower($category) !== 'all') {
            $sql .= " AND `category` = :category";
            $params[':category'] = $category;
        }

        if ($search !== '') {
            $sql .= " AND (`name` LIKE :search OR `description` LIKE :search)";
            $params[':search'] = '%' . $search . '%';
        }

        $sql .= " ORDER BY `id` DESC";
    }

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        // Get statistics for admin
        $stats = null;
        if ($isAdmin) {
            $totalProducts = $pdo->query("SELECT COUNT(*) FROM `medical_products`")->fetchColumn();
            $activeOffers = $pdo->query("SELECT COUNT(*) FROM `medical_products` WHERE `offer_price` < `mrp_price` OR `badge` != ''")->fetchColumn();
            $outOfStock = $pdo->query("SELECT COUNT(*) FROM `medical_products` WHERE `stock_status` = 'out_of_stock'")->fetchColumn();
            $categoriesCount = $pdo->query("SELECT COUNT(DISTINCT `category`) FROM `medical_products`")->fetchColumn();

            $stats = [
                'total_products' => (int)$totalProducts,
                'active_offers' => (int)$activeOffers,
                'out_of_stock' => (int)$outOfStock,
                'categories_count' => (int)$categoriesCount
            ];
        }

        echo json_encode([
            "status" => "success",
            "count" => count($products),
            "products" => $products,
            "stats" => $stats
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

function handlePostActions($pdo, $action) {
    // 1. Handle Admin Login
    if ($action === 'login') {
        $password = $_POST['password'] ?? '';
        if ($password === ADMIN_PASSWORD) {
            $_SESSION['velava_admin_logged_in'] = true;
            echo json_encode(["status" => "success", "message" => "Admin authentication successful"]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid super admin password."]);
        }
        return;
    }

    // 2. Handle Admin Logout
    if ($action === 'logout') {
        $_SESSION['velava_admin_logged_in'] = false;
        session_destroy();
        echo json_encode(["status" => "success", "message" => "Logged out successfully"]);
        return;
    }

    // 3. Handle Auth Check
    if ($action === 'check_auth') {
        echo json_encode(["status" => "success", "logged_in" => isAdminLoggedIn()]);
        return;
    }

    // Below actions require Super Admin Authentication
    verifyAdminAuth();

    // 4. Add Product
    if ($action === 'add') {
        $name = trim($_POST['name'] ?? '');
        $category = trim($_POST['category'] ?? 'Medicines & Pharmacy');
        $description = trim($_POST['description'] ?? '');
        $mrp = floatval($_POST['mrp_price'] ?? 0);
        $offer = floatval($_POST['offer_price'] ?? 0);
        $badge = trim($_POST['badge'] ?? '');
        $stock = trim($_POST['stock_status'] ?? 'in_stock');
        $imageUrl = trim($_POST['image_url'] ?? '');

        if ($name === '') {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Product name is required"]);
            return;
        }

        // Calculate discount percentage automatically
        $discount = 0;
        if ($mrp > 0 && $offer > 0 && $offer < $mrp) {
            $discount = round((($mrp - $offer) / $mrp) * 100);
        }

        if ($badge === '' && $discount > 0) {
            $badge = $discount . '% OFF';
        }

        $sql = "INSERT INTO `medical_products` 
                (`name`, `category`, `description`, `mrp_price`, `offer_price`, `discount_percent`, `image_url`, `badge`, `stock_status`, `is_featured`) 
                VALUES (:name, :category, :description, :mrp, :offer, :discount, :image_url, :badge, :stock, 1)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':category' => $category,
            ':description' => $description,
            ':mrp' => $mrp,
            ':offer' => $offer,
            ':discount' => $discount,
            ':image_url' => $imageUrl,
            ':badge' => $badge,
            ':stock' => $stock
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Product added successfully!",
            "id" => $pdo->lastInsertId()
        ]);
        return;
    }

    // 5. Edit Product
    if ($action === 'edit') {
        $id = intval($_POST['id'] ?? 0);
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid Product ID"]);
            return;
        }

        $name = trim($_POST['name'] ?? '');
        $category = trim($_POST['category'] ?? 'Medicines & Pharmacy');
        $description = trim($_POST['description'] ?? '');
        $mrp = floatval($_POST['mrp_price'] ?? 0);
        $offer = floatval($_POST['offer_price'] ?? 0);
        $badge = trim($_POST['badge'] ?? '');
        $stock = trim($_POST['stock_status'] ?? 'in_stock');
        $imageUrl = trim($_POST['image_url'] ?? '');

        $discount = 0;
        if ($mrp > 0 && $offer > 0 && $offer < $mrp) {
            $discount = round((($mrp - $offer) / $mrp) * 100);
        }

        $sql = "UPDATE `medical_products` SET 
                `name` = :name, 
                `category` = :category, 
                `description` = :description, 
                `mrp_price` = :mrp, 
                `offer_price` = :offer, 
                `discount_percent` = :discount, 
                `image_url` = :image_url, 
                `badge` = :badge, 
                `stock_status` = :stock 
                WHERE `id` = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':category' => $category,
            ':description' => $description,
            ':mrp' => $mrp,
            ':offer' => $offer,
            ':discount' => $discount,
            ':image_url' => $imageUrl,
            ':badge' => $badge,
            ':stock' => $stock,
            ':id' => $id
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Product updated successfully!"
        ]);
        return;
    }

    // 6. Delete Product
    if ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid Product ID"]);
            return;
        }

        $stmt = $pdo->prepare("DELETE FROM `medical_products` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(["status" => "success", "message" => "Product deleted successfully."]);
        return;
    }

    // 7. Toggle Stock Status
    if ($action === 'toggle_stock') {
        $id = intval($_POST['id'] ?? 0);
        $status = trim($_POST['stock_status'] ?? 'in_stock');

        $stmt = $pdo->prepare("UPDATE `medical_products` SET `stock_status` = :status WHERE `id` = :id");
        $stmt->execute([':status' => $status, ':id' => $id]);

        echo json_encode(["status" => "success", "message" => "Stock status updated."]);
        return;
    }

    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Unknown action specified"]);
}

