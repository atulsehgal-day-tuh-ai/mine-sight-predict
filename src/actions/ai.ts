
'use server';

import { getInterventionSuggestions, type InterventionSuggestionsInput, type InterventionSuggestionsOutput } from '@/ai/flows/ai-intervention-suggestions';
import { generatePageSummary, type PageSummaryInput, type PageSummaryOutput } from '@/ai/flows/generate-page-summary-flow';
import { getStrategicRecommendations, type StrategicRecommendationsInput, type StrategicRecommendationsOutput } from '@/ai/flows/strategic-recommendations-flow';

export async function fetchInterventionSuggestions(
  input: InterventionSuggestionsInput
): Promise<InterventionSuggestionsOutput> {
  try {
    const result = await getInterventionSuggestions(input);
    return result;
  } catch (error) {
    console.error("Error fetching intervention suggestions:", error);
    if (error instanceof Error) {
        return { suggestions: [], reasoning: `Error: ${error.message}` };
    }
    return { suggestions: [], reasoning: "An unknown error occurred." };
  }
}

export async function fetchPageSummary(
  input: PageSummaryInput
): Promise<PageSummaryOutput> {
  try {
    const result = await generatePageSummary(input);
    return result;
  } catch (error) {
    console.error("Error fetching page summary:", error);
    if (error instanceof Error) {
        return { summary: `Error generando resumen: ${error.message}` };
    }
    return { summary: "An unknown error occurred while generating the summary." };
  }
}

export async function fetchStrategicRecommendations(
  input: StrategicRecommendationsInput
): Promise<StrategicRecommendationsOutput> {
  try {
    const result = await getStrategicRecommendations(input);
    return result;
  } catch (error) {
    console.error("Error fetching strategic recommendations:", error);
    if (error instanceof Error) {
        return { recommendations: [], reasoning: `Error: ${error.message}` };
    }
    return { recommendations: [], reasoning: "An unknown error occurred while fetching strategic recommendations." };
  }
}
