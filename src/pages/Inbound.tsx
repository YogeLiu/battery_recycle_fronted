// import React, { useState, useEffect } from 'react';
// import { Plus, Eye, TrendingUp, AlertTriangle, Trash2 } from 'lucide-react';
// import { apiService } from '../services/api';
// import { InboundOrder, BatteryCategory, CreateInboundOrderRequest, InboundOrderDetailResponse } from '../types';
// import Button from '../components/ui/Button';
// import Modal from '../components/ui/Modal';
// import { Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell } from '../components/ui/Table';
// import DecimalInput from '../components/ui/DecimalInput';

// const Inbound = () => {
//   const [orders, setOrders] = useState<InboundOrder[]>([]);
//   const [categories, setCategories] = useState<BatteryCategory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [apiError, setApiError] = useState<boolean>(false);  // 新增：API连接错误状态
//   const [showModal, setShowModal] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [formData, setFormData] = useState<CreateInboundOrderRequest>({
//     supplier_name: '',
//     items: [{ category_id: 0, gross_weight: 0, tare_weight: 0, unit_price: 0 }],
//     notes: ''
//   });

//   // 详情相关状态
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [orderDetail, setOrderDetail] = useState<InboundOrderDetailResponse | null>(null);
//   const [loadingDetail, setLoadingDetail] = useState(false);

//   // 删除相关状态
//   const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);

//   const loadData = async () => {
//     console.log('原始Inbound - loadData函数开始执行');
//     try {
//       setError(null);
//       setApiError(false);  // 重置API错误状态
//       setLoading(true);

//       console.log('开始加载数据...'); // 调试日志

//       // 使用 Promise.allSettled 来处理可能的 API 失败
//       const [ordersResult, categoriesResult] = await Promise.allSettled([
//         apiService.getInboundOrders(),
//         apiService.getCategories()
//       ]);

//       console.log('API调用结果:', { ordersResult, categoriesResult }); // 调试日志

//       // 处理订单数据
//       if (ordersResult.status === 'fulfilled') {
//         setOrders(ordersResult.value || []);
//         console.log('订单数据加载成功:', ordersResult.value?.length || 0, '条');
//       } else {
//         console.error('Failed to load orders:', ordersResult.reason);
//         setOrders([]);
//         // 检查是否是网络错误
//         if (ordersResult.reason?.message?.includes('Network error') ||
//           ordersResult.reason?.status === 502) {
//           setApiError(true);
//         }
//       }

//       // 处理分类数据
//       if (categoriesResult.status === 'fulfilled') {
//         setCategories(categoriesResult.value || []);
//         console.log('分类数据加载成功:', categoriesResult.value?.length || 0, '条');
//       } else {
//         console.error('Failed to load categories:', categoriesResult.reason);
//         setCategories([]);
//         // 检查是否是网络错误
//         if (categoriesResult.reason?.message?.includes('Network error') ||
//           categoriesResult.reason?.status === 502) {
//           setApiError(true);
//           setError('无法连接到后端服务，请检查后端服务是否正常运行');
//         } else {
//           setError('无法加载电池分类数据，请检查网络连接');
//         }
//       }

//     } catch (error) {
//       console.error('Failed to load data:', error);
//       setError('数据加载失败，请刷新页面重试');
//       setApiError(true);
//       setOrders([]);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log('原始Inbound组件 - useEffect开始执行');
//     loadData();
//   }, []);  // eslint-disable-line react-hooks/exhaustive-deps

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // 验证表单数据
//     if (!formData.supplier_name.trim()) {
//       alert('请输入供应商名称');
//       return;
//     }

//     if (formData.items.length === 0) {
//       alert('请至少添加一个入库项目');
//       return;
//     }

//     // 验证每个项目
//     for (let i = 0; i < formData.items.length; i++) {
//       const item = formData.items[i];
//       if (item.category_id === 0) {
//         alert(`请选择第 ${i + 1} 项的电池分类`);
//         return;
//       }
//       if (item.gross_weight <= 0) {
//         alert(`请输入第 ${i + 1} 项的有效毛重`);
//         return;
//       }
//       if (item.tare_weight < 0) {
//         alert(`第 ${i + 1} 项的皮重不能为负数`);
//         return;
//       }
//       if (item.tare_weight >= item.gross_weight) {
//         alert(`第 ${i + 1} 项的皮重不能大于或等于毛重`);
//         return;
//       }
//       if (item.unit_price <= 0) {
//         alert(`请输入第 ${i + 1} 项的有效单价`);
//         return;
//       }
//     }

//     try {
//       setSubmitting(true);
//       await apiService.createInboundOrder(formData);
//       setShowModal(false);
//       setFormData({
//         supplier_name: '',
//         items: [{ category_id: 0, gross_weight: 0, tare_weight: 0, unit_price: 0 }],
//         notes: ''
//       });
//       await loadData(); // 重新加载数据
//       alert('入库单创建成功！');
//     } catch (error: any) {
//       console.error('Failed to create inbound order:', error);
//       alert(error.message || '创建入库单失败，请重试');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const addItem = () => {
//     setFormData({
//       ...formData,
//       items: [...formData.items, { category_id: 0, gross_weight: 0, tare_weight: 0, unit_price: 0 }]
//     });
//   };

//   const removeItem = (index: number) => {
//     if (formData.items.length <= 1) {
//       alert('至少需要保留一个入库项目');
//       return;
//     }
//     setFormData({
//       ...formData,
//       items: formData.items.filter((_, i) => i !== index)
//     });
//   };

//   const updateItem = (index: number, field: string, value: any) => {
//     const updatedItems = [...formData.items];
//     updatedItems[index] = { ...updatedItems[index], [field]: value };
//     setFormData({ ...formData, items: updatedItems });
//   };


//   const openCreateModal = () => {
//     if (categories.length === 0) {
//       alert('请先创建电池分类后再创建入库单');
//       return;
//     }
//     setShowModal(true);
//   };

//   const handleViewDetail = async (orderId: number) => {
//     try {
//       setLoadingDetail(true);
//       setShowDetailModal(true);
//       const detail = await apiService.getInboundOrder(orderId);
//       setOrderDetail(detail);
//     } catch (error: any) {
//       console.error('Failed to load order detail:', error);
//       alert(error.message || '加载订单详情失败，请重试');
//       setShowDetailModal(false);
//     } finally {
//       setLoadingDetail(false);
//     }
//   };

//   const handleDeleteOrder = async (orderId: number, orderNo: string) => {
//     // 确认删除
//     const confirmed = window.confirm(
//       `确定要删除入库单 "${orderNo}" 吗？\n\n删除后将无法恢复，请谨慎操作。`
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       setDeletingOrderId(orderId);
//       await apiService.deleteInboundOrder(orderId);
//       alert('入库单删除成功！');
//       await loadData(); // 重新加载数据
//     } catch (error: any) {
//       console.error('Failed to delete inbound order:', error);
//       alert(error.message || '删除入库单失败，请重试');
//     } finally {
//       setDeletingOrderId(null);
//     }
//   };

//   console.log('原始Inbound - 准备渲染, loading:', loading, 'apiError:', apiError, 'orders:', orders.length, 'categories:', categories.length);

//   // 加载状态
//   if (loading) {
//     console.log('原始Inbound - 显示加载状态');
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
//             <div className="space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="h-16 bg-gray-200 rounded"></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // API连接错误状态
//   if (apiError && !loading) {
//     console.log('原始Inbound - 显示API错误状态');
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">入库管理</h1>
//             <p className="text-gray-600 mt-1">管理电池入库订单</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
//           <div className="text-center">
//             <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">连接后端服务失败</h3>
//             <p className="text-gray-600 mb-4">
//               无法连接到后端API服务 (http://localhost:8036)
//             </p>
//             <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
//               <h4 className="font-medium text-gray-900 mb-2">解决方法：</h4>
//               <ul className="text-sm text-gray-600 space-y-1">
//                 <li>1. 检查后端服务是否正在运行</li>
//                 <li>2. 确认后端服务端口是否为 8036</li>
//                 <li>3. 检查防火墙设置</li>
//                 <li>4. 查看后端服务日志</li>
//               </ul>
//             </div>
//             <div className="space-x-4">
//               <Button onClick={loadData} variant="primary">
//                 重新连接
//               </Button>
//               <Button
//                 onClick={() => window.open('http://localhost:8036/jxc/v1/categories', '_blank')}
//                 variant="secondary"
//               >
//                 测试API连接
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   console.log('原始Inbound - 开始渲染主界面');
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">入库管理</h1>
//           <p className="text-gray-600 mt-1">管理电池入库订单</p>
//         </div>
//         <Button onClick={openCreateModal} disabled={categories.length === 0}>
//           <Plus className="h-4 w-4 mr-2" />
//           创建入库单
//         </Button>
//       </div>

//       {/* 错误提示 */}
//       {error && (
//         <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
//           <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
//           <span className="text-red-700">{error}</span>
//           <button
//             onClick={loadData}
//             className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
//           >
//             重试
//           </button>
//         </div>
//       )}

//       {/* 分类为空提示 */}
//       {categories.length === 0 && !loading && (
//         <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center">
//           <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
//           <span className="text-amber-700">
//             系统中还没有电池分类，请先到"电池分类"页面创建分类后再创建入库单
//           </span>
//         </div>
//       )}

//       {/* 订单列表 */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         {orders.length === 0 ? (
//           <div className="text-center py-16">
//             <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-6" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">暂无入库订单</h3>
//             <p className="text-gray-500 mb-6">创建您的第一个入库单来开始管理库存</p>
//             <Button
//               onClick={openCreateModal}
//               disabled={categories.length === 0}
//               size="lg"
//             >
//               <Plus className="h-5 w-5 mr-2" />
//               创建入库单
//             </Button>
//           </div>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHeaderCell>订单号</TableHeaderCell>
//                 <TableHeaderCell>供应商</TableHeaderCell>
//                 <TableHeaderCell>总金额</TableHeaderCell>
//                 <TableHeaderCell>状态</TableHeaderCell>
//                 <TableHeaderCell>创建时间</TableHeaderCell>
//                 <TableHeaderCell>操作</TableHeaderCell>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {orders.map((order) => (
//                 <TableRow key={order.id}>
//                   <TableCell>
//                     <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
//                       {order.order_no}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <span className="font-medium">{order.supplier_name}</span>
//                   </TableCell>
//                   <TableCell>
//                     <span className="font-medium text-green-600">
//                       ¥{order.total_amount.toFixed(2)}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <span className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === 'completed'
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                       {order.status === 'completed' ? '已完成' : '处理中'}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <span className="text-gray-600">
//                       {new Date(order.created_at).toLocaleDateString('zh-CN')}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => handleViewDetail(order.id)}
//                         className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
//                         title="查看详情"
//                       >
//                         <Eye className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteOrder(order.id, order.order_no)}
//                         disabled={deletingOrderId === order.id}
//                         className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                         title="删除订单"
//                       >
//                         {deletingOrderId === order.id ? (
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                         ) : (
//                           <Trash2 className="h-4 w-4" />
//                         )}
//                       </button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </div>

//       {/* 创建入库单模态框 */}
//       <Modal
//         isOpen={showModal}
//         onClose={() => !submitting && setShowModal(false)}
//         title="创建入库单"
//         size="xl"
//       >
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               供应商名称 <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={formData.supplier_name}
//               onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
//               required
//               disabled={submitting}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
//               placeholder="请输入供应商名称"
//             />
//           </div>

//           <div>
//             <div className="flex justify-between items-center mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 入库明细 <span className="text-red-500">*</span>
//               </label>
//               <Button
//                 type="button"
//                 size="sm"
//                 onClick={addItem}
//                 disabled={submitting}
//                 variant="secondary"
//               >
//                 <Plus className="h-4 w-4 mr-1" />
//                 添加项目
//               </Button>
//             </div>

//             <div className="space-y-4 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
//               {formData.items.map((item, index) => (
//                 <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">
//                         电池分类 <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={item.category_id}
//                         onChange={(e) => updateItem(index, 'category_id', parseInt(e.target.value))}
//                         required
//                         disabled={submitting}
//                         className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//                       >
//                         <option value={0}>请选择分类</option>
//                         {categories.map(category => (
//                           <option key={category.id} value={category.id}>
//                             {category.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">
//                         毛重 (KG) <span className="text-red-500">*</span>
//                       </label>
//                       <DecimalInput
//                         value={item.gross_weight}
//                         onChange={(value) => updateItem(index, 'gross_weight', value)}
//                         required={true}
//                         disabled={submitting}
//                         className="inbound-form-input"
//                         placeholder="0.00"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">
//                         皮重 (KG) <span className="text-red-500">*</span>
//                       </label>
//                       <DecimalInput
//                         value={item.tare_weight}
//                         onChange={(value) => updateItem(index, 'tare_weight', value)}
//                         required={true}
//                         disabled={submitting}
//                         className={`inbound-form-input ${item.tare_weight === 0 ? 'text-gray-500' : ''}`}
//                         placeholder="0.00"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">
//                         单价 (元/KG) <span className="text-red-500">*</span>
//                       </label>
//                       <DecimalInput
//                         value={item.unit_price}
//                         onChange={(value) => updateItem(index, 'unit_price', value)}
//                         required={true}
//                         disabled={submitting}
//                         className="inbound-form-input"
//                         placeholder="0.00"
//                       />
//                     </div>

//                     <div className="flex items-end">
//                       {formData.items.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeItem(index)}
//                           disabled={submitting}
//                           className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200"
//                         >
//                           删除
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
//                     <div className="flex justify-between">
//                       <span>净重: <strong>{(item.gross_weight - item.tare_weight).toFixed(2)} KG</strong></span>
//                       {item.unit_price > 0 && (
//                         <span>小计: <strong className="text-green-600">¥{((item.gross_weight - item.tare_weight) * item.unit_price).toFixed(2)}</strong></span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* 总计 */}
//             <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-medium text-gray-700">订单总计:</span>
//                 <span className="text-lg font-bold text-blue-600">
//                   ¥{formData.items.reduce((total, item) =>
//                     total + ((item.gross_weight - item.tare_weight) * item.unit_price), 0
//                   ).toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               备注
//             </label>
//             <textarea
//               value={formData.notes}
//               onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//               rows={3}
//               disabled={submitting}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
//               placeholder="请输入备注信息（可选）"
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
//             <Button
//               type="button"
//               variant="secondary"
//               onClick={() => setShowModal(false)}
//               disabled={submitting}
//             >
//               取消
//             </Button>
//             <Button
//               type="submit"
//               loading={submitting}
//               disabled={submitting}
//             >
//               {submitting ? '创建中...' : '创建入库单'}
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {/* 订单详情模态框 */}
//       <Modal
//         isOpen={showDetailModal}
//         onClose={() => setShowDetailModal(false)}
//         title="入库单详情"
//         size="xl"
//       >
//         {loadingDetail ? (
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <span className="ml-2 text-gray-600">加载中...</span>
//           </div>
//         ) : orderDetail ? (
//           <div className="space-y-6">
//             {/* 订单基本信息 */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">订单信息</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">订单号</label>
//                   <p className="mt-1 font-mono text-sm bg-white px-3 py-2 rounded border">
//                     {orderDetail.order.order_no}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">供应商</label>
//                   <p className="mt-1 text-sm bg-white px-3 py-2 rounded border">
//                     {orderDetail.order.supplier_name}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">总金额</label>
//                   <p className="mt-1 text-sm font-semibold text-green-600 bg-white px-3 py-2 rounded border">
//                     ¥{orderDetail.order.total_amount.toFixed(2)}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">状态</label>
//                   <p className="mt-1">
//                     <span className={`px-3 py-1 text-xs font-medium rounded-full ${orderDetail.order.status === 'completed'
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                       {orderDetail.order.status === 'completed' ? '已完成' : '处理中'}
//                     </span>
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">创建时间</label>
//                   <p className="mt-1 text-sm bg-white px-3 py-2 rounded border">
//                     {new Date(orderDetail.order.created_at).toLocaleString('zh-CN')}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">更新时间</label>
//                   <p className="mt-1 text-sm bg-white px-3 py-2 rounded border">
//                     {new Date(orderDetail.order.updated_at).toLocaleString('zh-CN')}
//                   </p>
//                 </div>
//               </div>
//               {orderDetail.order.notes && (
//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700">备注</label>
//                   <p className="mt-1 text-sm bg-white px-3 py-2 rounded border">
//                     {orderDetail.order.notes}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* 入库明细 */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">入库明细</h3>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHeaderCell>电池分类</TableHeaderCell>
//                       <TableHeaderCell>毛重 (KG)</TableHeaderCell>
//                       <TableHeaderCell>皮重 (KG)</TableHeaderCell>
//                       <TableHeaderCell>净重 (KG)</TableHeaderCell>
//                       <TableHeaderCell>单价 (元/KG)</TableHeaderCell>
//                       <TableHeaderCell>小计 (元)</TableHeaderCell>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {orderDetail.detail.map((item, index) => (
//                       <TableRow key={index}>
//                         <TableCell>
//                           <span className="font-medium">{item.category_name}</span>
//                         </TableCell>
//                         <TableCell>
//                           <span className="font-mono">{item.gross_weight.toFixed(2)}</span>
//                         </TableCell>
//                         <TableCell>
//                           <span className="font-mono">{item.tare_weight.toFixed(2)}</span>
//                         </TableCell>
//                         <TableCell>
//                           <span className="font-mono font-semibold text-blue-600">
//                             {item.net_weight.toFixed(2)}
//                           </span>
//                         </TableCell>
//                         <TableCell>
//                           <span className="font-mono">¥{item.unit_price.toFixed(2)}</span>
//                         </TableCell>
//                         <TableCell>
//                           <span className="font-mono font-semibold text-green-600">
//                             ¥{item.sub_total.toFixed(2)}
//                           </span>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>

//               {/* 总计 */}
//               <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <div className="flex justify-between items-center">
//                   <span className="text-lg font-medium text-gray-700">订单总计:</span>
//                   <span className="text-xl font-bold text-blue-600">
//                     ¥{orderDetail.order.total_amount.toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end pt-6 border-t border-gray-200">
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={() => setShowDetailModal(false)}
//               >
//                 关闭
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-gray-500">无法加载订单详情</p>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default Inbound;