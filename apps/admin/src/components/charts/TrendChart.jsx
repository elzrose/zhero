import React, { useState } from 'react';

export function TrendChart({ data = [], showAiSeries = true }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E9B95' }}>No trend data available</div>;
  }

  const hasAi = showAiSeries && 'aiRequests' in data[0];
  const maxVal = Math.max(...data.map(d => Math.max(d.students || 0, hasAi ? (d.aiRequests || 0) : 0)), 1);

  const width = 600;
  const height = 220;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const points = data.map((d, i) => {
    const x = padLeft + (i / (data.length - 1 || 1)) * chartW;
    const yStudents = padTop + chartH - ((d.students || 0) / maxVal) * chartH;
    const yAi = hasAi ? padTop + chartH - ((d.aiRequests || 0) / maxVal) * chartH : 0;
    return { ...d, x, yStudents, yAi };
  });

  const studentsPath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.yStudents}`, '');
  const studentsArea = `${studentsPath} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;

  const aiPath = hasAi ? points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.yAi}`, '') : '';

  return (
    <div style={{ width: '100%', height: 260, position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#DB5E8C" stopOpacity="0.35" />
            <stop offset="95%" stopColor="#DB5E8C" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F5AFAE" stopOpacity="0.25" />
            <stop offset="95%" stopColor="#F5AFAE" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = padTop + chartH * (1 - pct);
          const val = Math.round(maxVal * pct);
          return (
            <g key={idx}>
              <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#FAD1C6" strokeDasharray="3 3" opacity="0.6" />
              <text x={padLeft - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9E9B95">{val}</text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={studentsArea} fill="url(#studentGradient)" />

        {/* Lines */}
        <path d={studentsPath} fill="none" stroke="#DB5E8C" strokeWidth="2.5" />
        {hasAi && <path d={aiPath} fill="none" stroke="#F5AFAE" strokeWidth="2" strokeDasharray="4 4" />}

        {/* Points & Labels */}
        {points.map((p, i) => (
          <g key={i}>
            <text x={p.x} y={height - 8} textAnchor="middle" fontSize="11" fill="#77736D">{p.period}</text>
            <circle
              cx={p.x}
              cy={p.yStudents}
              r={hoveredPoint === i ? 6 : 4}
              fill="#DB5E8C"
              stroke="#FFFFFF"
              strokeWidth="2"
              style={{ cursor: 'pointer', transition: 'r 0.15s' }}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
            {hasAi && (
              <circle
                cx={p.x}
                cy={p.yAi}
                r={hoveredPoint === i ? 5 : 3.5}
                fill="#F5AFAE"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            )}
          </g>
        ))}
      </svg>

      {hoveredPoint !== null && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: `${(points[hoveredPoint].x / width) * 100}%`,
            transform: 'translateX(-50%)',
            backgroundColor: '#FFFFFF',
            border: '1px solid #FAD1C6',
            borderRadius: '8px',
            padding: '6px 10px',
            boxShadow: '0 4px 14px rgba(219, 94, 140, 0.12)',
            fontSize: '0.785rem',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontWeight: 700, color: '#171717' }}>{points[hoveredPoint].period}</div>
          <div style={{ color: '#DB5E8C' }}>Students: <strong>{points[hoveredPoint].students?.toLocaleString()}</strong></div>
          {hasAi && <div style={{ color: '#F5AFAE' }}>AI: <strong>{points[hoveredPoint].aiRequests?.toLocaleString()}</strong></div>}
        </div>
      )}
    </div>
  );
}
