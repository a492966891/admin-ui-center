// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false, // 后台管理系统为单页SPA模式

  app: {
    head: {
      title: '后台管理系统',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '基于 Nuxt 4 + Element Plus 的企业级后台管理系统' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    '@element-plus/nuxt',
  ],

  // 引入全局 CSS 样式
  css: ['~/assets/styles/global.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 向所有 Vue 组件和样式表中全局注入 SCSS 变量和 mixin
          additionalData: `@use "~/assets/styles/variables.scss" as *; @use "~/assets/styles/mixins.scss" as *;`,
        },
      },
    },
  },

  typescript: {
    strict: true,
    shim: false,
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      appTitle: process.env.NUXT_PUBLIC_APP_TITLE || '管理后台',
      appVersion: '1.0.0',
    },
  },

  // 配置自动引入的 Store 模块和 Composable
  imports: {
    dirs: ['stores/modules', 'composables'],
  },
})
