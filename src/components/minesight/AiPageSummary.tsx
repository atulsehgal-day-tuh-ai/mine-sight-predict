
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, BotMessageSquare } from 'lucide-react';
import { fetchPageSummary } from '@/actions/ai';
import { useToast } from '@/hooks/use-toast';

interface AiPageSummaryProps {
  pageTitle: string;
  pageContent: string; 
}

export function AiPageSummary({ pageTitle, pageContent }: AiPageSummaryProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading by default
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const generateInsights = async () => {
      if (!pageTitle || !pageContent) {
        setIsLoading(false);
        setError("Missing title or content for AI insights.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setInsights(null);

      try {
        const result = await fetchPageSummary({ pageTitle, pageContent });
        if (result.summary && !result.summary.startsWith("Error")) {
          setInsights(result.summary);
        } else {
          const errorMessage = result.summary || "Failed to generate insights due to an unknown issue.";
          setError(errorMessage);
          toast({
            title: "Error Generating Insights",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: `Failed to get page insights: ${errorMessage}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateInsights();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageTitle, pageContent]); // toast is intentionally omitted to prevent re-fetches if its reference changes


  return (
    <Card className="shadow-lg rounded-lg mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <BotMessageSquare className="h-6 w-6 text-primary" />
          AI Page Insights
        </CardTitle>
        <CardDescription>
          AI-generated insights based on this page's content and data.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[80px]"> {/* Ensure some min height for loading state */}
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {error && !isLoading && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {insights && !isLoading && !error && (
          <ScrollArea className="max-h-40"> {/* Increased max height for potentially longer insights */}
             <p className="text-sm text-foreground/90 bg-muted/30 p-3 rounded-md whitespace-pre-line">{insights}</p>
          </ScrollArea>
        )}
         {!insights && !isLoading && !error && (
          <p className="text-sm text-muted-foreground">No insights available for this page.</p>
        )}
      </CardContent>
      {/* CardFooter with button is removed */}
    </Card>
  );
}

