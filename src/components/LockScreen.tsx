import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Lock, Delete, Fingerprint } from 'lucide-react';
import { getPin, setPin as savePin } from '@/lib/storage';
import { Button } from '@/components/ui/button';

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const { t } = useApp();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [error, setError] = useState('');
  const [storedPin, setStoredPin] = useState<string | null>(null);

  useEffect(() => {
    const existingPin = getPin();
    setStoredPin(existingPin);
    if (!existingPin) {
      setIsSettingPin(true);
    }
  }, []);

  const handleNumberPress = (num: string) => {
    if (isSettingPin) {
      if (pin.length < 4) {
        const newPinValue = pin + num;
        setPin(newPinValue);
        setError('');
      } else if (confirmPin.length < 4) {
        const newConfirm = confirmPin + num;
        setConfirmPin(newConfirm);
        setError('');
      }
    } else {
      if (pin.length < 4) {
        const newPinValue = pin + num;
        setPin(newPinValue);
        setError('');
        
        if (newPinValue.length === 4) {
          if (newPinValue === storedPin) {
            onUnlock();
          } else {
            setError(t('ತಪ್ಪಾದ PIN', 'Wrong PIN'));
            setPin('');
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (isSettingPin && confirmPin.length > 0) {
      setConfirmPin(confirmPin.slice(0, -1));
    } else if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
    setError('');
  };

  const handleConfirmNewPin = () => {
    if (pin.length === 4 && confirmPin.length === 4) {
      if (pin === confirmPin) {
        savePin(pin);
        setStoredPin(pin);
        setIsSettingPin(false);
        setPin('');
        setConfirmPin('');
        onUnlock();
      } else {
        setError(t('PIN ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ', 'PINs do not match'));
        setConfirmPin('');
      }
    }
  };

  const PinDots = ({ length, filled }: { length: number; filled: number }) => (
    <div className="flex gap-4 justify-center my-8">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full transition-all duration-200 ${
            i < filled ? 'bg-primary scale-110' : 'bg-border'
          }`}
        />
      ))}
    </div>
  );

  const NumberPad = () => (
    <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          onClick={() => handleNumberPress(num.toString())}
          className="w-20 h-20 rounded-full bg-card border border-border text-2xl font-semibold text-foreground transition-all active:scale-95 active:bg-secondary"
        >
          {num}
        </button>
      ))}
      <div /> {/* Empty space */}
      <button
        onClick={() => handleNumberPress('0')}
        className="w-20 h-20 rounded-full bg-card border border-border text-2xl font-semibold text-foreground transition-all active:scale-95 active:bg-secondary"
      >
        0
      </button>
      <button
        onClick={handleDelete}
        className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center text-foreground transition-all active:scale-95 active:bg-secondary"
      >
        <Delete className="w-6 h-6" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('ಖರ್ಚಾ ಬುಕ್', 'Kharcha Book')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isSettingPin
            ? pin.length < 4
              ? t('ಹೊಸ PIN ನಮೂದಿಸಿ', 'Enter new PIN')
              : t('PIN ದೃಢೀಕರಿಸಿ', 'Confirm PIN')
            : t('PIN ನಮೂದಿಸಿ', 'Enter PIN')}
        </p>
      </div>

      <PinDots 
        length={4} 
        filled={isSettingPin && pin.length === 4 ? confirmPin.length : pin.length} 
      />

      {error && (
        <p className="text-destructive text-sm mb-4 animate-pulse">{error}</p>
      )}

      <NumberPad />

      {isSettingPin && pin.length === 4 && confirmPin.length === 4 && (
        <Button 
          onClick={handleConfirmNewPin}
          className="btn-touch mt-6 w-full max-w-[280px]"
        >
          {t('PIN ಹೊಂದಿಸಿ', 'Set PIN')}
        </Button>
      )}

      {!isSettingPin && (
        <p className="text-xs text-muted-foreground mt-8 text-center">
          {t('ನಿಮ್ಮ ಡೇಟಾ ಸುರಕ್ಷಿತವಾಗಿದೆ', 'Your data is secure')}
        </p>
      )}
    </div>
  );
}