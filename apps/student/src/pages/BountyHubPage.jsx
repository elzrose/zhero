import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Clock,
  AlertCircle,
  Code,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';
import { bountyHubService } from '../services/bountyHubService';

export function BountyHubPage({ onNavigate, userProfile, activeRoadmap }) {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'workspaces' | 'portfolio'
  const [bounties, setBounties] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [metrics, setMetrics] = useState({ inProgress: 0, submitted: 0, underReview: 0, completed: 0, verifiedEvidence: 0 });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedRewardType, setSelectedRewardType] = useState('all');
  const [showExpired, setShowExpired] = useState(false);

  // Modals & Active Drawer
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [activeWorkspaceBounty, setActiveWorkspaceBounty] = useState(null);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [submissionTargetId, setSubmissionTargetId] = useState(null);

  // Submission Form State
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [prUrl, setPrUrl] = useState('');
  const [writtenExplanation, setWrittenExplanation] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Workspace Note Auto-save state
  const [editingNotes, setEditingNotes] = useState({});

  const reloadData = () => {
    const list = bountyHubService.getBounties({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      rewardType: selectedRewardType,
      search: searchQuery,
      openOnly: !showExpired,
    });
    setBounties(list);

    const parts = bountyHubService.getParticipations();
    setParticipations(parts);

    const m = bountyHubService.getBountyMetrics();
    setMetrics(m);
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener('zhero_bounty_updated', handleUpdate);
    return () => window.removeEventListener('zhero_bounty_updated', handleUpdate);
  }, [selectedCategory, selectedDifficulty, selectedRewardType, searchQuery, showExpired]);

  const handleJoinChallenge = (bountyId) => {
    try {
      const part = bountyHubService.joinBounty(bountyId);
      reloadData();
      setActiveTab('workspaces');
      setActiveWorkspaceBounty(bountyId);
      setSelectedBounty(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleDeliverable = (partId, deliverableId) => {
    bountyHubService.toggleDeliverable(partId, deliverableId);
    reloadData();
  };

  const handleSaveNotes = (partId) => {
    const text = editingNotes[partId];
    if (text !== undefined) {
      bountyHubService.updateParticipation(partId, { implementationPlan: text });
      reloadData();
    }
  };

  const handleOpenSubmission = (partId) => {
    const part = participations.find((p) => p.id === partId);
    if (part) {
      setSubmissionTargetId(partId);
      setGithubRepoUrl(part.evidence?.githubRepoUrl || '');
      setLiveUrl(part.evidence?.liveUrl || '');
      setPrUrl(part.evidence?.prUrl || '');
      setWrittenExplanation(part.evidence?.writtenExplanation || '');
      setFormError('');
      setFormSuccess('');
      setSubmissionModalOpen(true);
    }
  };

  const handleSubmitEvidence = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      bountyHubService.submitBountyEvidence(submissionTargetId, {
        githubRepoUrl,
        liveUrl,
        prUrl,
        writtenExplanation,
      });
      setFormSuccess('Evidence successfully submitted for review!');
      reloadData();
      setTimeout(() => {
        setSubmissionModalOpen(false);
        setFormSuccess('');
      }, 1200);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleWithdraw = (partId) => {
    if (window.confirm('Are you sure you want to withdraw from this challenge? Your progress notes will be archived.')) {
      bountyHubService.withdrawParticipation(partId);
      reloadData();
    }
  };

  const getStatusBadge = (status, provenance) => {
    switch (status) {
      case 'accepted':
      case 'completed':
        return { bg: '#FFE5CE', text: '#FE6904', label: 'Accepted' };
      case 'submitted':
        return { bg: '#F8F8F7', text: '#77736F', label: 'Submitted (Review pending)' };
      case 'under_review':
        return { bg: '#FFE5CE', text: '#FE6904', label: 'Under review' };
      case 'changes_requested':
        return { bg: '#F8F8F7', text: '#171717', label: 'Changes requested' };
      case 'in_progress':
        return { bg: '#FFE5CE', text: '#FE6904', label: 'In progress' };
      case 'withdrawn':
        return { bg: '#F8F8F7', text: '#77736F', label: 'Withdrawn' };
      default:
        return { bg: '#F8F8F7', text: '#77736F', label: 'Joined' };
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Frontend', label: 'Frontend & UI/UX' },
    { id: 'Backend', label: 'Backend & APIs' },
    { id: 'AI & Machine Learning', label: 'AI & Machine Learning' },
    { id: 'Data Analysis', label: 'Data Analysis' },
    { id: 'Automation', label: 'Automation & DevTools' },
    { id: 'Social-Impact', label: 'Social-Impact' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', margin: 0 }}>
          Bounties
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#77736F', marginTop: '0.25rem' }}>
          Work on real-world projects and build portfolio evidence.
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Active workspaces</span>
            <Code size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', marginTop: '0.25rem' }}>
            {metrics.inProgress}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Under review</span>
            <Clock size={16} color="#77736F" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', marginTop: '0.25rem' }}>
            {metrics.underReview}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Completed</span>
            <CheckCircle2 size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', marginTop: '0.25rem' }}>
            {metrics.completed}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Verified evidence</span>
            <ShieldCheck size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', marginTop: '0.25rem' }}>
            {metrics.verifiedEvidence}
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #EAE7E2', marginBottom: '1.75rem' }}>
        <button
          onClick={() => setActiveTab('explore')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'explore' ? '3px solid #FE6904' : '3px solid transparent',
            color: activeTab === 'explore' ? '#FE6904' : '#77736F',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          Explore Challenges ({bounties.length})
        </button>
        <button
          onClick={() => setActiveTab('workspaces')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'workspaces' ? '3px solid #FE6904' : '3px solid transparent',
            color: activeTab === 'workspaces' ? '#FE6904' : '#77736F',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          My Workspaces ({participations.filter((p) => p.status !== 'withdrawn').length})
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'portfolio' ? '3px solid #FE6904' : '3px solid transparent',
            color: activeTab === 'portfolio' ? '#FE6904' : '#77736F',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          Verified Portfolio ({bountyHubService.getPortfolioBounties().length})
        </button>
      </div>

      {/* TAB 1: EXPLORE CHALLENGES */}
      {activeTab === 'explore' && (
        <div>
          {/* Filter Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem', background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #EAE7E2' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={16} color="#77736F" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search challenges, skills, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.25rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem' }}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem', background: '#FFFFFF', color: '#171717' }}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem', background: '#FFFFFF', color: '#171717' }}
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={selectedRewardType}
              onChange={(e) => setSelectedRewardType(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem', background: '#FFFFFF', color: '#171717' }}
            >
              <option value="all">All Reward Types</option>
              <option value="certificate">Certificate & Endorsement</option>
              <option value="mentorship">Mentorship Review</option>
              <option value="internship_consideration">Internship Consideration</option>
              <option value="monetary">Monetary Grant (Verified)</option>
              <option value="non_monetary">Skill Building / Non-Cash</option>
            </select>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#77736F', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showExpired}
                onChange={(e) => setShowExpired(e.target.checked)}
              />
              <span>Include expired</span>
            </label>
          </div>

          {/* Bounty Grid */}
          {bounties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#FFFFFF', borderRadius: '12px', border: '1px dashed #EAE7E2' }}>
              <Award size={36} color="#FA9B2A" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#171717', margin: '0 0 0.4rem' }}>No challenges match your criteria</h3>
              <p style={{ fontSize: '0.85rem', color: '#77736F', maxWidth: '420px', margin: '0 auto' }}>
                Try clearing your search query or adjusting filters to view all available practice labs and verified challenges.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {bounties.map((bounty) => {
                const isJoined = participations.some((p) => p.bountyId === bounty.id && p.status !== 'withdrawn');
                return (
                  <div
                    key={bounty.id}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: isJoined ? '1.5px solid #FE6904' : '1px solid #EAE7E2',
                      background: bounty.isExpired ? '#F8F8F7' : '#FFFFFF',
                      opacity: bounty.isExpired ? 0.85 : 1,
                    }}
                  >
                    <div>
                      {/* Publisher & Tags Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#171717' }}>
                              {bounty.publisher}
                            </span>
                            {bounty.isPracticeChallenge ? (
                              <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#FFE5CE', color: '#77736F' }}>
                                Practice Lab
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#FFE5CE', color: '#FE6904' }}>
                                Verified Partner
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#77736F' }}>{bounty.category}</span>
                        </div>

                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '100px',
                          textTransform: 'capitalize',
                          background: bounty.difficulty === 'beginner' ? '#FFE5CE' : bounty.difficulty === 'intermediate' ? '#F8F8F7' : '#F8F8F7',
                          color: bounty.difficulty === 'beginner' ? '#FE6904' : bounty.difficulty === 'intermediate' ? '#77736F' : '#171717',
                        }}>
                          {bounty.difficulty}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                        {bounty.title}
                      </h3>

                      <p style={{ fontSize: '0.85rem', color: '#77736F', margin: '0 0 1rem', lineHeight: 1.5 }}>
                        {bounty.summary}
                      </p>

                      {/* Required Skills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                        {(bounty.requiredSkills || []).map((skill) => (
                          <span key={skill} style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#F8F8F7', color: '#171717', fontWeight: 500 }}>
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Reward & Deadline Callout */}
                      <div style={{ background: '#F8F8F7', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #EAE7E2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '4px' }}>
                          <span style={{ color: '#77736F' }}>Reward Type:</span>
                          <span style={{ fontWeight: 700, color: bounty.reward?.isMonetary ? '#FE6904' : '#FE6904' }}>
                            {bounty.reward?.isMonetary ? `₹${bounty.reward.amount?.toLocaleString()} Grant` : bounty.reward?.title || 'Certificate / Mentorship'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                          <span style={{ color: '#77736F' }}>Timeline:</span>
                          <span style={{ fontWeight: 600, color: bounty.isExpired ? '#171717' : '#171717' }}>
                            {bounty.isExpired ? 'Concluded / Expired' : bounty.deadline ? `Due ${new Date(bounty.deadline).toLocaleDateString()}` : 'Self-Paced / Open'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        onClick={() => setSelectedBounty(bounty)}
                        className="btn-outline"
                        style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                      >
                        Specification
                      </button>

                      {isJoined ? (
                        <button
                          onClick={() => {
                            setActiveTab('workspaces');
                            setActiveWorkspaceBounty(bounty.id);
                          }}
                          className="btn-primary"
                          style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', background: '#171717', color: '#FFFFFF' }}
                        >
                          Workspace Active
                        </button>
                      ) : bounty.isExpired ? (
                        <button
                          disabled
                          style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #EAE7E2', background: '#F8F8F7', color: '#77736F', cursor: 'not-allowed' }}
                        >
                          Concluded
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinChallenge(bounty.id)}
                          className="btn-primary"
                          style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                        >
                          Join Challenge
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY CHALLENGE WORKSPACES */}
      {activeTab === 'workspaces' && (
        <div>
          {participations.filter((p) => p.status !== 'withdrawn').length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#FFFFFF', borderRadius: '12px', border: '1px dashed #EAE7E2' }}>
              <Code size={40} color="#FE6904" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#171717', margin: '0 0 0.4rem' }}>
                No Active Challenge Workspaces
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#77736F', maxWidth: '460px', margin: '0 auto 1.25rem' }}>
                Join a practice lab or partner challenge to unlock your dedicated workspace with deliverables checklists, implementation planning, and review tracking.
              </p>
              <button onClick={() => setActiveTab('explore')} className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                Explore Available Challenges
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {participations.filter((p) => p.status !== 'withdrawn').map((part) => {
                const bounty = bountyHubService.getBountyById(part.bountyId);
                const badge = getStatusBadge(part.status, part.reviewProvenance);
                const completedDeliverables = (part.deliverablesChecklist || []).filter((d) => d.completed).length;
                const totalDeliverables = (part.deliverablesChecklist || []).length;
                const progressPct = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0;

                return (
                  <div key={part.id} className="card" style={{ padding: '1.75rem', border: '1px solid #EAE7E2' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid #EAE7E2', paddingBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FE6904' }}>{part.publisher}</span>
                          <span style={{ fontSize: '0.7rem', color: '#77736F' }}>· {part.bountyCategory}</span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                          {part.bountyTitle}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '100px',
                          background: badge.bg,
                          color: badge.text,
                        }}>
                          {badge.label}
                        </span>

                        <button
                          onClick={() => handleWithdraw(part.id)}
                          style={{ background: 'none', border: 'none', color: '#77736F', fontSize: '0.75rem', cursor: 'pointer', padding: '4px' }}
                          title="Withdraw from challenge"
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>

                    {/* Progress & Checklist */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                          <span style={{ color: '#171717' }}>Deliverables Checklist</span>
                          <span style={{ color: '#FE6904' }}>{completedDeliverables} of {totalDeliverables} ({progressPct}%)</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {(part.deliverablesChecklist || []).map((del) => (
                            <label
                              key={del.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.8rem',
                                color: del.completed ? '#171717' : '#77736F',
                                background: '#F8F8F7',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={del.completed}
                                onChange={() => handleToggleDeliverable(part.id, del.id)}
                              />
                              <span style={{ textDecoration: del.completed ? 'line-through' : 'none' }}>
                                {del.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Implementation Notes */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>Implementation Plan & Notes</span>
                          <button
                            onClick={() => handleSaveNotes(part.id)}
                            style={{ fontSize: '0.72rem', color: '#FE6904', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Save Notes
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          placeholder="Outline your technical approach, decisions, or blockers..."
                          value={editingNotes[part.id] !== undefined ? editingNotes[part.id] : part.implementationPlan}
                          onChange={(e) => setEditingNotes({ ...editingNotes, [part.id]: e.target.value })}
                          onBlur={() => handleSaveNotes(part.id)}
                          style={{
                            width: '100%',
                            padding: '0.6rem',
                            borderRadius: '8px',
                            border: '1px solid #EAE7E2',
                            fontSize: '0.8rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                          }}
                        />
                      </div>
                    </div>

                    {/* Review Feedback Display (if received) */}
                    {(part.feedbackHistory || []).length > 0 && (
                      <div style={{ background: '#F8F8F7', border: '1px solid #EAE7E2', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <AlertCircle size={16} color="#77736F" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
                            Evaluation Feedback Received
                          </span>
                        </div>
                        {part.feedbackHistory.map((fb) => (
                          <div key={fb.id} style={{ fontSize: '0.8rem', color: '#77736F', lineHeight: 1.5 }}>
                            <p style={{ margin: '0 0 4px' }}>"{fb.feedbackText}"</p>
                            <span style={{ fontSize: '0.7rem', color: '#77736F' }}>Reviewed by: {fb.reviewer} on {new Date(fb.date).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Submitted Evidence Links */}
                    {part.evidence?.githubRepoUrl && (
                      <div style={{ background: '#F8F8F7', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', fontSize: '0.8rem' }}>
                        <span style={{ fontWeight: 700, color: '#171717' }}>Submitted Evidence:</span>
                        <a href={part.evidence.githubRepoUrl} target="_blank" rel="noreferrer" style={{ color: '#FE6904', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                          <Code size={14} /> Repository Link <ExternalLink size={12} />
                        </a>
                        {part.evidence.liveUrl && (
                          <a href={part.evidence.liveUrl} target="_blank" rel="noreferrer" style={{ color: '#FE6904', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                            <ExternalLink size={14} /> Live Demo <ExternalLink size={12} />
                          </a>
                        )}
                        <span style={{ color: '#77736F', fontSize: '0.72rem', marginLeft: 'auto' }}>
                          Submitted: {new Date(part.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Actions Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid #EAE7E2', paddingTop: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#77736F' }}>
                        Provenance: <strong style={{ color: '#171717' }}>{part.reviewProvenance.replace(/_/g, ' ')}</strong>
                      </span>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {bounty && (
                          <button
                            onClick={() => setSelectedBounty(bounty)}
                            className="btn-outline"
                            style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
                          >
                            Rubric & Spec
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenSubmission(part.id)}
                          className="btn-primary"
                          style={{ fontSize: '0.8rem', padding: '0.45rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Send size={14} />
                          <span>{part.status === 'submitted' ? 'Update Submission' : part.status === 'changes_requested' ? 'Submit Revision' : 'Submit Evidence'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VERIFIED PORTFOLIO EVIDENCE */}
      {activeTab === 'portfolio' && (
        <div>
          {bountyHubService.getPortfolioBounties().length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#FFFFFF', borderRadius: '12px', border: '1px dashed #EAE7E2' }}>
              <ShieldCheck size={40} color="#FE6904" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#171717', margin: '0 0 0.4rem' }}>
                No Verified Bounties in Portfolio Yet
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#77736F', maxWidth: '460px', margin: '0 auto 1.25rem' }}>
                Workspaces that pass evaluation criteria and achieve publisher acceptance are automatically projected into your ZHERO portfolio as verified practical evidence.
              </p>
              <button onClick={() => setActiveTab('explore')} className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                Start a Challenge
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {bountyHubService.getPortfolioBounties().map((item) => (
                <div key={item.id} className="card" style={{ padding: '1.5rem', border: '1px solid #FFE5CE', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FE6904' }}>{item.publisher}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: '#FFE5CE', color: '#FE6904' }}>
                      Publisher Accepted
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', margin: '0 0 0.5rem' }}>
                    {item.bountyTitle}
                  </h3>

                  {item.reviewOutcome && (
                    <p style={{ fontSize: '0.8rem', color: '#77736F', fontStyle: 'italic', background: '#F8F8F7', padding: '0.6rem 0.8rem', borderRadius: '6px', margin: '0 0 0.75rem' }}>
                      "{item.reviewOutcome}"
                    </p>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    {(item.skillsPractised || []).map((s) => (
                      <span key={s} style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#FFE5CE', color: '#77736F', fontWeight: 600 }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {item.evidence?.githubRepoUrl && (
                    <div style={{ borderTop: '1px solid #EAE7E2', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <a href={item.evidence.githubRepoUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                        <span>View Repository</span>
                        <ExternalLink size={12} />
                      </a>

                      <span style={{ fontSize: '0.72rem', color: '#FE6904', fontWeight: 700 }}>
                        {item.rewardPaidConfirmed ? 'Grant / Certificate Issued' : 'Endorsement Confirmed'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SPECIFICATION MODAL / DRAWER */}
      {selectedBounty && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(23, 23, 23, 0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '720px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FE6904', textTransform: 'uppercase' }}>
                  {selectedBounty.category} · {selectedBounty.difficulty}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171717', margin: '4px 0' }}>
                  {selectedBounty.title}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
                  Published by: <strong>{selectedBounty.publisher}</strong> ({selectedBounty.publisherVerification.replace(/_/g, ' ')})
                </span>
              </div>
              <button
                onClick={() => setSelectedBounty(null)}
                style={{ background: '#F8F8F7', border: '1px solid #EAE7E2', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#171717' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Problem Statement */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#171717', marginBottom: '0.4rem' }}>
                Problem Statement & Technical Scope
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#171717', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {selectedBounty.problemStatement}
              </p>
            </div>

            {/* Deliverables */}
            <div style={{ marginBottom: '1.5rem', background: '#F8F8F7', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
                Required Deliverables
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#77736F', lineHeight: 1.6 }}>
                {(selectedBounty.deliverables || []).map((d) => (
                  <li key={d.id}>{d.label}</li>
                ))}
              </ul>
            </div>

            {/* Concrete Rubric Table */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
                Evaluation Rubric & Acceptance Criteria
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#F8F8F7', textAlign: 'left' }}>
                    <th style={{ padding: '8px', borderBottom: '1px solid #EAE7E2' }}>Criterion</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #EAE7E2', width: '70px' }}>Weight</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #EAE7E2' }}>Requirement</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedBounty.rubric || []).map((r, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #EAE7E2' }}>
                      <td style={{ padding: '8px', fontWeight: 600, color: '#171717' }}>{r.criterion}</td>
                      <td style={{ padding: '8px', color: '#FE6904', fontWeight: 700 }}>{r.weight}</td>
                      <td style={{ padding: '8px', color: '#77736F' }}>{r.requirement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reward & Terms */}
            <div style={{ background: '#FFE5CE', border: '1px solid #FA9B2A', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#77736F', margin: '0 0 4px' }}>
                Reward & Verification Terms
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#77736F', margin: 0, lineHeight: 1.5 }}>
                {selectedBounty.reward?.terms}
              </p>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedBounty(null)} className="btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Close
              </button>
              {selectedBounty.isExpired ? (
                <button disabled style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', background: '#EAE7E2', color: '#77736F', borderRadius: '8px', border: 'none', cursor: 'not-allowed' }}>
                  Challenge Concluded
                </button>
              ) : (
                <button
                  onClick={() => handleJoinChallenge(selectedBounty.id)}
                  className="btn-primary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Join Challenge & Start Workspace
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {submissionModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(23, 23, 23, 0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '580px', width: '100%', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                Submit Challenge Evidence
              </h3>
              <button
                onClick={() => setSubmissionModalOpen(false)}
                style={{ background: '#F8F8F7', border: '1px solid #EAE7E2', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#171717' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#77736F', margin: '0 0 1.25rem' }}>
              Provide verifiable links to your source repository, live demo, or pull request. Submitting initiates an honest evaluation review.
            </p>

            <form onSubmit={handleSubmitEvidence}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                  GitHub Repository URL <span style={{ color: '#FE6904' }}>*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/your-username/challenge-repo"
                  value={githubRepoUrl}
                  onChange={(e) => setGithubRepoUrl(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                  Live Preview / Deployed URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://your-demo.vercel.app"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                  Pull Request URL (If contributing to upstream)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/owner/repo/pull/123"
                  value={prUrl}
                  onChange={(e) => setPrUrl(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                  Written Summary / Explanation
                </label>
                <textarea
                  rows={3}
                  placeholder="Highlight key design decisions, trade-offs, or testing instructions..."
                  value={writtenExplanation}
                  onChange={(e) => setWrittenExplanation(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem', fontFamily: 'inherit' }}
                />
              </div>

              {formError && (
                <div style={{ padding: '0.65rem 0.85rem', background: '#F8F8F7', border: '1px solid #EAE7E2', borderRadius: '8px', color: '#171717', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div style={{ padding: '0.65rem 0.85rem', background: '#FFE5CE', border: '1px solid #EAE7E2', borderRadius: '8px', color: '#FE6904', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {formSuccess}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSubmissionModalOpen(false)}
                  className="btn-outline"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Submit for Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
