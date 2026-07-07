import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Package,
  ChefHat,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '../../lib/cn.js';
import { getUsuario, getRol, cerrarSesion } from '../../auth.js';

const NAV = [
  { to: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { to: '/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/reservas', label: 'Reservas', icon: Calendar },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/cocina', label: 'Cocina', icon: ChefHat },
  { to: '/usuarios', label: 'Usuarios', icon: Users },
  { to: '/reportes', label: 'Reportes', icon: BarChart3 },
];

function NavItems({ onNavigate }) {
  return (
    <nav className="flex-1 space-y-0.5 px-3 py-4">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
              isActive
                ? 'bg-brand-soft font-semibold text-brand'
                : 'font-medium text-slate-600 hover:bg-slate-100/70 hover:text-ink'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={18}
                strokeWidth={isActive ? 2.4 : 1.8}
                className={isActive ? 'text-brand' : 'text-slate-400 group-hover:text-ink'}
              />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 border-b border-black/[0.06] px-5 py-4">
      <img src="/logo.png" alt="CalSoft" className="h-9 w-9 rounded-2xl object-contain" />
      <div className="leading-tight">
        <div className="font-display text-base font-bold tracking-tight text-ink">CalSoft</div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
          Sistema POS
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const usuario = getUsuario() || 'Usuario';
  const rol = getRol() || '';

  function salir() {
    cerrarSesion();
    navigate('/login');
  }

  const inicial = usuario.charAt(0).toUpperCase();

  const UserCard = (
    <div className="border-t border-black/[0.06] p-3">
      <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
          {inicial}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-sm font-medium text-ink">{usuario}</div>
          <div className="truncate text-xs text-slate-500">{rol}</div>
        </div>
        <button
          onClick={salir}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-ink"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-black/[0.06] bg-white/80 backdrop-blur-xl lg:flex">
        <Brand />
        <NavItems />
        {UserCard}
      </aside>

      {/* Topbar móvil */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-black/[0.06] bg-white/70 px-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="h-8 w-8 rounded-2xl object-contain" />
          <span className="font-display text-lg font-bold tracking-tight text-ink">CalSoft</span>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Drawer móvil */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
              <Brand />
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>
            <NavItems onNavigate={() => setMenuOpen(false)} />
            {UserCard}
          </div>
        </div>
      )}

      {/* Contenido */}
      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
