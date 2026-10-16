import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ASSESSMENT_QUESTIONS } from '../data/assessmentQuestions';
import { storageService } from '../services/storageService';

export function AssessmentPage({ onCompleteAssessment, onCancel }) {
  const [answers, setAnswers] = useState(() => storageService.getAssessmentAnswers());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('Scoring cognitive dimensions...');

  const currentQ = ASSESSMENT_QUESTIONS[currentIndex];
  const totalQ = ASSESSMENT_QUESTIONS.length;
  const progressPct = Math.round(((currentIndex + 1) / totalQ) * 100);
  const selectedOptionIndex = answers[currentQ.id];

  const handleSelectOption = (optIndex) => {
    const updated = { ...answers, [currentQ.id]: optIndex };
    setAnswers(updated);
    storageService.saveAssessmentAnswer(currentQ.id, optIndex);
  };

  const handleNext = () => {
    if (currentIndex < totalQ - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Final submission
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setLoadingStepText('Evaluating analytical, creative, and technical weightings...');

    setTimeout(() => {
      setLoadingStepText('Cross-referencing 18+ emerging career taxonomies...');
    }, 600);

    setTimeout(() => {
      const results = storageService.completeAssessment(answers);
      setIsSubmitting(false);
      onCompleteAssessment(results);
    }, 1400);
  };

  if (isSubmitting) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #FE6904 0%, #FA9B2A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 24px rgba(254, 105, 4, 0.35)',
          animation: 'pulse 1.5s infinite',
        }}>
          <Sparkles size={32} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em', margin: 0 }}>
          Calculating Career Affinity
        </h2>
        <p style={{ fontSize: '1rem', color: '#77736F', marginTop: '0.5rem', maxWidth: '400px' }}>
          {loadingStepText}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Top Header & Progress */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '9999px',
              background: '#FFE5CE',
              color: '#FE6904',
            }}>
              {currentQ.category}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
              • {currentQ.dimensionName}
            </span>
          </div>

          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
            Question {currentIndex + 1} of {totalQ}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: '#EAE7E2', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            width: `${progressPct}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FE6904 0%, #FA9B2A 100%)',
            borderRadius: '9999px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Question Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '2.25rem',
        boxShadow: '0 4px 24px rgba(23, 23, 23, 0.04)',
        marginBottom: '2rem',
      }}>
        <h2 style={{
          fontSize: '1.35rem',
          fontWeight: 700,
          color: '#171717',
          lineHeight: 1.45,
          marginBottom: '1.75rem',
        }}>
          {currentQ.question}
        </h2>

        {/* 4 Interactive Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {currentQ.options.map((opt, oIdx) => {
            const isSelected = selectedOptionIndex === oIdx;
            return (
              <div
                key={oIdx}
                onClick={() => handleSelectOption(oIdx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #FE6904' : '1px solid #EAE7E2',
                  background: isSelected ? '#FFE5CE' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 10px rgba(254, 105, 4, 0.15)' : 'none',
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: isSelected ? 'none' : '2px solid #D6D2CC',
                  backgroundColor: isSelected ? '#FE6904' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  flexShrink: 0,
                }}>
                  {isSelected ? <CheckCircle2 size={16} /> : String.fromCharCode(65 + oIdx)}
                </div>

                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#171717' : '#333333',
                  lineHeight: 1.4,
                }}>
                  {opt.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid #EAE7E2',
            background: '#FFFFFF',
            color: currentIndex === 0 ? '#C4C0BA' : '#171717',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: '#77736F',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Save & Exit
          </button>

          <button
            onClick={handleNext}
            disabled={selectedOptionIndex === undefined}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              background: selectedOptionIndex === undefined ? '#EAE7E2' : '#FE6904',
              color: selectedOptionIndex === undefined ? '#77736F' : '#FFFFFF',
              cursor: selectedOptionIndex === undefined ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              fontWeight: 700,
              boxShadow: selectedOptionIndex === undefined ? 'none' : '0 4px 14px rgba(254, 105, 4, 0.3)',
            }}
          >
            <span>{currentIndex === totalQ - 1 ? 'Finish Assessment' : 'Next Question'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
