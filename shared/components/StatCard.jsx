import React from 'react';

export function StatCard({ label, value, subtext, highlight = false }) {
  return (
    <div className="card" style={{
      background: highlight ? '#FFE5CE' : '#FFFFFF',
      border: highlight ? '1px solid #FA9B2A' : '1px solid #EAE7E2',
    }}>
      <span style={{ fontSize: '0.8rem', color: highlight ? '#FE6904' : '#77736F', fontWeight: 600 }}>
        {label}
      </span>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', marginTop: '0.35rem' }}>
        {value}
      </div>
      {subtext && (
        <span style={{ fontSize: '0.75rem', color: '#77736F', marginTop: '0.25rem', display: 'block' }}>
          {subtext}
        </span>
      )}
    </div>
  );
}
