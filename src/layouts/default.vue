<!-- app/layouts/default.vue -->
<template>
  <div class="default-layout-wrapper">
    <!-- 侧边栏 -->
    <app-sidebar />

    <!-- 右侧主干区域 -->
    <div
      class="main-container flex-column"
      :class="{ collapsed: isCollapsed }"
    >
      <!-- 头部 -->
      <app-header />

      <!-- 标签页 -->
      <app-tabs />

      <!-- 页面主体内容 (加入转场动效) -->
      <div class="main-content">
        <slot />
      </div>

      <!-- 页脚 -->
      <app-footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '~/stores/modules/settings';
import AppSidebar from '~/components/layout/AppSidebar.vue';
import AppHeader from '~/components/layout/AppHeader.vue';
import AppTabs from '~/components/layout/AppTabs.vue';
import AppFooter from '~/components/layout/AppFooter.vue';

const settingsStore = useSettingsStore();
const isCollapsed = computed(() => settingsStore.sidebarCollapsed);
</script>

<style scoped lang="scss">
.default-layout-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
  position: relative;
}

.main-container {
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);

  .main-content {
    flex: 1;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
