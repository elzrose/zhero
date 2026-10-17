import React, { useState } from 'react';
import { useTuitionStore, storeActions } from '../data/store';
import { VERBAL_CHECKPOINTS_DATA } from '../data/studentCompatibility';
import { StatCard } from '../components/Modal';

export function CheckpointsView() {
  const store = useTuitionStore();
  const checkpoints = store.checkpoints || VERBAL_CHECKPOINTS_DATA;

  const [filter, setFilter] = useState('All'); // 'All' | 'Passed' | 'Speedrun' | 'Remediation'
  const [search, setSearch] = useState('');

  const totalSubmissions = checkpoints.length;
  const passedCount = checkpoints.filter(c => c.passed).length;
  const speedrunCount = checkpoints.filter(c => c.isSpeedrunRisk).length;
  const remediationCount = checkpoints.filter(c => c.remediationNeeded).length;

  const filteredCheckpoints = checkpoints.filter(c => {
    const matchesSearch = c.studentName?.toLowerCase().includes(search.toLowerCase()) ||
                          c.milestoneTitle?.toLowerCase().includes(search.toLowerCase());
    if (filter === 'Passed') return matchesSearch && c.passed && !c.isSpeedrunRisk;
    if (filter === 'Speedrun') return matchesSearch && c.isSpeedrunRisk;
    if (filter === 'Remediation') return matchesSearch && c.remediationNeeded;
    return matchesSearch;
  });

  const handleVerify = (checkpointId) => {
    storeActions.verifyCheckpoint(checkpointId, 'Verified by Apex Academic Lead');
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
              AI Verbal Checkpoints & Anti-Speedrun Hub
            </h1>
            <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.75rem' }}>
              Voice AI Rubrics
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
            Evaluate oral conceptual understanding between modules. Detect speedrun anomalies and auto-assign adaptive remedial tasks.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard
          title="Verbal Submissions"
          value={totalSubmissions}
          subtext="Cohort oral checkpoints"
          icon="🎙️"
        />
        <StatCard
          title="Pass Rate"
          value={`${Math.round((passedCount / (totalSubmissions || 1)) * 100)}%`}
          subtext={`${passedCount} of ${totalSubmissions} cleared`}
          icon="✅"
        />
        <StatCard
          title="Speedrun Risks"
          value={speedrunCount}
          subtext="Time < 60s or anomalous speed"
          tag={speedrunCount > 0 ? "Requires Review" : "Clear"}
          icon="⚠️"
          highlight={speedrunCount > 0}
        />
        <StatCard
          title="Remediation Tasks"
          value={remediationCount}
          subtext="Adaptive milestones flagged"
          icon="🎯"
        />
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'All', label: 'All Checkpoints', count: totalSubmissions },
            { id: 'Passed', label: 'Passed & Validated', count: passedCount },
            { id: 'Speedrun', label: '⚠️ Speedrun Flags', count: speedrunCount },
            { id: 'Remediation', label: 'Remediation Needed', count: remediationCount },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={filter === tab.id ? 'tc-btn-primary' : 'tc-btn-secondary'}
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search student or milestone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="tc-input"
          style={{ width: '280px', fontSize: '0.85rem' }}
        />
      </div>

      {/* Checkpoints Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredCheckpoints.length === 0 ? (
          <div className="tc-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--tc-muted-text)' }}>
            No checkpoints found matching the selected filter.
          </div>
        ) : (
          filteredCheckpoints.map(chk => (
            <div
              key={chk.id}
              className="tc-card"
              style={{
                border: chk.isSpeedrunRisk ? '2px solid #F5C6CB' : '1px solid var(--tc-border)',
                background: chk.isSpeedrunRisk ? '#FFFDFD' : '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#171717' }}>
                      {chk.studentName}
                    </span>
                    <span className="tc-badge tc-badge-neutral" style={{ fontSize: '0.7rem' }}>
                      ID: {chk.studentId}
                    </span>
                    {chk.isSpeedrunRisk && (
                      <span className="tc-badge tc-badge-danger" style={{ fontSize: '0.7rem' }}>
                        ⚠️ Speedrun Detected ({chk.completionTimeSeconds}s)
                      </span>
                    )}
                    {chk.passed ? (
                      <span className="tc-badge tc-badge-success" style={{ fontSize: '0.7rem' }}>
                        ✓ Passed ({chk.score}%)
                      </span>
                    ) : (
                      <span className="tc-badge tc-badge-warning" style={{ fontSize: '0.7rem' }}>
                        Remediation Required
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--tc-charcoal)' }}>
                    Milestone: {chk.milestoneTitle}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', marginTop: '0.15rem' }}>
                    Submitted: {chk.submittedAt} • Audio Duration: {chk.completionTimeSeconds}s
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: chk.score >= 80 ? '#1E7E34' : '#B78103' }}>
                    {chk.score}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)', textTransform: 'uppercase' }}>
                    Oral Rubric Composite
                  </div>
                </div>
              </div>

              {/* Question & Audio Transcript */}
              <div style={{ backgroundColor: '#FAF8F5', padding: '1rem', borderRadius: '8px', border: '1px solid var(--tc-border)', margin: '1rem 0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C6A05', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  AI Prompt:
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717', marginBottom: '0.65rem' }}>
                  "{chk.questionPrompt}"
                </div>

                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--tc-muted-text)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  🎙️ Student Verbal Transcript:
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--tc-charcoal)', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{chk.studentResponse}"
                </div>
              </div>

              {/* Rubric Breakdown Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: '#FAF8F5', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--tc-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span>Conceptual Accuracy</span>
                    <strong>{chk.rubricScores?.conceptualAccuracy}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: '#EAE5D8', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${chk.rubricScores?.conceptualAccuracy}%`, height: '100%', background: '#1976D2' }} />
                  </div>
                </div>

                <div style={{ background: '#FAF8F5', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--tc-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span>Practical Justification</span>
                    <strong>{chk.rubricScores?.practicalJustification}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: '#EAE5D8', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${chk.rubricScores?.practicalJustification}%`, height: '100%', background: 'var(--tc-primary-yellow)' }} />
                  </div>
                </div>

                <div style={{ background: '#FAF8F5', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--tc-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span>Absence of Misconceptions</span>
                    <strong>{chk.rubricScores?.absenceOfMisconceptions}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: '#EAE5D8', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${chk.rubricScores?.absenceOfMisconceptions}%`, height: '100%', background: '#1E7E34' }} />
                  </div>
                </div>
              </div>

              {/* Misconceptions & Strengths Tags */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--tc-border)', paddingTop: '0.75rem' }}>
                <div>
                  {chk.misconceptions?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C53030' }}>Detected Misconceptions:</span>
                      {chk.misconceptions.map((m, mIdx) => (
                        <span key={mIdx} className="tc-badge tc-badge-danger" style={{ fontSize: '0.7rem' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: chk.remediationNeeded ? '#C53030' : '#1E7E34', fontWeight: 600 }}>
                    🎯 Remediation: {chk.remediationRecommendation}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleVerify(chk.id)}
                    className="tc-btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                  >
                    ✓ {chk.mentorReviewStatus || 'Verify Mastery'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
