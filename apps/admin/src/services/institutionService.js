import { StorageService } from './storageService';
import { apiRequest } from './apiClient';

export const InstitutionService = {
  async getAllInstitutions() {
    const live = await apiRequest('/api/v1/admin/institutions');
    if (live && Array.isArray(live)) return live;
    return StorageService.getInstitutions();
  },

  async approveInstitution(id, adminName = 'Maya Pillai (Super Admin)') {
    await apiRequest(`/api/v1/admin/institutions/${id}/approve`, { method: 'POST' });

    const institutions = StorageService.getInstitutions();
    const inst = institutions.find(i => i.id === id);
    const updated = institutions.map(i => {
      if (i.id === id) {
        return {
          ...i,
          status: 'APPROVED',
          approvedAt: new Date().toISOString().slice(0, 10),
          approvedBy: adminName,
        };
      }
      return i;
    });

    StorageService.saveInstitutions(updated);
    StorageService.logAudit(
      'INSTITUTION_APPROVED',
      `${inst?.name || id} (${id})`,
      `Approved partnership license for ${inst?.plan || 'Standard Tier'}. Issued ${inst?.allocatedSeats || 100} student seats.`,
      adminName
    );
    return updated;
  },

  async rejectInstitution(id, reason = 'Accreditation documents incomplete', adminName = 'Maya Pillai (Super Admin)') {
    await apiRequest(`/api/v1/admin/institutions/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });

    const institutions = StorageService.getInstitutions();
    const inst = institutions.find(i => i.id === id);
    const updated = institutions.map(i => {
      if (i.id === id) {
        return {
          ...i,
          status: 'REJECTED',
          rejectedAt: new Date().toISOString().slice(0, 10),
          rejectionReason: reason,
          rejectedBy: adminName,
        };
      }
      return i;
    });

    StorageService.saveInstitutions(updated);
    StorageService.logAudit(
      'INSTITUTION_REJECTED',
      `${inst?.name || id} (${id})`,
      `Application rejected. Reason: ${reason}`,
      adminName
    );
    return updated;
  },

  async updateStatus(id, newStatus, reason = '') {
    const institutions = StorageService.getInstitutions();
    const inst = institutions.find(i => i.id === id);
    const updated = institutions.map(i => {
      if (i.id === id) {
        return { ...i, status: newStatus };
      }
      return i;
    });

    StorageService.saveInstitutions(updated);
    StorageService.logAudit(
      `INSTITUTION_${newStatus}`,
      `${inst?.name || id} (${id})`,
      `License status transitioned to ${newStatus}. ${reason}`
    );
    return updated;
  },

  async updateQuota(id, allocatedSeats, plan) {
    const institutions = StorageService.getInstitutions();
    const inst = institutions.find(i => i.id === id);
    const updated = institutions.map(i => {
      if (i.id === id) {
        return {
          ...i,
          allocatedSeats: Number(allocatedSeats),
          plan: plan || i.plan,
        };
      }
      return i;
    });

    StorageService.saveInstitutions(updated);
    StorageService.logAudit(
      'QUOTA_UPDATED',
      `${inst?.name || id} (${id})`,
      `Allocated seats adjusted to ${allocatedSeats} (${plan})`
    );
    return updated;
  },

  async createInstitution(data) {
    const newInst = {
      id: `INST-${(StorageService.getInstitutions().length + 1).toString().padStart(2, '0')}`,
      status: 'PENDING_REVIEW',
      joinedDate: new Date().toISOString().slice(0, 10),
      usedSeats: 0,
      studentsCount: 0,
      assessmentsCompleted: 0,
      avgReadiness: 0,
      ...data,
    };

    const institutions = StorageService.getInstitutions();
    const updated = [newInst, ...institutions];
    StorageService.saveInstitutions(updated);
    StorageService.logAudit('INSTITUTION_REGISTERED', `${newInst.name} (${newInst.id})`, `New tuition centre registered for review.`);
    return newInst;
  },
};
