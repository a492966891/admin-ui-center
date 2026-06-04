// server/api/mock/system/user/batch-delete.post.ts

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { ids } = body || {};
  
  return {
    code: 200,
    data: {
      ids,
    },
    message: '批量删除成功',
    timestamp: Date.now(),
  };
});
