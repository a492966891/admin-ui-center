import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite';
import { fileURLToPath, URL } from 'url';
import fs from 'fs';
import path from 'path';
import url from 'url';

// 封装一个简单的 Vite Mock 兼容插件，使 src/mock 下的 Nuxt/Nitro 风格的 Mock 文件无缝运行
function viteMockPlugin() {
  return {
    name: 'vite-plugin-mock-nitro-compat',
    configureServer(server: any) {
      // 1. 全局挂载 Nitro 的通用兼容函数
      (globalThis as any).defineEventHandler = (handler: any) => handler;
      
      (globalThis as any).readBody = async (event: any) => {
        return new Promise((resolve) => {
          let body = '';
          event.req.on('data', (chunk: any) => { body += chunk; });
          event.req.on('end', () => {
            try {
              resolve(JSON.parse(body));
            } catch {
              resolve({});
            }
          });
        });
      };

      (globalThis as any).getQuery = (event: any) => {
        const urlObj = url.parse(event.req.url || '', true);
        return urlObj.query;
      };

      (globalThis as any).getHeader = (event: any, name: string) => {
        return event.req.headers[name.toLowerCase()] || '';
      };

      (globalThis as any).getRouterParam = (event: any, name: string) => {
        return event.context.params?.[name];
      };

      // 2. 中间件拦截请求并分发
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const reqUrl = req.url || '';
        const parsedUrl = url.parse(reqUrl);
        const pathname = parsedUrl.pathname || '';
        const method = (req.method || 'GET').toLowerCase();

        // 拦截以 /api/mock/ 开头的请求
        if (pathname.startsWith('/api/mock')) {
          const relativePath = pathname.replace('/api/mock', '');
          const mockBaseDir = path.resolve(__dirname, './src/mock');
          
          // 深度查找匹配的 mock 文件
          const findMockFile = (dir: string, urlParts: string[]): { file: string; params: Record<string, string> } | null => {
            if (!fs.existsSync(dir)) return null;
            const files = fs.readdirSync(dir);
            const currentPart = urlParts[0];

            if (urlParts.length === 1) {
              // 寻找精确匹配文件，如 login.post.ts 或 menu.get.ts
              const exactName = `${currentPart}.${method}.ts`;
              if (files.includes(exactName)) {
                return { file: path.join(dir, exactName), params: {} };
              }
              // 寻找动态路由文件，如 [id].delete.ts
              const dynamicPattern = files.find(f => f.startsWith('[') && f.endsWith(`].${method}.ts`));
              if (dynamicPattern) {
                const paramName = dynamicPattern.slice(1, -`.${method}.ts`.length - 1);
                return {
                  file: path.join(dir, dynamicPattern),
                  params: { [paramName]: currentPart }
                };
              }
            } else {
              // 目录层级匹配
              if (files.includes(currentPart) && fs.statSync(path.join(dir, currentPart)).isDirectory()) {
                const result = findMockFile(path.join(dir, currentPart), urlParts.slice(1));
                if (result) return result;
              }
              // 动态目录层级匹配，如 [id]/index.ts 等
              const dynamicDir = files.find(f => f.startsWith('[') && f.endsWith(']') && fs.statSync(path.join(dir, f)).isDirectory());
              if (dynamicDir) {
                const paramName = dynamicDir.slice(1, -1);
                const result = findMockFile(path.join(dir, dynamicDir), urlParts.slice(1));
                if (result) {
                  result.params[paramName] = currentPart;
                  return result;
                }
              }
            }
            return null;
          }

          const urlParts = relativePath.split('/').filter(Boolean);
          const matchResult = findMockFile(mockBaseDir, urlParts);

          if (matchResult) {
            try {
              // 利用 Vite 的 ssrLoadModule 动态编译并加载 TypeScript 模块
              const module = await server.ssrLoadModule(matchResult.file);
              const handler = module.default;

              const event = {
                req,
                res,
                context: {
                  params: matchResult.params
                }
              };

              const data = await handler(event);
              
              if (!res.writableEnded) {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(data));
              }
            } catch (err: any) {
              console.error(`[Vite Mock compat error] at ${reqUrl}:`, err);
              if (!res.writableEnded) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(`Vite Mock compat error: ${err.message}`);
              }
            }
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(`Mock Endpoint Not Found: ${req.method} ${pathname}`);
          }
        } else {
          next();
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ElementPlus({
      useSource: false,
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        {
          'pinia': ['defineStore', 'storeToRefs']
        }
      ],
      // 自动导入 stores 下的模块以及 utils 等
      dirs: [
        'src/composables/**',
        'src/stores/modules/**',
        'src/utils/**'
      ],
      dts: 'src/auto-imports.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dirs: ['src/components'],
      dts: 'src/components.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
    viteMockPlugin(),
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 向所有 SCSS 文件及 Vue 组件中的 style 标签全局注入变量和 mixin
        additionalData: `@use "@/assets/styles/variables.scss" as *; @use "@/assets/styles/mixins.scss" as *;`,
      }
    }
  },
  server: {
    port: 3000,
    host: true,
  }
});
