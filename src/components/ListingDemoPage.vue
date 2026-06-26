<script setup lang="ts">
import { computed } from 'vue';
import ArrangeIcon from './ArrangeIcon.vue';
import SiteHeader from './SiteHeader.vue';
import {
  ARRANGE_LABEL,
  LISTING,
  classifyMedia,
  type ListingMediaItem,
} from '../widgetConfig';
import '../sandbox.css';

const emit = defineEmits<{
  openAll: [];
  openMedia: [media: ListingMediaItem[], label: string];
}>();

const { hero, nonHero } = classifyMedia();

const galleryCountLabel = computed(() => {
  const count = nonHero.length;
  return `${count} ${count === 1 ? 'photo' : 'photos'}`;
});
</script>

<template>
  <div>
    <SiteHeader @open-all="emit('openAll')" />

    <main class="wrap">
      <section class="intro rise">
        <p class="eyebrow">Listing preview</p>
        <h1>{{ LISTING.title }}</h1>
        <p>
          A live sandbox for the ReimagineHome widget inside a property listing.
          Select <strong>Arrange Interiors</strong> on the featured photo or any
          gallery image to launch the redesign experience exactly as a buyer would
          see it.
        </p>
      </section>

      <section
        v-if="hero"
        class="hero rise"
        style="animation-delay: 0.06s"
        aria-label="Featured listing photo"
      >
        <img class="hero__img" alt="Featured listing photo" :src="hero.image_url" />
        <div class="hero__scrim"></div>
        <div class="hero__content">
          <span class="badge"><span class="dot"></span>Featured</span>
          <div class="hero__bottom">
            <div class="hero__meta">
              <h2 class="hero__title">{{ LISTING.title }}</h2>
              <div class="hero__facts">
                <template v-for="(fact, index) in LISTING.facts" :key="fact">
                  <i v-if="index > 0"></i>
                  <span>{{ fact }}</span>
                </template>
              </div>
            </div>
            <button
              type="button"
              class="btn btn--primary btn--md"
              @click="emit('openMedia', [hero], 'Featured')"
            >
              <ArrangeIcon />
              {{ ARRANGE_LABEL }}
            </button>
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
            <button
              type="button"
              class="btn btn--primary btn--sm"
              @click="
                emit('openMedia', [item], `Photo ${String(index + 1).padStart(2, '0')}`)
              "
            >
              <ArrangeIcon />
              {{ ARRANGE_LABEL }}
            </button>
          </div>
        </article>
      </section>

      <footer class="foot">
        <span>Sandbox environment — not a production listing.</span>
      </footer>
    </main>
  </div>
</template>
