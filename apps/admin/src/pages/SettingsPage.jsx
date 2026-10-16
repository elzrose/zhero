import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DEFAULT_SETTINGS = {
  platformName: 'ZHERO Education & Career Engine',
  maintenanceMode: false,
  selfRegistrationAllowed: true,
  defaultSeatQuota: 100,
  notificationAlerts: true,
  require2FAForSuperAdmin: true,
  dataRetentionMonths: 24,
};

export function SettingsPage() {
  const { user, isSuperAdmin, switchRole } = useAuth();
  const { addToast } = useToast();

  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...(StorageService.getSettings() || {}),
  }));

  // Password reset simulation
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const handleSavePlatformSettings = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      addToast('Only Super Administrators can update global platform settings.', 'error');
      return;
    }
    StorageService.saveSettings(settings);
    StorageService.logAudit('PLATFORM_SETTINGS_UPDATED', 'Global Configuration', 'Updated platform configuration params.');
    addToast('Global platform settings saved successfully.', 'success');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPw.length < 6) {
      addToast('Password must be at least 6 characters long.', 'error');
      return;
    }
    setCurrentPw('');
    setNewPw('');
    addToast('Admin security credentials updated successfully.', 'success');
  };

  const permissionsMatrix = [
    { action: 'View Operational Dashboard & Analytics', admin: true, superAdmin: true },
    { action: 'Browse & Filter Users (Students, Staff)', admin: true, superAdmin: true },
    { action: 'Suspend / Reactivate Student Accounts', admin: true, superAdmin: true },
    { action: 'Edit Career Taxonomy & Competencies', admin: true, superAdmin: true },
    { action: 'Author Assessment Questions & Previews', admin: true, superAdmin: true },
    { action: 'Publish / Unpublish Learning Resources', admin: true, superAdmin: true },
    { action: 'View AI Latency & Inference Traces', admin: true, superAdmin: true },
    { action: 'Approve / Reject Tuition Centre Partnerships', admin: false, superAdmin: true },
    { action: 'Calibrate AI System Prompt Rubrics', admin: false, superAdmin: true },
    { action: 'Adjust Institution Student Seat Quotas', admin: false, superAdmin: true },
    { action: 'Permanently Delete User Accounts', admin: false, superAdmin: true },
    { action: 'Modify Global Platform Settings', admin: false, superAdmin: true },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Access Control & Platform Settings"
        description="Configure role-based access security, manage your administrator account, and calibrate global platform operational flags."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Administrator Profile Card */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#FCEADE',
                color: '#DB5E8C',
                fontWeight: 800,
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {user?.avatar || 'AD'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                {user?.name}
              </h2>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                <Badge variant={isSuperAdmin ? 'danger' : 'success'} dot>
                  {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
                </Badge>
                <span style={{ fontSize: '0.75rem', color: '#77736D' }}>{user?.email}</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#FCEADE', padding: '0.85rem', borderRadius: '10px', border: '1px solid #FAD1C6', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
            <div style={{ marginBottom: '4px' }}><strong>Tenant Scope:</strong> Global Platform Operations</div>
            <div style={{ marginBottom: '4px' }}><strong>Phone:</strong> {user?.phone || '+91 98470 00001'}</div>
            <div><strong>Active Session:</strong> JWT Token Valid (24h)</div>
          </div>

          {/* Quick Demo Persona Switcher */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#77736D', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Switch Persona to Test Permissions
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant={isSuperAdmin ? 'primary' : 'secondary'}
                size="sm"
                style={{ flex: 1 }}
                onClick={() => {
                  switchRole('SUPER_ADMIN');
                  addToast('Switched to Super Admin persona', 'info');
                }}
              >
                Super Admin
              </Button>
              <Button
                variant={!isSuperAdmin ? 'primary' : 'secondary'}
                size="sm"
                style={{ flex: 1 }}
                onClick={() => {
                  switchRole('ADMIN');
                  addToast('Switched to Operational Admin persona', 'info');
                }}
              >
                Operational Admin
              </Button>
            </div>
          </div>
        </div>

        {/* Change Password Security Form */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', marginBottom: '0.35rem' }}>
            Account Security & Password
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#77736D', marginBottom: '1.25rem' }}>
            Update your administrative login credentials.
          </p>

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.3rem' }}>
                Current Password
              </label>
              <input
                type="password"
                required
                className="admin-input"
                placeholder="••••••••"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.3rem' }}>
                New Password
              </label>
              <input
                type="password"
                required
                className="admin-input"
                placeholder="Minimum 6 characters"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button type="submit" variant="primary">
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #FAD1C6' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', margin: 0 }}>
            Role-Based Access Control (RBAC) Matrix
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
            Privileges enforced server-side on backend API endpoints.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FCEADE', borderBottom: '1px solid #FAD1C6', color: '#77736D' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Administrative Capability</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center', width: '160px' }}>Operational Admin</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'center', width: '160px' }}>Super Admin</th>
              </tr>
            </thead>
            <tbody>
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #FAD1C6', backgroundColor: '#FFFFFF' }}>
                  <td style={{ padding: '0.75rem 1.25rem', fontWeight: 500, color: '#171717' }}>
                    {item.action}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    {item.admin ? (
                      <span style={{ color: '#DB5E8C', fontWeight: 700 }}>✓ Allowed</span>
                    ) : (
                      <span style={{ color: '#9E9B95' }}>✕ Restricted</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                    <span style={{ color: '#DB5E8C', fontWeight: 700 }}>✓ Allowed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Platform Settings Form */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', margin: 0 }}>
              Global Platform Parameters
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
              Central operations configuration flags (Requires Super Admin privileges).
            </p>
          </div>
          {!isSuperAdmin && (
            <Badge variant="warning">View-Only (Super Admin Required to Modify)</Badge>
          )}
        </div>

        <form onSubmit={handleSavePlatformSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                Platform Display Name
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                className="admin-input"
                value={settings?.platformName || ''}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                Default New Centre Seat Quota
              </label>
              <input
                type="number"
                disabled={!isSuperAdmin}
                className="admin-input"
                value={settings?.defaultSeatQuota || 100}
                onChange={(e) => setSettings({ ...settings, defaultSeatQuota: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', cursor: isSuperAdmin ? 'pointer' : 'default' }}>
              <input
                type="checkbox"
                disabled={!isSuperAdmin}
                checked={Boolean(settings?.maintenanceMode)}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              />
              <span style={{ fontWeight: 600, color: '#171717' }}>Maintenance Mode</span>
              <span style={{ fontSize: '0.75rem', color: '#77736D' }}>— Temporarily suspend student quiz attempts for platform upgrades</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', cursor: isSuperAdmin ? 'pointer' : 'default' }}>
              <input
                type="checkbox"
                disabled={!isSuperAdmin}
                checked={Boolean(settings?.notificationAlerts)}
                onChange={(e) => setSettings({ ...settings, notificationAlerts: e.target.checked })}
              />
              <span style={{ fontWeight: 600, color: '#171717' }}>Real-time Audit Alert Notifications</span>
              <span style={{ fontSize: '0.75rem', color: '#77736D' }}>— Send high-priority alerts to topbar notification bell</span>
            </label>
          </div>

          {isSuperAdmin && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button type="submit" variant="primary">
                Save Platform Parameters
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
