import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Flame,
  Users
} from 'lucide-react';
import { CAREERS_DATA } from '../data/careersData';
import { calibrationService } from '../services/calibrationService';
import { DailyWorkloadPlannerView } from '../components/DailyWorkloadPlannerView';
import { streakService } from '../services/streakService';
import { studyRoomService } from '../services/studyRoomService';

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

  const [streakSummary, setStreakSummary] = useState(() => (typeof streakService.getStreakSummary === 'function' ? streakService.getStreakSummary() : { currentStreak: 0, longestStreak: 0 }));
  const [joinedRooms, setJoinedRooms] = useState(() => {
    if (typeof studyRoomService.getJoinedRooms === 'function') return studyRoomService.getJoinedRooms();
    if (typeof studyRoomService.getMyRooms === 'function') return studyRoomService.getMyRooms();
    return [];
  });

  useEffect(() => {
    const handleUpdate = () => {
      if (typeof streakService.getStreakSummary === 'function') {
        setStreakSummary(streakService.getStreakSummary());
      }
      if (typeof studyRoomService.getJoinedRooms === 'function') {
        setJoinedRooms(studyRoomService.getJoinedRooms());
      } else if (typeof studyRoomService.getMyRooms === 'function') {
        setJoinedRooms(studyRoomService.getMyRooms());
      }
    };
    window.addEventListener('zhero_streak_updated', handleUpdate);
    window.addEventListener('zhero_study_rooms_updated', handleUpdate);
    return () => {
      window.removeEventListener('zhero_streak_updated', handleUpdate);
      window.removeEventListener('zhero_study_rooms_updated', handleUpdate);
    };
  }, []);

  const calibrationDay = calibrationService.getCalibrationState().currentDay;

  return (
    <div className="page">
      {/* Welcome header: no card, no emoji, no eyebrow, no explanatory sentence */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome back, {userProfile?.name || 'Ananya'}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('interview')}
            className="btn-secondary"
          >
            Interview
          </button>
          <button
            onClick={() => onNavigate('assessment')}
            className="btn-secondary"
          >
            Retake assessment
          </button>
          <button
            onClick={() => onNavigate('roadmap')}
            className="btn-primary"
          >
            Resume roadmap
          </button>
        </div>
      </div>

      {/* Three plain figures in one row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #EAE7E2',
      }}>
        <div className="stat">
          <span className="stat-label">Roadmap progress</span>
          <span className="stat-value">{roadmapPct}%</span>
          <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
            {completedTasks} of {totalTasks} tasks
          </span>
        </div>

        <div className="stat">
          <span className="stat-label">Saved careers</span>
          <span className="stat-value">{savedCareers.length}</span>
          <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
            Tracking
          </span>
        </div>

        <div className="stat">
          <span className="stat-label">Assessment</span>
          <span className="stat-value">Completed</span>
          <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
            16 questions
          </span>
        </div>
      </div>

      {/* Daily Workload Planner */}
      <div style={{ marginBottom: '2rem' }}>
        <DailyWorkloadPlannerView
          onNavigateToRoadmap={() => onNavigate('roadmap')}
          onNavigateToInterview={() => onNavigate('interview')}
        />
      </div>

      {/* Streaks & Study Rooms: flat, restrained */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* Streak card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={16} color="#FE6904" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#171717' }}>Learning streak</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#77736F' }}>
              Best: {streakSummary.longestStreak}d
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FE6904' }}>
              {streakSummary.currentStreak}
            </span>
            <span style={{ fontSize: '0.9rem', color: '#171717', fontWeight: 500 }}>
              {streakSummary.currentStreak === 1 ? 'day' : 'days'}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#77736F', marginLeft: 'auto' }}>
              {streakSummary.meaningfulDaysThisWeek} of 7 days active
            </span>
          </div>

          {/* 7-day dot indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            backgroundColor: '#F8F8F7',
            marginBottom: '0.75rem',
          }}>
            {streakSummary.weekDays.map((d) => (
              <div key={d.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '9999px',
                  backgroundColor: d.hasActivity ? '#FE6904' : d.isToday ? '#FFE5CE' : '#FFFFFF',
                  border: d.isToday ? '1px solid #FE6904' : '1px solid #EAE7E2',
                }} />
                <span style={{ fontSize: '0.65rem', color: d.isToday ? '#FE6904' : '#77736F' }}>
                  {d.dayName}
                </span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.8rem', color: '#77736F', margin: '0 0 1rem 0' }}>
            {streakSummary.supportiveMessage || streakSummary.wellbeingNote}
          </p>

          <button
            onClick={() => onNavigate('study-rooms')}
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.85rem' }}
          >
            Study rooms and sessions
          </button>
        </div>

        {/* Study rooms card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#FE6904" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#171717' }}>Study rooms</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#77736F' }}>
              {joinedRooms.length} joined
            </span>
          </div>

          {joinedRooms.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {joinedRooms.slice(0, 2).map((room) => (
                <div
                  key={room.id}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#F8F8F7',
                    border: '1px solid #EAE7E2',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717' }}>{room.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#77736F' }}>{room.topic}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#77736F', margin: '1rem 0' }}>
              No study rooms joined yet. Join a room to study with peers.
            </p>
          )}

          <button
            onClick={() => onNavigate('study-rooms')}
            className="btn-primary"
            style={{ width: '100%', fontSize: '0.85rem' }}
          >
            {joinedRooms.length > 0 ? 'Enter workspace' : 'Browse study rooms'}
          </button>
        </div>
      </div>

      {/* Two-Column Section: Recommendations & Roadmap */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2rem',
      }}>
        {/* Career recommendations */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Career recommendations</h2>
            <button
              onClick={() => onNavigate('results')}
              className="link-btn"
            >
              View all
            </button>
          </div>

          <div style={{ border: '1px solid #EAE7E2', borderRadius: '12px', overflow: 'hidden' }}>
            {topMatches.slice(0, 3).map((career, idx) => (
              <div
                key={career.id || idx}
                onClick={() => onSelectCareer(career.id)}
                className="list-row"
                style={{ cursor: 'pointer' }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#171717' }}>
                      {career.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 600 }}>
                      {career.matchScore ? `${career.matchScore}%` : '92%'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                    {(career.requiredSkills || []).slice(0, 3).map((skill, sIdx) => (
                      <span key={sIdx} style={{ fontSize: '0.75rem', color: '#77736F' }}>
                        {skill.name || skill}{sIdx < Math.min(2, (career.requiredSkills?.length || 1) - 1) ? ' •' : ''}
                      </span>
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#77736F', whiteSpace: 'nowrap' }}>
                  {career.avgSalary}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>Roadmap</h2>
              <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
                Day {calibrationDay} of 7 •{' '}
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="link-btn"
                  style={{ fontSize: '0.8rem' }}
                >
                  View plan
                </button>
              </span>
            </div>
            <button
              onClick={() => onNavigate('roadmap')}
              className="link-btn"
            >
              Open roadmap
            </button>
          </div>

          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(activeRoadmap?.phases || []).flatMap((p) => p.tasks).slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleRoadmapTask(task.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    background: task.completed ? '#F8F8F7' : '#FFFFFF',
                    border: '1px solid #EAE7E2',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: task.completed ? 'none' : '1px solid #EAE7E2',
                    backgroundColor: task.completed ? '#FE6904' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0,
                  }}>
                    {task.completed && <CheckCircle2 size={12} color="#FFFFFF" />}
                  </div>

                  <span style={{
                    fontSize: '0.85rem',
                    color: task.completed ? '#77736F' : '#171717',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {task.title}
                  </span>

                  <span style={{ fontSize: '0.75rem', color: '#77736F', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {task.duration}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('skill-gap')}
              className="btn-secondary"
              style={{
                width: '100%',
                marginTop: '1rem',
                fontSize: '0.85rem',
              }}
            >
              Audit skill gaps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
