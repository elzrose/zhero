import React from 'react';
import { Sparkles } from 'lucide-react';

export function StudentNavbar({ onOpenAuth, onNavigate, activePage = 'landing' }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #EAE7E2',
      transition: 'all 0.2s ease',
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo and Wordmark */}
        <div
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #FE6904 0%, #FA9B2A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '1.2rem',
            boxShadow: '0 4px 12px rgba(254, 105, 4, 0.28)',
          }}>
            Z
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#171717' }}>
              ZHERO
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.75rem',
          fontSize: '0.9rem',
          fontWeight: 500,
          color: '#77736F',
        }}>
          <button
            onClick={() => onNavigate('landing')}
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'landing' ? '#171717' : '#77736F',
              fontWeight: activePage === 'landing' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            How it works
          </button>
          <button
            onClick={() => onNavigate('careers')}
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'careers' ? '#171717' : '#77736F',
              fontWeight: activePage === 'careers' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Explore Careers
          </button>
          <button
            onClick={() => onNavigate('roadmap')}
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'roadmap' ? '#171717' : '#77736F',
              fontWeight: activePage === 'roadmap' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Learning Roadmap
          </button>
          <button
            onClick={() => onNavigate('resources')}
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'resources' ? '#171717' : '#77736F',
              fontWeight: activePage === 'resources' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Resources
          </button>
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={onOpenAuth}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#171717',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('assessment')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FE6904',
              color: '#FFFFFF',
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.6rem 1.15rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(254, 105, 4, 0.32)',
              transition: 'transform 0.15s ease',
            }}
          >
            <Sparkles size={16} />
            <span>Discover My Path</span>
          </button>
        </div>
      </div>
    </header>
  );
}
