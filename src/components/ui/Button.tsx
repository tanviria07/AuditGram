import React from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-rose-500 via-fuchsia-500 to-orange-500 text-white hover:shadow-lg hover:shadow-fuchsia-500/25 hover:scale-105 rounded-xl',
    secondary: 'bg-white/80 backdrop-blur-md hover:bg-white text-gray-700 border border-gray-200/50 shadow-sm hover:shadow-md rounded-full',
    outline: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm rounded-full',
    ghost: 'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  return (
    <button className={twMerge(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
