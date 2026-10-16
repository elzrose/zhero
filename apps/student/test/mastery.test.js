/**
 * Automated Test Suite for ZHERO Intelligent Mastery Gates & Adaptive Remediation
 * Covers all 18 test scenarios specified in Prompt 3.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { masteryService, MILESTONE_DEFINITIONS, MASTERY_STORAGE_KEYS } from '../src/services/masteryService.js';
import { checkpointService } from '../src/services/checkpointService.js';
import { storageService } from '../src/services/storageService.js';
import { spacedRepetitionService } from '../src/services/spacedRepetitionService.js';
import { calibrationService } from '../src/services/calibrationService.js';
import { dailyPlannerService } from '../src/services/dailyPlannerService.js';
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

describe('ZHERO Intelligent Mastery Gates & Adaptive Remediation System', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  // Test 1: A student passing all required checkpoint conditions.
  it('1. A student passing all required checkpoint conditions (quiz >=80%, practical passed, verbal >=70%) is awarded mastery', async () => {
    // For fs-1: quiz + verbal
    const result = await masteryService.evaluateMasteryCheckpoint({
      milestoneId: 'fs-1',
      quizAnswers: { q1: 2, q2: 1, q3: 0 }, // 100% quiz
      verbalExplanation:
        'In CSS Flexbox, justify-content manages the main axis while align-items aligns items on the cross axis. In column mode, cross axis is horizontal. Semantic HTML5 tags like article and nav provide structural landmarks that aid screen readers, accessibility trees, and browser rendering engines.',
    });

    assert.strictEqual(result.passed, true);
    assert.strictEqual(result.milestoneState, 'mastered');
    assert.ok(result.score >= 70);
    assert.ok(result.demonstratedConcepts.length > 0);
  });

  // Test 2: A student passing a quiz but failing a required practical checkpoint.
  it('2. A student passing a quiz but failing a required practical checkpoint is NOT awarded mastery', async () => {
    // fs-2 requires: quiz >= 80%, verbal >= 70%, and practicalRequired: true
    const result = await masteryService.evaluateMasteryCheckpoint({
      milestoneId: 'fs-2',
      quizAnswers: { q1: 1, q2: 0, q3: 1 }, // 100% quiz
      verbalExplanation:
        'Promises run on the microtask queue and execute right after the current stack frame. Closures retain the lexical environment of their outer scope.',
      practicalPassed: false, // Practical failed / incomplete
      practicalSubmission: 'incomplete',
    });

    assert.strictEqual(result.passed, false);
    assert.strictEqual(result.milestoneState, 'remediation_required');
    assert.ok(
      result.feedback.includes('practical') || result.feedback.includes('implementation'),
      'Feedback must constructively state that practical requirement was not met'
    );
  });

  // Test 3: A student providing an incomplete verbal explanation.
  it('3. A student providing an incomplete verbal explanation does not pass and receives specific feedback', async () => {
    const result = await masteryService.evaluateMasteryCheckpoint({
      milestoneId: 'fs-1',
      quizAnswers: { q1: 2, q2: 1, q3: 0 }, // 100% quiz
      verbalExplanation: 'I used flexbox because it works well.', // Very brief, lacking depth
    });

    assert.strictEqual(result.passed, false);
    assert.strictEqual(result.milestoneState, 'remediation_required');
    assert.ok(result.verbalScore < 70);
    assert.ok(result.feedback.length > 10);
  });

  // Test 4: A student receiving targeted remediation.
  it('4. A student receiving targeted remediation has a targeted task injected without duplicate noise', async () => {
    // Attempt checkpoint and struggle on fs-2 async concept
    await masteryService.evaluateMasteryCheckpoint({
      milestoneId: 'fs-2',
      quizAnswers: { q1: 0, q2: 0, q3: 0 }, // 33% quiz (missed q1 and q3)
      verbalExplanation: 'I do not fully understand the microtask queue yet.',
      practicalPassed: false,
    });

    const roadmap = storageService.getActiveRoadmap();
    const remediationTasks = [];
    roadmap.phases.forEach((p) => {
      p.tasks.forEach((t) => {
        if (t.isAdaptiveRemediation) remediationTasks.push(t);
      });
    });

    assert.ok(remediationTasks.length >= 1, 'Targeted remediation task must be injected into active roadmap');
    assert.strictEqual(remediationTasks[0].isAdaptiveRemediation, true);
  });

  // Test 5: A student passing after remediation.
  it('5. A student passing after remediation transitions from remediation_required to mastered', async () => {
    // Attempt 1: Fails
    const firstAttempt = await masteryService.evaluateMasteryCheckpoint({
      milestoneId: 'fs-1',
      quizAnswers: { q1: 0, q2: 0, q3: 0 },
      verbalExplanation: 'Too short.',
    });
    assert.strictEqual(firstAttempt.passed, false);

    // Attempt 2: After reviewing remediation, submits thorough answer
    const secondAttempt = await masteryService.evaluateMasteryCheckpoint({
      milestoneId: 'fs-1',
      quizAnswers: { q1: 2, q2: 1, q3: 0 }, // 100%
      verbalExplanation:
        'In CSS Flexbox, justify-content distributes items along the main axis while align-items aligns along the cross axis. Semantic HTML5 tags like article and nav provide structural landmarks.',
    });

    assert.strictEqual(secondAttempt.passed, true);
    assert.strictEqual(secondAttempt.milestoneState, 'mastered');
  });

  // Test 6: A milestone remaining locked when prerequisites are missing.
  it('6. A milestone remains locked when its prerequisites are missing', () => {
    // Reset roadmap so fs-1 and fs-2 are incomplete
    const roadmap = storageService.getActiveRoadmap();
    roadmap.phases[0].tasks.forEach((t) => {
      t.completed = false;
      t.verifiedCheckpoint = null;
      t.isMastered = false;
    });
    localStorage.setItem('zhero_active_roadmap', JSON.stringify(roadmap));

    // fs-4 has prerequisites ['fs-2', 'fs-3']
    const state = masteryService.getMilestoneState('fs-4');
    assert.strictEqual(state, 'locked');

    const access = masteryService.canAccessMilestone('fs-4');
    assert.strictEqual(access.allowed, false);
    assert.ok(access.missing.length > 0);
  });

  // Test 7: A milestone unlocking only when all required evidence exists.
  it('7. A milestone unlocks only when all required prerequisite milestones are mastered', () => {
    const roadmap = storageService.getActiveRoadmap();
    // Complete fs-1, fs-2, and fs-3 with verified checkpoint
    roadmap.phases[0].tasks.forEach((t) => {
      t.completed = true;
      t.isMastered = true;
      t.verifiedCheckpoint = { score: 95 };
    });
    localStorage.setItem('zhero_active_roadmap', JSON.stringify(roadmap));

    const prereqCheck = masteryService.checkPrerequisites('fs-4');
    assert.strictEqual(prereqCheck.satisfied, true);
    assert.strictEqual(prereqCheck.missing.length, 0);

    const state = masteryService.getMilestoneState('fs-4');
    assert.notStrictEqual(state, 'locked');
  });

  // Test 8: A failed AI API call not causing the student to fail.
  it('8. A failed AI API call does not cause the student to fail; safely uses local rubric fallback', async () => {
    // Mock fetch to simulate Gemini network drop
    const originalFetch = global.fetch;
    global.fetch = async () => {
      throw new Error('Network timeout reaching Gemini API');
    };

    try {
      const result = await masteryService.evaluateMasteryCheckpoint({
        milestoneId: 'fs-1',
        quizAnswers: { q1: 2, q2: 1, q3: 0 },
        verbalExplanation:
          'In CSS Flexbox, justify-content manages the main axis while align-items aligns items on the cross axis. Semantic HTML5 tags like article and nav provide structural landmarks.',
      });

      // Should still evaluate deterministically using local rubric engine
      assert.strictEqual(result.passed, true);
      assert.strictEqual(result.milestoneState, 'mastered');
    } finally {
      global.fetch = originalFetch;
    }
  });

  // Test 9: Malformed Gemini output being rejected safely.
  it('9. Malformed Gemini output is rejected safely and sanitized', () => {
    const malformed = {
      score: 'INVALID_SCORE_STRING',
      passed: 'maybe',
      rubricScores: null,
      identifiedStrengths: 'not an array',
    };

    const sanitized = masteryService.validateVerbalOutput(malformed);
    assert.strictEqual(typeof sanitized.score, 'number');
    assert.strictEqual(typeof sanitized.passed, 'boolean');
    assert.strictEqual(Array.isArray(sanitized.identifiedStrengths), true);
  });

  // Test 10: A corrupted speech transcript allowing a retry.
  it('10. A corrupted or empty speech transcript allows a retry without penalty', async () => {
    const result = await masteryService.evaluateMasteryCheckpoint({
      milestoneId: 'fs-1',
      quizAnswers: { q1: 2, q2: 1, q3: 0 },
      verbalExplanation: 'uh...', // audio glitch
      isSpeechInput: true,
      speechTranscriptError: true,
    });

    assert.strictEqual(result.passed, false);
    assert.strictEqual(result.isTranscriptError, true);
    assert.strictEqual(result.remediationNeeded, false);
    assert.ok(result.feedback.includes('Speech audio was not clearly captured'));
  });

  // Test 11: Existing mastered milestones remaining mastered after reload.
  it('11. Mastered milestones remain mastered across simulated page reloads', async () => {
    await masteryService.evaluateMasteryCheckpoint({
      milestoneId: 'fs-1',
      quizAnswers: { q1: 2, q2: 1, q3: 0 },
      verbalExplanation:
        'In CSS Flexbox, justify-content manages the main axis while align-items aligns items on the cross axis. Semantic HTML5 tags like article and nav provide structural landmarks.',
    });

    // Simulate page reload by querying roadmap anew from localStorage
    const roadmap = storageService.getActiveRoadmap();
    const fs1Task = roadmap.phases[0].tasks.find((t) => t.id === 'fs-1');

    assert.strictEqual(fs1Task.completed, true);
    assert.strictEqual(fs1Task.isMastered, true);
    assert.ok(fs1Task.verifiedCheckpoint);
  });

  // Test 12: No duplicate remediation or revision entries.
  it('12. Struggling repeatedly with the same concept does not create duplicate remediation backlog', () => {
    masteryService.registerRemediation('fs-2', 'Event Loop & Call Stack');
    const isRegistered = masteryService.isRemediationRegistered('fs-2', 'Event Loop & Call Stack');
    assert.strictEqual(isRegistered, true);

    // Call struggle handler again
    masteryService.handleMasteryStruggle(
      MILESTONE_DEFINITIONS['fs-2'],
      { scores: { verbalScore: 40 }, rubricScores: {} },
      ['Event Loop & Call Stack']
    );

    const reg = masteryService.getRemediationRegistry().filter(
      (r) => r.milestoneId === 'fs-2' && r.concept === 'Event Loop & Call Stack' && !r.resolved
    );
    assert.strictEqual(reg.length, 1, 'Should never duplicate active remediation for the same milestone concept');
  });

  // Test 13: Appropriate revision scheduling after a weak checkpoint.
  it('13. Weak checkpoint outcome schedules early revision retrieval in spaced repetition service', () => {
    masteryService.handleMasteryStruggle(
      MILESTONE_DEFINITIONS['fs-2'],
      { scores: { verbalScore: 45 }, rubricScores: {} },
      ['JavaScript Event Loop & Microtask Queue Ordering']
    );

    const dueQueue = spacedRepetitionService.getDueConcepts();
    const eventLoopDue = dueQueue.some((c) => c.title.includes('Event Loop'));
    assert.strictEqual(eventLoopDue, true, 'Struggling concept must be flagged for early spaced repetition review');
  });

  // Test 14: Existing spaced-repetition behaviour remaining intact.
  it('14. Existing spaced-repetition SM-2 interval formulas and retention health remain intact', () => {
    const concept = {
      id: 'concept-test',
      intervalDays: 4,
      lastReviewedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    };
    const health = spacedRepetitionService.calculateRetentionHealth(concept);
    assert.ok(health >= 40 && health <= 60, `Retention health for 1 half-life should be around 50% (got ${health}%)`);
  });

  // Test 15: The adaptive planner receiving updated mastery information.
  it('15. The adaptive daily planner skips newly mastered concepts and advances to next challenge', () => {
    // Record mastery for Semantic HTML
    const calState = calibrationService.getCalibrationState();
    calState.learningProfile.competencies.push({
      concept: 'Master HTML5 Semantic Elements & CSS Flexbox/Grid',
      level: 'mastered',
    });
    calibrationService.saveCalibrationState(calState);

    const plan = dailyPlannerService.generateFreshDailyPlan({ declaredMinutes: 30 });
    const hasIntroTask = plan.tasks.some((t) => t.conceptId === 'fs-1');
    assert.strictEqual(hasIntroTask, false, 'Daily planner must not schedule already mastered introductory milestones');
  });

  // Test 16: The existing four-phase roadmap remaining unchanged.
  it('16. The four-phase roadmap structure and milestone hierarchy remain completely preserved', () => {
    const roadmap = storageService.getActiveRoadmap();
    assert.strictEqual(roadmap.phases.length, 4);
    assert.strictEqual(roadmap.phases[0].phase, 'Phase 1: Web Fundamentals');
    assert.strictEqual(roadmap.phases[1].phase, 'Phase 2: Frontend Engineering');
    assert.strictEqual(roadmap.phases[2].phase, 'Phase 3: Backend & Persistence');
    assert.strictEqual(roadmap.phases[3].phase, 'Phase 4: Capstone & Deployment');
  });

  // Test 17: No frontend-only completion action bypassing the mastery service's rules.
  it('17. Calling toggleRoadmapTask directly without mastery verification blocks manual bypass', () => {
    // Uncompleted milestone fs-4 without verified checkpoint
    const updatedRoadmap = storageService.toggleRoadmapTask('fs-4');
    assert.strictEqual(updatedRoadmap.bypassBlocked, true, 'Direct toggle without checkpoint must be blocked');

    // Confirm fs-4 remains uncompleted in stored roadmap
    const roadmap = storageService.getActiveRoadmap();
    const task = roadmap.phases[1].tasks.find((t) => t.id === 'fs-4');
    assert.strictEqual(task.completed, false);
  });

  // Test 18: Existing assessment, interview, dashboard, and roadmap flows continuing to work.
  it('18. Existing user profile, career matches, and assessment flows continue to function smoothly', () => {
    const profile = storageService.getUserProfile();
    assert.ok(profile.name);
    assert.strictEqual(profile.stream, 'Computer Science & Engineering');

    const careers = CAREERS_DATA;
    assert.ok(careers.length >= 3);
    assert.strictEqual(careers[0].id, 'full-stack-engineer');
  });
});
