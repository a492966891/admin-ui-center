<!-- app/components/charts/BarChart.vue -->
<template>
  <div class="chart-container">
    <v-chart class="chart" :option="chartOption" :autoresize="true" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  months: {
    type: Array as () => string[],
    default: () => [],
  },
  revenue: {
    type: Array as () => number[],
    default: () => [],
  },
});

const chartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: props.months,
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: 'var(--border-color)',
          },
        },
        axisLabel: {
          color: 'var(--text-regular)',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: 'var(--border-color)',
          },
        },
        axisLabel: {
          color: 'var(--text-regular)',
        },
        splitLine: {
          lineStyle: {
            color: 'var(--border-color)',
          },
        },
      },
    ],
    series: [
      {
        name: '销售额',
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: '#ff9500', // 使用极佳橙色
          borderRadius: [6, 6, 0, 0], // 圆角柱体
        },
        data: props.revenue,
      },
    ],
  };
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 350px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
