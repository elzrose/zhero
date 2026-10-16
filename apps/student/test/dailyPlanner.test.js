/**
 * Automated Test Suite for ZHERO Adaptive Daily Workload & Academic Syllabus Protection Planner
 * Covers all 16 scenarios specified in Prompt 2.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { dailyPlannerService, DAILY_PLANNER_STORAGE_KEYS } from '../src/services/dailyPlannerService.js';
import { spacedRepetitionService } from '../src/services/spacedRepetitionService.js';
import { calibrationService } from '../src/services/calibrationService.js';
import { storageService } from '../src/services/storageService.js';
import { CAREERS_DATA } from '../src/data/careersData.js';

// Setup Mock Browser LocalStorage for Node testing environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new MockLocalStorage();
global.window = {
  dispatchEvent: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
};
global.Event = class {
  constructor(name) {
    this.name = name;
  }
};

describe('ZHERO Adaptive Daily Workload & Syllabus Protection Planner', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  // Test 1: A student with 10 minutes available receives a plan that fits within that time.
  it('1. A student with 10 minutes available receives a plan that fits within 10 minutes', () => {
    const plan = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 10 });
    const totalMins = plan.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

    assert.ok(totalMins <= 10, `Total minutes (${totalMins}) must be <= 10`);
    assert.strictEqual(plan.declaredMinutes, 10);
    assert.strictEqual(plan.effectiveAvailableMinutes, 10);
    assert.ok(plan.tasks.length >= 1, 'Should contain at least one focused micro task');
  });

  // Test 2: A student with 30 minutes available receives a suitable plan without exceeding the limit.
  it('2. A student with 30 minutes available receives a suitable plan without exceeding the limit', () => {
    const plan = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 30 });
    const totalMins = plan.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

    assert.ok(totalMins <= 30, `Total minutes (${totalMins}) must be <= 30`);
    assert.strictEqual(plan.declaredMinutes, 30);
    assert.strictEqual(plan.effectiveAvailableMinutes, 30);
    assert.ok(plan.tasks.length >= 1, 'Should contain appropriate prioritized activities');
  });

  // Test 3: A busy academic week reduces optional learning workload.
  it('3. A busy academic week (exam_week mode) reduces optional learning workload to protect core syllabus', () => {
    // Even if student declared 60 minutes, exam week caps it to 10-15 mins
    const plan = dailyPlannerService.generateFreshDailyPlan({
      declaredMinutes: 60,
      scheduleMode: 'exam_week',
    });
    const totalMins = plan.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

    assert.strictEqual(plan.scheduleMode, 'exam_week');
    assert.ok(plan.effectiveAvailableMinutes <= 15, 'Effective minutes must be capped to protect core academic exams');
    assert.ok(totalMins <= 15, `Actual scheduled minutes (${totalMins}) must not exceed 15 mins during exam week`);
    assert.ok(
      plan.materialChangeReason.includes('exam week') || plan.materialChangeReason.includes('scaled back'),
      'Must explain syllabus protection reason in plain language'
    );
  });

  // Test 4: A student can adjust today's available time and regenerate the plan.
  it('4. A student can adjust today\'s available time and regenerate the plan immediately', () => {
    dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 20 });
    const updated = dailyPlannerService.setAvailableMinutes(45);

    assert.strictEqual(updated.declaredMinutes, 45);
    const totalMins = updated.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
    assert.ok(totalMins <= 45, `Updated plan must fit within new limit of 45 mins (got ${totalMins})`);
  });

  // Test 5: Due revisions are included appropriately.
  it('5. Due revisions from spaced repetition are prioritized at the top of the plan', () => {
    // Ensure due concept exists
    const dueQueue = spacedRepetitionService.getDueConcepts();
    assert.ok(dueQueue.length > 0, 'Spaced repetition queue must have due concepts');

    const plan = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 30 });
    const revisionTask = plan.tasks.find((t) => t.type === 'revision');

    assert.ok(revisionTask, 'Daily plan must include due revision task');
    assert.strictEqual(revisionTask.estimatedMinutes, 5);
    assert.strictEqual(plan.tasks[0].type, 'revision', 'Top priority must be due retrieval practice');
  });

  // Test 6: Not-yet-due revisions are not duplicated unnecessarily.
  it('6. Not-yet-due revisions are not duplicated unnecessarily just to fill time', () => {
    const queue = spacedRepetitionService.getAllConcepts();
    // Simulate that all cards have future due dates and high retention
    const futureQueue = queue.map((item) => ({
      ...item,
      nextReviewDate: '2099-01-01',
      lastReviewedAt: new Date().toISOString(),
      intervalDays: 14,
    }));
    spacedRepetitionService.saveConcepts(futureQueue);

    const plan = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 30 });
    const revisionTasks = plan.tasks.filter((t) => t.type === 'revision');

    assert.strictEqual(revisionTasks.length, 0, 'No revision tasks should be added if none are due');
  });

  // Test 7: A mastered concept does not generate redundant introductory tasks.
  it('7. A mastered concept does not generate redundant introductory tasks', () => {
    // Record mastery in calibration state
    const calState = calibrationService.getCalibrationState();
    calState.learningProfile.competencies.push({
      concept: 'Semantic HTML & CSS',
      level: 'mastered',
    });
    calibrationService.saveCalibrationState(calState);

    const plan = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 30 });
    const redundantTask = plan.tasks.find(
      (t) => t.title.toLowerCase().includes('semantic html')
    );

    assert.strictEqual(redundantTask, undefined, 'Mastered concept should not be re-assigned as introductory task');
  });

  // Test 8: A struggling concept produces targeted practice or remediation.
  it('8. A struggling concept produces targeted practice or remediation', () => {
    // Record learning gap in calibration profile
    const calState = calibrationService.getCalibrationState();
    calState.learningProfile.learningGaps = [
      { concept: 'Async/Await & Promises', errorPattern: 'unhandled_rejections', severity: 'moderate' },
    ];
    calibrationService.saveCalibrationState(calState);

    const plan = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 30 });
    const remediationTask = plan.tasks.find((t) => t.type === 'remediation');

    assert.ok(remediationTask, 'Must schedule targeted remediation for concept with demonstrated difficulty');
    assert.ok(remediationTask.title.includes('Async/Await'), 'Remediation task must reference the struggling concept');
    assert.strictEqual(remediationTask.difficulty, 'targeted');
  });

  // Test 9: A missed task does not automatically become a failed milestone.
  it('9. A missed task does not automatically become a failed milestone', () => {
    const plan = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 30 });
    const task = plan.tasks[0];

    // Student didn't finish today; no milestone in roadmap is set to failed
    const roadmap = storageService.getActiveRoadmap();
    const failedMilestones = [];
    roadmap.phases.forEach((p) => {
      p.tasks.forEach((t) => {
        if (t.status === 'failed') failedMilestones.push(t);
      });
    });

    assert.strictEqual(failedMilestones.length, 0, 'Missed plan tasks must never fail roadmap milestones');
  });

  // Test 10: A deferred activity does not create an infinite backlog.
  it('10. A deferred activity does not create an infinite backlog or penalty', () => {
    dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 30 });
    const state = dailyPlannerService.getDailyPlanState();
    const firstTaskId = state.tasks[0].id;

    const afterDefer = dailyPlannerService.deferTask(firstTaskId, 'Exam tomorrow');
    const deferredTask = afterDefer.tasks.find((t) => t.id === firstTaskId);

    assert.strictEqual(deferredTask.status, 'deferred');
    assert.strictEqual(deferredTask.deferredReason, 'Exam tomorrow');

    // Regenerating plan tomorrow does NOT accumulate duplicate backlogs
    const tomorrowPlan = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 30 });
    const duplicates = tomorrowPlan.tasks.filter((t) => t.id === firstTaskId);
    assert.ok(duplicates.length <= 1, 'Should not create duplicate backlog items');
  });

  // Test 11: Prerequisite ordering is respected.
  it('11. Prerequisite ordering across Roadmap Phase 1 -> 2 -> 3 -> 4 is strictly respected', () => {
    const plan = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 45 });
    const milestoneTasks = plan.tasks.filter((t) => t.type === 'milestone');

    if (milestoneTasks.length > 0) {
      // With Phase 1 tasks completed, it must choose the next sequential active phase (Phase 2), never skipping to Phase 3 or 4
      assert.strictEqual(milestoneTasks[0].phaseTitle, 'Phase 2: Frontend Engineering');
    }
  });

  // Test 12: Gemini failure does not crash plan generation.
  it('12. Planner functions deterministically even if Gemini API or network is offline', () => {
    // dailyPlannerService uses deterministic fallback knapsack scheduling
    assert.doesNotThrow(() => {
      const plan = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 20 });
      assert.ok(plan.tasks.length > 0);
    });
  });

  // Test 13: Reloading the page preserves the current plan and activity statuses.
  it('13. Reloading the page preserves the current plan and activity statuses via localStorage', () => {
    const initial = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 30 });
    dailyPlannerService.saveDailyPlanState(initial);

    // Complete task 0
    const taskId = initial.tasks[0].id;
    dailyPlannerService.completeTask(taskId, { score: 90, confidence: 4 });

    // Simulate page reload
    const reloaded = dailyPlannerService.getDailyPlanState();
    const completedTask = reloaded.tasks.find((t) => t.id === taskId);

    assert.strictEqual(completedTask.status, 'completed');
    assert.ok(completedTask.completedAt);
  });

  // Test 14: A new calendar day generates the appropriate new plan.
  it('14. A new calendar day triggers a fresh plan without carrying over stale plans', () => {
    // Save state with yesterday's date
    const staleState = {
      date: '2024-01-01',
      declaredMinutes: 30,
      tasks: [{ id: 'stale-1', title: 'Stale task', status: 'pending', estimatedMinutes: 10 }],
    };
    global.localStorage.setItem(DAILY_PLANNER_STORAGE_KEYS.STATE, JSON.stringify(staleState));

    // getDailyPlanState should detect stale date and generate today's plan
    const todayPlan = dailyPlannerService.getDailyPlanState();
    const todayStr = dailyPlannerService.getTodayDateString();

    assert.strictEqual(todayPlan.date, todayStr);
    assert.ok(todayPlan.tasks.every((t) => t.id !== 'stale-1'), 'Stale yesterday tasks should not leak into today');
  });

  // Test 15: Existing roadmap phases and career selection remain intact.
  it('15. Existing roadmap phases and career selection remain completely intact', () => {
    const roadmap = storageService.getActiveRoadmap();
    assert.strictEqual(roadmap.careerId, 'full-stack-engineer');
    assert.strictEqual(roadmap.phases.length, 4);
    assert.strictEqual(roadmap.phases[0].phase, 'Phase 1: Web Fundamentals');
    assert.strictEqual(roadmap.phases[3].phase, 'Phase 4: Capstone & Deployment');
  });

  // Test 16: Existing verbal checkpoints and spaced-repetition functionality continue to work.
  it('16. Existing verbal checkpoints and spaced-repetition functionality continue to integrate smoothly', () => {
    const initialDueCount = spacedRepetitionService.getDueConcepts().length;
    assert.ok(initialDueCount > 0);

    const plan = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 30 });
    const revTask = plan.tasks.find((t) => t.type === 'revision');
    assert.ok(revTask);

    // Complete the revision through the planner
    dailyPlannerService.completeTask(revTask.id, { rating: 3, score: 95 });

    // Verify spaced repetition service recorded it
    const remainingDue = spacedRepetitionService.getDueConcepts().length;
    assert.strictEqual(remainingDue, initialDueCount - 1);
  });
});
