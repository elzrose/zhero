/**
 * ZHERO Adaptive Learning Intelligence — Verbal AI Course Checkpoints
 * Evaluates student conceptual understanding, identifies misconceptions,
 * supports speech & text input, and provides transparent rubric feedback.
 */

import { RESOURCES_DATA } from '../data/resourcesData';

// Knowledge base of milestone concepts, resources & scenarios
const MILESTONE_KNOWLEDGE_BASE = {
  // Web / Frontend Fundamentals
  'html5': {
    concepts: ['HTML5 Semantic Elements', 'CSS Flexbox Alignment', 'CSS Grid Layouts', 'Responsive Media Queries'],
    prompt: 'You are structuring a responsive product dashboard navbar and layout. Explain in your own words how you would utilize CSS Flexbox axis alignment (justify-content vs align-items) to position the logo, search bar, and user profile. Justify why using semantic HTML5 elements (<header>, <nav>, <main>) is crucial compared to generic <div> tags.',
    hint: 'Think about the distinction between the main axis and cross axis in Flexbox, and how semantic HTML tags assist screen readers, browser parsers, and SEO crawlers.',
    resources: [
      {
        title: 'MDN Web Docs: CSS Flexible Box Layout Guide',
        type: 'Official Doc',
        provider: 'Mozilla Developer Network',
        duration: '25 mins',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox',
        description: 'Comprehensive technical specification and interactive playground for Flexbox containers and item alignment.',
      },
      {
        title: 'CSS Tricks: A Complete Guide to Flexbox & Grid',
        type: 'Visual Guide',
        provider: 'CSS-Tricks',
        duration: '20 mins',
        url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
        description: 'Visual reference guide detailing all parent and child flex properties with practical layout examples.',
      },
      {
        title: 'Flexbox Froggy: Interactive Layout Game',
        type: 'Interactive Sandbox',
        provider: 'Codepip',
        duration: '15 mins',
        url: 'https://flexboxfroggy.com/',
        description: 'Hands-on 24-level browser game reinforcing justify-content, align-items, and flex-direction.',
      },
    ],
  },
  'javascript': {
    concepts: ['Asynchronous Execution', 'Event Loop & Call Stack', 'Promises & Async/Await', 'Closures & Scope'],
    prompt: 'Explain what happens behind the scenes when JavaScript executes an asynchronous network call. Why does JavaScript need the event loop and task queue despite being single-threaded? Justify why modern applications use async/await over nested callbacks.',
    hint: 'Focus on how the call stack handles synchronous code, how Web APIs handle promises in the microtask queue, and how async/await improves readability and try/catch error handling.',
    resources: [
      {
        title: 'JavaScript.info: Promises, Async/Await & Microtasks',
        type: 'Official Doc',
        provider: 'JavaScript.info',
        duration: '35 mins',
        url: 'https://javascript.info/async',
        description: 'Deep dive into JavaScript asynchronous patterns, microtask execution order, and error propagation.',
      },
      {
        title: 'Philip Roberts: What the heck is the event loop anyway?',
        type: 'Video Lecture',
        provider: 'JSConf EU',
        duration: '26 mins',
        url: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
        description: 'The industry-standard visual breakdown of the call stack, Web APIs, task queue, and event loop.',
      },
      {
        title: 'freeCodeCamp: Modern JavaScript Algorithms & ES6',
        type: 'Interactive Sandbox',
        provider: 'freeCodeCamp',
        duration: '45 mins',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        description: 'Practical browser-based coding challenges reinforcing closures, promises, and array destructuring.',
      },
    ],
  },
  'git': {
    concepts: ['Branching Strategies', 'Commit Atomicity', 'Merge vs Rebase', 'Conflict Resolution'],
    prompt: 'Imagine two developers on your team edit the same component file in different feature branches. Explain the step-by-step workflow you would use to merge changes safely. Explain the trade-offs between a standard merge commit and rebasing.',
    hint: 'Consider commit history cleanliness, linear history vs preserving actual chronological branch creation, and the process of opening and testing pull requests.',
    resources: [
      {
        title: 'Atlassian Git: Merging vs Rebasing Tutorial',
        type: 'Technical Guide',
        provider: 'Atlassian Git',
        duration: '20 mins',
        url: 'https://www.atlassian.com/git/tutorials/merging-vs-rebasing',
        description: 'Clear diagrams showing how fast-forward merges, 3-way merge commits, and rebases affect git history.',
      },
      {
        title: 'Oh Shit, Git!?! — Practical Recovery Cheat Sheet',
        type: 'Interactive',
        provider: 'Katie Sylor-Miller',
        duration: '15 mins',
        url: 'https://ohshitgit.com/',
        description: 'Straightforward explanations for safely escaping common git mistakes, detached HEAD states, and conflicts.',
      },
    ],
  },
  'react': {
    concepts: ['Component Lifecycle', 'State Immutability', 'Hooks (useState, useEffect)', 'Virtual DOM Reconciliation'],
    prompt: 'Explain why React requires state to be treated as immutable instead of modifying variables directly. What happens when setState or a state hook is triggered, and how does React decide which parts of the DOM to update?',
    hint: 'Touch on shallow comparison, re-rendering triggers, virtual DOM diffing algorithm, and batching.',
    resources: [
      {
        title: 'React Official Documentation: Thinking in React & State',
        type: 'Official Doc',
        provider: 'React.dev',
        duration: '30 mins',
        url: 'https://react.dev/learn/thinking-in-react',
        description: 'The updated official guide on component trees, one-way data flow, and state lifting.',
      },
      {
        title: 'Scrimba: Interactive React Fundamentals Masterclass',
        type: 'Interactive',
        provider: 'Scrimba',
        duration: '45 mins',
        url: 'https://scrimba.com/learn/learnreact',
        description: 'In-browser interactive coding challenges building modern functional components and custom hooks.',
      },
    ],
  },
  'api': {
    concepts: ['RESTful Architecture', 'HTTP Methods & Status Codes', 'Middleware Validation', 'Statelessness'],
    prompt: 'You are designing an API endpoint to update a student profile. Explain which HTTP method (PUT vs PATCH) you would select and why. How should the API respond if validation fails vs if the resource does not exist?',
    hint: 'Differentiate idempotent full replacement (PUT) from partial updates (PATCH), and discuss HTTP 400 Bad Request, 404 Not Found, and 422 Unprocessable Entity.',
    resources: [
      {
        title: 'RESTful API Design: Best Practices Guide',
        type: 'Architecture Guide',
        provider: 'Microsoft Azure Docs',
        duration: '25 mins',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design',
        description: 'Standardized principles for resource URI naming, query filtering, and structured error payloads.',
      },
    ],
  },
  'database': {
    concepts: ['Relational Schema Design', 'Foreign Keys & Normalization', 'SQL Indexing', 'ACID Transactions'],
    prompt: 'Explain the purpose of database normalization up to Third Normal Form (3NF). Why do relational databases enforce foreign key constraints, and under what circumstances would you create a composite index?',
    hint: 'Discuss reducing data redundancy, preventing insertion/deletion anomalies, and how B-tree indexes speed up WHERE/JOIN lookups at the cost of slower writes.',
    resources: [
      {
        title: 'PostgreSQL Tutorial: Schema Design & Indexing',
        type: 'Technical Guide',
        provider: 'PostgreSQL Tutorial',
        duration: '30 mins',
        url: 'https://www.postgresqltutorial.com/',
        description: 'Practical guide to table relationships, primary/foreign keys, and query execution plans (EXPLAIN ANALYZE).',
      },
    ],
  },
  'python': {
    concepts: ['Vectorized Operations (NumPy)', 'DataFrames & Filtering (Pandas)', 'Exploratory Data Analysis', 'Model Validation'],
    prompt: 'Explain why data scientists use vectorized NumPy and Pandas operations instead of native Python for-loops when processing large datasets. In addition, why must you separate datasets into training, validation, and test splits?',
    hint: 'Mention SIMD CPU operations, contiguous memory in C/Fortran arrays, data leakage, and overfitting prevention.',
    resources: [
      {
        title: 'Kaggle: Pandas Micro-Course & Exercises',
        type: 'Interactive',
        provider: 'Kaggle Learn',
        duration: '35 mins',
        url: 'https://www.kaggle.com/learn/pandas',
        description: 'Hands-on notebook exercises for indexing, grouping, and transforming real-world data.',
      },
    ],
  },
};

export const checkpointService = {
  // Identify knowledge base key from milestone title
  getTopicKey(title = '') {
    const t = title.toLowerCase();
    if (t.includes('html') || t.includes('css') || t.includes('flexbox') || t.includes('grid')) return 'html5';
    if (t.includes('javascript') || t.includes('js') || t.includes('es6') || t.includes('async')) return 'javascript';
    if (t.includes('git') || t.includes('github') || t.includes('workflow')) return 'git';
    if (t.includes('react') || t.includes('component') || t.includes('spa') || t.includes('frontend')) return 'react';
    if (t.includes('api') || t.includes('node') || t.includes('express') || t.includes('backend')) return 'api';
    if (t.includes('database') || t.includes('sql') || t.includes('postgres') || t.includes('mongo')) return 'database';
    if (t.includes('python') || t.includes('data') || t.includes('pandas') || t.includes('machine learning')) return 'python';
    return null;
  },

  // Get curated learning resources for a milestone
  getCuratedResourcesForMilestone(task, careerId) {
    const topicKey = this.getTopicKey(task?.title);
    const kb = topicKey ? MILESTONE_KNOWLEDGE_BASE[topicKey] : null;

    if (kb && kb.resources) {
      return kb.resources;
    }

    // Fallback: match from global RESOURCES_DATA
    const relevant = RESOURCES_DATA.filter((r) => {
      const matchCareer = !careerId || r.careerId === careerId;
      const matchText = task?.title ? r.title.toLowerCase().includes(task.title.toLowerCase().split(' ')[0]) : false;
      return matchCareer || matchText;
    }).slice(0, 3);

    if (relevant.length > 0) {
      return relevant.map((r) => ({
        title: r.title,
        type: r.type,
        provider: r.provider,
        duration: r.duration,
        url: r.url,
        description: r.description,
      }));
    }

    // Default universal learning resources
    return [
      {
        title: `Official Documentation & Best Practices: ${task?.title || 'Core Milestone'}`,
        type: 'Official Doc',
        provider: 'Open Source Community',
        duration: '25 mins',
        url: 'https://developer.mozilla.org/en-US/',
        description: 'Authoritative documentation, standard specifications, and verified implementation examples.',
      },
      {
        title: 'freeCodeCamp: Practical Guided Curriculum',
        type: 'Interactive Sandbox',
        provider: 'freeCodeCamp',
        duration: '30 mins',
        url: 'https://www.freecodecamp.org/learn/',
        description: 'Hands-on problem solving challenges reinforcing foundational concepts and syntax.',
      },
    ];
  },

  // Get Key Concepts for a milestone
  getKeyConcepts(task) {
    const topicKey = this.getTopicKey(task?.title);
    const kb = topicKey ? MILESTONE_KNOWLEDGE_BASE[topicKey] : null;
    if (kb && kb.concepts) return kb.concepts;

    // Generate concepts from words in title
    const words = (task?.title || '')
      .replace(/[()]/g, '')
      .split(/[,&/]/)
      .map((w) => w.trim())
      .filter((w) => w.length > 3)
      .slice(0, 4);

    return words.length > 0 ? words : ['Core Architecture', 'Industry Standards', 'Practical Problem Solving'];
  },

  // Get Checkpoint Scenario Prompt
  getCheckpointPrompt(task) {
    const topicKey = this.getTopicKey(task?.title);
    const kb = topicKey ? MILESTONE_KNOWLEDGE_BASE[topicKey] : null;
    if (kb && kb.prompt) {
      return {
        prompt: kb.prompt,
        hint: kb.hint,
        concepts: kb.concepts,
      };
    }

    return {
      prompt: `Imagine you are explaining "${task?.title}" to a junior developer or justifying your architectural approach in a code review. Explain in your own words how this technology works, why it is used in production systems, and what common pitfalls you must avoid.`,
      hint: 'Structure your explanation with concrete examples: state what problem it solves, how it functions under the hood, and practical trade-offs.',
      concepts: this.getKeyConcepts(task),
    };
  },

  // Submit verbal / text explanation for evaluation
  async evaluateResponse({ milestoneTitle, keyConcepts, checkpointPrompt, studentResponse }) {
    try {
      const res = await fetch('/api/gemini/evaluate-checkpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneTitle,
          keyConcepts,
          checkpointPrompt,
          studentResponse,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          return {
            ...json.data,
            isAiPowered: json.isAiPowered ?? true,
            modelUsed: json.modelUsed || 'gemini-2.5-flash',
          };
        }
      }
    } catch (e) {
      console.warn('Network error during checkpoint evaluation, using local rubric engine:', e);
    }

    // Local deterministic fallback
    return this.evaluateLocally(milestoneTitle, keyConcepts, studentResponse);
  },

  // Local fallback evaluation
  evaluateLocally(milestoneTitle, keyConcepts = [], studentResponse = '') {
    const text = (studentResponse || '').trim().toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);

    if (words.length < 8) {
      return {
        score: 42,
        passed: false,
        rubricScores: {
          conceptualAccuracy: 40,
          practicalJustification: 35,
          absenceOfMisconceptions: 55,
        },
        feedback: 'Your explanation is very brief. To demonstrate complete understanding, please explain the reasoning behind your choice with technical details.',
        identifiedStrengths: ['Attempt submitted'],
        identifiedMisconceptions: ['Insufficient technical depth'],
        followUpQuestion: null,
        remediationNeeded: true,
        remediationRecommendation: 'Read the curated resources attached to this milestone and explain using a concrete real-world scenario.',
      };
    }

    const matchedConcepts = keyConcepts.filter((c) => {
      const parts = c.toLowerCase().split(/\s+/);
      return parts.some((p) => p.length > 3 && text.includes(p));
    });

    const hasRtl = text.includes('because') || text.includes('allows') || text.includes('why') || text.includes('instead') || text.includes('helps');
    const conceptCoverage = keyConcepts.length > 0 ? (matchedConcepts.length / keyConcepts.length) : 0.8;

    const conceptualAccuracy = Math.min(96, Math.max(50, Math.round(55 + conceptCoverage * 38)));
    const practicalJustification = Math.min(95, Math.max(50, Math.round((hasRtl ? 75 : 60) + Math.min(20, words.length * 0.4))));
    const absenceOfMisconceptions = 90;

    const score = Math.round((conceptualAccuracy * 0.4) + (practicalJustification * 0.4) + (absenceOfMisconceptions * 0.2));
    const passed = score >= 70;

    return {
      score,
      passed,
      rubricScores: {
        conceptualAccuracy,
        practicalJustification,
        absenceOfMisconceptions,
      },
      feedback: passed
        ? `Strong conceptual explanation! You demonstrated solid command of ${matchedConcepts.slice(0, 2).join(' and ') || 'the core principles'} and justified your practical approach well.`
        : `Good effort, but your explanation needs more depth on the underlying mechanics and trade-offs before this milestone can be verified.`,
      identifiedStrengths: matchedConcepts.length > 0
        ? matchedConcepts.map((c) => `Good grasp of ${c}`)
        : ['Clear high-level overview'],
      identifiedMisconceptions: passed ? [] : ['Lacks detailed justification on why this solution is optimal'],
      followUpQuestion: !passed && score >= 55 ? 'Could you give a specific code or architecture example of how you would apply this in practice?' : null,
      remediationNeeded: !passed && score < 55,
      remediationRecommendation: !passed ? 'Review the linked official documentation and try the interactive sandbox before retrying.' : null,
    };
  },
};
