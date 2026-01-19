import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Plus, Users, Phone, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllLabourSummaries, formatCurrency } from '@/lib/calculations';
import type { WorkType, LabourType } from '@/types';

export default function LabourPage() {
  const { t, labours, contracts, addLabour, updateLabour } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [workType, setWorkType] = useState<WorkType>('helper');
  const [labourType, setLabourType] = useState<LabourType>('permanent');
  const [dailySalary, setDailySalary] = useState('');
  const [daysWorked, setDaysWorked] = useState('');
  const [contractId, setContractId] = useState('');
  
  const summaries = getAllLabourSummaries(labours);
  const pendingLabours = summaries.filter(l => l.balance > 0);
  const paidLabours = summaries.filter(l => l.balance <= 0);
  
  const workTypes: { value: WorkType; labelKn: string; labelEn: string }[] = [
    { value: 'mason', labelKn: 'ಕಲ್ಲಿನ ಕೆಲಸಗಾರ', labelEn: 'Mason' },
    { value: 'helper', labelKn: 'ಸಹಾಯಕ', labelEn: 'Helper' },
    { value: 'electrician', labelKn: 'ವಿದ್ಯುತ್ಕಾರ', labelEn: 'Electrician' },
    { value: 'plumber', labelKn: 'ಪ್ಲಂಬರ್', labelEn: 'Plumber' },
    { value: 'carpenter', labelKn: 'ಬಡಗಿ', labelEn: 'Carpenter' },
    { value: 'painter', labelKn: 'ಪೇಂಟರ್', labelEn: 'Painter' },
    { value: 'other', labelKn: 'ಇತರೆ', labelEn: 'Other' },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dailySalary) return;
    
    addLabour({
      name,
      phone: phone || undefined,
      workType,
      labourType,
      dailySalary: parseFloat(dailySalary),
      daysWorked: parseFloat(daysWorked) || 0,
      paidAmount: 0,
      contractId: contractId || undefined,
    });
    
    // Reset form
    setName('');
    setPhone('');
    setWorkType('helper');
    setLabourType('permanent');
    setDailySalary('');
    setDaysWorked('');
    setContractId('');
    setDialogOpen(false);
  };
  
  const handlePay = () => {
    if (!selectedLabour || !payAmount) return;
    const labour = labours.find(l => l.id === selectedLabour);
    if (!labour) return;
    
    updateLabour({
      ...labour,
      paidAmount: labour.paidAmount + parseFloat(payAmount),
    });
    
    setPayAmount('');
    setSelectedLabour(null);
    setPayDialogOpen(false);
  };
  
  const openPayDialog = (labourId: string) => {
    setSelectedLabour(labourId);
    setPayDialogOpen(true);
  };
  
  const LabourCard = ({ labour }: { labour: typeof summaries[0] }) => {
    const hasPending = labour.balance > 0;
    const workTypeLabel = workTypes.find(w => w.value === labour.workType);
    
    return (
      <div className="list-item flex-col items-stretch gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${hasPending ? 'bg-warning/10' : 'bg-success/10'}`}>
              <Users className={`w-5 h-5 ${hasPending ? 'text-warning' : 'text-success'}`} />
            </div>
            <div>
              <p className="font-semibold text-foreground">{labour.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{workTypeLabel ? t(workTypeLabel.labelKn, workTypeLabel.labelEn) : ''}</span>
                {labour.labourType === 'temporary' && (
                  <span className="badge-warning text-xs">{t('ತಾತ್ಕಾಲಿಕ', 'Temp')}</span>
                )}
              </div>
            </div>
          </div>
          {labour.phone && (
            <a href={`tel:${labour.phone}`} className="p-2 rounded-lg bg-secondary">
              <Phone className="w-4 h-4 text-muted-foreground" />
            </a>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-secondary/50 rounded-lg p-2">
            <p className="text-muted-foreground text-xs">{t('ಒಟ್ಟು', 'Total')}</p>
            <p className="font-semibold">{formatCurrency(labour.totalSalary)}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2">
            <p className="text-muted-foreground text-xs">{t('ಪಾವತಿ', 'Paid')}</p>
            <p className="font-semibold text-success">{formatCurrency(labour.paidAmount)}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2">
            <p className="text-muted-foreground text-xs">{t('ಬಾಕಿ', 'Due')}</p>
            <p className={`font-semibold ${hasPending ? 'text-destructive' : 'text-success'}`}>
              {formatCurrency(labour.balance)}
            </p>
          </div>
        </div>
        
        {hasPending && (
          <Button 
            onClick={() => openPayDialog(labour.id)}
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
          <h1 className="text-2xl font-bold text-foreground">{t('ಕಾರ್ಮಿಕರು', 'Labour')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('ಕಾರ್ಮಿಕ ಪಾವತಿ ನಿರ್ವಹಣೆ', 'Manage worker payments')}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="rounded-full" size="icon">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Pending Payments */}
      {pendingLabours.length > 0 && (
        <section className="mb-6">
          <h2 className="section-header flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            {t('ಬಾಕಿ ಪಾವತಿ', 'Pending Payments')} ({pendingLabours.length})
          </h2>
          <div className="space-y-3">
            {pendingLabours.map(labour => (
              <LabourCard key={labour.id} labour={labour} />
            ))}
          </div>
        </section>
      )}
      
      {/* All Labour */}
      <section>
        <h2 className="section-header flex items-center gap-2">
          <Check className="w-4 h-4 text-success" />
          {t('ಪೂರ್ಣ ಪಾವತಿ', 'Fully Paid')} ({paidLabours.length})
        </h2>
        {paidLabours.length > 0 ? (
          <div className="space-y-3">
            {paidLabours.map(labour => (
              <LabourCard key={labour.id} labour={labour} />
            ))}
          </div>
        ) : summaries.length === 0 ? (
          <div className="text-center py-8 bg-card rounded-2xl border border-border">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{t('ಯಾವುದೇ ಕಾರ್ಮಿಕರಿಲ್ಲ', 'No labourers yet')}</p>
          </div>
        ) : null}
      </section>
      
      {/* Add Labour Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('ಹೊಸ ಕಾರ್ಮಿಕ', 'New Labour')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">{t('ಹೆಸರು', 'Name')} *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">{t('ಫೋನ್', 'Phone')} ({t('ಐಚ್ಛಿಕ', 'Optional')})</Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">{t('ಕೆಲಸದ ಪ್ರಕಾರ', 'Work Type')}</Label>
              <Select value={workType} onValueChange={(v) => setWorkType(v as WorkType)}>
                <SelectTrigger className="input-field">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {workTypes.map(type => (
                    <SelectItem key={type.value} value={type.value} className="py-3">
                      {t(type.labelKn, type.labelEn)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">{t('ಕಾರ್ಮಿಕ ಪ್ರಕಾರ', 'Labour Type')}</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['permanent', 'temporary'] as LabourType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLabourType(type)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      labourType === type ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    {type === 'permanent' ? t('ಕಾಯಂ', 'Permanent') : t('ತಾತ್ಕಾಲಿಕ', 'Temporary')}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-base">{t('ದಿನಗೂಲಿ', 'Daily Rate')} (₹) *</Label>
                <Input
                  type="number"
                  value={dailySalary}
                  onChange={(e) => setDailySalary(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base">{t('ದಿನಗಳು', 'Days')}</Label>
                <Input
                  type="number"
                  value={daysWorked}
                  onChange={(e) => setDaysWorked(e.target.value)}
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">{t('ಗುತ್ತಿಗೆ', 'Contract')} ({t('ಐಚ್ಛಿಕ', 'Optional')})</Label>
              <Select value={contractId} onValueChange={setContractId}>
                <SelectTrigger className="input-field">
                  <SelectValue placeholder={t('ಆಯ್ಕೆ ಮಾಡಿ', 'Select')} />
                </SelectTrigger>
                <SelectContent>
                  {contracts.filter(c => c.isActive).map(contract => (
                    <SelectItem key={contract.id} value={contract.id} className="py-3">
                      {contract.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="btn-touch w-full" disabled={!name || !dailySalary}>
              {t('ಕಾರ್ಮಿಕ ಸೇರಿಸಿ', 'Add Labour')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Pay Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>{t('ಪಾವತಿ ಮಾಡಿ', 'Make Payment')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedLabour && (() => {
              const labour = summaries.find(l => l.id === selectedLabour);
              if (!labour) return null;
              return (
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <p className="text-lg font-semibold">{labour.name}</p>
                  <p className="text-muted-foreground">
                    {t('ಬಾಕಿ', 'Balance')}: <span className="text-destructive font-bold">{formatCurrency(labour.balance)}</span>
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
