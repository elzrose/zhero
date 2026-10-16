import React from 'react';

export function Button({ variant = 'primary', children, onClick, style = {}, ...props }) {
  const className = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
  return (
    <button className={className} onClick={onClick} style={style} {...props}>
      {children}
    </button>
  );
}
