import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, Users, Battery, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';

interface StatsCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      // Try to load data from API, but provide fallbacks
      const [categories, inventory] = await Promise.allSettled([
        apiService.getCategories(),
        apiService.getInventory()
      ]);

      let totalCategories = 0;
      let totalInventory = 0;

      if (categories.status === 'fulfilled') {
        totalCategories = categories.value.length;
      }

      if (inventory.status === 'fulfilled') {
        totalInventory = inventory.value.reduce((sum: number, item: any) => sum + (item.current_weight_kg || 0), 0);
      }

      setStats([
        {
          title: '总库存重量',
          value: `${totalInventory.toFixed(1)} KG`,
          change: '+12.5%',
          changeType: 'increase',
          icon: <Package className="h-6 w-6" />,
          color: 'text-blue-600 bg-blue-100'
        },
        {
          title: '电池分类',
          value: totalCategories.toString(),
          change: '+2.3%',
          changeType: 'increase',
          icon: <Battery className="h-6 w-6" />,
          color: 'text-green-600 bg-green-100'
        },
        {
          title: '本月入库',
          value: '0 笔',
          change: '0%',
          changeType: 'increase',
          icon: <TrendingUp className="h-6 w-6" />,
          color: 'text-purple-600 bg-purple-100'
        },
        {
          title: '本月出库',
          value: '0 笔',
          change: '0%',
          changeType: 'decrease',
          icon: <TrendingDown className="h-6 w-6" />,
          color: 'text-amber-600 bg-amber-100'
        }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('无法连接到服务器，显示模拟数据');
      
      // Provide fallback data when API is unavailable
      setStats([
        {
          title: '总库存重量',
          value: '1,250.5 KG',
          change: '+12.5%',
          changeType: 'increase',
          icon: <Package className="h-6 w-6" />,
          color: 'text-blue-600 bg-blue-100'
        },
        {
          title: '电池分类',
          value: '8',
          change: '+2.3%',
          changeType: 'increase',
          icon: <Battery className="h-6 w-6" />,
          color: 'text-green-600 bg-green-100'
        },
        {
          title: '本月入库',
          value: '15 笔',
          change: '+8.2%',
          changeType: 'increase',
          icon: <TrendingUp className="h-6 w-6" />,
          color: 'text-purple-600 bg-purple-100'
        },
        {
          title: '本月出库',
          value: '12 笔',
          change: '-3.1%',
          changeType: 'decrease',
          icon: <TrendingDown className="h-6 w-6" />,
          color: 'text-amber-600 bg-amber-100'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">控制台</h1>
        <p className="text-gray-600 mt-2">欢迎使用废旧电池进销存管理系统</p>
        {error && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
            <span className="text-amber-700">{error}</span>
          </div>
        )}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">较上月</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color} ml-4`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近活动 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">最近活动</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">新增入库单</p>
                <p className="text-xs text-gray-500">锂电池 - 125.5KG</p>
              </div>
              <span className="text-xs text-gray-400">2小时前</span>
            </div>
            
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">库存更新</p>
                <p className="text-xs text-gray-500">铅酸电池库存充足</p>
              </div>
              <span className="text-xs text-gray-400">4小时前</span>
            </div>
            
            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full mr-4">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">用户登录</p>
                <p className="text-xs text-gray-500">管理员登录系统</p>
              </div>
              <span className="text-xs text-gray-400">6小时前</span>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">快速操作</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 group">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors duration-200">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">创建入库单</span>
                  <p className="text-sm text-gray-500">记录新的电池入库</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left px-4 py-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-all duration-200 group">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4 group-hover:bg-green-200 transition-colors duration-200">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">查看库存</span>
                  <p className="text-sm text-gray-500">实时库存监控</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left px-4 py-4 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 group">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-4 group-hover:bg-purple-200 transition-colors duration-200">
                  <Battery className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">管理分类</span>
                  <p className="text-sm text-gray-500">电池分类设置</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left px-4 py-4 rounded-lg border border-gray-200 hover:bg-amber-50 hover:border-amber-200 transition-all duration-200 group">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg mr-4 group-hover:bg-amber-200 transition-colors duration-200">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">用户管理</span>
                  <p className="text-sm text-gray-500">系统用户设置</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 库存预警 */}
      <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-amber-600 mr-3" />
          <h3 className="text-lg font-semibold text-amber-800">库存预警</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <p className="text-sm font-medium text-gray-900">镍氢电池</p>
            <p className="text-xs text-amber-600">库存不足: 15.2KG</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <p className="text-sm font-medium text-gray-900">锂离子电池</p>
            <p className="text-xs text-amber-600">库存偏低: 28.7KG</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <p className="text-sm font-medium text-gray-900">碱性电池</p>
            <p className="text-xs text-amber-600">需要补货: 8.3KG</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;