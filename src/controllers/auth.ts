import type { Response } from 'express';
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

    res.json({ username, token: generateJwt({ _id: user._id }) });
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
}

export default AuthController;
