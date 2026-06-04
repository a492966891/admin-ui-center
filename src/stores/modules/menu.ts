// app/stores/modules/menu.ts
import { defineStore } from 'pinia';
import type { MenuItem } from '~/types/menu';
import { request } from '~/utils/request';

interface MenuState {
  menuList: MenuItem[];
  activeMenu: string;
  isRoutesGenerated: boolean;
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menuList: [],
    activeMenu: '',
    isRoutesGenerated: false,
  }),
  getters: {
    sidebarMenus(): MenuItem[] {
      return this.menuList;
    },
  },
  actions: {
    async generateMenus() {
      try {
        const res = await request.get<MenuItem[]>('/mock/menu');
        const menus = res.data || [];
        this.menuList = menus;
        this.isRoutesGenerated = true;
        return menus;
      } catch (error) {
        this.isRoutesGenerated = false;
        return Promise.reject(error);
      }
    },
    setActiveMenu(path: string) {
      this.activeMenu = path;
    },
    resetMenuState() {
      this.menuList = [];
      this.activeMenu = '';
      this.isRoutesGenerated = false;
    }
  },
});
export default useMenuStore;
