// src/components/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        'font-inter font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md',
        {
          'bg-gradient-card text-titleColor hover:bg-gradient-hover': variant === 'primary',
          'bg-surface-1 text-titleColor border border-subtitleColor/20 hover:bg-surface-2': variant === 'secondary',
          'bg-transparent text-titleColor border border-subtitleColor/40 hover:bg-surface-1': variant === 'outline',
          'py-2 px-3 text-sm': size === 'sm',
          'py-3 px-4 text-base': size === 'md',
          'py-4 px-6 text-lg': size === 'lg',
          'opacity-70 cursor-not-allowed': isLoading || props.disabled,
        },
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
}