import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setupRouterGuard } from './router/guard';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// 导入全局样式
import 'element-plus/theme-chalk/dark/css-vars.css';
import '@/assets/styles/global.scss';

// ECharts 注册
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart, RadarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';

// Element Plus 图标全量注册
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 1. 创建 Vue App 实例
const app = createApp(App);

// 2. 状态管理 Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// 3. 路由注册与全局守卫
app.use(router);
setupRouterGuard(router);

// 4. ECharts 初始化注册
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent,
]);
app.component('v-chart', VChart);

// 5. Element Plus 图标挂载
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 6. 自定义指令 v-permission
import { useUserStore } from '@/stores/modules/user';
app.directive('permission', {
  mounted(el, binding) {
    const { value } = binding;
    const userStore = useUserStore();
    const permissions = userStore.permissions || [];

    if (value) {
      let hasPermission = false;
      if (Array.isArray(value)) {
        hasPermission = value.some((perm) => permissions.includes(perm) || permissions.includes('*:*:*'));
      } else if (typeof value === 'string') {
        hasPermission = permissions.includes(value) || permissions.includes('*:*:*');
      }

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error('v-permission 指令必须绑定一个权限字符串或数组！例如 v-permission="\'system:user:add\'"');
    }
  },
});

// 7. 挂载
app.mount('#app');
