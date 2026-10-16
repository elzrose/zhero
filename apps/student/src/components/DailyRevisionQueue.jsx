import React, { useState } from 'react';
import {
  RotateCcw,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Calendar,
  Layers,
  ChevronRight,
  Eye,
  Sparkles
} from 'lucide-react';
import { spacedRepetitionService } from '../services/spacedRepetitionService';
import { storageService } from '../services/storageService';

export function DailyRevisionQueue({ onRoadmapUpdated }) {
  const [concepts, setConcepts] = useState(() => spacedRepetitionService.getAllConcepts());
  const [stats, setStats] = useState(() => spacedRepetitionService.getRevisionStats());
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [studentRecallNotes, setStudentRecallNotes] = useState('');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [filterMode, setFilterMode] = useState('due'); // 'due' | 'all'
  const [toastNotification, setToastNotification] = useState('');

  const dueConcepts = concepts.filter((c) => spacedRepetitionService.isDueForReview(c));
  const displayedConcepts = filterMode === 'due' ? dueConcepts : concepts;
  const currentPracticeConcept = dueConcepts[activeConceptIndex] || null;

  const refreshData = () => {
    const updated = spacedRepetitionService.getAllConcepts();
    setConcepts(updated);
    setStats(spacedRepetitionService.getRevisionStats());
  };

  const handleRateConcept = (rating) => {
    if (!currentPracticeConcept) return;

    const result = spacedRepetitionService.recordRetrieval(
      currentPracticeConcept.id,
      rating,
      studentRecallNotes
    );

    // If rated Hard (1), trigger adaptive revision task injection into the active roadmap
    if (result?.adaptiveRemediationTriggered) {
      storageService.injectAdaptiveRemediationTask(
        currentPracticeConcept.title,
        currentPracticeConcept.milestoneTitle
      );
      if (onRoadmapUpdated) {
        onRoadmapUpdated();
      }
      setToastNotification(`⚡ Struggled with concept: Automated revision milestone added to your roadmap!`);
    } else {
      setToastNotification(`✓ Active retrieval recorded! Next review scheduled in ${result?.newInterval} days.`);
    }

    setTimeout(() => setToastNotification(''), 4000);

    // Move to next due concept
    setStudentRecallNotes('');
    setIsAnswerRevealed(false);
    refreshData();

    if (activeConceptIndex >= dueConcepts.length - 1) {
      setSessionCompleted(true);
    } else {
      setActiveConceptIndex(activeConceptIndex + 1);
    }
  };

  const getRetentionColor = (pct) => {
    if (pct >= 80) return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', label: 'Strong Retention' };
    if (pct >= 55) return { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', label: 'Review Due' };
    return { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA', label: 'Memory Fading' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div style={{
          backgroundColor: '#171717',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '14px',
          fontSize: '0.875rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 24px rgba(23, 23, 23, 0.2)',
          animation: 'fadeIn 0.2s ease',
        }}>
          <Sparkles size={16} color="#FE6904" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Forgetting Curve & Metrics Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Card 1: Due Today */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          boxShadow: '0 2px 10px rgba(23, 23, 23, 0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FE6904', marginBottom: '8px' }}>
            <Zap size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>Due For Review</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#171717' }}>
            {stats.dueCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#77736F', marginTop: '2px' }}>
            Concepts ready for retrieval practice
          </div>
        </div>

        {/* Card 2: Average Retention Health */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          boxShadow: '0 2px 10px rgba(23, 23, 23, 0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', marginBottom: '8px' }}>
            <TrendingUp size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>Retention Health</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#047857' }}>
            {stats.avgRetention}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#77736F', marginTop: '2px' }}>
            Estimated active recall strength
          </div>
        </div>

        {/* Card 3: Concepts Mastered */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          boxShadow: '0 2px 10px rgba(23, 23, 23, 0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366F1', marginBottom: '8px' }}>
            <Award size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>Mastered Concepts</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#171717' }}>
            {stats.masteredCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#77736F', marginTop: '2px' }}>
            Interval ≥ 14 days without memory decay
          </div>
        </div>

        {/* Card 4: Total Monitored */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          boxShadow: '0 2px 10px rgba(23, 23, 23, 0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', marginBottom: '8px' }}>
            <Layers size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>Total Enrolled</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#171717' }}>
            {stats.totalConcepts}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#77736F', marginTop: '2px' }}>
            Tracked across your career roadmap
          </div>
        </div>
      </div>

      {/* Transparent Algorithm & Forgetting Curve Explainability Card */}
      <div style={{
        backgroundColor: '#FBFBFA',
        border: '1px solid #EAE7E2',
        borderRadius: '20px',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: '#FFE5CE',
              color: '#FE6904',
            }}>
              Transparent SM-2 Retrieval Model
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#57534E', lineHeight: '1.55' }}>
            ZHERO uses an evidence-based spaced retrieval heuristic (Day 1 → 3 → 7 → 16 → 35). Review intervals expand when retrieval is effortless and contract when you struggle. If you flag a concept as hard, an automated adaptive revision task is immediately added to your roadmap.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setFilterMode('due')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: filterMode === 'due' ? '1.5px solid #FE6904' : '1px solid #EAE7E2',
              backgroundColor: filterMode === 'due' ? '#FFE5CE' : '#FFFFFF',
              color: filterMode === 'due' ? '#FE6904' : '#171717',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Due Today ({dueConcepts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: filterMode === 'all' ? '1.5px solid #FE6904' : '1px solid #EAE7E2',
              backgroundColor: filterMode === 'all' ? '#FFE5CE' : '#FFFFFF',
              color: filterMode === 'all' ? '#FE6904' : '#171717',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            All Monitored ({concepts.length})
          </button>
        </div>
      </div>

      {/* Active Retrieval Practice Session */}
      {currentPracticeConcept && !sessionCompleted ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #FE6904',
          boxShadow: '0 8px 30px rgba(254, 105, 4, 0.08)',
          padding: '2.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '3px 12px',
                borderRadius: '999px',
                backgroundColor: '#FFE5CE',
                color: '#FE6904',
              }}>
                Card {activeConceptIndex + 1} of {dueConcepts.length} Due Today
              </span>
              <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
                from <strong>{currentPracticeConcept.milestoneTitle}</strong>
              </span>
            </div>

            {/* Retention Health Pill */}
            {(() => {
              const ret = spacedRepetitionService.calculateRetentionHealth(currentPracticeConcept);
              const col = getRetentionColor(ret);
              return (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: col.bg,
                  color: col.text,
                  border: `1px solid ${col.border}`,
                }}>
                  Memory Retention: {ret}%
                </span>
              );
            })()}
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#171717', margin: '0 0 1rem 0' }}>
            {currentPracticeConcept.title}
          </h3>

          <div style={{
            backgroundColor: '#FBFBFA',
            border: '1px solid #EAE7E2',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FE6904', textTransform: 'uppercase', marginBottom: '4px' }}>
              Active Recall Challenge
            </div>
            <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: 600, color: '#171717', lineHeight: '1.55' }}>
              "{currentPracticeConcept.prompt}"
            </p>
          </div>

          {/* Student Recall Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#171717', marginBottom: '6px' }}>
              Your Recall Summary (Mental or Written):
            </label>
            <textarea
              value={studentRecallNotes}
              onChange={(e) => setStudentRecallNotes(e.target.value)}
              placeholder="Jot down the key mechanics or summarize mentally before checking the answer..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid #EAE7E2',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {!isAnswerRevealed ? (
            <button
              type="button"
              onClick={() => setIsAnswerRevealed(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                backgroundColor: '#171717',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              <Eye size={16} />
              <span>Reveal Model Solution & Self-Rate</span>
            </button>
          ) : (
            /* Model Solution & Self-Evaluation Options */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '16px',
                padding: '1.25rem',
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Model Solution & Conceptual Rubric
                </div>
                <p style={{ margin: 0, fontSize: '0.925rem', color: '#065F46', lineHeight: '1.6' }}>
                  {currentPracticeConcept.modelAnswer}
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#171717', marginBottom: '10px' }}>
                  How easily did you recall this concept?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {/* Rating 1: Hard */}
                  <button
                    type="button"
                    onClick={() => handleRateConcept(1)}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      border: '1.5px solid #FECACA',
                      backgroundColor: '#FEF2F2',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#B91C1C' }}>
                      🔴 Hard / Struggled
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#991B1B', marginTop: '4px' }}>
                      Reset interval to 1 day & inject adaptive roadmap review
                    </div>
                  </button>

                  {/* Rating 2: Good */}
                  <button
                    type="button"
                    onClick={() => handleRateConcept(2)}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      border: '1.5px solid #FDE68A',
                      backgroundColor: '#FFFBEB',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#B45309' }}>
                      🟡 Good / Recalled
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#92400E', marginTop: '4px' }}>
                      Standard expansion (approx. 2x interval)
                    </div>
                  </button>

                  {/* Rating 3: Easy */}
                  <button
                    type="button"
                    onClick={() => handleRateConcept(3)}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      border: '1.5px solid #A7F3D0',
                      backgroundColor: '#ECFDF5',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#047857' }}>
                      🟢 Easy / Mastered
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#065F46', marginTop: '4px' }}>
                      Fast-track expansion (approx. 3x interval)
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : dueConcepts.length === 0 || sessionCompleted ? (
        /* Zero Due / Session Completed Banner */
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #EAE7E2',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 2px 10px rgba(23, 23, 23, 0.02)',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '20px',
            backgroundColor: '#ECFDF5',
            color: '#047857',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <CheckCircle2 size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171717', margin: '0 0 6px 0' }}>
            Daily Revision Complete!
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#77736F', margin: 0, maxWidth: '480px', marginInline: 'auto', lineHeight: '1.6' }}>
            All due concepts have been reviewed. As you complete more milestones via Verbal AI Checkpoints, new concepts will enter your spaced repetition schedule.
          </p>
        </div>
      ) : null}

      {/* Monitored Concepts Retention Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '1.75rem',
        boxShadow: '0 2px 10px rgba(23, 23, 23, 0.02)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h4 style={{ margin: '0 0 2px 0', fontSize: '1.15rem', fontWeight: 800, color: '#171717' }}>
              Concept Retention Matrix
            </h4>
            <div style={{ fontSize: '0.8rem', color: '#77736F' }}>
              Tracking {displayedConcepts.length} concepts across your career learning trajectory
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {displayedConcepts.map((c) => {
            const retention = spacedRepetitionService.calculateRetentionHealth(c);
            const col = getRetentionColor(retention);
            const isDue = spacedRepetitionService.isDueForReview(c);

            return (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  borderRadius: '14px',
                  backgroundColor: '#FBFBFA',
                  border: isDue ? '1px solid #FE6904' : '1px solid #EAE7E2',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#171717' }}>
                      {c.title}
                    </h5>
                    {isDue && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        backgroundColor: '#FFE5CE',
                        color: '#FE6904',
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}>
                        Due Now
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#77736F' }}>
                    Milestone: {c.milestoneTitle} • Review Interval: <strong>{c.intervalDays} days</strong> • Repetitions: {c.repetitions || 0}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Retention Health Bar */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: col.text }}>
                      {retention}% Retention
                    </div>
                    <div style={{ width: '80px', height: '6px', backgroundColor: '#EAE7E2', borderRadius: '999px', marginTop: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${retention}%`, height: '100%', backgroundColor: col.text, borderRadius: '999px' }} />
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: col.bg,
                    color: col.text,
                    border: `1px solid ${col.border}`,
                  }}>
                    {col.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
