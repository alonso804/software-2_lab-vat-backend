import axios from 'axios';
import type { Request, Response } from 'express';
import fs from 'fs/promises';
import type { LoginRequest } from 'src/dtos/auth/login';
import type { SignupRequest } from 'src/dtos/auth/signup';
import { generateJwt } from 'src/helpers/utils';
import { logger } from 'src/logger';
import UserModel from 'src/models/user';

class AuthController {
  static async login(req: LoginRequest, res: Response): Promise<void> {
    const { username, password } = req.body;

    const user = await UserModel.findByUsername(username);

    if (!user) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    const isPasswordValid = await UserModel.comparePassword({
      input: password,
      hash: user.password,
    });

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    res.json({ username, token: generateJwt({ userId: user._id }) });
  }

  static async signup(req: SignupRequest, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      const hashedPassword = await UserModel.hashPassword(password);

      await UserModel.create({ username, password: hashedPassword });

      res.json({ ok: true });
    } catch (err) {
      logger.error(err);

      res.json({ ok: false });
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
            authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJ2ZXJJZCI6IjY1MTQ0YTViNWUyMjlhZmZjMGRiOTQ0MSIsImlhdCI6MTY5NTgzMDYwMiwiZXhwIjoxNjk1ODMxNTAyfQ.B8c3OW5ZCFZbp8rckSfFWAlBjwuERLET-KopM014ovE',
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
