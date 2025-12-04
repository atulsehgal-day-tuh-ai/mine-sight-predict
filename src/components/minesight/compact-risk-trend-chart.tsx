
'use client';

import type { RiskTrendDataPoint } from '@/types';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

interface CompactRiskTrendChartProps {
  trendData: RiskTrendDataPoint[];
}

export function CompactRiskTrendChart({ trendData }: CompactRiskTrendChartProps) {
  const chartData = useMemo(() =>
    trendData.map(d => ({ ...d, dateNum: new Date(d.date).getTime(), value: d.value })),
    [trendData]
  );

  if (!trendData || trendData.length < 2) { // LineChart needs at least 2 points
    return <div className="h-8 w-20 flex items-center justify-center text-xs text-muted-foreground/70">No data</div>;
  }

  return (
    <div className="h-8 w-20"> {/* Controls the size of the chart area */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <XAxis dataKey="dateNum" type="number" domain={['dataMin', 'dataMax']} hide />
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
