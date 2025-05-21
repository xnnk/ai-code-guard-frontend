# AI Code Guard Frontend

这是 [AICodeGuard](https://github.com/xnnk/AICodeGuard) 项目的前端部分，一个基于 AI 大模型的智能代码安全与生成平台的前端实现。

## 项目简介

AI Code Guard Frontend 是 AICodeGuard 平台的前端项目，提供了直观的用户界面和强大的代码编辑功能。本项目实现了以下核心功能：

- **代码生成界面**：提供友好的代码生成交互界面，支持多种 AI 模型选择
- **代码安全扫描**：可视化展示代码安全扫描结果和漏洞分析
- **知识图谱展示**：直观展示代码模式和相关知识图谱
- **对话式交互**：支持与 AI 模型的实时对话，包括流式响应
- **代码管理**：提供已生成代码的列表查看、详情展示和删除功能
- **用户管理**：实现用户认证、注册、登录等基础功能

## 项目结构

```
ai-code-guard-frontend/
├── app/                    # Next.js 应用主目录
│   ├── api/               # API 路由
│   ├── components/        # 可复用组件
│   ├── hooks/            # 自定义 Hooks
│   ├── lib/              # 工具函数和配置
│   ├── store/            # Zustand 状态管理
│   └── types/            # TypeScript 类型定义
├── public/                # 静态资源
├── styles/               # 全局样式
└── tests/                # 测试文件
```

## 技术栈

- **框架**: Next.js 15.3.2
- **UI 组件**: 
  - Headless UI
  - Heroicons
  - React Icons
- **代码编辑器**: Monaco Editor
- **状态管理**: Zustand
- **表单处理**: React Hook Form + Yup
- **样式**: Tailwind CSS
- **HTTP 客户端**: Axios
- **开发语言**: TypeScript

## 环境要求

- Node.js 18.0.0 或更高版本
- npm 或 yarn 或 pnpm 或 bun
- 需要配合 [AICodeGuard](https://github.com/xnnk/AICodeGuard) 后端服务运行

## 开始使用

首先，确保您已经按照 [AICodeGuard](https://github.com/xnnk/AICodeGuard) 的说明部署了后端服务。

然后，安装依赖：

```bash
npm install
# 或
yarn install
# 或
pnpm install
# 或
bun install
```

配置环境变量：
1. 复制 `.env.example` 文件为 `.env.local`
2. 修改 `.env.local` 中的后端服务地址配置

运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

您可以通过修改 `app/page.tsx` 文件来开始编辑页面。当您编辑文件时，页面会自动更新。

本项目使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化并加载 [Geist](https://vercel.com/font)，这是 Vercel 的新字体系列。

## 开发指南

### 代码规范

- 使用 ESLint 和 Prettier 进行代码格式化和检查
- 遵循 TypeScript 严格模式
- 组件使用函数式组件和 Hooks
- 使用 Tailwind CSS 进行样式管理

### 状态管理

- 使用 Zustand 进行全局状态管理
- 按功能模块划分 store
- 使用 TypeScript 类型定义确保类型安全

### API 调用

- 使用 Axios 进行 HTTP 请求
- 统一的错误处理和响应拦截
- 支持请求取消和重试机制

### 测试

- 使用 Jest 和 React Testing Library 进行单元测试
- 使用 Cypress 进行端到端测试
- 保持测试覆盖率在 80% 以上

## 项目脚本

- `npm run dev`: 启动开发服务器（使用 Turbopack）
- `npm run build`: 构建生产版本
- `npm run start`: 启动生产服务器
- `npm run lint`: 运行代码检查
- `npm run test`: 运行单元测试
- `npm run test:e2e`: 运行端到端测试
- `npm run format`: 格式化代码

## 贡献指南

我们欢迎任何形式的贡献，包括但不限于：

1. 提交 Bug 报告
2. 提出新功能建议
3. 改进文档
4. 提交代码改进

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 提交规范

提交信息应遵循以下格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

type 类型：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

## 了解更多

要了解更多关于 Next.js 的信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的特性和 API。
- [学习 Next.js](https://nextjs.org/learn) - 交互式 Next.js 教程。

您可以查看 [Next.js GitHub 仓库](https://github.com/vercel/next.js) - 欢迎您的反馈和贡献！

## 在 Vercel 上部署

部署 Next.js 应用最简单的方法是使用 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)，这是由 Next.js 的创建者提供的。

查看我们的 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多详情。

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件
