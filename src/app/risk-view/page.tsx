
'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Risk } from '@/types';
import { MOCK_RISKS, getRiskById } from '@/lib/mock-data';
import { RiskDetailView } from '@/components/minesight/risk-detail-view';
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
import { PanelLeft, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Fallback skeleton for the dynamic content area (SidebarInset)
function DynamicContentSkeleton() {
  return (
    <SidebarInset className="flex-1 flex flex-col overflow-hidden">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 shadow-sm">
        <SidebarTrigger className="md:hidden">
          <PanelLeft />
          <span className="sr-only">Alternar Barra Lateral</span>
        </SidebarTrigger>
        <Button variant="outline" size="sm" className="hidden md:flex opacity-50 cursor-not-allowed" disabled>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Registro de Riesgos
        </Button>
        <Skeleton className="h-6 w-3/5 ml-2" /> {/* Skeleton for page title */}
         <Button variant="outline" size="icon" className="md:hidden opacity-50 cursor-not-allowed" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
      </header>
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Skeleton for RiskDetailView content */}
        <Skeleton className="h-10 w-3/4 mb-1" /> {/* Risk name */}
        <Skeleton className="h-5 w-full mb-4" /> {/* Risk description */}
        
        {/* Skeleton for BowTieDiagram Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/2 mb-1" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="min-h-[250px] flex items-center justify-center">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>

        {/* Skeleton for InterventionSuggestions Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/2 mb-1" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="min-h-[180px] space-y-3">
            <Skeleton className="h-16 w-full" /> {/* Textarea placeholder */}
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-full" /> 
          </CardContent>
          <CardFooter>
              <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </main>
    </SidebarInset>
  );
}

// Component containing all dynamic logic and rendering for the risk view
function RiskViewDynamicContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize state directly from searchParams for the first render attempt.
  // useEffect will then refine this.
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(() => searchParams.get('riskId'));
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  // Effect to synchronize selectedRiskId with URL and handle default risk selection
  useEffect(() => {
    const riskIdFromUrl = searchParams.get('riskId');

    if (riskIdFromUrl) {
      // If URL has a riskId, ensure state matches if it's different
      if (riskIdFromUrl !== selectedRiskId) {
        setSelectedRiskId(riskIdFromUrl);
      }
    } else {
      // No riskId in URL, attempt to set a default if risks are available
      if (MOCK_RISKS.length > 0) {
        const highestRankRisk = MOCK_RISKS.sort((a, b) => a.rank - b.rank)[0];
        if (highestRankRisk?.id) {
          // Replace URL to set the default. This will trigger this effect again.
          // The new `searchParams` will then have `riskIdFromUrl`.
          router.replace(`/risk-view?riskId=${highestRankRisk.id}`);
        } else {
          setSelectedRiskId(null); // No valid default risk
        }
      } else {
        setSelectedRiskId(null); // No risks available
      }
    }
  }, [searchParams, router, selectedRiskId]);

  // Effect to fetch risk details when selectedRiskId changes
  useEffect(() => {
    if (selectedRiskId) {
      const riskDetail = getRiskById(selectedRiskId);
      setSelectedRisk(riskDetail || null);
    } else {
      setSelectedRisk(null);
    }
  }, [selectedRiskId]);

  const pageTitle = selectedRisk ? `Detalles del Riesgo: ${selectedRisk.name}` : "Cargando detalles del riesgo...";

  return (
    <SidebarInset className="flex-1 flex flex-col overflow-hidden">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 shadow-sm">
        <SidebarTrigger className="md:hidden">
          <PanelLeft />
          <span className="sr-only">Alternar Barra Lateral</span>
        </SidebarTrigger>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/risk-register')}
          className="hidden md:flex"
          disabled={!selectedRisk} // Disable button if risk data isn't loaded yet
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Registro de Riesgos
        </Button>
        <h1 className="text-lg font-semibold text-foreground flex-1 truncate ml-2">
          {selectedRisk ? pageTitle : <Skeleton className="h-6 w-3/4" />} 
        </h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push('/risk-register')}
          className="md:hidden"
          aria-label="Volver al Registro de Riesgos"
          disabled={!selectedRisk}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </header>
      <main className="flex-1 overflow-auto">
        <RiskDetailView risk={selectedRisk} />
      </main>
    </SidebarInset>
  );
}

// Main page component
export default function RiskViewPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Static Sidebar part of the layout */}
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r shadow-md">
        <SidebarHeader>
          <AppNavigation />
        </SidebarHeader>
        <Separator className="my-0 bg-sidebar-border" />
        <SidebarContent className="p-0" />
      </Sidebar>
      
      {/* The dynamic part of the page is wrapped in Suspense */}
      <Suspense fallback={<DynamicContentSkeleton />}>
        <RiskViewDynamicContent />
      </Suspense>
    </div>
  );
}
