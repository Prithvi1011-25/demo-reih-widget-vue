export type ReihMediaItem = {
  image_url: string;
};

export type ListingMediaItem = ReihMediaItem & {
  hero?: boolean;
};

export {
  WIDGET_DEV_API_BASE_URL,
  WIDGET_DEV_APP_URL,
} from './widgetEnv';

export const WIDGET_SCRIPT_URL =
  'https://reimaginehome-embed-widget-app-git-dev-styldod.vercel.app/widget.js';

/** Replace with your real public key from ReimagineHome */
export const WIDGET_PUBLIC_KEY = 'public_key';

export const LISTING = {
  title: 'Maple Court Residence',
  facts: ['4 bed', '3 bath', '2,840 sq ft', 'Built 2021'],
};

export const LISTING_MEDIA: ListingMediaItem[] = [
  { hero: true, image_url: '/images/property/5.png' },
  { image_url: '/images/property/6.jpg' },
  { image_url: '/images/property/7.png' },
  { image_url: '/images/property/8.png' },
  { image_url: '/images/property/9.png' },
  { image_url: '/images/property/10.jpg' },
  { image_url: '/images/property/12.jpg' },
  { image_url: '/images/property/13.png' },
  { image_url: '/images/property/14.png' },
  { image_url: '/images/property/15.png' },
  { image_url: '/images/property/16.png' },
  { image_url: '/images/property/17.png' },
  { image_url: '/images/property/18.png' },
  { image_url: '/images/property/19.png' },
  { image_url: '/images/property/20.png' },
  { image_url: '/images/property/21.png' },
  { image_url: '/images/property/22.png' },
  { image_url: '/images/property/23.png' },
  { image_url: '/images/property/24.png' },
  { image_url: '/images/property/25.png' },
];

export const ARRANGE_LABEL = 'Arrange Interiors';

/** DOM id used by reimaginehome-widget for the session loader overlay */
export const REIH_LOADER_ID = 'reih-host-loader';

export function classifyMedia(items: ListingMediaItem[] = LISTING_MEDIA) {
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

export function buildWidgetCallbacks() {
  return {
    onComplete: (detail: unknown) => {
      console.log('[reih] onComplete:', detail);
    },
    onError: (err: unknown) => {
      console.error('[reih] onError:', err);
    },
    onClose: () => {
      console.log('[reih] onClose: widget closed');
    },
  };
}

/**
 * CDN script-embed config for window.reihWidgetConfig.
 * public_key comes from the <script data-public-key> attribute, not this object.
 */
export function buildScriptEmbedWidgetConfig() {
  return {
    media: resolveListingMedia(),
    mode: 'simple' as const,
    branding: buildWidgetBranding(),
    sidebar_position: 'right' as const,
    language: buildWidgetLanguage(),
    ...buildWidgetCallbacks(),
  };
}

export function buildWidgetConfig() {
  return {
    public_key: WIDGET_PUBLIC_KEY,
    ...buildScriptEmbedWidgetConfig(),
  };
}
export async function openReihWithMedia(
  widget: ReihWidgetOpener,
  media: ListingMediaItem[],
): Promise<void> {
  clearReihLoader();
  await widget.open({
    media: toWidgetMedia(media),
    mode: 'simple',
    branding: buildWidgetBranding(),
    sidebar_position: 'right',
    language: buildWidgetLanguage(),
  });
}

/** Wait until the CDN-injected window.reihWidget API is ready. */
export function waitForReihWidget(
  timeoutMs = 30_000,
): Promise<NonNullable<Window['reihWidget']>> {
  const existing = window.reihWidget;
  if (existing && typeof existing.open === 'function') {
    return Promise.resolve(existing);
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

/** Local /images/* paths need a full URL for the widget backend to fetch them */
export function resolveMediaUrl(url: string): string {
  if (url.startsWith('/') && typeof window !== 'undefined') {
    return `${window.location.origin}${url}`;
  }
  return url;
}

export function resolveListingMedia(
  media: ListingMediaItem[] = LISTING_MEDIA,
): ReihMediaItem[] {
  return toWidgetMedia(media);
}

export type ReihWidgetLanguage = {
  code: string;
  name: string;
  nativeName: string;
};

export function buildWidgetLanguage(): ReihWidgetLanguage[] {
  return [
    { code: 'en-US', name: 'English (United States)', nativeName: 'English (US)' },
    { code: 'en-GB', name: 'English (United Kingdom)', nativeName: 'English (UK)' },
    { code: 'pl-PL', name: 'Polish', nativeName: 'Polski' },
    { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
  ];
}

export type ReihWidgetBranding = {
  logo: string;
  text_primary: string;
  text_secondary: string;
  primary_color: string;
  heading: string;
  sub_heading: string;
  footer_text: string;
};

/** Branding block — must match the embed spec exactly (no extra keys). */
export function buildWidgetBranding(): ReihWidgetBranding {
  return {
    logo: 'https://ecdn.styldod.com/assets/logo/6a2bca9bce2a355c2c13d058.svg',
    text_primary: '#071121FF',
    text_secondary: '#1B232E',
    primary_color: '#3ED37A',
    heading: 'Reimagine Your Space',
    sub_heading: 'AI-powered room redesign',
    footer_text: '',
  };
}

