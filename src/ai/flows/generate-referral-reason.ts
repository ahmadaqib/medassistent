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
  clinicalScore: z.number().describe('The clinical score of the patient (0-100).'),
  insuranceScore: z.number().describe('The insurance score of the patient (0-100).'),
  personalPreferenceScore: z.number().describe('The personal preference score of the patient (0-100).'),
  ahpScore: z.number().describe('The final score from the AHP algorithm.'),
  fuzzyScore: z.number().describe('The final score from the Fuzzy Logic algorithm.'),
  fuzzyLevel: z.string().describe('The priority level from Fuzzy Logic (e.g., Rendah, Sedang, Tinggi).'),
  referralRecommended: z.boolean().describe('Whether a referral is recommended or not, based on the AHP score.'),
});
export type GenerateReferralReasonInput = z.infer<typeof GenerateReferralReasonInputSchema>;

const GenerateReferralReasonOutputSchema = z.object({
  reason: z.string().describe('A human-readable summary of why a patient is recommended for referral or not, considering both AHP and Fuzzy Logic results.'),
});
export type GenerateReferralReasonOutput = z.infer<typeof GenerateReferralReasonOutputSchema>;

export async function generateReferralReason(input: GenerateReferralReasonInput): Promise<GenerateReferralReasonOutput> {
  return generateReferralReasonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReferralReasonPrompt',
  input: {schema: GenerateReferralReasonInputSchema},
  output: {schema: GenerateReferralReasonOutputSchema},
  prompt: `You are an expert healthcare assistant. You are responsible for generating a short, human-readable summary of why a patient is recommended for referral or not. Your explanation must synthesize results from two different algorithms: AHP and Fuzzy Logic.

Here are the patient's scores:
- Clinical Score: {{{clinicalScore}}}
- Insurance Score: {{{insuranceScore}}}
- Personal Preference Score: {{{personalPreferenceScore}}}

Here are the algorithm results:
- AHP Final Score: {{{ahpScore}}} (A score > 60 leads to a 'Likely Referral' recommendation)
- Fuzzy Logic Score: {{{fuzzyScore}}} (Indicates a priority level of '{{{fuzzyLevel}}}')
- Final Recommendation: {{{referralRecommended}}}

Task:
Generate a concise summary in Bahasa Indonesia that explains the final recommendation.
1.  Start by stating the final recommendation.
2.  Explain how the AHP score (a weighted average) contributes to this recommendation.
3.  Explain what the Fuzzy Logic result (a rule-based priority) suggests.
4.  Conclude by synthesizing both results. For example, if AHP is high but Fuzzy is 'Sedang', you might mention that while the weighted score suggests referral, the rule-based analysis indicates a moderate priority, perhaps due to specific factor combinations. If they both agree, state that both analytical methods point to the same conclusion.
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
