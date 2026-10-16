import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import { AssessmentStageTracker } from '../components/AssessmentStageTracker';
import { Stage1ContextConsent } from './assessment/Stage1ContextConsent';
import { Stage2GeminiConversation } from './assessment/Stage2GeminiConversation';
import { Stage3PreliminaryAnalysis } from './assessment/Stage3PreliminaryAnalysis';
import { Stage4VirtualCounselling } from './assessment/Stage4VirtualCounselling';
import { Stage5FinalRecommendations } from './assessment/Stage5FinalRecommendations';
import { storageService } from '../services/storageService';

export function AssessmentPage({ onCompleteAssessment, onCancel }) {
  const [currentStage, setCurrentStage] = useState(() => storageService.getAssessmentStage() || 1);
  const [completedStages, setCompletedStages] = useState(() => {
    const list = [];
    if (storageService.getStage1Context()) list.push(1);
    const conv = storageService.getStage2Conversation();
    if (conv && conv.filter((m) => m.sender === 'user').length >= 2) list.push(2);
    if (storageService.getStage3Preliminary()) list.push(3);
    const rev = storageService.getStage4MentorReview();
    if (rev && rev.isCompleted) list.push(4);
    if (storageService.getStage5Final()) list.push(5);
    return list;
  });

  const goToStage = (num) => {
    setCurrentStage(num);
    storageService.setAssessmentStage(num);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStage1Complete = (context) => {
    setCompletedStages((prev) => Array.from(new Set([...prev, 1])));
    goToStage(2);
  };

  const handleStage2Complete = () => {
    setCompletedStages((prev) => Array.from(new Set([...prev, 2])));
    goToStage(3);
  };

  const handleStage3Complete = () => {
    setCompletedStages((prev) => Array.from(new Set([...prev, 3])));
    goToStage(4);
  };

  const handleStage4Complete = () => {
    setCompletedStages((prev) => Array.from(new Set([...prev, 4])));
    goToStage(5);
  };

  const handleStage5Complete = (finalReport) => {
    setCompletedStages((prev) => Array.from(new Set([...prev, 5, 6])));
    storageService.setAssessmentStage(6);

    // If caller provided callback, notify with results
    if (onCompleteAssessment) {
      onCompleteAssessment(finalReport);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to restart your Career Assessment Journey from Stage 1?')) {
      storageService.resetAssessment();
      setCompletedStages([]);
      setCurrentStage(1);
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1040px', margin: '0 auto' }}>
      {/* Top Bar with Stage Tracker and Reset action */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '9999px',
                background: '#FFE5CE',
                color: '#FE6904',
              }}>
                Evidence-Based Career Guidance
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em', margin: '4px 0 0 0' }}>
              AI Assessment & Virtual Counselling Journey
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleReset}
              title="Reset assessment progress"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid #EAE7E2',
                backgroundColor: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#77736F',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} /> Restart Journey
            </button>

            {onCancel && (
              <button
                onClick={onCancel}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid #EAE7E2',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#171717',
                  cursor: 'pointer',
                }}
              >
                Save & Exit
              </button>
            )}
          </div>
        </div>

        {/* 6-Stage Progress Tracker */}
        <AssessmentStageTracker
          currentStage={currentStage}
          completedStages={completedStages}
          onStageClick={(num) => goToStage(num)}
        />
      </div>

      {/* Render Stage Component */}
      {currentStage === 1 && (
        <Stage1ContextConsent
          onProceed={handleStage1Complete}
        />
      )}

      {currentStage === 2 && (
        <Stage2GeminiConversation
          onProceedToStage3={handleStage2Complete}
          onBackToStage1={() => goToStage(1)}
        />
      )}

      {currentStage === 3 && (
        <Stage3PreliminaryAnalysis
          onProceedToStage4={handleStage3Complete}
          onBackToStage2={() => goToStage(2)}
        />
      )}

      {currentStage === 4 && (
        <Stage4VirtualCounselling
          onProceedToStage5={handleStage4Complete}
          onBackToStage3={() => goToStage(3)}
        />
      )}

      {currentStage === 5 && (
        <Stage5FinalRecommendations
          onProceedToRoadmap={handleStage5Complete}
          onBackToStage4={() => goToStage(4)}
        />
      )}

      {currentStage === 6 && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #EAE7E2',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: '#ECFDF5',
            color: '#047857',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
            Stage 6: Dynamic Roadmap Connected!
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#77736F', maxWidth: '520px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
            Your career preferences, Gemini AI assessment dialogue, simulation results, and counsellor feedback are now actively shaping your step-by-step milestones.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => goToStage(5)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: '1px solid #EAE7E2',
                backgroundColor: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#171717',
                cursor: 'pointer',
              }}
            >
              Review Recommendations
            </button>
            <button
              onClick={() => {
                if (onCompleteAssessment) onCompleteAssessment();
              }}
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#FE6904',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(254, 105, 4, 0.25)',
              }}
            >
              Open Active Roadmap →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
