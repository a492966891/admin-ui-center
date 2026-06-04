// server/api/mock/user-info.get.ts

export default defineEventHandler((event) => {
  const auth = getHeader(event, 'authorization') || '';
  const token = auth.replace('Bearer ', '');

  // 默认是 admin
  let username = 'admin';
  let nickname = '超级管理员';
  let roles = ['admin'];
  let permissions = ['*:*:*']; // 代表所有权限
  let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'; // 精美头像

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
    ]; // test 只有部分查询权限，没有修改删除权限
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
});
