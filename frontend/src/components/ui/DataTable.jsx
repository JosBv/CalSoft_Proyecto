import { Card } from './Card.jsx';
import { cn } from '../../lib/cn.js';

// Tabla responsive estilo condoflow:
//  - Desktop (lg): <table> con thead gris y filas border-t.
//  - Móvil: lista de tarjetas (divide-y), sin scroll horizontal.
//
// columns: [{ header, align?, className?, render(row, i) }]
// renderMobile(row, i): contenido de la tarjeta en móvil.
export function DataTable({ columns, rows, getKey, empty = 'Sin resultados', renderMobile }) {
  const vacio = rows.length === 0;

  return (
    <Card className="overflow-hidden">
      {/* Desktop */}
      <div className="hidden lg:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((c, i) => (
                <th
                  key={i}
                  className={cn('px-5 py-3 text-left font-medium', c.align === 'right' && 'text-right')}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vacio ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-slate-400">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={getKey(row)} className="border-t border-black/[0.05] hover:bg-slate-50/60">
                  {columns.map((c, j) => (
                    <td
                      key={j}
                      className={cn(
                        'px-5 py-3 text-slate-700',
                        c.align === 'right' && 'text-right',
                        c.className
                      )}
                    >
                      {c.render(row, i)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Móvil */}
      <div className="divide-y divide-black/[0.05] lg:hidden">
        {vacio ? (
          <div className="px-5 py-12 text-center text-sm text-slate-400">{empty}</div>
        ) : (
          rows.map((row, i) => (
            <div key={getKey(row)} className="px-5 py-4">
              {renderMobile ? renderMobile(row, i) : null}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
