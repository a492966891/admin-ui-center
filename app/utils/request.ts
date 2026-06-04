// app/utils/request.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ElMessage, ElLoading } from 'element-plus';

// 扩展 AxiosRequestConfig
export interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean;
  showError?: boolean;
  ignoreCancelToken?: boolean;
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  timestamp: number;
}

// 简易 UUID 生成
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 缓存已发送请求用于取消
const pendingMap = new Map<string, AbortController>();

function getPendingKey(config: AxiosRequestConfig): string {
  return [config.method, config.url, JSON.stringify(config.params), JSON.stringify(config.data)].join('&');
}

function addPending(config: RequestConfig) {
  if (config.ignoreCancelToken) return;
  removePending(config);
  const key = getPendingKey(config);
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingMap.set(key, controller);
}

function removePending(config: RequestConfig) {
  const key = getPendingKey(config);
  if (pendingMap.has(key)) {
    const controller = pendingMap.get(key);
    controller?.abort();
    pendingMap.delete(key);
  }
}

// 创建实例
const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

let loadingInstance: any = null;
let loadingCount = 0;

function showLoading() {
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
    });
  }
  loadingCount++;
}

function hideLoading() {
  if (loadingCount <= 0) return;
  loadingCount--;
  if (loadingCount === 0 && loadingInstance) {
    loadingInstance.close();
    loadingInstance = null;
  }
}

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig & RequestConfig) => {
    // 动态获取 runtimeConfig 中的 apiBase 作为 baseURL，支持多环境配置
    try {
      const runtimeConfig = useRuntimeConfig();
      config.baseURL = runtimeConfig.public.apiBase || '/api';
    } catch (err) {
      // 容错降级
    }

    // 处理取消重复请求
    addPending(config);

    // 启用 Loading 提示
    if (config.showLoading) {
      showLoading();
    }

    // 注入请求唯一 ID 与 时间戳
    config.headers['X-Request-Id'] = generateUUID();
    config.headers['X-Timestamp'] = Date.now().toString();

    // 动态注入 Token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin-token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { config } = response;
    removePending(config);

    if ((config as RequestConfig).showLoading) {
      hideLoading();
    }

    const { code, message, data } = response.data;

    // 业务正常
    if (code === 200) {
      return response.data as any;
    }

    // 异常处理
    if ((config as RequestConfig).showError !== false) {
      ElMessage.error(message || '系统错误');
    }

    return Promise.reject(new Error(message || 'Error'));
  },
  (error) => {
    // 隐藏 loading
    if (error.config?.showLoading) {
      hideLoading();
    }

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const { response } = error;
    if (response) {
      const { status, data } = response;
      const msg = data?.message || '请求处理异常';

      switch (status) {
        case 401:
          ElMessage.error('登录过期或失效，请重新登录');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('admin-token');
            localStorage.removeItem('admin-refresh-token');
            // 重定向至登录页
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = window.location.pathname + window.location.search;
            window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
          }
          break;
        case 403:
          ElMessage.error('暂无访问该资源的权限');
          break;
        case 500:
          ElMessage.error(msg || '服务器内部错误，请稍后再试');
          break;
        default:
          ElMessage.error(msg || '网络连接异常，请检查网络');
      }
    } else {
      if (error.message.includes('timeout')) {
        ElMessage.error('请求超时，请稍后重试');
      } else {
        ElMessage.error('网络错误，请确保后端服务已运行');
      }
    }

    return Promise.reject(error);
  }
);

// 核心请求封装方法
export const request = {
  get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.get(url, { params, ...config });
  },

  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.post(url, data, config);
  },

  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.put(url, data, config);
  },

  del<T = any>(url: string, params?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.delete(url, { params, ...config });
  },

  upload<T = any>(url: string, file: File, config?: RequestConfig): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    return instance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    });
  },

  download(url: string, params?: any, config?: RequestConfig): Promise<Blob> {
    return instance.get(url, {
      params,
      responseType: 'blob',
      ...config,
    }) as any;
  },
};

export default request;
