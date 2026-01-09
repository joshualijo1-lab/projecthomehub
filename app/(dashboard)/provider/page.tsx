import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { Card } from '@/components/Card';

export default async function ProviderDashboardPage() {
  const session = await getSessionUser();
  if (!session) redirect('/sign-in');

  const profile = await prisma.providerProfile.findUnique({
    where: { userId: session.id },
    include: { coverageAreas: true },
  });

  if (!profile) redirect('/sign-up');

  const threads = await prisma.quoteThread.findMany({
    where: { providerId: profile.id },
    include: { quoteRequest: { include: { category: true, customer: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Provider dashboard</h1>
      <Card className="mt-6">
        <h2 className="text-lg font-semibold">Profile summary</h2>
        <p className="mt-2 text-sm text-slate-600">{profile.description}</p>
        <div className="mt-3 text-sm text-slate-500">
          Coverage: {profile.coverageAreas.map((area) => area.county).join(', ') || 'Update coverage areas'}
        </div>
      </Card>
      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Leads</h2>
        {threads.map((thread) => (
          <Card key={thread.id}>
            <h3 className="text-lg font-semibold">{thread.quoteRequest.category.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{thread.quoteRequest.description}</p>
            <div className="mt-3 text-sm text-slate-500">
              Customer: {thread.quoteRequest.customer.name} • {thread.quoteRequest.locationCounty}
            </div>
          </Card>
        ))}
        {threads.length === 0 && <p className="text-sm text-slate-600">No leads yet.</p>}
      </div>
    </div>
  );
}
