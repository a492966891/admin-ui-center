<!-- app/components/layout/AppHeader.vue -->
<template>
  <div class="app-header flex-between">
    <!-- 左侧：折叠按钮与面包屑 -->
    <div class="header-left flex-center">
      <el-icon class="collapse-btn" :size="20" @click="toggleSidebar">
        <Expand v-if="settingsStore.sidebarCollapsed" />
        <Fold v-else />
      </el-icon>
      <app-breadcrumb v-if="settingsStore.showBreadcrumb" />
    </div>

    <!-- 右侧：全局搜索、消息、全屏、主题、用户菜单 -->
    <div class="header-right flex-center">
      <!-- 搜索 -->
      <div class="search-trigger flex-center" @click="showSearchDialog = true" title="全局搜索 (Ctrl+K)">
        <el-icon :size="18"><Search /></el-icon>
        <span class="search-text">搜索页面...</span>
        <span class="search-shortcut">⌘K</span>
      </div>

      <!-- 主题切换 -->
      <div class="action-item" @click="toggleTheme" title="切换主题">
        <el-icon :size="18">
          <Sunny v-if="settingsStore.theme === 'dark'" />
          <Moon v-else />
        </el-icon>
      </div>

      <!-- 全屏切换 -->
      <div class="action-item" @click="toggleFullscreen" title="全屏切换">
        <el-icon :size="18">
          <FullScreen />
        </el-icon>
      </div>

      <!-- 消息通知 -->
      <el-popover
        placement="bottom-end"
        :width="300"
        trigger="click"
        popper-class="notification-popper"
      >
        <template #reference>
          <div class="action-item" title="系统消息">
            <el-badge :value="msgCount" :max="99" :hidden="msgCount === 0">
              <el-icon :size="18"><Bell /></el-icon>
            </el-badge>
          </div>
        </template>
        <div class="notification-box">
          <div class="notification-header flex-between">
            <span>通知消息</span>
            <el-button link type="primary" @click="clearMessages">全部已读</el-button>
          </div>
          <el-scrollbar max-height="250px">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="msg-item"
            >
              <div class="msg-title">{{ msg.title }}</div>
              <div class="msg-time">{{ msg.time }}</div>
            </div>
            <div v-if="messages.length === 0" class="empty-msg flex-center">
              暂无新消息
            </div>
          </el-scrollbar>
        </div>
      </el-popover>

      <!-- 用户菜单 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-profile flex-center">
          <el-avatar :size="32" :src="avatarUrl" />
          <span class="user-name">{{ nickname }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>个人中心
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 全局搜索弹窗 (Ctrl+K) -->
    <el-dialog
      v-model="showSearchDialog"
      title="搜索菜单"
      width="500px"
      append-to-body
      destroy-on-close
      align-center
    >
      <el-input
        v-model="searchQuery"
        placeholder="输入关键字进行模糊搜索..."
        :prefix-icon="Search"
        clearable
        ref="searchInputRef"
        @input="handleSearch"
      />
      <el-scrollbar max-height="300px" class="search-results">
        <div
          v-for="item in searchResults"
          :key="item.path"
          class="search-item flex-between"
          @click="handleSelectSearchResult(item)"
        >
          <div class="item-left flex-center">
            <el-icon><component :is="item.meta?.icon || 'Document'" /></el-icon>
            <span>{{ item.meta?.title }}</span>
          </div>
          <span class="item-path">{{ item.path }}</span>
        </div>
        <div v-if="searchQuery && searchResults.length === 0" class="empty flex-center">
          未找到匹配路由
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '~/stores/modules/settings';
import { useUserStore } from '~/stores/modules/user';
import { useMenuStore } from '~/stores/modules/menu';
import AppBreadcrumb from './AppBreadcrumb.vue';
import {
  Fold,
  Expand,
  Search,
  Bell,
  Sunny,
  Moon,
  FullScreen,
  ArrowDown,
  User,
  SwitchButton,
} from '@element-plus/icons-vue';

const router = useRouter();
const settingsStore = settingsStoreHook(); // 或者是直接用 import 进来的 useSettingsStore
const userStore = useUserStore();
const menuStore = useMenuStore();

// 兼容 auto import 没有完全准备好的情况
function settingsStoreHook() {
  return useSettingsStore();
}

const showSearchDialog = ref(false);
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const searchInputRef = ref();

const nickname = computed(() => userStore.userInfo?.nickname || '管理员');
const avatarUrl = computed(() => userStore.userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');

// 折叠侧边栏
const toggleSidebar = () => {
  settingsStore.toggleSidebar();
};

// 切换亮暗主题
const toggleTheme = () => {
  const nextTheme = settingsStore.theme === 'light' ? 'dark' : 'light';
  settingsStore.setTheme(nextTheme);
};

// 全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

// 消息列表 Mock
const msgCount = ref(3);
const messages = ref([
  { id: 1, title: '用户 admin 新增了系统角色', time: '10分钟前' },
  { id: 2, title: '服务器 CPU 使用率超过 85%', time: '1小时前' },
  { id: 3, title: '新用户注册待审核', time: '3小时前' },
]);
const clearMessages = () => {
  messages.value = [];
  msgCount.value = 0;
};

// 用户菜单命令
const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.logout();
  } else if (command === 'profile') {
    router.push('/profile');
  }
};

// 全局平铺菜单树获取所有叶子路由
const flatMenus = (menus: any[], result: any[] = []) => {
  menus.forEach((item) => {
    if (!item.meta?.hidden) {
      if (!item.children || item.children.length === 0) {
        result.push(item);
      } else {
        flatMenus(item.children, result);
      }
    }
  });
  return result;
};

// 搜索逻辑
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }
  const allMenus = flatMenus(menuStore.menuList);
  searchResults.value = allMenus.filter(
    (item) =>
      (item.meta?.title && item.meta.title.includes(searchQuery.value)) ||
      (item.path && item.path.includes(searchQuery.value))
  );
};

// 选中搜索路由跳转
const handleSelectSearchResult = (item: any) => {
  showSearchDialog.value = false;
  searchQuery.value = '';
  searchResults.value = [];
  router.push(item.path);
};

// 监听键盘 Ctrl + K 弹出搜索框
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    showSearchDialog.value = true;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped lang="scss">
.app-header {
  height: var(--header-height);
  background: var(--header-bg);
  backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--header-border);
  padding: 0 24px;
  
  .collapse-btn {
    cursor: pointer;
    color: var(--text-main);
    transition: var(--transition-base);
    &:hover {
      color: var(--primary-color);
    }
  }

  .header-right {
    gap: 16px;

    .search-trigger {
      padding: 0 12px;
      height: 32px;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-small);
      font-size: 13px;
      color: var(--text-placeholder);
      cursor: pointer;
      gap: 8px;
      transition: var(--transition-base);

      &:hover {
        border-color: var(--primary-color-hover);
      }

      .search-shortcut {
        background: var(--card-bg-color);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        border: 1px solid var(--border-color);
      }
    }

    .action-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      color: var(--text-regular);
      transition: var(--transition-base);

      &:hover {
        background: var(--bg-color);
        color: var(--primary-color);
      }
    }

    .user-profile {
      cursor: pointer;
      gap: 8px;
      padding: 4px 8px;
      border-radius: var(--border-radius-small);
      transition: var(--transition-base);

      &:hover {
        background: var(--bg-color);
      }

      .user-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-main);
      }
    }
  }
}

.notification-box {
  .notification-header {
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 8px;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 14px;
    color: var(--text-main);
  }

  .msg-item {
    padding: 8px 4px;
    border-bottom: 1px dashed var(--border-color);
    &:last-child {
      border-bottom: none;
    }
    
    .msg-title {
      font-size: 13px;
      color: var(--text-regular);
    }
    
    .msg-time {
      font-size: 11px;
      color: var(--text-placeholder);
      margin-top: 4px;
    }
  }
  
  .empty-msg {
    padding: 20px 0;
    color: var(--text-placeholder);
    font-size: 13px;
  }
}

.search-results {
  margin-top: 12px;
  border-top: 1px solid var(--border-color);
  padding-top: 8px;

  .search-item {
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: var(--transition-base);

    &:hover {
      background: var(--bg-color);
      color: var(--primary-color);
    }

    .item-left {
      gap: 10px;
      font-size: 14px;
      color: var(--text-main);
    }

    .item-path {
      font-size: 12px;
      color: var(--text-placeholder);
    }
  }
  
  .empty {
    padding: 20px 0;
    color: var(--text-placeholder);
    font-size: 13px;
  }
}
</style>
