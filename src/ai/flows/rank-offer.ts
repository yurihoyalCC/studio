 'use server';

/**
 * @fileOverview AI powered offer ranking flow.
 *
 * - rankOffer - Ranks a trade offer and sets the `aiRank` field.
 * - RankOfferInput - The input type for the rankOffer function.
 * - RankOfferOutput - The return type for the rankOffer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiRankEnum = z.enum(['low', 'leaning-low', 'fair', 'good', 'great']);

const RankOfferInputSchema = z.object({
  listingId: z.string().describe('The ID of the listing the offer is for.'),
  targetWeekCreditValue: z.number().describe('The credit value of the target listing.'),
  fromUid: z.string().describe('The user ID of the offer creator.'),
  toUid: z.string().describe('The user ID of the listing owner.'),
  offeredListingId: z.string().nullable().describe('The ID of the listing offered in trade, if any.'),
  offeredWeekCreditValue: z.number().nullable().describe('The credit value of the offered listing, if any.'),
  offeredCredits: z.number().describe('The number of credits offered in trade.'),
});
export type RankOfferInput = z.infer<typeof RankOfferInputSchema>;

const RankOfferOutputSchema = z.object({
  aiRank: AiRankEnum.describe('The AI rank of the offer.'),
  explanation: z.string().describe('A short, one-line explanation for the ranking.'),
  suggestedTopUp: z.number().describe('The suggested number of credits to add to improve the offer.'),
  acceptanceProbability: z.number().describe('The estimated probability of the offer being accepted (0-100).'),
});
export type RankOfferOutput = z.infer<typeof RankOfferOutputSchema>;

export async function rankOffer(input: RankOfferInput): Promise<RankOfferOutput> {
  return rankOfferFlow(input);
}

const rankOfferPrompt = ai.definePrompt({
  name: 'rankOfferPrompt',
  input: {schema: RankOfferInputSchema},
  output: {schema: RankOfferOutputSchema},
  prompt: `You are an expert in evaluating trade offers for vacation rentals. Your tone is that of a helpful coach, not a police officer.
  Your goal is to rate an offer on a 5-point scale and provide helpful feedback.

  The scale is: 'low', 'leaning-low', 'fair', 'good', 'great'.

  You will be given an offer and need to determine which type it is:
  1.  **Credits-only**: No trade week is offered.
  2.  **Trade-only**: A trade week is offered, with 0 credits.
  3.  **Trade + credits (hybrid)**: A trade week and credits are offered.

  Here is the logic you must follow to rank the offer:

  **1. For Credits-only offers:**
  - The 'fair market value' is the \`targetWeekCreditValue\`.
  - Calculate the price delta: \`(offeredCredits / targetWeekCreditValue)\`.
  - Use these thresholds for the badge:
    - Low: >115%
    - Leaning Low: 105–115%
    - Fair: 95–105%
    - Good: 85–95%
    - Great: <85%
  
  **2. For Trade-only offers:**
  - Calculate the fairness ratio: \`(offeredWeekCreditValue / targetWeekCreditValue)\`.
  - Use these thresholds for the badge:
    - Low: <85%
    - Leaning Low: 85–95%
    - Fair: 95–105%
    - Good: 105–120%
    - Great: >120%

  **3. For Trade + credits (hybrid) offers:**
  - Calculate the total offer value: \`offeredWeekCreditValue + offeredCredits\`.
  - Calculate the ratio: \`(total offer value / targetWeekCreditValue)\`.
  - Use the same thresholds as Trade-only offers.

  **Additional factors to consider (as small modifiers to your decision):**
  - **Time-to-check-in:** An offer for a stay that is sooner needs to be a better value to be attractive.
  - **Demand/Season:** A high-demand week can tolerate a slightly lower offer value.
  - **Trust/VIP Status:** A user with a high trust score or VIP status gets a slight boost.

  **Your output must include:**
  - \`aiRank\`: The badge from the scale.
  - \`explanation\`: A very short reason for the rank (e.g., "Value vs typical: 97% • Peak season").
  - \`suggestedTopUp\`: A credit amount to nudge the user to the next tier. (e.g., "Add 250 credits to reach ‘Good’"). If the offer is already 'great', this can be 0.
  - \`acceptanceProbability\`: A 0-100 score estimating the likelihood of acceptance based on historical data and the offer's value.

  **Offer Details:**
  - Target Listing ID: {{{listingId}}}
  - Target Listing Credit Value: {{{targetWeekCreditValue}}}
  - Offer from User: {{{fromUid}}}
  - Offer to User: {{{toUid}}}
  - Offered Listing ID: {{#if offeredListingId}}{{{offeredListingId}}}{{else}}None{{/if}}
  - Offered Listing Credit Value: {{#if offeredWeekCreditValue}}{{{offeredWeekCreditValue}}}{{else}}N/A{{/if}}
  - Offered Credits: {{{offeredCredits}}}

  Now, evaluate the offer and provide the JSON output.
  `,
});

const rankOfferFlow = ai.defineFlow(
  {
    name: 'rankOfferFlow',
    inputSchema: RankOfferInputSchema,
    outputSchema: RankOfferOutputSchema,
  },
  async input => {
    const {output} = await rankOfferPrompt(input);
    return output!;
  }
);
