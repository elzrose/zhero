/**
 * ZHERO Local Storage & Demo Persistence Service
 * Encapsulates all browser storage with fallback seeding, safe parsing,
 * and modular APIs ready for backend synchronization.
 */

import { CAREERS_DATA } from '../data/careersData';
import { calculateAssessmentResults } from './scoringEngine';

const STORAGE_KEYS = {
  USER_PROFILE: 'zhero_student_profile',
  ASSESSMENT_ANSWERS: 'zhero_assessment_answers',
  ASSESSMENT_RESULTS: 'zhero_assessment_results',
  SAVED_CAREERS: 'zhero_saved_careers',
  COMPARE_LIST: 'zhero_compare_list',
  ACTIVE_ROADMAP: 'zhero_active_roadmap',
  SKILL_AUDIT: 'zhero_skill_audit',
  BOOKMARKED_RESOURCES: 'zhero_bookmarked_resources',
  COMPLETED_RESOURCES: 'zhero_completed_resources',
  ACTIVITY_LOG: 'zhero_activity_log',
};

// Default seed data for demo student
const DEFAULT_PROFILE = {
  id: 'stu-dev-01',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@campus.edu',
  educationLevel: 'Undergraduate (2nd Year)',
  stream: 'Computer Science & Engineering',
  interests: ['Web Development', 'Artificial Intelligence', 'UI/UX Design'],
  institution: 'Apex Career Academy — Kochi Campus',
  sponsored: true,
  onboardingCompleted: true,
  isLoggedIn: true,
};

// Seed default assessment answers for an engaging first-time state
const DEFAULT_SEEDED_ANSWERS = {
  1: 0, 2: 0, 3: 1, 4: 1, 5: 2, 6: 0, 7: 1, 8: 0,
  9: 1, 10: 0, 11: 0, 12: 1, 13: 0, 14: 2, 15: 0, 16: 0
};

export const storageService = {
  // --- Profile & Authentication ---
  getUserProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveUserProfile(profile) {
    try {
      const current = this.getUserProfile();
      const updated = { ...current, ...profile };
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
      return updated;
    } catch {
      return profile;
    }
  },

  loginDemoUser() {
    const profile = { ...DEFAULT_PROFILE, isLoggedIn: true };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    this.logActivity('Signed in with Demo Student account.');
    return profile;
  },

  logoutUser() {
    const current = this.getUserProfile();
    const updated = { ...current, isLoggedIn: false };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    return updated;
  },

  // --- Assessment State ---
  getAssessmentAnswers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_ANSWERS);
      return data ? JSON.parse(data) : DEFAULT_SEEDED_ANSWERS;
    } catch {
      return DEFAULT_SEEDED_ANSWERS;
    }
  },

  saveAssessmentAnswer(questionId, optionIndex) {
    try {
      const answers = this.getAssessmentAnswers();
      answers[questionId] = optionIndex;
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_ANSWERS, JSON.stringify(answers));
      return answers;
    } catch {
      return {};
    }
  },

  getAssessmentResults() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_RESULTS);
      if (data) return JSON.parse(data);
      // Auto-calculate results from seeded answers if first time
      const answers = this.getAssessmentAnswers();
      const calculated = calculateAssessmentResults(answers);
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_RESULTS, JSON.stringify(calculated));
      return calculated;
    } catch {
      return null;
    }
  },

  completeAssessment(answers) {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_ANSWERS, JSON.stringify(answers));
      const results = calculateAssessmentResults(answers);
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_RESULTS, JSON.stringify(results));
      this.logActivity('Completed full Career Interest Assessment.');
      return results;
    } catch (e) {
      console.error('Failed to save assessment results', e);
      return null;
    }
  },

  resetAssessment() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_ANSWERS);
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_RESULTS);
      this.logActivity('Reset Career Assessment progress.');
    } catch (e) {
      console.error(e);
    }
  },

  // --- Saved Careers ---
  getSavedCareers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_CAREERS);
      return data ? JSON.parse(data) : ['full-stack-engineer', 'ui-ux-designer'];
    } catch {
      return ['full-stack-engineer', 'ui-ux-designer'];
    }
  },

  toggleSaveCareer(careerId) {
    try {
      const saved = this.getSavedCareers();
      let updated;
      if (saved.includes(careerId)) {
        updated = saved.filter((id) => id !== careerId);
        this.logActivity(`Removed career from saved bookmarks.`);
      } else {
        updated = [...saved, careerId];
        this.logActivity(`Saved career profile.`);
      }
      localStorage.setItem(STORAGE_KEYS.SAVED_CAREERS, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  // --- Career Comparison (Max 3) ---
  getCompareList() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPARE_LIST);
      return data ? JSON.parse(data) : ['full-stack-engineer', 'ai-data-scientist'];
    } catch {
      return ['full-stack-engineer', 'ai-data-scientist'];
    }
  },

  toggleCompareCareer(careerId) {
    try {
      const list = this.getCompareList();
      let updated;
      if (list.includes(careerId)) {
        updated = list.filter((id) => id !== careerId);
      } else {
        if (list.length >= 3) {
          updated = [list[1], list[2], careerId]; // Evict oldest
        } else {
          updated = [...list, careerId];
        }
      }
      localStorage.setItem(STORAGE_KEYS.COMPARE_LIST, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  // --- Learning Roadmap ---
  getActiveRoadmap() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROADMAP);
      if (data) return JSON.parse(data);

      // Default to Full Stack Engineer roadmap
      const defaultCareer = CAREERS_DATA[0];
      const initial = {
        careerId: defaultCareer.id,
        careerTitle: defaultCareer.title,
        phases: defaultCareer.defaultRoadmap,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROADMAP, JSON.stringify(initial));
      return initial;
    } catch {
      return null;
    }
  },

  setRoadmapForCareer(careerId) {
    try {
      const career = CAREERS_DATA.find((c) => c.id === careerId) || CAREERS_DATA[0];
      const newRoadmap = {
        careerId: career.id,
        careerTitle: career.title,
        phases: career.defaultRoadmap || CAREERS_DATA[0].defaultRoadmap,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROADMAP, JSON.stringify(newRoadmap));
      this.logActivity(`Generated customized learning roadmap for ${career.title}.`);
      return newRoadmap;
    } catch {
      return null;
    }
  },

  toggleRoadmapTask(taskId) {
    try {
      const roadmap = this.getActiveRoadmap();
      if (!roadmap) return null;

      let changedTaskTitle = '';
      let isCompletedNow = false;

      roadmap.phases.forEach((phase) => {
        phase.tasks.forEach((task) => {
          if (task.id === taskId) {
            task.completed = !task.completed;
            changedTaskTitle = task.title;
            isCompletedNow = task.completed;
          }
        });
      });

      roadmap.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROADMAP, JSON.stringify(roadmap));

      if (changedTaskTitle) {
        this.logActivity(
          isCompletedNow ? `Completed milestone: "${changedTaskTitle}"` : `Marked milestone in progress: "${changedTaskTitle}"`
        );
      }

      return roadmap;
    } catch {
      return null;
    }
  },

  addCustomTask(phaseIndex, title, duration = '1 week') {
    try {
      const roadmap = this.getActiveRoadmap();
      if (!roadmap || !roadmap.phases[phaseIndex]) return roadmap;

      const newTask = {
        id: `custom-${Date.now()}`,
        title,
        duration,
        completed: false,
        isCustom: true,
      };

      roadmap.phases[phaseIndex].tasks.push(newTask);
      roadmap.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROADMAP, JSON.stringify(roadmap));
      this.logActivity(`Added custom milestone: "${title}"`);
      return roadmap;
    } catch {
      return null;
    }
  },

  // --- Skill Audit & Readiness ---
  getSkillAudit(careerId = 'full-stack-engineer') {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.SKILL_AUDIT}_${careerId}`);
      if (data) return JSON.parse(data);

      // Seed realistic initial skill levels for demo
      const career = CAREERS_DATA.find((c) => c.id === careerId) || CAREERS_DATA[0];
      const initial = {};
      career.requiredSkills.forEach((skill, idx) => {
        // e.g. Ananya has level 3 in first few, level 1-2 in others
        initial[skill.name] = idx === 0 ? 3 : idx === 1 ? 2 : 1;
      });

      localStorage.setItem(`${STORAGE_KEYS.SKILL_AUDIT}_${careerId}`, JSON.stringify(initial));
      return initial;
    } catch {
      return {};
    }
  },

  updateSkillLevel(careerId, skillName, newLevel) {
    try {
      const audit = this.getSkillAudit(careerId);
      audit[skillName] = newLevel;
      localStorage.setItem(`${STORAGE_KEYS.SKILL_AUDIT}_${careerId}`, JSON.stringify(audit));
      this.logActivity(`Updated proficiency rating for ${skillName} to Level ${newLevel}.`);
      return audit;
    } catch {
      return {};
    }
  },

  // --- Resources Bookmarking & Tracking ---
  getBookmarkedResources() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_RESOURCES);
      return data ? JSON.parse(data) : ['res-1', 'res-4'];
    } catch {
      return ['res-1', 'res-4'];
    }
  },

  toggleBookmarkResource(resId) {
    try {
      const list = this.getBookmarkedResources();
      const updated = list.includes(resId) ? list.filter((id) => id !== resId) : [...list, resId];
      localStorage.setItem(STORAGE_KEYS.BOOKMARKED_RESOURCES, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  getCompletedResources() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_RESOURCES);
      return data ? JSON.parse(data) : ['res-1'];
    } catch {
      return ['res-1'];
    }
  },

  toggleCompleteResource(resId) {
    try {
      const list = this.getCompletedResources();
      const updated = list.includes(resId) ? list.filter((id) => id !== resId) : [...list, resId];
      localStorage.setItem(STORAGE_KEYS.COMPLETED_RESOURCES, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  // --- Activity Log ---
  getActivityLog() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
      return data
        ? JSON.parse(data)
        : [
            { id: 1, text: 'Completed Aptitude & Career Interest Assessment', time: '2 hours ago' },
            { id: 2, text: 'Saved "Full Stack Software Engineer" to career targets', time: '1 hour ago' },
            { id: 3, text: 'Completed milestone: "Git & GitHub Workflow"', time: '35 mins ago' },
          ];
    } catch {
      return [];
    }
  },

  logActivity(text) {
    try {
      const log = this.getActivityLog();
      const newEntry = {
        id: Date.now(),
        text,
        time: 'Just now',
      };
      const updated = [newEntry, ...log].slice(0, 15);
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  // --- Full Demo Reset ---
  resetAll() {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.error(e);
    }
  },
};
