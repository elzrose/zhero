import React from 'react';

export function StatCard({
  title,
  value,
  subtext,
  change,
  trend = 'neutral', // 'up' | 'down' | 'neutral' | 'alert'
  icon: Icon,
  badgeText,
  onClick,
}) {
  const getTrendColor = () => {
    if (trend === 'up' || trend === 'down' || trend === 'alert') return '#DB5E8C';
    return '#77736D';
  };

  return (
    <div
      className={`admin-card ${onClick ? 'admin-card-hoverable' : ''}`}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        padding: '1.25rem 1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#77736D' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#FCEADE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DB5E8C',
              border: '1px solid #FAD1C6',
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {value}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {change && (
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: getTrendColor() }}>
              {change}
            </span>
          )}
          {subtext && (
            <span style={{ fontSize: '0.75rem', color: '#77736D' }}>
              {subtext}
            </span>
          )}
          {badgeText && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: '#FCEADE',
                border: '1px solid #FAD1C6',
                color: '#77736D',
                fontWeight: 600,
              }}
            >
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
