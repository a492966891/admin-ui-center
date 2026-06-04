<!-- app/components/common/ConfirmDialog.vue -->
<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :before-close="handleClose"
    align-center
    destroy-on-close
  >
    <div class="confirm-content flex-center">
      <el-icon class="warning-icon" :size="32" color="var(--warning-color)">
        <Warning />
      </el-icon>
      <div class="message">{{ message }}</div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">{{ cancelText }}</el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirm">
          {{ confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '提示',
  },
  message: {
    type: String,
    default: '此操作将永久修改该数据，是否继续？',
  },
  width: {
    type: String,
    default: '400px',
  },
  confirmText: {
    type: String,
    default: '确定',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
});

const emit = defineEmits(['confirm', 'cancel']);

const visible = ref(false);
const loading = ref(false);

const open = () => {
  visible.value = true;
};

const close = () => {
  visible.value = false;
  loading.value = false;
};

const startLoading = () => {
  loading.value = true;
};

const stopLoading = () => {
  loading.value = false;
};

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  visible.value = false;
  emit('cancel');
};

const handleClose = (done: () => void) => {
  emit('cancel');
  done();
};

defineExpose({
  open,
  close,
  startLoading,
  stopLoading,
});
</script>

<style scoped lang="scss">
.confirm-content {
  padding: 10px 0;
  gap: 16px;
  justify-content: flex-start;
  
  .message {
    font-size: 15px;
    color: var(--text-main);
    line-height: 1.5;
  }
}
</style>
