import React, { useState } from 'react';
import { useTuitionStore, storeActions } from '../data/store';
import { Modal } from '../components/Modal';

export function EnrollmentsView({ prefilledCandidate }) {
  const store = useTuitionStore();
  const enrollments = store.enrollments || [];
  const courses = store.courses || [];
  const batches = store.batches || [];

  const [isModalOpen, setIsModalOpen] = useState(!!prefilledCandidate);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    studentName: prefilledCandidate?.name || '',
    studentEmail: prefilledCandidate?.email || '',
    studentPhone: prefilledCandidate?.phone || '',
    courseId: prefilledCandidate?.interestedCourseId || (courses[0]?.id || ''),
    batchId: '',
    feePaid: courses[0]?.fee || 35000,
    sponsorship: 'Centre Sponsored (Merit)',
    notes: 'Direct admission from counseling qualification'
  });

  // Filter batches matching currently selected course
  const availableBatches = batches.filter(b => b.courseId === form.courseId);

  // Auto-select first batch when course changes
  const handleCourseChange = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    const validBatches = batches.filter(b => b.courseId === courseId);
    setForm({
      ...form,
      courseId,
      batchId: validBatches[0]?.id || '',
      feePaid: course ? course.fee : form.feePaid
    });
  };

  const handleOpenCreate = () => {
    const firstCourse = courses[0];
    const validBatches = batches.filter(b => b.courseId === firstCourse?.id);
    setForm({
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      courseId: firstCourse?.id || '',
      batchId: validBatches[0]?.id || '',
      feePaid: firstCourse?.fee || 35000,
      sponsorship: 'Tuition Centre Sponsored Cohort',
      notes: ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.studentName.trim() || !form.studentEmail.trim()) {
      setError('Student name and email are required.');
      return;
    }

    if (!form.courseId) {
      setError('Please select a course.');
      return;
    }

    if (!form.batchId) {
      setError('Please select an active batch for this course.');
      return;
    }

    try {
      storeActions.createEnrollment(form);
      setIsModalOpen(false);
      alert(`Student "${form.studentName}" has been successfully admitted and enrolled!`);
    } catch (err) {
      setError(err.message || 'Failed to process enrollment.');
    }
  };

  const filteredEnrollments = enrollments.filter(e => {
    return e.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      e.courseTitle?.toLowerCase().includes(search.toLowerCase()) ||
      e.batchName?.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
            Admissions & Student Enrollments
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
            Process student registrations, link learners to course batches, and verify seat capacities.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="tc-btn-primary" style={{ fontSize: '0.875rem' }}>
          + New Student Admission
        </button>
      </div>

      {/* Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        backgroundColor: '#FFFFFF',
        padding: '1rem',
        borderRadius: 'var(--tc-radius-lg)',
        border: '1px solid var(--tc-border)'
      }}>
        <div style={{ minWidth: '300px' }}>
          <input
            type="text"
            className="tc-input"
            placeholder="Search admissions by student, course, batch ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--tc-muted-text)', fontWeight: 600 }}>
          Total Admissions: <strong style={{ color: '#171717' }}>{enrollments.length}</strong>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="tc-table-wrapper">
        <table className="tc-table">
          <thead>
            <tr>
              <th>Enrollment ID</th>
              <th>Student Name</th>
              <th>Enrolled Course</th>
              <th>Assigned Batch</th>
              <th>Date</th>
              <th>Fee Status</th>
              <th>Sponsorship Tier</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--tc-muted-text)' }}>
                  No enrollment records found.
                </td>
              </tr>
            ) : (
              filteredEnrollments.map(enr => (
                <tr key={enr.id}>
                  <td style={{ fontWeight: 600, color: 'var(--tc-muted-text)', fontSize: '0.8rem' }}>
                    {enr.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#171717' }}>{enr.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>ID: {enr.studentId}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#171717', fontSize: '0.85rem' }}>{enr.courseTitle}</div>
                  </td>
                  <td>
                    <span className="tc-badge tc-badge-yellow">{enr.batchName}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{enr.enrolledAt}</td>
                  <td>
                    <span className={`tc-badge ${enr.feeStatus === 'Paid' ? 'tc-badge-success' : 'tc-badge-warning'}`}>
                      {enr.feeStatus} (₹{enr.feePaid?.toLocaleString('en-IN')})
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--tc-charcoal)' }}>
                    {enr.sponsorship}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Admission / Enrollment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Student Admission & Batch Allocation"
        maxWidth="620px"
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: '#FDE8E8',
              border: '1px solid #F8B4B4',
              color: '#C53030',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Student Full Name *
            </label>
            <input
              type="text"
              required
              className="tc-input"
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              placeholder="e.g. Fathima Zahra"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                className="tc-input"
                value={form.studentEmail}
                onChange={(e) => setForm({ ...form, studentEmail: e.target.value })}
                placeholder="e.g. fathima@example.com"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                WhatsApp / Contact Number
              </label>
              <input
                type="tel"
                className="tc-input"
                value={form.studentPhone}
                onChange={(e) => setForm({ ...form, studentPhone: e.target.value })}
                placeholder="e.g. +91 94960 99881"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Select Course *
            </label>
            <select
              className="tc-select"
              required
              value={form.courseId}
              onChange={(e) => handleCourseChange(e.target.value)}
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title} — ₹{c.fee?.toLocaleString('en-IN')}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Assign to Batch (Filtered for selected course) *
            </label>
            {availableBatches.length === 0 ? (
              <div style={{ padding: '0.5rem', background: '#FDE8E8', color: '#C53030', fontSize: '0.8rem', borderRadius: '6px' }}>
                No active batches found for this course. Please create a batch first in Batches tab.
              </div>
            ) : (
              <select
                className="tc-select"
                required
                value={form.batchId}
                onChange={(e) => setForm({ ...form, batchId: e.target.value })}
              >
                <option value="">Select an active batch...</option>
                {availableBatches.map(b => (
                  <option key={b.id} value={b.id} disabled={(b.enrolledCount || 0) >= b.capacity}>
                    {b.name} ({b.enrolledCount || 0}/{b.capacity} seats) — {b.schedule} {(b.enrolledCount || 0) >= b.capacity ? '[FULL]' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Fee Paid (₹)
              </label>
              <input
                type="number"
                className="tc-input"
                value={form.feePaid}
                onChange={(e) => setForm({ ...form, feePaid: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Sponsorship / Scholarship Tier
              </label>
              <select
                className="tc-select"
                value={form.sponsorship}
                onChange={(e) => setForm({ ...form, sponsorship: e.target.value })}
              >
                <option value="Tuition Centre Sponsored Cohort">Tuition Centre Sponsored Cohort</option>
                <option value="Zhero Full Merit Scholarship (100%)">Zhero Full Merit Scholarship (100%)</option>
                <option value="STEM Women Scholarship (50%)">STEM Women Scholarship (50%)</option>
                <option value="Standard Student Direct Plan">Standard Student Direct Plan</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Admission Notes / Counselor Remarks
            </label>
            <textarea
              rows="2"
              className="tc-textarea"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="e.g. Scored 88% in Mission 2026 assessment. Approved for weekend intensive cohort..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="tc-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="tc-btn-primary">
              Confirm & Issue Admission →
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
