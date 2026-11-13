import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NotificationBell } from './NotificationBell';
import { LogOut, LayoutDashboard, FileText, BarChart3, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = isAdmin
    ? [
        { to: '/admin/dashboard', label: 'Manage Issues', icon: <LayoutDashboard size={16} /> },
        { to: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
      ]
    : [
        { to: '/citizen/dashboard', label: 'My Issues', icon: <FileText size={16} /> },
        { to: '/citizen/report', label: 'Report Issue', icon: <span className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">+</span> },
      ];

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
      isActive(path) ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={() => setMenuOpen(false)}>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                CivicPulse
              </span>
            </Link>

            {user && (
              <div className="hidden md:ml-10 md:flex md:space-x-4">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                    {link.icon} {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationBell />
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-sm hidden sm:block">
                    <p className="font-medium text-gray-700">{user.fullName}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
                {/* Mobile menu toggle: without this, logged-in users on a
                    phone had no way to reach their dashboard pages. */}
                <button
                  onClick={() => setMenuOpen((open) => !open)}
                  className="md:hidden p-2 text-gray-500 hover:text-primary rounded-full transition-colors"
                  title="Menu"
                  aria-label="Toggle navigation menu"
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile navigation panel */}
        {user && menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={linkClass(link.to)}
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
