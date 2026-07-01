<script setup lang="ts">
import { computed } from 'vue';
import DesignInteriorButton from './DesignInteriorButton.vue';
import SiteHeader from './SiteHeader.vue';
import { classifyMedia, type ListingMediaItem } from '../widgetConfig';
import type { Listing } from '../listings';
import '../sandbox.css';

const props = defineProps<{
  listing: Listing;
  sessionId: string;
}>();

const emit = defineEmits<{
  openMedia: [media: ListingMediaItem[], label: string];
  back: [];
}>();

const hero = computed(() => classifyMedia(props.listing.media).hero);
const nonHero = computed(() => classifyMedia(props.listing.media).nonHero);

const galleryCountLabel = computed(() => {
  const count = nonHero.value.length;
  return `${count} ${count === 1 ? 'photo' : 'photos'}`;
});
</script>

<template>
  <div>
    <SiteHeader />

    <main class="wrap">
      <section class="intro rise">
        <button type="button" class="back-link" @click="emit('back')">
          ← All listings
        </button>
        <p class="eyebrow">Listing preview</p>
        <h1>{{ listing.title }}</h1>
      </section>

      <section
        v-if="hero"
        class="hero rise"
        style="animation-delay: 0.06s"
        aria-label="Featured listing photo"
      >
        <img class="hero__img" alt="Featured listing photo" :src="hero.image_url" />
        <div class="hero__scrim"></div>
        <div class="hero__content hero__content--bottom">
          <div class="hero__bottom">
            <div class="hero__meta">
              <h2 class="hero__title">{{ listing.title }}</h2>
              <div class="hero__facts">
                <template v-for="(fact, index) in listing.facts" :key="fact">
                  <i v-if="index > 0"></i>
                  <span>{{ fact }}</span>
                </template>
              </div>
            </div>
            <DesignInteriorButton
              variant="hero"
              @click="emit('openMedia', listing.media, 'All photos')"
            />
          </div>
        </div>
      </section>

      <div class="gallery-head rise" style="animation-delay: 0.12s">
        <h2>Gallery</h2>
        <span class="count">{{ galleryCountLabel }}</span>
      </div>
      <section class="grid" aria-label="Listing gallery">
        <article
          v-for="(item, index) in nonHero"
          :key="item.image_url"
          class="card rise"
          :style="{ animationDelay: `${0.14 + index * 0.03}s` }"
        >
          <img
            class="card__img"
            loading="lazy"
            :alt="`Listing photo ${String(index + 1).padStart(2, '0')}`"
            :src="item.image_url"
          />
          <span class="card__index">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="card__overlay">
            <DesignInteriorButton
              variant="gallery"
              @click="
                emit('openMedia', [item], `Photo ${String(index + 1).padStart(2, '0')}`)
              "
            />
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
