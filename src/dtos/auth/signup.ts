import type { Request } from 'express';
import type { EmptyObject } from 'src/helpers/types';
import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
  }),
});

type Signup = z.infer<typeof signupSchema>;

export type SignupRequest = Request<EmptyObject, EmptyObject, Signup['body']>;
