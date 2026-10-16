import { StorageService } from './storageService';
import { apiRequest } from './apiClient';

export const ResourceService = {
  async getAllResources() {
    const live = await apiRequest('/api/v1/resources');
    if (live && Array.isArray(live)) return live;
    return StorageService.getResources();
  },

  async createResource(resourceData) {
    const newResource = {
      id: `RES-${(StorageService.getResources().length + 1).toString().padStart(2, '0')}`,
      status: 'PUBLISHED',
      addedDate: new Date().toISOString().slice(0, 10),
      downloads: 0,
      author: 'ZHERO Admin Ops',
      ...resourceData,
    };

    const list = StorageService.getResources();
    const updated = [newResource, ...list];
    StorageService.saveResources(updated);
    StorageService.logAudit('RESOURCE_CREATED', `${newResource.title} (${newResource.id})`, `Mapped to career: ${newResource.career || 'None'}`);
    return newResource;
  },

  async updateResource(id, updates) {
    const list = StorageService.getResources();
    const target = list.find(r => r.id === id);
    const updated = list.map(r => {
      if (r.id === id) {
        return { ...r, ...updates };
      }
      return r;
    });

    StorageService.saveResources(updated);
    StorageService.logAudit('RESOURCE_UPDATED', `${target?.title || id}`, `Modified resource details.`);
    return updated;
  },

  async togglePublish(id) {
    const list = StorageService.getResources();
    const target = list.find(r => r.id === id);
    const newStatus = target?.status === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED';
    return this.updateResource(id, { status: newStatus });
  },

  async deleteResource(id) {
    const list = StorageService.getResources();
    const target = list.find(r => r.id === id);
    const updated = list.filter(r => r.id !== id);
    StorageService.saveResources(updated);
    StorageService.logAudit('RESOURCE_DELETED', `${target?.title || id}`, `Removed learning resource.`);
    return updated;
  },
};
