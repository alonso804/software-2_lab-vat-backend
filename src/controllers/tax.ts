import axios from 'axios';
import type { Response } from 'express';
import type { GetTaxesRequest } from 'src/dtos/tax/get-taxes';
import { generateRS256Jwt } from 'src/helpers/utils';
import { logger } from 'src/logger';

class TaxController {
  static async getTaxes(req: GetTaxesRequest, res: Response): Promise<void> {
    const { userId } = req.query;
    logger.info(`[TaxController] getTaxes userId: ${userId}`);

    const token = await generateRS256Jwt({ userId });

    const uri = `${process.env.SUNAT_URI}/tax/get-taxes/${process.env.SERVER_ID}`;

    logger.info(`[TaxController] getTaxes uri: ${uri}`);

    try {
      const response = await axios.get(uri, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      logger.error(`[TaxController] getTaxes error: ${error}`);
      res.status(500).json({ message: 'Error at sunat API' });
    }
  }
}

export default TaxController;
