import axios from 'axios';
import type { Request, Response } from 'express';
import fs from 'fs/promises';
import type { LoginRequest } from 'src/dtos/auth/login';
import type { SignupRequest } from 'src/dtos/auth/signup';
import { generateJwt, verifyJwt } from 'src/helpers/utils';
import { logger } from 'src/logger';
import UserModel from 'src/models/user';
import { sendMagicLinkLogin, sendSignupConfirmation } from 'src/services/send-email';

class AuthController {
  static async login(req: LoginRequest, res: Response): Promise<Response> {
    const { username } = req.body;

    const user = await UserModel.findByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    await sendMagicLinkLogin(user.email, generateJwt({ userId: user._id }));

    return res.json({ ok: true });
  }

  static async confirmLogin(req: Request, res: Response): Promise<Response> {
    const { token } = req.body as { token: string };

    if (!token) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const decodedToken = verifyJwt(token) as { userId: string };

      const user = await UserModel.findById(decodedToken.userId);

      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      return res.status(200).json({ username: user.username, token: token });
    } catch (err) {
      logger.error(err);

      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  static async signup(req: SignupRequest, res: Response): Promise<Response> {
    const { username, email } = req.body;

    const user = await UserModel.findByUsername(username);

    if (!user) {
      await sendSignupConfirmation(email, generateJwt({ username, email }));

      return res.status(200).json({ ok: true });
    }

    return res.status(401).json({ message: 'Invalid username' });
  }

  static async confirmSignup(req: Request, res: Response): Promise<Response> {
    const { token } = req.body as { token: string };

    if (!token) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const decodedToken = verifyJwt(token) as { username: string; email: string };

      const user = await UserModel.findByUsername(decodedToken.username);

      if (!user) {
        await UserModel.create({ username: decodedToken.username, email: decodedToken.email });

        return res.status(200).json({ ok: true });
      }

      return res.status(401).json({ message: 'Invalid username' });
    } catch (err) {
      logger.error(err);

      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  static async registerPublicKey(_req: Request, res: Response): Promise<void> {
    try {
      const publicKey = await fs.readFile('jwtRS256.pub', 'utf8');

      await axios.post(
        `${process.env.SUNAT_URI}/auth/register-public-key`,
        {
          publicKey,
        },
        {
          headers: {
            authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJ2ZXJJZCI6IjY1MTQ0YTViNWUyMjlhZmZjMGRiOTQ0MSIsImlhdCI6MTY5NTgzMDYwMiwiZXhwIjoxNjk1ODMxNTAyfQ.B8c3OW5ZCFZbp8rckSfFWAlBjwuERLET-KopM014ovE',
          },
        },
      );

      res.json({ ok: true });
    } catch (err) {
      logger.error(err);

      res.json({ ok: false });
    }
  }
}

export default AuthController;
