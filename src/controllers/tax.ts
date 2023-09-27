import axios from 'axios';
import type { Response } from 'express';
import type { GetTaxesRequest } from 'src/dtos/tax/get-taxes';
import { generateRS256Jwt } from 'src/helpers/utils';

class TaxController {
  static async getTaxes(req: GetTaxesRequest, res: Response): Promise<void> {
    const { _id } = req.query;

    const token = await generateRS256Jwt({ _id });

    const response = await axios.get(`${process.env.SUNAT_URI}/tax/get-user/${_id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    res.status(200).json(response.data);
  }
}

export default TaxController;
