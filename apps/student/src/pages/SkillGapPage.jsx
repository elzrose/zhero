import React, { useState } from 'react';
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
  const relevantResources = RESOURCES_DATA.filter((r) => r.careerId === selectedCareerId).slice(0, 3);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Skill gaps</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={selectedCareerId}
            onChange={(e) => handleCareerChange(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #EAE7E2',
              fontSize: '0.85rem',
              backgroundColor: '#FFFFFF',
              color: '#171717',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {CAREERS_DATA.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result summary: one line with percentage */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EAE7E2',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ fontSize: '0.95rem', color: '#171717' }}>
          Readiness for {career.title}: <strong style={{ color: '#FE6904' }}>{readinessScore}%</strong>
        </div>

        {onGenerateRoadmap && (
          <button
            type="button"
            onClick={() => onGenerateRoadmap(career.id)}
            className="btn-primary"
            style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            View roadmap
          </button>
        )}
      </div>

      {/* Skills list */}
      <div className="section" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">Skills</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {career.requiredSkills.map((skill, sIdx) => {
            const currentRating = skillRatings[skill.name] || 1;
            const target = skill.targetLevel;
            const isMet = currentRating >= target;

            return (
              <div
                key={sIdx}
                className="list-row"
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171717' }}>
                      {skill.name}
                    </span>
                    <span className="badge" style={{
                      backgroundColor: skill.importance === 'Crucial' ? '#FFE5CE' : '#F8F8F7',
                      color: skill.importance === 'Crucial' ? '#FE6904' : '#77736F',
                      border: '1px solid #EAE7E2',
                    }}>
                      {skill.importance}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#77736F' }}>
                    Target: Level {target} / 5
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((level) => {
                      const isCurrent = currentRating === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleRatingChange(skill.name, level)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: isCurrent ? '1px solid #FE6904' : '1px solid #EAE7E2',
                            backgroundColor: isCurrent ? '#FE6904' : '#FFFFFF',
                            color: isCurrent ? '#FFFFFF' : '#171717',
                            fontSize: '0.85rem',
                            fontWeight: isCurrent ? 600 : 400,
                            cursor: 'pointer',
                          }}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>

                  <span className="badge" style={{
                    backgroundColor: isMet ? '#F8F8F7' : '#FFE5CE',
                    color: isMet ? '#171717' : '#FE6904',
                    border: '1px solid #EAE7E2',
                    minWidth: '60px',
                    textAlign: 'center',
                  }}>
                    {isMet ? 'Met' : `Gap -${target - currentRating}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resources */}
      {relevantResources.length > 0 && (
        <div className="section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              Resources
            </h2>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('resources')}
                className="link-btn"
                style={{ fontSize: '0.85rem' }}
              >
                All resources
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {relevantResources.map((res) => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="list-row"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1.25rem',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#171717' }}>{res.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#77736F' }}>{res.provider}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge" style={{ backgroundColor: '#F8F8F7', color: '#77736F', border: '1px solid #EAE7E2' }}>
                    {res.type}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#77736F' }}>{res.duration}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
