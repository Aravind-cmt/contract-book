import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getTodayDate } from '@/lib/calculations';
import type { PaymentMode, ExpenseType } from '@/types';
import { Banknote, Smartphone, CreditCard, Users, Package, Truck, Landmark, Home } from 'lucide-react';

interface ExpenseFormProps {
  onSuccess: () => void;
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const { t, contracts, addExpense } = useApp();
  const [date, setDate] = useState(getTodayDate());
  const [amount, setAmount] = useState('');
  const [contractId, setContractId] = useState('');
  const [expenseType, setExpenseType] = useState<ExpenseType>('material');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !contractId) return;
    
    addExpense({
      date,
      amount: parseFloat(amount),
      contractId,
      expenseType,
      paymentMode,
      notes: notes || undefined,
    });
    
    onSuccess();
  };

  const paymentModes = [
    { value: 'cash', icon: Banknote, labelKn: 'ನಗದು', labelEn: 'Cash' },
    { value: 'phonepe', icon: Smartphone, labelKn: 'PhonePe', labelEn: 'PhonePe' },
    { value: 'gpay', icon: CreditCard, labelKn: 'GPay', labelEn: 'GPay' },
  ];

  const expenseTypes = [
    { value: 'material', icon: Package, labelKn: 'ಸಾಮಗ್ರಿ', labelEn: 'Material' },
    { value: 'labour', icon: Users, labelKn: 'ಕಾರ್ಮಿಕ', labelEn: 'Labour' },
    { value: 'transport', icon: Truck, labelKn: 'ಸಾರಿಗೆ', labelEn: 'Transport' },
    { value: 'loan_payment', icon: Landmark, labelKn: 'ಸಾಲ', labelEn: 'Loan' },
    { value: 'personal', icon: Home, labelKn: 'ವೈಯಕ್ತಿಕ', labelEn: 'Personal' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-base">{t('ಮೊತ್ತ', 'Amount')} (₹)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="input-field text-2xl font-bold"
          required
        />
      </div>

      {/* Expense Type */}
      <div className="space-y-2">
        <Label className="text-base">{t('ಖರ್ಚಿನ ಪ್ರಕಾರ', 'Expense Type')}</Label>
        <div className="grid grid-cols-3 gap-2">
          {expenseTypes.map(({ value, icon: Icon, labelKn, labelEn }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setExpenseType(value as ExpenseType);
                if (value === 'personal') {
                  setContractId('personal');
                } else if (contractId === 'personal') {
                  setContractId('');
                }
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                expenseType === value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{t(labelKn, labelEn)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contract Selection (hidden for personal) */}
      {expenseType !== 'personal' && (
        <div className="space-y-2">
          <Label className="text-base">{t('ಗುತ್ತಿಗೆ', 'Contract')}</Label>
          <Select value={contractId} onValueChange={setContractId} required>
            <SelectTrigger className="input-field">
              <SelectValue placeholder={t('ಗುತ್ತಿಗೆ ಆಯ್ಕೆ ಮಾಡಿ', 'Select contract')} />
            </SelectTrigger>
            <SelectContent>
              {contracts.filter(c => c.isActive).map((contract) => (
                <SelectItem key={contract.id} value={contract.id} className="text-base py-3">
                  {contract.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Payment Mode */}
      <div className="space-y-2">
        <Label className="text-base">{t('ಪಾವತಿ ವಿಧಾನ', 'Payment Mode')}</Label>
        <div className="grid grid-cols-3 gap-2">
          {paymentModes.map(({ value, icon: Icon, labelKn, labelEn }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPaymentMode(value as PaymentMode)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                paymentMode === value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm">{t(labelKn, labelEn)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date" className="text-base">{t('ದಿನಾಂಕ', 'Date')}</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-base">{t('ಟಿಪ್ಪಣಿ', 'Notes')} ({t('ಐಚ್ಛಿಕ', 'Optional')})</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('ಯಾವುದೇ ಟಿಪ್ಪಣಿ...', 'Any notes...')}
          className="input-field min-h-[60px]"
        />
      </div>

      <Button 
        type="submit" 
        className="btn-touch w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        disabled={!amount || !contractId}
      >
        {t('ಖರ್ಚು ಸೇರಿಸಿ', 'Add Expense')}
      </Button>
    </form>
  );
}
