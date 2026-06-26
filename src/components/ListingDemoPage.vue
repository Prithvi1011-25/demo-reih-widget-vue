<script setup lang="ts">
import SiteHeader from './SiteHeader.vue';
import { getWidgetHostCssVars } from '../widgetConfig';
import '../listing.css';

defineProps<{
  title: string;
  description: string;
}>();

defineEmits<{
  openAll: [];
}>();

const hostCssVars = getWidgetHostCssVars();
</script>

<template>
  <div class="listing-shell" :style="hostCssVars">
    <SiteHeader />
    <main class="listing-page">
      <section class="listing-intro" id="listing">
        <h1>{{ title }}</h1>
        <p class="listing-intro__description">{{ description }}</p>
      </section>

      <section class="widget-section" id="widget">
        <button
          type="button"
          id="open-btn"
          class="open-widget-btn"
          @click="$emit('openAll')"
        >
          Open ReimagineHome Widget
        </button>
      </section>
    </main>
  </div>
</template>
