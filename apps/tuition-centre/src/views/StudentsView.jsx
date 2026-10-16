import React, { useState } from 'react';
import { useTuitionStore, storeActions } from '../data/store';
import { Modal } from '../components/Modal';

export function StudentsView({ onDirectRecommend }) {
  const store = useTuitionStore();
  const students = store.students || [];
  
  const [search, setSearch] = useState('');
  const [engagementFilter, setEngagementFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
            Sponsored Student Directory & Retention Monitor
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
            Monitor enrolled learners, attendance rates, module completions, and proactive retention risk indicators.
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
            borderColor: engagementFilter === 'At Risk' ? '#F8B4B4' : 'var(--tc-border)',
            backgroundColor: engagementFilter === 'At Risk' ? '#FDE8E8' : '#FFFFFF',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#C53030', fontWeight: 600 }}>🔴 At Risk (Low Attendance)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#C53030' }}>
            {students.filter(s => s.engagementCategory === 'At Risk').length}
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        backgroundColor: '#FFFFFF',
        padding: '1rem',
        borderRadius: 'var(--tc-radius-lg)',
        border: '1px solid var(--tc-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--tc-muted-text)' }}>Status Filter:</span>
          {['All', 'Healthy', 'Needs Attention', 'At Risk'].map(cat => (
            <button
              key={cat}
              onClick={() => setEngagementFilter(cat)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: engagementFilter === cat ? '#EED180' : 'var(--tc-border)',
                backgroundColor: engagementFilter === cat ? 'var(--tc-yellow-pale)' : '#FFFFFF',
                color: engagementFilter === cat ? '#8C6A05' : 'var(--tc-charcoal)',
                fontWeight: engagementFilter === cat ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ minWidth: '260px' }}>
          <input
            type="text"
            className="tc-input"
            placeholder="Search student ID, name, batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="tc-table-wrapper">
        <table className="tc-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Enrolled Batch & Course</th>
              <th>Target Career</th>
              <th>Readiness</th>
              <th>Attendance</th>
              <th>Progress</th>
              <th>Retention Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--tc-muted-text)' }}>
                  No students found matching your search.
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student.id}>
                  <td style={{ fontWeight: 600, color: 'var(--tc-muted-text)', fontSize: '0.8rem' }}>
                    {student.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#171717' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>{student.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#171717', fontSize: '0.85rem' }}>{student.batchName}</div>
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
                        onClick={() => setSelectedStudent(student)}
                        className="tc-btn-outline"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Profile
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

      {/* Student Detail Modal */}
      {selectedStudent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudent(null)}
          title={`Student File: ${selectedStudent.name} (${selectedStudent.id})`}
          maxWidth="640px"
        >
          <div style={{ fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', padding: '1rem', background: '#FAF8F5', borderRadius: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#171717' }}>{selectedStudent.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', marginTop: '0.2rem' }}>
                  📧 {selectedStudent.email} • 📞 {selectedStudent.phone}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>
                  Enrolled on: {selectedStudent.enrollmentDate} • Cohort: {selectedStudent.batchName}
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

            {/* Performance Indicators */}
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

            {/* Mentor Observations */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Faculty & Mentor Notes:</div>
              <p style={{ color: 'var(--tc-muted-text)', background: '#FAF8F5', padding: '0.75rem', borderRadius: '8px', lineHeight: 1.5 }}>
                {selectedStudent.notes || 'Enrolled in current cohort.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
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
