import React, { useState } from 'react';
import { useTuitionStore, storeActions } from '../data/store';
import { STUDY_TOGETHER_SESSIONS } from '../data/studentCompatibility';
import { StatCard, Modal } from '../components/Modal';

export function MentorsView() {
  const store = useTuitionStore();
  const students = store.students || [];
  const studySessions = store.studySessions || STUDY_TOGETHER_SESSIONS;

  const [activeTab, setActiveTab] = useState('interviews'); // 'interviews' | 'sessions' | 'faculty'
  const [isScheduleInterviewOpen, setIsScheduleInterviewOpen] = useState(false);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [interviewSuccess, setInterviewSuccess] = useState(false);

  const [interviewForm, setInterviewForm] = useState({
    studentId: '',
    notes: '',
    rating: 4.8,
    readinessLevel: 'Industry-Ready Intern',
    interviewer: 'Dr. Radhika Sen (Apex Lead Faculty)'
  });

  const [sessionForm, setSessionForm] = useState({
    title: '',
    topic: 'Full-Stack Web Development',
    host: 'Dr. Radhika Sen',
    roomCode: 'ZHERO-STU-802',
    maxParticipants: 15
  });

  const facultyMentors = [
    {
      id: 'men-1',
      name: 'Dr. Radhika Sen',
      title: 'Lead Full-Stack & Systems Faculty',
      qualification: 'Ph.D. in Computer Science',
      specialty: 'Distributed Systems, React/Node, Career Portfolios',
      assignedStudentsCount: 14,
      rating: 4.9,
      availability: 'Mon, Wed, Fri (2 PM - 6 PM)'
    },
    {
      id: 'men-2',
      name: 'Prof. Thomas Mathew',
      title: 'Senior Data Science & AI Mentor',
      qualification: 'M.Tech, Ex-Senior Data Architect',
      specialty: 'Machine Learning, Statistics, Python Pipelines',
      assignedStudentsCount: 12,
      rating: 4.8,
      availability: 'Tue, Thu, Sat (10 AM - 3 PM)'
    },
    {
      id: 'men-3',
      name: 'Priya Nair',
      title: 'UI/UX & Product Design Specialist',
      qualification: 'B.Des, Senior Product Designer',
      specialty: 'Design Systems, Figma Prototyping, Usability Audits',
      assignedStudentsCount: 8,
      rating: 4.9,
      availability: 'Mon to Fri (4 PM - 7 PM)'
    },
    {
      id: 'men-4',
      name: 'Arun Kumar',
      title: 'Embedded Systems & Robotics Engineer',
      qualification: 'M.S. Robotics, Hardware Architect',
      specialty: 'Microcontrollers, IoT, C/C++ Firmware',
      assignedStudentsCount: 6,
      rating: 4.7,
      availability: 'Weekends (9 AM - 1 PM)'
    }
  ];

  const handleRecordInterview = (e) => {
    e.preventDefault();
    if (!interviewForm.studentId || !interviewForm.notes) return;

    const studentObj = students.find(s => s.id === interviewForm.studentId) || { name: 'Student' };

    storeActions.recordMentorReview({
      studentId: interviewForm.studentId,
      studentName: studentObj.name,
      careerTrack: studentObj.targetCareer,
      notes: interviewForm.notes,
      interviewer: interviewForm.interviewer,
      rating: parseFloat(interviewForm.rating) || 4.8,
      readinessLevel: interviewForm.readinessLevel,
      verifiedAt: new Date().toISOString()
    });

    setInterviewSuccess(true);
    setIsScheduleInterviewOpen(false);
    setInterviewForm({
      studentId: '',
      notes: '',
      rating: 4.8,
      readinessLevel: 'Industry-Ready Intern',
      interviewer: 'Dr. Radhika Sen (Apex Lead Faculty)'
    });
    setTimeout(() => setInterviewSuccess(false), 4000);
  };

  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!sessionForm.title) return;

    storeActions.addStudySession({
      title: sessionForm.title,
      topic: sessionForm.topic,
      host: sessionForm.host,
      participants: 1,
      status: 'Active Now',
      roomCode: sessionForm.roomCode,
      scheduledTime: 'Today, 5:00 PM – 7:00 PM'
    });

    setIsAddSessionOpen(false);
    setSessionForm({
      title: '',
      topic: 'Full-Stack Web Development',
      host: 'Dr. Radhika Sen',
      roomCode: 'ZHERO-STU-' + Math.floor(100 + Math.random() * 900),
      maxParticipants: 15
    });
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
              Faculty Mentorship, Stage 4 Interviews & Study Sessions
            </h1>
            <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.75rem' }}>
              Human-in-the-Loop
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
            Coordinate human career validation interviews (Stage 4) and live peer Study Together sessions across tuition cohorts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsScheduleInterviewOpen(true)}
            className="tc-btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            + Record Stage 4 Interview
          </button>
          <button
            onClick={() => setIsAddSessionOpen(true)}
            className="tc-btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            + Host Study Session
          </button>
        </div>
      </div>

      {interviewSuccess && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#EAF7EE',
          border: '1px solid #C3E6CB',
          color: '#1E7E34',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          ✓ Stage 4 Mentor Review saved and synchronized to Student ecosystem key `zhero_stage4_mentor_review`!
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard
          title="Faculty Mentors"
          value={facultyMentors.length}
          subtext="Active 1:1 tutors & advisors"
          icon="👨‍🏫"
        />
        <StatCard
          title="Stage 4 Interviews"
          value={store.mentorReviews?.length || 4}
          subtext="Career readiness validations"
          trend="+100% placement track"
          icon="🤝"
          highlight={true}
        />
        <StatCard
          title="Study Together Rooms"
          value={studySessions.length}
          subtext="Live collaborative rooms"
          tag="Active"
          icon="👥"
        />
        <StatCard
          title="Mentorship Rating"
          value="4.9 / 5.0"
          subtext="Student feedback average"
          icon="⭐"
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'interviews', label: 'Stage 4 Career Interviews', icon: '🎙️' },
          { id: 'sessions', label: 'Study Together Peer Rooms', icon: '👥' },
          { id: 'faculty', label: 'Faculty Mentors Roster', icon: '👨‍🏫' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'tc-btn-primary' : 'tc-btn-secondary'}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: STAGE 4 CAREER INTERVIEWS */}
      {activeTab === 'interviews' && (
        <div className="tc-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--tc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717' }}>
                Stage 4: Human-in-the-Loop Career Alignment Records
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', marginTop: '0.2rem' }}>
                Verified by tuition centre faculty before students are recommended for client project stipends or internships.
              </p>
            </div>
            <button onClick={() => setIsScheduleInterviewOpen(true)} className="tc-btn-primary" style={{ fontSize: '0.75rem' }}>
              + Record Review
            </button>
          </div>

          <table className="tc-table">
            <thead>
              <tr>
                <th>Student & ID</th>
                <th>Target Career Track</th>
                <th>Interviewer / Faculty</th>
                <th>Readiness Verdict</th>
                <th>Rating</th>
                <th>Interview Observations</th>
                <th>Sync Status</th>
              </tr>
            </thead>
            <tbody>
              {(store.mentorReviews || []).map((rev, rIdx) => (
                <tr key={rev.id || rIdx}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#171717' }}>{rev.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>{rev.studentId}</div>
                  </td>
                  <td>
                    <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.75rem' }}>
                      {rev.careerTrack}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{rev.interviewer}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>{rev.verifiedAt?.split('T')[0] || 'Recent'}</div>
                  </td>
                  <td>
                    <span className="tc-badge tc-badge-success" style={{ fontSize: '0.75rem' }}>
                      {rev.readinessLevel}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#8C6A05' }}>
                      ⭐ {rev.rating}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--tc-charcoal)', maxWidth: '320px', lineHeight: 1.4 }}>
                      "{rev.notes}"
                    </div>
                  </td>
                  <td>
                    <span className="tc-badge tc-badge-neutral" style={{ fontSize: '0.7rem' }}>
                      Synced ⚡
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: STUDY TOGETHER PEER ROOMS */}
      {activeTab === 'sessions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {studySessions.map((session, sIdx) => (
            <div key={session.id || sIdx} className="tc-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="tc-badge tc-badge-success" style={{ fontSize: '0.7rem' }}>
                    🟢 {session.status}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--tc-muted-text)' }}>
                    👥 {session.participants} Peers in Room
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', margin: '0.35rem 0' }}>
                  {session.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#8C6A05', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Topic: {session.topic}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', marginBottom: '0.75rem' }}>
                  Host: <strong>{session.host}</strong> • {session.scheduledTime}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--tc-border)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.75rem' }}>
                  Code: {session.roomCode}
                </span>
                <button
                  onClick={() => alert(`Joined Study Together Room: ${session.roomCode} (${session.title})`)}
                  className="tc-btn-primary"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                >
                  Join Room 🎧
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: FACULTY MENTORS ROSTER */}
      {activeTab === 'faculty' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {facultyMentors.map(mentor => (
            <div key={mentor.id} className="tc-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#171717' }}>{mentor.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#8C6A05', fontWeight: 600 }}>{mentor.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>{mentor.qualification}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, color: '#8C6A05', fontSize: '1rem' }}>
                    ⭐ {mentor.rating}
                  </span>
                </div>
              </div>

              <div style={{ background: '#FAF8F5', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--tc-border)', margin: '0.75rem 0' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', marginBottom: '0.2rem' }}>Core Domain Specialties:</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717' }}>{mentor.specialty}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginTop: '0.75rem' }}>
                <span style={{ color: 'var(--tc-muted-text)' }}>Assigned Students: <strong>{mentor.assignedStudentsCount}</strong></span>
                <span className="tc-badge tc-badge-neutral" style={{ fontSize: '0.7rem' }}>{mentor.availability}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Stage 4 Interview Modal */}
      {isScheduleInterviewOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsScheduleInterviewOpen(false)}
          title="Record Stage 4 Faculty Interview Review"
          maxWidth="640px"
        >
          <form onSubmit={handleRecordInterview}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Select Student *
              </label>
              <select
                required
                className="tc-select"
                value={interviewForm.studentId}
                onChange={(e) => setInterviewForm({ ...interviewForm, studentId: e.target.value })}
              >
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id} - Track: {s.targetCareer})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Readiness Verdict Level
                </label>
                <select
                  className="tc-select"
                  value={interviewForm.readinessLevel}
                  onChange={(e) => setInterviewForm({ ...interviewForm, readinessLevel: e.target.value })}
                >
                  <option value="Industry-Ready Intern">Industry-Ready Intern</option>
                  <option value="Junior Project Developer">Junior Project Developer</option>
                  <option value="Advanced Capstone Candidate">Advanced Capstone Candidate</option>
                  <option value="Requires Foundation Reinforcement">Requires Foundation Reinforcement</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Faculty Rating (out of 5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  className="tc-input"
                  value={interviewForm.rating}
                  onChange={(e) => setInterviewForm({ ...interviewForm, rating: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Faculty Interviewer Name
              </label>
              <input
                type="text"
                className="tc-input"
                value={interviewForm.interviewer}
                onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Comprehensive Faculty Interview Observations *
              </label>
              <textarea
                required
                rows={4}
                className="tc-input"
                placeholder="Provide evaluation on conceptual clarity, problem solving, portfolio projects, and readiness for client micro-bounties..."
                value={interviewForm.notes}
                onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setIsScheduleInterviewOpen(false)} className="tc-btn-secondary">
                Cancel
              </button>
              <button type="submit" className="tc-btn-primary">
                Save & Synchronize Review ⚡
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Host Study Session Modal */}
      {isAddSessionOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddSessionOpen(false)}
          title="Launch Live Study Together Room"
          maxWidth="560px"
        >
          <form onSubmit={handleCreateSession}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Session Room Title *
              </label>
              <input
                type="text"
                required
                className="tc-input"
                placeholder="e.g. React Hooks & Context API Deep Dive"
                value={sessionForm.title}
                onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Core Topic / Curriculum Milestone
              </label>
              <input
                type="text"
                className="tc-input"
                placeholder="e.g. Full-Stack Web Development (Phase 1)"
                value={sessionForm.topic}
                onChange={(e) => setSessionForm({ ...sessionForm, topic: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Host / Facilitator
                </label>
                <input
                  type="text"
                  className="tc-input"
                  value={sessionForm.host}
                  onChange={(e) => setSessionForm({ ...sessionForm, host: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Room Code
                </label>
                <input
                  type="text"
                  className="tc-input"
                  value={sessionForm.roomCode}
                  onChange={(e) => setSessionForm({ ...sessionForm, roomCode: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setIsAddSessionOpen(false)} className="tc-btn-secondary">
                Cancel
              </button>
              <button type="submit" className="tc-btn-primary">
                Open Study Room 🎧
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
