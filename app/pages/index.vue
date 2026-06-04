<!-- app/pages/index.vue -->
<template>
  <div></div>
</template>

<script setup lang="ts">
// 首页默认直接重定向到仪表盘
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/dashboard');
    },
  ],
});
</script>
