import React, { useState } from 'react';
import { Building, RotateCcw, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Modal } from '../components/Modal';

export function ProfilePage({
  userProfile,
  onUpdateProfile,
  onResetAssessment,
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
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isResetAssessmentModal, setIsResetAssessmentModal] = useState(false);
  const [isResetAllModal, setIsResetAllModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '850px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em', margin: 0 }}>
          Student Profile & Settings
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#77736F', marginTop: '0.35rem' }}>
          Manage your personal details, academic background, and local demo preferences.
        </p>
      </div>

      {isSavedNotice && (
        <div style={{
          backgroundColor: '#E8F5E9',
          color: '#2E7D32',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #C8E6C9',
        }}>
          <CheckCircle2 size={16} />
          <span>Profile changes successfully saved!</span>
        </div>
      )}

      {/* Sponsoring Centre Verification Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #FA9B2A',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F4 100%)',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 2px 10px rgba(254, 105, 4, 0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: '#FFE5CE',
            color: '#FE6904',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Building size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#77736F', fontWeight: 700, textTransform: 'uppercase' }}>
              Institutional Sponsorship
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717' }}>
              {formData.institution}
            </div>
          </div>
        </div>

        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '9999px',
          background: '#FFE5CE',
          color: '#FE6904',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <ShieldCheck size={14} />
          <span>Active Tuition Sponsorship</span>
        </span>
      </div>

      {/* Edit Form */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', marginBottom: '1.5rem' }}>
          Personal & Academic Information
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                Current Education Level
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
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
                Stream / Major
              </label>
              <input
                type="text"
                value={formData.stream}
                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
          >
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* Danger Zone / Demo Controls */}
      <div className="card" style={{ padding: '2rem', border: '1px solid #FFCDD2' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#C62828', marginBottom: '0.5rem' }}>
          Session & Demo Controls
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#77736F', marginBottom: '1.5rem' }}>
          Manage your local demo assessment state or reset the student environment.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsResetAssessmentModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              color: '#171717',
              border: '1px solid #EAE7E2',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={16} color="#FE6904" />
            <span>Reset Assessment Answers</span>
          </button>

          <button
            type="button"
            onClick={() => setIsResetAllModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#FFEBEE',
              color: '#C62828',
              border: '1px solid #FFCDD2',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={16} />
            <span>Reset All Demo Data</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            style={{
              marginLeft: 'auto',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: '#171717',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Reset Assessment Confirmation Modal */}
      <Modal
        isOpen={isResetAssessmentModal}
        onClose={() => setIsResetAssessmentModal(false)}
        title="Confirm Assessment Reset"
      >
        <p style={{ fontSize: '0.9rem', color: '#77736F', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Are you sure you want to reset your career assessment? Your current answers and top-5 recommendations will be cleared, and you can retake the quiz from question 1.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={() => setIsResetAssessmentModal(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onResetAssessment();
              setIsResetAssessmentModal(false);
            }}
            style={{
              backgroundColor: '#FE6904',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.25rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Yes, Reset
          </button>
        </div>
      </Modal>

      {/* Reset All Confirmation Modal */}
      <Modal
        isOpen={isResetAllModal}
        onClose={() => setIsResetAllModal(false)}
        title="Reset Entire Demo State"
      >
        <p style={{ fontSize: '0.9rem', color: '#77736F', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          This will wipe all locally stored assessment results, bookmarked careers, roadmap checkmarks, and custom milestones.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={() => setIsResetAllModal(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onResetAllData();
              setIsResetAllModal(false);
            }}
            style={{
              backgroundColor: '#C62828',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.25rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Wipe & Reload Demo
          </button>
        </div>
      </Modal>
    </div>
  );
}
