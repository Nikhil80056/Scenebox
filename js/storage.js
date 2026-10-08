/**
 * SceneBox - LocalStorage Manager
 * Handles data persistence, querying, and updating across user and admin modules.
 */

const STORAGE_KEYS = {
  SCENES: "scenebox_scenes",
  USERS: "scenebox_users",
  CURRENT_USER: "scenebox_currentUser",
  ADMIN_SESSION: "scenebox_adminSession",
  LIKES: "scenebox_likes",
  WATCH_LATER: "scenebox_watchLater",
  WATCH_HISTORY: "scenebox_watchHistory",
  PLAYLISTS: "scenebox_playlists",
  ACTIVITY_LOGS: "scenebox_activityLogs"
};

const StorageManager = {
  // Initialize storage with demo seed if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.SCENES)) {
      this.set(STORAGE_KEYS.SCENES, INITIAL_SCENES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.set(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LIKES)) {
      this.set(STORAGE_KEYS.LIKES, INITIAL_LIKES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.WATCH_LATER)) {
      this.set(STORAGE_KEYS.WATCH_LATER, INITIAL_WATCH_LATER);
    }
    if (!localStorage.getItem(STORAGE_KEYS.WATCH_HISTORY)) {
      this.set(STORAGE_KEYS.WATCH_HISTORY, INITIAL_WATCH_HISTORY);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PLAYLISTS)) {
      this.set(STORAGE_KEYS.PLAYLISTS, INITIAL_PLAYLISTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
      this.set(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
    }
  },

  // Reset to original demo data
  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    this.set(STORAGE_KEYS.SCENES, INITIAL_SCENES);
    this.set(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.set(STORAGE_KEYS.LIKES, INITIAL_LIKES);
    this.set(STORAGE_KEYS.WATCH_LATER, INITIAL_WATCH_LATER);
    this.set(STORAGE_KEYS.WATCH_HISTORY, INITIAL_WATCH_HISTORY);
    this.set(STORAGE_KEYS.PLAYLISTS, INITIAL_PLAYLISTS);
    this.set(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error parsing localStorage key ${key}:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error setting localStorage key ${key}:`, e);
      return false;
    }
  },

  // SCENES
  getScenes() {
    return this.get(STORAGE_KEYS.SCENES, []);
  },

  getSceneById(id) {
    const scenes = this.getScenes();
    return scenes.find(s => s.id === id) || null;
  },

  saveScene(sceneData) {
    const scenes = this.getScenes();
    let resultScene;
    const existingIndex = scenes.findIndex(s => s.id === sceneData.id);

    if (existingIndex >= 0) {
      resultScene = { ...scenes[existingIndex], ...sceneData };
      scenes[existingIndex] = resultScene;
    } else {
      resultScene = {
        ...sceneData,
        id: sceneData.id || "sc-" + Date.now().toString(36),
        views: sceneData.views || 0,
        likes: sceneData.likes || 0,
        rating: sceneData.rating || 4.5,
        recentlyAdded: true
      };
      scenes.unshift(resultScene);
    }

    this.set(STORAGE_KEYS.SCENES, scenes);
    return resultScene;
  },

  deleteScene(id) {
    const scenes = this.getScenes().filter(s => s.id !== id);
    this.set(STORAGE_KEYS.SCENES, scenes);

    // Clean references in likes & watch later
    const likes = this.get(STORAGE_KEYS.LIKES, {});
    Object.keys(likes).forEach(u => {
      likes[u] = likes[u].filter(sId => sId !== id);
    });
    this.set(STORAGE_KEYS.LIKES, likes);

    const watchLater = this.get(STORAGE_KEYS.WATCH_LATER, {});
    Object.keys(watchLater).forEach(u => {
      watchLater[u] = watchLater[u].filter(sId => sId !== id);
    });
    this.set(STORAGE_KEYS.WATCH_LATER, watchLater);

    return true;
  },

  incrementViews(sceneId) {
    const scenes = this.getScenes();
    const scene = scenes.find(s => s.id === sceneId);
    if (scene) {
      scene.views = (scene.views || 0) + 1;
      this.set(STORAGE_KEYS.SCENES, scenes);
    }
  },

  // USERS
  getUsers() {
    return this.get(STORAGE_KEYS.USERS, []);
  },

  getUserById(id) {
    return this.getUsers().find(u => u.id === id) || null;
  },

  getUserByEmail(email) {
    if (!email) return null;
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  addUser(userData) {
    const users = this.getUsers();
    const newUser = {
      ...userData,
      id: "usr-" + Date.now().toString(36),
      role: "user",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`
    };
    users.push(newUser);
    this.set(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  updateUser(userData) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userData.id);
    if (index >= 0) {
      users[index] = { ...users[index], ...userData };
      this.set(STORAGE_KEYS.USERS, users);

      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userData.id) {
        this.setCurrentUser(users[index]);
      }
      return users[index];
    }
    return null;
  },

  updateUserLastActive(userId) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.lastActive = new Date().toISOString();
      this.set(STORAGE_KEYS.USERS, users);
    }
  },

  getCurrentUser() {
    return this.get(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user) {
    if (user) {
      this.updateUserLastActive(user.id);
    }
    return this.set(STORAGE_KEYS.CURRENT_USER, user);
  },

  logoutUser() {
    const user = this.getCurrentUser();
    if (user) {
      this.logActivity("logout", "Logged out from SceneBox", null, user);
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // ADMIN
  getAdminSession() {
    return this.get(STORAGE_KEYS.ADMIN_SESSION, null);
  },

  setAdminSession(session) {
    return this.set(STORAGE_KEYS.ADMIN_SESSION, session);
  },

  logoutAdmin() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  },

  // LIKES
  isLiked(userId, sceneId) {
    if (!userId || !sceneId) return false;
    const likes = this.get(STORAGE_KEYS.LIKES, {});
    const userLikes = likes[userId] || [];
    return userLikes.includes(sceneId);
  },

  toggleLike(userId, sceneId) {
    if (!userId || !sceneId) return false;
    const likes = this.get(STORAGE_KEYS.LIKES, {});
    if (!likes[userId]) likes[userId] = [];

    const isCurrentlyLiked = likes[userId].includes(sceneId);
    const scenes = this.getScenes();
    const scene = scenes.find(s => s.id === sceneId);

    if (isCurrentlyLiked) {
      likes[userId] = likes[userId].filter(id => id !== sceneId);
      if (scene) scene.likes = Math.max(0, (scene.likes || 1) - 1);
      this.logActivity("unlike_scene", "Unliked scene", sceneId);
    } else {
      likes[userId].push(sceneId);
      if (scene) scene.likes = (scene.likes || 0) + 1;
      this.logActivity("like_scene", "Liked scene", sceneId);
    }

    this.set(STORAGE_KEYS.LIKES, likes);
    this.set(STORAGE_KEYS.SCENES, scenes);
    return !isCurrentlyLiked;
  },

  getUserLikedScenes(userId) {
    if (!userId) return [];
    const likes = this.get(STORAGE_KEYS.LIKES, {});
    const sceneIds = likes[userId] || [];
    const scenes = this.getScenes();
    return scenes.filter(s => sceneIds.includes(s.id));
  },

  // WATCH LATER
  isInWatchLater(userId, sceneId) {
    if (!userId || !sceneId) return false;
    const watchLater = this.get(STORAGE_KEYS.WATCH_LATER, {});
    const userList = watchLater[userId] || [];
    return userList.includes(sceneId);
  },

  toggleWatchLater(userId, sceneId) {
    if (!userId || !sceneId) return false;
    const watchLater = this.get(STORAGE_KEYS.WATCH_LATER, {});
    if (!watchLater[userId]) watchLater[userId] = [];

    const isSaved = watchLater[userId].includes(sceneId);

    if (isSaved) {
      watchLater[userId] = watchLater[userId].filter(id => id !== sceneId);
      this.logActivity("remove_watch_later", "Removed from Watch Later", sceneId);
    } else {
      watchLater[userId].push(sceneId);
      this.logActivity("save_watch_later", "Saved to Watch Later", sceneId);
    }

    this.set(STORAGE_KEYS.WATCH_LATER, watchLater);
    return !isSaved;
  },

  getUserWatchLaterScenes(userId) {
    if (!userId) return [];
    const watchLater = this.get(STORAGE_KEYS.WATCH_LATER, {});
    const sceneIds = watchLater[userId] || [];
    const scenes = this.getScenes();
    return scenes.filter(s => sceneIds.includes(s.id));
  },

  removeFromWatchLater(userId, sceneId) {
    if (!userId || !sceneId) return;
    const watchLater = this.get(STORAGE_KEYS.WATCH_LATER, {});
    if (watchLater[userId]) {
      watchLater[userId] = watchLater[userId].filter(id => id !== sceneId);
      this.set(STORAGE_KEYS.WATCH_LATER, watchLater);
      this.logActivity("remove_watch_later", "Removed from Watch Later", sceneId);
    }
  },

  clearWatchLater(userId) {
    if (!userId) return;
    const watchLater = this.get(STORAGE_KEYS.WATCH_LATER, {});
    watchLater[userId] = [];
    this.set(STORAGE_KEYS.WATCH_LATER, watchLater);
  },

  // WATCH HISTORY
  addToHistory(userId, sceneId) {
    if (!userId || !sceneId) return;
    const history = this.get(STORAGE_KEYS.WATCH_HISTORY, {});
    if (!history[userId]) history[userId] = [];

    // Filter out previous entry if any to move to top
    history[userId] = history[userId].filter(item => item.sceneId !== sceneId);
    history[userId].unshift({
      sceneId: sceneId,
      timestamp: new Date().toISOString()
    });

    // Keep max 50 items
    if (history[userId].length > 50) {
      history[userId] = history[userId].slice(0, 50);
    }

    this.set(STORAGE_KEYS.WATCH_HISTORY, history);
    this.incrementViews(sceneId);
    this.logActivity("watch_scene", "Watched scene", sceneId);
    this.updateUserLastActive(userId);
  },

  getUserHistory(userId) {
    if (!userId) return [];
    const history = this.get(STORAGE_KEYS.WATCH_HISTORY, {});
    const userHistory = history[userId] || [];
    const scenes = this.getScenes();

    return userHistory
      .map(entry => {
        const scene = scenes.find(s => s.id === entry.sceneId);
        return scene ? { ...scene, watchedAt: entry.timestamp } : null;
      })
      .filter(Boolean);
  },

  removeFromHistory(userId, sceneId) {
    if (!userId) return;
    const history = this.get(STORAGE_KEYS.WATCH_HISTORY, {});
    if (history[userId]) {
      history[userId] = history[userId].filter(h => h.sceneId !== sceneId);
      this.set(STORAGE_KEYS.WATCH_HISTORY, history);
    }
  },

  clearHistory(userId) {
    if (!userId) return;
    const history = this.get(STORAGE_KEYS.WATCH_HISTORY, {});
    history[userId] = [];
    this.set(STORAGE_KEYS.WATCH_HISTORY, history);
  },

  // PLAYLISTS
  getUserPlaylists(userId) {
    if (!userId) return [];
    const playlists = this.get(STORAGE_KEYS.PLAYLISTS, {});
    return playlists[userId] || [];
  },

  createPlaylist(userId, name, description = "") {
    if (!userId || !name) return null;
    const playlists = this.get(STORAGE_KEYS.PLAYLISTS, {});
    if (!playlists[userId]) playlists[userId] = [];

    const newPlaylist = {
      id: "pl-" + Date.now().toString(36),
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      scenes: []
    };

    playlists[userId].push(newPlaylist);
    this.set(STORAGE_KEYS.PLAYLISTS, playlists);
    this.logActivity("create_playlist", `Created playlist '${newPlaylist.name}'`);
    return newPlaylist;
  },

  renamePlaylist(userId, playlistId, newName, newDescription) {
    if (!userId || !playlistId) return false;
    const playlists = this.get(STORAGE_KEYS.PLAYLISTS, {});
    const userPlaylists = playlists[userId] || [];
    const playlist = userPlaylists.find(p => p.id === playlistId);

    if (playlist) {
      if (newName) playlist.name = newName.trim();
      if (newDescription !== undefined) playlist.description = newDescription.trim();
      this.set(STORAGE_KEYS.PLAYLISTS, playlists);
      return true;
    }
    return false;
  },

  deletePlaylist(userId, playlistId) {
    if (!userId || !playlistId) return false;
    const playlists = this.get(STORAGE_KEYS.PLAYLISTS, {});
    if (playlists[userId]) {
      const target = playlists[userId].find(p => p.id === playlistId);
      playlists[userId] = playlists[userId].filter(p => p.id !== playlistId);
      this.set(STORAGE_KEYS.PLAYLISTS, playlists);
      if (target) {
        this.logActivity("delete_playlist", `Deleted playlist '${target.name}'`);
      }
      return true;
    }
    return false;
  },

  addSceneToPlaylist(userId, playlistId, sceneId) {
    if (!userId || !playlistId || !sceneId) return false;
    const playlists = this.get(STORAGE_KEYS.PLAYLISTS, {});
    const userPlaylists = playlists[userId] || [];
    const playlist = userPlaylists.find(p => p.id === playlistId);

    if (playlist) {
      if (!playlist.scenes.includes(sceneId)) {
        playlist.scenes.push(sceneId);
        this.set(STORAGE_KEYS.PLAYLISTS, playlists);
        this.logActivity("add_to_playlist", `Added scene to playlist '${playlist.name}'`, sceneId);
        return true;
      }
    }
    return false;
  },

  removeSceneFromPlaylist(userId, playlistId, sceneId) {
    if (!userId || !playlistId || !sceneId) return false;
    const playlists = this.get(STORAGE_KEYS.PLAYLISTS, {});
    const userPlaylists = playlists[userId] || [];
    const playlist = userPlaylists.find(p => p.id === playlistId);

    if (playlist) {
      playlist.scenes = playlist.scenes.filter(sId => sId !== sceneId);
      this.set(STORAGE_KEYS.PLAYLISTS, playlists);
      return true;
    }
    return false;
  },

  // ACTIVITY LOGS
  logActivity(action, details, sceneId = null, userOverride = null) {
    const user = userOverride || this.getCurrentUser();
    const logs = this.get(STORAGE_KEYS.ACTIVITY_LOGS, []);

    let sceneTitle = null;
    if (sceneId) {
      const scene = this.getSceneById(sceneId);
      if (scene) sceneTitle = scene.title;
    }

    const logEntry = {
      id: "act-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 5),
      userId: user ? user.id : "guest",
      userName: user ? user.name : "Guest Visitor",
      userEmail: user ? user.email : "guest@scenebox.local",
      action: action,
      details: details,
      sceneId: sceneId,
      sceneTitle: sceneTitle,
      timestamp: new Date().toISOString()
    };

    logs.unshift(logEntry);
    // Keep max 200 logs
    if (logs.length > 200) {
      logs.pop();
    }

    this.set(STORAGE_KEYS.ACTIVITY_LOGS, logs);
    return logEntry;
  },

  getActivityLogs() {
    return this.get(STORAGE_KEYS.ACTIVITY_LOGS, []);
  },

  clearActivityLogs() {
    this.set(STORAGE_KEYS.ACTIVITY_LOGS, []);
  }
};

// Auto-initialize on load
StorageManager.init();
