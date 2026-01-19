import { Home, FileText, Users, Landmark, BarChart3 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const navItems = [
  { path: '/', icon: Home, labelKn: 'ಮನೆ', labelEn: 'Home' },
  { path: '/contracts', icon: FileText, labelKn: 'ಗುತ್ತಿಗೆ', labelEn: 'Contracts' },
  { path: '/labour', icon: Users, labelKn: 'ಕಾರ್ಮಿಕ', labelEn: 'Labour' },
  { path: '/loans', icon: Landmark, labelKn: 'ಸಾಲ', labelEn: 'Loans' },
  { path: '/reports', icon: BarChart3, labelKn: 'ವರದಿ', labelEn: 'Reports' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useApp();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-pb">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, labelKn, labelEn }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`nav-item flex-1 ${isActive ? 'nav-item-active' : 'text-muted-foreground'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{t(labelKn, labelEn)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
