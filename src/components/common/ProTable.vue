<!-- app/components/common/ProTable.vue -->
<template>
  <div class="pro-table">
    <!-- 搜索表单 -->
    <div v-if="searchSchema && searchSchema.length > 0" class="search-panel">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item
          v-for="item in searchSchema"
          :key="item.field"
          :label="item.label"
        >
          <el-input
            v-if="item.type === 'input'"
            v-model="searchParams[item.field]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            clearable
          />
          <el-select
            v-else-if="item.type === 'select'"
            v-model="searchParams[item.field]"
            :placeholder="item.placeholder || `请选择${item.label}`"
            clearable
            style="width: 160px"
          >
            <el-option
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格工具栏 -->
    <div class="table-toolbar flex-between">
      <div class="toolbar-left">
        <slot name="toolbar"></slot>
      </div>
      <div class="toolbar-right flex-center">
        <!-- 基础刷新 -->
        <el-button circle :icon="Refresh" @click="getTableData" title="刷新数据" />
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      :row-key="rowKey"
      border
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- 多选列 -->
      <el-table-column
        v-if="selection"
        type="selection"
        width="50"
        align="center"
      />
      
      <!-- 数据列 -->
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :align="col.align || 'center'"
        :sortable="col.sortable"
      >
        <!-- 特殊插槽列 -->
        <template #default="scope">
          <slot v-if="col.slot" :name="col.slot" :row="scope.row" :index="scope.$index"></slot>
          <span v-else>{{ scope.row[col.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-if="pagination && total > 0" class="pagination-panel flex-between">
      <div class="pagination-info">
        共 {{ total }} 条记录，第 {{ currentPage }} / {{ Math.ceil(total / pageSize) }} 页
      </div>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { Search, Refresh } from '@element-plus/icons-vue';

export interface ColumnDef {
  prop: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean | 'custom';
  slot?: string;
}

const props = defineProps({
  columns: {
    type: Array as () => ColumnDef[],
    required: true,
  },
  requestFn: {
    type: Function as unknown as () => (params: any) => Promise<{ list: any[]; total: number }>,
    required: true,
  },
  searchSchema: {
    type: Array as () => any[],
    default: () => [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  selection: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['selection-change']);

const tableData = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const searchParams = reactive<any>({});

// 初始化默认搜索字段
if (props.searchSchema) {
  props.searchSchema.forEach((item) => {
    searchParams[item.field] = item.defaultValue !== undefined ? item.defaultValue : '';
  });
}

// 选项改变回调
const handleSelectionChange = (val: any[]) => {
  emit('selection-change', val);
};

// 获取表格数据
const getTableData = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchParams,
    };
    const res = await props.requestFn(params);
    tableData.value = res.list || [];
    total.value = res.total || 0;
  } catch (error) {
    console.error('获取表格数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 查询
const handleSearch = () => {
  currentPage.value = 1;
  getTableData();
};

// 重置
const handleReset = () => {
  Object.keys(searchParams).forEach((key) => {
    searchParams[key] = '';
  });
  currentPage.value = 1;
  getTableData();
};

// 页数大小修改
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
  getTableData();
};

// 当前页码修改
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getTableData();
};

// 挂载时拉取一次数据
onMounted(() => {
  getTableData();
});

defineExpose({
  refresh: getTableData,
  searchParams,
  tableData,
  total,
});
</script>

<style scoped lang="scss">
.pro-table {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .search-panel {
    background: var(--bg-color);
    padding: 18px 20px 2px 20px;
    border-radius: var(--border-radius-small);
    border: 1px solid var(--border-color);
    
    .el-form-item {
      margin-bottom: 16px;
    }
  }

  .table-toolbar {
    margin-bottom: 4px;
  }

  .pagination-panel {
    margin-top: 16px;
    
    .pagination-info {
      font-size: 13px;
      color: var(--text-regular);
    }
  }
}
</style>
