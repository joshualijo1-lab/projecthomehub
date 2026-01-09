'use server';

import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export async function toggleVerification(providerId: string, verified: boolean) {
  await requireRole(UserRole.ADMIN);
  await prisma.providerProfile.update({
    where: { id: providerId },
    data: { verified },
  });
}
