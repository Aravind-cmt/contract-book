import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Plus, FileText, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getAllContractSummaries, formatCurrency, formatDate, getTodayDate } from '@/lib/calculations';
import { useNavigate } from 'react-router-dom';

export default function ContractsPage() {
  const { t, contracts, addContract } = useApp();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [startDate, setStartDate] = useState(getTodayDate());
  
  const summaries = getAllContractSummaries(contracts);
  const activeContracts = summaries.filter(c => c.isActive);
  const completedContracts = summaries.filter(c => !c.isActive);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    addContract({
      name,
      clientName: clientName || undefined,
      startDate,
      isActive: true,
    });
    
    setName('');
    setClientName('');
    setStartDate(getTodayDate());
    setDialogOpen(false);
  };
  
  const ContractCard = ({ contract }: { contract: typeof summaries[0] }) => {
    const isProfit = contract.profitLoss >= 0;
    return (
      <button
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
          {contract.clientName && (
            <p className="text-sm text-muted-foreground truncate">{contract.clientName}</p>
          )}
          <p className="text-xs text-muted-foreground">{formatDate(contract.startDate)}</p>
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
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('ಗುತ್ತಿಗೆಗಳು', 'Contracts')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('ನಿಮ್ಮ ಎಲ್ಲಾ ಕೆಲಸಗಳು', 'All your works')}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="rounded-full" size="icon">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Active Contracts */}
      <section className="mb-6">
        <h2 className="section-header flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success" />
          {t('ಸಕ್ರಿಯ', 'Active')} ({activeContracts.length})
        </h2>
        {activeContracts.length > 0 ? (
          <div className="space-y-3">
            {activeContracts.map(contract => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-card rounded-2xl border border-border">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{t('ಯಾವುದೇ ಸಕ್ರಿಯ ಗುತ್ತಿಗೆ ಇಲ್ಲ', 'No active contracts')}</p>
          </div>
        )}
      </section>
      
      {/* Completed Contracts */}
      {completedContracts.length > 0 && (
        <section>
          <h2 className="section-header flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            {t('ಮುಗಿದ', 'Completed')} ({completedContracts.length})
          </h2>
          <div className="space-y-3">
            {completedContracts.map(contract => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        </section>
      )}
      
      {/* Add Contract Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl">{t('ಹೊಸ ಗುತ್ತಿಗೆ', 'New Contract')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">{t('ಕೆಲಸದ ಹೆಸರು', 'Work Name')} *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('ಉದಾ: ಮನೆ ಕಟ್ಟಡ', 'E.g: House Construction')}
                className="input-field"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">{t('ಗ್ರಾಹಕರ ಹೆಸರು', 'Client Name')} ({t('ಐಚ್ಛಿಕ', 'Optional')})</Label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={t('ಗ್ರಾಹಕರ ಹೆಸರು', 'Client name')}
                className="input-field"
              />
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
            
            <Button type="submit" className="btn-touch w-full" disabled={!name}>
              {t('ಗುತ್ತಿಗೆ ಸೇರಿಸಿ', 'Add Contract')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
