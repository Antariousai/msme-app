import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { Transaction, seedTransactions, TransactionType } from '../data/seed';
import { generateId } from '../utils/helpers';
import { calcProfit } from '../utils/helpers';

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (input: {
    type: TransactionType;
    amount: number;
    category: string;
    product?: string;
    note?: string;
  }) => void;
  income: number;
  expense: number;
  profit: number;
}

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);

  const income = useMemo(
    () => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const expense = useMemo(
    () => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const profit = calcProfit(income, expense);

  const addTransaction = (input: {
    type: TransactionType;
    amount: number;
    category: string;
    product?: string;
    note?: string;
  }) => {
    const newTx: Transaction = {
      id: generateId(),
      type: input.type,
      amount: input.amount,
      category: input.category,
      product: input.product,
      note: input.note ?? '',
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  return (
    <TransactionsContext.Provider
      value={{ transactions, addTransaction, income, expense, profit }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionsProvider');
  return ctx;
};
