'use server';

/**
 * @fileOverview Generates personalized insights and recommendations based on journal entries and mood data.
 *
 * - `generatePersonalizedInsights` - A function that generates personalized insights.
 * - `PersonalizedInsightsInput` - The input type for the `generatePersonalizedInsights` function.
 * - `PersonalizedInsightsOutput` - The return type for the `generatePersonalizedInsights` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedInsightsInputSchema = z.object({
  journalEntries: z.array(z.string()).describe('Array of journal entries.'),
  moodData: z
    .array(z.object({
      mood: z.string(),
      intensity: z.number().min(1).max(5),
      date: z.string().datetime(),
    }))
    .describe('Array of mood data with mood, intensity, and date.'),
});
export type PersonalizedInsightsInput = z.infer<typeof PersonalizedInsightsInputSchema>;

const PersonalizedInsightsOutputSchema = z.object({
  insights: z.string().describe('Personalized insights and recommendations.'),
});
export type PersonalizedInsightsOutput = z.infer<typeof PersonalizedInsightsOutputSchema>;

export async function generatePersonalizedInsights(
  input: PersonalizedInsightsInput
): Promise<PersonalizedInsightsOutput> {
  return personalizedInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedInsightsPrompt',
  input: {schema: PersonalizedInsightsInputSchema},
  output: {schema: PersonalizedInsightsOutputSchema},
  prompt: `You are a mental health assistant that helps users understand their journal entries and moods, and provide personalized insights and recommendations for improving their mental well-being.

  Analyze the following journal entries and mood data to provide insights and recommendations. Return the result in the "insights" field.

  Journal Entries:
  {{#each journalEntries}}
  - {{{this}}}
  {{/each}}

  Mood Data:
  {{#each moodData}}
  - Date: {{{date}}}, Mood: {{{mood}}}, Intensity: {{{intensity}}}
  {{/each}}

  Based on the above information, provide actionable insights and recommendations to improve the user's mental well-being.
`,
});

const personalizedInsightsFlow = ai.defineFlow(
  {
    name: 'personalizedInsightsFlow',
    inputSchema: PersonalizedInsightsInputSchema,
    outputSchema: PersonalizedInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
