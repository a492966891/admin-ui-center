import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// 声明所有基础和业务页面路由
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login.vue'),
    meta: {
      title: '登录',
      layout: 'auth',
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/dashboard/index.vue'),
    meta: {
      title: '仪表盘',
    },
  },
  {
    path: '/monitor/logs',
    name: 'MonitorLogs',
    component: () => import('@/pages/monitor/logs/index.vue'),
    meta: {
      title: '操作日志',
    },
  },
  {
    path: '/monitor/online',
    name: 'MonitorOnline',
    component: () => import('@/pages/monitor/online/index.vue'),
    meta: {
      title: '在线用户',
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/profile/index.vue'),
    meta: {
      title: '个人中心',
    },
  },
  {
    path: '/system/user',
    name: 'SystemUser',
    component: () => import('@/pages/system/user/index.vue'),
    meta: {
      title: '用户管理',
    },
  },
  {
    path: '/system/dict',
    name: 'SystemDict',
    component: () => import('@/pages/system/dict/index.vue'),
    meta: {
      title: '字典管理',
    },
  },
  {
    path: '/system/menu',
    name: 'SystemMenu',
    component: () => import('@/pages/system/menu/index.vue'),
    meta: {
      title: '菜单管理',
    },
  },
  {
    path: '/system/role',
    name: 'SystemRole',
    component: () => import('@/pages/system/role/index.vue'),
    meta: {
      title: '角色管理',
    },
  },
  // 通配符路由，重定向到自定义 404 页
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/error.vue'),
    meta: {
      title: '404 - 页面未找到',
      layout: 'blank', // 用空白布局承载
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

export default router;
