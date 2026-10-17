import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Target,
  Compass,
  GitCompare,
  Sliders,
  Map,
  BookOpen,
  TrendingUp,
  User,
  LogOut,
  Mic,
  GitPullRequest,
  Award,
  Users
} from 'lucide-react';

export function StudentSidebar({
  currentPage,
  onNavigate,
  userProfile,
  onLogout,
  isMobileOpen,
  onCloseMobile
}) {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assessment', label: 'Assessment', icon: Sparkles },
    { id: 'interview', label: 'Interview', icon: Mic },
    { id: 'results', label: 'Matches', icon: Target },
    { id: 'careers', label: 'Careers', icon: Compass },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'skill-gap', label: 'Skill gaps', icon: Sliders },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'resources', label: 'Resources', icon: BookOpen },
  ];

  const secondaryNav = [
    { id: 'github-hub', label: 'Open source', icon: GitPullRequest },
    { id: 'bounties', label: 'Bounties', icon: Award },
    { id: 'study-rooms', label: 'Study rooms', icon: Users },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const isActive = currentPage === item.id;
    return (
      <button
        key={item.id}
        onClick={() => {
          onNavigate(item.id);
          if (onCloseMobile) onCloseMobile();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          padding: '0.5rem 0.75rem',
          borderRadius: '8px',
          border: 'none',
          background: isActive ? '#FFE5CE' : 'transparent',
          color: isActive ? '#FE6904' : '#171717',
          fontWeight: isActive ? 600 : 400,
          fontSize: '0.875rem',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <Icon size={18} color={isActive ? '#FE6904' : '#77736F'} strokeWidth={2} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23, 23, 23, 0.4)',
            zIndex: 49,
          }}
        />
      )}

      <aside style={{
        width: '240px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #EAE7E2',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0,
      }}>
        {/* Top Brand Identity */}
        <div style={{
          padding: '1.25rem',
          borderBottom: '1px solid #EAE7E2',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div
            onClick={() => onNavigate('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: '#FE6904',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '1rem',
            }}>
              Z
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#171717' }}>
              ZHERO
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{
          padding: '1rem 0.75rem',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          {mainNav.map(renderNavItem)}

          <div style={{ height: '1rem' }} />

          {secondaryNav.map(renderNavItem)}
        </nav>

        {/* User Profile Summary & Logout */}
        <div style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid #EAE7E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div
            onClick={() => onNavigate('profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1, minWidth: 0 }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              background: '#FFE5CE',
              color: '#FE6904',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.85rem',
              flexShrink: 0,
            }}>
              {userProfile?.name ? userProfile.name.charAt(0) : 'A'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#171717',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {userProfile?.name || 'Ananya'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign out"
            style={{
              background: 'none',
              border: 'none',
              color: '#77736F',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
