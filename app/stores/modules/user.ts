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
        const res = await request.post<any>('/mock/login', loginForm);
        const { token, refreshToken } = res.data;
        this.token = token;
        this.refreshToken = refreshToken;
        setToken(token);
        setRefreshToken(refreshToken);
        
        // 登录成功后直接加载用户信息
        await this.getUserInfo();
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    
    async getUserInfo() {
      try {
        const res = await request.get<any>('/mock/user-info');
        const userInfo = res.data;
        this.userInfo = userInfo;
        this.roles = userInfo.roles || [];
        this.permissions = userInfo.permissions || [];
        return userInfo;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    
    async logout() {
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
        navigateTo('/login');
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
    pick: ['token', 'refreshToken', 'roles', 'permissions'],
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  },
});
export default useUserStore;
