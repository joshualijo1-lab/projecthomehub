'use client';

import { useEffect } from 'react';

export function useAnalytics(event: string, payload: Record<string, unknown> = {}) {
  useEffect(() => {
    const body = JSON.stringify({ event, payload, path: window.location.pathname });
    navigator.sendBeacon('/api/analytics', body);
  }, [event, payload]);
}
