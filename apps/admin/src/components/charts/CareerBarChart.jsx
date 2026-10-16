import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export function CareerBarChart({ data }) {
  const colors = ['#DB5E8C', '#F5AFAE', '#FAD1C6', '#DB5E8C'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
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
          <div style={{ fontWeight: 700, color: '#171717' }}>{item.name}</div>
          <div style={{ color: '#DB5E8C', marginTop: '2px' }}>
            Aspirants: <strong>{item.students.toLocaleString()} students</strong> ({item.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#FAD1C6" horizontal={false} />
          <XAxis type="number" stroke="#9E9B95" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#171717"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#FAD1C6' }}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="students" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
