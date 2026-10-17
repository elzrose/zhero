import React, { useState, useEffect } from 'react';
import {
  Video,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  MessageSquare,
  ShieldAlert,
  Mic,
  Camera,
  CameraOff,
  MicOff,
  PhoneOff,
  FileCheck,
  Send,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { storageService } from '../../services/storageService';

const MENTORS_LIST = [
  {
    id: 'mentor-1',
    name: 'Ananya Sharma',
    role: 'Senior Software Engineer & STEM Mentor',
    specialty: 'Computer Science, AI, Technical Roadmaps',
    bio: 'Guided 300+ students transitioning into tech. Passionate about demystifying engineering for beginners.',
    avatar: 'AS',
    slots: ['Today, 4:30 PM', 'Tomorrow, 11:00 AM', 'Friday, 2:00 PM'],
  },
  {
    id: 'mentor-2',
    name: 'Vikram Menon',
    role: 'Design Director & UX Strategist',
    specialty: 'UI/UX, Product Design, Creative Media',
    bio: '12+ years building consumer digital products. Specializes in helping creative students find high-impact careers.',
    avatar: 'VM',
    slots: ['Today, 6:00 PM', 'Tomorrow, 3:30 PM', 'Saturday, 10:00 AM'],
  },
  {
    id: 'mentor-3',
    name: 'Sarah Thomas',
    role: 'Data Scientist & Research Analyst',
    specialty: 'Data Analytics, Research, Problem Solving',
    bio: 'Former university faculty member advising students on analytical and research-driven pathways.',
    avatar: 'ST',
    slots: ['Tomorrow, 10:00 AM', 'Thursday, 5:00 PM', 'Saturday, 1:00 PM'],
  },
];

export function Stage4VirtualCounselling({ onProceedToStage5, onBackToStage3 }) {
  const preliminary = storageService.getStage3Preliminary();
  const context = storageService.getStage1Context();
  const existingBooking = storageService.getStage4Counselling();
  const existingReview = storageService.getStage4MentorReview();

  // Mode: 'booking' | 'meeting' | 'review' | 'completed'
  const [viewMode, setViewMode] = useState(() => {
    if (existingReview?.isCompleted) return 'completed';
    if (existingBooking) return 'meeting';
    return 'booking';
  });

  // Booking state
  const [selectedMentor, setSelectedMentor] = useState(MENTORS_LIST[0]);
  const [selectedSlot, setSelectedSlot] = useState(MENTORS_LIST[0].slots[0]);
  const [meetingFormat, setMeetingFormat] = useState('video'); // video | audio | notes
  const [studentQuestions, setStudentQuestions] = useState('');

  // Meeting Room state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [mentorNotes, setMentorNotes] = useState('');
  const [checklist, setChecklist] = useState({
    discussedInterests: true,
    addressedDoubts: false,
    evaluatedWorkload: false,
    verifiedSkills: false,
    endorsedTopCareer: false,
  });

  // Mentor Review Form state
  const [reviewData, setReviewData] = useState(() => {
    if (existingReview) return existingReview;
    return {
      mentorName: selectedMentor.name,
      overallAssessment: '',
      endorsedCareerId: preliminary?.careers?.[0]?.id || '',
      endorsedCareerTitle: preliminary?.careers?.[0]?.title || '',
      mentorAgreementReason: '',
      suggestedSkillFocus: '',
      unresolvedQuestions: '',
      isCompleted: false,
    };
  });

  useEffect(() => {
    let timer;
    if (viewMode === 'meeting' && meetingStarted) {
      timer = setInterval(() => {
        setMeetingDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [viewMode, meetingStarted]);

  const handleConfirmBooking = () => {
    const booking = {
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      mentorRole: selectedMentor.role,
      slot: selectedSlot,
      format: meetingFormat,
      studentQuestions: studentQuestions || 'General career exploration and doubt clearing',
      bookedAt: new Date().toISOString(),
      isDemoBooking: true,
    };
    storageService.saveStage4Counselling(booking);
    setViewMode('meeting');
    setMeetingStarted(true);
  };

  const handleToggleChecklist = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmitMentorReview = (e) => {
    if (e) e.preventDefault();
    const finalReview = {
      ...reviewData,
      mentorName: selectedMentor.name,
      submittedAt: new Date().toISOString(),
      isCompleted: true,
      checklist,
      notes: mentorNotes,
      isDemonstrationReview: true,
    };
    storageService.saveStage4MentorReview(finalReview);
    setViewMode('completed');
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Stage Introduction Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '1.5rem 2rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(23, 23, 23, 0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: '#FFE5CE',
                color: '#FE6904',
              }}>
                Stage 4 of 6: Human-in-the-Loop
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                Virtual Career Counselling Session
              </h2>
            </div>
            <p style={{ fontSize: '0.925rem', color: '#77736F', margin: '6px 0 0 0', maxWidth: '720px', lineHeight: '1.6' }}>
              "Your assessment is a starting point, not a decision about your future. Meet with a career mentor to discuss what matters to you, explore your concerns, and refine your next steps."
            </p>
          </div>

          <div style={{
            display: 'flex',
            backgroundColor: '#F8F8F7',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid #EAE7E2',
          }}>
            <button
              onClick={() => setViewMode('booking')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                backgroundColor: viewMode === 'booking' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'booking' ? '#FE6904' : '#77736F',
                cursor: 'pointer',
                boxShadow: viewMode === 'booking' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              1. Booking
            </button>
            <button
              onClick={() => setViewMode('meeting')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                backgroundColor: viewMode === 'meeting' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'meeting' ? '#FE6904' : '#77736F',
                cursor: 'pointer',
                boxShadow: viewMode === 'meeting' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              2. Meeting Room
            </button>
            <button
              onClick={() => setViewMode('review')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                backgroundColor: viewMode === 'review' || viewMode === 'completed' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'review' || viewMode === 'completed' ? '#FE6904' : '#77736F',
                cursor: 'pointer',
                boxShadow: viewMode === 'review' || viewMode === 'completed' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              3. Mentor Review
            </button>
          </div>
        </div>
      </div>


      {/* VIEW 1: BOOKING FLOW */}
      {viewMode === 'booking' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Left: Mentor Selection */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #EAE7E2',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(23, 23, 23, 0.03)',
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', margin: '0 0 1rem 0' }}>
              Select a Verified Career Mentor
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {MENTORS_LIST.map((mentor) => {
                const isSelected = selectedMentor.id === mentor.id;
                return (
                  <div
                    key={mentor.id}
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setSelectedSlot(mentor.slots[0]);
                    }}
                    style={{
                      padding: '1rem',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #FE6904' : '1px solid #EAE7E2',
                      backgroundColor: isSelected ? '#FFE5CE' : '#F8F8F7',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: isSelected ? '#FE6904' : '#171717',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                      }}>
                        {mentor.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#171717' }}>
                          {mentor.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#FE6904', fontWeight: 600 }}>
                          {mentor.role}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#77736F', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                      {mentor.bio}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Slot & Format Form */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #EAE7E2',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(23, 23, 23, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', margin: '0 0 1rem 0' }}>
                Session Preferences
              </h3>

              {/* Slot choices */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', display: 'block', marginBottom: '8px' }}>
                  Available Sample Slots
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedMentor.slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSlot(s)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: selectedSlot === s ? '2px solid #FE6904' : '1px solid #EAE7E2',
                        backgroundColor: selectedSlot === s ? '#FFE5CE' : '#FFFFFF',
                        color: '#171717',
                        fontWeight: selectedSlot === s ? 700 : 500,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={14} color="#FE6904" /> {s}
                      </span>
                      {selectedSlot === s && <CheckCircle2 size={16} color="#FE6904" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', display: 'block', marginBottom: '8px' }}>
                  Preferred Meeting Format
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'video', label: '1:1 Video' },
                    { id: 'audio', label: 'Audio Only' },
                    { id: 'notes', label: 'Doc Review' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setMeetingFormat(fmt.id)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: meetingFormat === fmt.id ? '2px solid #FE6904' : '1px solid #EAE7E2',
                        backgroundColor: meetingFormat === fmt.id ? '#FFE5CE' : '#F8F8F7',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: meetingFormat === fmt.id ? '#FE6904' : '#171717',
                        cursor: 'pointer',
                      }}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific doubts / questions */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', display: 'block', marginBottom: '6px' }}>
                  What specific doubts or questions would you like to discuss? (Optional)
                </label>
                <textarea
                  rows={3}
                  value={studentQuestions}
                  onChange={(e) => setStudentQuestions(e.target.value)}
                  placeholder="e.g., I'm curious about UI/UX but wondering if tech jobs are too competitive in 2026..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #EAE7E2',
                    fontSize: '0.85rem',
                    color: '#171717',
                    outline: 'none',
                    backgroundColor: '#F8F8F7',
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              style={{
                marginTop: '1.5rem',
                backgroundColor: '#FE6904',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(254, 105, 4, 0.25)',
              }}
            >
              Launch Interactive Counselling Workspace <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: COUNSELLING WORKSPACE & MEETING ROOM */}
      {viewMode === 'meeting' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem' }}>
          {/* Left: Video / Audio Room Canvas */}
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
            {/* Top Bar inside call */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FE6904', animation: 'pulse 1s infinite' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#EAE7E2' }}>
                  Live Session ({formatTimer(meetingDuration)})
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#77736F' }}>
                ZHERO Protected Room • 1080p Encrypted
              </span>
            </div>

            {/* Video Feeds Simulation */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              margin: '2rem 0',
            }}>
              {/* Mentor Feed */}
              <div style={{
                backgroundColor: '#171717',
                borderRadius: '14px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '1px solid #171717',
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
                  color: '#FE6904',
                }}>
                  Speaking • Mentor
                </div>
              </div>

              {/* Student Feed */}
              <div style={{
                backgroundColor: '#171717',
                borderRadius: '14px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '1px solid #171717',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#77736F',
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
                  color: '#77736F',
                }}>
                  {isCameraOn ? 'Camera Active' : 'Camera Off'}
                </div>
              </div>
            </div>

            {/* Bottom Call Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              paddingTop: '1rem',
              borderTop: '1px solid #171717',
            }}>
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: isMicOn ? '#171717' : '#171717',
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
                  backgroundColor: isCameraOn ? '#171717' : '#171717',
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
                onClick={() => setViewMode('review')}
                style={{
                  backgroundColor: '#FE6904',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0 18px',
                  height: '42px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Proceed to Mentor Assessment Review <FileCheck size={16} />
              </button>
            </div>
          </div>

          {/* Right: Real-Time Counselling Checklist & Assessment Summary */}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#171717' }}>
                  Mentor Discussion Guide
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 700 }}>
                  Collaborative Checklist
                </span>
              </div>

              {/* Discussion points checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
                {[
                  { key: 'discussedInterests', label: 'Explored student meaningful interests & motivations' },
                  { key: 'addressedDoubts', label: 'Addressed doubts regarding difficulty or competitiveness' },
                  { key: 'evaluatedWorkload', label: 'Discussed realistic daily work and study workload' },
                  { key: 'verifiedSkills', label: 'Cross-checked self-reported vs demonstrated skills' },
                  { key: 'endorsedTopCareer', label: 'Agreed on endorsed primary recommendation' },
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => handleToggleChecklist(item.key)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: checklist[item.key] ? '#FFE5CE' : '#F8F8F7',
                      border: `1px solid ${checklist[item.key] ? '#EAE7E2' : '#EAE7E2'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      color: checklist[item.key] ? '#FE6904' : '#77736F',
                      fontWeight: checklist[item.key] ? 700 : 500,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item.key]}
                      readOnly
                      style={{ accentColor: '#FE6904' }}
                    />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Mentor live notes */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717', display: 'block', marginBottom: '4px' }}>
                  Mentor Session Observations & Student Context:
                </label>
                <textarea
                  rows={4}
                  value={mentorNotes}
                  onChange={(e) => setMentorNotes(e.target.value)}
                  placeholder="Note student aspirations, lifestyle priorities, family or practical constraints voluntarily shared..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.825rem',
                    color: '#171717',
                    outline: 'none',
                    backgroundColor: '#F8F8F7',
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => setViewMode('review')}
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
              Complete Meeting & Formulate Report <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: MENTOR REVIEW SUBMISSION */}
      {(viewMode === 'review' || viewMode === 'completed') && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={20} color="#FE6904" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                  Mentor Post-Session Assessment & Review
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#77736F', margin: '4px 0 0 0' }}>
                Counsellor evaluations distinguish human professional judgment from automated AI interpretations.
              </p>
            </div>

            {viewMode === 'completed' && (
              <span style={{
                backgroundColor: '#FFE5CE',
                color: '#FE6904',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <CheckCircle2 size={14} /> Review Formally Submitted
              </span>
            )}
          </div>

          <form onSubmit={handleSubmitMentorReview}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {/* Endorsed career path */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', display: 'block', marginBottom: '6px' }}>
                  1. Counsellor-Endorsed Primary Career Path
                </label>
                <select
                  value={reviewData.endorsedCareerId}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const c = preliminary?.careers?.find((x) => x.id === selId);
                    setReviewData((prev) => ({
                      ...prev,
                      endorsedCareerId: selId,
                      endorsedCareerTitle: c?.title || selId,
                    }));
                  }}
                  disabled={viewMode === 'completed'}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #EAE7E2',
                    fontSize: '0.85rem',
                    color: '#171717',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {preliminary?.careers?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} (AI Affinity: {c.matchScore}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Mentor Agreement / Challenge */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', display: 'block', marginBottom: '6px' }}>
                  2. Mentor Rationale (Agreed vs Challenged)
                </label>
                <input
                  type="text"
                  value={reviewData.mentorAgreementReason || 'Strongly concurred with student curiosity and visual systems thinking; suggested grounding in real product workflows.'}
                  onChange={(e) => setReviewData((prev) => ({ ...prev, mentorAgreementReason: e.target.value }))}
                  disabled={viewMode === 'completed'}
                  placeholder="Why did the mentor support or challenge the AI rank?"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #EAE7E2',
                    fontSize: '0.85rem',
                    color: '#171717',
                  }}
                />
              </div>
            </div>

            {/* Qualitative observations */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', display: 'block', marginBottom: '6px' }}>
                3. Key Discussion Takeaways & Student Stated Priorities:
              </label>
              <textarea
                rows={3}
                value={reviewData.overallAssessment || 'Student demonstrated high intrinsic interest when discussing creative problem solving and real human impact. Initial self-doubt around technical difficulty was clarified by reviewing modular learning milestones.'}
                onChange={(e) => setReviewData((prev) => ({ ...prev, overallAssessment: e.target.value }))}
                disabled={viewMode === 'completed'}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #EAE7E2',
                  fontSize: '0.85rem',
                  color: '#171717',
                }}
              />
            </div>

            {/* Immediate Next Steps suggested */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', display: 'block', marginBottom: '6px' }}>
                4. Recommended Practice Activity & Skill Building:
              </label>
              <input
                type="text"
                value={reviewData.suggestedSkillFocus || 'Complete introductory wireframing simulation, practice user interview synthesis, and explore portfolio projects.'}
                onChange={(e) => setReviewData((prev) => ({ ...prev, suggestedSkillFocus: e.target.value }))}
                disabled={viewMode === 'completed'}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #EAE7E2',
                  fontSize: '0.85rem',
                  color: '#171717',
                }}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #EAE7E2' }}>
              <button
                type="button"
                onClick={() => setViewMode('meeting')}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #EAE7E2',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  color: '#171717',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Back to Meeting Room
              </button>

              {viewMode !== 'completed' ? (
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#FE6904',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                  }}
                >
                  <FileCheck size={16} /> Sign & Lock Counsellor Review
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onProceedToStage5}
                  style={{
                    backgroundColor: '#FE6904',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 26px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(254, 105, 4, 0.3)',
                  }}
                >
                  Proceed to Final Recommendations <ArrowRight size={18} />
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Navigation Footer */}
      <div style={{
        marginTop: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={onBackToStage3}
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
          <ArrowLeft size={16} /> Back to Preliminary Report
        </button>

        {viewMode === 'completed' && (
          <button
            onClick={onProceedToStage5}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FE6904',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            Go to Stage 5: Final Recommendations <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
