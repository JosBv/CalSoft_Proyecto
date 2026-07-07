import { useEffect, useState } from 'react';
import {
  ListChecks, Clock, ChefHat, CheckCircle2,
  CalendarCheck, Package, AlertTriangle, Wallet,
} from 'lucide-react';
import { api } from '../api.js';
import { AppShell } from '../components/layout/AppShell.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import { StatCard } from '../components/ui/StatCard.jsx';

export default function Reportes() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.obtenerReportes().then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <AppShell>
        <PageHeader title="Reportes" subtitle="Estadísticas del negocio" />
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
          {error}
        </div>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell>
        <PageHeader title="Reportes" subtitle="Estadísticas del negocio" />
        <p className="mt-6 text-sm text-slate-400">Cargando reportes…</p>
      </AppShell>
    );
  }

  const { pedidos, reservas, inventario, usuariosPorRol, topProductos } = data;
  const maxPedido = Math.max(1, ...topProductos.map((t) => t.total_pedido));

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader title="Reportes" subtitle="Estadísticas del negocio" />

        {/* Pedidos */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-500">Pedidos</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={ListChecks} label="Total" value={pedidos.total} tone="brand" />
            <StatCard icon={Clock} label="Pendientes" value={pedidos.pendientes} tone="warning" />
            <StatCard icon={ChefHat} label="En cocina" value={pedidos.en_cocina} tone="info" />
            <StatCard icon={CheckCircle2} label="Entregados" value={pedidos.entregados} tone="success" />
          </div>
        </section>

        {/* Reservas */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-500">Reservas</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={CalendarCheck} label="Total" value={reservas.total} tone="brand" />
            <StatCard icon={Clock} label="Pendientes" value={reservas.pendientes} tone="warning" />
            <StatCard icon={CheckCircle2} label="Confirmadas" value={reservas.confirmadas} tone="success" />
            <StatCard icon={AlertTriangle} label="Canceladas" value={reservas.canceladas} tone="danger" />
          </div>
        </section>

        {/* Inventario */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-500">Inventario</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={Package} label="Productos" value={inventario.total_productos} tone="info" />
            <StatCard icon={AlertTriangle} label="Bajo stock" value={inventario.bajo_stock} tone="warning" />
            <StatCard
              icon={Wallet}
              label="Valor total"
              value={`S/ ${Number(inventario.valor_total).toFixed(2)}`}
              tone="success"
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top productos */}
          <Card>
            <CardBody>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Top productos pedidos</h3>
              {topProductos.length === 0 ? (
                <p className="text-sm text-slate-400">Aún no hay pedidos.</p>
              ) : (
                <div className="space-y-3">
                  {topProductos.map((t) => (
                    <div key={t.producto}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-slate-700">{t.producto}</span>
                        <span className="text-slate-500">{t.total_pedido}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${(t.total_pedido / maxPedido) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Usuarios por rol */}
          <Card>
            <CardBody>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Usuarios por rol</h3>
              <div className="divide-y divide-slate-100">
                {usuariosPorRol.map((u) => (
                  <div key={u.rol} className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-slate-700">{u.rol}</span>
                    <span className="text-sm font-bold text-slate-900">{u.cantidad}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
