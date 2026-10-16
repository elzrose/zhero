/**
 * ZHERO Seven-Day Adaptive Learning Calibration Service
 * Observes real student learning behavior, protects the core academic syllabus,
 * generates immediate Day-1 provisional plans, and continuously personalizes the 4-phase roadmap.
 */

import { storageService } from './storageService.js';
import { CAREERS_DATA } from '../data/careersData.js';
import { RESOURCES_DATA } from '../data/resourcesData.js';

export const CALIBRATION_STORAGE_KEYS = {
  STATE: 'zhero_learning_calibration_state',
  EVENTS: 'zhero_learning_events_history',
};

// Default Academic Syllabus baseline (Protects Core School/College coursework)
export const DEFAULT_ACADEMIC_SYLLABUS = {
  academicLevel: 'Undergraduate (2nd Year)',
  stream: 'Computer Science & Engineering',
  coreSubjects: [
    'Data Structures & Algorithms',
    'Discrete Mathematics',
    'Computer Organization & Architecture',
    'Database Management Systems',
  ],
  upcomingExams: [
    { subject: 'Data Structures & Algorithms', date: 'In 3 weeks', priority: 'high' },
    { subject: 'Discrete Mathematics', date: 'In 4 weeks', priority: 'medium' },
  ],
  availableHoursWeekday: 1.5, // hours/day for optional ZHERO learning
  availableHoursWeekend: 3.0,
  preferredSlot: 'evening',
  workloadPacing: 'moderate', // 'light' | 'moderate' | 'intensive'
  isPaused: false,
};

class CalibrationService {
  constructor() {
    this.memoryCache = null;
  }

  // --- State Initialization & Retrieval ---
  getCalibrationState() {
    if (typeof window === 'undefined') {
      return this.generateInitialState();
    }
    try {
      const data = localStorage.getItem(CALIBRATION_STORAGE_KEYS.STATE);
      if (!data) {
        const initial = this.generateInitialState();
        this.saveCalibrationState(initial);
        return initial;
      }
      const parsed = JSON.parse(data);
      // Ensure schema integrity and backward-compatibility
      return this.sanitizeCalibrationState(parsed);
    } catch (err) {
      console.warn('Error reading calibration state, resetting to safe baseline:', err);
      const initial = this.generateInitialState();
      return initial;
    }
  }

  sanitizeCalibrationState(state) {
    if (!state || typeof state !== 'object') {
      return this.generateInitialState();
    }
    return {
      version: 1,
      status: state.status || 'active', // 'not_started' | 'active' | 'paused' | 'review_ready' | 'completed'
      currentDay: Math.min(Math.max(Number(state.currentDay) || 1, 1), 7),
      startDate: state.startDate || new Date().toISOString(),
      lastActiveDate: state.lastActiveDate || new Date().toISOString(),
      academicSyllabus: {
        ...DEFAULT_ACADEMIC_SYLLABUS,
        ...(state.academicSyllabus || {}),
      },
      provisionalPlan: state.provisionalPlan || this.buildDay1ProvisionalPlan(),
      learningProfile: state.learningProfile || this.buildDefaultLearningProfile(),
      dailyLogs: state.dailyLogs || {},
      workloadAdjustmentsCount: Number(state.workloadAdjustmentsCount) || 0,
    };
  }

  saveCalibrationState(state) {
    if (typeof window === 'undefined') return state;
    try {
      const sanitized = this.sanitizeCalibrationState(state);
      localStorage.setItem(CALIBRATION_STORAGE_KEYS.STATE, JSON.stringify(sanitized));
      window.dispatchEvent(new Event('zhero_calibration_updated'));
      return sanitized;
    } catch (err) {
      console.error('Failed to save calibration state:', err);
      return state;
    }
  }

  // Generate Day 1 Initial State
  generateInitialState() {
    const profile = typeof window !== 'undefined' ? storageService.getUserProfile() : null;
    const stage1Context = typeof window !== 'undefined' ? storageService.getStage1Context() : null;
    const careerGoal = profile?.targetCareer || 'Full Stack Software Engineer';

    const syllabus = {
      ...DEFAULT_ACADEMIC_SYLLABUS,
      academicLevel: stage1Context?.classGrade || profile?.educationLevel || DEFAULT_ACADEMIC_SYLLABUS.academicLevel,
      stream: stage1Context?.courseStream || profile?.stream || DEFAULT_ACADEMIC_SYLLABUS.stream,
    };

    return {
      version: 1,
      status: 'active',
      currentDay: 1,
      startDate: new Date().toISOString(),
      lastActiveDate: new Date().toISOString(),
      academicSyllabus: syllabus,
      provisionalPlan: this.buildDay1ProvisionalPlan(careerGoal),
      learningProfile: this.buildDefaultLearningProfile(),
      dailyLogs: {},
      workloadAdjustmentsCount: 0,
    };
  }

  // --- Immediate Day-1 Provisional Plan ---
  buildDay1ProvisionalPlan(careerTitle = 'Full Stack Software Engineer') {
    const career =
      CAREERS_DATA.find((c) => c.title.toLowerCase() === careerTitle.toLowerCase()) || CAREERS_DATA[0];

    return {
      isProvisional: true,
      careerId: career.id,
      careerTitle: career.title,
      rationale: `Provisional starting plan created from your interest in ${career.title}. During the next 7 days, ZHERO will observe your actual learning velocity and difficulty points to personalize your roadmap.`,
      targetDailyMinutes: 30, // Manageable Day 1 workload
      baselineCompetencies: career.requiredSkills.slice(0, 3).map((s) => s.name),
      day1Activities: [
        {
          id: 'cal-d1-quiz',
          type: 'baseline_quiz',
          title: '5-Minute Foundational Concept Check',
          estimatedMinutes: 5,
          concept: 'Web & Programming Fundamentals',
          completed: false,
          description: 'A brief 4-question check to establish your starting baseline. No grades or pressure.',
        },
        {
          id: 'cal-d1-resource',
          type: 'learning_resource',
          title: 'Interactive Overview: Modern Web Architecture',
          estimatedMinutes: 15,
          provider: 'MDN Web Docs',
          completed: false,
          description: 'Read the foundational overview of client-server flow, HTTP, and markup structure.',
        },
        {
          id: 'cal-d1-task',
          type: 'practical_exercise',
          title: 'Hands-on Starter: Semantic HTML Document',
          estimatedMinutes: 10,
          completed: false,
          description: 'Inspect a sample page layout and identify semantic structural landmarks (<header>, <main>, <nav>).',
        },
      ],
    };
  }

  buildDefaultLearningProfile() {
    return {
      competencies: [], // Demonstrated understanding
      learningGaps: [], // Needs practice
      learningProgression: 'needs_more_data', // 'improving' | 'stable' | 'inconsistent' | 'needs_more_data'
      retentionScore: 'unknown', // 'unknown' | 0 - 100
      practicalApplicationScore: 'unknown',
      preferredFormats: ['interactive_sandbox', 'visual_guide'],
      workloadTolerance: 'balanced', // 'comfortable' | 'balanced' | 'too_heavy'
      confidenceCalibration: 'needs_data',
      evidenceCount: 0,
      evidenceQuality: 'limited_evidence', // 'limited_evidence' | 'moderate' | 'high'
      summaryObservations: [
        'Calibration is in Day 1 initial baseline stage. Observation data will accumulate over 7 days.',
      ],
      targetedRemediationsSuggested: [],
    };
  }

  // --- Learning Events Ledger (Non-fabricated real observations) ---
  getLearningEvents() {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(CALIBRATION_STORAGE_KEYS.EVENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  recordLearningEvent(event) {
    if (!event || typeof event !== 'object') return null;

    const newEvent = {
      id: event.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: event.timestamp || new Date().toISOString(),
      day: event.day || this.getCalibrationState().currentDay,
      activityType: event.activityType || 'quiz', // 'quiz' | 'verbal_checkpoint' | 'milestone_task' | 'spaced_repetition' | 'practical_exercise'
      conceptId: event.conceptId || 'general',
      conceptTitle: event.conceptTitle || 'General Concept',
      result: event.result || 'progressing', // 'mastered' | 'progressing' | 'struggling' | 'completed'
      score: typeof event.score === 'number' ? event.score : null,
      attemptsCount: Math.max(Number(event.attemptsCount) || 1, 1),
      timeSpentMinutes: Number(event.timeSpentMinutes) || 5,
      selfReportedConfidence: Math.min(Math.max(Number(event.selfReportedConfidence) || 3, 1), 5),
      perceivedDifficulty: event.perceivedDifficulty || 'manageable', // 'easy' | 'manageable' | 'challenging' | 'overwhelming'
      notes: event.notes || '',
      source: event.source || 'student_action',
    };

    if (typeof window !== 'undefined') {
      try {
        const events = this.getLearningEvents();
        // Prevent duplicate spam if user double-clicks identical event
        const isDuplicate = events.some(
          (e) =>
            e.conceptId === newEvent.conceptId &&
            e.activityType === newEvent.activityType &&
            e.result === newEvent.result &&
            e.score === newEvent.score &&
            Math.abs(new Date(e.timestamp).getTime() - new Date(newEvent.timestamp).getTime()) < 1000
        );

        if (!isDuplicate) {
          events.unshift(newEvent);
          localStorage.setItem(CALIBRATION_STORAGE_KEYS.EVENTS, JSON.stringify(events.slice(0, 100)));
          // Update learning profile dynamically on every new event
          this.recalculateLearningProfile(events);
        }
      } catch (err) {
        console.warn('Error saving learning event:', err);
      }
    }

    return newEvent;
  }

  // Recalculate Profile based strictly on accumulated verified evidence
  recalculateLearningProfile(events = this.getLearningEvents()) {
    const state = this.getCalibrationState();
    const profile = { ...state.learningProfile };

    profile.evidenceCount = events.length;

    if (events.length === 0) {
      profile.evidenceQuality = 'limited_evidence';
      profile.learningProgression = 'needs_more_data';
      profile.summaryObservations = [
        'No learning activities recorded yet. Complete Day 1 baseline activities to begin observation.',
      ];
      state.learningProfile = profile;
      this.saveCalibrationState(state);
      return profile;
    }

    // Concept-by-concept analysis
    const conceptMap = new Map();
    events.forEach((ev) => {
      const list = conceptMap.get(ev.conceptTitle) || [];
      list.push(ev);
      conceptMap.set(ev.conceptTitle, list);
    });

    const mastered = [];
    const gaps = [];

    conceptMap.forEach((evList, conceptTitle) => {
      const struggles = evList.filter(
        (e) => e.result === 'struggling' || (e.score !== null && e.score < 65) || e.attemptsCount >= 3
      );
      const successes = evList.filter(
        (e) => e.result === 'mastered' || (e.score !== null && e.score >= 80)
      );

      // Latest event is most representative (events are unshifted)
      const latest = evList[0];

      if ((latest.result === 'mastered' || (latest.score && latest.score >= 80)) && (successes.length >= struggles.length || latest.score >= 85)) {
        mastered.push({
          concept: conceptTitle,
          confidence: latest.selfReportedConfidence,
          observationsCount: evList.length,
          lastVerified: latest.timestamp,
        });
      } else if (struggles.length > 0) {
        gaps.push({
          concept: conceptTitle,
          attempts: Math.max(...evList.map((e) => e.attemptsCount)),
          difficulty: latest.perceivedDifficulty,
          needsTargetedPractice: true,
          lastEncountered: latest.timestamp,
        });
      }
    });

    profile.competencies = mastered;
    profile.learningGaps = gaps;

    // Progression trend
    if (events.length >= 4) {
      const recent = events.slice(0, 3);
      const older = events.slice(3, 7);
      const avgRecentScore = recent.reduce((sum, e) => sum + (e.score || 70), 0) / recent.length;
      const avgOlderScore = older.length ? older.reduce((sum, e) => sum + (e.score || 70), 0) / older.length : 70;

      if (avgRecentScore > avgOlderScore + 8) {
        profile.learningProgression = 'improving';
      } else if (Math.abs(avgRecentScore - avgOlderScore) <= 8) {
        profile.learningProgression = 'stable';
      } else {
        profile.learningProgression = 'inconsistent';
      }
    } else {
      profile.learningProgression = 'needs_more_data';
    }

    // Evidence Quality Tier
    if (events.length >= 8) {
      profile.evidenceQuality = 'high';
    } else if (events.length >= 4) {
      profile.evidenceQuality = 'moderate';
    } else {
      profile.evidenceQuality = 'limited_evidence';
    }

    // Retention score from Spaced Repetition / Checkpoint events
    const retentionEvents = events.filter((e) => e.activityType === 'spaced_repetition');
    if (retentionEvents.length >= 2) {
      const avgScore =
        retentionEvents.reduce((acc, cur) => acc + (cur.score !== null ? cur.score : 80), 0) /
        retentionEvents.length;
      profile.retentionScore = Math.round(avgScore);
    } else {
      profile.retentionScore = 'unknown';
    }

    // Practical application score
    const practicalEvents = events.filter(
      (e) => e.activityType === 'practical_exercise' || e.activityType === 'milestone_task'
    );
    if (practicalEvents.length >= 2) {
      const avgPractical =
        practicalEvents.reduce((acc, cur) => acc + (cur.score !== null ? cur.score : 85), 0) /
        practicalEvents.length;
      profile.practicalApplicationScore = Math.round(avgPractical);
    } else {
      profile.practicalApplicationScore = 'unknown';
    }

    // Workload tolerance from direct student feedback and pacing
    const overwhelmingCount = events.filter((e) => e.perceivedDifficulty === 'overwhelming').length;
    if (overwhelmingCount >= 2 || state.workloadAdjustmentsCount >= 2) {
      profile.workloadTolerance = 'too_heavy';
    } else if (overwhelmingCount === 1) {
      profile.workloadTolerance = 'balanced';
    } else {
      profile.workloadTolerance = 'comfortable';
    }

    // Dynamic Summary Observations based strictly on facts
    const observations = [];
    if (mastered.length > 0) {
      observations.push(`Demonstrated solid understanding in: ${mastered.map((m) => m.concept).join(', ')}.`);
    }
    if (gaps.length > 0) {
      observations.push(
        `Identified specific concepts needing targeted reinforcement: ${gaps.map((g) => g.concept).join(', ')}.`
      );
    }
    if (profile.evidenceQuality === 'limited_evidence') {
      observations.push(
        `Observations are currently provisional (${events.length} data points). Calibration will continue refining as more milestones are reached.`
      );
    } else {
      observations.push(
        `High-confidence learning profile compiled from ${events.length} multi-modal learning observations.`
      );
    }

    profile.summaryObservations = observations;
    state.learningProfile = profile;
    this.saveCalibrationState(state);

    // If gaps are detected, automatically ensure the 4-phase roadmap receives targeted practice tasks
    if (gaps.length > 0 && typeof window !== 'undefined') {
      gaps.forEach((gap) => {
        storageService.injectAdaptiveRemediationTask(gap.concept, 'Foundational Milestone');
      });
    }

    return profile;
  }

  // --- Day Advancement & Timeline Controls ---
  advanceDay() {
    const state = this.getCalibrationState();
    if (state.currentDay < 7) {
      state.currentDay += 1;
      state.lastActiveDate = new Date().toISOString();
      if (state.currentDay === 7) {
        state.status = 'review_ready';
      }
      this.saveCalibrationState(state);
    } else {
      state.status = 'review_ready';
      this.saveCalibrationState(state);
    }
    return state;
  }

  setDay(dayNumber) {
    const state = this.getCalibrationState();
    const clamped = Math.min(Math.max(Number(dayNumber) || 1, 1), 7);
    state.currentDay = clamped;
    state.lastActiveDate = new Date().toISOString();
    if (clamped === 7) {
      state.status = 'review_ready';
    }
    return this.saveCalibrationState(state);
  }

  pauseCalibration() {
    const state = this.getCalibrationState();
    state.status = 'paused';
    state.academicSyllabus.isPaused = true;
    return this.saveCalibrationState(state);
  }

  resumeCalibration() {
    const state = this.getCalibrationState();
    state.status = state.currentDay >= 7 ? 'review_ready' : 'active';
    state.academicSyllabus.isPaused = false;
    return this.saveCalibrationState(state);
  }

  // --- Student Workload Feedback (Immediate Dial-Down on Overload) ---
  reportWorkloadTooHeavy() {
    const state = this.getCalibrationState();
    state.workloadAdjustmentsCount = (state.workloadAdjustmentsCount || 0) + 1;
    // Dial down available minutes by 25% safely
    state.academicSyllabus.availableHoursWeekday = Math.max(
      0.5,
      Number((state.academicSyllabus.availableHoursWeekday * 0.75).toFixed(1))
    );
    state.academicSyllabus.workloadPacing = 'light';
    state.learningProfile.workloadTolerance = 'too_heavy';

    // Record learning event for honest audit
    this.recordLearningEvent({
      activityType: 'practical_exercise',
      conceptTitle: 'Daily Workload Pacing',
      result: 'struggling',
      perceivedDifficulty: 'overwhelming',
      notes: 'Student reported daily workload is too heavy. Reduced provisional workload.',
      source: 'student_feedback',
    });

    return this.saveCalibrationState(state);
  }

  // --- Update Academic Syllabus & Time Availability ---
  updateAcademicSyllabus(updatedSyllabus) {
    const state = this.getCalibrationState();
    state.academicSyllabus = {
      ...state.academicSyllabus,
      ...updatedSyllabus,
    };
    return this.saveCalibrationState(state);
  }

  // --- Complete 7-Day Calibration Review & Transition ---
  completeCalibrationReview(studentCorrections = {}) {
    const state = this.getCalibrationState();
    state.status = 'completed';
    state.completedAt = new Date().toISOString();

    if (studentCorrections.preferredPacing) {
      state.academicSyllabus.workloadPacing = studentCorrections.preferredPacing;
    }
    if (studentCorrections.notes) {
      state.learningProfile.summaryObservations.push(`Student Note: ${studentCorrections.notes}`);
    }

    this.saveCalibrationState(state);
    return state;
  }

  // --- Day-Specific Recommended Activities for Days 1 to 7 ---
  getDaySchedule(dayNumber = 1) {
    const state = this.getCalibrationState();
    const profile = state.learningProfile;
    const isWeekend = [0, 6].includes(new Date().getDay());
    const availableHours = isWeekend
      ? state.academicSyllabus.availableHoursWeekend
      : state.academicSyllabus.availableHoursWeekday;
    const maxMinutes = Math.round(availableHours * 60);

    const schedules = {
      1: {
        theme: 'Day 1: Baseline Establishment',
        goal: 'Confirm learning baseline and available time without delaying immediate study.',
        activities: state.provisionalPlan.day1Activities,
        explanation:
          'Provisional Day-1 plan designed to evaluate foundational concepts and confirm study time.',
      },
      2: {
        theme: 'Day 2: Initial Observation & Learning Rhythm',
        goal: 'Observe comprehension during early syntax and logic challenges.',
        activities: [
          {
            id: 'cal-d2-quiz',
            type: 'quiz',
            title: 'CSS Layouts: Flexbox vs Grid Quick Check',
            estimatedMinutes: 8,
            concept: 'CSS Flexbox Main vs Cross Axis',
            completed: false,
            description: 'Evaluate axis alignment in Flexbox when direction changes.',
          },
          {
            id: 'cal-d2-resource',
            type: 'learning_resource',
            title: 'Visual Sandbox: Flexbox Froggy',
            estimatedMinutes: 15,
            completed: false,
            description: 'Interactive browser exercise reinforcing alignment properties.',
          },
        ],
        explanation: 'Testing whether visual interactive exercises aid layout retention.',
      },
      3: {
        theme: 'Day 3: Logic Decomposition & Problem-Solving',
        goal: 'Examine cognitive decomposition of structured algorithms.',
        activities: [
          {
            id: 'cal-d3-task',
            type: 'practical_exercise',
            title: 'Array Transformation & Filtering Challenge',
            estimatedMinutes: 15,
            concept: 'Functional Array Methods (map, filter, reduce)',
            completed: false,
            description: 'Transform an array of mock student data into calculated grade statistics.',
          },
          {
            id: 'cal-d3-rev',
            type: 'spaced_repetition',
            title: 'Day 1 Retrieval Check: Semantic HTML Elements',
            estimatedMinutes: 5,
            concept: 'Semantic HTML5 Structural Tags',
            completed: false,
            description: 'Quick active recall card to verify memory consolidation.',
          },
        ],
        explanation:
          'Checking initial retention from Day 1 alongside new array manipulation logic.',
      },
      4: {
        theme: 'Day 4: Adaptive Calibration & Difficulty Tuning',
        goal: 'Adapt task complexity based on recorded attempts from Days 1–3.',
        activities: [
          {
            id: 'cal-d4-checkpoint',
            type: 'verbal_checkpoint',
            title: 'Oral Defense: Asynchronous Execution & Promises',
            estimatedMinutes: 10,
            concept: 'JavaScript Asynchronous Execution & Microtasks',
            completed: false,
            description: 'Orally justify why JavaScript requires the Event Loop despite being single-threaded.',
          },
          {
            id: 'cal-d4-remediation',
            type: 'practical_exercise',
            title: profile.learningGaps.length
              ? `Targeted Practice: ${profile.learningGaps[0].concept}`
              : 'Targeted Practice: Event Loop Step-Through',
            estimatedMinutes: 15,
            concept: profile.learningGaps[0]?.concept || 'JavaScript Event Loop',
            completed: false,
            description: 'Reinforce the identified concept with targeted micro-tasks.',
          },
        ],
        explanation:
          'Dynamically adjusting difficulty and targeting concepts that showed early friction.',
      },
      5: {
        theme: 'Day 5: Synthesis & Integration',
        goal: 'Combine frontend structure with backend asynchronous data fetch.',
        activities: [
          {
            id: 'cal-d5-task',
            type: 'milestone_task',
            title: 'REST API Consumer Component',
            estimatedMinutes: 20,
            concept: 'Fetch API, Loading States & Error Boundaries',
            completed: false,
            description: 'Build a component fetching dynamic data with error handling and loading indicators.',
          },
          {
            id: 'cal-d5-quiz',
            type: 'quiz',
            title: 'HTTP Status Codes & REST Conventions',
            estimatedMinutes: 5,
            concept: 'RESTful Architecture',
            completed: false,
            description: 'Confirm understanding of 200 vs 201 vs 404 vs 500 error propagation.',
          },
        ],
        explanation: 'Testing whether conceptual knowledge transfers cleanly into functional code.',
      },
      6: {
        theme: 'Day 6: Applied Career Simulation & Practical Defense',
        goal: 'Real-world problem solving simulating day-in-the-life engineering tasks.',
        activities: [
          {
            id: 'cal-d6-sim',
            type: 'practical_exercise',
            title: 'Production Bug Hunt: Stale State in React',
            estimatedMinutes: 20,
            concept: 'React State Immutability & Re-renders',
            completed: false,
            description: 'Diagnose and fix a subtle race condition in an asynchronous form submission.',
          },
          {
            id: 'cal-d6-verbal',
            type: 'verbal_checkpoint',
            title: 'Verbal Architecture Justification',
            estimatedMinutes: 10,
            concept: 'Client-Side State vs Server Cache',
            completed: false,
            description: 'Defend your chosen architectural trade-off in simple spoken words.',
          },
        ],
        explanation: 'Evaluating knowledge transfer to novel, ambiguous production bugs.',
      },
      7: {
        theme: 'Day 7: Calibration Review & Roadmap Personalization',
        goal: 'Review 7 days of real learning evidence, correct preferences, and finalize active roadmap.',
        activities: [
          {
            id: 'cal-d7-review',
            type: 'practical_exercise',
            title: '7-Day Learning Evidence Review & Roadmap Alignment',
            estimatedMinutes: 15,
            concept: 'Learning Profile Synthesis',
            completed: false,
            description: 'Review demonstrated competencies, adjust your study schedule, and activate ongoing personalization.',
          },
        ],
        explanation: 'Synthesizing 7 days of verified evidence into ongoing roadmap personalization.',
      },
    };

    const selected = schedules[dayNumber] || schedules[1];
    return {
      ...selected,
      dayNumber,
      maxAvailableMinutes: maxMinutes,
      isPacingAdapted: state.academicSyllabus.workloadPacing === 'light',
    };
  }
}

export const calibrationService = new CalibrationService();
