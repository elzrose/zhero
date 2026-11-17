import React, { useState } from 'react';

export function CareerBarChart({ data = [] }) {
  const colors = ['#DB5E8C', '#F5AFAE', '#FAD1C6', '#DB5E8C'];
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E9B95' }}>No career data available</div>;
  }

  const maxVal = Math.max(...data.map(d => d.students || 1), 1);

  return (
    <div style={{ width: '100%', height: 260, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '10px 0' }}>
      {data.map((item, index) => {
        const pct = Math.round(((item.students || 0) / maxVal) * 100);
        const isHovered = hoveredIndex === index;
        return (
          <div
            key={item.name || index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              position: 'relative',
              padding: '4px 6px',
              borderRadius: '6px',
              background: isHovered ? '#FCEADE' : 'transparent',
              transition: 'background 0.2s',
            }}
          >
            <div style={{ width: '140px', fontSize: '0.8rem', fontWeight: 600, color: '#171717', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.name}
            </div>
            <div style={{ flex: 1, height: '18px', background: '#FCEADE', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  backgroundColor: colors[index % colors.length],
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <div style={{ width: '80px', fontSize: '0.785rem', fontWeight: 700, color: '#DB5E8C', textAlign: 'right' }}>
              {item.students?.toLocaleString()} ({item.percentage}%)
            </div>

            {isHovered && (
              <div
                style={{
                  position: 'absolute',
                  top: '-32px',
                  right: '20px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #FAD1C6',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  boxShadow: '0 4px 12px rgba(219, 94, 140, 0.15)',
                  fontSize: '0.75rem',
                  zIndex: 20,
                  whiteSpace: 'nowrap',
                }}
              >
                <strong>{item.name}</strong>: {item.students?.toLocaleString()} students ({item.percentage}%)
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
