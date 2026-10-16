import { StorageService } from './storageService';
import { apiRequest } from './apiClient';

export const CareerService = {
  async getAllCareers() {
    const live = await apiRequest('/api/v1/careers');
    if (live && Array.isArray(live)) return live;
    return StorageService.getCareers();
  },

  async createCareer(careerData) {
    const newCareer = {
      id: `CAR-${(StorageService.getCareers().length + 1).toString().padStart(2, '0')}`,
      slug: (careerData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      status: 'PUBLISHED',
      updatedAt: new Date().toISOString().slice(0, 10),
      requiredSkills: [],
      recommendedSkills: [],
      educationPathways: [],
      ...careerData,
    };

    await apiRequest('/api/v1/careers', {
      method: 'POST',
      body: JSON.stringify(newCareer),
    });

    const careers = StorageService.getCareers();
    const updated = [newCareer, ...careers];
    StorageService.saveCareers(updated);
    StorageService.logAudit('CAREER_CREATED', `${newCareer.title} (${newCareer.id})`, `Added new career taxonomy profile.`);
    return newCareer;
  },

  async updateCareer(id, updates) {
    await apiRequest(`/api/v1/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    const careers = StorageService.getCareers();
    const updated = careers.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...updates,
          updatedAt: new Date().toISOString().slice(0, 10),
        };
      }
      return c;
    });

    StorageService.saveCareers(updated);
    const target = careers.find(c => c.id === id);
    StorageService.logAudit('CAREER_UPDATED', `${target?.title || id}`, `Modified career competencies and requirements.`);
    return updated;
  },

  async togglePublish(id) {
    const careers = StorageService.getCareers();
    const target = careers.find(c => c.id === id);
    const newStatus = target?.status === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED';
    return this.updateCareer(id, { status: newStatus });
  },

  async deleteCareer(id) {
    const careers = StorageService.getCareers();
    const target = careers.find(c => c.id === id);
    const updated = careers.filter(c => c.id !== id);
    StorageService.saveCareers(updated);
    StorageService.logAudit('CAREER_DELETED', `${target?.title || id}`, `Career profile permanently removed from taxonomy.`);
    return updated;
  },
};
