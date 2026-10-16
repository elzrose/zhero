import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial session load
    const existing = AuthService.getCurrentUser();
    if (existing) {
      setUser(existing);
    } else {
      // For immediate hackathon exploration ease, auto-seed with Super Admin if empty
      const defaultAdmin = AuthService.switchRole('SUPER_ADMIN');
      setUser(defaultAdmin);
    }
    setIsLoading(false);

    const handleSessionChange = () => {
      const current = AuthService.getCurrentUser();
      setUser(current);
    };

    window.addEventListener('zhero_session_change', handleSessionChange);
    return () => window.removeEventListener('zhero_session_change', handleSessionChange);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    const res = await AuthService.login(email, password);
    setIsLoading(false);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const switchRole = (role) => {
    const updated = AuthService.switchRole(role);
    setUser(updated);
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const hasPermission = (perm) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    
    // Regular ADMIN permissions
    const adminPermissions = [
      'VIEW_DASHBOARD',
      'VIEW_USERS',
      'EDIT_STUDENTS',
      'VIEW_INSTITUTIONS',
      'VIEW_CAREERS',
      'EDIT_CAREERS',
      'VIEW_SKILLS',
      'EDIT_SKILLS',
      'VIEW_ASSESSMENTS',
      'EDIT_ASSESSMENTS',
      'VIEW_RESOURCES',
      'EDIT_RESOURCES',
      'VIEW_AI_MONITORING',
      'VIEW_ANALYTICS',
      'VIEW_AUDIT_LOGS',
    ];

    // Super Admin exclusively has:
    // 'APPROVE_INSTITUTION', 'REJECT_INSTITUTION', 'DELETE_CAREER', 'DELETE_USER', 'MANAGE_SETTINGS', 'EDIT_AI_PROMPTS'
    return adminPermissions.includes(perm);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        switchRole,
        isSuperAdmin,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
