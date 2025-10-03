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
}

export const RoundedPieChart: React.FC<RoundedPieChartProps> = ({
  data,
  size = 300,
  innerRadiusRatio = 0.6875,
  cornerRadius = 8,
  gap = 3,
  hoverOffset = 5,
  animationDuration = 1000,
  className = '',
  showLabelsOnHover = true,
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      // Ease out cubic for overall smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [animationDuration]);

  const total = data.reduce((sum, item) => sum + Math.abs(item.value), 0);
  const radius = (size * 0.8) / 2;
  const innerRadius = radius * innerRadiusRatio;
  const centerX = size / 2;
  const centerY = size / 2;

  // Precompute segment durations and start times
  const segmentDurs = data.map(item => (Math.abs(item.value) / total) * animationDuration);
  const startTimes = [0];
  let cumul = 0;
  for (let i = 1; i < data.length; i++) {
    cumul += 0.25 * segmentDurs[i - 1];
    startTimes.push(cumul);
  }
  const chainedTotal = startTimes[startTimes.length - 1] + segmentDurs[segmentDurs.length - 1];
  const scaleFactor = chainedTotal > 0 ? animationDuration / chainedTotal : 1;
  const scaledSegmentDurs = segmentDurs.map(d => d * scaleFactor);
  const scaledStartTimes = startTimes.map(s => s * scaleFactor);

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
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

  const getMidDirection = (startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const angleInRadians = ((midAngle - 90) * Math.PI) / 180.0;
    return {
      dx: Math.cos(angleInRadians),
      dy: Math.sin(angleInRadians),
    };
  };

  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = Math.abs(item.value) / total;
    const targetAngle = percentage * 360;
    const segStartTime = scaledStartTimes[index];
    const segDur = scaledSegmentDurs[index];
    const segStartProgress = segStartTime / animationDuration;
    let rawSegProgress = 0;
    if (animationProgress >= segStartProgress) {
      rawSegProgress = Math.min(1, (animationProgress - segStartProgress) / (segDur / animationDuration));
    }
    // Apply ease-out cubic per segment for smoother animation, higher power for faster start
    const segProgress = 1 - Math.pow(1 - rawSegProgress, 4);
    const animatedAngle = targetAngle * segProgress;
    const startAngle = currentAngle;
    const endAngle = currentAngle + animatedAngle;
    const isHovered = hoveredIndex === index;

    const midDir = getMidDirection(startAngle, endAngle);
    const tx = isHovered ? hoverOffset * midDir.dx : 0;
    const ty = isHovered ? hoverOffset * midDir.dy : 0;

    currentAngle += targetAngle;

    const path = createRoundedArcPath(
      startAngle,
      endAngle,
      radius,
      innerRadius,
      cornerRadius
    );

    const extraRadius = isHovered ? hoverOffset : 0;
    const dotPos = polarToCartesian(centerX, centerY, radius + extraRadius, (startAngle + endAngle) / 2);

    // Calculate L-shaped line positions
    const horizontalLineLength = 25;
    const verticalLineLength = 20;

    // Start point at the edge of the segment
    const lineStartX = dotPos.x + (isHovered ? tx : 0);
    const lineStartY = dotPos.y + (isHovered ? ty : 0);

    // Determine if segment is in bottom half (angle between 90 and 270 degrees)
    const midAngle = (startAngle + endAngle) / 2;
    const normalizedAngle = midAngle % 360;
    const isBottomHalf = normalizedAngle > 90 && normalizedAngle < 270;

    // Horizontal line extends outward
    const horizontalEndX = lineStartX + midDir.dx * horizontalLineLength;
    const horizontalEndY = lineStartY + midDir.dy * horizontalLineLength;

    // Vertical line direction based on position
    const verticalDirection = isBottomHalf ? 1 : -1;
    const verticalEndX = horizontalEndX;
    const verticalEndY = horizontalEndY + (verticalLineLength * verticalDirection);

    // Text position
    const textOffset = isBottomHalf ? 8 : -8;
    const textX = verticalEndX;
    const textY = verticalEndY + textOffset;

    return {
      ...item,
      path,
      startAngle,
      endAngle,
      lineStartX,
      lineStartY,
      horizontalEndX,
      horizontalEndY,
      verticalEndX,
      verticalEndY,
      textX,
      textY,
      tx,
      ty,
      index,
      animatedAngle,
      segProgress,
      isBottomHalf,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>

      {segments.map((segment) => {
        if (segment.animatedAngle <= 0.1) {
          return null; // Don't render if not started animating
        }
        const isHovered = hoveredIndex === segment.index;
        return (
          <g key={segment.index}>
            <path
              d={segment.path}
              fill="transparent"
              stroke="none"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIndex(segment.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            <g
              style={{
                transform: `translate(${segment.tx}px, ${segment.ty}px) scale(${isHovered ? 1.05 : 1})`,
                transformOrigin: `${centerX}px ${centerY}px`,
                transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), filter 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none',
              }}
            >
              <path
                d={segment.path}
                fill={segment.color}
                style={{
                  filter: isHovered ? 'url(#shadow)' : 'none',
                  opacity: segment.segProgress,
                }}
              />
            </g>

            {showLabelsOnHover && (
              <g
                style={{
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none',
                }}
              >
                {/* L-shaped line */}
                <path
                  d={`M ${segment.lineStartX} ${segment.lineStartY} L ${segment.horizontalEndX} ${segment.horizontalEndY} L ${segment.verticalEndX} ${segment.verticalEndY}`}
                  stroke={segment.color}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Percentage text */}
                <text
                  x={segment.textX}
                  y={segment.textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    fill: '#4B5563',
                    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {`${(segment.value / total * 100).toFixed(1).replace('.', ',')}%`}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default RoundedPieChart;
