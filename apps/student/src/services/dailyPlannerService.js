/**
 * ZHERO Adaptive Daily Workload Planner & Academic Syllabus Protection Service
 * Dynamically schedules optional career learning around core academic commitments,
 * respects declared available time, and prioritizes revisions, remediation, and roadmap milestones.
 */

import { spacedRepetitionService } from './spacedRepetitionService.js';
import { calibrationService } from './calibrationService.js';
import { storageService } from './storageService.js';
import { CAREERS_DATA } from '../data/careersData.js';

export const DAILY_PLANNER_STORAGE_KEYS = {
  STATE: 'zhero_daily_plan_state',
};

// Default availability presets and schedule profiles
export const DEFAULT_DAILY_SETTINGS = {
  declaredMinutes: 30, // 10 | 20 | 30 | 45 | 60
  scheduleMode: 'normal', // 'normal' | 'exam_week' | 'holiday' | 'rest_day'
  stressLevel: 'manageable', // 'manageable' | 'heavy' | 'overwhelmed'
  preferredSlot: 'evening',
  academicNotes: '',
};

class DailyPlannerService {
  constructor() {
    this.cachedPlan = null;
  }

  getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // --- Read Persisted Plan State ---
  getDailyPlanState() {
    if (typeof window === 'undefined') {
      return this.generateFreshDailyPlan();
    }
    try {
      const data = localStorage.getItem(DAILY_PLANNER_STORAGE_KEYS.STATE);
      if (!data) {
        const fresh = this.generateFreshDailyPlan();
        this.saveDailyPlanState(fresh);
        return fresh;
      }

      const parsed = JSON.parse(data);
      const todayStr = this.getTodayDateString();

      // If stored plan belongs to a previous calendar day, generate a fresh plan for today
      // without penalizing missed tasks from yesterday
      if (parsed.date !== todayStr) {
        const fresh = this.generateFreshDailyPlan({
          declaredMinutes: parsed.declaredMinutes || 30,
          scheduleMode: parsed.scheduleMode || 'normal',
          stressLevel: parsed.stressLevel || 'manageable',
          weeklyHistory: parsed.weeklyHistory || [],
        });
        this.saveDailyPlanState(fresh);
        return fresh;
      }

      return this.sanitizeDailyPlanState(parsed);
    } catch (err) {
      console.warn('Error reading daily plan state, resetting to safe baseline:', err);
      const fresh = this.generateFreshDailyPlan();
      return fresh;
    }
  }

  sanitizeDailyPlanState(state) {
    if (!state || typeof state !== 'object') {
      return this.generateFreshDailyPlan();
    }

    return {
      date: state.date || this.getTodayDateString(),
      declaredMinutes: Math.max(10, Math.min(120, Number(state.declaredMinutes) || 30)),
      effectiveAvailableMinutes: Math.max(10, Number(state.effectiveAvailableMinutes) || 30),
      scheduleMode: state.scheduleMode || 'normal',
      stressLevel: state.stressLevel || 'manageable',
      materialChangeReason: state.materialChangeReason || '',
      tasks: Array.isArray(state.tasks) ? state.tasks : [],
      weeklyHistory: Array.isArray(state.weeklyHistory) ? state.weeklyHistory : [],
      lastUpdated: state.lastUpdated || new Date().toISOString(),
    };
  }

  saveDailyPlanState(state) {
    if (typeof window === 'undefined') return state;
    try {
      const sanitized = this.sanitizeDailyPlanState(state);
      localStorage.setItem(DAILY_PLANNER_STORAGE_KEYS.STATE, JSON.stringify(sanitized));
      window.dispatchEvent(new Event('zhero_daily_plan_updated'));
      return sanitized;
    } catch (err) {
      console.error('Failed to save daily plan state:', err);
      return state;
    }
  }

  // --- Generate Fresh Prioritized Daily Plan ---
  generateFreshDailyPlan(overrides = {}) {
    const todayStr = this.getTodayDateString();
    const calibrationState = calibrationService.getCalibrationState();
    const academicSyllabus = calibrationState?.academicSyllabus || {};
    const roadmap = storageService.getActiveRoadmap();
    const learningProfile = calibrationState?.learningProfile || {};

    const declaredMinutes = overrides.declaredMinutes !== undefined ? overrides.declaredMinutes : 30;
    const scheduleMode = overrides.scheduleMode || 'normal';
    const stressLevel = overrides.stressLevel || 'manageable';

    // 1. Calculate effective available minutes based on academic priorities
    let effectiveAvailableMinutes = declaredMinutes;
    let materialChangeReason = '';

    // Rule: Exam week dials down workload to protect core academic studies
    if (scheduleMode === 'exam_week') {
      effectiveAvailableMinutes = Math.min(15, declaredMinutes);
      materialChangeReason =
        'Workload scaled back to 10–15 mins because of your active core academic exam week.';
    } else if (scheduleMode === 'rest_day') {
      effectiveAvailableMinutes = 10;
      materialChangeReason = 'Rest-day pacing active. Only a minimal 5-minute retrieval check is suggested.';
    } else if (stressLevel === 'overwhelmed') {
      effectiveAvailableMinutes = Math.min(15, declaredMinutes);
      materialChangeReason =
        'Workload reduced to protect your wellbeing based on your reported stress level.';
    } else if (declaredMinutes <= 15) {
      materialChangeReason = 'Compact session mode selected. Focused on a single high-priority action.';
    }

    // 2. Collect Candidate Tasks
    const candidateTasks = [];

    // --- Category A: Due Spaced-Repetition Reviews (Top Priority) ---
    const dueRevisions = spacedRepetitionService.getDueConcepts();
    if (dueRevisions.length > 0) {
      // Pick at most 1 or 2 due concepts to prevent crowding out the whole plan
      const topDue = dueRevisions[0];
      candidateTasks.push({
        id: `rev-${topDue.id}`,
        conceptId: topDue.id,
        title: `⚡ Due Revision: ${topDue.title}`,
        type: 'revision',
        estimatedMinutes: 5,
        difficulty: 'moderate',
        priorityWeight: 100, // Highest priority
        status: 'pending',
        isOptional: false,
        reason: 'Memory retention schedule indicates this concept is due for retrieval review today.',
        actionLabel: 'Review Concept',
        relatedConcept: topDue.title,
      });

      if (dueRevisions.length > 1 && effectiveAvailableMinutes >= 30) {
        const secondDue = dueRevisions[1];
        candidateTasks.push({
          id: `rev-${secondDue.id}`,
          conceptId: secondDue.id,
          title: `⚡ Due Revision: ${secondDue.title}`,
          type: 'revision',
          estimatedMinutes: 5,
          difficulty: 'moderate',
          priorityWeight: 90,
          status: 'pending',
          isOptional: false,
          reason: 'Scheduled retrieval card ready to consolidate long-term memory.',
          actionLabel: 'Review Concept',
          relatedConcept: secondDue.title,
        });
      }
    }

    // --- Category B: Active Remediation Tasks (High Priority) ---
    // If roadmap has an adaptive remediation milestone, or calibration profile detected gaps
    const gaps = learningProfile.learningGaps || [];
    if (gaps.length > 0 && effectiveAvailableMinutes >= 20) {
      const topGap = gaps[0];
      candidateTasks.push({
        id: `remed-${topGap.concept.replace(/\s+/g, '-').toLowerCase()}`,
        conceptId: topGap.concept,
        title: `🎯 Targeted Practice: ${topGap.concept}`,
        type: 'remediation',
        estimatedMinutes: Math.min(15, effectiveAvailableMinutes - 5),
        difficulty: 'targeted',
        priorityWeight: 85,
        status: 'pending',
        isOptional: false,
        reason: 'Recent attempts showed difficulty with this concept. Short targeted exercise before advancing.',
        actionLabel: 'Practice Concept',
        relatedConcept: topGap.concept,
      });
    }

    // --- Category C: Next Roadmap Milestone Task (Core Progression) ---
    if (roadmap && Array.isArray(roadmap.phases)) {
      // Find the first phase with uncompleted tasks (preserving Phase 1 -> 2 -> 3 -> 4)
      const activePhase = roadmap.phases.find((p) => p.tasks.some((t) => !t.completed)) || roadmap.phases[0];
      const nextTask = activePhase?.tasks?.find((t) => !t.completed);

      if (nextTask) {
        // Check if concept is already mastered
        const isMastered =
          (learningProfile.competencies || []).some(
            (c) => c.concept.toLowerCase() === nextTask.title.toLowerCase()
          ) || Boolean(nextTask.isMastered || nextTask.verifiedCheckpoint);

        // If not already mastered, add to candidates
        if (!isMastered) {
          candidateTasks.push({
            id: `milestone-${nextTask.id}`,
            conceptId: nextTask.id,
            title: `📘 Roadmap Milestone: ${nextTask.title}`,
            type: 'milestone',
            estimatedMinutes: effectiveAvailableMinutes <= 15 ? 10 : 15,
            difficulty: 'moderate',
            priorityWeight: 70,
            status: 'pending',
            isOptional: false,
            phaseTitle: activePhase.phase,
            reason: `Active milestone in ${activePhase.phase}. Preserves sequential prerequisite order.`,
            actionLabel: 'Open Milestone',
            relatedConcept: nextTask.title,
          });
        }
      }
    }

    // --- Category D: Practical / Checkpoint or Enrichment (If time permits) ---
    if (effectiveAvailableMinutes >= 45) {
      candidateTasks.push({
        id: `enrich-${Date.now()}`,
        title: '🌟 Applied Practical Scenario: Architecture Defense',
        type: 'enrichment',
        estimatedMinutes: 15,
        difficulty: 'advanced',
        priorityWeight: 40,
        status: 'pending',
        isOptional: true,
        reason: 'Optional extension challenge: test conceptual depth in a real-world scenario.',
        actionLabel: 'Explore Scenario',
        relatedConcept: 'System Architecture',
      });
    }

    // 3. Deterministic Knapsack Fit: Select tasks that fit strictly within effectiveAvailableMinutes
    candidateTasks.sort((a, b) => b.priorityWeight - a.priorityWeight);

    const selectedTasks = [];
    let currentAllocatedMinutes = 0;

    for (const task of candidateTasks) {
      if (currentAllocatedMinutes + task.estimatedMinutes <= effectiveAvailableMinutes) {
        selectedTasks.push(task);
        currentAllocatedMinutes += task.estimatedMinutes;
      }
    }

    // Fallback if no task fit (e.g. 10m budget and all tasks were 15m)
    if (selectedTasks.length === 0 && candidateTasks.length > 0) {
      const trimmed = { ...candidateTasks[0], estimatedMinutes: effectiveAvailableMinutes };
      selectedTasks.push(trimmed);
      currentAllocatedMinutes = effectiveAvailableMinutes;
    }

    return {
      date: todayStr,
      declaredMinutes,
      effectiveAvailableMinutes,
      scheduleMode,
      stressLevel,
      materialChangeReason,
      tasks: selectedTasks,
      weeklyHistory: overrides.weeklyHistory || [],
      lastUpdated: new Date().toISOString(),
    };
  }

  // --- Plan Action Handlers ---

  // Adjust available time and immediately recalculate plan
  setAvailableMinutes(minutes) {
    const clamped = Math.max(10, Math.min(120, Number(minutes) || 30));
    const current = this.getDailyPlanState();
    const updated = this.generateFreshDailyPlan({
      ...current,
      declaredMinutes: clamped,
    });
    return this.saveDailyPlanState(updated);
  }

  // Adjust schedule mode ('normal', 'exam_week', 'holiday', 'rest_day')
  setScheduleMode(mode) {
    const current = this.getDailyPlanState();
    const updated = this.generateFreshDailyPlan({
      ...current,
      scheduleMode: mode,
    });
    return this.saveDailyPlanState(updated);
  }

  // Self-reported stress / workload level check-in
  setStressLevel(level) {
    const current = this.getDailyPlanState();
    const updated = this.generateFreshDailyPlan({
      ...current,
      stressLevel: level,
    });
    return this.saveDailyPlanState(updated);
  }

  // Single action: "Lighten Today's Workload"
  lightenTodayWorkload() {
    const current = this.getDailyPlanState();
    const reducedMinutes = Math.max(10, Math.round(current.declaredMinutes * 0.6));
    const updated = this.generateFreshDailyPlan({
      ...current,
      declaredMinutes: reducedMinutes,
      stressLevel: 'heavy',
    });
    updated.materialChangeReason = 'Workload dialed down to fit a lighter, lower-pressure session.';
    return this.saveDailyPlanState(updated);
  }

  // Mark task as completed
  completeTask(taskId, outcome = {}) {
    const state = this.getDailyPlanState();
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return state;

    task.status = 'completed';
    task.completedAt = new Date().toISOString();

    // If it was a revision task, record in spacedRepetitionService
    if (task.type === 'revision' && task.conceptId) {
      spacedRepetitionService.recordRetrieval(task.conceptId, outcome.rating || 2, outcome.notes || '');
    }

    // Record verified learning event in calibrationService
    calibrationService.recordLearningEvent({
      activityType: task.type === 'revision' ? 'spaced_repetition' : 'milestone_task',
      conceptTitle: task.relatedConcept || task.title,
      conceptId: task.conceptId || task.id,
      result: 'mastered',
      score: outcome.score || 90,
      timeSpentMinutes: task.estimatedMinutes,
      selfReportedConfidence: outcome.confidence || 4,
      perceivedDifficulty: 'manageable',
      notes: `Completed via Daily Plan: "${task.title}"`,
    });

    // Update weekly history
    this.recordWeeklyHistory(task.estimatedMinutes);

    return this.saveDailyPlanState(state);
  }

  // Defer a task without penalty
  deferTask(taskId, reason = 'Postponed to future session') {
    const state = this.getDailyPlanState();
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return state;

    task.status = 'deferred';
    task.deferredReason = reason;

    // Do NOT mark as failed or create duplicate backlog
    return this.saveDailyPlanState(state);
  }

  // Request shorter micro-alternative for a task
  requestShorterAlternative(taskId) {
    const state = this.getDailyPlanState();
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return state;

    const originalMinutes = task.estimatedMinutes;
    task.estimatedMinutes = Math.max(5, Math.round(originalMinutes * 0.5));
    task.title = `⚡ Micro-Check: ${task.relatedConcept || task.title}`;
    task.isMicroAlternative = true;
    task.reason = 'Shortened to a concise micro-exercise per student request.';

    return this.saveDailyPlanState(state);
  }

  // Helper to record weekly planned vs completed minutes calmly
  recordWeeklyHistory(completedMinutes = 0) {
    const state = this.getDailyPlanState();
    const todayStr = this.getTodayDateString();
    let history = state.weeklyHistory || [];

    let todayEntry = history.find((h) => h.date === todayStr);
    if (!todayEntry) {
      todayEntry = {
        date: todayStr,
        plannedMinutes: state.effectiveAvailableMinutes,
        completedMinutes: 0,
        tasksCompleted: 0,
      };
      history.push(todayEntry);
    }

    todayEntry.completedMinutes += completedMinutes;
    todayEntry.tasksCompleted += 1;

    // Keep rolling 7 days
    state.weeklyHistory = history.slice(-7);
  }
}

export const dailyPlannerService = new DailyPlannerService();
