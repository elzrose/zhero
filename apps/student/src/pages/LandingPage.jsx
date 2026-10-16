import React from 'react';
import { ArrowRight, Compass, Building } from 'lucide-react';
import { DecorativeWave } from '../components/DecorativeWave';

export function LandingPage({ onStartAssessment, onExploreCareers }) {

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* HERO SECTION WITH POSTFLOW AESTHETIC */}
      <section style={{
        position: 'relative',
        paddingTop: '3.5rem',
        paddingBottom: '5rem',
        overflow: 'hidden',
        borderBottom: '1px solid #EAE7E2',
      }}>
        {/* Flowing Orange Ribbon / Wave Background */}
        <DecorativeWave />

        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 1.5rem',
          position: 'relative',
          zIndex: 1,
        }}>

          {/* Large Bold Headline with Orange Highlight */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.12,
            color: '#171717',
            maxWidth: '780px',
            marginBottom: '1.5rem',
          }}>
            Your future isn't one choice. It's a <span style={{ color: '#FE6904' }}>journey.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            color: '#77736F',
            maxWidth: '620px',
            marginBottom: '2.5rem',
          }}>
            Discover careers that match your natural strengths, understand the exact skills you need to build, and follow a personalized step-by-step roadmap toward your dream field.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '4rem',
          }}>
            <button
              onClick={onStartAssessment}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FE6904',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 700,
                padding: '0.9rem 1.85rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(254, 105, 4, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Start My Free Assessment</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onExploreCareers}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                color: '#171717',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '0.9rem 1.6rem',
                borderRadius: '12px',
                border: '1px solid #EAE7E2',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(23, 23, 23, 0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Explore 18+ Careers</span>
              <Compass size={18} color="#77736F" />
            </button>
          </div>

          {/* FLOATING 3D / TILTED DASHBOARD MOCKUP PREVIEW (PostFlow Inspiration) */}
          <div style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F8F7 100%)',
            borderRadius: '24px',
            border: '1px solid #EAE7E2',
            boxShadow: '0 25px 60px -15px rgba(23, 23, 23, 0.12), 0 0 0 1px rgba(254, 105, 4, 0.08)',
            padding: '1.75rem',
            maxWidth: '1080px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Mock Window Top Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1rem',
              borderBottom: '1px solid #EAE7E2',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F56' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F' }} />
                <span style={{ fontSize: '0.8rem', color: '#77736F', marginLeft: '10px', fontWeight: 500 }}>
                  ZHERO Student Intelligence Console — Active Session
                </span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '9999px',
                background: '#FFE5CE',
                color: '#FE6904',
              }}>
                Sponsored by Apex Career Academy
              </span>
            </div>

            {/* Live Interactive Preview Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {/* Card 1: Top Career Match */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '2px solid #FE6904',
                boxShadow: '0 4px 16px rgba(254, 105, 4, 0.1)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: '#FFE5CE',
                    color: '#FE6904',
                  }}>
                    94% Top Match
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#77736F' }}>₹8.5 – 18 LPA</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717', marginBottom: '0.35rem' }}>
                  Full Stack Software Engineer
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#77736F', marginBottom: '1rem' }}>
                  Strong alignment in Technical (95%) and Analytical (85%) cognitive preferences.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['React', 'Node.js', 'PostgreSQL', 'APIs'].map((s, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.7rem',
                      background: '#F8F8F7',
                      color: '#171717',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid #EAE7E2',
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 2: Skill Readiness Progress */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid #EAE7E2',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#77736F' }}>SKILL READINESS AUDIT</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FE6904' }}>72% Ready</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500 }}>Frontend Architecture</span>
                    <span style={{ color: '#77736F' }}>Level 4 / 5</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#EAE7E2', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '80%', height: '100%', background: '#FE6904' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500 }}>REST API Design</span>
                    <span style={{ color: '#77736F' }}>Level 3 / 4</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#EAE7E2', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '65%', height: '100%', background: '#FA9B2A' }} />
                  </div>
                </div>
              </div>

              {/* Card 3: Active Roadmap Step */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid #EAE7E2',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#77736F' }}>ACTIVE MILESTONE</span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: '#E8F5E9',
                    color: '#2E7D32',
                  }}>
                    In Progress
                  </span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#171717', marginBottom: '0.25rem' }}>
                  Phase 2: React Component Mastery
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#77736F', marginBottom: '0.85rem' }}>
                  Suggested resource: MDN Web Docs & freeCodeCamp
                </p>
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: '#FFE5CE',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#FE6904',
                }}>
                  Next: Complete mini-project task list →
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-STEP VALUE PROPOSITION */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#FE6904',
            fontWeight: 700,
          }}>
            How ZHERO Works
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em', marginTop: '0.5rem' }}>
            From uncertainty to a practical, step-by-step career path
          </h2>
          <p style={{ fontSize: '1rem', color: '#77736F', maxWidth: '580px', margin: '0.75rem auto 0' }}>
            We don't just give you quiz scores. We connect discovery with real skills, curated resources, and milestones.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Step 1 */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#FFE5CE',
              color: '#FE6904',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              marginBottom: '1.25rem',
            }}>
              1
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717', marginBottom: '0.65rem' }}>
              Complete the 5-Minute Assessment
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#77736F', lineHeight: 1.6 }}>
              Answer 16 engaging scenario questions evaluating your analytical, creative, social, technical, practical, and organizational preferences.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#FFE5CE',
              color: '#FE6904',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              marginBottom: '1.25rem',
            }}>
              2
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717', marginBottom: '0.65rem' }}>
              Discover Top-5 Aligned Careers
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#77736F', lineHeight: 1.6 }}>
              Our deterministic scoring engine analyzes match proximity across 18+ high-growth domains, giving you clear explanations and salary brackets.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#FFE5CE',
              color: '#FE6904',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              marginBottom: '1.25rem',
            }}>
              3
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717', marginBottom: '0.65rem' }}>
              Follow Your Personalized Roadmap
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#77736F', lineHeight: 1.6 }}>
              Audit your skill gaps, check off bite-sized learning milestones, and tap into vetted beginner tutorials and starter projects.
            </p>
          </div>
        </div>
      </section>

      {/* SPONSORED BY INSTITUTIONS CALLOUT */}
      <section style={{ backgroundColor: '#F8F8F7', padding: '4rem 1.5rem', borderTop: '1px solid #EAE7E2', borderBottom: '1px solid #EAE7E2' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #EAE7E2',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#171717',
            marginBottom: '1.25rem',
          }}>
            <Building size={16} color="#FE6904" />
            <span>Institutional Sponsorship Model</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
            Core career guidance is 100% free for students.
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#77736F', marginTop: '0.75rem', lineHeight: 1.6 }}>
            ZHERO partners with forward-thinking tuition centres, high schools, and colleges who sponsor your access as part of their educational support program. No paywalls, no hidden subscriptions.
          </p>
        </div>
      </section>

      {/* FINAL ENCOURAGING CTA */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.03em' }}>
            Ready to find your path?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#77736F', marginTop: '1rem', marginBottom: '2rem' }}>
            Take the 5-minute assessment today and uncover career pathways that fit your strengths.
          </p>
          <button
            onClick={onStartAssessment}
            style={{
              backgroundColor: '#FE6904',
              color: '#FFFFFF',
              fontSize: '1.1rem',
              fontWeight: 700,
              padding: '1rem 2.25rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(254, 105, 4, 0.4)',
            }}
          >
            Start Assessment Now →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '2.5rem 1.5rem',
        borderTop: '1px solid #EAE7E2',
        backgroundColor: '#FFFFFF',
        fontSize: '0.85rem',
        color: '#77736F',
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <strong style={{ color: '#171717', fontSize: '1rem' }}>ZHERO</strong> — She Builds Hackathon 2026
          </div>
          <div>
            Student Career Guidance Platform • Developer 1 Working Branch
          </div>
        </div>
      </footer>
    </div>
  );
}
