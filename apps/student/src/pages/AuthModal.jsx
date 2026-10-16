import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { Modal } from '../components/Modal';
import { storageService } from '../services/storageService';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    educationLevel: 'Undergraduate (2nd Year)',
    stream: 'Computer Science & Engineering',
    institution: 'Apex Career Academy — Kochi Campus',
  });
  const [error, setError] = useState('');

  const handleDemoLogin = () => {
    const profile = storageService.loginDemoUser();
    onAuthSuccess(profile);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    const newProfile = {
      id: `stu-${Date.now()}`,
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      educationLevel: formData.educationLevel,
      stream: formData.stream,
      institution: formData.institution,
      sponsored: true,
      onboardingCompleted: true,
      isLoggedIn: true,
    };

    const saved = storageService.saveUserProfile(newProfile);
    storageService.logActivity(`Student account verified: ${saved.name}`);
    onAuthSuccess(saved);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'signin' ? 'Sign In to ZHERO' : 'Create Student Account'}>
      {/* Demo Quick Login Callout */}
      <div style={{
        background: '#FFE5CE',
        border: '1px solid #FA9B2A',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#FE6904" />
            <strong style={{ fontSize: '0.875rem', color: '#171717' }}>Hackathon Quick Access</strong>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#FE6904', fontWeight: 700, background: '#FFFFFF', padding: '2px 8px', borderRadius: '9999px' }}>
            Demo Ready
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#77736F', marginBottom: '0.85rem' }}>
          One-click sign in preloaded with Ananya Sharma (2nd Year CS, Apex Academy Sponsored) with sample assessments.
        </p>
        <button
          type="button"
          onClick={handleDemoLogin}
          style={{
            width: '100%',
            backgroundColor: '#FE6904',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(254, 105, 4, 0.25)',
          }}
        >
          ⚡ Continue as Demo Student
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #EAE7E2',
        marginBottom: '1.25rem',
      }}>
        <button
          onClick={() => { setMode('signin'); setError(''); }}
          style={{
            flex: 1,
            padding: '0.65rem',
            background: 'none',
            border: 'none',
            borderBottom: mode === 'signin' ? '2px solid #FE6904' : '2px solid transparent',
            color: mode === 'signin' ? '#FE6904' : '#77736F',
            fontWeight: mode === 'signin' ? 700 : 500,
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Sign In
        </button>
        <button
          onClick={() => { setMode('signup'); setError(''); }}
          style={{
            flex: 1,
            padding: '0.65rem',
            background: 'none',
            border: 'none',
            borderBottom: mode === 'signup' ? '2px solid #FE6904' : '2px solid transparent',
            color: mode === 'signup' ? '#FE6904' : '#77736F',
            fontWeight: mode === 'signup' ? 700 : 500,
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          New Student
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#FFEBEE',
          color: '#C62828',
          padding: '0.6rem 0.85rem',
          borderRadius: '8px',
          fontSize: '0.8rem',
          marginBottom: '1rem',
          border: '1px solid #FFCDD2',
        }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mode === 'signup' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ananya Sharma"
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
        )}

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="student@campus.edu"
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

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem 2.5rem 0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#77736F',
                cursor: 'pointer',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                Education Level
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
                Enrolled Tuition Centre / Institute
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Career Academy"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
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
          </>
        )}

        <button
          type="submit"
          style={{
            backgroundColor: '#171717',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '0.5rem',
          }}
        >
          {mode === 'signin' ? 'Sign In to Dashboard' : 'Complete Registration'}
        </button>
      </form>
    </Modal>
  );
}
