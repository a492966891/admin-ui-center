<!-- app/components/charts/LineChart.vue -->
<template>
  <div class="chart-container">
    <v-chart class="chart" :option="chartOption" :autoresize="true" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  categories: {
    type: Array as () => string[],
    default: () => [],
  },
  visits: {
    type: Array as () => number[],
    default: () => [],
  },
  visitors: {
    type: Array as () => number[],
    default: () => [],
  },
});

const chartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['访问量', '独立访客'],
      textStyle: {
        color: 'var(--text-regular)',
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
        boundaryGap: false,
        data: props.categories,
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
        name: '访问量',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#5856d6',
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.1,
          color: '#5856d6',
        },
        emphasis: {
          focus: 'series',
        },
        data: props.visits,
      },
      {
        name: '独立访客',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#34c759',
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.1,
          color: '#34c759',
        },
        emphasis: {
          focus: 'series',
        },
        data: props.visitors,
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
