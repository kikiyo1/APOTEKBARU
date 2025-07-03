/**
 * Prescription history page for managing patient prescription records
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { FileText, Search, Calendar, User, Plus } from 'lucide-react';

const PrescriptionHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock prescription data
  const prescriptions = [
    {
      id: '1',
      patientName: 'John Doe',
      patientRM: 'RM001234',
      doctorName: 'Dr. Ahmad Setiawan',
      visitDate: new Date('2025-01-02'),
      medications: [
        { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: '3x sehari', duration: '5 hari' },
        { name: 'Amoxicillin 250mg', dosage: '1 kapsul', frequency: '3x sehari', duration: '7 hari' }
      ],
      notes: 'Kontrol kembali jika demam tidak turun dalam 3 hari'
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      patientRM: 'RM001235',
      doctorName: 'Dr. Sarah Wijaya',
      visitDate: new Date('2025-01-01'),
      medications: [
        { name: 'Vitamin C 500mg', dosage: '1 tablet', frequency: '1x sehari', duration: '30 hari' },
        { name: 'Zinc 10mg', dosage: '1 tablet', frequency: '1x sehari', duration: '30 hari' }
      ],
      notes: 'Suplemen untuk meningkatkan daya tahan tubuh'
    },
    {
      id: '3',
      patientName: 'Bob Johnson',
      patientRM: 'RM001236',
      doctorName: 'Dr. Budi Santoso',
      visitDate: new Date('2024-12-30'),
      medications: [
        { name: 'Omeprazole 20mg', dosage: '1 kapsul', frequency: '1x sehari', duration: '14 hari' }
      ],
      notes: 'Minum sebelum makan pagi'
    }
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getRecentStatus = (visitDate: Date) => {
    const daysDiff = Math.floor((new Date().getTime() - visitDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff <= 7) {
      return <Badge className="bg-green-100 text-green-800">Baru</Badge>;
    } else if (daysDiff <= 30) {
      return <Badge className="bg-blue-100 text-blue-800">Terkini</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Lama</Badge>;
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patientRM.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Riwayat Resep</h1>
          <p className="text-gray-600">Kelola riwayat resep dan obat pasien</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Resep
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Resep</p>
                <p className="text-2xl font-bold">{prescriptions.length}</p>
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
                <p className="text-sm text-gray-600">Resep Minggu Ini</p>
                <p className="text-2xl font-bold">
                  {prescriptions.filter(p => {
                    const daysDiff = Math.floor((new Date().getTime() - p.visitDate.getTime()) / (1000 * 3600 * 24));
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
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pasien Unik</p>
                <p className="text-2xl font-bold">
                  {new Set(prescriptions.map(p => p.patientRM)).size}
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
              placeholder="Cari berdasarkan nama pasien, nomor RM, atau nama dokter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{prescription.patientName}</CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-1">
                    <span>RM: {prescription.patientRM}</span>
                    <span>•</span>
                    <span>Dokter: {prescription.doctorName}</span>
                    <span>•</span>
                    <span>{formatDate(prescription.visitDate)}</span>
                  </CardDescription>
                </div>
                {getRecentStatus(prescription.visitDate)}
              </div>
            </CardHeader>
            <CardContent>
              {/* Medications */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Obat yang Diresepkan:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-gray-900">{med.name}</p>
                      <div className="text-sm text-gray-600 space-y-1 mt-1">
                        <p>Dosis: {med.dosage}</p>
                        <p>Frekuensi: {med.frequency}</p>
                        <p>Durasi: {med.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {prescription.notes && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Catatan Dokter:</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {prescription.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  Edit Resep
                </Button>
                <Button variant="outline" size="sm">
                  Cetak Resep
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Proses Transaksi
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionHistory;
