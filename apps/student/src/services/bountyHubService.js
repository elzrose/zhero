/**
 * ZHERO Verified Bounty Hub Service
 * Manages real-world challenge discovery, practice lab challenges, student workspaces,
 * deliverable checklists, URL validation, trustworthy review provenance, and portfolio projection.
 */

export const BOUNTY_STORAGE_KEYS = {
  PARTICIPATIONS: 'zhero_bounty_participations',
  CUSTOM_BOUNTIES: 'zhero_bounties_custom',
};

// Curated Challenges (Clearly distinguishing ZHERO Practice Labs from External Research/Partner Challenges)
export const CURATED_BOUNTIES = [
  {
    id: 'bounty-darkmode-101',
    title: 'Accessible Dark Mode & High-Contrast Design Token System',
    summary: 'Build a production-grade theme switcher supporting light, dark, and high-contrast modes meeting WCAG 2.1 AA standards.',
    problemStatement: `Modern applications require accessible color contrast across light and dark operating system preferences. 
Your challenge is to design and implement an accessible theme switcher library for a React SPA that respects system preference (\`prefers-color-scheme\`), persists the user's explicit preference in storage, and provides a designated high-contrast mode for visually impaired users.
All interactive components must maintain a minimum contrast ratio of 4.5:1 for body text and 3:1 for UI controls.`,
    publisher: 'ZHERO Practice Labs',
    publisherType: 'zhero_practice_lab',
    publisherVerification: 'zhero_verified',
    category: 'Frontend & UI/UX',
    difficulty: 'intermediate',
    estimatedHours: '8-12 hours',
    isPracticeChallenge: true,
    sourceUrl: 'https://zhero.education/labs/challenges/darkmode-101',
    requiredSkills: ['React', 'CSS Custom Properties', 'WCAG Accessibility', 'Design Tokens'],
    optionalSkills: ['TypeScript', 'Testing Library'],
    careerAlignment: ['full-stack-engineer', 'ui-ux-designer'],
    eligibility: 'Open to all ZHERO enrolled students. Recommended after completing CSS Flexbox and React state milestones.',
    deliverables: [
      { id: 'd1', label: 'GitHub Repository containing source code with README documentation' },
      { id: 'd2', label: 'Live preview demo (Vercel, Netlify, or GitHub Pages)' },
      { id: 'd3', label: 'WCAG 2.1 AA contrast audit table or Lighthouse accessibility report screenshot' },
    ],
    submissionInstructions: 'Submit your GitHub repository link and deployed live demo URL. Provide notes explaining how tokens handle high-contrast overrides.',
    rubric: [
      { criterion: 'Accessibility & Contrast', weight: '35%', requirement: 'Meets WCAG 2.1 AA (>= 4.5:1 text, >= 3:1 controls) tested with browser devtools.' },
      { criterion: 'Token Architecture', weight: '30%', requirement: 'Uses semantic CSS variables or tokens without hardcoded hex codes in components.' },
      { criterion: 'Persistence & UX', weight: '20%', requirement: 'Respects system prefers-color-scheme and remembers user choice across reloads.' },
      { criterion: 'Code Cleanliness & Docs', weight: '15%', requirement: 'Well-structured component code, clean commits, and informative README.' },
    ],
    deadline: null, // Open challenge
    reward: {
      type: 'certificate',
      amount: 0,
      currency: null,
      isMonetary: false,
      title: 'ZHERO Frontend Accessibility Certificate & Portfolio Endorsement',
      terms: 'Awarded upon passing all rubric criteria with >=80% cumulative score from peer or tutor evaluation. No cash payout.',
    },
    rules: {
      originality: 'Must be your own implementation. You may use utility libraries (e.g. Tailwind) but the token switcher logic must be original.',
      aiUsage: 'AI tools (e.g. Gemini, ChatGPT) may be used for syntax assistance and documentation, but code architecture must be student-crafted.',
      collaboration: 'Solo project submission.',
    },
    createdAt: '2026-10-01T00:00:00Z',
    lastChecked: '2026-10-15T00:00:00Z',
  },
  {
    id: 'bounty-ratelimit-102',
    title: 'Idempotency Key & Rate-Limiting Middleware for REST APIs',
    summary: 'Implement robust token-bucket rate limiting and idempotency handling to prevent double billing in financial or order submission endpoints.',
    problemStatement: `Network retries can lead to duplicate payments or redundant database mutations. 
Build an Express/Node.js middleware layer that:
1. Enforces rate limits per IP/API token using an in-memory or Redis-backed sliding window / token bucket algorithm.
2. Intercepts incoming \`Idempotency-Key\` HTTP headers and guarantees that replaying the exact same request within a 5-minute window returns the identical cached response without re-executing business logic.
3. Includes automated integration tests simulating concurrent duplicated requests.`,
    publisher: 'ZHERO Practice Labs',
    publisherType: 'zhero_practice_lab',
    publisherVerification: 'zhero_verified',
    category: 'Backend & APIs',
    difficulty: 'intermediate',
    estimatedHours: '10-14 hours',
    isPracticeChallenge: true,
    sourceUrl: 'https://zhero.education/labs/challenges/api-resilience-102',
    requiredSkills: ['Node.js', 'Express', 'HTTP Headers', 'Integration Testing'],
    optionalSkills: ['Redis', 'Jest', 'Supertest'],
    careerAlignment: ['full-stack-engineer', 'cloud-devops-engineer'],
    eligibility: 'Students who have built basic Express endpoints. Prerequisite: understanding of HTTP status codes.',
    deliverables: [
      { id: 'd1', label: 'GitHub Repository with middleware package and sample Express app' },
      { id: 'd2', label: 'Automated test suite demonstrating rate-limit 429 response and idempotency 200 replay' },
      { id: 'd3', label: 'Architecture documentation explaining cache expiration and concurrency guards' },
    ],
    submissionInstructions: 'Submit GitHub repository with passing test command instructions in README.',
    rubric: [
      { criterion: 'Idempotency Guarantees', weight: '40%', requirement: 'Duplicate requests return identical status and payload without duplicating DB operations.' },
      { criterion: 'Rate Limiting Accuracy', weight: '30%', requirement: 'Properly emits 429 Too Many Requests with Retry-After header when threshold exceeded.' },
      { criterion: 'Test Coverage', weight: '20%', requirement: 'Automated integration tests for edge cases (expired keys, malformed headers).' },
      { criterion: 'Documentation', weight: '10%', requirement: 'Clear setup guide and architectural diagram.' },
    ],
    deadline: null,
    reward: {
      type: 'mentorship',
      amount: 0,
      currency: null,
      isMonetary: false,
      title: 'Senior Backend Code Review & Architecture Mentorship Session',
      terms: 'Submissions scoring >=85% on integration test rubric receive detailed architectural feedback from a senior engineer mentor.',
    },
    rules: {
      originality: 'Students must implement the middleware logic; using black-box third party rate-limiter npm packages is disallowed.',
      aiUsage: 'Allowed for unit test boilerplate generation.',
      collaboration: 'Solo submission.',
    },
    createdAt: '2026-10-05T00:00:00Z',
    lastChecked: '2026-10-15T00:00:00Z',
  },
  {
    id: 'bounty-health-ai-103',
    title: 'Clinical Note Summarizer with Automated PII Redaction',
    summary: 'Design a Python pipeline that sanitizes sensitive medical notes (names, phone numbers, IDs) before generating structured summary reports.',
    problemStatement: `Patient privacy is paramount in medical data processing. 
Build a Python data processing pipeline that:
1. Ingests mock synthetic clinical consultation notes (provided in benchmark repository).
2. Uses Regex and Named Entity Recognition (NER) to detect and redact Personally Identifiable Information (HIPAA Safe Harbor 18 identifiers: patient names, dates, contact info, SSNs).
3. Produces a standardized SOAP (Subjective, Objective, Assessment, Plan) format summary of the redacted notes.
4. Outputs an evaluation report measuring redaction recall against the benchmark ground truth.`,
    publisher: 'Open Health AI Initiative',
    publisherType: 'community_partner',
    publisherVerification: 'verified_partner',
    category: 'AI & Machine Learning',
    difficulty: 'advanced',
    estimatedHours: '16-24 hours',
    isPracticeChallenge: false,
    sourceUrl: 'https://github.com/open-health-ai/clinical-redaction-challenge',
    requiredSkills: ['Python', 'NLP / Regular Expressions', 'Data Privacy (HIPAA)', 'Pandas'],
    optionalSkills: ['SpaCy', 'Hugging Face Transformers'],
    careerAlignment: ['ai-data-scientist', 'ai-engineer'],
    eligibility: 'Students with Python proficiency. Must agree never to use real patient records.',
    deliverables: [
      { id: 'd1', label: 'GitHub Repository with Python package and requirements.txt' },
      { id: 'd2', label: 'Jupyter Notebook demonstrating redaction step-by-step and benchmarking metrics' },
      { id: 'd3', label: 'Sample redacted output comparing original synthetic notes vs output' },
    ],
    submissionInstructions: 'Provide GitHub repository link and notebook link. Ensure no API keys or proprietary weights are hardcoded.',
    rubric: [
      { criterion: 'Redaction Recall', weight: '45%', requirement: 'Identifies >=95% of synthetic PII entities without excessive over-redaction.' },
      { criterion: 'SOAP Formatting', weight: '25%', requirement: 'Correctly extracts chief complaint and clinical plan into structured format.' },
      { criterion: 'Privacy Safeguards', weight: '20%', requirement: 'Strict offline processing; zero data transmitted to untrusted external APIs.' },
      { criterion: 'Reproducibility', weight: '10%', requirement: 'Virtual environment builds cleanly with single `pip install -r requirements.txt`.' },
    ],
    deadline: '2026-12-15T23:59:59Z',
    reward: {
      type: 'internship_consideration',
      amount: 0,
      currency: null,
      isMonetary: false,
      title: 'Open Source Research Contributor Badge & Internship Consideration',
      terms: 'Top 3 validated solutions will be invited for an interview with the Open Health AI research team for Summer 2027 junior research internships.',
    },
    rules: {
      originality: 'All baseline model configurations and scripts must be student-authored.',
      aiUsage: 'Allowed for docstrings and synthetic dataset generation only.',
      collaboration: 'Pairs allowed (max 2 students).',
    },
    createdAt: '2026-10-08T00:00:00Z',
    lastChecked: '2026-10-16T00:00:00Z',
  },
  {
    id: 'bounty-revision-analytics-104',
    title: 'Student Academic Stress & Spaced Revision Analytics Dashboard',
    summary: 'Analyze synthetic student study habits and build interactive visualizations correlating revision frequency with test retention.',
    problemStatement: `Tuition centres need empirical insights to prevent student burnout during high-stakes board examination prep.
Using our open synthetic dataset of 2,000 anonymized student revision schedules and milestone scores:
1. Conduct exploratory data analysis on study session lengths, revision spacing, and topic mastery decay curves.
2. Build an interactive Streamlit or HTML/JS dashboard showing optimal study intervals before retention drops below 60%.
3. Write an executive summary recommending actionable workload caps for exam weeks.`,
    publisher: 'ZHERO Educational Research Labs',
    publisherType: 'zhero_practice_lab',
    publisherVerification: 'zhero_verified',
    category: 'Data Analysis',
    difficulty: 'beginner',
    estimatedHours: '6-8 hours',
    isPracticeChallenge: true,
    sourceUrl: 'https://zhero.education/labs/challenges/revision-analytics-104',
    requiredSkills: ['Data Analysis', 'Python / Pandas', 'Data Visualization (Matplotlib or Chart.js)'],
    optionalSkills: ['Streamlit', 'Statistics'],
    careerAlignment: ['ai-data-scientist', 'full-stack-engineer'],
    eligibility: 'Beginners welcome! Great first data project.',
    deliverables: [
      { id: 'd1', label: 'GitHub Repository containing analysis scripts / Jupyter notebook' },
      { id: 'd2', label: 'Live dashboard link or exported interactive HTML report' },
      { id: 'd3', label: '1-page Executive Summary with 3 key recommendations for teachers' },
    ],
    submissionInstructions: 'Submit GitHub repository with dataset and visualization screenshots.',
    rubric: [
      { criterion: 'Data Accuracy & Methodology', weight: '40%', requirement: 'Correct statistical calculations (averages, distributions, retention regressions).' },
      { criterion: 'Visual Clarity', weight: '30%', requirement: 'Readable charts with clear labels, legends, and accessibility-conscious colors.' },
      { criterion: 'Actionable Insights', weight: '30%', requirement: 'Recommendations directly supported by data findings rather than generic advice.' },
    ],
    deadline: null,
    reward: {
      type: 'certificate',
      amount: 0,
      currency: null,
      isMonetary: false,
      title: 'ZHERO Data Science Pioneer Certificate',
      terms: 'Awarded to students whose analysis demonstrates sound data hygiene and actionable pedagogy insights.',
    },
    rules: {
      originality: 'Individual work. Plagiarized notebooks from Kaggle will be disqualified.',
      aiUsage: 'Permitted for visualization syntax help.',
      collaboration: 'Solo.',
    },
    createdAt: '2026-10-10T00:00:00Z',
    lastChecked: '2026-10-16T00:00:00Z',
  },
  {
    id: 'bounty-monorepo-ci-105',
    title: 'Automated GitHub Actions CI/CD Pipeline for Polyrepo Monorepos',
    summary: 'Construct an efficient GitHub Actions workflow matrix that runs lint, build, and unit tests only for affected packages.',
    problemStatement: `Monorepos with multiple applications (e.g. apps/student, apps/tuition-centre) often suffer from slow 20-minute CI builds.
Construct a production GitHub Actions workflow file that:
1. Detects changed files using git diff / path filters.
2. Triggers lint and test jobs only for affected workspaces.
3. Implements npm/pnpm dependency caching.
4. Generates a summary markdown comment on pull requests with passing/failing test tallies.`,
    publisher: 'Open DevTools Community',
    publisherType: 'community_partner',
    publisherVerification: 'verified_partner',
    category: 'Automation & Developer Tools',
    difficulty: 'intermediate',
    estimatedHours: '8-12 hours',
    isPracticeChallenge: false,
    sourceUrl: 'https://github.com/open-devtools/ci-matrix-challenge',
    requiredSkills: ['GitHub Actions', 'YAML', 'Bash Scripting', 'CI/CD Caching'],
    optionalSkills: ['Docker', 'Turborepo'],
    careerAlignment: ['cloud-devops-engineer', 'full-stack-engineer'],
    eligibility: 'Students familiar with Git and command-line package managers.',
    deliverables: [
      { id: 'd1', label: 'GitHub Repository with sample monorepo structure and `.github/workflows/ci.yml`' },
      { id: 'd2', label: 'Demonstration Pull Request showing matrix test run completed in under 2 minutes' },
      { id: 'd3', label: 'README with caching benchmarks comparing uncached vs cached execution' },
    ],
    submissionInstructions: 'Submit link to public GitHub repository and public PR demonstrating the active workflow.',
    rubric: [
      { criterion: 'Path Filtering & Efficiency', weight: '40%', requirement: 'Changes to apps/student only test apps/student without rebuilding unaffected workspaces.' },
      { criterion: 'Cache Optimization', weight: '30%', requirement: 'Second workflow run hits node_modules cache and reduces runtime by >=50%.' },
      { criterion: 'PR Summary Reporting', weight: '20%', requirement: 'Correctly outputs markdown table into GitHub Actions step summary.' },
      { criterion: 'Security & Token Scope', weight: '10%', requirement: 'GITHUB_TOKEN uses minimum required permissions (contents: read, pull-requests: write).' },
    ],
    deadline: '2026-11-30T23:59:59Z',
    reward: {
      type: 'fixed_monetary',
      amount: 2500,
      currency: 'INR',
      isMonetary: true,
      title: 'Open Source Community DevTools Grant (₹2,500)',
      terms: 'Sponsored by Open DevTools Community for the top 5 students meeting all performance benchmarks. Subject to independent maintainer review.',
    },
    rules: {
      originality: 'Custom YAML workflows. No copy-pasting copyrighted enterprise scripts.',
      aiUsage: 'Allowed for syntax validation.',
      collaboration: 'Solo.',
    },
    createdAt: '2026-10-12T00:00:00Z',
    lastChecked: '2026-10-16T00:00:00Z',
  },
  {
    id: 'bounty-expired-legacy-106',
    title: 'Civic Tech Local Air Quality Alerting PWA (Completed Challenge)',
    summary: 'A previous civic hackathon challenge that has officially concluded. Demonstrates historical archived challenges.',
    problemStatement: `This challenge is officially archived and no longer accepting active submissions. 
Students were tasked with connecting to the OpenAQ REST API and sending browser push alerts when PM2.5 exceeded critical levels.`,
    publisher: 'Civic Open Data Alliance',
    publisherType: 'community_partner',
    publisherVerification: 'verified_partner',
    category: 'Social-Impact & Community',
    difficulty: 'intermediate',
    estimatedHours: '12 hours',
    isPracticeChallenge: false,
    sourceUrl: 'https://civicopendata.org/challenges/air-quality-2026',
    requiredSkills: ['JavaScript', 'PWA / Service Workers', 'REST APIs'],
    optionalSkills: ['Leaflet.js'],
    careerAlignment: ['full-stack-engineer'],
    eligibility: 'Archived challenge for educational review.',
    deliverables: [
      { id: 'd1', label: 'Archived project repository' },
    ],
    submissionInstructions: 'Submissions closed.',
    rubric: [
      { criterion: 'API Integration', weight: '50%', requirement: 'Real-time sensor parsing.' },
      { criterion: 'Push Notifications', weight: '50%', requirement: 'Service worker notification triggers.' },
    ],
    deadline: '2026-09-30T23:59:59Z', // Expired
    reward: {
      type: 'no_monetary',
      amount: 0,
      currency: null,
      isMonetary: false,
      title: 'Archived Challenge - No Rewards Active',
      terms: 'Concluded on September 30, 2026. Submissions are read-only.',
    },
    rules: {
      originality: 'Archived.',
      aiUsage: 'Archived.',
      collaboration: 'Archived.',
    },
    createdAt: '2026-08-01T00:00:00Z',
    lastChecked: '2026-10-01T00:00:00Z',
  },
];

class BountyHubService {
  constructor() {
    this.memoryParticipations = [];
    this.memoryBounties = [];
  }

  // --- Date helper ---
  isBountyExpired(deadline) {
    if (!deadline) return false;
    const deadlineTime = new Date(deadline).getTime();
    return !isNaN(deadlineTime) && deadlineTime < Date.now();
  }

  // --- Challenge Catalogue ---
  getAllBounties() {
    let custom = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(BOUNTY_STORAGE_KEYS.CUSTOM_BOUNTIES);
        custom = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(custom)) custom = [];
      } catch {
        custom = [];
      }
    } else {
      custom = this.memoryBounties || [];
    }

    const merged = [...CURATED_BOUNTIES, ...custom];
    return merged.map((b) => ({
      ...b,
      isExpired: this.isBountyExpired(b.deadline),
    }));
  }

  getBountyById(id) {
    const list = this.getAllBounties();
    return list.find((b) => b.id === id) || null;
  }

  getBounties(filters = {}) {
    let list = this.getAllBounties();

    if (filters.category && filters.category !== 'all') {
      const catLower = filters.category.toLowerCase();
      list = list.filter((b) => b.category && b.category.toLowerCase().includes(catLower));
    }

    if (filters.difficulty && filters.difficulty !== 'all') {
      list = list.filter((b) => b.difficulty === filters.difficulty);
    }

    if (filters.rewardType && filters.rewardType !== 'all') {
      if (filters.rewardType === 'monetary') {
        list = list.filter((b) => b.reward && b.reward.isMonetary);
      } else if (filters.rewardType === 'non_monetary') {
        list = list.filter((b) => !b.reward || !b.reward.isMonetary);
      } else {
        list = list.filter((b) => b.reward && b.reward.type === filters.rewardType);
      }
    }

    if (filters.practiceOnly) {
      list = list.filter((b) => b.isPracticeChallenge);
    }

    if (filters.openOnly) {
      list = list.filter((b) => !b.isExpired);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.summary.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.requiredSkills || []).some((s) => s.toLowerCase().includes(q))
      );
    }

    return list;
  }

  // Recommendation engine based on student's active career interest and current roadmap
  getRecommendedBounties(userCareerId = 'full-stack-engineer', userSkills = []) {
    const all = this.getAllBounties().filter((b) => !b.isExpired);
    return all.map((bounty) => {
      let score = 0;
      const reasons = [];

      // Career alignment check
      if (bounty.careerAlignment && bounty.careerAlignment.includes(userCareerId)) {
        score += 3;
        reasons.push(`Directly develops core competencies for ${userCareerId.replace(/-/g, ' ')}.`);
      }

      // Matching skills
      const skillMatches = (bounty.requiredSkills || []).filter((s) =>
        userSkills.some((us) => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()))
      );
      if (skillMatches.length > 0) {
        score += skillMatches.length * 2;
        reasons.push(`Applies skills you are practising (${skillMatches.join(', ')}).`);
      }

      // Beginner friendly bonus if student is early in roadmap
      if (bounty.difficulty === 'beginner') {
        score += 1;
        reasons.push('Beginner-friendly scope with clear step-by-step evaluation rubric.');
      }

      return {
        ...bounty,
        recommendationScore: score,
        recommendationReason: reasons.length > 0 ? reasons.join(' ') : 'Great hands-on practical project to strengthen your portfolio.',
      };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);
  }

  // --- Student Participation Workspaces ---
  getParticipations() {
    let list = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(BOUNTY_STORAGE_KEYS.PARTICIPATIONS);
        list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) list = [];
      } catch {
        list = [];
      }
    } else {
      list = this.memoryParticipations || [];
    }
    return list;
  }

  saveParticipations(list) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(BOUNTY_STORAGE_KEYS.PARTICIPATIONS, JSON.stringify(list));
      window.dispatchEvent(new Event('zhero_bounty_updated'));
    } else {
      this.memoryParticipations = list;
    }
    return list;
  }

  getParticipation(bountyId) {
    const list = this.getParticipations();
    return list.find((p) => p.bountyId === bountyId || p.id === bountyId) || null;
  }

  // Join a challenge and create a dedicated workspace
  joinBounty(bountyId, initialPlan = '') {
    const bounty = this.getBountyById(bountyId);
    if (!bounty) {
      throw new Error(`Challenge with ID "${bountyId}" not found.`);
    }

    if (bounty.isExpired) {
      throw new Error('This challenge has officially concluded and is no longer accepting new participants.');
    }

    const list = this.getParticipations();
    const existing = list.find((p) => p.bountyId === bountyId);
    if (existing) {
      // If previously withdrawn, student can re-activate
      if (existing.status === 'withdrawn') {
        return this.updateParticipation(existing.id, {
          status: 'joined',
          implementationPlan: initialPlan || existing.implementationPlan,
          updatedAt: new Date().toISOString(),
        });
      }
      return existing; // Already joined
    }

    const now = new Date().toISOString();
    const initialChecklist = (bounty.deliverables || []).map((d) => ({
      id: d.id,
      label: d.label,
      completed: false,
    }));

    const newParticipation = {
      id: `part-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bountyId: bounty.id,
      bountyTitle: bounty.title,
      bountyCategory: bounty.category,
      publisher: bounty.publisher,
      publisherType: bounty.publisherType,
      isPracticeChallenge: !!bounty.isPracticeChallenge,
      status: 'joined', // 'joined' | 'in_progress' | 'ready_for_submission' | 'submitted' | 'under_review' | 'changes_requested' | 'accepted' | 'rejected' | 'withdrawn' | 'completed'
      reviewProvenance: 'self_reported_draft', // 'self_reported_draft' | 'submitted_to_zhero' | 'received_by_zhero' | 'publisher_review_pending' | 'feedback_received' | 'changes_requested' | 'publisher_accepted' | 'publisher_rejected' | 'reward_confirmed' | 'reward_paid'
      implementationPlan: initialPlan || '',
      deliverablesChecklist: initialChecklist,
      evidence: {
        githubRepoUrl: '',
        prUrl: '',
        liveUrl: '',
        demoVideoUrl: '',
        writtenExplanation: '',
      },
      submittedAt: null,
      submissionHistory: [],
      feedbackHistory: [],
      reviewOutcome: '',
      reflection: '',
      skillsPractised: bounty.requiredSkills || [],
      reward: bounty.reward,
      rewardStatus: 'unclaimed', // 'unclaimed' | 'eligible' | 'confirmed' | 'paid'
      rewardPaidConfirmed: false,
      joinedAt: now,
      updatedAt: now,
    };

    list.unshift(newParticipation);
    this.saveParticipations(list);
    return newParticipation;
  }

  // Update notes, checklist items, implementation plan, etc.
  updateParticipation(participationId, updates = {}) {
    const list = this.getParticipations();
    const index = list.findIndex((p) => p.id === participationId || p.bountyId === participationId);
    if (index === -1) return null;

    const current = list[index];

    // Maintain evidence integrity: client-side status changes must never falsely set reviewProvenance to publisher_accepted or reward_paid
    let updatedProvenance = current.reviewProvenance;
    if (updates.status === 'in_progress' && current.status === 'joined') {
      updatedProvenance = 'self_reported_draft';
    }

    const updatedRecord = {
      ...current,
      ...updates,
      reviewProvenance: updates.reviewProvenance || updatedProvenance,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedRecord;
    this.saveParticipations(list);
    return updatedRecord;
  }

  toggleDeliverable(participationId, deliverableId) {
    const record = this.getParticipation(participationId);
    if (!record) return null;

    const updatedList = (record.deliverablesChecklist || []).map((item) => {
      if (item.id === deliverableId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    return this.updateParticipation(record.id, {
      deliverablesChecklist: updatedList,
      status: record.status === 'joined' ? 'in_progress' : record.status,
    });
  }

  // Validate Evidence URLs
  validateEvidenceUrl(url, type = 'github') {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'URL is required.' };
    }
    const trimmed = url.trim();

    try {
      const parsed = new URL(trimmed);
      if (type === 'github') {
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          return { valid: false, error: 'GitHub repository URL must use http or https protocol.' };
        }
        if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') {
          return { valid: false, error: 'GitHub URL must point to github.com.' };
        }
        const parts = parsed.pathname.split('/').filter(Boolean);
        if (parts.length < 2) {
          return { valid: false, error: 'GitHub repository URL must include owner and repository name (e.g. https://github.com/owner/repo).' };
        }
      } else if (type === 'live') {
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          return { valid: false, error: 'Live preview URL must use http or https protocol.' };
        }
      }
      return { valid: true, url: trimmed };
    } catch {
      return { valid: false, error: 'Invalid URL format. Please provide a valid web link starting with https://' };
    }
  }

  // Submit Evidence for Review
  submitBountyEvidence(participationId, evidencePayload = {}) {
    const record = this.getParticipation(participationId);
    if (!record) {
      throw new Error('Workspace participation record not found.');
    }

    // Must provide at least a GitHub repo link or a written explanation with live demo
    const { githubRepoUrl, liveUrl, prUrl, demoVideoUrl, writtenExplanation = '' } = evidencePayload;

    if (!githubRepoUrl && !liveUrl && !writtenExplanation) {
      throw new Error('Please provide at least a GitHub repository URL, a live demo link, or a written explanation.');
    }

    if (githubRepoUrl) {
      const check = this.validateEvidenceUrl(githubRepoUrl, 'github');
      if (!check.valid) throw new Error(check.error);
    }

    if (liveUrl) {
      const check = this.validateEvidenceUrl(liveUrl, 'live');
      if (!check.valid) throw new Error(check.error);
    }

    const now = new Date().toISOString();
    const submissionEntry = {
      version: (record.submissionHistory || []).length + 1,
      submittedAt: now,
      evidence: {
        githubRepoUrl: githubRepoUrl || '',
        liveUrl: liveUrl || '',
        prUrl: prUrl || '',
        demoVideoUrl: demoVideoUrl || '',
        writtenExplanation: writtenExplanation || '',
      },
      status: 'submitted',
    };

    const updatedSubmissions = [...(record.submissionHistory || []), submissionEntry];

    return this.updateParticipation(record.id, {
      status: 'submitted',
      reviewProvenance: 'submitted_to_zhero',
      evidence: submissionEntry.evidence,
      submittedAt: now,
      submissionHistory: updatedSubmissions,
      updatedAt: now,
    });
  }

  // Record an honest publisher or tutor review
  recordPublisherReview(participationId, reviewPayload = {}) {
    const record = this.getParticipation(participationId);
    if (!record) return null;

    const {
      outcome = 'accepted', // 'accepted' | 'changes_requested' | 'rejected'
      feedbackText = '',
      reviewerName = 'ZHERO Practice Lab Evaluator',
      rubricScores = {},
      rewardConfirmed = false,
    } = reviewPayload;

    const now = new Date().toISOString();
    const feedbackEntry = {
      id: `fb-${Date.now()}`,
      date: now,
      reviewer: reviewerName,
      outcome,
      feedbackText,
      rubricScores,
    };

    let nextStatus = 'under_review';
    let nextProvenance = 'feedback_received';

    if (outcome === 'accepted') {
      nextStatus = 'accepted';
      nextProvenance = 'publisher_accepted';
    } else if (outcome === 'changes_requested') {
      nextStatus = 'changes_requested';
      nextProvenance = 'changes_requested';
    } else if (outcome === 'rejected') {
      nextStatus = 'rejected';
      nextProvenance = 'publisher_rejected';
    }

    return this.updateParticipation(record.id, {
      status: nextStatus,
      reviewProvenance: nextProvenance,
      feedbackHistory: [...(record.feedbackHistory || []), feedbackEntry],
      reviewOutcome: feedbackText,
      rewardStatus: rewardConfirmed ? 'confirmed' : record.rewardStatus,
      updatedAt: now,
    });
  }

  // Record verified reward payout with external transaction/certificate proof
  recordRewardConfirmation(participationId, confirmationProof = {}) {
    const record = this.getParticipation(participationId);
    if (!record) return null;

    if (!confirmationProof.proofReference && !confirmationProof.certificateId) {
      throw new Error('Reward payment or certificate issue cannot be marked confirmed without an explicit verification proof reference.');
    }

    return this.updateParticipation(record.id, {
      rewardStatus: 'paid',
      rewardPaidConfirmed: true,
      reviewProvenance: 'reward_paid',
      rewardProofReference: confirmationProof.proofReference || confirmationProof.certificateId,
      paidAt: new Date().toISOString(),
    });
  }

  // Withdraw from a challenge
  withdrawParticipation(participationId, reason = 'Withdrawn by student') {
    return this.updateParticipation(participationId, {
      status: 'withdrawn',
      reflection: reason,
      updatedAt: new Date().toISOString(),
    });
  }

  // --- Honest Quantitative Summary Metrics ---
  getBountyMetrics() {
    const list = this.getParticipations().filter((p) => p.status !== 'withdrawn');
    const inProgress = list.filter((p) => ['joined', 'in_progress', 'ready_for_submission'].includes(p.status)).length;
    const submitted = list.filter((p) => p.status === 'submitted').length;
    const underReview = list.filter((p) => ['submitted', 'under_review', 'changes_requested'].includes(p.status)).length;
    const completed = list.filter((p) => ['accepted', 'completed'].includes(p.status)).length;
    const verifiedEvidence = list.filter((p) => ['publisher_accepted', 'reward_confirmed', 'reward_paid'].includes(p.reviewProvenance)).length;

    return {
      totalJoined: list.length,
      inProgress,
      submitted,
      underReview,
      completed,
      verifiedEvidence,
    };
  }

  // --- Portfolio Projection ---
  getPortfolioBounties() {
    const list = this.getParticipations();
    // Only accepted or completed work qualifies for portfolio showcase
    return list.filter((p) => ['accepted', 'completed'].includes(p.status));
  }
}

export const bountyHubService = new BountyHubService();
