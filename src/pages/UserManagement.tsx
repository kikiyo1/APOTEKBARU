/**
 * User Management page for admin to manage users
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useUserStore } from '../store/userStore';
import { useTransactionStore } from '../store/transactionStore';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  UserPlus,
  Shield,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    role: 'kasir' as 'admin' | 'kasir'
  });

  const { users, addUser, updateUser, deleteUser, resetUsers } = useUserStore();
  const { resetTransactions } = useTransactionStore();

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!formData.username || !formData.name) {
      alert('Username dan Nama harus diisi!');
      return;
    }

    // Check if username already exists
    if (users.some(user => user.username === formData.username)) {
      alert('Username sudah digunakan!');
      return;
    }

    addUser(formData);
    setFormData({ username: '', name: '', email: '', role: 'kasir' });
    setShowAddUser(false);
    alert('User berhasil ditambahkan!');
  };

  const handleEditUser = () => {
    if (!selectedUser || !formData.username || !formData.name) {
      alert('Username dan Nama harus diisi!');
      return;
    }

    // Check if username already exists (except current user)
    if (users.some(user => user.username === formData.username && user.id !== selectedUser.id)) {
      alert('Username sudah digunakan!');
      return;
    }

    updateUser(selectedUser.id, formData);
    setSelectedUser(null);
    setFormData({ username: '', name: '', email: '', role: 'kasir' });
    setShowEditUser(false);
    alert('User berhasil diupdate!');
  };

  const handleDeleteUser = (user: any) => {
    if (user.username === 'admin') {
      alert('User admin tidak dapat dihapus!');
      return;
    }

    if (confirm(`Hapus user ${user.name}?`)) {
      deleteUser(user.id);
      alert('User berhasil dihapus!');
    }
  };

  const handleResetAllData = () => {
    if (confirm('PERINGATAN: Ini akan menghapus SEMUA data transaksi dan mereset user ke default. Apakah Anda yakin?')) {
      resetTransactions();
      resetUsers();
      alert('Semua data berhasil direset!');
      setShowResetDialog(false);
    }
  };

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email || '',
      role: user.role
    });
    setShowEditUser(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-gray-600">Kelola pengguna dan hak akses sistem</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowResetDialog(true)}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Data
          </Button>
          <Button onClick={() => setShowAddUser(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total User</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Admin</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserPlus className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kasir</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'kasir').length}
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
              placeholder="Cari berdasarkan nama, username, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            Kelola semua pengguna yang memiliki akses ke sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Username</th>
                  <th className="text-left p-3">Nama</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Terdaftar</th>
                  <th className="text-left p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <p className="font-medium">{user.username}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-900">{user.name}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-600">{user.email || '-'}</p>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}
                      >
                        {user.role === 'admin' ? 'Admin' : 'Kasir'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-600">{formatDate(user.createdAt)}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.username !== 'admin' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah User Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (Opsional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Masukkan email"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value: 'admin' | 'kasir') => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kasir">Kasir</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowAddUser(false)} className="flex-1">
                Batal
              </Button>
              <Button onClick={handleAddUser} className="flex-1">
                Tambah User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email (Opsional)</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Masukkan email"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={(value: 'admin' | 'kasir') => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kasir">Kasir</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowEditUser(false)} className="flex-1">
                Batal
              </Button>
              <Button onClick={handleEditUser} className="flex-1">
                Update User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Data Modal */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Reset Semua Data
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800 font-medium mb-2">PERINGATAN!</p>
              <p className="text-red-700 text-sm">
                Tindakan ini akan menghapus:
              </p>
              <ul className="text-red-700 text-sm mt-2 list-disc list-inside">
                <li>Semua data transaksi</li>
                <li>Semua data penjualan</li>
                <li>Mengembalikan user ke default (admin & kasir)</li>
              </ul>
              <p className="text-red-700 text-sm mt-2 font-medium">
                Tindakan ini TIDAK DAPAT DIBATALKAN!
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowResetDialog(false)} className="flex-1">
                Batal
              </Button>
              <Button 
                onClick={handleResetAllData} 
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Ya, Reset Semua Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
