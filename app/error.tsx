'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-slate-600">We logged the error and will look into it.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
