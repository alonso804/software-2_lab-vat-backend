import { Router } from 'express';
import { loginSchema } from 'src/dtos/auth/login';
import { signupSchema } from 'src/dtos/auth/signup';
import { validateSchema } from 'src/middlewares/validate-schema';

import AuthController from '../controllers/auth';

const router = Router();

router.post('/signup', validateSchema(signupSchema), AuthController.signup);

router.post('/confirm-signup', AuthController.confirmSignup);

router.post('/login', validateSchema(loginSchema), AuthController.login);

router.post('/confirm-login', AuthController.confirmLogin);

router.post('/register-public-key', AuthController.registerPublicKey);

export default router;
