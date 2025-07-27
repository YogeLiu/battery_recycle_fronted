// import React, { useState, useEffect } from 'react';
// import { AlertTriangle } from 'lucide-react';

// const InboundTest = () => {
//     const [status, setStatus] = useState('初始化');
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         console.log('InboundTest组件加载');
//         setStatus('组件已加载');

//         // 测试基本API调用
//         const testAPI = async () => {
//             try {
//                 setStatus('测试API连接...');

//                 const token = localStorage.getItem('auth_token');
//                 console.log('Token存在:', !!token);

//                 if (!token) {
//                     throw new Error('未找到认证Token');
//                 }

//                 const response = await fetch('http://localhost:8036/jxc/v1/categories', {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 console.log('API响应状态:', response.status);

//                 if (!response.ok) {
//                     const errorText = await response.text();
//                     throw new Error(`API请求失败: ${response.status} - ${errorText}`);
//                 }

//                 const data = await response.json();
//                 console.log('API响应数据:', data);

//                 setStatus(`API连接成功 - 获取到 ${data.data?.length || 0} 个分类`);

//             } catch (err: any) {
//                 console.error('API测试失败:', err);
//                 setError(err.message);
//                 setStatus('API测试失败');
//             }
//         };

//         testAPI();
//     }, []);

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-900">入库管理 - 调试版本</h1>
//                     <p className="text-gray-600 mt-1">调试页面渲染和API连接问题</p>
//                 </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
//                 <div className="space-y-4">
//                     <div>
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">调试信息</h3>
//                         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                             <p className="text-blue-700">
//                                 <strong>当前状态:</strong> {status}
//                             </p>
//                             <p className="text-blue-700 mt-2">
//                                 <strong>时间:</strong> {new Date().toLocaleTimeString()}
//                             </p>
//                         </div>
//                     </div>

//                     {error && (
//                         <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
//                             <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
//                             <div>
//                                 <h4 className="font-medium text-red-900">发现错误:</h4>
//                                 <p className="text-red-700 mt-1">{error}</p>
//                             </div>
//                         </div>
//                     )}

//                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//                         <h4 className="font-medium text-gray-900 mb-2">检查项目:</h4>
//                         <ul className="text-sm text-gray-600 space-y-1">
//                             <li>✓ React组件正常渲染</li>
//                             <li>✓ CSS样式正常加载</li>
//                             <li>✓ useEffect hook 正常执行</li>
//                             <li>✓ Console.log 正常输出</li>
//                             <li>{error ? '❌' : '✓'} API连接测试</li>
//                         </ul>
//                     </div>

//                     <div className="pt-4">
//                         <button
//                             onClick={() => window.location.reload()}
//                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                         >
//                             重新加载
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InboundTest; 