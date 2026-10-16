import React from 'react';

export function Badge({ children, variant = 'neutral', size = 'md', dot = false }) {
  const variantStyles = {
    orange: {
      bg: '#FCEADE',
      color: '#DB5E8C',
      border: '1px solid #FAD1C6',
      dotColor: '#DB5E8C',
    },
    coral: {
      bg: '#FCEADE',
      color: '#DB5E8C',
      border: '1px solid #FAD1C6',
      dotColor: '#DB5E8C',
    },
    success: {
      bg: '#FCEADE',
      color: '#DB5E8C',
      border: '1px solid #FAD1C6',
      dotColor: '#DB5E8C',
    },
    warning: {
      bg: '#FAD1C6',
      color: '#DB5E8C',
      border: '1px solid #F5AFAE',
      dotColor: '#DB5E8C',
    },
    danger: {
      bg: '#FCEADE',
      color: '#DB5E8C',
      border: '1px solid #F5AFAE',
      dotColor: '#DB5E8C',
    },
    neutral: {
      bg: '#FCEADE',
      color: '#77736D',
      border: '1px solid #FAD1C6',
      dotColor: '#F5AFAE',
    },
  };

  const current = variantStyles[variant] || variantStyles.neutral;
  const isSm = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: isSm ? '0.15rem 0.5rem' : '0.25rem 0.65rem',
        borderRadius: '9999px',
        fontSize: isSm ? '0.7rem' : '0.75rem',
        fontWeight: 600,
        backgroundColor: current.bg,
        color: current.color,
        border: current.border,
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '9999px',
            backgroundColor: current.dotColor,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
