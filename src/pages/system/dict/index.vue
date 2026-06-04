<!-- app/pages/system/dict/index.vue -->
<template>
  <page-container title="字典管理" subtitle="维护及配置系统字典项，支持定义键值对映射以规范前端状态展示。">
    <el-row :gutter="16">
      <!-- 左侧：字典类型 -->
      <el-col :xs="24" :md="10">
        <el-card shadow="never">
          <template #header>
            <div class="card-header flex-between">
              <span>字典类型</span>
              <el-button type="primary" :icon="Plus" size="small" @click="handleCreateType">
                新增类型
              </el-button>
            </div>
          </template>

          <el-table
            v-loading="typeLoading"
            :data="typeList"
            highlight-current-row
            @current-change="handleTypeSelect"
            style="width: 100%"
          >
            <el-table-column prop="dictName" label="字典名称" align="center" />
            <el-table-column prop="dictType" label="字典类型" align="center" />
            <el-table-column label="状态" align="center" width="80">
              <template #default="scope">
                <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                  {{ scope.row.status === 1 ? '正常' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template #default="scope">
                <el-button link type="primary" :icon="Edit" @click.stop="handleEditType(scope.row)" />
                <el-button link type="danger" :icon="Delete" @click.stop="handleDeleteType(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 右侧：字典数据 -->
      <el-col :xs="24" :md="14">
        <el-card shadow="never" class="dict-data-card">
          <template #header>
            <div class="card-header flex-between">
              <span>字典数据列表 - <el-tag v-if="activeType" effect="dark" size="small">{{ activeType.dictType }}</el-tag></span>
              <el-button
                type="success"
                :icon="Plus"
                size="small"
                :disabled="!activeType"
                @click="handleCreateData"
              >
                新增数据
              </el-button>
            </div>
          </template>

          <el-table
            v-loading="dataLoading"
            :data="dataList"
            border
            style="width: 100%"
          >
            <el-table-column prop="dictLabel" label="字典标签" align="center" />
            <el-table-column prop="dictValue" label="字典键值" align="center" />
            <el-table-column prop="cssClass" label="回显样式" align="center">
              <template #default="scope">
                <el-tag v-if="scope.row.cssClass" :type="scope.row.cssClass">
                  {{ scope.row.dictLabel }}
                </el-tag>
                <span v-else>—</span>
              </template>
            </el-table-column>
            <el-table-column prop="dictSort" label="排序" align="center" width="80" />
            <el-table-column label="状态" align="center" width="80">
              <template #default="scope">
                <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                  {{ scope.row.status === 1 ? '正常' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
              <template #default="scope">
                <el-button link type="primary" :icon="Edit" @click="handleEditData(scope.row)" />
                <el-button link type="danger" :icon="Delete" @click="handleDeleteData(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 字典类型弹窗 -->
    <el-dialog
      v-model="typeDialogVisible"
      :title="typeDialogType === 'create' ? '新增字典类型' : '编辑字典类型'"
      width="450px"
      align-center
    >
      <el-form :model="typeForm" :rules="typeRules" ref="typeFormRef" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="typeForm.dictName" placeholder="如：系统状态" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="typeForm.dictType" placeholder="如：sys_normal_disable" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="typeForm.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="typeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitTypeForm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 字典数据弹窗 -->
    <el-dialog
      v-model="dataDialogVisible"
      :title="dataDialogType === 'create' ? '新增字典数据' : '编辑字典数据'"
      width="450px"
      align-center
    >
      <el-form :model="dataForm" :rules="dataRules" ref="dataFormRef" label-width="80px">
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="dataForm.dictLabel" placeholder="如：启用" />
        </el-form-item>
        <el-form-item label="字典键值" prop="dictValue">
          <el-input v-model="dataForm.dictValue" placeholder="如：1" />
        </el-form-item>
        <el-form-item label="样式属性" prop="cssClass">
          <el-select v-model="dataForm.cssClass" placeholder="选择回显颜色类型" class="w-full">
            <el-option label="Default (蓝色)" value="" />
            <el-option label="Success (绿色)" value="success" />
            <el-option label="Warning (黄色)" value="warning" />
            <el-option label="Danger (红色)" value="danger" />
            <el-option label="Info (灰色)" value="info" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示排序" prop="dictSort">
          <el-input-number v-model="dataForm.dictSort" :min="1" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="dataForm.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dataDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDataForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </page-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import PageContainer from '~/components/common/PageContainer.vue';
import { Plus, Edit, Delete } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const typeList = ref<any[]>([]);
const dataList = ref<any[]>([]);
const activeType = ref<any>(null);

const typeLoading = ref(false);
const dataLoading = ref(false);
const typeDialogVisible = ref(false);
const dataDialogVisible = ref(false);
const typeDialogType = ref<'create' | 'edit'>('create');
const dataDialogType = ref<'create' | 'edit'>('create');

const typeFormRef = ref();
const dataFormRef = ref();

const typeForm = reactive({
  id: undefined,
  dictName: '',
  dictType: '',
  status: 1,
});

const typeRules = {
  dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  dictType: [{ required: true, message: '请输入字典类型', trigger: 'blur' }],
};

const dataForm = reactive({
  id: undefined,
  dictLabel: '',
  dictValue: '',
  cssClass: '',
  dictSort: 1,
  status: 1,
});

const dataRules = {
  dictLabel: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
  dictValue: [{ required: true, message: '请输入字典键值', trigger: 'blur' }],
};

// 预设 Mock 类型
const fetchTypeList = () => {
  typeLoading.value = true;
  typeList.value = [
    { id: 1, dictName: '用户性别', dictType: 'sys_user_sex', status: 1 },
    { id: 2, dictName: '系统开关', dictType: 'sys_normal_disable', status: 1 },
    { id: 3, dictName: '通知类型', dictType: 'sys_notice_type', status: 1 },
  ];
  typeLoading.value = false;
  if (typeList.value.length > 0) {
    handleTypeSelect(typeList.value[0]);
  }
};

const handleTypeSelect = (row: any) => {
  if (!row) return;
  activeType.value = row;
  dataLoading.value = true;
  
  // 根据不同的类型加载数据项
  if (row.dictType === 'sys_user_sex') {
    dataList.value = [
      { id: 101, dictLabel: '男', dictValue: '1', cssClass: '', dictSort: 1, status: 1 },
      { id: 102, dictLabel: '女', dictValue: '2', cssClass: 'danger', dictSort: 2, status: 1 },
      { id: 103, dictLabel: '未知', dictValue: '0', cssClass: 'info', dictSort: 3, status: 1 },
    ];
  } else if (row.dictType === 'sys_normal_disable') {
    dataList.value = [
      { id: 201, dictLabel: '正常', dictValue: '1', cssClass: 'success', dictSort: 1, status: 1 },
      { id: 202, dictLabel: '停用', dictValue: '0', cssClass: 'danger', dictSort: 2, status: 1 },
    ];
  } else if (row.dictType === 'sys_notice_type') {
    dataList.value = [
      { id: 301, dictLabel: '系统通知', dictValue: '1', cssClass: 'warning', dictSort: 1, status: 1 },
      { id: 302, dictLabel: '业务公告', dictValue: '2', cssClass: 'info', dictSort: 2, status: 1 },
    ];
  } else {
    dataList.value = [];
  }
  dataLoading.value = false;
};

// 字典类型操作
const handleCreateType = () => {
  typeDialogType.value = 'create';
  typeForm.id = undefined;
  typeForm.dictName = '';
  typeForm.dictType = '';
  typeForm.status = 1;
  typeDialogVisible.value = true;
};

const handleEditType = (row: any) => {
  typeDialogType.value = 'edit';
  typeForm.id = row.id;
  typeForm.dictName = row.dictName;
  typeForm.dictType = row.dictType;
  typeForm.status = row.status;
  typeDialogVisible.value = true;
};

const submitTypeForm = async () => {
  if (!typeFormRef.value) return;
  await typeFormRef.value.validate((valid: boolean) => {
    if (valid) {
      if (typeDialogType.value === 'create') {
        typeList.value.push({
          id: typeList.value.length + 1,
          dictName: typeForm.dictName,
          dictType: typeForm.dictType,
          status: typeForm.status,
        });
        ElMessage.success('新增类型成功');
      } else {
        const item = typeList.value.find(t => t.id === typeForm.id);
        if (item) {
          item.dictName = typeForm.dictName;
          item.dictType = typeForm.dictType;
          item.status = typeForm.status;
        }
        ElMessage.success('修改类型成功');
      }
      typeDialogVisible.value = false;
    }
  });
};

const handleDeleteType = (row: any) => {
  ElMessageBox.confirm(`确定删除字典类型 "${row.dictName}" 吗？这会清除其所有明细数据。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    typeList.value = typeList.value.filter(t => t.id !== row.id);
    if (activeType.value?.id === row.id) {
      activeType.value = null;
      dataList.value = [];
    }
    ElMessage.success('删除成功');
  }).catch(() => {});
};

// 字典数据操作
const handleCreateData = () => {
  dataDialogType.value = 'create';
  dataForm.id = undefined;
  dataForm.dictLabel = '';
  dataForm.dictValue = '';
  dataForm.cssClass = '';
  dataForm.dictSort = 10;
  dataForm.status = 1;
  dataDialogVisible.value = true;
};

const handleEditData = (row: any) => {
  dataDialogType.value = 'edit';
  dataForm.id = row.id;
  dataForm.dictLabel = row.dictLabel;
  dataForm.dictValue = row.dictValue;
  dataForm.cssClass = row.cssClass;
  dataForm.dictSort = row.dictSort;
  dataForm.status = row.status;
  dataDialogVisible.value = true;
};

const submitDataForm = async () => {
  if (!dataFormRef.value) return;
  await dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      if (dataDialogType.value === 'create') {
        dataList.value.push({
          id: dataList.value.length + 1,
          dictLabel: dataForm.dictLabel,
          dictValue: dataForm.dictValue,
          cssClass: dataForm.cssClass,
          dictSort: dataForm.dictSort,
          status: dataForm.status,
        });
        ElMessage.success('新增明细成功');
      } else {
        const item = dataList.value.find(d => d.id === dataForm.id);
        if (item) {
          item.dictLabel = dataForm.dictLabel;
          item.dictValue = dataForm.dictValue;
          item.cssClass = dataForm.cssClass;
          item.dictSort = dataForm.dictSort;
          item.status = dataForm.status;
        }
        ElMessage.success('修改明细成功');
      }
      dataDialogVisible.value = false;
    }
  });
};

const handleDeleteData = (row: any) => {
  ElMessageBox.confirm(`确定删除数据明细 "${row.dictLabel}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    dataList.value = dataList.value.filter(d => d.id !== row.id);
    ElMessage.success('删除成功');
  }).catch(() => {});
};

onMounted(() => {
  fetchTypeList();
});
</script>

<style scoped lang="scss">
.dict-data-card {
  min-height: 480px;
}
.w-full {
  width: 100% !important;
}
</style>
