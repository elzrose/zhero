import React, { useState } from 'react';
import {
  GitCompare,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { CAREERS_DATA } from '../../data/careersData';

export function Stage5CareerComparison({ onProceedToChoose, onBackToStage4 }) {
  const [compareIds, setCompareIds] = useState(() => {
    const list = storageService.getCompareList();
    if (list && list.length > 0) return list;
    return ['full-stack-engineer', 'ui-ux-designer'];
  });

  const comparedCareers = CAREERS_DATA.filter((c) => compareIds.includes(c.id));

  const handleRemoveCareer = (id) => {
    if (compareIds.length <= 1) return;
    const updated = storageService.toggleCompareCareer(id);
    setCompareIds(updated);
  };

  const handleAddCareer = (id) => {
    if (compareIds.includes(id) || compareIds.length >= 3) return;
    const updated = storageService.toggleCompareCareer(id);
    setCompareIds(updated);
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#171717',
          letterSpacing: '-0.02em',
          margin: '0 0 0.5rem 0',
        }}>
          Side-by-Side Career Comparison
        </h2>
        <p style={{ fontSize: '1rem', color: '#77736F', margin: 0, maxWidth: '600px', marginInline: 'auto', lineHeight: '1.6' }}>
          Compare compensation, industry growth, work environments, and required skills across your top choices before making your final selection.
        </p>
      </div>

      {/* Comparison Grid */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #EAE7E2',
        overflowX: 'auto',
        boxShadow: '0 4px 20px rgba(23, 23, 23, 0.02)',
        marginBottom: '2rem',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '720px' }}>
          <thead>
            <tr style={{ backgroundColor: '#FBFBFA', borderBottom: '1.5px solid #EAE7E2' }}>
              <th style={{ padding: '1.5rem', width: '220px', fontSize: '0.85rem', fontWeight: 800, color: '#77736F' }}>
                Decision Criteria
              </th>
              {comparedCareers.map((c) => (
                <th key={c.id} style={{ padding: '1.5rem', fontSize: '1.1rem', fontWeight: 800, color: '#171717', minWidth: '220px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{c.title}</span>
                    {comparedCareers.length > 1 && (
                      <button
                        onClick={() => handleRemoveCareer(c.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#9CA3AF',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 700, marginTop: '2px' }}>
                    {c.category}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Compensation */}
            <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
              <td style={{ padding: '1.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#171717' }}>
                Salary (Entry → Senior)
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', fontSize: '0.9rem', color: '#10B981', fontWeight: 700 }}>
                  {c.salaryRange?.entry || '₹5 LPA'} → {c.salaryRange?.senior || '₹22 LPA'}
                </td>
              ))}
            </tr>

            {/* Growth */}
            <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
              <td style={{ padding: '1.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#171717' }}>
                Market Growth Outlook
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', fontSize: '0.875rem', color: '#171717' }}>
                  <span style={{
                    backgroundColor: '#ECFDF5',
                    color: '#047857',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontWeight: 700,
                  }}>
                    {c.growthRate || '+20% YoY'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Setting */}
            <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
              <td style={{ padding: '1.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#171717' }}>
                Work Style & Setting
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.6' }}>
                  {c.workEnvironment || 'Hybrid & Remote-friendly team collaboration'}
                </td>
              ))}
            </tr>

            {/* Skills */}
            <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
              <td style={{ padding: '1.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#171717' }}>
                Core Skills
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', fontSize: '0.85rem', color: '#171717' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {c.skills?.slice(0, 4).map((s) => (
                      <span key={s} style={{
                        backgroundColor: '#F8F8F7',
                        border: '1px solid #EAE7E2',
                        padding: '3px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Project */}
            <tr>
              <td style={{ padding: '1.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#171717' }}>
                Hands-on Milestone Project
              </td>
              {comparedCareers.map((c) => (
                <td key={c.id} style={{ padding: '1.5rem', fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.6' }}>
                  {c.starterProjects?.[0]?.title || 'Starter portfolio case study'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add more careers selector if fewer than 3 */}
      {comparedCareers.length < 3 && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #EAE7E2',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#171717' }}>
              Want to compare another career?
            </div>
            <div style={{ fontSize: '0.8rem', color: '#77736F' }}>
              Add up to 3 paths for side-by-side comparison.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CAREERS_DATA.filter((c) => !compareIds.includes(c.id)).slice(0, 3).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleAddCareer(c.id)}
                style={{
                  backgroundColor: '#FBFBFA',
                  border: '1px solid #EAE7E2',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#171717',
                  cursor: 'pointer',
                }}
              >
                + {c.title}
              </button>
            ))}
          </div>
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
          onClick={onBackToStage4}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #EAE7E2',
            padding: '10px 20px',
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
          onClick={onProceedToChoose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FE6904',
            color: '#FFFFFF',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(254, 105, 4, 0.25)',
          }}
        >
          <span>Choose Your Career (Final Stage)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
