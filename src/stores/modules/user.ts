// app/stores/modules/user.ts
import { defineStore } from 'pinia';
import type { UserInfo } from '~/types/user';
import { request } from '~/utils/request';
import { setToken, removeToken, setRefreshToken, removeRefreshToken } from '~/utils/auth';

interface UserState {
  token: string;
  refreshToken: string;
  userInfo: UserInfo | null;
  permissions: string[];
  roles: string[];
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    refreshToken: '',
    userInfo: null,
    permissions: [],
    roles: [],
  }),
  getters: {
    isLoggedIn(): boolean {
      return !!this.token;
    },
  },
  actions: {
    async login(loginForm: any) {
      try {
        const clientId = import.meta.env.VITE_APP_CLIENT_ID || 'e5cd7e4891bf95d1d19206ce24a7b32e';
        const params = {
          tenantId: '000000', // 默认超管租户ID
          ...loginForm,
          clientId,
          grantType: loginForm.grantType || 'password',
        };
        const res = await request.post<any>('/auth/login', params);
        const { access_token } = res.data;
        this.token = access_token;
        setToken(access_token);

        // 登录成功后直接加载用户信息
        await this.getUserInfo();
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async getUserInfo() {
      try {
        const res = await request.get<any>('/system/user/getInfo');
        const data = res.data;
        // 兼容真实接口的 data.user 和 mock 接口直接返回的 data
        const user = data.user || data;

        this.userInfo = {
          id: user.userId || user.id,
          username: user.userName || user.username,
          nickname: user.nickName || user.nickname || user.userName || user.username,
          avatar: user.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          email: user.email,
          phone: user.phonenumber || user.phone,
          status: user.status !== undefined ? Number(user.status) : 0,
          roles: data.roles || user.roles || [],
          permissions: data.permissions || user.permissions || [],
          createTime: user.createTime || '',
        };

        this.roles = this.userInfo.roles;
        this.permissions = this.userInfo.permissions;
        return this.userInfo;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async logout() {
      try {
        await request.post('/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      }
      this.token = '';
      this.refreshToken = '';
      this.userInfo = null;
      this.permissions = [];
      this.roles = [];
      removeToken();
      removeRefreshToken();

      // 清空标签页
      const tabsStore = useTabsStore();
      tabsStore.removeAllTabs();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },

    async refreshTokenAction() {
      try {
        const res = await request.post<any>('/mock/refresh-token', {
          refreshToken: this.refreshToken,
        });
        const { token, refreshToken } = res.data;
        this.token = token;
        this.refreshToken = refreshToken;
        setToken(token);
        setRefreshToken(refreshToken);
        return token;
      } catch (error) {
        // 刷新 token 失败直接登出
        this.logout();
        return Promise.reject(error);
      }
    },
  },
  persist: {
    key: 'admin-user',
    paths: ['token', 'refreshToken', 'roles', 'permissions'],
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  },
});
export default useUserStore;
