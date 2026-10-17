import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Cpu,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Briefcase,
  GraduationCap,
  Brain,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';

export function Sidebar({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
}) {
  const { user, isSuperAdmin } = useAuth();
  const institutions = StorageService.getInstitutions();
  const validations = StorageService.getHumanValidations();
  const pendingApprovalsCount = institutions.filter(i => i.status === 'PENDING_REVIEW').length;
  const pendingValidationsCount = validations.filter(v => v.status === 'SCHEDULED' || v.status === 'PENDING_SCHEDULE').length;
  const totalPendingAttention = pendingApprovalsCount + pendingValidationsCount;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    {
      id: 'institutions',
      label: 'Tuition Centres & Mentors',
      icon: Building2,
      badge: totalPendingAttention > 0 ? totalPendingAttention : null,
      badgeVariant: 'warning',
    },
    { id: 'courses', label: 'Course Offerings & Providers', icon: GraduationCap },
    { id: 'ai-monitoring', label: 'Verbal AI & Diagnostics', icon: Cpu },
    { id: 'bounties', label: 'Company Bounties', icon: Briefcase },
    { id: 'analytics', label: 'Cognitive & Cohort Analytics', icon: Brain },
    { id: 'settings', label: 'Access Control & Settings', icon: Settings },
    { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText },
  ];

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '260px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #FAD1C6',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: collapsed ? '1.25rem 0' : '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: '0.85rem',
          borderBottom: '1px solid #FAD1C6',
          minHeight: '72px',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg, #DB5E8C 0%, #F5AFAE 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: '800',
            fontSize: '1.25rem',
            boxShadow: 'var(--shadow-coral-glow)',
            flexShrink: 0,
          }}
        >
          Z
        </div>

        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
                ZHERO
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: '#FCEADE',
                  color: '#DB5E8C',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  border: '1px solid #FAD1C6',
                }}
              >
                ADMIN
              </span>
            </div>
            <p style={{ fontSize: '0.725rem', color: '#77736D', whiteSpace: 'nowrap', marginTop: '1px' }}>
              Platform Operations
            </p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav
        style={{
          padding: '1rem 0.75rem',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: collapsed ? '0.65rem 0' : '0.65rem 0.85rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: isActive ? '#FAD1C6' : 'transparent',
                color: isActive ? '#DB5E8C' : '#77736D',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#FCEADE';
                  e.currentTarget.style.color = '#171717';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#77736D';
                }
              }}
            >
              <Icon size={18} color={isActive ? '#DB5E8C' : '#77736D'} />

              {!collapsed && (
                <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              )}

              {!collapsed && item.badge && (
                <span
                  style={{
                    backgroundColor: '#FCEADE',
                    color: '#DB5E8C',
                    border: '1px solid #FAD1C6',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                  }}
                >
                  {item.badge}
                </span>
              )}

              {collapsed && item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '6px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#DB5E8C',
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin User Mini Profile & Collapse Toggle */}
      <div
        style={{
          borderTop: '1px solid #FAD1C6',
          padding: '0.85rem 0.75rem',
          backgroundColor: '#FCEADE',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {/* User Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: collapsed ? '0.4rem 0' : '0.4rem 0.5rem',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #FAD1C6',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#FCEADE',
              color: '#DB5E8C',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {user?.avatar || 'AD'}
          </div>

          {!collapsed && (
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#77736D' }}>
                {isSuperAdmin ? <ShieldAlert size={12} color="#DB5E8C" /> : <ShieldCheck size={12} color="#DB5E8C" />}
                <span>{isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.4rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#77736D',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FAD1C6';
            e.currentTarget.style.color = '#171717';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#77736D';
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> Collapse Sidebar</>}
        </button>
      </div>
    </aside>
  );
}
