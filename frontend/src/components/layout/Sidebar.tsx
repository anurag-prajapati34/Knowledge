import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Database, Settings, LogOut, Brain, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Knowledge Bases', path: '/dashboard', icon: Database },
    { name: 'Settings (Soon)', path: '#', icon: Settings, disabled: true },
  ];

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none text-black">
      <div>
        {/* Top Header Logo */}
        <div className="h-16 px-6 flex items-center border-b border-zinc-200">
          <Link to="/dashboard" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shadow-md">
              <Brain className="w-4 h-4" />
            </div>
            <span className="font-bold text-black tracking-tight text-base font-serif-heading">
              Knowledge<span className="text-zinc-500">Base</span>
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 cursor-not-allowed opacity-60"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-black text-white font-semibold shadow-sm'
                      : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-zinc-200 bg-zinc-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-black text-white border border-zinc-200 flex items-center justify-center shrink-0 font-medium text-sm">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-black truncate">{user?.full_name || 'User'}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="text-zinc-500 hover:text-black p-2 rounded-lg hover:bg-zinc-200 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
