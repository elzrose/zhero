import React, { useState, useEffect } from 'react';
import { zheroApi, getStoredUser } from '../config/index.js';

export function BrandNavbar({ currentApp = 'student', badgeText = 'Preview' }) {
  const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [dbStatus, setDbStatus] = useState('Checking...');

  useEffect(() => {
    let isMounted = true;
    zheroApi.getAnalytics().then((res) => {
      if (isMounted) {
        setDbStatus(res?.success ? 'Shared DB Online' : 'Local Fallback');
      }
    }).catch(() => {
      if (isMounted) setDbStatus('Local Mode');
    });
    return () => { isMounted = false; };
  }, []);

  const apps = [
    { id: 'student', name: 'Student Portal', port: 3001, url: isDev ? 'http://localhost:3001' : '/' },
    { id: 'tuition-centre', name: 'Tuition Centre Portal', port: 3002, url: isDev ? 'http://localhost:3002' : '/tuition-centre/' },
    { id: 'admin', name: 'Platform Admin', port: 3003, url: isDev ? 'http://localhost:3003' : '/admin/' },
  ];

  const handleQuickSwitchRole = async (targetRole) => {
    const res = await zheroApi.switchRole(targetRole);
    if (res && res.user) {
      setCurrentUser(res.user);
      const targetApp = targetRole === 'admin' ? apps[2] : (targetRole === 'tuition-centre' ? apps[1] : apps[0]);
      if (window.location.port !== String(targetApp.port)) {
        window.location.href = targetApp.url;
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.85rem 1.75rem',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #EAE7E2',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexWrap: 'wrap',
      gap: '0.75rem',
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

        {/* DB Status Badge */}
        <div style={{
          marginLeft: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 10px',
          borderRadius: '9999px',
          fontSize: '0.725rem',
          fontWeight: 600,
          backgroundColor: dbStatus.includes('Online') ? '#E8F5E9' : '#FFF3E0',
          color: dbStatus.includes('Online') ? '#2E7D32' : '#E65100',
          border: `1px solid ${dbStatus.includes('Online') ? '#C8E6C9' : '#FFE0B2'}`,
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: dbStatus.includes('Online') ? '#4CAF50' : '#FF9800',
          }} />
          {dbStatus}
        </div>
      </div>

      {/* Cross-App Navigation & User Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* App Switcher Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#77736F', marginRight: '4px' }}>Apps:</span>
          {apps.map((app) => {
            const isActive = app.id === currentApp;
            return (
              <a
                key={app.id}
                href={app.url}
                style={{
                  fontSize: '0.825rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '7px',
                  textDecoration: 'none',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#FE6904' : '#57534E',
                  backgroundColor: isActive ? '#FFE5CE' : '#F8F8F7',
                  border: isActive ? '1px solid #FA9B2A' : '1px solid #EAE7E2',
                  transition: 'all 0.15s ease',
                }}
              >
                {app.name}
              </a>
            );
          })}
        </nav>

        {/* Quick 1-Click Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderLeft: '1px solid #EAE7E2', paddingLeft: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: '#77736F' }}>Role:</span>
          <button
            onClick={() => handleQuickSwitchRole('student')}
            style={{
              padding: '2px 8px',
              fontSize: '0.725rem',
              fontWeight: currentUser?.role === 'student' ? 700 : 500,
              borderRadius: '6px',
              border: '1px solid #EAE7E2',
              backgroundColor: currentUser?.role === 'student' ? '#FFE5CE' : '#FFFFFF',
              color: currentUser?.role === 'student' ? '#FE6904' : '#171717',
              cursor: 'pointer',
            }}
          >
            Student
          </button>
          <button
            onClick={() => handleQuickSwitchRole('tuition-centre')}
            style={{
              padding: '2px 8px',
              fontSize: '0.725rem',
              fontWeight: currentUser?.role === 'tuition-centre' ? 700 : 500,
              borderRadius: '6px',
              border: '1px solid #EAE7E2',
              backgroundColor: currentUser?.role === 'tuition-centre' ? '#FEF9E7' : '#FFFFFF',
              color: currentUser?.role === 'tuition-centre' ? '#C4971A' : '#171717',
              cursor: 'pointer',
            }}
          >
            Tuition
          </button>
          <button
            onClick={() => handleQuickSwitchRole('admin')}
            style={{
              padding: '2px 8px',
              fontSize: '0.725rem',
              fontWeight: currentUser?.role === 'admin' ? 700 : 500,
              borderRadius: '6px',
              border: '1px solid #EAE7E2',
              backgroundColor: currentUser?.role === 'admin' ? '#FCEADE' : '#FFFFFF',
              color: currentUser?.role === 'admin' ? '#DB5E8C' : '#171717',
              cursor: 'pointer',
            }}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
}
