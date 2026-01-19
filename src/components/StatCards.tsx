import { TrendingUp, TrendingDown, Wallet, Users, Landmark } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { 
  getOverallProfitLoss, 
  getTotalPendingLabourPayments, 
  getTotalPendingLoans,
  formatCurrency 
} from '@/lib/calculations';

export function StatCards() {
  const { t, incomes, expenses, labours, loans } = useApp();
  
  const profitLoss = getOverallProfitLoss(incomes, expenses);
  const pendingLabour = getTotalPendingLabourPayments(labours);
  const pendingLoans = getTotalPendingLoans(loans);
  
  const isProfit = profitLoss >= 0;
  
  return (
    <div className="space-y-3">
      {/* Main Profit/Loss Card */}
      <div className={`stat-card ${isProfit ? 'stat-card-profit' : 'stat-card-loss'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">
              {t('ಒಟ್ಟು ಲಾಭ/ನಷ್ಟ', 'Total Profit/Loss')}
            </p>
            <p className="text-3xl font-bold mt-1">
              {formatCurrency(Math.abs(profitLoss))}
            </p>
            <p className="text-sm mt-1 opacity-90">
              {isProfit ? t('ಲಾಭ', 'Profit') : t('ನಷ್ಟ', 'Loss')}
            </p>
          </div>
          <div className="p-3 rounded-full bg-white/20">
            {isProfit ? (
              <TrendingUp className="w-8 h-8" />
            ) : (
              <TrendingDown className="w-8 h-8" />
            )}
          </div>
        </div>
      </div>
      
      {/* Secondary Stats */}
      <div className="grid grid-cols-2 gap-3">
        {/* Pending Labour */}
        <div className="stat-card bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-warning/10">
              <Users className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t('ಕಾರ್ಮಿಕ ಬಾಕಿ', 'Labour Due')}
              </p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(pendingLabour)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Pending Loans */}
        <div className="stat-card bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-destructive/10">
              <Landmark className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t('ಸಾಲ ಬಾಕಿ', 'Loan Due')}
              </p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(pendingLoans)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
