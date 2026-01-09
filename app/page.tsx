import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/Card';
import { Analytics } from '@/app/components/Analytics';

export default async function HomePage() {
  const categories = await prisma.category.findMany({ take: 6, orderBy: { name: 'asc' } });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
      <Analytics event="home_view" />
      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">HomeHub</p>
          <h1 className="text-4xl font-semibold text-slate-900">
            Find trusted home service professionals across Ireland.
          </h1>
          <p className="text-base text-slate-600">
            Search verified trades, request quotes, and manage your home projects in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/request-quote" className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white">
              Request a quote
            </Link>
            <Link href="/providers" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">
              Browse providers
            </Link>
          </div>
        </div>
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">Search by category</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="rounded-xl border border-slate-200 p-4 text-sm font-medium hover:border-brand"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Verified professionals',
            body: 'Admins verify licenses, insurance, and service quality.',
          },
          {
            title: 'Fast quote matching',
            body: 'Broadcast job requests to providers in your area.',
          },
          {
            title: 'Trusted reviews',
            body: 'Only customers with completed jobs can leave feedback.',
          },
        ].map((item) => (
          <Card key={item.title}>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.body}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
