// app/stores/modules/tabs.ts
import { defineStore } from 'pinia';

export interface TabItem {
  title: string;
  path: string;
  name: string;
  affix?: boolean;
}

interface TabsState {
  visitedViews: TabItem[];
}

export const useTabsStore = defineStore('tabs', {
  state: (): TabsState => ({
    visitedViews: [],
  }),
  actions: {
    addTab(route: any) {
      // 自动过滤和清除持久化数据中可能残留的“无标题”标签页
      if (this.visitedViews.some(v => !v.title || v.title === '无标题')) {
        this.visitedViews = this.visitedViews.filter(v => v.title && v.title !== '无标题');
      }

      // 只有在路由有 path、非 hidden、且具有 meta.title 时才加入 Tab
      if (!route.path || route.meta?.hidden || !route.meta?.title) return;

      const title = route.meta.title as string;
      const name = (route.name as string) || '';

      // 避免重复添加，如果已存在，则尝试更新 title
      const existingTab = this.visitedViews.find((v) => v.path === route.path);
      if (existingTab) {
        if (existingTab.title !== title) {
          existingTab.title = title;
        }
        if (name && !existingTab.name) {
          existingTab.name = name;
        }
        return;
      }

      this.visitedViews.push({
        title,
        path: route.path,
        name,
        affix: !!route.meta?.affix,
      });
    },
    removeTab(path: string) {
      const index = this.visitedViews.findIndex((v) => v.path === path);
      if (index > -1) {
        // 如果是固定标签，则不删除
        if (this.visitedViews[index]?.affix) return;
        this.visitedViews.splice(index, 1);
      }
    },
    removeOtherTabs(path: string) {
      this.visitedViews = this.visitedViews.filter((v) => v.path === path || v.affix);
    },
    removeAllTabs() {
      // 仅保留固定标签
      this.visitedViews = this.visitedViews.filter((v) => v.affix);
    },
    setTabs(tabs: TabItem[]) {
      this.visitedViews = tabs;
    }
  },
  persist: {
    key: 'admin-tabs',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  },
});
export default useTabsStore;
