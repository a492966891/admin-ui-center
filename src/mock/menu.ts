export const menuList = [
  {
    id: 1,
    parentId: null,
    name: 'Dashboard',
    path: '/dashboard',
    component: 'dashboard/index',
    meta: {
      title: '仪表盘',
      icon: 'Odometer',
      keepAlive: true,
      hidden: false,
      permissions: [],
      isExternal: false,
      isIframe: false,
      sort: 1,
    },
  },
  {
    id: 2,
    parentId: null,
    name: 'System',
    path: '/system',
    component: '',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      keepAlive: true,
      hidden: false,
      permissions: [],
      isExternal: false,
      isIframe: false,
      sort: 2,
    },
    children: [
      {
        id: 3,
        parentId: 2,
        name: 'User',
        path: '/system/user',
        component: 'system/user/index',
        meta: {
          title: '用户管理',
          icon: 'User',
          keepAlive: true,
          hidden: false,
          permissions: ['system:user:list'],
          isExternal: false,
          isIframe: false,
          sort: 1,
        },
      },
      {
        id: 4,
        parentId: 2,
        name: 'Role',
        path: '/system/role',
        component: 'system/role/index',
        meta: {
          title: '角色管理',
          icon: 'Avatar',
          keepAlive: true,
          hidden: false,
          permissions: ['system:role:list'],
          isExternal: false,
          isIframe: false,
          sort: 2,
        },
      },
      {
        id: 5,
        parentId: 2,
        name: 'Menu',
        path: '/system/menu',
        component: 'system/menu/index',
        meta: {
          title: '菜单管理',
          icon: 'Menu',
          keepAlive: true,
          hidden: false,
          permissions: ['system:menu:list'],
          isExternal: false,
          isIframe: false,
          sort: 3,
        },
      },
      {
        id: 6,
        parentId: 2,
        name: 'Dict',
        path: '/system/dict',
        component: 'system/dict/index',
        meta: {
          title: '字典管理',
          icon: 'Collection',
          keepAlive: true,
          hidden: false,
          permissions: ['system:dict:list'],
          isExternal: false,
          isIframe: false,
          sort: 4,
        },
      },
    ],
  },
  {
    id: 7,
    parentId: null,
    name: 'Monitor',
    path: '/monitor',
    component: '',
    meta: {
      title: '系统监控',
      icon: 'Monitor',
      keepAlive: true,
      hidden: false,
      permissions: [],
      isExternal: false,
      isIframe: false,
      sort: 3,
    },
    children: [
      {
        id: 8,
        parentId: 7,
        name: 'Online',
        path: '/monitor/online',
        component: 'monitor/online/index',
        meta: {
          title: '在线用户',
          icon: 'UserFilled',
          keepAlive: true,
          hidden: false,
          permissions: ['monitor:online:list'],
          isExternal: false,
          isIframe: false,
          sort: 1,
        },
      },
      {
        id: 9,
        parentId: 7,
        name: 'Logs',
        path: '/monitor/logs',
        component: 'monitor/logs/index',
        meta: {
          title: '操作日志',
          icon: 'Document',
          keepAlive: true,
          hidden: false,
          permissions: ['monitor:logs:list'],
          isExternal: false,
          isIframe: false,
          sort: 2,
        },
      },
    ],
  },
  {
    id: 10,
    parentId: null,
    name: 'Profile',
    path: '/profile',
    component: 'profile/index',
    meta: {
      title: '个人中心',
      icon: 'User',
      keepAlive: true,
      hidden: true,
      permissions: [],
      isExternal: false,
      isIframe: false,
      sort: 99,
    },
  },
];

export const menuMock = {
  getMenuList() {
    return {
      code: 200,
      data: menuList,
      message: '获取成功',
      timestamp: Date.now(),
    };
  },

  createMenu(body: any) {
    return {
      code: 200,
      data: body,
      message: '菜单新增成功',
      timestamp: Date.now(),
    };
  },

  updateMenu(id: string, body: any) {
    return {
      code: 200,
      data: { id, ...body },
      message: '菜单编辑成功',
      timestamp: Date.now(),
    };
  },

  deleteMenu(id: string) {
    return {
      code: 200,
      data: { id },
      message: '菜单删除成功',
      timestamp: Date.now(),
    };
  }
};
