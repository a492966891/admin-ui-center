// server/api/mock/system/user/[id]/status.put.ts

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  return {
    code: 200,
    data: {
      id: id ? parseInt(id, 10) : null,
      status: body?.status,
    },
    message: '修改成功',
    timestamp: Date.now(),
  };
});
