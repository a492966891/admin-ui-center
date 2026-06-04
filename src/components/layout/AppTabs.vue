<!-- app/components/layout/AppTabs.vue -->
<template>
  <div class="app-tabs-container flex-between" v-if="settingsStore.showTabs">
    <el-scrollbar class="tabs-scrollbar" ref="scrollbarRef">
      <transition-group name="tabs" tag="div" class="tabs-wrapper flex-center">
        <div v-for="tab in visitedViews" :key="tab.path" class="tab-item flex-center"
          :class="{ active: isActive(tab.path) }" @click="handleTabClick(tab)"
          @contextmenu.prevent="openContextMenu(tab, $event)">
          <span class="tab-dot" v-if="isActive(tab.path)"></span>
          <span class="tab-title">{{ tab.title }}</span>
          <el-icon v-if="!tab.affix" class="close-icon" @click.stop="handleCloseTab(tab.path)">
            <Close />
          </el-icon>
        </div>
      </transition-group>
    </el-scrollbar>

    <!-- 右键菜单 -->
    <transition name="fade">
      <ul v-show="contextMenuVisible" :style="{ left: menuLeft + 'px', top: menuTop + 'px' }" class="context-menu">
        <li @click="refreshSelectedTab" class="flex-center">
          <el-icon>
            <Refresh />
          </el-icon> 刷新当前
        </li>
        <li v-if="selectedTab && !selectedTab.affix" @click="closeSelectedTab" class="flex-center">
          <el-icon>
            <Close />
          </el-icon> 关闭当前
        </li>
        <li @click="closeOthers" class="flex-center">
          <el-icon>
            <Remove />
          </el-icon> 关闭其他
        </li>
        <li @click="closeAll" class="flex-center">
          <el-icon>
            <CircleClose />
          </el-icon> 关闭全部
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTabsStore, type TabItem } from '~/stores/modules/tabs';
import { useSettingsStore } from '~/stores/modules/settings';
import { Close, Refresh, Remove, CircleClose } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();
const settingsStore = useSettingsStore();

const scrollbarRef = ref();
const contextMenuVisible = ref(false);
const menuLeft = ref(0);
const menuTop = ref(0);
const selectedTab = ref<TabItem | null>(null);

const visitedViews = computed(() => tabsStore.visitedViews);

const isActive = (path: string) => {
  return route.path === path;
};

// 监听路由改变，加入 Tab
watch(
  () => route.path,
  () => {
    tabsStore.addTab(route);
  },
  { immediate: true }
);

// 监听点击外部关闭右键菜单
watch(contextMenuVisible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeContextMenu);
  } else {
    document.body.removeEventListener('click', closeContextMenu);
  }
});

onMounted(() => {
  // 默认插入首页/仪表盘作为固定 Tab
  tabsStore.addTab({
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: '仪表盘', affix: true },
  });
});

onBeforeUnmount(() => {
  document.body.removeEventListener('click', closeContextMenu);
});

const handleTabClick = (tab: TabItem) => {
  router.push(tab.path);
};

const handleCloseTab = (path: string) => {
  // 如果关闭的是当前激活的路由
  if (isActive(path)) {
    const activeIndex = visitedViews.value.findIndex((v) => v.path === path);
    tabsStore.removeTab(path);
    // 跳转到前一个或后一个标签
    const nextTab = visitedViews.value[activeIndex] || visitedViews.value[activeIndex - 1];
    if (nextTab) {
      router.push(nextTab.path);
    } else {
      router.push('/dashboard');
    }
  } else {
    tabsStore.removeTab(path);
  }
};

// 打开右键菜单
const openContextMenu = (tab: TabItem, e: MouseEvent) => {
  selectedTab.value = tab;
  menuLeft.value = e.clientX;
  menuTop.value = e.clientY;
  contextMenuVisible.value = true;
};

const closeContextMenu = () => {
  contextMenuVisible.value = false;
};

// 刷新所选标签
const refreshSelectedTab = () => {
  if (selectedTab.value) {
    const { path } = selectedTab.value;
    router.replace({ path: '/redirect' + path }); // 如果有内置中转路由
    // 简易刷新：直接 reload
    if (isActive(path)) {
      window.location.reload();
    }
  }
};

// 关闭当前
const closeSelectedTab = () => {
  if (selectedTab.value) {
    handleCloseTab(selectedTab.value.path);
  }
};

// 关闭其他
const closeOthers = () => {
  if (selectedTab.value) {
    tabsStore.removeOtherTabs(selectedTab.value.path);
    if (!isActive(selectedTab.value.path)) {
      router.push(selectedTab.value.path);
    }
  }
};

// 关闭所有
const closeAll = () => {
  tabsStore.removeAllTabs();
  router.push('/dashboard');
};
</script>

<style scoped lang="scss">
.app-tabs-container {
  height: var(--tabs-height);
  background: var(--card-bg-color);
  border-bottom: 1px solid var(--border-color);
  padding: 0 16px;
  position: relative;

  .tabs-scrollbar {
    width: 100%;

    .tabs-wrapper {
      height: var(--tabs-height);
      gap: 6px;
      justify-content: flex-start;
      position: relative;
    }
  }

  .tab-item {
    height: 28px;
    padding: 0 10px;
    font-size: 13px;
    color: var(--text-regular);
    border: 1px solid var(--border-color);
    background: var(--bg-color);
    border-radius: 6px;
    cursor: pointer;
    gap: 4px;
    transition: background-color var(--transition-base), border-color var(--transition-base), color var(--transition-base), box-shadow var(--transition-base);

    &:hover {
      border-color: var(--primary-color-hover);
      color: var(--primary-color-hover);
    }

    &.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: #ffffff;
      box-shadow: 0 4px 10px -2px rgba(88, 86, 214, 0.4);

      .tab-dot {
        width: 6px;
        height: 6px;
        background: #ffffff;
        border-radius: 50%;
      }

      .close-icon {
        color: #ffffff;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }

    .close-icon {
      font-size: 11px;
      border-radius: 50%;
      padding: 1px;
      transition: background-color var(--transition-base);

      &:hover {
        background-color: var(--border-color);
      }
    }
  }
}

.context-menu {
  position: fixed;
  background: var(--card-bg-color);
  border: 1px solid var(--border-color);
  box-shadow: var(--box-shadow-popover);
  border-radius: 8px;
  z-index: 1000;
  padding: 4px 0;
  list-style: none;

  li {
    padding: 8px 16px;
    font-size: 13px;
    color: var(--text-regular);
    cursor: pointer;
    gap: 8px;
    justify-content: flex-start;

    &:hover {
      background: var(--bg-color);
      color: var(--primary-color);
    }
  }
}

/* Tabs 列表过滤过渡动效 */
.tabs-enter-active,
.tabs-leave-active {
  transition: opacity 0.15s ease-out;
}

.tabs-enter-from,
.tabs-leave-to {
  opacity: 0;
}
</style>
