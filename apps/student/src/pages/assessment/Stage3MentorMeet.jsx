import React, { useState, useEffect } from 'react';
import {
  Video,
  Clock,
  User,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mic,
  Camera,
  CameraOff,
  MicOff,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { storageService } from '../../services/storageService';

const MENTORS = [
  {
    id: 'mentor-1',
    name: 'Ananya Sharma',
    role: 'Senior Software Engineer & STEM Mentor',
    specialty: 'Computer Science, AI, Systems Architecture',
    bio: 'Guided 300+ students transitioning from school into technology careers. Specializes in clear milestone planning.',
    avatar: 'AS',
  },
  {
    id: 'mentor-2',
    name: 'Vikram Menon',
    role: 'Design Director & UX Strategist',
    specialty: 'UI/UX Design, Product Strategy, Digital Media',
    bio: '12+ years in consumer tech design. Passionate about helping creative and visual students find high-impact roles.',
    avatar: 'VM',
  },
  {
    id: 'mentor-3',
    name: 'Sarah Thomas',
    role: 'Data Scientist & Academic Advisor',
    specialty: 'Data Analytics, Research, Problem Solving',
    bio: 'Former university faculty advising students on research-driven and analytical career pathways.',
    avatar: 'ST',
  },
];

export function Stage3MentorMeet({ onProceedToTop5, onBackToStage2 }) {
  const context = storageService.getStage1Context() || {};
  const preliminary = storageService.getStage3Preliminary() || {};

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
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '1.5rem 2rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(23, 23, 23, 0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '999px',
            backgroundColor: '#FFE5CE',
            color: '#FE6904',
          }}>
            Stage 3 of 6: Human Virtual Counselling
          </span>
          <span style={{ fontSize: '0.8rem', color: '#77736F' }}>1:1 Video Meet</span>
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#171717', margin: '0 0 6px 0' }}>
          Virtual Career Counselling Session
        </h2>
        <p style={{ fontSize: '0.925rem', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
          Meet with a dedicated career mentor to discuss your descriptive interests, review your AI MCQ assessment insights, and test your options before generating top career pathways.
        </p>
      </div>

      {/* Honest Demo Notice */}
      <div style={{
        padding: '0.85rem 1.25rem',
        backgroundColor: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.825rem',
        color: '#1E40AF',
      }}>
        <Info size={18} flexShrink={0} />
        <div>
          <strong>Virtual Meet Room Simulation:</strong> Interactive counsellor session connects student intake and AI MCQ data to an encrypted video workspace for hackathon demonstration.
        </div>
      </div>

      {!inMeeting ? (
        /* Mentor Selector & Launch Screen */
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          padding: '2rem',
          boxShadow: '0 2px 10px rgba(23, 23, 23, 0.03)',
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', margin: '0 0 1rem 0' }}>
            Choose Your Career Counsellor
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {MENTORS.map((m) => {
              const isSelected = selectedMentor.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMentor(m)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid #FE6904' : '1px solid #EAE7E2',
                    backgroundColor: isSelected ? '#FFF8F4' : '#F8F8F7',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#FE6904' : '#171717',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                    }}>
                      {m.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#171717' }}>{m.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#FE6904', fontWeight: 600 }}>{m.role}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#77736F', margin: 0, lineHeight: '1.5' }}>
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
                padding: '10px 18px',
                borderRadius: '10px',
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
                padding: '12px 26px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(254, 105, 4, 0.3)',
              }}
            >
              <Video size={18} /> Launch 1:1 Virtual Meet
            </button>
          </div>
        </div>
      ) : (
        /* Active Virtual Meet Room */
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '1.5rem' }}>
          {/* Left: Video Feeds & Call Controls */}
          <div style={{
            backgroundColor: '#171717',
            borderRadius: '20px',
            padding: '1.5rem',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '480px',
          }}>
            {/* Top Bar inside Call */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse 1s infinite' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#A7F3D0' }}>
                  Live Meet Session ({formatTimer(meetingSeconds)})
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                ZHERO Secure Meet Room
              </span>
            </div>

            {/* Video Feeds Simulation */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              margin: '2rem 0',
            }}>
              {/* Mentor Video Box */}
              <div style={{
                backgroundColor: '#262626',
                borderRadius: '14px',
                height: '180px',
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
                <div style={{ marginTop: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
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
                  Speaking • Counsellor
                </div>
              </div>

              {/* Student Video Box */}
              <div style={{
                backgroundColor: '#262626',
                borderRadius: '14px',
                height: '180px',
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
                <div style={{ marginTop: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
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
                  {isCameraOn ? 'Camera On' : 'Camera Off'}
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
                  padding: '0 20px',
                  height: '42px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                }}
              >
                <FileCheck size={16} /> Conclude Meet & View Top 5 Careers
              </button>
            </div>
          </div>

          {/* Right: Real-Time Mentor Discussion & Context Panel */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #EAE7E2',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(23, 23, 23, 0.03)',
          }}>
            <div>
              {/* Student Context Snapshot for Mentor */}
              <div style={{
                backgroundColor: '#F8F8F7',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid #EAE7E2',
                marginBottom: '1rem',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FE6904', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Student Context Profile
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
                  {context.classGrade || '12th Standard'} • {context.courseStream || 'Computer Science'}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#4B5563', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                  "{context.descriptiveInterests || 'Passionate about technology and problem solving.'}"
                </p>
              </div>

              {/* Discussion Checklist */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#171717', marginBottom: '8px' }}>
                  Discussion Checklist:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'discussedInterests', label: 'Explored stated interests & favorite topics' },
                    { key: 'reviewedMcqProfile', label: 'Reviewed AI MCQ cognitive dimension patterns' },
                    { key: 'addressedCareerDoubts', label: 'Addressed workload, exam pressure, or career doubts' },
                    { key: 'verifiedPathways', label: 'Aligned on practical starter milestones' },
                  ].map((chk) => (
                    <div
                      key={chk.key}
                      onClick={() => handleToggleChecklist(chk.key)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        backgroundColor: checklist[chk.key] ? '#ECFDF5' : '#F8F8F7',
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
                  Counsellor Observations & Feedback:
                </label>
                <textarea
                  rows={3}
                  value={mentorNotes}
                  onChange={(e) => setMentorNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.8rem',
                    color: '#171717',
                    outline: 'none',
                    backgroundColor: '#F8F8F7',
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
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              Finish Meet & Generate Career Suggestions <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
