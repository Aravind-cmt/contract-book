// Financial calculations - Simple Interest and Profit/Loss

import type { 
  Contract, 
  Income, 
  Expense, 
  Labour, 
  Loan, 
  ContractSummary, 
  LabourSummary, 
  LoanSummary 
} from '@/types';
import { getIncomes, getExpenses } from './storage';

// Calculate months elapsed from start date
export function getMonthsElapsed(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  return Math.max(0, months);
}

// Calculate simple interest
// Monthly: Interest = (Principal × Rate × Months) / 100
// Yearly: Interest = (Principal × Rate × Years) / 100
export function calculateSimpleInterest(
  principal: number, 
  rate: number, 
  startDate: string, 
  interestType: 'monthly' | 'yearly'
): number {
  const monthsElapsed = getMonthsElapsed(startDate);
  
  if (interestType === 'monthly') {
    return (principal * rate * monthsElapsed) / 100;
  } else {
    const years = monthsElapsed / 12;
    return (principal * rate * years) / 100;
  }
}

// Get contract summary with calculated totals
export function getContractSummary(contract: Contract): ContractSummary {
  const incomes = getIncomes().filter(i => i.contractId === contract.id);
  const expenses = getExpenses().filter(e => e.contractId === contract.id);
  
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profitLoss = totalIncome - totalExpense;
  
  return {
    ...contract,
    totalIncome,
    totalExpense,
    profitLoss,
  };
}

// Get all contracts with summaries
export function getAllContractSummaries(contracts: Contract[]): ContractSummary[] {
  return contracts.map(getContractSummary);
}

// Get labour summary with calculated totals
export function getLabourSummary(labour: Labour): LabourSummary {
  const totalSalary = labour.dailySalary * labour.daysWorked;
  const balance = totalSalary - labour.paidAmount;
  
  return {
    ...labour,
    totalSalary,
    balance,
  };
}

// Get all labours with summaries
export function getAllLabourSummaries(labours: Labour[]): LabourSummary[] {
  return labours.map(getLabourSummary);
}

// Get loan summary with calculated interest and balance
export function getLoanSummary(loan: Loan): LoanSummary {
  const monthsElapsed = getMonthsElapsed(loan.startDate);
  const totalInterest = calculateSimpleInterest(
    loan.principalAmount, 
    loan.interestRate, 
    loan.startDate, 
    loan.interestType
  );
  const totalDue = loan.principalAmount + totalInterest;
  const pendingBalance = totalDue - loan.totalPaid;
  
  return {
    ...loan,
    totalInterest,
    pendingBalance: Math.max(0, pendingBalance),
    monthsElapsed,
  };
}

// Get all loans with summaries
export function getAllLoanSummaries(loans: Loan[]): LoanSummary[] {
  return loans.map(getLoanSummary);
}

// Get total income across all contracts
export function getTotalIncome(incomes: Income[]): number {
  return incomes.reduce((sum, i) => sum + i.amount, 0);
}

// Get total expenses (excluding personal)
export function getTotalBusinessExpenses(expenses: Expense[]): number {
  return expenses
    .filter(e => e.contractId !== 'personal')
    .reduce((sum, e) => sum + e.amount, 0);
}

// Get total personal expenses
export function getTotalPersonalExpenses(expenses: Expense[]): number {
  return expenses
    .filter(e => e.contractId === 'personal')
    .reduce((sum, e) => sum + e.amount, 0);
}

// Get overall profit/loss
export function getOverallProfitLoss(incomes: Income[], expenses: Expense[]): number {
  const totalIncome = getTotalIncome(incomes);
  const totalBusinessExpense = getTotalBusinessExpenses(expenses);
  return totalIncome - totalBusinessExpense;
}

// Get pending labour payments
export function getTotalPendingLabourPayments(labours: Labour[]): number {
  return labours.reduce((sum, l) => {
    const total = l.dailySalary * l.daysWorked;
    return sum + (total - l.paidAmount);
  }, 0);
}

// Get total pending loan amount
export function getTotalPendingLoans(loans: Loan[]): number {
  return getAllLoanSummaries(loans).reduce((sum, l) => sum + l.pendingBalance, 0);
}

// Format currency in Indian format
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date in Indian format
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
