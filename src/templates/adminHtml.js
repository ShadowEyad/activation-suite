export const ADMIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin - Product Activation Suite</title>
  <!-- Google Fonts: Outfit -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #070913;
      --card-bg: rgba(13, 17, 34, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --text: #f3f4f6;
      --text-muted: #8a93a6;
      
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --primary-glow: rgba(99, 102, 241, 0.15);
      
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.15);
      --error: #f43f5e;
      --error-glow: rgba(244, 63, 94, 0.15);
      --warning: #f59e0b;
      --warning-glow: rgba(245, 158, 11, 0.15);
      
      --font: 'Outfit', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --sidebar-width: 260px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font);
      background-color: var(--bg);
      color: var(--text);
      overflow-x: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Scrollbars */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.02);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.2);
    }

    /* Background glow decorations */
    .glow-bg {
      position: fixed;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(0,0,0,0) 70%);
      top: -200px;
      right: -200px;
      z-index: -1;
      pointer-events: none;
    }
    .glow-bg-2 {
      position: fixed;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, rgba(0,0,0,0) 70%);
      bottom: -100px;
      left: -100px;
      z-index: -1;
      pointer-events: none;
    }

    /* Loader utility */
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.2);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      display: inline-block;
      vertical-align: middle;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* TOASTS */
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .toast {
      background: rgba(17, 24, 39, 0.95);
      border: 1px solid var(--card-border);
      padding: 14px 20px;
      border-radius: 10px;
      font-size: 14px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      gap: 12px;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(10px);
    }
    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }
    .toast-success { border-left: 3px solid var(--success); }
    .toast-error { border-left: 3px solid var(--error); }
    .toast-info { border-left: 3px solid var(--primary); }

    /* AUTH SCREEN */
    #auth-screen {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .auth-card {
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      text-align: center;
    }
    .auth-logo {
      width: 52px;
      height: 52px;
      background: linear-gradient(135deg, var(--primary), var(--primary-hover));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 0 20px var(--primary-glow);
    }
    .auth-logo svg {
      width: 26px;
      height: 26px;
      stroke: #fff;
      fill: none;
      stroke-width: 2.5;
    }
    .auth-title {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .auth-sub {
      color: var(--text-muted);
      font-size: 14px;
      margin-bottom: 32px;
    }
    .form-group {
      margin-bottom: 20px;
      text-align: left;
    }
    .form-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .form-input {
      width: 100%;
      background: rgba(255,255,255,0.03);
      border: 1.5px solid var(--card-border);
      border-radius: 8px;
      padding: 12px 16px;
      color: #fff;
      font-family: inherit;
      font-size: 14px;
      outline: none;
      transition: all 0.2s;
    }
    .form-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-glow);
      background: rgba(255,255,255,0.05);
    }
    .form-input::placeholder {
      color: #555866;
    }
    .btn {
      width: 100%;
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .btn:hover:not(:disabled) {
      background: var(--primary-hover);
      transform: translateY(-1px);
    }
    .btn:active:not(:disabled) {
      transform: translateY(0);
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .auth-error {
      background: var(--error-glow);
      border: 1px solid var(--error);
      color: #ffa4b4;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 20px;
      display: none;
      text-align: left;
    }

    /* MAIN APP LAYOUT */
    #main-app {
      display: none; /* Shown after auth */
      flex: 1;
      height: 100vh;
      overflow: hidden;
    }
    .sidebar {
      width: var(--sidebar-width);
      background: rgba(10, 14, 28, 0.95);
      border-right: 1px solid var(--card-border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .sidebar-head {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--card-border);
    }
    .sidebar-logo {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, var(--primary), var(--primary-hover));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sidebar-logo svg {
      width: 16px;
      height: 16px;
      stroke: #fff;
      fill: none;
      stroke-width: 2;
    }
    .sidebar-title {
      font-weight: 700;
      font-size: 15px;
      letter-spacing: -0.2px;
    }
    .sidebar-sub {
      font-size: 10px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .sidebar-menu {
      padding: 20px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      overflow-y: auto;
    }
    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 8px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
    }
    .menu-item svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      opacity: 0.7;
    }
    .menu-item:hover {
      color: #fff;
      background: rgba(255,255,255,0.03);
    }
    .menu-item.active {
      color: #fff;
      background: var(--primary-glow);
      border-color: rgba(99,102,241,0.15);
    }
    .menu-item.active svg {
      stroke: var(--primary);
      opacity: 1;
    }
    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid var(--card-border);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--text-muted);
      padding: 8px 12px;
      background: rgba(255,255,255,0.02);
      border-radius: 6px;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-muted);
      display: inline-block;
    }
    .status-dot.active {
      background: var(--success);
      box-shadow: 0 0 8px var(--success);
      animation: pulse 2s infinite;
    }
    .status-dot.warning {
      background: var(--warning);
      box-shadow: 0 0 8px var(--warning);
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }
    .btn-logout {
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 8px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      color: var(--error);
      border-color: rgba(244,63,94,0.3);
      background: var(--error-glow);
    }

    /* CONTENT LAYOUT */
    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }
    .content-header {
      padding: 24px 32px;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .page-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.3px;
    }
    .page-sub {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .content-body {
      flex: 1;
      padding: 32px;
      overflow-y: auto;
    }

    /* PAGES */
    .tab-content {
      display: none;
      animation: fadeIn 0.3s ease-out;
    }
    .tab-content.active {
      display: block;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* INVENTORY REGISTRY */
    .registry-toolbar {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }
    .search-input-wrapper {
      position: relative;
      flex: 1;
      max-width: 320px;
    }
    .search-input-wrapper svg {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      stroke: var(--text-muted);
      fill: none;
      stroke-width: 2;
    }
    .search-input {
      width: 100%;
      padding-left: 40px;
    }
    .toolbar-actions {
      display: flex;
      gap: 12px;
    }
    .btn-secondary {
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--card-border);
      color: var(--text);
    }
    .btn-secondary:hover:not(:disabled) {
      background: rgba(255,255,255,0.06);
    }

    /* Card styling */
    .glass-card {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-title svg {
      width: 18px;
      height: 18px;
      stroke: var(--primary);
      fill: none;
      stroke-width: 2;
    }

    /* GRID FOR REGISTERING */
    .add-product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      align-items: flex-end;
    }

    /* TABLE */
    .table-container {
      width: 100%;
      overflow-x: auto;
      border: 1px solid var(--card-border);
      border-radius: 10px;
      background: rgba(13, 17, 34, 0.4);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    th {
      background: rgba(255,255,255,0.02);
      padding: 14px 20px;
      font-weight: 600;
      color: var(--text-muted);
      border-bottom: 1px solid var(--card-border);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 16px 20px;
      border-bottom: 1px solid var(--card-border);
      color: var(--text);
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: rgba(255,255,255,0.01);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: capitalize;
    }
    .badge-unactivated {
      background: var(--warning-glow);
      color: #ffe0a3;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .badge-active {
      background: var(--success-glow);
      color: #a7f3d0;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .badge-expired {
      background: var(--error-glow);
      color: #fca5a5;
      border: 1px solid rgba(244, 63, 94, 0.3);
    }
    .copyable {
      font-family: var(--font-mono);
      font-size: 13px;
      background: rgba(255,255,255,0.03);
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--card-border);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .copyable:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.2);
    }
    .copyable svg {
      width: 12px;
      height: 12px;
      stroke: var(--text-muted);
      fill: none;
      stroke-width: 2;
    }
    .btn-icon {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .btn-icon:hover {
      color: var(--error);
      background: var(--error-glow);
    }
    .btn-icon svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
    }
    .owner-info {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.4;
    }
    .owner-name {
      color: var(--text);
      font-weight: 500;
    }

    /* BULK IMPORT */
    .textarea-wrapper {
      margin-bottom: 20px;
    }
    textarea {
      width: 100%;
      height: 200px;
      background: rgba(255,255,255,0.02);
      border: 1.5px solid var(--card-border);
      border-radius: 10px;
      padding: 16px;
      color: #fff;
      font-family: var(--font-mono);
      font-size: 13px;
      outline: none;
      resize: vertical;
      transition: all 0.2s;
    }
    textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-glow);
    }
    .help-box {
      background: rgba(255,255,255,0.02);
      border-left: 3px solid var(--primary);
      padding: 16px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 24px;
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
    }
    .help-box code {
      font-family: var(--font-mono);
      color: #fff;
      background: rgba(255,255,255,0.05);
      padding: 2px 4px;
      border-radius: 4px;
    }

    /* INTEGRATIONS & SETUP */
    .integrations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
    }
    .setup-command {
      font-family: var(--font-mono);
      background: #090c15;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid var(--card-border);
      font-size: 13px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .setup-command code {
      color: #a5b4fc;
    }
    .config-indicator {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: rgba(255,255,255,0.02);
      border-radius: 8px;
      font-size: 13px;
      border: 1px solid var(--card-border);
    }

    /* LIVE TERMINAL FEED */
    .terminal-container {
      background: #03060f;
      border: 1px solid var(--card-border);
      border-radius: 12px;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
      display: flex;
      flex-direction: column;
      height: calc(100vh - 200px);
    }
    .terminal-header {
      background: rgba(255,255,255,0.01);
      padding: 12px 20px;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .terminal-dots {
      display: flex;
      gap: 6px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .dot-red { background: #ff5f56; }
    .dot-yellow { background: #ffbd2e; }
    .dot-green { background: #27c93f; }
    .terminal-body {
      flex: 1;
      padding: 20px;
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.6;
      overflow-y: auto;
      color: #818cf8; /* Light Indigo default text */
    }
    .log-line {
      margin-bottom: 6px;
      display: flex;
      gap: 12px;
      animation: logSlide 0.2s ease-out;
    }
    @keyframes logSlide {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .log-time {
      color: #4b5563;
      user-select: none;
      flex-shrink: 0;
    }
    .log-tag {
      font-weight: 700;
      flex-shrink: 0;
      padding: 0 6px;
      border-radius: 4px;
      text-transform: uppercase;
      font-size: 11px;
    }
    .log-tag-info { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }
    .log-tag-lookup { background: rgba(139, 92, 246, 0.1); color: #a78bfa; }
    .log-tag-otp { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
    .log-tag-activation { background: rgba(16, 185, 129, 0.1); color: #34d399; }
    .log-tag-webhook { background: rgba(6, 182, 212, 0.1); color: #22d3ee; }
    .log-tag-delete { background: rgba(239, 68, 68, 0.1); color: #f87171; }
    .log-msg {
      color: #e5e7eb;
      word-break: break-all;
    }

    @media (max-width: 900px) {
      body {
        flex-direction: column;
      }
      #main-app {
        flex-direction: column;
        height: auto;
        overflow: visible;
      }
      .sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--card-border);
      }
      .content-area {
        height: calc(100vh - 180px);
      }
    }
  </style>
</head>
<body>
<!--email_off-->
  <div class="glow-bg"></div>
  <div class="glow-bg-2"></div>

  <!-- AUTHENTICATION CONTAINER -->
  <div id="auth-screen">
    <div class="auth-card">
      <div class="auth-logo">
        <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
      </div>
      <div class="auth-title">Admin Portal</div>
      <div class="auth-sub">Product License Management</div>
      <div class="auth-error" id="auth-err-msg">Invalid administrator credentials.</div>
      <div class="form-group">
        <label class="form-label" for="auth-email">Admin Email</label>
        <input class="form-input" id="auth-email" type="email" placeholder="admin@yourdomain.com" value="admin@yourdomain.com">
      </div>
      <div class="form-group">
        <label class="form-label" for="auth-pass">Admin Password</label>
        <input class="form-input" id="auth-pass" type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022">
      </div>
      <button class="btn" id="btn-login">
        <span>Authenticate Portal</span>
      </button>
    </div>
  </div>

  <!-- MAIN APP CONTAINER -->
  <div id="main-app">
    <div class="sidebar">
      <div class="sidebar-head">
        <div class="sidebar-logo">
          <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
        </div>
        <div>
          <div class="sidebar-title" id="side-title">Admin</div>
          <div class="sidebar-sub">Admin Engine</div>
        </div>
      </div>
      <div class="sidebar-menu">
        <div class="menu-item active" id="tab-btn-registry">
          <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <span>Registry List</span>
        </div>
        <div class="menu-item" id="tab-btn-bulk">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span>Bulk Import</span>
        </div>
        <div class="menu-item" id="tab-btn-integrations">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span>Integrations Setup</span>
        </div>
        <div class="menu-item" id="tab-btn-admins">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Administrators</span>
        </div>
        <div class="menu-item" id="tab-btn-customization">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="14.5" r="1.5" fill="currentColor"/></svg>
          <span>Page Customization</span>
        </div>
        <div class="menu-item" id="tab-btn-live">
          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span>Live Activity Feed</span>
        </div>
      </div>
      <div class="sidebar-footer">
        <div class="status-badge">
          <span class="status-dot warning" id="db-status-dot"></span>
          <span id="db-status-text">Database Loading</span>
        </div>
        <div class="status-badge">
          <span class="status-dot" id="ws-status-dot"></span>
          <span id="ws-status-text">Websocket Offline</span>
        </div>
        <button class="btn-logout" id="btn-logout">
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Disconnect Portal</span>
        </button>
      </div>
    </div>

    <!-- MAIN VIEW AREA -->
    <div class="content-area">
      <!-- REGISTRY TAB -->
      <div class="tab-content active" id="tab-registry">
        <div class="content-header">
          <div>
            <h1 class="page-title">Registry List</h1>
            <p class="page-sub">Create, view, and delete product registry keys.</p>
          </div>
        </div>
        <div class="content-body">
          <div class="glass-card">
            <h3 class="card-title">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              Register Single Serial Number
            </h3>
            <div class="add-product-grid">
              <div class="form-group" style="margin-bottom:0">
                <label class="form-label">Serial Number</label>
                <input class="form-input" id="add-serial" placeholder="e.g. SN-NEXUS-777">
              </div>
              <div class="form-group" style="margin-bottom:0">
                <label class="form-label">Product Name</label>
                <input class="form-input" id="add-name" placeholder="e.g. Premium Hub Plugin">
              </div>
              <div class="form-group" style="margin-bottom:0">
                <label class="form-label">Category</label>
                <input class="form-input" id="add-cat" placeholder="e.g. Software">
              </div>
              <div class="form-group" style="margin-bottom:0">
                <label class="form-label">License Type</label>
                <select class="form-input" id="add-use">
                  <option value="one-time">One-Time Activation</option>
                  <option value="unlimited">Unlimited Activations</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom:0">
                <label class="form-label">Expiry Date (Optional)</label>
                <input class="form-input" type="date" id="add-expiry">
              </div>
              <button class="btn" id="btn-add-product">Register Serial</button>
            </div>
          </div>

          <div class="registry-toolbar">
            <div class="search-input-wrapper">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input class="form-input search-input" id="registry-search" placeholder="Search registry...">
            </div>
            <div class="toolbar-actions">
              <button class="btn btn-secondary" id="btn-refresh-products">
                <span>Reload List</span>
              </button>
              <button class="btn btn-secondary" style="border-color: rgba(244,63,94,0.3); color: #ffa4b4" id="btn-reset-db">
                <span>Clear Registry</span>
              </button>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Serial Number</th>
                  <th>Status</th>
                  <th>License Code</th>
                  <th>Activation Details</th>
                  <th style="width: 60px; text-align: center">Remove</th>
                </tr>
              </thead>
              <tbody id="products-tbody">
                <!-- Products dynamically inserted -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- BULK IMPORT TAB -->
      <div class="tab-content" id="tab-bulk">
        <div class="content-header">
          <div>
            <h1 class="page-title">Bulk Import</h1>
            <p class="page-sub">Provision dozens of registration keys at once.</p>
          </div>
        </div>
        <div class="content-body">
          <div class="help-box">
            <strong>Format Instructions:</strong> Paste lines of CSV formatted as <code>serialNumber, productName, category, useType</code>.
            <br>
            Example:
            <br>
            <code>SN-VOLT-001, Volt Core Extractor, Electronics, one-time</code>
            <br>
            <code>SN-VOLT-002, Volt Core Extractor, Electronics, unlimited</code>
            <br>
            * <code>useType</code> defaults to <code>one-time</code> if not specified.
          </div>
          <div class="glass-card">
            <h3 class="card-title">Paste Serial Registry CSV Data</h3>
            <div class="textarea-wrapper">
              <textarea id="bulk-data" placeholder="SN-MOCK-001, Mock Product Alpha, Test, one-time
SN-MOCK-002, Mock Product Beta, Test, unlimited"></textarea>
            </div>
            <button class="btn" id="btn-import-bulk">Process Bulk Provision</button>
          </div>
          <div id="bulk-result" style="display:none;" class="glass-card">
            <h3 class="card-title">Bulk Result Summary</h3>
            <div id="bulk-summary-txt" style="margin-bottom:12px; font-weight:500;"></div>
            <div id="bulk-result-details" style="font-size:13px; color:var(--text-muted); line-height:1.5;"></div>
          </div>
        </div>
      </div>

      <!-- INTEGRATIONS & SETUP TAB -->
      <div class="tab-content" id="tab-integrations">
        <div class="content-header">
          <div>
            <h1 class="page-title">Integrations & Setup</h1>
            <p class="page-sub">Configure and view environmental bindings and branding.</p>
          </div>
        </div>
        <div class="content-body">
          <div class="integrations-grid">
            <div class="glass-card" style="grid-column: span 2;">
              <h3 class="card-title">
                <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Portal Settings & Integrations
              </h3>
              <div class="add-product-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Portal Brand Name</label>
                  <input class="form-input" id="cfg-portal-name" placeholder="e.g. Admin">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Portal Brand Subtitle</label>
                  <input class="form-input" id="cfg-portal-sub" placeholder="e.g. Activation Suite">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Support Email (Sender)</label>
                  <input class="form-input" id="cfg-support-email" placeholder="support@yourdomain.com">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Support Phone</label>
                  <input class="form-input" id="cfg-support-phone" placeholder="+1 (555) 000-0000">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Twilio Account SID</label>
                  <input class="form-input" id="cfg-twilio-sid" placeholder="AC...">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Twilio Auth Token</label>
                  <input class="form-input" type="password" id="cfg-twilio-token" placeholder="Enter password to change">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Twilio From Phone Number</label>
                  <input class="form-input" id="cfg-twilio-from" placeholder="e.g. +15017122661">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Resend API Key</label>
                  <input class="form-input" type="password" id="cfg-resend-key" placeholder="re_...">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">Shopify Webhook Secret Key</label>
                  <input class="form-input" type="password" id="cfg-shopify-secret" placeholder="Enter secret to change">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label">CORS Whitelisted Origins</label>
                  <input class="form-input" id="cfg-cors" placeholder="* (comma-separated)">
                </div>
              </div>
              <button class="btn" style="margin-top:24px; max-width: 200px;" id="btn-save-config">Save Settings</button>
            </div>

            <div class="glass-card" style="display:flex; flex-direction:column; gap: 16px;">
              <h3 class="card-title">Integration Status Badges</h3>
              <div class="form-group" style="margin-bottom:0">
                <label class="form-label">Supabase URL Connection</label>
                <div class="config-indicator" id="cfg-sb-url">Checking...</div>
              </div>
              <div class="form-group" style="margin-bottom:0">
                <label class="form-label">Twilio SMS Integrator</label>
                <div class="config-indicator" id="cfg-twilio">Checking...</div>
              </div>
              <div class="form-group" style="margin-bottom:0">
                <label class="form-label">Resend Email Integrator</label>
                <div class="config-indicator" id="cfg-resend">Checking...</div>
              </div>
              <div class="form-group" style="margin-bottom:0">
                <label class="form-label">Shopify Webhook Secret</label>
                <div class="config-indicator" id="cfg-shopify">Checking...</div>
              </div>
            </div>
          </div>

          <div class="glass-card" style="margin-top:24px">
            <h3 class="card-title">\u{1F6CD}\uFE0F\x8D\xEF\xB8\x8F Shopify Order Paid Webhook Configuration</h3>
            <p style="font-size:13px; color:var(--text-muted); line-height:1.6; margin-bottom:16px;">
              To auto-generate serial numbers for products sold in your Shopify store:
              <br>
              1. Go to your <strong>Shopify Admin</strong> &rarr; <strong>Settings</strong> &rarr; <strong>Notifications</strong> &rarr; <strong>Webhooks</strong>.
              <br>
              2. Click <strong>Create webhook</strong>.
              <br>
              3. Set Event to <code>Order payment</code> (or <code>orders/paid</code>).
              <br>
              4. Set Format to <code>JSON</code>.
              <br>
              5. Set URL to: <code id="webhook-target-url">https://your-worker-domain/webhooks/shopify/orders-paid</code>.
              <br>
              6. Save, copy the <strong>Shopify Webhook Secret Key</strong>, and paste it in the form above.
            </p>
          </div>
        </div>
      </div>

      <!-- PAGE CUSTOMIZATION TAB -->
      <div class="tab-content" id="tab-customization">
        <div class="content-header">
          <div>
            <h1 class="page-title">Page Customization</h1>
            <p class="page-sub">Brand, logo, and color settings for your Customer Activation Portal.</p>
          </div>
        </div>
        <div class="content-body">
          <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap: 24px; max-width: 1060px;">

            <!-- Left Column: Branding + Logo + Colors -->
            <div style="display:flex; flex-direction:column; gap:20px;">

              <!-- Branding Card -->
              <div class="glass-card">
                <h3 class="card-title">Portal Branding</h3>

                <div class="form-group">
                  <label class="form-label">Brand Name</label>
                  <input class="form-input" id="cust-portal-name" placeholder="e.g. Admin">
                </div>

                <div class="form-group">
                  <label class="form-label">Brand Subtitle</label>
                  <input class="form-input" id="cust-portal-sub" placeholder="e.g. Activation Suite">
                </div>

                <div class="form-group">
                  <label class="form-label">Support Email</label>
                  <input class="form-input" id="cust-support-email" placeholder="e.g. support@yourcompany.com">
                </div>

                <div class="form-group">
                  <label class="form-label">Support Phone</label>
                  <input class="form-input" id="cust-support-phone" placeholder="e.g. +1 (800) 000-0000">
                </div>
              </div>

              <!-- Logo Card -->
              <div class="glass-card">
                <h3 class="card-title">Personal Logo</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">Paste a direct URL to your logo image (PNG, SVG, WEBP). It will replace the default key icon in the portal header.</p>

                <div class="form-group">
                  <label class="form-label">Logo Image URL</label>
                  <input class="form-input" id="cust-logo-url" placeholder="https://cdn.yourdomain.com/logo.png">
                </div>

                <!-- Logo preview strip -->
                <div id="logo-preview-strip" style="display:none; align-items:center; gap:12px; margin-top:8px; padding:10px 14px; background:rgba(255,255,255,0.04); border:1px solid var(--card-border); border-radius:8px;">
                  <img id="logo-preview-img" src="" alt="Logo preview" style="height:36px; max-width:120px; object-fit:contain; border-radius:4px;">
                  <span style="font-size:11px; color:var(--text-muted);">Logo preview</span>
                  <button onclick="document.getElementById('cust-logo-url').value=''; Admin.updatePreview();" style="margin-left:auto; background:transparent; border:1px solid rgba(244,63,94,0.35); color:var(--error); border-radius:5px; padding:3px 10px; font-size:11px; cursor:pointer;">\u2715 Clear</button>
                </div>
              </div>

              <!-- Colors Card -->
              <div class="glass-card">
                <h3 class="card-title">Element Colors</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Pick or type a hex code for each portal element. The live preview updates instantly.</p>

                <!-- Color row helper style (inline) -->
                <div style="display:flex; flex-direction:column; gap:14px;">

                  <!-- Accent / Button Color -->
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Accent &amp; Button Color</label>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <input type="color" id="cust-color-primary-picker" value="#4f46e5" title="Pick accent color"
                        style="width:38px; height:36px; border:1px solid var(--card-border); border-radius:6px; background:none; padding:2px; cursor:pointer; flex-shrink:0;">
                      <input class="form-input" id="cust-color-primary" placeholder="#4f46e5" maxlength="7"
                        style="font-family:monospace; letter-spacing:0.05em;">
                    </div>
                  </div>

                  <!-- Portal Background -->
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Portal Background</label>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <input type="color" id="cust-color-bg-picker" value="#f4f4f7" title="Pick background color"
                        style="width:38px; height:36px; border:1px solid var(--card-border); border-radius:6px; background:none; padding:2px; cursor:pointer; flex-shrink:0;">
                      <input class="form-input" id="cust-color-bg" placeholder="#f4f4f7" maxlength="7"
                        style="font-family:monospace; letter-spacing:0.05em;">
                    </div>
                  </div>

                  <!-- Text Color -->
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Primary Text Color</label>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <input type="color" id="cust-color-text-picker" value="#111827" title="Pick text color"
                        style="width:38px; height:36px; border:1px solid var(--card-border); border-radius:6px; background:none; padding:2px; cursor:pointer; flex-shrink:0;">
                      <input class="form-input" id="cust-color-text" placeholder="#111827" maxlength="7"
                        style="font-family:monospace; letter-spacing:0.05em;">
                    </div>
                  </div>

                  <!-- Card Background -->
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Card Background</label>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <input type="color" id="cust-color-card-picker" value="#ffffff" title="Pick card background"
                        style="width:38px; height:36px; border:1px solid var(--card-border); border-radius:6px; background:none; padding:2px; cursor:pointer; flex-shrink:0;">
                      <input class="form-input" id="cust-color-card" placeholder="#ffffff" maxlength="7"
                        style="font-family:monospace; letter-spacing:0.05em;">
                    </div>
                  </div>

                  <!-- Card Border -->
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Card Border Color</label>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <input type="color" id="cust-color-border-picker" value="#e5e7eb" title="Pick card border color"
                        style="width:38px; height:36px; border:1px solid var(--card-border); border-radius:6px; background:none; padding:2px; cursor:pointer; flex-shrink:0;">
                      <input class="form-input" id="cust-color-border" placeholder="#e5e7eb" maxlength="7"
                        style="font-family:monospace; letter-spacing:0.05em;">
                    </div>
                  </div>

                </div>

                <!-- Reset colors link -->
                <div style="margin-top:14px;">
                  <button id="btn-reset-colors" style="background:transparent; border:none; color:var(--text-muted); font-size:11px; cursor:pointer; text-decoration:underline; padding:0;">\u21A9 Reset to defaults</button>
                </div>
              </div>

              <button class="btn" id="btn-save-customization" style="width:100%;">\u{1F4BE} Save Customizations</button>
            </div>

            <!-- Right Column: Live Preview -->
            <div class="glass-card" style="display:flex; flex-direction:column;">
              <h3 class="card-title">Live Portal Preview</h3>
              <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Changes reflect here as you type.</p>

              <!-- Miniature Portal Widget Container -->
              <div id="preview-widget-box" style="border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:20px; background:#f4f4f7; color:#1a1a1e; font-family:sans-serif; flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; transition:background 0.25s;">

                <!-- Header -->
                <div style="width:100%; max-width:320px; display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #e5e7eb;">
                  <div id="preview-icon-bg" style="width:30px; height:30px; border-radius:6px; background:#4f46e5; display:flex; align-items:center; justify-content:center; color:white; font-size:14px; overflow:hidden; flex-shrink:0;">\u{1F511}</div>
                  <div style="text-align:left;">
                    <div id="preview-brand-title" style="font-size:12px; font-weight:800; color:#111827;">Admin</div>
                    <div id="preview-brand-sub" style="font-size:9px; color:#6b7280; font-weight:500;">Activation Suite</div>
                  </div>
                </div>

                <!-- Main Body Card -->
                <div id="preview-card" style="width:100%; max-width:320px; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; padding:16px; box-shadow:0 2px 10px rgba(0,0,0,0.03); transition:background 0.25s, border-color 0.25s;">
                  <div id="preview-section-title" style="font-size:13px; font-weight:700; color:#111827; margin-bottom:12px; text-align:left;">Activate your device</div>

                  <div style="text-align:left; margin-bottom:8px;">
                    <label style="font-size:9px; font-weight:700; color:#6b7280; text-transform:uppercase;">Full Name</label>
                    <input style="width:100%; padding:6px 10px; border:1px solid #e5e7eb; border-radius:6px; font-size:11px; margin-top:2px; background:#fafafa;" value="Alexander Thorne" disabled>
                  </div>

                  <div style="text-align:left; margin-bottom:12px;">
                    <label style="font-size:9px; font-weight:700; color:#6b7280; text-transform:uppercase;">Product Serial Number</label>
                    <input style="width:100%; padding:6px 10px; border:1px solid #e5e7eb; border-radius:6px; font-size:11px; margin-top:2px; font-weight:700; background:#fafafa;" value="SN-90210-MAC" disabled>
                  </div>

                  <button id="preview-btn" style="width:100%; padding:8px; background:#4f46e5; border:none; border-radius:6px; color:white; font-size:11px; font-weight:700; cursor:default; transition:background 0.25s;">
                    Verify Details
                  </button>
                </div>

                <!-- Footer -->
                <div style="width:100%; max-width:320px; margin-top:12px; text-align:center; font-size:9px; color:#6b7280; display:flex; justify-content:space-between;">
                  <div>&copy; 2026 <span id="preview-footer-name">Admin</span></div>
                  <div id="preview-footer-email">support@nexuscorp.com</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- ADMINISTRATORS TAB -->
      <div class="tab-content" id="tab-admins">
        <div class="content-header">
          <div>
            <h1 class="page-title">Administrative Personnel</h1>
            <p class="page-sub">Manage administrator login credentials or change your own password.</p>
          </div>
        </div>
        <div class="content-body">
          <div class="integrations-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
            <!-- Left: Add Admin Form -->
            <div class="glass-card">
              <h3 class="card-title">Add Administrator User</h3>
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input class="form-input" id="adm-new-name" placeholder="Full name">
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input class="form-input" type="email" id="adm-new-email" placeholder="email@yourdomain.com">
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <input class="form-input" type="password" id="adm-new-pass" placeholder="Password">
              </div>
              <button class="btn" id="btn-add-admin">Add Admin Account</button>
            </div>
            
            <!-- Right: Change Password Form -->
            <div class="glass-card">
              <h3 class="card-title">Change Your Password</h3>
              <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">
                Update the password for your current active account (<strong id="adm-curr-email"></strong>).
              </p>
              <div class="form-group">
                <label class="form-label">New Password</label>
                <input class="form-input" type="password" id="adm-change-pass" placeholder="New Password">
              </div>
              <button class="btn" id="btn-change-password">Update Password</button>
            </div>
          </div>

          <!-- Admins table list -->
          <div class="glass-card" style="margin-top: 24px;">
            <h3 class="card-title">Active Administrator Accounts</h3>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th style="width: 80px; text-align: center;">Actions</th>
                  </tr>
                </thead>
                <tbody id="admins-tbody">
                  <!-- Admins dynamically populated -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- LIVE TERMINAL TAB -->
      <div class="tab-content" id="tab-live">
        <div class="content-header">
          <div>
            <h1 class="page-title">Live Activity Feed</h1>
            <p class="page-sub">Monitor real-time lookup and activation web sessions.</p>
          </div>
        </div>
        <div class="content-body">
          <div class="terminal-container">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
              </div>
              <div style="font-size:11px; font-family:var(--font-mono); color:var(--text-muted);">
                websocket-connection://nexus-gateway
              </div>
              <button class="btn btn-secondary" style="padding: 4px 10px; font-size:11px;" id="btn-clear-terminal">Clear Console</button>
            </div>
            <div class="terminal-body" id="terminal-log-box">
              <!-- Logs scroll here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- TOAST CONTAINER -->
  <div class="toast-container" id="toast-box"></div>

  <script>
    // State management
    const state = {
      email: '',
      password: '',
      products: [],
      admins: [],
      wsConnected: false,
      socket: null,
      currentTab: 'registry'
    };

    // Helper utilities
    function $(id) { return document.getElementById(id); }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    
    function showToast(text, type = 'info') {
      const box = $('toast-box');
      const toast = document.createElement('div');
      toast.className = 'toast toast-' + type;
      toast.innerHTML = '<span>' + text + '</span>';
      box.appendChild(toast);
      
      // Force repaint
      toast.offsetHeight;
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    }

    // API Request dispatcher
    function apiCall(endpoint, method = 'GET', body = null) {
      const headers = { 'Content-Type': 'application/json' };
      if (state.email && state.password) {
        headers['Authorization'] = 'Basic ' + btoa(state.email + ':' + state.password);
      }
      
      const config = { method, headers };
      if (body) {
        config.body = JSON.stringify(body);
      }
      
      return fetch(endpoint, config)
        .then(res => {
          if (res.status === 401) {
            Admin.logout();
            throw new Error('Session expired or unauthorized.');
          }
          return res.json().then(data => {
            if (!res.ok) {
              throw new Error(data.message || 'Server error occurred.');
            }
            return data;
          });
        });
    }

    // Admin Core logic
    var Admin = {
      init: function() {
        // Retrieve credentials if saved
        const pass = localStorage.getItem('nexus_admin_password');
        const email = localStorage.getItem('nexus_admin_email');
        if (pass && email) {
          state.password = pass;
          state.email = email;
          $('auth-screen').style.display = 'none';
          $('main-app').style.display = 'flex';
          
          this.fetchProducts();
          this.fetchConfig();
          this.fetchAdmins();
          this.connectWS();
        }
        
        // Dynamically compute webhook URL based on current host
        var webhookTarget = $('webhook-target-url');
        if (webhookTarget) {
          webhookTarget.textContent = location.protocol + '//' + location.host + '/webhooks/shopify/orders-paid';
        }
      },

      login: function() {
        const email = $('auth-email').value.trim();
        const password = $('auth-pass').value.trim();
        const errEl = $('auth-err-msg');
        
        if (!email || !password) {
          errEl.textContent = 'Please fill out all authentication fields.';
          errEl.style.display = 'block';
          return;
        }

        const loginBtn = $('btn-login');
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<div class="spinner"></div>';
        errEl.style.display = 'none';

        // Attempt login
        fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        .then(res => {
          if (!res.ok) throw new Error('Invalid email or password credentials.');
          return res.json();
        })
        .then(d => {
          if (d.success) {
            state.email = email;
            state.password = password;
            
            localStorage.setItem('nexus_admin_email', email);
            localStorage.setItem('nexus_admin_password', password);
            
            $('auth-screen').style.display = 'none';
            $('main-app').style.display = 'flex';
            
            showToast('Authenticated successfully.', 'success');
            this.fetchProducts();
            this.fetchConfig();
            this.fetchAdmins();
            this.connectWS();
          }
        })
        .catch(err => {
          errEl.textContent = err.message;
          errEl.style.display = 'block';
        })
        .finally(() => {
          loginBtn.disabled = false;
          loginBtn.textContent = 'Authenticate Portal';
        });
      },

      logout: function() {
        localStorage.removeItem('nexus_admin_email');
        localStorage.removeItem('nexus_admin_password');
        state.email = '';
        state.password = '';
        if (state.socket) {
          state.socket.close();
        }
        
        $('auth-screen').style.display = 'flex';
        $('main-app').style.display = 'none';
        showToast('Portal disconnected.', 'info');
      },

      tab: function(tabId) {
        state.currentTab = tabId;
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        
        $('tab-btn-' + tabId).classList.add('active');
        $('tab-' + tabId).classList.add('active');
        
        if (tabId === 'admins') {
          this.fetchAdmins();
        }
      },

      fetchProducts: function() {
        const tbody = $('products-tbody');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center"><div class="spinner"></div> Loading Registry Keys...</td></tr>';
        
        apiCall('/api/products')
          .then(d => {
            if (d.success) {
              state.products = d.data;
              this.updateDbStatus(d.usingSupabase);
              this.renderTable();
            }
          })
          .catch(err => {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--error)">Failed to fetch registry keys: ' + err.message + '</td></tr>';
            showToast('Error loading products list.', 'error');
          });
      },

      fetchConfig: function() {
        apiCall('/api/admin/config')
          .then(d => {
            if (d.success) {
              const c = d.data;
              $('side-title').textContent = c.PORTAL_NAME || 'Admin';
              
              // Fill config fields
              if ($('cfg-portal-name')) $('cfg-portal-name').value = c.PORTAL_NAME || '';
              if ($('cfg-portal-sub')) $('cfg-portal-sub').value = c.PORTAL_SUB || '';
              if ($('cfg-support-email')) $('cfg-support-email').value = c.SUPPORT_EMAIL || '';
              if ($('cfg-support-phone')) $('cfg-support-phone').value = c.SUPPORT_PHONE || '';
              if ($('cfg-twilio-sid')) $('cfg-twilio-sid').value = c.TWILIO_ACCOUNT_SID || '';
              if ($('cfg-twilio-from')) $('cfg-twilio-from').value = c.TWILIO_FROM_NUMBER || '';
              if ($('cfg-cors')) $('cfg-cors').value = c.CORS_ALLOWED_ORIGINS || '*';

              // Handle password placeholders
              if ($('cfg-twilio-token')) {
                $('cfg-twilio-token').placeholder = c.twilioTokenConfigured ? '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022 (configured)' : 'Enter Token';
                $('cfg-twilio-token').value = '';
              }
              if ($('cfg-resend-key')) {
                $('cfg-resend-key').placeholder = c.resendKeyConfigured ? 're_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022 (configured)' : 're_...';
                $('cfg-resend-key').value = '';
              }
              if ($('cfg-shopify-secret')) {
                $('cfg-shopify-secret').placeholder = c.shopifySecretConfigured ? '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022 (configured)' : 'Enter Secret';
                $('cfg-shopify-secret').value = '';
              }

              // Fill customization tab fields
              if ($('cust-portal-name')) $('cust-portal-name').value = c.PORTAL_NAME || '';
              if ($('cust-portal-sub')) $('cust-portal-sub').value = c.PORTAL_SUB || '';
              if ($('cust-support-email')) $('cust-support-email').value = c.SUPPORT_EMAIL || '';
              if ($('cust-support-phone')) $('cust-support-phone').value = c.SUPPORT_PHONE || '';
              if ($('cust-theme-hue')) $('cust-theme-hue').value = c.THEME_HUE || 'indigo';

              // Fill logo field
              if ($('cust-logo-url')) $('cust-logo-url').value = c.PORTAL_LOGO_URL || '';

              // Fill color fields
              var colorDefaults = { 'cust-color-primary': '#4f46e5', 'cust-color-bg': '#f4f4f7', 'cust-color-text': '#111827', 'cust-color-card': '#ffffff', 'cust-color-border': '#e5e7eb' };
              var colorKeys = { 'cust-color-primary': 'COLOR_PRIMARY', 'cust-color-bg': 'COLOR_BG', 'cust-color-text': 'COLOR_TEXT', 'cust-color-card': 'COLOR_CARD', 'cust-color-border': 'COLOR_BORDER' };
              Object.keys(colorKeys).forEach(function(id) {
                var val = c[colorKeys[id]] || colorDefaults[id];
                if ($(id)) $(id).value = val;
                var pickerId = id + '-picker';
                if ($(pickerId)) $(pickerId).value = val;
              });

              // Render config indicators
              this.renderIndicator('cfg-sb-url', d.usingSupabase, 'Connected to Live database', 'Running local mockup (Stateless)', d.supabaseError);
              this.renderIndicator('cfg-twilio', c.twilioConfigured, 'Twilio SMS Dispatch active', 'Twilio not set (SMS simulated)');
              this.renderIndicator('cfg-resend', c.resendConfigured, 'Resend Email Dispatch active', 'Resend not set (Email simulated)');
              this.renderIndicator('cfg-shopify', c.shopifyWebhookConfigured, 'Shopify HMAC Hook secured', 'HMAC verification bypassed');
              
              // Run preview update
              this.updatePreview();
            }
          })
          .catch(() => {});
      },

      saveConfig: function() {
        const body = {
          PORTAL_NAME: $('cfg-portal-name').value.trim(),
          PORTAL_SUB: $('cfg-portal-sub').value.trim(),
          SUPPORT_EMAIL: $('cfg-support-email').value.trim(),
          SUPPORT_PHONE: $('cfg-support-phone').value.trim(),
          TWILIO_ACCOUNT_SID: $('cfg-twilio-sid').value.trim(),
          TWILIO_FROM_NUMBER: $('cfg-twilio-from').value.trim(),
          CORS_ALLOWED_ORIGINS: $('cfg-cors').value.trim(),
          THEME_HUE: $('cust-theme-hue').value
        };

        // Add tokens if filled in
        const twToken = $('cfg-twilio-token').value.trim();
        const resKey = $('cfg-resend-key').value.trim();
        const shSecret = $('cfg-shopify-secret').value.trim();

        if (twToken) body.TWILIO_AUTH_TOKEN = twToken;
        if (resKey) body.RESEND_API_KEY = resKey;
        if (shSecret) body.SHOPIFY_WEBHOOK_SECRET = shSecret;

        apiCall('/api/admin/config', 'POST', body)
          .then(d => {
            if (d.success) {
              showToast('Branding & configuration updated.', 'success');
              this.fetchConfig();
            }
          })
          .catch(err => {
            showToast('Save failed: ' + err.message, 'error');
          });
      },

      updatePreview: function() {
        var name = $('cust-portal-name') ? $('cust-portal-name').value.trim() || 'Admin' : 'Admin';
        var sub = $('cust-portal-sub') ? $('cust-portal-sub').value.trim() || 'Activation Suite' : 'Activation Suite';
        var email = $('cust-support-email') ? $('cust-support-email').value.trim() || 'support@yourdomain.com' : 'support@yourdomain.com';

        // Resolve accent color: prefer direct hex field, then theme hue
        var primaryHex = ($('cust-color-primary') && $('cust-color-primary').value.trim()) || '';
        if (!primaryHex) {
          var hue = $('cust-theme-hue') ? $('cust-theme-hue').value : 'indigo';
          var hues = { indigo: '#4f46e5', emerald: '#059669', violet: '#7c3aed', orange: '#f97316', sky: '#0ea5e9', slate: '#18181b' };
          primaryHex = hues[hue] || '#4f46e5';
        }
        var bgColor = ($('cust-color-bg') && $('cust-color-bg').value.trim()) || '#f4f4f7';
        var textColor = ($('cust-color-text') && $('cust-color-text').value.trim()) || '#111827';
        var cardColor = ($('cust-color-card') && $('cust-color-card').value.trim()) || '#ffffff';
        var borderColor = ($('cust-color-border') && $('cust-color-border').value.trim()) || '#e5e7eb';
        var logoUrl = $('cust-logo-url') ? $('cust-logo-url').value.trim() : '';

        // Update text
        if ($('preview-brand-title')) $('preview-brand-title').textContent = name;
        if ($('preview-brand-sub')) $('preview-brand-sub').textContent = sub;
        if ($('preview-footer-name')) $('preview-footer-name').textContent = name;
        if ($('preview-footer-email')) $('preview-footer-email').textContent = email;

        // Update accent color
        if ($('preview-icon-bg')) $('preview-icon-bg').style.background = primaryHex;
        if ($('preview-btn')) $('preview-btn').style.background = primaryHex;

        // Update background
        var previewBox = $('preview-widget-box');
        if (previewBox) previewBox.style.background = bgColor;

        // Update card color + border
        var previewCard = $('preview-card');
        if (previewCard) {
          previewCard.style.background = cardColor;
          previewCard.style.borderColor = borderColor;
        }

        // Update text color
        if ($('preview-section-title')) $('preview-section-title').style.color = textColor;
        if ($('preview-brand-title')) $('preview-brand-title').style.color = textColor;

        // Update logo in header icon
        var iconBg = $('preview-icon-bg');
        if (iconBg) {
          if (logoUrl) {
            iconBg.innerHTML = '<img src="' + logoUrl + '" style="width:100%; height:100%; object-fit:contain; border-radius:4px;" onerror="this.style.display=\\'none\\'">';
            iconBg.style.background = 'transparent';
          } else {
            iconBg.innerHTML = '\u{1F511}';
            iconBg.style.background = primaryHex;
          }
        }

        // Show/hide logo preview strip
        var logoStrip = $('logo-preview-strip');
        var logoImg = $('logo-preview-img');
        if (logoStrip && logoImg) {
          if (logoUrl) {
            logoImg.src = logoUrl;
            logoStrip.style.display = 'flex';
          } else {
            logoStrip.style.display = 'none';
          }
        }
      },

      syncColorPicker: function(hexId, pickerId) {
        var hexEl = $(hexId);
        var pickerEl = $(pickerId);
        if (!hexEl || !pickerEl) return;
        // Hex -> picker
        hexEl.addEventListener('input', function() {
          var v = hexEl.value.trim();
          if (/^#[0-9a-fA-F]{6}$/.test(v)) pickerEl.value = v;
          Admin.updatePreview();
        });
        // Picker -> hex
        pickerEl.addEventListener('input', function() {
          hexEl.value = pickerEl.value;
          Admin.updatePreview();
        });
      },

      resetColors: function() {
        var defaults = { 'cust-color-primary': '#4f46e5', 'cust-color-bg': '#f4f4f7', 'cust-color-text': '#111827', 'cust-color-card': '#ffffff', 'cust-color-border': '#e5e7eb' };
        Object.keys(defaults).forEach(function(id) {
          if ($(id)) $(id).value = defaults[id];
          if ($(id + '-picker')) $(id + '-picker').value = defaults[id];
        });
        this.updatePreview();
      },

      saveCustomization: function() {
        var corsEl = $('cfg-cors');
        var twilioSidEl = $('cfg-twilio-sid');
        var twilioFromEl = $('cfg-twilio-from');
        var body = {
          PORTAL_NAME: $('cust-portal-name').value.trim(),
          PORTAL_SUB: $('cust-portal-sub').value.trim(),
          SUPPORT_EMAIL: $('cust-support-email').value.trim(),
          SUPPORT_PHONE: $('cust-support-phone').value.trim(),
          THEME_HUE: $('cust-theme-hue') ? $('cust-theme-hue').value : 'indigo',
          PORTAL_LOGO_URL: $('cust-logo-url') ? $('cust-logo-url').value.trim() : '',
          COLOR_PRIMARY: $('cust-color-primary') ? $('cust-color-primary').value.trim() : '',
          COLOR_BG: $('cust-color-bg') ? $('cust-color-bg').value.trim() : '',
          COLOR_TEXT: $('cust-color-text') ? $('cust-color-text').value.trim() : '',
          COLOR_CARD: $('cust-color-card') ? $('cust-color-card').value.trim() : '',
          COLOR_BORDER: $('cust-color-border') ? $('cust-color-border').value.trim() : '',
          CORS_ALLOWED_ORIGINS: corsEl ? corsEl.value.trim() : '*',
          TWILIO_ACCOUNT_SID: twilioSidEl ? twilioSidEl.value.trim() : '',
          TWILIO_FROM_NUMBER: twilioFromEl ? twilioFromEl.value.trim() : ''
        };

        apiCall('/api/admin/config', 'POST', body)
          .then(d => {
            if (d.success) {
              showToast('Portal customization settings saved.', 'success');
              this.fetchConfig();
            }
          })
          .catch(err => {
            showToast('Save failed: ' + err.message, 'error');
          });
      },

      fetchAdmins: function() {
        $('adm-curr-email').textContent = state.email;
        const tbody = $('admins-tbody');
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center"><div class="spinner"></div> Loading Administrators...</td></tr>';
        
        apiCall('/api/admin/accounts')
          .then(d => {
            if (d.success) {
              state.admins = d.data;
              this.renderAdmins();
            }
          })
          .catch(err => {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:var(--error)">Failed to fetch administrator accounts: ' + err.message + '</td></tr>';
          });
      },

      renderAdmins: function() {
        const tbody = $('admins-tbody');
        tbody.innerHTML = '';

        state.admins.forEach(adm => {
          const tr = document.createElement('tr');
          const isCurrentUser = adm.email.toLowerCase() === state.email.toLowerCase();
          
          let actionBtn = '';
          if (isCurrentUser) {
            actionBtn = '<span style="font-size:11px; font-weight:700; color:var(--primary)">Active Session</span>';
          } else {
            actionBtn = '<button class="btn-icon" onclick="window.Admin.deleteAdmin(\\'' + encodeURIComponent(adm.email) + '\\')">' +
                          '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>' +
                        '</button>';
          }

          tr.innerHTML = 
            '<td><div style="font-weight:600">' + escapeHtml(adm.name || 'Admin User') + '</div></td>' +
            '<td><span class="copyable" onclick="window.Admin.copyText(\\'' + escapeHtml(adm.email) + '\\')">' + escapeHtml(adm.email) + '</span></td>' +
            '<td style="text-align:center">' + actionBtn + '</td>';
          tbody.appendChild(tr);
        });
      },

      addAdmin: function() {
        const nameEl = $('adm-new-name');
        const emailEl = $('adm-new-email');
        const passEl = $('adm-new-pass');

        const name = nameEl.value.trim();
        const email = emailEl.value.trim().toLowerCase();
        const password = passEl.value.trim();

        if (!name || !email || !password) {
          showToast('Please fill out all fields to add a new admin.', 'error');
          return;
        }

        apiCall('/api/admin/accounts', 'POST', { name, email, password })
          .then(d => {
            if (d.success) {
              showToast('Administrator account ' + email + ' registered.', 'success');
              nameEl.value = '';
              emailEl.value = '';
              passEl.value = '';
              this.fetchAdmins();
            }
          })
          .catch(err => {
            showToast('Failed to register admin: ' + err.message, 'error');
          });
      },

      deleteAdmin: function(emailEncoded) {
        const email = decodeURIComponent(emailEncoded);
        if (!confirm('Are you sure you want to remove administrator access for ' + email + '?')) return;

        apiCall('/api/admin/accounts/' + emailEncoded, 'DELETE')
          .then(d => {
            if (d.success) {
              showToast('Administrator access removed.', 'success');
              this.fetchAdmins();
            }
          })
          .catch(err => {
            showToast('Deletion failed: ' + err.message, 'error');
          });
      },

      changePassword: function() {
        const passEl = $('adm-change-pass');
        const password = passEl.value.trim();

        if (!password) {
          showToast('Please type a new password.', 'error');
          return;
        }

        // Send updates to save to database for current email
        apiCall('/api/admin/accounts', 'POST', { name: '', email: state.email, password })
          .then(d => {
            if (d.success) {
              state.password = password;
              localStorage.setItem('nexus_admin_password', password);
              showToast('Your administrative password has been updated.', 'success');
              passEl.value = '';
            }
          })
          .catch(err => {
            showToast('Password update failed: ' + err.message, 'error');
          });
      },

      renderIndicator: function(elId, isOk, okText, badText, errorText = '') {
        const el = $(elId);
        if (!el) return;
        if (isOk) {
          el.textContent = okText;
          el.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          el.style.color = '#34d399';
          el.style.background = 'rgba(16, 185, 129, 0.05)';
        } else {
          el.textContent = errorText ? (badText + ' (Error: ' + errorText + ')') : badText;
          el.style.borderColor = 'rgba(245, 158, 11, 0.3)';
          el.style.color = '#fbbf24';
          el.style.background = 'rgba(245, 158, 11, 0.05)';
        }
      },

      updateDbStatus: function(usingSupabase) {
        const dot = $('db-status-dot');
        const txt = $('db-status-text');
        if (usingSupabase) {
          dot.className = 'status-dot active';
          txt.textContent = 'Supabase Cloud (Live)';
        } else {
          dot.className = 'status-dot warning';
          txt.textContent = 'Mock Registry (In-Memory)';
        }
      },

      renderTable: function() {
        const tbody = $('products-tbody');
        tbody.innerHTML = '';
        
        const filterText = $('registry-search').value.toLowerCase().trim();
        const filtered = state.products.filter(p => {
          return p.serialNumber.toLowerCase().includes(filterText) ||
                 p.productName.toLowerCase().includes(filterText) ||
                 (p.licenseKey && p.licenseKey.toLowerCase().includes(filterText)) ||
                 (p.ownerEmail && p.ownerEmail.toLowerCase().includes(filterText)) ||
                 (p.ownerName && p.ownerName.toLowerCase().includes(filterText));
        });

        if (filtered.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted)">No registered serial keys found.</td></tr>';
          return;
        }

        filtered.forEach(p => {
          const tr = document.createElement('tr');
          
          // Badge
          let statusBadge = '<span class="badge badge-unactivated">unactivated</span>';
          if (p.status === 'active') {
            statusBadge = '<span class="badge badge-active">active</span>';
          } else if (p.status === 'expired') {
            statusBadge = '<span class="badge badge-expired">expired</span>';
          }
          
          // License Key column
          const lic = p.licenseKey ? 
            ('<span class="copyable" onclick="window.Admin.copyText(\\'' + escapeHtml(p.licenseKey) + '\\')">' + escapeHtml(p.licenseKey.slice(0, 15)) + '... <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></span>') : 
            '<span style="color:var(--text-muted)">-</span>';
            
          // Owner Info column
          let owner = '<span style="color:var(--text-muted)">-</span>';
          if (p.status === 'active') {
            owner = '<div class="owner-info">' +
                    '<div class="owner-name">' + escapeHtml(p.ownerName || 'Unknown') + '</div>' +
                    '<div>' + escapeHtml(p.ownerEmail || '') + '</div>' +
                    '<div>' + escapeHtml(p.ownerPhone || '') + '</div>' +
                    '</div>';
          }
          
          let detailsSub = escapeHtml(p.category) + ' &bull; ' + escapeHtml(p.useType || 'one-time');
          if (p.expirationDate) {
            detailsSub += ' &bull; Exp: ' + escapeHtml(p.expirationDate);
          }
          
          tr.innerHTML = 
            '<td>' +
              '<div style="font-weight:600">' + escapeHtml(p.productName) + '</div>' +
              '<div style="font-size:11px; color:var(--text-muted)">' + detailsSub + '</div>' +
            '</td>' +
            '<td>' +
              '<span class="copyable" onclick="window.Admin.copyText(\\'' + escapeHtml(p.serialNumber) + '\\')">' + escapeHtml(p.serialNumber) + 
                ' <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
              '</span>' +
            '</td>' +
            '<td>' + statusBadge + '</td>' +
            '<td>' + lic + '</td>' +
            '<td>' + owner + '</td>' +
            '<td style="text-align:center">' +
              '<button class="btn-icon" onclick="window.Admin.deleteProduct(\\'' + encodeURIComponent(p.serialNumber) + '\\')">' +
                '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>' +
              '</button>' +
            '</td>';
          tbody.appendChild(tr);
        });
      },

      filterTable: function() {
        this.renderTable();
      },

      addProduct: function() {
        const serialEl = $('add-serial');
        const nameEl = $('add-name');
        const catEl = $('add-cat');
        const useEl = $('add-use');
        const expiryEl = $('add-expiry');
        
        const serialNumber = serialEl.value.trim().toUpperCase();
        const productName = nameEl.value.trim();
        const category = catEl.value.trim();
        const useType = useEl.value;
        const expirationDate = expiryEl.value;

        if (!serialNumber || !productName || !category) {
          showToast('Please fill out all product registration fields.', 'error');
          return;
        }

        const body = { serialNumber, productName, category, useType };
        if (expirationDate) {
          body.expirationDate = expirationDate;
        }

        apiCall('/api/products', 'POST', body)
          .then(d => {
            if (d.success) {
              showToast('Serial ' + serialNumber + ' registered successfully.', 'success');
              
              // Clear fields
              serialEl.value = '';
              nameEl.value = '';
              catEl.value = '';
              expiryEl.value = '';
              
              this.fetchProducts();
            }
          })
          .catch(err => {
            showToast('Registration failed: ' + err.message, 'error');
          });
      },

      deleteProduct: function(serialEncoded) {
        const serial = decodeURIComponent(serialEncoded);
        if (!confirm('Are you sure you want to remove serial ' + serial + ' from the registry?')) return;
        
        apiCall('/api/products/' + serialEncoded, 'DELETE')
          .then(d => {
            if (d.success) {
              showToast('Serial ' + serial + ' deleted.', 'success');
              this.fetchProducts();
            }
          })
          .catch(err => {
            showToast('Failed to delete serial: ' + err.message, 'error');
          });
      },

      resetDb: function() {
        if (!confirm('WARNING: This will wipe all registrations and insert default sample keys. Proceed?')) return;
        
        apiCall('/api/reset', 'POST')
          .then(d => {
            if (d.success) {
              showToast('Database registry reset successfully.', 'success');
              this.fetchProducts();
            }
          })
          .catch(err => {
            showToast('Reset failed: ' + err.message, 'error');
          });
      },

      importBulk: function() {
        const txt = $('bulk-data').value.trim();
        const resultDiv = $('bulk-result');
        const summaryTxt = $('bulk-summary-txt');
        const detailsDiv = $('bulk-result-details');
        
        if (!txt) {
          showToast('Paste CSV or comma-separated list of keys first.', 'error');
          return;
        }

        // Simple CSV parser
        const lines = txt.split('\\n');
        const productsList = [];
        
        lines.forEach(l => {
          if (!l.trim()) return;
          const parts = l.split(',').map(p => p.trim());
          if (parts.length >= 2) {
            productsList.push({
              serialNumber: parts[0],
              productName: parts[1],
              category: parts[2] || 'Bulk Upload',
              useType: parts[3] || 'one-time'
            });
          }
        });

        if (productsList.length === 0) {
          showToast('Could not parse any valid lines from the input. Format: serial, name, category, useType.', 'error');
          return;
        }

        resultDiv.style.display = 'none';
        
        apiCall('/api/products/bulk', 'POST', { productsList })
          .then(d => {
            if (d.success) {
              showToast('Bulk upload processed.', 'success');
              
              summaryTxt.textContent = d.summary;
              summaryTxt.style.color = 'var(--success)';
              
              let detailsHtml = '<strong>Registered (' + d.inserted.length + '):</strong><br>';
              if (d.inserted.length > 0) {
                detailsHtml += d.inserted.map(p => escapeHtml(p.serialNumber)).join(', ') + '<br>';
              } else {
                detailsHtml += 'None<br>';
              }
              
              detailsHtml += '<br><strong>Skipped (' + d.skipped.length + '):</strong><br>';
              if (d.skipped.length > 0) {
                detailsHtml += d.skipped.map(p => escapeHtml(p.serialNumber) + ' (' + escapeHtml(p.reason) + ')').join('<br>');
              } else {
                detailsHtml += 'None';
              }
              
              detailsDiv.innerHTML = detailsHtml;
              resultDiv.style.display = 'block';
              
              $('bulk-data').value = '';
              this.fetchProducts();
            }
          })
          .catch(err => {
            showToast('Bulk import failed: ' + err.message, 'error');
          });
      },

      copyText: function(text) {
        navigator.clipboard.writeText(text)
          .then(() => showToast('Copied to clipboard.', 'success'))
          .catch(() => showToast('Failed to copy.', 'error'));
      },

      connectWS: function() {
        if (state.socket) {
          state.socket.close();
        }

        const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = protocol + '//' + location.host + '/api/ws?email=' + encodeURIComponent(state.email) + '&password=' + encodeURIComponent(state.password);
        
        state.socket = new WebSocket(wsUrl);
        
        state.socket.onopen = () => {
          state.wsConnected = true;
          this.updateWsStatus(true);
          this.addTerminalLog('info', 'Connected to real-time events feed.');
        };

        state.socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'history') {
              // Populate logs window on startup
              const consoleBox = $('terminal-log-box');
              consoleBox.innerHTML = '';
              msg.data.forEach(log => {
                this.addTerminalLog(log.type, log.message, new Date(log.timestamp));
              });
            } else {
              this.addTerminalLog(msg.type, msg.message, new Date(msg.timestamp));
              
              // React on active view if we are on registry
              if (msg.type === 'activation') {
                showToast('\u{1F389} Serial ' + (msg.data?.serialNumber || '') + ' activated!', 'success');
                this.fetchProducts();
              } else if (msg.type === 'shopify_webhook') {
                showToast('\u{1F6CD}\uFE0F\x8D\xEF\xB8\x8F Shopify webhook processed!', 'success');
                this.fetchProducts();
              } else if (msg.type === 'lookup' || msg.type === 'otp_request') {
                showToast('\u26A1 Client activity: ' + msg.message, 'info');
              }
            }
          } catch(e) {}
        };

        state.socket.onclose = () => {
          state.wsConnected = false;
          this.updateWsStatus(false);
          this.addTerminalLog('info', 'Disconnected from real-time events feed. Retrying in 5 seconds...');
          setTimeout(() => {
            if (state.password) { // Only reconnect if still logged in
              this.connectWS();
            }
          }, 5000);
        };
      },

      updateWsStatus: function(connected) {
        const dot = $('ws-status-dot');
        const txt = $('ws-status-text');
        if (connected) {
          dot.className = 'status-dot active';
          txt.textContent = 'Live Activity Feed Connect';
        } else {
          dot.className = 'status-dot';
          txt.textContent = 'Websocket Offline';
        }
      },

      addTerminalLog: function(type, message, dateObj = new Date()) {
        const consoleBox = $('terminal-log-box');
        const logLine = document.createElement('div');
        logLine.className = 'log-line';
        
        const pad = (n) => String(n).padStart(2, '0');
        const timeStr = pad(dateObj.getHours()) + ':' + pad(dateObj.getMinutes()) + ':' + pad(dateObj.getSeconds());
        
        logLine.innerHTML = 
          '<span class="log-time">[' + timeStr + ']</span>' +
          '<span class="log-tag log-tag-' + type + '">' + type + '</span>' +
          '<span class="log-msg">' + escapeHtml(message) + '</span>';
          
        consoleBox.appendChild(logLine);
        consoleBox.scrollTop = consoleBox.scrollHeight;
      },

      clearTerminal: function() {
        $('terminal-log-box').innerHTML = '';
        showToast('Console cleared.', 'info');
      }
    };

    window.Admin = Admin;

    // Set up event listeners for static elements to avoid inline event handler issues
    var btnLogin = $('btn-login');
    if (btnLogin) {
      btnLogin.addEventListener('click', function(e) {
        e.preventDefault();
        Admin.login();
      });
    }
    
    ['registry', 'bulk', 'integrations', 'admins', 'customization', 'live'].forEach(function(tab) {
      var btn = $('tab-btn-' + tab);
      if (btn) {
        btn.addEventListener('click', function() {
          Admin.tab(tab);
        });
      }
    });

    var btnLogout = $('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', function(e) {
        e.preventDefault();
        Admin.logout();
      });
    }

    var btnAddProduct = $('btn-add-product');
    if (btnAddProduct) {
      btnAddProduct.addEventListener('click', function(e) {
        e.preventDefault();
        Admin.addProduct();
      });
    }

    var btnRefreshProducts = $('btn-refresh-products');
    if (btnRefreshProducts) {
      btnRefreshProducts.addEventListener('click', function(e) {
        e.preventDefault();
        Admin.fetchProducts();
      });
    }

    var btnResetDb = $('btn-reset-db');
    if (btnResetDb) {
      btnResetDb.addEventListener('click', function(e) {
        e.preventDefault();
        Admin.resetDb();
      });
    }

    var btnImportBulk = $('btn-import-bulk');
    if (btnImportBulk) {
      btnImportBulk.addEventListener('click', function(e) {
        e.preventDefault();
        Admin.importBulk();
      });
    }

    var btnSaveConfig = $('btn-save-config');
    if (btnSaveConfig) {
      btnSaveConfig.addEventListener('click', function(e) {
        e.preventDefault();
        Admin.saveConfig();
      });
    }

    var btnSaveCustomization = $('btn-save-customization');
    if (btnSaveCustomization) {
      btnSaveCustomization.addEventListener('click', function(e) {
        e.preventDefault();
        Admin.saveCustomization();
      });
    }

    var btnAddAdmin = $('btn-add-admin');
    if (btnAddAdmin) {
      btnAddAdmin.addEventListener('click', function(e) {
        e.preventDefault();
        Admin.addAdmin();
      });
    }

    var btnChangePassword = $('btn-change-password');
    if (btnChangePassword) {
      btnChangePassword.addEventListener('click', function(e) {
        e.preventDefault();
        Admin.changePassword();
      });
    }

    var btnClearTerminal = $('btn-clear-terminal');
    if (btnClearTerminal) {
      btnClearTerminal.addEventListener('click', function(e) {
        e.preventDefault();
        Admin.clearTerminal();
      });
    }

    // Customization page real-time preview updates
    ['cust-portal-name', 'cust-portal-sub', 'cust-support-email', 'cust-support-phone', 'cust-logo-url'].forEach(function(id) {
      var el = $(id);
      if (el) {
        el.addEventListener('input', function() {
          Admin.updatePreview();
        });
      }
    });

    var themeHue = $('cust-theme-hue');
    if (themeHue) {
      themeHue.addEventListener('change', function() {
        Admin.updatePreview();
      });
    }

    // Wire up color picker <-> hex text pairs
    [['cust-color-primary', 'cust-color-primary-picker'],
     ['cust-color-bg', 'cust-color-bg-picker'],
     ['cust-color-text', 'cust-color-text-picker'],
     ['cust-color-card', 'cust-color-card-picker'],
     ['cust-color-border', 'cust-color-border-picker']
    ].forEach(function(pair) {
      Admin.syncColorPicker(pair[0], pair[1]);
    });

    // Reset colors button
    var btnResetColors = $('btn-reset-colors');
    if (btnResetColors) {
      btnResetColors.addEventListener('click', function(e) {
        e.preventDefault();
        Admin.resetColors();
      });
    }

    var regSearch = $('registry-search');
    if (regSearch) {
      regSearch.addEventListener('input', function() {
        Admin.filterTable();
      });
    }

    // Auto boot
    window.Admin.init();
  <\/script>
<!--/email_off-->
</body>
</html>`;
