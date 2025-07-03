/**
 * Sidebar navigation component for the main layout
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Monitor,
  CreditCard
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'POS Kasir', href: '/pos', icon: CreditCard, highlight: true },
    { name: 'Produk', href: '/products', icon: Package },
    { name: 'Transaksi', href: '/transactions', icon: ShoppingCart },
    { name: 'Pasien', href: '/patients', icon: Users },
    { name: 'Resep', href: '/prescriptions', icon: FileText },
    { name: 'Laporan', href: '/reports', icon: BarChart3 },
  ];

  // Admin only navigation
  if (user?.role === 'admin') {
    navigation.push({ name: 'Pengaturan', href: '/settings', icon: Settings });
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Apotek Sehat</h1>
              <p className="text-xs text-gray-600">Sistem Kasir</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <div className="flex items-center space-x-1">
                <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                  {user?.role === 'admin' ? 'Admin' : 'Kasir'}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              } ${item.highlight ? 'ring-2 ring-green-200 bg-green-50' : ''}`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-blue-700' : 'text-gray-500'} ${item.highlight ? 'text-green-600' : ''}`} />
              {!collapsed && (
                <span className={item.highlight ? 'text-green-700 font-semibold' : ''}>
                  {item.name}
                </span>
              )}
              {!collapsed && item.highlight && (
                <Badge className="bg-green-100 text-green-700 text-xs">New</Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={logout}
          className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${
            collapsed ? 'px-2' : 'px-3'
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Keluar</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;