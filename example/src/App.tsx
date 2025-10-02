import React from 'react';
import { RoundedPieChart } from '../../src/RoundedPieChart';

const data = [
  { value: 40, label: 'Red', color: '#ef4444' },
  { value: 30, label: 'Blue', color: '#3b82f6' },
  { value: 20, label: 'Green', color: '#10b981' },
  { value: 10, label: 'Yellow', color: '#f59e0b' },
];

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Rounded Pie Chart — Example</h1>
      <RoundedPieChart data={data} size={360} />
    </div>
  );
}
