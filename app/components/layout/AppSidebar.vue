<!-- app/components/layout/AppSidebar.vue -->
<template>
  <div class="app-sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Logo 区 -->
    <div class="logo-container flex-center">
      <el-icon class="logo-icon" :size="28" color="var(--primary-color)">
        <Platform />
      </el-icon>
      <transition name="fade">
        <span v-show="!isCollapsed" class="logo-title" :title="appTitle">
          {{ appTitle }}
        </span>
      </transition>
    </div>

    <!-- 菜单滚动条 -->
    <el-scrollbar class="menu-scrollbar">
      <el-menu :default-active="activeMenu" :collapse="isCollapsed" :unique-opened="true" :collapse-transition="false"
        mode="vertical">
        <!-- 循环渲染菜单 -->
        <sidebar-item v-for="menu in sidebarMenus" :key="menu.path" :item="menu" :base-path="menu.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSettingsStore } from '~/stores/modules/settings';
import { useMenuStore } from '~/stores/modules/menu';
import SidebarItem from './SidebarItem.vue';
import { Platform } from '@element-plus/icons-vue';

const route = useRoute();
const settingsStore = useSettingsStore();
const menuStore = useMenuStore();

const runtimeConfig = useRuntimeConfig();
const appTitle = runtimeConfig.public.appTitle || '管理后台';

const isCollapsed = computed(() => settingsStore.sidebarCollapsed);
const sidebarMenus = computed(() => menuStore.sidebarMenus);

// 当前高亮的菜单项路径
const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta?.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});
</script>

<style scoped lang="scss">
.app-sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-base);
  z-index: 1001;
  position: fixed;
  left: 0;
  top: 0;

  &.collapsed {
    width: var(--sidebar-collapsed-width);
    
    .logo-container {
      padding: 0;
      justify-content: center;
    }
  }

  .logo-container {
    height: var(--header-height);
    padding: 0 20px;
    justify-content: flex-start;
    gap: 12px;
    border-bottom: 1px solid var(--sidebar-border);
    overflow: hidden;
    white-space: nowrap;

    .logo-title {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 1px;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .menu-scrollbar {
    flex: 1;
    overflow-x: hidden;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
