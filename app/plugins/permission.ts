// app/plugins/permission.ts
import { useUserStore } from '~/stores/modules/user';

export default defineNuxtPlugin((nuxtApp) => {
  // 注册全局指令 v-permission
  nuxtApp.vueApp.directive('permission', {
    mounted(el, binding) {
      const { value } = binding;
      const userStore = useUserStore();
      const permissions = userStore.permissions || [];

      if (value) {
        let hasPermission = false;
        
        if (Array.isArray(value)) {
          // 如果是数组，只要包含其中一个权限即可
          hasPermission = value.some((perm) => permissions.includes(perm) || permissions.includes('*:*:*'));
        } else if (typeof value === 'string') {
          // 单个权限校验，支持管理员通配符
          hasPermission = permissions.includes(value) || permissions.includes('*:*:*');
        }

        if (!hasPermission) {
          // 如果没有权限，从父节点中移除当前元素
          el.parentNode && el.parentNode.removeChild(el);
        }
      } else {
        throw new Error('v-permission 指令必须绑定一个权限字符串或数组！例如 v-permission="\'system:user:add\'"');
      }
    },
  });
});
