import * as Sentry from '@sentry/astro';

export function initSentry() {
	if (import.meta.env.PUBLIC_SENTRY_DSN) {
		Sentry.init({
			dsn: import.meta.env.PUBLIC_SENTRY_DSN,
			integrations: [
				Sentry.browserTracingIntegration(),
				Sentry.replayIntegration({
					maskAllText: false,
					blockAllMedia: false,
				}),
			],
			// Performance Monitoring
			tracesSampleRate: 1.0,
			// Session Replay
			replaysSessionSampleRate: 0.1,
			replaysOnErrorSampleRate: 1.0,
		});
	}
}
