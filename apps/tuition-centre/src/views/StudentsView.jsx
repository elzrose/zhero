import React, { useState } from 'react';
import { useTuitionStore, storeActions } from '../data/store';
import { Modal } from '../components/Modal';
import {
  ASSESSMENT_DIMENSIONS,
  CAREERS_CATALOGUE,
  VERBAL_CHECKPOINTS_DATA,
  SPACED_REPETITION_QUEUE,
  PROJECT_BOUNTIES
} from '../data/studentCompatibility';

export function StudentsView({ onDirectRecommend }) {
  const store = useTuitionStore();
  const students = store.students || [];

  const [search, setSearch] = useState('');
  const [engagementFilter, setEngagementFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'psychometrics' | 'checkpoints' | 'retention' | 'interview'
  const [newInterviewNote, setNewInterviewNote] = useState('');
  const [interviewSaved, setInterviewSaved] = useState(false);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.courseTitle?.toLowerCase().includes(search.toLowerCase()) ||
      s.targetCareer?.toLowerCase().includes(search.toLowerCase());
    const matchesEngagement = engagementFilter === 'All' || s.engagementCategory === engagementFilter;
    return matchesSearch && matchesEngagement;
  });

  const getEngagementBadge = (category) => {
    switch (category) {
      case 'Healthy': return 'tc-badge-success';
      case 'Needs Attention': return 'tc-badge-warning';
      case 'At Risk': return 'tc-badge-danger';
      default: return 'tc-badge-neutral';
    }
  };

  // Find relevant student compatibility data
  const studentCheckpoints = selectedStudent ? VERBAL_CHECKPOINTS_DATA.filter(
    chk => chk.studentName?.toLowerCase() === selectedStudent.name?.toLowerCase() ||
           chk.studentId === selectedStudent.id
  ) : [];

  const studentConcepts = selectedStudent ? SPACED_REPETITION_QUEUE.filter(
    item => item.studentName?.toLowerCase() === selectedStudent.name?.toLowerCase()
  ) : [];

  const studentBounties = selectedStudent ? PROJECT_BOUNTIES.filter(
    b => b.assignedStudent?.toLowerCase() === selectedStudent.name?.toLowerCase()
  ) : [];

  // Matched career details
  const matchedCareer = selectedStudent ? CAREERS_CATALOGUE.find(
    c => c.title?.toLowerCase() === selectedStudent.targetCareer?.toLowerCase() ||
         selectedStudent.targetCareer?.toLowerCase().includes(c.title?.toLowerCase().slice(0, 5))
  ) || CAREERS_CATALOGUE[0] : null;

  // Handle stage 4 mentor review saving
  const handleSaveInterviewReview = (e) => {
    e.preventDefault();
    if (!newInterviewNote.trim() || !selectedStudent) return;

    storeActions.recordMentorReview({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      careerTrack: selectedStudent.targetCareer,
      notes: newInterviewNote.trim(),
      interviewer: 'Dr. Radhika Sen (Apex Lead Faculty)',
      rating: 4.8,
      readinessLevel: 'Industry-Ready Intern',
      verifiedAt: new Date().toISOString()
    });

    setInterviewSaved(true);
    setNewInterviewNote('');
    setTimeout(() => setInterviewSaved(false), 3000);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
            Sponsored Student Directory & 360° Ecosystem Hub
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
            Unified centre view of learners: psychometric dimensions, verbal checkpoints, memory retention, and human mentor interviews.
          </p>
        </div>
      </div>

      {/* Engagement Summary Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <button
          onClick={() => setEngagementFilter('All')}
          style={{
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: engagementFilter === 'All' ? 'var(--tc-primary-yellow)' : 'var(--tc-border)',
            backgroundColor: engagementFilter === 'All' ? 'var(--tc-yellow-pale)' : '#FFFFFF',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', fontWeight: 600 }}>Total Enrolled</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171717' }}>{students.length}</div>
        </button>

        <button
          onClick={() => setEngagementFilter('Healthy')}
          style={{
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: engagementFilter === 'Healthy' ? '#C3E6CB' : 'var(--tc-border)',
            backgroundColor: engagementFilter === 'Healthy' ? '#EAF7EE' : '#FFFFFF',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#1E7E34', fontWeight: 600 }}>🟢 Healthy Engagement</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E7E34' }}>
            {students.filter(s => s.engagementCategory === 'Healthy').length}
          </div>
        </button>

        <button
          onClick={() => setEngagementFilter('Needs Attention')}
          style={{
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: engagementFilter === 'Needs Attention' ? '#FFE082' : 'var(--tc-border)',
            backgroundColor: engagementFilter === 'Needs Attention' ? '#FFF8E1' : '#FFFFFF',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#B78103', fontWeight: 600 }}>🟡 Needs Attention</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#B78103' }}>
            {students.filter(s => s.engagementCategory === 'Needs Attention').length}
          </div>
        </button>

        <button
          onClick={() => setEngagementFilter('At Risk')}
          style={{
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: engagementFilter === 'At Risk' ? '#F5C6CB' : 'var(--tc-border)',
            backgroundColor: engagementFilter === 'At Risk' ? '#FDF2F2' : '#FFFFFF',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#C53030', fontWeight: 600 }}>🔴 High Retention Risk</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#C53030' }}>
            {students.filter(s => s.engagementCategory === 'At Risk').length}
          </div>
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search student by name, ID (STU-101), batch or target career..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="tc-input"
          style={{ flex: 1, minWidth: '280px' }}
        />
      </div>

      {/* Students Table */}
      <div className="tc-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tc-table">
          <thead>
            <tr>
              <th>Student & ID</th>
              <th>Enrolled Batch</th>
              <th>Target Career Track</th>
              <th>Readiness</th>
              <th>Attendance</th>
              <th>Course Progress</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--tc-muted-text)' }}>
                  No students match the selected filter.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#171717' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>{student.id} • {student.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{student.batchName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>{student.courseTitle}</div>
                  </td>
                  <td>
                    <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.75rem' }}>
                      {student.targetCareer}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#171717' }}>
                      {student.readinessScore || '—'}%
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontWeight: 600,
                      color: student.attendanceRate < 70 ? '#C53030' : student.attendanceRate < 85 ? '#B78103' : '#1E7E34'
                    }}>
                      {student.attendanceRate}%
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', marginBottom: '0.2rem' }}>
                      {student.completedModules || 0} / {student.totalModules || 12} Modules
                    </div>
                    <div style={{ width: '60px', height: '4px', background: '#EAE5D8', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.round(((student.completedModules || 0) / (student.totalModules || 12)) * 100)}%`,
                        height: '100%',
                        background: 'var(--tc-primary-yellow)'
                      }} />
                    </div>
                  </td>
                  <td>
                    <span className={`tc-badge ${getEngagementBadge(student.engagementCategory)}`} style={{ fontSize: '0.75rem' }}>
                      {student.engagementCategory}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => { setSelectedStudent(student); setActiveTab('overview'); }}
                        className="tc-btn-outline"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        360° Profile
                      </button>
                      <button
                        onClick={() => onDirectRecommend(student)}
                        className="tc-btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        title="View explainable course recommendations"
                      >
                        Match ⚡
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 360° Student File Modal */}
      {selectedStudent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudent(null)}
          title={`Student Hub: ${selectedStudent.name} (${selectedStudent.id})`}
          maxWidth="840px"
        >
          <div>
            {/* Header Identity Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', padding: '1rem', background: '#FAF8F5', borderRadius: '10px', border: '1px solid var(--tc-border)' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717' }}>{selectedStudent.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', marginTop: '0.2rem' }}>
                  📧 {selectedStudent.email} • 📞 {selectedStudent.phone} • Enrolled: {selectedStudent.enrollmentDate}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>
                  Cohort: <strong>{selectedStudent.batchName}</strong> • Target: <strong>{selectedStudent.targetCareer}</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`tc-badge ${getEngagementBadge(selectedStudent.engagementCategory)}`} style={{ fontSize: '0.8rem' }}>
                  {selectedStudent.engagementCategory}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', marginTop: '0.35rem' }}>
                  Last active: {selectedStudent.lastActive}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--tc-border)', marginBottom: '1.25rem', gap: '0.5rem', overflowX: 'auto' }}>
              {[
                { id: 'overview', label: 'Overview & Retention', icon: '📋' },
                { id: 'psychometrics', label: 'Psychometrics & Career', icon: '📊' },
                { id: 'checkpoints', label: 'AI Verbal Checkpoints', icon: '🎙️', count: studentCheckpoints.length },
                { id: 'retention', label: 'Memory Decay (SM-2)', icon: '🧠', count: studentConcepts.length },
                { id: 'interview', label: 'Stage 4 Mentor Interview', icon: '🤝' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.6rem 0.9rem',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid var(--tc-primary-yellow)' : '2px solid transparent',
                    background: 'transparent',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    color: activeTab === tab.id ? '#171717' : 'var(--tc-muted-text)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'var(--tc-yellow-pale)', color: '#8C6A05', fontWeight: 700 }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                  <div style={{ padding: '0.75rem', background: 'var(--tc-yellow-cream)', borderRadius: '8px', border: '1px solid #EED180' }}>
                    <div style={{ fontSize: '0.7rem', color: '#8C6A05', fontWeight: 700, textTransform: 'uppercase' }}>Readiness Score</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8C6A05' }}>{selectedStudent.readinessScore}%</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: '#FAF8F5', borderRadius: '8px', border: '1px solid var(--tc-border)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)', fontWeight: 700, textTransform: 'uppercase' }}>Attendance</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: selectedStudent.attendanceRate < 75 ? '#C53030' : '#1E7E34' }}>
                      {selectedStudent.attendanceRate}%
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem', background: '#FAF8F5', borderRadius: '8px', border: '1px solid var(--tc-border)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)', fontWeight: 700, textTransform: 'uppercase' }}>Course Modules</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171717' }}>
                      {selectedStudent.completedModules} / {selectedStudent.totalModules}
                    </div>
                  </div>
                </div>

                {/* Change Engagement Status Control */}
                <div style={{ padding: '1rem', background: '#FFFFFF', border: '1px solid var(--tc-border)', borderRadius: '8px', marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Proactive Retention Risk Assessment:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['Healthy', 'Needs Attention', 'At Risk'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          storeActions.updateStudentEngagement(selectedStudent.id, cat);
                          setSelectedStudent({ ...selectedStudent, engagementCategory: cat });
                        }}
                        style={{
                          flex: 1,
                          padding: '0.4rem',
                          borderRadius: '6px',
                          border: '1px solid',
                          borderColor: selectedStudent.engagementCategory === cat ? '#171717' : 'var(--tc-border)',
                          backgroundColor: selectedStudent.engagementCategory === cat ? 'var(--tc-yellow-pale)' : '#FAF8F5',
                          fontWeight: selectedStudent.engagementCategory === cat ? 700 : 500,
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Faculty & Mentor Notes */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Faculty & Mentor Observations:</div>
                  <p style={{ color: 'var(--tc-muted-text)', background: '#FAF8F5', padding: '0.75rem', borderRadius: '8px', lineHeight: 1.5, fontSize: '0.85rem', border: '1px solid var(--tc-border)' }}>
                    {selectedStudent.notes || 'Enrolled in current cohort.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: PSYCHOMETRICS & CAREER */}
            {activeTab === 'psychometrics' && (
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', marginBottom: '0.75rem' }}>
                    6-Dimensional Psychometric Profile
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {ASSESSMENT_DIMENSIONS.map((dim) => {
                      // Generate deterministic score from student id & dimension
                      const pseudoScore = matchedCareer ? (matchedCareer.dimensions[dim.key] || 70) : 75;
                      return (
                        <div key={dim.key} style={{ background: '#FAF8F5', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--tc-border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{dim.label}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: dim.color }}>{pseudoScore}%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: '#EAE5D8', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: `${pseudoScore}%`, height: '100%', background: dim.color }} />
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>{dim.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {matchedCareer && (
                  <div style={{ background: 'var(--tc-yellow-cream)', border: '1px solid #EED180', padding: '1rem', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.7rem' }}>Primary Career Match</span>
                      <span style={{ fontWeight: 800, color: '#8C6A05' }}>Avg. {matchedCareer.avgSalary}</span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', margin: '0.2rem 0' }}>{matchedCareer.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--tc-charcoal)', lineHeight: 1.4, margin: '0.3rem 0' }}>{matchedCareer.description}</p>
                    <div style={{ fontSize: '0.75rem', color: '#1E7E34', marginTop: '0.5rem', fontWeight: 600 }}>
                      Growth: {matchedCareer.growthRate} • Micro-Simulation: "{matchedCareer.simulationPrompt}"
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: AI VERBAL CHECKPOINTS */}
            {activeTab === 'checkpoints' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
                    Verbal Comprehension Checkpoints ({studentCheckpoints.length})
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>
                    Anti-Speedrun & Misconception Analysis
                  </span>
                </div>

                {studentCheckpoints.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', background: '#FAF8F5', borderRadius: '8px', color: 'var(--tc-muted-text)', fontSize: '0.85rem' }}>
                    No verbal checkpoint submissions recorded yet for this student. Checkpoints appear as modules complete.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {studentCheckpoints.map(chk => (
                      <div key={chk.id} style={{ padding: '1rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--tc-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#171717' }}>{chk.milestoneTitle}</span>
                            <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>Submitted: {chk.submittedAt} • Audio duration: {chk.completionTimeSeconds}s</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className={`tc-badge ${chk.score >= 80 ? 'tc-badge-success' : 'tc-badge-warning'}`} style={{ fontSize: '0.75rem' }}>
                              Score: {chk.score}%
                            </span>
                            {chk.isSpeedrunRisk && (
                              <div style={{ fontSize: '0.7rem', color: '#C53030', fontWeight: 700, marginTop: '0.2rem' }}>⚠️ Speedrun Alert</div>
                            )}
                          </div>
                        </div>

                        <div style={{ background: '#FAF8F5', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', margin: '0.5rem 0', fontStyle: 'italic' }}>
                          "{chk.studentResponse}"
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>
                          <div style={{ background: '#FAF8F5', padding: '0.35rem', borderRadius: '4px' }}>
                            Accuracy: <strong>{chk.rubricScores.conceptualAccuracy}%</strong>
                          </div>
                          <div style={{ background: '#FAF8F5', padding: '0.35rem', borderRadius: '4px' }}>
                            Practical: <strong>{chk.rubricScores.practicalJustification}%</strong>
                          </div>
                          <div style={{ background: '#FAF8F5', padding: '0.35rem', borderRadius: '4px' }}>
                            Clarity: <strong>{chk.rubricScores.absenceOfMisconceptions}%</strong>
                          </div>
                        </div>

                        {chk.remediationRecommendation && (
                          <div style={{ fontSize: '0.75rem', color: chk.remediationNeeded ? '#C53030' : '#1E7E34', marginTop: '0.5rem', fontWeight: 600 }}>
                            📌 Faculty Action: {chk.remediationRecommendation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: RETENTION & SM-2 */}
            {activeTab === 'retention' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
                    SuperMemo-2 (SM-2) Spaced Repetition Queue
                  </span>
                  <span className="tc-badge tc-badge-success" style={{ fontSize: '0.7rem' }}>
                    7-Day Calibration Active
                  </span>
                </div>

                {studentConcepts.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', background: '#FAF8F5', borderRadius: '8px', color: 'var(--tc-muted-text)', fontSize: '0.85rem' }}>
                    All core concepts currently in healthy long-term memory. Next automated Leitner review scheduled in 3 days.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {studentConcepts.map(item => (
                      <div key={item.id} style={{ padding: '0.85rem 1rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--tc-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#171717' }}>{item.concept}</span>
                          <span className={`tc-badge ${item.retentionHealth >= 80 ? 'tc-badge-success' : 'tc-badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                            Retention: {item.retentionHealth}%
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', marginBottom: '0.4rem' }}>
                          Module: {item.module} • SM-2 Interval: <strong>{item.intervalDays} days</strong> • Repetitions: {item.repetitions}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                          <span style={{ color: item.daysOverdue > 0 ? '#C53030' : '#1E7E34', fontWeight: 600 }}>
                            {item.daysOverdue > 0 ? `⚠️ Overdue by ${item.daysOverdue} days` : `Next due: ${item.nextReviewDate}`}
                          </span>
                          <span style={{ color: 'var(--tc-muted-text)' }}>Memory Decay Risk: {item.decayRisk}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: STAGE 4 INTERVIEW & BOUNTIES */}
            {activeTab === 'interview' && (
              <div>
                <div style={{ background: '#FAF8F5', padding: '1rem', borderRadius: '8px', border: '1px solid var(--tc-border)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
                      Stage 4: Faculty Career Interview Verification
                    </span>
                    <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.7rem' }}>
                      Student Platform Sync Key: `zhero_stage4_mentor_review`
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', lineHeight: 1.4, margin: '0.25rem 0 1rem' }}>
                    Conduct human career alignment interviews to validate readiness before placing students into client-funded micro-bounties.
                  </p>

                  {interviewSaved && (
                    <div style={{ padding: '0.5rem', background: '#EAF7EE', color: '#1E7E34', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                      ✓ Mentor review saved and synchronized to Student ecosystem!
                    </div>
                  )}

                  <form onSubmit={handleSaveInterviewReview}>
                    <textarea
                      rows={3}
                      className="tc-input"
                      placeholder="Add interview notes, portfolio evaluation, or mentorship advice..."
                      value={newInterviewNote}
                      onChange={(e) => setNewInterviewNote(e.target.value)}
                      style={{ fontSize: '0.85rem', marginBottom: '0.75rem', width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button type="submit" className="tc-btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                        Save & Sync Review
                      </button>
                    </div>
                  </form>
                </div>

                {/* Real-world project bounties */}
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', marginBottom: '0.5rem' }}>
                  Assigned Project Bounties ({studentBounties.length})
                </div>
                {studentBounties.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', background: '#FAF8F5', borderRadius: '8px', color: 'var(--tc-muted-text)', fontSize: '0.8rem' }}>
                    No micro-bounties currently assigned. Assign from the Project Bounties hub.
                  </div>
                ) : (
                  studentBounties.map(b => (
                    <div key={b.id} style={{ padding: '0.75rem 1rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--tc-border)', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{b.title}</span>
                        <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.7rem' }}>{b.stipend}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', marginTop: '0.2rem' }}>
                        Client: {b.client} • Status: <strong>{b.status}</strong>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Footer Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--tc-border)', paddingTop: '1rem' }}>
              <button onClick={() => setSelectedStudent(null)} className="tc-btn-secondary">
                Close
              </button>
              <button
                onClick={() => {
                  const s = selectedStudent;
                  setSelectedStudent(null);
                  onDirectRecommend(s);
                }}
                className="tc-btn-primary"
              >
                View Course Recommendations →
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
