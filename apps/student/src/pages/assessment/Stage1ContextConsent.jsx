import React, { useState } from 'react';
import { storageService } from '../../services/storageService';

export function Stage1ContextConsent({ onProceed }) {
  const existingContext = storageService.getStage1Context();

  const [formData, setFormData] = useState({
    educationLevel: existingContext?.educationLevel || 'Undergraduate (2nd Year)',
    stream: existingContext?.stream || 'Computer Science & Engineering',
    enjoyedSubjectsText: (existingContext?.enjoyedSubjects || ['Web Development', 'Problem Solving', 'Visual Design']).join(', '),
    curiousSkillsText: (existingContext?.curiousSkills || ['JavaScript / React', 'UI/UX Prototyping', 'System Design']).join(', '),
    curiousCareersText: (existingContext?.curiousCareers || ['Full Stack Software Engineer', 'UI/UX Product Designer']).join(', '),
    workEnvironment: existingContext?.workEnvironment || 'Balanced collaborative and focused quiet workspaces',
    shortTermAspirations: existingContext?.shortTermAspirations || 'Build a standout portfolio project and land a summer internship',
    longTermAspirations: existingContext?.longTermAspirations || 'Lead creative technology projects that improve education and productivity',
    constraints: existingContext?.constraints || 'Balancing college exam preparation with self-paced learning time',
    concerns: existingContext?.concerns || 'Wondering if I have enough practical project experience compared to senior peers',
    selfDescription: existingContext?.selfDescription || 'I enjoy seeing ideas become working software that real people can use. When I hit a bug, I get stubborn until I figure it out.',
    consentGiven: existingContext?.consentGiven ?? true,
  });

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      setError('Please review and check the privacy agreement to continue.');
      return;
    }

    const payload = {
      educationLevel: formData.educationLevel,
      stream: formData.stream,
      enjoyedSubjects: formData.enjoyedSubjectsText.split(',').map((s) => s.trim()).filter(Boolean),
      curiousSkills: formData.curiousSkillsText.split(',').map((s) => s.trim()).filter(Boolean),
      curiousCareers: formData.curiousCareersText.split(',').map((s) => s.trim()).filter(Boolean),
      workEnvironment: formData.workEnvironment,
      shortTermAspirations: formData.shortTermAspirations,
      longTermAspirations: formData.longTermAspirations,
      constraints: formData.constraints,
      concerns: formData.concerns,
      selfDescription: formData.selfDescription,
      consentGiven: true,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveStage1Context(payload);
    storageService.setAssessmentStage(2);
    onProceed(payload);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', margin: '0 0 0.5rem 0' }}>
          Student context and privacy
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#77736F', margin: 0 }}>
          Share your academic focus and goals to help match career options.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Education Background */}
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#171717', margin: '0 0 1rem 0' }}>
            Academic focus
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#171717', marginBottom: '4px' }}>
                Education level
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
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                }}
              >
                <option>High School (11th / 12th Grade)</option>
                <option>Undergraduate (1st / 2nd Year)</option>
                <option>Undergraduate (Final Year)</option>
                <option>Postgraduate / Job Seeker</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#171717', marginBottom: '4px' }}>
                Major or stream
              </label>
              <input
                type="text"
                value={formData.stream}
                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                placeholder="e.g. Computer Science"
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
        </div>

        {/* Interests & Skills */}
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#171717', margin: '0 0 1rem 0' }}>
            Interests and goals
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#171717', marginBottom: '4px' }}>
                Subjects you enjoy (comma separated)
              </label>
              <input
                type="text"
                value={formData.enjoyedSubjectsText}
                onChange={(e) => setFormData({ ...formData, enjoyedSubjectsText: e.target.value })}
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#171717', marginBottom: '4px' }}>
                Skills you want to learn (comma separated)
              </label>
              <input
                type="text"
                value={formData.curiousSkillsText}
                onChange={(e) => setFormData({ ...formData, curiousSkillsText: e.target.value })}
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#171717', marginBottom: '4px' }}>
                Brief description of your working style
              </label>
              <textarea
                rows={3}
                value={formData.selfDescription}
                onChange={(e) => setFormData({ ...formData, selfDescription: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  fontSize: '0.875rem',
                  outline: 'none',
                  lineHeight: 1.5,
                }}
              />
            </div>
          </div>
        </div>

        {/* Privacy & Consent */}
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#171717', margin: '0 0 0.5rem 0' }}>
            Privacy agreement
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#77736F', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
            We process your responses to provide career recommendations. No personal contact or financial details are shared with external services. You can reset your assessment data at any time.
          </p>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            color: '#171717',
          }}>
            <input
              type="checkbox"
              checked={formData.consentGiven}
              onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: '#FE6904' }}
            />
            <span>I understand and agree to have my responses processed for career exploration.</span>
          </label>
        </div>

        {error && (
          <p style={{ color: '#171717', fontSize: '0.85rem', margin: 0 }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            type="submit"
            className="btn-primary"
            style={{
              padding: '0.75rem 1.75rem',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
