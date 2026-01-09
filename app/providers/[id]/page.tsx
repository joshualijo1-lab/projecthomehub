import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/Card';
import { getSessionUser } from '@/lib/auth';
import Link from 'next/link';

function maskContact(value: string) {
  if (value.length <= 4) return '••••';
  return `${value.slice(0, 2)}••••${value.slice(-2)}`;
}

export default async function ProviderProfilePage({ params }: { params: { id: string } }) {
  const provider = await prisma.providerProfile.findUnique({
    where: { id: params.id },
    include: {
      categories: { include: { category: true } },
      coverageAreas: true,
      photos: true,
      reviews: { include: { customer: true }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!provider) return notFound();

  const session = await getSessionUser();
  const showContact = Boolean(session);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-semibold">{provider.businessName}</h1>
          <p className="mt-2 text-slate-600">{provider.description}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
            {provider.categories.map((cat) => (
              <span key={cat.id} className="rounded-full bg-slate-100 px-3 py-1">
                {cat.category.name}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {provider.photos.map((photo) => (
              <div key={photo.id} className="relative h-40 overflow-hidden rounded-xl bg-slate-100">
                <Image src={photo.url} alt={provider.businessName} fill className="object-cover" />
              </div>
            ))}
          </div>
          <section className="mt-8 space-y-3">
            <h2 className="text-xl font-semibold">Reviews</h2>
            {provider.reviews.length === 0 && <p className="text-sm text-slate-600">No reviews yet.</p>}
            {provider.reviews.map((review) => (
              <Card key={review.id}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{review.customer.name}</p>
                  <span className="text-xs text-slate-500">{review.rating}/5</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
              </Card>
            ))}
          </section>
        </div>
        <div className="space-y-4">
          <Card>
            <h2 className="text-lg font-semibold">Contact & coverage</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>
                Phone: <span className="font-semibold">{showContact ? provider.phone : maskContact(provider.phone)}</span>
              </p>
              <p>
                Email:{' '}
                <span className="font-semibold">
                  {showContact ? provider.contactEmail : maskContact(provider.contactEmail)}
                </span>
              </p>
              <p>Hours: {provider.hours}</p>
              {provider.insurance && <p>Insurance: {provider.insurance}</p>}
              {provider.licenseNumber && <p>License: {provider.licenseNumber}</p>}
            </div>
            {!showContact && (
              <p className="mt-3 text-xs text-slate-500">
                Sign in to view full contact details.
              </p>
            )}
            <Link
              href={`/request-quote?providerId=${provider.id}`}
              className="mt-4 inline-flex w-full justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
            >
              Request a quote
            </Link>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold uppercase text-slate-500">Coverage areas</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {provider.coverageAreas.map((area) => (
                <li key={area.id}>
                  {area.county}
                  {area.town ? `, ${area.town}` : ''}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
