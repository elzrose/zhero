import React from 'react';

export function Badge({ children, variant = 'peach', style = {} }) {
  const styles = {
    peach: { background: '#FFE5CE', color: '#FE6904' },
    green: { background: '#E8F5E9', color: '#2E7D32' },
    neutral: { background: '#F8F8F7', color: '#77736F' },
  }[variant] || { background: '#FFE5CE', color: '#FE6904' };

  return (
    <span
      className="badge"
      style={{
        ...styles,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
