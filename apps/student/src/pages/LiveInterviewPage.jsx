import React, { useState } from 'react';
import {
  Mic,
  Brain,
  Sparkles,
  Award,
  History,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import LiveAiInterviewRoom from '../components/LiveAiInterviewRoom';
import { liveInterviewService } from '../services/liveInterviewService';

export default function LiveInterviewPage({ onNavigate = () => {} }) {
  const [activeTab, setActiveTab] = useState('interview'); // 'interview' | 'history'
  const [selectedMode, setSelectedMode] = useState('career_discovery'); // 'career_discovery' | 'learning_checkpoint'
  const [selectedCheckpoint, setSelectedCheckpoint] = useState({
    title: 'Modern Web Architecture & Data Flow',
    concept: 'Client-Server API communication, state persistence, and error handling',
  });
  const [inActiveInterview, setInActiveInterview] = useState(false);
  const [savedReports, setSavedReports] = useState(() => liveInterviewService.getSavedReports());

  const learningModules = [
    {
      id: 'web-arch',
      title: 'Modern Web Architecture & Data Flow',
      concept: 'Client-Server API communication, state synchronization, and resilience',
      duration: '3 turns • ~5 mins',
    },
    {
      id: 'dsa-tradeoffs',
      title: 'Algorithm & Data Structure Trade-offs',
      concept: 'Space-time complexity, hash maps vs binary trees in production systems',
      duration: '3 turns • ~5 mins',
    },
    {
      id: 'system-design',
      title: 'Scalable System Design & Caching',
      concept: 'Cache invalidation, load balancing, and database indexing',
      duration: '3 turns • ~5 mins',
    },
  ];

  const handleInterviewComplete = (report) => {
    // Refresh saved reports
    setSavedReports(liveInterviewService.getSavedReports());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Mic className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Live AI Verbal Assessment</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Real-Time Voice
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            Live spoken interview with adaptive AI reasoning. Evaluates depth, thought process, and concrete examples.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab('interview');
              setInActiveInterview(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'interview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interview Room
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              setSavedReports(liveInterviewService.getSavedReports());
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Past Reports ({savedReports.length})</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          {!inActiveInterview ? (
            <>
              {/* Mode Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mode 1: Career Discovery */}
                <div
                  onClick={() => setSelectedMode('career_discovery')}
                  className={`cursor-pointer p-6 rounded-3xl border transition relative overflow-hidden group ${
                    selectedMode === 'career_discovery'
                      ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                      4 Turns • ~6 mins
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition">
                    Career Discovery Interview
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    Explore your natural motivations, problem-solving mindset under ambiguity, preferred working
                    environments, and real-world project scenarios.
                  </p>

                  <div className="space-y-2 text-xs text-slate-300 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Adaptive reasoning questions tailored to your answers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Synchronizes with your Preliminary Career Report</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Generates targeted discussion points for your human mentor meet</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMode('career_discovery');
                      setInActiveInterview(true);
                    }}
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Enter Career Interview</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Mode 2: Learning Checkpoint */}
                <div
                  onClick={() => setSelectedMode('learning_checkpoint')}
                  className={`cursor-pointer p-6 rounded-3xl border transition relative overflow-hidden group ${
                    selectedMode === 'learning_checkpoint'
                      ? 'bg-gradient-to-b from-purple-950/40 to-slate-900 border-purple-500 shadow-xl shadow-purple-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Brain className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                      3 Turns • ~5 mins
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">
                    Verbal Learning Checkpoint
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    Orally explain concepts, justify architectural trade-offs, and solve realistic problems to unlock
                    adaptive roadmap mastery gates.
                  </p>

                  {/* Module Picker */}
                  <div className="space-y-2 mb-6">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select Topic to Defend:
                    </p>
                    <div className="space-y-1.5">
                      {learningModules.map((mod) => (
                        <div
                          key={mod.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCheckpoint(mod);
                            setSelectedMode('learning_checkpoint');
                          }}
                          className={`p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                            selectedCheckpoint.id === mod.id && selectedMode === 'learning_checkpoint'
                              ? 'bg-purple-900/30 border-purple-500/60 text-white'
                              : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <span className="font-medium truncate">{mod.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{mod.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMode('learning_checkpoint');
                      setInActiveInterview(true);
                    }}
                    className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Enter Checkpoint Interview</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Informational Guidance Banner */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-white">How the Live AI Interview operates:</p>
                  <p className="text-slate-400 leading-relaxed">
                    1. When you enter, the AI interviewer will verbally speak the first question aloud using speech synthesis.
                    <br />
                    2. Speak your answer into your microphone naturally. Your words will appear live in the transcript.
                    <br />
                    3. Gemini evaluates your reasoning substance and dynamically replies with a relevant follow-up question.
                    <br />
                    4. At the conclusion, you will receive a transparent rubric report detailing verified strengths, growth areas, and mentor talking points.
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Active Live Interview Room Container */
            <LiveAiInterviewRoom
              mode={selectedMode}
              checkpointContext={selectedMode === 'learning_checkpoint' ? selectedCheckpoint : null}
              onComplete={handleInterviewComplete}
              onExit={() => setInActiveInterview(false)}
            />
          )}
        </div>
      )}

      {/* ── HISTORY / PAST EVALUATION REPORTS TAB ─────────── */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {savedReports.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
              <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">No Completed Interviews Yet</h3>
              <p className="text-slate-400 text-xs mb-4">
                Start your first live voice interview to generate verified oral assessment reports.
              </p>
              <button
                onClick={() => {
                  setActiveTab('interview');
                  setInActiveInterview(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition"
              >
                Start an Interview Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedReports.map((entry) => (
                <div
                  key={entry.id}
                  className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-white text-sm">
                        {entry.mode === 'career_discovery'
                          ? 'Career Discovery Live Interview'
                          : 'Verbal Learning Checkpoint'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                        {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Mastery:</span>
                      <span className="text-sm font-bold text-indigo-400">
                        {entry.report.conceptualMasteryScore || 88}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                    {entry.report.overallSummary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                      <span className="font-semibold text-emerald-400 block mb-1">Demonstrated Strengths</span>
                      <ul className="space-y-1 text-slate-300">
                        {(entry.report.demonstratedStrengths || []).slice(0, 3).map((st, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-400" />
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                      <span className="font-semibold text-purple-400 block mb-1">Mentor Discussion Points</span>
                      <ul className="space-y-1 text-slate-300">
                        {(entry.report.actionableMentorDiscussionPoints || []).slice(0, 2).map((pt, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-purple-400" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
