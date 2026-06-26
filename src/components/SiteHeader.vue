<script setup lang="ts">
defineEmits<{
  openAll: [];
}>();
</script>

<template>
  <header class="topbar">
    <div class="topbar__inner">
      <div class="brand">
        <span class="brand__mark" aria-hidden="true">
          <img src="/reimaginehome-logo.png" alt="" width="34" height="34" />
        </span>
        <span class="brand__name">ReimagineHome</span>
      </div>
      <span class="pill pill--sandbox">Widget Sandbox</span>
      <span class="topbar__spacer"></span>
      <button type="button" class="btn btn--primary btn--sm" @click="$emit('openAll')">
        <svg class="btn__icon" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 7h16M4 12h16M4 17h10"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        Arrange all interiors
      </button>
    </div>
  </header>
</template>
