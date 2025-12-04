'use server';
/**
 * @fileOverview AI-driven intervention suggestions based on identified risk patterns.
 *
 * - getInterventionSuggestions - A function that returns AI-driven intervention suggestions.
 * - InterventionSuggestionsInput - The input type for the getInterventionSuggestions function.
 * - InterventionSuggestionsOutput - The return type for the getInterventionSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterventionSuggestionsInputSchema = z.object({
  riskPatterns: z.string().describe('A description of identified risk patterns.'),
});
export type InterventionSuggestionsInput = z.infer<typeof InterventionSuggestionsInputSchema>;

const InterventionSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of suggested interventions.'),
  reasoning: z.string().describe('The reasoning behind the suggested interventions.'),
});
export type InterventionSuggestionsOutput = z.infer<typeof InterventionSuggestionsOutputSchema>;

export async function getInterventionSuggestions(input: InterventionSuggestionsInput): Promise<InterventionSuggestionsOutput> {
  return interventionSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interventionSuggestionsPrompt',
  input: {schema: InterventionSuggestionsInputSchema},
  output: {schema: InterventionSuggestionsOutputSchema},
  prompt: `You are a safety expert providing intervention suggestions based on identified risk patterns.

  Based on the following risk patterns, suggest a list of interventions and explain your reasoning.

  Risk Patterns: {{{riskPatterns}}}

  Format your response as a JSON object with "suggestions" (a list of suggested interventions) and "reasoning" (the reasoning behind the suggested interventions).
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const interventionSuggestionsFlow = ai.defineFlow(
  {
    name: 'interventionSuggestionsFlow',
    inputSchema: InterventionSuggestionsInputSchema,
    outputSchema: InterventionSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
