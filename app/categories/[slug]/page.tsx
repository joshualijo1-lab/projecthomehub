import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/Card';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      providers: {
        include: { provider: { include: { coverageAreas: true, photos: true } } },
      },
    },
  });

  if (!category) return notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">{category.name}</h1>
      <p className="mt-2 text-slate-600">{category.description}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {category.providers.map(({ provider }) => (
          <Card key={provider.id}>
            <h2 className="text-lg font-semibold">{provider.businessName}</h2>
            <p className="mt-2 text-sm text-slate-600">{provider.description}</p>
            <div className="mt-3 text-xs text-slate-500">
              Coverage: {provider.coverageAreas.map((area) => area.county).join(', ')}
            </div>
            <Link href={`/providers/${provider.id}`} className="mt-4 inline-block text-sm font-semibold">
              View profile
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
