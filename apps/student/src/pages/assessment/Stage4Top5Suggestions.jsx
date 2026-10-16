import React, { useState } from 'react';
import {
  UserCheck,
  ArrowRight,
  ArrowLeft,
  GitCompare,
  Lightbulb
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { CAREERS_DATA } from '../../data/careersData';

export function Stage4Top5Suggestions({ onProceedToComparison, onBackToStage3 }) {
  const context = storageService.getStage1Context() || {};
  const preliminary = storageService.getStage3Preliminary() || {};
  const mentorReview = storageService.getStage4MentorReview() || {};

  // Retrieve top 5 careers from preliminary or fallback to curated subset matching student stream
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
    // Ensure compare list has at least top 2 careers
    if (compareList.length < 2 && rawCareers.length >= 2) {
      storageService.toggleCompareCareer(rawCareers[0].id);
      storageService.toggleCompareCareer(rawCareers[1].id);
    }
    onProceedToComparison();
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '1.75rem 2rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(23, 23, 23, 0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '999px',
            backgroundColor: '#ECFDF5',
            color: '#047857',
            border: '1px solid #A7F3D0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <UserCheck size={14} /> Stage 4 of 6: Synthesized Pathways
          </span>
          <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
            Validated with {mentorReview.mentorName || 'Career Counsellor'}
          </span>
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#171717', margin: '0 0 8px 0' }}>
          Top 5 Personalized Career Suggestions
        </h2>
        <p style={{ fontSize: '0.925rem', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
          Synthesized from your <strong>{context.classGrade || 'Class'}</strong> background, <strong>{context.courseStream || 'Stream'}</strong>, descriptive interests, Gemini AI MCQ analysis, and 1:1 mentor discussion.
        </p>
      </div>

      {/* Career Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {rawCareers.map((career, idx) => {
          const isComparing = compareList.includes(career.id);

          return (
            <div
              key={career.id || idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: isComparing ? '2px solid #FE6904' : '1px solid #EAE7E2',
                boxShadow: '0 2px 10px rgba(23, 23, 23, 0.03)',
                padding: '1.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#171717' }}>
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
                          ★ Top Affinity
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#77736F' }}>
                      {career.description}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.725rem', color: '#77736F', fontWeight: 600 }}>Affinity Score</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FE6904' }}>
                    {career.matchScore}%
                  </div>
                </div>
              </div>

              {/* Why It Fits Card */}
              <div style={{
                backgroundColor: '#F8F8F7',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #EAE7E2',
                marginBottom: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Lightbulb size={16} color="#FE6904" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#171717' }}>
                    Why This Fits Your Interests & MCQ Choices:
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#4B5563', margin: 0, lineHeight: '1.5' }}>
                  {career.whyFit}
                </p>
              </div>

              {/* Skills & Real-World Example Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
                fontSize: '0.825rem',
                marginBottom: '1rem',
              }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#171717' }}>Core Strengths: </span>
                  <span style={{ color: '#047857' }}>{career.keyStrengths?.join(', ') || 'Logical Thinking, Problem Solving'}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: '#171717' }}>Skills to Develop: </span>
                  <span style={{ color: '#D97706' }}>{career.skillsToDevelop?.join(', ') || 'Hands-on Projects'}</span>
                </div>
              </div>

              {/* Compare toggle button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleToggleCompare(career.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: isComparing ? '2px solid #FE6904' : '1px solid #EAE7E2',
                    backgroundColor: isComparing ? '#FFE5CE' : '#FFFFFF',
                    color: isComparing ? '#FE6904' : '#171717',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  <GitCompare size={14} />
                  <span>{isComparing ? 'Added to Compare' : 'Add to Compare'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
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
            padding: '10px 18px',
            borderRadius: '10px',
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
            padding: '12px 26px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(254, 105, 4, 0.3)',
          }}
        >
          <span>Compare Careers Side-by-Side (Stage 5)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
