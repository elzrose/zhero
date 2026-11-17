import React from 'react';
import { useTuitionStore, storeActions } from '../data/store';

export function Sidebar({ currentSection, setCurrentSection }) {
  const store = useTuitionStore();
  const profile = store.profile || {};
  const pendingFollowUps = (store.followUps || []).filter(f => f.status === 'Pending').length;
  const newLeads = (store.leads || []).filter(l => l.status === 'New').length;

  const navItems = [
    { id: 'overview', label: 'Centre Overview', icon: '📊' },
    { id: 'courses', label: 'Course Management', icon: '📚', count: store.courses?.length },
    { id: 'batches', label: 'Batches & Schedules', icon: '🗓️', count: store.batches?.length },
    { id: 'campaigns', label: 'Assessment Campaigns', icon: '🚀', badge: 'QR' },
    { id: 'leads', label: 'Lead & Enquiry Pipeline', icon: '🎯', count: newLeads > 0 ? `${newLeads} new` : null, alert: newLeads > 0 },
    { id: 'students', label: 'Student Directory (360°)', icon: '👩‍🎓', count: store.students?.length },
    { id: 'checkpoints', label: 'AI Verbal Checkpoints', icon: '🎙️', badge: 'Voice AI' },
    { id: 'retention', label: 'Memory Retention (SM-2)', icon: '🧠', badge: 'SM-2' },
    { id: 'bounties', label: 'Project Bounties', icon: '💼', count: store.bounties?.length || 4 },
    { id: 'mentors', label: 'Mentors & Study Hub', icon: '🤝' },
    { id: 'recommendations', label: 'Course Matching Engine', icon: '⚡', badge: 'AI/Rules' },
    { id: 'enrollments', label: 'Admissions & Enrollments', icon: '📝', count: store.enrollments?.length },
    { id: 'analytics', label: 'Retention & Analytics', icon: '📈' },
    { id: 'settings', label: 'Centre Settings', icon: '⚙️' },
  ];

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default records? Custom created items will be refreshed.')) {
      storeActions.resetAll();
    }
  };

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid var(--tc-border)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 0.75rem',
      flexShrink: 0,
      minHeight: 'calc(100vh - 65px)'
    }}>
      <div>
        {/* Centre Badge Card */}
        <div style={{
          backgroundColor: 'var(--tc-yellow-cream)',
          border: '1px solid var(--tc-yellow-pale)',
          borderRadius: 'var(--tc-radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C6A05', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Centre
          </div>
          <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#171717', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {profile.name}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>
            <span>Seat Capacity:</span>
            <span style={{ fontWeight: 700, color: '#171717' }}>
              {profile.usedSeats || 148} / {profile.allocatedSeats || 200}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#EAE5D8',
            borderRadius: '999px',
            marginTop: '0.35rem',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.round(((profile.usedSeats || 148) / (profile.allocatedSeats || 200)) * 100)}%`,
              height: '100%',
              backgroundColor: 'var(--tc-primary-yellow)'
            }} />
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--tc-subtle-text)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem 0.5rem' }}>
          Platform Management
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(item => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.85rem',
                  borderRadius: 'var(--tc-radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--tc-yellow-pale)' : 'transparent',
                  color: isActive ? '#171717' : 'var(--tc-charcoal)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '1.05rem' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.count ? (
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    backgroundColor: item.alert ? '#FDE8E8' : (isActive ? '#FFFFFF' : '#F0EEE9'),
                    color: item.alert ? '#C53030' : 'var(--tc-muted-text)',
                    fontWeight: 600
                  }}>
                    {item.count}
                  </span>
                ) : item.badge ? (
                  <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Utilities */}
      <div style={{ borderTop: '1px solid var(--tc-border)', paddingTop: '1rem', marginTop: '1rem' }}>
        {pendingFollowUps > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            backgroundColor: '#FFF8E1',
            borderRadius: '8px',
            marginBottom: '0.75rem',
            fontSize: '0.75rem',
            color: '#B78103'
          }}>
            <span>🔔</span>
            <span><strong>{pendingFollowUps}</strong> follow-ups pending</span>
          </div>
        )}

        <button
          onClick={handleResetData}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px dashed var(--tc-border)',
            backgroundColor: 'transparent',
            color: 'var(--tc-muted-text)',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
          title="Reset demo data to initial state"
        >
          🔄 Reset Demo Records
        </button>
      </div>
    </aside>
  );
}
