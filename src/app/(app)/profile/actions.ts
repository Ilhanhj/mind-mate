'use server';

import {
  generatePersonalizedInsights,
  type PersonalizedInsightsInput,
} from '@/ai/flows/personalized-insights-from-journal';

export async function getPersonalizedInsightsAction(input: PersonalizedInsightsInput) {
  try {
    const result = await generatePersonalizedInsights(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate insights: ${errorMessage}` };
  }
}
