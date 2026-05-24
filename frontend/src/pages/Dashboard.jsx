import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, CalendarClock, AlertTriangle, Wallet } from 'lucide-react';
import { api } from '../api.js';
import { AppShell } from '../components/layout/AppShell.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { StatCard } from '../components/ui/StatCard.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import { EstadoPedidoBadge, EstadoReservaBadge } from '../components/ui/Badge.jsx';

const TITULO = 'text-sm font-semibold uppercase tracking-wider text-slate-500';

function ListaCard({ titulo, verHref, vacio, children }) {
  return (
    <Card>
      <CardBody>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={TITULO}>{titulo}</h2>
          <Link to={verHref} className="text-xs font-medium text-slate-700 hover:text-slate-900">
            Ver todos →
          </Link>
        </div>
        {children}
      </CardBody>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    api.obtenerReportes().then(setStats).catch(() => {});
    api.listarPedidos().then((d) => setPedidos(d || [])).catch(() => {});
    api.listarReservas().then((d) => setReservas(d || [])).catch(() => {});
  }, []);

  const pedidosRecientes = [...pedidos].sort((a, b) => b.id - a.id).slice(0, 5);
  const hoy = new Date().toISOString().slice(0, 10);
  const reservasProximas = reservas
    .filter((r) => r.estado !== 'Cancelada' && String(r.fecha).slice(0, 10) >= hoy)
    .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))
    .slice(0, 5);

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader title="Inicio" subtitle="Resumen general del restaurante" />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={ListChecks}
            label="Pedidos activos"
            value={stats ? stats.pedidos.pendientes + stats.pedidos.en_cocina : '—'}
            sub={stats ? `${stats.pedidos.total} en total` : ''}
            tone="brand"
          />
          <StatCard
            icon={CalendarClock}
            label="Reservas pendientes"
            value={stats ? stats.reservas.pendientes : '—'}
            sub={stats ? `${stats.reservas.confirmadas} confirmadas` : ''}
            tone="warning"
          />
          <StatCard
            icon={AlertTriangle}
            label="Bajo stock"
            value={stats ? stats.inventario.bajo_stock : '—'}
            sub={stats ? `${stats.inventario.total_productos} productos` : ''}
            tone="danger"
          />
          <StatCard
            icon={Wallet}
            label="Valor inventario"
            value={stats ? `S/ ${Number(stats.inventario.valor_total).toFixed(0)}` : '—'}
            tone="success"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ListaCard titulo="Pedidos recientes" verHref="/pedidos">
            {pedidosRecientes.length === 0 ? (
              <div className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No hay pedidos.
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {pedidosRecientes.map((p) => (
                  <li key={p.id} className="flex items-center justify-between rounded-xl border border-black/[0.06] px-4 py-3">
                    <div>
                      <div className="font-medium text-slate-900">{p.producto} × {p.cantidad}</div>
                      <div className="text-xs text-slate-500">{p.cliente} · Mesa {p.mesa}</div>
                    </div>
                    <EstadoPedidoBadge estado={p.estado} />
                  </li>
                ))}
              </ul>
            )}
          </ListaCard>

          <ListaCard titulo="Próximas reservas" verHref="/reservas">
            {reservasProximas.length === 0 ? (
              <div className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Sin reservas próximas.
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {reservasProximas.map((r) => (
                  <li key={r.id} className="flex items-center justify-between rounded-xl border border-black/[0.06] px-4 py-3">
                    <div>
                      <div className="font-medium text-slate-900">{r.cliente}</div>
                      <div className="text-xs text-slate-500">
                        {String(r.fecha).slice(0, 10)} · {String(r.hora).slice(0, 5)} · {r.personas} pers · Mesa {r.mesa}
                      </div>
                    </div>
                    <EstadoReservaBadge estado={r.estado} />
                  </li>
                ))}
              </ul>
            )}
          </ListaCard>
        </div>
      </div>
    </AppShell>
  );
}
