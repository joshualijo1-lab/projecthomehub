import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const SESSION_COOKIE = 'homehub_session';

export type SessionUser = {
  id: string;
  role: UserRole;
  email: string;
  name: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(payload: SessionUser) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySessionToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as SessionUser;
}

export async function getSessionUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const session = verifySessionToken(token);
    return session;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = await getSessionUser();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

export async function requireRole(role: UserRole) {
  const session = await requireUser();
  if (session.role !== role) {
    throw new Error('FORBIDDEN');
  }
  return session;
}

export async function createSessionCookie(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  const token = createSessionToken({
    id: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
}
