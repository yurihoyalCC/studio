'use server';

/**
 * @fileOverview Estimates the credit value of a listing based on various factors.
 *
 * - estimateListingScore - A function that estimates the credit value of a listing.
 * - EstimateListingScoreInput - The input type for the estimateListingScore function.
 * - EstimateListingScoreOutput - The return type for the estimateListingScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateListingScoreInputSchema = z.object({
  resortId: z.string().describe('The ID of the resort.'),
  dates: z.string().describe('The start and end dates of the stay.'),
  unit: z.string().describe('The unit details (e.g., number of bedrooms, sleeps).'),
  mfUSD: z.number().describe('The maintenance fee in USD.'),
});
export type EstimateListingScoreInput = z.infer<typeof EstimateListingScoreInputSchema>;

const EstimateListingScoreOutputSchema = z.object({
  score: z.number().describe('The overall score of the listing (0-100).'),
  estimatedCredits: z.number().describe('The estimated credit value of the listing.'),
  breakdown: z.object({
    locationDemand: z.string().describe('Explanation of the location demand.'),
    seasonality: z.string().describe('Explanation of the seasonality.'),
    brandTier: z.string().describe('Explanation of the brand tier.'),
    unitType: z.string().describe('Explanation of the unit type.'),
    mfRatio: z.string().describe('Explanation of the maintenance fee ratio.'),
    history: z.string().describe('Explanation of the listing history.'),
    flexibility: z.string().describe('Explanation of the flexibility (e.g., guest cert allowed).'),
  }).describe('Breakdown of the factors contributing to the score.'),
  disclaimer: z.string().describe('Disclaimer about the estimate.'),
});
export type EstimateListingScoreOutput = z.infer<typeof EstimateListingScoreOutputSchema>;

export async function estimateListingScore(input: EstimateListingScoreInput): Promise<EstimateListingScoreOutput> {
  return estimateListingScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateListingScorePrompt',
  input: {schema: EstimateListingScoreInputSchema},
  output: {schema: EstimateListingScoreOutputSchema},
  prompt: `You are an expert in vacation property valuation.

  Given the following information about a listing, estimate its credit value and provide a breakdown of the factors influencing the valuation.

  Resort ID: {{{resortId}}}
  Dates: {{{dates}}}
  Unit: {{{unit}}}
  Maintenance Fee (USD): {{{mfUSD}}}

  Provide the score (0-100), estimated credit value, and a breakdown of the factors.
  Include a disclaimer that the estimate is not final and may adjust after verification.
  The breakdown should include locationDemand, seasonality, brandTier, unitType, mfRatio, history, and flexibility.

  Format your output as a JSON object matching the following schema:
  ${JSON.stringify(EstimateListingScoreOutputSchema.describe(''))}`,
});

const estimateListingScoreFlow = ai.defineFlow(
  {
    name: 'estimateListingScoreFlow',
    inputSchema: EstimateListingScoreInputSchema,
    outputSchema: EstimateListingScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
