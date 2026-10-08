/**
 * SceneBox - Activity Tracking Module
 * Provides formatters, icons, and filter helpers for activity logs.
 */

const ActivityTracker = {
  getActionMeta(action) {
    switch (action) {
      case "login":
        return { icon: "🟢", label: "Logged In", badgeClass: "badge-success" };
      case "logout":
        return { icon: "⚪", label: "Logged Out", badgeClass: "badge-muted" };
      case "register":
        return { icon: "✨", label: "Account Created", badgeClass: "badge-cyan" };
      case "search":
        return { icon: "🔎", label: "Searched", badgeClass: "badge-info" };
      case "watch_scene":
        return { icon: "▶️", label: "Watched Scene", badgeClass: "badge-primary" };
      case "like_scene":
        return { icon: "❤️", label: "Liked Scene", badgeClass: "badge-danger" };
      case "unlike_scene":
        return { icon: "🤍", label: "Unliked Scene", badgeClass: "badge-muted" };
      case "save_watch_later":
        return { icon: "🔖", label: "Saved for Later", badgeClass: "badge-warning" };
      case "remove_watch_later":
        return { icon: "📑", label: "Removed Saved", badgeClass: "badge-muted" };
      case "create_playlist":
        return { icon: "📋", label: "Created Playlist", badgeClass: "badge-cyan" };
      case "delete_playlist":
        return { icon: "🗑️", label: "Deleted Playlist", badgeClass: "badge-danger" };
      case "add_to_playlist":
        return { icon: "➕", label: "Added to Playlist", badgeClass: "badge-primary" };
      case "open_profile":
        return { icon: "👤", label: "Opened Profile", badgeClass: "badge-muted" };
      case "admin_login":
        return { icon: "🛡️", label: "Admin Login", badgeClass: "badge-gold" };
      case "admin_logout":
        return { icon: "🛡️", label: "Admin Logout", badgeClass: "badge-muted" };
      default:
        return { icon: "⚡", label: action, badgeClass: "badge-muted" };
    }
  },

  formatTimestamp(isoString) {
    if (!isoString) return "Just now";
    const date = new Date(isoString);
    const now = new Date();
    const diffSecs = Math.floor((now - date) / 1000);

    if (diffSecs < 60) return "Just now";
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }
};
