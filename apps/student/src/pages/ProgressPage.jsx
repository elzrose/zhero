import React from 'react';
import { CheckCircle2, Bookmark, Map, BookOpen, ArrowRight } from 'lucide-react';
import { storageService } from '../services/storageService';

export function ProgressPage({
  activeRoadmap,
  savedCareers,
  completedResources,
  onNavigate
}) {
  const activityLog = storageService.getActivityLog();

  let totalTasks = 0;
  let completedTasks = 0;
  if (activeRoadmap?.phases) {
    activeRoadmap.phases.forEach((p) => {
      p.tasks.forEach((t) => {
        totalTasks += 1;
        if (t.completed) completedTasks += 1;
      });
    });
  }
  const roadmapPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em', margin: 0 }}>
          My Learning & Growth Progress
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#77736F', marginTop: '0.35rem' }}>
          Real metrics and activity logs reflecting your self-paced career readiness journey.
        </p>
      </div>

      {/* 4 Quantitative Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Aptitude Assessment</span>
            <CheckCircle2 size={16} color="#2E7D32" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', marginTop: '0.5rem' }}>
            100%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 600 }}>16 of 16 Answered</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Roadmap Milestones</span>
            <Map size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', marginTop: '0.5rem' }}>
            {roadmapPct}%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#77736F' }}>{completedTasks} of {totalTasks} Tasks Completed</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Target Careers</span>
            <Bookmark size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', marginTop: '0.5rem' }}>
            {savedCareers.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#77736F' }}>Saved Bookmarks</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Resources Mastered</span>
            <BookOpen size={16} color="#2E7D32" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', marginTop: '0.5rem' }}>
            {completedResources.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 600 }}>Tutorials & Docs</span>
        </div>
      </div>

      {/* Two Column: Next Actions & Activity Log */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Next Recommended Milestones */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
            Recommended Next Step
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#77736F', marginBottom: '1.25rem' }}>
            Keep up your learning momentum for target career: <strong style={{ color: '#171717' }}>{activeRoadmap?.careerTitle}</strong>
          </p>

          <div style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            background: '#FFE5CE',
            border: '1px solid #FA9B2A',
            marginBottom: '1.25rem',
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FE6904', textTransform: 'uppercase' }}>
              Priority Milestone
            </span>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#171717', margin: '4px 0' }}>
              Build interactive SPA components using React & Hooks
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#77736F', margin: 0 }}>
              Estimated duration: 2 weeks
            </p>
          </div>

          <button
            onClick={() => onNavigate('roadmap')}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            <span>Continue on Roadmap</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Real-time Activity Timeline */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
            Recent Activity Audit
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#77736F', marginBottom: '1.25rem' }}>
            Actions recorded in this local session.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activityLog.slice(0, 5).map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#FE6904',
                  marginTop: '6px',
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#171717', fontWeight: 500 }}>{log.text}</div>
                  <div style={{ fontSize: '0.72rem', color: '#77736F', marginTop: '2px' }}>{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
