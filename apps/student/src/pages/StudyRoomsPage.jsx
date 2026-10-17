import React, { useState, useEffect } from 'react';
import {
  Users,
  Target,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Flame,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  Lock,
  Globe,
  HelpCircle,
  Award,
  Send,
  Calendar,
  X
} from 'lucide-react';
import { studyRoomService } from '../services/studyRoomService';
import { streakService } from '../services/streakService';

export function StudyRoomsPage({ onNavigate, userProfile, activeRoadmap }) {
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'workspace' | 'my-rooms'
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [streakSummary, setStreakSummary] = useState(() => streakService.getStreakSummary());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Create Room Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomTopic, setNewRoomTopic] = useState('');
  const [newRoomGoal, setNewRoomGoal] = useState('');
  const [newRoomDifficulty, setNewRoomDifficulty] = useState('intermediate');
  const [newRoomCapacity, setNewRoomCapacity] = useState(6);
  const [newRoomDuration, setNewRoomDuration] = useState(30);
  const [newRoomGuidelines, setNewRoomGuidelines] = useState('');
  const [createError, setCreateError] = useState('');

  // Active Workspace State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isGroupTask, setIsGroupTask] = useState(true);
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [resourceError, setResourceError] = useState('');

  // Peer Interaction State
  const [interactionText, setInteractionText] = useState('');
  const [interactionType, setInteractionType] = useState('learning_update');
  const [interactions, setInteractions] = useState([]);

  // Reflection State
  const [learnedText, setLearnedText] = useState('');
  const [difficultyText, setDifficultyText] = useState('');
  const [nextStepsText, setNextStepsText] = useState('');
  const [reflectionVisibility, setReflectionVisibility] = useState('private');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // Focus Timer State
  const [timerDuration, setTimerDuration] = useState(25 * 60); // in seconds
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerCompletedNotice, setTimerCompletedNotice] = useState(false);

  const reloadData = () => {
    const list = studyRoomService.getRooms({
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      search: searchQuery,
    });
    setRooms(list);
    setStreakSummary(streakService.getStreakSummary());
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener('zhero_study_room_updated', handleUpdate);
    window.addEventListener('zhero_streak_updated', handleUpdate);
    return () => {
      window.removeEventListener('zhero_study_room_updated', handleUpdate);
      window.removeEventListener('zhero_streak_updated', handleUpdate);
    };
  }, [selectedTopic, selectedDifficulty, searchQuery]);

  // Focus Timer Countdown Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timerSecondsLeft === 0) {
      setIsTimerRunning(false);
      setTimerCompletedNotice(true);
      // Log completed session to Streak Service
      studyRoomService.logFocusSession({
        roomId: selectedRoomId || 'general-focus',
        durationMinutes: Math.round(timerDuration / 60),
        goal: 'Study room focus session',
        completed: true,
      });
      reloadData();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft, timerDuration, selectedRoomId]);

  const handleStartTimer = () => setIsTimerRunning(true);
  const handlePauseTimer = () => setIsTimerRunning(false);
  const handleResetTimer = (minutes) => {
    setIsTimerRunning(false);
    const secs = minutes * 60;
    setTimerDuration(secs);
    setTimerSecondsLeft(secs);
    setTimerCompletedNotice(false);
  };

  const handleSelectRoom = (roomId) => {
    setSelectedRoomId(roomId);
    setActiveTab('workspace');
    setReflectionSaved(false);
  };

  const handleJoinAndEnter = (roomId) => {
    try {
      studyRoomService.joinRoom(roomId, {
        memberId: userProfile?.id || 'current-student',
        memberName: userProfile?.name || 'Student',
      });
      handleSelectRoom(roomId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLeaveCurrentRoom = (roomId) => {
    if (window.confirm('Are you sure you want to leave this study room?')) {
      studyRoomService.leaveRoom(roomId, userProfile?.id || 'current-student');
      setActiveTab('discover');
      setSelectedRoomId(null);
      reloadData();
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    setCreateError('');
    try {
      const room = studyRoomService.createRoom({
        name: newRoomName,
        topic: newRoomTopic,
        goal: newRoomGoal,
        difficulty: newRoomDifficulty,
        durationMinutes: newRoomDuration,
        maxParticipants: newRoomCapacity,
        guidelines: newRoomGuidelines,
        creatorId: userProfile?.id || 'current-student',
        creatorName: userProfile?.name || 'Student',
      });
      setCreateModalOpen(false);
      setNewRoomName('');
      setNewRoomTopic('');
      setNewRoomGoal('');
      handleSelectRoom(room.id);
      reloadData();
    } catch (err) {
      setCreateError(err.message);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedRoomId) return;
    studyRoomService.addTask(selectedRoomId, {
      title: newTaskTitle,
      isGroupTask,
      assignedMemberId: isGroupTask ? null : userProfile?.id || 'current-student',
    });
    setNewTaskTitle('');
    reloadData();
  };

  const handleToggleTask = (taskId) => {
    if (!selectedRoomId) return;
    studyRoomService.toggleTask(selectedRoomId, taskId, userProfile?.id || 'current-student');
    reloadData();
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    setResourceError('');
    try {
      studyRoomService.addResourceLink(selectedRoomId, {
        title: newResourceTitle,
        url: newResourceUrl,
        addedBy: userProfile?.name || 'Student',
      });
      setNewResourceTitle('');
      setNewResourceUrl('');
      reloadData();
    } catch (err) {
      setResourceError(err.message);
    }
  };

  const handlePostInteraction = (e) => {
    e.preventDefault();
    if (!interactionText.trim()) return;
    const newEntry = {
      id: `int-${Date.now()}`,
      author: userProfile?.name || 'Student',
      text: interactionText.trim(),
      type: interactionType,
      time: 'Just now',
    };
    setInteractions([newEntry, ...interactions]);
    setInteractionText('');
  };

  const handleSaveReflection = (e) => {
    e.preventDefault();
    if (!selectedRoomId) return;
    try {
      studyRoomService.saveReflection(selectedRoomId, userProfile?.id || 'current-student', {
        learnedText,
        difficultyText,
        nextStepsText,
        visibility: reflectionVisibility,
      });
      setReflectionSaved(true);
      setTimeout(() => setReflectionSaved(false), 2500);
    } catch (err) {
      alert(err.message);
    }
  };

  const formatTimerDigits = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentRoom = selectedRoomId ? studyRoomService.getRoomById(selectedRoomId) : null;
  const currentMembers = selectedRoomId ? studyRoomService.getRoomMembers(selectedRoomId) : [];
  const joinedRooms = studyRoomService.getJoinedRooms(userProfile?.id || 'current-student');

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', margin: 0 }}>
          Study Rooms
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#77736F', marginTop: '0.25rem' }}>
          Collaborate and track learning progress with peers.
        </p>
      </div>

      {/* 4 Quantitative Summary Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {/* Streak Metric */}
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Learning streak</span>
            <Flame size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', marginTop: '0.25rem' }}>
            {streakSummary.currentStreak} days
          </div>
          <span style={{ fontSize: '0.75rem', color: streakSummary.currentStreak > 0 ? '#FE6904' : '#77736F', fontWeight: 600 }}>
            {streakSummary.hasStudiedToday ? 'Active today' : 'Best: ' + streakSummary.longestStreak + ' days'}
          </span>
        </div>

        {/* Meaningful Days This Week */}
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Active this week</span>
            <Calendar size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', marginTop: '0.25rem' }}>
            {streakSummary.meaningfulDaysThisWeek} / 7
          </div>
          <span style={{ fontSize: '0.75rem', color: '#77736F' }}>
            Verified sessions
          </span>
        </div>

        {/* Joined Rooms */}
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Joined rooms</span>
            <Users size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', marginTop: '0.25rem' }}>
            {joinedRooms.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#77736F' }}>Active study spaces</span>
        </div>

        {/* Total Meaningful Milestones */}
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Total learning days</span>
            <ShieldCheck size={16} color="#FE6904" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', marginTop: '0.25rem' }}>
            {streakSummary.totalMeaningfulDays}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#77736F', fontWeight: 600 }}>Demonstrated progress</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EAE7E2', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('discover')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'discover' ? '3px solid #FE6904' : '3px solid transparent',
              color: activeTab === 'discover' ? '#FE6904' : '#77736F',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            Discover Rooms ({rooms.length})
          </button>

          {currentRoom && (
            <button
              onClick={() => setActiveTab('workspace')}
              style={{
                padding: '0.75rem 1.25rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'workspace' ? '3px solid #FE6904' : '3px solid transparent',
                color: activeTab === 'workspace' ? '#FE6904' : '#77736F',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              Active Workspace ({currentRoom.name})
            </button>
          )}

          <button
            onClick={() => setActiveTab('my-rooms')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'my-rooms' ? '3px solid #FE6904' : '3px solid transparent',
              color: activeTab === 'my-rooms' ? '#FE6904' : '#77736F',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            My Rooms ({joinedRooms.length})
          </button>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="btn-primary"
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} />
          <span>Create Room</span>
        </button>
      </div>

      {/* TAB 1: DISCOVER STUDY ROOMS */}
      {activeTab === 'discover' && (
        <div>
          {/* Search and Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem', background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #EAE7E2' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={16} color="#77736F" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search rooms by topic, skill, or goal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.25rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem' }}
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem', background: '#FFFFFF', color: '#171717' }}
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Rooms Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {rooms.map((room) => {
              const isMember = studyRoomService.isMember(room.id, userProfile?.id || 'current-student');
              const members = studyRoomService.getRoomMembers(room.id);
              return (
                <div key={room.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: isMember ? '1.5px solid #FE6904' : '1px solid #EAE7E2' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FE6904', textTransform: 'uppercase' }}>
                        {room.topic}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '100px',
                        background: room.difficulty === 'beginner' ? '#FFE5CE' : room.difficulty === 'intermediate' ? '#F8F8F7' : '#F8F8F7',
                        color: room.difficulty === 'beginner' ? '#FE6904' : room.difficulty === 'intermediate' ? '#77736F' : '#171717',
                        textTransform: 'capitalize',
                      }}>
                        {room.difficulty}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', margin: '0 0 0.5rem' }}>
                      {room.name}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: '#77736F', margin: '0 0 1rem', lineHeight: 1.5 }}>
                      {room.description || room.goal}
                    </p>

                    <div style={{ background: '#F8F8F7', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #EAE7E2' }}>
                      <div style={{ fontSize: '0.75rem', color: '#77736F', marginBottom: '4px' }}>
                        <strong>Measurable Objective:</strong>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#171717', fontStyle: 'italic' }}>
                        "{room.goal}"
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#77736F', marginBottom: '0.75rem' }}>
                      <span>Host: <strong style={{ color: '#171717' }}>{room.creatorName}</strong></span>
                      <span>Capacity: <strong style={{ color: '#171717' }}>{members.length} / {room.maxParticipants}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {isMember ? (
                      <button
                        onClick={() => handleSelectRoom(room.id)}
                        className="btn-primary"
                        style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem' }}
                      >
                        Enter Workspace
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinAndEnter(room.id)}
                        className="btn-outline"
                        style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem' }}
                      >
                        Join Room
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE STUDY WORKSPACE */}
      {activeTab === 'workspace' && currentRoom && (
        <div>
          {/* Room Header Banner */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', background: '#FFFFFF', border: '1px solid #EAE7E2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FE6904' }}>{currentRoom.topic}</span>
                  <span style={{ fontSize: '0.7rem', color: '#77736F' }}>· Hosted by {currentRoom.creatorName}</span>
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                  {currentRoom.name}
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => handleLeaveCurrentRoom(currentRoom.id)}
                  className="btn-outline"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', color: '#171717', borderColor: '#EAE7E2' }}
                >
                  Leave Room
                </button>
              </div>
            </div>

            {/* Shared Goal Box */}
            <div style={{ background: '#FFE5CE', border: '1px solid #FA9B2A', borderRadius: '10px', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Target size={16} color="#77736F" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#77736F', textTransform: 'uppercase' }}>
                  Shared Session Goal
                </span>
              </div>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#171717', margin: 0 }}>
                {currentRoom.goal}
              </p>
              {currentRoom.targetDate && (
                <div style={{ fontSize: '0.75rem', color: '#77736F', marginTop: '4px' }}>
                  Target Completion Date: {new Date(currentRoom.targetDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Two-Column Grid: Left (Timer & Tasks) | Right (Resources & Peer Chat) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Left Column: Focus Timer & Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Focus Timer Widget */}
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: '#FFFFFF', border: '1px solid #EAE7E2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>Focus Study Timer</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => handleResetTimer(15)} style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid #EAE7E2', background: timerDuration === 15 * 60 ? '#FFE5CE' : '#F8F8F7', cursor: 'pointer' }}>15m</button>
                    <button onClick={() => handleResetTimer(25)} style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid #EAE7E2', background: timerDuration === 25 * 60 ? '#FFE5CE' : '#F8F8F7', cursor: 'pointer' }}>25m</button>
                    <button onClick={() => handleResetTimer(45)} style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid #EAE7E2', background: timerDuration === 45 * 60 ? '#FFE5CE' : '#F8F8F7', cursor: 'pointer' }}>45m</button>
                  </div>
                </div>

                <div style={{ fontSize: '3rem', fontWeight: 800, color: isTimerRunning ? '#FE6904' : '#171717', letterSpacing: '-0.02em', margin: '0.5rem 0' }}>
                  {formatTimerDigits(timerSecondsLeft)}
                </div>

                {timerCompletedNotice && (
                  <div style={{ background: '#FFE5CE', color: '#FE6904', padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Focus session complete. Logged to learning streak.
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                  {isTimerRunning ? (
                    <button
                      onClick={handlePauseTimer}
                      className="btn-outline"
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Pause size={16} />
                      <span>Pause Session</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStartTimer}
                      className="btn-primary"
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Play size={16} />
                      <span>{timerSecondsLeft < timerDuration ? 'Resume Focus' : 'Start Focus Session'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleResetTimer(Math.round(timerDuration / 60))}
                    className="btn-outline"
                    style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                    title="Reset Timer"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#77736F', marginTop: '0.75rem' }}>
                  Focus timer builds discipline. Task completion requires deliverable verification.
                </div>
              </div>

              {/* Room Task Checklist */}
              <div className="card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid #EAE7E2' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', marginBottom: '0.75rem' }}>
                  Room Tasks & Checklists
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {(currentRoom.tasks || []).length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: '#77736F', fontStyle: 'italic', padding: '0.5rem' }}>
                      No tasks created yet. Add a shared milestone below.
                    </div>
                  ) : (
                    (currentRoom.tasks || []).map((t) => (
                      <label
                        key={t.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          background: t.completed ? '#F8F8F7' : '#F8F8F7',
                          border: '1px solid #EAE7E2',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => handleToggleTask(t.id)}
                        />
                        <span style={{ fontSize: '0.85rem', color: t.completed ? '#77736F' : '#171717', textDecoration: t.completed ? 'line-through' : 'none' }}>
                          {t.title}
                        </span>
                        {t.isGroupTask && (
                          <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: '#FFE5CE', color: '#77736F', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            Group
                          </span>
                        )}
                      </label>
                    ))
                  )}
                </div>

                {/* Add Task Form */}
                <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Add a new study task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                    Add
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Peer Interactions & Resource Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Resource Links Box */}
              <div className="card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid #EAE7E2' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', marginBottom: '0.75rem' }}>
                  Shared Documentation & Resources
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {(currentRoom.resourceLinks || []).length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: '#77736F', fontStyle: 'italic' }}>
                      No links attached yet. Share documentation or practice links below.
                    </div>
                  ) : (
                    (currentRoom.resourceLinks || []).map((link) => (
                      <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '6px', background: '#F8F8F7', fontSize: '0.8rem' }}>
                        <a href={link.url} target="_blank" rel="noreferrer" style={{ color: '#FE6904', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                          <BookOpen size={14} />
                          <span>{link.title}</span>
                          <ExternalLink size={12} />
                        </a>
                        <span style={{ fontSize: '0.7rem', color: '#77736F' }}>by {link.addedBy}</span>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddResource}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <input
                      type="text"
                      placeholder="Title (e.g. React Docs)"
                      value={newResourceTitle}
                      onChange={(e) => setNewResourceTitle(e.target.value)}
                      style={{ flex: 1, padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #EAE7E2', fontSize: '0.8rem' }}
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newResourceUrl}
                      onChange={(e) => setNewResourceUrl(e.target.value)}
                      style={{ flex: 1.5, padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #EAE7E2', fontSize: '0.8rem' }}
                    />
                    <button type="submit" className="btn-outline" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}>
                      Add
                    </button>
                  </div>
                  {resourceError && (
                    <div style={{ fontSize: '0.75rem', color: '#171717' }}>{resourceError}</div>
                  )}
                </form>
              </div>

              {/* Peer Interaction Board */}
              <div className="card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid #EAE7E2', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
                  Peer Learning Updates
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#77736F', margin: '0 0 0.75rem' }}>
                  Post questions, share solution breakthroughs, or celebrate completed tasks with room peers.
                </p>

                <div style={{ flex: 1, maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {interactions.length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: '#77736F', fontStyle: 'italic', padding: '1rem 0' }}>
                      No updates yet. Post your first study check-in below!
                    </div>
                  ) : (
                    interactions.map((int) => (
                      <div key={int.id} style={{ background: '#F8F8F7', borderRadius: '8px', padding: '0.6rem 0.75rem', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <strong style={{ color: '#171717' }}>{int.author}</strong>
                          <span style={{ fontSize: '0.7rem', color: '#77736F' }}>{int.time}</span>
                        </div>
                        <div style={{ color: '#171717' }}>{int.text}</div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handlePostInteraction} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Share what you're working on..."
                    value={interactionText}
                    onChange={(e) => setInteractionText(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* End-of-Session Reflection Card */}
          <div className="card" style={{ padding: '1.75rem', background: '#FFFFFF', border: '1px solid #EAE7E2' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', marginBottom: '0.4rem' }}>
              Session Reflection & Learning Consolidation
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#77736F', margin: '0 0 1rem' }}>
              Take a moment to solidify what you accomplished. Private reflections are never visible to other members.
            </p>

            <form onSubmit={handleSaveReflection}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                    What key concept did you learn or practice?
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Refactored the graph traversal using an adjacency list..."
                    value={learnedText}
                    onChange={(e) => setLearnedText(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #EAE7E2', fontSize: '0.8rem', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                    What did you find challenging?
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Tracking visited nodes in cyclic graphs..."
                    value={difficultyText}
                    onChange={(e) => setDifficultyText(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #EAE7E2', fontSize: '0.8rem', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                    What is your next step?
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Solve Dijkstra's algorithm checkpoint tomorrow..."
                    value={nextStepsText}
                    onChange={(e) => setNextStepsText(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #EAE7E2', fontSize: '0.8rem', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={14} color="#77736F" />
                  <select
                    value={reflectionVisibility}
                    onChange={(e) => setReflectionVisibility(e.target.value)}
                    style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #EAE7E2', fontSize: '0.75rem', background: '#FFFFFF' }}
                  >
                    <option value="private">Private (Only You)</option>
                    <option value="shared_with_room">Share with Study Room Peers</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {reflectionSaved && (
                    <span style={{ fontSize: '0.8rem', color: '#FE6904', fontWeight: 600 }}>
                      Reflection saved
                    </span>
                  )}
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                    Save Reflection
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: MY STUDY ROOMS */}
      {activeTab === 'my-rooms' && (
        <div>
          {joinedRooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#FFFFFF', borderRadius: '12px', border: '1px dashed #EAE7E2' }}>
              <Users size={36} color="#FA9B2A" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#171717', margin: '0 0 0.4rem' }}>
                No Study Rooms Joined Yet
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#77736F', maxWidth: '440px', margin: '0 auto 1.25rem' }}>
                Join an active study room or create your own focus session to learn collaboratively with peers.
              </p>
              <button onClick={() => setActiveTab('discover')} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Explore Available Rooms
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {joinedRooms.map((room) => (
                <div key={room.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #EAE7E2' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FE6904' }}>{room.topic}</span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '100px', background: '#FFE5CE', color: '#FE6904', fontWeight: 700 }}>
                        Member
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', margin: '0 0 0.5rem' }}>
                      {room.name}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: '#77736F', margin: '0 0 1rem' }}>
                      "{room.goal}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleSelectRoom(room.id)}
                      className="btn-primary"
                      style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}
                    >
                      Enter Workspace
                    </button>
                    <button
                      onClick={() => handleLeaveCurrentRoom(room.id)}
                      className="btn-outline"
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem', color: '#171717' }}
                    >
                      Leave
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE ROOM MODAL */}
      {createModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(23, 23, 23, 0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '580px', width: '100%', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                Create a Collaborative Study Room
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                style={{ background: '#F8F8F7', border: '1px solid #EAE7E2', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#171717' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRoom}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                  Room Name <span style={{ color: '#FE6904' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Graph Algorithms Sprint"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                  Subject / Topic <span style={{ color: '#FE6904' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Algorithms, React, Physics PCMB"
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                  Measurable Study Goal <span style={{ color: '#FE6904' }}>*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Complete two graph problems and explain one solution to the group."
                  value={newRoomGoal}
                  onChange={(e) => setNewRoomGoal(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem', fontFamily: 'inherit' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                    Difficulty
                  </label>
                  <select
                    value={newRoomDifficulty}
                    onChange={(e) => setNewRoomDifficulty(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem', background: '#FFFFFF' }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                    Max Participants
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={25}
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #EAE7E2', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {createError && (
                <div style={{ padding: '0.65rem 0.85rem', background: '#F8F8F7', border: '1px solid #EAE7E2', borderRadius: '8px', color: '#171717', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {createError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="btn-outline"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Create & Launch Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
