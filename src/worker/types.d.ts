interface KVNamespace {
  get(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<any>;
  put(key: string, value: string | ReadableStream | ArrayBuffer | FormData): Promise<void>;
  delete(key: string): Promise<void>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  // 添加其他需要的方法
}

interface D1PreparedStatement {
  all(): Promise<{ results: any[] }>;
  // 添加其他需要的方法
} 