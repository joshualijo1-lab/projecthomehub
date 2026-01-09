import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { toggleVerification } from './actions';

export default async function AdminDashboardPage() {
  const session = await getSessionUser();
  if (!session) redirect('/sign-in');
  if (session.role !== 'ADMIN') redirect('/');

  const providers = await prisma.providerProfile.findMany({
    include: { user: true, categories: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const quotesByCategory = await prisma.quoteRequest.groupBy({
    by: ['categoryId'],
    _count: { _all: true },
  });

  const categories = await prisma.category.findMany();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Admin dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Quote volume</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {quotesByCategory.map((item) => {
              const category = categories.find((cat) => cat.id === item.categoryId);
              return (
                <li key={item.categoryId}>
                  {category?.name ?? 'Unknown'}: {item._count._all}
                </li>
              );
            })}
          </ul>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Moderation checklist</h2>
          <p className="mt-2 text-sm text-slate-600">
            Verify providers, review reports, and ensure profiles are complete.
          </p>
        </Card>
      </div>
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Providers</h2>
        {providers.map((provider) => (
          <Card key={provider.id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{provider.businessName}</h3>
                <p className="text-sm text-slate-600">{provider.user.email}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                  {provider.categories.map((cat) => (
                    <span key={cat.id} className="rounded-full bg-slate-100 px-3 py-1">
                      {cat.category.name}
                    </span>
                  ))}
                </div>
              </div>
              <form action={toggleVerification.bind(null, provider.id, !provider.verified)}>
                <Button type="submit">
                  {provider.verified ? 'Mark unverified' : 'Verify provider'}
                </Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
