'use server';

/**
 * @fileOverview A supportive chatbot for anonymous conversations.
 *
 * - `generateChatResponse` - A function that provides a supportive response to a user's message.
 * - `ChatResponseInput` - The input type for the `generateChatResponse` function.
 * - `ChatResponseOutput` - The return type for the `generateChatResponse` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatResponseInputSchema = z.object({
    userMessage: z.string().describe("The user's most recent message."),
    chatHistory: z.string().describe("The history of the conversation so far."),
});
export type ChatResponseInput = z.infer<typeof ChatResponseInputSchema>;

const ChatResponseOutputSchema = z.object({
  response: z.string().describe('A supportive and empathetic response to the user.'),
});
export type ChatResponseOutput = z.infer<typeof ChatResponseOutputSchema>;

export async function generateChatResponse(
  input: ChatResponseInput
): Promise<ChatResponseOutput> {
  return anonymousChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'anonymousChatPrompt',
  input: {schema: ChatResponseInputSchema},
  output: {schema: ChatResponseOutputSchema},
  prompt: `You are a supportive, empathetic listening bot in a safe space chat application. Your name is Kai. Your purpose is to make the user feel heard, validated, and less alone. You are not a therapist, but a kind friend.

  - Acknowledge and validate the user's feelings.
  - Be gentle, warm, and encouraging.
  - If the user's message is short or vague, ask a gentle, open-ended question to invite them to share more if they're comfortable (e.g., "How did that make you feel?", "Is there more you'd like to share about that?").
  - Keep your responses concise and easy to read (2-3 sentences).
  - Do not give advice, but you can offer general, positive affirmations.
  - Maintain a calm and non-judgmental tone.
  
  Conversation History:
  {{{chatHistory}}}

  User's new message:
  "{{{userMessage}}}"

  Based on this, provide a supportive response.
`,
});

const anonymousChatFlow = ai.defineFlow(
  {
    name: 'anonymousChatFlow',
    inputSchema: ChatResponseInputSchema,
    outputSchema: ChatResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
