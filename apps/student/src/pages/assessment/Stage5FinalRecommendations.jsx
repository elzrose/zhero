import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Check
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export function Stage5FinalRecommendations({ onProceedToRoadmap, onBackToStage4 }) {
  const preliminary = storageService.getStage3Preliminary();
  const simulations = storageService.getSimulationResults() || {};
  const mentorReview = storageService.getStage4MentorReview();

  const isHumanReviewed = mentorReview && mentorReview.isCompleted;

  // Student reaction map per career: 'interested' | 'unsure' | 'not_interested' | 'explore_further'
  const [careerFeedback, setCareerFeedback] = useState(() => {
    const existingFinal = storageService.getStage5Final();
    return existingFinal?.studentFeedback || {};
  });

  // Synthesize weighted ranking incorporating:
  // 1. AI base score
  // 2. Career simulation completion boost (+5% demonstrated evidence)
  // 3. Mentor endorsement (+8% human validation & alignment)
  const finalCareers = useMemo(() => {
    if (!preliminary?.careers) return [];

    const ranked = preliminary.careers.map((career) => {
      const hasSim = !!simulations[career.id];
      const isEndorsedByMentor = mentorReview?.endorsedCareerId === career.id;

      let adjustedScore = career.matchScore || 80;
      if (hasSim) adjustedScore = Math.min(96, adjustedScore + 5);
      if (isEndorsedByMentor) adjustedScore = Math.min(98, adjustedScore + 7);

      return {
        ...career,
        finalScore: adjustedScore,
        hasSimulationEvidence: hasSim,
        isEndorsedByMentor,
        mentorNote: isEndorsedByMentor
          ? mentorReview.mentorAgreementReason
          : 'Considered alongside primary recommendations during 1:1 counselling.',
      };
    });

    ranked.sort((a, b) => b.finalScore - a.finalScore);
    return ranked;
  }, [preliminary, simulations, mentorReview]);

  const [selectedPrimaryCareer, setSelectedPrimaryCareer] = useState(() => {
    return finalCareers[0]?.title || 'Full Stack Software Engineer';
  });

  const handleSetFeedback = (careerId, feedbackType) => {
    const updated = { ...careerFeedback, [careerId]: feedbackType };
    setCareerFeedback(updated);
  };

  const handleConfirmAndGoToRoadmap = () => {
    const finalReport = {
      primaryCareer: selectedPrimaryCareer,
      finalCareers,
      studentFeedback: careerFeedback,
      isHumanReviewed,
      generatedAt: new Date().toISOString(),
      counsellorName: mentorReview?.mentorName || 'Self-Guided Track',
    };

    // Save to storage
    storageService.saveStage5Final(finalReport);

    // Update the student profile career goal in existing storage
    storageService.updateCareerGoal(selectedPrimaryCareer);

    // Proceed to Stage 6 (Roadmap)
    onProceedToRoadmap(finalReport);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '999px',
            backgroundColor: isHumanReviewed ? '#ECFDF5' : '#FFFBEB',
            color: isHumanReviewed ? '#047857' : '#B45309',
            border: `1px solid ${isHumanReviewed ? '#A7F3D0' : '#FDE68A'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            {isHumanReviewed ? <UserCheck size={14} /> : <AlertCircle size={14} />}
            {isHumanReviewed
              ? 'Human Counsellor Validated & Synthesized'
              : 'Awaiting Human Review (Self-Guided Track)'}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#77736F' }}>
            Stage 5 of 6
          </span>
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#171717', margin: '0 0 8px 0' }}>
          Personalized Career Recommendations
        </h2>

        {/* Mandatory Philosophy message */}
        <p style={{
          fontSize: '0.925rem',
          color: '#4B5563',
          lineHeight: '1.6',
          margin: '0 0 1rem 0',
          backgroundColor: '#F8F8F7',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          borderLeft: '4px solid #FE6904',
        }}>
          "These recommendations are guidance for exploration, not a fixed judgement about your potential. Your interests and goals can change as you learn and gain experience."
        </p>

        {/* Evidence Breakdown Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #EAE7E2',
          fontSize: '0.8rem',
          color: '#171717',
        }}>
          <div>
            <span style={{ color: '#77736F' }}>Gemini AI Inquiry:</span> <strong>Verified</strong>
          </div>
          <div>
            <span style={{ color: '#77736F' }}>Simulation Evidence:</span>{' '}
            <strong>{Object.keys(simulations).length} task(s) completed</strong>
          </div>
          <div>
            <span style={{ color: '#77736F' }}>Counsellor Review:</span>{' '}
            <strong>{isHumanReviewed ? `Signed by ${mentorReview.mentorName}` : 'Optional'}</strong>
          </div>
        </div>
      </div>

      {/* Recommended Careers Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {finalCareers.map((career, idx) => {
          const feedback = careerFeedback[career.id] || 'interested';
          const isSelectedTarget = selectedPrimaryCareer === career.title;

          return (
            <div
              key={career.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: isSelectedTarget ? '2px solid #FE6904' : '1px solid #EAE7E2',
                boxShadow: isSelectedTarget
                  ? '0 6px 24px rgba(254, 105, 4, 0.1)'
                  : '0 2px 8px rgba(23, 23, 23, 0.02)',
                padding: '1.75rem',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Top Row: Rank, Title, Score */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#171717' }}>
                        {career.title}
                      </h3>
                      {career.isEndorsedByMentor && (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor: '#ECFDF5',
                          color: '#047857',
                          border: '1px solid #A7F3D0',
                        }}>
                          ★ Mentor Recommended
                        </span>
                      )}
                      {career.hasSimulationEvidence && (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor: '#EFF6FF',
                          color: '#1E40AF',
                        }}>
                          ✓ Evidence Validated
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#77736F' }}>
                      {career.description}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.725rem', color: '#77736F', fontWeight: 600 }}>Multi-Factor Affinity</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FE6904' }}>
                    {career.finalScore}%
                  </div>
                </div>
              </div>

              {/* Grid of Evidence Points */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
                margin: '1.25rem 0',
              }}>
                {/* Why It Suits Stated Interests */}
                <div style={{
                  backgroundColor: '#F8F8F7',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #EAE7E2',
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FE6904', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Interest Alignment & Evidence
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#171717', margin: 0, lineHeight: '1.5' }}>
                    {career.whyInterest}
                  </p>
                </div>

                {/* Counsellor Observations */}
                <div style={{
                  backgroundColor: '#F8F8F7',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #EAE7E2',
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Mentor Evaluation Note
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#171717', margin: 0, lineHeight: '1.5' }}>
                    {career.mentorNote}
                  </p>
                </div>

                {/* Growth Edges & Trade-offs */}
                <div style={{
                  backgroundColor: '#F8F8F7',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #EAE7E2',
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366F1', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Skills to Develop & Challenges
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#171717', margin: 0, lineHeight: '1.5' }}>
                    {career.challenges}
                  </p>
                </div>
              </div>

              {/* Student Reaction Toggles */}
              <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid #EAE7E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717' }}>Your Stance:</span>
                  {[
                    { id: 'interested', label: 'Interested' },
                    { id: 'unsure', label: 'Unsure' },
                    { id: 'not_interested', label: 'Not Interested' },
                    { id: 'explore_further', label: 'Want to Explore Further' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => handleSetFeedback(career.id, btn.id)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '999px',
                        border: feedback === btn.id ? '1.5px solid #FE6904' : '1px solid #EAE7E2',
                        backgroundColor: feedback === btn.id ? '#FFE5CE' : '#FFFFFF',
                        color: feedback === btn.id ? '#FE6904' : '#77736F',
                        fontSize: '0.75rem',
                        fontWeight: feedback === btn.id ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Primary target selector button */}
                <button
                  onClick={() => setSelectedPrimaryCareer(career.title)}
                  style={{
                    backgroundColor: isSelectedTarget ? '#171717' : '#FFFFFF',
                    color: isSelectedTarget ? '#FFFFFF' : '#171717',
                    border: isSelectedTarget ? 'none' : '1.5px solid #171717',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {isSelectedTarget ? <Check size={14} /> : null}
                  {isSelectedTarget ? 'Selected Focus Goal' : 'Set as Roadmap Goal'}
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
          onClick={onBackToStage4}
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
          <ArrowLeft size={16} /> Back to Counselling
        </button>

        <button
          onClick={handleConfirmAndGoToRoadmap}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FE6904',
            color: '#FFFFFF',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(254, 105, 4, 0.3)',
          }}
        >
          Connect to Dynamic Roadmap (Stage 6) <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
