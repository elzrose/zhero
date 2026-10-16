import { StorageService } from './storageService';
import { apiRequest } from './apiClient';

export const UserService = {
  async getAllUsers() {
    const live = await apiRequest('/api/v1/admin/users');
    if (live && Array.isArray(live)) return live;
    return StorageService.getUsers();
  },

  async updateUserStatus(userId, newStatus, reason = '') {
    await apiRequest(`/api/v1/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, reason }),
    });

    const users = StorageService.getUsers();
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: newStatus };
      }
      return u;
    });

    StorageService.saveUsers(updated);
    const targetUser = users.find(u => u.id === userId);
    StorageService.logAudit(
      `USER_STATUS_${newStatus}`,
      `${targetUser?.name || userId} (${userId})`,
      `Status changed to ${newStatus}. Reason: ${reason || 'Administrative action'}`
    );
    return updated;
  },

  async createUser(userData) {
    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      status: 'ACTIVE',
      registeredAt: new Date().toISOString().slice(0, 10),
      lastLogin: 'Never',
      avatar: (userData.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      readiness: userData.role === 'STUDENT' ? 0 : undefined,
      ...userData,
    };

    await apiRequest('/api/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });

    const users = StorageService.getUsers();
    const updated = [newUser, ...users];
    StorageService.saveUsers(updated);
    StorageService.logAudit('USER_CREATED', `${newUser.name} (${newUser.id})`, `Assigned role: ${newUser.role}`);
    return newUser;
  },

  async deleteUser(userId) {
    const users = StorageService.getUsers();
    const target = users.find(u => u.id === userId);
    const updated = users.filter(u => u.id !== userId);
    StorageService.saveUsers(updated);
    StorageService.logAudit('USER_DELETED', `${target?.name || userId}`, `User account permanently removed`);
    return updated;
  },
};
