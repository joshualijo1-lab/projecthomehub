'use client';

import { useAnalytics } from '@/components/useAnalytics';

export function Analytics({ event }: { event: string }) {
  useAnalytics(event);
  return null;
}
