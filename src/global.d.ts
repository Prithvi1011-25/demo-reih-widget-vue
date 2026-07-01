import type { ReihMediaItem } from './widgetConfig';

declare global {
  interface Window {
    reihWidgetConfig?: {
      listing_id: string;
      session_id: string;
      media: ReihMediaItem[];
      branding?: {
        logo?: string;
      };
    };
    reihWidget?: {
      open: (options?: {
        listing_id?: string;
        session_id?: string;
        media?: ReihMediaItem[];
        branding?: {
          logo?: string;
        };
      }) => Promise<void>;
      close: () => void;
      destroy: () => void;
    };
  }
}

export {};
