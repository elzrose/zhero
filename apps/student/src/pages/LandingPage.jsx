import React from 'react';

export function LandingPage({ onStartAssessment, onExploreCareers }) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        padding: '4rem 2rem 3rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 700,
          lineHeight: 1.2,
          color: '#171717',
          maxWidth: '780px',
          margin: '0 0 1rem 0',
        }}>
          Career discovery and practical roadmaps for students.
        </h1>

        <p style={{
          fontSize: '1rem',
          lineHeight: 1.6,
          color: '#77736F',
          maxWidth: '620px',
          margin: '0 0 2rem 0',
        }}>
          Find careers that match your interests, identify skills to build, and follow structured learning steps.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={onStartAssessment}
            className="btn-primary"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            Start assessment
          </button>

          <button
            onClick={onExploreCareers}
            className="btn-secondary"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            Browse careers
          </button>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
        <hr style={{ border: 'none', borderTop: '1px solid #EAE7E2', margin: '1rem 0 3rem' }} />
      </div>

      {/* How it works: Plain 3-column list */}
      <section style={{
        padding: '0 2rem 4rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#171717',
          marginBottom: '2rem',
        }}>
          How it works
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
        }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FE6904', marginBottom: '0.5rem' }}>
              1
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#171717', margin: '0 0 0.5rem 0' }}>
              Take the assessment
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#77736F', lineHeight: 1.5, margin: 0 }}>
              Answer questions about your academic interests, problem-solving habits, and work style.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FE6904', marginBottom: '0.5rem' }}>
              2
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#171717', margin: '0 0 0.5rem 0' }}>
              Review your matches
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#77736F', lineHeight: 1.5, margin: 0 }}>
              See career options matched to your profile with details on requirements and compensation.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FE6904', marginBottom: '0.5rem' }}>
              3
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#171717', margin: '0 0 0.5rem 0' }}>
              Follow your roadmap
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#77736F', lineHeight: 1.5, margin: 0 }}>
              Work through ordered milestones, practice projects, and study sessions to build readiness.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        borderTop: '1px solid #EAE7E2',
        backgroundColor: '#FFFFFF',
        fontSize: '0.85rem',
        color: '#77736F',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontWeight: 600, color: '#171717' }}>ZHERO</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
