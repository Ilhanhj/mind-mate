'use server';

import {
  generateChatResponse,
  type ChatResponseInput,
} from '@/ai/flows/anonymous-chat';

export async function getChatResponseAction(input: ChatResponseInput) {
  try {
    const result = await generateChatResponse(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to get response: ${errorMessage}` };
  }
}
