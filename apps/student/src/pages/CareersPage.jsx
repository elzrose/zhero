import React, { useState } from 'react';
import { Search, Bookmark, GitCompare } from 'lucide-react';
import { CAREERS_DATA } from '../data/careersData';

export function CareersPage({
  onSelectCareer,
  savedCareers = [],
  onToggleSaveCareer,
  compareList = [],
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
      career.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  filtered.sort((a, b) => {
    const scoreA = matchMap[a.id] || 75;
    const scoreB = matchMap[b.id] || 75;
    if (sortBy === 'match') return scoreB - scoreA;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Careers</h1>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#77736F' }} />
          <input
            type="text"
            placeholder="Search careers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px 6px 32px',
              borderRadius: '8px',
              border: '1px solid #EAE7E2',
              fontSize: '0.85rem',
              outline: 'none',
              backgroundColor: '#FFFFFF',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#77736F' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #EAE7E2',
              fontSize: '0.8rem',
              backgroundColor: '#FFFFFF',
              color: '#171717',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="match">Match</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Categories as text tabs with orange underline */}
      <div style={{
        display: 'flex',
        gap: '1.25rem',
        borderBottom: '1px solid #EAE7E2',
        marginBottom: '1.5rem',
        overflowX: 'auto',
      }}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #FE6904' : '2px solid transparent',
                color: isActive ? '#FE6904' : '#77736F',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.85rem',
                padding: '8px 2px',
                cursor: 'pointer',
                marginBottom: '-1px',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Career items: title, category, salary, match %. Compare and Save as small icon buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map((career) => {
          const isSaved = savedCareers.includes(career.id);
          const isCompared = compareList.includes(career.id);
          const matchScore = matchMap[career.id] || 78;

          return (
            <div
              key={career.id}
              className="list-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 1.25rem',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                onClick={() => onSelectCareer(career.id)}
                style={{ cursor: 'pointer', flex: '1 1 240px' }}
              >
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171717', marginBottom: '2px' }}>
                  {career.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#77736F' }}>
                  {career.category}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#171717', minWidth: '70px' }}>
                  {career.avgSalary}
                </span>

                <span className="badge" style={{ backgroundColor: '#FFE5CE', color: '#FE6904', border: '1px solid #EAE7E2' }}>
                  {matchScore}% match
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => onToggleCompareCareer(career.id)}
                    title={isCompared ? 'Remove from compare' : 'Compare'}
                    aria-label={isCompared ? 'Comparing' : 'Compare'}
                    style={{
                      background: isCompared ? '#FFE5CE' : '#FFFFFF',
                      border: '1px solid #EAE7E2',
                      borderRadius: '8px',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      color: isCompared ? '#FE6904' : '#77736F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <GitCompare size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleSaveCareer(career.id)}
                    title={isSaved ? 'Remove saved' : 'Save'}
                    aria-label={isSaved ? 'Saved' : 'Save'}
                    style={{
                      background: isSaved ? '#FFE5CE' : '#FFFFFF',
                      border: '1px solid #EAE7E2',
                      borderRadius: '8px',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      color: isSaved ? '#FE6904' : '#77736F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Bookmark size={14} fill={isSaved ? '#FE6904' : 'none'} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
