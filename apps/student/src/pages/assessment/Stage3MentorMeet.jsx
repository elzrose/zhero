import React, { useState, useEffect } from 'react';
import {
  Video,
  ArrowRight,
  ArrowLeft,
  Mic,
  Camera,
  CameraOff,
  MicOff,
  FileCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { storageService } from '../../services/storageService';

const MENTORS = [
  {
    id: 'mentor-1',
    name: 'Ananya Sharma',
    role: 'Senior Software Engineer & STEM Mentor',
    specialty: 'Computer Science, AI, Systems Architecture',
    bio: 'Guided 300+ students from school to engineering. Specializes in clear milestone roadmaps.',
    avatar: 'AS',
  },
  {
    id: 'mentor-2',
    name: 'Vikram Menon',
    role: 'Design Director & UX Strategist',
    specialty: 'UI/UX Design, Product Strategy, Creative Media',
    bio: '12+ years in consumer tech. Helps visual & creative students discover high-impact careers.',
    avatar: 'VM',
  },
  {
    id: 'mentor-3',
    name: 'Sarah Thomas',
    role: 'Data Scientist & Academic Advisor',
    specialty: 'Data Analytics, Research, Problem Solving',
    bio: 'Former university faculty advising students on research-driven and analytical pathways.',
    avatar: 'ST',
  },
];

export function Stage3MentorMeet({ onProceedToTop5, onBackToStage2 }) {
  const context = storageService.getStage1Context() || {};

  const [selectedMentor, setSelectedMentor] = useState(MENTORS[0]);
  const [inMeeting, setInMeeting] = useState(false);
  const [meetingSeconds, setMeetingSeconds] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [mentorNotes, setMentorNotes] = useState(
    'Student has clear curiosity in technical and design problem-solving. Discussed initial doubts about math prerequisites and outlined foundational starter milestones.'
  );

  const [checklist, setChecklist] = useState({
    discussedInterests: true,
    reviewedMcqProfile: true,
    addressedCareerDoubts: true,
    verifiedPathways: true,
  });

  useEffect(() => {
    let interval;
    if (inMeeting) {
      interval = setInterval(() => {
        setMeetingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inMeeting]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleChecklist = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConcludeMeet = () => {
    const review = {
      mentorName: selectedMentor.name,
      mentorRole: selectedMentor.role,
      notes: mentorNotes,
      checklist,
      completedAt: new Date().toISOString(),
      isCompleted: true,
    };
    storageService.saveStage4MentorReview(review);
    onProceedToTop5(review);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#171717',
          margin: '0 0 0.25rem 0',
        }}>
          Career Counselling
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#77736F', margin: 0 }}>
          Discuss your interests and questions with an advisor.
        </p>
      </div>

      {!inMeeting ? (
        /* Mentor Selector Screen */
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #EAE7E2',
          padding: '1.5rem',
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#171717', margin: '0 0 1.25rem 0' }}>
            Choose an advisor
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            {MENTORS.map((m) => {
              const isSelected = selectedMentor.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMentor(m)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: isSelected ? '1px solid #FE6904' : '1px solid #EAE7E2',
                    backgroundColor: isSelected ? '#FFE5CE' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#FE6904' : '#171717',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    }}>
                      {m.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171717' }}>{m.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#77736F' }}>{m.role}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#77736F', margin: 0, lineHeight: '1.4' }}>
                    {m.bio}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={onBackToStage2}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EAE7E2',
                padding: '8px 16px',
                borderRadius: '8px',
                color: '#171717',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>

            <button
              onClick={() => setInMeeting(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FE6904',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <Video size={16} /> Start meeting
            </button>
          </div>
        </div>
      ) : (
        /* Active Virtual Meet Room */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
          {/* Left: Video Feeds */}
          <div style={{
            backgroundColor: '#171717',
            borderRadius: '12px',
            padding: '1.5rem',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '440px',
          }}>
            {/* Call Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FE6904' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFE5CE' }}>
                  Live Session ({formatTimer(meetingSeconds)})
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#77736F' }}>
                Session active
              </span>
            </div>

            {/* Video Panels */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              margin: '1.5rem 0',
            }}>
              {/* Mentor Tile */}
              <div style={{
                backgroundColor: '#171717',
                borderRadius: '8px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '1px solid #77736F',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#FE6904',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                }}>
                  {selectedMentor.avatar}
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                  {selectedMentor.name}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(23,23,23,0.8)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  color: '#FFE5CE',
                }}>
                  Speaking • Advisor
                </div>
              </div>

              {/* Student Tile */}
              <div style={{
                backgroundColor: '#171717',
                borderRadius: '8px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '1px solid #77736F',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#77736F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                }}>
                  YOU
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                  Student Feed
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(23,23,23,0.8)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  color: isCameraOn ? '#FFE5CE' : '#77736F',
                }}>
                  {isCameraOn ? 'Camera Active' : 'Camera Muted'}
                </div>
              </div>
            </div>

            {/* Meet Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              paddingTop: '1rem',
              borderTop: '1px solid #77736F',
            }}>
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: isMicOn ? '#77736F' : '#FE6904',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
              </button>

              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: isCameraOn ? '#77736F' : '#FE6904',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {isCameraOn ? <Camera size={18} /> : <CameraOff size={18} />}
              </button>

              <button
                onClick={handleConcludeMeet}
                style={{
                  backgroundColor: '#FE6904',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0 20px',
                  height: '40px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <FileCheck size={16} /> Finish and view recommendations
              </button>
            </div>
          </div>

          {/* Right: Mentor Context & Live Guide */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #EAE7E2',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              {/* Student Context Snapshot */}
              <div style={{
                backgroundColor: '#F8F8F7',
                borderRadius: '8px',
                padding: '0.875rem',
                border: '1px solid #EAE7E2',
                marginBottom: '1rem',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#77736F', marginBottom: '2px' }}>
                  Student profile
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#171717' }}>
                  {context.classGrade || 'Class 12'} • {context.courseStream || 'Science'}
                </div>
                {context.descriptiveInterests && (
                  <p style={{ fontSize: '0.8rem', color: '#77736F', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                    "{context.descriptiveInterests}"
                  </p>
                )}
              </div>

              {/* Discussion Checklist */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717', marginBottom: '8px' }}>
                  Checklist:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'discussedInterests', label: 'Explored interests and preferences' },
                    { key: 'reviewedMcqProfile', label: 'Reviewed assessment patterns' },
                    { key: 'addressedCareerDoubts', label: 'Addressed questions or doubts' },
                    { key: 'verifiedPathways', label: 'Aligned on practical milestones' },
                  ].map((chk) => (
                    <div
                      key={chk.key}
                      onClick={() => handleToggleChecklist(chk.key)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        backgroundColor: checklist[chk.key] ? '#FFE5CE' : '#FFFFFF',
                        border: '1px solid #EAE7E2',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: checklist[chk.key] ? '#FE6904' : '#171717',
                        fontWeight: checklist[chk.key] ? 600 : 400,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checklist[chk.key]}
                        readOnly
                        style={{ accentColor: '#FE6904' }}
                      />
                      <span>{chk.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor Notes */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', display: 'block', marginBottom: '4px' }}>
                  Session notes:
                </label>
                <textarea
                  rows={3}
                  value={mentorNotes}
                  onChange={(e) => setMentorNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.8rem',
                    color: '#171717',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleConcludeMeet}
              style={{
                marginTop: '1rem',
                backgroundColor: '#171717',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              Finish and proceed <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
