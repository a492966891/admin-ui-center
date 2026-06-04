// app/plugins/echarts.ts
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

export default defineNuxtPlugin((nuxtApp) => {
  // 注册 ECharts 组件
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

  // 全局挂载 VChart 组件，可在组件中直接使用 <v-chart>
  nuxtApp.vueApp.component('v-chart', VChart);
});
