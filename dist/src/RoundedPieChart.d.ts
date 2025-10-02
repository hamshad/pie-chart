import React from 'react';
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
export declare const RoundedPieChart: React.FC<RoundedPieChartProps>;
export default RoundedPieChart;
//# sourceMappingURL=RoundedPieChart.d.ts.map