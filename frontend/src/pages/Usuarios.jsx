import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../api.js';
import { getUsuario } from '../auth.js';
import { AppShell } from '../components/layout/AppShell.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Input, Select } from '../components/ui/Field.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Badge } from '../components/ui/Badge.jsx';

const ROLES = ['Administrador', 'Mesero', 'Cocina', 'Empleado'];
const FORM_VACIO = { usuario: '', clave: '', rol: 'Empleado' };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const usuarioActual = getUsuario();

  async function cargar() {
    try {
      setUsuarios((await api.listarUsuarios()) || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }
  useEffect(() => { cargar(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  async function crear(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.crearUsuario({ usuario: form.usuario.trim(), clave: form.clave.trim(), rol: form.rol });
      setForm(FORM_VACIO);
      setModal(false);
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }
  async function cambiarRol(u, rol) {
    try { await api.actualizarUsuario(u.id, { rol }); await cargar(); }
    catch (err) { setError(err.message); }
  }
  async function resetClave(u) {
    const nueva = window.prompt(`Nueva clave para "${u.usuario}" (mínimo 4 caracteres):`);
    if (!nueva) return;
    try { await api.actualizarUsuario(u.id, { clave: nueva.trim() }); window.alert('Clave actualizada.'); }
    catch (err) { setError(err.message); }
  }
  async function eliminar(u) {
    if (!window.confirm(`¿Eliminar al usuario "${u.usuario}"?`)) return;
    try { await api.eliminarUsuario(u.id); await cargar(); }
    catch (err) { setError(err.message); }
  }

  const selectRol = (u) => (
    <Select
      className="inline-block h-9 w-auto py-0 text-xs"
      value={u.rol}
      onChange={(e) => cambiarRol(u, e.target.value)}
    >
      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
    </Select>
  );

  const columns = [
    {
      header: 'Usuario', className: 'font-medium text-slate-900',
      render: (u) => (
        <span className="inline-flex items-center gap-1.5">
          {u.usuario}
          {u.usuario === usuarioActual && <Badge tone="info">tú</Badge>}
        </span>
      ),
    },
    { header: 'Rol', render: (u) => selectRol(u) },
    { header: 'Creado', render: (u) => String(u.creado_en).slice(0, 10) },
    {
      header: 'Acciones', align: 'right',
      render: (u) => (
        <div className="flex justify-end gap-2 whitespace-nowrap">
          <Button size="sm" variant="secondary" onClick={() => resetClave(u)}>Resetear clave</Button>
          <Button size="sm" variant="danger" disabled={u.usuario === usuarioActual} onClick={() => eliminar(u)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  const renderMobile = (u) => (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
          {u.usuario}
          {u.usuario === usuarioActual && <Badge tone="info">tú</Badge>}
        </span>
        {selectRol(u)}
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => resetClave(u)}>Resetear clave</Button>
        <Button size="sm" variant="danger" disabled={u.usuario === usuarioActual} onClick={() => eliminar(u)}>Eliminar</Button>
      </div>
    </>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Usuarios"
          subtitle="Gestión de empleados y accesos"
          action={<Button onClick={() => setModal(true)}><Plus size={16} /> Nuevo usuario</Button>}
        />

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            {error}
          </div>
        )}

        <DataTable
          columns={columns}
          rows={cargando ? [] : usuarios}
          getKey={(u) => u.id}
          empty={cargando ? 'Cargando…' : 'No hay usuarios.'}
          renderMobile={renderMobile}
        />
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Nuevo usuario">
        <form onSubmit={crear} className="space-y-3">
          <Input id="usuario" label="Usuario" value={form.usuario} onChange={onChange} placeholder="Nombre de usuario" autoFocus />
          <Input id="clave" label="Clave" type="password" value={form.clave} onChange={onChange} placeholder="Mínimo 4 caracteres" />
          <Select id="rol" label="Rol" value={form.rol} onChange={onChange}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" full onClick={() => setModal(false)}>Cancelar</Button>
            <Button type="submit" full>Crear</Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
