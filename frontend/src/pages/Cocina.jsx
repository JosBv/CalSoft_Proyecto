import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { api } from '../api.js';
import { AppShell } from '../components/layout/AppShell.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';

export default function Cocina() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    try {
      setPedidos((await api.listarPedidos()) || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, 10000); // refresco automático
    return () => clearInterval(t);
  }, []);

  const pendientes = useMemo(() => pedidos.filter((p) => p.estado === 'Pendiente'), [pedidos]);
  const enCocina = useMemo(() => pedidos.filter((p) => p.estado === 'En cocina'), [pedidos]);

  async function avanzar(pedido, estado) {
    try { await api.cambiarEstado(pedido.id, estado); await cargar(); }
    catch (err) { setError(err.message); }
  }

  function Columna({ titulo, lista, tone, accion }) {
    return (
      <Card>
        <CardBody>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{titulo}</h3>
            <Badge tone={tone}>{lista.length}</Badge>
          </div>
          {lista.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">Sin pedidos.</p>
          ) : (
            <div className="space-y-3">
              {lista.map((p) => (
                <div key={p.id} className="flex items-start justify-between gap-3 rounded-xl border border-black/[0.06] p-3.5">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">
                      {p.producto} <span className="text-slate-400">× {p.cantidad}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      Mesa {p.mesa} · {p.cliente} · Mesero: {p.mesero}
                    </div>
                  </div>
                  <Button size="sm" variant={accion.variant} onClick={() => avanzar(p, accion.estado)}>
                    {accion.icon}
                    {accion.label}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Cocina" subtitle="Pedidos activos en preparación · se actualiza cada 10 s" />

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            {error}
          </div>
        )}

        {cargando ? (
          <p className="text-sm text-slate-400">Cargando…</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <Columna
              titulo="Por preparar"
              lista={pendientes}
              tone="warning"
              accion={{ label: 'A cocina', variant: 'primary', estado: 'En cocina', icon: <ArrowRight size={15} /> }}
            />
            <Columna
              titulo="En preparación"
              lista={enCocina}
              tone="info"
              accion={{ label: 'Entregar', variant: 'success', estado: 'Entregado', icon: <Check size={15} /> }}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
