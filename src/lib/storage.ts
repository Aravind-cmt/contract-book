// Local storage utilities for offline-first data management

import type { Contract, Income, Expense, Labour, Loan, LoanPayment } from '@/types';

const STORAGE_KEYS = {
  contracts: 'kharcha_contracts',
  incomes: 'kharcha_incomes',
  expenses: 'kharcha_expenses',
  labours: 'kharcha_labours',
  loans: 'kharcha_loans',
  loanPayments: 'kharcha_loan_payments',
  settings: 'kharcha_settings',
  pin: 'kharcha_pin',
};

// Generic storage functions
function getItem<T>(key: string, defaultValue: T[]): T[] {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Contract functions
export function getContracts(): Contract[] {
  return getItem<Contract>(STORAGE_KEYS.contracts, []);
}

export function saveContract(contract: Contract): void {
  const contracts = getContracts();
  const index = contracts.findIndex(c => c.id === contract.id);
  if (index >= 0) {
    contracts[index] = contract;
  } else {
    contracts.push(contract);
  }
  setItem(STORAGE_KEYS.contracts, contracts);
}

export function deleteContract(id: string): void {
  const contracts = getContracts().filter(c => c.id !== id);
  setItem(STORAGE_KEYS.contracts, contracts);
}

// Income functions
export function getIncomes(): Income[] {
  return getItem<Income>(STORAGE_KEYS.incomes, []);
}

export function saveIncome(income: Income): void {
  const incomes = getIncomes();
  const index = incomes.findIndex(i => i.id === income.id);
  if (index >= 0) {
    incomes[index] = income;
  } else {
    incomes.push(income);
  }
  setItem(STORAGE_KEYS.incomes, incomes);
}

export function deleteIncome(id: string): void {
  const incomes = getIncomes().filter(i => i.id !== id);
  setItem(STORAGE_KEYS.incomes, incomes);
}

// Expense functions
export function getExpenses(): Expense[] {
  return getItem<Expense>(STORAGE_KEYS.expenses, []);
}

export function saveExpense(expense: Expense): void {
  const expenses = getExpenses();
  const index = expenses.findIndex(e => e.id === expense.id);
  if (index >= 0) {
    expenses[index] = expense;
  } else {
    expenses.push(expense);
  }
  setItem(STORAGE_KEYS.expenses, expenses);
}

export function deleteExpense(id: string): void {
  const expenses = getExpenses().filter(e => e.id !== id);
  setItem(STORAGE_KEYS.expenses, expenses);
}

// Labour functions
export function getLabours(): Labour[] {
  return getItem<Labour>(STORAGE_KEYS.labours, []);
}

export function saveLabour(labour: Labour): void {
  const labours = getLabours();
  const index = labours.findIndex(l => l.id === labour.id);
  if (index >= 0) {
    labours[index] = labour;
  } else {
    labours.push(labour);
  }
  setItem(STORAGE_KEYS.labours, labours);
}

export function deleteLabour(id: string): void {
  const labours = getLabours().filter(l => l.id !== id);
  setItem(STORAGE_KEYS.labours, labours);
}

// Loan functions
export function getLoans(): Loan[] {
  return getItem<Loan>(STORAGE_KEYS.loans, []);
}

export function saveLoan(loan: Loan): void {
  const loans = getLoans();
  const index = loans.findIndex(l => l.id === loan.id);
  if (index >= 0) {
    loans[index] = loan;
  } else {
    loans.push(loan);
  }
  setItem(STORAGE_KEYS.loans, loans);
}

export function deleteLoan(id: string): void {
  const loans = getLoans().filter(l => l.id !== id);
  setItem(STORAGE_KEYS.loans, loans);
}

// Loan Payment functions
export function getLoanPayments(): LoanPayment[] {
  return getItem<LoanPayment>(STORAGE_KEYS.loanPayments, []);
}

export function saveLoanPayment(payment: LoanPayment): void {
  const payments = getLoanPayments();
  payments.push(payment);
  setItem(STORAGE_KEYS.loanPayments, payments);
  
  // Update loan total paid
  const loans = getLoans();
  const loan = loans.find(l => l.id === payment.loanId);
  if (loan) {
    loan.totalPaid += payment.amount;
    saveLoan(loan);
  }
}

// PIN functions
export function getPin(): string | null {
  return localStorage.getItem(STORAGE_KEYS.pin);
}

export function setPin(pin: string): void {
  localStorage.setItem(STORAGE_KEYS.pin, pin);
}

export function clearPin(): void {
  localStorage.removeItem(STORAGE_KEYS.pin);
}

// Settings
export interface AppSettings {
  language: 'kn' | 'en';
  reminderEnabled: boolean;
}

export function getSettings(): AppSettings {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.settings);
    return item ? JSON.parse(item) : { language: 'kn', reminderEnabled: true };
  } catch {
    return { language: 'kn', reminderEnabled: true };
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

// Export all data for backup
export function exportAllData(): string {
  return JSON.stringify({
    contracts: getContracts(),
    incomes: getIncomes(),
    expenses: getExpenses(),
    labours: getLabours(),
    loans: getLoans(),
    loanPayments: getLoanPayments(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  });
}

// Import data from backup
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.contracts) setItem(STORAGE_KEYS.contracts, data.contracts);
    if (data.incomes) setItem(STORAGE_KEYS.incomes, data.incomes);
    if (data.expenses) setItem(STORAGE_KEYS.expenses, data.expenses);
    if (data.labours) setItem(STORAGE_KEYS.labours, data.labours);
    if (data.loans) setItem(STORAGE_KEYS.loans, data.loans);
    if (data.loanPayments) setItem(STORAGE_KEYS.loanPayments, data.loanPayments);
    if (data.settings) saveSettings(data.settings);
    return true;
  } catch {
    return false;
  }
}
