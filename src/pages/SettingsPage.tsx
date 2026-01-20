import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Lock, Bell, Globe, Trash2, Download, Upload, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getPin, setPin, clearPin, exportAllData, importData } from '@/lib/storage';
import { requestNotificationPermission, getNotificationPermission } from '@/lib/notifications';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { t, settings, updateSettings } = useApp();
  const navigate = useNavigate();
  const [changePinOpen, setChangePinOpen] = useState(false);
  const [removePinOpen, setRemovePinOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  const hasPin = !!getPin();
  const notificationStatus = getNotificationPermission();

  const handleLanguageToggle = () => {
    updateSettings({ language: settings.language === 'kn' ? 'en' : 'kn' });
  };

  const handleReminderToggle = async () => {
    if (!settings.reminderEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        updateSettings({ reminderEnabled: true });
        toast.success(t('ಜ್ಞಾಪನೆ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ', 'Reminders enabled'));
      } else {
        toast.error(t('ಅಧಿಸೂಚನೆ ಅನುಮತಿ ಅಗತ್ಯ', 'Notification permission required'));
      }
    } else {
      updateSettings({ reminderEnabled: false });
      toast.success(t('ಜ್ಞಾಪನೆ ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ', 'Reminders disabled'));
    }
  };

  const handleChangePin = () => {
    setPinError('');
    const storedPin = getPin();
    
    if (hasPin && currentPin !== storedPin) {
      setPinError(t('ಪ್ರಸ್ತುತ PIN ತಪ್ಪಾಗಿದೆ', 'Current PIN is wrong'));
      return;
    }

    if (newPin.length !== 4) {
      setPinError(t('PIN 4 ಅಂಕಿಗಳಾಗಿರಬೇಕು', 'PIN must be 4 digits'));
      return;
    }

    if (newPin !== confirmPin) {
      setPinError(t('PIN ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ', 'PINs do not match'));
      return;
    }

    setPin(newPin);
    setChangePinOpen(false);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    toast.success(t('PIN ಬದಲಾಯಿಸಲಾಗಿದೆ', 'PIN changed successfully'));
  };

  const handleRemovePin = () => {
    clearPin();
    setRemovePinOpen(false);
    toast.success(t('PIN ತೆಗೆದುಹಾಕಲಾಗಿದೆ', 'PIN removed'));
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kharcha-book-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t('ಬ್ಯಾಕಪ್ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ', 'Backup downloaded'));
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (importData(content)) {
        toast.success(t('ಡೇಟಾ ಪುನಃಸ್ಥಾಪಿಸಲಾಗಿದೆ', 'Data restored successfully'));
        window.location.reload();
      } else {
        toast.error(t('ಅಮಾನ್ಯ ಬ್ಯಾಕಪ್ ಫೈಲ್', 'Invalid backup file'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="page-container">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{t('ಸೆಟ್ಟಿಂಗ್ಸ್', 'Settings')}</h1>
      </div>

      <div className="space-y-4">
        {/* Language */}
        <div className="list-item">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{t('ಭಾಷೆ', 'Language')}</p>
            <p className="text-sm text-muted-foreground">
              {settings.language === 'kn' ? 'ಕನ್ನಡ' : 'English'}
            </p>
          </div>
          <Switch 
            checked={settings.language === 'en'} 
            onCheckedChange={handleLanguageToggle}
          />
        </div>

        {/* Daily Reminder */}
        <div className="list-item">
          <div className="p-2 rounded-lg bg-warning/10">
            <Bell className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{t('ದೈನಿಕ ಜ್ಞಾಪನೆ', 'Daily Reminder')}</p>
            <p className="text-sm text-muted-foreground">
              {t('ಸಂಜೆ 7 ಗಂಟೆಗೆ', 'At 7 PM')}
            </p>
          </div>
          <Switch 
            checked={settings.reminderEnabled} 
            onCheckedChange={handleReminderToggle}
            disabled={notificationStatus === 'unsupported'}
          />
        </div>

        {/* Security Section */}
        <div className="pt-4">
          <h2 className="section-header flex items-center gap-2">
            <Shield className="w-4 h-4" />
            {t('ಭದ್ರತೆ', 'Security')}
          </h2>
        </div>

        {/* PIN Lock */}
        <div className="list-item">
          <div className="p-2 rounded-lg bg-success/10">
            <Lock className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{t('PIN ಲಾಕ್', 'PIN Lock')}</p>
            <p className="text-sm text-muted-foreground">
              {hasPin 
                ? t('ಸಕ್ರಿಯ', 'Active') 
                : t('ನಿಷ್ಕ್ರಿಯ', 'Not set')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setChangePinOpen(true)}>
            {hasPin ? t('ಬದಲಾಯಿಸಿ', 'Change') : t('ಹೊಂದಿಸಿ', 'Set')}
          </Button>
        </div>

        {hasPin && (
          <Button 
            variant="ghost" 
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setRemovePinOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('PIN ತೆಗೆದುಹಾಕಿ', 'Remove PIN')}
          </Button>
        )}

        {/* Backup Section */}
        <div className="pt-4">
          <h2 className="section-header">{t('ಬ್ಯಾಕಪ್', 'Backup')}</h2>
        </div>

        <Button 
          variant="outline" 
          className="w-full justify-start h-14"
          onClick={handleExport}
        >
          <Download className="w-5 h-5 mr-3" />
          {t('ಡೇಟಾ ಡೌನ್‌ಲೋಡ್', 'Download Backup')}
        </Button>

        <label className="block">
          <Button 
            variant="outline" 
            className="w-full justify-start h-14"
            asChild
          >
            <span>
              <Upload className="w-5 h-5 mr-3" />
              {t('ಡೇಟಾ ಮರುಸ್ಥಾಪಿಸಿ', 'Restore Backup')}
            </span>
          </Button>
          <input 
            type="file" 
            accept=".json"
            className="hidden" 
            onChange={handleImport}
          />
        </label>
      </div>

      {/* Change PIN Dialog */}
      <Dialog open={changePinOpen} onOpenChange={setChangePinOpen}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>
              {hasPin ? t('PIN ಬದಲಾಯಿಸಿ', 'Change PIN') : t('PIN ಹೊಂದಿಸಿ', 'Set PIN')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {hasPin && (
              <div className="space-y-2">
                <Label>{t('ಪ್ರಸ್ತುತ PIN', 'Current PIN')}</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                  className="input-field text-center text-2xl tracking-widest"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>{t('ಹೊಸ PIN', 'New PIN')}</Label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                className="input-field text-center text-2xl tracking-widest"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('PIN ದೃಢೀಕರಿಸಿ', 'Confirm PIN')}</Label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                className="input-field text-center text-2xl tracking-widest"
              />
            </div>
            {pinError && <p className="text-destructive text-sm">{pinError}</p>}
            <Button onClick={handleChangePin} className="btn-touch w-full">
              {t('ಉಳಿಸಿ', 'Save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove PIN Confirmation */}
      <AlertDialog open={removePinOpen} onOpenChange={setRemovePinOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('PIN ತೆಗೆದುಹಾಕಿ?', 'Remove PIN?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('ಆಪ್ ಲಾಕ್ ನಿಷ್ಕ್ರಿಯಗೊಳ್ಳುತ್ತದೆ', 'App lock will be disabled')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('ರದ್ದು', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemovePin} className="bg-destructive">
              {t('ತೆಗೆದುಹಾಕಿ', 'Remove')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}