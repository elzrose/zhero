import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Brain,
  Award,
  Play,
  Square,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Send,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  HelpCircle,
  BarChart3,
  Lightbulb,
  BookOpen,
  Compass,
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
  const [showTranscript, setShowTranscript] = useState(true);

  // Conversation turns
  const [turnCount, setTurnCount] = useState(1);
  const maxTurns = mode === 'career_discovery' ? 4 : 3;
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [transcript, setTranscript] = useState([]); // [{ role: 'ai' | 'student', text: string, timestamp: string }]
  const [currentSpokenText, setCurrentSpokenText] = useState('');
  const [textInputDraft, setTextInputDraft] = useState('');
  const [instantInsight, setInstantInsight] = useState('');

  // Structured Final Report
  const [evaluationReport, setEvaluationReport] = useState(null);
  const [isAiPowered, setIsAiPowered] = useState(true);

  // Audio wave visualizer animation ref
  const visualizerBars = [16, 32, 48, 64, 40, 24, 56, 36, 20];
  const transcriptEndRef = useRef(null);

  // Initial questions tailored by mode
  const initialQuestions = {
    career_discovery:
      "Welcome to your Live AI Career Discovery Interview! I'm here to understand how you naturally think and what energizes you. Let's start: When you're working on something challenging—whether code, design, or a complex idea—what kind of problem makes you lose track of time?",
    learning_checkpoint: checkpointContext
      ? `Welcome to your Verbal Mastery Checkpoint for ${checkpointContext.title || 'this module'}. In your own words, could you explain the core mechanism of ${checkpointContext.concept || 'the topic'} and why it matters?`
      : "Welcome to your Verbal Learning Checkpoint! In your own words, how would you explain the core concept you just studied to a friend who is new to the topic?",
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

  // Pre-check permissions & speech support
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

    const firstEntry = {
      role: 'ai',
      text: firstQ,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTranscript([firstEntry]);

    if (!forceTextMode && !audioMuted) {
      setAiState('speaking');
      liveInterviewService.speak(firstQ, {
        onStart: () => setAiState('speaking'),
        onEnd: () => {
          // AI finished speaking, auto-start microphone listening
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

  // Start Mic Listening
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
        // If error, allow student to type or retry
      },
      onEnd: (final) => {
        if (final && final.trim().length > 3) {
          // If speech concluded with substantive text, we can suggest submitting or auto-submit
          setCurrentSpokenText(final.trim());
        }
      },
    });
  };

  // Submit student's answer (via voice completion or send button)
  const handleStudentSubmit = async (answerText) => {
    const textToSubmit = (answerText || currentSpokenText || textInputDraft).trim();
    if (!textToSubmit) return;

    liveInterviewService.stopListening();
    liveInterviewService.stopSpeaking();

    // Append student turn to transcript
    const studentEntry = {
      role: 'student',
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...transcript, studentEntry];
    setTranscript(updatedHistory);
    setCurrentSpokenText('');
    setTextInputDraft('');
    setAiState('thinking');

    try {
      // Exchange turn with Gemini / Server
      const res = await liveInterviewService.submitTurn({
        mode,
        context: checkpointContext || { studentGoal: 'Career Discovery' },
        currentQuestion,
        studentAnswer: textToSubmit,
        turnCount,
        maxTurns,
        history: updatedHistory,
      });

      const { data, isAiPowered: powered } = res;
      setIsAiPowered(Boolean(powered));

      if (data.instantInsight) {
        setInstantInsight(data.instantInsight);
      }

      const aiReplyText = data.spokenReply + (data.isFinalTurn ? '' : ' ' + data.followUpQuestion);

      const aiEntry = {
        role: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const nextHistory = [...updatedHistory, aiEntry];
      setTranscript(nextHistory);

      if (data.isFinalTurn || turnCount >= maxTurns) {
        // Conclude interview and evaluate
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
        // Advance turn
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

  // Final Evaluation
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
      setIsAiPowered(Boolean(evalRes.isAiPowered));
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

  // Mic mute toggle
  const toggleMic = () => {
    if (micMuted) {
      setMicMuted(false);
      startStudentMic();
    } else {
      setMicMuted(true);
      liveInterviewService.stopListening();
    }
  };

  // Audio mute toggle
  const toggleAudio = () => {
    if (audioMuted) {
      setAudioMuted(false);
    } else {
      setAudioMuted(true);
      liveInterviewService.stopSpeaking();
    }
  };

  // End interview early
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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[640px] text-slate-100">
      {/* ── HEADER BAR ────────────────────────────────────── */}
      <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-white text-base">
                {mode === 'career_discovery' ? 'Live AI Career Interviewer' : 'Live AI Verbal Checkpoint'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {isAiPowered ? 'Gemini 2.5 Flash' : 'Conversational Engine'}
              </span>
              {isTextFallback && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Text Fallback Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Interactive oral assessment • Evaluates reasoning & authentic examples
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {sessionState === 'active' && (
            <>
              {/* Question progress */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
                <span>Turn {turnCount} of {maxTurns}</span>
                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${(turnCount / maxTurns) * 100}%` }}
                  />
                </div>
              </div>

              {/* Speaker toggle */}
              <button
                onClick={toggleAudio}
                title={audioMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
                className={`p-2 rounded-xl border transition ${
                  audioMuted
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* End Interview button */}
              <button
                onClick={handleEndEarly}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition flex items-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5 fill-rose-400" />
                <span>End</span>
              </button>
            </>
          )}

          {sessionState === 'completed' && (
            <button
              onClick={() => {
                setSessionState('idle');
                onExit();
              }}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* ── STAGE 1: IDLE / PRE-JOIN SCREEN ────────────────── */}
      {sessionState === 'idle' && (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
              <Mic className="w-12 h-12 text-white animate-bounce" />
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
              Live Voice
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            {mode === 'career_discovery'
              ? 'Real-Time Live AI Career Interview'
              : 'Real-Time Live AI Learning Checkpoint'}
          </h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Experience an authentic spoken conversation with ZHERO&apos;s AI Interviewer. The interviewer will ask you
            verbal questions, listen to your spoken answers in real time, and adapt dynamic follow-up questions to explore
            your genuine understanding and reasoning.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mb-8 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                <Brain className="w-4 h-4" />
              </div>
              <p className="font-semibold text-white text-xs mb-1">Adaptive Questions</p>
              <p className="text-[11px] text-slate-400">
                Follow-ups test depth and clarity—not a static fixed question list.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="font-semibold text-white text-xs mb-1">Evidence-Based</p>
              <p className="text-[11px] text-slate-400">
                Evaluated on substance and logic—not accent, speed, or voice pitch.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                <UserCheck className="w-4 h-4" />
              </div>
              <p className="font-semibold text-white text-xs mb-1">Distinct from Human Meet</p>
              <p className="text-[11px] text-slate-400">
                AI prep evidence complements your human counsellor discussion.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <button
              onClick={requestStartInterview}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition flex items-center justify-center gap-2 group"
            >
              <Mic className="w-4 h-4" />
              <span>Start Live Spoken Interview</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => startInterviewSession(true)}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-xs transition border border-slate-700"
            >
              Continue in Text Mode Instead
            </button>
          </div>
        </div>
      )}

      {/* ── STAGE 2: PERMISSION CHECK / TROUBLESHOOTING ───── */}
      {sessionState === 'permission_check' && (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          {micPermissionGranted === false ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Microphone Permission Needed</h3>
              <p className="text-slate-400 text-xs mb-4">
                {permissionError || 'Please allow microphone access in your browser to speak directly with the AI.'}
              </p>
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={requestStartInterview}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition"
                >
                  Retry Microphone Access
                </button>
                <button
                  onClick={() => startInterviewSession(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition border border-slate-700"
                >
                  Continue in Text Mode
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-sm text-slate-300 font-medium">Checking microphone & audio permissions...</p>
            </div>
          )}
        </div>
      )}

      {/* ── STAGE 3: ACTIVE LIVE INTERVIEW ROOM ────────────── */}
      {sessionState === 'active' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT: AI INTERVIEWER AVATAR & INTERVIEW STAGE */}
          <div className="flex-1 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-900 to-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800/80">
            {/* Live Status Pill */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    aiState === 'speaking'
                      ? 'bg-purple-500 animate-ping'
                      : aiState === 'listening'
                      ? 'bg-emerald-500 animate-pulse'
                      : aiState === 'thinking'
                      ? 'bg-amber-400 animate-spin'
                      : 'bg-slate-500'
                  }`}
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {aiState === 'speaking'
                    ? 'AI is Speaking...'
                    : aiState === 'listening'
                    ? 'Listening to you...'
                    : aiState === 'thinking'
                    ? 'AI is thinking...'
                    : 'Ready'}
                </span>
              </div>

              {instantInsight && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 max-w-xs truncate">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{instantInsight}</span>
                </div>
              )}
            </div>

            {/* AI Avatar & Audio Visualizer */}
            <div className="flex flex-col items-center my-auto">
              <div className="relative mb-6">
                {/* Glow rings */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-500 blur-xl ${
                    aiState === 'speaking'
                      ? 'bg-purple-500/30 scale-125'
                      : aiState === 'listening'
                      ? 'bg-emerald-500/30 scale-110'
                      : 'bg-indigo-500/10'
                  }`}
                />

                {/* Avatar sphere */}
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-700 via-purple-600 to-pink-500 p-1 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center">
                    <Brain
                      className={`w-10 h-10 transition duration-300 ${
                        aiState === 'speaking'
                          ? 'text-purple-400 scale-110'
                          : aiState === 'listening'
                          ? 'text-emerald-400 animate-pulse'
                          : 'text-indigo-400'
                      }`}
                    />
                    <span className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-wider">
                      ZHERO AI
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Audio Wave Graphic */}
              <div className="flex items-center gap-1 h-8 mb-4">
                {visualizerBars.map((height, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      aiState === 'speaking'
                        ? 'bg-purple-400'
                        : aiState === 'listening'
                        ? 'bg-emerald-400'
                        : 'bg-slate-700'
                    }`}
                    style={{
                      height:
                        aiState === 'speaking' || aiState === 'listening'
                          ? `${Math.max(8, Math.sin(Date.now() / 200 + i) * height)}px`
                          : '6px',
                    }}
                  />
                ))}
              </div>

              {/* Current AI Question Banner */}
              <div className="w-full max-w-lg bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center shadow-lg">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1.5 flex items-center justify-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Current Question (Turn {turnCount}/{maxTurns})</span>
                </p>
                <p className="text-sm font-medium text-white leading-relaxed">{currentQuestion}</p>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="w-full max-w-lg mt-6 flex flex-col gap-3">
              {/* Live interim spoken preview */}
              {currentSpokenText && (
                <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2 animate-fade-in">
                  <Mic className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5 animate-pulse" />
                  <span className="italic leading-relaxed">&ldquo;{currentSpokenText}&rdquo;</span>
                </div>
              )}

              {/* Voice vs Text Controls */}
              {!isTextFallback ? (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={toggleMic}
                    className={`px-5 py-3 rounded-2xl font-medium text-xs flex items-center gap-2 transition shadow-lg ${
                      micMuted
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    }`}
                  >
                    {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 animate-pulse" />}
                    <span>{micMuted ? 'Unmute Mic' : 'Mic Active (Listening)'}</span>
                  </button>

                  <button
                    onClick={() => handleStudentSubmit(currentSpokenText)}
                    disabled={!currentSpokenText || aiState === 'thinking'}
                    className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none text-white font-medium text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
                  >
                    <span>Submit Answer</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsTextFallback(true)}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition"
                    title="Switch to typing mode"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Text Fallback Form */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleStudentSubmit(textInputDraft);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={textInputDraft}
                    onChange={(e) => setTextInputDraft(e.target.value)}
                    placeholder="Type your spoken answer here..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!textInputDraft.trim() || aiState === 'thinking'}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTextFallback(false)}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs"
                    title="Switch back to voice mode"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT: REAL-TIME CONVERSATION TRANSCRIPT */}
          <div className="w-full lg:w-96 flex flex-col bg-slate-950/60 p-4 border-t lg:border-t-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Live Interview Transcript</span>
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                {transcript.length} turns recorded
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[460px]">
              {transcript.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    item.role === 'ai' ? 'items-start' : 'items-end'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.role === 'ai' ? 'AI Interviewer' : 'You (Student)'}
                    </span>
                    <span className="text-[10px] text-slate-600">{item.timestamp}</span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs max-w-[90%] leading-relaxed ${
                      item.role === 'ai'
                        ? 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-sm'
                        : 'bg-indigo-600/90 text-white rounded-tr-sm shadow-md'
                    }`}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* ── STAGE 4: EVALUATING SCREEN ─────────────────────── */}
      {sessionState === 'evaluating' && (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center animate-spin">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Spoken Responses...</h3>
          <p className="text-slate-400 text-xs mb-4 leading-relaxed">
            Synthesizing conversational evidence, reasoning clarity, and concrete examples using Gemini AI rubric
            evaluations. Accent and fluency are excluded.
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-full w-2/3 animate-pulse" />
          </div>
        </div>
      )}

      {/* ── STAGE 5: COMPLETED STRUCTURED EVALUATION REPORT ── */}
      {sessionState === 'completed' && evaluationReport && (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[720px] space-y-6">
          {/* Header Summary Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Live AI Interview Evaluation Report</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {evaluationReport.evidenceCertainty || 'High Certainty'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Mode: {mode === 'career_discovery' ? 'Career Discovery Assessment' : 'Learning Checkpoint'} • AI
                  Rubric Validated
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Mastery Score</p>
                  <p className="text-xl font-extrabold text-indigo-400">
                    {evaluationReport.conceptualMasteryScore || 88}
                    <span className="text-xs text-slate-400">/100</span>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {evaluationReport.overallSummary}
            </p>
          </div>

          {/* Grid: Strengths & Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Demonstrated Strengths (Substantive Evidence)</span>
              </h4>
              <ul className="space-y-2">
                {(evaluationReport.demonstratedStrengths || []).map((s, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                <Compass className="w-4 h-4" />
                <span>Areas for Growth & Targeted Exploration</span>
              </h4>
              <ul className="space-y-2">
                {(evaluationReport.areasForGrowth || []).map((a, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Career Alignments or Learning Next Steps */}
          {evaluationReport.recommendedCareerAlignments && (
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Validated Career Alignments from Verbal Reasoning</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {evaluationReport.recommendedCareerAlignments.map((car, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium"
                  >
                    {car}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Human Mentor Discussion Points */}
          <div className="p-5 rounded-2xl bg-purple-900/10 border border-purple-500/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4" />
              <span>Recommended Discussion Points for Human Mentor Meet</span>
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              This verbal interview is an AI diagnostic. Take these verified prompts into your upcoming live video
              session with a human mentor:
            </p>
            <ul className="space-y-2">
              {(evaluationReport.actionableMentorDiscussionPoints || []).map((pt, i) => (
                <li key={i} className="text-xs text-purple-200/90 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Next Steps */}
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Suggested Next Steps in ZHERO</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(evaluationReport.suggestedNextSteps || []).map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
