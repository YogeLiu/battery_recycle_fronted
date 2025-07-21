// import React from 'react';
// import { Plus, TrendingUp } from 'lucide-react';
// import Button from '../components/ui/Button';

// const InboundMinimal = () => {
//     console.log('InboundMinimal: 组件开始渲染');

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-900">入库管理 (最简版)</h1>
//                     <p className="text-gray-600 mt-1">静态版本 - 无API调用</p>
//                 </div>
//                 <Button onClick={() => console.log('按钮被点击')}>
//                     <Plus className="h-4 w-4 mr-2" />
//                     创建入库单
//                 </Button>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//                 <div className="text-center py-16">
//                     <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-6" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">入库管理页面</h3>
//                     <p className="text-gray-500 mb-6">页面加载成功 - 没有白页问题</p>
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
//                         <div className="text-green-800 text-sm">
//                             <div>✅ React 组件正常渲染</div>
//                             <div>✅ CSS 样式正常加载</div>
//                             <div>✅ 图标正常显示</div>
//                             <div>✅ Button 组件正常工作</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <h4 className="font-medium text-blue-900 mb-2">调试信息:</h4>
//                 <div className="text-sm text-blue-700">
//                     <div>当前时间: {new Date().toLocaleString()}</div>
//                     <div>组件状态: 正常渲染</div>
//                     <div>API调用: 已跳过</div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InboundMinimal; 