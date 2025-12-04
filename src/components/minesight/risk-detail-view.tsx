'use client';

import type { Risk } from '@/types';
import { BowTieDiagram } from './bowtie-diagram';
import { InterventionSuggestions } from './intervention-suggestions'; // Restored import
// RiskTrendChart removed
// BowtieImageDisplay removed
// AiPageSummary import removed
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';

interface RiskDetailViewProps {
  risk: Risk | null;
}

// getRiskDetailContextForAI removed as AiPageSummary is no longer used here

export function RiskDetailView({ risk }: RiskDetailViewProps) {
  if (!risk) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">No Risk Selected</h2>
        <p className="text-muted-foreground">Please select a risk from the summary page to see its details.</p>
      </div>
    );
  }

  // pageTitle and pageContentForAI removed as AiPageSummary is no longer used here

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <header className="mb-6">
          <h2 className="text-3xl font-bold text-primary">{risk.name}</h2>
          <p className="text-lg text-muted-foreground">{risk.description}</p>
        </header>
        
        <BowTieDiagram risk={risk} />
        <InterventionSuggestions risk={risk} /> {/* Restored component */}
        
        {/* RiskTrendChart removed from here */}
        {/* BowtieImageDisplay removed from here */}
        {/* AiPageSummary removed from here */}
      </div>
    </ScrollArea>
  );
}
