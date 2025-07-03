/**
 * Dashboard page showing overview statistics and charts
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { DashboardStats } from '../types';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    todayTransactions: 0,
    totalPatients: 0,
    lowStockProducts: 0,
    todayRevenue: 0,
    monthlyRevenue: [],
    weeklyRevenue: []
  });

  useEffect(() => {
    // Simulate loading dashboard stats
    const loadStats = () => {
      setStats({
        totalProducts: 1250,
        todayTransactions: 43,
        totalPatients: 890,
        lowStockProducts: 12,
        todayRevenue: 2750000,
        monthlyRevenue: [1200000, 1350000, 1500000, 1750000, 2000000, 2250000, 2750000],
        weeklyRevenue: [400000, 450000, 500000, 550000, 600000, 650000, 700000]
      });
    };

    loadStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Produk',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      description: 'Produk tersedia'
    },
    {
      title: 'Transaksi Hari Ini',
      value: stats.todayTransactions,
      icon: ShoppingCart,
      color: 'bg-green-500',
      description: 'Transaksi berhasil'
    },
    {
      title: 'Total Pasien',
      value: stats.totalPatients,
      icon: Users,
      color: 'bg-purple-500',
      description: 'Pasien terdaftar'
    },
    {
      title: 'Stok Minim',
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: 'bg-red-500',
      description: 'Produk perlu restok'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Ringkasan sistem kasir apotek</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Pendapatan Hari Ini</span>
          </CardTitle>
          <CardDescription>Total pendapatan dari transaksi hari ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(stats.todayRevenue)}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 bg-green-50" onClick={() => window.location.href = '#/pos'}>
          <CardHeader>
            <CardTitle className="text-lg text-green-700">POS Kasir</CardTitle>
            <CardDescription>Buka antarmuka kasir untuk transaksi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Kelola Produk</CardTitle>
            <CardDescription>Tambah atau edit produk obat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Data Pasien</CardTitle>
            <CardDescription>Kelola data pasien dan resep</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockProducts > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Peringatan Stok</span>
            </CardTitle>
            <CardDescription className="text-red-700">
              Ada {stats.lowStockProducts} produk dengan stok minim yang perlu segera direstok
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant="destructive" className="text-sm">
                {stats.lowStockProducts} Produk
              </Badge>
              <span className="text-sm text-red-600 cursor-pointer hover:underline">
                Lihat Detail →
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
