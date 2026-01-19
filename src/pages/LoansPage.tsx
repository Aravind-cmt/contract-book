import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Plus, Landmark, Building, User, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getAllLoanSummaries, formatCurrency, formatDate } from '@/lib/calculations';
import type { LoanType, InterestType } from '@/types';

export default function LoansPage() {
  const { t, loans, addLoan, addLoanPayment } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');
  
  // Form state
  const [loanType, setLoanType] = useState<LoanType>('bank');
  const [lenderName, setLenderName] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [interestType, setInterestType] = useState<InterestType>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  const summaries = getAllLoanSummaries(loans);
  const activeLoans = summaries.filter(l => l.pendingBalance > 0);
  const paidLoans = summaries.filter(l => l.pendingBalance <= 0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lenderName || !principalAmount || !interestRate) return;
    
    addLoan({
      loanType,
      lenderName,
      principalAmount: parseFloat(principalAmount),
      interestRate: parseFloat(interestRate),
      interestType,
      startDate,
    });
    
    // Reset form
    setLoanType('bank');
    setLenderName('');
    setPrincipalAmount('');
    setInterestRate('');
    setInterestType('monthly');
    setStartDate(new Date().toISOString().split('T')[0]);
    setDialogOpen(false);
  };
  
  const handlePay = () => {
    if (!selectedLoan || !payAmount) return;
    addLoanPayment(selectedLoan, parseFloat(payAmount));
    setPayAmount('');
    setSelectedLoan(null);
    setPayDialogOpen(false);
  };
  
  const openPayDialog = (loanId: string) => {
    setSelectedLoan(loanId);
    setPayDialogOpen(true);
  };
  
  const LoanCard = ({ loan }: { loan: typeof summaries[0] }) => {
    const totalDue = loan.principalAmount + loan.totalInterest;
    
    return (
      <div className="list-item flex-col items-stretch gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${loan.loanType === 'bank' ? 'bg-primary/10' : 'bg-accent/10'}`}>
              {loan.loanType === 'bank' ? (
                <Building className="w-5 h-5 text-primary" />
              ) : (
                <User className="w-5 h-5 text-accent" />
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">{loan.lenderName}</p>
              <p className="text-sm text-muted-foreground">
                {loan.loanType === 'bank' ? t('ಬ್ಯಾಂಕ್ ಸಾಲ', 'Bank Loan') : t('ಖಾಸಗಿ ಸಾಲ', 'Private Loan')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{loan.interestRate}%</p>
            <p className="text-xs text-muted-foreground">
              {loan.interestType === 'monthly' ? t('ಮಾಸಿಕ', 'Monthly') : t('ವಾರ್ಷಿಕ', 'Yearly')}
            </p>
          </div>
        </div>
        
        {/* Interest breakdown */}
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">
              {t('ಬಡ್ಡಿ ಲೆಕ್ಕಾಚಾರ', 'Interest Calculation')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">{t('ಅಸಲು', 'Principal')}</p>
              <p className="font-semibold">{formatCurrency(loan.principalAmount)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('ಒಟ್ಟು ಬಡ್ಡಿ', 'Total Interest')}</p>
              <p className="font-semibold text-warning">{formatCurrency(loan.totalInterest)}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {loan.monthsElapsed} {t('ತಿಂಗಳುಗಳು', 'months')} • {t('ಪ್ರಾರಂಭ', 'Started')} {formatDate(loan.startDate)}
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-secondary/50 rounded-lg p-2">
            <p className="text-muted-foreground text-xs">{t('ಒಟ್ಟು ಬಾಕಿ', 'Total Due')}</p>
            <p className="font-semibold">{formatCurrency(totalDue)}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2">
            <p className="text-muted-foreground text-xs">{t('ಪಾವತಿ', 'Paid')}</p>
            <p className="font-semibold text-success">{formatCurrency(loan.totalPaid)}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2">
            <p className="text-muted-foreground text-xs">{t('ಬಾಕಿ', 'Pending')}</p>
            <p className="font-semibold text-destructive">{formatCurrency(loan.pendingBalance)}</p>
          </div>
        </div>
        
        {loan.pendingBalance > 0 && (
          <Button 
            onClick={() => openPayDialog(loan.id)}
            className="w-full mt-1"
            variant="outline"
          >
            {t('ಪಾವತಿ ಮಾಡಿ', 'Make Payment')}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('ಸಾಲಗಳು', 'Loans')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('ಸಾಲ ಮತ್ತು ಬಡ್ಡಿ ನಿರ್ವಹಣೆ', 'Manage loans & interest')}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="rounded-full" size="icon">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <section className="mb-6">
          <h2 className="section-header flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            {t('ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಸಾಲಗಳು', 'Active Loans')} ({activeLoans.length})
          </h2>
          <div className="space-y-3">
            {activeLoans.map(loan => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        </section>
      )}
      
      {/* Paid Loans */}
      {paidLoans.length > 0 && (
        <section>
          <h2 className="section-header">{t('ಮುಗಿದ ಸಾಲಗಳು', 'Paid Loans')} ({paidLoans.length})</h2>
          <div className="space-y-3">
            {paidLoans.map(loan => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        </section>
      )}
      
      {summaries.length === 0 && (
        <div className="text-center py-8 bg-card rounded-2xl border border-border">
          <Landmark className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">{t('ಯಾವುದೇ ಸಾಲಗಳಿಲ್ಲ', 'No loans yet')}</p>
        </div>
      )}
      
      {/* Add Loan Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('ಹೊಸ ಸಾಲ', 'New Loan')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">{t('ಸಾಲದ ಪ್ರಕಾರ', 'Loan Type')}</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLoanType('bank')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    loanType === 'bank' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span>{t('ಬ್ಯಾಂಕ್', 'Bank')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoanType('local')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    loanType === 'local' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>{t('ಖಾಸಗಿ', 'Private')}</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">{t('ಸಾಲದಾತರ ಹೆಸರು', 'Lender Name')} *</Label>
              <Input
                value={lenderName}
                onChange={(e) => setLenderName(e.target.value)}
                placeholder={loanType === 'bank' ? t('ಬ್ಯಾಂಕ್ ಹೆಸರು', 'Bank name') : t('ವ್ಯಕ್ತಿಯ ಹೆಸರು', 'Person name')}
                className="input-field"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">{t('ಅಸಲು ಮೊತ್ತ', 'Principal Amount')} (₹) *</Label>
              <Input
                type="number"
                value={principalAmount}
                onChange={(e) => setPrincipalAmount(e.target.value)}
                className="input-field text-xl font-bold"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-base">{t('ಬಡ್ಡಿ ದರ', 'Interest Rate')} (%) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base">{t('ಬಡ್ಡಿ ಪ್ರಕಾರ', 'Interest Type')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['monthly', 'yearly'] as InterestType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInterestType(type)}
                      className={`p-2 text-sm rounded-xl border-2 transition-all ${
                        interestType === type ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      {type === 'monthly' ? t('ಮಾಸಿಕ', 'Monthly') : t('ವಾರ್ಷಿಕ', 'Yearly')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">{t('ಪ್ರಾರಂಭ ದಿನಾಂಕ', 'Start Date')}</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            
            <Button type="submit" className="btn-touch w-full" disabled={!lenderName || !principalAmount || !interestRate}>
              {t('ಸಾಲ ಸೇರಿಸಿ', 'Add Loan')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Pay Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>{t('ಸಾಲ ಪಾವತಿ', 'Loan Payment')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedLoan && (() => {
              const loan = summaries.find(l => l.id === selectedLoan);
              if (!loan) return null;
              return (
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <p className="text-lg font-semibold">{loan.lenderName}</p>
                  <p className="text-muted-foreground">
                    {t('ಬಾಕಿ', 'Pending')}: <span className="text-destructive font-bold">{formatCurrency(loan.pendingBalance)}</span>
                  </p>
                </div>
              );
            })()}
            
            <div className="space-y-2">
              <Label className="text-base">{t('ಪಾವತಿ ಮೊತ್ತ', 'Payment Amount')} (₹)</Label>
              <Input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="input-field text-2xl font-bold"
                placeholder="0"
              />
            </div>
            
            <Button onClick={handlePay} className="btn-touch w-full bg-success hover:bg-success/90 text-success-foreground" disabled={!payAmount}>
              {t('ಪಾವತಿ ದೃಢೀಕರಿಸಿ', 'Confirm Payment')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
