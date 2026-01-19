import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Contract, Income, Expense, Labour, Loan, LoanPayment } from '@/types';
import * as storage from '@/lib/storage';
import type { AppSettings } from '@/lib/storage';

interface AppContextType {
  // Data
  contracts: Contract[];
  incomes: Income[];
  expenses: Expense[];
  labours: Labour[];
  loans: Loan[];
  settings: AppSettings;
  
  // Contract actions
  addContract: (contract: Omit<Contract, 'id' | 'createdAt'>) => void;
  updateContract: (contract: Contract) => void;
  removeContract: (id: string) => void;
  
  // Income actions
  addIncome: (income: Omit<Income, 'id' | 'createdAt'>) => void;
  updateIncome: (income: Income) => void;
  removeIncome: (id: string) => void;
  
  // Expense actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  
  // Labour actions
  addLabour: (labour: Omit<Labour, 'id' | 'createdAt'>) => void;
  updateLabour: (labour: Labour) => void;
  removeLabour: (id: string) => void;
  
  // Loan actions
  addLoan: (loan: Omit<Loan, 'id' | 'createdAt' | 'totalPaid'>) => void;
  updateLoan: (loan: Loan) => void;
  removeLoan: (id: string) => void;
  addLoanPayment: (loanId: string, amount: number, notes?: string) => void;
  
  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Language helper
  t: (kn: string, en: string) => string;
  
  // Refresh data
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [labours, setLabours] = useState<Labour[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ language: 'kn', reminderEnabled: true });
  
  const refreshData = () => {
    setContracts(storage.getContracts());
    setIncomes(storage.getIncomes());
    setExpenses(storage.getExpenses());
    setLabours(storage.getLabours());
    setLoans(storage.getLoans());
    setSettings(storage.getSettings());
  };
  
  useEffect(() => {
    refreshData();
  }, []);
  
  // Translation helper
  const t = (kn: string, en: string) => settings.language === 'kn' ? kn : en;
  
  // Contract actions
  const addContract = (data: Omit<Contract, 'id' | 'createdAt'>) => {
    const contract: Contract = {
      ...data,
      id: storage.generateId(),
      createdAt: new Date().toISOString(),
    };
    storage.saveContract(contract);
    setContracts(prev => [...prev, contract]);
  };
  
  const updateContract = (contract: Contract) => {
    storage.saveContract(contract);
    setContracts(prev => prev.map(c => c.id === contract.id ? contract : c));
  };
  
  const removeContract = (id: string) => {
    storage.deleteContract(id);
    setContracts(prev => prev.filter(c => c.id !== id));
  };
  
  // Income actions
  const addIncome = (data: Omit<Income, 'id' | 'createdAt'>) => {
    const income: Income = {
      ...data,
      id: storage.generateId(),
      createdAt: new Date().toISOString(),
    };
    storage.saveIncome(income);
    setIncomes(prev => [...prev, income]);
  };
  
  const updateIncome = (income: Income) => {
    storage.saveIncome(income);
    setIncomes(prev => prev.map(i => i.id === income.id ? income : i));
  };
  
  const removeIncome = (id: string) => {
    storage.deleteIncome(id);
    setIncomes(prev => prev.filter(i => i.id !== id));
  };
  
  // Expense actions
  const addExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    const expense: Expense = {
      ...data,
      id: storage.generateId(),
      createdAt: new Date().toISOString(),
    };
    storage.saveExpense(expense);
    setExpenses(prev => [...prev, expense]);
  };
  
  const updateExpense = (expense: Expense) => {
    storage.saveExpense(expense);
    setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
  };
  
  const removeExpense = (id: string) => {
    storage.deleteExpense(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };
  
  // Labour actions
  const addLabour = (data: Omit<Labour, 'id' | 'createdAt'>) => {
    const labour: Labour = {
      ...data,
      id: storage.generateId(),
      createdAt: new Date().toISOString(),
    };
    storage.saveLabour(labour);
    setLabours(prev => [...prev, labour]);
  };
  
  const updateLabour = (labour: Labour) => {
    storage.saveLabour(labour);
    setLabours(prev => prev.map(l => l.id === labour.id ? labour : l));
  };
  
  const removeLabour = (id: string) => {
    storage.deleteLabour(id);
    setLabours(prev => prev.filter(l => l.id !== id));
  };
  
  // Loan actions
  const addLoan = (data: Omit<Loan, 'id' | 'createdAt' | 'totalPaid'>) => {
    const loan: Loan = {
      ...data,
      id: storage.generateId(),
      totalPaid: 0,
      createdAt: new Date().toISOString(),
    };
    storage.saveLoan(loan);
    setLoans(prev => [...prev, loan]);
  };
  
  const updateLoan = (loan: Loan) => {
    storage.saveLoan(loan);
    setLoans(prev => prev.map(l => l.id === loan.id ? loan : l));
  };
  
  const removeLoan = (id: string) => {
    storage.deleteLoan(id);
    setLoans(prev => prev.filter(l => l.id !== id));
  };
  
  const addLoanPayment = (loanId: string, amount: number, notes?: string) => {
    const payment: LoanPayment = {
      id: storage.generateId(),
      loanId,
      amount,
      date: new Date().toISOString().split('T')[0],
      notes,
      createdAt: new Date().toISOString(),
    };
    storage.saveLoanPayment(payment);
    setLoans(prev => prev.map(l => 
      l.id === loanId ? { ...l, totalPaid: l.totalPaid + amount } : l
    ));
  };
  
  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    storage.saveSettings(updated);
    setSettings(updated);
  };
  
  return (
    <AppContext.Provider value={{
      contracts,
      incomes,
      expenses,
      labours,
      loans,
      settings,
      addContract,
      updateContract,
      removeContract,
      addIncome,
      updateIncome,
      removeIncome,
      addExpense,
      updateExpense,
      removeExpense,
      addLabour,
      updateLabour,
      removeLabour,
      addLoan,
      updateLoan,
      removeLoan,
      addLoanPayment,
      updateSettings,
      t,
      refreshData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
