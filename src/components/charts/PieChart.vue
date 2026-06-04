<!-- app/components/charts/PieChart.vue -->
<template>
  <div class="chart-container">
    <v-chart class="chart" :option="chartOption" :autoresize="true" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Array as () => Array<{ value: number; name: string }>,
    default: () => [],
  },
});

const chartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      bottom: '0%',
      left: 'center',
      textStyle: {
        color: 'var(--text-regular)',
      },
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: 'var(--card-bg-color)',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: 'var(--text-main)',
          },
        },
        labelLine: {
          show: false,
        },
        color: ['#5856d6', '#34c759', '#ff9500', '#ff3b30', '#8e8e93'],
        data: props.data,
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
