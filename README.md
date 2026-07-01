# ReimagineHome Widget Sandbox (Vue)

A Vue 3 demo that embeds the ReimagineHome interior redesign widget inside a property listing page. Use it to preview the buyer-facing experience: open any listing photo and launch **Design interior** to start a redesign session.

**Live demo:** [https://demo-reih-widget-vue.vercel.app](https://demo-reih-widget-vue.vercel.app)

## What it does

- Renders a sample property listing with a hero photo and gallery grid
- Loads the ReimagineHome widget via script embed (`widget.js`)
- Opens the widget with the selected image(s) when a user clicks **Design interior**
- Mirrors how the widget behaves on a real estate listing site

## Tech stack

- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for dev and build
- Deployed on [Vercel](https://vercel.com/)

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install and run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (`npm run dev` opens this automatically).

### Build for production

```bash
npm run build
npm run preview
```

## Configuration

Widget and listing settings live in:

| File | Purpose |
| --- | --- |
| `src/widgetConfig.ts` | Widget script URL, public key, listing data, media URLs, embed config |
| `src/widgetEnv.ts` | Dev/prod widget app URLs, API base URLs, public asset origin |

Before testing with a real account, replace the placeholder in `src/widgetConfig.ts`:

```ts
export const WIDGET_PUBLIC_KEY = 'public_key'; // your ReimagineHome public key
```

Listing photos are served from `public/images/property/`. When running locally, media URLs are resolved against `PUBLIC_ASSET_ORIGIN` in `src/widgetEnv.ts` so the widget can fetch images correctly.

## Project structure

```
src/
├── App.vue                 # Widget script loader and open handler
├── components/
│   ├── ListingDemoPage.vue # Listing layout (hero + gallery)
│   ├── SiteHeader.vue      # Header with Styldod branding
│   └── DesignInteriorButton.vue
├── widgetConfig.ts         # Widget integration helpers
└── widgetEnv.ts            # Environment URLs
public/
├── images/property/        # Sample listing photos
├── styldod-logo.png
├── favicon.png
└── apple-touch-icon.png
```

## Deployment

The app is configured for Vercel (`vercel.json` handles SPA rewrites).

```bash
npx vercel --prod
```

Production alias: `https://demo-reih-widget-vue.vercel.app`

## Widget integration notes

- The widget script is injected on mount in `App.vue` with `data-public-key`
- `window.reihWidgetConfig` is set before each open so media and callbacks stay in sync
- `buildScriptEmbedWidgetConfig()` in `widgetConfig.ts` builds the payload passed to the widget
- Hero and gallery buttons emit `open-media` with the relevant image set

## License

Private — Styldod / ReimagineHome internal sandbox.
