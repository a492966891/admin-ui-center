// server/api/mock/system/user.post.ts

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  return {
    code: 200,
    data: {
      id: Math.floor(Math.random() * 1000) + 100,
      ...body,
    },
    message: '新增成功',
    timestamp: Date.now(),
  };
});
