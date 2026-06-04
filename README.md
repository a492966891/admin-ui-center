# 🤖 Admin Center — Nuxt 4 企业级后台管理系统

这是一个基于 Nuxt 4、TypeScript、Element Plus、Pinia、ECharts 5 搭建的企业级后台管理系统。系统具备完整的前后端权限隔离机制、动态路由生成拦截、双向 Axios 封装和炫酷毛玻璃登录面板。

## 🏗️ 技术栈

| 分类 | 技术选型 |
|------|---------|
| 框架 | Nuxt 4 (最新稳定版 SPA 模式) |
| 语言 | TypeScript (严格类型检查模式) |
| UI 组件库 | Element Plus (含完整图标库全量注册) |
| 状态管理 | Pinia (集成 localStorage 状态持久化) |
| 图表库 | ECharts 5 + vue-echarts (支持 autoresize) |
| 网络请求 | Axios (含 UUID 请求 ID 及无感 token 过期拦截) |
| 样式 | SCSS + CSS Variables (支持全局亮暗主题及主色调动态调整) |

---

## 📁 目录结构

系统代码遵循 Nuxt 4 规范，除服务端 API 模拟外，所有前端源文件统一存放在 `app/` 目录下：

```
admin-center/
├── app/                              # 前端源码目录
│   ├── assets/styles/                # 全局 SCSS 变量与样式重置
│   ├── components/                   # 自定义组件 (通用组件与布局组件)
│   ├── composables/                  # 组合式函数 (主题色、按钮权限判断)
│   ├── layouts/                      # 页面布局 (Default, Auth, Blank)
│   ├── middleware/                   # 路由中间件 (全局路由认证与动态挂载)
│   ├── pages/                        # 业务页面 (登录页、仪表盘、系统管理、监控)
│   ├── plugins/                      # 注入插件 (指令、Element 图标、ECharts)
│   ├── stores/                       # Pinia Store 模块
│   ├── types/                        # 声明定义类型
│   ├── utils/                        # 辅助工具类 (Axios request 封装)
│   └── app.vue                       # 应用主视图入口
├── server/                           # 服务端 Node 代码
│   └── api/mock/                     # Mock 模拟接口服务
├── nuxt.config.ts                    # Nuxt 配置文件
├── package.json                      # 依赖项清单
└── README.md                         # 本说明文件
```

---

## 🚀 快速启动

若要在您的本地机器中启动项目，请按照以下顺序执行命令：

### 1. 安装依赖包
由于本项目使用 pnpm 管理依赖锁，推荐使用 pnpm：
```bash
pnpm install
```
*注：如本地未配置 pnpm 环境变量，可选用 `npm install`。*

### 2. 生成 Nuxt 缓存与类型定义
```bash
npx nuxi prepare
```

### 3. 本地开发服务器启动
```bash
pnpm dev
```
启动成功后，在浏览器访问：[http://localhost:3000](http://localhost:3000)

**默认测试凭证：**
- **超级管理员：** `admin` / `123456`
- **测试普通用户：** `test` / `123456`

### 4. 静态类型检查
```bash
pnpm typecheck
```
