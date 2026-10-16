import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  style = {},
  onClick,
  type = 'button',
  ...rest
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'admin-btn-primary';
      case 'secondary':
        return 'admin-btn-secondary';
      case 'ghost':
        return 'admin-btn-ghost';
      case 'danger':
        return 'admin-btn-danger';
      default:
        return 'admin-btn-primary';
    }
  };

  const sizeStyle = {
    sm: { padding: '0.4rem 0.75rem', fontSize: '0.8rem' },
    md: { padding: '0.625rem 1.15rem', fontSize: '0.875rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
  }[size] || {};

  return (
    <button
      type={type}
      className={`${getVariantClass()} ${className}`}
      style={{ ...sizeStyle, ...style }}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255,255,255,0.4)',
            borderTopColor: '#FFFFFF',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
            display: 'inline-block',
          }}
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={16} />}
        </>
      )}
    </button>
  );
}
