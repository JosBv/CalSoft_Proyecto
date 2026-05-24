import { cn } from '../../lib/cn.js';

// Botones estilo Apple: pill, azul de acento, peso medio.
const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-hover disabled:opacity-40',
  dark: 'bg-ink text-white hover:bg-black disabled:opacity-40',
  secondary: 'bg-slate-100 text-ink hover:bg-slate-200 disabled:opacity-40',
  outline:
    'bg-white text-ink border border-black/10 hover:bg-slate-50 disabled:opacity-40',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 disabled:opacity-40',
  danger: 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-40',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-40',
};

const SIZES = {
  sm: 'h-8 px-3.5 text-[13px] rounded-full gap-1.5',
  md: 'h-10 px-5 text-sm rounded-full gap-2',
  lg: 'h-12 px-7 text-[15px] rounded-full gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  className,
  children,
  ...rest
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        'disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        full && 'w-full',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
