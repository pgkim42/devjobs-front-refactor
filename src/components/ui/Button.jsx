import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Apple 스타일 Button 컴포넌트 (Tailwind CSS)
const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  className,
  ...props
}, ref) => {

  // 기본 버튼 스타일
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  // 변형별 스타일
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md hover:-translate-y-0.5",
    secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5",
    outline: "bg-transparent text-primary-600 border border-primary-600 hover:bg-primary-50 active:bg-primary-100",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md hover:-translate-y-0.5",
    success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm hover:shadow-md hover:-translate-y-0.5"
  };

  // 크기별 스타일
  const sizes = {
    sm: "px-3 py-2 text-sm h-8",
    md: "px-4 py-2.5 text-base h-10",
    lg: "px-6 py-3 text-lg h-12",
    xl: "px-8 py-4 text-xl h-14"
  };

  // 전체 너비
  const widthClass = fullWidth ? "w-full" : "";

  // 로딩 상태
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const combinedClassName = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    widthClass,
    className
  );

  return (
    <motion.button
      ref={ref}
      className={combinedClassName}
      disabled={disabled || loading}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

// 아이콘 버튼 (정사각형)
export const IconButton = React.forwardRef(({
  children,
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: "w-8 h-8 p-1",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-2.5",
    xl: "w-14 h-14 p-3"
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      className={cn("aspect-square", sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

// 버튼 그룹
export const ButtonGroup = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            className: cn(
              child.props.className,
              "rounded-none",
              index === 0 && "rounded-l-lg",
              index === React.Children.count(children) - 1 && "rounded-r-lg",
              index !== React.Children.count(children) - 1 && "border-r-0"
            )
          });
        }
        return child;
      })}
    </div>
  );
};

export default Button;