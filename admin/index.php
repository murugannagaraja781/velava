<?php
require_once __DIR__ . '/../api/auth.php';
$isLoggedIn = isAdminLoggedIn();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Super Admin Dashboard - Velava Medicals</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,15 L20,80 L80,80 Z' fill='%230B2B5C'/%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --primary: #0B2B5C;
      --primary-light: #164082;
      --secondary: #2E9E6B;
      --secondary-dark: #237a53;
      --accent: #14A0DC;
      --danger: #EF4444;
      --warning: #F59E0B;
      --bg: #F4F7FB;
      --card-bg: #FFFFFF;
      --text: #1E293B;
      --text-muted: #64748B;
      --border: #E2E8F0;
      --radius: 12px;
      --shadow: 0 4px 16px -2px rgba(11, 43, 92, 0.08);
      --shadow-lg: 0 16px 32px -4px rgba(11, 43, 92, 0.12);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .admin-nav {
      background: var(--primary);
      color: #fff;
      padding: 16px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #fff;
    }
    .brand-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: var(--secondary);
    }
    .brand h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .brand span {
      display: block;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .btn-primary { background: var(--secondary); color: #fff; }
    .btn-primary:hover { background: var(--secondary-dark); transform: translateY(-1px); }
    .btn-outline { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.25); }
    .btn-outline:hover { background: rgba(255,255,255,0.2); }
    .btn-danger { background: #fee2e2; color: #dc2626; }
    .btn-danger:hover { background: #fecaca; }
    .btn-secondary { background: #e2e8f0; color: #334155; }
    .btn-secondary:hover { background: #cbd5e1; }
    .btn-sm { padding: 6px 12px; font-size: 0.82rem; border-radius: 6px; }

    .login-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    .login-card {
      background: var(--card-bg);
      width: 100%;
      max-width: 420px;
      padding: 36px;
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border);
      text-align: center;
    }
    .login-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: rgba(46, 158, 107, 0.12);
      color: var(--secondary);
      font-size: 1.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .login-card h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      color: var(--primary);
      margin-bottom: 6px;
    }
    .login-card p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 24px;
    }

    .admin-container {
      max-width: 1300px;
      width: 100%;
      margin: 0 auto;
      padding: 30px 24px 60px;
      flex: 1;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      padding: 22px 24px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .stat-info span {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .stat-info h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--primary);
      margin-top: 4px;
    }
    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
    }
    .stat-blue { background: #e0f2fe; color: #0284c7; }
    .stat-green { background: #dcfce7; color: #16a34a; }
    .stat-amber { background: #fef3c7; color: #d97706; }
    .stat-purple { background: #f3e8ff; color: #9333ea; }

    .controls-bar {
      background: var(--card-bg);
      border-radius: var(--radius);
      padding: 16px 20px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }
    .search-filter-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 280px;
    }
    .search-input-wrap {
      position: relative;
      flex: 1;
      max-width: 380px;
      min-width: 220px;
    }
    .search-input-wrap i {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }
    .search-input-wrap input {
      width: 100%;
      padding: 10px 14px 10px 38px;
      border-radius: 8px;
      border: 1px solid var(--border);
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-input-wrap input:focus {
      border-color: var(--secondary);
    }
    .filter-select {
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--border);
      font-size: 0.9rem;
      outline: none;
      background: #fff;
      cursor: pointer;
    }

    .table-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .table-responsive {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      background: #f8fafc;
      padding: 14px 18px;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 14px 18px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
      font-size: 0.9rem;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafcff; }

    .product-thumb {
      width: 54px;
      height: 54px;
      border-radius: 8px;
      object-fit: cover;
      background: #f1f5f9;
      border: 1px solid var(--border);
    }
    .product-name-cell h4 {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 4px;
    }
    .product-name-cell span {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .badge-category {
      background: #e2e8f0;
      color: #475569;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      display: inline-block;
    }
    .price-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .price-offer {
      font-weight: 700;
      color: var(--secondary-dark);
      font-size: 1.05rem;
    }
    .price-mrp {
      text-decoration: line-through;
      color: var(--text-muted);
      font-size: 0.82rem;
    }
    .badge-offer {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      display: inline-block;
      margin-top: 3px;
    }
    .badge-stock {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      user-select: none;
    }
    .stock-in { background: #dcfce7; color: #16a34a; }
    .stock-out { background: #fee2e2; color: #dc2626; }
    .stock-limited { background: #fef3c7; color: #d97706; }

    .actions-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .action-btn {
      width: 34px;
      height: 34px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border);
      background: #fff;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    .action-btn:hover { color: var(--primary); border-color: var(--primary); }
    .action-btn.btn-del:hover { color: #dc2626; border-color: #dc2626; background: #fef2f2; }

    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(11, 43, 92, 0.45);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 9999;
    }
    .modal-box {
      background: #fff;
      border-radius: var(--radius);
      width: 100%;
      max-width: 620px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      animation: modalSlide 0.25s ease-out;
    }
    @keyframes modalSlide {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-header h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
      color: var(--primary);
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--text-muted);
    }
    .modal-body {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }
    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background: #f8fafc;
    }

    .form-group {
      margin-bottom: 18px;
    }
    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 6px;
    }
    .form-control {
      width: 100%;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--border);
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-control:focus {
      border-color: var(--secondary);
    }
    textarea.form-control {
      min-height: 80px;
      resize: vertical;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .badge-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .badge-chip {
      background: #f1f5f9;
      border: 1px solid var(--border);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .badge-chip:hover {
      background: #e2e8f0;
      border-color: #cbd5e1;
    }
    .image-preview-box {
      width: 100%;
      height: 140px;
      border: 2px dashed var(--border);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-top: 8px;
      background: #f8fafc;
      position: relative;
    }
    .image-preview-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--primary);
      color: #fff;
      padding: 14px 20px;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 10000;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }
    .toast.success { background: #16a34a; }
    .toast.error { background: #dc2626; }
  </style>
</head>
<body>

  <header class="admin-nav">
    <a href="../admin.php" class="brand">
      <div class="brand-icon"><i class="fa-solid fa-notes-medical"></i></div>
      <div>
        <h1>Velava Medicals</h1>
        <span>Super Admin Portal</span>
      </div>
    </a>
    <div class="nav-actions">
      <a href="../index.html#store" target="_blank" class="btn btn-outline btn-sm">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> View Storefront
      </a>
      <?php if ($isLoggedIn): ?>
        <button class="btn btn-outline btn-sm" onclick="logoutAdmin()">
          <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      <?php endif; ?>
    </div>
  </header>

  <?php if (!$isLoggedIn): ?>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-icon">
        <i class="fa-solid fa-shield-halved"></i>
      </div>
      <h2>Super Admin Sign In</h2>
      <p>Enter the master security password to manage products, offers, and inventory.</p>

      <form id="adminLoginForm" onsubmit="handleLogin(event)">
        <div class="form-group" style="text-align: left;">
          <label>Admin Security Password</label>
          <div style="position: relative;">
            <input type="password" id="adminPassword" class="form-control" placeholder="••••••••••••" required>
            <i class="fa-solid fa-eye" id="togglePass" onclick="togglePassVisibility()" style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); cursor: pointer; color: var(--text-muted);"></i>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px;">
          <i class="fa-solid fa-lock-open"></i> Unlock Dashboard
        </button>
      </form>
    </div>
  </div>

  <?php else: ?>
  <div class="admin-container">
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-info">
          <span>Total Products</span>
          <h3 id="statTotal">--</h3>
        </div>
        <div class="stat-icon stat-blue"><i class="fa-solid fa-boxes-stacked"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span>Active Offers</span>
          <h3 id="statOffers">--</h3>
        </div>
        <div class="stat-icon stat-green"><i class="fa-solid fa-tags"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span>Out of Stock</span>
          <h3 id="statStock">--</h3>
        </div>
        <div class="stat-icon stat-amber"><i class="fa-solid fa-triangle-exclamation"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span>Categories</span>
          <h3 id="statCategories">--</h3>
        </div>
        <div class="stat-icon stat-purple"><i class="fa-solid fa-layer-group"></i></div>
      </div>
    </div>

    <div class="controls-bar">
      <div class="search-filter-group">
        <div class="search-input-wrap">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="searchInput" placeholder="Search medical products..." oninput="handleSearch(this.value)">
        </div>
        <select id="categoryFilter" class="filter-select" onchange="handleCategoryFilter(this.value)">
          <option value="all">All Categories</option>
          <option value="Medicines & Pharmacy">Medicines & Pharmacy</option>
          <option value="Medical & Surgical Devices">Medical & Surgical Devices</option>
          <option value="Nutrition & Wellness">Nutrition & Wellness</option>
          <option value="Personal & Mother Care">Personal & Mother Care</option>
          <option value="First Aid & Emergency">First Aid & Emergency</option>
        </select>
      </div>

      <button class="btn btn-primary" onclick="openAddModal()">
        <i class="fa-solid fa-plus"></i> Add New Product
      </button>
    </div>

    <div class="table-card">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th style="width: 70px;">Image</th>
              <th>Product Details</th>
              <th>Category</th>
              <th>Pricing & Offer</th>
              <th>Offer Badge</th>
              <th>Stock Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="productsTableBody">
            <tr>
              <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.5rem; margin-bottom: 8px;"></i><br>
                Loading medical catalog...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
  <?php endif; ?>

  <div class="modal-overlay" id="productModal">
    <div class="modal-box">
      <div class="modal-header">
        <h3 id="modalTitle">Add New Medical Product</h3>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="productForm" onsubmit="handleSaveProduct(event)">
          <input type="hidden" id="productId" value="">

          <div class="form-group">
            <label>Product Name *</label>
            <input type="text" id="prodName" class="form-control" placeholder="e.g. Omron Blood Pressure Monitor" required>
          </div>

          <div class="form-group">
            <label>Category *</label>
            <select id="prodCategory" class="form-control" required>
              <option value="Medical & Surgical Devices">Medical & Surgical Devices</option>
              <option value="Medicines & Pharmacy">Medicines & Pharmacy</option>
              <option value="Nutrition & Wellness">Nutrition & Wellness</option>
              <option value="Personal & Mother Care">Personal & Mother Care</option>
              <option value="First Aid & Emergency">First Aid & Emergency</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>MRP Price (₹) *</label>
              <input type="number" step="0.01" id="prodMrp" class="form-control" placeholder="Original price" oninput="autoCalculateDiscount()" required>
            </div>
            <div class="form-group">
              <label>Offer Price (₹) *</label>
              <input type="number" step="0.01" id="prodOffer" class="form-control" placeholder="Discounted price" oninput="autoCalculateDiscount()" required>
            </div>
          </div>

          <div class="form-group">
            <label>Offer Badge / Tag (Optional)</label>
            <input type="text" id="prodBadge" class="form-control" placeholder="e.g. 20% OFF, Best Seller, Hot Deal">
            <div class="badge-chips">
              <span class="badge-chip" onclick="setBadge('Best Seller')">⭐ Best Seller</span>
              <span class="badge-chip" onclick="setBadge('Special Offer')">🔥 Special Offer</span>
              <span class="badge-chip" onclick="setBadge('Flat 25% OFF')">🏷️ Flat 25% OFF</span>
              <span class="badge-chip" onclick="setBadge('Save ₹200')">💰 Save ₹200</span>
              <span class="badge-chip" onclick="setBadge('Must Have')">🚑 Must Have</span>
            </div>
          </div>

          <div class="form-group">
            <label>Stock Status</label>
            <select id="prodStock" class="form-control">
              <option value="in_stock">In Stock (Available)</option>
              <option value="limited">Limited Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div class="form-group">
            <label>Product Description / Key Features</label>
            <textarea id="prodDesc" class="form-control" placeholder="Key clinical features, brand name, usage details..."></textarea>
          </div>

          <div class="form-group">
            <label>Product Image</label>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <input type="text" id="prodImageUrl" class="form-control" placeholder="Enter image URL or choose file below" oninput="updateImagePreview(this.value)">
            </div>
            <div>
              <label class="btn btn-secondary btn-sm" style="cursor: pointer; display: inline-flex;">
                <i class="fa-solid fa-cloud-arrow-up"></i> Upload Image File from Device
                <input type="file" id="fileUpload" accept="image/*" style="display: none;" onchange="handleFileUpload(event)">
              </label>
              <span id="uploadStatusText" style="font-size: 0.8rem; margin-left: 8px; color: var(--text-muted);"></span>
            </div>
            <div class="image-preview-box" id="imagePreviewBox">
              <span style="color: var(--text-muted); font-size: 0.85rem;"><i class="fa-solid fa-image"></i> Image Preview will show here</span>
            </div>
          </div>

          <div class="modal-footer" style="padding: 16px 0 0 0; border: none; background: transparent;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary" id="btnSaveProd">
              <i class="fa-solid fa-floppy-disk"></i> Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="toast" id="toastBox">
    <i class="fa-solid fa-circle-check"></i>
    <span id="toastMsg">Operation completed</span>
  </div>

  <script>
    let allProducts = [];
    let currentFilter = 'all';
    let currentSearch = '';
    const API_BASE = '../api/';

    document.addEventListener('DOMContentLoaded', () => {
      <?php if ($isLoggedIn): ?>
        fetchProducts();
      <?php endif; ?>
    });

    function togglePassVisibility() {
      const p = document.getElementById('adminPassword');
      const icon = document.getElementById('togglePass');
      if (p.type === 'password') {
        p.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        p.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    }

    async function handleLogin(e) {
      e.preventDefault();
      const password = document.getElementById('adminPassword').value;
      const formData = new FormData();
      formData.append('action', 'login');
      formData.append('password', password);

      try {
        const res = await fetch(API_BASE + 'products.php', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.status === 'success') {
          showToast('Authentication Successful!', 'success');
          setTimeout(() => location.reload(), 600);
        } else {
          showToast(data.message || 'Invalid Password', 'error');
        }
      } catch (err) {
        showToast('Login error: ' + err.message, 'error');
      }
    }

    async function logoutAdmin() {
      const formData = new FormData();
      formData.append('action', 'logout');
      await fetch(API_BASE + 'products.php', { method: 'POST', body: formData });
      location.reload();
    }

    async function fetchProducts() {
      try {
        const res = await fetch(API_BASE + 'products.php?admin=1');
        const data = await res.json();

        if (data.status === 'success') {
          allProducts = data.products || [];
          if (data.stats) {
            document.getElementById('statTotal').innerText = data.stats.total_products;
            document.getElementById('statOffers').innerText = data.stats.active_offers;
            document.getElementById('statStock').innerText = data.stats.out_of_stock;
            document.getElementById('statCategories').innerText = data.stats.categories_count;
          }
          renderProductsTable();
        } else {
          showToast('Failed to load products', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Failed to connect to API', 'error');
      }
    }

    function renderProductsTable() {
      const tbody = document.getElementById('productsTableBody');
      if (!tbody) return;

      const filtered = allProducts.filter(p => {
        const matchesCategory = currentFilter === 'all' || p.category === currentFilter;
        const matchesSearch = !currentSearch || 
          p.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
          p.description.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
              <i class="fa-solid fa-box-open" style="font-size: 2rem; margin-bottom: 8px;"></i><br>
              No products found matching your filter criteria.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(p => {
        const fallbackImg = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300';
        const img = p.image_url ? (p.image_url.startsWith('http') ? p.image_url : '../' + p.image_url) : fallbackImg;
        const mrp = parseFloat(p.mrp_price || 0).toFixed(2);
        const offer = parseFloat(p.offer_price || 0).toFixed(2);
        const hasOffer = parseFloat(offer) < parseFloat(mrp);

        let stockBadge = '<span class="badge-stock stock-in" onclick="toggleStock(' + p.id + ', \'out_of_stock\')"><i class="fa-solid fa-circle-check"></i> In Stock</span>';
        if (p.stock_status === 'out_of_stock') {
          stockBadge = '<span class="badge-stock stock-out" onclick="toggleStock(' + p.id + ', \'in_stock\')"><i class="fa-solid fa-circle-xmark"></i> Out of Stock</span>';
        } else if (p.stock_status === 'limited') {
          stockBadge = '<span class="badge-stock stock-limited" onclick="toggleStock(' + p.id + ', \'out_of_stock\')"><i class="fa-solid fa-clock"></i> Limited</span>';
        }

        return `
          <tr>
            <td>
              <img src="${escapeHtml(img)}" class="product-thumb" alt="${escapeHtml(p.name)}" onerror="this.src='${fallbackImg}'">
            </td>
            <td class="product-name-cell">
              <h4>${escapeHtml(p.name)}</h4>
              <span>ID: #${p.id}</span>
            </td>
            <td>
              <span class="badge-category">${escapeHtml(p.category)}</span>
            </td>
            <td>
              <div class="price-wrap">
                <span class="price-offer">₹${offer}</span>
                ${hasOffer ? `<span class="price-mrp">MRP ₹${mrp}</span>` : ''}
              </div>
            </td>
            <td>
              ${p.badge ? `<span class="badge-offer">${escapeHtml(p.badge)}</span>` : '<span style="color:var(--text-muted);font-size:0.8rem;">-</span>'}
            </td>
            <td>${stockBadge}</td>
            <td style="text-align: right;">
              <div class="actions-cell" style="justify-content: flex-end;">
                <button class="action-btn" title="Edit Product" onclick="openEditModal(${p.id})">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="action-btn btn-del" title="Delete Product" onclick="deleteProduct(${p.id})">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    function handleCategoryFilter(val) {
      currentFilter = val;
      renderProductsTable();
    }

    function handleSearch(val) {
      currentSearch = val;
      renderProductsTable();
    }

    function openAddModal() {
      document.getElementById('modalTitle').innerText = 'Add New Medical Product';
      document.getElementById('productId').value = '';
      document.getElementById('prodName').value = '';
      document.getElementById('prodCategory').value = 'Medical & Surgical Devices';
      document.getElementById('prodMrp').value = '';
      document.getElementById('prodOffer').value = '';
      document.getElementById('prodBadge').value = '';
      document.getElementById('prodStock').value = 'in_stock';
      document.getElementById('prodDesc').value = '';
      document.getElementById('prodImageUrl').value = '';
      document.getElementById('uploadStatusText').innerText = '';
      updateImagePreview('');
      document.getElementById('productModal').style.display = 'flex';
    }

    function openEditModal(id) {
      const p = allProducts.find(item => item.id == id);
      if (!p) return;

      document.getElementById('modalTitle').innerText = 'Edit Medical Product';
      document.getElementById('productId').value = p.id;
      document.getElementById('prodName').value = p.name;
      document.getElementById('prodCategory').value = p.category;
      document.getElementById('prodMrp').value = p.mrp_price;
      document.getElementById('prodOffer').value = p.offer_price;
      document.getElementById('prodBadge').value = p.badge || '';
      document.getElementById('prodStock').value = p.stock_status || 'in_stock';
      document.getElementById('prodDesc').value = p.description || '';
      document.getElementById('prodImageUrl').value = p.image_url || '';
      document.getElementById('uploadStatusText').innerText = '';
      updateImagePreview(p.image_url || '');
      document.getElementById('productModal').style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('productModal').style.display = 'none';
    }

    function setBadge(val) {
      document.getElementById('prodBadge').value = val;
    }

    function autoCalculateDiscount() {
      const mrp = parseFloat(document.getElementById('prodMrp').value || 0);
      const offer = parseFloat(document.getElementById('prodOffer').value || 0);
      const badgeInput = document.getElementById('prodBadge');

      if (mrp > 0 && offer > 0 && offer < mrp && !badgeInput.value) {
        const discount = Math.round(((mrp - offer) / mrp) * 100);
        badgeInput.value = `${discount}% OFF`;
      }
    }

    function updateImagePreview(url) {
      const box = document.getElementById('imagePreviewBox');
      if (url) {
        const fullUrl = url.startsWith('http') ? url : '../' + url;
        box.innerHTML = `<img src="${fullUrl}" alt="Preview" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'">`;
      } else {
        box.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;"><i class="fa-solid fa-image"></i> Image Preview will show here</span>`;
      }
    }

    async function handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      const status = document.getElementById('uploadStatusText');
      status.innerText = 'Uploading image...';

      const formData = new FormData();
      formData.append('product_image', file);

      try {
        const res = await fetch(API_BASE + 'upload.php', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.status === 'success') {
          document.getElementById('prodImageUrl').value = data.url;
          updateImagePreview(data.url);
          status.innerText = '✓ Uploaded successfully!';
          showToast('Image uploaded', 'success');
        } else {
          status.innerText = 'Upload failed';
          showToast(data.message, 'error');
        }
      } catch (err) {
        status.innerText = 'Upload error';
        showToast(err.message, 'error');
      }
    }

    async function handleSaveProduct(e) {
      e.preventDefault();
      const id = document.getElementById('productId').value;
      const isEdit = Boolean(id);

      const formData = new FormData();
      formData.append('action', isEdit ? 'edit' : 'add');
      if (isEdit) formData.append('id', id);
      formData.append('name', document.getElementById('prodName').value);
      formData.append('category', document.getElementById('prodCategory').value);
      formData.append('mrp_price', document.getElementById('prodMrp').value);
      formData.append('offer_price', document.getElementById('prodOffer').value);
      formData.append('badge', document.getElementById('prodBadge').value);
      formData.append('stock_status', document.getElementById('prodStock').value);
      formData.append('description', document.getElementById('prodDesc').value);
      formData.append('image_url', document.getElementById('prodImageUrl').value);

      try {
        const res = await fetch(API_BASE + 'products.php', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.status === 'success') {
          showToast(data.message, 'success');
          closeModal();
          fetchProducts();
        } else {
          showToast(data.message || 'Failed to save product', 'error');
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    }

    async function toggleStock(id, newStatus) {
      const formData = new FormData();
      formData.append('action', 'toggle_stock');
      formData.append('id', id);
      formData.append('stock_status', newStatus);

      try {
        const res = await fetch(API_BASE + 'products.php', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.status === 'success') {
          showToast('Stock status updated', 'success');
          fetchProducts();
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    }

    async function deleteProduct(id) {
      if (!confirm('Are you sure you want to delete this product?')) return;

      const formData = new FormData();
      formData.append('action', 'delete');
      formData.append('id', id);

      try {
        const res = await fetch(API_BASE + 'products.php', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.status === 'success') {
          showToast(data.message, 'success');
          fetchProducts();
        } else {
          showToast(data.message || 'Delete failed', 'error');
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    }

    function showToast(msg, type = 'success') {
      const toast = document.getElementById('toastBox');
      const text = document.getElementById('toastMsg');
      text.innerText = msg;
      toast.className = 'toast show ' + type;
      setTimeout(() => {
        toast.className = 'toast ' + type;
      }, 3000);
    }

    function escapeHtml(text) {
      if (!text) return '';
      return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
  </script>
</body>
</html>
