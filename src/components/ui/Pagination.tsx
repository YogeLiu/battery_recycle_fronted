import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Button from './Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    className = ''
}) => {
    const [jumpToPage, setJumpToPage] = useState('');

    // 计算显示的页码范围
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5; // 最多显示5个页码
        
        if (totalPages <= maxVisiblePages) {
            // 如果总页数不超过最大显示数，显示所有页码
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // 复杂分页逻辑
            if (currentPage <= 3) {
                // 当前页在前面
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // 当前页在后面
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // 当前页在中间
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    // 处理跳转
    const handleJumpTo = () => {
        const page = parseInt(jumpToPage);
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
            setJumpToPage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleJumpTo();
        }
    };

    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}>
            {/* 分页信息 */}
            <div className="text-sm text-gray-600">
                显示第 {startItem} - {endItem} 条，共 {totalItems} 条记录
            </div>

            {/* 分页控件 */}
            <div className="flex items-center space-x-2">
                {/* 首页 */}
                <Button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    variant="secondary"
                    size="sm"
                    className="p-1"
                    title="首页"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* 上一页 */}
                <Button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="secondary"
                    size="sm"
                    className="p-1"
                    title="上一页"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* 页码 */}
                <div className="flex items-center space-x-1">
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-2 py-1 text-gray-500">...</span>
                            ) : (
                                <Button
                                    onClick={() => onPageChange(page as number)}
                                    variant={currentPage === page ? "primary" : "secondary"}
                                    size="sm"
                                    className="min-w-[2rem] h-8"
                                >
                                    {page}
                                </Button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* 下一页 */}
                <Button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="secondary"
                    size="sm"
                    className="p-1"
                    title="下一页"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* 末页 */}
                <Button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    variant="secondary"
                    size="sm"
                    className="p-1"
                    title="末页"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>

                {/* 跳转到 */}
                <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm text-gray-600">跳转到</span>
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={jumpToPage}
                        onChange={(e) => setJumpToPage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="页"
                    />
                    <Button
                        onClick={handleJumpTo}
                        variant="secondary"
                        size="sm"
                        disabled={!jumpToPage || parseInt(jumpToPage) < 1 || parseInt(jumpToPage) > totalPages}
                    >
                        跳转
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Pagination; 