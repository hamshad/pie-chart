import React, { useState, useEffect } from 'react';

export interface PieChartSegment {
  value: number;
  label: string;
  color: string;
}

export interface RoundedPieChartProps {
  data: PieChartSegment[];
  size?: number;
  innerRadiusRatio?: number;
  cornerRadius?: number;
  gap?: number;
  hoverOffset?: number;
  animationDuration?: number;
  className?: string;
  showLabelsOnHover?: boolean;
  labelDistance?: number;
}

export const RoundedPieChart: React.FC<RoundedPieChartProps> = ({
  data,
  size = 300,
  innerRadiusRatio = 0.6875,
  cornerRadius = 8,
  gap = 3,
  hoverOffset = 5,
  animationDuration = 600,
  className = '',
  showLabelsOnHover = true,
  labelDistance = 30,
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = data.reduce((sum, item) => sum + Math.abs(item.value), 0);
  const radius = (size * 0.8) / 2;
  const innerRadius = radius * innerRadiusRatio;
  const centerX = size / 2;
  const centerY = size / 2;

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createRoundedArcPath = (
    startAngle: number,
    endAngle: number,
    outerR: number,
    innerR: number,
    cornerR: number
  ) => {
    startAngle += gap / 2;
    endAngle -= gap / 2;

    const outerStart = polarToCartesian(centerX, centerY, outerR, startAngle);
    const outerEnd = polarToCartesian(centerX, centerY, outerR, endAngle);
    const innerStart = polarToCartesian(centerX, centerY, innerR, startAngle);
    const innerEnd = polarToCartesian(centerX, centerY, innerR, endAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
      `A ${cornerR} ${cornerR} 0 0 1 ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
      `A ${cornerR} ${cornerR} 0 0 1 ${outerStart.x} ${outerStart.y}`,
      'Z',
    ].join(' ');
  };

  const getLabelPosition = (startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius + labelDistance;
    return polarToCartesian(centerX, centerY, labelRadius, midAngle);
  };

  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = Math.abs(item.value) / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    const isHovered = hoveredIndex === index;

    currentAngle = endAngle;

    const displayAngle = mounted ? angle : 0;
    const displayEndAngle = startAngle + displayAngle;

    const path = createRoundedArcPath(
      startAngle,
      displayEndAngle,
      isHovered ? radius + hoverOffset : radius,
      innerRadius,
      cornerRadius
    );

    const labelPos = getLabelPosition(startAngle, endAngle);
    const midAngle = (startAngle + endAngle) / 2;
    const dotRadius = isHovered ? radius + hoverOffset : radius;
    const dotPos = polarToCartesian(centerX, centerY, dotRadius, midAngle);

    return {
      ...item,
      path,
      startAngle,
      endAngle,
      labelPos,
      dotPos,
      index,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>

      {segments.map((segment) => (
        <g key={segment.index}>
          <path
            d={segment.path}
            fill={segment.color}
            style={{
              transition: `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              filter: hoveredIndex === segment.index ? 'url(#shadow)' : 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoveredIndex(segment.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          />

          {showLabelsOnHover && (
            <g
              style={{
                opacity: hoveredIndex === segment.index ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transform:
                  hoveredIndex === segment.index ? 'scale(1.1)' : 'scale(1)',
                transformOrigin: `${segment.labelPos.x}px ${segment.labelPos.y}px`,
                pointerEvents: 'none',
              }}
            >
              <text
                x={segment.labelPos.x}
                y={segment.labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: hoveredIndex === segment.index ? '16px' : '14px',
                  fontWeight: hoveredIndex === segment.index ? '600' : '500',
                  fill: '#374151',
                  transition: 'all 0.3s ease',
                }}
              >
                {segment.label}
              </text>

              <line
                x1={segment.dotPos.x}
                y1={segment.dotPos.y}
                x2={segment.labelPos.x}
                y2={segment.labelPos.y - 5}
                stroke="#9CA3AF"
                strokeWidth="1"
                style={{
                  transition: `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                }}
              />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
};

export default RoundedPieChart;