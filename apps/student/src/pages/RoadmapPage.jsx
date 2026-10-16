import React, { useState } from 'react';
import { CheckCircle2, Clock, Plus, Map } from 'lucide-react';
import { CAREERS_DATA } from '../data/careersData';
import { Modal } from '../components/Modal';

export function RoadmapPage({
  activeRoadmap,
  onToggleTask,
  onAddCustomTask,
  onSwitchRoadmapCareer
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);
  const [customTaskTitle, setCustomTaskTitle] = useState('');
  const [customTaskDuration, setCustomTaskDuration] = useState('1 week');

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

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
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
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '9999px',
              background: '#FFE5CE',
              color: '#FE6904',
            }}>
              Personalized Learning Plan
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.03em', margin: 0 }}>
            {activeRoadmap?.careerTitle || 'Full Stack Software Engineer'} Roadmap
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#77736F', marginTop: '0.35rem' }}>
            Work through structured milestones, complete starter projects, and check off achievements as you progress.
          </p>
        </div>

        {/* Career Switcher Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#77736F' }}>Switch Roadmap:</span>
          <select
            value={activeRoadmap?.careerId || 'full-stack-engineer'}
            onChange={(e) => onSwitchRoadmapCareer(e.target.value)}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              border: '1px solid #EAE7E2',
              fontSize: '0.875rem',
              fontWeight: 700,
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

      {/* Progress Metric Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '1.75rem 2rem',
        marginBottom: '2.5rem',
        boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
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
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717' }}>Overall Completion</div>
              <div style={{ fontSize: '0.8rem', color: '#77736F' }}>
                {completedTasks} of {totalTasks} milestones checked off
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FE6904' }}>
              {progressPct}%
            </span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
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
                borderRadius: '18px',
                border: '1px solid #EAE7E2',
                padding: '1.75rem',
                boxShadow: '0 2px 8px rgba(23, 23, 23, 0.03)',
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
                  {phaseTasksCompleted} / {phase.tasks.length} Completed
                </span>
              </div>

              {/* Task Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {phase.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '1rem',
                      borderRadius: '12px',
                      background: task.completed ? '#F8F8F7' : '#FFFFFF',
                      border: task.completed ? '1px solid #EAE7E2' : '1px solid #EAE7E2',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      border: task.completed ? 'none' : '2px solid #D6D2CC',
                      backgroundColor: task.completed ? '#FE6904' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0,
                    }}>
                      {task.completed && <CheckCircle2 size={16} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: task.completed ? '#77736F' : '#171717',
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}>
                        {task.title}
                      </div>
                      {task.isCustom && (
                        <span style={{ fontSize: '0.7rem', color: '#FE6904', fontWeight: 600 }}>Custom Milestone</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#77736F' }}>
                      <Clock size={13} />
                      <span>{task.duration}</span>
                    </div>
                  </div>
                ))}
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
              placeholder="e.g. Build personal portfolio landing page"
              value={customTaskTitle}
              onChange={(e) => setCustomTaskTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
              Estimated Duration
            </label>
            <input
              type="text"
              placeholder="e.g. 1 week, 3 days"
              value={customTaskDuration}
              onChange={(e) => setCustomTaskDuration(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#FE6904',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '0.5rem',
            }}
          >
            Add Milestone
          </button>
        </form>
      </Modal>
    </div>
  );
}
