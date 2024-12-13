import { Router } from 'itty-router';
const router = Router();
// 添加 CORS 头
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};
// 处理 OPTIONS 请求
router.options('*', () => new Response(null, { headers: corsHeaders }));
// 获取基本信息
router.get('/api/profile', async (request, env) => {
    const profile = await env.PORTFOLIO_KV.get('profile', { type: 'json' });
    return new Response(JSON.stringify(profile), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
});
// 更新基本信息
router.put('/api/profile', async (request, env) => {
    const profile = await request.json();
    await env.PORTFOLIO_KV.put('profile', JSON.stringify(profile));
    return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
});
// 获取项目列表
router.get('/api/projects', async (request, env) => {
    const { results } = await env.DB.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
});
// 添加新项目
router.post('/api/projects', async (request, env) => {
    const project = await request.json();
    // 验证必需字段
    if (!project.title) {
        return new Response(JSON.stringify({ error: 'Title is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    const { success } = await env.DB.prepare('INSERT INTO projects (title, description, image_url, github_url, demo_url) VALUES (?, ?, ?, ?, ?)')
        .bind(project.title, project.description || '', project.image_url || null, project.github_url || null, project.demo_url || null)
        .run();
    return new Response(JSON.stringify({ success }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
});
// 处理未匹配的路由
router.all('*', () => new Response('Not Found', { status: 404 }));
export default {
    fetch: router.handle,
};
