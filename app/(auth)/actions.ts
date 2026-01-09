'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSessionCookie, hashPassword, verifyPassword } from '@/lib/auth';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['CUSTOMER', 'PROVIDER']),
});

export async function signIn(formData: FormData) {
  const parsed = signInSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  const user = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (!user) throw new Error('Invalid credentials');
  const valid = await verifyPassword(parsed.password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');

  await createSessionCookie(user.id);
  return { ok: true };
}

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.parse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  });

  const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (existing) throw new Error('Email already in use');

  const passwordHash = await hashPassword(parsed.password);
  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: parsed.role,
    },
  });

  if (parsed.role === 'PROVIDER') {
    await prisma.providerProfile.create({
      data: {
        userId: user.id,
        businessName: `${parsed.name} Services`,
        description: 'New provider profile. Update your details in the dashboard.',
        phone: '000-000-000',
        contactEmail: parsed.email,
        hours: 'Mon-Fri 9am-5pm',
      },
    });
  }

  await createSessionCookie(user.id);
  return { ok: true };
}
