/**
 * Patients management page for managing patient data
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Users, Plus, Search, Edit, FileText, Calendar } from 'lucide-react';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock patient data
  const patients = [
    {
      id: '1',
      medicalRecordNumber: 'RM001234',
      name: 'John Doe',
      dateOfBirth: new Date('1985-06-15'),
      address: 'Jl. Sudirman No. 123, Jakarta',
      phone: '081234567890',
      lastVisit: new Date('2025-01-01')
    },
    {
      id: '2',
      medicalRecordNumber: 'RM001235',
      name: 'Jane Smith',
      dateOfBirth: new Date('1990-03-22'),
      address: 'Jl. Thamrin No. 456, Jakarta',
      phone: '081234567891',
      lastVisit: new Date('2024-12-28')
    },
    {
      id: '3',
      medicalRecordNumber: 'RM001236',
      name: 'Bob Johnson',
      dateOfBirth: new Date('1978-11-08'),
      address: 'Jl. Gatot Subroto No. 789, Jakarta',
      phone: '081234567892',
      lastVisit: new Date('2025-01-02')
    }
  ];

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getVisitStatus = (lastVisit: Date) => {
    const daysDiff = Math.floor((new Date().getTime() - lastVisit.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff <= 7) {
      return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
    } else if (daysDiff <= 30) {
      return <Badge className="bg-yellow-100 text-yellow-800">Reguler</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Lama</Badge>;
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Pasien</h1>
          <p className="text-gray-600">Kelola data pasien dan informasi medis</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pasien
        </Button>
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
                <p className="text-sm text-gray-600">Total Pasien</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kunjungan Minggu Ini</p>
                <p className="text-2xl font-bold">
                  {patients.filter(p => {
                    const daysDiff = Math.floor((new Date().getTime() - p.lastVisit.getTime()) / (1000 * 3600 * 24));
                    return daysDiff <= 7;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pasien Aktif</p>
                <p className="text-2xl font-bold">
                  {patients.filter(p => {
                    const daysDiff = Math.floor((new Date().getTime() - p.lastVisit.getTime()) / (1000 * 3600 * 24));
                    return daysDiff <= 30;
                  }).length}
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
              placeholder="Cari berdasarkan nama, nomor RM, atau nomor telepon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pasien</CardTitle>
          <CardDescription>
            Kelola semua data pasien yang terdaftar di sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">No. RM</th>
                  <th className="text-left p-3">Nama Pasien</th>
                  <th className="text-left p-3">Umur</th>
                  <th className="text-left p-3">Kontak</th>
                  <th className="text-left p-3">Kunjungan Terakhir</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <p className="font-medium text-blue-600">
                        {patient.medicalRecordNumber}
                      </p>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {patient.address}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-900">
                        {calculateAge(patient.dateOfBirth)} tahun
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(patient.dateOfBirth)}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-900">{patient.phone}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-900">
                        {formatDate(patient.lastVisit)}
                      </p>
                    </td>
                    <td className="p-3">
                      {getVisitStatus(patient.lastVisit)}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4" />
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

export default Patients;
