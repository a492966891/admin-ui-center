<!-- app/pages/monitor/online/index.vue -->
<template>
  <page-container title="在线用户" subtitle="监控当前系统活跃在线的账号连接，支持强制下线不安全会话。">
    <pro-table
      ref="tableRef"
      :columns="columns"
      :request-fn="fetchOnlineUsers"
      :search-schema="searchSchema"
      row-key="tokenId"
    >
      <!-- 操作栏强退 -->
      <template #actions="scope">
        <el-button
          v-permission="'monitor:online:forceLogout'"
          link
          type="danger"
          :icon="SwitchButton"
          @click="handleForceLogout(scope.row)"
        >
          强退
        </el-button>
      </template>
    </pro-table>
  </page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageContainer from '~/components/common/PageContainer.vue';
import ProTable from '~/components/common/ProTable.vue';
import type { ColumnDef } from '~/components/common/ProTable.vue';
import { SwitchButton } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
  title: '在线用户',
});

const tableRef = ref();

const columns: ColumnDef[] = [
  { prop: 'tokenId', label: '会话编号', minWidth: 220 },
  { prop: 'username', label: '登录账号', width: 120 },
  { prop: 'ipaddr', label: 'IP地址', width: 140 },
  { prop: 'loginLocation', label: '登录地点', minWidth: 160 },
  { prop: 'browser', label: '浏览器', width: 120 },
  { prop: 'os', label: '操作系统', width: 120 },
  { prop: 'loginTime', label: '登录时间', minWidth: 180, sortable: true },
  { prop: 'actions', label: '操作', width: 100, slot: 'actions', align: 'center' },
];

const searchSchema = [
  { field: 'username', label: '登录账号', type: 'input', placeholder: '请输入账号名' },
  { field: 'ipaddr', label: 'IP地址', type: 'input', placeholder: '请输入IP地址' },
];

// 模拟在线用户数据
const mockOnlineUsers = [
  { tokenId: 'session_8928ad2a', username: 'admin', ipaddr: '192.168.1.100', loginLocation: '北京朝阳', browser: 'Chrome 125', os: 'Windows 11', loginTime: '2026-06-03 12:00:00' },
  { tokenId: 'session_0920ca31', username: 'test', ipaddr: '220.181.108.85', loginLocation: '广东深圳', browser: 'Safari 17', os: 'macOS Sonoma', loginTime: '2026-06-03 12:10:00' },
  { tokenId: 'session_e128ccda', username: 'editor', ipaddr: '117.136.8.12', loginLocation: '浙江杭州', browser: 'Edge 123', os: 'Windows 10', loginTime: '2026-06-03 11:30:00' },
];

const fetchOnlineUsers = async (params: any) => {
  // 简易过滤
  let list = [...mockOnlineUsers];
  if (params.username) {
    list = list.filter((u) => u.username.includes(params.username));
  }
  if (params.ipaddr) {
    list = list.filter((u) => u.ipaddr.includes(params.ipaddr));
  }
  return {
    list,
    total: list.length,
  };
};

const handleForceLogout = (row: any) => {
  ElMessageBox.confirm(`确定强制退线用户 "${row.username}" 吗？该操作将即时终止该用户的会话连接。`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success(`用户会话 "${row.tokenId}" 强退成功！`);
    tableRef.value.refresh();
  }).catch(() => {});
};
</script>
