import type { Request } from 'express';
import type { EmptyObject } from 'src/helpers/types';
import { z } from 'zod';

export const getTaxesSchema = z.object({
  query: z.object({
    userId: z.string(),
  }),
});

type GetTaxes = z.infer<typeof getTaxesSchema>;

export type GetTaxesRequest = Request<EmptyObject, EmptyObject, EmptyObject, GetTaxes['query']>;
