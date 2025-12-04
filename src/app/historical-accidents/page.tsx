
'use client';

import { useRouter } from 'next/navigation'; // Added
import { MOCK_HISTORICAL_ACCIDENTS, getHistoricalAccidents, MOCK_AREA_CCO_INSPECTIONS, getAreaCCOInspections } from '@/lib/mock-data';
import type { HistoricalAccident, AccidentSeverity, AreaCCOInspections } from '@/types';
import { AppNavigation } from '@/components/minesight/app-navigation';
import { AiPageSummary } from '@/components/minesight/AiPageSummary';
import { MineSiteMapDisplay } from '@/components/minesight/mine-site-map-display';
import { AreaPerformanceTornadoChart } from '@/components/minesight/area-performance-tornado-chart';
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const severityDisplayConfig: Record<AccidentSeverity, { text: string; className: string }> = {
  Fatal: { text: 'Fatal', className: 'bg-red-700 hover:bg-red-700/90 text-white' },
  Serious: { text: 'Grave', className: 'bg-red-500 hover:bg-red-500/90 text-white' },
  Minor: { text: 'Menor', className: 'bg-orange-400 hover:bg-orange-400/90 text-orange-900' },
  'Near Miss': { text: 'Casi Accidente', className: 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900' },
};

const getPageContextForAI = (accidents: HistoricalAccident[], inspections: AreaCCOInspections[]): string => {
  let context = `Esta página presenta un análisis del desempeño histórico y actual de seguridad del sitio minero. `;

  // Tornado chart context
  const totalAccidentsForTornado = accidents.length;
  const totalInspectionsForTornado = inspections.reduce((sum, item) => sum + item.totalInspections, 0);
  context += `Un gráfico de tornado compara ${totalAccidentsForTornado} incidentes históricos (por severidad: Fatal, Grave, Menor, Casi Accidente) a la izquierda, con ${totalInspectionsForTornado} inspecciones de Controles Críticos Operacionales (CCO) (totales, exitosas y fallidas) a la derecha, para cada área. Esto ayuda a identificar áreas que requieren atención prioritaria en términos de incidentes y cumplimiento de CCO. `;
  
  const mostIncidentsArea = inspections.map(inspArea => {
    const areaAccidents = accidents.filter(acc => acc.areaId === inspArea.areaId).length;
    return { name: inspArea.areaName, count: areaAccidents };
  }).sort((a,b) => b.count - a.count)[0];

  if (mostIncidentsArea && mostIncidentsArea.count > 0) {
    context += `Según el gráfico, el área con más incidentes registrados es '${mostIncidentsArea.name}' con ${mostIncidentsArea.count}. `;
  }

  // Historical accidents log context
  const totalAccidentsInLog = accidents.length;
  if (totalAccidentsInLog === 0) {
    context += "No hay datos de accidentes históricos disponibles en el registro detallado. ";
  } else {
    const severities = accidents.reduce((acc, curr) => {
      const severityText = severityDisplayConfig[curr.severity]?.text || curr.severity;
      acc[severityText] = (acc[severityText] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const areas = accidents.reduce((acc, curr) => {
      acc[curr.areaName] = (acc[curr.areaName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const sortedAreas = Object.entries(areas).sort(([,a],[,b]) => b-a);
    const mostCommonAreaLog = sortedAreas.length > 0 ? sortedAreas[0][0] : "N/A";
    
    context += `El registro histórico de accidentes detalla ${totalAccidentsInLog} incidentes. `;
    context += `Desglose por severidad: ${Object.entries(severities).map(([sev, count]) => `${sev}: ${count}`).join(', ')}. `;
    if (sortedAreas.length > 0) {
      context += `El área más afectada en el registro es ${mostCommonAreaLog}. `;
    }
    context += "La tabla detalla cada incidente, incluyendo factores contribuyentes y lecciones aprendidas, accesibles mediante un acordeón. ";
  }
  
  context += "Adicionalmente, se muestra un mapa del sitio para referencia visual de las áreas mencionadas.";
  return context.trim();
};


export default function HistoricalAnalysisPage() {
  const router = useRouter(); // Added
  const pageTitle = "Análisis Histórico y Desempeño por Área";
  const historicalAccidents = getHistoricalAccidents(); 
  const ccoInspections = getAreaCCOInspections();
  const pageContentForAI = getPageContextForAI(historicalAccidents, ccoInspections);

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
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-[480px] xl:w-[520px] flex flex-col flex-shrink-0"> {/* Map Column */}
              <MineSiteMapDisplay />
            </div>
            <div className="flex-1 flex flex-col min-w-0"> {/* Accident Log Column */}
              <Card className="shadow-lg rounded-lg flex-grow">
                <CardHeader>
                    <CardTitle>Registro Detallado de Accidentes</CardTitle>
                    <CardDescription>Revise incidentes pasados para informar futuras medidas de seguridad. Haga clic en un incidente para expandir detalles.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Accordion type="multiple" className="w-full">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px] text-sm">Fecha</TableHead>
                            <TableHead className="text-sm">Área</TableHead>
                            <TableHead className="text-sm">Descripción</TableHead>
                            <TableHead className="w-[120px] text-sm">Severidad</TableHead>
                            <TableHead className="w-[80px] text-center text-sm">Detalles</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {historicalAccidents.map((accident: HistoricalAccident) => (
                            <AccordionItem value={accident.id} key={accident.id}>
                            <>
                                <TableRow className="border-b-0">
                                <TableCell className="font-medium align-top py-3">{format(new Date(accident.date), 'MMM dd, yyyy', { locale: es })}</TableCell>
                                <TableCell className="align-top py-3">{accident.areaName}</TableCell>
                                <TableCell className="text-xs text-muted-foreground max-w-md align-top py-3">{accident.description}</TableCell>
                                <TableCell className="align-top py-3">
                                    <Badge
                                    className={cn(
                                        "text-xs px-2 py-1 font-semibold",
                                        severityDisplayConfig[accident.severity].className
                                    )}
                                    >
                                    {severityDisplayConfig[accident.severity].text}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center align-top py-3">
                                    <AccordionTrigger className="p-2 hover:bg-primary/20 hover:text-primary rounded-md [&[data-state=open]>svg]:text-primary"/>
                                </TableCell>
                                </TableRow>
                                <TableRow className="bg-muted/30 hover:bg-muted/40">
                                    <TableCell colSpan={5} className="p-0">
                                        <AccordionContent className="p-4 space-y-3 text-sm">
                                            <div>
                                                <h4 className="font-semibold text-foreground/90">Factores Contribuyentes:</h4>
                                                {accident.contributingFactors.length > 0 ? (
                                                    <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-0.5 mt-1">
                                                        {accident.contributingFactors.map((factor, idx) => <li key={idx}>{factor}</li>)}
                                                    </ul>
                                                ) : <p className="text-muted-foreground italic ml-4 mt-1">No especificados.</p>}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground/90">Lecciones Aprendidas:</h4>
                                                {accident.lessonsLearned.length > 0 ? (
                                                <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-0.5 mt-1">
                                                    {accident.lessonsLearned.map((lesson, idx) => <li key={idx}>{lesson}</li>)}
                                                </ul>
                                                ) : <p className="text-muted-foreground italic ml-4 mt-1">No especificadas.</p>}
                                            </div>
                                            {accident.personnelInvolved !== undefined && <p><span className="font-semibold">Personal Involucrado:</span> {accident.personnelInvolved}</p>}
                                            {accident.equipmentDamaged && accident.equipmentDamaged.length > 0 && 
                                                <p><span className="font-semibold">Equipamiento Dañado:</span> {accident.equipmentDamaged.join(', ')}</p>
                                            }
                                        </AccordionContent>
                                    </TableCell>
                                </TableRow>
                            </>
                            </AccordionItem>
                        ))}
                        {historicalAccidents.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                                    No hay accidentes históricos registrados.
                                </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                    </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
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

