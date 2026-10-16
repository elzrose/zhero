import React from 'react';
import {
  ArrowLeft,
  Bookmark,
  GitCompare,
  Map,
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
  compareList,
  savedCareers,
  onToggleSaveCareer,
  onSelectCareer
}) {
  const career = CAREERS_DATA.find((c) => c.id === careerId) || CAREERS_DATA[0];
  const isSaved = savedCareers.includes(career.id);
  const isCompared = compareList.includes(career.id);

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: '#77736F',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Career Catalogue</span>
      </button>

      {/* Main Hero Header */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '2.25rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 24px rgba(23, 23, 23, 0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '9999px',
                background: '#FFE5CE',
                color: '#FE6904',
              }}>
                {career.category}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#77736F' }}>
                • {career.badge}
              </span>
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.03em', margin: 0 }}>
              {career.title}
            </h1>
          </div>

          {/* Quick Action Icons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onToggleSaveCareer(career.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
                background: isSaved ? '#FFE5CE' : '#FFFFFF',
                color: isSaved ? '#FE6904' : '#171717',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Bookmark size={15} fill={isSaved ? '#FE6904' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => onToggleCompareCareer(career.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
                background: isCompared ? '#FFE5CE' : '#FFFFFF',
                color: isCompared ? '#FE6904' : '#171717',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <GitCompare size={15} />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', color: '#77736F', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {career.description}
        </p>

        {/* 3 Metric Pills */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          padding: '1.25rem',
          borderRadius: '12px',
          background: '#F8F8F7',
          border: '1px solid #EAE7E2',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#77736F', fontWeight: 600 }}>Estimated Entry Salary</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', marginTop: '2px' }}>{career.avgSalary}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#77736F', fontWeight: 600 }}>Industry Growth Projection</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2E7D32', marginTop: '2px' }}>{career.growthRate}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#77736F', fontWeight: 600 }}>Cognitive Archetype</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FE6904', marginTop: '2px' }}>High Technical & Analytical</div>
          </div>
        </div>

        {/* Main CTA Bar */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1.75rem',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => onGenerateRoadmap(career.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.8rem 1.6rem',
              borderRadius: '10px',
              background: '#FE6904',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(254, 105, 4, 0.3)',
            }}
          >
            <Map size={17} />
            <span>Set as My Active Roadmap</span>
          </button>

          <button
            onClick={() => onAuditSkills(career.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.8rem 1.4rem',
              borderRadius: '10px',
              background: '#FFFFFF',
              color: '#171717',
              border: '1px solid #EAE7E2',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            <Sliders size={17} />
            <span>Audit My Skill Gaps</span>
          </button>
        </div>
      </div>

      {/* Two-Column Deep Dive */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Day in the Life & Starter Project */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} color="#FE6904" />
              <span>Typical Day on the Job</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#77736F', lineHeight: 1.6, margin: 0 }}>
              {career.typicalDay}
            </p>
          </div>

          {/* Starter Project */}
          {career.starterProject && (
            <div className="card" style={{ borderLeft: '4px solid #FE6904' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#FE6904', letterSpacing: '0.05em' }}>
                Recommended Beginner Capstone
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717', margin: '0.35rem 0' }}>
                {career.starterProject.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#77736F', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {career.starterProject.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#171717', fontWeight: 600 }}>
                <Clock size={14} color="#77736F" />
                <span>Estimated duration: {career.starterProject.timeEstimate}</span>
              </div>
            </div>
          )}

          {/* Education Pathways */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} color="#FE6904" />
              <span>Typical Education & Training Routes</span>
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#77736F', lineHeight: 1.7 }}>
              {career.educationPathways.map((path, pIdx) => (
                <li key={pIdx}>{path}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Required Skills Matrix */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#FE6904" />
            <span>Required Competencies & Target Levels</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#77736F', marginBottom: '1.25rem' }}>
            Skills employers look for when hiring entry-level to junior talent.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {career.requiredSkills.map((skill, sIdx) => (
              <div key={sIdx} style={{
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                background: '#F8F8F7',
                border: '1px solid #EAE7E2',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#171717' }}>{skill.name}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: skill.importance === 'Crucial' ? '#FFE5CE' : '#FFFFFF',
                    color: skill.importance === 'Crucial' ? '#FE6904' : '#77736F',
                    border: '1px solid #EAE7E2',
                  }}>
                    {skill.importance}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#77736F' }}>
                  <span>Category: {skill.category}</span>
                  <span>Target Proficiency: Level {skill.targetLevel} / 5</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onAuditSkills(career.id)}
            style={{
              width: '100%',
              marginTop: '1.5rem',
              padding: '0.75rem',
              borderRadius: '10px',
              backgroundColor: '#FFE5CE',
              color: '#FE6904',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Audit My Current Skill Gaps →
          </button>
        </div>
      </div>

      {/* Related Careers */}
      {career.relatedCareers && career.relatedCareers.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', marginBottom: '1rem' }}>
            Related Career Pathways
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {career.relatedCareers.map((relId) => {
              const rel = CAREERS_DATA.find((c) => c.id === relId);
              if (!rel) return null;
              return (
                <div
                  key={rel.id}
                  onClick={() => onSelectCareer(rel.id)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #EAE7E2',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(23, 23, 23, 0.04)',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: '#FE6904', fontWeight: 700 }}>{rel.category}</span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', margin: '4px 0' }}>{rel.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#77736F', margin: 0 }}>Avg: {rel.avgSalary}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
