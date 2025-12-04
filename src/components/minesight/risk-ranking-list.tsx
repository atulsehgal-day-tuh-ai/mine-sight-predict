'use client';

import type { Risk, RiskLevel } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ShieldCheck, ShieldHalf, ShieldQuestion } from 'lucide-react';

interface RiskRankingListProps {
  risks: Risk[];
  selectedRiskId: string | null;
  onSelectRisk: (riskId: string) => void;
}

const riskLevelColors: Record<RiskLevel, string> = {
  critical: 'bg-red-500 dark:bg-red-700',
  high: 'bg-orange-500 dark:bg-orange-600',
  medium: 'bg-yellow-400 dark:bg-yellow-500',
  low: 'bg-green-500 dark:bg-green-600',
};

const riskLevelIcons: Record<RiskLevel, React.ElementType> = {
  critical: ShieldAlert,
  high: ShieldHalf,
  medium: ShieldCheck,
  low: ShieldQuestion,
};

export function RiskRankingList({ risks, selectedRiskId, onSelectRisk }: RiskRankingListProps) {
  const sortedRisks = [...risks].sort((a, b) => a.rank - b.rank);

  return (
    <Card className="h-full flex flex-col shadow-md rounded-lg border-none bg-transparent">
      <CardHeader className="pt-4 pb-2 px-4">
        <CardTitle className="text-lg font-semibold text-sidebar-foreground">Risk Ranking</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-4 pt-0">
          <ul className="space-y-2">
            {sortedRisks.map((risk) => {
              const IconComponent = riskLevelIcons[risk.level];
              return (
                <li key={risk.id}>
                  <button
                    onClick={() => onSelectRisk(risk.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-md transition-all duration-150 ease-in-out',
                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring',
                      selectedRiskId === risk.id ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg' : 'bg-sidebar-background text-sidebar-foreground hover:shadow-md'
                    )}
                    aria-pressed={selectedRiskId === risk.id}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className={cn("h-5 w-5", selectedRiskId === risk.id ? "text-sidebar-primary-foreground" : "text-primary")} />
                        <span className="font-medium">{risk.name}</span>
                      </div>
                      <Badge
                        variant={selectedRiskId === risk.id ? "secondary" : "default"}
                        className={cn(
                          riskLevelColors[risk.level],
                          'text-xs text-white px-2 py-0.5',
                           selectedRiskId === risk.id ? 'bg-opacity-100 text-primary' : 'bg-opacity-80'
                        )}
                      >
                        {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
                      </Badge>
                    </div>
                    <p className={cn(
                        "text-xs mt-1 truncate",
                        selectedRiskId === risk.id ? "text-sidebar-primary-foreground/80" : "text-muted-foreground"
                      )}
                    >
                      Rank: {risk.rank}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
