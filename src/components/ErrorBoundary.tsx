import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-gray-50 min-h-screen">
                    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
                        <div className="text-center">
                            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">页面渲染错误</h3>
                            <p className="text-gray-600 mb-4">
                                页面在加载时发生了错误
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                                <h4 className="font-medium text-red-900 mb-2">错误详情：</h4>
                                <pre className="text-sm text-red-700 whitespace-pre-wrap">
                                    {this.state.error?.message}
                                </pre>
                                {this.state.errorInfo && (
                                    <details className="mt-4">
                                        <summary className="cursor-pointer text-red-800 font-medium">
                                            查看错误堆栈
                                        </summary>
                                        <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                重新加载页面
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 