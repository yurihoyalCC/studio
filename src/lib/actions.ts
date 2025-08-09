'use server';

import { estimateListingScore, type EstimateListingScoreInput } from '@/ai/flows/estimate-listing-score';
import { z } from 'zod';

const formSchema = z.object({
  resortId: z.string().min(1, 'Resort is required'),
  dates: z.string().min(1, 'Dates are required'),
  unit: z.string().min(1, 'Unit details are required'),
  mfUSD: z.coerce.number().min(0, 'Maintenance fee must be a positive number'),
});

export async function getListingEstimate(prevState: any, formData: FormData) {
  const validatedFields = formSchema.safeParse({
    resortId: formData.get('resortId'),
    dates: formData.get('dates'),
    unit: formData.get('unit'),
    mfUSD: formData.get('mfUSD'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data',
      errors: validatedFields.error.flatten().fieldErrors,
      estimate: null,
    };
  }
  
  try {
    const input: EstimateListingScoreInput = validatedFields.data;
    const estimate = await estimateListingScore(input);
    return {
      message: 'Success',
      estimate: {
        ...estimate,
        input: validatedFields.data,
      },
      errors: {},
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      estimate: null,
      errors: {},
    };
  }
}
