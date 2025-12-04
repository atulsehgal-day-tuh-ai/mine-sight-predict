'use client';

import type { Risk } from '@/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Sparkles, AlertTriangle } from 'lucide-react';
import { fetchInterventionSuggestions } from '@/actions/ai';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface InterventionSuggestionsProps {
  risk: Risk | null;
}

export function InterventionSuggestions({ risk }: InterventionSuggestionsProps) {
  const [riskPatterns, setRiskPatterns] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (risk) {
      // Construct a detailed risk pattern description
      let patterns = `Risk: ${risk.name}. Description: ${risk.description}. Level: ${risk.level}.
Causes: ${risk.causes.map(c => `${c.name} (Prob: ${(c.probabilityOrImpact * 100).toFixed(0)}%)`).join(', ')}.
Preventive Controls: ${risk.preventiveControls.map(c => `${c.name} (Eff: ${(c.effectiveness * 100).toFixed(0)}%)`).join(', ')}.
Mitigating Controls: ${risk.mitigatingControls.map(c => `${c.name} (Eff: ${(c.effectiveness * 100).toFixed(0)}%)`).join(', ')}.
Consequences: ${risk.consequences.map(c => `${c.name} (Impact: ${(c.probabilityOrImpact * 100).toFixed(0)}%)`).join(', ')}.`;
      setRiskPatterns(patterns);
      // Reset previous results when risk changes
      setSuggestions([]);
      setReasoning('');
      setError(null);
    } else {
      setRiskPatterns('');
      setSuggestions([]);
      setReasoning('');
      setError(null);
    }
  }, [risk]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!riskPatterns.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe the risk patterns.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    setReasoning('');

    try {
      const result = await fetchInterventionSuggestions({ riskPatterns });
      if (result.suggestions.length > 0) {
        setSuggestions(result.suggestions);
        setReasoning(result.reasoning);
        toast({
          title: "Suggestions Generated",
          description: "AI has provided intervention suggestions.",
        });
      } else if (result.reasoning.startsWith("Error:")) {
        setError(result.reasoning);
         toast({
          title: "Error Generating Suggestions",
          description: result.reasoning,
          variant: "destructive",
        });
      } else {
         setError("No suggestions were generated, but no specific error was reported.");
         toast({
          title: "No Suggestions",
          description: "The AI did not generate any specific suggestions for the given input.",
          variant: "default"
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to get suggestions: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!risk) {
     return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="h-6 w-6 text-accent" />
            AI Intervention Suggestions
          </CardTitle>
          <CardDescription>Select a risk to get AI-driven intervention suggestions.</CardDescription>
        </CardHeader>
         <CardContent className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">No risk selected.</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Lightbulb className="h-6 w-6 text-accent" />
          AI Intervention Suggestions for {risk.name}
        </CardTitle>
        <CardDescription>
          Enter risk patterns or use auto-generated from selected risk to get AI-driven intervention ideas.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="riskPatterns" className="block text-sm font-medium text-foreground mb-1">
              Identified Risk Patterns
            </label>
            <Textarea
              id="riskPatterns"
              value={riskPatterns}
              onChange={(e) => setRiskPatterns(e.target.value)}
              placeholder="Describe the risk patterns observed..."
              rows={5}
              className="bg-background/70 focus:bg-background"
              disabled={isLoading}
            />
          </div>
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!isLoading && suggestions.length > 0 && (
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Suggested Interventions:
                </h3>
                <ScrollArea className="h-40 mt-1 rounded-md border p-3 bg-muted/30">
                  <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground/90">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Reasoning:</h3>
                <p className="text-sm text-muted-foreground mt-1 bg-muted/30 p-3 rounded-md">{reasoning}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !riskPatterns.trim()} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? 'Generating...' : 'Get AI Suggestions'}
            {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
