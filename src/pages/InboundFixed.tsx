import React, { useState, useEffect } from 'react';
import { Plus, Eye, TrendingUp, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';
import { InboundOrder, BatteryCategory, CreateInboundOrderRequest } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell } from '../components/ui/Table';

const InboundFixed = () => {
    const [orders, setOrders] = useState<InboundOrder[]>([]);
    const [categories, setCategories] = useState<BatteryCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<CreateInboundOrderRequest>({
        supplier_name: '',
        items: [{ category_id: 0, gross_weight: 0, tare_weight: 0, unit_price: 0 }],
        notes: ''
    });

    const loadData = async () => {
        try {
            console.log('InboundFixed: 开始加载数据...');
            setError(null);
            setLoading(true);

            const [ordersResult, categoriesResult] = await Promise.allSettled([
                apiService.getInboundOrders(),
                apiService.getCategories()
            ]);

            if (ordersResult.status === 'fulfilled') {
                setOrders(ordersResult.value || []);
            } else {
                setOrders([]);
            }

            if (categoriesResult.status === 'fulfilled') {
                setCategories(categoriesResult.value || []);
            } else {
                setCategories([]);
                setError('无法加载电池分类数据');
            }

        } catch (error) {
            console.error('InboundFixed: 数据加载异常', error);
            setError('数据加载失败');
            setOrders([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.supplier_name.trim()) {
            alert('请输入供应商名称');
            return;
        }

        if (formData.items.length === 0) {
            alert('请至少添加一个入库项目');
            return;
        }

        // 简化的验证
        for (let i = 0; i < formData.items.length; i++) {
            const item = formData.items[i];
            if (item.category_id === 0) {
                alert(`请选择第 ${i + 1} 项的电池分类`);
                return;
            }
            if (item.gross_weight <= 0) {
                alert(`请输入第 ${i + 1} 项的有效毛重`);
                return;
            }
            if (item.unit_price <= 0) {
                alert(`请输入第 ${i + 1} 项的有效单价`);
                return;
            }
        }

        try {
            setSubmitting(true);
            await apiService.createInboundOrder(formData);
            setShowModal(false);
            setFormData({
                supplier_name: '',
                items: [{ category_id: 0, gross_weight: 0, tare_weight: 0, unit_price: 0 }],
                notes: ''
            });
            await loadData();
            alert('入库单创建成功！');
        } catch (error: any) {
            console.error('InboundFixed: 创建入库单失败', error);
            alert(error.message || '创建入库单失败，请重试');
        } finally {
            setSubmitting(false);
        }
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { category_id: 0, gross_weight: 0, tare_weight: 0, unit_price: 0 }]
        });
    };

    const removeItem = (index: number) => {
        if (formData.items.length <= 1) {
            alert('至少需要保留一个入库项目');
            return;
        }
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index)
        });
    };

    const updateItem = (index: number, field: string, value: any) => {
        const updatedItems = [...formData.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setFormData({ ...formData, items: updatedItems });
    };

    if (loading) {
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">入库管理 (修复版)</h1>
                    <p className="text-gray-600 mt-1">管理电池入库订单</p>
                </div>
                <Button onClick={() => setShowModal(true)} disabled={categories.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />
                    创建入库单
                </Button>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无入库订单</h3>
                        <p className="text-gray-500 mb-6">创建您的第一个入库单来开始管理库存</p>
                        <div className="text-sm text-blue-600 mb-4">
                            <div>调试信息:</div>
                            <div>订单数量: {orders.length}</div>
                            <div>分类数量: {categories.length}</div>
                        </div>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>订单号</TableHeaderCell>
                                <TableHeaderCell>供应商</TableHeaderCell>
                                <TableHeaderCell>总金额</TableHeaderCell>
                                <TableHeaderCell>状态</TableHeaderCell>
                                <TableHeaderCell>创建时间</TableHeaderCell>
                                <TableHeaderCell>操作</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.order_no}</TableCell>
                                    <TableCell>{order.supplier_name}</TableCell>
                                    <TableCell>¥{order.total_amount.toFixed(2)}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString('zh-CN')}</TableCell>
                                    <TableCell>
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => !submitting && setShowModal(false)}
                title="创建入库单"
                size="xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            供应商名称 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.supplier_name}
                            onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                            required
                            disabled={submitting}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                            placeholder="请输入供应商名称"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                入库明细 <span className="text-red-500">*</span>
                            </label>
                            <Button
                                type="button"
                                size="sm"
                                onClick={addItem}
                                disabled={submitting}
                                variant="secondary"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                添加项目
                            </Button>
                        </div>

                        <div className="space-y-4 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                            {formData.items.map((item, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                电池分类 <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={item.category_id}
                                                onChange={(e) => updateItem(index, 'category_id', parseInt(e.target.value))}
                                                required
                                                disabled={submitting}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                            >
                                                <option value={0}>请选择分类</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                毛重 (KG) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                value={item.gross_weight || ''}
                                                onChange={(e) => updateItem(index, 'gross_weight', parseFloat(e.target.value) || 0)}
                                                required
                                                disabled={submitting}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                皮重 (KG) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.tare_weight || ''}
                                                onChange={(e) => updateItem(index, 'tare_weight', parseFloat(e.target.value) || 0)}
                                                required
                                                disabled={submitting}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                单价 (元/KG) <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    value={item.unit_price || ''}
                                                    onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                    required
                                                    disabled={submitting}
                                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                                    placeholder="0.00"
                                                />
                                                {formData.items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        disabled={submitting}
                                                        className="px-3 py-2 bg-red-600 text-white text-sm rounded-r hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200"
                                                    >
                                                        删除
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>净重: <strong>{(item.gross_weight - item.tare_weight).toFixed(2)} KG</strong></span>
                                            {item.unit_price > 0 && (
                                                <span>小计: <strong className="text-green-600">¥{((item.gross_weight - item.tare_weight) * item.unit_price).toFixed(2)}</strong></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">订单总计:</span>
                                <span className="text-lg font-bold text-blue-600">
                                    ¥{formData.items.reduce((total, item) =>
                                        total + ((item.gross_weight - item.tare_weight) * item.unit_price), 0
                                    ).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            备注
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            disabled={submitting}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                            placeholder="请输入备注信息（可选）"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                            disabled={submitting}
                        >
                            取消
                        </Button>
                        <Button
                            type="submit"
                            loading={submitting}
                            disabled={submitting}
                        >
                            {submitting ? '创建中...' : '创建入库单'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default InboundFixed; 