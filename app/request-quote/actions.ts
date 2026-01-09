'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { sendEmail } from '@/lib/email';
import { logger } from '@/lib/logger';

const quoteSchema = z.object({
  categoryId: z.string().min(1),
  locationCounty: z.string().min(2),
  locationTown: z.string().optional(),
  description: z.string().min(10),
  providerId: z.string().optional(),
  photoUrls: z.string().optional(),
});

export async function createQuote(formData: FormData) {
  const session = await requireUser();
  if (session.role === UserRole.PROVIDER) {
    throw new Error('FORBIDDEN');
  }

  const parsed = quoteSchema.parse({
    categoryId: formData.get('categoryId'),
    locationCounty: formData.get('locationCounty'),
    locationTown: formData.get('locationTown') || undefined,
    description: formData.get('description'),
    providerId: formData.get('providerId') || undefined,
    photoUrls: formData.get('photoUrls') || undefined,
  });

  const photoUrls = parsed.photoUrls ? parsed.photoUrls.split(',').filter(Boolean) : [];

  const quote = await prisma.quoteRequest.create({
    data: {
      customerId: session.id,
      categoryId: parsed.categoryId,
      locationCounty: parsed.locationCounty,
      locationTown: parsed.locationTown,
      description: parsed.description,
      requestedProviderId: parsed.providerId,
      photos: {
        create: photoUrls.map((url) => ({ url })),
      },
    },
  });

  const providers = parsed.providerId
    ? await prisma.providerProfile.findMany({ where: { id: parsed.providerId } })
    : await prisma.providerProfile.findMany({
        where: {
          categories: { some: { categoryId: parsed.categoryId } },
          coverageAreas: { some: { county: parsed.locationCounty } },
        },
      });

  if (providers.length > 0) {
    await prisma.quoteThread.createMany({
      data: providers.map((provider) => ({
        quoteRequestId: quote.id,
        providerId: provider.id,
      })),
    });

    await Promise.all(
      providers.map((provider) =>
        sendEmail({
          to: provider.contactEmail,
          subject: 'New HomeHub quote request',
          html: `<p>You have a new quote request in ${parsed.locationCounty}.</p>`,
        }),
      ),
    );
  }

  logger.info('quote.created', { quoteId: quote.id, providerCount: providers.length });

  return { quoteId: quote.id };
}
