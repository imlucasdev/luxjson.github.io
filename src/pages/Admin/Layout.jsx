import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import useCursor from '../../hooks/useCursor';

const iconBase = { strokeWidth: 2.5, size: 20, 'aria-hidden': true };

const NAV_ITEMS = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/posts', icon: FileText, label: 'Posts' },
  { path: '/admin/posts/new', icon: FilePlus, label: 'Novo Post' },
];

const PAGE_TITLES = {
  '/admin': 'Dashboard',
  '/admin/posts': 'Posts',
  '/admin/posts/new': 'Novo Post',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useCursor();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith('/admin/posts/edit')) return 'Editar Post';
    return PAGE_TITLES[location.pathname] || 'Painel';
  };

  return (
    <div className="sh-admin-layout">
      <aside className={`sh-admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sh-admin-sidebar-header">
          {sidebarOpen && <h2>luxjson</h2>}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="sh-sidebar-toggle"
            aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {sidebarOpen ? (
              <ChevronLeft {...iconBase} />
            ) : (
              <ChevronRight {...iconBase} />
            )}
          </button>
        </div>

        <nav className="sh-admin-nav" aria-label="Navegação admin">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`sh-admin-nav-link ${location.pathname === path ? 'active' : ''}`}
              aria-current={location.pathname === path ? 'page' : undefined}
            >
              <Icon {...iconBase} />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sh-admin-sidebar-footer">
          <div className="sh-admin-user">
            {sidebarOpen && <span>{admin?.username || 'Admin'}</span>}
            <button
              onClick={handleLogout}
              className="sh-admin-logout"
              aria-label="Sair"
            >
              <LogOut {...iconBase} />
            </button>
          </div>
        </div>
      </aside>

      <motion.main
        className="sh-admin-main"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="sh-admin-topbar">
          <h1>{getPageTitle()}</h1>
        </div>
        <div className="sh-admin-content">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
