import { Header } from '@/components/Header';
import { StatCards } from '@/components/StatCards';
import { QuickActions } from '@/components/QuickActions';
import { ContractList } from '@/components/ContractList';
import { useApp } from '@/contexts/AppContext';

const Index = () => {
  const { t } = useApp();
  
  return (
    <div className="page-container">
      <Header />
      
      {/* Stats Overview */}
      <section className="mb-6">
        <StatCards />
      </section>
      
      {/* Quick Actions */}
      <section className="mb-6">
        <h2 className="section-header">{t('ತ್ವರಿತ ಕ್ರಿಯೆಗಳು', 'Quick Actions')}</h2>
        <QuickActions />
      </section>
      
      {/* Active Contracts */}
      <section>
        <h2 className="section-header">{t('ಸಕ್ರಿಯ ಗುತ್ತಿಗೆಗಳು', 'Active Contracts')}</h2>
        <ContractList />
      </section>
    </div>
  );
};

export default Index;
