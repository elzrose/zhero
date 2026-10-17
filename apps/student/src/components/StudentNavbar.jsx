import React from 'react';

export function StudentNavbar({ onOpenAuth, onNavigate, activePage = 'landing' }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #EAE7E2',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: '#FE6904',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '1rem',
          }}>
            Z
          </div>
          <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#171717' }}>
            ZHERO
          </span>
        </div>

        {/* Navigation Links: Careers, Roadmap, Resources */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          <button
            onClick={() => onNavigate('careers')}
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'careers' ? '#171717' : '#77736F',
              fontWeight: activePage === 'careers' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: 0,
            }}
          >
            Careers
          </button>
          <button
            onClick={() => onNavigate('roadmap')}
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'roadmap' ? '#171717' : '#77736F',
              fontWeight: activePage === 'roadmap' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: 0,
            }}
          >
            Roadmap
          </button>
          <button
            onClick={() => onNavigate('resources')}
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'resources' ? '#171717' : '#77736F',
              fontWeight: activePage === 'resources' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: 0,
            }}
          >
            Resources
          </button>
        </nav>

        {/* Action Controls: Sign in & Get started */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onOpenAuth}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#171717',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Sign in
          </button>
          <button
            onClick={() => onNavigate('assessment')}
            className="btn-primary"
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '0.5rem 1rem',
            }}
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
