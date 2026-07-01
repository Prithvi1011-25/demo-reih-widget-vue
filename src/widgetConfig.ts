import {
  PUBLIC_ASSET_ORIGIN,
  WIDGET_DEV_API_BASE_URL,
  WIDGET_DEV_APP_URL,
} from './widgetEnv';
import { getListingById, type ListingMediaItem } from './listings';
import { getOrCreateSessionId } from './sessionId';

export type ReihMediaItem = {
  image_url: string;
};

export type { ListingMediaItem };

export { PUBLIC_ASSET_ORIGIN, WIDGET_DEV_API_BASE_URL, WIDGET_DEV_APP_URL };

export const WIDGET_SCRIPT_URL = 'https://widget.styldod.com/widget.js';

/** Replace with your real public key from ReimagineHome */
export const WIDGET_PUBLIC_KEY = 'ppk_0wh4jZLGM2UL1P761KCsU2tr';

//export const WIDGET_LOGO_URL =
//  'https://ecdn.styldod.com/assets/logo/6a2bca9bce2a355c2c13d058.svg';

export const DESIGN_INTERIOR_LABEL = 'Design';

/** DOM id used by reimaginehome-widget for the session loader overlay */
export const REIH_LOADER_ID = 'reih-host-loader';

export function classifyMedia(items: ListingMediaItem[]) {
  const hero = items.find((item) => item.hero) ?? items[0];
  const nonHero = items.filter((item) => item !== hero);
  return { hero, nonHero };
}

/** Widget only wants { image_url } — strip host-side flags like `hero`. */
export function toWidgetMedia(items: ListingMediaItem[]): ReihMediaItem[] {
  return items.map((item) => ({
    image_url: resolveMediaUrl(item.image_url),
  }));
}

/** Remove a stuck loader overlay (widget destroy() does not always clear it). */
export function clearReihLoader(): void {
  document.getElementById(REIH_LOADER_ID)?.remove();
}

/** Minimal widget API used by both CDN and npm integrations. */
export type ReihWidgetOpener = {
  open: (overrides?: Record<string, unknown>) => Promise<void>;
};

/** CDN script-embed config for window.reihWidgetConfig. */
export function buildScriptEmbedWidgetConfig(listingId: string) {
  const listing = getListingById(listingId);
  if (!listing) {
    throw new Error(`[reih] Unknown listing id: ${listingId}`);
  }

  return {
    listing_id: listingId,
    session_id: getOrCreateSessionId(),
    media: toWidgetMedia(listing.media),
    branding: buildWidgetBranding(),
  };
}

export function buildWidgetConfig(listingId: string) {
  return buildScriptEmbedWidgetConfig(listingId);
}

export async function openReihWithMedia(
  widget: ReihWidgetOpener,
  listingId: string,
  media: ListingMediaItem[],
): Promise<void> {
  clearReihLoader();
  await widget.open({
    listing_id: listingId,
    session_id: getOrCreateSessionId(),
    media: toWidgetMedia(media),
    branding: buildWidgetBranding(),
  });
}

/** Inject the CDN widget script once (deferred until user opens Design). */
export function loadWidgetScript(): Promise<void> {
  if (typeof document === 'undefined') {
    return Promise.resolve();
  }

  const existing = window.reihWidget;
  if (existing && typeof existing.open === 'function') {
    return Promise.resolve();
  }

  const scriptId = 'reih-widget-script';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (script?.dataset.loaded === 'true') {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const onLoad = () => {
      script?.setAttribute('data-loaded', 'true');
      resolve();
    };
    const onError = () => reject(new Error('[reih] Widget script failed to load'));

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `${WIDGET_SCRIPT_URL}?v=${Date.now()}`;
      script.async = true;
      script.setAttribute('data-public-key', WIDGET_PUBLIC_KEY);
      script.addEventListener('load', onLoad, { once: true });
      script.addEventListener('error', onError, { once: true });
      document.body.appendChild(script);
      return;
    }

    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', onError, { once: true });
  });
}

/** Wait until the CDN-injected window.reihWidget API is ready. */
export async function waitForReihWidget(
  timeoutMs = 30_000,
): Promise<NonNullable<Window['reihWidget']>> {
  await loadWidgetScript();

  const existing = window.reihWidget;
  if (existing && typeof existing.open === 'function') {
    return existing;
  }

  return new Promise((resolve, reject) => {
    const script = document.querySelector<HTMLScriptElement>(
      'script[src*="widget.js"]',
    );

    let settled = false;
    const finish = (widget: NonNullable<Window['reihWidget']>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearInterval(poller);
      script?.removeEventListener('load', tryResolve);
      resolve(widget);
    };

    const tryResolve = () => {
      const widget = window.reihWidget;
      if (widget && typeof widget.open === 'function') {
        finish(widget);
      }
    };

    script?.addEventListener('load', tryResolve);
    const poller = window.setInterval(tryResolve, 50);

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      clearInterval(poller);
      script?.removeEventListener('load', tryResolve);
      reject(new Error('[reih] Widget script did not load in time'));
    }, timeoutMs);

    tryResolve();
  });
}

/** Local /images/* paths need a public URL the widget backend can fetch. */
export function resolveMediaUrl(url: string): string {
  if (!url.startsWith('/') || typeof window === 'undefined') {
    return url;
  }

  const host = window.location.hostname;
  const isLocal =
    host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  const origin = isLocal ? PUBLIC_ASSET_ORIGIN : window.location.origin;

  return `${origin}${url}`;
}

export function buildWidgetBranding() {
  return {};
}
