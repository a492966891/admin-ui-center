// server/api/mock/system/menu/[id].put.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  return {
    code: 200,
    data: { id, ...body },
    message: '菜单编辑成功',
    timestamp: Date.now(),
  };
});
