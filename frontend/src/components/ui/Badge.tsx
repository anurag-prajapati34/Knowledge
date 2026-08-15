import React from 'react';
import type { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  title?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  title,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-zinc-100 text-zinc-900 border-zinc-300',
    success: 'bg-black text-white font-medium border-black',
    warning: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    danger: 'bg-zinc-100 text-zinc-900 border-zinc-300',
    info: 'bg-zinc-100 text-zinc-900 border-zinc-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
