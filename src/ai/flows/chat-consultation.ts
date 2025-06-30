'use server';
/**
 * @fileOverview A consultation chat AI agent.
 *
 * - chatConsultation - A function that handles the chat consultation process.
 * - ChatConsultationInput - The input type for the chatConsultation function.
 * - ChatConsultationOutput - The return type for the chatConsultation function.
 */

import {ai} from '@/ai/genkit';
import type {Message} from 'genkit/ai';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatConsultationInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The chat history, where the last message is the current user query.'),
});
export type ChatConsultationInput = z.infer<typeof ChatConsultationInputSchema>;

const ChatConsultationOutputSchema = z.string();
export type ChatConsultationOutput = z.infer<typeof ChatConsultationOutputSchema>;

export async function chatConsultation(input: ChatConsultationInput): Promise<ChatConsultationOutput> {
  return chatConsultationFlow(input);
}

const chatConsultationFlow = ai.defineFlow(
  {
    name: 'chatConsultationFlow',
    inputSchema: ChatConsultationInputSchema,
    outputSchema: ChatConsultationOutputSchema,
  },
  async ({ history }) => {
    const systemPrompt = `You are a helpful medical assistant. Your role is to provide general medical information and advice for consultation purposes. You are not a real doctor and you must always remind the user to consult with a qualified healthcare professional for any serious medical concerns or before making any health decisions. Do not provide a diagnosis. Respond in Bahasa Indonesia.`;

    const messages: Message[] = [
        {role: 'system', content: [{text: systemPrompt}]},
        ...history.map(msg => ({role: msg.role, content: [{text: msg.content}]})),
    ];

    const response = await ai.generate({
      messages: messages,
    });

    return response.text;
  }
);
