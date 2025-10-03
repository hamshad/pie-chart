import React from 'react';
import { RoundedPieChart } from '../../src/RoundedPieChart';

const data = [
  { value: 40, label: 'Crimson', color: '#ef4444' },
  { value: 30, label: 'Sapphire', color: '#3b82f6' },
  { value: 20, label: 'Emerald', color: '#10b981' },
  { value: 10, label: 'Amber', color: '#f59e0b' },
  { value: 25, label: 'Sunset', color: '#fb923c' },
  { value: 35, label: 'Glacier', color: '#06b6d4' },
  { value: 15, label: 'Lavender', color: '#a78bfa' },
  { value: 20, label: 'Coral', color: '#f87171' },
  { value: 30, label: 'Tealstone', color: '#14b8a6' },
  { value: 18, label: 'Goldenrod', color: '#fbbf24' },
  { value: 22, label: 'Indigo Night', color: '#6366f1' },
  { value: 12, label: 'Rosewood', color: '#f43f5e' },
  { value: 28, label: 'Turquoise', color: '#22d3ee' },
  { value: 14, label: 'Ruby', color: '#dc2626' },
  { value: 26, label: 'Ocean Blue', color: '#2563eb' },
  { value: 19, label: 'Mint', color: '#34d399' },
  { value: 23, label: 'Topaz', color: '#fcd34d' },
  { value: 21, label: 'Violet Mist', color: '#8b5cf6' },
  { value: 17, label: 'Blush', color: '#fb7185' },
  { value: 29, label: 'Cyan Frost', color: '#0891b2' },
];

export default function App() {
  const [number, setNumber] = React.useState(0);

  return (
    <div style={{ padding: 20 }}>
      <h1>Rounded Pie Chart — Example</h1>
      <input
        type="range"
        min={0}
        max={data.length}
        value={number}
        onChange={(e) => setNumber(Number(e.target.value))}
        style={{ width: '100%', marginBottom: 20 }}
      />
      <p>Number of segments: {number}</p>
      <RoundedPieChart data={data.slice(0, number)} size={360} />
    </div>
  );
}
