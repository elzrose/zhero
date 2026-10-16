import React, { useState } from 'react';

export function AuthView({ onLoginSuccess, onCancel }) {
  const [email, setEmail] = useState('director@apexacademy.edu.in');
  const [password, setPassword] = useState('demo-apex-2026');
  const [role, setRole] = useState('TUITION_ADMIN');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid institutional email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email,
        role,
        centreName: 'Apex Career & Coaching Academy',
        token: `demo-jwt-token-${Date.now()}`
      });
    }, 600);
  };

  const handleQuickLogin = (presetRole, presetEmail) => {
    setEmail(presetEmail);
    setPassword('demo-apex-2026');
    setRole(presetRole);
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '4rem auto',
      padding: '1.5rem',
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div className="tc-card" style={{ padding: '2.5rem', boxShadow: 'var(--tc-shadow-lg)' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'var(--tc-yellow-gradient)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#171717',
            boxShadow: 'var(--tc-shadow-yellow)',
            marginBottom: '0.75rem'
          }}>
            Z
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
            Tuition Centre Workspace
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
            Sign in to manage student batches, career assessments & admissions.
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div style={{
          backgroundColor: '#FFFDF5',
          border: '1px solid #EED180',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.775rem',
          color: '#8C6A05',
          marginBottom: '1.5rem',
          lineHeight: 1.5
        }}>
          <strong>Demo Access Mode:</strong> Pre-filled with Apex Academy institutional credentials. No live external backend credentials required.
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FDE8E8',
            border: '1px solid #F8B4B4',
            color: '#C53030',
            padding: '0.625rem 0.85rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Institutional Email
            </label>
            <input
              type="email"
              required
              className="tc-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. director@apexacademy.edu.in"
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Password
            </label>
            <input
              type="password"
              required
              className="tc-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Operational Role
            </label>
            <select
              className="tc-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="TUITION_ADMIN">Tuition Centre Director / Admin</option>
              <option value="ACADEMIC_COUNSELOR">Admissions Counselor / Advisor</option>
              <option value="FACULTY_LEAD">Faculty & Course Lead</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="tc-btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', marginBottom: '1rem' }}
          >
            {isLoading ? 'Verifying Session...' : 'Enter Centre Workspace →'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="tc-btn-secondary"
            style={{ width: '100%', padding: '0.625rem', fontSize: '0.85rem' }}
          >
            Return to Landing Page
          </button>
        </form>

        {/* 1-Click Quick Demo Presets */}
        <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--tc-border)', paddingTop: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--tc-muted-text)', marginBottom: '0.5rem', textAlign: 'center' }}>
            One-Click Demo Roles:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('TUITION_ADMIN', 'director@apexacademy.edu.in')}
              style={{
                flex: 1,
                padding: '0.4rem',
                borderRadius: '6px',
                border: '1px solid var(--tc-border)',
                background: '#FAF8F5',
                fontSize: '0.75rem',
                cursor: 'pointer',
                color: 'var(--tc-charcoal)'
              }}
            >
              Director Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ACADEMIC_COUNSELOR', 'counseling@apexacademy.edu.in')}
              style={{
                flex: 1,
                padding: '0.4rem',
                borderRadius: '6px',
                border: '1px solid var(--tc-border)',
                background: '#FAF8F5',
                fontSize: '0.75rem',
                cursor: 'pointer',
                color: 'var(--tc-charcoal)'
              }}
            >
              Counselor Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
