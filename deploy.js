const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const execAsync = promisify(exec);

// 添加 node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 彩色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// 打印带颜色的消息
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

async function runCommand(command, description) {
  log.info(`${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    log.success(`${description} 完成`);
    return true;
  } catch (error) {
    log.error(`${description} 失败: ${error.message}`);
    return false;
  }
}

async function checkDependencies() {
  log.title('检查依赖');
  
  // 检查并安装主项目依赖
  if (!await runCommand('npm install', '安装主项目依赖')) return false;
  
  // 检查并安装前端依赖
  if (!await runCommand('cd frontend && npm install', '安装前端依赖')) return false;
  
  return true;
}

async function runMigrations() {
  log.title('执行数据库迁移');
  
  try {
    // 执行主数据库迁移（使用 --remote 标志）
    log.info('执行数据库迁移...');
    const migrationResult = await execAsync('npx wrangler d1 execute portfolio_db --remote --file=./migrations/init.sql');
    if (migrationResult.stderr) {
      console.error(migrationResult.stderr);
    }
    log.success('数据库迁移完成');

    // 验证表是否创建成功
    log.info('验证数据库表...');
    const { stdout } = await execAsync('npx wrangler d1 execute portfolio_db --remote --command="SELECT name FROM sqlite_master WHERE type=\'table\';"');
    const tables = stdout.toString().toLowerCase();
    
    // 检查必需的表是否存在
    const requiredTables = ['projects', 'contacts', 'links'];
    const missingTables = requiredTables.filter(table => !tables.includes(table));
    
    if (missingTables.length > 0) {
      throw new Error(`缺少以下数据表: ${missingTables.join(', ')}`);
    }
    
    log.success('所有必需的数据表已创建');
    return true;
  } catch (error) {
    log.error(`数据库迁移失败: ${error.message}`);
    log.info('尝试使用以下命令手动执行迁移:');
    log.info('npx wrangler d1 execute portfolio_db --remote --file=./migrations/init.sql');
    return false;
  }
}

async function buildAndDeploy() {
  log.title('构建和部署');
  
  try {
    // 构建并部署 Worker
    if (!await runCommand('npm run build', 'Worker 构建')) return false;
    if (!await runCommand('npm run deploy', 'Worker 部署')) return false;
    
    // 构建并部署前端
    log.info('前端构建...');
    try {
      // 分步执行前端构建
      await execAsync('cd frontend && npm install');
      log.success('前端依赖安装完成');
      
      const { stdout, stderr } = await execAsync('cd frontend && npm run build');
      if (stderr) {
        console.error('前端构建错误:', stderr);
        return false;
      }
      if (stdout) console.log(stdout);
      log.success('前端构建完成');
    } catch (error) {
      console.error('前端构建失败:', error.message);
      return false;
    }

    // 部署前端
    if (!await runCommand('cd frontend && npx wrangler pages deploy dist', '前端部署')) return false;
    
    return true;
  } catch (error) {
    log.error(`构建或部署失败: ${error.message}`);
    return false;
  }
}

async function verifyDeployment() {
  log.title('验证部署');
  
  try {
    // 等待一段时间让部署生效
    log.info('等待部署生效...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 验证 Worker API
    log.info('验证 Worker API...');
    try {
      const apiResponse = await fetch('https://cloudflare-homepage-api.workers.dev/api/profile');
      if (!apiResponse.ok) throw new Error(`API 响应状态: ${apiResponse.status}`);
      log.success('Worker API 正常');
    } catch (error) {
      log.warning('Worker API 验证失败，但这可能是暂时的');
      log.info('你可以稍后手动验证: https://cloudflare-homepage-api.workers.dev/api/profile');
    }
    
    // 验证前端
    log.info('验证前端...');
    try {
      const frontendResponse = await fetch('https://cloudflare-homepage.pages.dev');
      if (!frontendResponse.ok) throw new Error(`前端响应状态: ${frontendResponse.status}`);
      log.success('前端部署正常');
    } catch (error) {
      log.warning('前端验证失败，但这可能是暂时的');
      log.info('你可以稍后手动访问: https://cloudflare-homepage.pages.dev');
    }
    
    return true;
  } catch (error) {
    log.error(`部署验证遇到问题: ${error.message}`);
    log.info('这不一定意味着部署失败，你可以稍后手动验证');
    return true; // 返回 true 以避免中断部署流程
  }
}

async function deploy() {
  log.title('开始部署流程');
  
  // 1. 检查依赖
  if (!await checkDependencies()) {
    log.error('依赖检查失败，终止部署');
    return;
  }
  
  // 2. 执行数据库迁移
  if (!await runMigrations()) {
    log.error('数据库迁移失败，终止部署');
    return;
  }
  
  // 3. 构建和部署
  if (!await buildAndDeploy()) {
    log.error('构建或部署失败，终止部署');
    return;
  }
  
  // 4. 验证部署
  if (!await verifyDeployment()) {
    log.error('部署验证失败');
    return;
  }
  
  log.title('部署完成！');
  log.info('你可以访问以下地址：');
  log.info('- 前端: https://cloudflare-homepage.pages.dev');
  log.info('- API: https://cloudflare-homepage-api.laolaoshiren.workers.dev');
  log.info('- 管理后台: https://cloudflare-homepage.pages.dev/admin');
}

// 运行部署
deploy().catch(error => {
  log.error('部署程中发生错误:');
  console.error(error);
  process.exit(1);
}); 