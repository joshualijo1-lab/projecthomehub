import { prisma } from '@/lib/prisma';
import { QuoteForm } from './QuoteForm';
import { Card } from '@/components/Card';

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: { providerId?: string };
}) {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Request a quote</h1>
      <p className="mt-2 text-slate-600">
        Share a few details and HomeHub will notify available professionals.
      </p>
      <Card className="mt-6">
        <QuoteForm categories={categories} providerId={searchParams.providerId} />
      </Card>
    </div>
  );
}
