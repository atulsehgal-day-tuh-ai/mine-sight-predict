
'use server';
/**
 * @fileOverview AI-driven strategic recommendations based on mine realities and desired outcomes.
 *
 * - getStrategicRecommendations - A function that returns AI-driven strategic recommendations.
 * - StrategicRecommendationsInput - The input type for the getStrategicRecommendations function.
 * - StrategicRecommendationsOutput - The return type for the getStrategicRecommendations function.
 */

import {ai} from '@/ai/genkit';
import type { StrategicRecommendationsInput, StrategicRecommendationsOutput } from '@/types';
import {z} from 'genkit';

const StrategicRecommendationsInputSchema = z.object({
  realityFactors: z.string().describe('A summary of key unchangeable realities or constraints of the mine site.'),
  tradeOffValue: z.number().min(0).max(100).describe('A value from 0 to 100 representing the trade-off preference. 0 means maximize production, 100 means minimize incident likelihood, 50 is balanced.'),
  tradeOffLabel: z.string().describe('A human-readable label describing the current trade-off setting (e.g., "Fuerte énfasis en producción", "Equilibrado", "Fuerte énfasis en seguridad").'),
});

const StrategicRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of 3-5 actionable strategic recommendations tailored to the inputs.'),
  reasoning: z.string().describe('A concise explanation of the rationale behind the provided recommendations, considering the reality and the trade-off preference.'),
});

export async function getStrategicRecommendations(input: StrategicRecommendationsInput): Promise<StrategicRecommendationsOutput> {
  return strategicRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'strategicRecommendationsPrompt',
  input: {schema: StrategicRecommendationsInputSchema},
  output: {schema: StrategicRecommendationsOutputSchema},
  prompt: `Eres un asesor experto en estrategia de operaciones y seguridad minera. Tu tarea es proporcionar recomendaciones estratégicas basadas en las realidades del sitio y la preferencia de equilibrio entre producción y seguridad del usuario.

Contexto de Realidad del Sitio Minero:
{{{realityFactors}}}

Preferencia de Equilibrio del Usuario (0=Maximizar Producción, 50=Equilibrado, 100=Minimizar Incidentes):
Valor: {{{tradeOffValue}}}
Descripción: {{{tradeOffLabel}}}

Considerando estos factores, por favor proporciona:
1.  Una lista de 3 a 5 recomendaciones estratégicas concisas y accionables.
2.  Un breve razonamiento que explique cómo estas recomendaciones abordan las realidades y la preferencia de equilibrio indicada.

Prioriza recomendaciones que sean realistas y ofrezcan un impacto significativo. Las recomendaciones deben estar en español.
Formatea tu respuesta como un objeto JSON con los campos "recommendations" (una lista de strings) y "reasoning" (un string).
  `,
  config: {
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

const strategicRecommendationsFlow = ai.defineFlow(
  {
    name: 'strategicRecommendationsFlow',
    inputSchema: StrategicRecommendationsInputSchema,
    outputSchema: StrategicRecommendationsOutputSchema,
  },
  async (input: StrategicRecommendationsInput) : Promise<StrategicRecommendationsOutput> => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("La IA no generó una respuesta válida.");
    }
    return output;
  }
);
