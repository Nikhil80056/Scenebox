/**
 * SceneBox - Playlists Module
 * Manages custom playlists: creation, renaming, deleting, scene reordering/removal, and viewing.
 */

const PlaylistManager = {
  currentActivePlaylistId: null,

  init() {
    const user = Auth.getCurrentUser();
    if (!user) {
      document.getElementById("playlists-main-container").innerHTML = `
        <div class="empty-state auth-empty-state">
          <div class="empty-icon">📋</div>
          <h2>Sign in to Manage Playlists</h2>
          <p>Organize your favorite film moments, iconic dialogues, and adrenaline-pumping fights into custom playlists.</p>
          <a href="login.html?returnUrl=playlists.html" class="btn btn-primary" style="margin-top:1rem;">Sign In to Your Account</a>
        </div>
      `;
      return;
    }

    this.bindEvents();
    this.renderPlaylists();
  },

  bindEvents() {
    const createBtn = document.getElementById("btn-open-create-playlist");
    if (createBtn) {
      createBtn.addEventListener("click", () => this.openCreateModal());
    }
  },

  renderPlaylists() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const playlists = StorageManager.getUserPlaylists(user.id);
    const container = document.getElementById("playlists-grid");
    if (!container) return;

    if (playlists.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No Playlists Yet</h3>
          <p>Curate your first custom scene collection by clicking the button above.</p>
          <button class="btn btn-primary" style="margin-top:1rem;" onclick="PlaylistManager.openCreateModal()">+ Create Playlist</button>
        </div>
      `;
      return;
    }

    const allScenes = StorageManager.getScenes();

    container.innerHTML = playlists.map(pl => {
      const sceneObjects = pl.scenes.map(id => allScenes.find(s => s.id === id)).filter(Boolean);
      const coverThumb = sceneObjects.length > 0 ? sceneObjects[0].thumbnail : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

      return `
        <div class="playlist-card" data-id="${pl.id}">
          <div class="playlist-cover-wrap">
            <img 
              src="${coverThumb}" 
              alt="${pl.name}" 
              class="playlist-cover-img" 
              onerror="UI.handleImageError(this, '${pl.name.replace(/'/g, "\\'")}')"
            />
            <div class="playlist-count-overlay">
              <span>${pl.scenes.length} scenes</span>
            </div>
          </div>

          <div class="playlist-details">
            <div class="playlist-header-row">
              <h3 class="playlist-title">${pl.name}</h3>
              <div class="playlist-actions-dropdown">
                <button class="btn-icon-more" onclick="PlaylistManager.toggleMenu('${pl.id}')" title="Playlist Options">⋮</button>
                <div class="playlist-dropdown-menu" id="menu-${pl.id}">
                  <button onclick="PlaylistManager.openRenameModal('${pl.id}')">✏️ Rename</button>
                  <button class="text-danger" onclick="PlaylistManager.confirmDelete('${pl.id}')">🗑️ Delete</button>
                </div>
              </div>
            </div>

            <p class="playlist-description">${pl.description || 'No description provided.'}</p>

            <button class="btn btn-secondary btn-sm btn-block" onclick="PlaylistManager.viewPlaylistDetail('${pl.id}')">
              View Playlist (${pl.scenes.length})
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  toggleMenu(id) {
    const menu = document.getElementById(`menu-${id}`);
    if (menu) {
      const isVisible = menu.classList.contains("show");
      document.querySelectorAll(".playlist-dropdown-menu").forEach(m => m.classList.remove("show"));
      if (!isVisible) menu.classList.add("show");
    }
  },

  openCreateModal() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const modal = document.createElement("div");
    modal.className = "modal-overlay active";
    modal.innerHTML = `
      <div class="modal-card animate-scale-up">
        <div class="modal-header">
          <h3>Create New Playlist</h3>
          <button class="modal-close-btn">&times;</button>
        </div>
        <form id="create-pl-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Playlist Name</label>
              <input type="text" id="pl-name-input" class="form-input" placeholder="e.g. My Favorite Fights" required maxlength="50" />
            </div>
            <div class="form-group">
              <label class="form-label">Description (Optional)</label>
              <textarea id="pl-desc-input" class="form-textarea" placeholder="What kind of moments live here?" rows="3" maxlength="150"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Playlist</button>
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
    modal.onclick = (e) => {
      if (e.target === modal) close();
    };

    modal.querySelector("#create-pl-form").onsubmit = (e) => {
      e.preventDefault();
      const name = modal.querySelector("#pl-name-input").value.trim();
      const desc = modal.querySelector("#pl-desc-input").value.trim();
      if (!name) return;

      StorageManager.createPlaylist(user.id, name, desc);
      UI.showToast(`Playlist '${name}' created!`, "success");
      close();
      this.renderPlaylists();
    };
  },

  openRenameModal(playlistId) {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const playlists = StorageManager.getUserPlaylists(user.id);
    const pl = playlists.find(p => p.id === playlistId);
    if (!pl) return;

    const modal = document.createElement("div");
    modal.className = "modal-overlay active";
    modal.innerHTML = `
      <div class="modal-card animate-scale-up">
        <div class="modal-header">
          <h3>Rename Playlist</h3>
          <button class="modal-close-btn">&times;</button>
        </div>
        <form id="rename-pl-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Playlist Name</label>
              <input type="text" id="rename-pl-name" class="form-input" value="${pl.name}" required maxlength="50" />
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea id="rename-pl-desc" class="form-textarea" rows="3" maxlength="150">${pl.description || ''}</textarea>
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

    modal.querySelector("#rename-pl-form").onsubmit = (e) => {
      e.preventDefault();
      const newName = modal.querySelector("#rename-pl-name").value.trim();
      const newDesc = modal.querySelector("#rename-pl-desc").value.trim();
      if (!newName) return;

      StorageManager.renamePlaylist(user.id, playlistId, newName, newDesc);
      UI.showToast("Playlist updated successfully", "success");
      close();
      this.renderPlaylists();
      if (this.currentActivePlaylistId === playlistId) {
        this.viewPlaylistDetail(playlistId);
      }
    };
  },

  async confirmDelete(playlistId) {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const confirmed = await UI.confirm(
      "Delete Playlist",
      "Are you sure you want to permanently delete this playlist? This action cannot be undone.",
      "Delete Playlist",
      "Cancel"
    );

    if (confirmed) {
      StorageManager.deletePlaylist(user.id, playlistId);
      UI.showToast("Playlist deleted successfully", "info");
      this.renderPlaylists();
      
      const detailContainer = document.getElementById("playlist-detail-container");
      if (detailContainer) detailContainer.style.display = "none";
      const grid = document.getElementById("playlists-grid");
      if (grid) grid.style.display = "grid";
    }
  },

  viewPlaylistDetail(playlistId) {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const playlists = StorageManager.getUserPlaylists(user.id);
    const pl = playlists.find(p => p.id === playlistId);
    if (!pl) return;

    this.currentActivePlaylistId = playlistId;

    const allScenes = StorageManager.getScenes();
    const sceneObjects = pl.scenes.map(id => allScenes.find(s => s.id === id)).filter(Boolean);

    const grid = document.getElementById("playlists-grid");
    const detailContainer = document.getElementById("playlist-detail-container");
    if (!detailContainer) return;

    if (grid) grid.style.display = "none";
    detailContainer.style.display = "block";

    detailContainer.innerHTML = `
      <div class="playlist-detail-header">
        <button class="btn btn-ghost btn-sm" onclick="PlaylistManager.closeDetail()">← Back to All Playlists</button>
        <div class="detail-header-content">
          <div>
            <h2 class="section-title">${pl.name}</h2>
            <p class="text-muted">${pl.description || 'Custom scene collection'}</p>
            <span class="text-subtle text-xs">${sceneObjects.length} scenes curated</span>
          </div>
          <div class="detail-header-actions">
            <button class="btn btn-secondary btn-sm" onclick="PlaylistManager.openRenameModal('${pl.id}')">Rename</button>
            <button class="btn btn-danger btn-sm" onclick="PlaylistManager.confirmDelete('${pl.id}')">Delete</button>
          </div>
        </div>
      </div>

      <div class="playlist-scenes-wrapper">
        ${sceneObjects.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">🎬</div>
            <h3>This playlist is empty</h3>
            <p>Browse scenes and tap 'Add to Playlist' on any scene player or card to curate this collection.</p>
            <a href="explore.html" class="btn btn-primary" style="margin-top:1rem;">Explore Scenes</a>
          </div>
        ` : `
          <div class="playlist-items-table">
            ${sceneObjects.map((s, idx) => `
              <div class="playlist-row-item">
                <span class="row-num">${idx + 1}</span>
                <img src="${s.thumbnail}" class="row-thumb" alt="${s.title}" onerror="UI.handleImageError(this, '${s.title.replace(/'/g, "\\'")}')" />
                <div class="row-meta">
                  <a href="player.html?id=${s.id}" class="row-title">${s.title}</a>
                  <span class="row-source">${s.source} • ${s.categoryEmoji || ''} ${s.category}</span>
                </div>
                <span class="row-duration">${s.duration}</span>
                <button class="btn-icon-remove" title="Remove from playlist" onclick="PlaylistManager.removeScene('${pl.id}', '${s.id}')">✕</button>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    `;
  },

  removeScene(playlistId, sceneId) {
    const user = Auth.getCurrentUser();
    if (!user) return;

    StorageManager.removeSceneFromPlaylist(user.id, playlistId, sceneId);
    UI.showToast("Scene removed from playlist", "info");
    this.viewPlaylistDetail(playlistId);
    this.renderPlaylists();
  },

  closeDetail() {
    this.currentActivePlaylistId = null;
    const grid = document.getElementById("playlists-grid");
    const detailContainer = document.getElementById("playlist-detail-container");
    if (detailContainer) detailContainer.style.display = "none";
    if (grid) grid.style.display = "grid";
    this.renderPlaylists();
  }
};

document.addEventListener("click", (e) => {
  if (!e.target.closest(".playlist-actions-dropdown")) {
    document.querySelectorAll(".playlist-dropdown-menu").forEach(m => m.classList.remove("show"));
  }
});
