import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validateSchema } from 'src/helpers/utils';
import { logger } from 'src/logger';
import { z } from 'zod';

const headersSchema = z.object({
  authorization: z.string().startsWith('Bearer '),
});

type JwtHeaders = z.infer<typeof headersSchema>;

export const validateJwt = (req: Request, res: Response, next: NextFunction): void => {
  let headers: JwtHeaders;

  try {
    headers = validateSchema(headersSchema, req.headers) as JwtHeaders;
  } catch (err) {
    logger.error({ message: 'Invalid headers', err });

    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = headers.authorization.split(' ')[1];

  if (!token) {
    logger.error({ message: 'No token provided' });
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    req.query.userId = decoded.userId;

    next();
  } catch (err) {
    logger.error({ message: 'Invalid token' });

    res.status(401).json({ message: 'Unauthorized' });
  }
};
