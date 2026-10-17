import React from 'react';
import { Bookmark, RotateCcw } from 'lucide-react';

export function ResultsPage({
  assessmentResults,
  onSelectCareer,
  onRetakeAssessment,
  savedCareers = [],
  onToggleSaveCareer
}) {
  const recommendations = (assessmentResults?.topRecommendations || []).slice(0, 5);
  const dimensions = assessmentResults?.dimensions || {
    analytical: 85, creative: 65, technical: 95, social: 60, practical: 80, organizational: 70
  };

  const dimensionLabels = [
    { key: 'technical', label: 'Technical and systems' },
    { key: 'analytical', label: 'Analytical and logic' },
    { key: 'practical', label: 'Practical execution' },
    { key: 'creative', label: 'Creative and visual' },
    { key: 'organizational', label: 'Organizational and planning' },
    { key: 'social', label: 'Social and collaborative' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Results</h1>
          <p className="page-subtitle">Recommended careers based on your assessment.</p>
        </div>
        {onRetakeAssessment && (
          <button
            type="button"
            onClick={onRetakeAssessment}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <RotateCcw size={14} />
            <span>Retake assessment</span>
          </button>
        )}
      </div>

      {/* Interest breakdown */}
      <div className="section" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">Interest breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {dimensionLabels.map((dim) => {
            const val = dimensions[dim.key] || 50;
            return (
              <div key={dim.key} style={{ backgroundColor: '#FFFFFF', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #EAE7E2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: '#171717' }}>{dim.label}</span>
                  <span style={{ color: '#FE6904', fontWeight: 600 }}>{val}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#F8F8F7', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${val}%`,
                    height: '100%',
                    background: '#FE6904',
                    borderRadius: '9999px',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended careers */}
      <div className="section">
        <h2 className="section-title">Recommended careers</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recommendations.map((career, idx) => {
            const isSaved = savedCareers.includes(career.id);
            const skills = (career.requiredSkills || []).slice(0, 3).map((s) => (typeof s === 'string' ? s : s.name));

            return (
              <div
                key={career.id || idx}
                className="list-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px', flex: '1 1 auto' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#77736F', width: '20px' }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#171717' }}>
                      {career.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#77736F' }}>
                      {career.category}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {career.matchScore && (
                    <span className="badge" style={{ backgroundColor: '#FFE5CE', color: '#FE6904', border: '1px solid #EAE7E2' }}>
                      {career.matchScore}% match
                    </span>
                  )}

                  {career.avgSalary && (
                    <span style={{ fontSize: '0.85rem', color: '#171717', minWidth: '70px' }}>
                      {career.avgSalary}
                    </span>
                  )}

                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontSize: '0.75rem',
                          color: '#77736F',
                          backgroundColor: '#F8F8F7',
                          border: '1px solid #EAE7E2',
                          borderRadius: '4px',
                          padding: '2px 6px',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => onSelectCareer && onSelectCareer(career.id)}
                      className="btn-primary"
                      style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem' }}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleSaveCareer && onToggleSaveCareer(career.id)}
                      className="btn-secondary"
                      aria-label={isSaved ? 'Saved' : 'Save'}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: isSaved ? '#FE6904' : '#171717',
                      }}
                    >
                      <Bookmark size={14} fill={isSaved ? '#FE6904' : 'none'} />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
