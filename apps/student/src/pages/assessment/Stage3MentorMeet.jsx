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
      {/* Header Banner */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#171717',
          letterSpacing: '-0.02em',
          margin: '0 0 0.5rem 0',
        }}>
          Virtual Career Counselling Session
        </h2>
        <p style={{ fontSize: '1rem', color: '#77736F', margin: 0, maxWidth: '580px', marginInline: 'auto', lineHeight: '1.6' }}>
          Connect with an experienced mentor to discuss your descriptive interests, review your AI MCQ results, and refine your options.
        </p>
      </div>

      {!inMeeting ? (
        /* Mentor Selector Screen */
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #EAE7E2',
          padding: '2.5rem',
          boxShadow: '0 2px 12px rgba(23, 23, 23, 0.02)',
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', margin: '0 0 1.5rem 0' }}>
            Choose Your Career Counsellor
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}>
            {MENTORS.map((m) => {
              const isSelected = selectedMentor.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMentor(m)}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '18px',
                    border: isSelected ? '2px solid #FE6904' : '1px solid #EAE7E2',
                    backgroundColor: isSelected ? '#FFF8F4' : '#FBFBFA',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      backgroundColor: isSelected ? '#FE6904' : '#171717',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                    }}>
                      {m.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#171717' }}>{m.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#FE6904', fontWeight: 600 }}>{m.role}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>
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
                backgroundColor: 'transparent',
                border: '1px solid #EAE7E2',
                padding: '10px 20px',
                borderRadius: '12px',
                color: '#171717',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} /> Back to MCQ Assessment
            </button>

            <button
              onClick={() => setInMeeting(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#FE6904',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(254, 105, 4, 0.25)',
              }}
            >
              <Video size={18} /> Launch 1:1 Virtual Meet
            </button>
          </div>
        </div>
      ) : (
        /* Active Virtual Meet Room */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
          {/* Left: Video Feeds */}
          <div style={{
            backgroundColor: '#171717',
            borderRadius: '24px',
            padding: '1.75rem',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '480px',
          }}>
            {/* Call Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse 1s infinite' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#A7F3D0' }}>
                  Live Session ({formatTimer(meetingSeconds)})
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                ZHERO Secure Meet
              </span>
            </div>

            {/* Video Panels */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              margin: '2rem 0',
            }}>
              {/* Mentor Tile */}
              <div style={{
                backgroundColor: '#262626',
                borderRadius: '18px',
                height: '190px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '1px solid #374151',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#FE6904',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}>
                  {selectedMentor.avatar}
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.875rem', fontWeight: 700 }}>
                  {selectedMentor.name}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                  color: '#10B981',
                }}>
                  Speaking • Mentor
                </div>
              </div>

              {/* Student Tile */}
              <div style={{
                backgroundColor: '#262626',
                borderRadius: '18px',
                height: '190px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '1px solid #374151',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#4B5563',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}>
                  YOU
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.875rem', fontWeight: 700 }}>
                  Student Feed
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                  color: isCameraOn ? '#10B981' : '#EF4444',
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
              borderTop: '1px solid #374151',
            }}>
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: isMicOn ? '#374151' : '#DC2626',
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
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: isCameraOn ? '#374151' : '#DC2626',
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
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0 22px',
                  height: '42px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                }}
              >
                <FileCheck size={16} /> Conclude & View Top 5 Careers
              </button>
            </div>
          </div>

          {/* Right: Mentor Context & Live Guide */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #EAE7E2',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(23, 23, 23, 0.02)',
          }}>
            <div>
              {/* Student Context Snapshot */}
              <div style={{
                backgroundColor: '#FBFBFA',
                borderRadius: '14px',
                padding: '1rem',
                border: '1px solid #EAE7E2',
                marginBottom: '1.25rem',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FE6904', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Student Background
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#171717' }}>
                  {context.classGrade || 'Class 12'} • {context.courseStream || 'Science'}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#4B5563', margin: '6px 0 0 0', lineHeight: '1.4' }}>
                  "{context.descriptiveInterests || 'Exploring passions'}"
                </p>
              </div>

              {/* Discussion Checklist */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171717', marginBottom: '8px' }}>
                  Discussion Checklist:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'discussedInterests', label: 'Explored student stated interests & topics' },
                    { key: 'reviewedMcqProfile', label: 'Reviewed AI MCQ dimension patterns' },
                    { key: 'addressedCareerDoubts', label: 'Addressed workload, exam pressure, or career doubts' },
                    { key: 'verifiedPathways', label: 'Aligned on practical starter milestones' },
                  ].map((chk) => (
                    <div
                      key={chk.key}
                      onClick={() => handleToggleChecklist(chk.key)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        backgroundColor: checklist[chk.key] ? '#ECFDF5' : '#FBFBFA',
                        border: `1px solid ${checklist[chk.key] ? '#A7F3D0' : '#EAE7E2'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: checklist[chk.key] ? '#047857' : '#4B5563',
                        fontWeight: checklist[chk.key] ? 700 : 500,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checklist[chk.key]}
                        readOnly
                        style={{ accentColor: '#10B981' }}
                      />
                      <span>{chk.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor Notes */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717', display: 'block', marginBottom: '4px' }}>
                  Mentor Observations:
                </label>
                <textarea
                  rows={3}
                  value={mentorNotes}
                  onChange={(e) => setMentorNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.8rem',
                    color: '#171717',
                    outline: 'none',
                    backgroundColor: '#FBFBFA',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleConcludeMeet}
              style={{
                marginTop: '1.25rem',
                backgroundColor: '#171717',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 18px',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              Finish Meet & See Career Suggestions <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
