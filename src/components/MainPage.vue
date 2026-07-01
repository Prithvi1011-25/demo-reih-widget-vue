<script setup lang="ts">
import SiteHeader from './SiteHeader.vue';
import {
  LISTINGS,
  getListingHeroImage,
  type Listing,
} from '../listings';
import '../sandbox.css';

defineProps<{
  sessionId: string;
}>();

const emit = defineEmits<{
  openListing: [listing: Listing];
}>();
</script>

<template>
  <div>
    <SiteHeader />

    <main class="wrap">
      <section class="intro rise">
        <p class="eyebrow">Property listings</p>
        <h1>Choose a listing</h1>
        <p>Select a property to preview the ReimagineHome widget integration.</p>
      </section>

      <section class="listing-picker rise" style="animation-delay: 0.06s" aria-label="Available listings">
        <article
          v-for="(listing, index) in LISTINGS"
          :key="listing.id"
          class="listing-card rise"
          :style="{ animationDelay: `${0.1 + index * 0.05}s` }"
        >
          <div class="listing-card__media">
            <img
              class="listing-card__img"
              :src="getListingHeroImage(listing)"
              :alt="`${listing.title} preview`"
              loading="lazy"
            />
          </div>
          <div class="listing-card__body">
            <h2 class="listing-card__title">{{ listing.title }}</h2>
            <div class="listing-card__facts">
              <template v-for="(fact, factIndex) in listing.facts" :key="fact">
                <i v-if="factIndex > 0"></i>
                <span>{{ fact }}</span>
              </template>
            </div>
            <button
              type="button"
              class="btn btn--primary btn--md listing-card__cta"
              @click="emit('openListing', listing)"
            >
              View listing
            </button>
          </div>
        </article>
      </section>

      <footer class="foot">
        <span>Sandbox environment — not a production listing.</span>
        <span>Session ID <code>{{ sessionId }}</code></span>
      </footer>
    </main>
  </div>
</template>
