import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { AssessmentStageTracker } from '../components/AssessmentStageTracker';
import { Stage1ClassAndInterests } from './assessment/Stage1ClassAndInterests';
import { Stage2AiAssessmentMcq } from './assessment/Stage2AiAssessmentMcq';
import { Stage3MentorMeet } from './assessment/Stage3MentorMeet';
import { Stage4Top5Suggestions } from './assessment/Stage4Top5Suggestions';
import { Stage5CareerComparison } from './assessment/Stage5CareerComparison';
import { Stage6ChooseCareerRoadmap } from './assessment/Stage6ChooseCareerRoadmap';
import { storageService } from '../services/storageService';

export function AssessmentPage({ onCompleteAssessment, onCancel }) {
  const [currentStage, setCurrentStage] = useState(() => storageService.getAssessmentStage() || 1);
  const [completedStages, setCompletedStages] = useState(() => {
    const list = [];
    if (storageService.getStage1Context()) list.push(1);
    const ans = storageService.getAssessmentAnswers();
    if (ans && Object.keys(ans).length >= 5) list.push(2);
    const rev = storageService.getStage4MentorReview();
    if (rev && rev.isCompleted) list.push(3);
    if (storageService.getStage3Preliminary()) list.push(4);
    if (storageService.getCompareList()?.length >= 2) list.push(5);
    if (storageService.getStage5Final()) list.push(6);
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

  const handleStage2Complete = (analysis) => {
    setCompletedStages((prev) => Array.from(new Set([...prev, 2])));
    goToStage(3);
  };

  const handleStage3Complete = (mentorReview) => {
    setCompletedStages((prev) => Array.from(new Set([...prev, 3])));
    goToStage(4);
  };

  const handleStage4Complete = () => {
    setCompletedStages((prev) => Array.from(new Set([...prev, 4])));
    goToStage(5);
  };

  const handleStage5Complete = () => {
    setCompletedStages((prev) => Array.from(new Set([...prev, 5])));
    goToStage(6);
  };

  const handleStage6Complete = (finalReport) => {
    setCompletedStages((prev) => Array.from(new Set([...prev, 6])));
    storageService.setAssessmentStage(6);

    if (onCompleteAssessment) {
      onCompleteAssessment(finalReport);
    }
  };

  const handleReset = () => {
    if (window.confirm('Restart your Career Discovery Journey from Stage 1?')) {
      storageService.resetAssessment();
      setCompletedStages([]);
      setCurrentStage(1);
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1040px', margin: '0 auto' }}>
      {/* Top Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem', gap: '8px' }}>
        <button
          onClick={handleReset}
          title="Restart from Stage 1"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '10px',
            border: '1px solid #EAE7E2',
            backgroundColor: '#FFFFFF',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#77736F',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={13} /> Restart
        </button>

        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: '6px 14px',
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

      {/* 6-Stage Progress Tracker */}
      <AssessmentStageTracker
        currentStage={currentStage}
        completedStages={completedStages}
        onStageClick={(num) => goToStage(num)}
      />

      {/* Render Current Stage */}
      {currentStage === 1 && (
        <Stage1ClassAndInterests
          onProceed={handleStage1Complete}
        />
      )}

      {currentStage === 2 && (
        <Stage2AiAssessmentMcq
          onProceedToMeet={handleStage2Complete}
          onBackToStage1={() => goToStage(1)}
        />
      )}

      {currentStage === 3 && (
        <Stage3MentorMeet
          onProceedToTop5={handleStage3Complete}
          onBackToStage2={() => goToStage(2)}
        />
      )}

      {currentStage === 4 && (
        <Stage4Top5Suggestions
          onProceedToComparison={handleStage4Complete}
          onBackToStage3={() => goToStage(3)}
        />
      )}

      {currentStage === 5 && (
        <Stage5CareerComparison
          onProceedToChoose={handleStage5Complete}
          onBackToStage4={() => goToStage(4)}
        />
      )}

      {currentStage === 6 && (
        <Stage6ChooseCareerRoadmap
          onFinalChoiceConfirmed={handleStage6Complete}
          onBackToStage5={() => goToStage(5)}
        />
      )}
    </div>
  );
}
