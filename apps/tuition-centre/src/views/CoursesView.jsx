import React, { useState } from 'react';
import { useTuitionStore, storeActions } from '../data/store';
import { Modal } from '../components/Modal';

export function CoursesView() {
  const store = useTuitionStore();
  const courses = store.courses || [];
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [detailCourse, setDetailCourse] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Software Engineering',
    duration: '16 Weeks (320 Hours)',
    fee: 35000,
    difficulty: 'Intermediate',
    faculty: '',
    skills: '',
    relatedCareers: '',
    prerequisites: '',
    description: '',
    capacity: 30,
    status: 'Active'
  });

  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      c.faculty.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setForm({
      title: '',
      category: 'Software Engineering',
      duration: '16 Weeks (320 Hours)',
      fee: 35000,
      difficulty: 'Intermediate',
      faculty: '',
      skills: 'JavaScript, React, Node.js',
      relatedCareers: 'Full Stack Engineer, Web Developer',
      prerequisites: 'Basic programming concepts',
      description: '',
      capacity: 30,
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setForm({
      ...course,
      skills: Array.isArray(course.skills) ? course.skills.join(', ') : course.skills,
      relatedCareers: Array.isArray(course.relatedCareers) ? course.relatedCareers.join(', ') : course.relatedCareers
    });
    setIsModalOpen(true);
  };

  const handleDelete = (course) => {
    if (window.confirm(`Are you sure you want to delete the course "${course.title}"? Associated batches will also be removed.`)) {
      storeActions.deleteCourse(course.id);
      if (detailCourse?.id === course.id) setDetailCourse(null);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Course title is required.');
      return;
    }

    const payload = {
      ...form,
      fee: Number(form.fee) || 0,
      capacity: Number(form.capacity) || 30,
      skills: typeof form.skills === 'string' ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : form.skills,
      relatedCareers: typeof form.relatedCareers === 'string' ? form.relatedCareers.split(',').map(c => c.trim()).filter(Boolean) : form.relatedCareers
    };

    if (editingCourse) {
      payload.id = editingCourse.id;
      payload.enrolledCount = editingCourse.enrolledCount;
    }

    storeActions.saveCourse(payload);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
            Course Management & Syllabus
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
            Create and maintain your institution's technical courses, syllabus competencies, and faculty assignments.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="tc-btn-primary" style={{ fontSize: '0.875rem' }}>
          + Create New Course
        </button>
      </div>

      {/* Filter and Search Bar */}
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
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: categoryFilter === cat ? '#EED180' : 'var(--tc-border)',
                backgroundColor: categoryFilter === cat ? 'var(--tc-yellow-pale)' : '#FFFFFF',
                color: categoryFilter === cat ? '#8C6A05' : 'var(--tc-charcoal)',
                fontWeight: categoryFilter === cat ? 700 : 500,
                fontSize: '0.8rem',
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
            placeholder="Search courses, skills, faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Courses Table */}
      <div className="tc-table-wrapper">
        <table className="tc-table">
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Fee</th>
              <th>Enrolled / Capacity</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--tc-muted-text)' }}>
                  No courses found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredCourses.map(course => (
                <tr key={course.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#171717' }}>{course.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', marginTop: '0.15rem' }}>
                      Faculty: {course.faculty || 'Unassigned'}
                    </div>
                  </td>
                  <td>
                    <span className="tc-badge tc-badge-neutral">{course.category}</span>
                  </td>
                  <td>{course.duration}</td>
                  <td style={{ fontWeight: 600 }}>₹{course.fee?.toLocaleString('en-IN')}</td>
                  <td>
                    <span style={{
                      fontWeight: 600,
                      color: (course.enrolledCount || 0) >= course.capacity ? '#C53030' : '#171717'
                    }}>
                      {course.enrolledCount || 0} / {course.capacity}
                    </span>
                  </td>
                  <td>
                    <span className={`tc-badge ${course.status === 'Active' ? 'tc-badge-success' : 'tc-badge-warning'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => setDetailCourse(course)}
                        className="tc-btn-outline"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleOpenEdit(course)}
                        className="tc-btn-outline"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course)}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? `Edit Course: ${editingCourse.title}` : 'Create New Course'}
        maxWidth="680px"
      >
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Course Title *
            </label>
            <input
              type="text"
              required
              className="tc-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Applied AI & Deep Learning Systems"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Category
              </label>
              <select
                className="tc-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Artificial Intelligence & Data">Artificial Intelligence & Data</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Analytics & Business">Analytics & Business</option>
                <option value="Information Security">Information Security</option>
                <option value="Design & Product">Design & Product</option>
                <option value="Hardware & IoT">Hardware & IoT</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Duration
              </label>
              <input
                type="text"
                className="tc-input"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 16 Weeks (320 Hours)"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Course Fee (₹)
              </label>
              <input
                type="number"
                className="tc-input"
                value={form.fee}
                onChange={(e) => setForm({ ...form, fee: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Student Capacity
              </label>
              <input
                type="number"
                className="tc-input"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Status
              </label>
              <select
                className="tc-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Faculty / Lead Instructor
            </label>
            <input
              type="text"
              className="tc-input"
              value={form.faculty}
              onChange={(e) => setForm({ ...form, faculty: e.target.value })}
              placeholder="e.g. Dr. Radhika Sen (IIT Madras)"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Skills Taught (comma-separated) *
            </label>
            <input
              type="text"
              required
              className="tc-input"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="e.g. Python, Machine Learning, TensorFlow, Linear Algebra"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Related Career Roles (comma-separated)
            </label>
            <input
              type="text"
              className="tc-input"
              value={form.relatedCareers}
              onChange={(e) => setForm({ ...form, relatedCareers: e.target.value })}
              placeholder="e.g. AI / ML Specialist, Data Scientist"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Prerequisites
            </label>
            <input
              type="text"
              className="tc-input"
              value={form.prerequisites}
              onChange={(e) => setForm({ ...form, prerequisites: e.target.value })}
              placeholder="e.g. Class 12 Mathematics and basic programming"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Course Description
            </label>
            <textarea
              rows="3"
              className="tc-textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Course Detail View Modal */}
      {detailCourse && (
        <Modal
          isOpen={true}
          onClose={() => setDetailCourse(null)}
          title={`Course Details: ${detailCourse.title}`}
          maxWidth="600px"
        >
          <div style={{ fontSize: '0.875rem' }}>
            <p style={{ color: 'var(--tc-muted-text)', marginBottom: '1rem', lineHeight: 1.6 }}>
              {detailCourse.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', padding: '1rem', background: '#FAF8F5', borderRadius: '8px' }}>
              <div><strong>Category:</strong> {detailCourse.category}</div>
              <div><strong>Duration:</strong> {detailCourse.duration}</div>
              <div><strong>Standard Fee:</strong> ₹{detailCourse.fee?.toLocaleString('en-IN')}</div>
              <div><strong>Capacity:</strong> {detailCourse.enrolledCount || 0} / {detailCourse.capacity} Students</div>
              <div><strong>Faculty:</strong> {detailCourse.faculty}</div>
              <div><strong>Status:</strong> {detailCourse.status}</div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Skills Covered:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {detailCourse.skills.map((s, idx) => (
                  <span key={idx} className="tc-badge tc-badge-yellow">{s}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Related Career Paths:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {detailCourse.relatedCareers.map((c, idx) => (
                  <span key={idx} className="tc-badge tc-badge-neutral">💼 {c}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setDetailCourse(null)} className="tc-btn-secondary">
                Close
              </button>
              <button onClick={() => { setDetailCourse(null); handleOpenEdit(detailCourse); }} className="tc-btn-primary">
                Edit Course
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
