// server/api/mock/system/menu.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return {
    code: 200,
    data: body,
    message: '菜单新增成功',
    timestamp: Date.now(),
  };
});
