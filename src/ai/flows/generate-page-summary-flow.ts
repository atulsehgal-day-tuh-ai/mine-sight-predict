
'use server';
/**
 * @fileOverview AI-driven page summarization providing insights.
 *
 * - generatePageSummary - A function that returns AI-generated insights for a given page title and data context.
 * - PageSummaryInput - The input type for the generatePageSummary function.
 * - PageSummaryOutput - The return type for the generatePageSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PageSummaryInputSchema = z.object({
  pageTitle: z.string().describe('The title of the page for which insights are being generated.'),
  pageContent: z.string().describe('A data-rich description of the content, key data points, or purpose of the page.'),
});
export type PageSummaryInput = z.infer<typeof PageSummaryInputSchema>;

const PageSummaryOutputSchema = z.object({
  summary: z.string().describe('2-3 concise insights or key observations derived from the page context. Focus on important data, patterns, or implications rather than page structure. Must be in Spanish.'),
});
export type PageSummaryOutput = z.infer<typeof PageSummaryOutputSchema>;

export async function generatePageSummary(input: PageSummaryInput): Promise<PageSummaryOutput> {
  return generatePageSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePageSummaryPrompt',
  input: {schema: PageSummaryInputSchema},
  output: {schema: PageSummaryOutputSchema},
  prompt: `Eres un asistente de IA encargado de proporcionar observaciones concisas a partir de los datos de la página.
  Basándote en el título de la página proporcionado y su contexto de datos, genera 2-3 observaciones clave o puntos destacados.
  Concéntrate en puntos de datos importantes, patrones o posibles implicaciones. Evita simplemente describir la estructura de la página o parafrasear extensamente la entrada. Sé analítico.

  Título de la Página: {{{pageTitle}}}
  Contexto y Datos de la Página: {{{pageContent}}}

  Genera las observaciones clave en español.
  Formatea tu respuesta como un objeto JSON con un campo "summary" que contenga las observaciones generadas.
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

const generatePageSummaryFlow = ai.defineFlow(
  {
    name: 'generatePageSummaryFlow',
    inputSchema: PageSummaryInputSchema,
    outputSchema: PageSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

