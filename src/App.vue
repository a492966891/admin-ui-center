<template>
  <el-config-provider :locale="zhCn">
    <component :is="layoutComponent">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </component>
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { useSettingsStore } from '~/stores/modules/settings';

// 引入三种常用的布局
import DefaultLayout from '@/layouts/default.vue';
import AuthLayout from '@/layouts/auth.vue';
import BlankLayout from '@/layouts/blank.vue';

const route = useRoute();
const settingsStore = useSettingsStore();

// 动态布局解析器
const layoutComponent = computed(() => {
  const layout = route.meta?.layout || 'default';
  if (layout === 'auth') return AuthLayout;
  if (layout === 'blank') return BlankLayout;
  return DefaultLayout;
});

onMounted(() => {
  // 初始化渲染本地缓存的主题色与暗色模式状态
  settingsStore.setTheme(settingsStore.theme);
  settingsStore.setPrimaryColor(settingsStore.primaryColor);
});
</script>

<style lang="scss">
/* 全局基础渐变转场微效 */
.page-enter-active,
.page-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
