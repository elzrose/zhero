import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export function DataTable({
  columns = [],
  data = [],
  searchKey = '',
  searchPlaceholder = 'Search records...',
  filterOptions = null, // e.g. { key: 'status', label: 'Status', options: [{ label: 'All', value: 'ALL' }] }
  itemsPerPage = 8,
  onRowClick = null,
  actions = null,
  emptyMessage = 'No records found matching criteria.',
}) {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search matching
      let matchesSearch = true;
      if (search.trim()) {
        const query = search.toLowerCase();
        if (searchKey && item[searchKey]) {
          matchesSearch = String(item[searchKey]).toLowerCase().includes(query);
        } else {
          // Search across all string fields
          matchesSearch = Object.values(item).some(val =>
            typeof val === 'string' && val.toLowerCase().includes(query)
          );
        }
      }

      // Filter option matching
      let matchesFilter = true;
      if (filterOptions && selectedFilter !== 'ALL') {
        matchesFilter = item[filterOptions.key] === selectedFilter;
      }

      return matchesSearch && matchesFilter;
    });
  }, [data, search, searchKey, filterOptions, selectedFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Search & Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #FAD1C6',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#77736D',
              }}
            />
            <input
              type="text"
              className="admin-input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          {/* Quick Filter Dropdown */}
          {filterOptions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                className="admin-input"
                style={{ width: 'auto', paddingRight: '1.5rem' }}
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {filterOptions.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Optional Header Actions */}
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {actions}
          </div>
        )}
      </div>

      {/* Table Body */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#FCEADE', borderBottom: '1px solid #FAD1C6', color: '#77736D' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '0.85rem 1.25rem',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textAlign: col.align || 'left',
                    width: col.width || 'auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '3rem 1.5rem',
                    textAlign: 'center',
                    color: '#77736D',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{
                    borderBottom: '1px solid #FAD1C6',
                    backgroundColor: '#FFFFFF',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (onRowClick) e.currentTarget.style.backgroundColor = '#FCEADE';
                  }}
                  onMouseLeave={(e) => {
                    if (onRowClick) e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      style={{
                        padding: '0.95rem 1.25rem',
                        textAlign: col.align || 'left',
                        verticalAlign: 'middle',
                      }}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.5rem',
          borderTop: '1px solid #FAD1C6',
          backgroundColor: '#FFFFFF',
          fontSize: '0.8rem',
          color: '#77736D',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div>
          Showing{' '}
          <strong style={{ color: '#171717' }}>
            {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
          </strong>{' '}
          to{' '}
          <strong style={{ color: '#171717' }}>
            {Math.min(currentPage * itemsPerPage, filteredData.length)}
          </strong>{' '}
          of <strong style={{ color: '#171717' }}>{filteredData.length}</strong> records
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #FAD1C6',
              background: '#FFFFFF',
              color: currentPage === 1 ? '#FAD1C6' : '#171717',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <span style={{ padding: '0 0.5rem', fontWeight: 600 }}>
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #FAD1C6',
              background: '#FFFFFF',
              color: currentPage === totalPages ? '#FAD1C6' : '#171717',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
