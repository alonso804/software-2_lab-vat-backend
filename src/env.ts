import dotenv from 'dotenv';
import { z } from 'zod';

import { logger } from './logger';

dotenv.config();

const envVariablesSchema = z.object({
  PORT: z.string().regex(/^\d+$/).default('3000'),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().trim(),
  SUNAT_URI: z.string().url(),
  SERVER_ID: z.string().trim(),
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.string().regex(/^\d+$/).default('6379'),
  SENDGRID_API_KEY: z.string().trim(),
  SENDGRID_FROM_EMAIL: z.string().email(),
  FRONTEND_URI: z.string().url().default('http://localhost:3000'),
});

const parsedEnvVariables = envVariablesSchema.safeParse(process.env);

if (parsedEnvVariables.success) {
  process.env = parsedEnvVariables.data;
} else {
  logger.error(parsedEnvVariables.error.errors);

  throw new Error('Invalid environment variables');
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariablesSchema> { }
  }
}
