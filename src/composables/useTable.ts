// app/composables/useTable.ts
import { ref, reactive } from 'vue';

export function useTable(apiFn: (params: any) => Promise<any>) {
  const tableData = ref<any[]>([]);
  const loading = ref(false);
  const total = ref(0);
  
  const pageParams = reactive({
    page: 1,
    pageSize: 10,
  });

  const searchParams = reactive<any>({});

  const getList = async () => {
    if (loading.value) return;
    loading.value = true;
    try {
      const params = {
        ...pageParams,
        ...searchParams,
      };
      const res = await apiFn(params);
      tableData.value = res.list || [];
      total.value = res.total || 0;
    } catch (err) {
      console.error('Fetch table data error:', err);
    } finally {
      loading.value = false;
    }
  };

  const handleSearch = () => {
    pageParams.page = 1;
    getList();
  };

  const handleReset = (defaultParams: any = {}) => {
    Object.keys(searchParams).forEach((key) => {
      searchParams[key] = defaultParams[key] !== undefined ? defaultParams[key] : '';
    });
    pageParams.page = 1;
    getList();
  };

  const handlePageChange = (page: number) => {
    pageParams.page = page;
    getList();
  };

  const handleSizeChange = (size: number) => {
    pageParams.pageSize = size;
    pageParams.page = 1;
    getList();
  };

  return {
    tableData,
    loading,
    total,
    pageParams,
    searchParams,
    getList,
    handleSearch,
    handleReset,
    handlePageChange,
    handleSizeChange,
  };
}
