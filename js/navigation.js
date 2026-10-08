/**
 * SceneBox - Navigation & UI Components
 * Handles dynamic navigation bar, active states, toast notifications, modals, and image fallbacks.
 */

const UI = {
  // Toast Notifications
  showToast(message, type = "info", duration = 3200) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} animate-slide-up`;

    let icon = "ℹ️";
    if (type === "success") icon = "✓";
    if (type === "error") icon = "✕";
    if (type === "warning") icon = "⚠️";
    if (type === "surprise") icon = "🎲";

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    }, duration);
  },

  // Confirmation Modal
  confirm(title, message, confirmText = "Confirm", cancelText = "Cancel") {
    return new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.className = "modal-overlay active";
      modal.innerHTML = `
        <div class="modal-card animate-scale-up">
          <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <p>${message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary cancel-btn">${cancelText}</button>
            <button class="btn btn-primary confirm-btn">${confirmText}</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const cleanup = (result) => {
        modal.classList.remove("active");
        setTimeout(() => modal.remove(), 200);
        resolve(result);
      };

      modal.querySelector(".modal-close-btn").onclick = () => cleanup(false);
      modal.querySelector(".cancel-btn").onclick = () => cleanup(false);
      modal.querySelector(".confirm-btn").onclick = () => cleanup(true);
      modal.onclick = (e) => {
        if (e.target === modal) cleanup(false);
      };
    });
  },

  // Surprise Me Function
  surpriseMe() {
    const scenes = StorageManager.getScenes();
    if (!scenes || scenes.length === 0) {
      UI.showToast("No scenes available right now.", "warning");
      return;
    }
    const randomIndex = Math.floor(Math.random() * scenes.length);
    const chosenScene = scenes[randomIndex];
    
    // Check path depth (if we are in root or in subfolder)
    const isSubdir = window.location.pathname.includes("/admin/");
    const targetUrl = isSubdir ? `../player.html?id=${chosenScene.id}&surprise=1` : `player.html?id=${chosenScene.id}&surprise=1`;
    window.location.href = targetUrl;
  },

  // Image fallback handler
  handleImageError(img, title = "Scene") {
    img.onerror = null;
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");

    // Cinematic dark gradient
    const grad = ctx.createLinearGradient(0, 0, 640, 360);
    grad.addColorStop(0, "#161922");
    grad.addColorStop(1, "#0a0b0e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 360);

    // Accent line
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(40, 40, 6, 80);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("SCENEBOX", 60, 70);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px sans-serif";
    const cleanTitle = title.length > 30 ? title.substring(0, 27) + "..." : title;
    ctx.fillText(cleanTitle, 60, 100);

    // Play icon badge
    ctx.fillStyle = "rgba(245, 158, 11, 0.2)";
    ctx.beginPath();
    ctx.arc(320, 180, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.moveTo(312, 165);
    ctx.lineTo(335, 180);
    ctx.lineTo(312, 195);
    ctx.closePath();
    ctx.fill();

    img.src = canvas.toDataURL("image/png");
  },

  // Render or enhance User Header Navbar
  initNavbar() {
    const navPlaceholder = document.getElementById("main-navbar");
    if (!navPlaceholder) return;

    const user = Auth.getCurrentUser();
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    const watchLaterCount = user ? (StorageManager.getUserWatchLaterScenes(user.id).length) : 0;

    navPlaceholder.innerHTML = `
      <div class="nav-container">
        <a href="index.html" class="nav-brand">
          <div class="brand-badge">
            <span class="brand-icon">▶</span>
          </div>
          <span class="brand-text">SCENE<span class="brand-highlight">BOX</span></span>
        </a>

        <div class="nav-links" id="nav-links">
          <a href="index.html" class="nav-link ${currentPath === "index.html" || currentPath === "" ? "active" : ""}">Home</a>
          <a href="explore.html" class="nav-link ${currentPath === "explore.html" ? "active" : ""}">Explore</a>
          <a href="search.html" class="nav-link ${currentPath === "search.html" ? "active" : ""}">Search</a>
          <a href="playlists.html" class="nav-link ${currentPath === "playlists.html" ? "active" : ""}">Playlists</a>
        </div>

        <div class="nav-actions">
          <button class="btn btn-surprise" id="btn-surprise-me" title="Play a random scene of the moment!">
            <span>🎲</span>
            <span class="btn-text">Surprise Me</span>
          </button>

          <a href="watch-later.html" class="nav-icon-btn ${currentPath === "watch-later.html" ? "active" : ""}" title="Watch Later">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            ${watchLaterCount > 0 ? `<span class="nav-badge">${watchLaterCount}</span>` : ""}
          </a>

          ${user ? `
            <div class="user-dropdown-wrapper" id="user-dropdown-wrapper">
              <button class="user-profile-btn" id="user-menu-btn" aria-haspopup="true">
                <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" alt="${user.name}" class="nav-avatar" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'">
                <span class="user-name-text">${user.name.split(" ")[0]}</span>
                <span class="arrow-down">▾</span>
              </button>
              <div class="user-dropdown-menu" id="user-dropdown-menu">
                <div class="dropdown-header">
                  <strong>${user.name}</strong>
                  <small>${user.email}</small>
                </div>
                <div class="dropdown-divider"></div>
                <a href="profile.html" class="dropdown-item">👤 Profile & Stats</a>
                <a href="watch-later.html" class="dropdown-item">🔖 Watch Later</a>
                <a href="history.html" class="dropdown-item">🕒 Watch History</a>
                <a href="playlists.html" class="dropdown-item">📋 My Playlists</a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item text-danger" id="nav-logout-btn">↪ Sign Out</button>
              </div>
            </div>
          ` : `
            <div class="auth-buttons">
              <a href="login.html" class="btn btn-ghost btn-sm">Sign In</a>
              <a href="register.html" class="btn btn-primary btn-sm">Sign Up</a>
            </div>
          `}

          <button class="mobile-toggle-btn" id="mobile-toggle" aria-label="Toggle navigation">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div class="mobile-drawer" id="mobile-drawer">
        <a href="index.html" class="mobile-link ${currentPath === "index.html" ? "active" : ""}">Home</a>
        <a href="explore.html" class="mobile-link ${currentPath === "explore.html" ? "active" : ""}">Explore Scenes</a>
        <a href="search.html" class="mobile-link ${currentPath === "search.html" ? "active" : ""}">Search</a>
        <a href="playlists.html" class="mobile-link ${currentPath === "playlists.html" ? "active" : ""}">Playlists</a>
        <a href="watch-later.html" class="mobile-link ${currentPath === "watch-later.html" ? "active" : ""}">Watch Later (${watchLaterCount})</a>
        ${user ? `
          <a href="history.html" class="mobile-link ${currentPath === "history.html" ? "active" : ""}">Watch History</a>
          <a href="profile.html" class="mobile-link ${currentPath === "profile.html" ? "active" : ""}">Profile (${user.name})</a>
          <button class="mobile-link text-danger" id="mobile-logout-btn">Sign Out</button>
        ` : `
          <div class="mobile-auth-actions">
            <a href="login.html" class="btn btn-secondary btn-block">Sign In</a>
            <a href="register.html" class="btn btn-primary btn-block">Sign Up</a>
          </div>
        `}
      </div>
    `;

    // Attach event listeners
    const surpriseBtn = document.getElementById("btn-surprise-me");
    if (surpriseBtn) {
      surpriseBtn.addEventListener("click", () => UI.surpriseMe());
    }

    const userMenuBtn = document.getElementById("user-menu-btn");
    const userDropdownMenu = document.getElementById("user-dropdown-menu");
    if (userMenuBtn && userDropdownMenu) {
      userMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdownMenu.classList.toggle("show");
      });
      document.addEventListener("click", () => {
        userDropdownMenu.classList.remove("show");
      });
    }

    const logoutBtn = document.getElementById("nav-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        Auth.logoutUser("index.html");
      });
    }

    const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener("click", () => {
        Auth.logoutUser("index.html");
      });
    }

    const mobileToggle = document.getElementById("mobile-toggle");
    const mobileDrawer = document.getElementById("mobile-drawer");
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener("click", () => {
        mobileDrawer.classList.toggle("open");
        mobileToggle.classList.toggle("active");
      });
    }
  },

  // Render Footer
  initFooter() {
    const footerPlaceholder = document.getElementById("main-footer");
    if (!footerPlaceholder) return;

    footerPlaceholder.innerHTML = `
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-col brand-col">
            <div class="footer-brand">
              <span class="brand-icon">▶</span>
              <span>SCENE<span class="brand-highlight">BOX</span></span>
            </div>
            <p class="footer-tagline">“The moment you want. Not the whole movie.”</p>
            <p class="footer-desc">Scene-first cinematic exploration platform. Discover iconic highlights, unforgettable lines, and breathtaking moments across film history.</p>
          </div>

          <div class="footer-col">
            <h4>Moments</h4>
            <ul class="footer-links">
              <li><a href="explore.html?cat=Epic">Epic Battles</a></li>
              <li><a href="explore.html?cat=Iconic%20Dialogue">Iconic Speeches</a></li>
              <li><a href="explore.html?cat=Plot%20Twist">Plot Twists</a></li>
              <li><a href="explore.html?cat=Comedy">Comedy Highlights</a></li>
              <li><a href="explore.html?cat=Romance">Romantic Moments</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Features</h4>
            <ul class="footer-links">
              <li><a href="explore.html">Scene Discovery</a></li>
              <li><a href="search.html">Smart DNA Search</a></li>
              <li><a href="playlists.html">Custom Playlists</a></li>
              <li><a href="javascript:UI.surpriseMe()">🎲 Surprise Me</a></li>
              <li><a href="admin/login.html" class="footer-admin-link">Staff Portal</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>About SceneBox</h4>
            <p class="text-muted text-sm">A client-side frontend cinematic web application powered by HTML5, CSS3, Vanilla JavaScript, and LocalStorage.</p>
            <div class="demo-badge-footer">
              <span class="badge-dot"></span> Educational Prototype 2.0
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 SceneBox Inc. All rights reserved. Built for cinematic moment discovery.</p>
          <div class="footer-bottom-links">
            <span>Client-side Only</span>
            <span>•</span>
            <span>Zero Server Dependencies</span>
            <span>•</span>
            <a href="admin/login.html" class="text-subtle">Admin Access</a>
          </div>
        </div>
      </div>
    `;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  UI.initNavbar();
  UI.initFooter();
});
