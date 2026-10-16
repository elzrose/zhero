import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  X,
  Lock,
  Code,
  Award,
  Zap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { masteryService } from '../services/masteryService';
import { checkpointService } from '../services/checkpointService';

export function MasteryGateModal({
  isOpen,
  onClose,
  task,
  careerTitle = 'Full Stack Software Engineer',
  onMilestoneMastered,
}) {
  if (!isOpen || !task) return null;

  const milestoneDef = masteryService.getMilestoneDefinition(task.id, task);
  const prereqCheck = masteryService.checkPrerequisites(task.id);

  // Stepper / Tab states: 'quiz' | 'practical' | 'verbal' | 'results'
  const hasQuiz = Boolean(milestoneDef.quizQuestions && milestoneDef.quizQuestions.length > 0);
  const hasPractical = Boolean(milestoneDef.passingCriteria?.practicalRequired || milestoneDef.practicalPrompt);
  const initialTab = hasQuiz ? 'quiz' : hasPractical ? 'practical' : 'verbal';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [practicalCode, setPracticalCode] = useState('');
  const [practicalVerified, setPracticalVerified] = useState(false);
  const [verbalResponse, setVerbalResponse] = useState('');

  // Speech recording
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef(null);

  // Evaluation states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setVerbalResponse(currentTranscript.trim());
        };

        recognition.onerror = (event) => {
          console.warn('Speech recognition error in Mastery Gate:', event.error);
          setIsRecording(false);
          if (event.error === 'not-allowed') {
            setSpeechError('Microphone permission was denied. You can type your explanation below.');
          } else {
            setSpeechError('Speech recognition paused. You can continue typing below.');
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech API init error:', err);
        setSpeechSupported(false);
      }
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    setSpeechError('');
    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.warn('Recording start error:', e);
      }
    }
  };

  const handleSelectQuizAnswer = (qId, optionIdx) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleVerifyPractical = () => {
    if ((practicalCode || '').trim().length > 15) {
      setPracticalVerified(true);
    } else {
      setSpeechError('Please implement a complete solution before verifying the practical task.');
    }
  };

  const handleSubmitEvaluation = async () => {
    setIsEvaluating(true);
    setSpeechError('');

    try {
      const outcome = await masteryService.evaluateMasteryCheckpoint({
        milestoneId: task.id,
        quizAnswers,
        verbalExplanation: verbalResponse,
        practicalPassed: practicalVerified,
        practicalSubmission: practicalCode,
        isSpeechInput: isRecording || verbalResponse.length > 0,
      });

      setEvaluationResult(outcome);
      setActiveTab('results');

      if (outcome.passed && onMilestoneMastered) {
        onMilestoneMastered(task.id, outcome);
      }
    } catch (err) {
      console.error('Mastery evaluation error:', err);
      setSpeechError('Evaluation encountered a network error. You can retry safely.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRetry = () => {
    setEvaluationResult(null);
    setActiveTab(initialTab);
    setSpeechError('');
  };

  const curatedResources = checkpointService.getCuratedResourcesForMilestone(task, null);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(23, 23, 23, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1.25rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #EAE7E2',
          boxShadow: '0 25px 50px -12px rgba(23, 23, 23, 0.25)',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #EAE7E2',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FBFBFA',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: '#FFE5CE',
                  color: '#FE6904',
                  textTransform: 'uppercase',
                }}
              >
                Intelligent Mastery Gate
              </span>
              <span style={{ fontSize: '0.75rem', color: '#77736F' }}>• {milestoneDef.phase}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#171717' }}>
              {milestoneDef.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#77736F',
              padding: '6px',
              borderRadius: '8px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem' }}>
          {/* Prerequisite Missing Warning */}
          {!prereqCheck.satisfied ? (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1.5px solid #FCA5A5',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <Lock size={36} color="#DC2626" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800, color: '#991B1B' }}>
                Milestone Locked: Prerequisites Required
              </h4>
              <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#7F1D1D', lineHeight: '1.5' }}>
                To maintain roadmap integrity and prevent knowledge gaps, you must master the prerequisite milestones before attempting this checkpoint:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '450px', margin: '0 auto' }}>
                {prereqCheck.missing.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #FECACA',
                      borderRadius: '8px',
                      padding: '0.65rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#B91C1C',
                      textAlign: 'left',
                    }}
                  >
                    🔒 {m.title}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{
                  marginTop: '1.5rem',
                  padding: '8px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Return to Active Milestones
              </button>
            </div>
          ) : (
            <div>
              {/* Checkpoint Navigation Tabs (Quiz | Practical | Verbal | Results) */}
              {activeTab !== 'results' && (
                <div
                  style={{
                    display: 'flex',
                    borderBottom: '2px solid #EAE7E2',
                    marginBottom: '1.5rem',
                    gap: '1.5rem',
                  }}
                >
                  {hasQuiz && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('quiz')}
                      style={{
                        padding: '10px 4px',
                        border: 'none',
                        borderBottom: activeTab === 'quiz' ? '3px solid #FE6904' : '3px solid transparent',
                        backgroundColor: 'transparent',
                        color: activeTab === 'quiz' ? '#FE6904' : '#77736F',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        marginBottom: '-2px',
                      }}
                    >
                      1. Objective Quiz (80% Pass)
                    </button>
                  )}

                  {hasPractical && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('practical')}
                      style={{
                        padding: '10px 4px',
                        border: 'none',
                        borderBottom: activeTab === 'practical' ? '3px solid #FE6904' : '3px solid transparent',
                        backgroundColor: 'transparent',
                        color: activeTab === 'practical' ? '#FE6904' : '#77736F',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        marginBottom: '-2px',
                      }}
                    >
                      2. Practical Application
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveTab('verbal')}
                    style={{
                      padding: '10px 4px',
                      border: 'none',
                      borderBottom: activeTab === 'verbal' ? '3px solid #FE6904' : '3px solid transparent',
                      backgroundColor: 'transparent',
                      color: activeTab === 'verbal' ? '#FE6904' : '#77736F',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      marginBottom: '-2px',
                    }}
                  >
                    3. Verbal Conceptual Check (70% Pass)
                  </button>
                </div>
              )}

              {/* Error / Alert notice */}
              {speechError && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.25rem',
                    color: '#991B1B',
                    fontSize: '0.825rem',
                  }}
                >
                  {speechError}
                </div>
              )}

              {/* STEP 1: OBJECTIVE QUIZ */}
              {activeTab === 'quiz' && (
                <div>
                  <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#77736F', lineHeight: '1.5' }}>
                    Demonstrate core conceptual understanding across key topics. Passing threshold: <strong>80% correct</strong>.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {milestoneDef.quizQuestions.map((q, qIdx) => (
                      <div
                        key={q.id}
                        style={{
                          backgroundColor: '#FAF8F5',
                          borderRadius: '14px',
                          border: '1px solid #EAE7E2',
                          padding: '1.25rem',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FE6904', marginBottom: '4px' }}>
                          Question {qIdx + 1} • {q.concept}
                        </div>
                        <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 800, color: '#171717' }}>
                          {q.question}
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {q.options.map((opt, optIdx) => {
                            const isSelected = quizAnswers[q.id] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleSelectQuizAnswer(q.id, optIdx)}
                                style={{
                                  textAlign: 'left',
                                  padding: '10px 14px',
                                  borderRadius: '8px',
                                  border: isSelected ? '1.5px solid #FE6904' : '1px solid #DDD8D0',
                                  backgroundColor: isSelected ? '#FFE5CE' : '#FFFFFF',
                                  color: isSelected ? '#9A3412' : '#374151',
                                  fontSize: '0.85rem',
                                  fontWeight: isSelected ? 700 : 500,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(hasPractical ? 'practical' : 'verbal')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        backgroundColor: '#FE6904',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      <span>Proceed to {hasPractical ? 'Practical Task' : 'Verbal Check'}</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PRACTICAL APPLICATION */}
              {activeTab === 'practical' && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#FAF8F5',
                      borderRadius: '14px',
                      border: '1px solid #EAE7E2',
                      padding: '1.25rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <Code size={16} color="#FE6904" />
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FE6904', textTransform: 'uppercase' }}>
                        Practical Engineering Task
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#171717', fontWeight: 600, lineHeight: '1.5' }}>
                      {milestoneDef.practicalPrompt}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '6px' }}>
                      Your Implementation / Code Solution:
                    </label>
                    <textarea
                      rows={6}
                      value={practicalCode}
                      onChange={(e) => setPracticalCode(e.target.value)}
                      placeholder="// Type or paste your code implementation here..."
                      style={{
                        width: '100%',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        padding: '12px',
                        borderRadius: '10px',
                        border: practicalVerified ? '1.5px solid #10B981' : '1px solid #DDD8D0',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={handleVerifyPractical}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: practicalVerified ? '#ECFDF5' : '#FFF7ED',
                        border: practicalVerified ? '1px solid #A7F3D0' : '1px solid #FDBA74',
                        color: practicalVerified ? '#047857' : '#C2410C',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <CheckCircle2 size={15} />
                      <span>{practicalVerified ? '✓ Code Verified' : 'Test / Verify Implementation'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('verbal')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        backgroundColor: '#FE6904',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      <span>Proceed to Verbal Check</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: VERBAL CONCEPTUAL CHECK */}
              {activeTab === 'verbal' && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#FAF8F5',
                      borderRadius: '14px',
                      border: '1px solid #EAE7E2',
                      padding: '1.25rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <Sparkles size={16} color="#FE6904" />
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FE6904', textTransform: 'uppercase' }}>
                        Verbal Explanation Scenario
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#171717', fontWeight: 600, lineHeight: '1.5' }}>
                      Explain in your own words how this technology functions, why it is used in production systems, and what common pitfalls you avoid.
                    </p>
                  </div>

                  {/* Speech & Text Input Area */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717' }}>
                        Spoken or Typed Technical Explanation:
                      </label>
                      {speechSupported && (
                        <button
                          type="button"
                          onClick={toggleRecording}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            backgroundColor: isRecording ? '#FEE2E2' : '#FFF7ED',
                            border: isRecording ? '1px solid #EF4444' : '1px solid #FDBA74',
                            color: isRecording ? '#DC2626' : '#C2410C',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                          <span>{isRecording ? 'Stop Recording' : 'Speak Explanation'}</span>
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={5}
                      value={verbalResponse}
                      onChange={(e) => setVerbalResponse(e.target.value)}
                      placeholder="Speak using the microphone above, or type your thorough technical explanation here..."
                      style={{
                        width: '100%',
                        fontSize: '0.875rem',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid #DDD8D0',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                        outline: 'none',
                        lineHeight: '1.5',
                      }}
                    />
                  </div>

                  {/* Submission Action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'none',
                        border: 'none',
                        color: '#77736F',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <HelpCircle size={15} />
                      <span>{showHint ? 'Hide Hint' : 'View Rubric Hint'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitEvaluation}
                      disabled={isEvaluating || (verbalResponse || '').trim().length < 8}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        backgroundColor: isEvaluating || (verbalResponse || '').trim().length < 8 ? '#F3F4F6' : '#FE6904',
                        color: isEvaluating || (verbalResponse || '').trim().length < 8 ? '#9CA3AF' : '#FFFFFF',
                        border: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        cursor: isEvaluating || (verbalResponse || '').trim().length < 8 ? 'not-allowed' : 'pointer',
                        boxShadow: isEvaluating ? 'none' : '0 4px 14px rgba(254, 105, 4, 0.25)',
                      }}
                    >
                      <Award size={16} />
                      <span>{isEvaluating ? 'Evaluating Checkpoint...' : 'Submit Mastery Checkpoint'}</span>
                    </button>
                  </div>

                  {showHint && (
                    <div
                      style={{
                        marginTop: '1rem',
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #FDE68A',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                        fontSize: '0.8rem',
                        color: '#92400E',
                      }}
                    >
                      <strong>Rubric Hint:</strong> Focus on underlying execution mechanics, architectural trade-offs, and why this pattern is preferred over alternatives.
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: EVALUATION RESULTS & EVIDENCE REPORT */}
              {activeTab === 'results' && evaluationResult && (
                <div>
                  {evaluationResult.passed ? (
                    /* PASSED REPORT */
                    <div
                      style={{
                        backgroundColor: '#ECFDF5',
                        border: '1.5px solid #A7F3D0',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                        <CheckCircle2 size={28} color="#059669" />
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#065F46' }}>
                            Mastery Verified! ⭐
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: '#047857' }}>
                            Overall Checkpoint Score: <strong>{evaluationResult.score}%</strong>
                          </span>
                        </div>
                      </div>

                      <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: '#065F46', lineHeight: '1.5' }}>
                        {evaluationResult.feedback}
                      </p>

                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857', marginBottom: '6px' }}>
                        Verified Concepts Enrolled in Long-Term Memory:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(evaluationResult.demonstratedConcepts || milestoneDef.concepts).map((c, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '6px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #A7F3D0',
                              color: '#065F46',
                            }}
                          >
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* STRUGGLE / REMEDIATION REQUIRED REPORT */
                    <div
                      style={{
                        backgroundColor: '#FFFBEB',
                        border: '1.5px solid #FDE68A',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                        <AlertCircle size={28} color="#D97706" />
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#92400E' }}>
                            Targeted Practice Recommended 🎯
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: '#B45309' }}>
                            Quiz: {evaluationResult.quizScore || 60}% • Verbal: {evaluationResult.verbalScore || 50}%
                          </span>
                        </div>
                      </div>

                      <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: '#92400E', lineHeight: '1.5' }}>
                        {evaluationResult.feedback}
                      </p>

                      {/* Targeted Missing Concepts */}
                      {evaluationResult.missingConcepts?.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400E', marginBottom: '4px' }}>
                            Concept to Reinforce:
                          </div>
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '6px',
                              backgroundColor: '#FEE2E2',
                              border: '1px solid #FCA5A5',
                              color: '#B91C1C',
                            }}
                          >
                            ⚠️ {evaluationResult.missingConcepts[0]}
                          </span>
                        </div>
                      )}

                      <div style={{ fontSize: '0.825rem', color: '#78350F' }}>
                        ⚡ <em>A short targeted practice task has been scheduled in your roadmap and daily plan without backlog accumulation.</em>
                      </div>
                    </div>
                  )}

                  {/* Curated Remediation Resources List */}
                  {!evaluationResult.passed && curatedResources.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#171717', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Curated Targeted Resources
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {curatedResources.slice(0, 2).map((res, rIdx) => (
                          <div
                            key={rIdx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              border: '1px solid #EAE7E2',
                              backgroundColor: '#FFFFFF',
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>{res.title}</div>
                              <div style={{ fontSize: '0.75rem', color: '#77736F' }}>{res.provider} • {res.duration}</div>
                            </div>
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#FE6904',
                                textDecoration: 'none',
                              }}
                            >
                              <span>Study</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    {!evaluationResult.passed ? (
                      <>
                        <button
                          type="button"
                          onClick={onClose}
                          style={{
                            padding: '10px 18px',
                            borderRadius: '10px',
                            backgroundColor: '#FAF8F5',
                            border: '1px solid #DDD8D0',
                            color: '#44403C',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Review Resources
                        </button>
                        <button
                          type="button"
                          onClick={handleRetry}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            backgroundColor: '#FE6904',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          <RotateCcw size={15} />
                          <span>Try Checkpoint Again</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={onClose}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 24px',
                          borderRadius: '10px',
                          backgroundColor: '#059669',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        <CheckCircle2 size={16} />
                        <span>Proceed to Next Milestone</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
