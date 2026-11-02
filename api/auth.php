<?php
// ==========================================================================
// ADMIN AUTHENTICATION HELPER - VELAVA MEDICAL STORE
// ==========================================================================

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Configured Super Admin Password
define('ADMIN_PASSWORD', 'Admin@2026');

function isAdminLoggedIn() {
    return isset($_SESSION['velava_admin_logged_in']) && $_SESSION['velava_admin_logged_in'] === true;
}

function verifyAdminAuth() {
    if (!isAdminLoggedIn()) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Unauthorized access. Please log in as Super Admin."]);
        exit;
    }
}

