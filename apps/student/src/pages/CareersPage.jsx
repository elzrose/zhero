import React, { useState } from 'react';
import { Search, Bookmark, GitCompare, ArrowRight } from 'lucide-react';
import { CAREERS_DATA } from '../data/careersData';

export function CareersPage({
  onSelectCareer,
  savedCareers,
  onToggleSaveCareer,
  compareList,
  onToggleCompareCareer,
  assessmentResults
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('match');

  const categories = [
    'All',
    'Technology',
    'Data & AI',
    'Design & Creative',
    'Business & Finance',
    'Healthcare',
    'Engineering',
    'Sustainability',
    'Education'
  ];

  // Map match scores from assessment if available
  const matchMap = {};
  if (assessmentResults?.topRecommendations) {
    assessmentResults.topRecommendations.forEach((r) => {
      matchMap[r.id] = r.matchScore;
    });
  }

  const filtered = CAREERS_DATA.filter((career) => {
    const matchesCat = selectedCategory === 'All' || career.category === selectedCategory;
    const matchesSearch =
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.requiredSkills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Sorting
  filtered.sort((a, b) => {
    const scoreA = matchMap[a.id] || 75;
    const scoreB = matchMap[b.id] || 75;
    if (sortBy === 'match') return scoreB - scoreA;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em', margin: 0 }}>
          Explore Career Pathways
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#77736F', marginTop: '0.35rem' }}>
          Discover emerging industries, understand required skill sets, and compare pathways across 18+ high-demand profiles.
        </p>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          flex: '1 1 300px',
          maxWidth: '420px',
        }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#77736F' }} />
          <input
            type="text"
            placeholder="Search by title, domain, or required skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem 0.65rem 2.25rem',
              borderRadius: '10px',
              border: '1px solid #EAE7E2',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: '#FFFFFF',
            }}
          />
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #EAE7E2',
              fontSize: '0.85rem',
              backgroundColor: '#FFFFFF',
              color: '#171717',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="match">Highest Affinity Match</option>
            <option value="title">Alphabetical (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '2rem',
      }}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                border: isActive ? '1px solid #FE6904' : '1px solid #EAE7E2',
                backgroundColor: isActive ? '#FFE5CE' : '#FFFFFF',
                color: isActive ? '#FE6904' : '#77736F',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Career Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1.5rem',
      }}>
        {filtered.map((career) => {
          const isSaved = savedCareers.includes(career.id);
          const isCompared = compareList.includes(career.id);
          const matchScore = matchMap[career.id] || 78;

          return (
            <div
              key={career.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #EAE7E2',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(23, 23, 23, 0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                {/* Badge row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: '#FFE5CE',
                    color: '#FE6904',
                  }}>
                    {matchScore}% Match
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#77736F', fontWeight: 600 }}>
                    {career.category}
                  </span>
                </div>

                <h3
                  onClick={() => onSelectCareer(career.id)}
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#171717',
                    margin: '0 0 0.4rem',
                    cursor: 'pointer',
                  }}
                >
                  {career.title}
                </h3>

                <p style={{
                  fontSize: '0.85rem',
                  color: '#77736F',
                  lineHeight: 1.5,
                  margin: '0 0 1rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {career.description}
                </p>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#77736F', marginBottom: '1rem' }}>
                  <span>Avg: <strong style={{ color: '#171717' }}>{career.avgSalary}</strong></span>
                  <span>Growth: <strong style={{ color: '#2E7D32' }}>{career.growthRate}</strong></span>
                </div>

                {/* Skills Preview */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
                  {career.requiredSkills.slice(0, 3).map((s, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.72rem',
                      background: '#F8F8F7',
                      color: '#171717',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid #EAE7E2',
                    }}>
                      {s.name}
                    </span>
                  ))}
                  {career.requiredSkills.length > 3 && (
                    <span style={{ fontSize: '0.72rem', color: '#77736F', alignSelf: 'center' }}>
                      +{career.requiredSkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid #EAE7E2',
              }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => onToggleSaveCareer(career.id)}
                    title={isSaved ? 'Remove Bookmark' : 'Bookmark Career'}
                    style={{
                      background: isSaved ? '#FFE5CE' : '#FFFFFF',
                      border: '1px solid #EAE7E2',
                      borderRadius: '6px',
                      padding: '5px 8px',
                      cursor: 'pointer',
                      color: isSaved ? '#FE6904' : '#77736F',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Bookmark size={14} fill={isSaved ? '#FE6904' : 'none'} />
                  </button>

                  <button
                    onClick={() => onToggleCompareCareer(career.id)}
                    title="Add to side-by-side comparison"
                    style={{
                      background: isCompared ? '#FFE5CE' : '#FFFFFF',
                      border: '1px solid #EAE7E2',
                      borderRadius: '6px',
                      padding: '5px 8px',
                      cursor: 'pointer',
                      color: isCompared ? '#FE6904' : '#77736F',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    <GitCompare size={14} />
                    <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                  </button>
                </div>

                <button
                  onClick={() => onSelectCareer(career.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FE6904',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Explore</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
