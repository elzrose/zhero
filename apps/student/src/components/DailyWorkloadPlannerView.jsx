import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Sparkles,
  Zap,
  RotateCcw,
  Coffee,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Award
} from 'lucide-react';
import { dailyPlannerService } from '../services/dailyPlannerService';

export function DailyWorkloadPlannerView({ onNavigateToRoadmap, onNavigateToInterview }) {
  const [planState, setPlanState] = useState(() => dailyPlannerService.getDailyPlanState());
  const [academicNote, setAcademicNote] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync state with storage events or external updates
  useEffect(() => {
    const handlePlanUpdate = () => {
      setPlanState(dailyPlannerService.getDailyPlanState());
    };
    window.addEventListener('zhero_daily_plan_updated', handlePlanUpdate);
    window.addEventListener('storage', handlePlanUpdate);
    return () => {
      window.removeEventListener('zhero_daily_plan_updated', handlePlanUpdate);
      window.removeEventListener('storage', handlePlanUpdate);
    };
  }, []);

  const showNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const handleTimeChange = (minutes) => {
    const updated = dailyPlannerService.setAvailableMinutes(minutes);
    setPlanState(updated);
    showNotification(`Daily available time set to ${minutes} mins. Plan updated.`);
  };

  const handleModeChange = (mode) => {
    const updated = dailyPlannerService.setScheduleMode(mode);
    setPlanState(updated);
    if (mode === 'exam_week') {
      showNotification('Exam Week mode active: Core academic studies protected with micro-sessions.');
    } else if (mode === 'rest_day') {
      showNotification('Rest Day mode: Workload scaled down to a calm minimal check.');
    } else {
      showNotification(`Schedule mode changed to ${mode}.`);
    }
  };

  const handleStressChange = (level) => {
    const updated = dailyPlannerService.setStressLevel(level);
    setPlanState(updated);
    showNotification(`Workload adapted for "${level}" pacing.`);
  };

  const handleLightenWorkload = () => {
    const updated = dailyPlannerService.lightenTodayWorkload();
    setPlanState(updated);
    showNotification("Today's workload lightened by 40% without academic backlog penalty.");
  };

  const handleCompleteTask = (taskId, title) => {
    const updated = dailyPlannerService.completeTask(taskId, { score: 95, confidence: 5 });
    setPlanState(updated);
    showNotification(`Completed: "${title}". Learning record updated!`);
  };

  const handleDeferTask = (taskId, title) => {
    const updated = dailyPlannerService.deferTask(taskId, 'Deferred calmly to a future session');
    setPlanState(updated);
    showNotification(`Deferred "${title}". No penalty or backlog accumulation.`);
  };

  const handleShortenTask = (taskId, title) => {
    const updated = dailyPlannerService.requestShorterAlternative(taskId);
    setPlanState(updated);
    showNotification(`Converted "${title}" into a concise micro-checkpoint.`);
  };

  const totalAllocatedMinutes = (planState.tasks || [])
    .filter((t) => t.status !== 'deferred')
    .reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);

  const completedMinutes = (planState.tasks || [])
    .filter((t) => t.status === 'completed')
    .reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);

  // Weekly history summary
  const weeklyHistory = planState.weeklyHistory || [];
  const totalWeeklyCompletedMins = weeklyHistory.reduce((acc, h) => acc + (h.completedMinutes || 0), 0);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
      }}
    >
      {/* Success alert */}
      {successMessage && (
        <div
          style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#065F46',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} color="#059669" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Top Header with Syllabus Protection Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid #F0EEEB',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#FE6904',
                letterSpacing: '0.06em',
                backgroundColor: '#FFE5CE',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              <ShieldCheck size={13} />
              Core Syllabus Protected
            </span>
            <span style={{ fontSize: '0.75rem', color: '#77736F' }}>• Today: {planState.date}</span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171717', margin: 0, letterSpacing: '-0.02em' }}>
            Today's Adaptive Learning Plan
          </h2>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: '#77736F', maxWidth: '650px' }}>
            Personalized optional career development that fits around your school or college commitments without competing with your core syllabus.
          </p>
        </div>

        {/* Quick Dial-Down Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleLightenWorkload}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.55rem 0.95rem',
              borderRadius: '10px',
              backgroundColor: '#FFF7ED',
              border: '1px solid #FDBA74',
              color: '#C2410C',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Instantly reduces today's duration by 40% without academic penalty"
          >
            <Coffee size={14} />
            <span>Lighten Today's Load</span>
          </button>
        </div>
      </div>

      {/* Material Change Reason Alert if exists */}
      {planState.materialChangeReason && (
        <div
          style={{
            backgroundColor: planState.scheduleMode === 'exam_week' ? '#FEF2F2' : '#FFFBEB',
            border: `1px solid ${planState.scheduleMode === 'exam_week' ? '#FECACA' : '#FDE68A'}`,
            borderRadius: '12px',
            padding: '0.85rem 1.15rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Sparkles
            size={18}
            color={planState.scheduleMode === 'exam_week' ? '#DC2626' : '#D97706'}
            style={{ flexShrink: 0 }}
          />
          <div style={{ fontSize: '0.85rem', color: planState.scheduleMode === 'exam_week' ? '#991B1B' : '#92400E' }}>
            <strong>Adaptive Adjustment:</strong> {planState.materialChangeReason}
          </div>
        </div>
      )}

      {/* Availability Controls & Academic Status */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          backgroundColor: '#FAF8F5',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.75rem',
        }}
      >
        {/* Available Additional Learning Time Presets */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
            Available Additional Time Today
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[10, 20, 30, 45, 60].map((mins) => {
              const isSelected = planState.declaredMinutes === mins;
              return (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleTimeChange(mins)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: isSelected ? '1px solid #FE6904' : '1px solid #E5E1DA',
                    backgroundColor: isSelected ? '#FE6904' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#44403C',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 2px 6px rgba(254, 105, 4, 0.2)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {mins} min
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#77736F' }}>
            Allocated: <strong>{totalAllocatedMinutes}m</strong> / Effective Limit: <strong>{planState.effectiveAvailableMinutes}m</strong>
          </div>
        </div>

        {/* Academic Schedule Mode */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
            Academic Context & Schedule Mode
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'normal', label: 'Regular Week' },
              { id: 'exam_week', label: '📝 Exam Week (Priority)' },
              { id: 'holiday', label: '🎉 Holiday' },
              { id: 'rest_day', label: '☕ Rest Day' },
            ].map((m) => {
              const isSelected = planState.scheduleMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleModeChange(m.id)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: isSelected ? '1px solid #FE6904' : '1px solid #E5E1DA',
                    backgroundColor: isSelected ? '#FFE5CE' : '#FFFFFF',
                    color: isSelected ? '#C2410C' : '#44403C',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#77736F' }}>
            {planState.scheduleMode === 'exam_week'
              ? 'Caps optional workload to 10–15 mins to safeguard school/college exams.'
              : 'Adapts optional career learning strictly around your core subjects.'}
          </div>
        </div>

        {/* Self-Reported Stress / Workload Pacing */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
            Pacing & Stress Check-In
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'manageable', label: 'Steady' },
              { id: 'heavy', label: 'Busy' },
              { id: 'overwhelmed', label: 'Overloaded' },
            ].map((s) => {
              const isSelected = planState.stressLevel === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStressChange(s.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: isSelected ? '1px solid #FA9B2A' : '1px solid #E5E1DA',
                    backgroundColor: isSelected ? '#FFF7ED' : '#FFFFFF',
                    color: isSelected ? '#EA580C' : '#57534E',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#77736F' }}>
            Non-judgmental: We adjust pacing automatically without lowering your career targets.
          </div>
        </div>
      </div>

      {/* Prioritized Activities List */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', margin: 0 }}>
            Prioritized Activities ({planState.tasks?.length || 0})
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>
            {completedMinutes} mins completed today
          </span>
        </div>

        {(!planState.tasks || planState.tasks.length === 0) ? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#FAF8F5',
              borderRadius: '12px',
              border: '1px dashed #DDD8D0',
            }}
          >
            <CheckCircle2 size={32} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#171717' }}>All set for today!</h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#77736F' }}>
              No remaining career learning tasks scheduled for today. Rest up or focus on your core syllabus!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {planState.tasks.map((task, idx) => {
              const isCompleted = task.status === 'completed';
              const isDeferred = task.status === 'deferred';

              // Type badge styling
              let badgeBg = '#E0F2FE';
              let badgeColor = '#0369A1';
              let badgeLabel = 'Roadmap Milestone';
              if (task.type === 'revision') {
                badgeBg = '#FEF3C7';
                badgeColor = '#B45309';
                badgeLabel = '⚡ Due Revision (SM-2)';
              } else if (task.type === 'remediation') {
                badgeBg = '#FEE2E2';
                badgeColor = '#B91C1C';
                badgeLabel = '🎯 Targeted Remediation';
              } else if (task.type === 'enrichment') {
                badgeBg = '#EDE9FE';
                badgeColor = '#6D28D9';
                badgeLabel = '🌟 Optional Practical';
              }

              return (
                <div
                  key={task.id || idx}
                  style={{
                    border: isCompleted
                      ? '1px solid #D1FAE5'
                      : isDeferred
                      ? '1px solid #E5E5E5'
                      : '1px solid #EAE7E2',
                    backgroundColor: isCompleted ? '#F0FDF4' : isDeferred ? '#F9FAFB' : '#FFFFFF',
                    borderRadius: '14px',
                    padding: '1.15rem 1.25rem',
                    opacity: isDeferred ? 0.65 : 1,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ flex: '1 1 300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: badgeBg,
                            color: badgeColor,
                          }}
                        >
                          {badgeLabel}
                        </span>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#57534E',
                          }}
                        >
                          <Clock size={12} />
                          {task.estimatedMinutes} mins
                        </span>

                        {task.isMicroAlternative && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#FEF08A',
                              color: '#854D0E',
                            }}
                          >
                            Micro-Check
                          </span>
                        )}
                      </div>

                      <h4
                        style={{
                          margin: 0,
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: isCompleted ? '#065F46' : '#171717',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </h4>

                      <p
                        style={{
                          margin: '0.3rem 0 0',
                          fontSize: '0.8rem',
                          color: '#77736F',
                          lineHeight: '1.4',
                        }}
                      >
                        <strong>Why scheduled:</strong> {task.reason}
                      </p>
                    </div>

                    {/* Action Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {!isCompleted && !isDeferred && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleCompleteTask(task.id, task.title)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '0.5rem 0.85rem',
                              borderRadius: '8px',
                              backgroundColor: '#FE6904',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(254, 105, 4, 0.25)',
                            }}
                          >
                            <CheckCircle2 size={13} />
                            <span>Mark Complete</span>
                          </button>

                          {!task.isMicroAlternative && (
                            <button
                              type="button"
                              onClick={() => handleShortenTask(task.id, task.title)}
                              style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: '8px',
                                backgroundColor: '#FAF8F5',
                                border: '1px solid #DDD8D0',
                                color: '#44403C',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                              title="Convert to a 5-minute micro checkpoint"
                            >
                              Shorter Alternative
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeferTask(task.id, task.title)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              borderRadius: '8px',
                              backgroundColor: '#FAF8F5',
                              border: '1px solid #DDD8D0',
                              color: '#77736F',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                            title="Defer calmly without backlog penalty"
                          >
                            Defer
                          </button>
                        </>
                      )}

                      {isCompleted && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: '#059669',
                            backgroundColor: '#D1FAE5',
                            padding: '4px 10px',
                            borderRadius: '8px',
                          }}
                        >
                          <CheckCircle2 size={14} /> Completed
                        </span>
                      )}

                      {isDeferred && (
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: '#9CA3AF',
                            backgroundColor: '#F3F4F6',
                            padding: '4px 10px',
                            borderRadius: '8px',
                          }}
                        >
                          Deferred calmly
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Calm Weekly Progress Tracker (Planned vs Completed) */}
      <div
        style={{
          borderTop: '1px solid #F0EEEB',
          paddingTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171717' }}>
            Weekly Learning Rhythm (Past 7 Days)
          </div>
          <div style={{ fontSize: '0.78rem', color: '#77736F', marginTop: '2px' }}>
            Total Completed: <strong>{totalWeeklyCompletedMins} mins</strong> • Calm, non-punitive tracking
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onNavigateToRoadmap && (
            <button
              type="button"
              onClick={onNavigateToRoadmap}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.5rem 0.95rem',
                borderRadius: '8px',
                backgroundColor: '#FFE5CE',
                border: '1px solid #FA9B2A',
                color: '#C2410C',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>View Full 4-Phase Roadmap</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
