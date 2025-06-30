'use server';
/**
 * @fileOverview An AI flow to extract structured patient data from unstructured notes.
 *
 * - extractPatientData - A function that extracts patient scores from notes.
 * - ExtractPatientDataInput - The input type for the extractPatientData function.
 * - ExtractPatientDataOutput - The return type for the extractPatientData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractPatientDataInputSchema = z.object({
  notes: z.string().describe('Unstructured notes about a patient.'),
});
export type ExtractPatientDataInput = z.infer<typeof ExtractPatientDataInputSchema>;

const ExtractPatientDataOutputSchema = z.object({
  clinicalScore: z.number().min(0).max(100).describe('A score from 0-100 representing the clinical urgency for referral. Higher means more urgent.'),
  insuranceScore: z.number().min(0).max(100).describe('A score from 0-100 representing the suitability of the patient\'s insurance or financial situation for referral. Higher means more suitable.'),
  personalPreferenceScore: z.number().min(0).max(100).describe('A score from 0-100 representing the patient\'s preference for a referral. Higher means the patient is more willing.'),
});
export type ExtractPatientDataOutput = z.infer<typeof ExtractPatientDataOutputSchema>;

export async function extractPatientData(input: ExtractPatientDataInput): Promise<ExtractPatientDataOutput> {
  return extractPatientDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractPatientDataPrompt',
  input: {schema: ExtractPatientDataInputSchema},
  output: {schema: ExtractPatientDataOutputSchema},
  prompt: `You are an expert medical assistant. Your task is to analyze unstructured patient notes and extract key information to determine referral suitability scores. The scores should be on a scale of 0 to 100.

Analyze the following patient notes:
---
{{{notes}}}
---

Based on the notes, determine the following scores:

1.  **Clinical Score**: Evaluate the severity of symptoms, medical history, and clinical findings. A higher score (closer to 100) indicates a more urgent need for a specialist referral. A low score (closer to 0) means the condition is mild or manageable by a general practitioner.

2.  **Insurance Score**: Evaluate the patient's insurance coverage, financial status, and ability to cover the costs of a referral. A higher score (closer to 100) indicates that finances and insurance are not a barrier to referral. A low score (closer to 0) suggests significant financial or insurance-related obstacles.

3.  **Personal Preference Score**: Evaluate the patient's expressed wishes, willingness, and personal readiness for a referral. A higher score (closer to 100) means the patient is actively seeking or very open to a referral. A low score (closer to 0) means the patient is hesitant, resistant, or prefers to avoid a referral.

Provide the three scores in the required JSON format.
  `,
});

const extractPatientDataFlow = ai.defineFlow({
    name: 'extractPatientDataFlow',
    inputSchema: ExtractPatientDataInputSchema,
    outputSchema: ExtractPatientDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
