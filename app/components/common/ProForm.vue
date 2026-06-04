<!-- app/components/common/ProForm.vue -->
<template>
  <el-form
    ref="formRef"
    :model="model"
    :rules="rules"
    :label-width="labelWidth"
    class="pro-form"
    @submit.prevent
  >
    <el-row :gutter="20">
      <el-col
        v-for="item in schema"
        :key="item.field"
        :span="item.span || 24"
      >
        <el-form-item :label="item.label" :prop="item.field">
          <!-- 普通输入框 -->
          <el-input
            v-if="item.type === 'input'"
            v-model="model[item.field]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled"
            clearable
          />
          
          <!-- 密码框 -->
          <el-input
            v-else-if="item.type === 'password'"
            v-model="model[item.field]"
            type="password"
            show-password
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled"
          />

          <!-- 下拉选择框 -->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="model[item.field]"
            :placeholder="item.placeholder || `请选择${item.label}`"
            :disabled="item.disabled"
            class="w-full"
            clearable
          >
            <el-option
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>

          <!-- 开关 -->
          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="model[item.field]"
            :disabled="item.disabled"
          />

          <!-- 单选框组 -->
          <el-radio-group
            v-else-if="item.type === 'radio'"
            v-model="model[item.field]"
            :disabled="item.disabled"
          >
            <el-radio
              v-for="opt in item.options"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </el-radio>
          </el-radio-group>

          <!-- 日期选择器 -->
          <el-date-picker
            v-else-if="item.type === 'date'"
            v-model="model[item.field]"
            type="date"
            :placeholder="item.placeholder || '选择日期'"
            :disabled="item.disabled"
            class="w-full"
            value-format="YYYY-MM-DD"
          />
          
          <!-- 自定义插槽 -->
          <slot
            v-else-if="item.type === 'slot'"
            :name="item.field"
            :row="item"
          ></slot>
        </el-form-item>
      </el-col>
    </el-row>
    <slot name="footer" :form-ref="formRef"></slot>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { FormInstance } from 'element-plus';

export interface FormSchema {
  field: string;
  label: string;
  type: 'input' | 'password' | 'select' | 'switch' | 'radio' | 'date' | 'slot';
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  disabled?: boolean;
  span?: number;
}

const props = defineProps({
  schema: {
    type: Array as () => FormSchema[],
    required: true,
  },
  modelValue: {
    type: Object,
    required: true,
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  labelWidth: {
    type: String,
    default: '100px',
  },
});

const emit = defineEmits(['update:modelValue']);

const formRef = ref<FormInstance>();
const model = ref<any>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (newVal) => {
    model.value = { ...newVal };
  },
  { deep: true }
);

watch(
  model,
  (newVal) => {
    emit('update:modelValue', newVal);
  },
  { deep: true }
);

// 表单验证方法
const validate = () => {
  return formRef.value?.validate();
};

// 表单重置方法
const resetFields = () => {
  formRef.value?.resetFields();
};

defineExpose({
  validate,
  resetFields,
  formRef,
});
</script>

<style scoped>
.w-full {
  width: 100% !important;
}
</style>
