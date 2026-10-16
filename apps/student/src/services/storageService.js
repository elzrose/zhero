/**
 * ZHERO Local Storage & Demo Persistence Service
 * Encapsulates all browser storage with fallback seeding, safe parsing,
 * and modular APIs ready for backend synchronization.
 */

import { CAREERS_DATA } from '../data/careersData.js';
import { calculateAssessmentResults } from './scoringEngine.js';

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
  // 6-Stage Journey Keys
  ASSESSMENT_STAGE: 'zhero_assessment_stage',
  STAGE1_CONTEXT: 'zhero_stage1_context',
  STAGE2_CONVERSATION: 'zhero_stage2_conversation',
  STAGE3_PRELIMINARY: 'zhero_stage3_preliminary',
  STAGE4_COUNSELLING: 'zhero_stage4_counselling',
  STAGE4_MENTOR_REVIEW: 'zhero_stage4_mentor_review',
  STAGE5_FINAL: 'zhero_stage5_final',
  SIMULATION_RESULTS: 'zhero_simulation_results',
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

  updateCareerGoal(careerTitle) {
    try {
      const current = this.getUserProfile();
      const updated = { ...current, targetCareer: careerTitle };
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
      this.logActivity(`Updated career focus goal to ${careerTitle}.`);
      return updated;
    } catch {
      return null;
    }
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
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_STAGE);
      localStorage.removeItem(STORAGE_KEYS.STAGE1_CONTEXT);
      localStorage.removeItem(STORAGE_KEYS.STAGE2_CONVERSATION);
      localStorage.removeItem(STORAGE_KEYS.STAGE3_PRELIMINARY);
      localStorage.removeItem(STORAGE_KEYS.STAGE4_COUNSELLING);
      localStorage.removeItem(STORAGE_KEYS.STAGE4_MENTOR_REVIEW);
      localStorage.removeItem(STORAGE_KEYS.STAGE5_FINAL);
      localStorage.removeItem(STORAGE_KEYS.SIMULATION_RESULTS);
      this.logActivity('Reset Career Guidance Journey progress.');
    } catch (e) {
      console.error(e);
    }
  },

  // --- 6-Stage Journey Methods ---
  getAssessmentStage() {
    try {
      const stage = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_STAGE);
      return stage ? Number(stage) : 1;
    } catch {
      return 1;
    }
  },

  setAssessmentStage(stageNum) {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_STAGE, String(stageNum));
      return stageNum;
    } catch {
      return stageNum;
    }
  },

  getStage1Context() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STAGE1_CONTEXT);
      return data ? JSON.parse(data) : {
        educationLevel: 'Undergraduate (2nd Year)',
        stream: 'Computer Science & Engineering',
        enjoyedSubjects: ['Web Development', 'Problem Solving', 'Visual Design'],
        curiousSkills: ['JavaScript / React', 'UI/UX Prototyping', 'System Design'],
        curiousCareers: ['Full Stack Software Engineer', 'UI/UX Product Designer'],
        workEnvironment: 'Balanced collaborative and focused quiet workspaces',
        shortTermAspirations: 'Build a standout portfolio project and land a summer internship',
        longTermAspirations: 'Lead creative technology projects that improve education and productivity',
        constraints: 'Balancing college exam preparation with self-paced learning time',
        concerns: 'Wondering if I have enough practical project experience compared to senior peers',
        selfDescription: 'I enjoy seeing ideas become working software that real people can use. When I hit a bug, I get stubborn until I figure it out.',
        consentGiven: true,
      };
    } catch {
      return null;
    }
  },

  saveStage1Context(context) {
    try {
      localStorage.setItem(STORAGE_KEYS.STAGE1_CONTEXT, JSON.stringify(context));
      this.logActivity('Saved Stage 1: Student Context & Privacy Consent.');
      return context;
    } catch {
      return context;
    }
  },

  getStage2Conversation() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STAGE2_CONVERSATION);
      return data ? JSON.parse(data) : [
        {
          id: 'init-1',
          sender: 'ai',
          text: `Welcome! I'm your ZHERO AI Career Guide. I'm here to listen, explore what energizes you, and help you map out real possibilities—without any pressure or rigid tests. What's one activity or subject recently where you found yourself genuinely absorbed in what you were doing?`,
          timestamp: 'Just now',
          isAiPowered: true,
        }
      ];
    } catch {
      return [];
    }
  },

  saveStage2Conversation(messages) {
    try {
      localStorage.setItem(STORAGE_KEYS.STAGE2_CONVERSATION, JSON.stringify(messages));
      return messages;
    } catch {
      return messages;
    }
  },

  getStage3PreliminaryAnalysis() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STAGE3_PRELIMINARY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveStage3PreliminaryAnalysis(analysis) {
    try {
      localStorage.setItem(STORAGE_KEYS.STAGE3_PRELIMINARY, JSON.stringify(analysis));
      this.logActivity('Generated Stage 3: Preliminary Career Analysis (Awaiting Human Review).');
      return analysis;
    } catch {
      return analysis;
    }
  },

  getStage4Counselling() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STAGE4_COUNSELLING);
      return data ? JSON.parse(data) : {
        status: 'unbooked', // 'unbooked' | 'scheduled' | 'in_session' | 'reviewed'
        mentorId: 'mentor-1',
        mentorName: 'Dr. Radhika Nair',
        mentorRole: 'Senior STEM & EdTech Counselor (Former IISc Academic Advisor)',
        mentorAvatar: '👩‍🏫',
        slot: 'Tomorrow, 4:00 PM – 4:45 PM (IST)',
        format: 'Virtual Video Call',
        studentQuestions: 'How should I balance learning modern frontend frameworks with core data structures?',
        isDemoBooking: true,
      };
    } catch {
      return null;
    }
  },

  saveStage4Counselling(counselling) {
    try {
      localStorage.setItem(STORAGE_KEYS.STAGE4_COUNSELLING, JSON.stringify(counselling));
      return counselling;
    } catch {
      return counselling;
    }
  },

  getStage4MentorReview() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STAGE4_MENTOR_REVIEW);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveStage4MentorReview(review) {
    try {
      localStorage.setItem(STORAGE_KEYS.STAGE4_MENTOR_REVIEW, JSON.stringify(review));
      this.logActivity('Submitted Stage 4: Virtual Mentor Review & Guidance Notes.');
      return review;
    } catch {
      return review;
    }
  },

  getStage5FinalRecommendations() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STAGE5_FINAL);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveStage5FinalRecommendations(finalData) {
    try {
      localStorage.setItem(STORAGE_KEYS.STAGE5_FINAL, JSON.stringify(finalData));
      this.logActivity('Finalized Stage 5: Verified Career Recommendations.');
      return finalData;
    } catch {
      return finalData;
    }
  },

  getSimulationResults() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SIMULATION_RESULTS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  recordSimulationResult(careerId, result) {
    try {
      const current = this.getSimulationResults();
      current[careerId] = result;
      localStorage.setItem(STORAGE_KEYS.SIMULATION_RESULTS, JSON.stringify(current));
      this.logActivity(`Completed career micro-simulation for ${careerId}.`);
      return current;
    } catch {
      return {};
    }
  },

  // Stage aliases for flexible usage
  saveSimulationResult(careerId, result) {
    return this.recordSimulationResult(careerId, result);
  },

  getStage3Preliminary() {
    return this.getStage3PreliminaryAnalysis();
  },

  saveStage3Preliminary(data) {
    return this.saveStage3PreliminaryAnalysis(data);
  },

  getStage5Final() {
    return this.getStage5FinalRecommendations();
  },

  saveStage5Final(data) {
    return this.saveStage5FinalRecommendations(data);
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
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  setCompareList(list) {
    try {
      const valid = Array.isArray(list) ? list.slice(0, 3) : [];
      localStorage.setItem(STORAGE_KEYS.COMPARE_LIST, JSON.stringify(valid));
      return valid;
    } catch {
      return [];
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
      return this.setCompareList(updated);
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
      let bypassBlocked = false;

      roadmap.phases.forEach((phase) => {
        phase.tasks.forEach((task) => {
          if (task.id === taskId) {
            // If task is currently incomplete, verify whether it has verified mastery evidence
            if (!task.completed) {
              const hasVerifiedEvidence = Boolean(task.verifiedCheckpoint || task.isMastered);
              // Disallow manual frontend completion without mastery evidence for structured milestones
              if (!hasVerifiedEvidence && !task.isCustom) {
                bypassBlocked = true;
                return;
              }
              task.completed = true;
              isCompletedNow = true;
            } else {
              task.completed = false;
              isCompletedNow = false;
            }
            changedTaskTitle = task.title;
          }
        });
      });

      if (bypassBlocked) {
        console.warn(`[ZHERO Mastery Gate] Manual completion blocked: Milestone "${taskId}" requires verified checkpoint.`);
        return {
          ...roadmap,
          bypassBlocked: true,
          message: 'This milestone has a mastery gate. Please complete the verification checkpoint to demonstrate understanding.',
        };
      }

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

  // Complete milestone after passing Verbal AI Checkpoint
  completeMilestoneWithCheckpoint(taskId, checkpointResult) {
    try {
      const roadmap = this.getActiveRoadmap();
      if (!roadmap) return null;

      let completedTaskTitle = '';
      roadmap.phases.forEach((phase) => {
        phase.tasks.forEach((task) => {
          if (task.id === taskId) {
            task.completed = true;
            task.verifiedCheckpoint = {
              score: checkpointResult.score,
              rubricScores: checkpointResult.rubricScores,
              feedback: checkpointResult.feedback,
              verifiedAt: new Date().toISOString(),
              modelUsed: checkpointResult.modelUsed || 'gemini-2.5-flash',
            };
            completedTaskTitle = task.title;
          }
        });
      });

      roadmap.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROADMAP, JSON.stringify(roadmap));

      if (completedTaskTitle) {
        this.logActivity(`Verified milestone via Verbal AI Checkpoint: "${completedTaskTitle}" (Score: ${checkpointResult.score}%)`);
      }

      return roadmap;
    } catch {
      return null;
    }
  },

  // Automatically injects targeted revision task into roadmap when a student struggles during spaced repetition
  injectAdaptiveRemediationTask(conceptTitle, milestoneTitle) {
    try {
      const roadmap = this.getActiveRoadmap();
      if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) return null;

      // Check if an active adaptive task for this concept already exists
      const alreadyExists = roadmap.phases.some((phase) =>
        phase.tasks.some((t) => t.isAdaptiveRemediation && t.relatedConcept === conceptTitle && !t.completed)
      );
      if (alreadyExists) return roadmap;

      const adaptiveTask = {
        id: `adaptive-${Date.now()}`,
        title: `⚡ Adaptive Review: ${conceptTitle}`,
        duration: '2 – 3 days',
        completed: false,
        isAdaptiveRemediation: true,
        relatedConcept: conceptTitle,
        parentMilestone: milestoneTitle || 'Foundational Milestone',
        reason: 'Automated retrieval practice indicated memory decay on this concept.',
      };

      // Insert at the top of current active phase (first phase with incomplete tasks)
      let targetPhase = roadmap.phases.find((p) => p.tasks.some((t) => !t.completed)) || roadmap.phases[0];
      targetPhase.tasks.unshift(adaptiveTask);

      roadmap.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROADMAP, JSON.stringify(roadmap));
      this.logActivity(`Adaptive learning intelligence inserted revision task for "${conceptTitle}".`);
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
