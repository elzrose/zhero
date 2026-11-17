import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Modal } from '../components/Modal';
import { storageService } from '../services/storageService';
import { zheroApi } from '@shared/config';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    educationLevel: 'Undergraduate (2nd Year)',
    stream: 'Computer Science & Engineering',
    institution: 'Apex Career Academy',
  });
  const [error, setError] = useState('');

  const handleDemoLogin = async (role = 'student') => {
    setLoading(true);
    setError('');
    try {
      const email = role === 'admin' ? 'admin@zhero.app' : (role === 'tuition-centre' ? 'tuition@zhero.app' : 'student@zhero.app');
      const password = role === 'admin' ? 'Admin@123' : (role === 'tuition-centre' ? 'Tuition@123' : 'Student@123');
      
      const apiRes = await zheroApi.login(email, password);
      if (apiRes && apiRes.success) {
        const profile = storageService.saveUserProfile({
          id: apiRes.user.id,
          name: apiRes.user.name,
          email: apiRes.user.email,
          role: apiRes.user.role,
          institution: 'Apex Career Academy',
          isLoggedIn: true,
        });
        onAuthSuccess(profile);
        onClose();
        return;
      }
    } catch (err) {
      console.warn('API demo login error, using local fallback:', err);
    } finally {
      setLoading(false);
    }

    // Local fallback
    const profile = storageService.loginDemoUser();
    onAuthSuccess(profile);
    onClose();
  };

  const handleSubmit = async (e) => {
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

    setLoading(true);
    try {
      let apiRes;
      if (mode === 'signin') {
        apiRes = await zheroApi.login(formData.email.trim(), formData.password);
      } else {
        apiRes = await zheroApi.register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: 'student',
        });
      }

      if (apiRes && apiRes.success) {
        const savedProfile = storageService.saveUserProfile({
          id: apiRes.user.id,
          name: apiRes.user.name,
          email: apiRes.user.email,
          role: apiRes.user.role,
          educationLevel: formData.educationLevel,
          stream: formData.stream,
          institution: formData.institution,
          sponsored: true,
          onboardingCompleted: true,
          isLoggedIn: true,
        });
        storageService.logActivity(`Student signed in: ${savedProfile.name}`);
        onAuthSuccess(savedProfile);
        onClose();
        return;
      } else if (apiRes && apiRes.error) {
        setError(apiRes.error);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('API error, using fallback:', err);
    } finally {
      setLoading(false);
    }

    // Fallback local storage
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
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'signin' ? 'Sign in to ZHERO' : 'Create Student Account'}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #EAE7E2',
        marginBottom: '1.25rem',
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

      {/* Quick 1-Click Role Switch Fill */}
      <div style={{
        background: '#FFE5CE',
        border: '1px solid #FA9B2A',
        borderRadius: '8px',
        padding: '0.65rem 0.85rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '6px',
      }}>
        <span style={{ fontSize: '0.785rem', fontWeight: 600, color: '#171717' }}>⚡ 1-Click Demo Login:</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleDemoLogin('student')}
            style={{
              padding: '2px 8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: '#FFFFFF',
              border: '1px solid #FE6904',
              color: '#FE6904',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('tuition-centre')}
            style={{
              padding: '2px 8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: '#FFFFFF',
              border: '1px solid #FA9B2A',
              color: '#171717',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Tuition
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin')}
            style={{
              padding: '2px 8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: '#FFFFFF',
              border: '1px solid #DB5E8C',
              color: '#DB5E8C',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Admin
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '0.5rem 0.75rem',
          background: '#FFEBEE',
          border: '1px solid #EF9A9A',
          color: '#C62828',
          borderRadius: '6px',
          fontSize: '0.825rem',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {mode === 'signup' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, color: '#171717', marginBottom: '4px' }}>
              Full name
            </label>
            <input
              type="text"
              placeholder="Ananya Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, color: '#171717', marginBottom: '4px' }}>
            Email address
          </label>
          <input
            type="email"
            placeholder="student@zhero.app"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid #EAE7E2',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, color: '#171717', marginBottom: '4px' }}>
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
                padding: '0.6rem 2.5rem 0.6rem 0.8rem',
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

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', justifyContent: 'center' }}
        >
          {loading ? 'Authenticating...' : (mode === 'signin' ? 'Sign in' : 'Create student account')}
        </button>
      </form>
    </Modal>
  );
}
