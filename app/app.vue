<!-- app/app.vue -->
<template>
  <el-config-provider :locale="zhCn">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { useSettingsStore } from '~/stores/modules/settings';

const settingsStore = useSettingsStore();

onMounted(() => {
  // 初始化渲染本地缓存的主题色与暗色模式状态
  settingsStore.setTheme(settingsStore.theme);
  settingsStore.setPrimaryColor(settingsStore.primaryColor);
});
</script>

<style>
/* 全局基础渐变转场微效 */
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease-out;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
