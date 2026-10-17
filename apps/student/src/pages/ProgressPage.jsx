import React from 'react';
import { storageService } from '../services/storageService';

export function ProgressPage({
  activeRoadmap,
  savedCareers = [],
  completedResources = [],
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
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Progress</h1>
      </div>

      {/* Three-figure row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div className="stat">
          <div className="stat-value">{roadmapPct}%</div>
          <div className="stat-label">Roadmap progress ({completedTasks}/{totalTasks})</div>
        </div>

        <div className="stat">
          <div className="stat-value">{savedCareers.length}</div>
          <div className="stat-label">Saved careers</div>
        </div>

        <div className="stat">
          <div className="stat-value">{completedResources.length}</div>
          <div className="stat-label">Completed resources</div>
        </div>
      </div>

      {/* Activity list */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Recent activity</h2>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('roadmap')}
              className="btn-primary"
              style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
            >
              Resume roadmap
            </button>
          )}
        </div>

        {activityLog.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: '#77736F' }}>No activity recorded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activityLog.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="list-row"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.875rem 1.25rem',
                }}
              >
                <span style={{ fontSize: '0.9rem', color: '#171717' }}>{log.text}</span>
                <span style={{ fontSize: '0.8rem', color: '#77736F' }}>{log.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
