import React, { useState, useEffect } from 'react';
import {
  GitPullRequest,
  GitBranch,
  CheckCircle2,
  ExternalLink,
  Search,
  ShieldCheck,
  Plus,
  X
} from 'lucide-react';
import {
  githubHubService,
} from '../services/githubHubService';

export function OpenSourceHubPage({ userProfile: _userProfile, activeRoadmap, onNavigate: _onNavigate }) {
  const [profile, setProfile] = useState(() => githubHubService.getGithubProfile());
  const [githubInput, setGithubInput] = useState('');
  const [connectError, setConnectError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Active Tab: 'explore' | 'workspaces' | 'portfolio'
  const [activeTab, setActiveTab] = useState('explore');

  // Filters
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyRecommended, setOnlyRecommended] = useState(false);

  // Selected Issue for Modal Drawer
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Workspaces state
  const [contributions, setContributions] = useState(() => githubHubService.getContributions());
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);

  // Sync state
  useEffect(() => {
    const handleSync = () => {
      setProfile(githubHubService.getGithubProfile());
      setContributions(githubHubService.getContributions());
    };
    window.addEventListener('zhero_github_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('zhero_github_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const notify = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleConnectProfile = (e) => {
    e.preventDefault();
    setConnectError('');
    try {
      const p = githubHubService.connectGithubProfile(githubInput);
      setProfile(p);
      setGithubInput('');
      notify(`GitHub profile linked: @${p.username}`);
    } catch (err) {
      setConnectError(err.message);
    }
  };

  const handleDisconnect = () => {
    githubHubService.disconnectGithubProfile();
    setProfile(null);
    notify('GitHub profile disconnected.');
  };

  const handleStartContribution = (issue) => {
    const newContrib = githubHubService.createContribution({
      issueId: issue.id,
      repoId: issue.repoId,
    });
    setContributions(githubHubService.getContributions());
    setActiveWorkspaceId(newContrib.id);
    setActiveTab('workspaces');
    setSelectedIssue(null);
    notify(`Created contribution workspace for "${issue.title.slice(0, 35)}..."`);
  };

  const handleToggleChecklistItem = (contribId, itemIdx) => {
    const contrib = githubHubService.getContribution(contribId);
    if (!contrib) return;

    const checklist = [...contrib.checklist];
    checklist[itemIdx].done = !checklist[itemIdx].done;

    githubHubService.updateContribution(contribId, { checklist });
    setContributions(githubHubService.getContributions());
  };

  const handleUpdateStatus = (contribId, newStatus) => {
    try {
      githubHubService.updateContribution(contribId, { status: newStatus });
      setContributions(githubHubService.getContributions());
      notify(`Status updated to "${newStatus.replace('_', ' ')}"`);
    } catch (err) {
      notify(err.message);
    }
  };

  const handleSavePrUrl = (contribId, prUrl) => {
    try {
      githubHubService.updateContribution(contribId, { prUrl });
      setContributions(githubHubService.getContributions());
      notify('Pull Request link saved and validated.');
    } catch (err) {
      notify(err.message);
    }
  };

  const handleSaveNotes = (contribId, notes, reflection, reviewFeedback) => {
    githubHubService.updateContribution(contribId, { notes, reflection, reviewFeedback });
    setContributions(githubHubService.getContributions());
    notify('Workspace notes updated.');
  };

  // Metrics
  const metrics = githubHubService.getContributionMetrics();

  // Filtered Repositories
  const allRepos = githubHubService.getAllRepositories();
  const careerId = activeRoadmap?.careerId || 'full-stack-engineer';
  const filteredRepos = allRepos.filter((repo) => {
    const matchesLang = selectedLanguage === 'All' || repo.language === selectedLanguage;
    const matchesCat = selectedCategory === 'All' || repo.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      repo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRec = !onlyRecommended || (repo.careerAlignment && repo.careerAlignment.includes(careerId));
    return matchesLang && matchesCat && matchesSearch && matchesRec;
  });

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1150px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Toast */}
      {successToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#171717',
            color: '#FFFFFF',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #EAE7E2',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', margin: 0 }}>
              Open Source
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#77736F', marginTop: '0.25rem', maxWidth: '680px', lineHeight: '1.5' }}>
              Contribute to real repositories and build demonstrable proof of work.
            </p>
          </div>

          {/* GitHub Connection Badge / Action */}
          <div style={{ backgroundColor: '#F8F8F7', border: '1px solid #EAE7E2', borderRadius: '8px', padding: '1rem', minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <GitBranch size={20} color="#171717" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717' }}>
                  {profile ? `@${profile.username}` : 'GitHub Connection'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#77736F' }}>
                  {profile ? 'Public Profile Linked' : 'Not Connected'}
                </div>
              </div>
            </div>

            {profile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    color: '#FE6904',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <span>View GitHub Profile</span>
                  <ExternalLink size={12} />
                </a>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  style={{
                    background: 'none',
                    border: '1px solid #EAE7E2',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    color: '#77736F',
                    cursor: 'pointer',
                  }}
                >
                  Disconnect Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleConnectProfile} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Username or https://github.com/..."
                  value={githubInput}
                  onChange={(e) => setGithubInput(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
                {connectError && (
                  <div style={{ fontSize: '0.72rem', color: '#171717', lineHeight: '1.3' }}>
                    {connectError}
                  </div>
                )}
                <button
                  type="submit"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#171717',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Link Public Profile
                </button>
                <div style={{ fontSize: '0.68rem', color: '#77736F', marginTop: '2px' }}>
                  Transparent MVP: Links public profile without asking for passwords. OAuth write tokens reserved for future backend.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 4 Summary Metrics (Zero when no evidence exists, no fabricated stats) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>In Progress</span>
            <GitBranch size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', marginTop: '0.5rem' }}>
            {metrics.inProgress}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#77736F' }}>Active Workspaces</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Pull Requests</span>
            <GitPullRequest size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', marginTop: '0.5rem' }}>
            {metrics.prSubmitted}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#77736F' }}>Submitted to GitHub</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Merged Contributions</span>
            <CheckCircle2 size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', marginTop: '0.5rem' }}>
            {metrics.merged}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 600 }}>Shipped Code</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Verified Portfolio Evidence</span>
            <ShieldCheck size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', marginTop: '0.5rem' }}>
            {metrics.verifiedEvidence}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#77736F' }}>Independently Validated</span>
        </div>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #EAE7E2', marginBottom: '2rem', gap: '2rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('explore')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 4px',
            border: 'none',
            borderBottom: activeTab === 'explore' ? '3px solid #FE6904' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'explore' ? '#FE6904' : '#77736F',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          <Search size={18} />
          <span>Explore Repositories & Issues</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('workspaces')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 4px',
            border: 'none',
            borderBottom: activeTab === 'workspaces' ? '3px solid #FE6904' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'workspaces' ? '#FE6904' : '#77736F',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          <GitBranch size={18} />
          <span>My Contribution Workspaces</span>
          {contributions.length > 0 && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: activeTab === 'workspaces' ? '#FFE5CE' : '#F8F8F7',
                color: activeTab === 'workspaces' ? '#FE6904' : '#77736F',
              }}
            >
              {contributions.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('portfolio')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 4px',
            border: 'none',
            borderBottom: activeTab === 'portfolio' ? '3px solid #FE6904' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'portfolio' ? '#FE6904' : '#77736F',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          <ShieldCheck size={18} />
          <span>Verified Portfolio Evidence</span>
        </button>
      </div>

      {/* TAB 1: EXPLORE REPOSITORIES & ISSUES */}
      {activeTab === 'explore' && (
        <div>
          {/* Filter Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #EAE7E2',
              padding: '1.25rem',
              marginBottom: '1.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 260px' }}>
              <Search size={18} color="#77736F" />
              <input
                type="text"
                placeholder="Search projects, topics (react, nodejs, python)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.875rem',
                  backgroundColor: 'transparent',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  backgroundColor: '#F8F8F7',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="All">All Languages</option>
                <option value="TypeScript">TypeScript</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  backgroundColor: '#F8F8F7',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="All">All Categories</option>
                <option value="Frontend & UI">Frontend & UI</option>
                <option value="Backend">Backend</option>
                <option value="Full-Stack">Full-Stack</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#171717', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={onlyRecommended}
                  onChange={(e) => setOnlyRecommended(e.target.checked)}
                />
                <span>Roadmap Aligned</span>
              </label>
            </div>
          </div>

          {/* Repositories Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filteredRepos.map((repo) => {
              const issues = githubHubService.getIssuesForRepository(repo.id);

              return (
                <div
                  key={repo.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #EAE7E2',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(23, 23, 23, 0.02)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <GitBranch size={16} color="#171717" />
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#171717' }}>
                          {repo.fullName}
                        </h3>
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#F8F8F7',
                          color: '#77736F',
                        }}
                      >
                        {repo.language}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 1rem', fontSize: '0.825rem', color: '#77736F', lineHeight: '1.4' }}>
                      {repo.description}
                    </p>

                    {/* Why recommended */}
                    <div
                      style={{
                        backgroundColor: '#FFE5CE',
                        border: '1px solid #FA9B2A',
                        borderRadius: '10px',
                        padding: '0.65rem 0.85rem',
                        marginBottom: '1rem',
                        fontSize: '0.75rem',
                        color: '#FE6904',
                      }}
                    >
                      <strong>Why this project:</strong> {repo.whyRecommended}
                    </div>

                    {/* Topics */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                      {repo.topics.map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#F8F8F7',
                            border: '1px solid #EAE7E2',
                            color: '#77736F',
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Issues List & Actions */}
                  <div>
                    <div style={{ borderTop: '1px solid #EAE7E2', paddingTop: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#171717', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Beginner-Friendly Issues ({issues.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {issues.map((issue) => (
                          <div
                            key={issue.id}
                            onClick={() => setSelectedIssue(issue)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              backgroundColor: '#F8F8F7',
                              border: '1px solid #EAE7E2',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                              #{issue.issueNumber}: {issue.title}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#FE6904', fontWeight: 600, flexShrink: 0 }}>
                              Inspect
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          color: '#77736F',
                          textDecoration: 'none',
                        }}
                      >
                        <span>GitHub Repo</span>
                        <ExternalLink size={12} />
                      </a>
                      <a
                        href={repo.issueTrackerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          color: '#FE6904',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <span>All Issues</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY CONTRIBUTION WORKSPACES */}
      {activeTab === 'workspaces' && (
        <div>
          {contributions.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px dashed #EAE7E2',
                padding: '3rem',
                textAlign: 'center',
              }}
            >
              <GitPullRequest size={36} color="#FE6904" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', color: '#171717' }}>
                No active contribution workspaces yet
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#77736F', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
                Explore open-source repositories and select a beginner-friendly issue to create your first step-by-step contribution workspace.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('explore')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#FE6904',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Browse Curated Issues
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {contributions.map((contrib) => (
                <div
                  key={contrib.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #EAE7E2',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(23, 23, 23, 0.02)',
                  }}
                >
                  {/* Top Bar: Repo, Title, Status & Provenance */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#77736F' }}>
                          {contrib.repoFullName}
                        </span>
                        {contrib.issueNumber && (
                          <span style={{ fontSize: '0.75rem', color: '#77736F' }}>#{contrib.issueNumber}</span>
                        )}
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            backgroundColor:
                              contrib.status === 'merged'
                                ? '#FFE5CE'
                                : contrib.status === 'pr_submitted'
                                ? '#F8F8F7'
                                : '#FFE5CE',
                            color:
                              contrib.status === 'merged'
                                ? '#171717'
                                : contrib.status === 'pr_submitted'
                                ? '#171717'
                                : '#171717',
                            textTransform: 'uppercase',
                          }}
                        >
                          {contrib.status.replace('_', ' ')}
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#F8F8F7',
                            color: '#77736F',
                          }}
                        >
                          Provenance: {contrib.provenance.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#171717' }}>
                        {contrib.issueTitle}
                      </h3>
                    </div>

                    {/* Status Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#171717' }}>Status:</label>
                      <select
                        value={contrib.status}
                        onChange={(e) => handleUpdateStatus(contrib.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: '1px solid #EAE7E2',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor: '#FFFFFF',
                          outline: 'none',
                        }}
                      >
                        <option value="preparing">Preparing</option>
                        <option value="ready_to_start">Ready to Start</option>
                        <option value="work_in_progress">Work in Progress</option>
                        <option value="pr_submitted">Pull Request Submitted</option>
                        <option value="changes_requested">Changes Requested</option>
                        <option value="merged">Merged</option>
                        <option value="closed_without_merge">Closed Without Merge</option>
                        <option value="abandoned">Archived / Paused</option>
                      </select>
                    </div>
                  </div>

                  {/* Step-by-Step Preparation Checklist */}
                  <div style={{ backgroundColor: '#F8F8F7', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#171717', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Preparation Checklist ({contrib.checklist.filter((c) => c.done).length} / {contrib.checklist.length} Completed)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {contrib.checklist.map((item, idx) => (
                        <label
                          key={item.id || idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.825rem',
                            color: item.done ? '#171717' : '#171717',
                            textDecoration: item.done ? 'line-through' : 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={item.done}
                            onChange={() => handleToggleChecklistItem(contrib.id, idx)}
                          />
                          <span>{item.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Pull Request Link & Evidence Verification */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                        Pull Request URL (GitHub):
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/owner/repo/pull/123"
                        defaultValue={contrib.prUrl}
                        onBlur={(e) => handleSavePrUrl(contrib.id, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #EAE7E2',
                          fontSize: '0.825rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div style={{ fontSize: '0.7rem', color: '#77736F', marginTop: '2px' }}>
                        Format: https://github.com/owner/repo/pull/123
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                        Maintainer Review Feedback:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Approved with comment; or requested test addition"
                        defaultValue={contrib.reviewFeedback}
                        onBlur={(e) => handleSaveNotes(contrib.id, contrib.notes, contrib.reflection, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #EAE7E2',
                          fontSize: '0.825rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  {/* Reflection on Learning */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                      Student Reflection (What did you learn from this contribution?):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Learned how Docusaurus configures responsive code blocks; practiced creating clean git pull requests..."
                      defaultValue={contrib.reflection}
                      onBlur={(e) => handleSaveNotes(contrib.id, contrib.notes, e.target.value, contrib.reviewFeedback)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #EAE7E2',
                        fontSize: '0.825rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        lineHeight: '1.4',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VERIFIED PORTFOLIO EVIDENCE */}
      {activeTab === 'portfolio' && (
        <div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #EAE7E2',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <ShieldCheck size={20} color="#FE6904" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#171717' }}>
                Open-Source Contribution Portfolio
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#77736F', lineHeight: '1.5' }}>
              Verifiable proof of work showcasing real open-source contributions. Each item displays its explicit evidence provenance so mentors and employers can distinguish self-reported links from independently verified merges.
            </p>
          </div>

          {githubHubService.getPortfolioContributions().length === 0 ? (
            <div
              style={{
                backgroundColor: '#F8F8F7',
                borderRadius: '16px',
                border: '1px dashed #EAE7E2',
                padding: '2.5rem',
                textAlign: 'center',
              }}
            >
              <GitBranch size={32} color="#77736F" style={{ margin: '0 auto 0.5rem' }} />
              <h4 style={{ margin: 0, fontSize: '1rem', color: '#171717' }}>No portfolio entries yet</h4>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.825rem', color: '#77736F' }}>
                Submit a pull request in your contribution workspaces to have it automatically projected onto your portfolio.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {githubHubService.getPortfolioContributions().map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #EAE7E2',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#77736F' }}>{item.repoFullName}</span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            backgroundColor: item.status === 'merged' ? '#FFE5CE' : '#F8F8F7',
                            color: item.status === 'merged' ? '#171717' : '#171717',
                          }}
                        >
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#171717' }}>
                        {item.issueTitle}
                      </h4>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: '#F8F8F7',
                          color: '#77736F',
                        }}
                      >
                        Evidence: {item.provenance.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {item.reflection && (
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.825rem', color: '#77736F', fontStyle: 'italic' }}>
                      "{item.reflection}"
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EAE7E2', paddingTop: '0.65rem' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {item.technologies.map((tech, idx) => (
                        <span key={idx} style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#F8F8F7', color: '#77736F' }}>
                          {tech}
                        </span>
                      ))}
                    </div>

                    {item.prUrl && (
                      <a
                        href={item.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.78rem',
                          color: '#FE6904',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <span>View Verified PR on GitHub</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ISSUE DETAIL DRAWER / MODAL */}
      {selectedIssue && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23, 23, 23, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #EAE7E2',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(23, 23, 23, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FE6904', textTransform: 'uppercase' }}>
                  Beginner-Friendly Issue #{selectedIssue.issueNumber}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#171717' }}>
                  {selectedIssue.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                style={{ background: '#F8F8F7', border: '1px solid #EAE7E2', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#171717' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Issue Description, Task Explanation and Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* 1. Original Issue Description */}
              <div style={{ backgroundColor: '#F8F8F7', borderRadius: '8px', padding: '1rem', border: '1px solid #EAE7E2' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                  Original issue description
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#77736F', lineHeight: '1.4' }}>
                  {selectedIssue.originalDescription}
                </p>
              </div>

              {/* 2. Plain-English Task Explanation */}
              <div style={{ backgroundColor: '#FFE5CE', borderRadius: '8px', padding: '1rem', border: '1px solid #EAE7E2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FE6904' }}>
                    Task explanation
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#171717', lineHeight: '1.4' }}>
                  {selectedIssue.aiExplanation}
                </p>
              </div>

              {/* 3. Preparation Checklist */}
              <div style={{ backgroundColor: '#F8F8F7', borderRadius: '8px', padding: '1rem', border: '1px solid #EAE7E2' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                  Contribution checklist
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedIssue.preparationChecklist.map((step) => (
                    <div key={step.id} style={{ fontSize: '0.8rem', color: '#FE6904' }}>
                      • {step.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a
                href={selectedIssue.issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#77736F',
                  textDecoration: 'none',
                }}
              >
                <span>Open on GitHub</span>
                <ExternalLink size={14} />
              </a>

              <button
                type="button"
                onClick={() => handleStartContribution(selectedIssue)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#FE6904',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(254, 105, 4, 0.25)',
                }}
              >
                <Plus size={16} />
                <span>Create Contribution Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
