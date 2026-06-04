// server/api/mock/login.post.ts

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
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
});
