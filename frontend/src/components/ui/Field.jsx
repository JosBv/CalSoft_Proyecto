import { cn } from '../../lib/cn.js';

const BASE =
  'block w-full rounded-xl border border-black/10 bg-white text-sm text-ink ' +
  'placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 ' +
  'disabled:bg-slate-50 disabled:text-slate-500';

function Label({ label, htmlFor }) {
  if (!label) return null;
  return (
    <span className="mb-1.5 block text-xs font-semibold text-slate-700">
      {label}
    </span>
  );
}

export function Input({ label, error, className, id, ...rest }) {
  return (
    <label className="block" htmlFor={id}>
      <Label label={label} />
      <input
        id={id}
        className={cn(BASE, 'h-11 px-3.5', error && 'border-red-500 focus:ring-red-500/20', className)}
        {...rest}
      />
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function Select({ label, error, className, id, children, ...rest }) {
  return (
    <label className="block" htmlFor={id}>
      <Label label={label} />
      <select
        id={id}
        className={cn(BASE, 'h-11 px-3', error && 'border-red-500 focus:ring-red-500/20', className)}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}

export function Textarea({ label, error, className, id, ...rest }) {
  return (
    <label className="block" htmlFor={id}>
      <Label label={label} />
      <textarea
        id={id}
        className={cn(BASE, 'px-3.5 py-2.5', error && 'border-red-500 focus:ring-red-500/20', className)}
        {...rest}
      />
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
