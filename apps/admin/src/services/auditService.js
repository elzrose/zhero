import { StorageService } from './storageService';

export const AuditService = {
  getLogs() {
    return StorageService.getAuditLogs();
  },

  filterLogs({ query = '', action = 'ALL', admin = 'ALL' }) {
    const logs = StorageService.getAuditLogs();
    return logs.filter(log => {
      const matchesQuery =
        !query ||
        log.target.toLowerCase().includes(query.toLowerCase()) ||
        log.details.toLowerCase().includes(query.toLowerCase()) ||
        log.action.toLowerCase().includes(query.toLowerCase());

      const matchesAction = action === 'ALL' || log.action === action;
      const matchesAdmin = admin === 'ALL' || log.admin.includes(admin);

      return matchesQuery && matchesAction && matchesAdmin;
    });
  },
};
