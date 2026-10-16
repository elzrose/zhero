import React from 'react';
import { GitCompare, X, Plus, Map, Sliders } from 'lucide-react';
import { CAREERS_DATA } from '../data/careersData';

export function ComparePage({
  compareList,
  onToggleCompareCareer,
  onGenerateRoadmap,
  onAuditSkills,
  onNavigate
}) {
  const comparedCareers = CAREERS_DATA.filter((c) => compareList.includes(c.id));

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em', margin: 0 }}>
            Side-by-Side Career Comparison
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#77736F', marginTop: '0.35rem' }}>
            Compare responsibilities, market demand, skill matrices, and starter projects across up to 3 target paths.
          </p>
        </div>

        <button
          onClick={() => onNavigate('careers')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.65rem 1.15rem',
            borderRadius: '10px',
            backgroundColor: '#FFE5CE',
            color: '#FE6904',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          <span>Add Career to Compare</span>
        </button>
      </div>

      {comparedCareers.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}>
          <GitCompare size={40} color="#FE6904" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717', margin: 0 }}>
            No Careers Selected for Comparison
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#77736F', maxWidth: '440px', margin: '0.5rem auto 1.5rem' }}>
            Browse the Career Catalogue or Assessment Results and click "Compare" to view side-by-side breakdowns.
          </p>
          <button
            onClick={() => onNavigate('careers')}
            className="btn-primary"
          >
            Browse Career Catalogue
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${comparedCareers.length}, minmax(300px, 1fr))`,
          gap: '1.5rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
        }}>
          {comparedCareers.map((career) => (
            <div
              key={career.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #EAE7E2',
                padding: '1.75rem',
                boxShadow: '0 4px 16px rgba(23, 23, 23, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Header & Close */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: '#FFE5CE',
                    color: '#FE6904',
                  }}>
                    {career.category}
                  </span>
                  <button
                    onClick={() => onToggleCompareCareer(career.id)}
                    title="Remove from comparison"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#77736F',
                      padding: '4px',
                      borderRadius: '6px',
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#171717', margin: '0 0 0.5rem' }}>
                  {career.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#77736F', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                  {career.description}
                </p>

                {/* Metrics */}
                <div style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: '#F8F8F7',
                  border: '1px solid #EAE7E2',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                }}>
                  <div>
                    <span style={{ color: '#77736F', display: 'block' }}>Salary Bracket</span>
                    <strong style={{ color: '#171717', fontSize: '0.9rem' }}>{career.avgSalary}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#77736F', display: 'block' }}>Growth Rate</span>
                    <strong style={{ color: '#2E7D32', fontSize: '0.9rem' }}>{career.growthRate}</strong>
                  </div>
                </div>

                {/* Core Responsibilities */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#171717', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Core Responsibilities
                  </strong>
                  <p style={{ fontSize: '0.85rem', color: '#77736F', lineHeight: 1.5, marginTop: '4px' }}>
                    {career.typicalDay}
                  </p>
                </div>

                {/* Required Skills */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#171717', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Required Competencies
                  </strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {career.requiredSkills.map((s, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.72rem',
                        background: '#FAF9F7',
                        color: '#171717',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid #EAE7E2',
                      }}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Starter Project */}
                {career.starterProject && (
                  <div style={{
                    padding: '0.85rem',
                    borderRadius: '10px',
                    background: '#FFE5CE',
                    marginBottom: '1.5rem',
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FE6904', textTransform: 'uppercase' }}>
                      Recommended Capstone
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', marginTop: '2px' }}>
                      {career.starterProject.title}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #EAE7E2', paddingTop: '1rem' }}>
                <button
                  onClick={() => onGenerateRoadmap(career.id)}
                  style={{
                    width: '100%',
                    backgroundColor: '#FE6904',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.65rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Map size={15} />
                  <span>Set as Active Roadmap</span>
                </button>

                <button
                  onClick={() => onAuditSkills(career.id)}
                  style={{
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    color: '#171717',
                    border: '1px solid #EAE7E2',
                    borderRadius: '8px',
                    padding: '0.65rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Sliders size={15} />
                  <span>Audit Skill Gaps</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
