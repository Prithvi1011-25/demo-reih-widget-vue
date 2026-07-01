const SESSION_STORAGE_KEY = 'reih-widget-session-id';

/** Stable for the browser tab; cleared when the tab closes. */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}
