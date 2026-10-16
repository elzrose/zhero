/**
 * ZHERO Intelligent Mastery Gates & Adaptive Remediation Service
 * Enforces evidence-based milestone progression, structured rubric evaluation,
 * prerequisite integrity, and targeted remediation across learning milestones.
 */

import { checkpointService } from './checkpointService.js';
import { spacedRepetitionService } from './spacedRepetitionService.js';
import { calibrationService } from './calibrationService.js';
import { storageService } from './storageService.js';
import { RESOURCES_DATA } from '../data/resourcesData.js';

export const MASTERY_STORAGE_KEYS = {
  EVIDENCE_LOGS: 'zhero_mastery_evidence_logs',
  REMEDIATION_REGISTRY: 'zhero_remediation_registry',
};

// Milestone specifications with prerequisite dependencies, multi-modal checkpoints & rubrics
export const MILESTONE_DEFINITIONS = {
  'fs-1': {
    id: 'fs-1',
    title: 'Master HTML5 Semantic Elements & CSS Flexbox/Grid',
    phase: 'Phase 1: Web Fundamentals',
    prerequisites: [],
    concepts: ['HTML5 Semantic Elements', 'CSS Flexbox Alignment', 'CSS Grid Layouts'],
    checkpointTypes: ['quiz', 'verbal'],
    passingCriteria: { minQuizScore: 80, minVerbalScore: 70 },
    quizQuestions: [
      {
        id: 'q1',
        question: 'Which HTML5 element is most semantically appropriate for a self-contained blog post or product card?',
        options: ['<section>', '<div>', '<article>', '<aside>'],
        correctIndex: 2,
        concept: 'HTML5 Semantic Elements',
        explanation: '<article> represents an independent, self-contained piece of content that could be distributed in syndication.',
      },
      {
        id: 'q2',
        question: 'When using CSS Flexbox with `flex-direction: column`, which property controls alignment across the horizontal axis?',
        options: ['justify-content', 'align-items', 'flex-basis', 'align-content'],
        correctIndex: 1,
        concept: 'CSS Flexbox Alignment',
        explanation: 'In column direction, the cross axis is horizontal, so `align-items` governs horizontal placement.',
      },
      {
        id: 'q3',
        question: 'What is the primary architectural advantage of CSS Grid over Flexbox for whole-page layouts?',
        options: [
          'Grid supports two-dimensional (rows and columns) layouts simultaneously',
          'Grid has faster browser rendering times',
          'Flexbox does not support media queries',
          'Grid does not require container elements',
        ],
        correctIndex: 0,
        concept: 'CSS Grid Layouts',
        explanation: 'CSS Grid is inherently two-dimensional, whereas Flexbox is designed primarily for one-dimensional layouts.',
      },
    ],
    practicalPrompt: 'Structure a responsive navbar using `<nav>` with logo on the left and navigation links aligned horizontally on the right.',
  },

  'fs-2': {
    id: 'fs-2',
    title: 'Modern JavaScript ES6+ (Async/Await, Promises, Closures)',
    phase: 'Phase 1: Web Fundamentals',
    prerequisites: ['fs-1'],
    concepts: ['Asynchronous Execution', 'Event Loop & Call Stack', 'Promises & Async/Await', 'Closures & Scope'],
    checkpointTypes: ['quiz', 'practical', 'verbal'],
    passingCriteria: { minQuizScore: 80, minVerbalScore: 70, practicalRequired: true },
    quizQuestions: [
      {
        id: 'q1',
        question: 'In the JavaScript event loop, where are Promise `.then()` callbacks queued?',
        options: ['Macrotask Queue', 'Microtask Queue', 'Call Stack', 'Render Queue'],
        correctIndex: 1,
        concept: 'Event Loop & Call Stack',
        explanation: 'Promises are microtasks and are processed before the next macrotask is dequeued.',
      },
      {
        id: 'q2',
        question: 'What does a JavaScript closure retain access to even after the outer function has returned?',
        options: ['The lexical scope variables of the outer function', 'The outer function\'s call stack frame', 'Global DOM window only', 'Only primitive numbers and strings'],
        correctIndex: 0,
        concept: 'Closures & Scope',
        explanation: 'A closure maintains access to its outer lexical environment even when executed outside its original scope.',
      },
      {
        id: 'q3',
        question: 'What happens when an unhandled Promise rejection occurs inside an async function?',
        options: [
          'It silently resolves to undefined',
          'The error propagates as a rejected Promise and must be caught via try/catch or .catch()',
          'It crashes the entire browser window immediately',
          'JavaScript pauses execution until user input is provided',
        ],
        correctIndex: 1,
        concept: 'Promises & Async/Await',
        explanation: 'Errors in async functions reject the returned promise, requiring proper error handling.',
      },
    ],
    practicalPrompt: 'Write an asynchronous function `fetchStudentData(studentId)` using async/await with robust try/catch error handling that handles network failures.',
  },

  'fs-3': {
    id: 'fs-3',
    title: 'Git & GitHub Workflow (branching, commits, pull requests)',
    phase: 'Phase 1: Web Fundamentals',
    prerequisites: ['fs-1'],
    concepts: ['Branching Strategies', 'Commit Atomicity', 'Merge vs Rebase'],
    checkpointTypes: ['quiz', 'verbal'],
    passingCriteria: { minQuizScore: 80, minVerbalScore: 70 },
    quizQuestions: [
      {
        id: 'q1',
        question: 'What is the main difference between `git merge` and `git rebase`?',
        options: [
          'Merge creates a 3-way merge commit preserving history, whereas rebase rewrites commits linearly onto the target branch',
          'Rebase permanently deletes conflicting files',
          'Merge only works for local branches, while rebase works only with remote remotes',
          'There is no difference; they are aliases',
        ],
        correctIndex: 0,
        concept: 'Merge vs Rebase',
        explanation: 'Merge preserves exact chronology with a merge commit, while rebase linearizes project history.',
      },
      {
        id: 'q2',
        question: 'What characterizes an atomic Git commit?',
        options: [
          'A commit that bundles all project changes made across an entire month',
          'A commit that encapsulates a single logical, buildable change with a descriptive message',
          'A commit made directly to the production branch without testing',
          'A commit that contains only binary media assets',
        ],
        correctIndex: 1,
        concept: 'Commit Atomicity',
        explanation: 'Atomic commits make rollbacks, cherry-picking, and code reviews straightforward and safe.',
      },
    ],
  },

  'fs-4': {
    id: 'fs-4',
    title: 'Build interactive SPA components using React & Hooks',
    phase: 'Phase 2: Frontend Engineering',
    prerequisites: ['fs-2', 'fs-3'],
    concepts: ['Component Lifecycle', 'State Immutability', 'Hooks (useState, useEffect)', 'Virtual DOM Reconciliation'],
    checkpointTypes: ['quiz', 'practical', 'verbal'],
    passingCriteria: { minQuizScore: 80, minVerbalScore: 70, practicalRequired: true },
    quizQuestions: [
      {
        id: 'q1',
        question: 'Why must React state never be mutated directly (e.g. `state.items.push(x)`)?',
        options: [
          'Direct mutations do not trigger a re-render because React relies on shallow reference comparison',
          'JavaScript throws a syntax error on direct object mutation',
          'It clears all localStorage entries',
          'Direct mutation disables CSS transitions',
        ],
        correctIndex: 0,
        concept: 'State Immutability',
        explanation: 'React compares object references (`Object.is`) to detect state changes; mutating in-place breaks change detection.',
      },
      {
        id: 'q2',
        question: 'When does the cleanup function in a `useEffect` hook execute?',
        options: [
          'Only once when the browser tab closes',
          'Before re-running the effect on dependency change and when the component unmounts',
          'Every single animation frame',
          'Before initial DOM paint',
        ],
        correctIndex: 1,
        concept: 'Hooks (useState, useEffect)',
        explanation: 'Cleanups run before effect re-execution and on component teardown to prevent memory leaks and dangling subscriptions.',
      },
      {
        id: 'q3',
        question: 'How does React\'s Virtual DOM diffing algorithm optimize performance?',
        options: [
          'It completely rewrites the entire HTML document on any state change',
          'It computes differences in memory and batches minimal targeted DOM updates',
          'It compiles JavaScript into WebAssembly',
          'It skips rendering child components permanently',
        ],
        correctIndex: 1,
        concept: 'Virtual DOM Reconciliation',
        explanation: 'Virtual DOM diffing determines the minimal set of real DOM mutations needed, minimizing browser reflows and repaints.',
      },
    ],
    practicalPrompt: 'Implement a reusable React hook `useDebounce(value, delay)` that debounces text input for API searches.',
  },

  'fs-5': {
    id: 'fs-5',
    title: 'State management & API consumption with Fetch / Axios',
    phase: 'Phase 2: Frontend Engineering',
    prerequisites: ['fs-4'],
    concepts: ['API Integration', 'Loading & Error States', 'HTTP Interceptors'],
    checkpointTypes: ['quiz', 'verbal'],
    passingCriteria: { minQuizScore: 80, minVerbalScore: 70 },
    quizQuestions: [
      {
        id: 'q1',
        question: 'How should a resilient frontend component handle network request life-cycles?',
        options: [
          'Show nothing until the request resolves, even if it takes 30 seconds',
          'Track distinct loading, error, and data states to provide feedback to the user',
          'Assume all requests succeed without error handling',
          'Reload the browser page on every HTTP error',
        ],
        correctIndex: 1,
        concept: 'Loading & Error States',
        explanation: 'Explicit state handling (idle, loading, error, success) guarantees robust UX under adverse network conditions.',
      },
      {
        id: 'q2',
        question: 'What is the purpose of HTTP abort controllers (`AbortController`) in frontend components?',
        options: [
          'To cancel pending in-flight requests when a component unmounts or query changes',
          'To delete server-side database records',
          'To encrypt password fields before sending',
          'To bypass CORS security policies',
        ],
        correctIndex: 0,
        concept: 'API Integration',
        explanation: 'Abort controllers prevent race conditions and state updates on unmounted components by cancelling obsolete requests.',
      },
    ],
  },

  'fs-6': {
    id: 'fs-6',
    title: 'Create RESTful APIs using Node.js & Express',
    phase: 'Phase 3: Backend & Persistence',
    prerequisites: ['fs-2', 'fs-5'],
    concepts: ['RESTful Architecture', 'HTTP Methods & Status Codes', 'Middleware Validation', 'Statelessness'],
    checkpointTypes: ['quiz', 'practical', 'verbal'],
    passingCriteria: { minQuizScore: 80, minVerbalScore: 70, practicalRequired: true },
    quizQuestions: [
      {
        id: 'q1',
        question: 'Which HTTP method is specifically intended for partial resource updates rather than full replacement?',
        options: ['POST', 'PUT', 'PATCH', 'OPTIONS'],
        correctIndex: 2,
        concept: 'HTTP Methods & Status Codes',
        explanation: 'PATCH applies partial modifications to a resource, whereas PUT replaces the entire resource.',
      },
      {
        id: 'q2',
        question: 'In Express, what must middleware call to pass execution to the next handler?',
        options: ['next()', 'continue()', 'return false', 'res.end()'],
        correctIndex: 0,
        concept: 'Middleware Validation',
        explanation: 'Calling `next()` passes control to the subsequent middleware function in the pipeline stack.',
      },
    ],
    practicalPrompt: 'Write an Express middleware that validates request body presence and returns 400 Bad Request with a clear JSON error.',
  },

  'fs-7': {
    id: 'fs-7',
    title: 'Database schema design and queries using PostgreSQL / MongoDB',
    phase: 'Phase 3: Backend & Persistence',
    prerequisites: ['fs-6'],
    concepts: ['Relational Schema Design', 'Foreign Keys & Normalization', 'SQL Indexing', 'ACID Transactions'],
    checkpointTypes: ['quiz', 'verbal'],
    passingCriteria: { minQuizScore: 80, minVerbalScore: 70 },
    quizQuestions: [
      {
        id: 'q1',
        question: 'What does the "I" in ACID database transactions stand for?',
        options: ['Integrity', 'Isolation', 'Indexing', 'Idempotence'],
        correctIndex: 1,
        concept: 'ACID Transactions',
        explanation: 'Isolation ensures concurrent transactions execute without interfering with one another.',
      },
      {
        id: 'q2',
        question: 'What is a primary trade-off of adding database B-tree indexes to multiple table columns?',
        options: [
          'Faster read queries at the expense of slower write/insert performance and increased storage',
          'Decreased disk space usage',
          'Automatic encryption of data in transit',
          'Removal of the need for foreign keys',
        ],
        correctIndex: 0,
        concept: 'SQL Indexing',
        explanation: 'Indexes accelerate SELECT lookups but introduce write overhead because indexes must be updated on INSERT/UPDATE.',
      },
    ],
  },

  'fs-8': {
    id: 'fs-8',
    title: 'Deploy full-stack project to Vercel / Render with CI/CD',
    phase: 'Phase 4: Capstone & Deployment',
    prerequisites: ['fs-5', 'fs-7'],
    concepts: ['CI/CD Pipelines', 'Environment Variables & Secrets', 'Production Monitoring'],
    checkpointTypes: ['quiz', 'verbal'],
    passingCriteria: { minQuizScore: 80, minVerbalScore: 70 },
    quizQuestions: [
      {
        id: 'q1',
        question: 'Why should database credentials and API secrets NEVER be committed directly to version control?',
        options: [
          'Git repositories are often shared or cloned; exposing credentials leads to security breaches and compromise',
          'Git cannot commit strings longer than 16 characters',
          'It increases compilation times in Node.js',
          'Vercel only supports plain-text passwords',
        ],
        correctIndex: 0,
        concept: 'Environment Variables & Secrets',
        explanation: 'Secrets must be injected securely at runtime via environment variables rather than tracked in source code.',
      },
    ],
  },

  'fs-9': {
    id: 'fs-9',
    title: 'Draft technical writeup and document architecture on GitHub',
    phase: 'Phase 4: Capstone & Deployment',
    prerequisites: ['fs-8'],
    concepts: ['Technical Documentation', 'System Architecture Diagramming', 'Portfolio Presentation'],
    checkpointTypes: ['quiz', 'verbal'],
    passingCriteria: { minQuizScore: 80, minVerbalScore: 70 },
    quizQuestions: [
      {
        id: 'q1',
        question: 'What is the purpose of an Architecture Decision Record (ADR) in a technical project repository?',
        options: [
          'To document the context, alternatives considered, and rationale behind a significant software design choice',
          'To log user billing details',
          'To compile JavaScript files into minified assets',
          'To generate random test data',
        ],
        correctIndex: 0,
        concept: 'Technical Documentation',
        explanation: 'ADRs record architectural choices and trade-offs so future maintainers understand why decisions were made.',
      },
    ],
  },
};

class MasteryService {
  constructor() {
    this.memoryEvidence = [];
  }

  // --- Read & Persist Mastery Evidence Logs ---
  getEvidenceLogs() {
    if (typeof window === 'undefined') return this.memoryEvidence;
    try {
      const data = localStorage.getItem(MASTERY_STORAGE_KEYS.EVIDENCE_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveEvidenceLog(entry) {
    if (typeof window === 'undefined') {
      this.memoryEvidence.push(entry);
      return entry;
    }
    try {
      const logs = this.getEvidenceLogs();
      logs.push(entry);
      localStorage.setItem(MASTERY_STORAGE_KEYS.EVIDENCE_LOGS, JSON.stringify(logs));
      window.dispatchEvent(new Event('zhero_mastery_updated'));
      return entry;
    } catch (err) {
      console.error('Error saving mastery evidence:', err);
      return entry;
    }
  }

  // Retrieve definition for a milestone
  getMilestoneDefinition(milestoneId, fallbackTask = null) {
    if (MILESTONE_DEFINITIONS[milestoneId]) {
      return MILESTONE_DEFINITIONS[milestoneId];
    }

    // Dynamic fallback definition for custom or non-standard milestones
    const title = fallbackTask?.title || milestoneId;
    const concepts = checkpointService.getKeyConcepts({ title });
    return {
      id: milestoneId,
      title,
      phase: fallbackTask?.phaseTitle || 'Foundational Milestone',
      prerequisites: [],
      concepts,
      checkpointTypes: ['quiz', 'verbal'],
      passingCriteria: { minQuizScore: 80, minVerbalScore: 70 },
      quizQuestions: [
        {
          id: 'q1',
          question: `In your work with ${concepts[0] || title}, which principle is fundamental?`,
          options: [
            `Separation of concerns and modular decomposition`,
            `Directly coupling all logic into a single monolithic script`,
            `Ignoring edge cases and error handling`,
            `Skipping automated tests`,
          ],
          correctIndex: 0,
          concept: concepts[0] || 'Core Architecture',
          explanation: 'Modular decomposition and separation of concerns are critical architectural tenets.',
        },
        {
          id: 'q2',
          question: `Why is thorough validation important for ${title}?`,
          options: [
            `Prevents invalid state and unexpected runtime crashes`,
            `It is only needed for desktop browsers`,
            `It reduces network bandwidth by 90%`,
            `It replaces the need for databases`,
          ],
          correctIndex: 0,
          concept: concepts[1] || 'Industry Standards',
          explanation: 'Thorough validation maintains data integrity and operational stability.',
        },
      ],
      practicalPrompt: `Demonstrate how you apply ${title} in a realistic production scenario.`,
    };
  }

  // --- Prerequisite Dependency Checking ---
  // Calculates whether prerequisites for a milestone are satisfied
  checkPrerequisites(milestoneId) {
    const def = this.getMilestoneDefinition(milestoneId);
    if (!def || !def.prerequisites || def.prerequisites.length === 0) {
      return { satisfied: true, missing: [] };
    }

    const roadmap = storageService.getActiveRoadmap();
    const allTasks = [];
    if (roadmap && roadmap.phases) {
      roadmap.phases.forEach((p) => p.tasks.forEach((t) => allTasks.push(t)));
    }

    const missing = [];
    def.prerequisites.forEach((prereqId) => {
      const task = allTasks.find((t) => t.id === prereqId);
      // Prerequisite must exist, be completed, and verified via checkpoint
      const isMastered = task ? (task.completed && (task.verifiedCheckpoint || task.isMastered)) : false;
      if (!isMastered) {
        const prereqDef = this.getMilestoneDefinition(prereqId);
        missing.push({
          id: prereqId,
          title: prereqDef?.title || prereqId,
        });
      }
    });

    return {
      satisfied: missing.length === 0,
      missing,
    };
  }

  // Evaluates dynamic milestone state:
  // 'locked' | 'available' | 'in_progress' | 'awaiting_checkpoint' | 'remediation_required' | 'mastered'
  getMilestoneState(milestoneId, task = null) {
    const currentTask = task || this.getTaskFromRoadmap(milestoneId);
    if (!currentTask) return 'locked';

    // 1. Check if already mastered
    if (currentTask.completed && (currentTask.verifiedCheckpoint || currentTask.isMastered)) {
      return 'mastered';
    }

    // 2. Check prerequisites
    const prereqCheck = this.checkPrerequisites(milestoneId);
    if (!prereqCheck.satisfied) {
      return 'locked';
    }

    // 3. Check if active remediation is required for this milestone
    const logs = this.getEvidenceLogs().filter((l) => l.milestoneId === milestoneId);
    const latestAttempt = logs.length > 0 ? logs[logs.length - 1] : null;

    if (latestAttempt && !latestAttempt.passed) {
      return 'remediation_required';
    }

    // 4. Check if student has completed initial learning activities and awaits assessment
    if (currentTask.activitiesCompleted || currentTask.awaitingCheckpoint) {
      return 'awaiting_checkpoint';
    }

    // 5. Default state for eligible milestone
    return currentTask.inProgress ? 'in_progress' : 'available';
  }

  // Verify access eligibility: prevents arbitrary frontend bypass
  canAccessMilestone(milestoneId) {
    const prereqCheck = this.checkPrerequisites(milestoneId);
    if (!prereqCheck.satisfied) {
      const titles = prereqCheck.missing.map((m) => `"${m.title}"`).join(', ');
      return {
        allowed: false,
        reason: `Prerequisite milestones must be mastered first: ${titles}.`,
        missing: prereqCheck.missing,
      };
    }

    return { allowed: true };
  }

  // Safe helper to find task in active roadmap
  getTaskFromRoadmap(milestoneId) {
    const roadmap = storageService.getActiveRoadmap();
    if (!roadmap || !roadmap.phases) return null;
    for (const phase of roadmap.phases) {
      const found = phase.tasks.find((t) => t.id === milestoneId);
      if (found) return found;
    }
    return null;
  }

  // --- Strict Multi-Modal Mastery Evaluation ---
  async evaluateMasteryCheckpoint({
    milestoneId,
    quizAnswers = {},
    verbalExplanation = '',
    practicalPassed = false,
    practicalSubmission = '',
    isSpeechInput = false,
    speechTranscriptError = false,
  }) {
    const def = this.getMilestoneDefinition(milestoneId);
    const timestamp = new Date().toISOString();

    // 1. Speech transcript integrity check
    // If student used microphone and transcript was corrupted, do NOT penalize as knowledge failure
    if (isSpeechInput) {
      const wordCount = (verbalExplanation || '').trim().split(/\s+/).filter(Boolean).length;
      if (speechTranscriptError || (wordCount < 4 && verbalExplanation.length < 15)) {
        return {
          passed: false,
          isTranscriptError: true,
          feedback:
            'Speech audio was not clearly captured or transcription was interrupted. Please retry your spoken explanation or switch to typing.',
          remediationNeeded: false,
          milestoneState: 'awaiting_checkpoint',
        };
      }
    }

    // 2. Objective Quiz Evaluation (80% threshold rule)
    const questions = def.quizQuestions || [];
    let correctCount = 0;
    const quizConceptsDemonstrated = [];
    const quizConceptsMissing = [];

    questions.forEach((q) => {
      const chosenIndex = quizAnswers[q.id];
      if (chosenIndex !== undefined && Number(chosenIndex) === q.correctIndex) {
        correctCount += 1;
        if (q.concept) quizConceptsDemonstrated.push(q.concept);
      } else {
        if (q.concept) quizConceptsMissing.push(q.concept);
      }
    });

    const quizScore = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;
    const quizPassed = quizScore >= (def.passingCriteria?.minQuizScore || 80);

    // 3. Practical Checkpoint Evaluation
    const practicalRequired = Boolean(def.passingCriteria?.practicalRequired);
    const practicalApproved = practicalRequired ? Boolean(practicalPassed) : true;

    // 4. Verbal Conceptual Explanation Evaluation (Gemini or Local Fallback)
    let verbalResult = null;
    try {
      verbalResult = await checkpointService.evaluateResponse({
        milestoneTitle: def.title,
        keyConcepts: def.concepts,
        checkpointPrompt: def.practicalPrompt || checkpointService.getCheckpointPrompt({ title: def.title }).prompt,
        studentResponse: verbalExplanation,
      });
    } catch (err) {
      console.warn('Verbal evaluation service error, fallback used safely:', err);
      verbalResult = checkpointService.evaluateLocally(def.title, def.concepts, verbalExplanation);
    }

    // Validate structured AI output schema
    const validatedVerbal = this.validateVerbalOutput(verbalResult);
    const verbalPassed = validatedVerbal.score >= (def.passingCriteria?.minVerbalScore || 70);

    // 5. Unified Multi-Modal Mastery Gate Decision
    // All required checkpoints must be satisfied!
    const overallPassed = quizPassed && practicalApproved && verbalPassed;

    // Extract precise unmastered concepts
    const unmasteredConcepts = Array.from(
      new Set([
        ...quizConceptsMissing,
        ...validatedVerbal.identifiedMisconceptions,
        ...(!practicalApproved ? ['Practical Problem-Solving Implementation'] : []),
      ])
    );

    const masteredConcepts = Array.from(
      new Set([...quizConceptsDemonstrated, ...validatedVerbal.identifiedStrengths])
    );

    // Construct evidence log record
    const evidenceLog = {
      id: `eval-${Date.now()}`,
      milestoneId,
      milestoneTitle: def.title,
      timestamp,
      passed: overallPassed,
      scores: {
        quizScore,
        quizPassed,
        practicalApproved,
        verbalScore: validatedVerbal.score,
        verbalPassed,
      },
      demonstratedConcepts: masteredConcepts,
      missingConcepts: unmasteredConcepts,
      feedback: overallPassed
        ? `Mastery Verified! Demonstrated clear command of ${masteredConcepts.slice(0, 3).join(', ') || def.title}.`
        : this.formatConstructiveFeedback(unmasteredConcepts, { quizPassed, practicalApproved, verbalPassed }),
      rubricScores: validatedVerbal.rubricScores,
      remediationRecommendation: overallPassed ? null : validatedVerbal.remediationRecommendation,
    };

    this.saveEvidenceLog(evidenceLog);

    // 6. Branch: On Demonstrated Mastery
    if (overallPassed) {
      this.handleMasterySuccess(def, evidenceLog);
      return {
        passed: true,
        score: Math.round((quizScore + validatedVerbal.score) / 2),
        milestoneState: 'mastered',
        demonstratedConcepts: masteredConcepts,
        feedback: evidenceLog.feedback,
        evidenceLog,
      };
    }

    // 7. Branch: On Struggle / Remediation Required
    this.handleMasteryStruggle(def, evidenceLog, unmasteredConcepts);
    return {
      passed: false,
      milestoneState: 'remediation_required',
      quizScore,
      verbalScore: validatedVerbal.score,
      quizPassed,
      practicalApproved,
      verbalPassed,
      missingConcepts: unmasteredConcepts,
      feedback: evidenceLog.feedback,
      remediationRecommendation: evidenceLog.remediationRecommendation,
      evidenceLog,
    };
  }

  // --- Validate Structured AI Output Schema ---
  validateVerbalOutput(raw) {
    if (!raw || typeof raw !== 'object') {
      return {
        score: 50,
        passed: false,
        rubricScores: { conceptualAccuracy: 50, practicalJustification: 50, absenceOfMisconceptions: 50 },
        feedback: 'Evaluation could not be fully parsed. Fallback heuristic rubric applied safely.',
        identifiedStrengths: ['Attempt submitted'],
        identifiedMisconceptions: ['Needs clearer technical elaboration'],
        remediationRecommendation: 'Review foundational documentation before retrying.',
      };
    }

    const score = Math.max(0, Math.min(100, Number(raw.score) || 50));
    return {
      score,
      passed: Boolean(raw.passed && score >= 70),
      rubricScores: {
        conceptualAccuracy: Number(raw.rubricScores?.conceptualAccuracy) || score,
        practicalJustification: Number(raw.rubricScores?.practicalJustification) || score,
        absenceOfMisconceptions: Number(raw.rubricScores?.absenceOfMisconceptions) || 80,
      },
      feedback: raw.feedback || 'Conceptual evaluation completed.',
      identifiedStrengths: Array.isArray(raw.identifiedStrengths) ? raw.identifiedStrengths : [],
      identifiedMisconceptions: Array.isArray(raw.identifiedMisconceptions) ? raw.identifiedMisconceptions : [],
      remediationRecommendation: raw.remediationRecommendation || 'Review the curated resources attached to this milestone.',
    };
  }

  // Constructive, non-punitive feedback formatting
  formatConstructiveFeedback(missingConcepts, { quizPassed, practicalApproved, verbalPassed }) {
    if (!quizPassed) {
      return `Good effort! Your conceptual quiz highlighted a gap in ${missingConcepts[0] || 'core terminology'}. Review the targeted micro-lesson and try again.`;
    }
    if (!practicalApproved) {
      return 'Your theoretical answers are solid, but the practical code implementation did not meet all requirements. Review the code example and re-test.';
    }
    if (!verbalPassed) {
      return `You understand the high-level purpose, but your explanation of ${missingConcepts[0] || 'the underlying mechanics'} needs more technical depth.`;
    }
    return 'Some core concepts need reinforcement before this milestone can be verified. See targeted remediation below.';
  }

  // --- Actions on Passing Mastery Gate ---
  handleMasterySuccess(def, evidenceLog) {
    // 1. Mark milestone as completed and mastered in active roadmap
    const roadmap = storageService.getActiveRoadmap();
    if (roadmap && roadmap.phases) {
      roadmap.phases.forEach((phase) => {
        phase.tasks.forEach((task) => {
          if (task.id === def.id) {
            task.completed = true;
            task.isMastered = true;
            task.verifiedCheckpoint = {
              score: evidenceLog.scores.verbalScore,
              rubricScores: evidenceLog.rubricScores,
              feedback: evidenceLog.feedback,
              verifiedAt: evidenceLog.timestamp,
            };
          }
        });
      });
      roadmap.lastUpdated = new Date().toISOString();
      localStorage.setItem('zhero_active_roadmap', JSON.stringify(roadmap));
    }

    // 2. Register verified competencies in calibration service
    def.concepts.forEach((concept) => {
      calibrationService.recordLearningEvent({
        activityType: 'mastery_gate',
        conceptTitle: concept,
        conceptId: `${def.id}-${concept.replace(/\s+/g, '-').toLowerCase()}`,
        result: 'mastered',
        score: evidenceLog.scores.verbalScore || 90,
        selfReportedConfidence: 5,
        perceivedDifficulty: 'manageable',
        notes: `Mastered via Milestone Gate "${def.title}"`,
      });
    });

    // 3. Enroll concepts in spaced repetition queue for long-term retention
    spacedRepetitionService.enrollConceptsFromMilestone(
      { id: def.id, title: def.title, careerTitle: roadmap?.careerTitle || 'Full Stack Software Engineer' },
      def.concepts
    );

    // 4. Clean up any completed remediation tasks from registry
    this.markRemediationCompleted(def.id);
  }

  // --- Actions on Struggle / Remediation Required ---
  handleMasteryStruggle(def, evidenceLog, missingConcepts) {
    const focusConcept = missingConcepts[0] || def.concepts[0] || def.title;

    // 1. Register struggle event in calibration service to adapt pace
    calibrationService.recordLearningEvent({
      activityType: 'mastery_gate',
      conceptTitle: focusConcept,
      conceptId: `${def.id}-${focusConcept.replace(/\s+/g, '-').toLowerCase()}`,
      result: 'struggling',
      score: evidenceLog.scores.verbalScore || 45,
      selfReportedConfidence: 2,
      perceivedDifficulty: 'challenging',
      notes: `Identified learning gap during "${def.title}": ${focusConcept}`,
    });

    // 2. Avoid duplicate remediation tasks: Check registry first
    if (!this.isRemediationRegistered(def.id, focusConcept)) {
      storageService.injectAdaptiveRemediationTask(focusConcept, def.title);
      this.registerRemediation(def.id, focusConcept);
    }

    // 3. Update spaced repetition queue: schedule early retrieval check
    const allSR = spacedRepetitionService.getAllConcepts();
    const existing = allSR.find((c) => c.milestoneId === def.id || c.title.includes(focusConcept));
    if (existing) {
      existing.intervalDays = 1;
      existing.nextReviewDate = new Date().toISOString(); // Due immediately for practice
      spacedRepetitionService.saveConcepts(allSR);
    }
  }

  // --- Remediation Registry (Prevents Duplicate Injection) ---
  getRemediationRegistry() {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(MASTERY_STORAGE_KEYS.REMEDIATION_REGISTRY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  isRemediationRegistered(milestoneId, concept) {
    const reg = this.getRemediationRegistry();
    return reg.some((r) => r.milestoneId === milestoneId && r.concept === concept && !r.resolved);
  }

  registerRemediation(milestoneId, concept) {
    const reg = this.getRemediationRegistry();
    reg.push({
      id: `rem-${Date.now()}`,
      milestoneId,
      concept,
      registeredAt: new Date().toISOString(),
      resolved: false,
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(MASTERY_STORAGE_KEYS.REMEDIATION_REGISTRY, JSON.stringify(reg));
    }
  }

  markRemediationCompleted(milestoneId) {
    const reg = this.getRemediationRegistry();
    reg.forEach((r) => {
      if (r.milestoneId === milestoneId) r.resolved = true;
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(MASTERY_STORAGE_KEYS.REMEDIATION_REGISTRY, JSON.stringify(reg));
    }
  }
}

export const masteryService = new MasteryService();
