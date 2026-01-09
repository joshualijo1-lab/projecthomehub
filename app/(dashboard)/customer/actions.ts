'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

const reviewSchema = z.object({
  quoteRequestId: z.string().min(1),
  rating: z.string().min(1),
  comment: z.string().min(5),
});

export async function submitReview(formData: FormData) {
  const session = await requireUser();
  const parsed = reviewSchema.parse({
    quoteRequestId: formData.get('quoteRequestId'),
    rating: formData.get('rating'),
    comment: formData.get('comment'),
  });

  const quote = await prisma.quoteRequest.findFirst({
    where: { id: parsed.quoteRequestId, customerId: session.id, status: 'COMPLETED' },
    include: { threads: true },
  });

  if (!quote || quote.threads.length === 0) {
    throw new Error('Review not allowed');
  }

  const providerId = quote.threads[0].providerId;

  await prisma.review.create({
    data: {
      providerId,
      customerId: session.id,
      quoteRequestId: quote.id,
      rating: Number(parsed.rating),
      comment: parsed.comment,
    },
  });

  const reviews = await prisma.review.findMany({ where: { providerId } });
  const rating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  await prisma.providerProfile.update({
    where: { id: providerId },
    data: { rating, reviewCount: reviews.length },
  });
}
