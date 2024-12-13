# Cloudflare Homepage

A modern personal homepage system built with Cloudflare Workers and Pages, developed using React + TypeScript. Leveraging Cloudflare's edge computing capabilities to provide a fast, secure, and easily deployable personal homepage solution.

[简体中文](./README.md) | English

## ✨ Features

- 🚀 High-performance edge computing architecture
- 💻 Responsive design for all devices
- 🎨 Modern UI with animations
- 🔒 Built-in secure admin panel
- 📱 Social links and contact management
- 🌐 Global CDN acceleration

## 📦 Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Styled Components
  - Vite

- **Backend**:
  - Cloudflare Workers
  - D1 Database (SQLite)
  - KV Storage

- **Deployment**:
  - Cloudflare Pages
  - Wrangler CLI
  - GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-username/cloudflare-homepage.git
cd cloudflare-homepage
```

2. **Install dependencies**
```bash
# Install main project dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. **Configure environment**
```bash
# Copy environment template
cp .env.example .env

# Modify environment variables
# API_BASE_URL=https://your-api.workers.dev
# ADMIN_PASSWORD=your-secure-password
```

4. **Configure Cloudflare**
```bash
# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create portfolio_db

# Create KV namespace
wrangler kv:namespace create PORTFOLIO_KV
```

5. **Initialize database**
```bash
# Run database migrations
npm run db:init
```

### Deployment Commands

#### Quick Deployment (Recommended)
```bash
npm run quick-update
```
This command automatically:
- Builds and deploys Worker
- Builds and deploys frontend
- Runs database migrations

#### Full Deployment (With Verification)
```bash
npm run update
```
This command additionally includes:
- Dependency checks
- Deployment verification
- Error handling

### Local Development

1. **Start Worker**
```bash
npm run dev
```

2. **Start Frontend**
```bash
cd frontend
npm run dev
```

## 📖 Project Structure

```
cloudflare-homepage/
├── src/                # Worker source code
│   └── worker/        # Worker main logic
├── frontend/          # Frontend project
│   ├── src/          # Frontend source
│   ├── public/       # Static assets
│   └── index.html    # HTML template
├── migrations/        # Database migrations
├── scripts/          # Deployment scripts
├── wrangler.toml     # Cloudflare config
└── package.json
```

## ⚙️ Configuration

### Environment Variables
```env
# API URL
API_BASE_URL=https://cloudflare-homepage-api.workers.dev

# Admin password
ADMIN_PASSWORD=your-secure-password
```

### Wrangler Configuration
```toml
name = "cloudflare-homepage-api"
main = "dist/worker/index.js"

[vars]
ALLOWED_ORIGINS = "https://cloudflare-homepage.pages.dev"
```

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build project
npm run deploy          # Deploy Worker

# Database
npm run db:init         # Initialize database
npm run db:migrate      # Run migrations

# Deployment
npm run quick-update    # Quick deployment
npm run update          # Full deployment

# Frontend Development
cd frontend
npm run dev            # Start frontend dev server
npm run build          # Build frontend
```

## ❗ Common Issues

### Deployment Failed
Q: Getting `Error: Worker not found`
A: Check if the worker name in `wrangler.toml` is correct

### Database Error
Q: Getting `D1_ERROR: no such table`
A: Run `npm run db:init` to initialize the database

### Frontend Build Error
Q: TypeScript compilation errors
A: Check type definitions and ensure all dependencies are properly installed

### Access Issues
Q: Cannot access admin panel
A: Verify `ADMIN_PASSWORD` configuration

## 🔨 Development Guide

### Git Commit Convention
```bash
git add .
git commit -m "type: description"
```

Commit types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code formatting
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Build/tooling

### Branch Management
- `main`: Main branch for releases
- `dev`: Development branch
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Styled Components](https://styled-components.com/) 