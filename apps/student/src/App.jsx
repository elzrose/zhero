import React, { useState } from 'react';
import '@shared/styles/tokens.css';
import { BrandNavbar } from '@shared/components/BrandNavbar';

export default function App() {
  const [selectedCareer, setSelectedCareer] = useState(0);

  const careers = [
    {
      title: 'Full Stack Engineer',
      match: '94% Match',
      industry: 'Software & Technology',
      avgSalary: '₹9 - 18 LPA',
      demand: 'High',
      topSkills: ['React', 'Node.js', 'PostgreSQL', 'System Design'],
      missingSkills: ['Docker', 'Cloud CI/CD'],
    },
    {
      title: 'AI / ML Specialist',
      match: '88% Match',
      industry: 'Artificial Intelligence',
      avgSalary: '₹12 - 24 LPA',
      demand: 'Very High',
      topSkills: ['Python', 'Data Structures', 'Linear Algebra'],
      missingSkills: ['PyTorch', 'Vector Embeddings', 'LLM Fine-tuning'],
    },
    {
      title: 'UI/UX Product Designer',
      match: '82% Match',
      industry: 'Product Design',
      avgSalary: '₹8 - 15 LPA',
      demand: 'Growing',
      topSkills: ['Figma', 'Wireframing', 'User Research'],
      missingSkills: ['Design Systems', 'Micro-interactions'],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BrandNavbar currentApp="student" badgeText="Student Platform" />

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
            <span style={{ fontSize: '1.1rem' }}>🚀</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#171717' }}>
              Developer 1 Workspace — Student Application
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#77736F' }}>
            <span>Target Branch: <strong style={{ color: '#FE6904' }}>feature/student</strong></span>
            <span>Port: <strong style={{ color: '#171717' }}>3001</strong></span>
          </div>
        </div>

        {/* Sponsor Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          border: '1px solid #EAE7E2',
          borderRadius: '16px',
          padding: '1.25rem 1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(23, 23, 23, 0.03)',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#77736F', fontWeight: 600 }}>
              Sponsored Access
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#171717', marginTop: '2px' }}>
              Apex Career Academy — Kochi Campus
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#77736F', marginTop: '2px' }}>
              Your premium assessments and personalized career guidance are fully sponsored by your institution.
            </p>
          </div>
          <span style={{
            background: '#FFE5CE',
            color: '#FE6904',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}>
            Active Sponsor
          </span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.03em' }}>
            Welcome back, <span style={{ color: '#FE6904' }}>Ananya</span> 👋
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#77736F', marginTop: '0.5rem', maxWidth: '650px' }}>
            Continue your career readiness path. Complete your aptitude assessments to unlock tailored career recommendations and skill roadmaps.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Assessment Progress Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge">Assessment Status</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FE6904' }}>65% Complete</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              STEM & Engineering Aptitude Profile
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#77736F', marginBottom: '1.25rem' }}>
              13 of 20 questions completed. Your cognitive strengths currently indicate high problem decomposition & spatial logic.
            </p>
            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: '#EAE7E2', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, #FE6904, #FA9B2A)', borderRadius: '9999px' }} />
            </div>
            <button className="btn-primary" style={{ width: '100%' }}>
              Resume Assessment →
            </button>
          </div>

          {/* Skill-Gap Snapshot */}
          <div className="card">
            <span className="badge" style={{ marginBottom: '1rem' }}>Skill-Gap Analysis</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Recommended Next Milestone
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#77736F', marginBottom: '1rem' }}>
              Bridging these gaps increases your readiness score for <strong style={{ color: '#171717' }}>{careers[selectedCareer].title}</strong>:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {careers[selectedCareer].missingSkills.map((skill, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  background: '#F8F8F7',
                  borderRadius: '8px',
                  border: '1px solid #EAE7E2',
                  fontSize: '0.85rem',
                }}>
                  <span style={{ fontWeight: 500 }}>{skill}</span>
                  <span style={{ color: '#FE6904', fontSize: '0.75rem', fontWeight: 600 }}>+8% Readiness</span>
                </div>
              ))}
            </div>
            <button className="btn-secondary" style={{ width: '100%' }}>
              Explore Learning Roadmap
            </button>
          </div>
        </div>

        {/* Career Recommendations Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#171717' }}>
                Top Career Recommendations
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#77736F' }}>
                Generated based on your academic background, strengths, and market demand.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {careers.map((career, i) => (
              <div
                key={i}
                onClick={() => setSelectedCareer(i)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: selectedCareer === i ? '2px solid #FE6904' : '1px solid #EAE7E2',
                  boxShadow: selectedCareer === i ? '0 4px 20px rgba(254, 105, 4, 0.12)' : '0 1px 3px rgba(23, 23, 23, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: selectedCareer === i ? '#FFE5CE' : '#F8F8F7',
                    color: selectedCareer === i ? '#FE6904' : '#77736F',
                  }}>
                    {career.match}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#77736F' }}>{career.avgSalary}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717', marginBottom: '0.4rem' }}>
                  {career.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#77736F', marginBottom: '1rem' }}>
                  {career.industry} • Demand: <strong style={{ color: '#171717' }}>{career.demand}</strong>
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {career.topSkills.map((skill, sIdx) => (
                    <span key={sIdx} style={{
                      fontSize: '0.75rem',
                      background: '#F8F8F7',
                      color: '#171717',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid #EAE7E2',
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
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
        ZHERO Monorepo Foundation — KSUM She Builds Hackathon 2026 • Developer 1 App (apps/student)
      </footer>
    </div>
  );
}
