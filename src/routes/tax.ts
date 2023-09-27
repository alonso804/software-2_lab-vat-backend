import { Router } from 'express';
import { validateJwt } from 'src/middlewares/validate-jwt';

import TaxController from '../controllers/tax';

const router = Router();

router.get('/get-taxes', validateJwt, TaxController.getTaxes);

export default router;
