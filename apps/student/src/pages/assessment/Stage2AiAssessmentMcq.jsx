import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ASSESSMENT_QUESTIONS } from '../../data/assessmentQuestions';
import { storageService } from '../../services/storageService';
import { aiAssessmentService } from '../../services/aiAssessmentService';

export function Stage2AiAssessmentMcq({ onProceedToMeet, onBackToStage1 }) {
  const context = storageService.getStage1Context() || {};
  const savedAnswers = storageService.getAssessmentAnswers() || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(savedAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = 10;
  const questionsToDisplay = ASSESSMENT_QUESTIONS.slice(0, totalQuestions);
  const currentQ = questionsToDisplay[currentIndex];
  const selectedOptionIndex = answers[currentQ.id];
  const answeredCount = Object.keys(answers).filter((k) => Number(k) <= totalQuestions).length;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);

  const dimensionScores = {
    analytical: 0,
    creative: 0,
    technical: 0,
    social: 0,
    practical: 0,
    organizational: 0,
  };

  questionsToDisplay.forEach((q) => {
    const chosenIdx = answers[q.id];
    if (chosenIdx !== undefined && q.options[chosenIdx]) {
      const scores = q.options[chosenIdx].scores || {};
      Object.keys(scores).forEach((dim) => {
        if (dimensionScores[dim] !== undefined) {
          dimensionScores[dim] += scores[dim] * 10;
        }
      });
    }
  });

  const handleSelectOption = (optIndex) => {
    const updated = { ...answers, [currentQ.id]: optIndex };
    setAnswers(updated);
    storageService.saveAssessmentAnswer(currentQ.id, optIndex);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      handleSubmitAssessment();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/gemini/analyze-mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentInfo: context,
          mcqAnswers: answers,
          dimensionScores,
        }),
      });

      let finalAnalysis = null;
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          finalAnalysis = {
            ...data.data,
            isAiPowered: true,
            model: data.modelUsed || 'gemini-2.5-flash',
            careers: data.data.top5Careers || [],
            synthesis: {
              explicitInterests: [context.descriptiveInterests],
              reportedSkills: [`Course: ${context.courseStream}`, `Class: ${context.classGrade}`],
              aiHypotheses: data.data.holisticProfile?.keyTheme || 'High Affinity for Problem Solving & Design',
            },
          };
        }
      }

      if (!finalAnalysis) {
        finalAnalysis = aiAssessmentService.generateFallbackAnalysis(context, []);
      }

      storageService.saveStage3Preliminary(finalAnalysis);
      setIsSubmitting(false);
      onProceedToMeet(finalAnalysis);
    } catch {
      const fallback = aiAssessmentService.generateFallbackAnalysis(context, []);
      storageService.saveStage3Preliminary(fallback);
      setIsSubmitting(false);
      onProceedToMeet(fallback);
    }
  };

  if (isSubmitting) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#77736F', margin: 0 }}>
          Analysing your answers…
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
      }}>
        <span style={{ fontSize: '0.85rem', color: '#77736F' }}>
          Assessment in progress
        </span>

        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FE6904' }}>
          Question {currentIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '3px',
        backgroundColor: '#EAE7E2',
        borderRadius: '9999px',
        overflow: 'hidden',
        marginBottom: '2rem',
      }}>
        <div style={{
          height: '100%',
          width: `${progressPct}%`,
          backgroundColor: '#FE6904',
          transition: 'width 0.2s ease',
        }} />
      </div>

      {/* Question Card */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
        <span style={{
          fontSize: '0.8rem',
          color: '#77736F',
          display: 'block',
          marginBottom: '0.5rem',
        }}>
          {currentQ.category}
        </span>

        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#171717',
          lineHeight: 1.4,
          margin: '0 0 1.5rem 0',
        }}>
          {currentQ.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentQ.options.map((opt, optIndex) => {
            const isSelected = selectedOptionIndex === optIndex;
            return (
              <button
                key={optIndex}
                type="button"
                onClick={() => handleSelectOption(optIndex)}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid #FE6904' : '1px solid #EAE7E2',
                  backgroundColor: isSelected ? '#FFE5CE' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '9999px',
                  border: isSelected ? '5px solid #FE6904' : '2px solid #EAE7E2',
                  backgroundColor: '#FFFFFF',
                  flexShrink: 0,
                }} />

                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 600 : 400,
                  color: '#171717',
                  lineHeight: 1.4,
                  flex: 1,
                }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          type="button"
          onClick={currentIndex === 0 ? onBackToStage1 : handlePrev}
          className="btn-secondary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} />
          <span>{currentIndex === 0 ? 'Intake' : 'Previous'}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={selectedOptionIndex === undefined}
          className="btn-primary"
          style={{
            padding: '0.65rem 1.5rem',
            fontSize: '0.875rem',
            opacity: selectedOptionIndex === undefined ? 0.5 : 1,
            cursor: selectedOptionIndex === undefined ? 'not-allowed' : 'pointer',
          }}
        >
          <span>{currentIndex === totalQuestions - 1 ? 'Submit' : 'Next'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
