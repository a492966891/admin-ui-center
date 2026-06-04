<!-- app/pages/system/menu/index.vue -->
<template>
  <page-container title="菜单管理" subtitle="配置及维护系统侧边栏、内部功能路径、按钮级权限标识等菜单树。">
    <!-- 工具栏 -->
    <div class="table-toolbar mb-4 flex-between">
      <div class="toolbar-left">
        <el-button
          v-permission="'system:menu:add'"
          type="primary"
          :icon="Plus"
          @click="handleCreate(null)"
        >
          新增根菜单
        </el-button>
        <el-button
          :icon="Sort"
          @click="toggleExpandAll"
        >
          展开/折叠
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-button circle :icon="Refresh" @click="fetchMenuList" />
      </div>
    </div>

    <!-- 树状表格 -->
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :default-expand-all="isExpandAll"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column prop="meta.title" label="菜单名称" min-width="160" header-align="center" />
      <el-table-column prop="meta.icon" label="图标" align="center" width="80">
        <template #default="scope">
          <el-icon v-if="scope.row.meta?.icon" :size="16">
            <component :is="scope.row.meta.icon" />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="meta.sort" label="排序" align="center" width="80" />
      <el-table-column prop="component" label="组件路径" min-width="180" align="center">
        <template #default="scope">
          <span>{{ scope.row.component || '—' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="meta.permissions" label="权限字符" min-width="180" align="center">
        <template #default="scope">
          <span v-if="scope.row.meta?.permissions && scope.row.meta.permissions.length > 0">
            <el-tag
              v-for="p in scope.row.meta.permissions"
              :key="p"
              size="small"
              class="mr-1"
            >
              {{ p }}
            </el-tag>
          </span>
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由路径" min-width="150" align="center" />
      <el-table-column label="隐藏" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.meta?.hidden ? 'danger' : 'success'" size="small">
            {{ scope.row.meta?.hidden ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="外链" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.meta?.isExternal ? 'warning' : 'info'" size="small">
            {{ scope.row.meta?.isExternal ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" fixed="right">
        <template #default="scope">
          <el-button
            v-permission="'system:menu:add'"
            link
            type="primary"
            :icon="Plus"
            @click="handleCreate(scope.row)"
          >
            新增子项
          </el-button>
          <el-button
            v-permission="'system:menu:edit'"
            link
            type="primary"
            :icon="Edit"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-permission="'system:menu:delete'"
            link
            type="danger"
            :icon="Delete"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新增菜单' : '编辑菜单'"
      width="600px"
      align-center
    >
      <el-form :model="menuForm" :rules="menuRules" ref="menuFormRef" label-width="100px">
        <el-form-item label="上级菜单" v-if="parentMenu">
          <el-input :value="parentMenu.meta?.title" disabled />
        </el-form-item>
        
        <el-form-item label="菜单标题" prop="title">
          <el-input v-model="menuForm.title" placeholder="如：用户管理" />
        </el-form-item>

        <el-form-item label="菜单路径" prop="path">
          <el-input v-model="menuForm.path" placeholder="如：/system/user" />
        </el-form-item>

        <el-form-item label="组件路径" prop="component">
          <el-input v-model="menuForm.component" placeholder="如：system/user/index" />
        </el-form-item>

        <el-form-item label="菜单图标" prop="icon">
          <icon-select v-model="menuForm.icon" />
        </el-form-item>

        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="menuForm.sort" :min="1" />
        </el-form-item>

        <el-form-item label="权限标识">
          <el-input v-model="menuForm.permissionStr" placeholder="如：system:user:list，多个以逗号隔开" />
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="是否隐藏">
              <el-switch v-model="menuForm.hidden" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否外链">
              <el-switch v-model="menuForm.isExternal" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="submitMenuForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </page-container>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue';
import { request } from '~/utils/request';
import PageContainer from '~/components/common/PageContainer.vue';
import IconSelect from '~/components/common/IconSelect.vue';
import { Plus, Edit, Delete, Sort, Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
  title: '菜单管理',
});

const menuList = ref<any[]>([]);
const loading = ref(false);
const refreshTable = ref(true);
const isExpandAll = ref(true);
const dialogVisible = ref(false);
const dialogType = ref<'create' | 'edit'>('create');
const submitLoading = ref(false);

const menuFormRef = ref();
const parentMenu = ref<any>(null);

const menuForm = reactive({
  id: undefined,
  parentId: null as number | null,
  title: '',
  path: '',
  component: '',
  icon: '',
  sort: 1,
  permissionStr: '',
  hidden: false,
  isExternal: false,
});

const menuRules = {
  title: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
};

const fetchMenuList = async () => {
  loading.value = true;
  try {
    const res = await request.get('/mock/menu');
    menuList.value = res.data || [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const toggleExpandAll = () => {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
};

const handleCreate = (parent: any) => {
  dialogType.value = 'create';
  parentMenu.value = parent;
  
  menuForm.id = undefined;
  menuForm.parentId = parent ? parent.id : null;
  menuForm.title = '';
  menuForm.path = '';
  menuForm.component = '';
  menuForm.icon = '';
  menuForm.sort = 10;
  menuForm.permissionStr = '';
  menuForm.hidden = false;
  menuForm.isExternal = false;
  
  dialogVisible.value = true;
};

const handleEdit = (row: any) => {
  dialogType.value = 'edit';
  parentMenu.value = null; // 为方便这里暂时隐藏上级选择
  
  menuForm.id = row.id;
  menuForm.parentId = row.parentId;
  menuForm.title = row.meta?.title || '';
  menuForm.path = row.path || '';
  menuForm.component = row.component || '';
  menuForm.icon = row.meta?.icon || '';
  menuForm.sort = row.meta?.sort || 1;
  menuForm.permissionStr = (row.meta?.permissions || []).join(',');
  menuForm.hidden = !!row.meta?.hidden;
  menuForm.isExternal = !!row.meta?.isExternal;
  
  dialogVisible.value = true;
};

const submitMenuForm = async () => {
  if (!menuFormRef.value) return;
  await menuFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitLoading.value = true;
      try {
        const permissions = menuForm.permissionStr ? menuForm.permissionStr.split(',') : [];
        const requestData = {
          id: menuForm.id,
          parentId: menuForm.parentId,
          name: menuForm.title,
          path: menuForm.path,
          component: menuForm.component,
          meta: {
            title: menuForm.title,
            icon: menuForm.icon,
            sort: menuForm.sort,
            permissions,
            hidden: menuForm.hidden,
            isExternal: menuForm.isExternal,
            keepAlive: true,
            isIframe: false,
          },
        };

        if (dialogType.value === 'create') {
          await request.post('/mock/system/menu', requestData);
          ElMessage.success('菜单新增成功 (Mock)');
        } else {
          await request.put(`/mock/system/menu/${menuForm.id}`, requestData);
          ElMessage.success('菜单编辑成功 (Mock)');
        }
        dialogVisible.value = false;
        fetchMenuList();
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定删除菜单 "${row.meta?.title}" 及其所有子项吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await request.del(`/mock/system/menu/${row.id}`);
    ElMessage.success('菜单删除成功 (Mock)');
    fetchMenuList();
  }).catch(() => {});
};

onMounted(() => {
  fetchMenuList();
});
</script>

<style scoped>
.table-toolbar {
  margin-bottom: 16px;
}
.mr-1 {
  margin-right: 4px;
}
</style>
