import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Brain,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Zap,
  Sliders,
  Check,
  X,
  Award
} from 'lucide-react';
import { calibrationService } from '../services/calibrationService';
import { storageService } from '../services/storageService';

export function LearningCalibrationView({ onNavigateToRoadmap, onNavigateToRevision }) {
  const [calibrationState, setCalibrationState] = useState(() => calibrationService.getCalibrationState());
  const [selectedDay, setSelectedDay] = useState(() => calibrationState.currentDay || 1);
  const [isEditingSyllabus, setIsEditingSyllabus] = useState(false);
  const [showDay1Quiz, setShowDay1Quiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Editable syllabus state
  const [syllabusDraft, setSyllabusDraft] = useState(() => calibrationState.academicSyllabus);

  // Sync state on events
  useEffect(() => {
    const handleUpdate = () => {
      const updated = calibrationService.getCalibrationState();
      setCalibrationState(updated);
      setSyllabusDraft(updated.academicSyllabus);
    };
    window.addEventListener('zhero_calibration_updated', handleUpdate);
    return () => window.removeEventListener('zhero_calibration_updated', handleUpdate);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSelectDay = (day) => {
    setSelectedDay(day);
  };

  const handleAdvanceDay = () => {
    const updated = calibrationService.advanceDay();
    setCalibrationState({ ...updated });
    setSelectedDay(updated.currentDay);
    showToast(`Advanced to Day ${updated.currentDay} of Calibration.`);
  };

  const handleWorkloadTooHeavy = () => {
    const updated = calibrationService.reportWorkloadTooHeavy();
    setCalibrationState({ ...updated });
    showToast('Workload reduced. Pacing adapted to protect your academic schedule.');
  };

  const handleTogglePause = () => {
    if (calibrationState.status === 'paused') {
      const updated = calibrationService.resumeCalibration();
      setCalibrationState({ ...updated });
      showToast('Calibration resumed.');
    } else {
      const updated = calibrationService.pauseCalibration();
      setCalibrationState({ ...updated });
      showToast('Calibration paused. Resume anytime without penalties.');
    }
  };

  const handleSaveSyllabus = (e) => {
    e.preventDefault();
    const updated = calibrationService.updateAcademicSyllabus(syllabusDraft);
    setCalibrationState({ ...updated });
    setIsEditingSyllabus(false);
    showToast('Core academic schedule updated.');
  };

  // Day 1 Baseline Diagnostic Quiz Data
  const baselineQuestions = [
    {
      id: 'bq1',
      question: 'Which of the following describes the difference between an HTTP GET and POST request?',
      options: [
        'GET retrieves data from a server without modifying it; POST sends data to create or update resources.',
        'GET is only used for images; POST is used for HTML pages.',
        'GET is encrypted by default; POST is completely plaintext.',
        'There is no technical difference; they are interchangeable.',
      ],
      correctIndex: 0,
      concept: 'HTTP Protocols & REST API Flow',
    },
    {
      id: 'bq2',
      question: 'In CSS Flexbox, what happens to the main axis when `flex-direction: column` is declared?',
      options: [
        'The main axis becomes vertical, and justify-content aligns items vertically.',
        'The main axis remains horizontal across all viewports.',
        'Items can no longer wrap or expand.',
        'Flexbox is disabled and switches to CSS Grid.',
      ],
      correctIndex: 0,
      concept: 'CSS Flexbox Axes & Alignment',
    },
    {
      id: 'bq3',
      question: 'Why is JavaScript considered single-threaded, and how does it handle asynchronous network calls?',
      options: [
        'It executes synchronous code on one call stack and delegates async operations to browser Web APIs and the event loop.',
        'It creates a new physical CPU thread for every network request.',
        'It pauses the entire operating system until the server responds.',
        'It converts all code into synchronous blocking loops.',
      ],
      correctIndex: 0,
      concept: 'JavaScript Event Loop & Concurrency',
    },
    {
      id: 'bq4',
      question: 'Why is using semantic HTML elements (<header>, <nav>, <article>) preferable over generic <div> tags?',
      options: [
        'It improves screen reader accessibility, browser parsing, and structural SEO indexing.',
        'Browsers render <div> tags 10 times slower than semantic tags.',
        'Semantic tags automatically add CSS background colors.',
        'Modern JavaScript frameworks crash when using <div> tags.',
      ],
      correctIndex: 0,
      concept: 'Semantic HTML5 Structural Landmarks',
    },
  ];

  const handleSelectQuizAnswer = (qId, optionIdx) => {
    setQuizAnswers({ ...quizAnswers, [qId]: optionIdx });
  };

  const handleSubmitBaselineQuiz = () => {
    let score = 0;
    const total = baselineQuestions.length;
    baselineQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score += 1;
        // Record mastered event
        calibrationService.recordLearningEvent({
          activityType: 'quiz',
          conceptTitle: q.concept,
          conceptId: q.id,
          result: 'mastered',
          score: 100,
          selfReportedConfidence: 4,
          perceivedDifficulty: 'manageable',
          notes: 'Correct response on Day 1 baseline check.',
        });
      } else {
        // Record struggling event for honest calibration
        calibrationService.recordLearningEvent({
          activityType: 'quiz',
          conceptTitle: q.concept,
          conceptId: q.id,
          result: 'struggling',
          score: 40,
          selfReportedConfidence: 2,
          perceivedDifficulty: 'challenging',
          notes: 'Incorrect baseline response. Flagged for targeted reinforcement.',
        });
      }
    });

    const scorePct = Math.round((score / total) * 100);
    setQuizSubmitted(true);
    setCalibrationState(calibrationService.getCalibrationState());
    showToast(`Baseline check completed: ${score}/${total} concepts verified.`);
  };

  const schedule = calibrationService.getDaySchedule(selectedDay);
  const profile = calibrationState.learningProfile;
  const syllabus = calibrationState.academicSyllabus;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in text-slate-800">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold border border-slate-700 animate-slide-up">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>7-Day Adaptive Learning Calibration</span>
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                calibrationState.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : calibrationState.status === 'paused'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              {calibrationState.status === 'completed'
                ? 'Calibration Complete'
                : calibrationState.status === 'paused'
                ? 'Calibration Paused'
                : `Day ${calibrationState.currentDay} Active (Provisional Plan)`}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            How ZHERO Adapts to Your Natural Pace
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            We never replace your core school or college coursework. During this 7-day observation window, ZHERO provides a
            manageable provisional plan, observes where you excel or need practice, and progressively tunes your roadmap.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleTogglePause}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            {calibrationState.status === 'paused' ? (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-slate-500" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            onClick={handleWorkloadTooHeavy}
            title="Dials down optional workload immediately"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>Workload Too Heavy?</span>
          </button>
        </div>
      </div>

      {/* ── 7-DAY PROGRESS STEPPER ──────────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">7-Day Observation Timeline</h3>
            <p className="text-xs text-slate-500">
              Select any day to inspect its focus, planned workload, and rationale.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Current: Day {calibrationState.currentDay} of 7
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isCurrent = day === calibrationState.currentDay;
            const isCompleted = day < calibrationState.currentDay || calibrationState.status === 'completed';
            const isSelected = day === selectedDay;

            return (
              <button
                key={day}
                onClick={() => handleSelectDay(day)}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition border text-center relative ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/50'
                    : isCurrent
                    ? 'bg-amber-50/70 border-amber-300'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-slate-50 border-slate-200/60 opacity-80'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Day
                </span>
                <span className="text-base font-extrabold text-slate-800 my-0.5">{day}</span>
                <span className="text-[10px] font-semibold text-slate-500 truncate w-full px-1">
                  {day === 1
                    ? 'Baseline'
                    : day === 2 || day === 3
                    ? 'Observe'
                    : day === 4 || day === 5
                    ? 'Adapt'
                    : day === 6
                    ? 'Applied'
                    : 'Review'}
                </span>

                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 absolute top-1.5 right-1.5" />
                )}
                {isCurrent && !isCompleted && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {calibrationState.currentDay < 7 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              💡 Missed a day? No penalty. Calibration resumes naturally when you return.
            </span>
            <button
              onClick={handleAdvanceDay}
              className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Advance to Next Day</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* ── TWO-COLUMN SECTION: ACADEMIC PROTECTION & TODAY'S SCHEDULE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (1/3): CORE ACADEMIC SYLLABUS PROTECTION */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Core Academic Syllabus</h3>
              </div>
              <button
                onClick={() => setIsEditingSyllabus(!isEditingSyllabus)}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                {isEditingSyllabus ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {!isEditingSyllabus ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Academic Level & Stream</span>
                  <p className="font-bold text-slate-800">{syllabus.academicLevel}</p>
                  <p className="text-slate-600">{syllabus.stream}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Prescribed Core Subjects</span>
                  <div className="flex flex-wrap gap-1.5">
                    {syllabus.coreSubjects.map((sub, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Upcoming Exam Deadlines</span>
                  <div className="space-y-1.5">
                    {syllabus.upcomingExams.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between text-[11px]"
                      >
                        <span className="font-semibold text-amber-900">{ex.subject}</span>
                        <span className="text-amber-700 font-bold">{ex.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-semibold block mb-1">
                    Available for Optional ZHERO Learning:
                  </span>
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>Weekdays: <strong>{syllabus.availableHoursWeekday} hrs/day</strong></span>
                    <span>Weekends: <strong>{syllabus.availableHoursWeekend} hrs/day</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              /* Syllabus Editor Form */
              <form onSubmit={handleSaveSyllabus} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Class / Academic Level</label>
                  <input
                    type="text"
                    value={syllabusDraft.academicLevel}
                    onChange={(e) => setSyllabusDraft({ ...syllabusDraft, academicLevel: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Course / Stream</label>
                  <input
                    type="text"
                    value={syllabusDraft.stream}
                    onChange={(e) => setSyllabusDraft({ ...syllabusDraft, stream: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Weekday Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="6"
                      value={syllabusDraft.availableHoursWeekday}
                      onChange={(e) =>
                        setSyllabusDraft({ ...syllabusDraft, availableHoursWeekday: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Weekend Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="10"
                      value={syllabusDraft.availableHoursWeekend}
                      onChange={(e) =>
                        setSyllabusDraft({ ...syllabusDraft, availableHoursWeekend: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition"
                >
                  Save Academic Schedule
                </button>
              </form>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed">
            🛡️ <strong>Rule:</strong> ZHERO activities scale back automatically when academic exams approach.
          </div>
        </div>

        {/* RIGHT COLUMN (2/3): SELECTED DAY'S RECOMMENDED ACTIVITIES */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                  {schedule.theme}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Recommended Activities for Day {selectedDay}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Budget: ~{schedule.maxAvailableMinutes} mins available
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 leading-relaxed">
              <strong>Why this plan:</strong> {schedule.explanation}
            </p>

            {/* Activities List */}
            <div className="space-y-3">
              {schedule.activities.map((act, i) => (
                <div
                  key={act.id || i}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {act.type.replace('_', ' ')}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{act.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{act.estimatedMinutes}m</span>
                    </span>

                    {act.type === 'baseline_quiz' && !quizSubmitted && (
                      <button
                        onClick={() => setShowDay1Quiz(true)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition"
                      >
                        Start Check
                      </button>
                    )}

                    {act.type === 'baseline_quiz' && quizSubmitted && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    )}

                    {act.type === 'verbal_checkpoint' && (
                      <button
                        onClick={onNavigateToRoadmap}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
                      >
                        Open Checkpoint
                      </button>
                    )}

                    {act.type === 'spaced_repetition' && (
                      <button
                        onClick={onNavigateToRevision}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
                      >
                        Start Revision
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workload Safety Reminder */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Pacing Mode:{' '}
              <strong className="text-slate-800 uppercase text-[10px]">
                {syllabus.workloadPacing}
              </strong>
            </span>
            <button
              onClick={handleWorkloadTooHeavy}
              className="text-amber-600 font-bold hover:underline"
            >
              Report Workload is Too Heavy
            </button>
          </div>
        </div>
      </div>

      {/* ── DAY 1 BASELINE DIAGNOSTIC MODAL / WIDGET ────────────── */}
      {showDay1Quiz && !quizSubmitted && (
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 md:p-8 shadow-xl animate-fade-in space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                Day 1 Baseline Assessment
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                4-Question Foundational Check (No Grading Pressure)
              </h3>
            </div>
            <button
              onClick={() => setShowDay1Quiz(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {baselineQuestions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="text-xs font-bold text-slate-800">
                  {idx + 1}. {q.question}
                </p>
                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => (
                    <label
                      key={optIdx}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                        quizAnswers[q.id] === optIdx
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={quizAnswers[q.id] === optIdx}
                        onChange={() => handleSelectQuizAnswer(q.id, optIdx)}
                        className="mt-0.5"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setShowDay1Quiz(false)}
              className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitBaselineQuiz}
              disabled={Object.keys(quizAnswers).length < baselineQuestions.length}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Submit Baseline Check
            </button>
          </div>
        </div>
      )}

      {/* ── ACCUMULATED LEARNING PROFILE & EVIDENCE AUDIT ──────── */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Accumulated Evidence & Learning Profile
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  profile.evidenceQuality === 'high'
                    ? 'bg-emerald-100 text-emerald-800'
                    : profile.evidenceQuality === 'moderate'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {profile.evidenceQuality.replace('_', ' ')} ({profile.evidenceCount} observations)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real learning observations compiled from quizzes, checkpoints, and revision reviews.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">Progression:</span>
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] bg-slate-100 px-2 py-1 rounded-lg">
              {profile.learningProgression.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Fact-based Observations Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <span className="font-bold text-slate-800 block mb-1">Observation Synthesis:</span>
          {profile.summaryObservations.map((obs, idx) => (
            <p key={idx} className="text-slate-600 leading-relaxed flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span>{obs}</span>
            </p>
          ))}
        </div>

        {/* Competencies vs Gaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Competencies */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demonstrated Competencies ({profile.competencies.length})</span>
            </span>
            {profile.competencies.length === 0 ? (
              <p className="text-xs text-emerald-700/80 italic">
                No demonstrated competencies recorded yet. Complete baseline activities to verify.
              </p>
            ) : (
              <div className="space-y-1.5">
                {profile.competencies.map((c, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-white border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between"
                  >
                    <span>{c.concept}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      {c.observationsCount} obs
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Learning Gaps */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Areas Needing Practice ({profile.learningGaps.length})</span>
            </span>
            {profile.learningGaps.length === 0 ? (
              <p className="text-xs text-amber-700/80 italic">
                No active gaps detected. The calibration engine will flag points requiring targeted practice.
              </p>
            ) : (
              <div className="space-y-1.5">
                {profile.learningGaps.map((g, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-white border border-amber-200 text-xs text-amber-900 font-medium flex items-center justify-between"
                  >
                    <span>{g.concept}</span>
                    <span className="text-[10px] text-amber-700 font-bold">
                      {g.attempts} attempts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
