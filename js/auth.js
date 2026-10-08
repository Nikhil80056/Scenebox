/**
 * SceneBox - Authentication Module
 * Manages user registration, login, logout, admin auth, and route guards.
 */

const Auth = {
  // Check if current session has logged in user
  isUserLoggedIn() {
    return StorageManager.getCurrentUser() !== null;
  },

  getCurrentUser() {
    return StorageManager.getCurrentUser();
  },

  // Check if current session has admin logged in
  isAdminLoggedIn() {
    const session = StorageManager.getAdminSession();
    return session !== null && session.role === "admin";
  },

  // User Registration
  register(name, email, password, confirmPassword) {
    name = (name || "").trim();
    email = (email || "").trim().toLowerCase();
    password = password || "";
    confirmPassword = confirmPassword || "";

    const errors = [];

    if (!name || name.length < 2) {
      errors.push("Full Name must be at least 2 characters.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push("Please provide a valid email address.");
    }

    if (StorageManager.getUserByEmail(email)) {
      errors.push("An account with this email already exists.");
    }

    if (!password || password.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      errors.push("Passwords do not match.");
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    const newUser = StorageManager.addUser({
      name,
      email,
      password
    });

    StorageManager.setCurrentUser(newUser);
    StorageManager.logActivity("register", "Registered a new account", null, newUser);
    StorageManager.logActivity("login", "Logged in after registration", null, newUser);

    return { success: true, user: newUser };
  },

  // User Login
  login(email, password) {
    email = (email || "").trim().toLowerCase();
    password = password || "";

    if (!email || !password) {
      return { success: false, error: "Please enter both email and password." };
    }

    const user = StorageManager.getUserByEmail(email);
    if (!user || user.password !== password) {
      return { success: false, error: "Invalid email or password." };
    }

    StorageManager.setCurrentUser(user);
    StorageManager.logActivity("login", "Logged in to SceneBox", null, user);

    return { success: true, user };
  },

  // Admin Login
  adminLogin(email, password) {
    email = (email || "").trim().toLowerCase();
    password = password || "";

    if (email === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
      const session = {
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        role: "admin",
        token: "adm-session-" + Date.now().toString(36),
        loginTime: new Date().toISOString()
      };

      StorageManager.setAdminSession(session);
      StorageManager.logActivity("admin_login", "Admin logged into dashboard", null, {
        id: "admin",
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email
      });

      return { success: true, session };
    }

    return {
      success: false,
      error: "Invalid admin credentials. Use demo: admin@scenebox.com / Admin@123"
    };
  },

  // User Logout
  logoutUser(redirectUrl = "index.html") {
    StorageManager.logoutUser();
    window.location.href = redirectUrl;
  },

  // Admin Logout
  logoutAdmin(redirectUrl = "login.html") {
    StorageManager.logActivity("admin_logout", "Admin logged out from dashboard", null, {
      id: "admin",
      name: "Admin"
    });
    StorageManager.logoutAdmin();
    window.location.href = redirectUrl;
  },

  // Route Guards
  requireUser(redirectUrl = "login.html") {
    if (!this.isUserLoggedIn()) {
      const currentPath = window.location.pathname.split("/").pop();
      const search = window.location.search;
      const returnUrl = encodeURIComponent(currentPath + search);
      window.location.href = `${redirectUrl}?returnUrl=${returnUrl}`;
      return false;
    }
    return true;
  },

  requireAdmin(redirectUrl = "login.html") {
    if (!this.isAdminLoggedIn()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },

  redirectIfUserLoggedIn(targetUrl = "index.html") {
    if (this.isUserLoggedIn()) {
      window.location.href = targetUrl;
    }
  },

  redirectIfAdminLoggedIn(targetUrl = "dashboard.html") {
    if (this.isAdminLoggedIn()) {
      window.location.href = targetUrl;
    }
  }
};
