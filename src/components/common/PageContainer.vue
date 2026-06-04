<!-- app/components/common/PageContainer.vue -->
<template>
  <div class="page-container">
    <!-- 头部信息 -->
    <div v-if="title || $slots.extra" class="page-header flex-between">
      <div class="header-left">
        <h1 class="page-title" v-if="title">{{ title }}</h1>
        <p class="page-subtitle" v-if="subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-right">
        <slot name="extra"></slot>
      </div>
    </div>
    
    <!-- 主体卡片内容 -->
    <div class="page-body">
      <el-card shadow="never" class="body-card">
        <slot></slot>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
});
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: calc(100vh - var(--header-height) - var(--tabs-height) - 40px);

  .page-header {
    background: var(--card-bg-color);
    padding: 16px 24px;
    border-radius: var(--border-radius-base);
    border: 1px solid var(--border-color);
    box-shadow: var(--box-shadow-card);
    
    .page-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-main);
    }
    
    .page-subtitle {
      margin: 4px 0 0 0;
      font-size: 13px;
      color: var(--text-placeholder);
    }
  }

  .page-body {
    flex: 1;
    
    .body-card {
      height: 100%;
      border-radius: var(--border-radius-base);
    }
  }
}
</style>
