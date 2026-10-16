import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  HelpCircle,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Play,
  Award,
  AlertTriangle,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { aiAssessmentService } from '../../services/aiAssessmentService';
import { storageService } from '../../services/storageService';

export function Stage3PreliminaryAnalysis({ onProceedToStage4, onBackToStage2 }) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [expandedCareerId, setExpandedCareerId] = useState(null);
  const [activeSimulation, setActiveSimulation] = useState(null); // careerId for micro-task
  const [simAnswer, setSimAnswer] = useState('');
  const [simCompleted, setSimCompleted] = useState({});

  useEffect(() => {
    // Check if we already have saved stage 3 analysis
    const saved = storageService.getStage3Preliminary();
    const simResults = storageService.getSimulationResults() || {};
    setSimCompleted(simResults);

    if (saved && saved.careers && saved.careers.length > 0) {
      setAnalysis(saved);
      setExpandedCareerId(saved.careers[0]?.id || null);
      setLoading(false);
    } else {
      // Synthesize fresh analysis using context and conversation
      const context = storageService.getStage1Context();
      const conversation = storageService.getStage2Conversation();

      aiAssessmentService.generateAnalysis(context, conversation).then((res) => {
        setAnalysis(res);
        if (res.careers && res.careers.length > 0) {
          setExpandedCareerId(res.careers[0].id);
        }
        storageService.saveStage3Preliminary(res);
        setLoading(false);
      });
    }
  }, []);

  const handleCompleteSimulation = (careerId, title) => {
    if (!simAnswer.trim()) return;
    const resultObj = {
      careerId,
      careerTitle: title,
      submittedWork: simAnswer,
      completedAt: new Date().toISOString(),
      demonstratedSkill: 'Analytical reasoning & structured problem breakdown',
    };
    storageService.saveSimulationResult(careerId, resultObj);
    setSimCompleted((prev) => ({ ...prev, [careerId]: resultObj }));
    setActiveSimulation(null);
    setSimAnswer('');
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '3rem auto',
        textAlign: 'center',
        padding: '3rem 2rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #EAE7E2',
        boxShadow: '0 4px 20px rgba(23,23,23,0.03)',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          backgroundColor: '#FFE5CE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          color: '#FE6904',
        }}>
          <Sparkles size={32} style={{ animation: 'spin 3s linear infinite' }} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
          Synthesizing Preliminary Career Pathways
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#77736F', maxWidth: '520px', margin: '0 auto', lineHeight: '1.6' }}>
          Correlating your expressed interests, self-reported skills, and conversational problem-solving patterns. All recommendations remain preliminary until human counselling.
        </p>
      </div>
    );
  }

  const careers = analysis?.careers || [];
  const synthesis = analysis?.synthesis || {};

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Prominent Mandatory Badge: Awaiting Human Review */}
      <div style={{
        backgroundColor: '#FFFBEB',
        border: '1.5px solid #F59E0B',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.08)',
      }}>
        <div style={{
          padding: '8px',
          backgroundColor: '#FEF3C7',
          borderRadius: '10px',
          color: '#B45309',
          flexShrink: 0,
        }}>
          <ShieldAlert size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#92400E' }}>
              AI-generated preliminary guidance — awaiting human review
            </span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: '#FDE68A',
              color: '#78350F',
            }}>
              Stage 3 of 6
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#78350F', margin: '6px 0 0 0', lineHeight: '1.5' }}>
            These paths reflect AI pattern recognition of your answers so far. ZHERO does not let an algorithm make life choices for you. In <strong>Stage 4</strong>, you will review these paths with a dedicated career counsellor who will help test, refine, and humanize these options.
          </p>
        </div>
      </div>

      {/* Synthesis Evidence Matrix Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(23, 23, 23, 0.03)',
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', margin: '0 0 1rem 0' }}>
          What We Heard vs. What We Inferred
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}>
          {/* Explicit Interests */}
          <div style={{
            backgroundColor: '#F8F8F7',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #EAE7E2',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FE6904', textTransform: 'uppercase', marginBottom: '6px' }}>
              1. What You Explicitly Said
            </div>
            <div style={{ fontSize: '0.85rem', color: '#171717', lineHeight: '1.5' }}>
              {synthesis.explicitInterests?.join(', ') || 'Exploration of varied interests and hands-on topics.'}
            </div>
          </div>

          {/* Reported Skills */}
          <div style={{
            backgroundColor: '#F8F8F7',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #EAE7E2',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', marginBottom: '6px' }}>
              2. Student-Reported Skills
            </div>
            <div style={{ fontSize: '0.85rem', color: '#171717', lineHeight: '1.5' }}>
              {synthesis.reportedSkills?.join(', ') || 'Foundation coursework and emerging interests.'}
            </div>
          </div>

          {/* Stated Concerns */}
          <div style={{
            backgroundColor: '#F8F8F7',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #EAE7E2',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', marginBottom: '6px' }}>
              3. Expressed Doubts / Priorities
            </div>
            <div style={{ fontSize: '0.85rem', color: '#171717', lineHeight: '1.5' }}>
              {synthesis.statedConcerns || 'Seeking clarity on career fit and practical preparation.'}
            </div>
          </div>

          {/* AI Hypotheses */}
          <div style={{
            backgroundColor: '#F8F8F7',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #EAE7E2',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EC4899', textTransform: 'uppercase', marginBottom: '6px' }}>
              4. AI Hypotheses (For Review)
            </div>
            <div style={{ fontSize: '0.85rem', color: '#171717', lineHeight: '1.5' }}>
              {synthesis.aiHypotheses || 'High affinity for problem solving and design thinking.'}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended 5 Careers List */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#171717', margin: 0 }}>
              Top 5 Preliminary Career Explorations
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#77736F', margin: '4px 0 0 0' }}>
              Indicative affinity based on evidence. Expand any path to view supporting answers and try a 2-minute micro-simulation.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {careers.map((career, idx) => {
            const isExpanded = expandedCareerId === career.id;
            const hasSim = !!simCompleted[career.id];

            return (
              <div
                key={career.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: isExpanded ? '1.5px solid #FE6904' : '1px solid #EAE7E2',
                  boxShadow: isExpanded ? '0 6px 24px rgba(254, 105, 4, 0.08)' : '0 2px 8px rgba(23, 23, 23, 0.02)',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                }}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedCareerId(isExpanded ? null : career.id)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: idx === 0 ? '#FFE5CE' : '#F8F8F7',
                      color: idx === 0 ? '#FE6904' : '#171717',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                    }}>
                      #{idx + 1}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#171717' }}>
                          {career.title}
                        </h4>
                        {hasSim && (
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            backgroundColor: '#ECFDF5',
                            color: '#047857',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            <CheckCircle2 size={12} /> Simulation Tried
                          </span>
                        )}
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#77736F' }}>
                        {career.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: '#77736F', fontWeight: 600 }}>Indicative Affinity</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FE6904' }}>
                        {career.matchScore}%
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={20} color="#77736F" /> : <ChevronDown size={20} color="#77736F" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{
                    padding: '0 1.5rem 1.5rem 1.5rem',
                    borderTop: '1px solid #EAE7E2',
                    backgroundColor: '#FAFAF9',
                  }}>
                    {/* Why this interests you & Supporting Evidence */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1rem',
                      marginTop: '1.25rem',
                    }}>
                      <div style={{
                        backgroundColor: '#FFFFFF',
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: '1px solid #EAE7E2',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <Lightbulb size={16} color="#FE6904" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171717' }}>
                            Why It May Interest You
                          </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
                          {career.whyInterest}
                        </p>
                      </div>

                      <div style={{
                        backgroundColor: '#FFFFFF',
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: '1px solid #EAE7E2',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <TrendingUp size={16} color="#10B981" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171717' }}>
                            Supporting Answers & Conversational Evidence
                          </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
                          {career.supportingEvidence}
                        </p>
                      </div>
                    </div>

                    {/* Work Example & Potential Challenges */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1rem',
                      marginTop: '1rem',
                    }}>
                      <div style={{
                        backgroundColor: '#FFFFFF',
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: '1px solid #EAE7E2',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <Briefcase size={16} color="#6366F1" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171717' }}>
                            Realistic Day-In-The-Life Work Example
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
                          {career.workExample}
                        </p>
                      </div>

                      <div style={{
                        backgroundColor: '#FFFFFF',
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: '1px solid #EAE7E2',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <AlertTriangle size={16} color="#F59E0B" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171717' }}>
                            Potential Challenges & Trade-Offs
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
                          {career.challenges}
                        </p>
                      </div>
                    </div>

                    {/* Questions to Discuss with Counsellor */}
                    <div style={{
                      marginTop: '1rem',
                      backgroundColor: '#FFFFFF',
                      padding: '1.25rem',
                      borderRadius: '14px',
                      border: '1px solid #EAE7E2',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <HelpCircle size={16} color="#FE6904" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171717' }}>
                          Key Questions To Discuss With Human Counsellor (Stage 4)
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
                        "{career.counsellingQuestions}"
                      </p>
                    </div>

                    {/* Micro Simulation Challenge Section */}
                    <div style={{
                      marginTop: '1.25rem',
                      padding: '1.25rem',
                      backgroundColor: '#FFE5CE',
                      borderRadius: '14px',
                      border: '1px solid #FA9B2A',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Play size={16} color="#FE6904" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#171717' }}>
                              2-Minute Career Micro-Simulation: {career.title}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#77736F', margin: '4px 0 0 0' }}>
                            {career.simulationPrompt}
                          </p>
                        </div>

                        {!hasSim && activeSimulation !== career.id && (
                          <button
                            onClick={() => {
                              setActiveSimulation(career.id);
                              setSimAnswer('');
                            }}
                            style={{
                              backgroundColor: '#FE6904',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '0.825rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Try Micro-Task
                          </button>
                        )}
                      </div>

                      {/* Active mini challenge form */}
                      {activeSimulation === career.id && (
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #FA9B2A' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717', display: 'block', marginBottom: '6px' }}>
                            Your solution or thoughts (1–3 sentences):
                          </label>
                          <textarea
                            rows={3}
                            value={simAnswer}
                            onChange={(e) => setSimAnswer(e.target.value)}
                            placeholder="Type how you would approach this scenario..."
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1px solid #EAE7E2',
                              fontSize: '0.85rem',
                              color: '#171717',
                              outline: 'none',
                              backgroundColor: '#FFFFFF',
                            }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                            <button
                              onClick={() => setActiveSimulation(null)}
                              style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #77736F',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                color: '#171717',
                                cursor: 'pointer',
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleCompleteSimulation(career.id, career.title)}
                              disabled={!simAnswer.trim()}
                              style={{
                                backgroundColor: '#171717',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '6px 16px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: !simAnswer.trim() ? 'not-allowed' : 'pointer',
                              }}
                            >
                              Save Evidence
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Completed result indicator */}
                      {hasSim && (
                        <div style={{
                          marginTop: '8px',
                          fontSize: '0.8rem',
                          color: '#047857',
                          backgroundColor: '#ECFDF5',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #A7F3D0',
                        }}>
                          <strong>Demonstrated Task Evidence:</strong> "{simCompleted[career.id].submittedWork}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1.5rem',
        borderTop: '1px solid #EAE7E2',
      }}>
        <button
          onClick={onBackToStage2}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #EAE7E2',
            padding: '10px 18px',
            borderRadius: '10px',
            color: '#171717',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Back to AI Chat
        </button>

        <button
          onClick={onProceedToStage4}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FE6904',
            color: '#FFFFFF',
            border: 'none',
            padding: '12px 26px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(254, 105, 4, 0.3)',
          }}
        >
          Book Human Virtual Counselling <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
