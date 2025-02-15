﻿# Cloudflare Homepage
 ![Visitors](https://visitor-badge.laobi.icu/badge?page_id=laolaoshiren.cloudflare-homepage)
![GitHub stars](https://img.shields.io/github/stars/laolaoshiren/cloudflare-homepage?style=social)
![GitHub forks](https://img.shields.io/github/forks/laolaoshiren/cloudflare-homepage?style=social)
![GitHub issues](https://img.shields.io/github/issues/laolaoshiren/cloudflare-homepage)
![GitHub license](https://img.shields.io/github/license/laolaoshiren/cloudflare-homepage)

基于 Cloudflare Workers 和 Pages 构建的现代化个人主页系统。使用 React + TypeScript 开发，采用 Cloudflare 的边缘计算能力，提供快速、安全且易于部署的个人主页解决方案。

简体中文 | [English](./README_EN.md)

## ✨ 特性

- 🚀 基于边缘计算的高性能架构
- 💻 响应式设计，完美适配各种设备
- 🎨 现代化 UI 设计，支持动画效果
- 🔒 内置管理后台，安全可靠
- 📱 支持社交链接和联系方式管理
- 🌐 全球 CDN 加速

## 📦 技术栈

- **前端**：
  - React 18
  - TypeScript
  - Styled Components
  - Vite

- **后端**：
  - Cloudflare Workers
  - D1 Database (SQLite)
  - KV Storage

- **部署**：
  - Cloudflare Pages
  - Wrangler CLI
  - GitHub Actions

## 🚀 快速开始

### 前置要求

- Node.js 16+
- npm 或 yarn
- Cloudflare 账号
- Wrangler CLI (`npm install -g wrangler`)

### 详细安装步骤

1. **克隆项目**
bash
git clone https://github.com/your-username/cloudflare-homepage.git
cd cloudflare-homepage

2. **安装依赖**
```bash
# 安装主项目依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env

# 修改环境变量
# API_BASE_URL=https://your-api.workers.dev
# ADMIN_PASSWORD=your-secure-password
```

4. **配置 Cloudflare**
```bash
# 登录 Cloudflare
wrangler login

# 创建 D1 数据库
wrangler d1 create portfolio_db

# 创建 KV 命名空间
wrangler kv:namespace create PORTFOLIO_KV
```

5. **初始化数据库**
```bash
# 执行数据库迁移
npm run db:init
```

### 部署命令

#### 快速部署（推荐）
```bash
npm run quick-update
```
此命令会自动执行：
- Worker 构建和部署
- 前端构建和部署
- 数据库迁移

#### 完整部署（包含验证）
```bash
npm run update
```
此命令额外包含：
- 依赖检查
- 部署验证
- 错误处理

### 本地开发

1. **启动 Worker**
```bash
npm run dev
```

2. **启动前端**
```bash
cd frontend
npm run dev
```

## 📖 项目结构

```
cloudflare-homepage/
├── src/                # Worker 源码
│   └── worker/        # Worker 主要逻辑
├── frontend/          # 前端项目
│   ├── src/          # 前端源码
│   ├── public/       # 静态资源
│   └── index.html    # HTML 模板
├── migrations/        # 数据库迁移文件
├── scripts/          # 部署脚本
├── wrangler.toml     # Cloudflare 配置
└── package.json
```

## ⚙️ 配置说明

### 环境变量
```env
# API 地址
API_BASE_URL=https://cloudflare-homepage-api.workers.dev

# 管理员密码
ADMIN_PASSWORD=your-secure-password
```

### Wrangler 配置
```toml
name = "cloudflare-homepage-api"
main = "dist/worker/index.js"

[vars]
ALLOWED_ORIGINS = "https://cloudflare-homepage.pages.dev"
```

## 🔧 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build           # 构建项目
npm run deploy          # 部署 Worker

# 数据库
npm run db:init         # 初始化数据库
npm run db:migrate      # 执行迁移

# 部署
npm run quick-update    # 快速部署
npm run update          # 完整部署

# 前端开发
cd frontend
npm run dev            # 启动前端开发服务器
npm run build          # 构建前端项目
```

## ❗ 常见问题

### 部署失败
Q: 遇到 `Error: Worker not found`
A: 检查 `wrangler.toml` 中的 worker 名称是否正确

### 数据库错误
Q: 遇到 `D1_ERROR: no such table`
A: 执行 `npm run db:init` 初始化数据库

### 前端构建错误
Q: TypeScript 编译错误
A: 检查类型定义，确保所有依赖都已正确安装

### 访问权限问题
Q: 无法访问管理后台
A: 检查 `ADMIN_PASSWORD` 配置是否正确

## 🔨 开发指南

### Git 提交规范
```bash
git add .
git commit -m "type: description"
```

提交类型：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

### 分支管理
- `main`: 主分支，用于发布
- `dev`: 开发分支
- `feature/*`: 功能分支
- `fix/*`: 修复分支

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 鸣谢

- [React](https://reactjs.org/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Styled Components](https://styled-components.com/)
```



