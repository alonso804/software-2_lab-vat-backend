import { Router } from 'express';
import { loginSchema } from 'src/dtos/auth/login';
import { signupSchema } from 'src/dtos/auth/signup';
import { validateSchema } from 'src/middlewares/validate-schema';

import AuthController from '../controllers/auth';

const router = Router();

router.post('/signup', validateSchema(signupSchema), AuthController.signup);

router.post('/login', validateSchema(loginSchema), AuthController.login);

export default router;
