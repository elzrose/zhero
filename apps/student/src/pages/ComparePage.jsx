import React from 'react';
import { X } from 'lucide-react';
import { CAREERS_DATA } from '../data/careersData';

export function ComparePage({
  compareList = [],
  onToggleCompareCareer,
  onGenerateRoadmap,
  onAuditSkills,
  onNavigate
}) {
  const comparedCareers = CAREERS_DATA.filter((c) => compareList.includes(c.id));

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Compare careers</h1>
        {comparedCareers.length > 0 && onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('careers')}
            className="btn-secondary"
            style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            Add career
          </button>
        )}
      </div>

      {comparedCareers.length === 0 ? (
        <div style={{ padding: '2rem 0' }}>
          <p style={{ fontSize: '0.9rem', color: '#77736F', margin: '0 0 1rem 0' }}>
            No careers selected to compare.
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('careers')}
            className="btn-primary"
            style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            Browse careers
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid #EAE7E2', borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #EAE7E2', backgroundColor: '#F8F8F7' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: '#77736F', width: '160px' }}>Field</th>
                {comparedCareers.map((c) => (
                  <th key={c.id} style={{ padding: '12px 16px', fontWeight: 600, color: '#171717' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span>{c.title}</span>
                      <button
                        type="button"
                        onClick={() => onToggleCompareCareer(c.id)}
                        aria-label={`Remove ${c.title}`}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#77736F',
                          padding: '2px',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
                <td style={{ padding: '12px 16px', color: '#77736F' }}>Category</td>
                {comparedCareers.map((c) => (
                  <td key={c.id} style={{ padding: '12px 16px', color: '#171717' }}>{c.category}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
                <td style={{ padding: '12px 16px', color: '#77736F' }}>Starting salary</td>
                {comparedCareers.map((c) => (
                  <td key={c.id} style={{ padding: '12px 16px', color: '#171717', fontWeight: 600 }}>{c.avgSalary}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
                <td style={{ padding: '12px 16px', color: '#77736F' }}>Growth</td>
                {comparedCareers.map((c) => (
                  <td key={c.id} style={{ padding: '12px 16px', color: '#171717' }}>{c.growthRate}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
                <td style={{ padding: '12px 16px', color: '#77736F' }}>Key skills</td>
                {comparedCareers.map((c) => (
                  <td key={c.id} style={{ padding: '12px 16px', color: '#171717' }}>
                    {c.requiredSkills.slice(0, 3).map((s) => s.name).join(', ')}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #EAE7E2' }}>
                <td style={{ padding: '12px 16px', color: '#77736F' }}>Overview</td>
                {comparedCareers.map((c) => (
                  <td key={c.id} style={{ padding: '12px 16px', color: '#77736F', lineHeight: 1.5 }}>
                    {c.description}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', color: '#77736F' }}>Actions</td>
                {comparedCareers.map((c) => (
                  <td key={c.id} style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => onGenerateRoadmap && onGenerateRoadmap(c.id)}
                        className="btn-primary"
                        style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem' }}
                      >
                        Roadmap
                      </button>
                      <button
                        type="button"
                        onClick={() => onAuditSkills && onAuditSkills(c.id)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem' }}
                      >
                        Audit skills
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
