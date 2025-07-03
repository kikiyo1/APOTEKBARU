/**
 * Transactions page for processing sales and viewing transaction history
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, Plus, Search, Receipt, Calendar } from 'lucide-react';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock transaction data
  const transactions = [
    {
      id: '1',
      transactionNumber: 'TRX202501021001',
      cashierName: 'Kasir 1',
      patientName: 'John Doe',
      total: 45000,
      paymentMethod: 'cash',
      createdAt: new Date('2025-01-02T10:30:00')
    },
    {
      id: '2',
      transactionNumber: 'TRX202501021002',
      cashierName: 'Kasir 1',
      patientName: null,
      total: 15000,
      paymentMethod: 'card',
      createdAt: new Date('2025-01-02T11:15:00')
    },
    {
      id: '3',
      transactionNumber: 'TRX202501021003',
      cashierName: 'Kasir 1',
      patientName: 'Jane Smith',
      total: 75000,
      paymentMethod: 'transfer',
      createdAt: new Date('2025-01-02T11:45:00')
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPaymentMethodBadge = (method: string) => {
    const variants = {
      cash: 'bg-green-100 text-green-800',
      card: 'bg-blue-100 text-blue-800',
      transfer: 'bg-purple-100 text-purple-800'
    };

    const labels = {
      cash: 'Tunai',
      card: 'Kartu',
      transfer: 'Transfer'
    };

    return (
      <Badge className={variants[method as keyof typeof variants]}>
        {labels[method as keyof typeof labels]}
      </Badge>
    );
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.cashierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const todayTransactions = transactions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaksi</h1>
          <p className="text-gray-600">Kelola transaksi penjualan apotek</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 h-12 px-6">
          <Plus className="w-5 h-5 mr-2" />
          Transaksi Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Transaksi Hari Ini</p>
                <p className="text-2xl font-bold">{todayTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendapatan Hari Ini</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(todayRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rata-rata per Transaksi</p>
                <p className="text-2xl font-bold">
                  {todayTransactions > 0 
                    ? formatCurrency(todayRevenue / todayTransactions)
                    : formatCurrency(0)
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan nomor transaksi, nama pasien, atau kasir..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
          <CardDescription>
            Daftar semua transaksi penjualan hari ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">No. Transaksi</th>
                  <th className="text-left p-3">Kasir</th>
                  <th className="text-left p-3">Pasien</th>
                  <th className="text-left p-3">Total</th>
                  <th className="text-left p-3">Pembayaran</th>
                  <th className="text-left p-3">Waktu</th>
                  <th className="text-left p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <p className="font-medium">{transaction.transactionNumber}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-900">{transaction.cashierName}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-900">
                        {transaction.patientName || 'Umum'}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-green-600">
                        {formatCurrency(transaction.total)}
                      </p>
                    </td>
                    <td className="p-3">
                      {getPaymentMethodBadge(transaction.paymentMethod)}
                    </td>
                    <td className="p-3">
                      <p className="text-gray-600">
                        {formatDateTime(transaction.createdAt)}
                      </p>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Receipt className="w-4 h-4 mr-1" />
                          Print
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
