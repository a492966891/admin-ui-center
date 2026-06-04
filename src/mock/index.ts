import { authMock } from './auth';
import { menuMock } from './menu';
import { userMock } from './user';
import { dashboardMock } from './dashboard';
import { debugMock } from './debug';

interface MockRoute {
  pattern: RegExp;
  method: string;
  handler: (matches: string[], config: any) => any;
}

const routes: MockRoute[] = [
  // Auth
  {
    pattern: /^\/mock\/login$/,
    method: 'POST',
    handler: (_, config) => authMock.login(config.data),
  },
  {
    pattern: /^\/mock\/user-info$/,
    method: 'GET',
    handler: (_, config) => authMock.getUserInfo(config.headers || {}),
  },
  {
    pattern: /^\/mock\/refresh-token$/,
    method: 'POST',
    handler: (_, config) => authMock.refreshToken(config.data),
  },
  
  // Menu
  {
    pattern: /^\/mock\/menu$/,
    method: 'GET',
    handler: () => menuMock.getMenuList(),
  },
  {
    pattern: /^\/mock\/system\/menu$/,
    method: 'POST',
    handler: (_, config) => menuMock.createMenu(config.data),
  },
  {
    pattern: /^\/mock\/system\/menu\/([^/]+)$/,
    method: 'PUT',
    handler: (matches, config) => menuMock.updateMenu(matches[1], config.data),
  },
  {
    pattern: /^\/mock\/system\/menu\/([^/]+)$/,
    method: 'DELETE',
    handler: (matches) => menuMock.deleteMenu(matches[1]),
  },

  // User
  {
    pattern: /^\/mock\/system\/users$/,
    method: 'GET',
    handler: (_, config) => userMock.getUserList(config.params || {}),
  },
  {
    pattern: /^\/mock\/system\/user$/,
    method: 'POST',
    handler: (_, config) => userMock.createUser(config.data),
  },
  {
    pattern: /^\/mock\/system\/user\/([^/]+)\/status$/,
    method: 'PUT',
    handler: (matches, config) => userMock.updateUserStatus(matches[1], config.data?.status),
  },
  {
    pattern: /^\/mock\/system\/user\/batch-delete$/,
    method: 'POST',
    handler: (_, config) => userMock.batchDeleteUsers(config.data?.ids),
  },
  {
    pattern: /^\/mock\/system\/user\/([^/]+)$/,
    method: 'PUT',
    handler: (matches, config) => userMock.updateUser(matches[1], config.data),
  },
  {
    pattern: /^\/mock\/system\/user\/([^/]+)$/,
    method: 'DELETE',
    handler: (matches) => userMock.deleteUser(matches[1]),
  },

  // Dashboard
  {
    pattern: /^\/mock\/dashboard\/stats$/,
    method: 'GET',
    handler: () => dashboardMock.getStats(),
  },

  // Debug
  {
    pattern: /^\/mock\/debug$/,
    method: 'POST',
    handler: (_, config) => debugMock.logDebug(config.data),
  }
];

export async function handleMockRequest(config: any): Promise<any> {
  // 兼容不同的 Axios 参数类型（config.data 有时是 string，需要 JSON.parse 处理）
  if (typeof config.data === 'string') {
    try {
      config.data = JSON.parse(config.data);
    } catch {
      // 忽略解析失败
    }
  }

  const urlPath = (config.url || '').split('?')[0].replace(/^\/api/, '');
  const method = (config.method || 'GET').toUpperCase();

  for (const route of routes) {
    if (route.method === method) {
      const match = urlPath.match(route.pattern);
      if (match) {
        // 延迟模拟网络响应时间（200ms），使页面有微弱的加载反馈，体验更佳
        await new Promise(resolve => setTimeout(resolve, 200));
        const resData = route.handler(match, config);
        
        return {
          data: resData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };
      }
    }
  }

  return Promise.reject({
    status: 404,
    statusText: 'Mock Not Found',
    data: {
      code: 404,
      message: `Mock Endpoint Not Found: ${method} ${urlPath}`
    },
    config
  });
}
