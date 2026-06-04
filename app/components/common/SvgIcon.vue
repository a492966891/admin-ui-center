<!-- app/components/common/SvgIcon.vue -->
<template>
  <el-icon :size="size" :color="color" class="svg-icon">
    <component :is="name" v-if="isElIcon" />
    <span v-else class="custom-icon">{{ name }}</span>
  </el-icon>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
});

// 判断是否是 Element Plus 图标 (通常以大写字母开头，并且是全局注册过的组件名)
const isElIcon = computed(() => {
  if (!props.name) return false;
  // 首字母大写，说明是 Element Plus 图标
  return /^[A-Z]/.test(props.name);
});
</script>

<style scoped>
.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.custom-icon {
  font-size: 12px;
}
</style>
