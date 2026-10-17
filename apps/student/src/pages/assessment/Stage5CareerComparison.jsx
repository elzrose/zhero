import React, { useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CAREERS_DATA } from '../../data/careersData';
import { storageService } from '../../services/storageService';

export function Stage5CareerComparison({ onProceedToChoose, onBackToStage4 }) {
  const preliminary = storageService.getStage3Preliminary();
  const context = storageService.getStage1Context() || {};

  const topCareers = useMemo(() => {
    if (preliminary?.careers && preliminary.careers.length > 0) {
      return preliminary.careers.slice(0, 5).map((c) => {
        const matched = CAREERS_DATA.find((cd) => cd.id === c.id || cd.title.toLowerCase() === c.title?.toLowerCase());
        return {
          id: c.id || matched?.id,
          title: c.title || matched?.title,
          category: c.category || matched?.category || 'Technology',
          matchScore: c.matchScore || 90,
          avgSalary: c.avgSalary || matched?.avgSalary || '₹8 - 18 LPA',
          skills: (matched?.requiredSkills || []).slice(0, 3).map((s) => s.name || s),
          whyFit: c.whyFit || `Aligns with your interests in ${context.courseStream || 'practical problem solving'}.`,
        };
      });
    }

    return CAREERS_DATA.slice(0, 5).map((c, idx) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      matchScore: 95 - idx * 4,
      avgSalary: c.avgSalary,
      skills: (c.requiredSkills || []).slice(0, 3).map((s) => s.name || s),
      whyFit: `Matches your coursework in ${context.courseStream || 'computer science and technical fundamentals'}.`,
    }));
  }, [preliminary, context.courseStream]);

  const handleChoose = (career) => {
    try {
      const ids = topCareers.map((c) => c.id).filter(Boolean);
      if (typeof storageService.setCompareList === 'function') {
        storageService.setCompareList(ids);
      }
    } catch (err) {
      console.warn('Could not save compare list:', err);
    }
    if (onProceedToChoose) {
      onProceedToChoose(career || topCareers[0]);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', margin: '0 0 0.5rem 0' }}>
          Compare careers
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#77736F', margin: 0 }}>
          Side-by-side comparison of your top recommended career options.
        </p>
      </div>

      {/* Comparison Table Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #EAE7E2',
        overflowX: 'auto',
        marginBottom: '2rem',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #EAE7E2', backgroundColor: '#F8F8F7' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#171717' }}>Career</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#171717' }}>Category</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#171717' }}>Salary range</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#171717' }}>Core skills</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#171717' }}>Why it fits</th>
            </tr>
          </thead>
          <tbody>
            {topCareers.map((career) => (
              <tr key={career.id} style={{ borderBottom: '1px solid #EAE7E2' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#171717', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{career.title}</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#FE6904',
                      backgroundColor: '#FFE5CE',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}>
                      {career.matchScore}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#77736F', whiteSpace: 'nowrap' }}>
                  {career.category}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#171717', whiteSpace: 'nowrap' }}>
                  {career.avgSalary}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#77736F' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {career.skills.map((s, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.75rem',
                        backgroundColor: '#F8F8F7',
                        border: '1px solid #EAE7E2',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: '#171717',
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#77736F', minWidth: '220px', lineHeight: 1.4 }}>
                  {career.whyFit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Navigation Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          type="button"
          onClick={onBackToStage4}
          className="btn-secondary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={() => handleChoose(topCareers[0])}
          className="btn-primary"
          style={{ padding: '0.65rem 1.5rem', fontSize: '0.875rem' }}
        >
          <span>Select career and view roadmap</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
