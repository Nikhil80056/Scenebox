/**
 * SceneBox - Admin Module Controller
 * Handles Admin layout, route guards, dashboard metrics, User Management,
 * complete Scene CRUD, Activity Logs viewing, and Analytics visualizations.
 */

const AdminController = {
  // Initialize Admin Shell (Sidebar, Header, Auth Guard)
  initShell() {
    if (!Auth.requireAdmin("login.html")) {
      return false;
    }

    const currentPath = window.location.pathname.split("/").pop() || "dashboard.html";
    const sidebar = document.getElementById("admin-sidebar");
    if (sidebar) {
      sidebar.innerHTML = `
        <div class="admin-sidebar-header">
          <a href="../index.html" class="admin-brand">
            <span class="brand-badge"><span class="brand-icon">▶</span></span>
            <div class="admin-brand-text">
              <span class="brand-name">SCENE<span class="brand-highlight">BOX</span></span>
              <span class="admin-tag">ADMIN PORTAL</span>
            </div>
          </a>
        </div>

        <div class="admin-nav-group">
          <div class="nav-section-title">CORE MANAGEMENT</div>
          <a href="dashboard.html" class="admin-nav-link ${currentPath === 'dashboard.html' ? 'active' : ''}">
            <span class="nav-icon">📊</span> Dashboard
          </a>
          <a href="scenes.html" class="admin-nav-link ${currentPath === 'scenes.html' ? 'active' : ''}">
            <span class="nav-icon">🎬</span> Scene Management
          </a>
          <a href="users.html" class="admin-nav-link ${currentPath === 'users.html' ? 'active' : ''}">
            <span class="nav-icon">👥</span> Users Management
          </a>
          <a href="activity.html" class="admin-nav-link ${currentPath === 'activity.html' ? 'active' : ''}">
            <span class="nav-icon">🕒</span> Activity Logs
          </a>
          <a href="analytics.html" class="admin-nav-link ${currentPath === 'analytics.html' ? 'active' : ''}">
            <span class="nav-icon">📈</span> Analytics
          </a>
        </div>

        <div class="admin-nav-group">
          <div class="nav-section-title">SYSTEM</div>
          <a href="profile.html" class="admin-nav-link ${currentPath === 'profile.html' ? 'active' : ''}">
            <span class="nav-icon">⚙️</span> Settings & Profile
          </a>
          <a href="../index.html" class="admin-nav-link">
            <span class="nav-icon">↗</span> Public Platform
          </a>
        </div>

        <div class="admin-sidebar-footer">
          <div class="admin-user-pill">
            <div class="admin-avatar">A</div>
            <div class="admin-meta">
              <strong>Admin Staff</strong>
              <small>admin@scenebox.com</small>
            </div>
          </div>
          <button class="btn btn-ghost btn-sm text-danger btn-block" style="margin-top:0.75rem;" onclick="Auth.logoutAdmin('login.html')">
            ↪ Logout
          </button>
        </div>
      `;
    }

    const header = document.getElementById("admin-top-nav");
    if (header) {
      header.innerHTML = `
        <div class="admin-header-title">
          <h2 id="page-title-heading">Admin Portal</h2>
        </div>
        <div class="admin-header-actions">
          <button class="btn btn-secondary btn-sm" onclick="window.location.href='../index.html'">
            Public Site
          </button>
          <a href="profile.html" class="admin-profile-icon" title="Admin Settings">⚙️</a>
        </div>
      `;
    }

    return true;
  },

  // 1. DASHBOARD PAGE
  initDashboard() {
    if (!this.initShell()) return;

    const scenes = StorageManager.getScenes();
    const users = StorageManager.getUsers();
    const logs = StorageManager.getActivityLogs();

    // Calculate active users (active within last 24h)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const activeUsers = users.filter(u => new Date(u.lastActive || 0).getTime() > oneDayAgo);

    // Total Views & Likes
    const totalViews = scenes.reduce((sum, s) => sum + (s.views || 0), 0);
    const totalLikes = scenes.reduce((sum, s) => sum + (s.likes || 0), 0);

    // Total Playlists
    const playlistsMap = StorageManager.get(STORAGE_KEYS.PLAYLISTS, {});
    const totalPlaylists = Object.values(playlistsMap).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0);

    // Populate stat counters
    const elUsers = document.getElementById("metric-total-users");
    const elActive = document.getElementById("metric-active-users");
    const elScenes = document.getElementById("metric-total-scenes");
    const elViews = document.getElementById("metric-total-views");
    const elLikes = document.getElementById("metric-total-likes");
    const elPlaylists = document.getElementById("metric-total-playlists");

    if (elUsers) elUsers.textContent = users.length;
    if (elActive) elActive.textContent = activeUsers.length;
    if (elScenes) elScenes.textContent = scenes.length;
    if (elViews) elViews.textContent = Scenes.formatCount(totalViews);
    if (elLikes) elLikes.textContent = Scenes.formatCount(totalLikes);
    if (elPlaylists) elPlaylists.textContent = totalPlaylists;

    // Render Recent Activity (last 6)
    const recentLogsContainer = document.getElementById("dashboard-recent-activity");
    if (recentLogsContainer) {
      const recentLogs = logs.slice(0, 6);
      if (recentLogs.length === 0) {
        recentLogsContainer.innerHTML = `<p class="text-subtle text-sm">No activity recorded yet.</p>`;
      } else {
        recentLogsContainer.innerHTML = recentLogs.map(log => {
          const meta = ActivityTracker.getActionMeta(log.action);
          return `
            <div class="activity-feed-row">
              <span class="activity-icon-badge">${meta.icon}</span>
              <div class="activity-text-col">
                <div class="activity-headline">
                  <strong>${log.userName}</strong>
                  <span class="action-desc">${log.details}</span>
                  ${log.sceneTitle ? `<span class="target-title">“${log.sceneTitle}”</span>` : ''}
                </div>
                <small class="activity-time">${ActivityTracker.formatTimestamp(log.timestamp)}</small>
              </div>
            </div>
          `;
        }).join("");
      }
    }

    // Top Performing Scenes preview
    const topScenesContainer = document.getElementById("dashboard-top-scenes");
    if (topScenesContainer) {
      const sortedByViews = [...scenes].sort((a, b) => b.views - a.views).slice(0, 4);
      topScenesContainer.innerHTML = sortedByViews.map((s, idx) => `
        <div class="top-scene-item">
          <span class="rank-badge">${idx + 1}</span>
          <img src="${s.thumbnail}" class="row-thumb" alt="${s.title}" onerror="UI.handleImageError(this, '${s.title.replace(/'/g, "\\'")}')" />
          <div class="top-scene-meta">
            <strong>${s.title}</strong>
            <small>${s.categoryEmoji || ''} ${s.category} • ${s.source}</small>
          </div>
          <span class="views-pill">${Scenes.formatCount(s.views)} views</span>
        </div>
      `).join("");
    }
  },

  // 2. USER MANAGEMENT PAGE
  initUsers() {
    if (!this.initShell()) return;

    let users = StorageManager.getUsers();
    let filterStatus = "all";
    let searchQuery = "";
    let sortField = "lastActive";

    const renderTable = () => {
      const tbody = document.getElementById("users-table-body");
      if (!tbody) return;

      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const historyMap = StorageManager.get(STORAGE_KEYS.WATCH_HISTORY, {});

      let filtered = users.filter(u => {
        const isActive = new Date(u.lastActive || 0).getTime() > oneDayAgo;
        if (filterStatus === "active" && !isActive) return false;
        if (filterStatus === "offline" && isActive) return false;

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        }
        return true;
      });

      // Sort
      filtered.sort((a, b) => {
        if (sortField === "name") return a.name.localeCompare(b.name);
        if (sortField === "joined") return new Date(b.createdAt) - new Date(a.createdAt);
        return new Date(b.lastActive || 0) - new Date(a.lastActive || 0);
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center py-4 text-muted">No users found matching query.</td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(u => {
        const isActive = new Date(u.lastActive || 0).getTime() > oneDayAgo;
        const userHistory = historyMap[u.id] || [];
        const joinedDate = new Date(u.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const lastActiveTime = ActivityTracker.formatTimestamp(u.lastActive);

        return `
          <tr>
            <td>
              <div class="user-cell">
                <img src="${u.avatar}" class="cell-avatar" alt="${u.name}" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'" />
                <div>
                  <strong>${u.name}</strong>
                  <div class="text-subtle text-xs">ID: ${u.id}</div>
                </div>
              </div>
            </td>
            <td>${u.email}</td>
            <td>
              <span class="status-indicator-badge ${isActive ? 'status-active' : 'status-offline'}">
                <span class="status-dot"></span> ${isActive ? 'Active' : 'Offline'}
              </span>
            </td>
            <td>${joinedDate}</td>
            <td>${lastActiveTime}</td>
            <td><span class="count-badge">${userHistory.length}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="AdminController.inspectUser('${u.id}')">
                Inspect Activity
              </button>
            </td>
          </tr>
        `;
      }).join("");
    };

    // Bind filters
    const searchInput = document.getElementById("users-search-input");
    const statusSelect = document.getElementById("users-status-select");
    const sortSelect = document.getElementById("users-sort-select");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim();
        renderTable();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener("change", (e) => {
        filterStatus = e.target.value;
        renderTable();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        sortField = e.target.value;
        renderTable();
      });
    }

    renderTable();
  },

  inspectUser(userId) {
    const user = StorageManager.getUserById(userId);
    if (!user) return;

    const history = StorageManager.getUserHistory(userId);
    const likes = StorageManager.getUserLikedScenes(userId);
    const playlists = StorageManager.getUserPlaylists(userId);
    const userLogs = StorageManager.getActivityLogs().filter(l => l.userId === userId);

    const modal = document.createElement("div");
    modal.className = "modal-overlay active";
    modal.innerHTML = `
      <div class="modal-card modal-lg animate-scale-up">
        <div class="modal-header">
          <div class="modal-user-header">
            <img src="${user.avatar}" class="cell-avatar" alt="${user.name}" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'" />
            <div>
              <h3>${user.name}</h3>
              <small class="text-muted">${user.email} • ID: ${user.id}</small>
            </div>
          </div>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="user-inspect-stats-grid">
            <div class="stat-mini-card">
              <span class="stat-mini-num">${history.length}</span>
              <span class="stat-mini-label">Scenes Watched</span>
            </div>
            <div class="stat-mini-card">
              <span class="stat-mini-num">${likes.length}</span>
              <span class="stat-mini-label">Liked Scenes</span>
            </div>
            <div class="stat-mini-card">
              <span class="stat-mini-num">${playlists.length}</span>
              <span class="stat-mini-label">Playlists</span>
            </div>
            <div class="stat-mini-card">
              <span class="stat-mini-num">${userLogs.length}</span>
              <span class="stat-mini-label">Logged Actions</span>
            </div>
          </div>

          <h4 style="margin:1.5rem 0 0.75rem 0;">User Activity Timeline</h4>
          <div class="activity-timeline-box">
            ${userLogs.length === 0 ? `<p class="text-subtle text-sm">No activity recorded for this user.</p>` : `
              ${userLogs.map(l => {
                const meta = ActivityTracker.getActionMeta(l.action);
                return `
                  <div class="activity-timeline-row">
                    <span class="timeline-icon">${meta.icon}</span>
                    <div class="timeline-body">
                      <span><strong>${meta.label}:</strong> ${l.details}</span>
                      <small class="text-subtle">${new Date(l.timestamp).toLocaleString()}</small>
                    </div>
                  </div>
                `;
              }).join("")}
            `}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary cancel-btn">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      modal.classList.remove("active");
      setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector(".modal-close-btn").onclick = close;
    modal.querySelector(".cancel-btn").onclick = close;
    modal.onclick = (e) => {
      if (e.target === modal) close();
    };
  },

  // 3. SCENE MANAGEMENT (CRUD)
  initScenes() {
    if (!this.initShell()) return;

    let scenes = StorageManager.getScenes();
    let currentCategory = "All";
    let searchQuery = "";

    const renderTable = () => {
      scenes = StorageManager.getScenes();
      const tbody = document.getElementById("scenes-table-body");
      if (!tbody) return;

      let filtered = scenes.filter(s => {
        if (currentCategory !== "All" && s.category !== currentCategory) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return s.title.toLowerCase().includes(q) || s.source.toLowerCase().includes(q);
        }
        return true;
      });

      const countBadge = document.getElementById("scenes-total-count");
      if (countBadge) countBadge.textContent = `${filtered.length} scenes`;

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No scenes found matching criteria.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(s => `
        <tr>
          <td>
            <div class="scene-table-cell">
              <img src="${s.thumbnail}" class="row-thumb" alt="${s.title}" onerror="UI.handleImageError(this, '${s.title.replace(/'/g, "\\'")}')" />
              <div>
                <strong>${s.title}</strong>
                <div class="text-subtle text-xs">${s.source} • ${s.duration}</div>
              </div>
            </div>
          </td>
          <td><span class="category-pill-sm">${s.categoryEmoji || '🎬'} ${s.category}</span></td>
          <td>${Scenes.formatCount(s.views)}</td>
          <td>${Scenes.formatCount(s.likes)}</td>
          <td>★ ${s.rating}</td>
          <td>
            <div class="dna-mini-bars" style="width:70px;">
              <div class="dna-mini-bar intensity" style="width:${s.dna.intensity}%" title="Intensity: ${s.dna.intensity}%"></div>
              <div class="dna-mini-bar action" style="width:${s.dna.action}%" title="Action: ${s.dna.action}%"></div>
              <div class="dna-mini-bar emotion" style="width:${s.dna.emotion}%" title="Emotion: ${s.dna.emotion}%"></div>
            </div>
          </td>
          <td>
            <div class="table-actions-group">
              <a href="../player.html?id=${s.id}" target="_blank" class="btn btn-ghost btn-xs" title="View Scene in Player">▶</a>
              <button class="btn btn-secondary btn-xs" onclick="AdminController.openSceneModal('${s.id}')" title="Edit Scene">✏️</button>
              <button class="btn btn-danger btn-xs" onclick="AdminController.confirmDeleteScene('${s.id}')" title="Delete Scene">🗑️</button>
            </div>
          </td>
        </tr>
      `).join("");
    };

    const addBtn = document.getElementById("btn-add-scene");
    if (addBtn) {
      addBtn.addEventListener("click", () => this.openSceneModal(null));
    }

    const searchInput = document.getElementById("scenes-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim();
        renderTable();
      });
    }

    const catSelect = document.getElementById("scenes-category-select");
    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        currentCategory = e.target.value;
        renderTable();
      });
    }

    renderTable();
    this.refreshScenesTable = renderTable;
  },

  openSceneModal(sceneId = null) {
    const isEdit = !!sceneId;
    const scene = isEdit ? StorageManager.getSceneById(sceneId) : {
      id: "",
      title: "",
      source: "",
      category: "Action",
      duration: "3:30",
      durationSeconds: 210,
      rating: 4.8,
      thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      description: "",
      tags: ["cinematic", "moment"],
      dna: { intensity: 80, emotion: 50, humor: 20, action: 75, romance: 10 }
    };

    const categoryEmojis = {
      "Epic": "🔥", "Comedy": "😂", "Emotional": "😭", "Thriller": "😱",
      "Action": "🥊", "Romance": "❤️", "Plot Twist": "🤯", "Iconic Dialogue": "🎭",
      "Mind-Bending": "🧠"
    };

    const modal = document.createElement("div");
    modal.className = "modal-overlay active";
    modal.innerHTML = `
      <div class="modal-card modal-lg animate-scale-up">
        <div class="modal-header">
          <h3>${isEdit ? 'Edit Scene' : 'Add New Scene'}</h3>
          <button class="modal-close-btn">&times;</button>
        </div>
        <form id="scene-form">
          <div class="modal-body">
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Scene Title</label>
                <input type="text" id="scene-title" class="form-input" value="${scene.title}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Movie / Source Name</label>
                <input type="text" id="scene-source" class="form-input" value="${scene.source}" required />
              </div>
            </div>

            <div class="form-row-3">
              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="scene-category" class="form-select">
                  ${CATEGORIES.map(c => `
                    <option value="${c.id}" ${scene.category === c.id ? 'selected' : ''}>${c.emoji} ${c.name}</option>
                  `).join("")}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Duration (e.g. 4:15)</label>
                <input type="text" id="scene-duration" class="form-input" value="${scene.duration}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Rating (1.0 - 5.0)</label>
                <input type="number" step="0.1" min="1.0" max="5.0" id="scene-rating" class="form-input" value="${scene.rating}" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea id="scene-description" class="form-textarea" rows="2" required>${scene.description}</textarea>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Thumbnail URL</label>
                <input type="url" id="scene-thumbnail" class="form-input" value="${scene.thumbnail}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Video Stream URL</label>
                <input type="url" id="scene-video" class="form-input" value="${scene.video}" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Tags (comma separated)</label>
              <input type="text" id="scene-tags" class="form-input" value="${scene.tags.join(', ')}" placeholder="action, rain, fight" />
            </div>

            <div class="dna-form-section">
              <h4 style="margin-bottom:0.75rem;">🧬 Scene DNA Profile (0 - 100%)</h4>
              <div class="dna-slider-grid">
                <div class="slider-group">
                  <div class="slider-label"><span>⚡ Intensity:</span> <strong id="val-intensity">${scene.dna.intensity}%</strong></div>
                  <input type="range" min="0" max="100" value="${scene.dna.intensity}" id="slider-intensity" class="range-slider" />
                </div>
                <div class="slider-group">
                  <div class="slider-label"><span>💧 Emotion:</span> <strong id="val-emotion">${scene.dna.emotion}%</strong></div>
                  <input type="range" min="0" max="100" value="${scene.dna.emotion}" id="slider-emotion" class="range-slider" />
                </div>
                <div class="slider-group">
                  <div class="slider-label"><span>✨ Humor:</span> <strong id="val-humor">${scene.dna.humor}%</strong></div>
                  <input type="range" min="0" max="100" value="${scene.dna.humor}" id="slider-humor" class="range-slider" />
                </div>
                <div class="slider-group">
                  <div class="slider-label"><span>🥊 Action:</span> <strong id="val-action">${scene.dna.action}%</strong></div>
                  <input type="range" min="0" max="100" value="${scene.dna.action}" id="slider-action" class="range-slider" />
                </div>
                <div class="slider-group">
                  <div class="slider-label"><span>❤️ Romance:</span> <strong id="val-romance">${scene.dna.romance}%</strong></div>
                  <input type="range" min="0" max="100" value="${scene.dna.romance}" id="slider-romance" class="range-slider" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create Scene'}</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Bind slider values
    ["intensity", "emotion", "humor", "action", "romance"].forEach(key => {
      const slider = modal.querySelector(`#slider-${key}`);
      const valLabel = modal.querySelector(`#val-${key}`);
      slider.oninput = (e) => {
        valLabel.textContent = `${e.target.value}%`;
      };
    });

    const close = () => {
      modal.classList.remove("active");
      setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector(".modal-close-btn").onclick = close;
    modal.querySelector(".cancel-btn").onclick = close;

    modal.querySelector("#scene-form").onsubmit = (e) => {
      e.preventDefault();

      const durationStr = modal.querySelector("#scene-duration").value.trim();
      const parts = durationStr.split(":");
      let durationSec = 180;
      if (parts.length === 2) {
        durationSec = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }

      const categoryVal = modal.querySelector("#scene-category").value;
      const rawTags = modal.querySelector("#scene-tags").value.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);

      const sceneData = {
        id: scene.id || ("sc-" + Date.now().toString(36)),
        title: modal.querySelector("#scene-title").value.trim(),
        source: modal.querySelector("#scene-source").value.trim(),
        category: categoryVal,
        categoryEmoji: categoryEmojis[categoryVal] || "🎬",
        duration: durationStr,
        durationSeconds: durationSec,
        rating: parseFloat(modal.querySelector("#scene-rating").value) || 4.5,
        thumbnail: modal.querySelector("#scene-thumbnail").value.trim(),
        video: modal.querySelector("#scene-video").value.trim(),
        description: modal.querySelector("#scene-description").value.trim(),
        tags: rawTags.length > 0 ? rawTags : ["scene"],
        dna: {
          intensity: parseInt(modal.querySelector("#slider-intensity").value),
          emotion: parseInt(modal.querySelector("#slider-emotion").value),
          humor: parseInt(modal.querySelector("#slider-humor").value),
          action: parseInt(modal.querySelector("#slider-action").value),
          romance: parseInt(modal.querySelector("#slider-romance").value)
        },
        views: scene.views || 0,
        likes: scene.likes || 0,
        recentlyAdded: true
      };

      StorageManager.saveScene(sceneData);
      UI.showToast(isEdit ? "Scene updated successfully" : "New scene added successfully", "success");
      close();
      if (this.refreshScenesTable) this.refreshScenesTable();
    };
  },

  async confirmDeleteScene(sceneId) {
    const scene = StorageManager.getSceneById(sceneId);
    if (!scene) return;

    const confirmed = await UI.confirm(
      "Delete Scene",
      `Are you sure you want to delete “${scene.title}”? This will remove it from all user playlists and lists.`,
      "Delete Scene",
      "Cancel"
    );

    if (confirmed) {
      StorageManager.deleteScene(sceneId);
      UI.showToast("Scene deleted successfully", "info");
      if (this.refreshScenesTable) this.refreshScenesTable();
    }
  },

  // 4. ACTIVITY LOGS PAGE
  initActivity() {
    if (!this.initShell()) return;

    let logs = StorageManager.getActivityLogs();
    let filterAction = "all";
    let searchQuery = "";

    const renderLogs = () => {
      logs = StorageManager.getActivityLogs();
      const tbody = document.getElementById("activity-table-body");
      const countBadge = document.getElementById("activity-total-count");
      if (!tbody) return;

      let filtered = logs.filter(log => {
        if (filterAction !== "all") {
          if (filterAction === "auth" && !["login", "logout", "register", "admin_login", "admin_logout"].includes(log.action)) return false;
          if (filterAction === "watch" && log.action !== "watch_scene") return false;
          if (filterAction === "likes" && !["like_scene", "unlike_scene"].includes(log.action)) return false;
          if (filterAction === "playlists" && !["create_playlist", "delete_playlist", "add_to_playlist"].includes(log.action)) return false;
          if (filterAction === "search" && log.action !== "search") return false;
        }

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            log.userName.toLowerCase().includes(q) ||
            log.userEmail.toLowerCase().includes(q) ||
            log.details.toLowerCase().includes(q) ||
            (log.sceneTitle && log.sceneTitle.toLowerCase().includes(q))
          );
        }
        return true;
      });

      if (countBadge) countBadge.textContent = `${filtered.length} entries`;

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No activity logs found.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(log => {
        const meta = ActivityTracker.getActionMeta(log.action);
        return `
          <tr>
            <td>
              <span class="action-type-pill ${meta.badgeClass}">
                ${meta.icon} ${meta.label}
              </span>
            </td>
            <td>
              <strong>${log.userName}</strong>
              <div class="text-subtle text-xs">${log.userEmail}</div>
            </td>
            <td>
              ${log.details}
              ${log.sceneTitle ? `<div class="log-target-scene">🎬 <em>${log.sceneTitle}</em></div>` : ''}
            </td>
            <td>${new Date(log.timestamp).toLocaleString()}</td>
            <td><span class="text-subtle text-xs">${ActivityTracker.formatTimestamp(log.timestamp)}</span></td>
          </tr>
        `;
      }).join("");
    };

    const actionSelect = document.getElementById("activity-action-select");
    if (actionSelect) {
      actionSelect.addEventListener("change", (e) => {
        filterAction = e.target.value;
        renderLogs();
      });
    }

    const searchInput = document.getElementById("activity-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim();
        renderLogs();
      });
    }

    const clearBtn = document.getElementById("btn-clear-activity-logs");
    if (clearBtn) {
      clearBtn.addEventListener("click", async () => {
        const confirmed = await UI.confirm("Clear Activity Logs", "Permanently erase all activity records?", "Clear All", "Cancel");
        if (confirmed) {
          StorageManager.clearActivityLogs();
          UI.showToast("Activity logs cleared", "info");
          renderLogs();
        }
      });
    }

    renderLogs();
  },

  // 5. ANALYTICS PAGE
  initAnalytics() {
    if (!this.initShell()) return;

    const scenes = StorageManager.getScenes();
    const users = StorageManager.getUsers();
    const logs = StorageManager.getActivityLogs();

    const totalViews = scenes.reduce((sum, s) => sum + (s.views || 0), 0);
    const totalLikes = scenes.reduce((sum, s) => sum + (s.likes || 0), 0);
    const avgViews = scenes.length ? Math.round(totalViews / scenes.length) : 0;
    const avgLikes = scenes.length ? Math.round(totalLikes / scenes.length) : 0;

    // Stat cards
    const elViews = document.getElementById("analytics-total-views");
    const elLikes = document.getElementById("analytics-total-likes");
    const elAvgViews = document.getElementById("analytics-avg-views");
    const elAvgLikes = document.getElementById("analytics-avg-likes");

    if (elViews) elViews.textContent = Scenes.formatCount(totalViews);
    if (elLikes) elLikes.textContent = Scenes.formatCount(totalLikes);
    if (elAvgViews) elAvgViews.textContent = Scenes.formatCount(avgViews);
    if (elAvgLikes) elAvgLikes.textContent = Scenes.formatCount(avgLikes);

    // Chart 1: Most Watched Scenes (Top 5 bar chart)
    const mostWatchedContainer = document.getElementById("chart-most-watched");
    if (mostWatchedContainer) {
      const topWatched = [...scenes].sort((a, b) => b.views - a.views).slice(0, 5);
      const maxViews = topWatched[0] ? topWatched[0].views : 1;

      mostWatchedContainer.innerHTML = topWatched.map((s, idx) => {
        const pct = Math.round((s.views / maxViews) * 100);
        return `
          <div class="chart-bar-row">
            <div class="chart-bar-labels">
              <span class="bar-name">#${idx + 1} ${s.title}</span>
              <span class="bar-val">${Scenes.formatCount(s.views)} views</span>
            </div>
            <div class="chart-bar-track">
              <div class="chart-bar-fill gold" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Chart 2: Category Distribution
    const categoryChartContainer = document.getElementById("chart-categories");
    if (categoryChartContainer) {
      const catCounts = {};
      scenes.forEach(s => {
        catCounts[s.category] = (catCounts[s.category] || 0) + 1;
      });

      const maxCatCount = Math.max(...Object.values(catCounts), 1);

      categoryChartContainer.innerHTML = Object.entries(catCounts).map(([cat, count]) => {
        const pct = Math.round((count / scenes.length) * 100);
        return `
          <div class="chart-bar-row">
            <div class="chart-bar-labels">
              <span class="bar-name">${cat}</span>
              <span class="bar-val">${count} scenes (${pct}%)</span>
            </div>
            <div class="chart-bar-track">
              <div class="chart-bar-fill cyan" style="width: ${(count / maxCatCount) * 100}%;"></div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Chart 3: Most Liked Scenes (Top 5)
    const mostLikedContainer = document.getElementById("chart-most-liked");
    if (mostLikedContainer) {
      const topLiked = [...scenes].sort((a, b) => b.likes - a.likes).slice(0, 5);
      const maxLikes = topLiked[0] ? topLiked[0].likes : 1;

      mostLikedContainer.innerHTML = topLiked.map((s, idx) => {
        const pct = Math.round((s.likes / maxLikes) * 100);
        return `
          <div class="chart-bar-row">
            <div class="chart-bar-labels">
              <span class="bar-name">#${idx + 1} ${s.title}</span>
              <span class="bar-val">${Scenes.formatCount(s.likes)} likes</span>
            </div>
            <div class="chart-bar-track">
              <div class="chart-bar-fill red" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Most Active Users
    const activeUsersContainer = document.getElementById("chart-active-users");
    if (activeUsersContainer) {
      const userActivityCount = {};
      logs.forEach(l => {
        if (l.userId && l.userId !== "guest") {
          userActivityCount[l.userId] = (userActivityCount[l.userId] || 0) + 1;
        }
      });

      const sortedUserIds = Object.keys(userActivityCount).sort((a, b) => userActivityCount[b] - userActivityCount[a]).slice(0, 5);
      
      if (sortedUserIds.length === 0) {
        activeUsersContainer.innerHTML = `<p class="text-subtle text-sm">No user activity recorded yet.</p>`;
      } else {
        activeUsersContainer.innerHTML = sortedUserIds.map(uId => {
          const user = StorageManager.getUserById(uId);
          const count = userActivityCount[uId];
          const userName = user ? user.name : uId;
          return `
            <div class="active-user-row">
              <div class="active-user-info">
                <strong>${userName}</strong>
                <span class="text-subtle text-xs">${user ? user.email : ''}</span>
              </div>
              <span class="count-badge">${count} events</span>
            </div>
          `;
        }).join("");
      }
    }
  },

  // 6. ADMIN PROFILE & SYSTEM RESET
  initProfile() {
    if (!this.initShell()) return;

    const resetBtn = document.getElementById("btn-reset-demo-db");
    if (resetBtn) {
      resetBtn.addEventListener("click", async () => {
        const confirmed = await UI.confirm(
          "Reset Platform to Demo State",
          "This will reset all scenes, test accounts, likes, and playlists back to the original demo seed dataset. Proceed?",
          "Reset Data",
          "Cancel"
        );

        if (confirmed) {
          StorageManager.resetAll();
          UI.showToast("Database restored to demo seed!", "success");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    }

    const clearLogsBtn = document.getElementById("btn-clear-system-logs");
    if (clearLogsBtn) {
      clearLogsBtn.addEventListener("click", async () => {
        const confirmed = await UI.confirm("Purge Activity Logs", "Permanently delete all activity tracking records?", "Purge", "Cancel");
        if (confirmed) {
          StorageManager.clearActivityLogs();
          UI.showToast("All system activity logs purged", "info");
        }
      });
    }
  }
};
