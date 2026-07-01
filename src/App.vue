<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import ListingDemoPage from './components/ListingDemoPage.vue';
import MainPage from './components/MainPage.vue';
import { getListingById, type Listing } from './listings';
import { getOrCreateSessionId } from './sessionId';
import {
  buildScriptEmbedWidgetConfig,
  clearReihLoader,
  openReihWithMedia,
  type ListingMediaItem,
  waitForReihWidget,
} from './widgetConfig';

const opening = ref(false);
const activeListingId = ref<string | null>(null);
const sessionId = getOrCreateSessionId();

const activeListing = computed(() =>
  activeListingId.value ? getListingById(activeListingId.value) : null,
);

function parseHash(): void {
  const match = window.location.hash.match(/^#\/listing\/([^/?#]+)/);
  activeListingId.value = match?.[1] ?? null;
}

function openListing(listing: Listing): void {
  window.location.hash = `#/listing/${listing.id}`;
}

function goHome(): void {
  activeListingId.value = null;
  window.location.hash = '';
}

function setScriptEmbedConfig(listingId: string): void {
  window.reihWidgetConfig = buildScriptEmbedWidgetConfig(listingId);
}

async function openWidget(
  listingId: string,
  media: ListingMediaItem[],
): Promise<void> {
  if (opening.value) return;

  opening.value = true;
  try {
    setScriptEmbedConfig(listingId);
    const widget = await waitForReihWidget();
    widget.destroy();
    clearReihLoader();
    await openReihWithMedia(widget, listingId, media);
  } catch (error) {
    clearReihLoader();
    console.error('[script-embed] Widget open failed:', error);
  } finally {
    opening.value = false;
  }
}

function handleOpenMedia(media: ListingMediaItem[]): void {
  if (!activeListingId.value) return;
  void openWidget(activeListingId.value, media);
}

onMounted(() => {
  parseHash();
  window.addEventListener('hashchange', parseHash);
});

onUnmounted(() => {
  window.removeEventListener('hashchange', parseHash);
  window.reihWidget?.destroy?.();
  clearReihLoader();
});
</script>

<template>
  <MainPage
    v-if="!activeListing"
    :session-id="sessionId"
    @open-listing="openListing"
  />
  <ListingDemoPage
    v-else
    :listing="activeListing"
    :session-id="sessionId"
    @open-media="handleOpenMedia"
    @back="goHome"
  />
</template>
