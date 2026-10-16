import React, { useState } from 'react';
import {
  UserCheck,
  ArrowRight,
  ArrowLeft,
  GitCompare,
  Lightbulb,
  Check
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { CAREERS_DATA } from '../../data/careersData';

export function Stage4Top5Suggestions({ onProceedToComparison, onBackToStage3 }) {
  const context = storageService.getStage1Context() || {};
  const preliminary = storageService.getStage3Preliminary() || {};
  const mentorReview = storageService.getStage4MentorReview() || {};

  const rawCareers = preliminary?.careers && preliminary.careers.length >= 5
    ? preliminary.careers.slice(0, 5)
    : CAREERS_DATA.slice(0, 5).map((c, idx) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        matchScore: 95 - idx * 4,
        whyFit: `Directly aligns with your interest in "${context.descriptiveInterests?.slice(0, 80) || 'problem solving'}" and your ${context.courseStream || 'technical'} coursework.`,
        keyStrengths: c.skills?.slice(0, 3) || ['Analytical Thinking', 'Problem Solving', 'Creativity'],
        skillsToDevelop: c.skills?.slice(3, 5) || ['Advanced System Design', 'Project Execution'],
        workExample: c.starterProjects?.[0]?.title || 'Build an interactive web application with structured APIs.',
      }));

  const [compareList, setCompareList] = useState(() => {
    return storageService.getCompareList() || [rawCareers[0]?.id, rawCareers[1]?.id].filter(Boolean);
  });

  const handleToggleCompare = (careerId) => {
    const updated = storageService.toggleCompareCareer(careerId);
    setCompareList(updated);
  };

  const handleContinue = () => {
    if (compareList.length < 2 && rawCareers.length >= 2) {
      storageService.toggleCompareCareer(rawCareers[0].id);
      storageService.toggleCompareCareer(rawCareers[1].id);
    }
    onProceedToComparison();
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '3px 12px',
            borderRadius: '999px',
            backgroundColor: '#ECFDF5',
            color: '#047857',
            border: '1px solid #A7F3D0',
          }}>
            Validated by {mentorReview.mentorName || 'Career Mentor'}
          </span>
        </div>

        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#171717',
          letterSpacing: '-0.02em',
          margin: '0 0 0.5rem 0',
        }}>
          Top 5 Personalized Career Suggestions
        </h2>
        <p style={{ fontSize: '1rem', color: '#77736F', margin: 0, maxWidth: '580px', marginInline: 'auto', lineHeight: '1.6' }}>
          Based on your background in <strong>{context.courseStream || 'your course'}</strong>, your descriptive interests, and your AI assessment.
        </p>
      </div>

      {/* Clean Spacious Career Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {rawCareers.map((career, idx) => {
          const isComparing = compareList.includes(career.id);

          return (
            <div
              key={career.id || idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: isComparing ? '2px solid #FE6904' : '1px solid #EAE7E2',
                boxShadow: '0 2px 12px rgba(23, 23, 23, 0.02)',
                padding: '2rem',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: idx === 0 ? '#FFE5CE' : '#F8F8F7',
                    color: idx === 0 ? '#FE6904' : '#171717',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                  }}>
                    #{idx + 1}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#171717' }}>
                        {career.title}
                      </h3>
                      {idx === 0 && (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor: '#ECFDF5',
                          color: '#047857',
                        }}>
                          Top Match
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#77736F' }}>
                      {career.description}
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FBFBFA',
                  border: '1px solid #EAE7E2',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  textAlign: 'right',
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#77736F', fontWeight: 600 }}>Affinity</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FE6904' }}>
                    {career.matchScore}%
                  </div>
                </div>
              </div>

              {/* Why It Fits Box */}
              <div style={{
                backgroundColor: '#FFF8F4',
                padding: '1.25rem',
                borderRadius: '14px',
                border: '1px solid #FFE5CE',
                marginBottom: '1.25rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Lightbulb size={16} color="#FE6904" />
                  <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#171717' }}>
                    Why This Fits Your Profile:
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: 0, lineHeight: '1.6' }}>
                  {career.whyFit}
                </p>
              </div>

              {/* Skills and Action Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                paddingTop: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#77736F' }}>Strengths:</span>
                  {career.keyStrengths?.slice(0, 3).map((st) => (
                    <span key={st} style={{
                      backgroundColor: '#F8F8F7',
                      border: '1px solid #EAE7E2',
                      padding: '3px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      color: '#374151',
                    }}>
                      {st}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleCompare(career.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: isComparing ? '2px solid #FE6904' : '1px solid #EAE7E2',
                    backgroundColor: isComparing ? '#FFE5CE' : '#FFFFFF',
                    color: isComparing ? '#FE6904' : '#171717',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isComparing ? <Check size={14} /> : <GitCompare size={14} />}
                  <span>{isComparing ? 'Selected for Comparison' : 'Compare Career'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1.5rem',
        borderTop: '1px solid #EAE7E2',
      }}>
        <button
          onClick={onBackToStage3}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #EAE7E2',
            padding: '10px 20px',
            borderRadius: '12px',
            color: '#171717',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Back to Mentor Meet
        </button>

        <button
          onClick={handleContinue}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FE6904',
            color: '#FFFFFF',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(254, 105, 4, 0.25)',
          }}
        >
          <span>Compare Careers Side-by-Side</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
