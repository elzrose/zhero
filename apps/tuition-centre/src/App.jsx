import React, { useState } from 'react';
import '@shared/styles/tokens.css';
import { BrandNavbar } from '@shared/components/BrandNavbar';

export default function App() {
  const [activeTab, setActiveTab] = useState('all');

  const students = [
    { id: 'STU-101', name: 'Ananya Sharma', batch: '2026 Batch A', targetCareer: 'Full Stack Engineer', status: 'In Progress (65%)', readiness: '72%' },
    { id: 'STU-102', name: 'Rohit Menon', batch: '2026 Batch B', targetCareer: 'Data Analyst', status: 'Completed', readiness: '86%' },
    { id: 'STU-103', name: 'Meera Joseph', batch: '2026 Batch A', targetCareer: 'AI / ML Specialist', status: 'Completed', readiness: '91%' },
    { id: 'STU-104', name: 'Arjun Nair', batch: '2027 Foundation', targetCareer: 'Embedded Systems', status: 'Not Started', readiness: '—' },
    { id: 'STU-105', name: 'Sneha Patel', batch: '2026 Batch B', targetCareer: 'Cloud Solutions', status: 'In Progress (40%)', readiness: '64%' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BrandNavbar currentApp="tuition-centre" badgeText="Tuition Centre Portal" />

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
            <span style={{ fontSize: '1.1rem' }}>🏫</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#171717' }}>
              Developer 2 Workspace — Tuition Centre Application
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#77736F' }}>
            <span>Target Branch: <strong style={{ color: '#FE6904' }}>feature/tuition-centre</strong></span>
            <span>Port: <strong style={{ color: '#171717' }}>3002</strong></span>
          </div>
        </div>

        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.03em' }}>
              Apex Career Academy Dashboard
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#77736F', marginTop: '0.5rem' }}>
              Monitor your student batches, sponsored career guidance allocation, and student readiness metrics.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary">+ Add Batch</button>
            <button className="btn-primary">+ Sponsor New Students</button>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Total Sponsored Students</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', marginTop: '0.35rem' }}>148</div>
            <span style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 600 }}>52 License Seats Free</span>
          </div>
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Assessments Completed</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', marginTop: '0.35rem' }}>112</div>
            <span style={{ fontSize: '0.75rem', color: '#77736F' }}>75.6% completion rate</span>
          </div>
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Cohort Readiness Average</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', marginTop: '0.35rem' }}>78.4%</div>
            <span style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 600 }}>+6.2% this month</span>
          </div>
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Active Batches</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', marginTop: '0.35rem' }}>4</div>
            <span style={{ fontSize: '0.75rem', color: '#77736F' }}>2026 Batch A & B, Foundation</span>
          </div>
        </div>

        {/* Student Roster Section */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #EAE7E2',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717' }}>
                Sponsored Student Cohorts
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#77736F' }}>
                Track individual assessment status and career focus.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'all' ? '#FFE5CE' : 'transparent',
                  color: activeTab === 'all' ? '#FE6904' : '#77736F',
                  fontWeight: activeTab === 'all' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                All Batches
              </button>
              <button
                onClick={() => setActiveTab('batch-a')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'batch-a' ? '#FFE5CE' : 'transparent',
                  color: activeTab === 'batch-a' ? '#FE6904' : '#77736F',
                  fontWeight: activeTab === 'batch-a' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Batch A
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#FAF9F7', borderBottom: '1px solid #EAE7E2', color: '#77736F' }}>
                  <th style={{ padding: '0.85rem 1.75rem', fontWeight: 600 }}>Student ID</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Batch</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Target Career</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Assessment</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Readiness</th>
                  <th style={{ padding: '0.85rem 1.75rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < students.length - 1 ? '1px solid #EAE7E2' : 'none' }}>
                    <td style={{ padding: '1rem 1.75rem', fontWeight: 600, color: '#77736F', fontSize: '0.8rem' }}>{student.id}</td>
                    <td style={{ padding: '1rem 1rem', fontWeight: 600, color: '#171717' }}>{student.name}</td>
                    <td style={{ padding: '1rem 1rem', color: '#77736F' }}>{student.batch}</td>
                    <td style={{ padding: '1rem 1rem', fontWeight: 500 }}>{student.targetCareer}</td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: student.status.includes('Completed') ? '#E8F5E9' : student.status.includes('Progress') ? '#FFE5CE' : '#F1F1F0',
                        color: student.status.includes('Completed') ? '#2E7D32' : student.status.includes('Progress') ? '#FE6904' : '#77736F',
                      }}>
                        {student.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1rem', fontWeight: 600, color: '#171717' }}>{student.readiness}</td>
                    <td style={{ padding: '1rem 1.75rem', textAlign: 'right' }}>
                      <button style={{
                        border: '1px solid #EAE7E2',
                        background: '#FFFFFF',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#171717',
                      }}>
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        ZHERO Monorepo Foundation — KSUM She Builds Hackathon 2026 • Developer 2 App (apps/tuition-centre)
      </footer>
    </div>
  );
}
