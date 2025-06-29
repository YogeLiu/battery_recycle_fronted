import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { apiService } from '../services/api';
import { Inventory, BatteryCategory } from '../types';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell } from '../components/ui/Table';

const InventoryPage = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [categories, setCategories] = useState<BatteryCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [inventoryData, categoriesData] = await Promise.all([
        apiService.getInventory(),
        apiService.getCategories()
      ]);
      setInventory(inventoryData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryInfo = (categoryId: number) => {
    return categories.find(c => c.id === categoryId);
  };

  const getTotalValue = () => {
    return inventory.reduce((total, item) => {
      const category = getCategoryInfo(item.category_id);
      return total + (category ? item.current_weight_kg * category.unit_price : 0);
    }, 0);
  };

  const getTotalWeight = () => {
    return inventory.reduce((total, item) => total + item.current_weight_kg, 0);
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.current_weight_kg < 10); // 假设低于10KG为低库存
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">库存管理</h1>
        <p className="text-gray-600">实时库存监控与管理</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总库存重量</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {getTotalWeight().toFixed(1)} KG
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总库存价值</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ¥{getTotalValue().toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">低库存预警</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {getLowStockItems().length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 库存列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {inventory.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无库存数据</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>电池分类</TableHeaderCell>
                <TableHeaderCell>当前库存 (KG)</TableHeaderCell>
                <TableHeaderCell>单价 (元/KG)</TableHeaderCell>
                <TableHeaderCell>库存价值</TableHeaderCell>
                <TableHeaderCell>库存状态</TableHeaderCell>
                <TableHeaderCell>最后入库</TableHeaderCell>
                <TableHeaderCell>最后出库</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => {
                const category = getCategoryInfo(item.category_id);
                const stockValue = category ? item.current_weight_kg * category.unit_price : 0;
                const isLowStock = item.current_weight_kg < 10;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="font-medium">
                          {category ? category.name : '未知分类'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                        {item.current_weight_kg.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      ¥{category ? category.unit_price.toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">¥{stockValue.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isLowStock 
                          ? 'bg-red-100 text-red-800' 
                          : item.current_weight_kg > 50
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {isLowStock ? '低库存' : item.current_weight_kg > 50 ? '充足' : '正常'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.last_inbound_at 
                        ? new Date(item.last_inbound_at).toLocaleDateString()
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {item.last_outbound_at 
                        ? new Date(item.last_outbound_at).toLocaleDateString()
                        : '-'
                      }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* 低库存预警 */}
      {getLowStockItems().length > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
            <h3 className="text-sm font-medium text-amber-800">库存预警</h3>
          </div>
          <p className="text-sm text-amber-700">
            以下分类库存不足，建议及时补货：
            {getLowStockItems().map((item) => {
              const category = getCategoryInfo(item.category_id);
              return category ? category.name : '未知分类';
            }).join('、')}
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;