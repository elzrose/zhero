import { StorageService } from './storageService';
import { apiRequest } from './apiClient';

export const SkillService = {
  async getAllSkills() {
    const live = await apiRequest('/api/v1/skills');
    if (live && Array.isArray(live)) return live;
    return StorageService.getSkills();
  },

  async createSkill(skillData) {
    const newSkill = {
      id: `SKL-${(StorageService.getSkills().length + 1).toString().padStart(2, '0')}`,
      category: 'Technical',
      proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced'],
      importance: 'High',
      mappedCareersCount: 0,
      ...skillData,
    };

    const skills = StorageService.getSkills();
    const updated = [newSkill, ...skills];
    StorageService.saveSkills(updated);
    StorageService.logAudit('SKILL_CREATED', `${newSkill.name} (${newSkill.id})`, `Added to category: ${newSkill.category}`);
    return newSkill;
  },

  async updateSkill(id, updates) {
    const skills = StorageService.getSkills();
    const target = skills.find(s => s.id === id);
    const updated = skills.map(s => {
      if (s.id === id) {
        return { ...s, ...updates };
      }
      return s;
    });

    StorageService.saveSkills(updated);
    StorageService.logAudit('SKILL_UPDATED', `${target?.name || id}`, `Updated skill definition & levels.`);
    return updated;
  },

  async deleteSkill(id) {
    const skills = StorageService.getSkills();
    const target = skills.find(s => s.id === id);
    const updated = skills.filter(s => s.id !== id);
    StorageService.saveSkills(updated);
    StorageService.logAudit('SKILL_DELETED', `${target?.name || id}`, `Removed skill from platform registry.`);
    return updated;
  },
};
