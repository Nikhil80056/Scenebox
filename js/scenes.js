/**
 * SceneBox - Scenes Module
 * Handles scene card rendering, category badges, Scene DNA visualization, and interaction triggers.
 */

const Scenes = {
  // Format numbers for views / likes (e.g., 48210 -> "48.2K")
  formatCount(num) {
    if (!num) return "0";
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  },

  // Generate HTML for a single Scene Card
  createSceneCard(scene) {
    const user = Auth.getCurrentUser();
    const isLiked = user ? StorageManager.isLiked(user.id, scene.id) : false;
    const isSaved = user ? StorageManager.isInWatchLater(user.id, scene.id) : false;

    return `
      <div class="scene-card" data-id="${scene.id}">
        <div class="scene-thumbnail-wrap">
          <img 
            src="${scene.thumbnail}" 
            alt="${scene.title}" 
            class="scene-thumbnail" 
            loading="lazy"
            onerror="UI.handleImageError(this, '${scene.title.replace(/'/g, "\\'")}')"
          />
          <div class="thumbnail-overlay">
            <a href="player.html?id=${scene.id}" class="play-scene-btn" aria-label="Watch ${scene.title}">
              <span class="play-icon">▶</span>
              <span class="play-text">Watch Scene</span>
            </a>
          </div>
          <span class="scene-duration-badge">${scene.duration}</span>
          <span class="scene-rating-badge">★ ${scene.rating}</span>
          
          <div class="card-quick-actions">
            <button 
              class="quick-action-btn ${isLiked ? 'active' : ''}" 
              data-action="like" 
              data-id="${scene.id}" 
              title="${isLiked ? 'Unlike' : 'Like'}"
            >
              ${isLiked ? '❤️' : '🤍'}
            </button>
            <button 
              class="quick-action-btn ${isSaved ? 'active' : ''}" 
              data-action="save" 
              data-id="${scene.id}" 
              title="${isSaved ? 'Remove from Watch Later' : 'Save to Watch Later'}"
            >
              ${isSaved ? '🔖' : '📑'}
            </button>
          </div>
        </div>

        <div class="scene-info">
          <div class="scene-meta-row">
            <span class="category-pill">${scene.categoryEmoji || '🎬'} ${scene.category}</span>
            <span class="views-count">${Scenes.formatCount(scene.views)} views</span>
          </div>

          <h3 class="scene-title">
            <a href="player.html?id=${scene.id}">${scene.title}</a>
          </h3>
          <p class="scene-source">${scene.source}</p>

          <div class="scene-dna-mini">
            <span class="dna-mini-label">DNA:</span>
            <div class="dna-mini-bars">
              <div class="dna-mini-bar intensity" title="Intensity: ${scene.dna.intensity}%" style="width: ${scene.dna.intensity}%"></div>
              <div class="dna-mini-bar emotion" title="Emotion: ${scene.dna.emotion}%" style="width: ${scene.dna.emotion}%"></div>
              <div class="dna-mini-bar humor" title="Humor: ${scene.dna.humor}%" style="width: ${scene.dna.humor}%"></div>
              <div class="dna-mini-bar action" title="Action: ${scene.dna.action}%" style="width: ${scene.dna.action}%"></div>
              <div class="dna-mini-bar romance" title="Romance: ${scene.dna.romance}%" style="width: ${scene.dna.romance}%"></div>
            </div>
          </div>

          <div class="scene-tags">
            ${scene.tags.slice(0, 3).map(tag => `<span class="tag-pill">#${tag}</span>`).join("")}
          </div>
        </div>
      </div>
    `;
  },

  // Attach card quick action events (Like / Watch Later)
  attachCardEvents(container) {
    if (!container) return;

    // Like buttons
    container.querySelectorAll('.quick-action-btn[data-action="like"]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const user = Auth.getCurrentUser();
        if (!user) {
          UI.showToast("Please sign in to like scenes.", "info");
          setTimeout(() => {
            window.location.href = "login.html?returnUrl=" + encodeURIComponent(window.location.pathname.split("/").pop());
          }, 1000);
          return;
        }

        const sceneId = btn.getAttribute("data-id");
        const isNowLiked = StorageManager.toggleLike(user.id, sceneId);
        btn.classList.toggle("active", isNowLiked);
        btn.innerHTML = isNowLiked ? "❤️" : "🤍";
        btn.title = isNowLiked ? "Unlike" : "Like";
        UI.showToast(isNowLiked ? "Liked scene ❤️" : "Removed from Liked scenes", "success");
      };
    });

    // Save buttons
    container.querySelectorAll('.quick-action-btn[data-action="save"]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const user = Auth.getCurrentUser();
        if (!user) {
          UI.showToast("Please sign in to save scenes to Watch Later.", "info");
          setTimeout(() => {
            window.location.href = "login.html?returnUrl=" + encodeURIComponent(window.location.pathname.split("/").pop());
          }, 1000);
          return;
        }

        const sceneId = btn.getAttribute("data-id");
        const isNowSaved = StorageManager.toggleWatchLater(user.id, sceneId);
        btn.classList.toggle("active", isNowSaved);
        btn.innerHTML = isNowSaved ? "🔖" : "📑";
        btn.title = isNowSaved ? "Remove from Watch Later" : "Save to Watch Later";
        UI.showToast(isNowSaved ? "Added to Watch Later 🔖" : "Removed from Watch Later", "success");
        
        // Refresh navbar badge if available
        UI.initNavbar();
      };
    });
  },

  // Render scenes grid
  renderGrid(scenes, containerId, emptyMessage = "No scenes found matching criteria.") {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!scenes || scenes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🎬</div>
          <h3>No Scenes Found</h3>
          <p>${emptyMessage}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = scenes.map(scene => this.createSceneCard(scene)).join("");
    this.attachCardEvents(container);
  },

  // Render Scene DNA visual meters (for Scene Player page)
  renderDNAVisualization(dna, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !dna) return;

    const attributes = [
      { key: "intensity", label: "Intensity", value: dna.intensity || 0, color: "var(--accent-epic)", icon: "⚡" },
      { key: "emotion", label: "Emotion", value: dna.emotion || 0, color: "var(--accent-emotional)", icon: "💧" },
      { key: "humor", label: "Humor", value: dna.humor || 0, color: "var(--accent-comedy)", icon: "✨" },
      { key: "action", label: "Action", value: dna.action || 0, color: "var(--accent-action)", icon: "🥊" },
      { key: "romance", label: "Romance", value: dna.romance || 0, color: "var(--accent-romance)", icon: "❤️" }
    ];

    container.innerHTML = `
      <div class="scene-dna-card">
        <div class="dna-card-header">
          <div class="dna-header-title">
            <span class="dna-badge-icon">🧬</span>
            <h4>Scene DNA Analysis</h4>
          </div>
          <span class="dna-header-subtitle">Moment Signature</span>
        </div>
        
        <div class="dna-meters-grid">
          ${attributes.map(attr => `
            <div class="dna-meter-item">
              <div class="meter-info">
                <span class="meter-label">${attr.icon} ${attr.label}</span>
                <span class="meter-val">${attr.value}%</span>
              </div>
              <div class="meter-track">
                <div 
                  class="meter-fill" 
                  style="width: 0%; background: ${attr.color};" 
                  data-target="${attr.value}"
                ></div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    // Trigger smooth bar fill animation
    setTimeout(() => {
      container.querySelectorAll('.meter-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-target') + '%';
      });
    }, 100);
  },

  // Get Recommendations based on user's likes & watch history
  getRecommendations(userId, limit = 6) {
    const allScenes = StorageManager.getScenes();
    if (!userId) {
      // Default to top rated / trending scenes
      return [...allScenes].sort((a, b) => b.rating - a.rating).slice(0, limit);
    }

    const likes = StorageManager.getUserLikedScenes(userId);
    const history = StorageManager.getUserHistory(userId);

    const watchedCategories = new Set([
      ...likes.map(s => s.category),
      ...history.map(s => s.category)
    ]);

    const watchedTags = new Set([
      ...likes.flatMap(s => s.tags || []),
      ...history.flatMap(s => s.tags || [])
    ]);

    const excludedIds = new Set([
      ...likes.map(s => s.id),
      ...history.map(s => s.id)
    ]);

    // Score scenes
    const scored = allScenes.map(scene => {
      let score = 0;
      if (watchedCategories.has(scene.category)) score += 5;
      if (scene.tags) {
        scene.tags.forEach(t => {
          if (watchedTags.has(t)) score += 2;
        });
      }
      if (excludedIds.has(scene.id)) score -= 3; // de-prioritize already watched
      score += (scene.rating || 4) * 0.5;
      return { scene, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(item => item.scene);
  }
};
