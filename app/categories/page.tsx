import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/Card';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Service categories</h1>
      <p className="mt-2 text-slate-600">Browse trusted providers by trade.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <h2 className="text-lg font-semibold">{category.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{category.description}</p>
            <Link href={`/categories/${category.slug}`} className="mt-4 inline-block text-sm font-semibold">
              View providers
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
