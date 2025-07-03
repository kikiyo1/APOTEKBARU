/**
 * Transaction store for managing transaction data
 */

import { create } from 'zustand';
import { Transaction } from '../types';

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  resetTransactions: () => void;
  getTransactionsByDate: (date: Date) => Transaction[];
  getTotalRevenue: () => number;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],

  addTransaction: (transactionData) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    set((state) => ({
      transactions: [...state.transactions, newTransaction]
    }));
  },

  resetTransactions: () => {
    set({ transactions: [] });
  },

  getTransactionsByDate: (date: Date) => {
    const { transactions } = get();
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      return transactionDate.toDateString() === date.toDateString();
    });
  },

  getTotalRevenue: () => {
    const { transactions } = get();
    return transactions.reduce((total, transaction) => total + transaction.total, 0);
  }
}));
