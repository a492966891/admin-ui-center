// server/api/mock/system/users.get.ts

// 内存中维护静态的用户数据
const rawUsers = Array.from({ length: 45 }).map((_, index) => {
  const id = index + 1;
  const username = id === 1 ? 'admin' : id === 2 ? 'test' : `user_${id.toString().padStart(3, '0')}`;
  const nickname = id === 1 ? '超级管理员' : id === 2 ? '测试用户' : `普通用户_${id}`;
  const roles = id === 1 ? ['admin'] : id === 2 ? ['editor'] : ['user'];
  
  return {
    id,
    username,
    nickname,
    avatar: id % 2 === 0
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    email: `${username}@example.com`,
    phone: `138${String(10000000 + id).substring(1)}`,
    status: id % 7 === 0 ? 0 : 1, // 少数禁用
    roles,
    permissions: id === 1 ? ['*:*:*'] : ['system:user:list'],
    createTime: `2026-05-${String(id % 28 + 1).padStart(2, '0')} 14:30:00`,
  };
});

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const page = parseInt(query.page as string || '1', 10);
  const pageSize = parseInt(query.pageSize as string || '10', 10);
  const username = (query.username as string || '').toLowerCase().trim();
  const status = query.status !== undefined && query.status !== '' ? parseInt(query.status as string, 10) : null;

  // 1. 进行过滤
  let filtered = [...rawUsers];
  
  if (username) {
    filtered = filtered.filter(
      (u) =>
        u.username.toLowerCase().includes(username) ||
        u.nickname.toLowerCase().includes(username)
    );
  }
  
  if (status !== null) {
    filtered = filtered.filter((u) => u.status === status);
  }

  // 2. 进行分页切片
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageList = filtered.slice(start, end);

  return {
    code: 200,
    data: {
      list: pageList,
      total,
      page,
      pageSize,
    },
    message: '获取成功',
    timestamp: Date.now(),
  };
});
