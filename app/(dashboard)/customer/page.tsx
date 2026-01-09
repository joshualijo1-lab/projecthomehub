import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { submitReview } from './actions';

export default async function CustomerDashboardPage() {
  const session = await getSessionUser();
  if (!session) redirect('/sign-in');

  const quotes = await prisma.quoteRequest.findMany({
    where: { customerId: session.id },
    include: { category: true, threads: { include: { provider: true } }, review: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Your quote requests</h1>
      <div className="mt-6 space-y-4">
        {quotes.map((quote) => (
          <Card key={quote.id}>
            <h2 className="text-lg font-semibold">{quote.category.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{quote.description}</p>
            <div className="mt-3 text-xs text-slate-500">Status: {quote.status}</div>
            <div className="mt-3 text-sm">
              Providers notified: {quote.threads.length}
            </div>
            {quote.status === 'COMPLETED' && !quote.review && quote.threads.length > 0 && (
              <form action={submitReview} className="mt-4 space-y-2">
                <input type="hidden" name="quoteRequestId" value={quote.id} />
                <label className="text-sm font-semibold">Leave a review</label>
                <div className="flex items-center gap-2">
                  <select
                    name="rating"
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                    required
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
                  <input
                    name="comment"
                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm"
                    placeholder="Share your experience"
                    required
                  />
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            )}
          </Card>
        ))}
        {quotes.length === 0 && <p className="text-sm text-slate-600">No quotes yet.</p>}
      </div>
    </div>
  );
}
