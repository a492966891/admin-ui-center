export const authMock = {
  login(body: any) {
    const { username, password } = body || {};

    if ((username === 'admin' || username === 'test') && password === '123456') {
      return {
        code: 200,
        data: {
          token: `mock-token-${username}-${Date.now()}`,
          refreshToken: `mock-refresh-token-${username}-${Date.now()}`,
        },
        message: '登录成功',
        timestamp: Date.now(),
      };
    }

    return {
      code: 400,
      data: null,
      message: '用户名或密码错误 (提示：密码为 123456)',
      timestamp: Date.now(),
    };
  },

  getUserInfo(headers: Record<string, string>) {
    const auth = headers['authorization'] || headers['Authorization'] || '';
    const token = auth.replace('Bearer ', '');

    // 默认是 admin
    let username = 'admin';
    let nickname = '超级管理员';
    let roles = ['admin'];
    let permissions = ['*:*:*']; // 代表所有权限
    let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

    if (token.includes('test')) {
      username = 'test';
      nickname = '测试用户';
      roles = ['editor'];
      permissions = [
        'system:user:list',
        'system:role:list',
        'system:menu:list',
        'system:dict:list',
        'monitor:online:list',
      ];
      avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200';
    }

    return {
      code: 200,
      data: {
        id: username === 'admin' ? 1 : 2,
        username,
        nickname,
        avatar,
        email: `${username}@example.com`,
        phone: username === 'admin' ? '18888888888' : '13999999999',
        status: 1,
        roles,
        permissions,
        createTime: '2026-01-01 12:00:00',
      },
      message: '获取成功',
      timestamp: Date.now(),
    };
  },

  refreshToken(body: any) {
    const { refreshToken } = body || {};
    if (!refreshToken) {
      return {
        code: 401,
        message: 'Refresh Token 不能为空',
        timestamp: Date.now(),
      };
    }
    return {
      code: 200,
      data: {
        token: `mock-token-refresh-${Date.now()}`,
        refreshToken: `mock-refresh-token-refresh-${Date.now()}`,
      },
      message: '刷新成功',
      timestamp: Date.now(),
    };
  }
};
