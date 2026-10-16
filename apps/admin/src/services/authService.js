import { StorageService } from './storageService';
import { apiRequest } from './apiClient';

export const AuthService = {
  async login(email, password) {
    // 1. Try real backend if available
    const liveRes = await apiRequest('/api/v1/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (liveRes && liveRes.user && liveRes.token) {
      StorageService.setSession(liveRes);
      StorageService.logAudit('LOGIN_SUCCESS', liveRes.user.email, 'Authenticated via live REST backend', liveRes.user.name);
      return { success: true, user: liveRes.user };
    }

    // 2. Local fallback evaluation
    const users = StorageService.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return { success: false, error: 'Invalid email address. User not found.' };
    }

    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return { success: false, error: 'Access denied: You do not have platform administrator privileges.' };
    }

    if (user.status !== 'ACTIVE') {
      return { success: false, error: 'Your administrator account has been suspended. Please contact platform operators.' };
    }

    // Default hackathon demo password verification
    if (password !== 'admin123' && password !== 'zhero2026') {
      return { success: false, error: 'Invalid password. (Hint for demo: admin123 or zhero2026)' };
    }

    const sessionData = {
      user,
      token: `zhero_jwt_${Date.now()}_${user.id}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    StorageService.setSession(sessionData);
    StorageService.logAudit('LOGIN_SUCCESS', user.email, 'Admin signed in successfully', user.name);

    return { success: true, user };
  },

  getCurrentUser() {
    const session = StorageService.getSession();
    if (!session || !session.user) return null;
    return session.user;
  },

  logout() {
    const user = this.getCurrentUser();
    if (user) {
      StorageService.logAudit('LOGOUT', user.email, 'Admin signed out', user.name);
    }
    StorageService.setSession(null);
  },

  // Switch demo persona (Super Admin <-> Admin)
  switchRole(role) {
    const users = StorageService.getUsers();
    const targetUser = users.find(u => u.role === role && u.status === 'ACTIVE') || {
      id: `USR-${role.toLowerCase()}`,
      name: role === 'SUPER_ADMIN' ? 'Maya Pillai (Super Admin)' : 'Rahul Varma (Admin)',
      email: role === 'SUPER_ADMIN' ? 'admin@zhero.app' : 'rahul.ops@zhero.app',
      role,
      status: 'ACTIVE',
      institutionName: 'ZHERO Platform Global Ops',
      avatar: role === 'SUPER_ADMIN' ? 'MP' : 'RV',
    };

    const sessionData = {
      user: targetUser,
      token: `zhero_jwt_switched_${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    StorageService.setSession(sessionData);
    StorageService.logAudit('SWITCH_ROLE', role, `Switched persona to ${role}`, targetUser.name);
    return targetUser;
  },
};
