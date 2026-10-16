import React from 'react';
import { Bookmark, Sliders, Map, GitCompare, RotateCcw } from 'lucide-react';

export function ResultsPage({
  assessmentResults,
  onSelectCareer,
  onGenerateRoadmap,
  onAuditSkills,
  onCompareCareer,
  onRetakeAssessment,
  savedCareers,
  onToggleSaveCareer
}) {
  const recommendations = assessmentResults?.topRecommendations || [];
  const dimensions = assessmentResults?.dimensions || {
    analytical: 85, creative: 65, technical: 95, social: 60, practical: 80, organizational: 70
  };

  const dimensionLabels = [
    { key: 'technical', label: 'Technical & Systems' },
    { key: 'analytical', label: 'Analytical & Logic' },
    { key: 'practical', label: 'Practical Execution' },
    { key: 'creative', label: 'Creative & Visual' },
    { key: 'organizational', label: 'Organizational & Planning' },
    { key: 'social', label: 'Social & Collaborative' },
  ];

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '2rem',
        marginBottom: '2.5rem',
        boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '9999px',
                background: '#E8F5E9',
                color: '#2E7D32',
              }}>
                ✓ Assessment Completed
              </span>
              <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
                Primary Profile: <strong style={{ color: '#171717' }}>{assessmentResults?.primaryInterest || 'Technical & Analytical'}</strong>
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.03em', margin: 0 }}>
              Your Career & Strengths Discovery Results
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#77736F', marginTop: '0.5rem', maxWidth: '680px' }}>
              Based on your answers, our deterministic recommendation engine matched your cognitive strengths with the top 5 high-alignment career profiles below.
            </p>
          </div>

          <button
            onClick={onRetakeAssessment}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: '1px solid #EAE7E2',
              background: '#FFFFFF',
              color: '#77736F',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} />
            <span>Retake Assessment</span>
          </button>
        </div>

        {/* Cognitive Dimension Breakdown Bars */}
        <div style={{ marginTop: '2rem', paddingTop: '1.75rem', borderTop: '1px solid #EAE7E2' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#171717', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Cognitive Dimension Breakdown
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {dimensionLabels.map((dim) => {
              const val = dimensions[dim.key] || 50;
              return (
                <div key={dim.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#171717' }}>{dim.label}</span>
                    <span style={{ color: '#FE6904', fontWeight: 700 }}>{val}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#F1F0ED', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${val}%`,
                      height: '100%',
                      background: val >= 80 ? '#FE6904' : '#FA9B2A',
                      borderRadius: '9999px',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 5 Recommendations Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171717', margin: 0 }}>
          Top 5 Recommended Careers for You
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#77736F', marginTop: '0.25rem' }}>
          Ranked by multi-dimensional match score. Select any career to generate a customized roadmap or audit skill gaps.
        </p>
      </div>

      {/* Recommendation Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {recommendations.map((career, idx) => {
          const isSaved = savedCareers.includes(career.id);
          const isTopPick = idx === 0;

          return (
            <div
              key={career.id || idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: isTopPick ? '2px solid #FE6904' : '1px solid #EAE7E2',
                padding: '1.75rem',
                boxShadow: isTopPick ? '0 8px 24px rgba(254, 105, 4, 0.12)' : '0 2px 8px rgba(23, 23, 23, 0.04)',
                position: 'relative',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '8px',
                      background: isTopPick ? '#FFE5CE' : '#F8F8F7',
                      color: isTopPick ? '#FE6904' : '#171717',
                    }}>
                      {career.matchScore}% Match
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#77736F' }}>• {career.category}</span>
                    <span style={{ fontSize: '0.8rem', color: '#77736F' }}>• Avg Salary: <strong style={{ color: '#171717' }}>{career.avgSalary}</strong></span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                    {career.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onToggleSaveCareer(career.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #EAE7E2',
                      background: isSaved ? '#FFE5CE' : '#FFFFFF',
                      color: isSaved ? '#FE6904' : '#77736F',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Bookmark size={14} fill={isSaved ? '#FE6904' : 'none'} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={() => onCompareCareer(career.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #EAE7E2',
                      background: '#FFFFFF',
                      color: '#171717',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <GitCompare size={14} />
                    <span>Compare</span>
                  </button>
                </div>
              </div>

              {/* Description & Match Reason */}
              <p style={{ fontSize: '0.9rem', color: '#77736F', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {career.description}
              </p>

              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                backgroundColor: '#FAF9F7',
                borderLeft: '4px solid #FE6904',
                fontSize: '0.85rem',
                color: '#171717',
                marginBottom: '1.25rem',
                lineHeight: 1.5,
              }}>
                <strong style={{ color: '#FE6904' }}>Why this fits you: </strong>
                {career.matchReason}
              </div>

              {/* Required Skills Grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                {(career.requiredSkills || []).map((skill, sIdx) => (
                  <span key={sIdx} style={{
                    fontSize: '0.75rem',
                    background: '#F8F8F7',
                    color: '#171717',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontWeight: 500,
                  }}>
                    {skill.name || skill}
                  </span>
                ))}
              </div>

              {/* Bottom Action CTAs */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid #EAE7E2',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}>
                <button
                  onClick={() => onSelectCareer(career.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#171717',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  View Full Career Profile →
                </button>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => onAuditSkills(career.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '0.55rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #EAE7E2',
                      background: '#FFFFFF',
                      color: '#171717',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Sliders size={15} />
                    <span>Audit Skill Gaps</span>
                  </button>

                  <button
                    onClick={() => onGenerateRoadmap(career.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#FE6904',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(254, 105, 4, 0.25)',
                    }}
                  >
                    <Map size={15} />
                    <span>Generate Learning Roadmap</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
