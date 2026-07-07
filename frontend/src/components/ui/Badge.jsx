import { cn } from '../../lib/cn.js';

// Tonos estilo condoflow
const TONES = {
  neutral: 'bg-slate-100 text-slate-700',
  stat: 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20',
  danger: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10',
  info: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10',
  dark: 'bg-indigo-800 text-white',
};

export function Badge({ tone = 'neutral', className, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold',
        TONES[tone],
        className
      )}
      {...rest}
    />
  );
}

// Mapea el estado de un pedido a un tono de Badge.
export function EstadoPedidoBadge({ estado }) {
  const tone =
    estado === 'Entregado' ? 'success' : estado === 'En cocina' ? 'info' : 'warning';
  return <Badge tone={tone}>{estado}</Badge>;
}

// Mapea el estado de una reserva a un tono de Badge.
export function EstadoReservaBadge({ estado }) {
  const tone =
    estado === 'Confirmada' ? 'success' : estado === 'Cancelada' ? 'neutral' : 'warning';
  return <Badge tone={tone}>{estado}</Badge>;
}
