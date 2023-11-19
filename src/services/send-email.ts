import Sendgrid from '@sendgrid/mail';
import { logger } from 'src/logger';

Sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMagicLinkLogin = async (email: string, token: string): Promise<void> => {
  await Sendgrid.send({
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Login to your account',
    html: `
      <div>
        <p>Click the link below to login to your account</p>
        <a href="${process.env.FRONTEND_URI}/confirm-login/${token}">Login</a>
      </div>
    `,
  });

  logger.info({ route: 'login', email, token });
};

export const sendSignupConfirmation = async (email: string, token: string): Promise<void> => {
  await Sendgrid.send({
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Confirm your account',
    html: `
      <div>
        <p>Click the link below to confirm your account</p>
        <a href="${process.env.FRONTEND_URI}/confirm-register/${token}">Confirm</a>
      </div>
    `,
  });

  logger.info({ route: 'signup', email, token });
};
