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
  animationDuration = 1000,
  className = '',
  showLabelsOnHover = true,
  labelDistance = 30,
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const animationFrameRef = React.useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Smoother ease-out-expo easing function
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setAnimationProgress(easedProgress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationDuration]);

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

  // Simplified animation - all segments animate together with stagger
  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = Math.abs(item.value) / total;
    const targetAngle = percentage * 360;

    // Staggered animation - each segment starts slightly after the previous one
    const staggerDelay = index * 0.08; // 8% delay between segments
    const segmentProgress = Math.max(0, Math.min(1, (animationProgress - staggerDelay) / (1 - staggerDelay)));

    // Smooth ease-out for individual segments
    const easedSegmentProgress = segmentProgress < 0.5
      ? 4 * segmentProgress * segmentProgress * segmentProgress
      : 1 - Math.pow(-2 * segmentProgress + 2, 3) / 2;

    const animatedAngle = targetAngle * easedSegmentProgress;
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

    // Calculate L-shaped line positions using labelDistance
    const horizontalLineLength = labelDistance * 0.6;
    const verticalLineLength = labelDistance * 0.5;

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
    const textOffset = isBottomHalf ? (labelDistance * 0.3) : -(labelDistance * 0.3);
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
      segProgress: easedSegmentProgress,
      isBottomHalf,
    };
  });

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
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
          if (segment.animatedAngle <= 0.01) {
            return null;
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
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  willChange: 'transform',
                  pointerEvents: 'none',
                }}
              >
                <path
                  d={segment.path}
                  fill={segment.color}
                  style={{
                    filter: isHovered ? 'url(#shadow)' : 'none',
                    opacity: segment.segProgress,
                    transition: 'filter 0.2s ease-out',
                  }}
                />
              </g>

              {showLabelsOnHover && (
                <g
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: 'none',
                  }}
                >
                  {/* L-shaped line */}
                  <path
                    d={`M ${segment.lineStartX} ${segment.lineStartY} L ${segment.horizontalEndX} ${segment.horizontalEndY} L ${segment.verticalEndX} ${segment.verticalEndY}`}
                    stroke={segment.color}
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* React text components positioned absolutely */}
      {showLabelsOnHover && segments.map((segment) => {
        if (segment.animatedAngle <= 0.01) {
          return null;
        }
        const isHovered = hoveredIndex === segment.index;
        return (
          <div
            key={`label-${segment.index}`}
            style={{
              position: 'absolute',
              left: segment.textX,
              top: segment.textY,
              transform: 'translate(-50%, -50%)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: 'none',
              fontSize: '14px',
              fontWeight: '500',
              color: '#4B5563',
              whiteSpace: 'nowrap',
              willChange: 'opacity',
            }}
          >
            {segment.label}
          </div>
        );
      })}
    </div>
  );
};

export default RoundedPieChart;
