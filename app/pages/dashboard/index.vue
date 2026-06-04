<!-- app/pages/dashboard/index.vue -->
<template>
  <page-container title="控制台" subtitle="查看系统核心实时指标、销售概况和系统状态。">
    <!-- 4列统计卡片区 -->
    <el-row :gutter="16" class="stats-row">
      <el-col
        v-for="card in cards"
        :key="card.id"
        :xs="24"
        :sm="12"
        :lg="6"
        class="card-col"
      >
        <el-card shadow="hover" class="stat-card" :style="{ '--stat-color': card.color }">
          <div class="card-header flex-between">
            <span class="card-title">{{ card.title }}</span>
            <div class="card-icon flex-center">
              <!-- 动态加载图标 -->
              <el-icon :size="20"><component :is="card.icon" /></el-icon>
            </div>
          </div>
          <div class="card-body">
            <h2 class="card-value">{{ card.value }}</h2>
            <div class="card-trend flex-between">
              <span
                class="growth-text flex-center"
                :class="card.trend"
              >
                <el-icon v-if="card.trend === 'up'"><CaretTop /></el-icon>
                <el-icon v-else><CaretBottom /></el-icon>
                {{ card.growth }}
              </span>
              <span class="compare-label">较昨日</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区一：访问趋势 (折线) 与 销售额 (柱状) -->
    <el-row :gutter="16" class="chart-row">
      <el-col :xs="24" :lg="16">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header-slot flex-between">
              <span class="title flex-center"><el-icon><TrendCharts /></el-icon> 近7日访问趋势</span>
            </div>
          </template>
          <line-chart
            v-if="visitChartData"
            :categories="visitChartData.categories"
            :visits="visitChartData.visits"
            :visitors="visitChartData.visitors"
          />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header-slot flex-between">
              <span class="title flex-center"><el-icon><Histogram /></el-icon> 销售额统计</span>
            </div>
          </template>
          <bar-chart
            v-if="salesChartData"
            :months="salesChartData.months"
            :revenue="salesChartData.revenue"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区二：用户来源 (环形) 与 系统负载 (雷达) -->
    <el-row :gutter="16" class="chart-row">
      <el-col :xs="24" :lg="12">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header-slot flex-between">
              <span class="title flex-center"><el-icon><PieChartIcon /></el-icon> 用户访问来源</span>
            </div>
          </template>
          <pie-chart v-if="sourceChartData" :data="sourceChartData" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header-slot flex-between">
              <span class="title flex-center"><el-icon><Cpu /></el-icon> 系统性能监控</span>
            </div>
          </template>
          <radar-chart
            v-if="radarChartData"
            :indicators="radarChartData.indicators"
            :values="radarChartData.values"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部数据列表区 -->
    <el-row :gutter="16" class="list-row">
      <el-col :xs="24" :lg="16">
        <el-card shadow="never" class="table-card">
          <template #header>
            <div class="card-header-slot flex-between">
              <span class="title flex-center"><el-icon><List /></el-icon> 最新订单</span>
            </div>
          </template>
          <el-table :data="recentOrders" border stripe style="width: 100%">
            <el-table-column prop="id" label="订单编号" align="center" width="150" />
            <el-table-column prop="customer" label="客户姓名" align="center" />
            <el-table-column prop="amount" label="订单金额" align="center" />
            <el-table-column prop="status" label="订单状态" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'success' ? 'success' : scope.row.status === 'pending' ? 'warning' : 'danger'">
                  {{ scope.row.status === 'success' ? '已支付' : scope.row.status === 'pending' ? '未付款' : '已取消' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="下单时间" align="center" width="180" />
          </el-table>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :lg="8">
        <el-card shadow="never" class="table-card">
          <template #header>
            <div class="card-header-slot flex-between">
              <span class="title flex-center"><el-icon><Calendar /></el-icon> 最近登录日志</span>
            </div>
          </template>
          <div class="login-logs-list">
            <div
              v-for="log in recentLogins"
              :key="log.id"
              class="login-log-item flex-between"
            >
              <div class="log-left flex-center">
                <el-avatar :size="28">{{ log.name.substring(0, 1).toUpperCase() }}</el-avatar>
                <div class="log-info">
                  <div class="user-name">{{ log.name }}</div>
                  <div class="user-ip">{{ log.ip }} ({{ log.location }})</div>
                </div>
              </div>
              <span class="log-time">{{ log.time }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </page-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { request } from '~/utils/request';
import PageContainer from '~/components/common/PageContainer.vue';
import LineChart from '~/components/charts/LineChart.vue';
import BarChart from '~/components/charts/BarChart.vue';
import PieChart from '~/components/charts/PieChart.vue';
import RadarChart from '~/components/charts/RadarChart.vue';
import {
  CaretTop,
  CaretBottom,
  TrendCharts,
  Histogram,
  PieChart as PieChartIcon,
  Cpu,
  List,
  Calendar,
} from '@element-plus/icons-vue';

definePageMeta({
  title: '仪表盘',
});

const cards = ref<any[]>([]);
const visitChartData = ref<any>(null);
const salesChartData = ref<any>(null);
const sourceChartData = ref<any>(null);
const radarChartData = ref<any>(null);
const recentOrders = ref<any[]>([]);
const recentLogins = ref<any[]>([]);

const fetchDashboardStats = async () => {
  try {
    const res = await request.get('/mock/dashboard/stats');
    const { data } = res;
    cards.value = data.cards;
    visitChartData.value = data.visitChart;
    salesChartData.value = data.salesChart;
    sourceChartData.value = data.sourceChart;
    radarChartData.value = data.performanceRadar;
    recentOrders.value = data.recentOrders;
    recentLogins.value = data.recentLogins;
  } catch (err) {
    console.error('加载控制台数据失败', err);
  }
};

onMounted(() => {
  fetchDashboardStats();
});
</script>

<style scoped lang="scss">
.stats-row {
  margin-bottom: 16px;
  
  .card-col {
    margin-bottom: 16px;
  }
  
  .stat-card {
    border-radius: var(--border-radius-base);
    background: var(--card-bg-color);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background-color: var(--stat-color);
    }
    
    .card-header {
      justify-content: flex-between;
      .card-title {
        font-size: 14px;
        color: var(--text-regular);
        font-weight: 500;
      }
      .card-icon {
        width: 38px;
        height: 38px;
        border-radius: 8px;
        background-color: var(--bg-color);
        color: var(--stat-color);
      }
    }
    
    .card-body {
      margin-top: 14px;
      .card-value {
        font-size: 26px;
        font-weight: 700;
        color: var(--text-main);
        margin: 0;
      }
      
      .card-trend {
        margin-top: 10px;
        font-size: 12px;
        
        .growth-text {
          gap: 4px;
          font-weight: 600;
          &.up {
            color: var(--success-color);
          }
          &.down {
            color: var(--danger-color);
          }
        }
        
        .compare-label {
          color: var(--text-placeholder);
        }
      }
    }
  }
}

.chart-row {
  margin-bottom: 16px;
  
  .chart-card {
    border-radius: var(--border-radius-base);
    
    .card-header-slot {
      .title {
        font-size: 15px;
        font-weight: 600;
        gap: 8px;
        color: var(--text-main);
        .el-icon {
          color: var(--primary-color);
        }
      }
    }
  }
}

.list-row {
  margin-bottom: 16px;
  
  .table-card {
    border-radius: var(--border-radius-base);
    min-height: 380px;

    .card-header-slot {
      .title {
        font-size: 15px;
        font-weight: 600;
        gap: 8px;
        color: var(--text-main);
        .el-icon {
          color: var(--primary-color);
        }
      }
    }
  }
}

.login-logs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .login-log-item {
    padding: 10px 12px;
    border-radius: var(--border-radius-small);
    border: 1px solid var(--border-color);
    background-color: var(--bg-color);
    
    .log-left {
      gap: 12px;
      justify-content: flex-start;
      
      .el-avatar {
        background-color: var(--primary-color-light);
        color: var(--primary-color);
        font-weight: 600;
      }

      .log-info {
        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
        }
        
        .user-ip {
          font-size: 11px;
          color: var(--text-placeholder);
          margin-top: 2px;
        }
      }
    }
    
    .log-time {
      font-size: 12px;
      color: var(--text-placeholder);
    }
  }
}
</style>
