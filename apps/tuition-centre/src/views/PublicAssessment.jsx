import React, { useState } from 'react';
import { ASSESSMENT_QUESTIONS } from '../data/mockData';
import { evaluateAssessmentResponses, getRecommendedCourses } from '../utils/engine';
import { useTuitionStore, storeActions } from '../data/store';

function getTodayIsoDate() {
  return new Date().toISOString().split('T')[0];
}

export function PublicAssessment({ onGoToCatalogue, onGoToDashboard }) {
  const store = useTuitionStore();
  const allCourses = store.courses || [];
  
  // URL Campaign parameter check
  const params = new URLSearchParams(window.location.search);
  const initialCampaign = params.get('campaign') || 'MISSION2026';

  const [step, setStep] = useState(1); // 1 = Registration, 2 = Questions, 3 = Results
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    email: '',
    phone: '',
    education: 'Class 12 (Science / Computer Stream)',
    institution: '',
    campaignCode: initialCampaign
  });

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const handleStartQuestions = (e) => {
    e.preventDefault();
    if (!studentInfo.name || !studentInfo.email) {
      alert('Please provide your name and email address to begin.');
      return;
    }
    setStep(2);
  };

  const handleSelectOption = (optionIndex) => {
    const question = ASSESSMENT_QUESTIONS[currentQuestionIdx];
    const selectedOption = question.options[optionIndex];

    const updatedAnswers = [
      ...answers.filter(a => a.questionId !== question.id),
      { questionId: question.id, optionIndex, selectedOption }
    ];
    setAnswers(updatedAnswers);

    if (currentQuestionIdx < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Completed all questions! Evaluate results
      const results = evaluateAssessmentResponses(updatedAnswers);
      setAssessmentResult(results);

      // Compute recommended courses from centre
      const leadStub = {
        targetCareer: results.topCareer,
        strengths: results.strengths,
        skillGaps: results.skillGaps,
        readinessScore: results.topCareerAffinity
      };
      const matches = getRecommendedCourses(leadStub, allCourses);
      setRecommendedCourses(matches);

      // Persist lead into the tuition centre store
      storeActions.saveLead({
        name: studentInfo.name,
        email: studentInfo.email,
        phone: studentInfo.phone || '+91 94470 00000',
        education: studentInfo.education,
        institution: studentInfo.institution || 'Partner School/College',
        campaignCode: studentInfo.campaignCode,
        status: 'Assessed',
        assessmentCompleted: true,
        assessmentDate: getTodayIsoDate(),
        targetCareer: results.topCareer,
        readinessScore: results.topCareerAffinity,
        strengths: results.strengths,
        skillGaps: results.skillGaps,
        interestedCourseId: matches.length > 0 ? matches[0].course.id : null,
        notes: `Completed campaign ${studentInfo.campaignCode} diagnostic. Top matched career: ${results.topCareer} (${results.topCareerAffinity}% affinity).`,
        source: `Campaign ${studentInfo.campaignCode}`
      });

      setStep(3);
    }
  };

  const handleExpressCourseInterest = (course) => {
    // Transition or mark enquiry
    const existing = store.leads.find(l => l.email.toLowerCase() === studentInfo.email.toLowerCase());
    if (existing) {
      storeActions.saveLead({
        ...existing,
        status: 'Enquiry',
        interestedCourseId: course.id,
        notes: `${existing.notes} | Expressed direct interest in ${course.title}.`
      });
    }
    setEnquirySuccess(true);
    setTimeout(() => setEnquirySuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 1.5rem', minHeight: '85vh' }}>
      {/* Step 1: Initial Student Registration */}
      {step === 1 && (
        <div className="tc-card" style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="tc-badge tc-badge-yellow" style={{ marginBottom: '0.5rem' }}>
              🎯 ZHERO Adaptive Career Discovery
            </span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
              Free 5-Minute Student Career Assessment
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.4rem' }}>
              Sponsored by <strong>Apex Career & Coaching Academy</strong>. Uncover your cognitive strengths, emerging industry roles, and personalized learning roadmaps.
            </p>
          </div>

          <form onSubmit={handleStartQuestions}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                className="tc-input"
                placeholder="e.g. Meera Joseph"
                value={studentInfo.name}
                onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  className="tc-input"
                  placeholder="e.g. meera@example.com"
                  value={studentInfo.email}
                  onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  WhatsApp / Phone Number
                </label>
                <input
                  type="tel"
                  className="tc-input"
                  placeholder="e.g. +91 98470 12345"
                  value={studentInfo.phone}
                  onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Current Education Level
              </label>
              <select
                className="tc-select"
                value={studentInfo.education}
                onChange={(e) => setStudentInfo({ ...studentInfo, education: e.target.value })}
              >
                <option value="Class 10 / SSLC">Class 10 / SSLC</option>
                <option value="Class 11 / Plus One">Class 11 / Plus One</option>
                <option value="Class 12 (Science / Computer Stream)">Class 12 (Science / Computer Stream)</option>
                <option value="Class 12 (Commerce / Humanities)">Class 12 (Commerce / Humanities)</option>
                <option value="Diploma / Polytechnic Student">Diploma / Polytechnic Student</option>
                <option value="Undergraduate (B.Tech / B.Sc / BCA / B.Com)">Undergraduate (B.Tech / B.Sc / BCA / B.Com)</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                School, College or Institution Name
              </label>
              <input
                type="text"
                className="tc-input"
                placeholder="e.g. Model Engineering College, Thrikkakara"
                value={studentInfo.institution}
                onChange={(e) => setStudentInfo({ ...studentInfo, institution: e.target.value })}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              backgroundColor: '#FAF8F5',
              borderRadius: '8px',
              border: '1px solid var(--tc-border)',
              marginBottom: '1.75rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>
                Sponsoring Campaign Code:
              </span>
              <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.8rem' }}>
                {studentInfo.campaignCode}
              </span>
            </div>

            <button
              type="submit"
              className="tc-btn-primary"
              style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}
            >
              Start Diagnostic Test →
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Assessment Questions */}
      {step === 2 && (
        <div className="tc-card" style={{ maxWidth: '780px', margin: '0 auto', padding: '2.5rem' }}>
          {/* Progress Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8C6A05', textTransform: 'uppercase' }}>
                Diagnostic Question {currentQuestionIdx + 1} of {ASSESSMENT_QUESTIONS.length}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>
                {Math.round(((currentQuestionIdx + 1) / ASSESSMENT_QUESTIONS.length) * 100)}% Completed
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#EFECE6', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                width: `${((currentQuestionIdx + 1) / ASSESSMENT_QUESTIONS.length) * 100}%`,
                height: '100%',
                background: 'var(--tc-yellow-gradient)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Question Details */}
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="tc-badge tc-badge-neutral" style={{ marginBottom: '0.5rem' }}>
              {ASSESSMENT_QUESTIONS[currentQuestionIdx].category}
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#171717', lineHeight: 1.4, marginTop: '0.5rem' }}>
              {ASSESSMENT_QUESTIONS[currentQuestionIdx].question}
            </h2>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {ASSESSMENT_QUESTIONS[currentQuestionIdx].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                style={{
                  textAlign: 'left',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid var(--tc-border)',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  color: 'var(--tc-near-black)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  transition: 'all 0.15s ease',
                  boxShadow: 'var(--tc-shadow-sm)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--tc-primary-yellow)';
                  e.currentTarget.style.backgroundColor = 'var(--tc-yellow-cream)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--tc-border)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--tc-yellow-pale)',
                  color: '#8C6A05',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span style={{ lineHeight: 1.4 }}>{opt.text}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--tc-border)', paddingTop: '1rem' }}>
            <button
              onClick={() => {
                if (currentQuestionIdx > 0) setCurrentQuestionIdx(currentQuestionIdx - 1);
                else setStep(1);
              }}
              className="tc-btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              ← Previous
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>
              Select the option that best reflects your natural instinct
            </span>
          </div>
        </div>
      )}

      {/* Step 3: Diagnostic Results & Recommended Courses */}
      {step === 3 && assessmentResult && (
        <div>
          {/* Success Banner */}
          <div style={{
            background: 'var(--tc-card-gradient)',
            border: '1px solid #EED180',
            borderRadius: '20px',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: 'var(--tc-shadow-md)',
            marginBottom: '2.5rem'
          }}>
            <span className="tc-badge tc-badge-success" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>
              ✓ Diagnostic Complete • Profile Synced with Apex Career Academy
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
              Congratulations, {studentInfo.name}!
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--tc-muted-text)', maxWidth: '650px', margin: '0.5rem auto 1.5rem' }}>
              Your aptitude responses reveal strong potential in modern high-demand technology tracks.
            </p>

            {/* Top Match Hero Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--tc-primary-yellow)',
              padding: '0.85rem 1.75rem',
              borderRadius: '999px',
              boxShadow: 'var(--tc-shadow-yellow)',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🏆</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Top Matched Career Role
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717' }}>
                  {assessmentResult.topCareer}
                </div>
              </div>
              <div style={{
                background: 'var(--tc-yellow-pale)',
                color: '#8C6A05',
                fontWeight: 800,
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                {assessmentResult.topCareerAffinity}% Affinity
              </div>
            </div>

            {/* Strengths & Gaps Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', textAlign: 'left', marginTop: '1rem' }}>
              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tc-border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E7E34', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  ⚡ Identified Natural Strengths
                </div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--tc-charcoal)', lineHeight: 1.6 }}>
                  {assessmentResult.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tc-border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B78103', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  🎯 Key Skill Gaps to Bridge
                </div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--tc-charcoal)', lineHeight: 1.6 }}>
                  {assessmentResult.skillGaps.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Transparent Algorithm Disclaimer */}
            <p style={{ fontSize: '0.75rem', color: 'var(--tc-subtle-text)', marginTop: '1.5rem', fontStyle: 'italic' }}>
              * Rule-based explainable diagnostic engine evaluating cognitive aptitudes, project preferences, and skill intersections against industry occupational standards.
            </p>
          </div>

          {/* Recommended Courses from Tuition Centre */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171717' }}>
                  Tailored Tuition Centre Coaching Recommendations
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--tc-muted-text)' }}>
                  Selected courses by Apex Career Academy that bridge your exact skill gaps.
                </p>
              </div>
              <button onClick={onGoToCatalogue} className="tc-btn-secondary" style={{ fontSize: '0.85rem' }}>
                View All Courses →
              </button>
            </div>

            {enquirySuccess && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#EAF7EE',
                border: '1px solid #C3E6CB',
                color: '#1E7E34',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                ✓ Interest noted! An Apex Career Academy mentor will contact you with batch schedules and scholarship options.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {recommendedCourses.slice(0, 3).map((rec, idx) => (
                <div key={rec.course.id} className="tc-card" style={{
                  border: idx === 0 ? '2px solid var(--tc-primary-yellow)' : '1px solid var(--tc-border)',
                  background: idx === 0 ? 'var(--tc-card-gradient)' : '#FFFFFF'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        {idx === 0 && (
                          <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.7rem' }}>
                            ⭐ Best Match
                          </span>
                        )}
                        <span className="tc-badge tc-badge-neutral" style={{ fontSize: '0.7rem' }}>
                          {rec.course.category}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717' }}>
                        {rec.course.title}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--tc-muted-text)', margin: '0.35rem 0 0.75rem', maxWidth: '640px' }}>
                        {rec.course.description}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8C6A05' }}>
                        {rec.matchPercentage}%
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)', textTransform: 'uppercase' }}>
                        Alignment Score
                      </div>
                    </div>
                  </div>

                  {/* Explainable Factors */}
                  <div style={{
                    backgroundColor: '#FAF8F5',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--tc-border)',
                    margin: '0.75rem 0',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ fontWeight: 700, color: '#171717', marginBottom: '0.3rem' }}>
                      🔍 Why this course matches you:
                    </div>
                    <ul style={{ paddingLeft: '1.25rem', color: 'var(--tc-muted-text)', margin: 0 }}>
                      {rec.factors.map((f, fIdx) => (
                        <li key={fIdx}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills to acquire */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {rec.skillsToAcquire.slice(0, 4).map((s, sIdx) => (
                        <span key={sIdx} className="tc-badge tc-badge-yellow" style={{ fontSize: '0.7rem' }}>
                          + Learn {s}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleExpressCourseInterest(rec.course)}
                      className="tc-btn-primary"
                      style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
                    >
                      Express Interest in Batch →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--tc-border)', paddingTop: '1.5rem' }}>
            <button
              onClick={() => { setStep(1); setAnswers([]); }}
              className="tc-btn-secondary"
              style={{ marginRight: '1rem' }}
            >
              Retake Assessment
            </button>
            <button
              onClick={onGoToDashboard}
              className="tc-btn-outline"
            >
              View In Centre Workspace (Admin Demo) →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
