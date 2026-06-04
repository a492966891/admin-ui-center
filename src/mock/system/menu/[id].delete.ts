// server/api/mock/system/menu/[id].delete.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  return {
    code: 200,
    data: { id },
    message: '菜单删除成功',
    timestamp: Date.now(),
  };
});
