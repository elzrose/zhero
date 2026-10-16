import React, { useState } from 'react';
import { Search, ExternalLink, Bookmark, CheckCircle2, Clock } from 'lucide-react';
import { RESOURCES_DATA } from '../data/resourcesData';

export function ResourcesPage({
  bookmarkedResources,
  onToggleBookmark,
  completedResources,
  onToggleComplete
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const types = ['All', 'Official Doc', 'Interactive', 'Tutorial', 'Article', 'Project'];

  const filtered = RESOURCES_DATA.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.skillTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || res.type === selectedType;
    const matchesDiff = selectedDifficulty === 'All' || res.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesDiff;
  });

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em', margin: 0 }}>
          Curated Learning Resources
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#77736F', marginTop: '0.35rem' }}>
          Vetted, beginner-friendly tutorials, documentation, and guided projects to bridge skill gaps.
        </p>
      </div>

      {/* Search & Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#77736F' }} />
          <input
            type="text"
            placeholder="Search by title, skill, or provider..."
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

        {/* Difficulty Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#77736F', fontWeight: 600 }}>Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
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
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
          </select>
        </div>
      </div>

      {/* Type Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '2rem' }}>
        {types.map((t) => {
          const isActive = selectedType === t;
          return (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                border: isActive ? '1px solid #FE6904' : '1px solid #EAE7E2',
                backgroundColor: isActive ? '#FFE5CE' : '#FFFFFF',
                color: isActive ? '#FE6904' : '#77736F',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Resources Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filtered.map((res) => {
          const isBookmarked = bookmarkedResources.includes(res.id);
          const isDone = completedResources.includes(res.id);

          return (
            <div
              key={res.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #EAE7E2',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(23, 23, 23, 0.04)',
              }}
            >
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: '#FFE5CE',
                      color: '#FE6904',
                    }}>
                      {res.type}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: '#F8F8F7',
                      color: '#77736F',
                    }}>
                      {res.difficulty}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: '#77736F', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {res.duration}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#171717', margin: '0 0 0.35rem', lineHeight: 1.4 }}>
                  {res.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#FE6904', fontWeight: 600, display: 'block', marginBottom: '0.65rem' }}>
                  {res.provider}
                </span>

                <p style={{ fontSize: '0.82rem', color: '#77736F', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  {res.description}
                </p>

                <div style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: '#FAF9F7',
                  border: '1px solid #EAE7E2',
                  color: '#171717',
                  fontWeight: 500,
                  marginBottom: '1rem',
                }}>
                  Skill: {res.skillTag}
                </div>
              </div>

              {/* Action row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid #EAE7E2',
              }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onToggleBookmark(res.id)}
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Resource'}
                    style={{
                      background: isBookmarked ? '#FFE5CE' : '#FFFFFF',
                      border: '1px solid #EAE7E2',
                      borderRadius: '6px',
                      padding: '5px 8px',
                      cursor: 'pointer',
                      color: isBookmarked ? '#FE6904' : '#77736F',
                    }}
                  >
                    <Bookmark size={14} fill={isBookmarked ? '#FE6904' : 'none'} />
                  </button>

                  <button
                    onClick={() => onToggleComplete(res.id)}
                    title="Mark Completed"
                    style={{
                      background: isDone ? '#E8F5E9' : '#FFFFFF',
                      border: isDone ? '1px solid #C8E6C9' : '1px solid #EAE7E2',
                      borderRadius: '6px',
                      padding: '5px 8px',
                      cursor: 'pointer',
                      color: isDone ? '#2E7D32' : '#77736F',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#FE6904',
                    textDecoration: 'none',
                  }}
                >
                  <span>Open Resource</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
