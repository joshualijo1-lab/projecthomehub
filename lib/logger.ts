type LogLevel = 'info' | 'warn' | 'error';

export const logger = {
  info: (message: string, meta: Record<string, unknown> = {}) => log('info', message, meta),
  warn: (message: string, meta: Record<string, unknown> = {}) => log('warn', message, meta),
  error: (message: string, meta: Record<string, unknown> = {}) => log('error', message, meta),
};

function log(level: LogLevel, message: string, meta: Record<string, unknown>) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
  // eslint-disable-next-line no-console
  console[level](JSON.stringify(payload));
}
