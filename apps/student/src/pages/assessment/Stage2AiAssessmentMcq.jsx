import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { ASSESSMENT_QUESTIONS } from '../../data/assessmentQuestions';
import { storageService } from '../../services/storageService';
import { aiAssessmentService } from '../../services/aiAssessmentService';

export function Stage2AiAssessmentMcq({ onProceedToMeet, onBackToStage1 }) {
  const context = storageService.getStage1Context() || {};
  const savedAnswers = storageService.getAssessmentAnswers() || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(savedAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState('Evaluating cognitive dimensions...');
  const [apiStatus, setApiStatus] = useState({ configured: false, model: 'Checking...', provider: '' });

  useEffect(() => {
    aiAssessmentService.checkStatus().then((st) => setApiStatus(st));
  }, []);

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
    setLoadingText('Connecting student interests with Gemini 2.5 Flash...');

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
      <div style={{
        maxWidth: '680px',
        margin: '5rem auto',
        padding: '3.5rem 2rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #EAE7E2',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(23, 23, 23, 0.04)',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          backgroundColor: '#FFE5CE',
          color: '#FE6904',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          boxShadow: '0 8px 24px rgba(254, 105, 4, 0.25)',
        }}>
          <Sparkles size={32} style={{ animation: 'spin 2.5s linear infinite' }} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#171717', margin: '0 0 8px 0' }}>
          Gemini AI Career Analysis
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#77736F', maxWidth: '440px', margin: '0 auto', lineHeight: '1.6' }}>
          {loadingText}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Header & Engine Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: apiStatus.configured ? '#10B981' : '#F59E0B',
            boxShadow: apiStatus.configured ? '0 0 6px #10B981' : 'none',
          }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717' }}>
            {apiStatus.configured ? 'Gemini 2.5 Flash' : 'Local Heuristic Engine'}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#77736F' }}>
            • {context.courseStream || 'General Stream'}
          </span>
        </div>

        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FE6904' }}>
          Question {currentIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '4px',
        backgroundColor: '#EAE7E2',
        borderRadius: '999px',
        overflow: 'hidden',
        marginBottom: '2rem',
      }}>
        <div style={{
          height: '100%',
          width: `${progressPct}%`,
          backgroundColor: '#FE6904',
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Question Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #EAE7E2',
        padding: '2.5rem',
        boxShadow: '0 4px 20px rgba(23, 23, 23, 0.03)',
        marginBottom: '2rem',
      }}>
        {/* Category tag */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: '#FE6904',
          }}>
            {currentQ.category}
          </span>
        </div>

        {/* Question Text */}
        <h3 style={{
          fontSize: '1.35rem',
          fontWeight: 800,
          color: '#171717',
          lineHeight: '1.5',
          margin: '0 0 2rem 0',
        }}>
          {currentQ.question}
        </h3>

        {/* 4 Clean Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentQ.options.map((opt, optIndex) => {
            const isSelected = selectedOptionIndex === optIndex;
            return (
              <div
                key={optIndex}
                onClick={() => handleSelectOption(optIndex)}
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid #FE6904' : '1px solid #EAE7E2',
                  backgroundColor: isSelected ? '#FFF8F4' : '#FBFBFA',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: isSelected ? '6px solid #FE6904' : '2px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  flexShrink: 0,
                  transition: 'border 0.15s ease',
                }} />

                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#171717' : '#374151',
                  lineHeight: '1.5',
                  flex: 1,
                }}>
                  {opt.text}
                </div>

                {isSelected && (
                  <CheckCircle2 size={18} color="#FE6904" style={{ flexShrink: 0 }} />
                )}
              </div>
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
          onClick={currentIndex === 0 ? onBackToStage1 : handlePrev}
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
          <ArrowLeft size={16} />
          <span>{currentIndex === 0 ? 'Back to Intake' : 'Previous'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={selectedOptionIndex === undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: selectedOptionIndex === undefined ? '#EAE7E2' : '#FE6904',
            color: selectedOptionIndex === undefined ? '#77736F' : '#FFFFFF',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: selectedOptionIndex === undefined ? 'not-allowed' : 'pointer',
            boxShadow: selectedOptionIndex === undefined ? 'none' : '0 4px 16px rgba(254, 105, 4, 0.25)',
            transition: 'all 0.15s ease',
          }}
        >
          <span>{currentIndex === totalQuestions - 1 ? 'Analyze & Go to Meet' : 'Next Question'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
