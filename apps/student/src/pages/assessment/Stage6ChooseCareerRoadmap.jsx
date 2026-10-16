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
  const context = storageService.getStage1Context() || {};
  const preliminary = storageService.getStage3Preliminary() || {};
  const mentorReview = storageService.getStage4MentorReview() || {};

  const availableCareers = preliminary?.careers && preliminary.careers.length > 0
    ? preliminary.careers.slice(0, 5)
    : CAREERS_DATA.slice(0, 5);

  const [selectedCareerId, setSelectedCareerId] = useState(
    availableCareers[0]?.id || 'full-stack-engineer'
  );

  const chosenCareer = CAREERS_DATA.find((c) => c.id === selectedCareerId) || CAREERS_DATA[0];

  const handleConfirmCareer = () => {
    // 1. Update user profile target career
    storageService.updateCareerGoal(chosenCareer.title);

    // 2. Set active roadmap
    const roadmap = storageService.setRoadmapForCareer(chosenCareer.id);

    // 3. Complete Stage 6
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
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(23, 23, 23, 0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '999px',
            backgroundColor: '#FFE5CE',
            color: '#FE6904',
          }}>
            Stage 6 of 6: Career Commitment
          </span>
          <span style={{ fontSize: '0.8rem', color: '#77736F' }}>Final Decision</span>
        </div>

        <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#171717', margin: '0 0 8px 0' }}>
          Choose Your Career Direction
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
          You've explored your interests, completed your AI MCQ assessment, and discussed insights with a mentor. Now, pick the career pathway you want to pursue. ZHERO will immediately build your step-by-step learning roadmap!
        </p>
      </div>

      {/* Choice Selector Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {availableCareers.map((c) => {
          const isSelected = selectedCareerId === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCareerId(c.id)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: isSelected ? '2.5px solid #FE6904' : '1px solid #EAE7E2',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 6px 20px rgba(254, 105, 4, 0.12)' : '0 2px 6px rgba(23, 23, 23, 0.02)',
                position: 'relative',
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
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

              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 800, color: '#171717' }}>
                {c.title}
              </h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#77736F', lineHeight: '1.4' }}>
                {c.description?.slice(0, 95)}...
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '0.7rem',
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

      {/* Selected Career Confirmation Showcase Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1.5px solid #FE6904',
        padding: '2rem',
        boxShadow: '0 8px 30px rgba(254, 105, 4, 0.08)',
        marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '999px',
                backgroundColor: '#ECFDF5',
                color: '#047857',
                border: '1px solid #A7F3D0',
              }}>
                ✓ Confirmed Career Target
              </span>
              <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
                {chosenCareer.category}
              </span>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171717', margin: 0 }}>
              {chosenCareer.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#4B5563', margin: '6px 0 0 0', maxWidth: '640px' }}>
              {chosenCareer.description}
            </p>
          </div>

          <div style={{
            backgroundColor: '#FFE5CE',
            padding: '12px 18px',
            borderRadius: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 700 }}>Starting Compensation</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717' }}>
              {chosenCareer.salaryRange?.entry || '₹6.5 LPA'}
            </div>
          </div>
        </div>

        {/* What Happens Next Checklist */}
        <div style={{
          backgroundColor: '#F8F8F7',
          borderRadius: '14px',
          padding: '1.25rem',
          border: '1px solid #EAE7E2',
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171717', marginBottom: '8px' }}>
            What Happens When You Confirm:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '0.825rem', color: '#374151' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Sets {chosenCareer.title} as your primary goal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Unlocks personalized milestones & projects</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Generates Stage 6 dynamic learning roadmap</span>
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
            padding: '10px 18px',
            borderRadius: '10px',
            color: '#171717',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Back to Career Comparison
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
            padding: '14px 32px',
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
