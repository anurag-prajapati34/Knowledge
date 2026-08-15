import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none select-none active:scale-[0.98] cursor-pointer';

  const variantStyles = {
    primary:
      'bg-black hover:bg-zinc-800 text-white font-semibold shadow-md focus:ring-black border border-black',
    secondary:
      'bg-white hover:bg-zinc-100 text-black border border-zinc-300 focus:ring-zinc-400 shadow-sm',
    outline:
      'bg-transparent hover:bg-zinc-100 text-black border border-zinc-300 focus:ring-black',
    danger:
      'bg-white hover:bg-zinc-100 text-black border border-zinc-300 focus:ring-black',
    ghost:
      'bg-transparent hover:bg-zinc-100 text-zinc-700 hover:text-black focus:ring-zinc-300',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size={size === 'lg' ? 'md' : 'sm'} className="mr-1 text-current" />}
      {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
