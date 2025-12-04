
'use client';

import { useRouter } from 'next/navigation'; // Added
import { MOCK_RISKS, getRiskFactors, getAreaFactorRatings } from '@/lib/mock-data';
import type { Risk, RiskLevel, RiskFactor, AreaRiskFactorRatings } from '@/types';
import { AppNavigation } from '@/components/minesight/app-navigation';
import { MineSiteMapDisplay } from '@/components/minesight/mine-site-map-display';
import { AreaRiskLevelTable } from '@/components/minesight/area-risk-level-table';
import { AiPageSummary } from '@/components/minesight/AiPageSummary';
import { AreaRiskFactorRatingsTable } from '@/components/minesight/area-risk-factor-ratings-table';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button'; // Added
import { PanelLeft, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

const getAreaRiskContextForAI = (
  risks: Risk[], 
  areaFactorRatings: AreaRiskFactorRatings[], 
  riskFactors: RiskFactor[]
): string => {
  const findRisk = (id: string) => risks.find(r => r.id === id);

  // Context from AreaRiskLevelTable
  const areasAndAssociatedRisks = [
    { name: 'Operaciones de Rajo Abierto', riskId: 'risk-co' },
    { name: 'Accesos y Obras de Mina Subterránea', riskId: 'risk-ca' },
    { name: 'Planta de Procesamiento de Mineral', riskId: 'risk-ce' },
    { name: 'Acopios y Manejo de Materiales', riskId: 'risk-ps' },
    { name: 'Depósito de Relaves', riskId: 'risk-il' },
    { name: 'Talleres de Mantenimiento', riskId: 'risk-am' },
    { name: 'Vías de Transporte y Tráfico del Sitio', riskId: 'risk-cv' },
  ];

  let context = "Esta página de resumen presenta varios análisis clave del riesgo del sitio minero. ";
  context += "Un mapa esquemático del sitio muestra las áreas operativas. ";
  context += "Una tabla de 'Niveles de Riesgo por Área' indica el riesgo dominante para áreas clave. ";
  
  const criticalAreas: string[] = [];
  const highAreas: string[] = [];
  
  areasAndAssociatedRisks.forEach(areaInfo => {
    const risk = findRisk(areaInfo.riskId);
    if (risk) {
      if (risk.level === 'critical') criticalAreas.push(areaInfo.name);
      if (risk.level === 'high') highAreas.push(areaInfo.name);
    }
  });

  if (criticalAreas.length > 0) {
    context += `Las áreas críticas según su riesgo dominante son: ${criticalAreas.join(', ')}. `;
  } else {
    context += "Actualmente no hay áreas con nivel de riesgo crítico según los riesgos dominantes. ";
  }
  if (highAreas.length > 0) {
    context += `Las áreas de alto riesgo dominante incluyen: ${highAreas.join(', ')}. `;
  }

  // Context from AreaRiskFactorRatingsTable
  context += "Adicionalmente, una 'Matriz de Calificación de Factores de Riesgo por Área' detalla cómo diversos factores (ej. fatiga, mantenimiento, geotecnia) contribuyen al perfil de riesgo de cada área, con calificaciones de 1 (bajo) a 5 (muy alto). ";
  
  // Example insights from the new table
  const openPitRatings = areaFactorRatings.find(a => a.areaId === 'open-pit');
  if (openPitRatings) {
    const geotechFactor = riskFactors.find(f => f.id === 'rf-geotech');
    const geotechRatingEntry = openPitRatings.factorRatings.find(fr => fr.factorId === 'rf-geotech');
    if (geotechFactor && geotechRatingEntry && geotechRatingEntry.rating >= 4) {
      context += `Por ejemplo, en 'Operaciones de Rajo Abierto', el factor '${geotechFactor.name}' tiene una calificación de ${geotechRatingEntry.rating}, indicando una alta contribución al riesgo. `;
    }
  }

  const undergroundRatings = areaFactorRatings.find(a => a.areaId === 'underground-mine');
  if (undergroundRatings) {
    const ventilationFactor = riskFactors.find(f => f.id === 'rf-ventilation');
    const ventilationRatingEntry = undergroundRatings.factorRatings.find(fr => fr.factorId === 'rf-ventilation');
    if (ventilationFactor && ventilationRatingEntry && ventilationRatingEntry.rating >= 4) {
      context += `En 'Accesos y Obras de Mina Subterránea', el factor '${ventilationFactor.name}' muestra una calificación de ${ventilationRatingEntry.rating}, señalando su importancia. `;
    }
  }
  
  context += "Esta combinación de vistas ayuda a identificar tanto los riesgos principales como los factores subyacentes que influyen en la seguridad de cada zona."
  return context.trim();
};


export default function RiskSummaryPage() {
  const router = useRouter(); // Added
  const pageTitle = "Resumen del Sitio y Riesgos por Área";
  const riskFactors = getRiskFactors();
  const areaFactorRatings = getAreaFactorRatings();
  const pageContentForAI = getAreaRiskContextForAI(MOCK_RISKS, areaFactorRatings, riskFactors);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r shadow-md">
        <SidebarHeader>
          <AppNavigation />
        </SidebarHeader>
        <Separator className="my-0 bg-sidebar-border" />
        <SidebarContent className="p-0">
          {/* Sidebar content for summary page, if any */}
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 shadow-sm">
          <SidebarTrigger className="md:hidden">
            <PanelLeft />
            <span className="sr-only">Alternar Barra Lateral</span>
          </SidebarTrigger>
          <Button variant="outline" size="sm" onClick={() => router.push('/')} className="hidden md:flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel
          </Button>
          <h1 className="text-lg font-semibold text-foreground flex-1 truncate md:ml-2">
            {pageTitle}
          </h1>
          <Button variant="outline" size="icon" onClick={() => router.push('/')} className="md:hidden" aria-label="Volver al Panel Principal">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Left column for Map */}
            <div className="xl:w-3/5 flex flex-col gap-6 xl:flex-shrink-0">
              <MineSiteMapDisplay />
            </div>
            {/* Right column for Area Risk Level Table */}
            <div className="xl:w-2/5 flex flex-col gap-6">
              <AreaRiskLevelTable risks={MOCK_RISKS} />
            </div>
          </div>
          <AreaRiskFactorRatingsTable 
            riskFactors={riskFactors} 
            areaFactorRatings={areaFactorRatings} 
          />
          <AiPageSummary pageTitle={pageTitle} pageContent={pageContentForAI} />
        </main>
      </SidebarInset>
    </div>
  );
}
