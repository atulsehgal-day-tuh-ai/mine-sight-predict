
'use client';

import type { HistoricalAccident, AreaCCOInspections, AccidentSeverity } from '@/types';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, LabelList } from 'recharts';
import { ListChecks } from 'lucide-react';

interface AreaPerformanceTornadoChartProps {
  historicalAccidents: HistoricalAccident[];
  ccoInspections: AreaCCOInspections[];
}

interface ChartDataEntry {
  areaName: string;
  // Original Incident counts (these are negative for left side plotting)
  fatalIncidents: number;
  seriousIncidents: number;
  minorIncidents: number;
  nearMissIncidents: number;
  // Scaled Incident counts for plotting (negative, range -100 to 0)
  scaledFatalIncidents: number;
  scaledSeriousIncidents: number;
  scaledMinorIncidents: number;
  scaledNearMissIncidents: number;

  // Original CCO Inspections counts (positive)
  totalInspections: number;
  failedInspections: number;
  passedInspections: number; 
  // Scaled CCO Inspections counts for plotting (positive, range 0 to 100)
  scaledPassedInspections: number;
  scaledFailedInspections: number;
}

const severityDisplayConfig: Record<AccidentSeverity, { text: string; color: string; originalDataKey: keyof ChartDataEntry; scaledDataKey: keyof ChartDataEntry }> = {
  Fatal: { text: 'Fatal', color: 'hsl(var(--destructive))', originalDataKey: 'fatalIncidents', scaledDataKey: 'scaledFatalIncidents' },
  Serious: { text: 'Grave', color: 'hsl(var(--chart-2))', originalDataKey: 'seriousIncidents', scaledDataKey: 'scaledSeriousIncidents' },
  Minor: { text: 'Menor', color: 'hsl(var(--chart-4))', originalDataKey: 'minorIncidents', scaledDataKey: 'scaledMinorIncidents' },
  'Near Miss': { text: 'Casi Accidente', color: 'hsl(var(--chart-5))', originalDataKey: 'nearMissIncidents', scaledDataKey: 'scaledNearMissIncidents' },
};

export function AreaPerformanceTornadoChart({ historicalAccidents, ccoInspections }: AreaPerformanceTornadoChartProps) {
  const processedChartData = useMemo(() => {
    const intermediateData: Omit<ChartDataEntry, 
      'scaledFatalIncidents' | 'scaledSeriousIncidents' | 'scaledMinorIncidents' | 'scaledNearMissIncidents' | 
      'scaledPassedInspections' | 'scaledFailedInspections'
    >[] = ccoInspections.map(area => ({
      areaName: area.areaName,
      fatalIncidents: 0,
      seriousIncidents: 0,
      minorIncidents: 0,
      nearMissIncidents: 0,
      totalInspections: area.totalInspections,
      failedInspections: area.failedInspections,
      passedInspections: area.totalInspections - area.failedInspections,
    }));

    const areaMap = new Map<string, (typeof intermediateData)[0]>();
    intermediateData.forEach(item => areaMap.set(item.areaName, item)); // Assuming areaName is unique for mapping

    historicalAccidents.forEach(acc => {
      // Find area by areaName, as ccoInspections uses areaName for display
      const areaEntry = Array.from(areaMap.values()).find(entry => entry.areaName === acc.areaName);
      if (areaEntry) {
        switch (acc.severity) {
          case 'Fatal': areaEntry.fatalIncidents--; break;
          case 'Serious': areaEntry.seriousIncidents--; break;
          case 'Minor': areaEntry.minorIncidents--; break;
          case 'Near Miss': areaEntry.nearMissIncidents--; break;
        }
      }
    });
    
    const populatedData = Array.from(areaMap.values());

    const maxAbsTotalIncidentValue = Math.max(
        ...populatedData.map(d => 
            Math.abs(d.fatalIncidents) + 
            Math.abs(d.seriousIncidents) + 
            Math.abs(d.minorIncidents) + 
            Math.abs(d.nearMissIncidents)
        )
    ) || 1; // Use 1 to prevent division by zero

    const maxTotalInspectionValue = Math.max(...populatedData.map(d => d.totalInspections)) || 1;

    return populatedData.map(d => ({
      ...d,
      scaledFatalIncidents: (d.fatalIncidents / maxAbsTotalIncidentValue) * 100,
      scaledSeriousIncidents: (d.seriousIncidents / maxAbsTotalIncidentValue) * 100,
      scaledMinorIncidents: (d.minorIncidents / maxAbsTotalIncidentValue) * 100,
      scaledNearMissIncidents: (d.nearMissIncidents / maxAbsTotalIncidentValue) * 100,
      scaledPassedInspections: (d.passedInspections / maxTotalInspectionValue) * 100,
      scaledFailedInspections: (d.failedInspections / maxTotalInspectionValue) * 100,
    }));

  }, [historicalAccidents, ccoInspections]);

  const chartConfig = {
    totalInspections: { label: 'Inspecciones Totales CCO', color: 'hsl(var(--chart-1))' },
    failedInspections: { label: 'Inspecciones Fallidas CCO', color: 'hsl(var(--destructive))' },
    passedInspections: { label: 'Inspecciones Exitosas CCO', color: 'hsl(var(--chart-3))' },
    fatalIncidents: { label: severityDisplayConfig.Fatal.text, color: severityDisplayConfig.Fatal.color },
    seriousIncidents: { label: severityDisplayConfig.Serious.text, color: severityDisplayConfig.Serious.color },
    minorIncidents: { label: severityDisplayConfig.Minor.text, color: severityDisplayConfig.Minor.color },
    nearMissIncidents: { label: severityDisplayConfig['Near Miss'].text, color: severityDisplayConfig['Near Miss'].color },
  };
  
  if (!processedChartData || processedChartData.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ListChecks className="h-6 w-6 text-primary" />
            Análisis de Desempeño por Área (Gráfico de Tornado)
          </CardTitle>
          <CardDescription>Comparación de incidentes y verificaciones de CCO por área.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No hay datos disponibles para mostrar el gráfico.</p>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; // original data object for the area
      return (
        <div className="bg-popover text-popover-foreground border rounded-md shadow-lg p-3 text-xs">
          <p className="font-bold text-sm mb-2">{label}</p>
          <p className="font-semibold text-primary">Inspecciones CCO:</p>
          <ul className="list-disc list-inside ml-2 mb-2">
            <li>Totales: <span className="font-medium">{data.totalInspections}</span></li>
            <li>Exitosas: <span className="font-medium text-green-600">{data.passedInspections}</span></li>
            <li>Fallidas: <span className="font-medium text-red-600">{data.failedInspections}</span></li>
          </ul>
          <p className="font-semibold text-destructive">Incidentes:</p>
          <ul className="list-disc list-inside ml-2">
            {Object.values(severityDisplayConfig).map(sevConfig => {
              const count = Math.abs(data[sevConfig.originalDataKey] || 0);
              return count > 0 ? <li key={sevConfig.originalDataKey}>{sevConfig.text}: <span className="font-medium">{count}</span></li> : null;
            })}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ListChecks className="h-6 w-6 text-primary" />
          Análisis de Desempeño por Área (Gráfico de Tornado)
        </CardTitle>
        <CardDescription>
          Comparación de incidentes y verificaciones de CCO por área. Las barras están escaladas para una mejor comparación visual; los números exactos se muestran en las etiquetas y al pasar el cursor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={processedChartData}
              margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[-100, 100]} allowDataOverflow={true} tickFormatter={(value) => Math.abs(value).toString()} tick={{ fontSize: '0.875rem' }} />
              <YAxis 
                type="category" 
                dataKey="areaName" 
                width={180} 
                tick={{ fontSize: '0.875rem' }} 
                interval={0}
              />
              <RechartsTooltip content={<CustomTooltipContent />} cursor={{ fill: 'hsl(var(--muted)/0.3)' }}/>
              <RechartsLegend wrapperStyle={{ fontSize: '1rem', paddingTop: '10px' }}/>

              {/* Incident Bars (Left - Negative Values) - Use scaledDataKey for Bar length, originalDataKey for LabelList value */}
              <Bar dataKey={severityDisplayConfig.Fatal.scaledDataKey} name={severityDisplayConfig.Fatal.text} stackId="incidents" fill={severityDisplayConfig.Fatal.color} radius={[0, 4, 4, 0]} barSize={12}>
                 <LabelList dataKey={severityDisplayConfig.Fatal.originalDataKey} position="insideLeft" formatter={(value: number) => value !== 0 ? Math.abs(value) : ''} style={{ fill: 'white', fontSize: '10px' }} />
              </Bar>
              <Bar dataKey={severityDisplayConfig.Serious.scaledDataKey} name={severityDisplayConfig.Serious.text} stackId="incidents" fill={severityDisplayConfig.Serious.color} radius={[0, 4, 4, 0]} barSize={12}>
                <LabelList dataKey={severityDisplayConfig.Serious.originalDataKey} position="insideLeft" formatter={(value: number) => value !== 0 ? Math.abs(value) : ''} style={{ fill: 'white', fontSize: '10px' }} />
              </Bar>
              <Bar dataKey={severityDisplayConfig.Minor.scaledDataKey} name={severityDisplayConfig.Minor.text} stackId="incidents" fill={severityDisplayConfig.Minor.color} radius={[0, 4, 4, 0]} barSize={12}>
                 <LabelList dataKey={severityDisplayConfig.Minor.originalDataKey} position="insideLeft" formatter={(value: number) => value !== 0 ? Math.abs(value) : ''} style={{ fill: 'black', fontSize: '10px' }} />
              </Bar>
              <Bar dataKey={severityDisplayConfig['Near Miss'].scaledDataKey} name={severityDisplayConfig['Near Miss'].text} stackId="incidents" fill={severityDisplayConfig['Near Miss'].color} radius={[4, 0, 0, 4]} barSize={12}>
                 <LabelList dataKey={severityDisplayConfig['Near Miss'].originalDataKey} position="insideLeft" formatter={(value: number) => value !== 0 ? Math.abs(value) : ''} style={{ fill: 'black', fontSize: '10px' }} />
              </Bar>
              
              {/* CCO Inspection Bars (Right - Positive Values) - Use scaledDataKey for Bar length, originalDataKey for LabelList value */}
              <Bar dataKey="scaledPassedInspections" name={chartConfig.passedInspections.label} stackId="inspections" fill={chartConfig.passedInspections.color} radius={[0, 4, 4, 0]} barSize={12}>
                <LabelList dataKey="passedInspections" position="insideRight" formatter={(value: number) => value !== 0 ? value : ''} style={{ fill: 'white', fontSize: '10px' }} />
              </Bar>
              <Bar dataKey="scaledFailedInspections" name={chartConfig.failedInspections.label} stackId="inspections" fill={chartConfig.failedInspections.color} radius={[4, 0, 0, 4]} barSize={12}>
                <LabelList dataKey="failedInspections" position="insideRight" formatter={(value: number) => value !== 0 ? value : ''} style={{ fill: 'white', fontSize: '10px' }} />
              </Bar>

            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

    
