import React, { useState } from 'react';
import { Map } from 'lucide-react';
import { CAREERS_DATA } from '../data/careersData';
import { RESOURCES_DATA } from '../data/resourcesData';
import { storageService } from '../services/storageService';

export function SkillGapPage({
  initialCareerId = 'full-stack-engineer',
  onGenerateRoadmap,
  onNavigate
}) {
  const [selectedCareerId, setSelectedCareerId] = useState(initialCareerId);
  const [skillRatings, setSkillRatings] = useState(() => storageService.getSkillAudit(selectedCareerId));

  const career = CAREERS_DATA.find((c) => c.id === selectedCareerId) || CAREERS_DATA[0];

  const handleRatingChange = (skillName, newLevel) => {
    const updated = storageService.updateSkillLevel(selectedCareerId, skillName, newLevel);
    setSkillRatings({ ...updated });
  };

  const handleCareerChange = (newId) => {
    setSelectedCareerId(newId);
    setSkillRatings(storageService.getSkillAudit(newId));
  };

  // Calculate overall readiness percentage
  let totalTarget = 0;
  let totalCurrent = 0;

  career.requiredSkills.forEach((skill) => {
    totalTarget += skill.targetLevel;
    const current = skillRatings[skill.name] || 1;
    totalCurrent += Math.min(skill.targetLevel, current);
  });

  const readinessScore = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 60;

  // Curated resources for this career
  const relevantResources = RESOURCES_DATA.filter((r) => r.careerId === selectedCareerId).slice(0, 3);

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header & Career Switcher */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em', margin: 0 }}>
            Interactive Skill-Gap Diagnostic
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#77736F', marginTop: '0.35rem' }}>
            Assess your current self-reported proficiency against required employer benchmarks to calculate your readiness.
          </p>
        </div>

        {/* Target Career Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#77736F' }}>Target Career:</span>
          <select
            value={selectedCareerId}
            onChange={(e) => handleCareerChange(e.target.value)}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              border: '1px solid #EAE7E2',
              fontSize: '0.875rem',
              fontWeight: 700,
              backgroundColor: '#FFFFFF',
              color: '#171717',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(23, 23, 23, 0.05)',
            }}
          >
            {CAREERS_DATA.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Readiness Overview Score Banner */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
      }}>
        <div style={{ flex: '1 1 350px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#FE6904',
          }}>
            Overall Preparedness Benchmark
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', margin: '0.25rem 0' }}>
            {career.title} Readiness
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#77736F', margin: 0, lineHeight: 1.5 }}>
            Update your self-reported levels below. Your readiness score recalculates dynamically in real time.
          </p>
        </div>

        {/* Gauge / Score Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          background: '#F8F8F7',
          padding: '1.25rem 1.75rem',
          borderRadius: '16px',
          border: '1px solid #EAE7E2',
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FE6904', lineHeight: 1 }}>
              {readinessScore}%
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#77736F' }}>
              Target Readiness
            </span>
          </div>

          <button
            onClick={() => onGenerateRoadmap(career.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.65rem 1.15rem',
              borderRadius: '10px',
              backgroundColor: '#FE6904',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(254, 105, 4, 0.25)',
            }}
          >
            <Map size={15} />
            <span>View Roadmap</span>
          </button>
        </div>
      </div>

      {/* Interactive Skill Audit List */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', marginBottom: '1rem' }}>
          Competency Assessment & Interactive Sliders
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {career.requiredSkills.map((skill, sIdx) => {
            const currentRating = skillRatings[skill.name] || 1;
            const target = skill.targetLevel;
            const isMet = currentRating >= target;

            return (
              <div
                key={sIdx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: isMet ? '1px solid #EAE7E2' : '1px solid #EAE7E2',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(23, 23, 23, 0.04)',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#171717', margin: 0 }}>
                        {skill.name}
                      </h4>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: skill.importance === 'Crucial' ? '#FFE5CE' : '#F8F8F7',
                        color: skill.importance === 'Crucial' ? '#FE6904' : '#77736F',
                      }}>
                        {skill.importance}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#77736F', marginTop: '2px', display: 'block' }}>
                      Category: {skill.category} • Target Requirement: Level {target} of 5
                    </span>
                  </div>

                  {/* Level Status Tag */}
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: isMet ? '#E8F5E9' : '#FFE5CE',
                    color: isMet ? '#2E7D32' : '#FE6904',
                  }}>
                    {isMet ? '✓ Target Met' : `Needs +${target - currentRating} Level`}
                  </span>
                </div>

                {/* Interactive Level Picker (1 to 5) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#77736F', marginRight: '6px' }}>
                    My Current Level:
                  </span>
                  {[1, 2, 3, 4, 5].map((level) => {
                    const isCurrent = currentRating === level;
                    return (
                      <button
                        key={level}
                        onClick={() => handleRatingChange(skill.name, level)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: isCurrent ? '2px solid #FE6904' : '1px solid #EAE7E2',
                          backgroundColor: isCurrent ? '#FE6904' : '#FFFFFF',
                          color: isCurrent ? '#FFFFFF' : '#171717',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>

                {/* Progress Gap Bar */}
                <div style={{ width: '100%', height: '8px', background: '#F1F0ED', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, Math.round((currentRating / 5) * 100))}%`,
                    height: '100%',
                    background: isMet ? '#2E7D32' : '#FE6904',
                    borderRadius: '9999px',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Learning Resources for this Gap */}
      {relevantResources.length > 0 && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          padding: '2rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                Curated Resources to Bridge Your Gaps
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#77736F', margin: 0 }}>
                Vetted beginner tutorials and documentation.
              </p>
            </div>

            <button
              onClick={() => onNavigate('resources')}
              style={{
                background: 'none',
                border: 'none',
                color: '#FE6904',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              All Resources →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {relevantResources.map((res) => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'block',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid #EAE7E2',
                  backgroundColor: '#F8F8F7',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FE6904' }}>{res.type}</span>
                  <span style={{ fontSize: '0.7rem', color: '#77736F' }}>{res.duration}</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#171717', margin: '0 0 0.35rem' }}>
                  {res.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#77736F', margin: 0 }}>{res.provider}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
