
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // Added
import { AppNavigation } from '@/components/minesight/app-navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, PanelLeft, Lightbulb, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { fetchStrategicRecommendations } from '@/actions/ai';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const realityFactorsList = [
  "Geología compleja con fallas estructurales mayores conocidas que impactan la estabilidad en ciertas zonas.",
  "Flota de equipos de extracción principal con una edad promedio de 8 años, requiriendo mayor frecuencia de mantenimiento.",
  "Presupuesto de CAPEX para mejoras de seguridad restringido para el próximo año fiscal.",
  "Objetivos de producción incrementales del 5% anual durante los próximos 3 años.",
  "Disponibilidad limitada de personal especializado en geotecnia y mantenimiento predictivo en la región."
];

export default function StrategicAdvisorPage() {
  const router = useRouter(); // Added
  const pageTitle = "Asesor Estratégico de Seguridad";
  const { toast } = useToast();

  const [tradeOffValue, setTradeOffValue] = useState<number[]>([50]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tradeOffLabel = useMemo(() => {
    const value = tradeOffValue[0];
    if (value < 20) return "Maximizar Producción (Alto Riesgo Operacional)";
    if (value < 40) return "Énfasis en Producción con Seguridad Moderada";
    if (value <= 60) return "Producción Equilibrada con Seguridad";
    if (value <= 80) return "Énfasis en Seguridad con Producción Moderada";
    return "Minimizar Incidentes (Producción Conservadora)";
  }, [tradeOffValue]);

  const handleGenerateRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    setReasoning('');

    const realityFactorsString = realityFactorsList.join("\n- ");

    try {
      const result = await fetchStrategicRecommendations({
        realityFactors: `- ${realityFactorsString}`, // Add bullet point for clarity in prompt
        tradeOffValue: tradeOffValue[0],
        tradeOffLabel: tradeOffLabel,
      });

      if (result.recommendations && result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
        setReasoning(result.reasoning);
        toast({
          title: "Recomendaciones Generadas",
          description: "La IA ha proporcionado nuevas recomendaciones estratégicas.",
          variant: "default"
        });
      } else if (result.reasoning?.startsWith("Error:")) {
         setError(result.reasoning);
         toast({
          title: "Error al Generar Recomendaciones",
          description: result.reasoning,
          variant: "destructive",
        });
      }
       else {
        setError("No se generaron recomendaciones. Por favor, intente ajustar los parámetros o inténtelo de nuevo más tarde.");
        toast({
          title: "Sin Recomendaciones",
          description: "La IA no generó recomendaciones para la configuración actual.",
          variant: "default"
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Ocurrió un error inesperado.";
      setError(errorMessage);
      toast({
        title: "Error de Red",
        description: `No se pudieron obtener las recomendaciones: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <ScrollArea className="flex-1">
          <main className="p-6 space-y-6 w-full">
            <Card className="shadow-lg rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  Realidad del Sitio Minero
                </CardTitle>
                <CardDescription>
                  Factores y restricciones actuales que influyen en la toma de decisiones estratégicas. Estos elementos se consideran fijos para este análisis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-foreground/90 pl-4">
                  {realityFactorsList.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Lightbulb className="h-6 w-6 text-accent" />
                  Resultados Deseados
                </CardTitle>
                <CardDescription>
                  Ajuste el control deslizante para indicar su preferencia entre maximizar la producción y minimizar los incidentes. Esto guiará las recomendaciones de la IA.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-foreground">Maximizar Producción</span>
                  <span className="text-xl font-bold text-foreground">Minimizar Incidentes</span>
                </div>
                <Slider
                  value={tradeOffValue}
                  onValueChange={setTradeOffValue}
                  max={100}
                  step={1}
                  className="my-2"
                  disabled={isLoading}
                />
                <p className="text-sm text-center font-medium text-primary">
                  Preferencia Actual: {tradeOffLabel} (Valor: {tradeOffValue[0]})
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerateRecommendations} 
                  disabled={isLoading} 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? 'Generando...' : 'Obtener Recomendaciones Estratégicas'}
                  {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-lg rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-6 w-6 text-green-500" />
                  Recomendaciones Estratégicas de IA
                </CardTitle>
                <CardDescription>
                  Sugerencias generadas por IA basadas en la realidad del sitio y sus resultados deseados.
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[200px]">
                {isLoading && (
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </div>
                )}
                {error && !isLoading && (
                  <div className="p-4 rounded-md bg-destructive/10 text-destructive flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                        <p className="font-semibold text-sm">Error al generar recomendaciones:</p>
                        <p className="text-xs">{error}</p>
                    </div>
                  </div>
                )}
                {!isLoading && !error && recommendations.length === 0 && (
                  <p className="p-4 text-sm text-center text-muted-foreground">
                    Ajuste el control deslizante y haga clic en "Obtener Recomendaciones Estratégicas" para ver las sugerencias de la IA.
                  </p>
                )}
                {!isLoading && !error && recommendations.length > 0 && (
                  <div className="space-y-4 p-2">
                    <div>
                      <h4 className="font-semibold text-md text-foreground mb-1.5">Recomendaciones Clave:</h4>
                      <ul className="list-decimal list-inside space-y-2 text-sm text-foreground/90 bg-muted/30 p-3 rounded-md">
                        {recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-md text-foreground mb-1.5">Razonamiento de la IA:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md whitespace-pre-line">{reasoning}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </main>
        </ScrollArea>
      </SidebarInset>
    </div>
  );
}
