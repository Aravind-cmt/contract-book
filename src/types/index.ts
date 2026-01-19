// Core types for the financial management app

export interface Contract {
  id: string;
  name: string;
  clientName?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Income {
  id: string;
  date: string;
  amount: number;
  contractId: string;
  paymentMode: PaymentMode;
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  contractId: string | 'personal'; // 'personal' for living expenses
  expenseType: ExpenseType;
  paymentMode: PaymentMode;
  notes?: string;
  createdAt: string;
}

export interface Labour {
  id: string;
  name: string;
  phone?: string;
  workType: WorkType;
  dailySalary: number;
  labourType: LabourType;
  daysWorked: number;
  paidAmount: number;
  contractId?: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  loanType: LoanType;
  lenderName: string;
  principalAmount: number;
  interestRate: number;
  interestType: InterestType;
  startDate: string;
  totalPaid: number;
  createdAt: string;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export type PaymentMode = 'cash' | 'phonepe' | 'gpay';
export type ExpenseType = 'labour' | 'material' | 'transport' | 'loan_payment' | 'personal';
export type WorkType = 'mason' | 'helper' | 'electrician' | 'plumber' | 'carpenter' | 'painter' | 'other';
export type LabourType = 'permanent' | 'temporary';
export type LoanType = 'bank' | 'local';
export type InterestType = 'monthly' | 'yearly';

// Calculated types
export interface ContractSummary extends Contract {
  totalIncome: number;
  totalExpense: number;
  profitLoss: number;
}

export interface LabourSummary extends Labour {
  totalSalary: number;
  balance: number;
}

export interface LoanSummary extends Loan {
  totalInterest: number;
  pendingBalance: number;
  monthsElapsed: number;
}

// UI Labels in Kannada and English
export const LABELS = {
  // Navigation
  home: { kn: 'ಮನೆ', en: 'Home' },
  contracts: { kn: 'ಗುತ್ತಿಗೆ', en: 'Contracts' },
  labour: { kn: 'ಕಾರ್ಮಿಕ', en: 'Labour' },
  loans: { kn: 'ಸಾಲ', en: 'Loans' },
  reports: { kn: 'ವರದಿ', en: 'Reports' },
  
  // Actions
  add: { kn: 'ಸೇರಿಸಿ', en: 'Add' },
  save: { kn: 'ಉಳಿಸಿ', en: 'Save' },
  cancel: { kn: 'ರದ್ದು', en: 'Cancel' },
  delete: { kn: 'ಅಳಿಸಿ', en: 'Delete' },
  edit: { kn: 'ಬದಲಿಸಿ', en: 'Edit' },
  
  // Finance
  income: { kn: 'ಆದಾಯ', en: 'Income' },
  expense: { kn: 'ಖರ್ಚು', en: 'Expense' },
  profit: { kn: 'ಲಾಭ', en: 'Profit' },
  loss: { kn: 'ನಷ್ಟ', en: 'Loss' },
  balance: { kn: 'ಬಾಕಿ', en: 'Balance' },
  total: { kn: 'ಒಟ್ಟು', en: 'Total' },
  paid: { kn: 'ಪಾವತಿ', en: 'Paid' },
  pending: { kn: 'ಬಾಕಿ', en: 'Pending' },
  
  // Payment modes
  cash: { kn: 'ನಗದು', en: 'Cash' },
  phonepe: { kn: 'PhonePe', en: 'PhonePe' },
  gpay: { kn: 'GPay', en: 'GPay' },
  
  // Expense types
  material: { kn: 'ಸಾಮಗ್ರಿ', en: 'Material' },
  transport: { kn: 'ಸಾರಿಗೆ', en: 'Transport' },
  personal: { kn: 'ವೈಯಕ್ತಿಕ', en: 'Personal' },
  loan_payment: { kn: 'ಸಾಲ ಪಾವತಿ', en: 'Loan Payment' },
  
  // Work types
  mason: { kn: 'ಕಲ್ಲಿನ ಕೆಲಸಗಾರ', en: 'Mason' },
  helper: { kn: 'ಸಹಾಯಕ', en: 'Helper' },
  electrician: { kn: 'ವಿದ್ಯುತ್ಕಾರ', en: 'Electrician' },
  plumber: { kn: 'ಪ್ಲಂಬರ್', en: 'Plumber' },
  carpenter: { kn: 'ಬಡಗಿ', en: 'Carpenter' },
  painter: { kn: 'ಪೇಂಟರ್', en: 'Painter' },
  other: { kn: 'ಇತರೆ', en: 'Other' },
  
  // Labour types
  permanent: { kn: 'ಕಾಯಂ', en: 'Permanent' },
  temporary: { kn: 'ತಾತ್ಕಾಲಿಕ', en: 'Temporary' },
  
  // Loan types
  bank: { kn: 'ಬ್ಯಾಂಕ್', en: 'Bank' },
  local: { kn: 'ಖಾಸಗಿ', en: 'Local/Private' },
  
  // Interest types
  monthly: { kn: 'ಮಾಸಿಕ', en: 'Monthly' },
  yearly: { kn: 'ವಾರ್ಷಿಕ', en: 'Yearly' },
  
  // Misc
  today: { kn: 'ಇಂದು', en: 'Today' },
  date: { kn: 'ದಿನಾಂಕ', en: 'Date' },
  amount: { kn: 'ಮೊತ್ತ', en: 'Amount' },
  notes: { kn: 'ಟಿಪ್ಪಣಿ', en: 'Notes' },
  
  // Reminders
  dailyReminder: { kn: 'ಇಂದು ಖರ್ಚು entry ಮಾಡಿದ್ರಾ?', en: 'Did you enter today\'s expenses?' },
};

export type LabelKey = keyof typeof LABELS;
