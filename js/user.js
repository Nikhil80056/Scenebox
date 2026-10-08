/**
 * SceneBox - User & Profile Module
 * Handles User Profile, Watch Later view, and Watch History view.
 */

const UserManager = {
  // Init Profile Page
  initProfile() {
    const user = Auth.getCurrentUser();
    if (!user) {
      Auth.requireUser("login.html");
      return;
    }

    StorageManager.logActivity("open_profile", "Viewed personal profile", null, user);

    this.renderProfileHeader(user);
    this.renderProfileStats(user);
    this.setupProfileTabs(user);
    this.loadProfileTabContent("liked", user);
  },

  renderProfileHeader(user) {
    const header = document.getElementById("profile-header-card");
    if (!header) return;

    const joinedFormatted = new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    header.innerHTML = `
      <div class="profile-avatar-wrap">
        <img src="${user.avatar}" alt="${user.name}" class="profile-avatar-lg" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'" />
      </div>
      <div class="profile-info-text">
        <div class="profile-name-row">
          <h2 class="profile-name">${user.name}</h2>
          <span class="badge-role">Member</span>
        </div>
        <p class="profile-email">${user.email}</p>
        <p class="profile-joined text-subtle text-xs">Member since ${joinedFormatted}</p>
      </div>
      <div class="profile-header-actions">
        <button class="btn btn-secondary btn-sm" id="btn-edit-profile">Edit Profile</button>
        <button class="btn btn-ghost btn-sm text-danger" onclick="Auth.logoutUser('index.html')">Sign Out</button>
      </div>
    `;

    const editBtn = document.getElementById("btn-edit-profile");
    if (editBtn) {
      editBtn.addEventListener("click", () => this.openEditProfileModal(user));
    }
  },

  openEditProfileModal(user) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay active";
    modal.innerHTML = `
      <div class="modal-card animate-scale-up">
        <div class="modal-header">
          <h3>Edit Profile</h3>
          <button class="modal-close-btn">&times;</button>
        </div>
        <form id="edit-profile-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="edit-user-name" class="form-input" value="${user.name}" required minlength="2" />
            </div>
            <div class="form-group">
              <label class="form-label">Avatar URL (Optional)</label>
              <input type="url" id="edit-user-avatar" class="form-input" value="${user.avatar || ''}" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      modal.classList.remove("active");
      setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector(".modal-close-btn").onclick = close;
    modal.querySelector(".cancel-btn").onclick = close;

    modal.querySelector("#edit-profile-form").onsubmit = (e) => {
      e.preventDefault();
      const newName = modal.querySelector("#edit-user-name").value.trim();
      const newAvatar = modal.querySelector("#edit-user-avatar").value.trim() || user.avatar;

      if (!newName) return;

      const updated = StorageManager.updateUser({
        ...user,
        name: newName,
        avatar: newAvatar
      });

      UI.showToast("Profile updated successfully", "success");
      close();
      this.renderProfileHeader(updated);
      UI.initNavbar();
    };
  },

  renderProfileStats(user) {
    const statsContainer = document.getElementById("profile-stats-grid");
    if (!statsContainer) return;

    const history = StorageManager.getUserHistory(user.id);
    const likes = StorageManager.getUserLikedScenes(user.id);
    const watchLater = StorageManager.getUserWatchLaterScenes(user.id);
    const playlists = StorageManager.getUserPlaylists(user.id);

    statsContainer.innerHTML = `
      <div class="stat-card">
        <span class="stat-icon">▶</span>
        <div class="stat-meta">
          <span class="stat-value">${history.length}</span>
          <span class="stat-label">Scenes Watched</span>
        </div>
      </div>

      <div class="stat-card">
        <span class="stat-icon text-danger">❤️</span>
        <div class="stat-meta">
          <span class="stat-value">${likes.length}</span>
          <span class="stat-label">Liked Moments</span>
        </div>
      </div>

      <div class="stat-card">
        <span class="stat-icon text-gold">🔖</span>
        <div class="stat-meta">
          <span class="stat-value">${watchLater.length}</span>
          <span class="stat-label">Watch Later</span>
        </div>
      </div>

      <div class="stat-card">
        <span class="stat-icon text-cyan">📋</span>
        <div class="stat-meta">
          <span class="stat-value">${playlists.length}</span>
          <span class="stat-label">Playlists Curated</span>
        </div>
      </div>
    `;
  },

  setupProfileTabs(user) {
    const tabs = document.querySelectorAll(".profile-nav-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const tabKey = tab.getAttribute("data-tab");
        this.loadProfileTabContent(tabKey, user);
      });
    });
  },

  loadProfileTabContent(tabKey, user) {
    const target = document.getElementById("profile-tab-content");
    if (!target) return;

    if (tabKey === "liked") {
      const likedScenes = StorageManager.getUserLikedScenes(user.id);
      if (likedScenes.length === 0) {
        target.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">❤️</div>
            <h3>No Liked Scenes Yet</h3>
            <p>Explore thrilling scenes and tap the heart icon to save your favorite cinema moments here.</p>
            <a href="explore.html" class="btn btn-primary" style="margin-top:1rem;">Discover Scenes</a>
          </div>
        `;
        return;
      }
      target.innerHTML = `<div class="scenes-grid" id="profile-liked-grid"></div>`;
      Scenes.renderGrid(likedScenes, "profile-liked-grid");
    } else if (tabKey === "watch-later") {
      const savedScenes = StorageManager.getUserWatchLaterScenes(user.id);
      if (savedScenes.length === 0) {
        target.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🔖</div>
            <h3>Watch Later is Empty</h3>
            <p>Save scenes you want to watch when you have a moment.</p>
            <a href="explore.html" class="btn btn-primary" style="margin-top:1rem;">Discover Scenes</a>
          </div>
        `;
        return;
      }
      target.innerHTML = `<div class="scenes-grid" id="profile-watchlater-grid"></div>`;
      Scenes.renderGrid(savedScenes, "profile-watchlater-grid");
    } else if (tabKey === "history") {
      const history = StorageManager.getUserHistory(user.id);
      if (history.length === 0) {
        target.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🕒</div>
            <h3>No Watch History</h3>
            <p>Start watching scenes to see your playback history recorded here.</p>
            <a href="explore.html" class="btn btn-primary" style="margin-top:1rem;">Start Watching</a>
          </div>
        `;
        return;
      }
      target.innerHTML = `
        <div class="history-list-table">
          ${history.map(item => `
            <div class="history-item-row">
              <img src="${item.thumbnail}" class="row-thumb" alt="${item.title}" onerror="UI.handleImageError(this, '${item.title.replace(/'/g, "\\'")}')" />
              <div class="row-meta">
                <a href="player.html?id=${item.id}" class="row-title">${item.title}</a>
                <span class="row-source">${item.source} • ${item.categoryEmoji || ''} ${item.category}</span>
              </div>
              <span class="row-timestamp">${new Date(item.watchedAt).toLocaleString()}</span>
            </div>
          `).join("")}
        </div>
      `;
    } else if (tabKey === "playlists") {
      const playlists = StorageManager.getUserPlaylists(user.id);
      if (playlists.length === 0) {
        target.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>No Playlists</h3>
            <p>You haven't created any playlists yet.</p>
            <a href="playlists.html" class="btn btn-primary" style="margin-top:1rem;">Manage Playlists</a>
          </div>
        `;
        return;
      }
      target.innerHTML = `
        <div class="playlists-grid">
          ${playlists.map(pl => `
            <div class="playlist-card" style="cursor:pointer;" onclick="window.location.href='playlists.html'">
              <div class="playlist-details">
                <h3>${pl.name}</h3>
                <p class="playlist-description">${pl.description || 'Collection'}</p>
                <span class="text-subtle text-xs">${pl.scenes.length} scenes</span>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }
  },

  // Init Watch Later dedicated page
  initWatchLater() {
    const user = Auth.getCurrentUser();
    if (!user) {
      document.getElementById("watch-later-content").innerHTML = `
        <div class="empty-state auth-empty-state">
          <div class="empty-icon">🔖</div>
          <h2>Sign in to view Watch Later</h2>
          <p>Keep track of moments you want to enjoy when you have time.</p>
          <a href="login.html?returnUrl=watch-later.html" class="btn btn-primary" style="margin-top:1rem;">Sign In</a>
        </div>
      `;
      return;
    }

    this.renderWatchLaterList(user);

    const clearBtn = document.getElementById("btn-clear-watch-later");
    if (clearBtn) {
      clearBtn.addEventListener("click", async () => {
        const confirmed = await UI.confirm("Clear Watch Later", "Remove all scenes from your Watch Later list?", "Clear All", "Cancel");
        if (confirmed) {
          StorageManager.clearWatchLater(user.id);
          UI.showToast("Watch Later cleared", "info");
          UI.initNavbar();
          this.renderWatchLaterList(user);
        }
      });
    }
  },

  renderWatchLaterList(user) {
    const list = StorageManager.getUserWatchLaterScenes(user.id);
    const container = document.getElementById("watch-later-grid");
    const countBadge = document.getElementById("watch-later-count-badge");
    const clearBtn = document.getElementById("btn-clear-watch-later");

    if (countBadge) countBadge.textContent = `${list.length} scenes saved`;
    if (clearBtn) clearBtn.style.display = list.length > 0 ? "inline-flex" : "none";

    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔖</div>
          <h3>Your Watch Later is Empty</h3>
          <p>Browse scenes and click the bookmark icon on any card to save it for later.</p>
          <a href="explore.html" class="btn btn-primary" style="margin-top:1rem;">Explore Scenes</a>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(scene => `
      <div class="watch-later-card-item">
        ${Scenes.createSceneCard(scene)}
        <button class="btn btn-danger btn-sm remove-wl-btn" onclick="UserManager.removeSingleWatchLater('${scene.id}')">
          Remove from Watch Later
        </button>
      </div>
    `).join("");

    Scenes.attachCardEvents(container);
  },

  removeSingleWatchLater(sceneId) {
    const user = Auth.getCurrentUser();
    if (!user) return;
    StorageManager.removeFromWatchLater(user.id, sceneId);
    UI.showToast("Removed from Watch Later", "info");
    UI.initNavbar();
    this.renderWatchLaterList(user);
  },

  // Init Watch History dedicated page
  initWatchHistory() {
    const user = Auth.getCurrentUser();
    if (!user) {
      document.getElementById("history-content").innerHTML = `
        <div class="empty-state auth-empty-state">
          <div class="empty-icon">🕒</div>
          <h2>Sign in to view Watch History</h2>
          <p>Review moments you've experienced across all your devices.</p>
          <a href="login.html?returnUrl=history.html" class="btn btn-primary" style="margin-top:1rem;">Sign In</a>
        </div>
      `;
      return;
    }

    this.renderWatchHistoryList(user);

    const clearBtn = document.getElementById("btn-clear-history");
    if (clearBtn) {
      clearBtn.addEventListener("click", async () => {
        const confirmed = await UI.confirm("Clear Watch History", "Are you sure you want to clear your entire watch history?", "Clear History", "Cancel");
        if (confirmed) {
          StorageManager.clearHistory(user.id);
          UI.showToast("Watch history cleared", "info");
          this.renderWatchHistoryList(user);
        }
      });
    }
  },

  renderWatchHistoryList(user) {
    const history = StorageManager.getUserHistory(user.id);
    const container = document.getElementById("history-list-container");
    const countBadge = document.getElementById("history-count-badge");
    const clearBtn = document.getElementById("btn-clear-history");

    if (countBadge) countBadge.textContent = `${history.length} scenes recorded`;
    if (clearBtn) clearBtn.style.display = history.length > 0 ? "inline-flex" : "none";

    if (!container) return;

    if (history.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🕒</div>
          <h3>No Watch History</h3>
          <p>Scenes you watch will automatically be recorded here so you can revisit them anytime.</p>
          <a href="explore.html" class="btn btn-primary" style="margin-top:1rem;">Discover Scenes</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="history-table">
        ${history.map(item => `
          <div class="history-row">
            <div class="history-thumb-col">
              <a href="player.html?id=${item.id}">
                <img src="${item.thumbnail}" class="row-thumb" alt="${item.title}" onerror="UI.handleImageError(this, '${item.title.replace(/'/g, "\\'")}')" />
              </a>
            </div>
            <div class="history-details-col">
              <a href="player.html?id=${item.id}" class="row-title">${item.title}</a>
              <span class="row-source">${item.source} • <span class="category-pill-sm">${item.categoryEmoji || ''} ${item.category}</span></span>
              <span class="row-watched-time">Watched ${new Date(item.watchedAt).toLocaleString()}</span>
            </div>
            <div class="history-actions-col">
              <a href="player.html?id=${item.id}" class="btn btn-secondary btn-sm">Rewatch</a>
              <button class="btn-icon-remove" title="Remove from history" onclick="UserManager.removeSingleHistory('${item.id}')">✕</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  },

  removeSingleHistory(sceneId) {
    const user = Auth.getCurrentUser();
    if (!user) return;
    StorageManager.removeFromHistory(user.id, sceneId);
    UI.showToast("Removed from history", "info");
    this.renderWatchHistoryList(user);
  }
};
