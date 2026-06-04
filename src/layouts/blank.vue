<!-- app/layouts/blank.vue -->
<template>
  <div class="blank-layout h-full w-full">
    <!-- iframe 加载页渲染 -->
    <iframe
      v-if="iframeUrl"
      :src="iframeUrl"
      class="iframe-view w-full h-full"
      frameborder="0"
    ></iframe>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const iframeUrl = computed(() => route.meta?.iframeUrl as string || '');
</script>

<style scoped>
.blank-layout {
  min-height: 100vh;
  background-color: var(--bg-color);
}
.iframe-view {
  border: none;
}
</style>
