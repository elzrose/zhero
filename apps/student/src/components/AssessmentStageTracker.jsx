import React from 'react';
import { Check } from 'lucide-react';

export function AssessmentStageTracker({ currentStage = 1, onStageClick, completedStages = [] }) {
  const stages = [
    { num: 1, label: 'Intake' },
    { num: 2, label: 'AI MCQ Assessment' },
    { num: 3, label: 'Mentor Meet' },
    { num: 4, label: 'Top 5 Careers' },
    { num: 5, label: 'Comparison' },
    { num: 6, label: 'Roadmap' },
  ];

  const currentInfo = stages.find((s) => s.num === currentStage) || stages[0];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #EAE7E2',
      padding: '1.25rem 2rem',
      marginBottom: '2.5rem',
      boxShadow: '0 2px 12px rgba(23, 23, 23, 0.02)',
    }}>
      {/* Top stage title info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '999px',
            backgroundColor: '#FFE5CE',
            color: '#FE6904',
            letterSpacing: '0.02em',
          }}>
            STAGE {currentStage} OF 6
          </span>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#171717' }}>
            {currentInfo.label}
          </span>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#77736F' }}>
          {Math.round(((currentStage - 1) / (stages.length - 1)) * 100)}% Complete
        </div>
      </div>

      {/* Stepper Dots & Connector Line */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Continuous background bar */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '12px',
          right: '12px',
          height: '2px',
          backgroundColor: '#EAE7E2',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }} />

        {/* Active progress fill */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '12px',
          width: `${((currentStage - 1) / (stages.length - 1)) * 100}%`,
          height: '2.5px',
          backgroundColor: '#FE6904',
          transform: 'translateY(-50%)',
          transition: 'width 0.3s ease',
          zIndex: 2,
        }} />

        {/* Step Nodes */}
        {stages.map((st) => {
          const isCurrent = currentStage === st.num;
          const isDone = completedStages.includes(st.num) || currentStage > st.num;
          const isClickable = isDone || isCurrent;

          return (
            <div
              key={st.num}
              onClick={() => {
                if (isClickable && onStageClick) onStageClick(st.num);
              }}
              style={{
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: isClickable ? 'pointer' : 'default',
              }}
            >
              <div style={{
                width: isCurrent ? '30px' : '24px',
                height: isCurrent ? '30px' : '24px',
                borderRadius: '50%',
                backgroundColor: isDone
                  ? '#10B981'
                  : isCurrent
                  ? '#FE6904'
                  : '#FFFFFF',
                border: isDone
                  ? 'none'
                  : isCurrent
                  ? '3px solid #FFE5CE'
                  : '2px solid #D1D5DB',
                color: isDone || isCurrent ? '#FFFFFF' : '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800,
                boxShadow: isCurrent ? '0 0 0 3px rgba(254, 105, 4, 0.2)' : 'none',
                transition: 'all 0.2s ease',
              }}>
                {isDone ? <Check size={14} strokeWidth={3} /> : st.num}
              </div>

              <div style={{
                fontSize: '0.72rem',
                fontWeight: isCurrent ? 800 : 500,
                color: isCurrent ? '#FE6904' : isDone ? '#171717' : '#9CA3AF',
                marginTop: '6px',
                whiteSpace: 'nowrap',
                display: 'none', // clean minimal view on mobile; or use media query
              }}>
                {st.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
