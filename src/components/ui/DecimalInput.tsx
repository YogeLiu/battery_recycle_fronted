import React from 'react';

interface DecimalInputProps {
    value: number | string;
    onChange: (value: number) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    required?: boolean;
    min?: number;
    max?: number;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * 小数输入组件
 * 支持输入数字和小数点
 */
const DecimalInput: React.FC<DecimalInputProps> = ({
    value,
    onChange,
    placeholder = "0.00",
    disabled = false,
    className = "",
    required = false,
    min,
    max,
    onBlur
}) => {
    // 内部状态使用字符串表示
    const [inputValue, setInputValue] = React.useState<string>(() => {
        // 将传入的值转换为字符串显示
        if (value === 0 || value === '' || value === undefined) {
            return '';
        }
        return value.toString();
    });

    // 当外部值变化时更新内部状态
    React.useEffect(() => {
        if (value === 0 || value === '' || value === undefined) {
            setInputValue('');
        } else if (typeof value === 'number') {
            setInputValue(value.toString());
        } else {
            setInputValue(value);
        }
    }, [value]);

    // 处理输入变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // 允许空输入、数字和最多一个小数点
        if (newValue === '' || /^(\d*\.?\d*)$/.test(newValue)) {
            // 更新内部状态
            setInputValue(newValue);

            // 将字符串转为数字传给外部
            const numericValue = newValue === '' ? 0 : parseFloat(newValue) || 0;

            // 检查最小值和最大值限制
            if ((min === undefined || numericValue >= min) &&
                (max === undefined || numericValue <= max)) {
                onChange(numericValue);
            }
        }
    };

    // 防止鼠标滚轮改变数值
    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
        e.currentTarget.blur();
    };

    return (
        <input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleChange}
            onWheel={handleWheel}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${className}`}
            onBlur={onBlur}
        />
    );
};

export default DecimalInput; 