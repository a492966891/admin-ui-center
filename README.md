# 🤖 Admin Center — Vite + Vue 3 企业级后台管理系统

这是一个基于 **Vite**、**Vue 3**、**TypeScript**、**Element Plus**、**Pinia** 和 **ECharts 5** 搭建的高性能企业级后台管理系统（SPA 单页应用）。项目从原有的 Nuxt 4 框架优雅平替升级至纯 Vite 生态，剔除了 SSR 冗余，显著提升了本地启动效率和打包构建速度。

---

## 🏗️ 技术栈

| 分类 | 技术选型 | 说明 |
|------|---------|------|
| **构建工具** | Vite (最新稳定版) | 提供秒级的本地热重载（HMR）与极速的编译体验 |
| **基础框架** | Vue 3 (单页应用 SPA) | 响应式核心与 Composition API |
| **语言** | TypeScript | 严格类型检查，支持高健壮性重构 |
| **UI 组件库** | Element Plus | 搭载全量按需自动引入与图标全量挂载 |
| **状态管理** | Pinia | 集成 `pinia-plugin-persistedstate` 实现 localStorage 状态持久化 |
| **图表库** | ECharts 5 + vue-echarts | 专业的图表可视化，支持 autoresize 视口自适应 |
| **网络请求** | Axios | 封装高定制化网络请求，支持取消重复请求、全局 Loading 与无感刷新 Token |
| **样式** | SCSS + CSS Variables | 拥有高质感的毛玻璃磨砂面板、全局亮暗主题及主色调动态调整机制 |

---

## 📁 目录结构

项目源码均收拢于 `src/` 目录下，保证了前台业务的高内聚性与整洁：

```text
admin-center/
├── src/                               # 核心源码目录
│   ├── assets/styles/                 # 全局 SCSS 变量、混合器与重置样式
│   ├── components/                    # 通用业务组件与布局自定义组件
│   ├── composables/                   # 组合式 Hooks 逻辑（主题管理、全屏控制等）
│   ├── layouts/                       # 框架布局模板（Default 侧边栏, Auth 登录, Blank 空白）
│   ├── mock/                          # 接口 Mock 数据源（Nitro 风格零修改兼容）
│   ├── pages/                         # 业务视图页面（控制台、系统管理、系统监控、个人中心）
│   ├── router/                        # 路由定义表与全局导航守卫
│   ├── stores/                        # Pinia Store 模块化状态
│   ├── types/                         # TypeScript 通用类型定义
│   ├── utils/                         # 工具类封装（Axios 网络拦截器、常用格式化函数）
│   ├── App.vue                        # 挂载应用全局布局的主视图入口
│   ├── main.ts                        # 项目引导与根组件挂载文件
│   └── vite-env.d.ts                  # 全局环境变量及 Vue 组件类型扩展定义
├── .env.development                   # 本地开发环境变量配置
├── .env.production                    # 生产环境部署变量配置
├── index.html                         # 单页面应用 Vite 主入口
├── vite.config.ts                     # Vite 构建、别名及兼容 Mock 插件配置
├── tsconfig.json                      # TS 主配置文件
├── tsconfig.node.json                 # 供 Vite 等 Node 脚本使用的 TS 配置
└── package.json                       # 依赖清单与构建脚本
```

---

## 🚀 快速启动

在您的本地机器中启动项目，请执行以下命令：

### 1. 安装依赖包
推荐使用 pnpm 作为包管理器以获得更佳的装包速度：
```bash
pnpm install
```
*注：若本地未安装 pnpm，亦可使用 `npm install`。*

### 2. 启动本地开发服务
```bash
pnpm dev
```
启动成功后（约用时 800ms），在浏览器访问：[http://localhost:3000](http://localhost:3000)

**默认测试凭证：**
- **超级管理员：** 用户名 `admin` / 密码 `123456`
- **普通测试用户：** 用户名 `test` / 密码 `123456`

### 3. 项目生产编译打包
进行静态类型检查并打包编译为 SPA 静态包：
```bash
pnpm build
```
编译产物将输出至根目录下的 `dist/` 目录。

### 4. 静态类型校验检查
```bash
pnpm typecheck
```
