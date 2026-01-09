import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold text-brand">
          HomeHub
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/categories">Categories</Link>
          <Link href="/providers">Find Pros</Link>
          <Link href="/request-quote">Request a Quote</Link>
          <Link href="/sign-in" className="rounded-full border border-brand px-3 py-1">
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
