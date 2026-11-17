import React from 'react';

export function PageHeader({
  title,
  description,
  badge,
  actions,
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 800,
              color: '#171717',
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p style={{ fontSize: '0.95rem', color: '#77736D', marginTop: '0.35rem', maxWidth: '750px' }}>
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
