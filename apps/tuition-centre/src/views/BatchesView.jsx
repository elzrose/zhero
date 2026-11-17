import React, { useState } from 'react';
import { useTuitionStore, storeActions } from '../data/store';
import { Modal } from '../components/Modal';

export function BatchesView() {
  const store = useTuitionStore();
  const batches = store.batches || [];
  const courses = store.courses || [];

  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  const [form, setForm] = useState({
    courseId: courses[0]?.id || '',
    name: '',
    schedule: 'Mon, Wed, Fri (6:00 PM – 8:30 PM)',
    startDate: '',
    endDate: '',
    capacity: 25,
    room: 'Lab 1 & Hybrid',
    faculty: '',
    status: 'In Progress'
  });

  const filteredBatches = batches.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.courseTitle?.toLowerCase().includes(search.toLowerCase()) ||
      b.faculty?.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === 'All' || b.courseId === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const handleOpenCreate = () => {
    setEditingBatch(null);
    setForm({
      courseId: courses[0]?.id || '',
      name: '',
      schedule: 'Sat & Sun (9:30 AM – 1:30 PM)',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      capacity: 25,
      room: 'Kakkanad Campus Room 3',
      faculty: courses[0]?.faculty || '',
      status: 'Upcoming'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (batch) => {
    setEditingBatch(batch);
    setForm({ ...batch });
    setIsModalOpen(true);
  };

  const handleDelete = (batch) => {
    if (window.confirm(`Are you sure you want to deactivate or remove batch "${batch.name}"?`)) {
      storeActions.deleteBatch(batch.id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.courseId) {
      alert('Batch name and associated course are required.');
      return;
    }

    const payload = {
      ...form,
      capacity: Number(form.capacity) || 25
    };

    if (editingBatch) {
      payload.id = editingBatch.id;
      payload.enrolledCount = editingBatch.enrolledCount;
    }

    storeActions.saveBatch(payload);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
            Batch Scheduling & Capacity Management
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
            Organize student cohorts across weekday, weekend, and hybrid schedules with capacity tracking.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="tc-btn-primary" style={{ fontSize: '0.875rem' }}>
          + Add New Batch
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.75rem',
        backgroundColor: '#FFFFFF',
        padding: '1rem',
        borderRadius: 'var(--tc-radius-lg)',
        border: '1px solid var(--tc-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--tc-muted-text)' }}>Course Filter:</span>
          <select
            className="tc-select"
            style={{ width: 'auto', minWidth: '220px' }}
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="All">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: '260px' }}>
          <input
            type="text"
            className="tc-input"
            placeholder="Search batches, schedules, rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Batches Table */}
      <div className="tc-table-wrapper">
        <table className="tc-table">
          <thead>
            <tr>
              <th>Batch Name</th>
              <th>Parent Course</th>
              <th>Schedule</th>
              <th>Dates</th>
              <th>Seat Utilization</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--tc-muted-text)' }}>
                  No batches found for the selected criteria.
                </td>
              </tr>
            ) : (
              filteredBatches.map(batch => {
                const isFull = (batch.enrolledCount || 0) >= batch.capacity;
                const pct = Math.round(((batch.enrolledCount || 0) / batch.capacity) * 100);
                return (
                  <tr key={batch.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#171717' }}>{batch.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>
                        📍 {batch.room} • Faculty: {batch.faculty || 'Assigned'}
                      </div>
                    </td>
                    <td>
                      <span className="tc-badge tc-badge-yellow">{batch.courseTitle}</span>
                    </td>
                    <td>{batch.schedule}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>
                      {batch.startDate} → {batch.endDate || 'Ongoing'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '80px', height: '6px', background: '#EAE5D8', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: isFull ? '#C53030' : (pct > 80 ? 'var(--tc-primary-yellow)' : '#1E7E34')
                          }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isFull ? '#C53030' : '#171717' }}>
                          {batch.enrolledCount || 0}/{batch.capacity}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`tc-badge ${batch.status === 'In Progress' ? 'tc-badge-success' : 'tc-badge-neutral'}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenEdit(batch)}
                          className="tc-btn-outline"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(batch)}
                          style={{
                            background: 'none',
                            border: '1px solid #F8B4B4',
                            color: '#C53030',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Batch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBatch ? `Edit Batch: ${editingBatch.name}` : 'Create New Batch'}
        maxWidth="600px"
      >
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Associated Course *
            </label>
            <select
              className="tc-select"
              required
              value={form.courseId}
              onChange={(e) => {
                const crs = courses.find(c => c.id === e.target.value);
                setForm({ ...form, courseId: e.target.value, faculty: crs ? crs.faculty : form.faculty });
              }}
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title} ({c.duration})</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Batch Name *
            </label>
            <input
              type="text"
              required
              className="tc-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. AI/ML Cohort Beta (Weekend)"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Schedule & Timing
            </label>
            <input
              type="text"
              required
              className="tc-input"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              placeholder="e.g. Mon, Wed, Fri (6:00 PM – 8:30 PM)"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Start Date
              </label>
              <input
                type="date"
                required
                className="tc-input"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                End Date (Planned)
              </label>
              <input
                type="date"
                className="tc-input"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Seat Capacity *
              </label>
              <input
                type="number"
                required
                min="5"
                max="100"
                className="tc-input"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Batch Status
              </label>
              <select
                className="tc-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Classroom / Lab Location
              </label>
              <input
                type="text"
                className="tc-input"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                placeholder="e.g. Lab 2 (Kakkanad)"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Faculty Lead
              </label>
              <input
                type="text"
                className="tc-input"
                value={form.faculty}
                onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                placeholder="e.g. Dr. Radhika Sen"
              />
            </div>
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
              {editingBatch ? 'Save Batch' : 'Create Batch'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
