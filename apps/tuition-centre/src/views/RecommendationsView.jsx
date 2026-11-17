import React, { useState } from 'react';
import { useTuitionStore } from '../data/store';
import { getRecommendedCourses } from '../utils/engine';

export function RecommendationsView({ preselectedStudent, onDirectEnroll }) {
  const store = useTuitionStore();
  const students = store.students || [];
  const leads = store.leads || [];
  const courses = store.courses || [];

  // Combine both enrolled students and prospective leads as selectable candidates
  const candidates = [
    ...leads.map(l => ({ ...l, type: 'Lead' })),
    ...students.map(s => ({ ...s, type: 'Enrolled Student' }))
  ];

  const [selectedCandidateId, setSelectedCandidateId] = useState(
    preselectedStudent ? preselectedStudent.id : (candidates[0]?.id || '')
  );

  const currentCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  const recommendations = currentCandidate
    ? getRecommendedCourses(currentCandidate, courses)
    : [];

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="tc-badge tc-badge-yellow" style={{ marginBottom: '0.5rem' }}>
          Deterministic Diagnostic Heuristic
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
          Explainable Course-Matching & Recommendation Engine
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem', maxWidth: '850px' }}>
          Transparent matching logic that connects student assessment answers, target careers, and cognitive aptitudes with your coaching academy's real course offerings.
        </p>
      </div>

      {/* Candidate Selector Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '1.25rem',
        borderRadius: 'var(--tc-radius-lg)',
        border: '1px solid var(--tc-border)',
        marginBottom: '2rem',
        boxShadow: 'var(--tc-shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '300px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', whiteSpace: 'nowrap' }}>
              Select Candidate:
            </span>
            <select
              className="tc-select"
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
            >
              <optgroup label="Prospective Leads (from Assessment Campaigns)">
                {leads.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name} — Target: {l.targetCareer} ({l.readinessScore || 70}% Readiness)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Enrolled Students">
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id}) — {s.targetCareer}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {currentCandidate && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className={`tc-badge ${currentCandidate.type === 'Lead' ? 'tc-badge-yellow' : 'tc-badge-neutral'}`}>
                {currentCandidate.type}
              </span>
              <span className="tc-badge tc-badge-success">
                Readiness: {currentCandidate.readinessScore || 75}%
              </span>
            </div>
          )}
        </div>

        {/* Selected Candidate Summary */}
        {currentCandidate && (
          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--tc-border)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            fontSize: '0.85rem'
          }}>
            <div>
              <span style={{ color: 'var(--tc-muted-text)' }}>Candidate:</span>
              <div style={{ fontWeight: 700, color: '#171717' }}>{currentCandidate.name}</div>
            </div>
            <div>
              <span style={{ color: 'var(--tc-muted-text)' }}>Target Career Goal:</span>
              <div style={{ fontWeight: 700, color: '#8C6A05' }}>{currentCandidate.targetCareer || 'Engineering Specialization'}</div>
            </div>
            <div>
              <span style={{ color: 'var(--tc-muted-text)' }}>Identified Strengths:</span>
              <div style={{ fontWeight: 600, color: '#1E7E34' }}>
                {(currentCandidate.strengths || ['Analytical Logic', 'Mathematics']).join(', ')}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--tc-muted-text)' }}>Target Skill Gaps:</span>
              <div style={{ fontWeight: 600, color: '#B78103' }}>
                {(currentCandidate.skillGaps || ['Advanced Frameworks', 'System Design']).join(', ')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Explaining the Deterministic Matching Logic */}
      <div style={{
        padding: '1.25rem',
        backgroundColor: '#FAF8F5',
        borderRadius: '12px',
        border: '1px solid var(--tc-border)',
        marginBottom: '2rem',
        fontSize: '0.8rem',
        color: 'var(--tc-muted-text)'
      }}>
        <div style={{ fontWeight: 700, color: '#171717', marginBottom: '0.35rem' }}>
          ⚙️ How the Explainable Match Score is Calculated:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
          <div>
            <strong>1. Career Alignment (50% max):</strong><br />
            Matches candidate target career directly against course occupational pathways.
          </div>
          <div>
            <strong>2. Skill Synergies & Gap Bridging (35% max):</strong><br />
            Intersection between student strengths, identified learning gaps, and syllabus competencies.
          </div>
          <div>
            <strong>3. Prerequisite & Aptitude Fit (15% max):</strong><br />
            Verifies student education level and assessment readiness score against course difficulty.
          </div>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {recommendations.length === 0 ? (
          <div className="tc-card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🔍</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.75rem 0' }}>No Suitable Course Matches</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)' }}>
              No active courses in the catalogue meet the minimum 40% affinity threshold for this profile.
            </p>
          </div>
        ) : (
          recommendations.map((rec, idx) => (
            <div
              key={rec.course.id}
              className="tc-card"
              style={{
                border: idx === 0 ? '2px solid var(--tc-primary-yellow)' : '1px solid var(--tc-border)',
                background: idx === 0 ? 'var(--tc-card-gradient)' : '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.75rem' }}>
                      Rank #{idx + 1}
                    </span>
                    <span className="tc-badge tc-badge-neutral" style={{ fontSize: '0.75rem' }}>
                      {rec.course.category}
                    </span>
                    {idx === 0 && (
                      <span className="tc-badge tc-badge-success" style={{ fontSize: '0.75rem' }}>
                        ⭐ Primary Recommended Program
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.01em' }}>
                    {rec.course.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--tc-muted-text)', margin: '0.35rem 0 0.75rem', maxWidth: '750px', lineHeight: 1.5 }}>
                    {rec.course.description}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8C6A05', letterSpacing: '-0.02em' }}>
                    {rec.matchPercentage}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Match Confidence
                  </div>
                </div>
              </div>

              {/* Explainable Factor Breakdown */}
              <div style={{
                backgroundColor: '#FAF8F5',
                padding: '0.85rem 1.25rem',
                borderRadius: '10px',
                border: '1px solid var(--tc-border)',
                margin: '1rem 0'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '0.35rem' }}>
                  🔍 Transparent Scoring Breakdown:
                </div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--tc-charcoal)', lineHeight: 1.6 }}>
                  {rec.factors.map((factor, fIdx) => (
                    <li key={fIdx}>{factor}</li>
                  ))}
                </ul>
              </div>

              {/* Skills to Acquire & Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--tc-subtle-text)', textTransform: 'uppercase' }}>
                    Skills This Course Bridges:
                  </span>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {rec.skillsToAcquire.map((s, sIdx) => (
                      <span key={sIdx} className="tc-badge tc-badge-yellow" style={{ fontSize: '0.7rem' }}>
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      onDirectEnroll({
                        name: currentCandidate.name,
                        email: currentCandidate.email,
                        phone: currentCandidate.phone,
                        interestedCourseId: rec.course.id
                      });
                    }}
                    className="tc-btn-primary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Enroll in This Course →
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
