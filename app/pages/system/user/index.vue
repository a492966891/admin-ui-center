<!-- app/pages/system/user/index.vue -->
<template>
  <page-container title="用户管理" subtitle="维护系统所有管理的账户凭证，配置角色关联及账户状态。">
    <!-- 主 ProTable 表格 -->
    <pro-table
      ref="tableRef"
      :columns="columns"
      :request-fn="fetchUserList"
      :search-schema="searchSchema"
      row-key="id"
      selection
      @selection-change="(val) => selectedRows = val"
    >
      <!-- 表格工具栏：操作按钮 -->
      <template #toolbar>
        <el-button
          v-permission="'system:user:add'"
          type="primary"
          :icon="Plus"
          @click="handleCreate"
        >
          新增用户
        </el-button>
        <el-button
          v-permission="'system:user:delete'"
          type="danger"
          :icon="Delete"
          :disabled="selectedRows.length === 0"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
      </template>

      <!-- 头像自定义插槽 -->
      <template #avatar="scope">
        <el-avatar :size="32" :src="scope.row.avatar" />
      </template>

      <!-- 状态自定义插槽 (Switch切换) -->
      <template #status="scope">
        <el-switch
          v-model="scope.row.status"
          :active-value="1"
          :inactive-value="0"
          :disabled="!hasPermission('system:user:edit')"
          @change="handleStatusChange(scope.row)"
        />
      </template>

      <!-- 操作栏自定义插槽 -->
      <template #actions="scope">
        <div class="table-actions">
          <el-button
            v-permission="'system:user:edit'"
            link
            type="primary"
            :icon="Edit"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-permission="'system:user:delete'"
            link
            type="danger"
            :icon="Delete"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </div>
      </template>
    </pro-table>

    <!-- 新增/编辑 对话框弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新增用户' : '编辑用户'"
      width="600px"
      destroy-on-close
      align-center
    >
      <pro-form
        ref="formRef"
        v-model="formModel"
        :schema="formSchema"
        :rules="formRules"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </page-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { request } from '~/utils/request';
import { usePermission } from '~/composables/usePermission';
import PageContainer from '~/components/common/PageContainer.vue';
import ProTable from '~/components/common/ProTable.vue';
import ProForm from '~/components/common/ProForm.vue';
import type { ColumnDef } from '~/components/common/ProTable.vue';
import type { FormSchema } from '~/components/common/ProForm.vue';
import { Plus, Delete, Edit } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
  title: '用户管理',
});

const { hasPermission } = usePermission();

const tableRef = ref();
const formRef = ref();
const dialogVisible = ref(false);
const dialogType = ref<'create' | 'edit'>('create');
const submitLoading = ref(false);
const selectedRows = ref<any[]>([]);

// ProTable 列定义
const columns: ColumnDef[] = [
  { prop: 'avatar', label: '头像', width: 80, slot: 'avatar' },
  { prop: 'username', label: '用户名', width: 120, sortable: true },
  { prop: 'nickname', label: '昵称', minWidth: 140 },
  { prop: 'phone', label: '手机号', width: 140 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, sortable: true },
  { prop: 'actions', label: '操作', width: 180, slot: 'actions', align: 'center' },
];

// ProTable 顶部搜索 Schema
const searchSchema = [
  { field: 'username', label: '用户名', type: 'input', placeholder: '请输入用户名/昵称' },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '启用', value: '1' },
      { label: '禁用', value: '0' },
    ],
  },
];

// 表单初始值模型
const formModel = ref<any>({
  id: undefined,
  username: '',
  nickname: '',
  password: '',
  phone: '',
  email: '',
  roles: [],
  status: 1,
});

// 新增/编辑 表单 Schema
const formSchema = ref<FormSchema[]>([
  { field: 'username', label: '用户名', type: 'input', span: 12 },
  { field: 'nickname', label: '昵称', type: 'input', span: 12 },
  { field: 'password', label: '登录密码', type: 'password', span: 12, placeholder: '不修改密码请留空' },
  { field: 'phone', label: '手机号码', type: 'input', span: 12 },
  { field: 'email', label: '电子邮箱', type: 'input', span: 12 },
  {
    field: 'roles',
    label: '分配角色',
    type: 'select',
    span: 12,
    options: [
      { label: '超级管理员', value: 'admin' },
      { label: '测试角色', value: 'editor' },
      { label: '普通用户', value: 'user' },
    ],
  },
  { field: 'status', label: '账号状态', type: 'switch', span: 12 },
]);

// 表单校验规则
const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
};

// 获取表格数据的请求包装
const fetchUserList = async (params: any) => {
  const res = await request.get('/mock/system/users', params);
  return {
    list: res.data.list,
    total: res.data.total,
  };
};

// 创建弹窗
const handleCreate = () => {
  dialogType.value = 'create';
  formModel.value = {
    id: undefined,
    username: '',
    nickname: '',
    password: '',
    phone: '',
    email: '',
    roles: ['user'],
    status: 1,
  };
  // 可选更新 schema
  formSchema.value.find(f => f.field === 'password')!.placeholder = '请输入登录密码';
  dialogVisible.value = true;
};

// 编辑弹窗
const handleEdit = (row: any) => {
  dialogType.value = 'edit';
  formModel.value = { ...row, password: '' };
  formSchema.value.find(f => f.field === 'password')!.placeholder = '不修改密码请留空';
  dialogVisible.value = true;
};

// 状态 Switch 切换
const handleStatusChange = async (row: any) => {
  if (!row || row.id === undefined) {
    return;
  }
  try {
    const text = row.status === 1 ? '启用' : '禁用';
    // 模拟接口请求
    await request.put(`/mock/system/user/${row.id}/status`, { status: row.status });
    ElMessage.success(`用户 "${row.username}" 已${text}`);
  } catch (err) {
    row.status = row.status === 1 ? 0 : 1; // 恢复
  }
};

// 提交保存
const handleSubmit = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (valid) {
    submitLoading.value = true;
    try {
      if (dialogType.value === 'create') {
        await request.post('/mock/system/user', formModel.value);
        ElMessage.success('用户新增成功');
      } else {
        await request.put(`/mock/system/user/${formModel.value.id}`, formModel.value);
        ElMessage.success('用户修改成功');
      }
      dialogVisible.value = false;
      tableRef.value.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      submitLoading.value = false;
    }
  }
};

// 单个删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`此操作将永久删除用户 "${row.username}"，是否继续？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await request.del(`/mock/system/user/${row.id}`);
    ElMessage.success('删除成功');
    tableRef.value.refresh();
  }).catch(() => {});
};

// 批量删除
const handleBatchDelete = () => {
  const ids = selectedRows.value.map(row => row.id);
  ElMessageBox.confirm(`此操作将永久删除已选的 ${ids.length} 个用户，是否继续？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await request.post('/mock/system/user/batch-delete', { ids });
    ElMessage.success('批量删除成功');
    tableRef.value.refresh();
  }).catch(() => {});
};
</script>

<style scoped>
.table-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
