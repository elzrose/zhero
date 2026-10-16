import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Check,
  TrendingUp,
  DollarSign,
  Briefcase,
  Sparkles,
  Award,
  Layers,
  BookOpen,
  Star,
  Zap,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { CAREERS_DATA } from '../../data/careersData';

// Helper to sanitize robotic AI wording and generate neat visual tags
function formatWhyFit(whyFitText) {
  if (!whyFitText) {
    return {
      cleanText: 'Strongly aligns with your background, analytical interests, and cognitive assessment patterns.',
      tags: ['Analytical Problem Solving', 'Technical Curiosity'],
    };
  }

  // Clean clinical or negative AI phrasing into constructive strength framing
  const cleaned = whyFitText
    .replace(/while the low social score is accommodated by[^\.]*\./gi, 'emphasizing independent focus, analytical depth, and autonomous execution.')
    .replace(/their low social interaction score/gi, 'their preference for focused, autonomous execution')
    .replace(/low social score is accommodated[^\.]*\./gi, 'providing an environment for deep individual focus.')
    .replace(/low social score/gi, 'autonomous execution')
    .replace(/while creativity is low,/gi, 'with a sharp focus on engineering precision,')
    .replace(/creativity is low[^\.]*\./gi, 'focuses primarily on structured, systematic execution.')
    .replace(/low creativity/gi, 'structured execution')
    .replace(/their low/gi, 'their focused')
    .trim();

  // Extract intelligent highlight tags
  const tags = [];
  if (/analytical|logical|problem-solving|complex/i.test(cleaned)) tags.push('Analytical Precision');
  if (/technical|code|software|infrastructure|api|system/i.test(cleaned)) tags.push('Technical Mastery');
  if (/design|user|interface|visual|experience/i.test(cleaned)) tags.push('User-Centric Design');
  if (/data|math|metric|analytics|predict/i.test(cleaned)) tags.push('Data-Driven Logic');
  if (/individual|independent|autonomous|deep/i.test(cleaned)) tags.push('Autonomous Execution');
  if (tags.length === 0) tags.push('High Aptitude Fit', 'Practical Reasoning');

  return { cleanText: cleaned, tags: tags.slice(0, 3) };
}

// Helper to provide specific market outlook commentary
function getMarketOutlookDetail(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('data') || t.includes('ai') || t.includes('machine')) {
    return 'Surging enterprise demand driven by GenAI, automated analytics, and predictive modeling.';
  }
  if (t.includes('design') || t.includes('ux') || t.includes('ui') || t.includes('product')) {
    return 'Critical focus on conversion, frictionless onboarding, and consumer digital experiences.';
  }
  if (t.includes('cloud') || t.includes('devops') || t.includes('security')) {
    return 'Mission-critical demand for scalable infrastructure, reliability, and security hardening.';
  }
  if (t.includes('mobile') || t.includes('app')) {
    return 'Steady hiring across consumer tech, fintech, and cross-platform application ecosystems.';
  }
  return 'High sustained hiring velocity across venture-backed startups and global tech enterprises.';
}

export function Stage5CareerComparison({ onProceedToChoose, onBackToStage4 }) {
  const preliminary = storageService.getStage3Preliminary() || {};
  const context = storageService.getStage1Context() || {};

  // Top 5 recommended careers from assessment
  const topRecommendations = useMemo(() => {
    if (preliminary?.careers && preliminary.careers.length > 0) {
      return preliminary.careers.slice(0, 5);
    }
    return CAREERS_DATA.slice(0, 5).map((c, idx) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      matchScore: 95 - idx * 4,
      description: c.description,
      whyFit: `Directly aligns with your interest in "${context.descriptiveInterests?.slice(0, 80) || 'problem solving'}" and your ${context.courseStream || 'technical'} coursework.`,
      keyStrengths: c.requiredSkills?.map((s) => s.name)?.slice(0, 3) || ['Analytical Thinking', 'Problem Solving', 'Creativity'],
      skillsToDevelop: c.requiredSkills?.map((s) => s.name)?.slice(3, 5) || ['Advanced System Design', 'Project Execution'],
      workExample: c.starterProject?.title || 'Build an interactive web application with structured APIs.',
    }));
  }, [preliminary, context]);

  // Enrich any career item with catalogue metadata
  const enrichCareer = (c) => {
    const matchedCd = CAREERS_DATA.find((cd) =>
      cd.id === c.id ||
      cd.title.toLowerCase() === c.title?.toLowerCase() ||
      cd.title.toLowerCase().includes(c.title?.toLowerCase()) ||
      (c.title && c.title.toLowerCase().includes(cd.title.toLowerCase()))
    );

    const strengths = c.keyStrengths && c.keyStrengths.length > 0
      ? c.keyStrengths
      : (matchedCd?.requiredSkills?.map((s) => s.name)?.slice(0, 3) || ['Problem Solving', 'Critical Thinking', 'Adaptability']);

    const toLearn = c.skillsToDevelop && c.skillsToDevelop.length > 0
      ? c.skillsToDevelop
      : (matchedCd?.requiredSkills?.slice(3, 6)?.map((s) => s.name) || ['Advanced System Architecture', 'Cloud Deployment']);

    const avgSal = matchedCd?.avgSalary || '₹7.5 – 18 LPA';
    const salParts = avgSal.replace('₹', '').split('–');
    const entrySal = salParts[0]?.trim() ? `₹${salParts[0].trim()} LPA` : '₹7.5 LPA';
    const seniorSal = salParts[1]?.trim() ? `₹${salParts[1].trim()}` : '₹18+ LPA';

    return {
      id: c.id || matchedCd?.id || `career-${c.title?.toLowerCase().replace(/\s+/g, '-')}`,
      title: c.title || matchedCd?.title || 'Specialized Role',
      category: c.category || matchedCd?.category || 'Technology & Innovation',
      matchScore: c.matchScore || (matchedCd ? 90 : 85),
      description: c.description || matchedCd?.description || 'Build modern software solutions and drive real impact.',
      whyFit: c.whyFit || `Strongly aligns with your background in ${context.courseStream || 'your course'} and your stated interests.`,
      entrySalary: entrySal,
      seniorSalary: seniorSal,
      avgSalary: avgSal,
      growthRate: matchedCd?.growthRate || '+24% YoY',
      workEnvironment: matchedCd?.workEnvironment || (matchedCd?.typicalDay ? 'Agile team collaboration with hybrid remote flexibility' : 'Modern, collaborative tech workspace'),
      typicalDay: matchedCd?.typicalDay || 'Daily sprint standups, deep focus problem solving, code reviews, and cross-functional planning.',
      keyStrengths: strengths,
      skillsToDevelop: toLearn,
      starterProject: {
        title: matchedCd?.starterProject?.title || c.workExample || `${c.title || 'Practical'} Milestone Project`,
        description: matchedCd?.starterProject?.description || 'Build an end-to-end practical solution validating domain competencies.',
        timeEstimate: matchedCd?.starterProject?.timeEstimate || '2 – 3 weeks',
      },
      educationPathways: matchedCd?.educationPathways || [
        `Relevant Degree in ${context.courseStream || 'Computer Science / Engineering'}`,
        'Focused Coding Bootcamps & Verified Portfolio',
        'Self-directed hands-on project milestones',
      ],
      isTopRecommendation: Boolean(c.matchScore),
    };
  };

  // Build unified catalog map
  const { allCareersMap, allEnrichedTop } = useMemo(() => {
    const map = new Map();
    const enrichedTop = topRecommendations.map(enrichCareer);
    enrichedTop.forEach((c) => map.set(c.id, c));

    CAREERS_DATA.forEach((cd) => {
      if (!map.has(cd.id)) {
        map.set(cd.id, enrichCareer(cd));
      }
    });

    return { allCareersMap: map, allEnrichedTop: enrichedTop };
  }, [topRecommendations]);

  // Active compared IDs
  const [compareIds, setCompareIds] = useState(() => {
    const stored = storageService.getCompareList() || [];
    const valid = stored.filter((id) => allCareersMap.has(id));
    if (valid.length >= 2) return valid.slice(0, 3);

    // Default to top recommendations
    const defaults = [allEnrichedTop[0]?.id, allEnrichedTop[1]?.id, allEnrichedTop[2]?.id].filter(Boolean);
    if (defaults.length >= 2) {
      storageService.setCompareList(defaults);
      return defaults;
    }
    return ['full-stack-engineer', 'ui-ux-designer'];
  });

  // Safe compared careers list
  const comparedCareers = useMemo(() => {
    let list = compareIds.map((id) => allCareersMap.get(id)).filter(Boolean);
    if (list.length === 0) {
      const fallbackList = [allEnrichedTop[0], allEnrichedTop[1]].filter(Boolean);
      return fallbackList.length > 0 ? fallbackList : [enrichCareer(CAREERS_DATA[0]), enrichCareer(CAREERS_DATA[1])];
    }
    return list;
  }, [compareIds, allCareersMap, allEnrichedTop]);

  // Remaining recommendations that can be added
  const remainingRecommendations = useMemo(() => {
    return allEnrichedTop.filter((c) => !compareIds.includes(c.id));
  }, [allEnrichedTop, compareIds]);

  // Other catalogue careers that can be added
  const remainingOtherCareers = useMemo(() => {
    return Array.from(allCareersMap.values()).filter(
      (c) => !compareIds.includes(c.id) && !allEnrichedTop.some((tc) => tc.id === c.id)
    );
  }, [allCareersMap, compareIds, allEnrichedTop]);

  const [selectedAddCareerId, setSelectedAddCareerId] = useState('');

  const handleRemoveCareer = (id) => {
    if (comparedCareers.length <= 1) return;
    const updated = compareIds.filter((cid) => cid !== id);
    setCompareIds(updated);
    storageService.setCompareList(updated);
  };

  const handleAddCareer = (id) => {
    if (!id || compareIds.includes(id) || compareIds.length >= 3) return;
    const updated = [...compareIds, id];
    setCompareIds(updated);
    storageService.setCompareList(updated);
    setSelectedAddCareerId('');
  };

  const handleSelectAndProceed = (career) => {
    storageService.updateCareerGoal(career.title);
    storageService.setRoadmapForCareer(career.id);
    if (onProceedToChoose) {
      onProceedToChoose(career.id);
    }
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            padding: '5px 16px',
            borderRadius: '999px',
            backgroundColor: '#FFE5CE',
            color: '#FE6904',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '0.02em',
          }}>
            <GitCompare size={14} /> Stage 5 of 6: Decision Matrix
          </span>
        </div>

        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          color: '#0F172A',
          letterSpacing: '-0.03em',
          margin: '0 0 0.5rem 0',
        }}>
          Side-by-Side Career Comparison
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#64748B',
          margin: '0 auto',
          maxWidth: '680px',
          lineHeight: '1.6',
        }}>
          Compare verified AI alignment, compensation potential, market outlook, and milestone projects to make an informed, confident choice for your active roadmap.
        </p>
      </div>

      {/* ── COMPARISON MATRIX CARD ─────────────────────────────── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #E2E8F0',
        overflowX: 'auto',
        boxShadow: '0 12px 36px -4px rgba(15, 23, 42, 0.06), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        marginBottom: '2rem',
      }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left', minWidth: '880px' }}>
          <thead>
            <tr>
              {/* Left Column Header: Matrix Meta */}
              <th style={{
                padding: '1.75rem 1.5rem',
                width: '240px',
                verticalAlign: 'bottom',
                backgroundColor: '#F8FAFC',
                borderBottom: '2px solid #E2E8F0',
                borderRight: '1px solid #E2E8F0',
              }}>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#FE6904',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '4px',
                }}>
                  Decision Matrix
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                  Comparing {comparedCareers.length} Paths
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                  Select one to activate your dynamic roadmap
                </div>
              </th>

              {/* Career Column Headers (Uniform Card Design) */}
              {comparedCareers.map((c, index) => {
                const isBestFit = index === 0 && Boolean(c.matchScore && c.matchScore >= 95);
                return (
                  <th
                    key={c.id}
                    style={{
                      padding: '1.75rem 1.5rem',
                      minWidth: '280px',
                      verticalAlign: 'top',
                      borderBottom: '2px solid #E2E8F0',
                      borderRight: '1px solid #F1F5F9',
                      backgroundColor: isBestFit ? '#F0FDF4' : '#FFFFFF',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '190px', justifyContent: 'space-between' }}>
                      {/* Top Badges & Dismiss */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '999px',
                            backgroundColor: isBestFit ? '#DCFCE7' : '#F1F5F9',
                            color: isBestFit ? '#15803D' : '#475569',
                            border: isBestFit ? '1px solid #86EFAC' : '1px solid #CBD5E1',
                          }}>
                            {isBestFit ? (
                              <>
                                <Star size={12} fill="#15803D" color="#15803D" />
                                <span>Top Fit • {c.matchScore}%</span>
                              </>
                            ) : c.matchScore ? (
                              <>
                                <Zap size={12} color="#0284C7" />
                                <span>{c.matchScore}% Match</span>
                              </>
                            ) : (
                              <span>Catalogue</span>
                            )}
                          </span>

                          {comparedCareers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCareer(c.id)}
                              title="Remove from comparison"
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                color: '#94A3B8',
                                cursor: 'pointer',
                                padding: '5px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#FEE2E2';
                                e.currentTarget.style.color = '#EF4444';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#FFFFFF';
                                e.currentTarget.style.color = '#94A3B8';
                              }}
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>

                        {/* Title with fixed minimum height for exact baseline alignment */}
                        <div style={{ minHeight: '52px', marginBottom: '4px' }}>
                          <h3 style={{
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            color: '#0F172A',
                            margin: 0,
                            lineHeight: '1.3',
                            letterSpacing: '-0.02em',
                          }}>
                            {c.title}
                          </h3>
                        </div>

                        {/* Category */}
                        <div style={{
                          fontSize: '0.78rem',
                          color: '#64748B',
                          fontWeight: 600,
                          marginBottom: '16px',
                        }}>
                          {c.category}
                        </div>
                      </div>

                      {/* Primary Quick Select CTA (Perfect Vertical Alignment Across All Columns) */}
                      <button
                        type="button"
                        onClick={() => handleSelectAndProceed(c)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          backgroundColor: '#FE6904',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(254, 105, 4, 0.22)',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(254, 105, 4, 0.32)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(254, 105, 4, 0.22)';
                        }}
                      >
                        <span>Choose Path</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {/* ── 1. AI ASSESSMENT FIT & RATIONALE ── */}
            <tr>
              <td style={{
                padding: '1.75rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                color: '#0F172A',
                borderRight: '1px solid #E2E8F0',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                verticalAlign: 'top',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#FFE5CE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Sparkles size={15} color="#FE6904" />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontWeight: 800, color: '#0F172A' }}>
                      AI Assessment Fit
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
                      Cognitive & interest synergy
                    </span>
                  </div>
                </div>
              </td>

              {comparedCareers.map((c) => {
                const { cleanText, tags } = formatWhyFit(c.whyFit);
                return (
                  <td
                    key={c.id}
                    style={{
                      padding: '1.75rem 1.5rem',
                      borderRight: '1px solid #F1F5F9',
                      borderBottom: '1px solid #E2E8F0',
                      verticalAlign: 'top',
                    }}
                  >
                    {/* Score Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{
                        flex: 1,
                        height: '7px',
                        borderRadius: '999px',
                        backgroundColor: '#E2E8F0',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${c.matchScore}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                          borderRadius: '999px',
                        }} />
                      </div>
                      <span style={{
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        color: '#059669',
                        minWidth: '38px',
                        textAlign: 'right',
                      }}>
                        {c.matchScore}%
                      </span>
                    </div>

                    {/* Highlighted Feature Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                      {tags.map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#F0FDF4',
                            border: '1px solid #BBF7D0',
                            color: '#15803D',
                          }}
                        >
                          ✓ {t}
                        </span>
                      ))}
                    </div>

                    {/* Cleaned, Engaging Rationale Text */}
                    <p style={{
                      margin: 0,
                      fontSize: '0.84rem',
                      color: '#334155',
                      lineHeight: '1.6',
                      backgroundColor: '#F8FAFC',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                    }}>
                      {cleanText}
                    </p>
                  </td>
                );
              })}
            </tr>

            {/* ── 2. SALARY & COMPENSATION POTENTIAL ── */}
            <tr>
              <td style={{
                padding: '1.75rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                color: '#0F172A',
                borderRight: '1px solid #E2E8F0',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                verticalAlign: 'top',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <DollarSign size={15} color="#15803D" />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontWeight: 800, color: '#0F172A' }}>
                      Salary Range
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
                      Entry → Senior potential
                    </span>
                  </div>
                </div>
              </td>

              {comparedCareers.map((c) => (
                <td
                  key={c.id}
                  style={{
                    padding: '1.75rem 1.5rem',
                    borderRight: '1px solid #F1F5F9',
                    borderBottom: '1px solid #E2E8F0',
                    verticalAlign: 'top',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '6px',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#059669',
                    marginBottom: '8px',
                  }}>
                    <span>{c.entrySalary}</span>
                    <span style={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: 600 }}>→</span>
                    <span>{c.seniorSalary}</span>
                  </div>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#047857',
                  }}>
                    <span>🚀 ~2.2x Senior Career Growth</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* ── 3. MARKET OUTLOOK & HIRING VELOCITY ── */}
            <tr>
              <td style={{
                padding: '1.75rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                color: '#0F172A',
                borderRight: '1px solid #E2E8F0',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                verticalAlign: 'top',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#E0E7FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <TrendingUp size={15} color="#4338CA" />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontWeight: 800, color: '#0F172A' }}>
                      Market Outlook
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
                      Industry hiring trajectory
                    </span>
                  </div>
                </div>
              </td>

              {comparedCareers.map((c) => (
                <td
                  key={c.id}
                  style={{
                    padding: '1.75rem 1.5rem',
                    borderRight: '1px solid #F1F5F9',
                    borderBottom: '1px solid #E2E8F0',
                    verticalAlign: 'top',
                  }}
                >
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: '#EEF2FF',
                    color: '#4338CA',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    border: '1px solid #C7D2FE',
                    marginBottom: '10px',
                  }}>
                    <TrendingUp size={14} />
                    <span>{c.growthRate} Growth</span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: '1.55' }}>
                    {getMarketOutlookDetail(c.title)}
                  </p>
                </td>
              ))}
            </tr>

            {/* ── 4. WORK STYLE & ENVIRONMENT ── */}
            <tr>
              <td style={{
                padding: '1.75rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                color: '#0F172A',
                borderRight: '1px solid #E2E8F0',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                verticalAlign: 'top',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#EDE9FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Briefcase size={15} color="#6D28D9" />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontWeight: 800, color: '#0F172A' }}>
                      Work Style
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
                      Daily routine & environment
                    </span>
                  </div>
                </div>
              </td>

              {comparedCareers.map((c) => (
                <td
                  key={c.id}
                  style={{
                    padding: '1.75rem 1.5rem',
                    borderRight: '1px solid #F1F5F9',
                    borderBottom: '1px solid #E2E8F0',
                    verticalAlign: 'top',
                  }}
                >
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: '#0F172A',
                    marginBottom: '6px',
                  }}>
                    {c.workEnvironment}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', lineHeight: '1.55' }}>
                    {c.typicalDay}
                  </p>
                </td>
              ))}
            </tr>

            {/* ── 5. DEMONSTRATED STRENGTHS YOU BRING ── */}
            <tr>
              <td style={{
                padding: '1.75rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                color: '#0F172A',
                borderRight: '1px solid #E2E8F0',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                verticalAlign: 'top',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Check size={15} color="#15803D" />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontWeight: 800, color: '#0F172A' }}>
                      Strengths You Bring
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
                      Validated competencies
                    </span>
                  </div>
                </div>
              </td>

              {comparedCareers.map((c) => (
                <td
                  key={c.id}
                  style={{
                    padding: '1.75rem 1.5rem',
                    borderRight: '1px solid #F1F5F9',
                    borderBottom: '1px solid #E2E8F0',
                    verticalAlign: 'top',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {c.keyStrengths?.map((s, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          backgroundColor: '#F0FDF4',
                          border: '1px solid #BBF7D0',
                          color: '#15803D',
                          padding: '5px 11px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                      >
                        <Check size={12} /> {s}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* ── 6. SKILLS TO DEVELOP IN ROADMAP ── */}
            <tr>
              <td style={{
                padding: '1.75rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                color: '#0F172A',
                borderRight: '1px solid #E2E8F0',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                verticalAlign: 'top',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#FFE5CE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Layers size={15} color="#FE6904" />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontWeight: 800, color: '#0F172A' }}>
                      Skills to Build
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
                      Roadmap learning targets
                    </span>
                  </div>
                </div>
              </td>

              {comparedCareers.map((c) => (
                <td
                  key={c.id}
                  style={{
                    padding: '1.75rem 1.5rem',
                    borderRight: '1px solid #F1F5F9',
                    borderBottom: '1px solid #E2E8F0',
                    verticalAlign: 'top',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {c.skillsToDevelop?.map((s, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #CBD5E1',
                          color: '#334155',
                          padding: '5px 11px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                        }}
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* ── 7. HANDS-ON MILESTONE PROJECT ── */}
            <tr>
              <td style={{
                padding: '1.75rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                color: '#0F172A',
                borderRight: '1px solid #E2E8F0',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                verticalAlign: 'top',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Award size={15} color="#D97706" />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontWeight: 800, color: '#0F172A' }}>
                      Milestone Project
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
                      Hands-on capstone proof
                    </span>
                  </div>
                </div>
              </td>

              {comparedCareers.map((c) => (
                <td
                  key={c.id}
                  style={{
                    padding: '1.75rem 1.5rem',
                    borderRight: '1px solid #F1F5F9',
                    borderBottom: '1px solid #E2E8F0',
                    verticalAlign: 'top',
                  }}
                >
                  <div style={{
                    padding: '14px',
                    borderRadius: '14px',
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FDE68A',
                  }}>
                    <div style={{
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      color: '#92400E',
                      marginBottom: '4px',
                    }}>
                      {c.starterProject.title}
                    </div>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: '#78350F', lineHeight: '1.5' }}>
                      {c.starterProject.description}
                    </p>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      color: '#B45309',
                      border: '1px solid #FCD34D',
                    }}>
                      ⏱ Est. {c.starterProject.timeEstimate}
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* ── 8. EDUCATION & ENTRY PATHWAYS ── */}
            <tr>
              <td style={{
                padding: '1.75rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                color: '#0F172A',
                borderRight: '1px solid #E2E8F0',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                verticalAlign: 'top',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#DBEAFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <BookOpen size={15} color="#1D4ED8" />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontWeight: 800, color: '#0F172A' }}>
                      Entry Pathways
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
                      Academic & self-learning
                    </span>
                  </div>
                </div>
              </td>

              {comparedCareers.map((c) => (
                <td
                  key={c.id}
                  style={{
                    padding: '1.75rem 1.5rem',
                    borderRight: '1px solid #F1F5F9',
                    borderBottom: '1px solid #E2E8F0',
                    verticalAlign: 'top',
                  }}
                >
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#475569', lineHeight: '1.6' }}>
                    {c.educationPathways?.slice(0, 3).map((p, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{p}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* ── 9. BOTTOM ACTION COMMIT ROW ── */}
            <tr>
              <td style={{
                padding: '1.75rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                color: '#0F172A',
                borderRight: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                verticalAlign: 'middle',
              }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                  Ready to Choose?
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                  Instant personalized roadmap setup
                </div>
              </td>

              {comparedCareers.map((c) => (
                <td
                  key={c.id}
                  style={{
                    padding: '1.75rem 1.5rem',
                    borderRight: '1px solid #F1F5F9',
                    verticalAlign: 'middle',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectAndProceed(c)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #FE6904 0%, #FA9B2A 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '13px 20px',
                      borderRadius: '14px',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 6px 16px rgba(254, 105, 4, 0.28)',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(254, 105, 4, 0.38)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(254, 105, 4, 0.28)';
                    }}
                  >
                    <span>Commit to {c.title.split(' ')[0]}</span>
                    <ArrowRight size={16} />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── ADD MORE CAREERS DRAWER (if fewer than 3) ────────────── */}
      {comparedCareers.length < 3 && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          padding: '1.75rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                Add another career to this comparison
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                You can compare up to 3 paths side-by-side. Click a recommended match below or pick any path from the catalogue.
              </p>
            </div>

            {/* Dropdown Selector for Catalog Careers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={selectedAddCareerId}
                onChange={(e) => {
                  if (e.target.value) handleAddCareer(e.target.value);
                }}
                style={{
                  padding: '9px 16px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#0F172A',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="">+ Pick from full catalogue...</option>
                {remainingOtherCareers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Recommendation Chips */}
          {remainingRecommendations.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>
                Suggested additions:
              </span>
              {remainingRecommendations.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleAddCareer(c.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FE6904';
                    e.currentTarget.style.backgroundColor = '#FFF7ED';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                >
                  <Plus size={14} color="#FE6904" />
                  <span>{c.title}</span>
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800 }}>
                    {c.matchScore}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── NAVIGATION FOOTER ────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1.5rem',
        borderTop: '1px solid #E2E8F0',
      }}>
        <button
          type="button"
          onClick={onBackToStage4}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            padding: '12px 22px',
            borderRadius: '12px',
            color: '#334155',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#94A3B8';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#CBD5E1';
            e.currentTarget.style.color = '#334155';
          }}
        >
          <ArrowLeft size={16} /> Back to Top 5 Suggestions
        </button>

        <button
          type="button"
          onClick={() => handleSelectAndProceed(comparedCareers[0])}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            padding: '14px 30px',
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.18)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 23, 42, 0.28)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.18)';
          }}
        >
          <span>Choose Career & Activate Roadmap</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
