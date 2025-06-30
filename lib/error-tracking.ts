import * as Sentry from '@sentry/nextjs';

export class ErrorTracker {
  static init() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay(),
      ],
    });
  }

  static captureException(error: Error, context?: any): void {
    Sentry.captureException(error, {
      extra: context,
    });
  }

  static captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
    Sentry.captureMessage(message, level);
  }

  static setUser(user: { id: string; email: string; name?: string }): void {
    Sentry.setUser(user);
  }

  static setTag(key: string, value: string): void {
    Sentry.setTag(key, value);
  }

  static setContext(name: string, context: any): void {
    Sentry.setContext(name, context);
  }
} 