<!-- app/error.vue -->
<template>
  <div class="error-page flex-center">
    <div class="error-content flex-center">
      <h1 class="error-code">{{ error?.statusCode || 404 }}</h1>
      <p class="error-msg">{{ errorMsg }}</p>
      <div class="error-actions">
        <el-button type="primary" size="large" @click="handleGoBack">
          返回上一页
        </el-button>
        <el-button size="large" @click="handleGoHome">
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  error: {
    type: Object as () => { statusCode: number; message: string },
    default: () => ({ statusCode: 404, message: '页面找不到' }),
  },
});

const errorMsg = computed(() => {
  if (props.error?.statusCode === 404) {
    return '抱歉，您访问的页面不存在或已被移出。';
  }
  return props.error?.message || '抱歉，系统内部发生了预料之外的错误。';
});

const handleGoBack = () => {
  if (typeof window !== 'undefined') {
    window.history.back();
  }
};

const handleGoHome = () => {
  clearError({ redirect: '/dashboard' });
};
</script>

<style scoped lang="scss">
.error-page {
  width: 100vw;
  height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-main);
  overflow: hidden;
}

.error-content {
  flex-direction: column;
  text-align: center;
  gap: 16px;

  .error-code {
    font-size: 120px;
    font-weight: 800;
    color: var(--primary-color);
    margin: 0;
    line-height: 1;
    letter-spacing: -2px;
    text-shadow: 0 10px 30px rgba(88, 86, 214, 0.2);
  }

  .error-msg {
    font-size: 16px;
    color: var(--text-regular);
    margin: 0 0 20px 0;
  }

  .error-actions {
    display: flex;
    gap: 12px;
  }
}
</style>
