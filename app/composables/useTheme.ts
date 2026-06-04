// app/composables/useTheme.ts
import { useSettingsStore } from '~/stores/modules/settings';

export function useTheme() {
  const settingsStore = useSettingsStore();

  /**
   * 切换亮暗模式
   */
  const toggleDark = () => {
    const nextTheme = settingsStore.theme === 'light' ? 'dark' : 'light';
    settingsStore.setTheme(nextTheme);
  };

  /**
   * 修改全局主题主色
   */
  const changePrimaryColor = (color: string) => {
    settingsStore.setPrimaryColor(color);
  };

  return {
    theme: computed(() => settingsStore.theme),
    primaryColor: computed(() => settingsStore.primaryColor),
    toggleDark,
    changePrimaryColor,
  };
}
export default useTheme;
