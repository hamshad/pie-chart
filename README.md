# @yourgithubusername/pie-chart

A beautiful, animated pie chart component with rounded corners for React.

## Installation

```bash
npm install @yourgithubusername/pie-chart
# or
yarn add @yourgithubusername/pie-chart
```

## Usage

```tsx
import { RoundedPieChart } from '@yourgithubusername/pie-chart';

const data = [
  { value: 2.5, label: '+2.5%', color: '#E8D89C' },
  { value: 0.5, label: '-0.5%', color: '#9B6BA8' },
  { value: 0.4, label: '+0.4%', color: '#E89B8C' }
];

function App() {
  return (
    <RoundedPieChart 
      data={data}
      size={300}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `PieChartSegment[]` | Required | Array of segments with value, label, and color |
| `size` | `number` | `300` | Size of the chart in pixels |
| `innerRadiusRatio` | `number` | `0.6875` | Ratio of inner radius to outer radius (0-1) |
| `cornerRadius` | `number` | `8` | Radius of rounded corners |
| `gap` | `number` | `3` | Gap between segments in degrees |
| `hoverOffset` | `number` | `5` | Distance segments move out on hover |
| `animationDuration` | `number` | `600` | Animation duration in milliseconds |
| `showLabelsOnHover` | `boolean` | `true` | Show labels only on hover |
| `labelDistance` | `number` | `30` | Distance of labels from chart |
| `className` | `string` | `''` | Additional CSS classes |

## Data Format

```typescript
interface PieChartSegment {
  value: number;    // Numeric value
  label: string;    // Display label
  color: string;    // Hex color code
}
```

## Features

- ✨ Smooth animations on load and hover
- 🎨 Customizable colors and sizes
- 📱 Responsive and accessible
- 🎯 TypeScript support
- 🪶 Lightweight with no dependencies
- 🔄 Rounded corners for modern design

## License

MIT