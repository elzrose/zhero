import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Eye
} from 'lucide-react';
import { spacedRepetitionService } from '../services/spacedRepetitionService';
import { storageService } from '../services/storageService';
import { calibrationService } from '../services/calibrationService';

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

    calibrationService.recordLearningEvent({
      activityType: 'spaced_repetition',
      conceptTitle: currentPracticeConcept.title,
      conceptId: currentPracticeConcept.id,
      result: rating >= 2 ? 'mastered' : 'struggling',
      score: rating === 3 ? 100 : rating === 2 ? 75 : rating === 1 ? 50 : 25,
      selfReportedConfidence: rating + 1,
      perceivedDifficulty: rating <= 1 ? 'challenging' : 'manageable',
      notes: `Active recall rating: ${rating}/3 (${result?.ratingLabel || ''})`,
    });

    if (result?.adaptiveRemediationTriggered) {
      storageService.injectAdaptiveRemediationTask(
        currentPracticeConcept.title,
        currentPracticeConcept.milestoneTitle
      );
      if (onRoadmapUpdated) {
        onRoadmapUpdated();
      }
      setToastNotification('Revision milestone added to roadmap');
    } else {
      setToastNotification(`Review recorded. Next in ${result?.newInterval} days.`);
    }

    setTimeout(() => setToastNotification(''), 3000);

    setStudentRecallNotes('');
    setIsAnswerRevealed(false);
    refreshData();

    if (activeConceptIndex >= dueConcepts.length - 1) {
      setSessionCompleted(true);
    } else {
      setActiveConceptIndex(activeConceptIndex + 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {toastNotification && (
        <div style={{
          backgroundColor: '#171717',
          color: '#FFFFFF',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '0.85rem',
        }}>
          {toastNotification}
        </div>
      )}

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
      }}>
        <div className="stat">
          <div className="stat-value">{stats.dueCount}</div>
          <div className="stat-label">Due for review</div>
        </div>

        <div className="stat">
          <div className="stat-value">{stats.avgRetention}%</div>
          <div className="stat-label">Retention health</div>
        </div>

        <div className="stat">
          <div className="stat-value">{stats.masteredCount}</div>
          <div className="stat-label">Mastered concepts</div>
        </div>

        <div className="stat">
          <div className="stat-value">{stats.totalConcepts}</div>
          <div className="stat-label">Total tracked</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setFilterMode('due')}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #EAE7E2',
            backgroundColor: filterMode === 'due' ? '#FFE5CE' : '#FFFFFF',
            color: filterMode === 'due' ? '#FE6904' : '#171717',
            fontSize: '0.825rem',
            fontWeight: filterMode === 'due' ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          Due today ({dueConcepts.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #EAE7E2',
            backgroundColor: filterMode === 'all' ? '#FFE5CE' : '#FFFFFF',
            color: filterMode === 'all' ? '#FE6904' : '#171717',
            fontSize: '0.825rem',
            fontWeight: filterMode === 'all' ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          All concepts ({concepts.length})
        </button>
      </div>

      {/* Active Practice Card */}
      {currentPracticeConcept && !sessionCompleted ? (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge" style={{ backgroundColor: '#FFE5CE', color: '#FE6904', border: '1px solid #EAE7E2' }}>
              Card {activeConceptIndex + 1} of {dueConcepts.length}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
              {currentPracticeConcept.milestoneTitle}
            </span>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#171717', margin: '0 0 0.75rem 0' }}>
            {currentPracticeConcept.title}
          </h3>

          <div style={{
            backgroundColor: '#F8F8F7',
            border: '1px solid #EAE7E2',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#171717', lineHeight: '1.5' }}>
              "{currentPracticeConcept.prompt}"
            </p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#77736F', marginBottom: '4px' }}>
              Your recall summary
            </label>
            <textarea
              value={studentRecallNotes}
              onChange={(e) => setStudentRecallNotes(e.target.value)}
              placeholder="Summarize your understanding..."
              rows={3}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {!isAnswerRevealed ? (
            <button
              type="button"
              onClick={() => setIsAnswerRevealed(true)}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}
            >
              <Eye size={14} />
              <span>Reveal answer</span>
            </button>
          ) : (
            <div>
              <div style={{
                backgroundColor: '#F8F8F7',
                border: '1px solid #EAE7E2',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.25rem',
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                  Model answer
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#171717', lineHeight: '1.5' }}>
                  {currentPracticeConcept.modelAnswer}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: '#77736F', marginBottom: '8px' }}>
                  Rate your recall
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleRateConcept(1)}
                    className="btn-secondary"
                    style={{ padding: '8px 12px', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem' }}
                  >
                    Hard (Review soon)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRateConcept(2)}
                    className="btn-secondary"
                    style={{ padding: '8px 12px', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem' }}
                  >
                    Good (Progressing)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRateConcept(3)}
                    className="btn-primary"
                    style={{ padding: '8px 12px', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem' }}
                  >
                    Easy (Mastered)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : dueConcepts.length === 0 || sessionCompleted ? (
        <div style={{ padding: '2rem 0', textAlign: 'center' }}>
          <p style={{ fontSize: '0.95rem', color: '#171717', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
            Revision complete
          </p>
          <p style={{ fontSize: '0.85rem', color: '#77736F', margin: 0 }}>
            All due concepts have been reviewed.
          </p>
        </div>
      ) : null}

      {/* Monitored Concepts List */}
      <div className="section">
        <h4 className="section-title">
          Tracked concepts ({displayedConcepts.length})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {displayedConcepts.map((c) => {
            const retention = spacedRepetitionService.calculateRetentionHealth(c);
            const isDue = spacedRepetitionService.isDueForReview(c);

            return (
              <div
                key={c.id}
                className="list-row"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1.25rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#171717' }}>
                      {c.title}
                    </span>
                    {isDue && (
                      <span className="badge" style={{ backgroundColor: '#FFE5CE', color: '#FE6904', border: '1px solid #EAE7E2' }}>
                        Due
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#77736F', marginTop: '2px' }}>
                    {c.milestoneTitle} • Interval: {c.intervalDays} days
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#171717' }}>
                    {retention}% retention
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
