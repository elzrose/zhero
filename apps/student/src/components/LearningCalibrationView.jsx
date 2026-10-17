import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Brain,
  ShieldCheck,
  ArrowRight,
  Pause,
  Play,
  Sliders,
  Check,
  X
} from 'lucide-react';
import { calibrationService } from '../services/calibrationService';

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
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSelectDay = (day) => {
    setSelectedDay(day);
  };

  const handleAdvanceDay = () => {
    const updated = calibrationService.advanceDay();
    setCalibrationState({ ...updated });
    setSelectedDay(updated.currentDay);
    showToast(`Day ${updated.currentDay} active.`);
  };

  const handleWorkloadTooHeavy = () => {
    const updated = calibrationService.reportWorkloadTooHeavy();
    setCalibrationState({ ...updated });
    showToast('Workload reduced.');
  };

  const handleTogglePause = () => {
    if (calibrationState.status === 'paused') {
      const updated = calibrationService.resumeCalibration();
      setCalibrationState({ ...updated });
      showToast('Plan resumed.');
    } else {
      const updated = calibrationService.pauseCalibration();
      setCalibrationState({ ...updated });
      showToast('Plan paused.');
    }
  };

  const handleSaveSyllabus = (e) => {
    e.preventDefault();
    const updated = calibrationService.updateAcademicSyllabus(syllabusDraft);
    setCalibrationState({ ...updated });
    setIsEditingSyllabus(false);
    showToast('Schedule updated.');
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
      question: 'What is the primary benefit of immutability in React component state management?',
      options: [
        'React can shallowly compare prev and next state references to determine when to re-render.',
        'It forces all variables to be stored in the browser URL query string.',
        'It allows JavaScript to execute multiple threads concurrently.',
        'It prevents users from inspecting DOM elements via browser devtools.',
      ],
      correctIndex: 0,
      concept: 'React State Immutability & Re-rendering',
    },
    {
      id: 'bq4',
      question: 'Why should sensitive API keys and secrets never be bundled in client-side Single Page Applications?',
      options: [
        'Client-side code is downloaded and fully inspectable in the user browser devtools.',
        'Browsers delete all API keys when tabs are closed.',
        'API keys only work on mobile devices, not desktop browsers.',
        'JavaScript cannot send HTTP headers.',
      ],
      correctIndex: 0,
      concept: 'Client vs Server Security Boundaries',
    },
  ];

  const handleSelectQuizAnswer = (qId, optionIdx) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitBaselineQuiz = () => {
    let score = 0;
    const total = baselineQuestions.length;

    baselineQuestions.forEach((q) => {
      const isCorrect = quizAnswers[q.id] === q.correctIndex;
      if (isCorrect) score += 1;

      calibrationService.recordLearningEvent({
        activityType: 'baseline_quiz',
        conceptTitle: q.concept,
        conceptId: q.id,
        result: isCorrect ? 'mastered' : 'struggling',
        score: isCorrect ? 100 : 0,
        selfReportedConfidence: 3,
        perceivedDifficulty: isCorrect ? 'manageable' : 'challenging',
        notes: `Baseline check question: ${q.concept}`,
      });
    });

    setQuizSubmitted(true);
    showToast(`Baseline complete: ${score} of ${total} correct.`);
  };

  const schedule = calibrationService.getDaySchedule(selectedDay);
  const profile = calibrationService.getAccumulatedProfile();
  const syllabus = calibrationState.academicSyllabus;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {toastMessage && (
        <div style={{
          backgroundColor: '#171717',
          color: '#FFFFFF',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '0.85rem',
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge" style={{ backgroundColor: '#FFE5CE', color: '#FE6904', border: '1px solid #EAE7E2' }}>
              Day {calibrationState.currentDay} of 7
            </span>
            <span className="badge" style={{ backgroundColor: '#F8F8F7', color: '#171717', border: '1px solid #EAE7E2' }}>
              {calibrationState.status === 'completed' ? 'Completed' : calibrationState.status === 'paused' ? 'Paused' : 'Active'}
            </span>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#171717', margin: 0 }}>
            Daily plan
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#77736F', margin: '4px 0 0 0' }}>
            Workload adjusts to fit around your core study commitments.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleTogglePause}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', fontSize: '0.825rem' }}
          >
            {calibrationState.status === 'paused' ? (
              <>
                <Play size={14} color="#FE6904" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause size={14} />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWorkloadTooHeavy}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', fontSize: '0.825rem' }}
          >
            <Sliders size={14} />
            <span>Reduce workload</span>
          </button>
        </div>
      </div>

      {/* 7-Day Stepper */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171717', margin: 0 }}>
              7-day plan
            </h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
            Current: Day {calibrationState.currentDay}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isCurrent = day === calibrationState.currentDay;
            const isCompleted = day < calibrationState.currentDay || calibrationState.status === 'completed';
            const isSelected = day === selectedDay;

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleSelectDay(day)}
                style={{
                  padding: '10px 4px',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid #FE6904' : isCurrent ? '1px solid #FE6904' : '1px solid #EAE7E2',
                  backgroundColor: isSelected ? '#FFE5CE' : isCurrent ? '#FFFFFF' : isCompleted ? '#F8F8F7' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.7rem', color: '#77736F' }}>Day</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: isSelected ? '#FE6904' : '#171717' }}>{day}</div>
                <div style={{ fontSize: '0.7rem', color: '#77736F' }}>
                  {isCompleted ? 'Done' : isCurrent ? 'Active' : ''}
                </div>
              </button>
            );
          })}
        </div>

        {calibrationState.currentDay < 7 && (
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #EAE7E2', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleAdvanceDay}
              className="link-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.825rem' }}
            >
              <span>Next day</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Two Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Core academic schedule */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #EAE7E2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#FE6904" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171717', margin: 0 }}>Academic schedule</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingSyllabus(!isEditingSyllabus)}
              className="link-btn"
              style={{ fontSize: '0.8rem' }}
            >
              {isEditingSyllabus ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {!isEditingSyllabus ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736F', display: 'block' }}>Education</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: '#171717' }}>{syllabus.academicLevel} • {syllabus.stream}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736F', display: 'block', marginBottom: '4px' }}>Subjects</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {syllabus.coreSubjects.map((sub, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F8F8F7', border: '1px solid #EAE7E2', color: '#171717' }}>
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736F', display: 'block', marginBottom: '4px' }}>Upcoming exams</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {syllabus.upcomingExams.map((ex, idx) => (
                    <div key={idx} style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: '#F8F8F7', border: '1px solid #EAE7E2', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: '#171717' }}>{ex.subject}</span>
                      <span style={{ color: '#77736F' }}>{ex.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #EAE7E2', fontSize: '0.8rem', color: '#77736F' }}>
                Available hours: {syllabus.availableHoursWeekday}h weekday • {syllabus.availableHoursWeekend}h weekend
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveSyllabus} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#77736F', marginBottom: '2px' }}>Academic level</label>
                <input
                  type="text"
                  value={syllabusDraft.academicLevel}
                  onChange={(e) => setSyllabusDraft({ ...syllabusDraft, academicLevel: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #EAE7E2', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#77736F', marginBottom: '2px' }}>Stream</label>
                <input
                  type="text"
                  value={syllabusDraft.stream}
                  onChange={(e) => setSyllabusDraft({ ...syllabusDraft, stream: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #EAE7E2', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#77736F', marginBottom: '2px' }}>Weekday hrs</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="6"
                    value={syllabusDraft.availableHoursWeekday}
                    onChange={(e) => setSyllabusDraft({ ...syllabusDraft, availableHoursWeekday: Number(e.target.value) })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #EAE7E2', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#77736F', marginBottom: '2px' }}>Weekend hrs</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    value={syllabusDraft.availableHoursWeekend}
                    onChange={(e) => setSyllabusDraft({ ...syllabusDraft, availableHoursWeekend: Number(e.target.value) })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #EAE7E2', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.825rem', marginTop: '4px' }}
              >
                Save
              </button>
            </form>
          )}
        </div>

        {/* Selected day's activities */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #EAE7E2' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171717', margin: 0 }}>
                Day {selectedDay} tasks
              </h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
              ~{schedule.maxAvailableMinutes} mins
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {schedule.activities.map((act, i) => (
              <div
                key={act.id || i}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717' }}>{act.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#77736F' }}>{act.description}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.75rem', color: '#77736F', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Clock size={12} />
                    <span>{act.estimatedMinutes}m</span>
                  </span>

                  {act.type === 'baseline_quiz' && !quizSubmitted && (
                    <button
                      type="button"
                      onClick={() => setShowDay1Quiz(true)}
                      className="btn-primary"
                      style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
                    >
                      Start
                    </button>
                  )}

                  {act.type === 'baseline_quiz' && quizSubmitted && (
                    <span className="badge" style={{ backgroundColor: '#F8F8F7', color: '#171717', border: '1px solid #EAE7E2' }}>
                      Completed
                    </span>
                  )}

                  {act.type === 'verbal_checkpoint' && (
                    <button
                      type="button"
                      onClick={onNavigateToRoadmap}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
                    >
                      Checkpoint
                    </button>
                  )}

                  {act.type === 'spaced_repetition' && (
                    <button
                      type="button"
                      onClick={onNavigateToRevision}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
                    >
                      Revision
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Baseline Quiz Modal */}
      {showDay1Quiz && !quizSubmitted && (
        <div className="card" style={{ border: '1px solid #FE6904' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #EAE7E2' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#171717', margin: 0 }}>
              Day 1 diagnostic
            </h3>
            <button
              type="button"
              onClick={() => setShowDay1Quiz(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#77736F' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {baselineQuestions.map((q, idx) => (
              <div key={q.id} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#F8F8F7', border: '1px solid #EAE7E2' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: 600, color: '#171717' }}>
                  {idx + 1}. {q.question}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {q.options.map((opt, optIdx) => (
                    <label
                      key={optIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: quizAnswers[q.id] === optIdx ? '1px solid #FE6904' : '1px solid #EAE7E2',
                        backgroundColor: quizAnswers[q.id] === optIdx ? '#FFE5CE' : '#FFFFFF',
                        color: '#171717',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={quizAnswers[q.id] === optIdx}
                        onChange={() => handleSelectQuizAnswer(q.id, optIdx)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowDay1Quiz(false)}
              className="btn-secondary"
              style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.825rem' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitBaselineQuiz}
              disabled={Object.keys(quizAnswers).length < baselineQuestions.length}
              className="btn-primary"
              style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '0.825rem', opacity: Object.keys(quizAnswers).length < baselineQuestions.length ? 0.6 : 1 }}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Skills shown vs Areas needing practice */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #EAE7E2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Brain size={16} color="#FE6904" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171717', margin: 0 }}>
              Learning profile
            </h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
            {profile.evidenceCount} observations
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Skills shown */}
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#F8F8F7', border: '1px solid #EAE7E2' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '8px' }}>
              Skills shown ({profile.competencies.length})
            </div>
            {profile.competencies.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#77736F', margin: 0 }}>
                No verified competencies yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {profile.competencies.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EAE7E2',
                      fontSize: '0.8rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#171717',
                    }}
                  >
                    <span>{c.concept}</span>
                    <span style={{ fontSize: '0.75rem', color: '#77736F' }}>{c.observationsCount} obs</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Areas needing practice */}
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#F8F8F7', border: '1px solid #EAE7E2' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '8px' }}>
              Areas needing practice ({profile.learningGaps.length})
            </div>
            {profile.learningGaps.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#77736F', margin: 0 }}>
                No active gaps recorded.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {profile.learningGaps.map((g, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EAE7E2',
                      fontSize: '0.8rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#171717',
                    }}
                  >
                    <span>{g.concept}</span>
                    <span style={{ fontSize: '0.75rem', color: '#77736F' }}>{g.attempts} attempts</span>
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
