CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,  -- 联系方式类型：email, phone, wechat 等
  value TEXT NOT NULL, -- 具体的联系方式值
  icon TEXT,          -- 图标
  is_public BOOLEAN DEFAULT true,  -- 是否公开显示
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 