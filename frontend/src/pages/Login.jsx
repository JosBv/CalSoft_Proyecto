import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { guardarSesion } from '../auth.js';
import { Input } from '../components/ui/Field.jsx';
import { Button } from '../components/ui/Button.jsx';

const CHIPS = ['Pedidos', 'Reservas', 'Inventario', 'Cocina'];

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const data = await api.login(usuario.trim(), clave.trim());
      guardarSesion(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error de conexión');
      setCargando(false);
    }
  }

  const Form = (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-ink">Iniciar sesión</h2>
        <p className="mt-1 text-sm text-slate-500">Ingresa al panel de gestión</p>
      </div>

      <Input
        id="usuario"
        label="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        placeholder="Ingrese su usuario"
        autoFocus
      />
      <Input
        id="clave"
        label="Contraseña"
        type="password"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
        placeholder="Ingrese su contraseña"
      />

      {error && (
        <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" full disabled={cargando}>
        {cargando ? 'Ingresando…' : 'Ingresar'}
      </Button>

      <p className="text-center text-xs text-slate-400">
        Demo: <span className="font-semibold text-slate-500">admin</span> /{' '}
        <span className="font-semibold text-slate-500">1234</span>
      </p>
    </form>
  );

  return (
    <main className="min-h-screen bg-canvas lg:p-6">
      <div className="lg:grid lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.1fr_1fr] lg:gap-6">
        {/* Hero juguetón (solo desktop) */}
        <aside className="relative hidden flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff3ec] to-[#e9f8ef] px-12 py-12 lg:flex">
          {/* blobs decorativos */}
          <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/10" />
          <div aria-hidden className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-mint/10" />

          <div className="relative flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-10 w-10 rounded-2xl object-contain" />
            <span className="font-display text-xl font-bold tracking-tight text-ink">CalSoft</span>
          </div>

          <div className="relative space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-1.5 text-sm font-semibold text-ink">
              <span className="h-2 w-2 rounded-full bg-brand" />
              Sistema de gestión gastronómica
            </span>

            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink">
              Tu restaurante,
              <br />
              en{' '}
              <span className="font-script text-6xl font-bold text-brand">orden</span>
            </h1>

            <p className="max-w-md text-[15px] leading-relaxed text-slate-600">
              Pedidos, reservas, inventario, cocina y reportes en un solo lugar.
              Simple, rápido y hecho para tu negocio.
            </p>

            <div className="flex flex-wrap gap-2">
              {CHIPS.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-ink ring-1 ring-inset ring-ink/5"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="relative text-xs font-medium text-slate-500">
            Hecho para microempresas gastronómicas 🍲
          </div>
        </aside>

        {/* Panel del formulario */}
        <div className="flex min-h-screen flex-col items-center justify-center px-5 lg:min-h-0 lg:rounded-3xl lg:bg-white lg:px-10 lg:shadow-all">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <img src="/logo.png" alt="" className="h-10 w-10 rounded-2xl object-contain" />
            <span className="font-display text-xl font-bold tracking-tight text-ink">CalSoft</span>
          </div>
          {Form}
        </div>
      </div>
    </main>
  );
}
