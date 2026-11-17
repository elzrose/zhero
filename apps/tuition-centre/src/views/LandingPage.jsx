import React, { useState } from 'react';

export function LandingPage({ onGoToDashboard, onGoToAssessment, onGoToCatalog }) {
  const [studentCohortSize, setStudentCohortSize] = useState(150);

  // Dynamic ROI calculation based on B2B2C student flywheel
  const estimatedLeads = Math.round(studentCohortSize * 2.2);
  const estimatedConversions = Math.round(estimatedLeads * 0.18);
  const estimatedRevenue = (estimatedConversions * 32000).toLocaleString('en-IN');

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section matching the PostFlow composition */}
      <section style={{
        position: 'relative',
        padding: '3.5rem 2rem 0',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden'
      }}>
        {/* Sweeping Elegant Ribbon Curves in #F5C842 Yellow Gradients (matching the screenshot's right-side graphic) */}
        <div style={{
          position: 'absolute',
          top: '2%',
          right: '-5%',
          width: '680px',
          height: '620px',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.95
        }}>
          <svg viewBox="0 0 700 650" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="yellowRibbonMain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0.8"/>
                <stop offset="35%" stopColor="#FDE382" stopOpacity="0.95"/>
                <stop offset="70%" stopColor="#F5C842" stopOpacity="1"/>
                <stop offset="100%" stopColor="#D89A12" stopOpacity="0.9"/>
              </linearGradient>
              <linearGradient id="yellowRibbonLight" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFDF7" stopOpacity="0.4"/>
                <stop offset="50%" stopColor="#FDF1C8" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#F5C842" stopOpacity="0.3"/>
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Ambient Glow */}
            <circle cx="500" cy="280" r="180" fill="url(#yellowRibbonLight)" opacity="0.6" filter="url(#softGlow)"/>

            {/* Dynamic Wave Ribbons */}
            <path
              d="M100 520 C 260 480, 420 320, 560 160 C 620 90, 680 40, 720 10"
              stroke="url(#yellowRibbonLight)"
              strokeWidth="2.5"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M120 540 C 280 490, 440 330, 580 180 C 640 110, 690 60, 730 30"
              stroke="url(#yellowRibbonLight)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />

            {/* Broad Sweeping Golden Gradient Ribbon Band */}
            <path
              d="M140 580 C 300 520, 450 360, 560 220 C 620 150, 670 90, 720 50 L 730 90 C 680 140, 620 210, 540 300 C 420 440, 260 580, 100 630 Z"
              fill="url(#yellowRibbonMain)"
              opacity="0.88"
            />

            {/* Inner Highlight Ribbon */}
            <path
              d="M190 610 C 340 550, 480 390, 590 250 C 640 190, 690 130, 740 90"
              stroke="#FFFBEA"
              strokeWidth="3.5"
              fill="none"
              opacity="0.9"
            />
            
            {/* Soft Sparkle Dots */}
            <circle cx="520" cy="200" r="3.5" fill="#E8B930" opacity="0.8"/>
            <circle cx="580" cy="160" r="2.5" fill="#F5C842" opacity="0.7"/>
            <circle cx="480" cy="260" r="4" fill="#D89A12" opacity="0.6"/>
            <circle cx="610" cy="230" r="3" fill="#E8B930" opacity="0.5"/>
          </svg>
        </div>

        {/* Hero Left Content Container */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '680px', textAlign: 'left', marginBottom: '3rem' }}>
            {/* Pill Tag with subtle orange/yellow border */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              border: '1px solid #EED180',
              backgroundColor: '#FFFDF5',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#8C6A05',
              marginBottom: '1.75rem',
              boxShadow: '0 1px 4px rgba(245, 200, 66, 0.12)'
            }}>
              <span>⚡</span> Turn 5-minute career assessments into qualified student enrollments
            </div>

            {/* Bold Headline matching PostFlow hierarchy */}
            <h1 style={{
              fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
              fontWeight: 800,
              color: '#171717',
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              marginBottom: '1.5rem'
            }}>
              Create a cohort of{' '}
              <span style={{
                color: '#C48A00',
                background: 'linear-gradient(135deg, #E6A800 0%, #B87B00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                student leads
              </span>{' '}
              in minutes.
            </h1>

            {/* Supporting Description Text */}
            <p style={{
              fontSize: '1.125rem',
              color: '#5E5B54',
              lineHeight: 1.6,
              marginBottom: '2.25rem',
              maxWidth: '600px'
            }}>
              Zhero Tuition Centre Platform creates, manages, and distributes adaptive career discovery assessments for coaching academies — automatically connecting student aptitudes to your specialized batches. No credit card required. Free live demo.
            </p>

            {/* Two Pill Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={onGoToDashboard}
                style={{
                  background: 'linear-gradient(135deg, #FAD75E 0%, #F5C842 50%, #E8B930 100%)',
                  color: '#171717',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '999px',
                  border: '1px solid #E2B52F',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(245, 200, 66, 0.38)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.15s ease'
                }}
              >
                Start for free — no credit card
              </button>

              <button
                onClick={scrollToHowItWorks}
                style={{
                  background: '#FFFFFF',
                  color: '#171717',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.6rem',
                  borderRadius: '999px',
                  border: '1px solid #E8E5DE',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                See how it works ↓
              </button>
            </div>
          </div>

          {/* Floating SaaS Dashboard Preview (matching the perspective/card layout of PostFlow) */}
          <div style={{
            position: 'relative',
            marginTop: '1rem',
            background: '#FFFFFF',
            borderRadius: '24px 24px 0 0',
            border: '1px solid #E8E5DE',
            borderBottom: 'none',
            boxShadow: '0 -10px 40px rgba(23, 23, 23, 0.06), 0 20px 60px rgba(245, 200, 66, 0.12)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '220px 1fr 240px',
            minHeight: '440px'
          }}>
            {/* Left Mock Sidebar */}
            <div style={{
              backgroundColor: '#FCFBFA',
              borderRight: '1px solid #EAE7E2',
              padding: '1.25rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingLeft: '0.5rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--tc-yellow-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#171717' }}>Z</div>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#171717' }}>Zhero</span>
              </div>

              {[
                { name: 'Dashboard', icon: '📊', active: false },
                { name: 'Cohort Library', icon: '📁', active: true },
                { name: 'All Batches', icon: '🗓️', indent: true },
                { name: 'Campaign QR', icon: '🎯', indent: true },
                { name: 'Subscriptions', icon: '💳' },
                { name: 'Settings', icon: '⚙️' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.75rem',
                  paddingLeft: item.indent ? '1.75rem' : '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: item.active ? 'var(--tc-yellow-pale)' : 'transparent',
                  color: item.active ? '#8C6A05' : '#5E5B54',
                  fontWeight: item.active ? 700 : 500,
                  fontSize: '0.8rem'
                }}>
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            {/* Center Main Workspace */}
            <div style={{ padding: '1.5rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#171717' }}>
                    Cohort Intelligence & Admissions
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#737067' }}>
                    Monthly view for campaign assessments and enrolled students.
                  </p>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717', background: '#F8F8F7', padding: '0.35rem 0.85rem', borderRadius: '8px', border: '1px solid #EAE7E2' }}>
                  October 2026
                </div>
              </div>

              {/* 5 Dynamic Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.65rem', marginBottom: '1.5rem' }}>
                {[
                  { day: 'MON', title: 'Mission 2026', tag: 'AI / ML', score: '92% match', color: 'var(--tc-yellow-cream)' },
                  { day: 'TUE', title: 'TechIgnite QR', tag: 'Web Dev', score: '84% match', color: '#FAF8F5' },
                  { day: 'WED', title: 'Polytechnic', tag: 'Embedded', score: '78% match', color: 'var(--tc-yellow-cream)' },
                  { day: 'THU', title: 'School Expo', tag: 'Data Science', score: '88% match', color: '#FAF8F5' },
                  { day: 'FRI', title: 'Counseling', tag: 'CyberSec', score: '81% match', color: 'var(--tc-yellow-cream)' },
                ].map((col, idx) => (
                  <div key={idx} style={{
                    backgroundColor: col.color,
                    border: '1px solid #EAE7E2',
                    borderRadius: '10px',
                    padding: '0.75rem 0.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#737067', marginBottom: '0.4rem' }}>{col.day}</div>
                    <div style={{
                      height: '52px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #FDE68A 0%, #F5C842 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#171717',
                      marginBottom: '0.35rem',
                      padding: '0.2rem'
                    }}>
                      {col.tag}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#171717' }}>{col.title}</div>
                    <div style={{ fontSize: '0.65rem', color: '#1E7E34', fontWeight: 600 }}>{col.score}</div>
                  </div>
                ))}
              </div>

              {/* Mini KPI summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: '#F8F8F7', borderRadius: '8px', border: '1px solid #EAE7E2' }}>
                  <div style={{ fontSize: '0.7rem', color: '#737067' }}>Total QR Scans</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717' }}>905</div>
                </div>
                <div style={{ padding: '0.75rem', background: '#F8F8F7', borderRadius: '8px', border: '1px solid #EAE7E2' }}>
                  <div style={{ fontSize: '0.7rem', color: '#737067' }}>Tests Completed</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8C6A05' }}>528</div>
                </div>
                <div style={{ padding: '0.75rem', background: '#EAF7EE', borderRadius: '8px', border: '1px solid #C3E6CB' }}>
                  <div style={{ fontSize: '0.7rem', color: '#1E7E34' }}>Course Admissions</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E7E34' }}>148</div>
                </div>
              </div>
            </div>

            {/* Right Search & Filter Sidebar */}
            <div style={{
              backgroundColor: '#FCFBFA',
              borderLeft: '1px solid #EAE7E2',
              padding: '1.25rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#737067', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  SEARCH
                </label>
                <input
                  type="text"
                  placeholder="Search student title..."
                  readOnly
                  value=""
                  style={{ width: '100%', padding: '0.45rem', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #EAE7E2', background: '#FFFFFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#737067', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  STATUS
                </label>
                <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #EAE7E2', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', color: '#171717' }}>
                  <span>All statuses</span>
                  <span>▾</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#737067', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  SORT
                </label>
                <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #EAE7E2', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', color: '#171717' }}>
                  <span>Newest</span>
                  <span>▾</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #EAE7E2' }}>
                <button
                  onClick={onGoToDashboard}
                  className="tc-btn-primary"
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}
                >
                  Open Full App →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section (anchored) */}
      <section id="how-it-works-section" style={{ padding: '5rem 2rem', backgroundColor: '#FAF8F5', borderTop: '1px solid #EAE7E2' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div className="tc-badge tc-badge-yellow" style={{ marginBottom: '1rem' }}>
            The Institutional Growth Flywheel
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#171717', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            How Zhero Connects Assessments to Course Admissions
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#737067', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            Transform generic career curiosity into qualified admissions with a complete 4-stage institutional lifecycle.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem', textAlign: 'left' }}>
            <div className="tc-card" style={{ borderTop: '4px solid #F5C842' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📲</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C6A05', textTransform: 'uppercase' }}>Step 1</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#171717', margin: '0.25rem 0 0.5rem' }}>
                Launch Assessment Campaigns
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#5E5B54', lineHeight: 1.6 }}>
                Generate custom QR codes and shareable links for school notice boards, seminars, and WhatsApp broadcasts. Offer a free 5-minute dynamic AI aptitude test.
              </p>
            </div>

            <div className="tc-card" style={{ borderTop: '4px solid #F5C842' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🧠</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C6A05', textTransform: 'uppercase' }}>Step 2</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#171717', margin: '0.25rem 0 0.5rem' }}>
                Diagnose Aptitudes & Gaps
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#5E5B54', lineHeight: 1.6 }}>
                As students take the assessment, Zhero continuously calculates their career affinities, cognitive strengths, and missing prerequisite skills in your pipeline.
              </p>
            </div>

            <div className="tc-card" style={{ borderTop: '4px solid #F5C842' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎯</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C6A05', textTransform: 'uppercase' }}>Step 3</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#171717', margin: '0.25rem 0 0.5rem' }}>
                Explainable Course Matching
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#5E5B54', lineHeight: 1.6 }}>
                Our transparent matching algorithm maps each student's profile directly to your courses and active batches with deterministic factor scores you can show parents.
              </p>
            </div>

            <div className="tc-card" style={{ borderTop: '4px solid #F5C842' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📈</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C6A05', textTransform: 'uppercase' }}>Step 4</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#171717', margin: '0.25rem 0 0.5rem' }}>
                Enrollment & Retention
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#5E5B54', lineHeight: 1.6 }}>
                Convert qualified leads into batch admissions. Monitor attendance, quiz performance, and retention risk indicators to ensure no learner falls behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Growth & ROI Estimator */}
      <section style={{ padding: '4.5rem 2rem', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div className="tc-card" style={{ padding: '2.5rem', background: '#FFFFFF', border: '1px solid #EED180', boxShadow: 'var(--tc-shadow-md)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="tc-badge tc-badge-yellow" style={{ marginBottom: '0.5rem' }}>
                Institutional Impact Calculator
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717' }}>
                Estimate Your Centre's Lead & Admission Expansion
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#737067' }}>
                Select your monthly student reach across partner schools and campus fairs.
              </p>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontWeight: 700 }}>
                <span>Monthly Assessment Reach:</span>
                <span style={{ color: '#8C6A05', fontSize: '1.2rem' }}>{studentCohortSize} Students</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={studentCohortSize}
                onChange={(e) => setStudentCohortSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--tc-primary-yellow)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', textAlign: 'center' }}>
              <div style={{ padding: '1.25rem', backgroundColor: '#FAF8F5', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#737067', textTransform: 'uppercase', fontWeight: 600 }}>Estimated Qualified Leads</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', marginTop: '0.25rem' }}>{estimatedLeads}</div>
                <div style={{ fontSize: '0.7rem', color: '#737067' }}>Based on 58% diagnostic completion</div>
              </div>
              <div style={{ padding: '1.25rem', backgroundColor: '#FAF8F5', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#737067', textTransform: 'uppercase', fontWeight: 600 }}>Projected Admissions</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E7E34', marginTop: '0.25rem' }}>{estimatedConversions}</div>
                <div style={{ fontSize: '0.7rem', color: '#737067' }}>18% counseling conversion</div>
              </div>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--tc-yellow-cream)', borderRadius: '12px', border: '1px solid #EED180' }}>
                <div style={{ fontSize: '0.75rem', color: '#8C6A05', fontWeight: 700, textTransform: 'uppercase' }}>Cohort Revenue Potential</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8C6A05', marginTop: '0.25rem' }}>₹{estimatedRevenue}</div>
                <div style={{ fontSize: '0.7rem', color: '#737067' }}>Avg ₹32,000 / coaching program</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner with Yellow Gradient */}
      <section style={{
        background: 'linear-gradient(135deg, #FFF9E0 0%, #F5C842 50%, #E8B930 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid #E2B52F'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#171717', marginBottom: '0.75rem' }}>
            Ready to Accelerate Your Tuition Centre Cohorts?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#3A3830', marginBottom: '2.25rem' }}>
            Enter the local demo environment to manage courses, batches, assessment leads, and explainable recommendations.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onGoToDashboard}
              style={{
                backgroundColor: '#171717',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '0.875rem 2.25rem',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}
            >
              Open Tuition Centre Workspace →
            </button>
            <button
              onClick={onGoToAssessment}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#171717',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '0.875rem 2rem',
                borderRadius: '999px',
                border: '1px solid #E2B52F',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              🎯 Try Student Career Test
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #EAE7E2',
        padding: '2.5rem 2rem',
        fontSize: '0.85rem',
        color: '#737067'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--tc-yellow-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#171717' }}>Z</div>
            <span style={{ fontWeight: 800, color: '#171717' }}>ZHERO</span> — KSUM She Builds Hackathon 2026 • Port 3002
          </div>
          <div style={{ display: 'flex', gap: '1.75rem' }}>
            <span onClick={onGoToDashboard} style={{ cursor: 'pointer', color: '#171717', fontWeight: 500 }}>Centre Workspace</span>
            <span onClick={onGoToCatalog} style={{ cursor: 'pointer', color: '#171717', fontWeight: 500 }}>Course Directory</span>
            <span onClick={onGoToAssessment} style={{ cursor: 'pointer', color: '#171717', fontWeight: 500 }}>Take Assessment</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
