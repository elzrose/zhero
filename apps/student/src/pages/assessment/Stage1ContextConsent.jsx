import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, User, Sparkles, AlertCircle } from 'lucide-react';
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
      setError('Please review and check the privacy and AI consent agreement to continue.');
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
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#FE6904',
          letterSpacing: '0.05em',
        }}>
          Stage 1 of 6 • Foundation
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em', margin: '0.35rem 0' }}>
          Student Context & Privacy Consent
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#77736F', margin: 0, lineHeight: 1.5 }}>
          ZHERO uses real AI and human mentoring to understand you as a person. Share what you genuinely enjoy—no test pressure, no right or wrong answers.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Education Background Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717', marginBottom: '1.25rem' }}>
            1. Educational Background & Focus
          </h3>

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
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                }}
              >
                <option>High School (11th / 12th Grade)</option>
                <option>Undergraduate (1st / 2nd Year)</option>
                <option>Undergraduate (Final Year)</option>
                <option>Postgraduate / Early Career</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                Stream / Major / Subjects
              </label>
              <input
                type="text"
                value={formData.stream}
                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                placeholder="e.g. Computer Science, Commerce, Biology, Humanities"
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

        {/* Interests & Preferred Activities */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717', marginBottom: '1.25rem' }}>
            2. Interests, Skills & Work Preferences
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                Subjects or Activities You Genuinely Enjoy (comma separated)
              </label>
              <input
                type="text"
                value={formData.enjoyedSubjectsText}
                onChange={(e) => setFormData({ ...formData, enjoyedSubjectsText: e.target.value })}
                placeholder="e.g. Web Development, Psychology, Creative Writing, Electronics, Robotics"
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
                Skills You Have Practised or Are Curious About
              </label>
              <input
                type="text"
                value={formData.curiousSkillsText}
                onChange={(e) => setFormData({ ...formData, curiousSkillsText: e.target.value })}
                placeholder="e.g. Python, Figma, Public Speaking, Data Analysis, CAD"
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
                Preferred Work Atmosphere
              </label>
              <select
                value={formData.workEnvironment}
                onChange={(e) => setFormData({ ...formData, workEnvironment: e.target.value })}
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
                <option>Balanced collaborative and focused quiet workspaces</option>
                <option>Deep-focus, quiet solo research or coding environment</option>
                <option>Active, dynamic team studio bouncing ideas around</option>
                <option>Hands-on lab, maker-space or field equipment</option>
                <option>Client-facing, consulting, or public-speaking settings</option>
              </select>
            </div>
          </div>
        </div>

        {/* Free Text Self-Reflection & Aspirations */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717', marginBottom: '0.5rem' }}>
            3. Self-Reflection in Your Own Words
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#77736F', marginBottom: '1.25rem' }}>
            What makes you feel excited or fulfilled? What uncertainties or constraints are on your mind?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                Describe What Excites You (Free Text)
              </label>
              <textarea
                rows={3}
                value={formData.selfDescription}
                onChange={(e) => setFormData({ ...formData, selfDescription: e.target.value })}
                placeholder="In your own words, what kinds of activities make you curious enough to keep exploring?"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  fontSize: '0.875rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                  Concerns or Doubts About Choosing a Career (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.concerns}
                  onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
                  placeholder="e.g. Wondering if my math background is strong enough, or job security"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                  Voluntary Constraints (Time, Location, Resources)
                </label>
                <textarea
                  rows={2}
                  value={formData.constraints}
                  onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                  placeholder="e.g. 5 hours a week for self-study, exam preparation schedule"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #EAE7E2',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Clear Consent & Privacy Notice */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #EAE7E2',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(23, 23, 23, 0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#FFE5CE',
              color: '#FE6904',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ShieldCheck size={20} />
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#171717', margin: '0 0 0.35rem' }}>
                Privacy & AI Processing Consent
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#77736F', lineHeight: 1.5, margin: '0 0 0.85rem' }}>
                ZHERO uses Google Gemini to hold a thoughtful career conversation with you. We do <strong>not</strong> send personally identifiable information (such as your phone number, address, or financial data) to the AI service. Your conversation is used exclusively for your career guidance, and you can reset your assessment data at any time in Profile Settings.
              </p>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#171717',
              }}>
                <input
                  type="checkbox"
                  checked={formData.consentGiven}
                  onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#FE6904' }}
                />
                <span>I understand and consent to AI-assisted career exploration with ZHERO.</span>
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FFEBEE',
            color: '#C62828',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #FFCDD2',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FE6904',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: 700,
              padding: '0.85rem 1.75rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(254, 105, 4, 0.3)',
            }}
          >
            <span>Proceed to AI Conversation</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
