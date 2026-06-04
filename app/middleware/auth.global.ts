// app/middleware/auth.global.ts
import { useUserStore } from '~/stores/modules/user';
import { useMenuStore } from '~/stores/modules/menu';

const whiteList = ['/login', '/404'];

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return; // 仅在客户端拦截

  const userStore = useUserStore();
  const menuStore = useMenuStore();
  const token = userStore.token;

  // 1. 白名单放行
  if (whiteList.includes(to.path)) {
    return;
  }

  // 2. 无 Token 拦截
  if (!token) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  // 3. 有 Token，但未加载用户信息或菜单路由，执行加载逻辑
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
    } catch (err) {
      console.error('加载用户信息或路由失败:', err);
      // 清空状态并返回登录页
      await userStore.logout();
      return navigateTo('/login');
    }
  }

  // 设置文档标题
  if (to.meta?.title) {
    const runtimeConfig = useRuntimeConfig();
    const appTitle = runtimeConfig.public.appTitle || '管理后台';
    useHead({
      title: `${to.meta.title} - ${appTitle}`,
    });
  }
});
