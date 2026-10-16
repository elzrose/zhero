import React, { useState, useEffect } from 'react';
import '@shared/styles/tokens.css';
import './styles/admin.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AdminLayout } from './components/layout/AdminLayout';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { InstitutionsPage } from './pages/InstitutionsPage';
import { AiMonitoringPage } from './pages/AiMonitoringPage';
import { BountiesPage } from './pages/BountiesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

function AdminAppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Tab state synced with URL hash for browser history / direct linking
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = [
      'dashboard',
      'users',
      'institutions',
      'ai-monitoring',
      'bounties',
      'analytics',
      'settings',
      'audit-logs',
    ];
    return validTabs.includes(hash) ? hash : 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== activeTab) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FCEADE',
          fontFamily: 'var(--font-family-admin)',
          color: '#171717',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #DB5E8C 0%, #F5AFAE 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: 'var(--shadow-coral-glow)',
            }}
          >
            Z
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Loading ZHERO Platform Operations...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'users':
        return <UsersPage />;
      case 'institutions':
        return <InstitutionsPage />;
      case 'ai-monitoring':
        return <AiMonitoringPage />;
      case 'bounties':
        return <BountiesPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'audit-logs':
        return <AuditLogsPage />;
      default:
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)}>
      {renderActiveView()}
    </AdminLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminAppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
