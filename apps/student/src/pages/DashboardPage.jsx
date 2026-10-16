import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Bookmark,
  Building,
  Clock
} from 'lucide-react';
import { CAREERS_DATA } from '../data/careersData';

export function DashboardPage({
  userProfile,
  assessmentResults,
  activeRoadmap,
  savedCareers,
  onNavigate,
  onSelectCareer,
  onToggleRoadmapTask
}) {
  const topMatches = assessmentResults?.topRecommendations || CAREERS_DATA.slice(0, 3);
  const primaryInterest = assessmentResults?.primaryInterest || 'Technical';

  // Calculate Roadmap Progress
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
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Personalized Welcome Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 4px 20px rgba(23, 23, 23, 0.03)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#FE6904', letterSpacing: '0.05em' }}>
              Student Career Intelligence
            </span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#77736F' }} />
            <span style={{ fontSize: '0.75rem', color: '#77736F' }}>
              {userProfile?.educationLevel || 'Undergraduate'}
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.03em', margin: 0 }}>
            Welcome back, <span style={{ color: '#FE6904' }}>{userProfile?.name || 'Ananya'}</span> 👋
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#77736F', marginTop: '0.4rem', maxWidth: '620px', margin: '0.4rem 0 0' }}>
            Your cognitive assessment identified strong <strong style={{ color: '#171717' }}>{primaryInterest}</strong> alignment. You have {completedTasks} of {totalTasks} roadmap milestones completed.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onNavigate('assessment')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.65rem 1.15rem',
              borderRadius: '10px',
              background: '#FFE5CE',
              color: '#FE6904',
              border: '1px solid #FA9B2A',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={16} />
            <span>Retake Assessment</span>
          </button>
          <button
            onClick={() => onNavigate('roadmap')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.65rem 1.15rem',
              borderRadius: '10px',
              background: '#FE6904',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(254, 105, 4, 0.28)',
            }}
          >
            <span>Resume Roadmap</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Assessment Status</span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: '#E8F5E9',
              color: '#2E7D32',
            }}>
              Completed
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', marginTop: '0.5rem' }}>
            16 / 16
          </div>
          <span style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 600 }}>
            Primary: {primaryInterest} Focus
          </span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Roadmap Progress</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FE6904' }}>{roadmapPct}%</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', marginTop: '0.5rem' }}>
            {completedTasks} of {totalTasks}
          </div>
          <div style={{ width: '100%', height: '6px', background: '#EAE7E2', borderRadius: '9999px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ width: `${roadmapPct}%`, height: '100%', background: '#FE6904' }} />
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Saved Careers</span>
            <Bookmark size={16} color="#77736F" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717', marginTop: '0.5rem' }}>
            {savedCareers.length} Targets
          </div>
          <span style={{ fontSize: '0.75rem', color: '#77736F' }}>
            Actively tracking & comparing
          </span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Sponsoring Centre</span>
            <Building size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', marginTop: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Apex Academy
          </div>
          <span style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 600 }}>
            ✓ Verified Enrollment Sponsoring
          </span>
        </div>
      </div>

      {/* Two-Column Layout: Recommendations & Active Roadmap */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Top 3 Career Matches */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                Top Career Recommendations
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#77736F', margin: 0 }}>
                Based on your cognitive preferences and market demand.
              </p>
            </div>
            <button
              onClick={() => onNavigate('results')}
              style={{
                background: 'none',
                border: 'none',
                color: '#FE6904',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              View All 5 Matches →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topMatches.slice(0, 3).map((career, idx) => (
              <div
                key={career.id || idx}
                onClick={() => onSelectCareer(career.id)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: idx === 0 ? '2px solid #FE6904' : '1px solid #EAE7E2',
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: idx === 0 ? '0 4px 16px rgba(254, 105, 4, 0.08)' : '0 1px 3px rgba(23, 23, 23, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: idx === 0 ? '#FFE5CE' : '#F8F8F7',
                    color: idx === 0 ? '#FE6904' : '#77736F',
                  }}>
                    {career.matchScore ? `${career.matchScore}% Match` : '92% Match'}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#77736F' }}>
                    {career.avgSalary}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#171717', margin: '0 0 0.35rem' }}>
                  {career.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#77736F', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
                  {career.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(career.requiredSkills || []).slice(0, 3).map((skill, sIdx) => (
                      <span key={sIdx} style={{
                        fontSize: '0.7rem',
                        background: '#F8F8F7',
                        color: '#171717',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid #EAE7E2',
                      }}>
                        {skill.name || skill}
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FE6904' }}>
                    Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Learning Roadmap Card */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                Active Learning Roadmap
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#77736F', margin: 0 }}>
                Target: {activeRoadmap?.careerTitle || 'Full Stack Software Engineer'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('roadmap')}
              style={{
                background: 'none',
                border: 'none',
                color: '#FE6904',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Open Full Roadmap →
            </button>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
                Next Actionable Milestones
              </span>
              <span style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 700 }}>
                {completedTasks} / {totalTasks} Completed
              </span>
            </div>

            {/* Task Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(activeRoadmap?.phases || []).flatMap((p) => p.tasks).slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleRoadmapTask(task.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    background: task.completed ? '#F8F8F7' : '#FFFFFF',
                    border: task.completed ? '1px solid #EAE7E2' : '1px solid #EAE7E2',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: task.completed ? 'none' : '2px solid #D6D2CC',
                    backgroundColor: task.completed ? '#FE6904' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0,
                  }}>
                    {task.completed && <CheckCircle2 size={14} color="#FFFFFF" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: task.completed ? '#77736F' : '#171717',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {task.title}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#77736F', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {task.duration}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('skill-gap')}
              style={{
                width: '100%',
                marginTop: '1.25rem',
                padding: '0.75rem',
                borderRadius: '10px',
                backgroundColor: '#FFE5CE',
                color: '#FE6904',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Sliders size={16} />
              <span>Audit Skill Gaps for this Target</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
