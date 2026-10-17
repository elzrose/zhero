/**
 * ZHERO GitHub & Open-Source Contribution Hub Service
 * Manages GitHub profile linking, curated repository & issue exploration,
 * contribution workspaces, URL validation, and trustworthy evidence provenance.
 */

export const GITHUB_HUB_STORAGE_KEYS = {
  PROFILE: 'zhero_github_profile',
  CONTRIBUTIONS: 'zhero_github_contributions',
};
export const GITHUB_STORAGE_KEYS = GITHUB_HUB_STORAGE_KEYS;

// Curated Open-Source Repositories (Real GitHub repositories with honest metadata)
export const CURATED_REPOSITORIES = [
  {
    id: 'repo-docusaurus',
    owner: 'facebook',
    name: 'docusaurus',
    fullName: 'facebook/docusaurus',
    description: 'Easy to maintain open-source documentation websites powered by React and Markdown.',
    language: 'TypeScript',
    category: 'Web & Frontend',
    topics: ['react', 'documentation', 'ssg', 'typescript'],
    url: 'https://github.com/facebook/docusaurus',
    repoUrl: 'https://github.com/facebook/docusaurus',
    issueTrackerUrl: 'https://github.com/facebook/docusaurus/issues',
    beginnerFriendly: true,
    labels: ['good first issue', 'help wanted', 'documentation'],
    careerAlignment: ['full-stack-engineer', 'ui-ux-designer'],
    whyRecommended: 'Built with React and Markdown. Excellent for understanding component architecture and documentation tooling.',
    isCuratedSample: true,
    source: 'Curated Ecosystem Catalogue',
  },
  {
    id: 'repo-freecodecamp',
    owner: 'freeCodeCamp',
    name: 'freeCodeCamp',
    fullName: 'freeCodeCamp/freeCodeCamp',
    description: 'Open-source web development curriculum and coding challenges platform.',
    language: 'TypeScript',
    category: 'Full-Stack Web',
    topics: ['education', 'react', 'nodejs', 'curriculum'],
    url: 'https://github.com/freeCodeCamp/freeCodeCamp',
    repoUrl: 'https://github.com/freeCodeCamp/freeCodeCamp',
    issueTrackerUrl: 'https://github.com/freeCodeCamp/freeCodeCamp/issues',
    beginnerFriendly: true,
    labels: ['first-timers-only', 'good first issue', 'help wanted'],
    careerAlignment: ['full-stack-engineer', 'software-engineer'],
    whyRecommended: 'Extremely welcoming to first-time contributors with detailed step-by-step contribution guides.',
    isCuratedSample: true,
    source: 'Curated Ecosystem Catalogue',
  },
  {
    id: 'repo-express',
    owner: 'expressjs',
    name: 'express',
    fullName: 'expressjs/express',
    description: 'Fast, unopinionated, minimalist web framework for Node.js.',
    language: 'JavaScript',
    category: 'Backend & APIs',
    topics: ['nodejs', 'express', 'http', 'api', 'middleware'],
    url: 'https://github.com/expressjs/express',
    repoUrl: 'https://github.com/expressjs/express',
    issueTrackerUrl: 'https://github.com/expressjs/express/issues',
    beginnerFriendly: true,
    labels: ['documentation', 'good first issue'],
    careerAlignment: ['full-stack-engineer', 'cloud-devops-engineer'],
    whyRecommended: 'Core backend library used worldwide. Great for learning middleware patterns, HTTP status codes, and routing.',
    isCuratedSample: true,
    source: 'Curated Ecosystem Catalogue',
  },
  {
    id: 'repo-flask',
    owner: 'pallets',
    name: 'flask',
    fullName: 'pallets/flask',
    description: 'The Python micro framework for building web applications and REST APIs.',
    language: 'Python',
    category: 'Backend & APIs',
    topics: ['python', 'flask', 'web', 'api', 'wsigi'],
    url: 'https://github.com/pallets/flask',
    repoUrl: 'https://github.com/pallets/flask',
    issueTrackerUrl: 'https://github.com/pallets/flask/issues',
    beginnerFriendly: true,
    labels: ['docs', 'good first issue'],
    careerAlignment: ['ai-data-scientist', 'full-stack-engineer'],
    whyRecommended: 'Python standard for lightweight web services. Ideal for practicing Python coding standards and unit tests.',
    isCuratedSample: true,
    source: 'Curated Ecosystem Catalogue',
  },
  {
    id: 'repo-scikit-learn',
    owner: 'scikit-learn',
    name: 'scikit-learn',
    fullName: 'scikit-learn/scikit-learn',
    description: 'Machine learning library in Python with simple and efficient tools for predictive data analysis.',
    language: 'Python',
    category: 'Data Science & ML',
    topics: ['machine-learning', 'python', 'scikit-learn', 'data-science'],
    url: 'https://github.com/scikit-learn/scikit-learn',
    repoUrl: 'https://github.com/scikit-learn/scikit-learn',
    issueTrackerUrl: 'https://github.com/scikit-learn/scikit-learn/issues',
    beginnerFriendly: true,
    labels: ['Easy', 'good first issue', 'Documentation'],
    careerAlignment: ['ai-data-scientist', 'ai-engineer'],
    whyRecommended: 'The gold standard Python ML library. Beginner issues include docstring fixes, example improvements, and test coverage.',
    isCuratedSample: true,
    source: 'Curated Ecosystem Catalogue',
  },
  {
    id: 'repo-styled-components',
    owner: 'styled-components',
    name: 'styled-components',
    fullName: 'styled-components/styled-components',
    description: 'Visual primitives for the component age. Use the best bits of ES6 and CSS to style your apps.',
    language: 'TypeScript',
    category: 'Web & Frontend',
    topics: ['css-in-js', 'react', 'styled-components', 'ui'],
    url: 'https://github.com/styled-components/styled-components',
    repoUrl: 'https://github.com/styled-components/styled-components',
    issueTrackerUrl: 'https://github.com/styled-components/styled-components/issues',
    beginnerFriendly: true,
    labels: ['good first issue', 'help wanted'],
    careerAlignment: ['ui-ux-designer', 'full-stack-engineer'],
    whyRecommended: 'Connects modern design tokens with React components. Great for refining CSS-in-JS and TypeScript typings.',
    isCuratedSample: true,
    source: 'Curated Ecosystem Catalogue',
  },
];

// Curated Beginner-Friendly Issues
export const CURATED_ISSUES = [
  {
    id: 'issue-docusaurus-101',
    repoId: 'repo-docusaurus',
    repository: 'facebook/docusaurus',
    repoFullName: 'facebook/docusaurus',
    repoUrl: 'https://github.com/facebook/docusaurus',
    issueNumber: 8492,
    number: 8492,
    title: 'docs: Clarify code block title and line highlighting behavior in mobile viewports',
    issueUrl: 'https://github.com/facebook/docusaurus/issues/8492',
    labels: ['good first issue', 'documentation'],
    technologies: ['Markdown', 'React', 'CSS'],
    difficulty: 'beginner',
    prerequisites: ['Basic Markdown syntax', 'Understanding of responsive design'],
    originalDescription:
      'The current documentation does not clearly mention that line-number highlights collapse on mobile screens below 480px. We should add a small callout explaining this responsive behavior and provide an example snippet.',
    body:
      'The current documentation does not clearly mention that line-number highlights collapse on mobile screens below 480px. We should add a small callout explaining this responsive behavior and provide an example snippet.',
    aiExplanation:
      'The Docusaurus website documentation needs an update to tell developers that code block line highlights look different on small phone screens. You will locate the documentation file and add an explanatory note with a code example.',
    preparationChecklist: [
      { id: 'c1', text: 'Fork and clone the facebook/docusaurus repository to your local machine', done: false, completed: false },
      { id: 'c2', text: 'Read the repository CONTRIBUTING.md guide for documentation PRs', done: false, completed: false },
      { id: 'c3', text: 'Run `yarn start` in the docs package to view local documentation changes', done: false, completed: false },
      { id: 'c4', text: 'Locate `docs/markdown-features/code-blocks.md` and draft your clarification', done: false, completed: false },
      { id: 'c5', text: 'Verify formatting in desktop and mobile responsive preview in browser', done: false, completed: false },
    ],
    zheroChecklist: [
      { id: 'c1', text: 'Fork and clone the facebook/docusaurus repository to your local machine', done: false, completed: false },
      { id: 'c2', text: 'Read the repository CONTRIBUTING.md guide for documentation PRs', done: false, completed: false },
      { id: 'c3', text: 'Run `yarn start` in the docs package to view local documentation changes', done: false, completed: false },
      { id: 'c4', text: 'Locate `docs/markdown-features/code-blocks.md` and draft your clarification', done: false, completed: false },
      { id: 'c5', text: 'Verify formatting in desktop and mobile responsive preview in browser', done: false, completed: false },
    ],
    isCuratedSample: true,
    source: 'Curated Ecosystem Catalogue',
  },
  {
    id: 'issue-freecodecamp-202',
    repoId: 'repo-freecodecamp',
    repository: 'freeCodeCamp/freeCodeCamp',
    repoFullName: 'freeCodeCamp/freeCodeCamp',
    repoUrl: 'https://github.com/freeCodeCamp/freeCodeCamp',
    issueNumber: 49102,
    number: 49102,
    title: 'curriculum: Add explanatory hint for Array.prototype.reduce accumulator edge cases',
    issueUrl: 'https://github.com/freeCodeCamp/freeCodeCamp/issues/49102',
    labels: ['first-timers-only', 'good first issue'],
    technologies: ['JavaScript', 'ES6', 'Documentation'],
    difficulty: 'beginner',
    prerequisites: ['Understanding of JavaScript array methods (map, filter, reduce)'],
    originalDescription:
      'Students frequently get confused when `reduce()` is called on an empty array without an initialValue, which throws a TypeError. We want to add an explicit hint explaining this behavior in the Functional Programming section.',
    body:
      'Students frequently get confused when `reduce()` is called on an empty array without an initialValue, which throws a TypeError. We want to add an explicit hint explaining this behavior in the Functional Programming section.',
    aiExplanation:
      'In JavaScript, calling `.reduce()` without an initial value on an empty array crashes with a TypeError. You will help students by adding a hint and clarifying sentence in the freeCodeCamp lesson file.',
    preparationChecklist: [
      { id: 'c1', text: 'Fork freeCodeCamp/freeCodeCamp and clone locally', done: false, completed: false },
      { id: 'c2', text: 'Read the Curriculum Contribution Guidelines', done: false, completed: false },
      { id: 'c3', text: 'Create a feature branch `fix/reduce-empty-array-hint`', done: false, completed: false },
      { id: 'c4', text: 'Locate the functional programming challenge markdown file and update the hints section', done: false, completed: false },
      { id: 'c5', text: 'Run `npm test` on the curriculum challenges to ensure no syntax errors', done: false, completed: false },
    ],
    zheroChecklist: [
      { id: 'c1', text: 'Fork freeCodeCamp/freeCodeCamp and clone locally', done: false, completed: false },
      { id: 'c2', text: 'Read the Curriculum Contribution Guidelines', done: false, completed: false },
      { id: 'c3', text: 'Create a feature branch `fix/reduce-empty-array-hint`', done: false, completed: false },
      { id: 'c4', text: 'Locate the functional programming challenge markdown file and update the hints section', done: false, completed: false },
      { id: 'c5', text: 'Run `npm test` on the curriculum challenges to ensure no syntax errors', done: false, completed: false },
    ],
    isCuratedSample: true,
    source: 'Curated Ecosystem Catalogue',
  },
  {
    id: 'issue-express-303',
    repoId: 'repo-express',
    repository: 'expressjs/express',
    repoFullName: 'expressjs/express',
    repoUrl: 'https://github.com/expressjs/express',
    issueNumber: 5219,
    number: 5219,
    title: 'docs: Update res.json() vs res.send() error status code example in API guide',
    issueUrl: 'https://github.com/expressjs/express/issues/5219',
    labels: ['good first issue', 'documentation'],
    technologies: ['Node.js', 'Express', 'HTTP Status Codes'],
    difficulty: 'beginner',
    prerequisites: ['Basic Express.js route handlers', 'HTTP status code understanding'],
    originalDescription:
      'The API guide has a snippet showing `res.status(500).send({ error: "msg" })`. To reinforce best practices, it should demonstrate `res.status(500).json({ error: "msg" })` with appropriate Content-Type header explanation.',
    body:
      'The API guide has a snippet showing `res.status(500).send({ error: "msg" })`. To reinforce best practices, it should demonstrate `res.status(500).json({ error: "msg" })` with appropriate Content-Type header explanation.',
    aiExplanation:
      'Express provides `res.json()` which automatically sets the `Content-Type: application/json` header and formats objects. The guide currently uses `.send()` in an example. You will update the code example to use `.json()`.',
    preparationChecklist: [
      { id: 'c1', text: 'Fork expressjs/express repository', done: false, completed: false },
      { id: 'c2', text: 'Review Express contribution guidelines and commit style convention', done: false, completed: false },
      { id: 'c3', text: 'Update the markdown documentation example', done: false, completed: false },
      { id: 'c4', text: 'Check formatting using markdown linter', done: false, completed: false },
    ],
    zheroChecklist: [
      { id: 'c1', text: 'Fork expressjs/express repository', done: false, completed: false },
      { id: 'c2', text: 'Review Express contribution guidelines and commit style convention', done: false, completed: false },
      { id: 'c3', text: 'Update the markdown documentation example', done: false, completed: false },
      { id: 'c4', text: 'Check formatting using markdown linter', done: false, completed: false },
    ],
    isCuratedSample: true,
    source: 'Curated Ecosystem Catalogue',
  },
  {
    id: 'issue-flask-404',
    repoId: 'repo-flask',
    repository: 'pallets/flask',
    repoFullName: 'pallets/flask',
    repoUrl: 'https://github.com/pallets/flask',
    issueNumber: 4721,
    number: 4721,
    title: 'docs: Add quickstart note on CORS headers when building SPA backends with Flask',
    issueUrl: 'https://github.com/pallets/flask/issues/4721',
    labels: ['docs', 'good first issue'],
    technologies: ['Python', 'Flask', 'CORS', 'HTTP'],
    difficulty: 'intermediate',
    prerequisites: ['Python basics', 'Understanding of Cross-Origin Resource Sharing (CORS)'],
    originalDescription:
      'First-time developers building React/Vue SPAs with Flask backends frequently run into CORS blocked errors. Add a brief FAQ note pointing to flask-cors in the deployment/quickstart guide.',
    body:
      'First-time developers building React/Vue SPAs with Flask backends frequently run into CORS blocked errors. Add a brief FAQ note pointing to flask-cors in the deployment/quickstart guide.',
    aiExplanation:
      'Frontend apps running on port 3000 cannot talk to Flask on port 5000 without CORS headers enabled. You will add a helpful FAQ pointer in Flask documentation explaining how to enable CORS.',
    preparationChecklist: [
      { id: 'c1', text: 'Fork pallets/flask and setup Python virtual environment', done: false, completed: false },
      { id: 'c2', text: 'Install documentation requirements (`pip install -r requirements/docs.txt`)', done: false, completed: false },
      { id: 'c3', text: 'Edit the tutorial/quickstart documentation file', done: false, completed: false },
      { id: 'c4', text: 'Build HTML docs locally with `make -C docs html`', done: false, completed: false },
    ],
    zheroChecklist: [
      { id: 'c1', text: 'Fork pallets/flask and setup Python virtual environment', done: false, completed: false },
      { id: 'c2', text: 'Install documentation requirements (`pip install -r requirements/docs.txt`)', done: false, completed: false },
      { id: 'c3', text: 'Edit the tutorial/quickstart documentation file', done: false, completed: false },
      { id: 'c4', text: 'Build HTML docs locally with `make -C docs html`', done: false, completed: false },
    ],
    isCuratedSample: true,
    source: 'Curated Ecosystem Catalogue',
  },
];

class GithubHubService {
  constructor() {
    this.memoryProfile = null;
    this.memoryContributions = [];
  }

  // --- Profile Validation & Management ---

  // Validates username syntax: 1-39 alphanumeric chars or hyphens, no leading/trailing hyphen
  validateGithubUsername(input) {
    if (!input || typeof input !== 'string') {
      return { valid: false, error: 'GitHub username or profile URL is required.' };
    }

    let username = input.trim();

    // Support full profile URLs: https://github.com/username
    if (username.startsWith('http://') || username.startsWith('https://')) {
      try {
        const url = new URL(username);
        if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') {
          return { valid: false, error: 'URL must be a valid github.com profile link.' };
        }
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length === 0) {
          return { valid: false, error: 'GitHub profile URL must include a username.' };
        }
        username = parts[0];
      } catch {
        return { valid: false, error: 'Invalid URL format.' };
      }
    }

    // Strip leading @ if entered
    if (username.startsWith('@')) {
      username = username.slice(1);
    }

    // GitHub username regex standard
    const ghRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (!ghRegex.test(username)) {
      return {
        valid: false,
        error: 'Invalid GitHub username. Usernames may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen (max 39 characters).',
      };
    }

    return { valid: true, username };
  }

  // Validate GitHub Pull Request URL
  validateGithubPrUrl(url) {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'Pull request URL is required.' };
    }
    const trimmed = url.trim();
    const prRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/pull\/[0-9]+$/;
    if (!prRegex.test(trimmed)) {
      return {
        valid: false,
        error: 'Invalid GitHub Pull Request URL. Must follow format: https://github.com/owner/repo/pull/123',
      };
    }
    return { valid: true, url: trimmed };
  }

  // Validate GitHub Issue URL
  validateGithubIssueUrl(url) {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'Issue URL is required.' };
    }
    const trimmed = url.trim();
    const issueRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/issues\/[0-9]+$/;
    if (!issueRegex.test(trimmed)) {
      return {
        valid: false,
        error: 'Invalid GitHub Issue URL. Must follow format: https://github.com/owner/repo/issues/123',
      };
    }
    return { valid: true, url: trimmed };
  }

  getGithubProfile() {
    if (typeof window === 'undefined') return this.memoryProfile;
    try {
      const data = localStorage.getItem(GITHUB_HUB_STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  connectGithubProfile(input) {
    const check = this.validateGithubUsername(input);
    if (!check.valid) {
      throw new Error(check.error);
    }

    const username = check.username;
    const profile = {
      username,
      profileUrl: `https://github.com/${username}`,
      avatarUrl: `https://github.com/${username}.png`,
      connectedAt: new Date().toISOString(),
      connectionType: 'public_link', // 'public_link' vs 'oauth_authenticated'
      isOAuthAuthenticated: false,
      note: 'Linked via public GitHub profile. Full OAuth token integration will be supported with backend release.',
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(GITHUB_HUB_STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      window.dispatchEvent(new Event('zhero_github_updated'));
    } else {
      this.memoryProfile = profile;
    }

    return {
      ...profile,
      method: 'manual_link',
      isOauthAuthenticated: false,
    };
  }

  disconnectGithubProfile() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GITHUB_HUB_STORAGE_KEYS.PROFILE);
      window.dispatchEvent(new Event('zhero_github_updated'));
    } else {
      this.memoryProfile = null;
    }
    return true;
  }

  // --- Curated Repositories & Recommendations ---
  getAllRepositories() {
    return CURATED_REPOSITORIES;
  }

  getRepositories(filters = {}) {
    let list = [...CURATED_REPOSITORIES];
    if (filters.category) {
      const catLower = filters.category.toLowerCase();
      list = list.filter((r) => r.category && r.category.toLowerCase().includes(catLower));
    }
    if (filters.language) {
      const langLower = filters.language.toLowerCase();
      list = list.filter((r) => r.language && r.language.toLowerCase() === langLower);
    }
    if (filters.beginnerFriendly !== undefined) {
      list = list.filter((r) => r.beginnerFriendly === filters.beginnerFriendly);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.fullName.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getRepository(repoId) {
    if (!repoId) return null;
    return CURATED_REPOSITORIES.find((r) => r.id === repoId || r.fullName === repoId || r.name === repoId) || null;
  }

  getIssuesForRepository(repoId) {
    if (!repoId) return [];
    return CURATED_ISSUES.filter((i) => i.repoId === repoId || i.repository === repoId);
  }

  getAllIssues() {
    return CURATED_ISSUES;
  }

  getIssues(filters = {}) {
    return CURATED_ISSUES;
  }

  getIssue(issueId) {
    if (!issueId) return null;
    return CURATED_ISSUES.find((i) => i.id === issueId || i.number === issueId || i.issueNumber === issueId) || null;
  }

  // Recommends repositories matched to the student's career interest
  getRecommendedRepositories(userCareerId = 'full-stack-engineer') {
    return CURATED_REPOSITORIES.filter(
      (r) => !userCareerId || (r.careerAlignment && r.careerAlignment.includes(userCareerId))
    );
  }

  // --- Contribution Workspaces & Tracking ---
  getContributions() {
    let rawList = [];
    if (typeof window === 'undefined') {
      rawList = this.memoryContributions || [];
    } else {
      try {
        const data = localStorage.getItem(GITHUB_HUB_STORAGE_KEYS.CONTRIBUTIONS);
        rawList = data ? JSON.parse(data) : [];
        if (!Array.isArray(rawList)) rawList = [];
      } catch {
        rawList = [];
      }
    }

    // Normalise properties for backward compatibility across UI and tests
    return rawList.map((c) => {
      const checklist = (c.checklist || c.preparationChecklist || []).map((item) => ({
        ...item,
        completed: item.completed !== undefined ? item.completed : item.done || false,
        done: item.done !== undefined ? item.done : item.completed || false,
      }));
      return {
        ...c,
        repository: c.repository || c.repoFullName || 'open-source/project',
        repoFullName: c.repoFullName || c.repository || 'open-source/project',
        evidenceStatus: c.evidenceStatus || c.provenance || 'self_reported',
        provenance: c.provenance || c.evidenceStatus || 'self_reported',
        checklist,
        preparationChecklist: checklist,
        skillsPractised: c.skillsPractised || c.technologies || [],
        technologies: c.technologies || c.skillsPractised || [],
      };
    });
  }

  saveContributions(list) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GITHUB_HUB_STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(list));
      window.dispatchEvent(new Event('zhero_github_updated'));
    } else {
      this.memoryContributions = list;
    }
    return list;
  }

  getContribution(id) {
    const list = this.getContributions();
    return list.find((c) => c.id === id) || null;
  }

  // Create a new contribution workspace
  createContribution(payload = {}) {
    const {
      issueId,
      repoId,
      repository,
      repoUrl,
      issueNumber,
      issueTitle,
      issueUrl,
      objective,
      skillsPractised,
      technologies,
      notes = '',
      personalNotes = '',
      targetDate = '',
      status = 'interested',
    } = payload;

    const issue = this.getIssue(issueId);
    const repo =
      this.getRepository(repoId) ||
      this.getRepository(repository) ||
      (issue ? this.getRepository(issue.repoId) : null);

    const now = new Date().toISOString();
    const id = `contrib-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const initialChecklist = (
      issue?.preparationChecklist || [
        { id: 'c1', text: 'Fork repository and clone locally', done: false, completed: false },
        { id: 'c2', text: 'Read CONTRIBUTING.md instructions', done: false, completed: false },
        { id: 'c3', text: 'Create git feature branch', done: false, completed: false },
        { id: 'c4', text: 'Run local test suite and verify build', done: false, completed: false },
      ]
    ).map((item) => ({
      ...item,
      done: item.done || false,
      completed: item.completed !== undefined ? item.completed : item.done || false,
    }));

    const newContrib = {
      id,
      repoId: repo?.id || repoId || 'custom-repo',
      repoFullName: repository || repo?.fullName || 'open-source/project',
      repository: repository || repo?.fullName || 'open-source/project',
      repoUrl: repoUrl || repo?.url || 'https://github.com',
      issueId: issue?.id || issueId || null,
      issueTitle: issueTitle || issue?.title || objective || 'Open-Source Contribution Task',
      objective: objective || issueTitle || issue?.title || 'Open-Source Contribution Task',
      issueUrl: issueUrl || issue?.issueUrl || '',
      issueNumber: issueNumber || issue?.number || null,
      technologies: skillsPractised || technologies || issue?.technologies || [repo?.language || 'Code'],
      skillsPractised: skillsPractised || technologies || issue?.technologies || [repo?.language || 'Code'],
      status: status || 'interested',
      provenance: 'self_reported',
      evidenceStatus: 'self_reported',
      prUrl: '',
      notes: notes || personalNotes || '',
      personalNotes: personalNotes || notes || '',
      reviewFeedback: '',
      addressedChanges: '',
      reflection: '',
      checklist: initialChecklist,
      preparationChecklist: initialChecklist,
      createdAt: now,
      lastUpdated: now,
      targetDate: targetDate || '',
      isVerified: false,
      verifiedMerged: false,
    };

    const list = this.getContributions();
    list.unshift(newContrib);
    this.saveContributions(list);
    return newContrib;
  }

  // Toggle checklist item
  toggleChecklistItem(contribId, checklistItemId) {
    const list = this.getContributions();
    const index = list.findIndex((c) => c.id === contribId);
    if (index === -1) return null;

    const item = list[index];
    const updatedChecklist = (item.checklist || item.preparationChecklist || []).map((c) => {
      if (c.id === checklistItemId) {
        const nextState = !c.completed;
        return { ...c, completed: nextState, done: nextState };
      }
      return c;
    });

    return this.updateContribution(contribId, {
      checklist: updatedChecklist,
      preparationChecklist: updatedChecklist,
    });
  }

  // Update contribution record with URL validation and evidence provenance
  updateContribution(id, updates = {}) {
    const list = this.getContributions();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const current = list[index];

    // If PR URL is updated, validate format
    if (updates.prUrl !== undefined && updates.prUrl !== '') {
      const prCheck = this.validateGithubPrUrl(updates.prUrl);
      if (!prCheck.valid) {
        throw new Error(prCheck.error);
      }
    }

    // Determine evidence provenance tier honestly
    let updatedProvenance = current.provenance || current.evidenceStatus || 'self_reported';
    const finalPrUrl = updates.prUrl !== undefined ? updates.prUrl : current.prUrl;
    const finalStatus = updates.status !== undefined ? updates.status : current.status;

    if (current.isVerified || updates.isVerified) {
      updatedProvenance = finalStatus === 'merged' ? 'merged' : 'verified_evidence';
    } else if (finalPrUrl && finalPrUrl.trim().length > 0) {
      updatedProvenance = 'link_checked';
    } else if (current.issueUrl) {
      updatedProvenance = 'link_provided';
    } else {
      updatedProvenance = 'self_reported';
    }

    const updatedRecord = {
      ...current,
      ...updates,
      provenance: updatedProvenance,
      evidenceStatus: updatedProvenance,
      lastUpdated: new Date().toISOString(),
    };

    if (updates.preparationChecklist) {
      updatedRecord.checklist = updates.preparationChecklist;
    }
    if (updates.checklist) {
      updatedRecord.preparationChecklist = updates.checklist;
    }

    list[index] = updatedRecord;
    this.saveContributions(list);
    return updatedRecord;
  }

  // Record verified evidence from independent check or API webhook
  recordVerifiedEvidence(id, verificationData = {}) {
    return this.updateContribution(id, {
      isVerified: true,
      verifiedMerged: !!verificationData.verifiedMerged,
      status: verificationData.verifiedMerged ? 'merged' : undefined,
      commitSha: verificationData.commitSha || '',
      mergedAt: verificationData.mergedAt || new Date().toISOString(),
      verifiedBy: verificationData.verifiedBy || 'independent_verification',
      provenance: verificationData.verifiedMerged ? 'merged' : 'verified_evidence',
      evidenceStatus: verificationData.verifiedMerged ? 'merged' : 'verified_evidence',
    });
  }

  // Archive / Abandon contribution without losing history
  abandonContribution(id, reason = 'Paused to focus on coursework') {
    return this.updateContribution(id, {
      status: 'abandoned',
      notes: reason ? `${reason}` : 'Archived',
    });
  }

  // --- Summary Metrics (Honest, 0 when no records exist) ---
  getContributionMetrics() {
    const list = this.getContributions();
    const inProgress = list.filter((c) =>
      ['interested', 'preparing', 'ready_to_start', 'work_in_progress', 'changes_requested'].includes(c.status)
    ).length;

    const prSubmitted = list.filter((c) => c.status === 'pr_submitted').length;
    // Merged is ONLY counted when independently confirmed / verifiedMerged
    const merged = list.filter((c) => c.status === 'merged' && (c.isVerified || c.verifiedMerged)).length;
    const verifiedEvidence = list.filter((c) => c.isVerified || c.provenance === 'verified_evidence' || c.provenance === 'merged').length;

    return {
      totalTracked: list.length,
      inProgress,
      prSubmitted,
      merged,
      verifiedEvidence,
    };
  }

  // --- Portfolio Projection ---
  // Returns contribution records eligible for the student's portfolio with explicit evidence provenance
  getPortfolioContributions() {
    const list = this.getContributions();
    return list.filter((c) =>
      ['pr_submitted', 'merged', 'work_in_progress', 'changes_requested', 'interested', 'preparing'].includes(c.status)
    );
  }
}

export const githubHubService = new GithubHubService();

export function validateGithubUsername(input) {
  return githubHubService.validateGithubUsername(input);
}

export function validateGithubPrUrl(url) {
  return githubHubService.validateGithubPrUrl(url);
}

export function validateGithubIssueUrl(url) {
  return githubHubService.validateGithubIssueUrl(url);
}

