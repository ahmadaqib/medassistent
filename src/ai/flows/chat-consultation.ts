'use server';
/**
 * @fileOverview A consultation chat AI agent.
 *
 * - chatConsultation - A function that handles the chat consultation process.
 * - ChatConsultationInput - The input type for the chatConsultation function.
 * - ChatConsultationOutput - The return type for the chatConsultation function.
 */

import {ai} from '@/ai/genkit';
import {addPatient as addPatientToDb} from '@/services/patient-db';
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

const addPatientTool = ai.defineTool(
  {
    name: 'addPatientData',
    description: "Use this tool to add a new patient's data to the system. Extract the name, age, and notes from the conversation.",
    inputSchema: z.object({
      name: z.string().describe("The patient's full name."),
      age: z.number().describe("The patient's age in years."),
      notes: z.string().describe("The patient's complaints or reasons for visit."),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const result = await addPatientToDb(input);
    return result.message;
  }
);


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
    const systemPrompt = `You are a helpful medical assistant. Your role is to provide general medical information and advice for consultation purposes. 
You are not a real doctor and you must always remind the user to consult with a qualified healthcare professional for any serious medical concerns or before making any health decisions. Do not provide a diagnosis.
You can also record new patient data. If the user asks you to record a new patient, use the 'addPatientData' tool. Ask for clarification if any information like name, age, or complaint is missing.
Respond in Bahasa Indonesia.`;

    const messages: Message[] = [
        {role: 'system', content: [{text: systemPrompt}]},
        ...history.map(msg => ({role: msg.role, content: [{text: msg.content}]})),
    ];

    const response = await ai.generate({
      messages: messages,
      tools: [addPatientTool],
    });

    return response.text;
  }
);
