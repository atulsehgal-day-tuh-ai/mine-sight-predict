
// src/components/minesight/risk-trend-chart.tsx
'use client';

import type { RiskTrendDataPoint } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

interface RiskTrendChartProps {
  trendData: RiskTrendDataPoint[];
  riskName: string;
}

export function RiskTrendChart({ trendData, riskName }: RiskTrendChartProps) {
  const chartData = useMemo(() => 
    trendData.map(d => ({ ...d, date: new Date(d.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) })),
    [trendData]
  );
  
  const chartConfig = {
    value: {
      label: "Risk Score",
      color: "hsl(var(--primary))",
    },
  };

  if (!trendData || trendData.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-6 w-6 text-primary" />
            Risk Trend Analysis
          </CardTitle>
          <CardDescription>No trend data available for {riskName}.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Data unavailable</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="h-6 w-6 text-primary" />
          Risk Trend: {riskName}
        </CardTitle>
        <CardDescription>Fluctuation of risk score over the past 12 weeks.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                tickFormatter={(value) => value}
                style={{ fontSize: '0.75rem', fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                style={{ fontSize: '0.75rem', fill: 'hsl(var(--muted-foreground))' }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" labelClassName="text-sm" nameKey="name" hideLabel />}
              />
              <Line
                dataKey="value"
                type="monotone"
                stroke="var(--color-value)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "var(--color-value)", strokeWidth:0 }}
                activeDot={{ r: 6, strokeWidth:0, style: { boxShadow: "0 0 0 4px hsla(var(--primary), 0.2)"} }}
              />
               <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
