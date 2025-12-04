
'use client';

import type { Risk, BowTieEntity as RiskBowTieEntity, BowTieControl as RiskBowTieControl } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Network } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface BowTieDiagramProps {
  risk: Risk | null;
}

const getGradientColor = (value: number): string => {
  const clampedValue = Math.max(0, Math.min(1, value));
  const hue = (1 - clampedValue) * 60; 
  return `hsl(${hue}, 90%, 90%)`;
};

interface ProcessedBowTieItem {
  name: string;
  originalValue: number; 
  heatmapScore: number; 
  type: 'cause' | 'consequence' | 'preventiveControl' | 'mitigatingControl';
}

const EntityCard: React.FC<{ title: string; items: ProcessedBowTieItem[]; entityType: 'cause' | 'consequence' }> = ({ title, items, entityType }) => {
  const helpText = entityType === 'cause' 
    ? "Red: Higher Probability, Yellow: Lower Probability" 
    : "Red: Higher Impact, Yellow: Lower Impact";
  
  return (
    <div className="flex-1 p-3 bg-card/50 rounded-lg shadow-inner min-w-[180px]">
      <h3 className="text-sm font-semibold text-center mb-1 text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground text-center mb-2">{helpText}</p>
      <div className="space-y-1.5">
        {items.map((item, index) => (
          <div
            key={`${item.type}-${index}`}
            className="p-2 rounded text-xs text-card-foreground shadow-sm"
            style={{ backgroundColor: getGradientColor(item.heatmapScore) }}
          >
            {item.name}
            <div className="text-right text-xs text-foreground/90 font-semibold mt-0.5">
              {entityType === 'cause' ? 'Prob: ' : 'Impact: '} {(item.originalValue * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ControlCard: React.FC<{ title: string; items: ProcessedBowTieItem[] }> = ({ title, items }) => {
  const helpText = "Red: Lower Effectiveness, Yellow: Higher Effectiveness";
  return (
    <div className="flex-1 p-3 bg-card/50 rounded-lg shadow-inner min-w-[180px]">
      <h3 className="text-sm font-semibold text-center mb-1 text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground text-center mb-2">{helpText}</p>
      <div className="space-y-1.5">
        {items.map((item, index) => (
          <div
            key={`${item.type}-${index}`}
            className="p-2 rounded text-xs text-card-foreground shadow-sm"
            style={{ backgroundColor: getGradientColor(item.heatmapScore) }}
          >
            {item.name}
            <div className="text-right text-xs text-foreground/90 font-semibold mt-0.5">
              Effective: {(item.originalValue * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConnectingLines: React.FC<{ count: number; direction: 'left' | 'right' }> = ({ count, direction }) => (
  <div className={cn("flex flex-col justify-around items-center w-8 mx-1", count === 0 && "hidden")}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-px w-full bg-border my-2" />
    ))}
  </div>
);

function processItemsForHeatmap<T extends RiskBowTieEntity | RiskBowTieControl>(
  items: T[],
  valueSelector: (item: T) => number,
  lowerIsBetterForColoring: boolean, // True if a lower originalValue should result in a "better" color (yellow for heatmapScore 0)
  type: ProcessedBowTieItem['type']
): ProcessedBowTieItem[] {
  if (!items || items.length === 0) {
    return [];
  }

  const rawValues = items.map(item => valueSelector(item));
  const minValue = Math.min(...rawValues);
  const maxValue = Math.max(...rawValues);

  return items.map((item, index) => {
    const currentValue = rawValues[index];
    let heatmapScore: number; // 0 (yellow) to 1 (red)

    if (minValue === maxValue) {
      // If all values are the same, determine color by absolute value on a 0-1 scale.
      // lowerIsBetterForColoring (e.g., effectiveness): higher value is better, so closer to 0 (yellow). (1 - currentValue)
      // !lowerIsBetterForColoring (e.g., probability/impact): higher value is worse, so closer to 1 (red). (currentValue)
      heatmapScore = lowerIsBetterForColoring ? (1 - currentValue) : currentValue;
    } else {
      // Normalize the current value within its column's range (0 to 1)
      const normalizedValue = (currentValue - minValue) / (maxValue - minValue);
      
      // If lower original value is better (e.g. effectiveness), a higher normalized value means it's one of the "better" items.
      // To make "better" = yellow (heatmapScore 0), we use (1 - normalizedValue).
      // If higher original value is better (which is not the case for prob/impact, where higher is worse),
      // a higher normalized value also means it's one of the "better" items. (1 - normalizedValue).

      // If lowerIsBetterForColoring is true (like for effectiveness, where higher effectiveness means lower 'badness' for color),
      // then a high normalized value (closer to 1) corresponds to high effectiveness.
      // We want high effectiveness to be yellow (heatmapScore 0), so we use (1 - normalizedValue).
      // If lowerIsBetterForColoring is false (like for probability/impact, where higher means higher 'badness' for color),
      // then a high normalized value (closer to 1) corresponds to high probability/impact.
      // We want high probability/impact to be red (heatmapScore 1), so we use normalizedValue.
      heatmapScore = lowerIsBetterForColoring ? (1 - normalizedValue) : normalizedValue;
    }
    
    return {
      name: item.name,
      originalValue: valueSelector(item),
      heatmapScore: Math.max(0, Math.min(1, heatmapScore)), 
      type,
    };
  });
}


export function BowTieDiagram({ risk }: BowTieDiagramProps) {
  const processedData = useMemo(() => {
    if (!risk) return null;
    
    // For causes and consequences: lower probability/impact is better for the business,
    // but for coloring, higher probability/impact = redder (heatmapScore 1). So, lowerIsBetterForColoring = false.
    const causes = processItemsForHeatmap(risk.causes, item => item.probabilityOrImpact, false, 'cause');
    const consequences = processItemsForHeatmap(risk.consequences, item => item.probabilityOrImpact, false, 'consequence');
    
    // For controls: higher effectiveness is better for the business.
    // For coloring, higher effectiveness = yellower (heatmapScore 0). So, lowerIsBetterForColoring = true.
    const preventiveControls = processItemsForHeatmap(risk.preventiveControls, item => item.effectiveness, true, 'preventiveControl');
    const mitigatingControls = processItemsForHeatmap(risk.mitigatingControls, item => item.effectiveness, true, 'mitigatingControl');
    
    return { causes, preventiveControls, mitigatingControls, consequences };
  }, [risk]);

  if (!risk || !processedData) {
    return (
      <Card className="shadow-lg rounded-lg min-h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Network className="h-6 w-6 text-primary" />
            Bow Tie Diagram
          </CardTitle>
          <CardDescription>Select a risk to view its Bow Tie diagram.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No risk selected.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Network className="h-6 w-6 text-primary" />
          Bow Tie: {risk.name}
        </CardTitle>
        <CardDescription>{risk.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-stretch justify-center gap-2 text-center text-xs overflow-x-auto pb-4">
          <EntityCard title="Root Causes" items={processedData.causes} entityType="cause" />
          <ConnectingLines count={Math.max(processedData.causes.length, processedData.preventiveControls.length)} direction="right" />
          <ControlCard title="Preventive Controls" items={processedData.preventiveControls} />
          <ConnectingLines count={1} direction="right" />
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-primary/10 border-2 border-primary rounded-lg shadow-md min-w-[150px] max-w-[200px]">
            <h3 className="text-base font-bold text-primary mb-1">{risk.name}</h3>
            <p className="text-xs text-primary/80">Central Risk Event</p>
          </div>
          <ConnectingLines count={1} direction="left" />
          <ControlCard title="Mitigating Controls" items={processedData.mitigatingControls} />
          <ConnectingLines count={Math.max(processedData.mitigatingControls.length, processedData.consequences.length)} direction="left" />
          <EntityCard title="Potential Consequences" items={processedData.consequences} entityType="consequence" />
        </div>
      </CardContent>
    </Card>
  );
}

