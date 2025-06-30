'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a human-readable summary of why a patient is recommended for referral or not.
 *
 * - generateReferralReason - A function that generates a referral reason.
 * - GenerateReferralReasonInput - The input type for the generateReferralReason function.
 * - GenerateReferralReasonOutput - The return type for the generateReferralReason function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReferralReasonInputSchema = z.object({
  clinicalScore: z.number().describe('The clinical score of the patient.'),
  insuranceScore: z.number().describe('The insurance score of the patient.'),
  personalPreferenceScore: z.number().describe('The personal preference score of the patient.'),
  referralRecommended: z.boolean().describe('Whether a referral is recommended or not.'),
});
export type GenerateReferralReasonInput = z.infer<typeof GenerateReferralReasonInputSchema>;

const GenerateReferralReasonOutputSchema = z.object({
  reason: z.string().describe('A human-readable summary of why a patient is recommended for referral or not.'),
});
export type GenerateReferralReasonOutput = z.infer<typeof GenerateReferralReasonOutputSchema>;

export async function generateReferralReason(input: GenerateReferralReasonInput): Promise<GenerateReferralReasonOutput> {
  return generateReferralReasonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReferralReasonPrompt',
  input: {schema: GenerateReferralReasonInputSchema},
  output: {schema: GenerateReferralReasonOutputSchema},
  prompt: `You are an expert healthcare assistant. You are responsible for generating a short, human-readable summary of why a patient is recommended for referral or not.

  Here are the patient's scores:
  Clinical Score: {{{clinicalScore}}}
  Insurance Score: {{{insuranceScore}}}
  Personal Preference Score: {{{personalPreferenceScore}}}

  Referral Recommended: {{{referralRecommended}}}

  Generate a short summary of why the patient is recommended for referral or not, taking into account the scores and the referral recommendation.
  `,
});

const generateReferralReasonFlow = ai.defineFlow({
    name: 'generateReferralReasonFlow',
    inputSchema: GenerateReferralReasonInputSchema,
    outputSchema: GenerateReferralReasonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
