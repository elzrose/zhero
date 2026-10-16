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
  Volume2
} from 'lucide-react';
import { checkpointService } from '../services/checkpointService';
import { spacedRepetitionService } from '../services/spacedRepetitionService';

export function VerbalCheckpointModal({
  isOpen,
  onClose,
  task,
  careerTitle,
  onMilestoneVerified
}) {
  if (!isOpen || !task) return null;

  const checkpointData = checkpointService.getCheckpointPrompt(task);
  const [studentResponse, setStudentResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Evaluation states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [followUpAnswer, setFollowUpAnswer] = useState('');

  const recognitionRef = useRef(null);

  // Initialize Web Speech API if available
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
          setStudentResponse(currentTranscript.trim());
        };

        recognition.onerror = (event) => {
          console.warn('Speech recognition event error:', event.error);
          setIsRecording(false);
          if (event.error === 'not-allowed') {
            setSpeechError('Microphone permission was denied. You can type your explanation below.');
          } else if (event.error === 'no-speech') {
            // no speech detected, keep open
          } else {
            setSpeechError('Speech recognition paused. You can continue typing below.');
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Could not initialize speech recognition:', e);
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
      } catch (err) {
        console.warn('Recognition start error:', err);
        setSpeechError('Microphone could not start. Please type your explanation below.');
        setIsRecording(false);
      }
    }
  };

  const handleEvaluate = async () => {
    const combinedResponse = followUpAnswer
      ? `${studentResponse}\n\nFollow-up clarification: ${followUpAnswer}`
      : studentResponse;

    if (!combinedResponse.trim()) return;

    setIsEvaluating(true);
    setSpeechError('');

    try {
      const result = await checkpointService.evaluateResponse({
        milestoneTitle: task.title,
        keyConcepts: checkpointData.concepts,
        checkpointPrompt: checkpointData.prompt,
        studentResponse: combinedResponse,
      });

      setEvaluationResult(result);

      if (result.passed) {
        // Automatically enroll concepts into Spaced Repetition queue
        spacedRepetitionService.enrollConceptsFromMilestone(
          { id: task.id, title: task.title, careerTitle },
          checkpointData.concepts
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleConfirmCompletion = () => {
    if (evaluationResult?.passed && onMilestoneVerified) {
      onMilestoneVerified(task.id, evaluationResult);
      onClose();
    }
  };

  const handleRetry = () => {
    setEvaluationResult(null);
    setFollowUpAnswer('');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(23, 23, 23, 0.6)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #EAE7E2',
        boxShadow: '0 25px 50px -12px rgba(23, 23, 23, 0.25)',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '92vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #EAE7E2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FBFBFA',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '999px',
                backgroundColor: '#FFE5CE',
                color: '#FE6904',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <Sparkles size={12} /> Verbal AI Course Checkpoint
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', margin: 0 }}>
              {task.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F8F8F7',
              border: '1px solid #EAE7E2',
              cursor: 'pointer',
              color: '#77736F',
              padding: '6px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Checkpoint Scenario Prompt */}
          <div style={{
            backgroundColor: '#FAFAF9',
            borderRadius: '18px',
            border: '1px solid #EAE7E2',
            padding: '1.5rem',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FE6904', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              Practical Scenario Question
            </div>
            <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: 600, color: '#171717', lineHeight: '1.6' }}>
              "{checkpointData.prompt}"
            </p>

            {/* Concepts to address */}
            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#77736F' }}>Key concepts:</span>
              {checkpointData.concepts.map((c, i) => (
                <span key={i} style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EAE7E2',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  color: '#4B5563',
                }}>
                  {c}
                </span>
              ))}
            </div>

            {/* Hint Accordion */}
            {checkpointData.hint && (
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #EAE7E2' }}>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#FE6904',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <HelpCircle size={14} />
                  <span>{showHint ? 'Hide scaffolding hint' : 'Need a hint?'}</span>
                </button>
                {showHint && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.825rem', color: '#6B7280', lineHeight: '1.5', backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: '1px solid #EAE7E2' }}>
                    💡 <strong>Guiding Hint:</strong> {checkpointData.hint}
                  </p>
                )}
              </div>
            )}
          </div>

          {!evaluationResult ? (
            /* Student Input Section (Speech + Text) */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
                  Your Explanation (Speak or Type):
                </label>
                <div style={{ fontSize: '0.75rem', color: '#77736F' }}>
                  {studentResponse.split(/\s+/).filter(Boolean).length} words
                </div>
              </div>

              {/* Textarea with voice integration */}
              <div style={{ position: 'relative' }}>
                <textarea
                  value={studentResponse}
                  onChange={(e) => setStudentResponse(e.target.value)}
                  placeholder="Explain your technical reasoning in your own words. Click the microphone to speak aloud or type directly..."
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    paddingRight: '3.5rem',
                    borderRadius: '16px',
                    border: isRecording ? '2px solid #FE6904' : '1.5px solid #EAE7E2',
                    fontSize: '0.925rem',
                    fontFamily: 'inherit',
                    lineHeight: '1.6',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease',
                    boxShadow: isRecording ? '0 0 0 4px rgba(254, 105, 4, 0.1)' : 'none',
                  }}
                />

                {/* Speech Button */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleRecording}
                    title={isRecording ? 'Stop Recording' : 'Speak into Microphone'}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: isRecording ? '#FE6904' : '#F8F8F7',
                      color: isRecording ? '#FFFFFF' : '#171717',
                      border: isRecording ? 'none' : '1px solid #EAE7E2',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      boxShadow: isRecording ? '0 4px 12px rgba(254, 105, 4, 0.35)' : 'none',
                    }}
                  >
                    {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                )}
              </div>

              {/* Live Listening Indicator */}
              {isRecording && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '8px',
                  color: '#FE6904',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#FE6904',
                    animation: 'pulse 1s infinite',
                  }} />
                  <span>Listening... Speak clearly. Text appears automatically.</span>
                </div>
              )}

              {speechError && (
                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#B91C1C' }}>
                  {speechError}
                </div>
              )}

              {/* Transparent Rubric Preview Note */}
              <div style={{
                marginTop: '1rem',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: '#FBFBFA',
                border: '1px solid #EAE7E2',
                fontSize: '0.78rem',
                color: '#77736F',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Volume2 size={16} color="#FE6904" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Transparent Rubric:</strong> Gemini evaluates Conceptual Accuracy (40%), Practical Justification (40%), and Absence of Misconceptions (20%). Score ≥ 70% required to complete.
                </span>
              </div>

              {/* Evaluation Action Button */}
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#77736F',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!studentResponse.trim() || isEvaluating}
                  onClick={handleEvaluate}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    backgroundColor: studentResponse.trim() ? '#FE6904' : '#D6D2CC',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    cursor: studentResponse.trim() ? 'pointer' : 'not-allowed',
                    boxShadow: studentResponse.trim() ? '0 4px 16px rgba(254, 105, 4, 0.25)' : 'none',
                  }}
                >
                  {isEvaluating ? (
                    <>
                      <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      <span>Evaluating Understanding...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Submit for Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Evaluation Results & Rubric Card */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                backgroundColor: evaluationResult.passed ? '#ECFDF5' : '#FFFBEB',
                borderRadius: '18px',
                border: evaluationResult.passed ? '1.5px solid #A7F3D0' : '1.5px solid #FDE68A',
                padding: '1.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {evaluationResult.passed ? (
                      <CheckCircle2 size={24} color="#047857" />
                    ) : (
                      <AlertCircle size={24} color="#D97706" />
                    )}
                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: evaluationResult.passed ? '#047857' : '#B45309' }}>
                      {evaluationResult.passed ? 'Understanding Verified!' : 'Needs Conceptual Clarification'}
                    </h4>
                  </div>

                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    padding: '4px 12px',
                    borderRadius: '999px',
                    backgroundColor: evaluationResult.passed ? '#047857' : '#D97706',
                    color: '#FFFFFF',
                  }}>
                    {evaluationResult.score}%
                  </span>
                </div>

                <p style={{ margin: '0 0 1rem 0', fontSize: '0.925rem', color: '#374151', lineHeight: '1.6' }}>
                  {evaluationResult.feedback}
                </p>

                {/* 3-Part Rubric Breakdown */}
                {evaluationResult.rubricScores && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700 }}>Conceptual Accuracy</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#171717' }}>
                        {evaluationResult.rubricScores.conceptualAccuracy}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700 }}>Practical Justification</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#171717' }}>
                        {evaluationResult.rubricScores.practicalJustification}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700 }}>Absence of Misconceptions</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#171717' }}>
                        {evaluationResult.rubricScores.absenceOfMisconceptions}%
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Identified Strengths */}
              {evaluationResult.identifiedStrengths?.length > 0 && (
                <div style={{ backgroundColor: '#FBFBFA', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #EAE7E2' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', marginBottom: '6px' }}>
                    Demonstrated Competencies:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#374151', lineHeight: '1.5' }}>
                    {evaluationResult.identifiedStrengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up question if close */}
              {evaluationResult.followUpQuestion && !evaluationResult.passed && (
                <div style={{ backgroundColor: '#FFFBEB', padding: '1.25rem', borderRadius: '14px', border: '1px solid #FDE68A' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#B45309', marginBottom: '6px' }}>
                    Quick Follow-up Question:
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: '#92400E', fontWeight: 600 }}>
                    "{evaluationResult.followUpQuestion}"
                  </p>
                  <textarea
                    value={followUpAnswer}
                    onChange={(e) => setFollowUpAnswer(e.target.value)}
                    placeholder="Provide your clarification here..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid #FDE68A',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleEvaluate}
                    style={{
                      marginTop: '8px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#B45309',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Submit Clarification
                  </button>
                </div>
              )}

              {/* Remediation Recommendation if struggled */}
              {evaluationResult.remediationRecommendation && (
                <div style={{ backgroundColor: '#FEF2F2', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #FECACA' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#B91C1C', marginBottom: '4px' }}>
                    Recommended Remediation:
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#991B1B', lineHeight: '1.5' }}>
                    {evaluationResult.remediationRecommendation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                {!evaluationResult.passed ? (
                  <button
                    type="button"
                    onClick={handleRetry}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 20px',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EAE7E2',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#171717',
                      cursor: 'pointer',
                    }}
                  >
                    <RotateCcw size={16} />
                    <span>Review & Retry</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmCompletion}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 28px',
                      borderRadius: '14px',
                      backgroundColor: '#047857',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(4, 120, 87, 0.25)',
                    }}
                  >
                    <span>Confirm Milestone Complete</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
