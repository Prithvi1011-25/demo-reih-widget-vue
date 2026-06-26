<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import ListingDemoPage from './components/ListingDemoPage.vue';
import {
  WIDGET_PUBLIC_KEY,
  WIDGET_SCRIPT_URL,
  buildScriptEmbedWidgetConfig,
  clearReihLoader,
  openReihWithMedia,
  resolveListingMedia,
  waitForReihWidget,
  type ReihMediaItem,
} from './widgetConfig';

const WIDGET_SCRIPT_ID = 'reih-widget-script';

function setScriptEmbedConfig(): void {
  window.reihWidgetConfig = buildScriptEmbedWidgetConfig();
}

const opening = ref(false);
let script: HTMLScriptElement | null = null;

function onScriptLoad(): void {
  setScriptEmbedConfig();
  console.log('[script-embed] Widget script loaded');
}

async function openWidget(media: ReihMediaItem[]): Promise<void> {
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
  console.log('[script-embed] Open button clicked');
  void openWidget(resolveListingMedia());
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
    script.onerror = () => {
      console.error('[script-embed] Widget script failed to load');
    };
    document.body.appendChild(script);
  } else if (!window.reihWidget?.open) {
    script.addEventListener('load', onScriptLoad);
  } else {
    console.log('[script-embed] Widget script already loaded');
  }
});

onUnmounted(() => {
  script?.removeEventListener('load', onScriptLoad);
  window.reihWidget?.destroy?.();
  clearReihLoader();
});
</script>

<template>
  <ListingDemoPage
    title="Widget Test Page"
    description="This is a demo website created for testing the ReimagineHome widget. Use the button below to launch the widget and verify the embed integration."
    @open-all="handleOpenAll"
  />
</template>
