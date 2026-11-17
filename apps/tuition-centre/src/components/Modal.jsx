import React from 'react';

export function Modal({ isOpen, onClose, title, children, maxWidth = '600px' }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(23, 23, 23, 0.45)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--tc-radius-lg)',
        border: '1px solid var(--tc-border)',
        boxShadow: 'var(--tc-shadow-lg)',
        width: '100%',
        maxWidth,
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--tc-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 10
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: 'var(--tc-muted-text)',
              padding: '0.25rem 0.5rem',
              borderRadius: '6px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function StatCard({ title, value, subtext, trend, tag, highlight = false, icon }) {
  return (
    <div className="tc-card" style={{
      background: highlight ? 'var(--tc-card-gradient)' : '#FFFFFF',
      border: highlight ? '1px solid #EED180' : '1px solid var(--tc-border)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {highlight && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'var(--tc-yellow-gradient)'
        }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', fontWeight: 600 }}>
          {title}
        </span>
        {icon && <span style={{ fontSize: '1.1rem' }}>{icon}</span>}
      </div>
      
      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em', margin: '0.25rem 0' }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
        {subtext && (
          <span style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>
            {subtext}
          </span>
        )}
        {trend && (
          <span style={{ fontSize: '0.75rem', color: '#1E7E34', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
            ↑ {trend}
          </span>
        )}
        {tag && (
          <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.7rem' }}>
            {tag}
          </span>
        )}
      </div>
    </div>
  );
}
