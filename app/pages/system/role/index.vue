<!-- app/pages/system/role/index.vue -->
<template>
  <page-container title="角色管理" subtitle="分配并管理系统中的安全角色，绑定对应的权限菜单节点。">
    <el-row :gutter="16">
      <!-- 左侧角色列表 -->
      <el-col :xs="24" :md="10" :lg="8" class="role-list-col">
        <el-card shadow="never">
          <template #header>
            <div class="card-header flex-between">
              <span>角色列表</span>
              <el-button
                v-permission="'system:role:add'"
                type="primary"
                :icon="Plus"
                size="small"
                @click="handleCreateRole"
              >
                新增角色
              </el-button>
            </div>
          </template>

          <el-table
            v-loading="roleLoading"
            :data="roleList"
            highlight-current-row
            @current-change="handleRoleSelect"
            style="width: 100%"
          >
            <el-table-column prop="roleName" label="角色名称" align="center" />
            <el-table-column prop="roleKey" label="权限字符" align="center" />
            <el-table-column label="状态" align="center" width="80">
              <template #default="scope">
                <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                  {{ scope.row.status === 1 ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
              <template #default="scope">
                <el-button
                  v-permission="'system:role:edit'"
                  link
                  type="primary"
                  :icon="Edit"
                  @click.stop="handleEditRole(scope.row)"
                />
                <el-button
                  v-permission="'system:role:delete'"
                  link
                  type="danger"
                  :icon="Delete"
                  @click.stop="handleDeleteRole(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 右侧权限树授权 -->
      <el-col :xs="24" :md="14" :lg="16">
        <el-card shadow="never" class="permission-tree-card">
          <template #header>
            <div class="card-header flex-between">
              <span>功能权限配置 - <el-tag v-if="activeRole" effect="dark" size="small">{{ activeRole.roleName }}</el-tag></span>
              <el-button
                v-permission="'system:role:edit'"
                type="success"
                :icon="Check"
                size="small"
                :disabled="!activeRole"
                :loading="savePermissionLoading"
                @click="handleSavePermissions"
              >
                保存授权
              </el-button>
            </div>
          </template>

          <div class="tree-wrapper">
            <el-tree
              ref="treeRef"
              :data="menuTreeData"
              show-checkbox
              node-key="id"
              default-expand-all
              :props="{ label: 'title', children: 'children' }"
              v-loading="treeLoading"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新增角色' : '编辑角色'"
      width="500px"
      align-center
    >
      <el-form :model="roleForm" :rules="roleRules" ref="roleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="roleForm.roleKey" placeholder="请输入权限标识字符" />
        </el-form-item>
        <el-form-item label="角色状态">
          <el-radio-group v-model="roleForm.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="submitRoleForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </page-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { request } from '~/utils/request';
import PageContainer from '~/components/common/PageContainer.vue';
import { Plus, Edit, Delete, Check } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
  title: '角色管理',
});

const roleList = ref<any[]>([]);
const menuTreeData = ref<any[]>([]);
const activeRole = ref<any>(null);

const roleLoading = ref(false);
const treeLoading = ref(false);
const savePermissionLoading = ref(false);
const submitLoading = ref(false);
const dialogVisible = ref(false);
const dialogType = ref<'create' | 'edit'>('create');

const treeRef = ref();
const roleFormRef = ref();

const roleForm = reactive({
  id: undefined,
  roleName: '',
  roleKey: '',
  status: 1,
});

const roleRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleKey: [{ required: true, message: '请输入权限字符', trigger: 'blur' }],
};

// 获取所有角色
const fetchRoleList = async () => {
  roleLoading.value = true;
  try {
    // 模拟数据接口
    roleList.value = [
      { id: 1, roleName: '超级管理员', roleKey: 'admin', status: 1, menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { id: 2, roleName: '测试人员', roleKey: 'editor', status: 1, menuIds: [1, 2, 3, 4, 5, 6, 7, 8] },
      { id: 3, roleName: '普通用户', roleKey: 'user', status: 1, menuIds: [1, 10] },
    ];
    // 默认选择第一个角色
    if (roleList.value.length > 0) {
      handleRoleSelect(roleList.value[0]);
    }
  } catch (err) {
    console.error(err);
  } finally {
    roleLoading.value = false;
  }
};

// 获取树形菜单用于勾选配置
const fetchMenuTree = async () => {
  treeLoading.value = true;
  try {
    const res = await request.get('/mock/menu');
    // 转换为 ElTree 格式
    menuTreeData.value = formatMenuToTree(res.data);
  } catch (err) {
    console.error(err);
  } finally {
    treeLoading.value = false;
  }
};

// 将 Mock 菜单结构适配为 Tree 的 label 渲染
const formatMenuToTree = (menus: any[]): any[] => {
  return menus.map((m) => {
    const item = {
      id: m.id,
      title: m.meta?.title || m.name,
      children: m.children ? formatMenuToTree(m.children) : [],
    };
    return item;
  });
};

// 选择角色时，右侧树高亮已勾选节点
const handleRoleSelect = (row: any) => {
  if (!row) return;
  activeRole.value = row;
  if (treeRef.value) {
    treeRef.value.setCheckedKeys(row.menuIds || []);
  }
};

// 新增角色弹窗
const handleCreateRole = () => {
  dialogType.value = 'create';
  roleForm.id = undefined;
  roleForm.roleName = '';
  roleForm.roleKey = '';
  roleForm.status = 1;
  dialogVisible.value = true;
};

// 编辑角色弹窗
const handleEditRole = (row: any) => {
  dialogType.value = 'edit';
  roleForm.id = row.id;
  roleForm.roleName = row.roleName;
  roleForm.roleKey = row.roleKey;
  roleForm.status = row.status;
  dialogVisible.value = true;
};

// 提交表单保存角色
const submitRoleForm = async () => {
  if (!roleFormRef.value) return;
  await roleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitLoading.value = true;
      try {
        if (dialogType.value === 'create') {
          roleList.value.push({
            id: roleList.value.length + 1,
            roleName: roleForm.roleName,
            roleKey: roleForm.roleKey,
            status: roleForm.status,
            menuIds: [],
          });
          ElMessage.success('角色新增成功');
        } else {
          const index = roleList.value.findIndex(r => r.id === roleForm.id);
          if (index > -1) {
            roleList.value[index].roleName = roleForm.roleName;
            roleList.value[index].roleKey = roleForm.roleKey;
            roleList.value[index].status = roleForm.status;
          }
          ElMessage.success('角色编辑成功');
        }
        dialogVisible.value = false;
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 删除角色
const handleDeleteRole = (row: any) => {
  ElMessageBox.confirm(`确定删除角色 "${row.roleName}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    roleList.value = roleList.value.filter(r => r.id !== row.id);
    ElMessage.success('角色删除成功');
  }).catch(() => {});
};

// 保存权限授权
const handleSavePermissions = () => {
  if (!activeRole.value) return;
  savePermissionLoading.value = true;
  
  // 获取半选和全选的节点列表作为菜单ID
  const checkedKeys = treeRef.value.getCheckedKeys();
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();
  const totalKeys = [...checkedKeys, ...halfCheckedKeys];
  
  setTimeout(() => {
    activeRole.value.menuIds = totalKeys;
    savePermissionLoading.value = false;
    ElMessage.success(`角色 "${activeRole.value.roleName}" 授权权限成功！`);
  }, 1000);
};

onMounted(async () => {
  await fetchMenuTree();
  await fetchRoleList();
});
</script>

<style scoped lang="scss">
.role-list-col {
  margin-bottom: 16px;
}
.permission-tree-card {
  min-height: 480px;
  .tree-wrapper {
    padding: 10px 0;
  }
}
</style>
