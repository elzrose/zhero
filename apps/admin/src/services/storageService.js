import {
  INITIAL_USERS,
  INITIAL_INSTITUTIONS,
  INITIAL_CAREERS,
  INITIAL_SKILLS,
  INITIAL_ASSESSMENTS,
  INITIAL_RESOURCES,
  INITIAL_AI_CONFIG,
  INITIAL_AUDIT_LOGS,
  INITIAL_HUMAN_VALIDATIONS,
  INITIAL_VERBAL_INTERVIEWS,
  INITIAL_CAREER_SIMULATIONS,
  INITIAL_BOUNTIES,
  INITIAL_LEARNING_SCIENCE,
} from './mockData';

const KEYS = {
  USERS: 'zhero_admin_users_v1',
  INSTITUTIONS: 'zhero_admin_institutions_v1',
  CAREERS: 'zhero_admin_careers_v1',
  SKILLS: 'zhero_admin_skills_v1',
  ASSESSMENTS: 'zhero_admin_assessments_v1',
  RESOURCES: 'zhero_admin_resources_v1',
  AI_CONFIG: 'zhero_admin_ai_config_v1',
  AUDIT_LOGS: 'zhero_admin_audit_logs_v1',
  HUMAN_VALIDATIONS: 'zhero_admin_human_validations_v1',
  VERBAL_INTERVIEWS: 'zhero_admin_verbal_interviews_v1',
  CAREER_SIMULATIONS: 'zhero_admin_career_simulations_v1',
  BOUNTIES: 'zhero_admin_bounties_v1',
  LEARNING_SCIENCE: 'zhero_admin_learning_science_v1',
  SESSION: 'zhero_admin_session_v1',
  PLATFORM_SETTINGS: 'zhero_admin_settings_v1',
};

const DEFAULT_SETTINGS = {
  platformName: 'ZHERO Education & Career Engine',
  maintenanceMode: false,
  selfRegistrationAllowed: true,
  defaultSeatQuota: 100,
  notificationAlerts: true,
  require2FAForSuperAdmin: true,
  dataRetentionMonths: 24,
};

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading localStorage for key ${key}:`, err);
    return fallback;
  }
}

function setStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('zhero_store_change', { detail: { key } }));
  } catch (err) {
    console.error(`Error saving localStorage for key ${key}:`, err);
  }
}

export const StorageService = {
  // Init
  init() {
    getStored(KEYS.USERS, INITIAL_USERS);
    getStored(KEYS.INSTITUTIONS, INITIAL_INSTITUTIONS);
    getStored(KEYS.CAREERS, INITIAL_CAREERS);
    getStored(KEYS.SKILLS, INITIAL_SKILLS);
    getStored(KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
    getStored(KEYS.RESOURCES, INITIAL_RESOURCES);
    getStored(KEYS.AI_CONFIG, INITIAL_AI_CONFIG);
    getStored(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    getStored(KEYS.HUMAN_VALIDATIONS, INITIAL_HUMAN_VALIDATIONS);
    getStored(KEYS.VERBAL_INTERVIEWS, INITIAL_VERBAL_INTERVIEWS);
    getStored(KEYS.CAREER_SIMULATIONS, INITIAL_CAREER_SIMULATIONS);
    getStored(KEYS.BOUNTIES, INITIAL_BOUNTIES);
    getStored(KEYS.LEARNING_SCIENCE, INITIAL_LEARNING_SCIENCE);
    getStored(KEYS.PLATFORM_SETTINGS, DEFAULT_SETTINGS);
  },

  // Reset demo data
  resetAll() {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(KEYS.INSTITUTIONS, JSON.stringify(INITIAL_INSTITUTIONS));
    localStorage.setItem(KEYS.CAREERS, JSON.stringify(INITIAL_CAREERS));
    localStorage.setItem(KEYS.SKILLS, JSON.stringify(INITIAL_SKILLS));
    localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(INITIAL_ASSESSMENTS));
    localStorage.setItem(KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
    localStorage.setItem(KEYS.AI_CONFIG, JSON.stringify(INITIAL_AI_CONFIG));
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(KEYS.HUMAN_VALIDATIONS, JSON.stringify(INITIAL_HUMAN_VALIDATIONS));
    localStorage.setItem(KEYS.VERBAL_INTERVIEWS, JSON.stringify(INITIAL_VERBAL_INTERVIEWS));
    localStorage.setItem(KEYS.CAREER_SIMULATIONS, JSON.stringify(INITIAL_CAREER_SIMULATIONS));
    localStorage.setItem(KEYS.BOUNTIES, JSON.stringify(INITIAL_BOUNTIES));
    localStorage.setItem(KEYS.LEARNING_SCIENCE, JSON.stringify(INITIAL_LEARNING_SCIENCE));
    localStorage.setItem(KEYS.PLATFORM_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    window.dispatchEvent(new CustomEvent('zhero_store_change', { detail: { key: 'ALL' } }));
  },

  // Users
  getUsers() {
    return getStored(KEYS.USERS, INITIAL_USERS);
  },
  saveUsers(users) {
    setStored(KEYS.USERS, users);
  },

  // Institutions (Tuition Centres)
  getInstitutions() {
    return getStored(KEYS.INSTITUTIONS, INITIAL_INSTITUTIONS);
  },
  saveInstitutions(institutions) {
    setStored(KEYS.INSTITUTIONS, institutions);
  },

  // Careers
  getCareers() {
    return getStored(KEYS.CAREERS, INITIAL_CAREERS);
  },
  saveCareers(careers) {
    setStored(KEYS.CAREERS, careers);
  },

  // Skills
  getSkills() {
    return getStored(KEYS.SKILLS, INITIAL_SKILLS);
  },
  saveSkills(skills) {
    setStored(KEYS.SKILLS, skills);
  },

  // Assessments
  getAssessments() {
    return getStored(KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
  },
  saveAssessments(assessments) {
    setStored(KEYS.ASSESSMENTS, assessments);
  },

  // Resources
  getResources() {
    return getStored(KEYS.RESOURCES, INITIAL_RESOURCES);
  },
  saveResources(resources) {
    setStored(KEYS.RESOURCES, resources);
  },

  // AI Config & Metrics
  getAiConfig() {
    return getStored(KEYS.AI_CONFIG, INITIAL_AI_CONFIG);
  },
  saveAiConfig(config) {
    setStored(KEYS.AI_CONFIG, config);
  },

  // Human Mentorship & Validation Pipeline
  getHumanValidations() {
    return getStored(KEYS.HUMAN_VALIDATIONS, INITIAL_HUMAN_VALIDATIONS);
  },
  saveHumanValidations(validations) {
    setStored(KEYS.HUMAN_VALIDATIONS, validations);
  },

  // Verbal AI Interviews & Anti-Speedrun Telemetry
  getVerbalInterviews() {
    return getStored(KEYS.VERBAL_INTERVIEWS, INITIAL_VERBAL_INTERVIEWS);
  },
  saveVerbalInterviews(interviews) {
    setStored(KEYS.VERBAL_INTERVIEWS, interviews);
  },

  // Career Simulations & Alumni Insights
  getCareerSimulations() {
    return getStored(KEYS.CAREER_SIMULATIONS, INITIAL_CAREER_SIMULATIONS);
  },
  saveCareerSimulations(simulations) {
    setStored(KEYS.CAREER_SIMULATIONS, simulations);
  },

  // Bounties & Job Opportunities
  getBounties() {
    return getStored(KEYS.BOUNTIES, INITIAL_BOUNTIES);
  },
  saveBounties(bounties) {
    setStored(KEYS.BOUNTIES, bounties);
  },

  // Learning Science (Streaks, Badges & Forgetting Curve)
  getLearningScience() {
    return getStored(KEYS.LEARNING_SCIENCE, INITIAL_LEARNING_SCIENCE);
  },
  saveLearningScience(science) {
    setStored(KEYS.LEARNING_SCIENCE, science);
  },

  // Settings
  getSettings() {
    return getStored(KEYS.PLATFORM_SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(settings) {
    setStored(KEYS.PLATFORM_SETTINGS, settings);
  },

  // Audit Logs
  getAuditLogs() {
    return getStored(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  logAudit(action, target, details, adminName = 'Maya Pillai (Super Admin)') {
    const logs = this.getAuditLogs();
    const newLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      admin: adminName,
      action,
      target,
      details,
      ipAddress: '127.0.0.1 (Local Session)',
    };
    const updated = [newLog, ...logs];
    setStored(KEYS.AUDIT_LOGS, updated);
    return newLog;
  },

  // Session
  getSession() {
    try {
      const raw = localStorage.getItem(KEYS.SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setSession(session) {
    if (!session) {
      localStorage.removeItem(KEYS.SESSION);
    } else {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
    }
    window.dispatchEvent(new CustomEvent('zhero_session_change'));
  },
};

// Auto-run init
StorageService.init();
