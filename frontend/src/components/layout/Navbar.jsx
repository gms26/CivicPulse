import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NotificationBell } from './NotificationBell';
import { LogOut, LayoutDashboard, FileText, BarChart3, Settings } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                CivicPulse
              </span>
            </Link>
            
            {user && (
              <div className="hidden md:ml-10 md:flex md:space-x-4">
                {isAdmin ? (
                  <>
                    <Link to="/admin/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/admin/dashboard') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <LayoutDashboard size={16} /> Manage Issues
                    </Link>
                    <Link to="/admin/analytics" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/admin/analytics') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <BarChart3 size={16} /> Analytics
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/citizen/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/citizen/dashboard') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <FileText size={16} /> My Issues
                    </Link>
                    <Link to="/citizen/report" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/citizen/report') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <span className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">+</span> Report Issue
                    </Link>
                  </>
                )}
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
      </div>
    </nav>
  );
};
