// app/composables/usePermission.ts
import { useUserStore } from '~/stores/modules/user';

export function usePermission() {
  const userStore = useUserStore();

  /**
   * 判断是否拥有指定权限
   */
  const hasPermission = (value: string | string[]): boolean => {
    const permissions = userStore.permissions || [];
    // 超级管理员通配符直接通过
    if (permissions.includes('*:*:*')) return true;

    if (Array.isArray(value)) {
      return value.some((perm) => permissions.includes(perm));
    }
    return permissions.includes(value);
  };

  /**
   * 判断是否拥有指定角色
   */
  const hasRole = (value: string | string[]): boolean => {
    const roles = userStore.roles || [];
    if (roles.includes('admin')) return true;

    if (Array.isArray(value)) {
      return value.some((role) => roles.includes(role));
    }
    return roles.includes(value);
  };

  return {
    hasPermission,
    hasRole,
  };
}
