import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  requestNotificationPermission,
  shouldShowReminderPrompt,
  markReminderPromptShown,
  getNotificationPermission,
} from '@/lib/notifications';

export function ReminderPrompt() {
  const { t, settings, updateSettings } = useApp();
  const [open, setOpen] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');

  useEffect(() => {
    // Show prompt after a short delay if not shown before
    const timer = setTimeout(() => {
      if (shouldShowReminderPrompt()) {
        setOpen(true);
      }
    }, 3000);

    setPermissionStatus(getNotificationPermission());
    return () => clearTimeout(timer);
  }, []);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    
    if (granted) {
      updateSettings({ reminderEnabled: true });
      markReminderPromptShown();
      setOpen(false);
    }
  };

  const handleSkip = () => {
    updateSettings({ reminderEnabled: false });
    markReminderPromptShown();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Bell className="w-6 h-6 text-primary" />
            {t('ದೈನಿಕ ಜ್ಞಾಪನೆ', 'Daily Reminder')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
            <p className="text-lg font-medium text-foreground mb-2">
              {t('ಇಂದು ಖರ್ಚು entry ಮಾಡಿದೀರಾ?', 'Did you log expenses today?')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(
                'ಪ್ರತಿದಿನ ಸಂಜೆ 7 ಗಂಟೆಗೆ ಜ್ಞಾಪನೆ ಪಡೆಯಿರಿ',
                'Get reminded every day at 7 PM'
              )}
            </p>
          </div>

          {permissionStatus === 'denied' && (
            <p className="text-sm text-destructive">
              {t(
                'ಅಧಿಸೂಚನೆಗಳನ್ನು ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಿ',
                'Please enable notifications in browser settings'
              )}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleEnable}
              className="btn-touch w-full bg-primary"
            >
              <Bell className="w-5 h-5 mr-2" />
              {t('ಜ್ಞಾಪನೆ ಸಕ್ರಿಯಗೊಳಿಸಿ', 'Enable Reminders')}
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              {t('ಈಗ ಬೇಡ', 'Not now')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}