import { useApp } from '@/contexts/AppContext';
import { BarChart3, TrendingUp, TrendingDown, Users, Landmark, FileText, Wallet } from 'lucide-react';
import { 
  getAllContractSummaries, 
  getAllLabourSummaries, 
  getAllLoanSummaries,
  getOverallProfitLoss,
  getTotalIncome,
  getTotalBusinessExpenses,
  getTotalPersonalExpenses,
  formatCurrency 
} from '@/lib/calculations';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

export default function ReportsPage() {
  const { t, contracts, incomes, expenses, labours, loans } = useApp();
  
  const contractSummaries = getAllContractSummaries(contracts);
  const labourSummaries = getAllLabourSummaries(labours);
  const loanSummaries = getAllLoanSummaries(loans);
  
  const totalIncome = getTotalIncome(incomes);
  const totalBusinessExpense = getTotalBusinessExpenses(expenses);
  const totalPersonalExpense = getTotalPersonalExpenses(expenses);
  const overallProfitLoss = getOverallProfitLoss(incomes, expenses);
  const isProfit = overallProfitLoss >= 0;
  
  const totalLabourDue = labourSummaries.reduce((sum, l) => sum + l.balance, 0);
  const totalLoanDue = loanSummaries.reduce((sum, l) => sum + l.pendingBalance, 0);
  
  // Chart data for contracts
  const chartData = contractSummaries
    .filter(c => c.totalIncome > 0 || c.totalExpense > 0)
    .slice(0, 5)
    .map(c => ({
      name: c.name.substring(0, 10),
      profit: c.profitLoss,
      isProfit: c.profitLoss >= 0,
    }));

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t('ವರದಿಗಳು', 'Reports')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('ನಿಮ್ಮ ಹಣಕಾಸಿನ ಸಾರಾಂಶ', 'Your financial summary')}
        </p>
      </div>
      
      {/* Overall Summary */}
      <section className="mb-6">
        <div className={`stat-card ${isProfit ? 'stat-card-profit' : 'stat-card-loss'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">{t('ಒಟ್ಟಾರೆ ಲಾಭ/ನಷ್ಟ', 'Overall Profit/Loss')}</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(Math.abs(overallProfitLoss))}</p>
            </div>
            <div className="p-3 rounded-full bg-white/20">
              {isProfit ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-xs opacity-75">{t('ಆದಾಯ', 'Income')}</p>
              <p className="font-semibold">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-75">{t('ವ್ಯಾಪಾರ ಖರ್ಚು', 'Business')}</p>
              <p className="font-semibold">{formatCurrency(totalBusinessExpense)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-75">{t('ವೈಯಕ್ತಿಕ', 'Personal')}</p>
              <p className="font-semibold">{formatCurrency(totalPersonalExpense)}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pending Dues */}
      <section className="mb-6">
        <h2 className="section-header">{t('ಬಾಕಿ ಪಾವತಿಗಳು', 'Pending Dues')}</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="list-item">
            <div className="p-2 rounded-lg bg-warning/10">
              <Users className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('ಕಾರ್ಮಿಕ ಬಾಕಿ', 'Labour Due')}</p>
              <p className="font-bold text-warning">{formatCurrency(totalLabourDue)}</p>
            </div>
          </div>
          <div className="list-item">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Landmark className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('ಸಾಲ ಬಾಕಿ', 'Loan Due')}</p>
              <p className="font-bold text-destructive">{formatCurrency(totalLoanDue)}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contract-wise Chart */}
      {chartData.length > 0 && (
        <section className="mb-6">
          <h2 className="section-header">{t('ಗುತ್ತಿಗೆ ಲಾಭ/ನಷ್ಟ', 'Contract Profit/Loss')}</h2>
          <div className="bg-card rounded-2xl border border-border p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" tickFormatter={(v) => `₹${Math.abs(v/1000)}K`} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                <Bar dataKey="profit" radius={[0, 8, 8, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isProfit ? 'hsl(145, 60%, 40%)' : 'hsl(0, 70%, 50%)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
      
      {/* Contract Summary List */}
      <section className="mb-6">
        <h2 className="section-header flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {t('ಗುತ್ತಿಗೆ ವರದಿ', 'Contract Report')}
        </h2>
        {contractSummaries.length > 0 ? (
          <div className="space-y-2">
            {contractSummaries.map(contract => {
              const isContractProfit = contract.profitLoss >= 0;
              return (
                <div key={contract.id} className="list-item">
                  <div className={`p-2 rounded-lg ${isContractProfit ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    {isContractProfit ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{contract.name}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{t('ಆದಾಯ', 'Inc')}: {formatCurrency(contract.totalIncome)}</span>
                      <span>{t('ಖರ್ಚು', 'Exp')}: {formatCurrency(contract.totalExpense)}</span>
                    </div>
                  </div>
                  <p className={`font-bold ${isContractProfit ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(Math.abs(contract.profitLoss))}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground">{t('ಯಾವುದೇ ಗುತ್ತಿಗೆ ಇಲ್ಲ', 'No contracts yet')}</p>
          </div>
        )}
      </section>
      
      {/* Labour Summary */}
      <section className="mb-6">
        <h2 className="section-header flex items-center gap-2">
          <Users className="w-4 h-4" />
          {t('ಕಾರ್ಮಿಕ ವರದಿ', 'Labour Report')}
        </h2>
        {labourSummaries.length > 0 ? (
          <div className="space-y-2">
            {labourSummaries.map(labour => (
              <div key={labour.id} className="list-item">
                <div className={`p-2 rounded-lg ${labour.balance > 0 ? 'bg-warning/10' : 'bg-success/10'}`}>
                  <Users className={`w-4 h-4 ${labour.balance > 0 ? 'text-warning' : 'text-success'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{labour.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('ಒಟ್ಟು', 'Total')}: {formatCurrency(labour.totalSalary)} • 
                    {t('ಪಾವತಿ', 'Paid')}: {formatCurrency(labour.paidAmount)}
                  </p>
                </div>
                <p className={`font-bold ${labour.balance > 0 ? 'text-warning' : 'text-success'}`}>
                  {formatCurrency(labour.balance)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground">{t('ಯಾವುದೇ ಕಾರ್ಮಿಕರಿಲ್ಲ', 'No labourers yet')}</p>
          </div>
        )}
      </section>
      
      {/* Loan Summary */}
      <section>
        <h2 className="section-header flex items-center gap-2">
          <Landmark className="w-4 h-4" />
          {t('ಸಾಲ ವರದಿ', 'Loan Report')}
        </h2>
        {loanSummaries.length > 0 ? (
          <div className="space-y-2">
            {loanSummaries.map(loan => (
              <div key={loan.id} className="list-item">
                <div className={`p-2 rounded-lg ${loan.pendingBalance > 0 ? 'bg-destructive/10' : 'bg-success/10'}`}>
                  <Landmark className={`w-4 h-4 ${loan.pendingBalance > 0 ? 'text-destructive' : 'text-success'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{loan.lenderName}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('ಅಸಲು', 'P')}: {formatCurrency(loan.principalAmount)} • 
                    {t('ಬಡ್ಡಿ', 'I')}: {formatCurrency(loan.totalInterest)}
                  </p>
                </div>
                <p className={`font-bold ${loan.pendingBalance > 0 ? 'text-destructive' : 'text-success'}`}>
                  {formatCurrency(loan.pendingBalance)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground">{t('ಯಾವುದೇ ಸಾಲಗಳಿಲ್ಲ', 'No loans yet')}</p>
          </div>
        )}
      </section>
    </div>
  );
}
