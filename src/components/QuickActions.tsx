import { Plus, ArrowDownCircle, ArrowUpCircle, Users, Landmark } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { IncomeForm } from './forms/IncomeForm';
import { ExpenseForm } from './forms/ExpenseForm';

export function QuickActions() {
  const { t } = useApp();
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  const actions = [
    { 
      icon: ArrowDownCircle, 
      labelKn: 'ಆದಾಯ', 
      labelEn: 'Income', 
      color: 'text-success',
      bgColor: 'bg-success/10',
      onClick: () => setIncomeOpen(true)
    },
    { 
      icon: ArrowUpCircle, 
      labelKn: 'ಖರ್ಚು', 
      labelEn: 'Expense', 
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      onClick: () => setExpenseOpen(true)
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, labelKn, labelEn, color, bgColor, onClick }) => (
          <button
            key={labelEn}
            onClick={onClick}
            className="quick-action-card active:scale-95 transition-transform"
          >
            <div className={`p-3 rounded-xl ${bgColor}`}>
              <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <span className="text-sm font-medium text-foreground">
              {t(labelKn, labelEn)}
            </span>
          </button>
        ))}
      </div>

      {/* Income Dialog */}
      <Dialog open={incomeOpen} onOpenChange={setIncomeOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl">{t('ಆದಾಯ ಸೇರಿಸಿ', 'Add Income')}</DialogTitle>
          </DialogHeader>
          <IncomeForm onSuccess={() => setIncomeOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl">{t('ಖರ್ಚು ಸೇರಿಸಿ', 'Add Expense')}</DialogTitle>
          </DialogHeader>
          <ExpenseForm onSuccess={() => setExpenseOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
