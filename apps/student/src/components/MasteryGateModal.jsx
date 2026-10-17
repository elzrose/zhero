import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  X,
  Lock,
  Code,
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
  const milestoneDef = task && isOpen ? masteryService.getMilestoneDefinition(task.id, task) : {};
  const prereqCheck = task && isOpen ? masteryService.checkPrerequisites(task.id) : { satisfied: true, missing: [] };

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

  if (!isOpen || !task) return null;

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
      setSpeechError('Please enter a complete solution before verifying.');
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
      setSpeechError('Evaluation encountered an error. Please retry.');
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
        backgroundColor: 'rgba(23, 23, 23, 0.5)',
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
          borderRadius: '12px',
          border: '1px solid #EAE7E2',
          boxShadow: '0 1px 3px rgba(23, 23, 23, 0.04)',
          width: '100%',
          maxWidth: '740px',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #EAE7E2',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#FE6904',
                }}
              >
                Mastery checkpoint
              </span>
              {milestoneDef.phase && (
                <span style={{ fontSize: '0.75rem', color: '#77736F' }}>• {milestoneDef.phase}</span>
              )}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#171717' }}>
              {milestoneDef.title || task.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#77736F',
              padding: '6px',
              borderRadius: '8px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Prerequisite Missing Warning */}
          {!prereqCheck.satisfied ? (
            <div
              style={{
                backgroundColor: '#F8F8F7',
                border: '1px solid #EAE7E2',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <Lock size={32} color="#171717" style={{ margin: '0 auto 0.5rem' }} />
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600, color: '#171717' }}>
                Prerequisites required
              </h4>
              <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#77736F', lineHeight: '1.5' }}>
                Complete the prerequisite milestones before attempting this checkpoint:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '400px', margin: '0 auto' }}>
                {prereqCheck.missing.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EAE7E2',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.85rem',
                      color: '#171717',
                      textAlign: 'left',
                    }}
                  >
                    {m.title}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ marginTop: '1.25rem', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                Back to roadmap
              </button>
            </div>
          ) : (
            <div>
              {/* Checkpoint Navigation Tabs */}
              {activeTab !== 'results' && (
                <div
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #EAE7E2',
                    marginBottom: '1.25rem',
                    gap: '1rem',
                  }}
                >
                  {hasQuiz && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('quiz')}
                      style={{
                        padding: '8px 4px',
                        border: 'none',
                        borderBottom: activeTab === 'quiz' ? '2px solid #FE6904' : '2px solid transparent',
                        backgroundColor: 'transparent',
                        color: activeTab === 'quiz' ? '#FE6904' : '#77736F',
                        fontSize: '0.85rem',
                        fontWeight: activeTab === 'quiz' ? 600 : 400,
                        cursor: 'pointer',
                        marginBottom: '-1px',
                      }}
                    >
                      Quiz (80% pass)
                    </button>
                  )}

                  {hasPractical && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('practical')}
                      style={{
                        padding: '8px 4px',
                        border: 'none',
                        borderBottom: activeTab === 'practical' ? '2px solid #FE6904' : '2px solid transparent',
                        backgroundColor: 'transparent',
                        color: activeTab === 'practical' ? '#FE6904' : '#77736F',
                        fontSize: '0.85rem',
                        fontWeight: activeTab === 'practical' ? 600 : 400,
                        cursor: 'pointer',
                        marginBottom: '-1px',
                      }}
                    >
                      Practical
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveTab('verbal')}
                    style={{
                      padding: '8px 4px',
                      border: 'none',
                      borderBottom: activeTab === 'verbal' ? '2px solid #FE6904' : '2px solid transparent',
                      backgroundColor: 'transparent',
                      color: activeTab === 'verbal' ? '#FE6904' : '#77736F',
                      fontSize: '0.85rem',
                      fontWeight: activeTab === 'verbal' ? 600 : 400,
                      cursor: 'pointer',
                      marginBottom: '-1px',
                    }}
                  >
                    Verbal check (70% pass)
                  </button>
                </div>
              )}

              {/* Error notice */}
              {speechError && (
                <div
                  style={{
                    backgroundColor: '#F8F8F7',
                    border: '1px solid #EAE7E2',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    marginBottom: '1rem',
                    color: '#171717',
                    fontSize: '0.825rem',
                  }}
                >
                  {speechError}
                </div>
              )}

              {/* STEP 1: OBJECTIVE QUIZ */}
              {activeTab === 'quiz' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {milestoneDef.quizQuestions.map((q, qIdx) => (
                      <div
                        key={q.id}
                        style={{
                          backgroundColor: '#F8F8F7',
                          borderRadius: '12px',
                          border: '1px solid #EAE7E2',
                          padding: '1rem',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', color: '#77736F', marginBottom: '2px' }}>
                          Question {qIdx + 1} • {q.concept}
                        </div>
                        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', fontWeight: 600, color: '#171717' }}>
                          {q.question}
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {q.options.map((opt, optIdx) => {
                            const isSelected = quizAnswers[q.id] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleSelectQuizAnswer(q.id, optIdx)}
                                style={{
                                  textAlign: 'left',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isSelected ? '1px solid #FE6904' : '1px solid #EAE7E2',
                                  backgroundColor: isSelected ? '#FFE5CE' : '#FFFFFF',
                                  color: isSelected ? '#FE6904' : '#171717',
                                  fontSize: '0.85rem',
                                  fontWeight: isSelected ? 600 : 400,
                                  cursor: 'pointer',
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

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(hasPractical ? 'practical' : 'verbal')}
                      className="btn-primary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 18px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                      }}
                    >
                      <span>Continue</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PRACTICAL APPLICATION */}
              {activeTab === 'practical' && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#F8F8F7',
                      borderRadius: '12px',
                      border: '1px solid #EAE7E2',
                      padding: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Code size={14} color="#FE6904" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FE6904' }}>
                        Practical task
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#171717', lineHeight: '1.5' }}>
                      {milestoneDef.practicalPrompt}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                      Solution
                    </label>
                    <textarea
                      rows={6}
                      value={practicalCode}
                      onChange={(e) => setPracticalCode(e.target.value)}
                      placeholder="// Type or paste your code here..."
                      style={{
                        width: '100%',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #EAE7E2',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={handleVerifyPractical}
                      className="btn-secondary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.825rem',
                      }}
                    >
                      <CheckCircle2 size={14} color={practicalVerified ? '#FE6904' : '#77736F'} />
                      <span>{practicalVerified ? 'Verified' : 'Verify code'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('verbal')}
                      className="btn-primary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 18px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                      }}
                    >
                      <span>Continue to verbal check</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: VERBAL CONCEPTUAL CHECK */}
              {activeTab === 'verbal' && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#F8F8F7',
                      borderRadius: '12px',
                      border: '1px solid #EAE7E2',
                      padding: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#171717', lineHeight: '1.5' }}>
                      Explain in your own words how this functions, why it is used, and what trade-offs you consider.
                    </p>
                  </div>

                  {/* Speech & Text Input Area */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717' }}>
                        Explanation
                      </label>
                      {speechSupported && (
                        <button
                          type="button"
                          onClick={toggleRecording}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            backgroundColor: isRecording ? '#FFE5CE' : '#F8F8F7',
                            border: '1px solid #EAE7E2',
                            color: isRecording ? '#FE6904' : '#171717',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                          }}
                        >
                          {isRecording ? <MicOff size={12} /> : <Mic size={12} />}
                          <span>{isRecording ? 'Stop' : 'Speak'}</span>
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={5}
                      value={verbalResponse}
                      onChange={(e) => setVerbalResponse(e.target.value)}
                      placeholder="Explain your technical reasoning here..."
                      style={{
                        width: '100%',
                        fontSize: '0.875rem',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #EAE7E2',
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
                        gap: '4px',
                        background: 'none',
                        border: 'none',
                        color: '#77736F',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      <HelpCircle size={14} />
                      <span>{showHint ? 'Hide hint' : 'Hint'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitEvaluation}
                      disabled={isEvaluating || (verbalResponse || '').trim().length < 8}
                      className="btn-primary"
                      style={{
                        padding: '8px 18px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        opacity: isEvaluating || (verbalResponse || '').trim().length < 8 ? 0.6 : 1,
                      }}
                    >
                      {isEvaluating ? 'Evaluating…' : 'Submit checkpoint'}
                    </button>
                  </div>

                  {showHint && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        backgroundColor: '#F8F8F7',
                        border: '1px solid #EAE7E2',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        fontSize: '0.8rem',
                        color: '#77736F',
                      }}
                    >
                      Focus on underlying mechanics, trade-offs, and practical application.
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: EVALUATION RESULTS */}
              {activeTab === 'results' && evaluationResult && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#F8F8F7',
                      border: '1px solid #EAE7E2',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {evaluationResult.passed ? (
                          <CheckCircle2 size={20} color="#FE6904" />
                        ) : (
                          <AlertCircle size={20} color="#77736F" />
                        )}
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#171717' }}>
                          {evaluationResult.passed ? 'Mastery verified' : 'Practice recommended'}
                        </h4>
                      </div>

                      <span className="badge" style={{
                        backgroundColor: evaluationResult.passed ? '#FFE5CE' : '#FFFFFF',
                        color: evaluationResult.passed ? '#FE6904' : '#77736F',
                        border: '1px solid #EAE7E2',
                      }}>
                        {evaluationResult.score}%
                      </span>
                    </div>

                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: '#171717', lineHeight: '1.5' }}>
                      {evaluationResult.feedback}
                    </p>

                    {/* Demonstrated Concepts */}
                    <div style={{ fontSize: '0.75rem', color: '#77736F', marginBottom: '4px' }}>
                      Skills shown:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(evaluationResult.demonstratedConcepts || milestoneDef.concepts || []).map((c, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #EAE7E2',
                            color: '#171717',
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Remediation Resources */}
                  {!evaluationResult.passed && curatedResources.length > 0 && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '6px' }}>
                        Recommended resources
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {curatedResources.slice(0, 2).map((res, rIdx) => (
                          <div
                            key={rIdx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #EAE7E2',
                              backgroundColor: '#FFFFFF',
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '0.85rem', color: '#171717' }}>{res.title}</div>
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
                                color: '#FE6904',
                                textDecoration: 'none',
                              }}
                            >
                              <span>View</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    {!evaluationResult.passed ? (
                      <>
                        <button
                          type="button"
                          onClick={onClose}
                          className="btn-secondary"
                          style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          onClick={handleRetry}
                          className="btn-primary"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 18px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                          }}
                        >
                          <RotateCcw size={14} />
                          <span>Retry</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={onClose}
                        className="btn-primary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                        }}
                      >
                        <CheckCircle2 size={14} />
                        <span>Continue</span>
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
