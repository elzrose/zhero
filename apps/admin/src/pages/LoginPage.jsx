import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';

export function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('admin@zhero.app');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        addToast(`Welcome back, ${res.user.name}!`, 'success');
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setErrorMessage('Unexpected connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('admin123');
    setErrorMessage('');
    addToast(`Pre-filled credentials for ${demoRole}`, 'info');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FCEADE',
        padding: '2rem 1.5rem',
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #FAD1C6',
          boxShadow: '0 8px 32px rgba(219, 94, 140, 0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Header Ribbon */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FCEADE 0%, #FFFFFF 100%)',
            padding: '2rem 2rem 1.5rem',
            textAlign: 'center',
            borderBottom: '1px solid #FAD1C6',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #DB5E8C 0%, #F5AFAE 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-coral-glow)',
              marginBottom: '1rem',
            }}
          >
            Z
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em', margin: 0 }}>
            ZHERO Admin Platform
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#77736D', marginTop: '0.35rem' }}>
            Authorized Central Operations & Security Gateway
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {errorMessage && (
            <div
              style={{
                backgroundColor: '#FCEADE',
                border: '1px solid #F5AFAE',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                color: '#DB5E8C',
                fontSize: '0.825rem',
                fontWeight: 500,
                marginBottom: '1.25rem',
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.4rem' }}>
              Admin Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#77736D' }} />
              <input
                type="email"
                required
                className="admin-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="name@zhero.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717' }}>
                Secure Password
              </label>
              <span style={{ fontSize: '0.75rem', color: '#DB5E8C', fontWeight: 500 }}>
                Demo: admin123
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#77736D' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="admin-input"
                style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#77736D',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={ArrowRight}
            iconPosition="right"
            style={{ width: '100%', padding: '0.75rem' }}
          >
            Authenticate & Open Console
          </Button>

          {/* Demo Quick-Fills */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #FAD1C6' }}>
            <span style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#77736D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Hackathon Quick Access Personas
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => fillCredentials('admin@zhero.app', 'Super Admin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  backgroundColor: '#FAD1C6',
                  color: '#DB5E8C',
                  fontSize: '0.785rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>🔑 Super Admin (Maya Pillai)</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>All Access</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('rahul.ops@zhero.app', 'Operations Admin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  backgroundColor: '#FCEADE',
                  color: '#171717',
                  fontSize: '0.785rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>🛡️ Ops Admin (Rahul Varma)</span>
                <span style={{ fontSize: '0.7rem', color: '#77736D' }}>Standard Role</span>
              </button>
            </div>
          </div>
        </form>

        {/* Security Footer Notice */}
        <div
          style={{
            backgroundColor: '#FCEADE',
            padding: '0.85rem 1.5rem',
            borderTop: '1px solid #FAD1C6',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.725rem',
            color: '#77736D',
          }}
        >
          <Shield size={14} color="#DB5E8C" />
          <span>Role-aware authorization enforced on server & client sessions.</span>
        </div>
      </div>
    </div>
  );
}
