import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { CAREERS_DATA } from '../../data/careersData';

export function Stage6ChooseCareerRoadmap({ onFinalChoiceConfirmed, onBackToStage5 }) {
  const preliminary = storageService.getStage3Preliminary() || {};
  const mentorReview = storageService.getStage4MentorReview() || {};

  const availableCareers = preliminary?.careers && preliminary.careers.length > 0
    ? preliminary.careers.slice(0, 5)
    : CAREERS_DATA.slice(0, 5);

  const selectedCareer = availableCareers.find((c) => c.id === selectedCareerId) || availableCareers[0];
  const matchedCd = CAREERS_DATA.find((cd) => 
    cd.id === selectedCareerId || 
    (selectedCareer?.title && cd.title.toLowerCase() === selectedCareer.title.toLowerCase())
  );

  const chosenCareer = {
    ...(matchedCd || CAREERS_DATA[0]),
    ...(selectedCareer || {}),
    id: selectedCareer?.id || matchedCd?.id || 'career-choice',
    title: selectedCareer?.title || matchedCd?.title || 'Selected Career',
  };

  const handleConfirmCareer = () => {
    storageService.updateCareerGoal(chosenCareer.title);
    const roadmap = storageService.setRoadmapForCareer(chosenCareer.id);

    const finalReport = {
      primaryCareer: chosenCareer.title,
      careerId: chosenCareer.id,
      roadmap,
      mentorName: mentorReview.mentorName || 'Career Counsellor',
      confirmedAt: new Date().toISOString(),
    };

    storageService.saveStage5Final(finalReport);
    onFinalChoiceConfirmed(finalReport);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#171717',
          letterSpacing: '-0.02em',
          margin: '0 0 0.5rem 0',
        }}>
          Choose Your Career Direction
        </h2>
        <p style={{ fontSize: '1rem', color: '#77736F', margin: 0, maxWidth: '580px', marginInline: 'auto', lineHeight: '1.6' }}>
          Select the career you want to commit to. ZHERO will instantly build and activate your personalized step-by-step learning roadmap.
        </p>
      </div>

      {/* Choice Selector Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        {availableCareers.map((c) => {
          const isSelected = selectedCareerId === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCareerId(c.id)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: isSelected ? '2.5px solid #FE6904' : '1px solid #EAE7E2',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 6px 20px rgba(254, 105, 4, 0.1)' : '0 2px 6px rgba(23, 23, 23, 0.02)',
                position: 'relative',
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  backgroundColor: '#FE6904',
                  color: '#FFFFFF',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Check size={14} />
                </div>
              )}

              <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 800, color: '#171717' }}>
                {c.title}
              </h4>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.825rem', color: '#6B7280', lineHeight: '1.5' }}>
                {c.description?.slice(0, 95)}...
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: isSelected ? '#FFE5CE' : '#F8F8F7',
                  color: isSelected ? '#FE6904' : '#171717',
                }}>
                  {c.matchScore ? `${c.matchScore}% Match` : 'Recommended'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Career Confirmation Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #FE6904',
        padding: '2.5rem',
        boxShadow: '0 8px 30px rgba(254, 105, 4, 0.08)',
        marginBottom: '2.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '3px 12px',
                borderRadius: '999px',
                backgroundColor: '#ECFDF5',
                color: '#047857',
                border: '1px solid #A7F3D0',
              }}>
                Target Career Choice
              </span>
              <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
                {chosenCareer.category}
              </span>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#171717', margin: 0 }}>
              {chosenCareer.title}
            </h3>
            <p style={{ fontSize: '0.925rem', color: '#4B5563', margin: '8px 0 0 0', maxWidth: '640px', lineHeight: '1.6' }}>
              {chosenCareer.description}
            </p>
          </div>

          <div style={{
            backgroundColor: '#FFE5CE',
            padding: '14px 22px',
            borderRadius: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 700 }}>Starting Compensation</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#171717' }}>
              {chosenCareer.salaryRange?.entry || '₹6.5 LPA'}
            </div>
          </div>
        </div>

        {/* Immediate Roadmap Unlock Benefits */}
        <div style={{
          backgroundColor: '#FBFBFA',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #EAE7E2',
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#171717', marginBottom: '10px' }}>
            What Happens Next:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.85rem', color: '#374151' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Sets {chosenCareer.title} as active focus</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Unlocks step-by-step learning milestones</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Tailors practical starter projects</span>
            </div>
          </div>
        </div>
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
          onClick={onBackToStage5}
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
          <ArrowLeft size={16} /> Back to Comparison
        </button>

        <button
          onClick={handleConfirmCareer}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FE6904',
            color: '#FFFFFF',
            border: 'none',
            padding: '14px 36px',
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '1.05rem',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(254, 105, 4, 0.35)',
          }}
        >
          <span>Confirm Career & Launch Active Roadmap</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
