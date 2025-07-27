import React, { useState, useEffect } from 'react';
import { Plus, Eye, TrendingDown, AlertTriangle, Trash2, Search, RefreshCcw, Printer, Edit3, Save, X } from 'lucide-react';
import { apiService } from '../services/api';
import { BatteryCategory, OutboundOrderDetailResponse } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell } from '../components/ui/Table';
import DecimalInput from '../components/ui/DecimalInput';
import Pagination from '../components/ui/Pagination';
import type { OutboundOrderSearchParams } from '../services/api';

// 从 '../types' 中导入 BatteryCategory，但不需要再导入 OutboundOrderDetailResponse
// 因为我们将在页面组件内部定义更具体的类型

const Outbound = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [categories, setCategories] = useState<BatteryCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [apiError, setApiError] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // 分页相关状态
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
    });

    // 详情相关状态
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [orderDetail, setOrderDetail] = useState<OutboundOrderDetailResponse | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editedPrice, setEditedPrice] = useState<number>(0);
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

    // 删除相关状态
    const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);

    // 搜索相关状态
    const [searchParams, setSearchParams] = useState({
        page: 1,
        page_size: 20,
        start_date: '',
        end_date: '',
        customer: ''
    });
    const [showSearchForm, setShowSearchForm] = useState(false);

    const [formData, setFormData] = useState({
        car_number: '',
        delivery_address: '',
        driver_name: '',
        driver_phone: '',
        items: [{ category_id: 0, weight: 0, unit_price: 0 }],
        notes: ''
    });

    const loadData = async (searchOptions?: OutboundOrderSearchParams) => {
        try {
            setError(null);
            setApiError(false);  // 重置API错误状态
            setLoading(true);

            const currentSearchParams = searchOptions || searchParams;
            const [ordersResult, categoriesResult] = await Promise.allSettled([
                apiService.getOutboundOrders(currentSearchParams),
                apiService.getCategories()
            ]);

            // 处理订单数据
            if (ordersResult.status === 'fulfilled') {
                const data = ordersResult.value;
                setOrders(data.orders || []);
                setPagination({
                    currentPage: data.page || 1,
                    pageSize: data.page_size || 20,
                    total: data.total,
                    totalPages: Math.ceil(data.total / (data.page_size || 20))
                });
            } else {
                setOrders([]);
                setPagination({
                    currentPage: 1,
                    pageSize: 20,
                    total: 0,
                    totalPages: 0
                });
                if (ordersResult.reason?.message?.includes('Network error') ||
                    ordersResult.reason?.status === 502) {
                    setApiError(true);
                    setError('无法连接到后端服务，请检查后端服务是否正常运行');
                } else {
                    setError('无法加载出库订单数据，请检查网络连接');
                }
            }

            // 处理分类数据
            if (categoriesResult.status === 'fulfilled') {
                setCategories(categoriesResult.value || []);
            } else {
                setCategories([]);
                if (categoriesResult.reason?.message?.includes('Network error') ||
                    categoriesResult.reason?.status === 502) {
                    setApiError(true);
                    setError('无法连接到后端服务，请检查后端服务是否正常运行');
                } else {
                    setError('无法加载电池分类数据，请检查网络连接');
                }
            }

        } catch (error) {
            console.error('Failed to load data:', error);
            setError('数据加载失败，请刷新页面重试');
            setApiError(true);
            setOrders([]);
            setCategories([]);
            setPagination({
                currentPage: 1,
                pageSize: 20,
                total: 0,
                totalPages: 0
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 搜索处理函数
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await loadData({ ...searchParams, page: 1 });
        setSearchParams({ ...searchParams, page: 1 });
        setShowSearchForm(false);
    };

    // 重置搜索
    const handleResetSearch = async () => {
        const resetParams = {
            page: 1,
            page_size: 20,
            start_date: '',
            end_date: '',
            customer: ''
        };
        setSearchParams(resetParams);
        await loadData(resetParams);
        setShowSearchForm(false);
    };

    // 分页处理函数
    const handlePageChange = async (page: number) => {
        const newSearchParams = { ...searchParams, page };
        setSearchParams(newSearchParams);
        await loadData(newSearchParams);
    };

    // 开始编辑价格
    const startEditingPrice = (itemId: number, currentPrice: number) => {
        setEditingItemId(itemId);
        setEditedPrice(currentPrice);
    };

    // 取消编辑价格
    const cancelEditingPrice = () => {
        setEditingItemId(null);
        setEditedPrice(0);
    };

    const savePrice = async (itemId: number) => {
        if (!orderDetail) return;

        try {
            setUpdatingOrderId(orderDetail.order.id);

            // 构造更新请求数据
            const updateRequest = {
                car_number: orderDetail.order.car_number,
                delivery_address: orderDetail.order.delivery_address,
                driver_name: orderDetail.order.driver_name,
                driver_phone: orderDetail.order.driver_phone,
                notes: orderDetail.order.notes,
                items: orderDetail.detail.map(item => ({
                    id: item.category_id, // 这里可能需要调整，根据实际API要求
                    category_id: item.category_id,
                    weight: item.weight,
                    unit_price: item.category_id === itemId ? editedPrice : item.unit_price,
                    action: "update"
                }))
            };

            // 调用API更新出库订单
            await apiService.updateOutboundOrder(orderDetail.order.id, updateRequest);

            // 更新本地状态
            const updatedDetail = orderDetail.detail.map(item =>
                item.category_id === itemId
                    ? { ...item, unit_price: editedPrice, sub_total: editedPrice * item.weight }
                    : item
            );

            setOrderDetail({
                ...orderDetail,
                detail: updatedDetail,
                order: {
                    ...orderDetail.order,
                    total_amount: updatedDetail.reduce((sum, item) => sum + (item.category_id === itemId ? editedPrice * item.weight : item.sub_total), 0)
                }
            });

            // 重置编辑状态
            setEditingItemId(null);
            setEditedPrice(0);

            alert('价格更新成功！');
        } catch (error: any) {
            console.error('Failed to update price:', error);
            alert(error.message || '价格更新失败，请重试');
        } finally {
            setUpdatingOrderId(null);
        }
    };

    // 删除订单功能
    const handleDeleteOrder = async (orderId: number, orderNo: string) => {
        // 确认删除
        const confirmed = window.confirm(
            `确定要删除出库单 "${orderNo}" 吗？\n\n删除后将无法恢复，请谨慎操作。`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingOrderId(orderId);
            await apiService.deleteOutboundOrder(orderId);
            alert('出库单删除成功！');
            await loadData(); // 重新加载数据
        } catch (error: any) {
            console.error('Failed to delete outbound order:', error);
            alert(error.message || '删除出库单失败，请重试');
        } finally {
            setDeletingOrderId(null);
        }
    };

    // 打开创建模态框
    const openCreateModal = () => {
        if (categories.length === 0) {
            alert('请先创建电池分类后再创建出库单');
            return;
        }
        setShowModal(true);
    };

    // 查看订单详情功能
    const handleViewOrder = async (orderId: number) => {
        try {
            setLoadingDetail(true);
            setShowDetailModal(true);
            const detail = await apiService.getOutboundOrder(orderId);
            setOrderDetail(detail);
        } catch (error: any) {
            console.error('Failed to load order detail:', error);
            alert(error.message || '加载订单详情失败，请重试');
            setShowDetailModal(false);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 验证表单数据
        if (!formData.driver_name.trim()) {
            alert('请输入司机姓名');
            return;
        }

        if (!formData.driver_phone.trim()) {
            alert('请输入司机电话');
            return;
        }

        if (!formData.car_number.trim()) {
            alert('请输入车号');
            return;
        }

        if (!formData.delivery_address.trim()) {
            alert('请输入送货地');
            return;
        }

        if (formData.items.length === 0) {
            alert('请至少添加一个出库项目');
            return;
        }

        // 验证每个项目
        for (let i = 0; i < formData.items.length; i++) {
            const item = formData.items[i];
            if (item.category_id === 0) {
                alert(`请选择第 ${i + 1} 项的电池分类`);
                return;
            }
            if (item.weight <= 0) {
                alert(`请输入第 ${i + 1} 项的有效重量`);
                return;
            }
            if (item.unit_price <= 0) {
                alert(`请输入第 ${i + 1} 项的有效单价`);
                return;
            }
        }

        try {
            setSubmitting(true);
            await apiService.createOutboundOrder(formData);
            setShowModal(false);
            setFormData({
                car_number: '',
                delivery_address: '',
                driver_name: '',
                driver_phone: '',
                items: [{ category_id: 0, weight: 0, unit_price: 0 }],
                notes: ''
            });
            await loadData(); // 重新加载数据
            alert('出库单创建成功！');
        } catch (error: any) {
            console.error('Failed to create outbound order:', error);
            alert(error.message || '创建出库单失败，请重试');
        } finally {
            setSubmitting(false);
        }
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { category_id: 0, weight: 0, unit_price: 0 }]
        });
    };

    const removeItem = (index: number) => {
        if (formData.items.length <= 1) {
            alert('至少需要保留一个出库项目');
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

    // Loading state with overlay
    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header skeleton */}
                <div className="animate-pulse mb-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>

                {/* Search form skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/5 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-10 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    <div className="flex justify-end space-x-3">
                        <div className="h-10 bg-gray-200 rounded w-20"></div>
                        <div className="h-10 bg-gray-200 rounded w-20"></div>
                    </div>
                </div>

                {/* Table skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6">
                        <div className="h-8 bg-gray-200 rounded w-1/5 mb-6"></div>
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

    // API连接错误状态
    if (apiError && !loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">出库管理</h1>
                        <p className="text-gray-600 mt-1">管理电池出库订单</p>
                    </div>
                    <Button onClick={() => loadData()} variant="secondary">
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        手动刷新
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                            <AlertTriangle className="h-10 w-10 text-red-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">连接后端服务失败</h3>
                        <p className="text-gray-600 mb-2">
                            无法连接到后端API服务
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            端点地址: http://localhost:8036
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left inline-block w-full max-w-md">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                                可能原因及解决方法：
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li className="flex items-start">
                                    <span className="h-4 w-4 mr-2 text-red-500">•</span>
                                    后端服务未运行 - 请启动后端服务
                                </li>
                                <li className="flex items-start">
                                    <span className="h-4 w-4 mr-2 text-red-500">•</span>
                                    端口占用或冲突 - 检查端口是否被占用
                                </li>
                                <li className="flex items-start">
                                    <span className="h-4 w-4 mr-2 text-red-500">•</span>
                                    网络问题 - 检查跨域设置或网络连接
                                </li>
                                <li className="flex items-start">
                                    <span className="h-4 w-4 mr-2 text-red-500">•</span>
                                    防火墙限制 - 检查防火墙设置
                                </li>
                            </ul>
                        </div>
                        <div className="space-x-3">
                            <Button
                                onClick={() => loadData()}
                                variant="primary"
                                className="flex items-center justify-center"
                            >
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                重新连接
                            </Button>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="secondary"
                            >
                                页面重载
                            </Button>
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
                    <h1 className="text-3xl font-bold text-gray-900">出库管理</h1>
                    <p className="text-gray-600 mt-1">管理电池出库订单</p>
                </div>
                <Button onClick={openCreateModal} disabled={categories.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />
                    创建出库单
                </Button>
            </div>

            {/* 错误提示 */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-700">{error}</span>
                    <button
                        onClick={() => loadData()}
                        className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        重试
                    </button>
                </div>
            )}

            {/* 搜索表单 */}
            {showSearchForm && (
                <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    司机姓名
                                </label>
                                <input
                                    type="text"
                                    value={searchParams.customer}
                                    onChange={(e) => setSearchParams({ ...searchParams, customer: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="请输入司机姓名"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    开始日期
                                </label>
                                <input
                                    type="date"
                                    value={searchParams.start_date}
                                    onChange={(e) => setSearchParams({ ...searchParams, start_date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    结束日期
                                </label>
                                <input
                                    type="date"
                                    value={searchParams.end_date}
                                    onChange={(e) => setSearchParams({ ...searchParams, end_date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <Button type="button" variant="secondary" onClick={handleResetSearch}>
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                重置
                            </Button>
                            <Button type="submit" variant="primary">
                                <Search className="h-4 w-4 mr-2" />
                                搜索
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* 操作按钮 */}
            <div className="mb-6 flex flex-wrap gap-3">
                <Button
                    variant="secondary"
                    onClick={() => setShowSearchForm(!showSearchForm)}
                >
                    <Search className="h-4 w-4 mr-2" />
                    {showSearchForm ? '隐藏搜索' : '显示搜索'}
                </Button>
            </div>

            {/* 订单列表 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <TrendingDown className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无出库订单</h3>
                        <p className="text-gray-500 mb-6">当前没有出库订单数据</p>
                        <Button onClick={openCreateModal} disabled={categories.length === 0}>
                            <Plus className="h-4 w-4 mr-2" />
                            创建出库单
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell>订单号</TableHeaderCell>
                                        <TableHeaderCell>司机姓名</TableHeaderCell>
                                        <TableHeaderCell>总金额</TableHeaderCell>
                                        <TableHeaderCell>状态</TableHeaderCell>
                                        <TableHeaderCell>创建时间</TableHeaderCell>
                                        <TableHeaderCell>操作</TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.order_no}</TableCell>
                                            <TableCell>{order.driver_name}</TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-green-600">
                                                    ¥{order.total_amount.toFixed(2)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {order.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewOrder(order.id)}
                                                        className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        title="查看详情"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOrder(order.id, order.order_no)}
                                                        disabled={deletingOrderId === order.id}
                                                        className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                                                        title="删除订单"
                                                    >
                                                        {deletingOrderId === order.id ? (
                                                            <div className="h-4 w-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* 分页 */}
                        {pagination.totalPages > 1 && (
                            <div className="border-t border-gray-200 px-6 py-4">
                                <Pagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    totalItems={pagination.total}
                                    pageSize={pagination.pageSize}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 创建出库单模态框 */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="创建出库单"
                size="xl"
            >
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    司机姓名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.driver_name}
                                    onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                                    disabled={submitting}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    placeholder="请输入司机姓名"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    司机电话 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.driver_phone}
                                    onChange={(e) => setFormData({ ...formData, driver_phone: e.target.value })}
                                    disabled={submitting}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    placeholder="请输入司机电话"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    车号 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.car_number}
                                    onChange={(e) => setFormData({ ...formData, car_number: e.target.value })}
                                    disabled={submitting}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    placeholder="请输入车号"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    送货地 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.delivery_address}
                                    onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                                    disabled={submitting}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    placeholder="请输入送货地"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    出库项目 <span className="text-red-500">*</span>
                                </label>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={addItem}
                                    disabled={submitting}
                                    size="sm"
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    添加项目
                                </Button>
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto p-2">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    电池分类 <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={item.category_id}
                                                    onChange={(e) => updateItem(index, 'category_id', parseInt(e.target.value))}
                                                    disabled={submitting}
                                                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                                >
                                                    <option value="0">请选择分类</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    重量 (KG) <span className="text-red-500">*</span>
                                                </label>
                                                <DecimalInput
                                                    value={item.weight}
                                                    onChange={(value) => updateItem(index, 'weight', value)}
                                                    required={true}
                                                    disabled={submitting}
                                                    className="inbound-form-input"
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    单价 (元/KG) <span className="text-red-500">*</span>
                                                </label>
                                                <DecimalInput
                                                    value={item.unit_price}
                                                    onChange={(value) => updateItem(index, 'unit_price', value)}
                                                    required={true}
                                                    disabled={submitting}
                                                    className="inbound-form-input"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                {item.unit_price > 0 && item.weight > 0 && (
                                                    <span>小计: <strong className="text-green-600">¥{(item.weight * item.unit_price).toFixed(2)}</strong></span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-2 flex justify-end">
                                            {formData.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    disabled={submitting}
                                                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200"
                                                >
                                                    删除
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                备注
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                disabled={submitting}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                placeholder="请输入备注信息（可选）"
                            />
                        </div>
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
                            variant="primary"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    创建中...
                                </>
                            ) : (
                                '创建出库单'
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* 订单详情模态框 */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="出库单详情"
                size="xl"
            >
                {loadingDetail ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : orderDetail ? (
                    <div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-600">订单号</p>
                                    <p className="font-medium">{orderDetail.order.order_no}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">司机姓名</p>
                                    <p className="font-medium">{orderDetail.order.driver_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">司机电话</p>
                                    <p className="font-medium">{orderDetail.order.driver_phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">车号</p>
                                    <p className="font-medium">{orderDetail.order.car_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">送货地</p>
                                    <p className="font-medium">{orderDetail.order.delivery_address}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">创建时间</p>
                                    <p className="font-medium">{new Date(orderDetail.order.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">总金额</p>
                                    <p className="font-medium text-green-600 text-lg">¥{orderDetail.order.total_amount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHeaderCell>电池分类</TableHeaderCell>
                                            <TableHeaderCell>重量(KG)</TableHeaderCell>
                                            <TableHeaderCell>单价(元/KG)</TableHeaderCell>
                                            <TableHeaderCell>小计(元)</TableHeaderCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orderDetail.detail.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{item.category_name}</TableCell>
                                                <TableCell>
                                                    <span className="font-mono">{item.weight.toFixed(2)}</span>
                                                </TableCell>
                                                <TableCell>
                                                    {editingItemId === item.category_id ? (
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={editedPrice}
                                                                onChange={(e) => setEditedPrice(parseFloat(e.target.value) || 0)}
                                                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={cancelEditingPrice}
                                                                className="p-1"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() => savePrice(item.category_id)}
                                                                className="p-1"
                                                            >
                                                                <Save className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <span className="font-mono">¥{item.unit_price.toFixed(2)}</span>
                                                            <button
                                                                onClick={() => startEditingPrice(item.category_id, item.unit_price)}
                                                                className="ml-2 p-1 text-gray-500 hover:text-blue-600"
                                                            >
                                                                <Edit3 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-mono font-semibold text-green-600">
                                                        ¥{item.sub_total.toFixed(2)}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* 总计 */}
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium text-gray-700">订单总计:</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        ¥{orderDetail.order.total_amount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowDetailModal(false)}
                            >
                                关闭
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">无法加载订单详情</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Outbound;