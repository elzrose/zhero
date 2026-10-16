import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  LogOut,
  Shield,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storageService';
import { ApiConfig } from '../../services/apiClient';

export function Topbar({ activeTab, onSelectTab }) {
  const { user, isSuperAdmin, logout, switchRole } = useAuth();
  const { addToast } = useToast();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const auditLogs = StorageService.getAuditLogs().slice(0, 5);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to hackathon seed state? This resets local updates.')) {
      StorageService.resetAll();
      addToast('Platform data reset to factory seed state.', 'success');
      setProfileOpen(false);
    }
  };

  const getBreadcrumbTitle = () => {
    const map = {
      dashboard: 'Dashboard Overview',
      users: 'User Management',
      institutions: 'Tuition Centres & Human Mentors',
      'ai-monitoring': 'Verbal AI & Upstream Telemetry',
      bounties: 'Company Bounties & Partner Authorization',
      analytics: 'Cognitive Retention & Habit Analytics',
      settings: 'Access Control & Settings',
      'audit-logs': 'Administrative Audit Logs',
    };
    return map[activeTab] || 'Dashboard';
  };

  return (
    <header
      style={{
        height: '72px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #FAD1C6',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Left: Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#77736D', fontWeight: 500 }}>
          Admin Platform
        </span>
        <span style={{ color: '#FAD1C6', fontSize: '0.85rem' }}>/</span>
        <span style={{ fontSize: '0.9rem', color: '#171717', fontWeight: 700 }}>
          {getBreadcrumbTitle()}
        </span>
      </div>

      {/* Right Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Environment Badge */}
        <div
          title={
            ApiConfig.isLiveBackendConfigured
              ? `Connected to Backend API: ${ApiConfig.baseUrl}`
              : 'Local Persistence Active: updates persist in localStorage and sync with REST endpoints once VITE_API_URL is configured.'
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FCEADE',
            border: '1px solid #FAD1C6',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.725rem',
            fontWeight: 600,
            color: '#77736D',
          }}
        >
          <Database size={13} color="#DB5E8C" />
          <span>{ApiConfig.isLiveBackendConfigured ? 'Live REST API' : 'Persistent Store Active'}</span>
        </div>

        {/* Cross-App Navigation Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            title="Open Student Portal on Port 3001"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              color: '#77736D',
              textDecoration: 'none',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #FAD1C6',
              backgroundColor: '#FFFFFF',
            }}
          >
            <span>Student App (3001)</span>
            <ExternalLink size={11} />
          </a>
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            title="Open Tuition Centre Portal on Port 3002"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              color: '#77736D',
              textDecoration: 'none',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #FAD1C6',
              backgroundColor: '#FFFFFF',
            }}
          >
            <span>Tuition Portal (3002)</span>
            <ExternalLink size={11} />
          </a>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            title="Recent Admin Activity"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid #FAD1C6',
              backgroundColor: notifOpen ? '#FAD1C6' : '#FFFFFF',
              color: notifOpen ? '#DB5E8C' : '#77736D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '7px',
                height: '7px',
                backgroundColor: '#DB5E8C',
                borderRadius: '50%',
              }}
            />
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '320px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #FAD1C6',
                boxShadow: '0 12px 30px rgba(219, 94, 140, 0.08)',
                zIndex: 100,
                padding: '0.75rem 0',
              }}
            >
              <div
                style={{
                  padding: '0.5rem 1rem',
                  borderBottom: '1px solid #FAD1C6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
                  Administrative Feed
                </span>
                <span style={{ fontSize: '0.7rem', color: '#DB5E8C', fontWeight: 600 }}>
                  Live Audit
                </span>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      padding: '0.65rem 1rem',
                      borderBottom: '1px solid #FAD1C6',
                      fontSize: '0.785rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 600, color: '#171717' }}>{log.action}</span>
                      <span style={{ fontSize: '0.7rem', color: '#9E9B95' }}>
                        {log.timestamp.slice(11, 16)}
                      </span>
                    </div>
                    <p style={{ color: '#77736D', fontSize: '0.75rem', lineHeight: 1.3 }}>
                      {log.target}: {log.details}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ padding: '0.5rem 1rem 0', textAlign: 'center' }}>
                <button
                  onClick={() => {
                    onSelectTab('audit-logs');
                    setNotifOpen(false);
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#DB5E8C',
                    fontSize: '0.785rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  View All Audit Logs →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '10px',
              border: '1px solid #FAD1C6',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                backgroundColor: '#FCEADE',
                color: '#DB5E8C',
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {user?.avatar || 'AD'}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717', lineHeight: 1.2 }}>
                {user?.name?.split(' ')[0] || 'Admin'}
              </span>
              <span style={{ fontSize: '0.685rem', color: '#77736D' }}>
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
            <ChevronDown size={14} color="#77736D" />
          </button>

          {profileOpen && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '260px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #FAD1C6',
                boxShadow: '0 12px 30px rgba(219, 94, 140, 0.08)',
                zIndex: 100,
                padding: '0.75rem 0',
              }}
            >
              <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #FAD1C6' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#171717' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '2px' }}>
                  {user?.email}
                </div>
              </div>

              {/* Persona Switcher (For testing permissions) */}
              <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #FAD1C6' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#77736D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  Demo Role Switcher
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => {
                      switchRole('SUPER_ADMIN');
                      addToast('Switched persona to Super Admin', 'info');
                      setProfileOpen(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '4px',
                      fontSize: '0.75rem',
                      fontWeight: isSuperAdmin ? 700 : 500,
                      borderRadius: '6px',
                      border: isSuperAdmin ? '1px solid #DB5E8C' : '1px solid #FAD1C6',
                      backgroundColor: isSuperAdmin ? '#FAD1C6' : '#FFFFFF',
                      color: isSuperAdmin ? '#DB5E8C' : '#77736D',
                      cursor: 'pointer',
                    }}
                  >
                    Super Admin
                  </button>
                  <button
                    onClick={() => {
                      switchRole('ADMIN');
                      addToast('Switched persona to Operational Admin', 'info');
                      setProfileOpen(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '4px',
                      fontSize: '0.75rem',
                      fontWeight: !isSuperAdmin ? 700 : 500,
                      borderRadius: '6px',
                      border: !isSuperAdmin ? '1px solid #DB5E8C' : '1px solid #FAD1C6',
                      backgroundColor: !isSuperAdmin ? '#FAD1C6' : '#FFFFFF',
                      color: !isSuperAdmin ? '#DB5E8C' : '#77736D',
                      cursor: 'pointer',
                    }}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: '0.4rem 0' }}>
                <button
                  onClick={() => {
                    onSelectTab('settings');
                    setProfileOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.55rem 1rem',
                    textAlign: 'left',
                    fontSize: '0.825rem',
                    color: '#171717',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FCEADE')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Shield size={16} color="#77736D" />
                  <span>Security & Account</span>
                </button>

                <button
                  onClick={handleResetData}
                  style={{
                    width: '100%',
                    padding: '0.55rem 1rem',
                    textAlign: 'left',
                    fontSize: '0.825rem',
                    color: '#171717',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FCEADE')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <RotateCcw size={16} color="#77736D" />
                  <span>Reset Demo Data</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                    addToast('Signed out of admin session.', 'info');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.55rem 1rem',
                    textAlign: 'left',
                    fontSize: '0.825rem',
                    color: '#DB5E8C',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    borderTop: '1px solid #FAD1C6',
                    marginTop: '0.3rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FCEADE')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={16} color="#DB5E8C" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
