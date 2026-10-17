import React, { useState } from 'react';
import { Search, ExternalLink, Bookmark, CheckCircle2 } from 'lucide-react';
import { RESOURCES_DATA } from '../data/resourcesData';

export function ResourcesPage({
  bookmarkedResources = [],
  onToggleBookmark,
  completedResources = [],
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
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Resources</h1>
      </div>

      {/* Search & Filters */}
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
            placeholder="Search resources..."
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#77736F' }}>Level:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
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
            <option value="All">All levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
          </select>
        </div>
      </div>

      {/* Type filter tabs */}
      <div style={{
        display: 'flex',
        gap: '1.25rem',
        borderBottom: '1px solid #EAE7E2',
        marginBottom: '1.5rem',
        overflowX: 'auto',
      }}>
        {types.map((t) => {
          const isActive = selectedType === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
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
              {t}
            </button>
          );
        })}
      </div>

      {/* Rows (title, type, duration, bookmark and complete icons) instead of cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map((res) => {
          const isBookmarked = bookmarkedResources.includes(res.id);
          const isDone = completedResources.includes(res.id);

          return (
            <div
              key={res.id}
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
              <div style={{ flex: '1 1 280px' }}>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: isDone ? '#77736F' : '#171717',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{res.title}</span>
                  <ExternalLink size={13} color="#77736F" />
                </a>
                <div style={{ fontSize: '0.8rem', color: '#77736F', marginTop: '2px' }}>
                  {res.provider} • {res.skillTag}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="badge" style={{ backgroundColor: '#F8F8F7', color: '#171717', border: '1px solid #EAE7E2' }}>
                  {res.type}
                </span>

                <span style={{ fontSize: '0.8rem', color: '#77736F', minWidth: '55px' }}>
                  {res.duration}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => onToggleComplete(res.id)}
                    title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                    aria-label={isDone ? 'Completed' : 'Incomplete'}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isDone ? '#FE6904' : '#77736F',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <CheckCircle2 size={18} color={isDone ? '#FE6904' : '#77736F'} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleBookmark(res.id)}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                    aria-label={isBookmarked ? 'Saved' : 'Save'}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isBookmarked ? '#FE6904' : '#77736F',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Bookmark size={18} fill={isBookmarked ? '#FE6904' : 'none'} />
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
