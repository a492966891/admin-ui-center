// app/plugins/element-plus.ts
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

export default defineNuxtPlugin((nuxtApp) => {
  // 全量注册 Element Plus 所有图标，支持用组件名字作为字符串动态渲染
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    nuxtApp.vueApp.component(key, component);
  }
});
