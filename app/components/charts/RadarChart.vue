<!-- app/components/charts/RadarChart.vue -->
<template>
  <div class="chart-container">
    <v-chart class="chart" :option="chartOption" :autoresize="true" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  indicators: {
    type: Array as () => Array<{ name: string; max: number }>,
    default: () => [],
  },
  values: {
    type: Array as () => number[],
    default: () => [],
  },
});

const chartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
    },
    radar: {
      indicator: props.indicators,
      axisName: {
        color: 'var(--text-regular)',
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(24, 24, 27, 0.02)', 'rgba(24, 24, 27, 0.05)'],
        },
      },
      splitLine: {
        lineStyle: {
          color: 'var(--border-color)',
        },
      },
    },
    series: [
      {
        name: '系统负载指标',
        type: 'radar',
        data: [
          {
            value: props.values,
            name: '资源指标',
            areaStyle: {
              color: 'rgba(88, 86, 214, 0.3)',
            },
            lineStyle: {
              color: '#5856d6',
            },
            itemStyle: {
              color: '#5856d6',
            },
          },
        ],
      },
    ],
  };
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
