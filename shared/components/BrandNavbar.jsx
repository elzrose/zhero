import React from 'react';

export function BrandNavbar({ currentApp = 'student', badgeText = 'Preview' }) {
  const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const apps = [
    { id: 'student', name: 'Student Portal', port: 3001, url: isDev ? 'http://localhost:3001' : '/' },
    { id: 'tuition-centre', name: 'Tuition Centre Portal', port: 3002, url: isDev ? 'http://localhost:3002' : '/tuition-centre/' },
    { id: 'admin', name: 'Platform Admin', port: 3003, url: isDev ? 'http://localhost:3003' : '/admin/' },
  ];

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #EAE7E2',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #FE6904 0%, #FA9B2A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: '800',
          fontSize: '1.25rem',
          boxShadow: '0 2px 8px rgba(254, 105, 4, 0.3)',
        }}>
          Z
        </div>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#171717' }}>
            ZHERO
          </span>
          <span style={{
            marginLeft: '8px',
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '9999px',
            background: '#FFE5CE',
            color: '#FE6904',
            fontWeight: '600',
          }}>
            {badgeText}
          </span>
        </div>
      </div>

      {/* App Switcher Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#77736F', marginRight: '6px' }}>Apps:</span>
        {apps.map((app) => {
          const isActive = app.id === currentApp;
          const isInternal = !isDev && app.id !== 'student';
          return (
            <a
              key={app.id}
              href={isInternal ? undefined : app.url}
              title={isInternal ? `${app.name} is configured as an internal service on Vercel` : undefined}
              style={{
                fontSize: '0.85rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FE6904' : isInternal ? '#A8A29E' : '#77736F',
                backgroundColor: isActive ? '#FFE5CE' : 'transparent',
                border: isActive ? '1px solid #FE6904' : '1px solid transparent',
                cursor: isInternal ? 'default' : 'pointer',
                opacity: isInternal ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
            >
              {app.name}
              {isInternal && (
                <span style={{
                  fontSize: '0.7rem',
                  marginLeft: '6px',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: '#EAE7E2',
                  color: '#77736F',
                  fontWeight: 500,
                }}>
                  Internal
                </span>
              )}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
