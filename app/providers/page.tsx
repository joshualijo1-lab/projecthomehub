import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/Card';

export default async function ProvidersPage({
  searchParams,
}: {
  searchParams: { category?: string; county?: string; rating?: string };
}) {
  const providers = await prisma.providerProfile.findMany({
    include: { categories: { include: { category: true } }, coverageAreas: true },
  });

  const filtered = providers.filter((provider) => {
    const matchesCategory = searchParams.category
      ? provider.categories.some((cat) => cat.category.slug === searchParams.category)
      : true;
    const matchesCounty = searchParams.county
      ? provider.coverageAreas.some((area) => area.county === searchParams.county)
      : true;
    const matchesRating = searchParams.rating
      ? provider.rating >= Number(searchParams.rating)
      : true;
    return matchesCategory && matchesCounty && matchesRating;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Find trusted providers</h1>
      <p className="mt-2 text-slate-600">Filter by category or county to narrow your search.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((provider) => (
          <Card key={provider.id}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{provider.businessName}</h2>
              {provider.verified && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Verified
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-600">{provider.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
              {provider.categories.map((cat) => (
                <span key={cat.id} className="rounded-full bg-slate-100 px-3 py-1">
                  {cat.category.name}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>Rating: {provider.rating.toFixed(1)} ({provider.reviewCount})</span>
              <Link href={`/providers/${provider.id}`} className="font-semibold">
                View profile
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
