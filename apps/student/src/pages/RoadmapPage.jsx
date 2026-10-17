import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Plus,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ExternalLink,
  Lock
} from 'lucide-react';
import { CAREERS_DATA } from '../data/careersData';
import { Modal } from '../components/Modal';
import { storageService } from '../services/storageService';
import { checkpointService } from '../services/checkpointService';
import { MasteryGateModal } from '../components/MasteryGateModal';
import { masteryService } from '../services/masteryService';
import { DailyRevisionQueue } from '../components/DailyRevisionQueue';
import { LearningCalibrationView } from '../components/LearningCalibrationView';
import { DailyWorkloadPlannerView } from '../components/DailyWorkloadPlannerView';

export function RoadmapPage({
  activeRoadmap,
  onAddCustomTask,
  onSwitchRoadmapCareer,
  onAuditSkills: _onAuditSkills
}) {
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'daily_plan' | 'revision'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);
  const [customTaskTitle, setCustomTaskTitle] = useState('');
  const [customTaskDuration, setCustomTaskDuration] = useState('1 week');

  // Expanded task drawer state
  const [expandedTaskId, setExpandedTaskId] = useState('fs-1');

  // Checkpoint Modal state
  const [activeCheckpointTask, setActiveCheckpointTask] = useState(null);
  const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);

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
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{activeRoadmap?.careerTitle || 'Career'} roadmap</h1>
          <p className="page-subtitle">Milestones and study resources for this career.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={activeRoadmap?.careerId || 'full-stack-engineer'}
            onChange={(e) => onSwitchRoadmapCareer(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #EAE7E2',
              fontSize: '0.85rem',
              backgroundColor: '#FFFFFF',
              color: '#171717',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {CAREERS_DATA.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #EAE7E2',
        marginBottom: '1.5rem',
        gap: '1.5rem',
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('roadmap')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 2px',
            border: 'none',
            borderBottom: activeTab === 'roadmap' ? '2px solid #FE6904' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'roadmap' ? '#FE6904' : '#77736F',
            fontSize: '0.9rem',
            fontWeight: activeTab === 'roadmap' ? 600 : 400,
            cursor: 'pointer',
            marginBottom: '-1px',
          }}
        >
          <span>Roadmap</span>
          <span className="badge" style={{ backgroundColor: '#F8F8F7', color: '#171717', border: '1px solid #EAE7E2' }}>
            {progressPct}%
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('daily_plan')}
          style={{
            padding: '8px 2px',
            border: 'none',
            borderBottom: activeTab === 'daily_plan' ? '2px solid #FE6904' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'daily_plan' ? '#FE6904' : '#77736F',
            fontSize: '0.9rem',
            fontWeight: activeTab === 'daily_plan' ? 600 : 400,
            cursor: 'pointer',
            marginBottom: '-1px',
          }}
        >
          Daily plan
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('revision')}
          style={{
            padding: '8px 2px',
            border: 'none',
            borderBottom: activeTab === 'revision' ? '2px solid #FE6904' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'revision' ? '#FE6904' : '#77736F',
            fontSize: '0.9rem',
            fontWeight: activeTab === 'revision' ? 600 : 400,
            cursor: 'pointer',
            marginBottom: '-1px',
          }}
        >
          Revision
        </button>
      </div>

      {activeTab === 'daily_plan' ? (
        <DailyWorkloadPlannerView
          onNavigateToRoadmap={() => setActiveTab('roadmap')}
        />
      ) : activeTab === 'revision' ? (
        <DailyRevisionQueue
          onRoadmapUpdated={() => {
            window.dispatchEvent(new Event('storage'));
          }}
        />
      ) : (
        <div>
          {/* Progress row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #EAE7E2',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#171717' }}>
                Progress: {completedTasks} of {totalTasks} milestones completed ({progressPct}%)
              </div>
              <div style={{ width: '200px', height: '6px', background: '#F8F8F7', borderRadius: '9999px', overflow: 'hidden', marginTop: '6px' }}>
                <div style={{
                  width: `${progressPct}%`,
                  height: '100%',
                  background: '#FE6904',
                  borderRadius: '9999px',
                }} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
            >
              <Plus size={14} />
              <span>Add task</span>
            </button>
          </div>

          {/* Phases become plain sections with checklists, not a card per phase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {phases.map((phase, pIdx) => {
              const phaseTasksCompleted = phase.tasks.filter((t) => t.completed).length;

              return (
                <div key={pIdx} className="section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #EAE7E2' }}>
                    <h2 className="section-title" style={{ margin: 0 }}>
                      {phase.phase}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
                      {phaseTasksCompleted} of {phase.tasks.length} completed
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {phase.tasks.map((task, tIdx) => {
                      const isExpanded = expandedTaskId === task.id;
                      const resources = checkpointService.getCuratedResourcesForMilestone(task, activeRoadmap?.careerId);
                      const keyConcepts = checkpointService.getKeyConcepts(task);
                      const taskState = masteryService.getMilestoneState(task.id, task);

                      return (
                        <div
                          key={`${task.id || 'task'}-${tIdx}`}
                          className="list-row"
                          style={{
                            padding: 0,
                            overflow: 'hidden',
                          }}
                        >
                          {/* Task Summary Row */}
                          <div
                            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.875rem 1.25rem',
                              cursor: 'pointer',
                              backgroundColor: task.completed ? '#F8F8F7' : '#FFFFFF',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                              <div style={{ color: taskState === 'mastered' ? '#FE6904' : '#77736F', display: 'flex', alignItems: 'center' }}>
                                {taskState === 'mastered' ? (
                                  <CheckCircle2 size={18} color="#FE6904" />
                                ) : taskState === 'locked' ? (
                                  <Lock size={16} />
                                ) : (
                                  <BookOpen size={16} />
                                )}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: taskState === 'locked' ? '#77736F' : '#171717',
                                  }}>
                                    {task.title}
                                  </span>

                                  {task.isAdaptiveRemediation && (
                                    <span style={{ fontSize: '0.75rem', color: '#77736F' }}>
                                      Revision
                                    </span>
                                  )}

                                  {taskState === 'locked' && (
                                    <span className="badge" style={{ backgroundColor: '#F8F8F7', color: '#77736F', border: '1px solid #EAE7E2' }}>
                                      Locked
                                    </span>
                                  )}

                                  {taskState === 'mastered' && (
                                    <span className="badge" style={{ backgroundColor: '#FFE5CE', color: '#FE6904', border: '1px solid #EAE7E2' }}>
                                      Completed
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#77736F' }}>
                                <Clock size={14} />
                                <span>{task.duration}</span>
                              </div>

                              <div style={{ color: '#77736F' }}>
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </div>
                            </div>
                          </div>

                          {/* Expanded view */}
                          {isExpanded && (
                            <div style={{
                              padding: '1rem 1.25rem',
                              borderTop: '1px solid #EAE7E2',
                              backgroundColor: '#F8F8F7',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem',
                            }}>
                              {/* Key concepts */}
                              {keyConcepts.length > 0 && (
                                <div>
                                  <div style={{ fontSize: '0.75rem', color: '#77736F', marginBottom: '4px' }}>
                                    Key concepts
                                  </div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {keyConcepts.map((concept, cIdx) => (
                                      <span key={cIdx} style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        borderRadius: '9999px',
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #EAE7E2',
                                        color: '#171717',
                                      }}>
                                        {concept}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Resources */}
                              {resources.length > 0 && (
                                <div>
                                  <div style={{ fontSize: '0.75rem', color: '#77736F', marginBottom: '6px' }}>
                                    Resources
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {resources.map((res, rIdx) => (
                                      <div
                                        key={rIdx}
                                        style={{
                                          backgroundColor: '#FFFFFF',
                                          padding: '8px 12px',
                                          borderRadius: '8px',
                                          border: '1px solid #EAE7E2',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <div>
                                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717' }}>{res.title}</div>
                                          <div style={{ fontSize: '0.75rem', color: '#77736F' }}>{res.provider} • {res.duration}</div>
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
                                            color: '#FE6904',
                                            textDecoration: 'none',
                                          }}
                                        >
                                          <span>Study</span>
                                          <ExternalLink size={12} />
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Action */}
                              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid #EAE7E2' }}>
                                <button
                                  type="button"
                                  onClick={(e) => handleOpenCheckpoint(task, e)}
                                  className="btn-primary"
                                  style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '0.8rem' }}
                                >
                                  {taskState === 'mastered' ? 'Review checkpoint' : 'Open checkpoint'}
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
          <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add milestone">
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                  Phase
                </label>
                <select
                  value={selectedPhaseIndex}
                  onChange={(e) => setSelectedPhaseIndex(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.85rem',
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
                  Title
                </label>
                <input
                  type="text"
                  value={customTaskTitle}
                  onChange={(e) => setCustomTaskTitle(e.target.value)}
                  placeholder="Task title"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                  Duration
                </label>
                <input
                  type="text"
                  value={customTaskDuration}
                  onChange={(e) => setCustomTaskDuration(e.target.value)}
                  placeholder="e.g. 1 week"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  Add milestone
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {/* Mastery Gate Modal */}
      {isCheckpointModalOpen && activeCheckpointTask && (
        <MasteryGateModal
          isOpen={isCheckpointModalOpen}
          onClose={() => {
            setIsCheckpointModalOpen(false);
            setActiveCheckpointTask(null);
          }}
          task={activeCheckpointTask}
          careerTitle={activeRoadmap?.careerTitle}
          onMilestoneMastered={handleMilestoneVerified}
        />
      )}
    </div>
  );
}
