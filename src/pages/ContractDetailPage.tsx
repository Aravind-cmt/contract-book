import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { getContractSummary, formatCurrency, formatDate } from '@/lib/calculations';
import { ArrowLeft, TrendingUp, TrendingDown, ArrowDownCircle, ArrowUpCircle, CheckCircle, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IncomeForm } from '@/components/forms/IncomeForm';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, contracts, incomes, expenses, updateContract } = useApp();
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  
  const contract = contracts.find(c => c.id === id);
  
  if (!contract) {
    return (
      <div className="page-container flex items-center justify-center">
        <p className="text-muted-foreground">{t('ಗುತ್ತಿಗೆ ಕಂಡುಬಂದಿಲ್ಲ', 'Contract not found')}</p>
      </div>
    );
  }
  
  const summary = getContractSummary(contract);
  const isProfit = summary.profitLoss >= 0;
  
  const contractIncomes = incomes
    .filter(i => i.contractId === contract.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const contractExpenses = expenses
    .filter(e => e.contractId === contract.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const allTransactions = [
    ...contractIncomes.map(i => ({ ...i, type: 'income' as const })),
    ...contractExpenses.map(e => ({ ...e, type: 'expense' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const handleComplete = () => {
    updateContract({ ...contract, isActive: false, endDate: new Date().toISOString().split('T')[0] });
    setCompleteOpen(false);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">{contract.name}</h1>
          {contract.clientName && (
            <p className="text-sm text-muted-foreground">{contract.clientName}</p>
          )}
        </div>
        {contract.isActive && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCompleteOpen(true)}
            className="gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            {t('ಮುಗಿದಿದೆ', 'Complete')}
          </Button>
        )}
      </div>
      
      {/* Profit/Loss Card */}
      <div className={`stat-card ${isProfit ? 'stat-card-profit' : 'stat-card-loss'} mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">
              {isProfit ? t('ಲಾಭ', 'Profit') : t('ನಷ್ಟ', 'Loss')}
            </p>
            <p className="text-3xl font-bold mt-1">
              {formatCurrency(Math.abs(summary.profitLoss))}
            </p>
          </div>
          <div className="p-3 rounded-full bg-white/20">
            {isProfit ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-sm opacity-75">{t('ಒಟ್ಟು ಆದಾಯ', 'Total Income')}</p>
            <p className="text-lg font-semibold">{formatCurrency(summary.totalIncome)}</p>
          </div>
          <div>
            <p className="text-sm opacity-75">{t('ಒಟ್ಟು ಖರ್ಚು', 'Total Expense')}</p>
            <p className="text-lg font-semibold">{formatCurrency(summary.totalExpense)}</p>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      {contract.isActive && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setIncomeOpen(true)}
            className="quick-action-card"
          >
            <div className="p-3 rounded-xl bg-success/10">
              <ArrowDownCircle className="w-6 h-6 text-success" />
            </div>
            <span className="text-sm font-medium">{t('ಆದಾಯ ಸೇರಿಸಿ', 'Add Income')}</span>
          </button>
          <button
            onClick={() => setExpenseOpen(true)}
            className="quick-action-card"
          >
            <div className="p-3 rounded-xl bg-destructive/10">
              <ArrowUpCircle className="w-6 h-6 text-destructive" />
            </div>
            <span className="text-sm font-medium">{t('ಖರ್ಚು ಸೇರಿಸಿ', 'Add Expense')}</span>
          </button>
        </div>
      )}
      
      {/* Transactions */}
      <section>
        <h2 className="section-header">{t('ವಹಿವಾಟುಗಳು', 'Transactions')}</h2>
        {allTransactions.length > 0 ? (
          <div className="space-y-2">
            {allTransactions.map((tx) => (
              <div key={tx.id} className="list-item">
                <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  {tx.type === 'income' ? (
                    <ArrowDownCircle className="w-4 h-4 text-success" />
                  ) : (
                    <ArrowUpCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {tx.type === 'income' 
                      ? t('ಆದಾಯ', 'Income') 
                      : t('ಖರ್ಚು', 'Expense')
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                </div>
                <p className={`font-semibold ${tx.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground">{t('ಯಾವುದೇ ವಹಿವಾಟುಗಳಿಲ್ಲ', 'No transactions yet')}</p>
          </div>
        )}
      </section>
      
      {/* Dialogs */}
      <Dialog open={incomeOpen} onOpenChange={setIncomeOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>{t('ಆದಾಯ ಸೇರಿಸಿ', 'Add Income')}</DialogTitle>
          </DialogHeader>
          <IncomeForm onSuccess={() => setIncomeOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>{t('ಖರ್ಚು ಸೇರಿಸಿ', 'Add Expense')}</DialogTitle>
          </DialogHeader>
          <ExpenseForm onSuccess={() => setExpenseOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('ಗುತ್ತಿಗೆ ಮುಗಿದಿದೆ?', 'Complete Contract?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('ಈ ಗುತ್ತಿಗೆಯನ್ನು ಮುಗಿದ ಎಂದು ಗುರುತಿಸಲಾಗುವುದು.', 'This contract will be marked as completed.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('ರದ್ದು', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete}>{t('ಮುಗಿದಿದೆ', 'Complete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
