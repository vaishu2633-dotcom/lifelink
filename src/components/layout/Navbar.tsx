import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  Droplet,
  Search,
  AlertCircle,
  Building,
  Calendar,
  GraduationCap,
  Sparkles,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { dataService } from '../../services/dataService';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const notifications = dataService.getNotifications(user?.id);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getDashboardPage = () => {
    switch (role) {
      case 'donor':
        return 'donor-dashboard';
      case 'patient':
        return 'patient-dashboard';
      case 'blood_bank':
        return 'blood-bank-dashboard';
      case 'admin':
        return 'admin-dashboard';
      default:
        return 'donor-dashboard';
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'find-blood', label: 'Find Blood', icon: Search },
    { id: 'emergency-sos', label: 'Emergency SOS', icon: AlertCircle, isEmergency: true },
    { id: 'rare-blood', label: 'Rare Blood', icon: Sparkles },
    { id: 'blood-banks', label: 'Blood Banks', icon: Building },
    { id: 'camps', label: 'Camps', icon: Calendar },
    { id: 'colleges', label: 'Colleges', icon: GraduationCap },
    { id: 'about', label: 'About Us', icon: Compass }
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotificationsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Droplet className="w-6 h-6 fill-white text-white drop-shadow-sm" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-[#B71C1C] transition-colors">
                  LIFE<span className="text-[#E53935]">LINK</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-red-50 text-[#B71C1C] border border-red-200">
                  SMART
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium tracking-tight -mt-0.5">
                Every Drop Connects a Life
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => {
              const isActive = currentPage === link.id;
              if (link.isEmergency) {
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className="relative ml-1 mr-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#B71C1C] to-[#E53935] hover:from-[#8E0E00] hover:to-[#B71C1C] shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center space-x-1.5 animate-pulse"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Emergency SOS</span>
                  </button>
                );
              }
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-[#B71C1C] bg-red-50/80 font-bold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right Header Area: Notifications & User Profile / Login */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#E53935] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                      Notifications & Alerts ({notifications.length})
                    </span>
                    <span className="text-[11px] text-gray-400">Real-time Feed</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-400 p-4 text-center">No active notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            dataService.markNotificationAsRead(n.id);
                            if (n.link) handleNav(n.link.replace('/', ''));
                            setNotificationsOpen(false);
                          }}
                          className={`p-3 text-xs hover:bg-gray-50 cursor-pointer transition-colors ${
                            !n.is_read ? 'bg-red-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-bold text-gray-900">{n.title}</span>
                            <span className="text-[9px] text-gray-400">Recent</span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Dashboard Menu or Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-medium text-gray-700"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#B71C1C] to-[#E53935] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user.full_name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-bold text-gray-900 leading-tight truncate max-w-[110px]">
                      {user.full_name}
                    </div>
                    <div className="text-[10px] text-gray-400 capitalize -mt-0.5 font-semibold">
                      {user.role.replace('_', ' ')}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900">{user.full_name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#B71C1C] uppercase">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>

                    <button
                      onClick={() => handleNav(getDashboardPage())}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-red-50 hover:text-[#B71C1C] flex items-center space-x-2 transition-colors font-semibold"
                    >
                      <User className="w-4 h-4 text-[#B71C1C]" />
                      <span>My Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        handleNav('home');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-3 py-2 text-xs font-bold text-gray-700 hover:text-[#B71C1C] transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-[#B71C1C] hover:bg-[#8E0E00] rounded-xl shadow-sm transition-all"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  link.isEmergency
                    ? 'bg-red-600 text-white font-bold'
                    : isActive
                    ? 'bg-red-50 text-[#B71C1C] font-bold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}

          {user && (
            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={() => handleNav(getDashboardPage())}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-900"
              >
                <User className="w-4 h-4 text-[#B71C1C]" />
                <span>Go to My Dashboard ({role})</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
