import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Award,
  Square,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  ArrowRight
} from 'lucide-react';
import { liveInterviewService } from '../services/liveInterviewService';

export default function LiveAiInterviewRoom({
  mode = 'career_discovery', // 'career_discovery' | 'learning_checkpoint'
  checkpointContext = null,
  onComplete = () => {},
  onExit = () => {},
}) {
  // Session States: 'idle' | 'permission_check' | 'active' | 'evaluating' | 'completed'
  const [sessionState, setSessionState] = useState('idle');
  // AI/Mic States: 'listening' | 'thinking' | 'speaking' | 'paused'
  const [aiState, setAiState] = useState('idle');

  // Audio & Settings
  const [micMuted, setMicMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [isTextFallback, setIsTextFallback] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState(null);
  const [permissionError, setPermissionError] = useState('');

  // Conversation turns
  const [turnCount, setTurnCount] = useState(1);
  const maxTurns = mode === 'career_discovery' ? 4 : 3;
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [currentSpokenText, setCurrentSpokenText] = useState('');
  const [textInputDraft, setTextInputDraft] = useState('');

  // Structured Final Report
  const [evaluationReport, setEvaluationReport] = useState(null);

  const visualizerBars = [16, 28, 20, 32, 24, 18, 30, 22, 16];
  const transcriptEndRef = useRef(null);

  const initialQuestions = {
    career_discovery:
      "Welcome to your career interview. What kind of technical problem or project makes you lose track of time?",
    learning_checkpoint: checkpointContext
      ? `Welcome to your verbal checkpoint for ${checkpointContext.title || 'this module'}. In your own words, could you explain ${checkpointContext.concept || 'the topic'} and why it is used?`
      : "Welcome to your verbal checkpoint. In your own words, how would you explain this concept to someone new to it?",
  };

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript, currentSpokenText]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      liveInterviewService.stopListening();
      liveInterviewService.stopSpeaking();
    };
  }, []);

  const requestStartInterview = async () => {
    setSessionState('permission_check');
    const perm = await liveInterviewService.checkMicPermission();

    if (perm.granted) {
      setMicPermissionGranted(true);
      startInterviewSession(false);
    } else {
      setMicPermissionGranted(false);
      setPermissionError(perm.error || 'Microphone access was denied or not found.');
    }
  };

  const startInterviewSession = (forceTextMode = false) => {
    setIsTextFallback(forceTextMode);
    setSessionState('active');
    setTurnCount(1);
    const firstQ = initialQuestions[mode] || initialQuestions.career_discovery;
    setCurrentQuestion(firstQ);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const firstEntry = {
      role: 'ai',
      text: firstQ,
      timestamp: timeStr,
    };
    setTranscript([firstEntry]);

    if (!forceTextMode && !audioMuted) {
      setAiState('speaking');
      liveInterviewService.speak(firstQ, {
        onStart: () => setAiState('speaking'),
        onEnd: () => {
          setAiState('listening');
          startStudentMic();
        },
        onError: () => {
          setAiState('listening');
          startStudentMic();
        },
      });
    } else {
      setAiState('listening');
    }
  };

  const startStudentMic = () => {
    if (isTextFallback || micMuted) return;

    setCurrentSpokenText('');
    liveInterviewService.startListening({
      onInterim: (interim) => {
        setCurrentSpokenText(interim);
      },
      onResult: (finalText) => {
        setCurrentSpokenText(finalText);
      },
      onError: (err) => {
        console.warn('Mic listening issue:', err);
      },
      onEnd: (final) => {
        if (final && final.trim().length > 3) {
          setCurrentSpokenText(final.trim());
        }
      },
    });
  };

  const handleStudentSubmit = async (answerText) => {
    const textToSubmit = (answerText || currentSpokenText || textInputDraft).trim();
    if (!textToSubmit) return;

    liveInterviewService.stopListening();
    liveInterviewService.stopSpeaking();

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const studentEntry = {
      role: 'student',
      text: textToSubmit,
      timestamp: timeStr,
    };

    const updatedHistory = [...transcript, studentEntry];
    setTranscript(updatedHistory);
    setCurrentSpokenText('');
    setTextInputDraft('');
    setAiState('thinking');

    try {
      const res = await liveInterviewService.submitTurn({
        mode,
        context: checkpointContext || { studentGoal: 'Career Discovery' },
        currentQuestion,
        studentAnswer: textToSubmit,
        turnCount,
        maxTurns,
        history: updatedHistory,
      });

      const { data } = res;
      const aiReplyText = data.spokenReply + (data.isFinalTurn ? '' : ' ' + data.followUpQuestion);

      const aiNow = new Date();
      const aiTimeStr = `${String(aiNow.getHours()).padStart(2, '0')}:${String(aiNow.getMinutes()).padStart(2, '0')}`;

      const aiEntry = {
        role: 'ai',
        text: aiReplyText,
        timestamp: aiTimeStr,
      };

      const nextHistory = [...updatedHistory, aiEntry];
      setTranscript(nextHistory);

      if (data.isFinalTurn || turnCount >= maxTurns) {
        if (!audioMuted && !isTextFallback) {
          setAiState('speaking');
          liveInterviewService.speak(data.spokenReply, {
            onEnd: () => {
              triggerFinalEvaluation(nextHistory);
            },
          });
        } else {
          triggerFinalEvaluation(nextHistory);
        }
      } else {
        setTurnCount((prev) => prev + 1);
        setCurrentQuestion(data.followUpQuestion);

        if (!audioMuted && !isTextFallback) {
          setAiState('speaking');
          liveInterviewService.speak(aiReplyText, {
            onStart: () => setAiState('speaking'),
            onEnd: () => {
              setAiState('listening');
              startStudentMic();
            },
            onError: () => {
              setAiState('listening');
              startStudentMic();
            },
          });
        } else {
          setAiState('listening');
        }
      }
    } catch (err) {
      console.error('Turn exchange failed:', err);
      setAiState('listening');
    }
  };

  const triggerFinalEvaluation = async (finalHistory) => {
    setSessionState('evaluating');
    setAiState('thinking');

    try {
      const evalRes = await liveInterviewService.evaluateInterview({
        mode,
        history: finalHistory,
        context: checkpointContext || {},
      });

      setEvaluationReport(evalRes.data);
      setSessionState('completed');
      setAiState('idle');

      if (onComplete) {
        onComplete(evalRes.data);
      }
    } catch (err) {
      console.error('Evaluation error:', err);
      setSessionState('completed');
    }
  };

  const toggleMic = () => {
    if (micMuted) {
      setMicMuted(false);
      startStudentMic();
    } else {
      setMicMuted(true);
      liveInterviewService.stopListening();
    }
  };

  const toggleAudio = () => {
    if (audioMuted) {
      setAudioMuted(false);
    } else {
      setAudioMuted(true);
      liveInterviewService.stopSpeaking();
    }
  };

  const handleEndEarly = () => {
    liveInterviewService.stopListening();
    liveInterviewService.stopSpeaking();
    if (transcript.length >= 2) {
      triggerFinalEvaluation(transcript);
    } else {
      setSessionState('idle');
      onExit();
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #EAE7E2',
      borderRadius: '12px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '520px',
    }}>
      {/* Header Bar */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid #EAE7E2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#171717', margin: 0 }}>
            {mode === 'career_discovery' ? 'Career discovery interview' : 'Verbal checkpoint'}
          </h2>
          {isTextFallback && (
            <span className="badge" style={{ backgroundColor: '#F8F8F7', color: '#77736F', border: '1px solid #EAE7E2' }}>
              Text mode
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {sessionState === 'active' && (
            <>
              <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
                Turn {turnCount} of {maxTurns}
              </span>

              <button
                type="button"
                onClick={toggleAudio}
                title={audioMuted ? 'Unmute voice' : 'Mute voice'}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: '1px solid #EAE7E2',
                  backgroundColor: audioMuted ? '#FFE5CE' : '#FFFFFF',
                  color: audioMuted ? '#FE6904' : '#171717',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {audioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              <button
                type="button"
                onClick={handleEndEarly}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem' }}
              >
                <Square size={12} />
                <span>End</span>
              </button>
            </>
          )}

          {sessionState === 'completed' && (
            <button
              type="button"
              onClick={() => {
                setSessionState('idle');
                onExit();
              }}
              className="btn-secondary"
              style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem' }}
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* STAGE 1: IDLE */}
      {sessionState === 'idle' && (
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', maxWidth: '540px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#171717', margin: '0 0 0.5rem 0' }}>
            {mode === 'career_discovery' ? 'Career discovery interview' : 'Verbal learning checkpoint'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#77736F', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
            Speak naturally into your microphone or type your responses.
          </p>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={requestStartInterview}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '8px', fontSize: '0.85rem' }}
            >
              <Mic size={16} />
              <span>Start with voice</span>
            </button>

            <button
              type="button"
              onClick={() => startInterviewSession(true)}
              className="btn-secondary"
              style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}
            >
              Use text instead
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: PERMISSION CHECK */}
      {sessionState === 'permission_check' && (
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          {micPermissionGranted === false ? (
            <>
              <AlertCircle size={28} color="#FE6904" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#171717', margin: '0 0 0.5rem 0' }}>Microphone access needed</h3>
              <p style={{ fontSize: '0.85rem', color: '#77736F', margin: '0 0 1rem 0' }}>
                {permissionError || 'Please allow microphone access in your browser.'}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={requestStartInterview}
                  className="btn-primary"
                  style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.825rem' }}
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={() => startInterviewSession(true)}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.825rem' }}
                >
                  Use text
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#77736F', fontSize: '0.9rem' }}>
              <RefreshCw size={16} />
              <span>Checking microphone…</span>
            </div>
          )}
        </div>
      )}

      {/* STAGE 3: ACTIVE LIVE INTERVIEW */}
      {sessionState === 'active' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Main Stage */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', flex: 1 }}>
            {/* Left: Current Question & Mic */}
            <div style={{ padding: '1.5rem', borderRight: '1px solid #EAE7E2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem', color: '#FE6904', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FE6904' }} />
                  <span>
                    {aiState === 'speaking' ? 'Speaking…' : aiState === 'listening' ? 'Listening…' : aiState === 'thinking' ? 'Processing…' : 'Ready'}
                  </span>
                </div>

                {/* Current Question */}
                <div style={{ backgroundColor: '#F8F8F7', borderRadius: '8px', padding: '1rem', border: '1px solid #EAE7E2', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#77736F', marginBottom: '4px' }}>
                    Question {turnCount}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#171717', lineHeight: 1.5 }}>
                    {currentQuestion}
                  </p>
                </div>

                {/* Interim spoken text preview */}
                {currentSpokenText && (
                  <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#FFE5CE', border: '1px solid #EAE7E2', fontSize: '0.85rem', color: '#171717', marginBottom: '1rem' }}>
                    <span style={{ fontStyle: 'italic' }}>"{currentSpokenText}"</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div>
                {!isTextFallback ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={toggleMic}
                      className="btn-secondary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        backgroundColor: micMuted ? '#F8F8F7' : '#FFFFFF',
                      }}
                    >
                      {micMuted ? <MicOff size={16} /> : <Mic size={16} color="#FE6904" />}
                      <span>{micMuted ? 'Unmute' : 'Mute'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStudentSubmit(currentSpokenText)}
                      disabled={!currentSpokenText || aiState === 'thinking'}
                      className="btn-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 18px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        opacity: !currentSpokenText || aiState === 'thinking' ? 0.6 : 1,
                      }}
                    >
                      <span>Submit answer</span>
                      <Send size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsTextFallback(true)}
                      className="btn-secondary"
                      style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem' }}
                    >
                      Type instead
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleStudentSubmit(textInputDraft);
                    }}
                    style={{ display: 'flex', gap: '8px' }}
                  >
                    <input
                      type="text"
                      value={textInputDraft}
                      onChange={(e) => setTextInputDraft(e.target.value)}
                      placeholder="Type your answer here..."
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #EAE7E2',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!textInputDraft.trim() || aiState === 'thinking'}
                      className="btn-primary"
                      style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsTextFallback(false)}
                      className="btn-secondary"
                      style={{ padding: '8px 10px', borderRadius: '8px', fontSize: '0.8rem' }}
                    >
                      Voice
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Transcript */}
            <div style={{ padding: '1.25rem', backgroundColor: '#F8F8F7', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.75rem' }}>
                Transcript ({transcript.length})
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px' }}>
                {transcript.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: item.role === 'ai' ? 'flex-start' : 'flex-end',
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', color: '#77736F', marginBottom: '2px' }}>
                      {item.role === 'ai' ? 'Interviewer' : 'You'} • {item.timestamp}
                    </div>
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        maxWidth: '85%',
                        backgroundColor: item.role === 'ai' ? '#FFFFFF' : '#FFE5CE',
                        color: '#171717',
                        border: '1px solid #EAE7E2',
                      }}
                    >
                      {item.text}
                    </div>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: EVALUATING */}
      {sessionState === 'evaluating' && (
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <p style={{ fontSize: '0.95rem', color: '#171717', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
            Analysing your answers…
          </p>
        </div>
      )}

      {/* STAGE 5: COMPLETED REPORT */}
      {sessionState === 'completed' && evaluationReport && (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Summary */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #EAE7E2', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={16} color="#FE6904" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#171717', margin: 0 }}>
                  Evaluation report
                </h3>
              </div>

              <span className="badge" style={{ backgroundColor: '#FFE5CE', color: '#FE6904', border: '1px solid #EAE7E2' }}>
                Score: {evaluationReport.conceptualMasteryScore || 88}%
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#171717', lineHeight: 1.5, margin: 0 }}>
              {evaluationReport.overallSummary}
            </p>
          </div>

          {/* Grid: Strengths & Growth Areas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="card">
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717', margin: '0 0 0.5rem 0' }}>
                Skills shown
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.825rem', color: '#77736F', lineHeight: 1.5 }}>
                {(evaluationReport.demonstratedStrengths || []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717', margin: '0 0 0.5rem 0' }}>
                Areas for growth
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.825rem', color: '#77736F', lineHeight: 1.5 }}>
                {(evaluationReport.areasForGrowth || []).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended alignments */}
          {evaluationReport.recommendedCareerAlignments && (
            <div className="card">
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717', margin: '0 0 0.5rem 0' }}>
                Recommended directions
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {evaluationReport.recommendedCareerAlignments.map((car, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: '#F8F8F7',
                      border: '1px solid #EAE7E2',
                      fontSize: '0.8rem',
                      color: '#171717',
                    }}
                  >
                    {car}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Discussion Points */}
          {evaluationReport.actionableMentorDiscussionPoints && (
            <div className="card">
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717', margin: '0 0 0.5rem 0' }}>
                Discussion points for mentor meeting
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.825rem', color: '#77736F', lineHeight: 1.5 }}>
                {evaluationReport.actionableMentorDiscussionPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
