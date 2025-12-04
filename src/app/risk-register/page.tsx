
'use client';

import { useRouter } from 'next/navigation';
import { MOCK_RISKS } from '@/lib/mock-data';
import type { Risk, RiskLevel } from '@/types';
import { AppNavigation } from '@/components/minesight/app-navigation';
import { CompactRiskTrendChart } from '@/components/minesight/compact-risk-trend-chart';
import { AiPageSummary } from '@/components/minesight/AiPageSummary'; // Added import
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PanelLeft, ArrowLeft } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const riskLevelDisplayConfig: Record<RiskLevel, { text: string; className: string }> = {
  critical: { text: 'Critical', className: 'bg-red-600 hover:bg-red-600/90 text-white' },
  high: { text: 'High', className: 'bg-orange-500 hover:bg-orange-500/90 text-white' },
  medium: { text: 'Medium', className: 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900' },
  low: { text: 'Low', className: 'bg-yellow-200 hover:bg-yellow-200/80 text-yellow-800' },
};

const getRiskRegisterContextForAI = (risks: Risk[]): string => {
  const totalRisks = risks.length;
  let context = `Esta página presenta un registro detallado de ${totalRisks} riesgos identificados. `;
  context += "La tabla muestra el rango, nombre, descripción, nivel de criticidad (Crítico, Alto, Medio, Bajo) y la tendencia de las últimas 12 semanas para cada riesgo. ";
  
  const criticalRisksCount = risks.filter(r => r.level === 'critical').length;
  const highRisksCount = risks.filter(r => r.level === 'high').length;

  if (criticalRisksCount > 0) {
    context += `Actualmente hay ${criticalRisksCount} riesgo(s) de nivel crítico. `;
  }
  if (highRisksCount > 0) {
    context += `Hay ${highRisksCount} riesgo(s) de nivel alto. `;
  }
  
  const topRankedRisk = risks.length > 0 ? risks.sort((a, b) => a.rank - b.rank)[0] : null;
  if (topRankedRisk) {
    context += `El riesgo mejor rankeado es '${topRankedRisk.name}' (Rango: ${topRankedRisk.rank}, Nivel: ${riskLevelDisplayConfig[topRankedRisk.level].text}). `;
  }
  
  context += "Los usuarios pueden hacer clic en una fila de riesgo para navegar a una vista detallada que incluye diagramas Bow Tie y sugerencias de intervención. Esta vista general ayuda a priorizar los esfuerzos de mitigación de riesgos.";
  return context.trim();
};


export default function RiskRegisterPage() {
  const router = useRouter();
  const pageTitle = "Registro Detallado de Riesgos";
  const sortedRisksForTable = [...MOCK_RISKS].sort((a, b) => a.rank - b.rank);
  const pageContentForAI = getRiskRegisterContextForAI(sortedRisksForTable); // Added content generation

  const handleRiskRowClick = (riskId: string) => {
    router.push(`/risk-view?riskId=${riskId}`);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r shadow-md">
        <SidebarHeader>
          <AppNavigation />
        </SidebarHeader>
        <Separator className="my-0 bg-sidebar-border" />
        <SidebarContent className="p-0">
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 shadow-sm">
          <SidebarTrigger className="md:hidden">
            <PanelLeft />
            <span className="sr-only">Alternar Barra Lateral</span>
          </SidebarTrigger>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/summary')}
            className="hidden md:flex"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Resumen
          </Button>
          <h1 className="text-lg font-semibold text-foreground flex-1 truncate md:ml-2">
            {pageTitle}
          </h1>
           <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.push('/summary')}
            className="md:hidden"
            aria-label="Volver al Resumen"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <div className="rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-sm">Rango</TableHead>
                  <TableHead className="text-sm">Nombre del Riesgo</TableHead>
                  <TableHead className="text-sm">Descripción</TableHead>
                  <TableHead className="w-[120px] text-sm">Nivel</TableHead>
                  <TableHead className="w-[120px] text-sm text-center">Tendencia (12 Sem)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRisksForTable.map((risk: Risk) => (
                  <TableRow 
                    key={risk.id} 
                    onClick={() => handleRiskRowClick(risk.id)}
                    className="cursor-pointer hover:bg-muted/70"
                  >
                    <TableCell className="font-medium">{risk.rank}</TableCell>
                    <TableCell>{risk.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{risk.description}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                            "text-xs px-2 py-1 font-semibold",
                            riskLevelDisplayConfig[risk.level].className
                        )}
                      >
                        {riskLevelDisplayConfig[risk.level].text}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-center items-center py-2">
                        <CompactRiskTrendChart trendData={risk.trendData} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <AiPageSummary pageTitle={pageTitle} pageContent={pageContentForAI} /> {/* Added component usage */}
        </main>
      </SidebarInset>
    </div>
  );
}
