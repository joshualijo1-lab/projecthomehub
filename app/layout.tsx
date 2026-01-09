import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://homehub.ie'),
  title: {
    default: 'HomeHub | Find trusted home service pros',
    template: '%s | HomeHub',
  },
  description:
    'HomeHub connects homeowners in Ireland with verified plumbers, electricians, contractors, and more.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://homehub.ie',
    title: 'HomeHub | Find trusted home service pros',
    description:
      'Find verified home service professionals, request quotes, and manage projects with HomeHub.',
    images: ['/opengraph-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HomeHub | Find trusted home service pros',
    description:
      'Find verified home service professionals, request quotes, and manage projects with HomeHub.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen bg-slate-50">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
