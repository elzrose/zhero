import React from 'react';

export function Navbar({ currentView, setCurrentView, isAuthenticated, onLogout }) {
  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--tc-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--tc-shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo & Identity */}
        <div 
          onClick={() => setCurrentView('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--tc-yellow-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#171717',
            boxShadow: 'var(--tc-shadow-yellow)'
          }}>
            Z
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
                ZHERO
              </span>
              <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.7rem' }}>
                Tuition Centre Platform
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', margin: 0 }}>
              Institutional Career Guidance & Student Acquisition
            </p>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentView('landing')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              background: currentView === 'landing' ? 'var(--tc-yellow-cream)' : 'transparent',
              color: currentView === 'landing' ? '#8C6A05' : 'var(--tc-charcoal)',
              fontWeight: currentView === 'landing' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Product Overview
          </button>

          <button
            onClick={() => setCurrentView('catalog')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              background: currentView === 'catalog' ? 'var(--tc-yellow-cream)' : 'transparent',
              color: currentView === 'catalog' ? '#8C6A05' : 'var(--tc-charcoal)',
              fontWeight: currentView === 'catalog' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Course Catalogue
          </button>

          <button
            onClick={() => setCurrentView('assessment')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #EED180',
              background: currentView === 'assessment' ? '#FDF1C8' : '#FEFDF5',
              color: '#8C6A05',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>🎯</span> Student Career Assessment
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => setCurrentView('dashboard')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: currentView === 'dashboard' ? 'var(--tc-yellow-cream)' : 'transparent',
                color: currentView === 'dashboard' ? '#8C6A05' : 'var(--tc-charcoal)',
                fontWeight: currentView === 'dashboard' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Centre Workspace
            </button>
          ) : null}
        </nav>

        {/* Right Action / Auth Button & Cross-App Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717' }}>
                  Apex Career Academy
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)' }}>
                  Growth Partner (Port 3002)
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="tc-btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('auth')}
              className="tc-btn-primary"
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
            >
              Centre Demo Sign In →
            </button>
          )}

          {/* Hackathon Cross-Portal Switcher Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.5rem',
            background: '#F5F4F0',
            borderRadius: '6px',
            fontSize: '0.7rem',
            color: 'var(--tc-muted-text)'
          }}>
            <span>Ports:</span>
            <a href="http://localhost:3001" title="Student Platform" style={{ color: '#171717', textDecoration: 'none', fontWeight: 600 }}>3001</a>
            <span>•</span>
            <span style={{ color: '#8C6A05', fontWeight: 700 }}>3002</span>
            <span>•</span>
            <a href="http://localhost:3003" title="Admin Ops" style={{ color: '#171717', textDecoration: 'none', fontWeight: 600 }}>3003</a>
          </div>
        </div>
      </div>
    </header>
  );
}
