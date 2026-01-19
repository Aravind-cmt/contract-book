import { useApp } from '@/contexts/AppContext';
import { getAllContractSummaries, formatCurrency, formatDate } from '@/lib/calculations';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ContractList() {
  const { t, contracts } = useApp();
  const navigate = useNavigate();
  
  const summaries = getAllContractSummaries(contracts.filter(c => c.isActive));
  
  if (summaries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{t('ಯಾವುದೇ ಗುತ್ತಿಗೆ ಇಲ್ಲ', 'No contracts yet')}</p>
        <button 
          onClick={() => navigate('/contracts')}
          className="text-primary mt-2 font-medium"
        >
          {t('ಹೊಸ ಗುತ್ತಿಗೆ ಸೇರಿಸಿ', 'Add new contract')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {summaries.map((contract) => {
        const isProfit = contract.profitLoss >= 0;
        return (
          <button
            key={contract.id}
            onClick={() => navigate(`/contracts/${contract.id}`)}
            className="list-item w-full text-left"
          >
            <div className={`p-2 rounded-lg ${isProfit ? 'bg-success/10' : 'bg-destructive/10'}`}>
              {isProfit ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{contract.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(contract.startDate)}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(Math.abs(contract.profitLoss))}
              </p>
              <p className="text-xs text-muted-foreground">
                {isProfit ? t('ಲಾಭ', 'Profit') : t('ನಷ್ಟ', 'Loss')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        );
      })}
    </div>
  );
}
