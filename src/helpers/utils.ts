import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import BadRequest from 'src/errors/bad-request';
import type { AnyZodObject } from 'zod';

export const generateJwt = (payload: string | Record<string, unknown>): string => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 15 * 60,
  });
};

export const generateRS256Jwt = async (
  payload: string | Record<string, unknown>,
): Promise<string> => {
  const privateKey = await fs.readFile('jwtRS256', 'utf8');

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
  });
};

export const verifyJwt = (token: string): string | Record<string, unknown> => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const validateSchema = <T>(schema: AnyZodObject, data: T): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string[]> = {};

    result.error.issues.forEach(({ path, message }) => {
      const key = path.join('.');

      if (!errors[key]) {
        errors[key] = [];
      }

      errors[key].push(message);
    });

    throw new BadRequest(errors);
  }

  return result.data as T;
};
