import React from 'react';
import { Check } from 'lucide-react';

export function AssessmentStageTracker({ currentStage = 1, onStageClick, completedStages = [] }) {
  const stages = [
    { num: 1, label: 'Intake' },
    { num: 2, label: 'Questions' },
    { num: 3, label: 'Consultation' },
    { num: 4, label: 'Matches' },
    { num: 5, label: 'Compare' },
    { num: 6, label: 'Roadmap' },
  ];

  return (
    <div style={{
      marginBottom: '2rem',
      padding: '0.5rem 0',
    }}>
      {/* Stepper Dots & Connector Line */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* Background track */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          right: '14px',
          height: '2px',
          backgroundColor: '#EAE7E2',
          zIndex: 1,
        }} />

        {/* Progress track */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          width: `${((currentStage - 1) / (stages.length - 1)) * 100}%`,
          height: '2px',
          backgroundColor: '#FE6904',
          zIndex: 2,
          transition: 'width 0.2s ease',
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
                width: '24px',
                height: '24px',
                borderRadius: '9999px',
                backgroundColor: isDone || isCurrent ? '#FE6904' : '#FFFFFF',
                border: isDone || isCurrent ? 'none' : '2px solid #EAE7E2',
                color: isDone || isCurrent ? '#FFFFFF' : '#77736F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                {isDone ? <Check size={14} strokeWidth={2.5} /> : st.num}
              </div>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: isCurrent ? 600 : 400,
                color: isCurrent ? '#171717' : '#77736F',
                marginTop: '6px',
                textAlign: 'center',
              }}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
