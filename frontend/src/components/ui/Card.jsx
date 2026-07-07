import { cn } from '../../lib/cn.js';

// Card estilo Apple: rounded-2xl, borde hairline, sombra muy suave.
export function Card({ className, ...rest }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-black/[0.06] bg-white shadow-all',
        className
      )}
      {...rest}
    />
  );
}

export function CardHeader({ className, ...rest }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-4 sm:px-6',
        className
      )}
      {...rest}
    />
  );
}

export function CardBody({ className, ...rest }) {
  return <div className={cn('p-5 sm:p-6', className)} {...rest} />;
}
