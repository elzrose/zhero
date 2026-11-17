import React, { useState } from 'react';
import { useTuitionStore } from '../data/store';
import { SPACED_REPETITION_QUEUE } from '../data/studentCompatibility';
import { StatCard } from '../components/Modal';

export function RetentionView() {
  const store = useTuitionStore();
  const queue = store.spacedRepetition || SPACED_REPETITION_QUEUE;

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Overdue' | 'HighRisk' | 'Calibrated'
  const [calibrationMode, setCalibrationMode] = useState(true); // 7-day academic calibration on/off
  const [reviewNotice, setReviewNotice] = useState(null);

  const totalConcepts = queue.length;
  const overdueConcepts = queue.filter(q => q.daysOverdue > 0);
  const avgRetention = Math.round(queue.reduce((acc, q) => acc + q.retentionHealth, 0) / (totalConcepts || 1));
  const highRiskCount = queue.filter(q => q.decayRisk === 'High' || q.decayRisk === 'Critical').length;

  const filteredQueue = queue.filter(item => {
    if (activeTab === 'Overdue') return item.daysOverdue > 0;
    if (activeTab === 'HighRisk') return item.decayRisk === 'High' || item.decayRisk === 'Critical';
    if (activeTab === 'Calibrated') return item.intervalDays >= 7;
    return true;
  });

  const handleTriggerReview = (conceptName) => {
    setReviewNotice(`Spaced repetition recall test sent to affected students for: "${conceptName}"`);
    setTimeout(() => setReviewNotice(null), 4000);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
              Spaced Repetition & Retention Health Hub
            </h1>
            <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.75rem' }}>
              SuperMemo-2 (SM-2)
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
            Combats the Ebbinghaus forgetting curve with automated Leitner intervals and 7-day coursework calibration.
          </p>
        </div>

        {/* 7-Day Calibration Switch */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          background: calibrationMode ? '#EAF7EE' : '#FAF8F5',
          border: `1px solid ${calibrationMode ? '#C3E6CB' : 'var(--tc-border)'}`,
          borderRadius: '10px'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: calibrationMode ? '#1E7E34' : '#171717' }}>
              7-Day Academic Calibration: {calibrationMode ? 'ACTIVE' : 'PAUSED'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)' }}>
              Shields university exam weeks from retention overload
            </div>
          </div>
          <button
            onClick={() => setCalibrationMode(!calibrationMode)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: 'none',
              background: calibrationMode ? '#1E7E34' : 'var(--tc-near-black)',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {calibrationMode ? 'Enabled' : 'Enable'}
          </button>
        </div>
      </div>

      {reviewNotice && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#EAF7EE',
          border: '1px solid #C3E6CB',
          color: '#1E7E34',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          ✓ {reviewNotice}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard
          title="Cohort Retention Index"
          value={`${avgRetention}%`}
          subtext="Ebbinghaus recall stability"
          trend="+6% vs baseline"
          icon="🧠"
          highlight={true}
        />
        <StatCard
          title="Tracked Knowledge Nodes"
          value={totalConcepts}
          subtext="Spaced SM-2 flashcard concepts"
          icon="📚"
        />
        <StatCard
          title="Overdue Recall Cards"
          value={overdueConcepts.length}
          subtext="Concepts past memory interval"
          tag={overdueConcepts.length > 0 ? "Due Today" : "On Track"}
          icon="⏳"
        />
        <StatCard
          title="Memory Decay Risk"
          value={highRiskCount}
          subtext="High or critical decay rate"
          icon="⚠️"
        />
      </div>

      {/* SuperMemo-2 Leitner Interval Explanation Banner */}
      <div style={{
        background: 'var(--tc-card-gradient)',
        border: '1px solid #EED180',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
          📐 SuperMemo-2 (SM-2) Interval Progression
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--tc-charcoal)', lineHeight: 1.5, margin: 0 }}>
          Concepts advance through expanding review intervals: <strong>Day 1 → Day 3 → Day 7 → Day 14 → Day 30</strong>.
          If recall confidence drops below 70%, the interval automatically compresses to prevent memory loss without overwhelming the student's academic schedule.
        </p>

        {/* Interval Stages Visualization */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
          {[
            { stage: 'Stage 1', days: '1 Day', label: 'Initial Imprint', count: queue.filter(q => q.intervalDays === 1).length },
            { stage: 'Stage 2', days: '3 Days', label: 'Early Retention', count: queue.filter(q => q.intervalDays === 3).length },
            { stage: 'Stage 3', days: '7 Days', label: 'Consolidation', count: queue.filter(q => q.intervalDays === 7).length },
            { stage: 'Stage 4', days: '14 Days', label: 'Long-term Sync', count: queue.filter(q => q.intervalDays === 14).length },
            { stage: 'Stage 5', days: '30 Days', label: 'Mastery Anchor', count: queue.filter(q => q.intervalDays === 30).length },
          ].map(s => (
            <div key={s.stage} style={{ background: '#FFFFFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--tc-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)', fontWeight: 600 }}>{s.stage}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8C6A05' }}>{s.days}</div>
              <div style={{ fontSize: '0.75rem', color: '#171717', marginTop: '0.15rem' }}>{s.count} concepts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs and Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'All', label: 'All Knowledge Nodes', count: totalConcepts },
          { id: 'Overdue', label: '⏳ Overdue Recall', count: overdueConcepts.length },
          { id: 'HighRisk', label: '⚠️ High Decay Risk', count: highRiskCount },
          { id: 'Calibrated', label: 'Consolidated (≥ 7d)', count: queue.filter(q => q.intervalDays >= 7).length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'tc-btn-primary' : 'tc-btn-secondary'}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Concept Items Table */}
      <div className="tc-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tc-table">
          <thead>
            <tr>
              <th>Concept & Subject Module</th>
              <th>Student</th>
              <th>Retention Health</th>
              <th>SM-2 Interval</th>
              <th>Due Date</th>
              <th>Decay Risk</th>
              <th style={{ textAlign: 'right' }}>Faculty Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueue.map(item => (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#171717' }}>{item.concept}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>{item.module}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 600 }}>{item.studentName}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: item.retentionHealth >= 80 ? '#1E7E34' : item.retentionHealth >= 65 ? '#B78103' : '#C53030' }}>
                      {item.retentionHealth}%
                    </span>
                    <div style={{ width: '60px', height: '4px', background: '#EAE5D8', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${item.retentionHealth}%`,
                        height: '100%',
                        background: item.retentionHealth >= 80 ? '#1E7E34' : item.retentionHealth >= 65 ? '#B78103' : '#C53030'
                      }} />
                    </div>
                  </div>
                </td>
                <td>
                  <span className="tc-badge tc-badge-neutral" style={{ fontSize: '0.75rem' }}>
                    {item.intervalDays} Days (Rep: {item.repetitions})
                  </span>
                </td>
                <td>
                  <span style={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: item.daysOverdue > 0 ? '#C53030' : 'var(--tc-charcoal)'
                  }}>
                    {item.daysOverdue > 0 ? `⚠️ Overdue ${item.daysOverdue}d` : item.nextReviewDate}
                  </span>
                </td>
                <td>
                  <span className={`tc-badge ${item.decayRisk === 'Low' ? 'tc-badge-success' : item.decayRisk === 'Medium' ? 'tc-badge-yellow' : 'tc-badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                    {item.decayRisk}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => handleTriggerReview(item.concept)}
                    className="tc-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                  >
                    Trigger Recall ⚡
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
