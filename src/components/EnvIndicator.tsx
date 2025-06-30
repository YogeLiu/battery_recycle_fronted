import React from 'react';
import { envConfig, isDevelopment, isTest } from '../config/env';

const EnvIndicator: React.FC = () => {
  // 只在非生产环境显示环境指示器
  if (envConfig.isProduction) {
    return null;
  }

  const getEnvColor = () => {
    switch (envConfig.env) {
      case 'local':
        return 'bg-blue-600';
      case 'test':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getEnvLabel = () => {
    switch (envConfig.env) {
      case 'local':
        return '本地开发';
      case 'test':
        return '测试环境';
      case 'production':
        return '生产环境';
      default:
        return '未知环境';
    }
  };

  return (
    <div 
      className={`fixed top-0 right-0 z-50 px-3 py-1 text-white text-xs font-mono ${getEnvColor()}`}
      title={`环境: ${envConfig.env} | API: ${envConfig.apiBaseUrl}`}
    >
      {getEnvLabel()}
    </div>
  );
};

export default EnvIndicator;