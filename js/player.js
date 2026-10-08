/**
 * SceneBox - Player Module
 * Manages video playback, fallback canvas, actions (Like, Save, Share, Playlist), and related scenes.
 */

const Player = {
  currentScene: null,
  videoElement: null,

  init() {
    const params = new URLSearchParams(window.location.search);
    const sceneId = params.get("id");
    const isSurprise = params.get("surprise") === "1";

    if (!sceneId) {
      // Pick first scene or redirect
      const scenes = StorageManager.getScenes();
      if (scenes.length > 0) {
        window.location.replace(`player.html?id=${scenes[0].id}`);
        return;
      }
    }

    const scene = StorageManager.getSceneById(sceneId);
    if (!scene) {
      document.getElementById("player-container").innerHTML = `
        <div class="empty-state">
          <h2>Scene Not Found</h2>
          <p>The requested scene does not exist or has been removed.</p>
          <a href="explore.html" class="btn btn-primary" style="margin-top:1rem;">Explore Other Scenes</a>
        </div>
      `;
      return;
    }

    this.currentScene = scene;

    if (isSurprise) {
      setTimeout(() => {
        UI.showToast("🎲 Your scene of the moment! Enjoy.", "surprise", 4500);
      }, 500);
    }

    this.renderScene(scene);
    this.recordWatch(scene.id);
  },

  recordWatch(sceneId) {
    const user = Auth.getCurrentUser();
    if (user) {
      StorageManager.addToHistory(user.id, sceneId);
    } else {
      StorageManager.incrementViews(sceneId);
      StorageManager.logActivity("watch_scene", "Guest watched scene", sceneId);
    }
  },

  renderScene(scene) {
    document.title = `${scene.title} | SceneBox`;

    // Render Video Player
    const videoWrapper = document.getElementById("video-player-container");
    if (videoWrapper) {
      videoWrapper.innerHTML = `
        <div class="video-frame">
          <video 
            id="main-video-player" 
            controls 
            autoplay 
            playsinline 
            poster="${scene.thumbnail}" 
            class="html5-video"
          >
            <source src="${scene.video}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <canvas id="video-fallback-canvas" class="video-fallback-canvas" style="display:none;"></canvas>
          <div id="video-fallback-overlay" class="video-fallback-overlay" style="display:none;">
            <div class="fallback-content">
              <span class="fallback-icon">🎬</span>
              <h4>Demo Stream Preview</h4>
              <p>Demo video stream offline or blocked by browser CORS. Cinematic canvas generator active.</p>
              <button class="btn btn-secondary btn-sm" id="btn-retry-video">Retry Video</button>
            </div>
          </div>
        </div>
      `;

      this.videoElement = document.getElementById("main-video-player");
      this.setupVideoEvents();
    }

    // Render Metadata
    const metaContainer = document.getElementById("scene-metadata-container");
    if (metaContainer) {
      const user = Auth.getCurrentUser();
      const isLiked = user ? StorageManager.isLiked(user.id, scene.id) : false;
      const isSaved = user ? StorageManager.isInWatchLater(user.id, scene.id) : false;

      metaContainer.innerHTML = `
        <div class="scene-header-block">
          <div class="scene-meta-badges">
            <span class="category-pill">${scene.categoryEmoji || '🎬'} ${scene.category}</span>
            <span class="meta-tag"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${scene.duration}</span>
            <span class="meta-tag text-gold">★ ${scene.rating}</span>
            <span class="meta-tag"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> ${Scenes.formatCount(scene.views)} views</span>
          </div>

          <h1 class="player-scene-title">${scene.title}</h1>
          <p class="player-source-title">from <strong>${scene.source}</strong></p>

          <div class="player-actions-toolbar">
            <button class="btn-action ${isLiked ? 'active' : ''}" id="btn-player-like">
              <span class="action-icon">${isLiked ? '❤️' : '🤍'}</span>
              <span class="action-text">${isLiked ? 'Liked' : 'Like'}</span>
              <span class="action-count" id="player-likes-count">(${Scenes.formatCount(scene.likes)})</span>
            </button>

            <button class="btn-action ${isSaved ? 'active' : ''}" id="btn-player-save">
              <span class="action-icon">${isSaved ? '🔖' : '📑'}</span>
              <span class="action-text">${isSaved ? 'Saved' : 'Watch Later'}</span>
            </button>

            <button class="btn-action" id="btn-player-playlist">
              <span class="action-icon">➕</span>
              <span class="action-text">Add to Playlist</span>
            </button>

            <button class="btn-action" id="btn-player-share">
              <span class="action-icon">↗</span>
              <span class="action-text">Share</span>
            </button>
          </div>
        </div>

        <div class="scene-description-block">
          <h3>About this Moment</h3>
          <p class="scene-description-text">${scene.description}</p>
          <div class="player-tags-list">
            ${scene.tags.map(t => `<a href="search.html?q=${encodeURIComponent(t)}" class="tag-pill">#${t}</a>`).join("")}
          </div>
        </div>
      `;

      this.setupPlayerActionButtons();
    }

    // Render Scene DNA
    Scenes.renderDNAVisualization(scene.dna, "scene-dna-container");

    // Render More From This Movie
    this.renderMoreFromMovie(scene);

    // Render You May Also Like
    this.renderYouMayAlsoLike(scene);
  },

  setupVideoEvents() {
    if (!this.videoElement) return;

    this.videoElement.addEventListener("error", (e) => {
      console.warn("Video failed to stream, enabling graceful canvas visualizer fallback.", e);
      this.activateCanvasFallback();
    });

    const retryBtn = document.getElementById("btn-retry-video");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        this.videoElement.load();
        this.videoElement.play().catch(() => {});
      });
    }
  },

  activateCanvasFallback() {
    const canvas = document.getElementById("video-fallback-canvas");
    const overlay = document.getElementById("video-fallback-overlay");
    if (!canvas || !overlay) return;

    canvas.style.display = "block";
    overlay.style.display = "flex";
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");

    let frame = 0;
    const scene = this.currentScene;

    function drawWave() {
      if (!canvas || canvas.style.display === "none") return;
      ctx.fillStyle = "#0c0e14";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Radial center glow
      const radial = ctx.createRadialGradient(640, 360, 20, 640, 360, 480);
      radial.addColorStop(0, "rgba(245, 158, 11, 0.15)");
      radial.addColorStop(1, "rgba(12, 14, 20, 0.95)");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Audio waveform simulation
      ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 10) {
        const y = 360 + Math.sin((x + frame * 3) * 0.02) * 50 * Math.sin(frame * 0.05);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Title overlay
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(scene.title, 640, 300);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "20px sans-serif";
      ctx.fillText(scene.source, 640, 340);

      frame++;
      requestAnimationFrame(drawWave);
    }

    drawWave();
  },

  setupPlayerActionButtons() {
    const scene = this.currentScene;
    if (!scene) return;

    // Like Action
    const likeBtn = document.getElementById("btn-player-like");
    const likesCountSpan = document.getElementById("player-likes-count");
    if (likeBtn) {
      likeBtn.addEventListener("click", () => {
        const user = Auth.getCurrentUser();
        if (!user) {
          UI.showToast("Please sign in to like scenes.", "info");
          setTimeout(() => {
            window.location.href = `login.html?returnUrl=${encodeURIComponent(window.location.pathname.split("/").pop() + window.location.search)}`;
          }, 1000);
          return;
        }

        const isLiked = StorageManager.toggleLike(user.id, scene.id);
        likeBtn.classList.toggle("active", isLiked);
        likeBtn.querySelector(".action-icon").textContent = isLiked ? "❤️" : "🤍";
        likeBtn.querySelector(".action-text").textContent = isLiked ? "Liked" : "Like";
        
        // Update local object & count
        const updatedScene = StorageManager.getSceneById(scene.id);
        if (updatedScene && likesCountSpan) {
          likesCountSpan.textContent = `(${Scenes.formatCount(updatedScene.likes)})`;
        }

        UI.showToast(isLiked ? "Added to your Liked scenes ❤️" : "Removed from Liked scenes", "success");
      });
    }

    // Save Action
    const saveBtn = document.getElementById("btn-player-save");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const user = Auth.getCurrentUser();
        if (!user) {
          UI.showToast("Please sign in to save scenes.", "info");
          setTimeout(() => {
            window.location.href = `login.html?returnUrl=${encodeURIComponent(window.location.pathname.split("/").pop() + window.location.search)}`;
          }, 1000);
          return;
        }

        const isSaved = StorageManager.toggleWatchLater(user.id, scene.id);
        saveBtn.classList.toggle("active", isSaved);
        saveBtn.querySelector(".action-icon").textContent = isSaved ? "🔖" : "📑";
        saveBtn.querySelector(".action-text").textContent = isSaved ? "Saved" : "Watch Later";
        UI.showToast(isSaved ? "Saved to Watch Later 🔖" : "Removed from Watch Later", "success");
        UI.initNavbar();
      });
    }

    // Share Action
    const shareBtn = document.getElementById("btn-player-share");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const currentUrl = window.location.href;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(currentUrl).then(() => {
            UI.showToast("Scene link copied to clipboard! 📋", "success");
          }).catch(() => {
            UI.showToast("Shareable link: " + currentUrl, "info");
          });
        } else {
          UI.showToast("Shareable link: " + currentUrl, "info");
        }
      });
    }

    // Add to Playlist Action
    const playlistBtn = document.getElementById("btn-player-playlist");
    if (playlistBtn) {
      playlistBtn.addEventListener("click", () => {
        const user = Auth.getCurrentUser();
        if (!user) {
          UI.showToast("Please sign in to add scenes to playlists.", "info");
          setTimeout(() => {
            window.location.href = `login.html?returnUrl=${encodeURIComponent(window.location.pathname.split("/").pop() + window.location.search)}`;
          }, 1000);
          return;
        }

        this.openPlaylistModal(user, scene);
      });
    }
  },

  openPlaylistModal(user, scene) {
    const playlists = StorageManager.getUserPlaylists(user.id);
    const modal = document.createElement("div");
    modal.className = "modal-overlay active";
    modal.id = "playlist-picker-modal";

    modal.innerHTML = `
      <div class="modal-card animate-scale-up">
        <div class="modal-header">
          <h3>Add to Playlist</h3>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p class="text-muted" style="margin-bottom:1rem;">Select a playlist for <strong>${scene.title}</strong>:</p>
          
          <div class="playlist-selection-list">
            ${playlists.length === 0 ? `
              <p class="text-subtle text-sm">No playlists created yet. Create your first one below!</p>
            ` : playlists.map(pl => {
              const alreadyHas = pl.scenes.includes(scene.id);
              return `
                <div class="playlist-pick-item">
                  <div class="playlist-pick-info">
                    <strong>${pl.name}</strong>
                    <span class="text-subtle text-xs">${pl.scenes.length} scenes</span>
                  </div>
                  <button 
                    class="btn btn-sm ${alreadyHas ? 'btn-secondary' : 'btn-primary'} playlist-toggle-scene-btn" 
                    data-id="${pl.id}"
                  >
                    ${alreadyHas ? 'Added ✓' : 'Add +'}
                  </button>
                </div>
              `;
            }).join("")}
          </div>

          <div class="dropdown-divider" style="margin:1.25rem 0;"></div>

          <form id="create-playlist-inline-form" class="inline-create-form">
            <label class="form-label text-sm">Create New Playlist</label>
            <div class="input-button-group">
              <input type="text" id="new-playlist-title" class="form-input" placeholder="e.g. Best Fight Scenes" required maxlength="40" />
              <button type="submit" class="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
      modal.classList.remove("active");
      setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector(".modal-close-btn").onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    // Toggle scene in playlist
    modal.querySelectorAll(".playlist-toggle-scene-btn").forEach(btn => {
      btn.onclick = () => {
        const plId = btn.getAttribute("data-id");
        const pl = StorageManager.getUserPlaylists(user.id).find(p => p.id === plId);
        if (!pl) return;

        if (pl.scenes.includes(scene.id)) {
          StorageManager.removeSceneFromPlaylist(user.id, plId, scene.id);
          btn.className = "btn btn-sm btn-primary playlist-toggle-scene-btn";
          btn.textContent = "Add +";
          UI.showToast(`Removed from '${pl.name}'`, "info");
        } else {
          StorageManager.addSceneToPlaylist(user.id, plId, scene.id);
          btn.className = "btn btn-sm btn-secondary playlist-toggle-scene-btn";
          btn.textContent = "Added ✓";
          UI.showToast(`Added to '${pl.name}' ✓`, "success");
        }
      };
    });

    // Create new playlist form
    const createForm = modal.querySelector("#create-playlist-inline-form");
    createForm.onsubmit = (e) => {
      e.preventDefault();
      const input = modal.querySelector("#new-playlist-title");
      const name = input.value.trim();
      if (!name) return;

      const newPl = StorageManager.createPlaylist(user.id, name);
      if (newPl) {
        StorageManager.addSceneToPlaylist(user.id, newPl.id, scene.id);
        UI.showToast(`Playlist '${name}' created and scene added!`, "success");
        closeModal();
      }
    };
  },

  renderMoreFromMovie(scene) {
    const container = document.getElementById("more-from-movie-grid");
    if (!container) return;

    const allScenes = StorageManager.getScenes();
    // Same source movie or same category, excluding current scene
    const sameMovie = allScenes.filter(s => s.id !== scene.id && s.source.toLowerCase() === scene.source.toLowerCase());
    
    // If not enough from same exact movie, supplement with same category
    let list = [...sameMovie];
    if (list.length < 3) {
      const sameCat = allScenes.filter(s => s.id !== scene.id && !list.some(item => item.id === s.id) && s.category === scene.category);
      list = [...list, ...sameCat];
    }

    Scenes.renderGrid(list.slice(0, 4), "more-from-movie-grid", "No other scenes from this film.");
  },

  renderYouMayAlsoLike(scene) {
    const container = document.getElementById("you-may-also-like-grid");
    if (!container) return;

    const allScenes = StorageManager.getScenes();
    const currentTags = new Set(scene.tags || []);

    const related = allScenes
      .filter(s => s.id !== scene.id)
      .map(s => {
        let matchScore = 0;
        if (s.category === scene.category) matchScore += 3;
        s.tags.forEach(t => {
          if (currentTags.has(t)) matchScore += 2;
        });
        return { scene: s, matchScore };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4)
      .map(item => item.scene);

    Scenes.renderGrid(related, "you-may-also-like-grid", "No recommendations found.");
  }
};
