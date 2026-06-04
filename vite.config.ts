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
    proxy: {
      '/api': {
        target: 'http://192.168.0.0:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
