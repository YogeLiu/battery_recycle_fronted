import React, { useState, useEffect } from 'react';
import { Plus, Eye, TrendingUp, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';
import { InboundOrder, BatteryCategory } from '../types';
import Button from '../components/ui/Button';

const InboundSimple = () => {
    const [orders, setOrders] = useState<InboundOrder[]>([]);
    const [categories, setCategories] = useState<BatteryCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('InboundSimple组件开始加载...');
        loadData();
    }, []);

    const loadData = async () => {
        try {
            console.log('InboundSimple: 开始加载数据...');
            setError(null);
            setLoading(true);

            const [ordersResult, categoriesResult] = await Promise.allSettled([
                apiService.getInboundOrders(),
                apiService.getCategories()
            ]);

            console.log('InboundSimple: API调用结果', { ordersResult, categoriesResult });

            if (ordersResult.status === 'fulfilled') {
                setOrders(ordersResult.value || []);
                console.log('InboundSimple: 订单数据设置成功');
            } else {
                console.error('InboundSimple: 订单加载失败', ordersResult.reason);
                setOrders([]);
            }

            if (categoriesResult.status === 'fulfilled') {
                setCategories(categoriesResult.value || []);
                console.log('InboundSimple: 分类数据设置成功');
            } else {
                console.error('InboundSimple: 分类加载失败', categoriesResult.reason);
                setCategories([]);
                setError('无法加载电池分类数据');
            }

        } catch (error) {
            console.error('InboundSimple: 数据加载异常', error);
            setError('数据加载失败');
            setOrders([]);
            setCategories([]);
        } finally {
            setLoading(false);
            console.log('InboundSimple: 数据加载完成');
        }
    };

    console.log('InboundSimple: 渲染状态 - loading:', loading, 'error:', error, 'orders:', orders.length, 'categories:', categories.length);

    // 加载状态
    if (loading) {
        console.log('InboundSimple: 显示加载状态');
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    console.log('InboundSimple: 准备渲染主界面');

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">入库管理 (简化版)</h1>
                    <p className="text-gray-600 mt-1">逐步调试版本</p>
                </div>
                <Button onClick={() => console.log('创建按钮被点击')}>
                    <Plus className="h-4 w-4 mr-2" />
                    创建入库单
                </Button>
            </div>

            {/* 调试信息 */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">调试信息:</h3>
                <div className="text-sm text-blue-700 space-y-1">
                    <div>订单数量: {orders.length}</div>
                    <div>分类数量: {categories.length}</div>
                    <div>错误信息: {error || '无'}</div>
                    <div>加载状态: {loading ? '加载中' : '已完成'}</div>
                </div>
            </div>

            {/* 错误提示 */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-700">{error}</span>
                    <button
                        onClick={loadData}
                        className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        重试
                    </button>
                </div>
            )}

            {/* 简化的订单列表 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                {orders.length === 0 ? (
                    <div className="text-center">
                        <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无入库订单</h3>
                        <p className="text-gray-500 mb-6">当前没有入库订单数据</p>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">订单列表 ({orders.length} 条)</h3>
                        <div className="space-y-2">
                            {orders.map((order) => (
                                <div key={order.id} className="p-3 bg-gray-50 rounded border">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{order.order_no}</span>
                                        <span className="text-sm text-gray-600">{order.supplier_name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InboundSimple; 