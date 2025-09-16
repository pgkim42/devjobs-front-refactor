import React from 'react';
import { cn } from '../../utils/cn';

// Apple 스타일 Input 컴포넌트 (Tailwind CSS)
const Input = React.forwardRef(({
  type = 'text',
  size = 'md',
  state = 'default',
  fullWidth = true,
  leftIcon,
  rightIcon,
  className,
  ...props
}, ref) => {

  // 기본 입력 스타일
  const baseClasses = "border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed font-sans";

  // 상태별 스타일
  const states = {
    default: "border-gray-300 focus:border-primary-500 focus:ring-primary-200",
    error: "border-red-500 focus:border-red-500 focus:ring-red-200",
    success: "border-green-500 focus:border-green-500 focus:ring-green-200",
    warning: "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-200"
  };

  // 크기별 스타일
  const sizes = {
    sm: "px-3 py-2 text-sm h-8",
    md: "px-4 py-2.5 text-base h-10",
    lg: "px-5 py-3 text-lg h-12"
  };

  // 전체 너비
  const widthClass = fullWidth ? "w-full" : "";

  // 아이콘이 있을 때 패딩 조정
  const iconPadding = leftIcon ? "pl-10" : rightIcon ? "pr-10" : "";

  const combinedClassName = cn(
    baseClasses,
    states[state],
    sizes[size],
    widthClass,
    iconPadding,
    className
  );

  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
      )}

      <input
        ref={ref}
        type={type}
        className={combinedClassName}
        {...props}
      />

      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea 컴포넌트
export const Textarea = React.forwardRef(({
  size = 'md',
  state = 'default',
  fullWidth = true,
  rows = 4,
  className,
  ...props
}, ref) => {

  const baseClasses = "border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed font-sans resize-vertical";

  const states = {
    default: "border-gray-300 focus:border-primary-500 focus:ring-primary-200",
    error: "border-red-500 focus:border-red-500 focus:ring-red-200",
    success: "border-green-500 focus:border-green-500 focus:ring-green-200",
    warning: "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-200"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-5 py-3 text-lg"
  };

  const widthClass = fullWidth ? "w-full" : "";

  const combinedClassName = cn(
    baseClasses,
    states[state],
    sizes[size],
    widthClass,
    className
  );

  return (
    <textarea
      ref={ref}
      rows={rows}
      className={combinedClassName}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

// Select 컴포넌트
export const Select = React.forwardRef(({
  size = 'md',
  state = 'default',
  fullWidth = true,
  children,
  className,
  ...props
}, ref) => {

  const baseClasses = "border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed font-sans appearance-none bg-white pr-10 cursor-pointer";

  const states = {
    default: "border-gray-300 focus:border-primary-500 focus:ring-primary-200",
    error: "border-red-500 focus:border-red-500 focus:ring-red-200",
    success: "border-green-500 focus:border-green-500 focus:ring-green-200",
    warning: "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-200"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm h-8",
    md: "px-4 py-2.5 text-base h-10",
    lg: "px-5 py-3 text-lg h-12"
  };

  const widthClass = fullWidth ? "w-full" : "";

  const combinedClassName = cn(
    baseClasses,
    states[state],
    sizes[size],
    widthClass,
    className
  );

  return (
    <div className="relative">
      <select
        ref={ref}
        className={combinedClassName}
        {...props}
      >
        {children}
      </select>

      {/* 커스텀 드롭다운 화살표 */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
});

Select.displayName = 'Select';

// Input 그룹 (라벨, 헬퍼 텍스트 포함)
export const InputGroup = ({ label, helperText, error, required, children, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children}

      {(helperText || error) && (
        <p className={cn(
          "text-sm",
          error ? "text-red-600" : "text-gray-500"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

// 검색 입력
export const SearchInput = React.forwardRef(({
  placeholder = "검색...",
  onClear,
  value,
  className,
  ...props
}, ref) => {
  return (
    <div className="relative">
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        value={value}
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        rightIcon={value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        className={className}
        {...props}
      />
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

// 체크박스
export const Checkbox = React.forwardRef(({
  label,
  description,
  className,
  ...props
}, ref) => {
  return (
    <div className={cn("flex items-start", className)}>
      <input
        ref={ref}
        type="checkbox"
        className="w-4 h-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 transition-colors"
        {...props}
      />
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label className="text-sm font-medium text-gray-700 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// 라디오 버튼
export const Radio = React.forwardRef(({
  label,
  description,
  className,
  ...props
}, ref) => {
  return (
    <div className={cn("flex items-start", className)}>
      <input
        ref={ref}
        type="radio"
        className="w-4 h-4 mt-0.5 text-primary-600 border-gray-300 focus:ring-primary-500 focus:ring-2 transition-colors"
        {...props}
      />
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label className="text-sm font-medium text-gray-700 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Input;