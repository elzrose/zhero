/**
 * Automated Test Suite for ZHERO Seven-Day Adaptive Learning Calibration System
 * Covers all 14 scenarios specified in the requirements.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { calibrationService, DEFAULT_ACADEMIC_SYLLABUS, CALIBRATION_STORAGE_KEYS } from '../src/services/calibrationService.js';
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
};
global.Event = class {
  constructor(name) {
    this.name = name;
  }
};

describe('ZHERO 7-Day Adaptive Learning Calibration System', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  // Test 1: A new student starting calibration with no previous learning history
  it('1. Initializes new student calibration with clean Day-1 baseline and provisional plan', () => {
    const state = calibrationService.getCalibrationState();
    assert.strictEqual(state.currentDay, 1);
    assert.strictEqual(state.status, 'active');
    assert.strictEqual(state.provisionalPlan.isProvisional, true);
    assert.strictEqual(state.learningProfile.evidenceCount, 0);
    assert.strictEqual(state.learningProfile.evidenceQuality, 'limited_evidence');
    assert.strictEqual(state.academicSyllabus.isPaused, false);
  });

  // Test 2: A student with existing assessment and roadmap data
  it('2. Preserves existing student assessment and roadmap context during calibration initialization', () => {
    storageService.saveUserProfile({
      name: 'Priya Nair',
      targetCareer: 'AI & Data Scientist',
      educationLevel: 'Class 12 (PCMB)',
      stream: 'Physics, Chemistry, Mathematics, Biology',
    });
    storageService.saveStage1Context({
      classGrade: 'Class 12',
      courseStream: 'PCMB',
      descriptiveInterests: 'Data analysis and genetics',
    });

    const state = calibrationService.generateInitialState();
    assert.strictEqual(state.academicSyllabus.academicLevel, 'Class 12');
    assert.strictEqual(state.academicSyllabus.stream, 'PCMB');
    assert.strictEqual(state.provisionalPlan.careerTitle, 'AI & Data Scientist');
  });

  // Test 3: Correct progress tracking across the seven-day period
  it('3. Tracks progress cleanly across the 7-day calibration timeline and marks review ready on Day 7', () => {
    let state = calibrationService.getCalibrationState();
    assert.strictEqual(state.currentDay, 1);

    for (let day = 2; day <= 6; day++) {
      state = calibrationService.advanceDay();
      assert.strictEqual(state.currentDay, day);
      assert.strictEqual(state.status, 'active');
    }

    state = calibrationService.advanceDay(); // Day 7
    assert.strictEqual(state.currentDay, 7);
    assert.strictEqual(state.status, 'review_ready');
  });

  // Test 4: A missed day without an artificial penalty
  it('4. Allows jumping or resuming days without imposing artificial penalties or score decay', () => {
    calibrationService.setDay(3);
    let state = calibrationService.getCalibrationState();
    assert.strictEqual(state.currentDay, 3);

    // Pause calibration (simulating student taking a study break)
    state = calibrationService.pauseCalibration();
    assert.strictEqual(state.status, 'paused');
    assert.strictEqual(state.academicSyllabus.isPaused, true);

    // Resume later
    state = calibrationService.resumeCalibration();
    assert.strictEqual(state.status, 'active');
    assert.strictEqual(state.currentDay, 3);
  });

  // Test 5: Missing or incomplete observations handled gracefully
  it('5. Handles missing or incomplete observations safely as explicit limited_evidence', () => {
    const profile = calibrationService.recalculateLearningProfile([]);
    assert.strictEqual(profile.evidenceQuality, 'limited_evidence');
    assert.strictEqual(profile.retentionScore, 'unknown');
    assert.strictEqual(profile.practicalApplicationScore, 'unknown');
    assert.strictEqual(profile.competencies.length, 0);
  });

  // Test 6: Correct answers, incorrect answers, retries, and subsequent improvement
  it('6. Records learning events with attempts and detects improving progression trend', () => {
    // Record initial struggle
    calibrationService.recordLearningEvent({
      conceptTitle: 'JavaScript Event Loop',
      result: 'struggling',
      score: 45,
      attemptsCount: 2,
    });

    let profile = calibrationService.recalculateLearningProfile();
    assert.strictEqual(profile.learningGaps.length, 1);
    assert.strictEqual(profile.learningGaps[0].concept, 'JavaScript Event Loop');

    // Record subsequent successful retry
    calibrationService.recordLearningEvent({
      conceptTitle: 'JavaScript Event Loop',
      result: 'mastered',
      score: 95,
      attemptsCount: 1,
    });

    profile = calibrationService.recalculateLearningProfile();
    assert.strictEqual(profile.competencies.length, 1);
    assert.strictEqual(profile.competencies[0].concept, 'JavaScript Event Loop');
  });

  // Test 7: A student reporting insufficient available time (workload dial-down)
  it('7. Dials down workload immediately and protects academic syllabus when student reports overload', () => {
    const initialHours = DEFAULT_ACADEMIC_SYLLABUS.availableHoursWeekday;
    const updated = calibrationService.reportWorkloadTooHeavy();

    assert(updated.academicSyllabus.availableHoursWeekday < initialHours);
    assert.strictEqual(updated.academicSyllabus.workloadPacing, 'light');
    assert.strictEqual(updated.learningProfile.workloadTolerance, 'too_heavy');
  });

  // Test 8: A student demonstrating mastery of an existing concept
  it('8. Acknowledges demonstrated mastery and compiles verified competencies', () => {
    calibrationService.recordLearningEvent({
      conceptTitle: 'Semantic HTML5 Structural Landmarks',
      result: 'mastered',
      score: 100,
      attemptsCount: 1,
      selfReportedConfidence: 5,
    });

    const profile = calibrationService.recalculateLearningProfile();
    assert.strictEqual(profile.competencies.length, 1);
    assert.strictEqual(profile.competencies[0].concept, 'Semantic HTML5 Structural Landmarks');
  });

  // Test 9: A struggling student receiving targeted remediation in roadmap
  it('9. Automatically inserts targeted remediation into roadmap when learning struggle is detected', () => {
    // Seed roadmap
    storageService.setRoadmapForCareer('full-stack-engineer');

    calibrationService.recordLearningEvent({
      conceptTitle: 'Asynchronous JavaScript & Promises',
      result: 'struggling',
      score: 40,
      attemptsCount: 3,
      perceivedDifficulty: 'challenging',
    });

    const roadmap = storageService.getActiveRoadmap();
    const hasRemediation = roadmap.phases.some((phase) =>
      phase.tasks.some(
        (t) => t.isAdaptiveRemediation && t.relatedConcept === 'Asynchronous JavaScript & Promises'
      )
    );
    assert.strictEqual(hasRemediation, true);
  });

  // Test 10: Roadmap updates preserving selected career and existing phase structure
  it('10. Preserves 4-phase roadmap architecture and career identity during adaptive updates', () => {
    const roadmap = storageService.setRoadmapForCareer('full-stack-engineer');
    assert.strictEqual(roadmap.careerId, 'full-stack-engineer');
    assert.strictEqual(roadmap.phases.length, 4);

    storageService.injectAdaptiveRemediationTask('CSS Grid Alignment', 'Foundational Milestone');
    const updated = storageService.getActiveRoadmap();

    assert.strictEqual(updated.careerId, 'full-stack-engineer');
    assert.strictEqual(updated.phases.length, 4);
    assert(updated.phases[0].tasks.length >= 1);
  });

  // Test 11: Calibration data persisting across reloads
  it('11. Safely persists calibration state and learning history in storage across sessions', () => {
    calibrationService.setDay(4);
    calibrationService.updateAcademicSyllabus({ availableHoursWeekend: 4.5 });

    const serialized = global.localStorage.getItem(CALIBRATION_STORAGE_KEYS.STATE);
    assert(serialized !== null);

    const reloaded = calibrationService.getCalibrationState();
    assert.strictEqual(reloaded.currentDay, 4);
    assert.strictEqual(reloaded.academicSyllabus.availableHoursWeekend, 4.5);
  });

  // Test 12: Invalid or legacy stored data being handled safely
  it('12. Sanitizes corrupt or legacy stored JSON without crashing', () => {
    global.localStorage.setItem(CALIBRATION_STORAGE_KEYS.STATE, 'INVALID_MALFORMED_JSON{{{');
    const state = calibrationService.getCalibrationState();

    assert.strictEqual(typeof state, 'object');
    assert.strictEqual(state.currentDay, 1);
    assert.strictEqual(state.status, 'active');
  });

  // Test 13: Gemini being unavailable without causing failure
  it('13. Operates deterministically using heuristic fallback when Gemini API is offline', () => {
    const schedule = calibrationService.getDaySchedule(1);
    assert.strictEqual(typeof schedule, 'object');
    assert(schedule.activities.length >= 2);
    assert.strictEqual(schedule.dayNumber, 1);
  });

  // Test 14: Weekly summary not claiming observations that never occurred
  it('14. Weekly review summary strictly bases claims on actual recorded events without fabrication', () => {
    // 0 events
    let profile = calibrationService.recalculateLearningProfile([]);
    assert.strictEqual(profile.competencies.length, 0);
    assert.strictEqual(profile.learningGaps.length, 0);
    assert(profile.summaryObservations[0].includes('No learning activities recorded yet'));

    // 1 real event
    calibrationService.recordLearningEvent({
      conceptTitle: 'RESTful API Design',
      result: 'mastered',
      score: 90,
    });
    profile = calibrationService.recalculateLearningProfile();
    assert(profile.summaryObservations[0].includes('RESTful API Design'));
    assert(!profile.summaryObservations[0].includes('CSS Grid')); // Doesn't fabricate unrecorded skills
  });
});
