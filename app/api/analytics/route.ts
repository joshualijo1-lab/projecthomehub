import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  logger.info('analytics.event', body ?? {});
  return NextResponse.json({ ok: true });
}
