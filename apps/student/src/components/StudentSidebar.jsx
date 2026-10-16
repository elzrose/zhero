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
  LogOut
} from 'lucide-react';

export function StudentSidebar({
  currentPage,
  onNavigate,
  userProfile,
  onLogout,
  isMobileOpen,
  onCloseMobile
}) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'assessment', label: 'My Assessment', icon: Sparkles, badge: 'Interactive' },
    { id: 'results', label: 'Career Matches', icon: Target },
    { id: 'careers', label: 'Explore Careers', icon: Compass },
    { id: 'compare', label: 'Compare Careers', icon: GitCompare },
    { id: 'skill-gap', label: 'Skill-Gap Analysis', icon: Sliders },
    { id: 'roadmap', label: 'My Roadmap', icon: Map, badge: 'Active' },
    { id: 'resources', label: 'Learning Resources', icon: BookOpen },
    { id: 'progress', label: 'My Progress', icon: TrendingUp },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

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
            backdropFilter: 'blur(4px)',
            zIndex: 49,
          }}
        />
      )}

      <aside style={{
        width: '260px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #EAE7E2',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0,
        transition: 'transform 0.25s ease',
      }}>
        {/* Top Brand Identity */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #EAE7E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div
            onClick={() => onNavigate('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #FE6904 0%, #FA9B2A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.15rem',
              boxShadow: '0 3px 10px rgba(254, 105, 4, 0.28)',
            }}>
              Z
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#171717' }}>
                ZHERO
              </div>
              <div style={{ fontSize: '0.7rem', color: '#77736F', marginTop: '-2px' }}>
                Student Guidance Platform
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{
          padding: '1rem 0.75rem',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
        }}>
          <div style={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#77736F',
            fontWeight: 700,
            padding: '0.4rem 0.75rem 0.6rem',
          }}>
            Platform Navigation
          </div>

          {navItems.map((item) => {
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
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? '#FFE5CE' : 'transparent',
                  color: isActive ? '#FE6904' : '#171717',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon
                    size={18}
                    color={isActive ? '#FE6904' : '#77736F'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    background: isActive ? '#FE6904' : '#F1F0ED',
                    color: isActive ? '#FFFFFF' : '#77736F',
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sponsoring Centre Indicator in Sidebar */}
        <div style={{
          padding: '0.85rem 1rem',
          margin: '0 0.75rem 0.75rem',
          background: '#F8F8F7',
          borderRadius: '12px',
          border: '1px solid #EAE7E2',
        }}>
          <div style={{ fontSize: '0.7rem', color: '#77736F', fontWeight: 600, textTransform: 'uppercase' }}>
            Sponsored Enrollment
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginTop: '2px' }}>
            {userProfile?.institution || 'Apex Career Academy'}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#FE6904', fontWeight: 600, marginTop: '2px' }}>
            ✓ Premium Access Sponsoring
          </div>
        </div>

        {/* User Profile Summary & Logout */}
        <div style={{
          padding: '0.85rem 1rem',
          borderTop: '1px solid #EAE7E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div
            onClick={() => onNavigate('profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1, minWidth: 0 }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#FFE5CE',
              color: '#FE6904',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              flexShrink: 0,
            }}>
              {userProfile?.name ? userProfile.name.charAt(0) : 'A'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#171717',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {userProfile?.name || 'Ananya Sharma'}
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: '#77736F',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {userProfile?.educationLevel || '2nd Year Student'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign out of student portal"
            style={{
              background: 'none',
              border: 'none',
              color: '#77736F',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
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
