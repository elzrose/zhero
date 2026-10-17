import React from 'react';
import {
  ArrowLeft,
  Bookmark,
  GitCompare,
  Sliders,
  Clock,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { CAREERS_DATA } from '../data/careersData';

export function CareerDetailPage({
  careerId,
  onBack,
  onGenerateRoadmap,
  onAuditSkills,
  onToggleCompareCareer,
  compareList = [],
  savedCareers = [],
  onToggleSaveCareer,
  onSelectCareer
}) {
  const career = CAREERS_DATA.find((c) => c.id === careerId) || CAREERS_DATA[0];
  const isSaved = savedCareers.includes(career.id);
  const isCompared = compareList.includes(career.id);

  return (
    <div className="page">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: '#77736F',
          fontSize: '0.85rem',
          cursor: 'pointer',
          padding: 0,
          marginBottom: '1rem',
        }}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Header with title, category, match, salary and one primary action; Audit skills, Compare, Save as secondary group */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #EAE7E2',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge" style={{ backgroundColor: '#FFE5CE', color: '#FE6904', border: '1px solid #EAE7E2' }}>
                {career.category}
              </span>
              {career.matchScore && (
                <span className="badge" style={{ backgroundColor: '#F8F8F7', color: '#171717', border: '1px solid #EAE7E2' }}>
                  {career.matchScore}% match
                </span>
              )}
              <span style={{ fontSize: '0.85rem', color: '#171717', fontWeight: 600 }}>
                {career.avgSalary}
              </span>
            </div>

            <h1 className="page-title" style={{ margin: 0 }}>
              {career.title}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => onAuditSkills && onAuditSkills(career.id)}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                <Sliders size={14} />
                <span>Audit skills</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleCompareCareer && onToggleCompareCareer(career.id)}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: isCompared ? '#FE6904' : '#171717',
                  backgroundColor: isCompared ? '#FFE5CE' : '#FFFFFF',
                }}
              >
                <GitCompare size={14} />
                <span>{isCompared ? 'Comparing' : 'Compare'}</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleSaveCareer && onToggleSaveCareer(career.id)}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: isSaved ? '#FE6904' : '#171717',
                  backgroundColor: isSaved ? '#FFE5CE' : '#FFFFFF',
                }}
              >
                <Bookmark size={14} fill={isSaved ? '#FE6904' : 'none'} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onGenerateRoadmap && onGenerateRoadmap(career.id)}
              className="btn-primary"
              style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '0.85rem' }}
            >
              Generate roadmap
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#77736F', lineHeight: 1.6, margin: 0 }}>
          {career.description}
        </p>
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Day on job */}
          <div className="card">
            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={16} color="#FE6904" />
              <span>Day on the job</span>
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#171717', lineHeight: 1.6, margin: 0 }}>
              {career.typicalDay}
            </p>
          </div>

          {/* Starter Project */}
          {career.starterProject && (
            <div className="card">
              <h3 className="section-title">
                {career.starterProject.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#77736F', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {career.starterProject.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#171717' }}>
                <Clock size={14} color="#77736F" />
                <span>Estimated duration: {career.starterProject.timeEstimate}</span>
              </div>
            </div>
          )}

          {/* Education pathways */}
          {career.educationPathways && career.educationPathways.length > 0 && (
            <div className="card">
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GraduationCap size={16} color="#FE6904" />
                <span>Education routes</span>
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#171717', lineHeight: 1.6 }}>
                {career.educationPathways.map((path, pIdx) => (
                  <li key={pIdx}>{path}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Required Skills Matrix */}
        <div className="card">
          <h3 className="section-title">
            Required skills
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {career.requiredSkills.map((skill, sIdx) => (
              <div key={sIdx} style={{
                padding: '0.75rem',
                borderRadius: '8px',
                background: '#F8F8F7',
                border: '1px solid #EAE7E2',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#171717' }}>{skill.name}</span>
                  <span className="badge" style={{
                    backgroundColor: skill.importance === 'Crucial' ? '#FFE5CE' : '#FFFFFF',
                    color: skill.importance === 'Crucial' ? '#FE6904' : '#77736F',
                    border: '1px solid #EAE7E2',
                  }}>
                    {skill.importance}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#77736F' }}>
                  <span>{skill.category}</span>
                  <span>Target: Level {skill.targetLevel} / 5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Careers */}
      {career.relatedCareers && career.relatedCareers.length > 0 && (
        <div className="section">
          <h3 className="section-title">
            Related careers
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
            {career.relatedCareers.map((relId) => {
              const rel = CAREERS_DATA.find((c) => c.id === relId);
              if (!rel) return null;
              return (
                <div
                  key={rel.id}
                  onClick={() => onSelectCareer && onSelectCareer(rel.id)}
                  className="list-row"
                  style={{
                    padding: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: '#77736F' }}>{rel.category}</span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171717', margin: '2px 0' }}>{rel.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#171717', margin: 0 }}>{rel.avgSalary}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
