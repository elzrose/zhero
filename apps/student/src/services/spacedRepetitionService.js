/**
 * ZHERO Adaptive Learning Intelligence — Spaced Repetition & Forgetting Curve Engine
 * Implements a transparent SM-2 / Leitner retrieval scheduler.
 * Dynamically updates learning intervals, computes retention health,
 * and automatically injects remediation tasks into the roadmap on struggle.
 */

const STORAGE_KEYS = {
  QUEUE: 'zhero_spaced_repetition_queue',
  LOGS: 'zhero_revision_history',
};

// Initial seeded concepts for demo student
const SEED_CONCEPTS = [
  {
    id: 'concept-flexbox-axes',
    title: 'CSS Flexbox Main vs Cross Axis Alignment',
    milestoneId: 'fs-1',
    milestoneTitle: 'Master HTML5 Semantic Elements & CSS Flexbox/Grid',
    careerTitle: 'Full Stack Software Engineer',
    prompt: 'Explain how `justify-content` and `align-items` behave when `flex-direction` is changed from `row` to `column`.',
    modelAnswer: 'Changing `flex-direction: column` swaps the main and cross axes. `justify-content` now aligns items vertically along the main column axis, while `align-items` aligns horizontally across the cross axis.',
    intervalDays: 3,
    easeFactor: 2.5,
    repetitions: 1,
    lastReviewedAt: new Date(Date.now() - 3.5 * 86400000).toISOString(), // 3.5 days ago -> Due!
    nextReviewDate: new Date(Date.now() - 0.5 * 86400000).toISOString(),
    history: [
      { date: new Date(Date.now() - 3.5 * 86400000).toISOString(), rating: 2, interval: 3 }
    ]
  },
  {
    id: 'concept-semantic-html',
    title: 'Semantic HTML5 Structural Tags (<article>, <section>, <nav>)',
    milestoneId: 'fs-1',
    milestoneTitle: 'Master HTML5 Semantic Elements & CSS Flexbox/Grid',
    careerTitle: 'Full Stack Software Engineer',
    prompt: 'When should you use `<article>` instead of `<section>`, and how does this affect accessibility tree generation?',
    modelAnswer: '`<article>` represents an independent, self-contained piece of content that could be distributed in syndication (like a blog post or product card). `<section>` groups thematic content typically with a heading. Screen readers use semantic tags as landmarks for quick user navigation.',
    intervalDays: 7,
    easeFactor: 2.6,
    repetitions: 2,
    lastReviewedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago -> Fresh!
    nextReviewDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    history: [
      { date: new Date(Date.now() - 9 * 86400000).toISOString(), rating: 2, interval: 2 },
      { date: new Date(Date.now() - 2 * 86400000).toISOString(), rating: 3, interval: 7 }
    ]
  },
  {
    id: 'concept-js-event-loop',
    title: 'JavaScript Event Loop & Microtask Queue Ordering',
    milestoneId: 'fs-2',
    milestoneTitle: 'Modern JavaScript ES6+ (Async/Await, Promises, Closures)',
    careerTitle: 'Full Stack Software Engineer',
    prompt: 'If a script contains a `setTimeout(..., 0)` and a `Promise.resolve().then(...)`, which executes first and why?',
    modelAnswer: 'The Promise `.then()` callback executes first. Promises are queued in the Microtask Queue, which the Event Loop drains completely at the end of the current task before fetching from the Macrotask (Task) Queue where setTimeout callbacks reside.',
    intervalDays: 1,
    easeFactor: 2.3,
    repetitions: 1,
    lastReviewedAt: new Date(Date.now() - 1.5 * 86400000).toISOString(), // 1.5 days ago -> Due!
    nextReviewDate: new Date(Date.now() - 0.5 * 86400000).toISOString(),
    history: [
      { date: new Date(Date.now() - 1.5 * 86400000).toISOString(), rating: 1, interval: 1 }
    ]
  }
];

export const spacedRepetitionService = {
  // Get all concepts in memory retention queue
  getAllConcepts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUEUE);
      if (data) {
        const list = JSON.parse(data);
        if (Array.isArray(list) && list.length > 0) return list;
      }
      // Seed default queue
      localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(SEED_CONCEPTS));
      return SEED_CONCEPTS;
    } catch {
      return SEED_CONCEPTS;
    }
  },

  // Save concepts queue
  saveConcepts(list) {
    try {
      localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(list));
      return list;
    } catch {
      return list;
    }
  },

  // Calculate Memory Retention Health (%) using transparent half-life heuristic
  // Formula: Retention = 100 * e^(-0.693 * (elapsedDays / intervalDays))
  calculateRetentionHealth(concept) {
    if (!concept.lastReviewedAt) return 100;
    const elapsedMs = Date.now() - new Date(concept.lastReviewedAt).getTime();
    const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));
    const intervalDays = Math.max(0.5, concept.intervalDays || 1);

    // Exponential decay heuristic
    const retention = Math.round(100 * Math.exp(-0.693 * (elapsedDays / intervalDays)));
    return Math.max(15, Math.min(100, retention));
  },

  // Check if a concept is due for review today
  isDueForReview(concept) {
    if (!concept.nextReviewDate) return true;
    const dueDate = new Date(concept.nextReviewDate).getTime();
    // Due if dueDate <= now or retention health <= 70%
    return dueDate <= Date.now() || this.calculateRetentionHealth(concept) <= 70;
  },

  // Get concepts that require retrieval practice right now
  getDueConcepts() {
    const all = this.getAllConcepts();
    return all.filter((c) => this.isDueForReview(c));
  },

  // Enroll new concepts when a milestone verbal checkpoint is verified
  enrollConceptsFromMilestone(milestone, concepts = []) {
    if (!concepts || concepts.length === 0) return;
    const queue = this.getAllConcepts();
    const now = new Date().toISOString();

    concepts.forEach((conceptTitle) => {
      const existing = queue.find((c) => c.title.toLowerCase() === conceptTitle.toLowerCase());
      if (!existing) {
        queue.push({
          id: `concept-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: conceptTitle,
          milestoneId: milestone.id,
          milestoneTitle: milestone.title,
          careerTitle: milestone.careerTitle || 'Active Target Path',
          prompt: `Active Recall Challenge: Explain the core mechanics of "${conceptTitle}" and give a real-world scenario where you would apply it.`,
          modelAnswer: `Demonstrate sound understanding of ${conceptTitle}, its practical application in production workflows, and standard trade-offs.`,
          intervalDays: 1, // Start with Day 1 interval
          easeFactor: 2.5,
          repetitions: 0,
          lastReviewedAt: now,
          nextReviewDate: new Date(Date.now() + 1 * 86400000).toISOString(),
          history: [],
        });
      }
    });

    this.saveConcepts(queue);
  },

  // Record a retrieval quiz practice attempt with SM-2 interval computation
  // rating: 1 = Hard (struggled), 2 = Good (recalled with effort), 3 = Easy (immediate recall)
  recordRetrieval(conceptId, rating, studentAnswer = '') {
    const queue = this.getAllConcepts();
    const concept = queue.find((c) => c.id === conceptId);
    if (!concept) return null;

    const now = new Date();
    let newInterval = 1;
    let newEaseFactor = concept.easeFactor || 2.5;
    let adaptiveRemediationTriggered = false;

    if (rating === 1) {
      // Hard / Struggled: Reset interval to 1 day & reduce ease factor
      newInterval = 1;
      newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);
      concept.repetitions = 0;
      adaptiveRemediationTriggered = true;
    } else if (rating === 2) {
      // Good / Recalled: Expand interval by easeFactor
      if (concept.repetitions === 0) {
        newInterval = 1;
      } else if (concept.repetitions === 1) {
        newInterval = 3;
      } else {
        newInterval = Math.round(concept.intervalDays * newEaseFactor);
      }
      concept.repetitions += 1;
    } else if (rating === 3) {
      // Easy / Immediate: Fast-track interval expansion & bump ease factor
      if (concept.repetitions === 0) {
        newInterval = 3;
      } else {
        newInterval = Math.round(concept.intervalDays * newEaseFactor * 1.35);
      }
      newEaseFactor = Math.min(3.0, newEaseFactor + 0.15);
      concept.repetitions += 1;
    }

    concept.intervalDays = newInterval;
    concept.easeFactor = Number(newEaseFactor.toFixed(2));
    concept.lastReviewedAt = now.toISOString();
    concept.nextReviewDate = new Date(now.getTime() + newInterval * 86400000).toISOString();

    if (!concept.history) concept.history = [];
    concept.history.push({
      date: now.toISOString(),
      rating,
      interval: newInterval,
      studentAnswer,
    });

    this.saveConcepts(queue);

    // Save to revision history log
    this.logRevisionHistory({
      conceptId: concept.id,
      conceptTitle: concept.title,
      milestoneTitle: concept.milestoneTitle,
      rating,
      newInterval,
      timestamp: now.toISOString(),
    });

    return {
      concept,
      adaptiveRemediationTriggered,
      newInterval,
      nextReviewDate: concept.nextReviewDate,
    };
  },

  // Summary statistics for the forgetting curve dashboard
  getRevisionStats() {
    const all = this.getAllConcepts();
    const due = all.filter((c) => this.isDueForReview(c));
    const retentionSum = all.reduce((sum, c) => sum + this.calculateRetentionHealth(c), 0);
    const avgRetention = all.length > 0 ? Math.round(retentionSum / all.length) : 100;
    const mastered = all.filter((c) => c.intervalDays >= 14).length;

    return {
      totalConcepts: all.length,
      dueCount: due.length,
      avgRetention,
      masteredCount: mastered,
      learningCount: all.length - mastered,
    };
  },

  // Log revision history
  logRevisionHistory(entry) {
    try {
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
      logs.unshift(entry);
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 50)));
    } catch {
      // ignore
    }
  },

  getRevisionLogs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
    } catch {
      return [];
    }
  },
};
