import type { Request } from 'express';
import type { EmptyObject } from 'src/helpers/types';
import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(100),
  }),
});

type Login = z.infer<typeof loginSchema>;

export type LoginRequest = Request<EmptyObject, EmptyObject, Login['body']>;
