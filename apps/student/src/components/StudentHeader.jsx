import React from 'react';
import { Menu, Search, Sparkles, Building } from 'lucide-react';

export function StudentHeader({
  title,
  subtitle,
  onOpenMobile,
  onSearchChange,
  searchQuery = '',
  onNavigate
}) {
  return (
    <header style={{
      height: '70px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #EAE7E2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onOpenMobile}
          className="mobile-only-btn"
          style={{
            background: 'none',
            border: 'none',
            color: '#171717',
            cursor: 'pointer',
            padding: '6px',
            display: 'none',
          }}
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#171717',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.75rem', color: '#77736F', margin: 0, marginTop: '2px' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Search, Sponsored Pill, Branch Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {onSearchChange && (
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '10px', color: '#77736F' }}
            />
            <input
              type="text"
              placeholder="Search careers, skills, resources..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem 0.45rem 2rem',
                fontSize: '0.8rem',
                border: '1px solid #EAE7E2',
                borderRadius: '8px',
                backgroundColor: '#F8F8F7',
                width: '240px',
                outline: 'none',
                color: '#171717',
              }}
            />
          </div>
        )}

        {/* Sponsor Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '9999px',
          background: '#FFE5CE',
          color: '#FE6904',
          fontSize: '0.75rem',
          fontWeight: 700,
        }}>
          <Building size={13} />
          <span>Apex Academy Sponsored</span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onNavigate('assessment')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            backgroundColor: '#FE6904',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(254, 105, 4, 0.25)',
          }}
        >
          <Sparkles size={14} />
          <span>Retake Quiz</span>
        </button>
      </div>
    </header>
  );
}
