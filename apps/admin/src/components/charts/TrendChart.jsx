import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function TrendChart({ data, showAiSeries = true }) {
  const hasAi = showAiSeries && data && data.length > 0 && 'aiRequests' in data[0];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #FAD1C6',
            borderRadius: '10px',
            padding: '0.6rem 0.85rem',
            boxShadow: '0 4px 16px rgba(219, 94, 140, 0.08)',
            fontSize: '0.785rem',
          }}
        >
          <div style={{ fontWeight: 700, color: '#171717', marginBottom: '4px' }}>{label}</div>
          {payload.map((entry, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: entry.stroke || entry.color, marginTop: '2px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.stroke || entry.color }} />
              <span>{entry.name}: <strong>{entry.value?.toLocaleString()}</strong></span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#DB5E8C" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#DB5E8C" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F5AFAE" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#F5AFAE" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#FAD1C6" vertical={false} />
          <XAxis
            dataKey="period"
            stroke="#9E9B95"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#FAD1C6' }}
          />
          <YAxis
            stroke="#9E9B95"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="students"
            name="Enrolled Students"
            stroke="#DB5E8C"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#studentGradient)"
          />
          {hasAi && (
            <Area
              type="monotone"
              dataKey="aiRequests"
              name="Gemini AI Inferences"
              stroke="#F5AFAE"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#aiGradient)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
