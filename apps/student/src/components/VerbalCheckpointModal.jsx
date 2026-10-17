import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  X
} from 'lucide-react';
import { checkpointService } from '../services/checkpointService';
import { spacedRepetitionService } from '../services/spacedRepetitionService';
import { calibrationService } from '../services/calibrationService';

export function VerbalCheckpointModal({
  isOpen,
  onClose,
  task,
  careerTitle,
  onMilestoneVerified
}) {
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

  if (!isOpen || !task) return null;

  const checkpointData = checkpointService.getCheckpointPrompt(task);

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

      // Record learning event for 7-Day Calibration tracking
      calibrationService.recordLearningEvent({
        activityType: 'verbal_checkpoint',
        conceptTitle: task.title,
        conceptId: task.id,
        result: result.passed ? 'mastered' : 'struggling',
        score: result.score,
        selfReportedConfidence: result.passed ? 4 : 2,
        perceivedDifficulty: result.passed ? 'manageable' : 'challenging',
        notes: `Verbal checkpoint: ${result.feedback?.summary || ''}`,
      });

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
      backgroundColor: 'rgba(23, 23, 23, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #EAE7E2',
        boxShadow: '0 1px 3px rgba(23, 23, 23, 0.04)',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #EAE7E2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FE6904', marginBottom: '2px' }}>
              Verbal checkpoint
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#171717', margin: 0 }}>
              {task.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#77736F',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Checkpoint Scenario Prompt */}
          <div style={{
            backgroundColor: '#F8F8F7',
            borderRadius: '12px',
            border: '1px solid #EAE7E2',
            padding: '1.25rem',
          }}>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#171717', lineHeight: '1.5' }}>
              "{checkpointData.prompt}"
            </p>

            {/* Concepts to address */}
            {checkpointData.concepts && checkpointData.concepts.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#77736F' }}>Key concepts:</span>
                {checkpointData.concepts.map((c, i) => (
                  <span key={i} style={{
                    fontSize: '0.75rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE7E2',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    color: '#171717',
                  }}>
                    {c}
                  </span>
                ))}
              </div>
            )}

            {/* Hint */}
            {checkpointData.hint && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #EAE7E2' }}>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.8rem',
                    color: '#FE6904',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <HelpCircle size={14} />
                  <span>{showHint ? 'Hide hint' : 'Need a hint?'}</span>
                </button>
                {showHint && (
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.8rem', color: '#77736F', lineHeight: '1.4' }}>
                    {checkpointData.hint}
                  </p>
                )}
              </div>
            )}
          </div>

          {!evaluationResult ? (
            /* Student Input Section */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717' }}>
                  Your explanation
                </label>
                <div style={{ fontSize: '0.75rem', color: '#77736F' }}>
                  {studentResponse.split(/\s+/).filter(Boolean).length} words
                </div>
              </div>

              {/* Textarea */}
              <div style={{ position: 'relative' }}>
                <textarea
                  value={studentResponse}
                  onChange={(e) => setStudentResponse(e.target.value)}
                  placeholder="Explain your technical reasoning here or click the microphone to speak..."
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: '3.5rem',
                    borderRadius: '8px',
                    border: isRecording ? '1px solid #FE6904' : '1px solid #EAE7E2',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleRecording}
                    title={isRecording ? 'Stop recording' : 'Speak'}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: isRecording ? '#FE6904' : '#F8F8F7',
                      color: isRecording ? '#FFFFFF' : '#171717',
                      border: '1px solid #EAE7E2',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                )}
              </div>

              {isRecording && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '6px',
                  color: '#FE6904',
                  fontSize: '0.8rem',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FE6904' }} />
                  <span>Listening... Speak clearly.</span>
                </div>
              )}

              {speechError && (
                <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#171717' }}>
                  {speechError}
                </div>
              )}

              {/* Actions */}
              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!studentResponse.trim() || isEvaluating}
                  onClick={handleEvaluate}
                  className="btn-primary"
                  style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '0.85rem', opacity: !studentResponse.trim() || isEvaluating ? 0.6 : 1 }}
                >
                  {isEvaluating ? 'Evaluating…' : 'Submit explanation'}
                </button>
              </div>
            </div>
          ) : (
            /* Results */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                backgroundColor: '#F8F8F7',
                borderRadius: '12px',
                border: '1px solid #EAE7E2',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {evaluationResult.passed ? (
                      <CheckCircle2 size={20} color="#FE6904" />
                    ) : (
                      <AlertCircle size={20} color="#77736F" />
                    )}
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#171717' }}>
                      {evaluationResult.passed ? 'Understanding verified' : 'Needs clarification'}
                    </h4>
                  </div>

                  <span className="badge" style={{
                    backgroundColor: evaluationResult.passed ? '#FFE5CE' : '#F8F8F7',
                    color: evaluationResult.passed ? '#FE6904' : '#77736F',
                    border: '1px solid #EAE7E2',
                    fontWeight: 600,
                  }}>
                    {evaluationResult.score}%
                  </span>
                </div>

                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#171717', lineHeight: '1.5' }}>
                  {evaluationResult.feedback}
                </p>

                {/* Rubric Breakdown */}
                {evaluationResult.rubricScores && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #EAE7E2' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#77736F' }}>Conceptual accuracy</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#171717' }}>
                        {evaluationResult.rubricScores.conceptualAccuracy}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#77736F' }}>Practical justification</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#171717' }}>
                        {evaluationResult.rubricScores.practicalJustification}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#77736F' }}>Absence of misconceptions</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#171717' }}>
                        {evaluationResult.rubricScores.absenceOfMisconceptions}%
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills shown */}
              {evaluationResult.identifiedStrengths?.length > 0 && (
                <div style={{ backgroundColor: '#F8F8F7', padding: '1rem', borderRadius: '12px', border: '1px solid #EAE7E2' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                    Skills shown:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#77736F', lineHeight: '1.5' }}>
                    {evaluationResult.identifiedStrengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up question if close */}
              {evaluationResult.followUpQuestion && !evaluationResult.passed && (
                <div style={{ backgroundColor: '#F8F8F7', padding: '1rem', borderRadius: '12px', border: '1px solid #EAE7E2' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                    Follow-up question:
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#171717' }}>
                    "{evaluationResult.followUpQuestion}"
                  </p>
                  <textarea
                    value={followUpAnswer}
                    onChange={(e) => setFollowUpAnswer(e.target.value)}
                    placeholder="Provide your clarification here..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #EAE7E2',
                      fontSize: '0.85rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleEvaluate}
                    className="btn-primary"
                    style={{ marginTop: '8px', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem' }}
                  >
                    Submit clarification
                  </button>
                </div>
              )}

              {/* Remediation recommendation */}
              {evaluationResult.remediationRecommendation && (
                <div style={{ backgroundColor: '#F8F8F7', padding: '1rem', borderRadius: '12px', border: '1px solid #EAE7E2' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                    Recommended review:
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#77736F', lineHeight: '1.5' }}>
                    {evaluationResult.remediationRecommendation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem' }}>
                {!evaluationResult.passed ? (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="btn-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>Review and retry</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmCompletion}
                    className="btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 20px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span>Complete milestone</span>
                    <ArrowRight size={14} />
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
