// 内存中维护静态的用户数据
let rawUsers = Array.from({ length: 45 }).map((_, index) => {
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

export const userMock = {
  getUserList(query: any) {
    const page = parseInt(query.page || '1', 10);
    const pageSize = parseInt(query.pageSize || '10', 10);
    const username = (query.username || '').toLowerCase().trim();
    const status = query.status !== undefined && query.status !== '' ? parseInt(query.status, 10) : null;

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
  },

  createUser(body: any) {
    const newId = rawUsers.length > 0 ? Math.max(...rawUsers.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      username: body.username || `user_${newId}`,
      nickname: body.nickname || `普通用户_${newId}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      email: body.email || '',
      phone: body.phone || '',
      status: body.status !== undefined ? parseInt(body.status, 10) : 1,
      roles: body.roles || ['user'],
      permissions: ['system:user:list'],
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    rawUsers.unshift(newUser);

    return {
      code: 200,
      data: newUser,
      message: '新增成功',
      timestamp: Date.now(),
    };
  },

  updateUser(id: string, body: any) {
    const targetId = parseInt(id, 10);
    const index = rawUsers.findIndex(u => u.id === targetId);
    if (index !== -1) {
      rawUsers[index] = {
        ...rawUsers[index],
        ...body,
        id: targetId // 保证 id 不被篡改
      };
      return {
        code: 200,
        data: rawUsers[index],
        message: '修改成功',
        timestamp: Date.now(),
      };
    }
    return {
      code: 400,
      message: '用户不存在',
      timestamp: Date.now(),
    };
  },

  deleteUser(id: string) {
    const targetId = parseInt(id, 10);
    rawUsers = rawUsers.filter(u => u.id !== targetId);
    return {
      code: 200,
      data: { id: targetId },
      message: '删除成功',
      timestamp: Date.now(),
    };
  },

  updateUserStatus(id: string, status: number) {
    const targetId = parseInt(id, 10);
    const user = rawUsers.find(u => u.id === targetId);
    if (user) {
      user.status = status;
      return {
        code: 200,
        data: { id: targetId, status },
        message: '修改成功',
        timestamp: Date.now(),
      };
    }
    return {
      code: 400,
      message: '用户不存在',
      timestamp: Date.now(),
    };
  },

  batchDeleteUsers(ids: any[]) {
    const numericIds = (ids || []).map(id => parseInt(id, 10));
    rawUsers = rawUsers.filter(u => !numericIds.includes(u.id));
    return {
      code: 200,
      data: { ids: numericIds },
      message: '批量删除成功',
      timestamp: Date.now(),
    };
  }
};
