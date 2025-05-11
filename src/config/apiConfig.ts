
// API配置文件

// 默认的API基础URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API路径配置
export const API_PATHS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    LOGOUT: '/auth/logout',
  },
  
  // 客户相关
  CUSTOMER: {
    PROFILE: (id: string) => `/customers/${id}/profile`,
    ALL: '/customers',
    CLASSIFICATION: '/customers/classification',
  },
  
  // 经理相关
  MANAGER: {
    PROFILE: (id: string) => `/managers/${id}/profile`,
    ALL: '/managers',
    CUSTOMERS: (id: string) => `/managers/${id}/customers`,
  },
  
  // 管理员相关
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    AUTO_ASSIGN: '/admin/auto-assign',
    MANUAL_ASSIGN: '/admin/manual-assign',
    STATS: '/admin/stats',
  },
  
  // 系统相关
  SYSTEM: {
    HEALTH: '/health',
  },
};

// HTTP请求超时时间（毫秒）
export const REQUEST_TIMEOUT = 30000;

// 重试配置
export const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 5000,
};

// 导出默认配置
export default {
  baseUrl: API_BASE_URL,
  paths: API_PATHS,
  timeout: REQUEST_TIMEOUT,
  retry: RETRY_CONFIG,
};
