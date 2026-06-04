import type { Router } from 'vue-router';
import { useUserStore } from '@/stores/modules/user';
import { useMenuStore } from '@/stores/modules/menu';

const whiteList = ['/login', '/404'];

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    const menuStore = useMenuStore();
    const token = userStore.token;

    // 1. 白名单放行
    if (whiteList.includes(to.path)) {
      return next();
    }

    // 2. 无 Token 拦截
    if (!token) {
      return next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
    }

    // 3. 有 Token，但未加载用户信息或菜单，执行加载逻辑
    if (!userStore.userInfo || menuStore.menuList.length === 0) {
      try {
        if (!userStore.userInfo) {
          // 获取个人信息和权限
          await userStore.getUserInfo();
        }
        if (menuStore.menuList.length === 0) {
          // 生成动态菜单与注册动态路由
          await menuStore.generateMenus();
        }
        return next({ ...to, replace: true });
      } catch (err) {
        console.error('加载用户信息或路由失败:', err);
        // 清空状态并返回登录页
        await userStore.logout();
        return next('/login');
      }
    }

    next();
  });

  router.afterEach((to) => {
    // 设置文档标题
    if (to.meta?.title) {
      const appTitle = import.meta.env.VITE_APP_TITLE || '管理后台';
      document.title = `${to.meta.title} - ${appTitle}`;
    }
  });
}
