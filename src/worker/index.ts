import { Router } from 'itty-router';

interface Env {
  PORTFOLIO_KV: KVNamespace;
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  ADMIN_PASSWORD: string;
}

interface Project {
  title: string;
  description: string;
  image_url?: string;
  github_url?: string;
  demo_url?: string;
}

interface AuthRequest {
  password: string;
}

interface Link {
  id?: number;
  title: string;
  url: string;
  icon?: string;
  sort_order?: number;
}

interface Profile {
  name: string;
  title: string;
  description: string;
}

interface Contact {
  id?: number;
  type: string;
  value: string;
  icon?: string;
  is_public: boolean;
  sort_order?: number;
}

const router = Router();

// 添加 token 验证函数
async function validateToken(request: Request, env: Env) {
  const auth = request.headers.get('Authorization');
  if (!auth) {
    throw new Error('No authorization provided');
  }

  const [_, token] = auth.split('Bearer ');
  if (!token) {
    throw new Error('Invalid token format');
  }

  const [timestamp, password] = atob(token).split(':');
  if (password !== env.ADMIN_PASSWORD) {
    throw new Error('Invalid token');
  }

  // 检查 token 是否过期（24小时）
  if (Date.now() - Number(timestamp) > 24 * 60 * 60 * 1000) {
    throw new Error('Token expired');
  }
}

// 创建 CORS headers 的函数
const createCorsHeaders = (request: Request, env: Env) => {
  const origin = request.headers.get('Origin') || '';
  
  return {
    'Access-Control-Allow-Origin': '*',  // 临时允许所有域名访问
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json; charset=utf-8'
  };
};

// 处理 OPTIONS 请求
router.options('*', (request, env: Env) => {
  return new Response(null, { 
    headers: createCorsHeaders(request, env) 
  });
});

// 获取基本信息
router.get('/api/profile', async (request, env: Env) => {
  try {
    console.log('GET /api/profile request received');
    const profile = await env.PORTFOLIO_KV.get('profile', { type: 'json' });
    console.log('Profile data:', profile);
    
    const headers = {
      ...createCorsHeaders(request, env),
      'Content-Type': 'application/json; charset=utf-8'
    };

    if (!profile) {
      console.log('No profile found');
      return new Response(JSON.stringify({}), { headers });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder('utf-8');
    const jsonString = JSON.stringify(profile);
    const encodedData = encoder.encode(jsonString);
    const decodedData = decoder.decode(encodedData);

    return new Response(decodedData, { headers });
  } catch (error) {
    console.error('Error in GET /api/profile:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }), {
        status: 500,
        headers: createCorsHeaders(request, env)
      }
    );
  }
});

// 更新基本信息
router.put('/api/profile', async (request, env: Env) => {
  try {
    const auth = request.headers.get('Authorization');
    if (!auth) {
      throw new Error('No authorization provided');
    }

    const [_, token] = auth.split('Bearer ');
    if (!token) {
      throw new Error('Invalid token format');
    }

    const [timestamp, password] = atob(token).split(':');
    if (password !== env.ADMIN_PASSWORD) {
      throw new Error('Invalid token');
    }

    // 检查 token 是否过期（24小时）
    if (Date.now() - Number(timestamp) > 24 * 60 * 60 * 1000) {
      throw new Error('Token expired');
    }

    const profile = await request.json();
    await env.PORTFOLIO_KV.put('profile', JSON.stringify(profile));
    
    return new Response(JSON.stringify({ success: true }), {
      headers: createCorsHeaders(request, env)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 401,
      headers: createCorsHeaders(request, env)
    });
  }
});

// 获取项目列表
router.get('/api/projects', async (request, env: Env) => {
  const { results } = await env.DB.prepare(
    'SELECT * FROM projects ORDER BY created_at DESC'
  ).all();
  
  return new Response(JSON.stringify(results), {
    headers: { 
      ...createCorsHeaders(request, env),
      'Content-Type': 'application/json' 
    },
  });
});

// 添加新项目
router.post('/api/projects', async (request, env: Env) => {
  const project = await request.json() as Project;
  
  // 验证必需字段
  if (!project.title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), {
      status: 400,
      headers: { 
        ...createCorsHeaders(request, env),
        'Content-Type': 'application/json' 
      },
    });
  }

  const { success } = await env.DB.prepare(
    'INSERT INTO projects (title, description, image_url, github_url, demo_url) VALUES (?, ?, ?, ?, ?)'
  )
  .bind(
    project.title,
    project.description || '',
    project.image_url || null,
    project.github_url || null,
    project.demo_url || null
  )
  .run();

  return new Response(JSON.stringify({ success }), {
    headers: { 
      ...createCorsHeaders(request, env),
      'Content-Type': 'application/json' 
    },
  });
});

// 修改验证路由
router.post('/api/auth', async (request, env: Env) => {
  try {
    const data = await request.json() as AuthRequest;
    const isValid = data.password === env.ADMIN_PASSWORD;

    return new Response(JSON.stringify({ 
      success: isValid,
      token: isValid ? btoa(`${Date.now()}:${data.password}`) : null 
    }), {
      headers: createCorsHeaders(request, env)
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Invalid request' 
    }), {
      status: 400,
      headers: createCorsHeaders(request, env)
    });
  }
});

// 获取所有链接
router.get('/api/links', async (request, env: Env) => {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM links ORDER BY sort_order ASC, created_at ASC'
    ).all();
    
    // 确保返回空数组而不是 null
    return new Response(JSON.stringify(results || []), {
      headers: createCorsHeaders(request, env)
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    // 出错时也返回空数组
    return new Response(JSON.stringify([]), {
      headers: createCorsHeaders(request, env)
    });
  }
});

// 添加 URL 处理函数
function normalizeUrl(url: string): string {
  // 如果已经有协议，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 如果以 // 开头，添加 https:
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // 其他情况添加 https://
  return `https://${url}`;
}

// 修改添加链接的路由
router.post('/api/links', async (request, env: Env) => {
  try {
    await validateToken(request, env);
    
    const link = await request.json() as Link;
    if (!link.title || !link.url) {
      throw new Error('Title and URL are required');
    }

    // 规范化 URL
    link.url = normalizeUrl(link.url);

    const result = await env.DB.prepare(
      'INSERT INTO links (title, url, icon, sort_order) VALUES (?, ?, ?, ?) RETURNING id'
    )
    .bind(
      link.title,
      link.url,
      link.icon || null,
      link.sort_order || 0
    )
    .first();

    return new Response(JSON.stringify({ 
      success: true,
      id: result?.id
    }), {
      headers: createCorsHeaders(request, env)
    });
  } catch (error) {
    console.error('Error adding link:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add link' 
    }), {
      status: 401,
      headers: createCorsHeaders(request, env)
    });
  }
});

// 删除链接
router.delete('/api/links/:id', async (request, env: Env) => {
  try {
    // 验证 token
    await validateToken(request, env);
    
    const { id } = request.params;
    const { success } = await env.DB.prepare(
      'DELETE FROM links WHERE id = ?'
    )
    .bind(id)
    .run();

    return new Response(JSON.stringify({ success }), {
      headers: createCorsHeaders(request, env)
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to delete link' 
    }), {
      status: 401,
      headers: createCorsHeaders(request, env)
    });
  }
});

// 修改更新链接的路由
router.put('/api/links/:id', async (request, env: Env) => {
  try {
    await validateToken(request, env);
    
    const { id } = request.params;
    const link = await request.json() as Link;
    
    // 规范化 URL
    link.url = normalizeUrl(link.url);
    
    const { success } = await env.DB.prepare(
      'UPDATE links SET title = ?, url = ?, icon = ?, sort_order = ? WHERE id = ?'
    )
    .bind(
      link.title,
      link.url,
      link.icon || null,
      link.sort_order || 0,
      id
    )
    .run();

    return new Response(JSON.stringify({ success }), {
      headers: createCorsHeaders(request, env)
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to update link' 
    }), {
      status: 401,
      headers: createCorsHeaders(request, env)
    });
  }
});

// 获取联系方式列表
router.get('/api/contacts', async (request, env: Env) => {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM contacts WHERE is_public = ? ORDER BY sort_order ASC, created_at ASC'
    )
    .bind(true)
    .all();
    
    return new Response(JSON.stringify(results || []), {
      headers: createCorsHeaders(request, env)
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return new Response(JSON.stringify([]), {
      headers: createCorsHeaders(request, env)
    });
  }
});

// 添加联系方式（需要管理员权限）
router.post('/api/contacts', async (request, env: Env) => {
  try {
    await validateToken(request, env);
    
    const contact = await request.json() as Contact;
    if (!contact.type || !contact.value) {
      throw new Error('Type and value are required');
    }

    const result = await env.DB.prepare(
      'INSERT INTO contacts (type, value, icon, is_public, sort_order) VALUES (?, ?, ?, ?, ?) RETURNING id'
    )
    .bind(
      contact.type,
      contact.value,
      contact.icon || null,
      contact.is_public,
      contact.sort_order || 0
    )
    .first();

    return new Response(JSON.stringify({ 
      success: true,
      id: result?.id
    }), {
      headers: createCorsHeaders(request, env)
    });
  } catch (error) {
    console.error('Error adding contact:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add contact' 
    }), {
      status: 401,
      headers: createCorsHeaders(request, env)
    });
  }
});

// 删除联系方式
router.delete('/api/contacts/:id', async (request, env: Env) => {
  try {
    await validateToken(request, env);
    
    const { id } = request.params;
    const { success } = await env.DB.prepare(
      'DELETE FROM contacts WHERE id = ?'
    )
    .bind(id)
    .run();

    return new Response(JSON.stringify({ success }), {
      headers: createCorsHeaders(request, env)
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to delete contact' 
    }), {
      status: 401,
      headers: createCorsHeaders(request, env)
    });
  }
});

// 处理未匹配的路由
router.all('*', (request, env: Env) => new Response('Not Found', { 
  status: 404,
  headers: createCorsHeaders(request, env)
}));

export default {
  fetch: router.handle,
}; 