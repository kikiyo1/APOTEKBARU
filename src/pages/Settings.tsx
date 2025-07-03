/**
 * Settings page for system configuration (Admin only)
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  Printer, 
  Database, 
  Users, 
  Shield,
  Save,
  Download
} from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    storeName: 'Apotek Sehat Bersama',
    storeAddress: 'Jl. Kesehatan No. 123, Jakarta',
    storePhone: '021-12345678',
    
    // Printer Settings
    printerName: 'EPSON TM-T82',
    printerWidth: '80mm',
    printLogo: true,
    printHeader: true,
    printFooter: true,
    
    // System Settings
    autoBackup: true,
    backupInterval: 'daily',
    lowStockAlert: true,
    lowStockThreshold: 10,
    
    // Receipt Settings
    receiptFooter: 'Terima kasih atas kunjungan Anda',
    showPatientInfo: true,
    showTax: true,
    taxRate: 10
  });

  const handleSave = () => {
    // Save settings logic here
    alert('Pengaturan berhasil disimpan!');
  };

  const handleBackup = () => {
    // Backup data logic here
    alert('Backup data berhasil dibuat!');
  };

  const handleRestore = () => {
    // Restore data logic here
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert('Data berhasil dipulihkan!');
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600">Konfigurasi sistem dan preferensi aplikasi</p>
        </div>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Simpan Pengaturan
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="printer">Printer</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="users">Pengguna</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5" />
                  <span>Informasi Apotek</span>
                </CardTitle>
                <CardDescription>
                  Konfigurasi informasi dasar apotek
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeName">Nama Apotek</Label>
                    <Input
                      id="storeName"
                      value={settings.storeName}
                      onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="storePhone">Nomor Telepon</Label>
                    <Input
                      id="storePhone"
                      value={settings.storePhone}
                      onChange={(e) => setSettings({...settings, storePhone: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="storeAddress">Alamat Apotek</Label>
                  <Input
                    id="storeAddress"
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({...settings, storeAddress: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Stok</CardTitle>
                <CardDescription>
                  Konfigurasi peringatan dan manajemen stok
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowStockAlert">Peringatan Stok Minim</Label>
                    <p className="text-sm text-gray-600">
                      Tampilkan notifikasi ketika stok produk minim
                    </p>
                  </div>
                  <Switch
                    id="lowStockAlert"
                    checked={settings.lowStockAlert}
                    onCheckedChange={(checked) => setSettings({...settings, lowStockAlert: checked})}
                  />
                </div>
                <div>
                  <Label htmlFor="lowStockThreshold">Batas Minimum Stok</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => setSettings({...settings, lowStockThreshold: parseInt(e.target.value)})}
                    className="w-32"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Printer Settings */}
        <TabsContent value="printer">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Printer className="h-5 w-5" />
                <span>Pengaturan Printer</span>
              </CardTitle>
              <CardDescription>
                Konfigurasi printer untuk cetak struk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="printerName">Nama Printer</Label>
                  <Input
                    id="printerName"
                    value={settings.printerName}
                    onChange={(e) => setSettings({...settings, printerName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="printerWidth">Lebar Kertas</Label>
                  <Input
                    id="printerWidth"
                    value={settings.printerWidth}
                    onChange={(e) => setSettings({...settings, printerWidth: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="printLogo">Cetak Logo</Label>
                    <p className="text-sm text-gray-600">Tampilkan logo apotek di struk</p>
                  </div>
                  <Switch
                    id="printLogo"
                    checked={settings.printLogo}
                    onCheckedChange={(checked) => setSettings({...settings, printLogo: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="printHeader">Cetak Header</Label>
                    <p className="text-sm text-gray-600">Tampilkan informasi apotek di struk</p>
                  </div>
                  <Switch
                    id="printHeader"
                    checked={settings.printHeader}
                    onCheckedChange={(checked) => setSettings({...settings, printHeader: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="printFooter">Cetak Footer</Label>
                    <p className="text-sm text-gray-600">Tampilkan pesan penutup di struk</p>
                  </div>
                  <Switch
                    id="printFooter"
                    checked={settings.printFooter}
                    onCheckedChange={(checked) => setSettings({...settings, printFooter: checked})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="receiptFooter">Pesan Footer Struk</Label>
                <Input
                  id="receiptFooter"
                  value={settings.receiptFooter}
                  onChange={(e) => setSettings({...settings, receiptFooter: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Backup & Restore</span>
              </CardTitle>
              <CardDescription>
                Kelola backup dan pemulihan data sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoBackup">Backup Otomatis</Label>
                  <p className="text-sm text-gray-600">
                    Backup data secara otomatis sesuai jadwal
                  </p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto">
                      <Download className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium">Backup Data</h3>
                    <p className="text-sm text-gray-600">
                      Buat salinan data untuk keamanan
                    </p>
                    <Button onClick={handleBackup} className="w-full">
                      Buat Backup
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto">
                      <Database className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-medium">Restore Data</h3>
                    <p className="text-sm text-gray-600">
                      Pulihkan data dari file backup
                    </p>
                    <Button onClick={handleRestore} variant="outline" className="w-full">
                      Pilih File Backup
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Manajemen Pengguna</span>
              </CardTitle>
              <CardDescription>
                Kelola pengguna dan hak akses sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Manajemen Pengguna
                </h3>
                <p className="text-gray-600 mb-4">
                  Fitur manajemen pengguna akan segera tersedia
                </p>
                <Button variant="outline">
                  Pelajari Lebih Lanjut
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
