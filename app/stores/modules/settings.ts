// app/stores/modules/settings.ts
import { defineStore } from 'pinia';

interface SettingsState {
  theme: 'light' | 'dark';
  primaryColor: string;
  sidebarCollapsed: boolean;
  language: 'zh-CN' | 'en-US';
  showBreadcrumb: boolean;
  showTabs: boolean;
  fixedHeader: boolean;
  layoutMode: 'side' | 'top' | 'mix';
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    theme: 'light',
    primaryColor: '#5856d6',
    sidebarCollapsed: false,
    language: 'zh-CN',
    showBreadcrumb: true,
    showTabs: true,
    fixedHeader: true,
    layoutMode: 'side',
  }),
  actions: {
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme;
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    setPrimaryColor(color: string) {
      this.primaryColor = color;
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--primary-color', color);
      }
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed;
    },
    setLanguage(lang: 'zh-CN' | 'en-US') {
      this.language = lang;
    },
    setLayoutMode(mode: 'side' | 'top' | 'mix') {
      this.layoutMode = mode;
    },
  },
  persist: {
    key: 'admin-settings',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  },
});
export default useSettingsStore;
