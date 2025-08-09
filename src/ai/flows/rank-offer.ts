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

const AiRankEnum = z.enum(['low', 'fair', 'great']);

const RankOfferInputSchema = z.object({
  listingId: z.string().describe('The ID of the listing the offer is for.'),
  fromUid: z.string().describe('The user ID of the offer creator.'),
  toUid: z.string().describe('The user ID of the listing owner.'),
  offeredListingId: z.string().nullable().describe('The ID of the listing offered in trade, if any.'),
  offeredCredits: z.number().describe('The number of credits offered in trade.'),
});
export type RankOfferInput = z.infer<typeof RankOfferInputSchema>;

const RankOfferOutputSchema = z.object({
  aiRank: AiRankEnum.describe('The AI rank of the offer.'),
});
export type RankOfferOutput = z.infer<typeof RankOfferOutputSchema>;

export async function rankOffer(input: RankOfferInput): Promise<RankOfferOutput> {
  return rankOfferFlow(input);
}

const rankOfferPrompt = ai.definePrompt({
  name: 'rankOfferPrompt',
  input: {schema: RankOfferInputSchema},
  output: {schema: RankOfferOutputSchema},
  prompt: `You are an expert in evaluating trade offers for vacation rentals.

  Given the details of an offer, including the listing it is for, the users involved, and the specifics of the offer (such as the listing offered in trade and the number of credits offered), your task is to rank the offer on a scale of "low", "fair", or "great".

  Consider the following factors when ranking the offer:
  - The relative value of the listing being offered in trade compared to the listing it is for.
  - The number of credits being offered in addition to the listing.
  - The demand for the listing the offer is for.
  - The reputation of the user making the offer.

  Respond with the aiRank of the offer, which must be one of "low", "fair", or "great".

  Here are the details of the offer:
  Listing ID: {{{listingId}}}
  From UID: {{{fromUid}}}
  To UID: {{{toUid}}}
  Offered Listing ID: {{#if offeredListingId}}{{{offeredListingId}}}{{else}}None{{/if}}
  Offered Credits: {{{offeredCredits}}}
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
