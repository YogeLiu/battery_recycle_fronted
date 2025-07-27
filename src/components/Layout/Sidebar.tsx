import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package2, 
  TrendingUp, 
  TrendingDown,
  Package, 
  Users, 
  LogOut,
  Battery
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: '控制台', href: '/', icon: LayoutDashboard },
    { name: '电池分类', href: '/categories', icon: Battery },
    { name: '入库管理', href: '/inbound', icon: TrendingUp },
    { name: '出库管理', href: '/outbound', icon: TrendingDown },
    { name: '库存管理', href: '/inventory', icon: Package },
  ];

  if (user?.role === 'super_admin') {
    navigation.push({ name: '用户管理', href: '/users', icon: Users });
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Package2 className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">电池进销存</span>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">
                {user?.real_name?.[0] || user?.username[0]}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.real_name || user?.username}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role === 'super_admin' ? '超级管理员' : '普通用户'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
        >
          <LogOut className="mr-3 h-4 w-4" />
          退出登录
        </button>
      </div>
    </div>
  );
};

export default Sidebar;