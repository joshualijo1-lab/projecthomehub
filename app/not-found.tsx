import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-sm text-slate-600">We couldn't find the page you're looking for.</p>
      <Link href="/" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
        Back to home
      </Link>
    </div>
  );
}
