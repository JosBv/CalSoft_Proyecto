import { useEffect, useMemo, useState } from 'react';
import { Plus, Package, AlertTriangle, Wallet } from 'lucide-react';
import { api } from '../api.js';
import { AppShell } from '../components/layout/AppShell.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { StatCard } from '../components/ui/StatCard.jsx';
import { Input } from '../components/ui/Field.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Badge } from '../components/ui/Badge.jsx';

const FORM_VACIO = { producto: '', categoria: '', stock: '', unidad: 'unidad', stock_minimo: '', precio: '' };

export default function Inventario() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    try {
      setItems((await api.listarInventario()) || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }
  useEffect(() => { cargar(); }, []);

  const valorTotal = useMemo(
    () => items.reduce((acc, i) => acc + i.stock * Number(i.precio), 0),
    [items]
  );
  const bajoStock = useMemo(() => items.filter((i) => i.stock <= i.stock_minimo).length, [items]);

  const onChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  function abrirNuevo() {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setModal(true);
  }
  function abrirEditar(item) {
    setEditandoId(item.id);
    setForm({
      producto: item.producto, categoria: item.categoria, stock: String(item.stock),
      unidad: item.unidad, stock_minimo: String(item.stock_minimo), precio: String(item.precio),
    });
    setModal(true);
  }

  async function guardar(e) {
    e.preventDefault();
    setError(null);
    const datos = {
      producto: form.producto.trim(),
      categoria: form.categoria.trim() || 'General',
      stock: Number(form.stock),
      unidad: form.unidad.trim() || 'unidad',
      stock_minimo: Number(form.stock_minimo) || 0,
      precio: Number(form.precio) || 0,
    };
    try {
      if (editandoId) await api.actualizarProducto(editandoId, datos);
      else await api.crearProducto(datos);
      setModal(false);
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }
  async function eliminar(item) {
    if (!window.confirm(`¿Eliminar "${item.producto}"?`)) return;
    try { await api.eliminarProducto(item.id); await cargar(); }
    catch (err) { setError(err.message); }
  }

  const columns = [
    { header: 'Producto', className: 'font-medium text-slate-900', render: (i) => i.producto },
    { header: 'Categoría', render: (i) => i.categoria },
    {
      header: 'Stock',
      render: (i) => (
        <span className="inline-flex items-center gap-1.5">
          {i.stock} {i.unidad}
          {i.stock <= i.stock_minimo && <Badge tone="danger">bajo</Badge>}
        </span>
      ),
    },
    { header: 'Mínimo', render: (i) => i.stock_minimo },
    { header: 'Precio', render: (i) => `S/ ${Number(i.precio).toFixed(2)}` },
    {
      header: 'Acciones', align: 'right',
      render: (i) => (
        <div className="flex justify-end gap-2 whitespace-nowrap">
          <Button size="sm" variant="secondary" onClick={() => abrirEditar(i)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => eliminar(i)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  const renderMobile = (i) => (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium text-slate-900">{i.producto}</div>
          <div className="mt-0.5 text-xs text-slate-500">{i.categoria} · S/ {Number(i.precio).toFixed(2)}</div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
          {i.stock} {i.unidad}
          {i.stock <= i.stock_minimo && <Badge tone="danger">bajo</Badge>}
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => abrirEditar(i)}>Editar</Button>
        <Button size="sm" variant="danger" onClick={() => eliminar(i)}>Eliminar</Button>
      </div>
    </>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Inventario"
          subtitle="Control de productos y stock"
          action={<Button onClick={abrirNuevo}><Plus size={16} /> Nuevo producto</Button>}
        />

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard icon={Package} label="Productos" value={items.length} tone="brand" />
          <StatCard icon={AlertTriangle} label="Bajo stock" value={bajoStock} tone="warning" />
          <StatCard icon={Wallet} label="Valor total" value={`S/ ${valorTotal.toFixed(2)}`} tone="success" />
        </div>

        <DataTable
          columns={columns}
          rows={cargando ? [] : items}
          getKey={(i) => i.id}
          empty={cargando ? 'Cargando…' : 'No hay productos.'}
          renderMobile={renderMobile}
        />
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editandoId ? 'Editar producto' : 'Nuevo producto'}>
        <form onSubmit={guardar} className="space-y-3">
          <Input id="producto" label="Producto" value={form.producto} onChange={onChange} placeholder="Ej. Pollo entero" autoFocus />
          <Input id="categoria" label="Categoría" value={form.categoria} onChange={onChange} placeholder="Ej. Carnes" />
          <div className="grid grid-cols-2 gap-3">
            <Input id="stock" label="Stock" type="number" min="0" value={form.stock} onChange={onChange} placeholder="Ej. 40" />
            <Input id="unidad" label="Unidad" value={form.unidad} onChange={onChange} placeholder="unidad / kg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="stock_minimo" label="Stock mínimo" type="number" min="0" value={form.stock_minimo} onChange={onChange} placeholder="Ej. 10" />
            <Input id="precio" label="Precio (S/)" type="number" min="0" step="0.01" value={form.precio} onChange={onChange} placeholder="Ej. 18.00" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" full onClick={() => setModal(false)}>Cancelar</Button>
            <Button type="submit" full>{editandoId ? 'Guardar cambios' : 'Agregar'}</Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
