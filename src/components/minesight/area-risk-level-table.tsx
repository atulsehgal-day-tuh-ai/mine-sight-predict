
'use client';

import type { Risk, RiskLevel } from '@/types';
import { useRouter } from 'next/navigation'; // Added for navigation
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Layers } from 'lucide-react';

interface AreaRiskLevelTableProps {
  risks: Risk[];
}

const riskLevelDisplayConfig: Record<RiskLevel, { text: string; className: string }> = {
  critical: { text: 'Crítico', className: 'bg-red-600 hover:bg-red-600/90 text-white' },
  high: { text: 'Alto', className: 'bg-orange-500 hover:bg-orange-500/90 text-white' },
  medium: { text: 'Medio', className: 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900' },
  low: { text: 'Bajo', className: 'bg-yellow-200 hover:bg-yellow-200/80 text-yellow-800' },
};

const getAreaRiskLevels = (risks: Risk[]): { areaName: string; riskLevel: RiskLevel; areaId: string }[] => {
  const findRisk = (id: string) => risks.find(r => r.id === id);

  return [
    { areaName: 'Operaciones de Rajo Abierto', riskLevel: findRisk('risk-co')?.level || 'low', areaId: 'open-pit' },
    { areaName: 'Accesos y Obras de Mina Subterránea', riskLevel: findRisk('risk-ca')?.level || 'low', areaId: 'underground-mine' },
    { areaName: 'Planta de Procesamiento de Mineral', riskLevel: findRisk('risk-ce')?.level || 'low', areaId: 'processing-plant' },
    { areaName: 'Acopios y Manejo de Materiales', riskLevel: findRisk('risk-ps')?.level || 'low', areaId: 'stockpiles' },
    { areaName: 'Depósito de Relaves', riskLevel: findRisk('risk-il')?.level || 'low', areaId: 'tailings-storage' },
    { areaName: 'Talleres de Mantenimiento', riskLevel: findRisk('risk-am')?.level || 'low', areaId: 'maintenance-workshops' },
    { areaName: 'Vías de Transporte y Tráfico del Sitio', riskLevel: findRisk('risk-cv')?.level || 'low', areaId: 'haul-roads' },
    { areaName: 'Edificios Administrativos', riskLevel: 'low', areaId: 'admin-buildings' },
    { areaName: 'Sala de Control', riskLevel: 'low', areaId: 'control-room' },
    { areaName: 'Servicios de Seguridad y Emergencia', riskLevel: 'low', areaId: 'safety-emergency' },
  ].sort((a, b) => {
    const order: RiskLevel[] = ['critical', 'high', 'medium', 'low'];
    return order.indexOf(a.riskLevel) - order.indexOf(b.riskLevel);
  });
};

export function AreaRiskLevelTable({ risks }: AreaRiskLevelTableProps) {
  const router = useRouter();
  const areaRisks = getAreaRiskLevels(risks);

  const handleAreaRowClick = (areaId: string) => {
    router.push('/risk-register');
  };

  return (
    <Card className="shadow-lg rounded-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Layers className="h-6 w-6 text-primary" />
          Niveles de Riesgo por Área del Sitio
        </CardTitle>
        <CardDescription>Niveles de riesgo dominantes para áreas operativas clave. Haga clic en un área para ver riesgos detallados.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
        <div className="overflow-y-auto flex-grow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm">Nombre del Área</TableHead>
                <TableHead className="w-[120px] text-sm">Nivel de Riesgo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areaRisks.map((areaRisk, index) => (
                <TableRow 
                  key={index} 
                  onClick={() => handleAreaRowClick(areaRisk.areaId)}
                  className="cursor-pointer hover:bg-muted/70"
                >
                  <TableCell className="font-medium">{areaRisk.areaName}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-xs px-2 py-1 font-semibold w-full justify-center",
                        riskLevelDisplayConfig[areaRisk.riskLevel].className
                      )}
                    >
                      {riskLevelDisplayConfig[areaRisk.riskLevel].text}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
