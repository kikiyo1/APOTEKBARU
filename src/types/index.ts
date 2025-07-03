/**
 * Type definitions for the pharmacy cashier application
 */

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'kasir';
  name: string;
  email?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  minStock: number;
  barcode?: string;
  image?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  medicalRecordNumber: string;
  name: string;
  dateOfBirth: Date;
  address: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  cashierId: string;
  patientId?: string;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  amountPaid: number;
  change: number;
  createdAt: Date;
}

export interface TransactionItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface PrescriptionHistory {
  id: string;
  patientId: string;
  doctorName: string;
  visitDate: Date;
  medications: PrescriptionMedication[];
  notes?: string;
  createdAt: Date;
}

export interface PrescriptionMedication {
  productId: string;
  productName: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  createdBy: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalProducts: number;
  todayTransactions: number;
  totalPatients: number;
  lowStockProducts: number;
  todayRevenue: number;
  monthlyRevenue: number[];
  weeklyRevenue: number[];
}
