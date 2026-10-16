import React from 'react';
import { CheckCircle2, UserCheck, ListChecks, Video, Award, GitCompare, Map } from 'lucide-react';

export function AssessmentStageTracker({ currentStage = 1, onStageClick, completedStages = [] }) {
  const stages = [
    { num: 1, label: 'Class & Interests', icon: UserCheck },
    { num: 2, label: 'AI Assessment (MCQ)', icon: ListChecks },
    { num: 3, label: 'Mentor Meet', icon: Video },
    { num: 4, label: 'Top 5 Suggestions', icon: Award },
    { num: 5, label: 'Career Comparison', icon: GitCompare },
    { num: 6, label: 'Choose Career & Roadmap', icon: Map },
  ];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #EAE7E2',
      padding: '1.25rem 1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(23, 23, 23, 0.03)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isCurrent = currentStage === st.num;
          const isCompleted = completedStages.includes(st.num) || currentStage > st.num;
          const isClickable = isCompleted || isCurrent;

          return (
            <React.Fragment key={st.num}>
              <div
                onClick={() => {
                  if (isClickable && onStageClick) onStageClick(st.num);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: isClickable ? 'pointer' : 'default',
                  opacity: isCurrent ? 1 : isCompleted ? 0.9 : 0.45,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  backgroundColor: isCompleted
                    ? '#E8F5E9'
                    : isCurrent
                    ? '#FFE5CE'
                    : '#F1F0ED',
                  color: isCompleted
                    ? '#2E7D32'
                    : isCurrent
                    ? '#FE6904'
                    : '#77736F',
                  border: isCurrent
                    ? '2px solid #FE6904'
                    : isCompleted
                    ? '1px solid #C8E6C9'
                    : '1px solid #EAE7E2',
                }}>
                  {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                </div>

                <div>
                  <div style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontWeight: 700,
                    color: isCurrent ? '#FE6904' : '#77736F',
                  }}>
                    Stage {st.num}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: isCurrent ? 700 : 600,
                    color: isCurrent ? '#171717' : '#77736F',
                    whiteSpace: 'nowrap',
                  }}>
                    {st.label}
                  </div>
                </div>
              </div>

              {idx < stages.length - 1 && (
                <div style={{
                  flex: '1 1 20px',
                  height: '2px',
                  backgroundColor: currentStage > st.num ? '#2E7D32' : '#EAE7E2',
                  minWidth: '15px',
                  maxWidth: '40px',
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
