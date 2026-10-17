import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
    institution: 'Apex Career Academy',
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
      setError('Enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
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
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'signin' ? 'Sign in' : 'Create account'}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #EAE7E2',
        marginBottom: '1.5rem',
      }}>
        <button
          type="button"
          onClick={() => { setMode('signin'); setError(''); }}
          style={{
            flex: 1,
            padding: '0.5rem',
            background: 'none',
            border: 'none',
            borderBottom: mode === 'signin' ? '2px solid #FE6904' : '2px solid transparent',
            color: mode === 'signin' ? '#FE6904' : '#77736F',
            fontWeight: mode === 'signin' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => { setMode('signup'); setError(''); }}
          style={{
            flex: 1,
            padding: '0.5rem',
            background: 'none',
            border: 'none',
            borderBottom: mode === 'signup' ? '2px solid #FE6904' : '2px solid transparent',
            color: mode === 'signup' ? '#FE6904' : '#77736F',
            fontWeight: mode === 'signup' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Create account
        </button>
      </div>

      {error && (
        <p style={{ color: '#171717', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
          {error}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mode === 'signup' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#171717', marginBottom: '4px' }}>
              Full name
            </label>
            <input
              type="text"
              placeholder="Ananya Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#171717', marginBottom: '4px' }}>
            Email
          </label>
          <input
            type="email"
            placeholder="student@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #EAE7E2',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#171717', marginBottom: '4px' }}>
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
                fontSize: '0.9rem',
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
                padding: 0,
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <>
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
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option>High School</option>
                <option>Undergraduate (1st / 2nd Year)</option>
                <option>Undergraduate (Final Year)</option>
                <option>Postgraduate / Job Seeker</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#171717', marginBottom: '4px' }}>
                Institution
              </label>
              <input
                type="text"
                placeholder="Apex Career Academy"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="btn-primary"
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            marginTop: '0.5rem',
          }}
        >
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      {/* Quiet single text button below the form */}
      <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="link-btn"
          style={{ fontSize: '0.85rem' }}
        >
          Continue as demo student
        </button>
      </div>
    </Modal>
  );
}
