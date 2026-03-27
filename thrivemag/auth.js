/* ============================================================
   ThriveMag — Authentication System
   Uses localStorage for demo purposes only.
   ============================================================ */

window.ThriveMag = window.ThriveMag || {};

ThriveMag.auth = (function () {
  'use strict';

  const USERS_KEY = 'thrivemag_users';
  const SESSION_KEY = 'thrivemag_session';

  /* ---- Seed default admin account ---- */
  function seedAdmin() {
    let users = getUsers();
    const adminExists = users.some(u => u.email === 'admin@thrivemag.com');
    if (!adminExists) {
      users.push({
        id: 'user_admin',
        name: 'Admin',
        email: 'admin@thrivemag.com',
        passwordHash: btoa('admin123'),
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      saveUsers(users);
    }
  }

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function generateId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /* ---- Register ---- */
  function register(email, password, name) {
    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Name must be at least 2 characters.' };
    }
    if (!validateEmail(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const users = getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: btoa(password),
      role: 'reader',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after registration
    const session = {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } };
  }

  /* ---- Login ---- */
  function login(email, password) {
    if (!email || !password) {
      return { success: false, error: 'Please enter your email and password.' };
    }

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      return { success: false, error: 'No account found with that email address.' };
    }

    if (user.passwordHash !== btoa(password)) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  /* ---- Logout ---- */
  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
  }

  /* ---- Check login state ---- */
  function isLoggedIn() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      return !!(session && session.userId);
    } catch (e) {
      return false;
    }
  }

  /* ---- Get current user ---- */
  function getCurrentUser() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (!session || !session.userId) return null;
      return {
        id: session.userId,
        name: session.name,
        email: session.email,
        role: session.role
      };
    } catch (e) {
      return null;
    }
  }

  /* ---- Require auth — redirect if not logged in ---- */
  function requireAuth(redirectUrl) {
    redirectUrl = redirectUrl || 'sign-in.html';
    if (!isLoggedIn()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  /* ---- Update nav based on auth state ---- */
  function updateNav() {
    const user = getCurrentUser();
    const authContainer = document.getElementById('nav-auth');
    if (!authContainer) return;

    if (user) {
      const isAdmin = user.role === 'admin';
      authContainer.innerHTML = `
        <div class="header-user">
          <strong>Hi, ${escapeHtml(user.name.split(' ')[0])}</strong>
          ${isAdmin ? '<a href="admin.html" class="admin-nav-link">Admin</a>' : ''}
          <a href="#" onclick="ThriveMag.auth.logout(); return false;" style="color: var(--text-muted); font-size: 0.8125rem;">Sign Out</a>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <div class="header-auth-links">
          <a href="sign-in.html" class="btn btn-outline btn-sm">Sign In</a>
          <a href="sign-up.html" class="btn btn-primary btn-sm">Join Free</a>
        </div>
      `;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* ---- Init ---- */
  function init() {
    seedAdmin();
    updateNav();
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    register,
    login,
    logout,
    isLoggedIn,
    getCurrentUser,
    requireAuth,
    updateNav
  };
})();
