import { useEffect, useMemo, useState } from 'react';
import { Plus, CalendarCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '../api.js';
import { AppShell } from '../components/layout/AppShell.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { StatCard } from '../components/ui/StatCard.jsx';
import { Input, Select } from '../components/ui/Field.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { EstadoReservaBadge } from '../components/ui/Badge.jsx';

const ESTADOS = ['Pendiente', 'Confirmada', 'Cancelada'];
const FORM_VACIO = { cliente: '', telefono: '', fecha: '', hora: '', personas: '', mesa: '', estado: 'Pendiente' };

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    try {
      setReservas((await api.listarReservas()) || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }
  useEffect(() => { cargar(); }, []);

  const resumen = useMemo(
    () => ({
      total: reservas.length,
      pendientes: reservas.filter((r) => r.estado === 'Pendiente').length,
      confirmadas: reservas.filter((r) => r.estado === 'Confirmada').length,
      canceladas: reservas.filter((r) => r.estado === 'Cancelada').length,
    }),
    [reservas]
  );

  const onChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  async function crear(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.crearReserva({
        cliente: form.cliente.trim(),
        telefono: form.telefono.trim(),
        fecha: form.fecha,
        hora: form.hora,
        personas: Number(form.personas),
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
  async function cambiarEstado(r, estado) {
    try { await api.cambiarEstadoReserva(r.id, estado); await cargar(); }
    catch (err) { setError(err.message); }
  }
  async function eliminar(r) {
    if (!window.confirm(`¿Eliminar la reserva de ${r.cliente}?`)) return;
    try { await api.eliminarReserva(r.id); await cargar(); }
    catch (err) { setError(err.message); }
  }

  const selectEstado = (r) => (
    <Select
      className="inline-block h-9 w-auto py-0 text-xs"
      value={r.estado}
      onChange={(e) => cambiarEstado(r, e.target.value)}
    >
      {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
    </Select>
  );

  const columns = [
    { header: 'Cliente', className: 'font-medium text-slate-900', render: (r) => r.cliente },
    { header: 'Teléfono', render: (r) => r.telefono || '—' },
    { header: 'Fecha', render: (r) => String(r.fecha).slice(0, 10) },
    { header: 'Hora', render: (r) => String(r.hora).slice(0, 5) },
    { header: 'Pers.', render: (r) => r.personas },
    { header: 'Mesa', render: (r) => r.mesa },
    { header: 'Estado', render: (r) => <EstadoReservaBadge estado={r.estado} /> },
    {
      header: 'Acciones', align: 'right',
      render: (r) => (
        <div className="flex justify-end gap-2 whitespace-nowrap">
          {selectEstado(r)}
          <Button size="sm" variant="danger" onClick={() => eliminar(r)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  const renderMobile = (r) => (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium text-slate-900">{r.cliente}</div>
          <div className="mt-0.5 text-xs text-slate-500">
            {String(r.fecha).slice(0, 10)} · {String(r.hora).slice(0, 5)} · {r.personas} pers · Mesa {r.mesa}
          </div>
        </div>
        <EstadoReservaBadge estado={r.estado} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        {selectEstado(r)}
        <Button size="sm" variant="danger" onClick={() => eliminar(r)}>Eliminar</Button>
      </div>
    </>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Reservas"
          subtitle="Administración de reservas del restaurante"
          action={<Button onClick={() => setModal(true)}><Plus size={16} /> Nueva reserva</Button>}
        />

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={CalendarCheck} label="Total" value={resumen.total} tone="brand" />
          <StatCard icon={Clock} label="Pendientes" value={resumen.pendientes} tone="warning" />
          <StatCard icon={CheckCircle2} label="Confirmadas" value={resumen.confirmadas} tone="success" />
          <StatCard icon={XCircle} label="Canceladas" value={resumen.canceladas} tone="danger" />
        </div>

        <DataTable
          columns={columns}
          rows={cargando ? [] : reservas}
          getKey={(r) => r.id}
          empty={cargando ? 'Cargando…' : 'No hay reservas.'}
          renderMobile={renderMobile}
        />
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Nueva reserva">
        <form onSubmit={crear} className="space-y-3">
          <Input id="cliente" label="Cliente" value={form.cliente} onChange={onChange} placeholder="Nombre del cliente" autoFocus />
          <Input id="telefono" label="Teléfono" value={form.telefono} onChange={onChange} placeholder="Opcional" />
          <div className="grid grid-cols-2 gap-3">
            <Input id="fecha" label="Fecha" type="date" value={form.fecha} onChange={onChange} />
            <Input id="hora" label="Hora" type="time" value={form.hora} onChange={onChange} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="personas" label="Personas" type="number" min="1" value={form.personas} onChange={onChange} placeholder="Ej. 4" />
            <Input id="mesa" label="Mesa" type="number" min="1" value={form.mesa} onChange={onChange} placeholder="Ej. 7" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" full onClick={() => setModal(false)}>Cancelar</Button>
            <Button type="submit" full>Registrar</Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
