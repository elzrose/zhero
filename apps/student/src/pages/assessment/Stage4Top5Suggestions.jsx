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
        keyStrengths: c.requiredSkills?.map((s) => s.name)?.slice(0, 3) || ['Analytical Thinking', 'Problem Solving', 'Creativity'],
        skillsToDevelop: c.requiredSkills?.map((s) => s.name)?.slice(3, 5) || ['Advanced System Design', 'Project Execution'],
        workExample: c.starterProject?.title || 'Build an interactive web application with structured APIs.',
      }));

  const [compareList, setCompareList] = useState(() => {
    const stored = storageService.getCompareList();
    if (stored && stored.length > 0) {
      const valid = stored.filter((id) => rawCareers.some((c) => c.id === id));
      if (valid.length >= 2) return valid.slice(0, 3);
    }
    const defaults = [rawCareers[0]?.id, rawCareers[1]?.id].filter(Boolean);
    storageService.setCompareList(defaults);
    return defaults;
  });

  const handleToggleCompare = (careerId) => {
    let updated;
    if (compareList.includes(careerId)) {
      if (compareList.length <= 1) return;
      updated = compareList.filter((id) => id !== careerId);
    } else {
      if (compareList.length >= 3) {
        updated = [compareList[1], compareList[2], careerId];
      } else {
        updated = [...compareList, careerId];
      }
    }
    setCompareList(updated);
    storageService.setCompareList(updated);
  };

  const handleContinue = () => {
    const listToSave = compareList.length >= 2
      ? compareList
      : [rawCareers[0]?.id, rawCareers[1]?.id].filter(Boolean);
    storageService.setCompareList(listToSave);
    onProceedToComparison();
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#171717',
          margin: '0 0 0.25rem 0',
        }}>
          Top 5 Career Suggestions
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#77736F', margin: 0 }}>
          Select at least two careers to compare side by side.
        </p>
      </div>

      {/* Clean Spacious Career Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {rawCareers.map((career, idx) => {
          const isComparing = compareList.includes(career.id);

          return (
            <div
              key={career.id || idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: isComparing ? '1px solid #FE6904' : '1px solid #EAE7E2',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: idx === 0 ? '#FFE5CE' : '#F8F8F7',
                    color: idx === 0 ? '#FE6904' : '#171717',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}>
                    #{idx + 1}
                  </div>

                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#171717' }}>
                      {career.title}
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#77736F' }}>
                      {career.description}
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#F8F8F7',
                  border: '1px solid #EAE7E2',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  textAlign: 'right',
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#77736F', fontWeight: 600 }}>Match</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FE6904' }}>
                    {career.matchScore}%
                  </div>
                </div>
              </div>

              {/* Why It Fits */}
              <div style={{
                backgroundColor: '#F8F8F7',
                padding: '0.875rem',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
                marginBottom: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Lightbulb size={14} color="#FE6904" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717' }}>
                    Why it fits:
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#77736F', margin: 0, lineHeight: '1.5' }}>
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
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#77736F' }}>Skills:</span>
                  {career.keyStrengths?.slice(0, 3).map((st) => (
                    <span key={st} style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EAE7E2',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      color: '#171717',
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
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: isComparing ? '1px solid #FE6904' : '1px solid #EAE7E2',
                    backgroundColor: isComparing ? '#FFE5CE' : '#FFFFFF',
                    color: isComparing ? '#FE6904' : '#171717',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {isComparing ? <Check size={14} /> : <GitCompare size={14} />}
                  <span>{isComparing ? 'Selected for comparison' : 'Compare'}</span>
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
            backgroundColor: '#FFFFFF',
            border: '1px solid #EAE7E2',
            padding: '8px 16px',
            borderRadius: '8px',
            color: '#171717',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          onClick={handleContinue}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FE6904',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          <span>Compare careers ({compareList.length})</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
