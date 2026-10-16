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
  ChevronDown
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { CAREERS_DATA } from '../../data/careersData';

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
    const entrySal = salParts[0]?.trim() ? `₹${salParts[0].trim()} LPA` : '₹6.5 LPA';
    const seniorSal = salParts[1]?.trim() ? `₹${salParts[1].trim()}` : '₹22+ LPA';

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
      growthRate: matchedCd?.growthRate || '+22% YoY',
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

    // Default to top 2 recommendations
    const defaults = [allEnrichedTop[0]?.id, allEnrichedTop[1]?.id].filter(Boolean);
    if (defaults.length >= 2) {
      storageService.setCompareList(defaults);
      return defaults;
    }
    return ['full-stack-engineer', 'ui-ux-designer'];
  });

  // Safe compared careers list (never empty)
  const comparedCareers = useMemo(() => {
    let list = compareIds.map((id) => allCareersMap.get(id)).filter(Boolean);
    if (list.length === 0) {
      // Auto-fallback
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
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3.5rem' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '4px 14px',
            borderRadius: '999px',
            backgroundColor: '#FFE5CE',
            color: '#FE6904',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <GitCompare size={14} /> Stage 5: Side-by-Side Evaluation
          </span>
        </div>

        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          color: '#171717',
          letterSpacing: '-0.025em',
          margin: '0 0 0.5rem 0',
        }}>
          Side-by-Side Career Comparison
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#77736F', margin: 0, maxWidth: '640px', marginInline: 'auto', lineHeight: '1.6' }}>
          Evaluate market growth, expected compensation, required skills, and hands-on milestone projects across your top choices before finalizing your roadmap.
        </p>
      </div>

      {/* Comparison Table Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #EAE7E2',
        overflowX: 'auto',
        boxShadow: '0 8px 30px rgba(23, 23, 23, 0.04)',
        marginBottom: '2rem',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '820px' }}>
          <thead>
            <tr style={{ backgroundColor: '#FBFBFA', borderBottom: '2px solid #EAE7E2' }}>
              <th style={{
                padding: '2rem 1.5rem',
                width: '240px',
                verticalAlign: 'bottom',
                borderRight: '1px solid #EAE7E2',
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FE6904', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Decision Matrix
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', marginTop: '2px' }}>
                  Comparing {comparedCareers.length} Paths
                </div>
              </th>

              {comparedCareers.map((c) => (
                <th key={c.id} style={{
                  padding: '1.75rem 1.5rem',
                  minWidth: '260px',
                  verticalAlign: 'top',
                  borderRight: '1px solid #F1EFEA',
                  position: 'relative',
                  backgroundColor: '#FFFFFF',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      backgroundColor: c.isTopRecommendation ? '#ECFDF5' : '#F4F4F3',
                      color: c.isTopRecommendation ? '#047857' : '#77736F',
                      border: c.isTopRecommendation ? '1px solid #A7F3D0' : '1px solid #EAE7E2',
                    }}>
                      {c.matchScore ? `${c.matchScore}% Match` : 'Catalogue'}
                    </span>

                    {comparedCareers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCareer(c.id)}
                        title="Remove from comparison"
                        style={{
                          backgroundColor: '#F8F8F7',
                          border: '1px solid #EAE7E2',
                          color: '#9CA3AF',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#171717',
                    margin: '0 0 4px 0',
                    lineHeight: '1.3',
                  }}>
                    {c.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600, marginBottom: '14px' }}>
                    {c.category}
                  </div>

                  {/* Quick Select Button */}
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
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(254, 105, 4, 0.2)',
                    }}
                  >
                    <span>Choose Path</span>
                    <ArrowRight size={14} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* 1. Match & Fit Rationale */}
            <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
              <td style={{
                padding: '1.5rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: '#171717',
                borderRight: '1px solid #EAE7E2',
                backgroundColor: '#FAFAF9',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="#FE6904" />
                  <span>AI Assessment Fit</span>
                </div>
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', borderRight: '1px solid #F1EFEA', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      flex: 1,
                      height: '8px',
                      borderRadius: '999px',
                      backgroundColor: '#EAE7E2',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${c.matchScore}%`,
                        height: '100%',
                        backgroundColor: '#10B981',
                        borderRadius: '999px',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#047857' }}>
                      {c.matchScore}%
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.55' }}>
                    {c.whyFit}
                  </p>
                </td>
              ))}
            </tr>

            {/* 2. Salary & Compensation */}
            <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
              <td style={{
                padding: '1.5rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: '#171717',
                borderRight: '1px solid #EAE7E2',
                backgroundColor: '#FAFAF9',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={16} color="#10B981" />
                  <span>Salary Range</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#77736F', fontWeight: 500, marginTop: '2px' }}>
                  Entry → Senior Potential
                </div>
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', borderRight: '1px solid #F1EFEA', verticalAlign: 'top' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10B981', marginBottom: '4px' }}>
                    {c.entrySalary} → {c.seniorSalary}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#77736F' }}>
                    Industry Average: <strong>{c.avgSalary}</strong>
                  </div>
                </td>
              ))}
            </tr>

            {/* 3. Market Growth */}
            <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
              <td style={{
                padding: '1.5rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: '#171717',
                borderRight: '1px solid #EAE7E2',
                backgroundColor: '#FAFAF9',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={16} color="#047857" />
                  <span>Market Outlook</span>
                </div>
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', borderRight: '1px solid #F1EFEA', verticalAlign: 'top' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#ECFDF5',
                    color: '#047857',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    marginBottom: '6px',
                  }}>
                    <TrendingUp size={14} /> {c.growthRate}
                  </span>
                  <div style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                    Expanding hiring demand across tech, startups, and enterprises.
                  </div>
                </td>
              ))}
            </tr>

            {/* 4. Work Setting & Style */}
            <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
              <td style={{
                padding: '1.5rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: '#171717',
                borderRight: '1px solid #EAE7E2',
                backgroundColor: '#FAFAF9',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={16} color="#6366F1" />
                  <span>Work Style & Setting</span>
                </div>
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', borderRight: '1px solid #F1EFEA', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#171717', marginBottom: '4px' }}>
                    {c.workEnvironment}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', lineHeight: '1.5' }}>
                    {c.typicalDay}
                  </p>
                </td>
              ))}
            </tr>

            {/* 5. Key Strengths You Bring */}
            <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
              <td style={{
                padding: '1.5rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: '#171717',
                borderRight: '1px solid #EAE7E2',
                backgroundColor: '#FAFAF9',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} color="#10B981" />
                  <span>Strengths You Bring</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#77736F', fontWeight: 500, marginTop: '2px' }}>
                  Validated in assessment
                </div>
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', borderRight: '1px solid #F1EFEA', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {c.keyStrengths?.map((s, idx) => (
                      <span key={idx} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#065F46',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}>
                        <Check size={12} /> {s}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* 6. Skills You Will Develop */}
            <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
              <td style={{
                padding: '1.5rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: '#171717',
                borderRight: '1px solid #EAE7E2',
                backgroundColor: '#FAFAF9',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} color="#FE6904" />
                  <span>Skills To Develop</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#77736F', fontWeight: 500, marginTop: '2px' }}>
                  Included in your roadmap
                </div>
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', borderRight: '1px solid #F1EFEA', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {c.skillsToDevelop?.map((s, idx) => (
                      <span key={idx} style={{
                        backgroundColor: '#FBFBFA',
                        border: '1px solid #EAE7E2',
                        color: '#374151',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}>
                        + {s}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* 7. Milestone Project */}
            <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
              <td style={{
                padding: '1.5rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: '#171717',
                borderRight: '1px solid #EAE7E2',
                backgroundColor: '#FAFAF9',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} color="#D97706" />
                  <span>Milestone Project</span>
                </div>
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', borderRight: '1px solid #F1EFEA', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#171717', marginBottom: '4px' }}>
                    {c.starterProject.title}
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#6B7280', lineHeight: '1.5' }}>
                    {c.starterProject.description}
                  </p>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                  }}>
                    ⏱ Est. {c.starterProject.timeEstimate}
                  </span>
                </td>
              ))}
            </tr>

            {/* 8. Education & Entry Pathways */}
            <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
              <td style={{
                padding: '1.5rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: '#171717',
                borderRight: '1px solid #EAE7E2',
                backgroundColor: '#FAFAF9',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={16} color="#2563EB" />
                  <span>Entry Pathways</span>
                </div>
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', borderRight: '1px solid #F1EFEA', verticalAlign: 'top' }}>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#4B5563', lineHeight: '1.6' }}>
                    {c.educationPathways?.slice(0, 3).map((p, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{p}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* 9. Final Decision Call to Action */}
            <tr>
              <td style={{
                padding: '1.75rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: '#171717',
                borderRight: '1px solid #EAE7E2',
                backgroundColor: '#FAFAF9',
              }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#171717' }}>
                  Ready to Commit?
                </div>
                <div style={{ fontSize: '0.78rem', color: '#77736F', marginTop: '2px' }}>
                  Instant roadmap activation
                </div>
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.75rem 1.5rem', borderRight: '1px solid #F1EFEA', verticalAlign: 'middle' }}>
                  <button
                    type="button"
                    onClick={() => handleSelectAndProceed(c)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: '#FE6904',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px 18px',
                      borderRadius: '12px',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(254, 105, 4, 0.25)',
                      transition: 'all 0.15s ease',
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

      {/* Add More Careers Box (if fewer than 3) */}
      {comparedCareers.length < 3 && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          padding: '1.75rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: '0 2px 12px rgba(23, 23, 23, 0.02)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 800, color: '#171717' }}>
                Add another career to this comparison
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#77736F' }}>
                You can compare up to 3 paths at a time. Click a recommended match below or pick any path from the catalogue.
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
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid #EAE7E2',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#171717',
                  cursor: 'pointer',
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
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#77736F' }}>
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
                    backgroundColor: '#FBFBFA',
                    border: '1px solid #EAE7E2',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#171717',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Plus size={14} color="#FE6904" />
                  <span>{c.title}</span>
                  <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 800 }}>
                    {c.matchScore}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1.5rem',
        borderTop: '1px solid #EAE7E2',
      }}>
        <button
          type="button"
          onClick={onBackToStage4}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #EAE7E2',
            padding: '12px 22px',
            borderRadius: '12px',
            color: '#171717',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
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
            backgroundColor: '#171717',
            color: '#FFFFFF',
            border: 'none',
            padding: '14px 30px',
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(23, 23, 23, 0.12)',
          }}
        >
          <span>Choose Career & Activate Roadmap</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
