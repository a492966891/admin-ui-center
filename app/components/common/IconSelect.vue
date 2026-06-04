<!-- app/components/common/IconSelect.vue -->
<template>
  <el-popover
    v-model:visible="visible"
    trigger="click"
    placement="bottom-start"
    :width="400"
    popper-class="icon-select-popover"
    :fallback-placements="['bottom', 'top', 'right', 'left']"
  >
    <template #reference>
      <el-input
        :model-value="modelValue"
        placeholder="点击选择菜单图标"
        readonly
        clearable
        @clear="handleClear"
        class="icon-select-input"
      >
        <template #prefix>
          <el-icon v-if="modelValue" class="selected-icon-preview">
            <component :is="modelValue" />
          </el-icon>
          <el-icon v-else class="selected-icon-preview-empty">
            <Search />
          </el-icon>
        </template>
      </el-input>
    </template>

    <div class="icon-select-container">
      <el-input
        v-model="searchText"
        placeholder="搜索图标名称"
        clearable
        size="default"
        class="icon-search-input"
        :prefix-icon="Search"
      />
      
      <el-scrollbar max-height="250px" class="icon-scrollbar">
        <div class="icon-grid">
          <div
            v-for="icon in filteredIcons"
            :key="icon"
            class="icon-item"
            :class="{ active: modelValue === icon }"
            @click="selectIcon(icon)"
            :title="icon"
          >
            <div class="icon-wrapper">
              <el-icon :size="20">
                <component :is="icon" />
              </el-icon>
            </div>
            <span class="icon-name">{{ icon }}</span>
          </div>
          <div v-if="filteredIcons.length === 0" class="no-data">
            未找到匹配的图标
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search } from '@element-plus/icons-vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const visible = ref(false);
const searchText = ref('');

// 获取所有的图标名称列表
const allIcons = Object.keys(ElementPlusIconsVue);

// 过滤图标
const filteredIcons = computed(() => {
  if (!searchText.value) return allIcons;
  const keyword = searchText.value.toLowerCase();
  return allIcons.filter((name) => name.toLowerCase().includes(keyword));
});

const selectIcon = (icon: string) => {
  emit('update:modelValue', icon);
  visible.value = false;
};

const handleClear = () => {
  emit('update:modelValue', '');
  visible.value = false;
};
</script>

<style scoped lang="scss">
.icon-select-input {
  cursor: pointer;
  :deep(.el-input__inner) {
    cursor: pointer;
  }
}

.selected-icon-preview {
  color: var(--el-color-primary);
  font-size: 16px;
}

.selected-icon-preview-empty {
  color: var(--el-text-color-placeholder);
}

.icon-select-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px;
}

.icon-search-input {
  width: 100%;
}

.icon-scrollbar {
  margin: 0 -4px;
  padding: 0 4px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 2px 0;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 4px;
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: var(--el-fill-color-blank);
  user-select: none;

  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary-light-7);
    background-color: var(--el-color-primary-light-9);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.12);

    .icon-wrapper {
      transform: scale(1.15);
    }
  }

  &.active {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    font-weight: 600;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    transition: transform 0.25s ease;
  }

  .icon-name {
    font-size: 11px;
    text-align: center;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    width: 100%;
    padding: 0 2px;
  }
}

.no-data {
  grid-column: span 4;
  text-align: center;
  padding: 24px 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
</style>
