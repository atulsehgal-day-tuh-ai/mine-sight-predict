
'use client';

import { MOCK_HISTORICAL_ACCIDENTS, getHistoricalAccidents, MOCK_AREA_CCO_INSPECTIONS, getAreaCCOInspections } from '@/lib/mock-data';
import type { HistoricalAccident, AreaCCOInspections } from '@/types';
import { AppNavigation } from '@/components/minesight/app-navigation';
import { AreaPerformanceTornadoChart } from '@/components/minesight/area-performance-tornado-chart';
import { AiPageSummary } from '@/components/minesight/AiPageSummary';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { PanelLeft } from 'lucide-react';

const getAreaPerformanceContextForAI = (accidents: HistoricalAccident[], inspections: AreaCCOInspections[]): string => {
  const totalAccidents = accidents.length;
  const totalInspections = inspections.reduce((sum, item) => sum + item.totalInspections, 0);
  const totalFailedInspections = inspections.reduce((sum, item) => sum + item.failedInspections, 0);

  let context = `Esta página presenta un análisis comparativo del desempeño en seguridad por área del sitio minero. Se visualizan ${totalAccidents} incidentes históricos y ${totalInspections} inspecciones de Controles Críticos Operacionales (CCO). `;
  
  const mostIncidentsArea = inspections.map(inspArea => {
    const areaAccidents = accidents.filter(acc => acc.areaId === inspArea.areaId).length;
    return { name: inspArea.areaName, count: areaAccidents };
  }).sort((a,b) => b.count - a.count)[0];

  if (mostIncidentsArea && mostIncidentsArea.count > 0) {
    context += `El área con más incidentes registrados es '${mostIncidentsArea.name}' con ${mostIncidentsArea.count}. `;
  }

  const highestFailureRateArea = inspections.map(inspArea => {
    const failureRate = inspArea.totalInspections > 0 ? (inspArea.failedInspections / inspArea.totalInspections) * 100 : 0;
    return { name: inspArea.areaName, rate: failureRate, failedCount: inspArea.failedInspections };
  }).sort((a,b) => b.rate - a.rate)[0];

  if (highestFailureRateArea && highestFailureRateArea.failedCount > 0) {
    context += `El área '${highestFailureRateArea.name}' presenta la tasa más alta de inspecciones CCO fallidas (${highestFailureRateArea.rate.toFixed(1)}%). `;
  } else if (highestFailureRateArea) {
     context += `El área '${highestFailureRateArea.name}' tiene un buen registro de inspecciones CCO. `
  }

  context += `El gráfico de tornado detalla estos datos: a la izquierda, incidentes por severidad (Fatal, Grave, Menor, Casi Accidente); a la derecha, inspecciones CCO (totales, exitosas y fallidas). Esto ayuda a identificar áreas que requieren atención prioritaria.`;
  return context.trim();
};

export default function AreaPerformancePage() {
  const pageTitle = "Desempeño de Seguridad por Área";
  const historicalAccidents = getHistoricalAccidents();
  const ccoInspections = getAreaCCOInspections();
  const pageContentForAI = getAreaPerformanceContextForAI(historicalAccidents, ccoInspections);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r shadow-md">
        <SidebarHeader>
          <AppNavigation />
        </SidebarHeader>
        <Separator className="my-0 bg-sidebar-border" />
        <SidebarContent className="p-0">
          {/* Sidebar content for this page, if any */}
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 shadow-sm">
          <SidebarTrigger className="md:hidden">
            <PanelLeft />
            <span className="sr-only">Alternar Barra Lateral</span>
          </SidebarTrigger>
          <h1 className="text-lg font-semibold text-foreground flex-1">
            {pageTitle}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <AreaPerformanceTornadoChart 
            historicalAccidents={historicalAccidents}
            ccoInspections={ccoInspections}
          />
          <AiPageSummary pageTitle={pageTitle} pageContent={pageContentForAI} />
        </main>
      </SidebarInset>
    </div>
  );
}
