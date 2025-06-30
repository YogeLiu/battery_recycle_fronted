import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* 移除全局搜索框 */}
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          </button>
          
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.real_name || user?.username}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role === 'super_admin' ? '超级管理员' : '普通用户'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;