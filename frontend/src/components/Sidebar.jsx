import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, ClipboardList, Shield, LogOut, User } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null; // Don't show sidebar for guests

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'My Orders', path: '/orders', icon: <ClipboardList size={20} /> },
  ];

  if (user.role === 'admin') {
    navItems.push({ name: 'Admin Dashboard', path: '/admin', icon: <Shield size={20} /> });
  }

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col shadow-sm flex-shrink-0 animate-fade-in z-20">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                isActive 
                  ? 'bg-brand-50 text-brand-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition font-medium text-red-500 hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
