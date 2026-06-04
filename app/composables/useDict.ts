// app/composables/useDict.ts
import { ref } from 'vue';

// 模拟本地字典映射
const mockDicts: Record<string, Array<{ label: string; value: string; elTagType?: string }>> = {
  sys_user_sex: [
    { label: '男', value: '1', elTagType: '' },
    { label: '女', value: '2', elTagType: 'danger' },
    { label: '未知', value: '0', elTagType: 'info' },
  ],
  sys_normal_disable: [
    { label: '正常', value: '1', elTagType: 'success' },
    { label: '停用', value: '0', elTagType: 'danger' },
  ],
  sys_notice_type: [
    { label: '系统通知', value: '1', elTagType: 'warning' },
    { label: '业务公告', value: '2', elTagType: 'info' },
  ],
};

export function useDict() {
  /**
   * 根据字典类型获取字典数据
   */
  const getDictData = (dictType: string) => {
    const data = ref<any[]>([]);
    data.value = mockDicts[dictType] || [];
    return data;
  };

  /**
   * 翻译字典键值
   */
  const translateDict = (dictType: string, value: string | number): string => {
    const list = mockDicts[dictType] || [];
    const item = list.find((d) => d.value === String(value));
    return item ? item.label : String(value);
  };

  return {
    getDictData,
    translateDict,
  };
}
