import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await prisma.category.findMany({ select: { slug: true } });
  const providers = await prisma.providerProfile.findMany({ select: { id: true } });

  const baseUrl = 'https://homehub.ie';

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/categories`, lastModified: new Date() },
    { url: `${baseUrl}/providers`, lastModified: new Date() },
    { url: `${baseUrl}/request-quote`, lastModified: new Date() },
    ...categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
    })),
    ...providers.map((provider) => ({
      url: `${baseUrl}/providers/${provider.id}`,
      lastModified: new Date(),
    })),
  ];
}
