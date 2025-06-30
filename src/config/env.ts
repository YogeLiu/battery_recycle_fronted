// 环境类型定义
export type Environment = 'local' | 'test' | 'production';

// 环境配置接口
interface EnvConfig {
  env: Environment;
  apiBaseUrl: string;
  isDevelopment: boolean;
  isTest: boolean;
  isProduction: boolean;
}

// 获取当前环境
function getCurrentEnvironment(): Environment {
  const env = import.meta.env.VITE_APP_ENV as Environment;
  
  // 如果没有配置环境变量，根据模式自动判断
  if (!env) {
    if (import.meta.env.DEV) return 'local';
    if (import.meta.env.MODE === 'test') return 'test';
    return 'production';
  }
  
  return env;
}

// 获取API基础URL
function getApiBaseUrl(): string {
  const configUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (configUrl) {
    return configUrl;
  }
  
  // 如果没有配置，使用默认值
  const env = getCurrentEnvironment();
  switch (env) {
    case 'local':
      return 'http://localhost:8036/jxc/v1';
    case 'test':
      return 'http://182.92.150.161:8036/jxc/v1';
    case 'production':
      return 'https://api.yourdomain.com/jxc/v1';
    default:
      return 'http://localhost:8036/jxc/v1';
  }
}

// 创建环境配置对象
function createEnvConfig(): EnvConfig {
  const env = getCurrentEnvironment();
  
  return {
    env,
    apiBaseUrl: getApiBaseUrl(),
    isDevelopment: env === 'local',
    isTest: env === 'test',
    isProduction: env === 'production',
  };
}

// 导出环境配置
export const envConfig = createEnvConfig();

// 导出便捷方法
export const isDevelopment = envConfig.isDevelopment;
export const isTest = envConfig.isTest;
export const isProduction = envConfig.isProduction;

// 控制台输出当前环境信息（仅开发环境）
if (envConfig.isDevelopment || envConfig.isTest) {
  console.log('🌍 Environment Config:', {
    env: envConfig.env,
    apiBaseUrl: envConfig.apiBaseUrl,
    mode: import.meta.env.MODE,
  });
}