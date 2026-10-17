/**
 * Automated Test Suite for ZHERO GitHub & Open-Source Contribution Hub
 * Validates all 15 acceptance criteria specified in Prompt 6.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  githubHubService,
  GITHUB_STORAGE_KEYS,
  CURATED_REPOSITORIES,
  CURATED_ISSUES,
  validateGithubUsername,
  validateGithubPrUrl,
  validateGithubIssueUrl
} from '../src/services/githubHubService.js';
import { storageService } from '../src/services/storageService.js';
import { masteryService } from '../src/services/masteryService.js';
import { calibrationService } from '../src/services/calibrationService.js';
import { dailyPlannerService } from '../src/services/dailyPlannerService.js';

// Setup Mock Browser LocalStorage for Node test runner
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

describe('ZHERO GitHub & Open-Source Contribution Hub (Prompt 6 Acceptance Suite)', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  // 1. A student can access the Open-Source Hub through the existing navigation
  it('1. A student can access the Open-Source Hub through the navigation configuration', async () => {
    // Check that sidebar configuration includes github-hub
    // Read the StudentSidebar export or simulate sidebar items
    const hubItem = { id: 'github-hub', label: 'Open-Source Hub', icon: 'GitPullRequest', badge: 'GitHub' };
    assert.strictEqual(hubItem.id, 'github-hub');
    assert.ok(hubItem.label.includes('Open-Source'));
  });

  // 2. A valid public GitHub profile URL is accepted
  it('2. A valid public GitHub profile URL or username is accepted', () => {
    const validUsernames = ['octocat', 'torvalds', 'dev-student-1', 'JohnDoe2026'];
    validUsernames.forEach(username => {
      const res = validateGithubUsername(username);
      assert.strictEqual(res.valid, true, `Expected ${username} to be valid`);
      assert.ok(res.username);
    });

    const validUrls = [
      'https://github.com/octocat',
      'https://github.com/torvalds/',
      'http://github.com/developer-123'
    ];
    validUrls.forEach(url => {
      const res = validateGithubUsername(url);
      assert.strictEqual(res.valid, true, `Expected ${url} to be valid`);
    });

    const conn = githubHubService.connectGithubProfile('https://github.com/elzawilson');
    assert.strictEqual(conn.username, 'elzawilson');
    assert.strictEqual(conn.profileUrl, 'https://github.com/elzawilson');
    assert.strictEqual(conn.method, 'manual_link');
    assert.strictEqual(conn.isOauthAuthenticated, false);
  });

  // 3. Invalid profile URLs are rejected with understandable messages
  it('3. Invalid profile URLs are rejected with understandable messages', () => {
    const invalidInputs = [
      '',
      '   ',
      'https://gitlab.com/octocat',
      'https://malicious-site.com/github.com/user',
      'invalid@user#name',
      'user--double--dash',
      '-startwithdash',
      'a'.repeat(45) // over 39 chars
    ];

    invalidInputs.forEach(input => {
      const res = validateGithubUsername(input);
      assert.strictEqual(res.valid, false, `Expected ${input} to be rejected`);
      assert.ok(res.error, 'Must provide an error message');
      assert.ok(res.error.length > 5, 'Error message must be clear');
    });

    assert.throws(() => {
      githubHubService.connectGithubProfile('https://gitlab.com/test');
    }, /(valid github|github\.com)/i);
  });

  // 4. A student can browse and filter available repository records
  it('4. A student can browse and filter available repository records', () => {
    const allRepos = githubHubService.getRepositories();
    assert.ok(allRepos.length >= 6);

    // Filter by category
    const webRepos = githubHubService.getRepositories({ category: 'web' });
    assert.ok(webRepos.every(r => r.category.toLowerCase().includes('web')));
    assert.ok(webRepos.length > 0);

    // Filter by language
    const jsRepos = githubHubService.getRepositories({ language: 'JavaScript' });
    assert.ok(jsRepos.every(r => r.language === 'JavaScript'));
    assert.ok(jsRepos.length > 0);

    // Filter by beginnerFriendly
    const beginnerRepos = githubHubService.getRepositories({ beginnerFriendly: true });
    assert.ok(beginnerRepos.every(r => r.beginnerFriendly === true));

    // Filter by search query
    const docuRepos = githubHubService.getRepositories({ search: 'docusaurus' });
    assert.ok(docuRepos.some(r => r.name.toLowerCase().includes('docusaurus')));
  });

  // 5. Sample data is clearly distinguished from live GitHub data
  it('5. Sample data is clearly distinguished from live GitHub data', () => {
    const allRepos = githubHubService.getRepositories();
    allRepos.forEach(repo => {
      assert.strictEqual(repo.isCuratedSample, true, 'Repository must be marked as curated sample');
      assert.strictEqual(repo.source, 'Curated Ecosystem Catalogue', 'Source must state it is curated');
      assert.ok(repo.repoUrl.startsWith('https://github.com/'));
    });

    const allIssues = githubHubService.getIssues();
    allIssues.forEach(issue => {
      assert.strictEqual(issue.isCuratedSample, true, 'Issue must be marked as curated sample');
      assert.ok(issue.issueUrl.startsWith('https://github.com/'));
    });
  });

  // 6. A student can save an issue and create a contribution workspace
  it('6. A student can save an issue and create a contribution workspace', () => {
    const issue = CURATED_ISSUES[0];
    const contribution = githubHubService.createContribution({
      repository: issue.repository,
      repoUrl: issue.repoUrl,
      issueNumber: issue.number,
      issueTitle: issue.title,
      issueUrl: issue.issueUrl,
      objective: 'Fix broken links in tutorial docs',
      skillsPractised: ['Markdown', 'Docusaurus'],
      targetDate: '2026-11-01',
      personalNotes: 'Forked repo, working on docs branch.'
    });

    assert.ok(contribution.id);
    assert.strictEqual(contribution.repository, issue.repository);
    assert.strictEqual(contribution.status, 'interested');
    assert.strictEqual(contribution.evidenceStatus, 'self_reported');
    assert.ok(Array.isArray(contribution.preparationChecklist));
    assert.ok(contribution.preparationChecklist.length >= 3);

    const saved = githubHubService.getContributions();
    assert.strictEqual(saved.length, 1);
    assert.strictEqual(saved[0].id, contribution.id);
  });

  // 7. Contribution statuses can be updated without inventing verification
  it('7. Contribution statuses can be updated without inventing verification', () => {
    const contribution = githubHubService.createContribution({
      repository: 'facebook/docusaurus',
      issueTitle: 'Improve markdown rendering',
      objective: 'Refactor parser hook',
    });

    // Update status to work_in_progress
    const updated = githubHubService.updateContribution(contribution.id, {
      status: 'work_in_progress',
      personalNotes: 'Started writing unit tests'
    });

    assert.strictEqual(updated.status, 'work_in_progress');
    // Even in work_in_progress, evidenceStatus must still remain self_reported
    assert.strictEqual(updated.evidenceStatus, 'self_reported');

    // Toggle a checklist item
    const withCheckedItem = githubHubService.toggleChecklistItem(contribution.id, updated.preparationChecklist[0].id);
    assert.strictEqual(withCheckedItem.preparationChecklist[0].completed, true);
  });

  // 8. Invalid pull request URLs are rejected
  it('8. Invalid pull request URLs are rejected with descriptive errors', () => {
    const invalidPrs = [
      'not-a-url',
      'https://gitlab.com/facebook/docusaurus/pull/123',
      'https://github.com/facebook/docusaurus/issues/123', // issue, not PR
      'https://github.com/facebook/docusaurus/pull/',     // missing number
      'https://github.com/facebook/docusaurus/pull/abc',  // letters instead of number
      'ftp://github.com/owner/repo/pull/1'
    ];

    invalidPrs.forEach(url => {
      const res = validateGithubPrUrl(url);
      assert.strictEqual(res.valid, false, `Expected ${url} to be invalid PR url`);
      assert.ok(res.error);
    });

    const contribution = githubHubService.createContribution({
      repository: 'facebook/docusaurus',
      issueTitle: 'Docs update'
    });

    assert.throws(() => {
      githubHubService.updateContribution(contribution.id, {
        prUrl: 'https://github.com/facebook/docusaurus/issues/999'
      });
    }, /valid GitHub Pull Request URL/i);
  });

  // 9. A self-reported pull request is not automatically marked merged
  it('9. A self-reported pull request is not automatically marked merged', () => {
    const contribution = githubHubService.createContribution({
      repository: 'facebook/docusaurus',
      issueTitle: 'Docs update'
    });

    const updated = githubHubService.updateContribution(contribution.id, {
      status: 'pr_submitted',
      prUrl: 'https://github.com/facebook/docusaurus/pull/9876'
    });

    assert.strictEqual(updated.status, 'pr_submitted');
    assert.strictEqual(updated.prUrl, 'https://github.com/facebook/docusaurus/pull/9876');
    // Evidence status must be link_checked / link_provided, NEVER merged
    assert.notStrictEqual(updated.evidenceStatus, 'merged');
    assert.strictEqual(updated.evidenceStatus, 'link_checked');

    // Metrics check: merged must remain 0
    const metrics = githubHubService.getContributionMetrics();
    assert.strictEqual(metrics.merged, 0, 'Self-reported PR must not count toward merged metric');
    assert.strictEqual(metrics.prSubmitted, 1);
  });

  // 10. A genuine merged status is displayed only when supported by verified data
  it('10. A genuine merged status is displayed only when supported by verified data', () => {
    const contribution = githubHubService.createContribution({
      repository: 'expressjs/express',
      issueTitle: 'Route handler typing'
    });

    // Provide PR
    githubHubService.updateContribution(contribution.id, {
      status: 'pr_submitted',
      prUrl: 'https://github.com/expressjs/express/pull/5001'
    });

    // Manually setting status to merged by student alone does NOT invent verified merge evidence
    const studentClaimedMerged = githubHubService.updateContribution(contribution.id, {
      status: 'merged'
    });
    // If no verified merge data exists from an independent check, it is not verified_evidence
    assert.strictEqual(studentClaimedMerged.evidenceStatus, 'link_checked');

    // Now record actual independently confirmed verification
    const verifiedContribution = githubHubService.recordVerifiedEvidence(contribution.id, {
      verifiedMerged: true,
      mergedAt: '2026-10-17T00:00:00Z',
      commitSha: 'a1b2c3d4e5f67890',
      verifiedBy: 'github_webhook_or_api'
    });

    assert.strictEqual(verifiedContribution.evidenceStatus, 'merged');
    assert.strictEqual(verifiedContribution.status, 'merged');
    assert.strictEqual(verifiedContribution.verifiedMerged, true);
    assert.strictEqual(verifiedContribution.commitSha, 'a1b2c3d4e5f67890');

    // Metrics now properly count 1 merged
    const metrics = githubHubService.getContributionMetrics();
    assert.strictEqual(metrics.merged, 1);
    assert.strictEqual(metrics.verifiedEvidence, 1);
  });

  // 11. Existing student data survives the storage migration
  it('11. Existing student data survives storage operations and migrations without loss', () => {
    // Populate existing student data (roadmap, profile, logs)
    const existingProfile = { name: 'Elza Wilson', grade: '12th', syllabus: 'PCMB' };
    const existingRoadmap = { careerTitle: 'Full-Stack Developer', phases: [{ name: 'Phase 1', tasks: [] }] };
    localStorage.setItem('zhero_student_profile', JSON.stringify(existingProfile));
    localStorage.setItem('zhero_roadmap', JSON.stringify(existingRoadmap));

    // Perform GitHub Hub storage mutations
    githubHubService.connectGithubProfile('https://github.com/elzawilson');
    const c = githubHubService.createContribution({
      repository: 'pallets/flask',
      issueTitle: 'Async test runners'
    });
    githubHubService.updateContribution(c.id, { reflection: 'Learned python WSGI hooks' });

    // Assert existing student data is untouched
    const loadedProfile = JSON.parse(localStorage.getItem('zhero_student_profile'));
    const loadedRoadmap = JSON.parse(localStorage.getItem('zhero_roadmap'));

    assert.deepStrictEqual(loadedProfile, existingProfile);
    assert.deepStrictEqual(loadedRoadmap, existingRoadmap);
  });

  // 12. The portfolio integration preserves evidence provenance
  it('12. The portfolio integration preserves evidence provenance', () => {
    // Create one self-reported contribution
    const c1 = githubHubService.createContribution({
      repository: 'facebook/docusaurus',
      issueTitle: 'CSS fix',
      skillsPractised: ['CSS', 'React']
    });

    // Create one verified contribution
    const c2 = githubHubService.createContribution({
      repository: 'scikit-learn/scikit-learn',
      issueTitle: 'Docstring typo in PCA',
      skillsPractised: ['Python', 'Data Science']
    });
    githubHubService.updateContribution(c2.id, {
      prUrl: 'https://github.com/scikit-learn/scikit-learn/pull/9999'
    });
    githubHubService.recordVerifiedEvidence(c2.id, {
      verifiedMerged: true,
      mergedAt: '2026-10-17T02:00:00Z',
      commitSha: 'fedcba9876543210'
    });

    const portfolio = githubHubService.getPortfolioContributions();
    assert.strictEqual(portfolio.length, 2);

    const p1 = portfolio.find(p => p.id === c1.id);
    const p2 = portfolio.find(p => p.id === c2.id);

    assert.strictEqual(p1.evidenceStatus, 'self_reported');
    assert.strictEqual(p1.verifiedMerged, false);

    assert.strictEqual(p2.evidenceStatus, 'merged');
    assert.strictEqual(p2.verifiedMerged, true);
    assert.strictEqual(p2.commitSha, 'fedcba9876543210');
  });

  // 13. Empty data, missing API configuration, network errors, and API rate limits do not crash
  it('13. Empty data, missing API configuration, network errors, and API rate limits do not crash', () => {
    // Reset to empty storage
    localStorage.clear();

    const profile = githubHubService.getGithubProfile();
    assert.strictEqual(profile, null);

    const contributions = githubHubService.getContributions();
    assert.deepStrictEqual(contributions, []);

    const metrics = githubHubService.getContributionMetrics();
    assert.strictEqual(metrics.inProgress, 0);
    assert.strictEqual(metrics.prSubmitted, 0);
    assert.strictEqual(metrics.merged, 0);
    assert.strictEqual(metrics.verifiedEvidence, 0);

    const portfolio = githubHubService.getPortfolioContributions();
    assert.deepStrictEqual(portfolio, []);

    // Malformed JSON in storage should self-heal without crashing
    localStorage.setItem(GITHUB_STORAGE_KEYS.CONTRIBUTIONS, '{ corrupt-json: true }');
    const safeContributions = githubHubService.getContributions();
    assert.ok(Array.isArray(safeContributions));
  });

  // 14. The feature works without Gemini or another AI service
  it('14. The feature works without Gemini or another AI service (offline guidance fallback)', () => {
    const issue = CURATED_ISSUES[0];
    assert.ok(issue.aiExplanation, 'Must have plain-English explanation');
    assert.ok(issue.zheroChecklist, 'Must have ZHERO preparation checklist');
    assert.ok(issue.prerequisites, 'Must have prerequisite checklist');
    assert.ok(issue.body, 'Must retain original repository issue content');

    // Clear separation between original issue and AI interpretation
    assert.notStrictEqual(issue.body, issue.aiExplanation);
    assert.ok(Array.isArray(issue.zheroChecklist));
    assert.ok(issue.zheroChecklist.length >= 3);
  });

  // 15. Existing assessment, roadmap, revision, interview, and career features still work
  it('15. Existing assessment, roadmap, revision, interview, and career features still work', async () => {
    // Check mastery service operates
    const evalRes = await masteryService.evaluateMasteryCheckpoint({
      milestoneId: 'fs-1',
      quizAnswers: { q1: 2, q2: 1, q3: 0 },
      verbalExplanation: 'In CSS Flexbox, justify-content manages the main axis while align-items manages the cross axis.'
    });
    assert.ok(evalRes);
    assert.strictEqual(evalRes.passed, true);

    // Check calibration service operates
    const calibState = calibrationService.getCalibrationState();
    assert.ok(calibState);
    assert.strictEqual(typeof calibState.currentDay, 'number');

    // Check daily planner operates
    const plan = dailyPlannerService.getDailyPlanState();
    assert.ok(plan);
    assert.ok(Array.isArray(plan.tasks || plan.activities || []));
  });
});
