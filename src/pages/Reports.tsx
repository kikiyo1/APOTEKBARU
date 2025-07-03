/**
 * Reports page for generating various business reports
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Package,
  Users,
  FileText
} from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [period, setPeriod] = useState('today');

  // Mock report data
  const salesData = {
    today: { revenue: 2750000, transactions: 43, avgTransaction: 63953 },
    week: { revenue: 18250000, transactions: 285, avgTransaction: 64035 },
    month: { revenue: 75000000, transactions: 1150, avgTransaction: 65217 }
  };

  const stockData = [
    { category: 'Analgesik', total: 850, low: 3, value: 12750000 },
    { category: 'Antibiotik', total: 320, low: 8, value: 25600000 },
    { category: 'Vitamin', total: 180, low: 1, value: 5400000 },
    { category: 'Antasida', total: 95, low: 0, value: 2850000 }
  ];

  const topProducts = [
    { name: 'Paracetamol 500mg', sold: 125, revenue: 375000 },
    { name: 'Amoxicillin 250mg', sold: 85, revenue: 680000 },
    { name: 'Vitamin C 500mg', sold: 72, revenue: 1080000 },
    { name: 'OBH Combi', sold: 68, revenue: 544000 },
    { name: 'Betadine 15ml', sold: 45, revenue: 225000 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const getPeriodLabel = (period: string) => {
    const labels = {
      today: 'Hari Ini',
      week: 'Minggu Ini',
      month: 'Bulan Ini'
    };
    return labels[period as keyof typeof labels];
  };

  const currentSales = salesData[period as keyof typeof salesData];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-600">Analisis performa dan laporan bisnis apotek</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Laporan
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis laporan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Laporan Penjualan</SelectItem>
                  <SelectItem value="stock">Laporan Stok</SelectItem>
                  <SelectItem value="products">Laporan Produk</SelectItem>
                  <SelectItem value="customers">Laporan Pasien</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode
              </label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="week">Minggu Ini</SelectItem>
                  <SelectItem value="month">Bulan Ini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Report */}
      {reportType === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Pendapatan</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(currentSales.revenue)}
                    </p>
                    <p className="text-sm text-gray-500">{getPeriodLabel(period)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Transaksi</p>
                    <p className="text-2xl font-bold">{currentSales.transactions}</p>
                    <p className="text-sm text-gray-500">{getPeriodLabel(period)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rata-rata per Transaksi</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(currentSales.avgTransaction)}
                    </p>
                    <p className="text-sm text-gray-500">{getPeriodLabel(period)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Produk Terlaris</CardTitle>
              <CardDescription>
                Daftar produk dengan penjualan tertinggi {getPeriodLabel(period).toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sold} terjual</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stock Report */}
      {reportType === 'stock' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stockData.map((category, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-medium">{category.category}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Produk:</span>
                      <span className="font-medium">{category.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stok Minim:</span>
                      <Badge variant={category.low > 0 ? "destructive" : "secondary"}>
                        {category.low}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Nilai Stok:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(category.value)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other Report Types Placeholder */}
      {(reportType === 'products' || reportType === 'customers') && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Laporan {reportType === 'products' ? 'Produk' : 'Pasien'}
            </h3>
            <p className="text-gray-600 mb-4">
              Fitur laporan ini akan segera tersedia
            </p>
            <Button variant="outline">
              Pelajari Lebih Lanjut
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
