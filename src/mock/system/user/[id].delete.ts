// server/api/mock/system/user/[id].delete.ts

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id');
  
  return {
    code: 200,
    data: {
      id: id ? parseInt(id, 10) : null,
    },
    message: '删除成功',
    timestamp: Date.now(),
  };
});
