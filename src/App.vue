<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import ListingDemoPage from './components/ListingDemoPage.vue';
import {
  WIDGET_PUBLIC_KEY,
  WIDGET_SCRIPT_URL,
  buildScriptEmbedWidgetConfig,
  clearReihLoader,
  openReihWithMedia,
  type ListingMediaItem,
  LISTING_MEDIA,
  waitForReihWidget,
} from './widgetConfig';

const WIDGET_SCRIPT_ID = 'reih-widget-script';

const opening = ref(false);
let script: HTMLScriptElement | null = null;

function setScriptEmbedConfig(): void {
  window.reihWidgetConfig = buildScriptEmbedWidgetConfig();
}

function onScriptLoad(): void {
  setScriptEmbedConfig();
  console.log('[script-embed] Widget script loaded');
}

function onScriptError(): void {
  console.error('[script-embed] Widget script failed to load');
}

async function openWidget(media: ListingMediaItem[]): Promise<void> {
  if (opening.value) return;

  opening.value = true;
  try {
    setScriptEmbedConfig();
    const widget = await waitForReihWidget();
    widget.destroy();
    clearReihLoader();
    await openReihWithMedia(widget, media);
  } catch (error) {
    clearReihLoader();
    console.error('[script-embed] Widget open failed:', error);
  } finally {
    opening.value = false;
  }
}

function handleOpenAll(): void {
  void openWidget(LISTING_MEDIA);
}

function handleOpenMedia(media: ListingMediaItem[]): void {
  void openWidget(media);
}

onMounted(() => {
  setScriptEmbedConfig();
  console.log('[script-embed] Widget config created');

  script = document.getElementById(WIDGET_SCRIPT_ID) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = WIDGET_SCRIPT_ID;
    script.src = `${WIDGET_SCRIPT_URL}?v=${Date.now()}`;
    script.async = true;
    script.setAttribute('data-public-key', WIDGET_PUBLIC_KEY);
    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);
    document.body.appendChild(script);
  } else if (!window.reihWidget?.open) {
    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);
  } else {
    console.log('[script-embed] Widget script already loaded');
  }
});

onUnmounted(() => {
  script?.removeEventListener('load', onScriptLoad);
  script?.removeEventListener('error', onScriptError);
  window.reihWidget?.destroy?.();
  clearReihLoader();
});
</script>

<template>
  <ListingDemoPage
    @open-all="handleOpenAll"
    @open-media="handleOpenMedia"
  />
</template>
