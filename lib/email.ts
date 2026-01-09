import nodemailer from 'nodemailer';
import { logger } from '@/lib/logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.SMTP_HOST) {
    logger.warn('email.disabled', { to, subject });
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'HomeHub <no-reply@homehub.ie>',
    to,
    subject,
    html,
  });
}
