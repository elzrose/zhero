import React, { useState } from 'react';
import { useTuitionStore, storeActions } from '../data/store';
import { Modal } from '../components/Modal';

export function CourseCatalog({ onTakeAssessment }) {
  const store = useTuitionStore();
  const courses = store.courses || [];
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Quick Enquiry Form State
  const [isEnquiring, setIsEnquiring] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    notes: ''
  });
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Extract categories
  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      c.relatedCareers.some(r => r.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.email) {
      alert('Please fill in your name and email address.');
      return;
    }

    // Save lead into centre database
    storeActions.saveLead({
      name: enquiryForm.name,
      email: enquiryForm.email,
      phone: enquiryForm.phone || '+91 90000 00000',
      education: enquiryForm.education || 'Prospective Student',
      campaignCode: 'CATALOGUE_PUBLIC',
      status: 'Enquiry',
      assessmentCompleted: false,
      targetCareer: selectedCourse ? selectedCourse.relatedCareers[0] : 'Career Exploration',
      readinessScore: 65,
      strengths: ['Expressed Course Interest'],
      skillGaps: selectedCourse ? selectedCourse.skills.slice(0, 3) : [],
      interestedCourseId: selectedCourse ? selectedCourse.id : null,
      notes: `Public website catalogue enquiry for "${selectedCourse ? selectedCourse.title : 'General'}". ${enquiryForm.notes}`,
      source: 'Public Course Catalogue'
    });

    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setIsEnquiring(false);
      setSelectedCourse(null);
      setEnquiryForm({ name: '', email: '', phone: '', education: '', notes: '' });
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem', minHeight: '80vh' }}>
      {/* Title & Introduction */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="tc-badge tc-badge-yellow" style={{ marginBottom: '0.75rem' }}>
          Public Course Directory
        </span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
          Industry-Aligned Specialization Programs
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--tc-muted-text)', maxWidth: '650px', margin: '0.5rem auto 0' }}>
          Explore our certified coaching programs designed to bridge college theory with modern industry career demands.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        backgroundColor: '#FFFFFF',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--tc-radius-lg)',
        border: '1px solid var(--tc-border)',
        boxShadow: 'var(--tc-shadow-sm)'
      }}>
        {/* Category Pill Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#EED180' : 'var(--tc-border)',
                backgroundColor: selectedCategory === cat ? 'var(--tc-yellow-pale)' : '#FFFFFF',
                color: selectedCategory === cat ? '#8C6A05' : 'var(--tc-charcoal)',
                fontWeight: selectedCategory === cat ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ minWidth: '260px' }}>
          <input
            type="text"
            className="tc-input"
            placeholder="Search by skill, career, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="tc-card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🔍</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.75rem 0 0.25rem' }}>No Courses Found</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)' }}>
            No courses match "{search}" in the selected category. Try resetting your search or filters.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('All'); }}
            className="tc-btn-secondary"
            style={{ marginTop: '1rem' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredCourses.map(course => (
            <div key={course.id} className="tc-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="tc-badge tc-badge-neutral" style={{ fontSize: '0.75rem' }}>
                    {course.category}
                  </span>
                  {course.badge && (
                    <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.7rem' }}>
                      {course.badge}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {course.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--tc-muted-text)', marginBottom: '1.25rem', lineHeight: 1.5, minHeight: '52px' }}>
                  {course.description}
                </p>

                {/* Key Skills */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--tc-subtle-text)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Core Skills Covered:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {course.skills.map((skill, idx) => (
                      <span key={idx} style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        background: '#FAF8F5',
                        border: '1px solid var(--tc-border)',
                        fontSize: '0.75rem',
                        color: 'var(--tc-charcoal)'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meta Information */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: 'var(--tc-muted-text)',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--tc-border)',
                  marginBottom: '1.25rem'
                }}>
                  <div>⏱️ <strong>Duration:</strong> {course.duration}</div>
                  <div>📊 <strong>Level:</strong> {course.difficulty}</div>
                  <div>👨‍🏫 <strong>Lead:</strong> {course.faculty?.split('(')[0]}</div>
                  <div>⭐ <strong>Rating:</strong> {course.rating || '4.9'} / 5.0</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                <button
                  onClick={() => { setSelectedCourse(course); setIsEnquiring(false); }}
                  className="tc-btn-secondary"
                  style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                >
                  View Details
                </button>
                <button
                  onClick={() => { setSelectedCourse(course); setIsEnquiring(true); }}
                  className="tc-btn-primary"
                  style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                >
                  Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Bottom Banner to Take Assessment */}
      <div style={{
        marginTop: '3.5rem',
        padding: '2rem',
        borderRadius: '16px',
        background: 'var(--tc-yellow-gradient)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: 'var(--tc-shadow-yellow)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#171717' }}>
            Unsure which course matches your aptitude?
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#3A3830', marginTop: '0.25rem' }}>
            Take our free 5-minute dynamic AI diagnostic assessment to find your top career fit and tailored roadmap.
          </p>
        </div>
        <button
          onClick={onTakeAssessment}
          style={{
            backgroundColor: '#171717',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Start Diagnostic Assessment →
        </button>
      </div>

      {/* Course Detail / Enquiry Modal */}
      {selectedCourse && (
        <Modal
          isOpen={true}
          onClose={() => { setSelectedCourse(null); setIsEnquiring(false); }}
          title={isEnquiring ? `Course Enquiry: ${selectedCourse.title}` : selectedCourse.title}
          maxWidth="640px"
        >
          {isEnquiring ? (
            enquirySuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <span style={{ fontSize: '3rem' }}>🎉</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E7E34', marginTop: '0.75rem' }}>
                  Enquiry Submitted Successfully!
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--tc-muted-text)', marginTop: '0.5rem' }}>
                  The admissions counselor at Apex Career Academy will reach out with the detailed syllabus, scholarship details, and upcoming batch schedule.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit}>
                <p style={{ fontSize: '0.85rem', color: 'var(--tc-muted-text)', marginBottom: '1.25rem' }}>
                  Please share your contact details. Our academic advisors will send you the detailed curriculum and scholarship eligibility criteria.
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="tc-input"
                    placeholder="e.g. Ananya Sharma"
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
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
                      placeholder="e.g. ananya@example.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Mobile / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      className="tc-input"
                      placeholder="e.g. +91 98470 12345"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Current Education / College / School
                  </label>
                  <input
                    type="text"
                    className="tc-input"
                    placeholder="e.g. B.Tech 3rd Year / Plus Two CS"
                    value={enquiryForm.education}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, education: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Questions / Preferred Batch Timing
                  </label>
                  <textarea
                    rows="3"
                    className="tc-textarea"
                    placeholder="e.g. Interested in weekend batch, want to know about placement support..."
                    value={enquiryForm.notes}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsEnquiring(false)}
                    className="tc-btn-secondary"
                  >
                    Back to Details
                  </button>
                  <button
                    type="submit"
                    className="tc-btn-primary"
                  >
                    Submit Course Enquiry →
                  </button>
                </div>
              </form>
            )
          ) : (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <span className="tc-badge tc-badge-yellow" style={{ marginBottom: '0.5rem' }}>
                  {selectedCourse.category}
                </span>
                <p style={{ fontSize: '0.95rem', color: '#171717', lineHeight: 1.6, marginTop: '0.5rem' }}>
                  {selectedCourse.description}
                </p>
              </div>

              <div style={{ backgroundColor: '#FAF8F5', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid var(--tc-border)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', marginBottom: '0.5rem' }}>
                  Target Career Profiles:
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedCourse.relatedCareers.map((car, idx) => (
                    <span key={idx} className="tc-badge tc-badge-yellow" style={{ fontSize: '0.75rem' }}>
                      💼 {car}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', marginBottom: '0.4rem' }}>
                  Prerequisites & Eligibility:
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--tc-muted-text)' }}>
                  {selectedCourse.prerequisites}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div><strong>Duration:</strong> {selectedCourse.duration}</div>
                <div><strong>Lead Instructor:</strong> {selectedCourse.faculty}</div>
                <div><strong>Standard Fee:</strong> ₹{selectedCourse.fee?.toLocaleString('en-IN')}</div>
                <div><strong>Batch Availability:</strong> Active Cohorts Enrolling</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="tc-btn-secondary"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setIsEnquiring(true)}
                  className="tc-btn-primary"
                >
                  Enquire for this Course →
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
