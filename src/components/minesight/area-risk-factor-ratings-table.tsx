
'use client';

import type { RiskFactor, AreaRiskFactorRatings } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Added Tooltip imports
import { cn } from '@/lib/utils';
import { BarChartHorizontalBig } from 'lucide-react'; 

interface AreaRiskFactorRatingsTableProps {
  riskFactors: RiskFactor[];
  areaFactorRatings: AreaRiskFactorRatings[];
}

const getRatingBadgeClass = (rating: number): string => {
  if (rating === 5) return 'bg-red-600 hover:bg-red-600/90 text-white'; // Critical/Very High
  if (rating === 4) return 'bg-orange-500 hover:bg-orange-500/90 text-white'; // High
  if (rating === 3) return 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900'; // Medium
  if (rating === 2) return 'bg-lime-500 hover:bg-lime-500/90 text-lime-900'; // Low-Medium
  if (rating === 1) return 'bg-green-600 hover:bg-green-600/90 text-white'; // Low
  return 'bg-gray-400 text-gray-900'; // Default/Unknown
};

const getRatingText = (rating: number): string => {
  if (rating === 5) return 'Muy Alto';
  if (rating === 4) return 'Alto';
  if (rating === 3) return 'Medio';
  if (rating === 2) return 'Bajo-Medio';
  if (rating === 1) return 'Bajo';
  return 'N/A';
};

export function AreaRiskFactorRatingsTable({ riskFactors, areaFactorRatings }: AreaRiskFactorRatingsTableProps) {
  if (!riskFactors.length || !areaFactorRatings.length) {
    return (
      <Card className="shadow-lg rounded-lg mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChartHorizontalBig className="h-6 w-6 text-primary" />
            Matriz de Calificación de Factores de Riesgo por Área
          </CardTitle>
          <CardDescription>
            No hay datos disponibles para mostrar la calificación de factores de riesgo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Por favor, verifique la configuración de datos.</p>
        </CardContent>
      </Card>
    );
  }
  
  const areaRatingsMap = new Map<string, Map<string, number>>();
  areaFactorRatings.forEach(area => {
    const factorMap = new Map<string, number>();
    area.factorRatings.forEach(fr => {
      factorMap.set(fr.factorId, fr.rating);
    });
    areaRatingsMap.set(area.areaName, factorMap);
  });

  return (
    <Card className="shadow-lg rounded-lg mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <BarChartHorizontalBig className="h-6 w-6 text-primary" />
          Matriz de Calificación de Factores de Riesgo por Área
        </CardTitle>
        <CardDescription>
          Calificación (1-Bajo a 5-Muy Alto) de la contribución de cada factor al riesgo general del área. Pase el cursor sobre el nombre del factor para ver su descripción.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <TooltipProvider> {/* Added TooltipProvider */}
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm sticky left-0 bg-card z-10 w-[200px] min-w-[200px]">Área del Sitio</TableHead>
                {riskFactors.map(factor => (
                  <TableHead key={factor.id} className="text-sm text-center min-w-[150px]">
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger className="cursor-help underline-offset-2 hover:underline">
                        {factor.name}
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-sm">
                        <p>{factor.description || 'Sin descripción disponible.'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {areaFactorRatings.map((areaRating) => (
                <TableRow key={areaRating.areaId}>
                  <TableCell className="font-medium sticky left-0 bg-card z-10 w-[200px] min-w-[200px]">{areaRating.areaName}</TableCell>
                  {riskFactors.map(factor => {
                    const rating = areaRatingsMap.get(areaRating.areaName)?.get(factor.id);
                    return (
                      <TableCell key={factor.id} className="text-center">
                        {rating !== undefined ? (
                          <Badge
                            className={cn(
                              "text-xs px-2 py-1 font-semibold w-24 justify-center",
                              getRatingBadgeClass(rating)
                            )}
                          >
                            {getRatingText(rating)} ({rating})
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">N/A</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
