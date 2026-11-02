<?php
// ==========================================================================
// DATABASE CONNECTION & AUTO-SETUP - VELAVA MEDICAL STORE
// ==========================================================================

$db_host = 'localhost';
$db_name = 'u170490412_velavajothidam';
$db_user = 'u170490412_velava';
$db_pass = 'aGreen@2026a';
$charset = 'utf8mb4';

$dsn = "mysql:host=$db_host;dbname=$db_name;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

// Ensure table exists
function initDatabase($pdo) {
    $createTableSql = "
    CREATE TABLE IF NOT EXISTS `medical_products` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `category` VARCHAR(100) NOT NULL DEFAULT 'Medicines & Pharmacy',
        `description` TEXT,
        `mrp_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        `offer_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        `discount_percent` INT DEFAULT 0,
        `image_url` VARCHAR(500) DEFAULT '',
        `badge` VARCHAR(100) DEFAULT '',
        `stock_status` VARCHAR(50) DEFAULT 'in_stock',
        `is_featured` TINYINT(1) DEFAULT 1,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $pdo->exec($createTableSql);

    // Check if table is empty; if so, populate initial sample products
    $count = $pdo->query("SELECT COUNT(*) FROM `medical_products`")->fetchColumn();
    if ($count == 0) {
        $sampleProducts = [
            [
                'name' => 'Omron Digital Blood Pressure Monitor (HEM-7120)',
                'category' => 'Medical & Surgical Devices',
                'description' => 'Fully automatic digital blood pressure monitor with Intellisense technology for quick, comfortable, and accurate BP readings.',
                'mrp_price' => 2450.00,
                'offer_price' => 1899.00,
                'discount_percent' => 22,
                'image_url' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
                'badge' => 'Best Seller',
                'stock_status' => 'in_stock'
            ],
            [
                'name' => 'Accu-Chek Blood Glucose Monitor Kit (with 10 Strips)',
                'category' => 'Medical & Surgical Devices',
                'description' => 'Accurate blood sugar testing machine with lancets and test strips. Gives quick results in less than 5 seconds.',
                'mrp_price' => 1599.00,
                'offer_price' => 1199.00,
                'discount_percent' => 25,
                'image_url' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
                'badge' => '25% OFF',
                'stock_status' => 'in_stock'
            ],
            [
                'name' => 'Dr. Morepen Non-Contact Infrared Thermometer',
                'category' => 'Medical & Surgical Devices',
                'description' => 'Instant forehead temperature measurement without touch. Color-coded high fever alert screen and memory recall.',
                'mrp_price' => 1890.00,
                'offer_price' => 1250.00,
                'discount_percent' => 34,
                'image_url' => 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
                'badge' => 'Special Deal',
                'stock_status' => 'in_stock'
            ],
            [
                'name' => 'Fingertip Pulse Oximeter with OLED Display',
                'category' => 'Medical & Surgical Devices',
                'description' => 'Accurately measures Blood Oxygen Saturation (SpO2) and Pulse Rate with rotating color OLED screen.',
                'mrp_price' => 1299.00,
                'offer_price' => 699.00,
                'discount_percent' => 46,
                'image_url' => 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
                'badge' => 'Flat 46% OFF',
                'stock_status' => 'in_stock'
            ],
            [
                'name' => 'Velava Premium First Aid & Emergency Care Kit',
                'category' => 'First Aid & Emergency',
                'description' => 'Comprehensive 42-item first aid box including bandages, antiseptic solution, medical gauze, scissors, and burn care dressing.',
                'mrp_price' => 999.00,
                'offer_price' => 699.00,
                'discount_percent' => 30,
                'image_url' => 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80',
                'badge' => 'Essential',
                'stock_status' => 'in_stock'
            ],
            [
                'name' => 'Immunity Booster Multivitamin & Zinc Tablets (60 Caps)',
                'category' => 'Nutrition & Wellness',
                'description' => 'Daily essential dietary supplement containing Vitamin C, Vitamin D3, Zinc, and Vitamin B-Complex to fortify immune health.',
                'mrp_price' => 650.00,
                'offer_price' => 485.00,
                'discount_percent' => 25,
                'image_url' => 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
                'badge' => 'Special Offer',
                'stock_status' => 'in_stock'
            ],
            [
                'name' => 'All-in-One Facial Steam Inhaler & Vaporizer',
                'category' => 'Nutrition & Wellness',
                'description' => 'Effective steam therapy relief for common cold, bronchitis, congestion, sinusitis, and facial rejuvenation.',
                'mrp_price' => 599.00,
                'offer_price' => 349.00,
                'discount_percent' => 42,
                'image_url' => 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&auto=format&fit=crop&q=80',
                'badge' => 'Save ₹250',
                'stock_status' => 'in_stock'
            ],
            [
                'name' => 'N95 5-Layer Protective Face Masks (Pack of 10)',
                'category' => 'Personal & Mother Care',
                'description' => 'Certified high-filtration respiratory masks protecting against bacteria, airborne droplets, pollen, and dust.',
                'mrp_price' => 499.00,
                'offer_price' => 249.00,
                'discount_percent' => 50,
                'image_url' => 'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=600&auto=format&fit=crop&q=80',
                'badge' => '50% OFF',
                'stock_status' => 'in_stock'
            ]
        ];

        $stmt = $pdo->prepare("
            INSERT INTO `medical_products` 
            (`name`, `category`, `description`, `mrp_price`, `offer_price`, `discount_percent`, `image_url`, `badge`, `stock_status`, `is_featured`) 
            VALUES (:name, :category, :description, :mrp_price, :offer_price, :discount_percent, :image_url, :badge, :stock_status, 1)
        ");

        foreach ($sampleProducts as $p) {
            $stmt->execute($p);
        }
    }
}

// Auto initialize
initDatabase($pdo);

