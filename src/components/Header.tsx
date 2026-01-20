import { Settings, Globe } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { t, settings, updateSettings } = useApp();
  const navigate = useNavigate();
  
  const toggleLanguage = () => {
    updateSettings({ language: settings.language === 'kn' ? 'en' : 'kn' });
  };
  
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('ಖರ್ಚಾ ಬುಕ್', 'Kharcha Book')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('ನಿಮ್ಮ ಹಣಕಾಸು ನಿರ್ವಹಣೆ', 'Your finance manager')}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          className="rounded-full"
        >
          <Globe className="w-5 h-5" />
        </Button>
        <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full">
          {settings.language === 'kn' ? 'ಕನ್ನಡ' : 'EN'}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/settings')}
          className="rounded-full"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
