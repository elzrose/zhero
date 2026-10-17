import React from 'react';
import { Menu, Search } from 'lucide-react';

export function StudentHeader({
  title,
  onOpenMobile,
  onSearchChange,
  searchQuery = ''
}) {
  return (
    <header style={{
      height: '56px',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <h1 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#171717',
          margin: 0,
        }}>
          {title}
        </h1>
      </div>

      {/* Right: Search only if page supports it */}
      {onSearchChange && (
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Search
            size={14}
            style={{ position: 'absolute', left: '10px', color: '#77736F' }}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              padding: '0.4rem 0.75rem 0.4rem 2rem',
              fontSize: '0.85rem',
              border: '1px solid #EAE7E2',
              borderRadius: '8px',
              backgroundColor: '#F8F8F7',
              width: '220px',
              outline: 'none',
              color: '#171717',
            }}
          />
        </div>
      )}
    </header>
  );
}
