import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Plus,
  Map,
  UserCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Mic,
  ExternalLink,
  Zap,
  ArrowRight
} from 'lucide-react';
import { CAREERS_DATA } from '../data/careersData';
import { Modal } from '../components/Modal';
import { storageService } from '../services/storageService';
import { checkpointService } from '../services/checkpointService';
import { spacedRepetitionService } from '../services/spacedRepetitionService';
import { VerbalCheckpointModal } from '../components/VerbalCheckpointModal';
import { DailyRevisionQueue } from '../components/DailyRevisionQueue';
import { LearningCalibrationView } from '../components/LearningCalibrationView';
import { calibrationService } from '../services/calibrationService';
import { DailyWorkloadPlannerView } from '../components/DailyWorkloadPlannerView';
import { dailyPlannerService } from '../services/dailyPlannerService';

export function RoadmapPage({
  activeRoadmap,
  onAddCustomTask,
  onSwitchRoadmapCareer,
  onAuditSkills: _onAuditSkills
}) {
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'revision'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);
  const [customTaskTitle, setCustomTaskTitle] = useState('');
  const [customTaskDuration, setCustomTaskDuration] = useState('1 week');

  // Expanded task drawer state
  const [expandedTaskId, setExpandedTaskId] = useState('fs-1');

  // Verbal AI Checkpoint Modal state
  const [activeCheckpointTask, setActiveCheckpointTask] = useState(null);
  const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);

  const finalEvidence = storageService.getStage5Final();
  const phases = activeRoadmap?.phases || [];

  let totalTasks = 0;
  let completedTasks = 0;
  phases.forEach((p) => {
    p.tasks.forEach((t) => {
      totalTasks += 1;
      if (t.completed) completedTasks += 1;
    });
  });

  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const dueRevisionCount = spacedRepetitionService.getDueConcepts().length;

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!customTaskTitle.trim()) return;
    onAddCustomTask(selectedPhaseIndex, customTaskTitle.trim(), customTaskDuration);
    setCustomTaskTitle('');
    setIsAddModalOpen(false);
  };

  const handleOpenCheckpoint = (task, e) => {
    if (e) e.stopPropagation();
    setActiveCheckpointTask(task);
    setIsCheckpointModalOpen(true);
  };

  const handleMilestoneVerified = (taskId, evaluationResult) => {
    const updated = storageService.completeMilestoneWithCheckpoint(taskId, evaluationResult);
    if (updated) {
      window.dispatchEvent(new Event('storage'));
    }
    setIsCheckpointModalOpen(false);
    setActiveCheckpointTask(null);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1080px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px',
              background: '#FFE5CE',
              color: '#FE6904',
            }}>
              Personalized Learning Plan
            </span>
          </div>
          <h1 style={{ fontSize: '2.15rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.03em', margin: 0 }}>
            {activeRoadmap?.careerTitle || 'Full Stack Software Engineer'} Roadmap
          </h1>
          <p style={{ fontSize: '0.98rem', color: '#77736F', marginTop: '0.4rem', maxWidth: '640px', lineHeight: '1.5' }}>
            Learn through curated resources, verify understanding via Verbal AI Checkpoints, and cement long-term memory with spaced repetition revision.
          </p>
        </div>

        {/* Career Switcher Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#77736F' }}>Switch Roadmap:</span>
          <select
            value={activeRoadmap?.careerId || 'full-stack-engineer'}
            onChange={(e) => onSwitchRoadmapCareer(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              border: '1px solid #EAE7E2',
              fontSize: '0.875rem',
              fontWeight: 700,
              backgroundColor: '#FFFFFF',
              color: '#171717',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(23, 23, 23, 0.02)',
            }}
          >
            {CAREERS_DATA.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Tab Switcher: Roadmap vs Daily Revision Queue */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #EAE7E2',
        marginBottom: '2rem',
        gap: '2rem',
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('roadmap')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 4px',
            border: 'none',
            borderBottom: activeTab === 'roadmap' ? '3px solid #FE6904' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'roadmap' ? '#FE6904' : '#77736F',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '-2px',
            transition: 'all 0.15s ease',
          }}
        >
          <Map size={18} />
          <span>Curated Learning Roadmap</span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: activeTab === 'roadmap' ? '#FFE5CE' : '#F4F4F3',
            color: activeTab === 'roadmap' ? '#FE6904' : '#77736F',
          }}>
            {progressPct}% Done
          </span>
        </button>

        {/* 2. 7-Day Adaptive Calibration Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('calibration')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 4px',
            border: 'none',
            borderBottom: activeTab === 'calibration' ? '3px solid #FE6904' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'calibration' ? '#FE6904' : '#77736F',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '-2px',
            transition: 'all 0.15s ease',
          }}
        >
          <Sparkles size={18} />
          <span>7-Day Calibration</span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: activeTab === 'calibration' ? '#FFE5CE' : '#F4F4F3',
            color: activeTab === 'calibration' ? '#FE6904' : '#77736F',
          }}>
            Day {calibrationService.getCalibrationState().currentDay}/7
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('revision')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 4px',
            border: 'none',
            borderBottom: activeTab === 'revision' ? '3px solid #FE6904' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'revision' ? '#FE6904' : '#77736F',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '-2px',
            transition: 'all 0.15s ease',
          }}
        >
          <Zap size={18} />
          <span>Daily Revision Queue (Spaced Repetition)</span>
          {dueRevisionCount > 0 ? (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: '#FE6904',
              color: '#FFFFFF',
            }}>
              {dueRevisionCount} Due Today
            </span>
          ) : (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: '#ECFDF5',
              color: '#047857',
            }}>
              Up to date
            </span>
          )}
        </button>

        {/* 4. Today's Adaptive Plan Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('daily_plan')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 4px',
            border: 'none',
            borderBottom: activeTab === 'daily_plan' ? '3px solid #FE6904' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'daily_plan' ? '#FE6904' : '#77736F',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '-2px',
            transition: 'all 0.15s ease',
          }}
        >
          <Clock size={18} />
          <span>Today's Adaptive Plan</span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: activeTab === 'daily_plan' ? '#FFE5CE' : '#F4F4F3',
            color: activeTab === 'daily_plan' ? '#FE6904' : '#77736F',
          }}>
            {dailyPlannerService.getDailyPlanState().effectiveAvailableMinutes}m
          </span>
        </button>
      </div>

      {activeTab === 'daily_plan' ? (
        /* Adaptive Daily Workload & Academic Syllabus Protection Planner */
        <DailyWorkloadPlannerView
          onNavigateToRoadmap={() => setActiveTab('roadmap')}
        />
      ) : activeTab === 'calibration' ? (
        /* 7-Day Adaptive Learning Calibration View */
        <LearningCalibrationView
          onNavigateToRoadmap={() => setActiveTab('roadmap')}
          onNavigateToRevision={() => setActiveTab('revision')}
        />
      ) : activeTab === 'revision' ? (
        /* Daily Spaced Repetition Revision View */
        <DailyRevisionQueue
          onRoadmapUpdated={() => {
            // trigger state refresh
            window.dispatchEvent(new Event('storage'));
          }}
        />
      ) : (
        /* Curated Learning Roadmap View */
        <div>
          {/* Active 7-Day Calibration Reminder Banner */}
          {calibrationService.getCalibrationState().status === 'active' && (
            <div style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={20} color="#D97706" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#92400E' }}>
                    7-Day Learning Calibration Active (Day {calibrationService.getCalibrationState().currentDay} of 7)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#B45309' }}>
                    Your roadmap is provisional. Tasks and targeted practice adapt as ZHERO observes your actual learning rhythm.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('calibration')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>View Calibration Plan</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Evidence Banner */}
          {finalEvidence && (
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EAE7E2',
              borderRadius: '16px',
              padding: '1rem 1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 2px 8px rgba(23, 23, 23, 0.02)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#ECFDF5',
                  color: '#047857',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <UserCheck size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#171717' }}>
                    Personalized Guidance Roadmap
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#77736F' }}>
                    Tailored from career assessment • Validated by {finalEvidence.mentorName || 'Career Mentor'}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#77736F',
                backgroundColor: '#FBFBFA',
                padding: '4px 12px',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
              }}>
                🔒 Checkpoint Protection Active: Completion requires verbal verification
              </div>
            </div>
          )}

          {/* Progress Metric Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #EAE7E2',
            padding: '1.75rem 2rem',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 20px rgba(23, 23, 23, 0.03)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#FFE5CE',
                  color: '#FE6904',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}>
                  <Map size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717' }}>Verified Progress</div>
                  <div style={{ fontSize: '0.8rem', color: '#77736F' }}>
                    {completedTasks} of {totalTasks} milestones verified via AI Checkpoints
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FE6904' }}>
                  {progressPct}%
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.55rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    color: '#171717',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={15} />
                  <span>Add Custom Milestone</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '10px', background: '#F1F0ED', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{
                width: `${progressPct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #FE6904 0%, #FA9B2A 100%)',
                borderRadius: '9999px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>

          {/* Sequential Phases */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {phases.map((phase, pIdx) => {
              const phaseTasksCompleted = phase.tasks.filter((t) => t.completed).length;
              const isPhaseDone = phase.tasks.length > 0 && phaseTasksCompleted === phase.tasks.length;

              return (
                <div
                  key={pIdx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #EAE7E2',
                    padding: '1.75rem',
                    boxShadow: '0 2px 10px rgba(23, 23, 23, 0.02)',
                  }}
                >
                  {/* Phase Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.25rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid #EAE7E2',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: isPhaseDone ? '#E8F5E9' : '#FFE5CE',
                        color: isPhaseDone ? '#2E7D32' : '#FE6904',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                      }}>
                        {pIdx + 1}
                      </span>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                        {phase.phase}
                      </h3>
                    </div>

                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isPhaseDone ? '#2E7D32' : '#77736F' }}>
                      {phaseTasksCompleted} / {phase.tasks.length} Verified
                    </span>
                  </div>

                  {/* Task Items (Clicking expands resources & AI checkpoint) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {phase.tasks.map((task, tIdx) => {
                      const isExpanded = expandedTaskId === task.id;
                      const resources = checkpointService.getCuratedResourcesForMilestone(task, activeRoadmap?.careerId);
                      const keyConcepts = checkpointService.getKeyConcepts(task);

                      return (
                        <div
                          key={`${task.id || 'task'}-${tIdx}`}
                          style={{
                            borderRadius: '16px',
                            backgroundColor: task.isAdaptiveRemediation ? '#FFFDF5' : '#FFFFFF',
                            border: task.isAdaptiveRemediation
                              ? '1.5px solid #F59E0B'
                              : isExpanded
                              ? '1.5px solid #FE6904'
                              : '1px solid #EAE7E2',
                            boxShadow: isExpanded ? '0 4px 16px rgba(254, 105, 4, 0.06)' : 'none',
                            overflow: 'hidden',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {/* Task Summary Row */}
                          <div
                            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '1.2rem 1.25rem',
                              cursor: 'pointer',
                              backgroundColor: task.completed ? '#FBFBFA' : '#FFFFFF',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                              {/* Verified Checkmark vs In Progress Badge */}
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                backgroundColor: task.completed ? '#ECFDF5' : '#F4F4F3',
                                color: task.completed ? '#047857' : '#9CA3AF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: task.completed ? '1px solid #A7F3D0' : '1px solid #EAE7E2',
                                flexShrink: 0,
                              }}>
                                {task.completed ? <CheckCircle2 size={18} /> : <BookOpen size={16} />}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span style={{
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    color: task.completed ? '#4B5563' : '#171717',
                                  }}>
                                    {task.title}
                                  </span>

                                  {task.isAdaptiveRemediation && (
                                    <span style={{
                                      fontSize: '0.7rem',
                                      fontWeight: 800,
                                      padding: '2px 8px',
                                      borderRadius: '999px',
                                      backgroundColor: '#FEF3C7',
                                      color: '#92400E',
                                    }}>
                                      ⚡ Adaptive Revision Milestone
                                    </span>
                                  )}

                                  {task.completed && (
                                    <span style={{
                                      fontSize: '0.72rem',
                                      fontWeight: 800,
                                      padding: '2px 8px',
                                      borderRadius: '999px',
                                      backgroundColor: '#ECFDF5',
                                      color: '#047857',
                                    }}>
                                      ✓ Verified ({task.verifiedCheckpoint?.score || 92}%)
                                    </span>
                                  )}
                                </div>

                                <div style={{ fontSize: '0.75rem', color: '#77736F', marginTop: '2px' }}>
                                  {resources.length} learning resources • {keyConcepts.length} core concepts
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#77736F' }}>
                                <Clock size={14} />
                                <span>{task.duration}</span>
                              </div>

                              <div style={{ color: '#77736F' }}>
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Resources & Verbal AI Checkpoint View */}
                          {isExpanded && (
                            <div style={{
                              padding: '1.25rem 1.5rem',
                              borderTop: '1px solid #EAE7E2',
                              backgroundColor: '#FAFAF9',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1.25rem',
                            }}>
                              {/* Key Concepts Tags */}
                              <div>
                                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FE6904', textTransform: 'uppercase', marginBottom: '6px' }}>
                                  Key Concepts To Master
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                  {keyConcepts.map((concept, cIdx) => (
                                    <span key={cIdx} style={{
                                      fontSize: '0.78rem',
                                      fontWeight: 600,
                                      padding: '3px 10px',
                                      borderRadius: '8px',
                                      backgroundColor: '#FFFFFF',
                                      border: '1px solid #EAE7E2',
                                      color: '#374151',
                                    }}>
                                      {concept}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Curated Resources Section */}
                              <div>
                                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#171717', textTransform: 'uppercase', marginBottom: '8px' }}>
                                  Curated Learning Resources
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                                  {resources.map((res, rIdx) => (
                                    <div
                                      key={rIdx}
                                      style={{
                                        backgroundColor: '#FFFFFF',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid #EAE7E2',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                          <span style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            padding: '2px 6px',
                                            borderRadius: '6px',
                                            backgroundColor: '#F3F4F6',
                                            color: '#4B5563',
                                          }}>
                                            {res.type}
                                          </span>
                                          <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
                                            ⏱ {res.duration}
                                          </span>
                                        </div>
                                        <h5 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: 800, color: '#171717' }}>
                                          {res.title}
                                        </h5>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: '#6B7280', lineHeight: '1.4' }}>
                                          {res.description}
                                        </p>
                                      </div>

                                      <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          fontSize: '0.78rem',
                                          fontWeight: 700,
                                          color: '#FE6904',
                                          textDecoration: 'none',
                                        }}
                                      >
                                        <span>Study with {res.provider}</span>
                                        <ExternalLink size={12} />
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Verbal AI Checkpoint Callout */}
                              <div style={{
                                backgroundColor: task.completed ? '#ECFDF5' : '#FFFFFF',
                                border: task.completed ? '1px solid #A7F3D0' : '1.5px solid #FE6904',
                                borderRadius: '16px',
                                padding: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '1rem',
                              }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <Sparkles size={16} color={task.completed ? '#047857' : '#FE6904'} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#171717' }}>
                                      {task.completed ? 'Milestone Verified via Verbal AI Checkpoint' : 'Verify Understanding via Verbal AI Checkpoint'}
                                    </span>
                                  </div>
                                  <p style={{ margin: 0, fontSize: '0.825rem', color: '#6B7280', maxWidth: '520px', lineHeight: '1.5' }}>
                                    {task.completed
                                      ? `Rubric evaluation passed with ${task.verifiedCheckpoint?.score || 92}% conceptual accuracy. Concepts are enrolled in your spaced repetition queue.`
                                      : 'To prevent superficial speedrunning, explain concepts in your own words using speech or text. Evaluated by Gemini against transparent rubrics.'}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => handleOpenCheckpoint(task, e)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    backgroundColor: task.completed ? '#FFFFFF' : '#FE6904',
                                    color: task.completed ? '#047857' : '#FFFFFF',
                                    border: task.completed ? '1px solid #A7F3D0' : 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    boxShadow: task.completed ? 'none' : '0 4px 14px rgba(254, 105, 4, 0.25)',
                                  }}
                                >
                                  <Mic size={16} />
                                  <span>{task.completed ? 'Re-verify with AI' : 'Start Verbal AI Checkpoint'}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Custom Task Modal */}
          <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Custom Learning Milestone">
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                  Assign to Phase
                </label>
                <select
                  value={selectedPhaseIndex}
                  onChange={(e) => setSelectedPhaseIndex(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.875rem',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {phases.map((p, idx) => (
                    <option key={idx} value={idx}>{p.phase}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                  Milestone Title
                </label>
                <input
                  type="text"
                  value={customTaskTitle}
                  onChange={(e) => setCustomTaskTitle(e.target.value)}
                  placeholder="e.g. Master Next.js 14 Server Actions"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={customTaskDuration}
                  onChange={(e) => setCustomTaskDuration(e.target.value)}
                  placeholder="e.g. 1 week"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    backgroundColor: '#FFFFFF',
                    color: '#77736F',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#FE6904',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {/* Verbal AI Checkpoint Modal */}
      {isCheckpointModalOpen && (
        <VerbalCheckpointModal
          isOpen={isCheckpointModalOpen}
          onClose={() => {
            setIsCheckpointModalOpen(false);
            setActiveCheckpointTask(null);
          }}
          task={activeCheckpointTask}
          careerTitle={activeRoadmap?.careerTitle}
          onMilestoneVerified={handleMilestoneVerified}
        />
      )}
    </div>
  );
}
