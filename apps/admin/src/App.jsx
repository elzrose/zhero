import React, { useState } from 'react';
import '@shared/styles/tokens.css';
import { BrandNavbar } from '@shared/components/BrandNavbar';

export default function App() {
  const [institutions, setInstitutions] = useState([
    { id: 'INST-01', name: 'Apex Career Academy', location: 'Kochi, KL', plan: 'Enterprise (200 Seats)', status: 'Approved', joined: '12 Oct 2026' },
    { id: 'INST-02', name: 'Horizon STEM Institute', location: 'Trivandrum, KL', plan: 'Growth (100 Seats)', status: 'Pending Review', joined: '15 Oct 2026' },
    { id: 'INST-03', name: 'FutureMinds Coaching', location: 'Calicut, KL', plan: 'Starter (50 Seats)', status: 'Pending Review', joined: '16 Oct 2026' },
    { id: 'INST-04', name: 'Vanguard Tech Learning', location: 'Ernakulam, KL', plan: 'Enterprise (250 Seats)', status: 'Approved', joined: '08 Oct 2026' },
  ]);

  const handleApprove = (id) => {
    setInstitutions(institutions.map(inst => inst.id === id ? { ...inst, status: 'Approved' } : inst));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BrandNavbar currentApp="admin" badgeText="Admin Console" />

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', flex: 1 }}>
        {/* Developer Branch Indicator Banner */}
        <div style={{
          background: '#FFE5CE',
          border: '1px solid #FA9B2A',
          borderRadius: '12px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>⚙️</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#171717' }}>
              Developer 3 Workspace — Platform Admin Application
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#77736F' }}>
            <span>Target Branch: <strong style={{ color: '#FE6904' }}>feature/admin</strong></span>
            <span>Port: <strong style={{ color: '#171717' }}>3003</strong></span>
          </div>
        </div>

        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.03em' }}>
              ZHERO Platform Operations
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#77736F', marginTop: '0.5rem' }}>
              B2B2C Central Hub: verify educational partners, manage career taxonomy, and monitor platform health.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary">Export Audit Log</button>
            <button className="btn-primary">+ Add Career Profile</button>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Active Institutions</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', marginTop: '0.35rem' }}>24</div>
            <span style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 600 }}>2 Pending verification</span>
          </div>
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Total Enrolled Students</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', marginTop: '0.35rem' }}>3,420</div>
            <span style={{ fontSize: '0.75rem', color: '#77736F' }}>Across all institutes</span>
          </div>
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Career Taxonomy Mappings</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', marginTop: '0.35rem' }}>142</div>
            <span style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 600 }}>+12 mapped this week</span>
          </div>
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>System Status</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2E7D32', marginTop: '0.35rem' }}>99.98%</div>
            <span style={{ fontSize: '0.75rem', color: '#77736F' }}>All services operational</span>
          </div>
        </div>

        {/* Institution Onboarding Management */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2.5rem' }}>
          <div style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #EAE7E2',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717' }}>
                Educational Institutions & Tuition Partners
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#77736F' }}>
                Verify incoming B2B partner applications and manage subscription tiers.
              </p>
            </div>
            <span className="badge">B2B Partners</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#FAF9F7', borderBottom: '1px solid #EAE7E2', color: '#77736F' }}>
                  <th style={{ padding: '0.85rem 1.75rem', fontWeight: 600 }}>ID</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Institution Name</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Location</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Sponsorship Plan</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.85rem 1.75rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map((inst, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < institutions.length - 1 ? '1px solid #EAE7E2' : 'none' }}>
                    <td style={{ padding: '1rem 1.75rem', fontWeight: 600, color: '#77736F', fontSize: '0.8rem' }}>{inst.id}</td>
                    <td style={{ padding: '1rem 1rem', fontWeight: 600, color: '#171717' }}>{inst.name}</td>
                    <td style={{ padding: '1rem 1rem', color: '#77736F' }}>{inst.location}</td>
                    <td style={{ padding: '1rem 1rem', fontWeight: 500 }}>{inst.plan}</td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: inst.status === 'Approved' ? '#E8F5E9' : '#FFE5CE',
                        color: inst.status === 'Approved' ? '#2E7D32' : '#FE6904',
                      }}>
                        {inst.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.75rem', textAlign: 'right' }}>
                      {inst.status === 'Pending Review' ? (
                        <button
                          onClick={() => handleApprove(inst.id)}
                          style={{
                            border: 'none',
                            background: '#FE6904',
                            color: '#FFFFFF',
                            borderRadius: '6px',
                            padding: '4px 12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Approve
                        </button>
                      ) : (
                        <button style={{
                          border: '1px solid #EAE7E2',
                          background: '#FFFFFF',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: '#77736F',
                        }}>
                          Manage
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations Modules */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Career Taxonomy Engine</h3>
            <p style={{ fontSize: '0.85rem', color: '#77736F', marginBottom: '1rem' }}>
              Manage standard skills, prerequisite matrices, and AI recommendation rules.
            </p>
            <button className="btn-secondary" style={{ width: '100%' }}>Browse 142 Career Profiles</button>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>B2B Contract & Billing</h3>
            <p style={{ fontSize: '0.85rem', color: '#77736F', marginBottom: '1rem' }}>
              Review subscription tiers, active student seat quotas, and institutional renewals.
            </p>
            <button className="btn-secondary" style={{ width: '100%' }}>Manage Invoices & Licenses</button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid #EAE7E2',
        background: '#FFFFFF',
        fontSize: '0.8rem',
        color: '#77736F',
      }}>
        ZHERO Monorepo Foundation — KSUM She Builds Hackathon 2026 • Developer 3 App (apps/admin)
      </footer>
    </div>
  );
}
