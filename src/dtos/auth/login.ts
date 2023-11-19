import type { Request } from 'express';
import type { EmptyObject } from 'src/helpers/types';
import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(20),
  }),
});

type Login = z.infer<typeof loginSchema>;

export type LoginRequest = Request<EmptyObject, EmptyObject, Login['body']>;
