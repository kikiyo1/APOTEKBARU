/**
 * Products management page for managing pharmacy inventory
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Package, Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock product data
  const products = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'Analgesik',
      price: 3000,
      stock: 150,
      minStock: 50,
      unit: 'tablet',
      barcode: '1234567890'
    },
    {
      id: '2', 
      name: 'Amoxicillin 250mg',
      category: 'Antibiotik',
      price: 8000,
      stock: 25,
      minStock: 30,
      unit: 'kapsul',
      barcode: '1234567891'
    },
    {
      id: '3',
      name: 'Vitamin C 500mg',
      category: 'Vitamin',
      price: 15000,
      stock: 80,
      minStock: 20,
      unit: 'tablet',
      barcode: '1234567892'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const isLowStock = (stock: number, minStock: number) => stock <= minStock;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>
          <p className="text-gray-600">Kelola produk obat dan stok apotek</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari produk atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Produk</p>
                <p className="text-xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Stok Minim</p>
                <p className="text-xl font-bold text-red-600">
                  {products.filter(p => isLowStock(p.stock, p.minStock)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>
            Kelola semua produk obat yang tersedia di apotek
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Nama Produk</th>
                  <th className="text-left p-3">Kategori</th>
                  <th className="text-left p-3">Harga</th>
                  <th className="text-left p-3">Stok</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">#{product.barcode}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{product.category}</Badge>
                    </td>
                    <td className="p-3 font-medium">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{product.stock} {product.unit}</p>
                        <p className="text-sm text-gray-500">Min: {product.minStock}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      {isLowStock(product.stock, product.minStock) ? (
                        <Badge variant="destructive" className="flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Stok Minim</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Tersedia
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
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

export default Products;
