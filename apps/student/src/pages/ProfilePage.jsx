import React, { useState } from 'react';
import { Modal } from '../components/Modal';

export function ProfilePage({
  userProfile,
  onUpdateProfile,
  onResetAllData,
  onLogout
}) {
  const [formData, setFormData] = useState({
    name: userProfile?.name || 'Ananya Sharma',
    email: userProfile?.email || 'ananya.sharma@campus.edu',
    educationLevel: userProfile?.educationLevel || 'Undergraduate (2nd Year)',
    stream: userProfile?.stream || 'Computer Science & Engineering',
    institution: userProfile?.institution || 'Apex Career Academy — Kochi Campus',
  });
  const [isResetAllModal, setIsResetAllModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
  };

  return (
    <div className="page" style={{ maxWidth: '720px' }}>
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="btn-secondary"
            style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            Sign out
          </button>
        )}
      </div>

      {/* Form */}
      <div className="section" style={{ marginBottom: '2.5rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                Full name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                Education level
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              >
                <option>High School (11th / 12th Grade)</option>
                <option>Undergraduate (1st / 2nd Year)</option>
                <option>Undergraduate (Final Year)</option>
                <option>Postgraduate / Job Seeker</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                Stream
              </label>
              <input
                type="text"
                value={formData.stream}
                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
              Institution
            </label>
            <input
              type="text"
              readOnly
              value={formData.institution}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
                backgroundColor: '#F8F8F7',
                color: '#77736F',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '0.85rem' }}
            >
              Save changes
            </button>
          </div>
        </form>
      </div>

      {/* Reset data */}
      <div className="section" style={{ paddingTop: '1.5rem', borderTop: '1px solid #EAE7E2' }}>
        <h2 className="section-title">Reset data</h2>
        <p style={{ fontSize: '0.85rem', color: '#77736F', margin: '0 0 1rem 0' }}>
          Clear all saved careers, progress, and assessment data.
        </p>

        <button
          type="button"
          onClick={() => setIsResetAllModal(true)}
          className="btn-secondary"
          style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
        >
          Reset data
        </button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isResetAllModal}
        onClose={() => setIsResetAllModal(false)}
        title="Reset data?"
      >
        <p style={{ fontSize: '0.9rem', color: '#77736F', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
          This will clear saved careers, roadmap progress, and assessment answers.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsResetAllModal(false)}
            className="btn-secondary"
            style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onResetAllData();
              setIsResetAllModal(false);
            }}
            className="btn-primary"
            style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            Reset
          </button>
        </div>
      </Modal>
    </div>
  );
}
