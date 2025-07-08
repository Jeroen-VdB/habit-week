declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, any>) => void;
    };
  }
}

export function trackEvent(event: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(event, data);
  }
}

// Pre-defined events for consistency
export const ANALYTICS_EVENTS = {
  HABIT_ADDED: 'habit-added',
  HABIT_EDITED: 'habit-edited',
  HABIT_DELETED: 'habit-deleted',
  GOOGLE_SYNC_SUCCESS: 'google-sync-success',
  GOOGLE_SYNC_ERROR: 'google-sync-error',
  GOOGLE_AUTH_SUCCESS: 'google-auth-success',
  GOOGLE_AUTH_ERROR: 'google-auth-error',
} as const;