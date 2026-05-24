import { useEffect, useMemo, useState } from 'react';
import { Plus, ListChecks, Clock, ChefHat, CheckCircle2 } from 'lucide-react';
import { api } from '../api.js';
import { cn } from '../lib/cn.js';
import { AppShell } from '../components/layout/AppShell.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { StatCard } from '../components/ui/StatCard.jsx';
import { Input, Select } from '../components/ui/Field.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { EstadoPedidoBadge } from '../components/ui/Badge.jsx';

const ESTADOS = ['Pendiente', 'En cocina', 'Entregado'];
const FORM_VACIO = { cliente: '', mesero: '', producto: '', cantidad: '', mesa: '', estado: 'Pendiente' };

function siguienteEstado(estado) {
  const i = ESTADOS.indexOf(estado);
  return ESTADOS[(i + 1) % ESTADOS.length];
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [modal, setModal] = useState(false);
  const [filtroMesero, setFiltroMesero] = useState('Todos');
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
  useEffect(() => { cargar(); }, []);

  const meseros = useMemo(() => [...new Set(pedidos.map((p) => p.mesero))].sort(), [pedidos]);
  const visibles = useMemo(
    () => (filtroMesero === 'Todos' ? pedidos : pedidos.filter((p) => p.mesero === filtroMesero)),
    [pedidos, filtroMesero]
  );
  const resumen = useMemo(
    () => ({
      total: pedidos.length,
      pendientes: pedidos.filter((p) => p.estado === 'Pendiente').length,
      cocina: pedidos.filter((p) => p.estado === 'En cocina').length,
      entregados: pedidos.filter((p) => p.estado === 'Entregado').length,
    }),
    [pedidos]
  );

  const onChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  async function crear(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.crearPedido({
        cliente: form.cliente.trim(),
        mesero: form.mesero.trim(),
        producto: form.producto.trim(),
        cantidad: Number(form.cantidad),
        mesa: Number(form.mesa),
        estado: form.estado,
      });
      setForm(FORM_VACIO);
      setModal(false);
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }
  async function cambiar(p) {
    try { await api.cambiarEstado(p.id, siguienteEstado(p.estado)); await cargar(); }
    catch (err) { setError(err.message); }
  }
  async function eliminar(p) {
    if (!window.confirm(`¿Eliminar el pedido de ${p.cliente}?`)) return;
    try { await api.eliminarPedido(p.id); await cargar(); }
    catch (err) { setError(err.message); }
  }

  const columns = [
    { header: '#', className: 'text-slate-400', render: (_, i) => i + 1 },
    { header: 'Cliente', className: 'font-medium text-slate-900', render: (p) => p.cliente },
    { header: 'Mesero', render: (p) => p.mesero },
    { header: 'Producto', render: (p) => p.producto },
    { header: 'Cant.', render: (p) => p.cantidad },
    { header: 'Mesa', render: (p) => p.mesa },
    { header: 'Estado', render: (p) => <EstadoPedidoBadge estado={p.estado} /> },
    {
      header: 'Acciones', align: 'right',
      render: (p) => (
        <div className="flex justify-end gap-2 whitespace-nowrap">
          <Button size="sm" variant="secondary" onClick={() => cambiar(p)}>Cambiar</Button>
          <Button size="sm" variant="danger" onClick={() => eliminar(p)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  const renderMobile = (p) => (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium text-slate-900">
            {p.producto} <span className="text-slate-400">× {p.cantidad}</span>
          </div>
          <div className="mt-0.5 text-xs text-slate-500">{p.cliente} · Mesa {p.mesa} · {p.mesero}</div>
        </div>
        <EstadoPedidoBadge estado={p.estado} />
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => cambiar(p)}>Cambiar</Button>
        <Button size="sm" variant="danger" onClick={() => eliminar(p)}>Eliminar</Button>
      </div>
    </>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Pedidos"
          subtitle="Registro y seguimiento de pedidos"
          action={
            <Button onClick={() => setModal(true)}>
              <Plus size={16} /> Nuevo pedido
            </Button>
          }
        />

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={ListChecks} label="Total" value={resumen.total} tone="brand" />
          <StatCard icon={Clock} label="Pendientes" value={resumen.pendientes} tone="warning" />
          <StatCard icon={ChefHat} label="En cocina" value={resumen.cocina} tone="info" />
          <StatCard icon={CheckCircle2} label="Entregados" value={resumen.entregados} tone="success" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-slate-500">Mesero:</span>
          {['Todos', ...meseros].map((m) => (
            <button
              key={m}
              onClick={() => setFiltroMesero(m)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                filtroMesero === m ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <DataTable
          columns={columns}
          rows={cargando ? [] : visibles}
          getKey={(p) => p.id}
          empty={cargando ? 'Cargando…' : 'No hay pedidos registrados.'}
          renderMobile={renderMobile}
        />
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Nuevo pedido">
        <form onSubmit={crear} className="space-y-3">
          <Input id="cliente" label="Cliente" value={form.cliente} onChange={onChange} placeholder="Nombre del cliente" autoFocus />
          <Input id="mesero" label="Mesero" value={form.mesero} onChange={onChange} placeholder="Nombre del mesero" />
          <Input id="producto" label="Producto" value={form.producto} onChange={onChange} placeholder="Producto" />
          <div className="grid grid-cols-2 gap-3">
            <Input id="cantidad" label="Cantidad" type="number" min="1" value={form.cantidad} onChange={onChange} placeholder="Ej. 2" />
            <Input id="mesa" label="Mesa" type="number" min="1" value={form.mesa} onChange={onChange} placeholder="Ej. 4" />
          </div>
          <Select id="estado" label="Estado" value={form.estado} onChange={onChange}>
            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </Select>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" full onClick={() => setModal(false)}>Cancelar</Button>
            <Button type="submit" full>Registrar</Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
