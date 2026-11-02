<?php
// ==========================================================================
// IMAGE UPLOAD HANDLER - VELAVA MEDICAL STORE
// ==========================================================================

header('Content-Type: application/json');
require_once __DIR__ . '/auth.php';

verifyAdminAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

if (!isset($_FILES['product_image']) || $_FILES['product_image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No file uploaded or upload error occurred."]);
    exit;
}

$file = $_FILES['product_image'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
$fileInfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($fileInfo, $file['tmp_name']);
finfo_close($fileInfo);

if (!in_array($mime, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid image type. Allowed: JPG, PNG, WEBP, GIF."]);
    exit;
}

if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "File too large. Maximum size is 5MB."]);
    exit;
}

$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$safeExt = strtolower($ext);
$uploadDir = __DIR__ . '/../uploads/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$fileName = 'prod_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $safeExt;
$destination = $uploadDir . $fileName;

if (move_uploaded_file($file['tmp_name'], $destination)) {
    $publicUrl = 'uploads/' . $fileName;
    echo json_encode([
        "status" => "success",
        "url" => $publicUrl,
        "message" => "Image uploaded successfully"
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to save uploaded image."]);
}

