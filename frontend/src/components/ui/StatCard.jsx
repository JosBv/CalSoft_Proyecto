import { Card, CardBody } from './Card.jsx';

// Tarjeta de estadística estilo condoflow:
// label uppercase arriba-izquierda + ícono pequeño arriba-derecha, valor debajo.
const TONES = {
  brand: 'bg-brand-soft text-brand',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-sky-50 text-sky-700',
  dark: 'bg-slate-900 text-white',
};

export function StatCard({ icon: Icon, label, value, sub, tone = 'brand' }) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {label}
          </div>
          {Icon && (
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${TONES[tone]}`}>
              <Icon size={16} />
            </div>
          )}
        </div>
        <div className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {value}
        </div>
        {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
      </CardBody>
    </Card>
  );
}
