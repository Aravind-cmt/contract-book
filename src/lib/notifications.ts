// Daily reminder notification utilities

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export function showNotification(title: string, body: string): void {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'kharcha-reminder',
      requireInteraction: true,
    });
  }
}

// Schedule daily reminder at 7 PM
export function scheduleDailyReminder(
  titleKn: string,
  titleEn: string,
  bodyKn: string,
  bodyEn: string,
  language: 'kn' | 'en'
): void {
  const REMINDER_KEY = 'kharcha_last_reminder';
  const REMINDER_HOUR = 19; // 7 PM

  const checkAndRemind = () => {
    const now = new Date();
    const lastReminder = localStorage.getItem(REMINDER_KEY);
    const today = now.toDateString();

    // Check if it's after 7 PM and we haven't reminded today
    if (now.getHours() >= REMINDER_HOUR && lastReminder !== today) {
      const title = language === 'kn' ? titleKn : titleEn;
      const body = language === 'kn' ? bodyKn : bodyEn;
      showNotification(title, body);
      localStorage.setItem(REMINDER_KEY, today);
    }
  };

  // Check immediately
  checkAndRemind();

  // Check every hour
  setInterval(checkAndRemind, 60 * 60 * 1000);
}

// Check if we should show a reminder prompt
export function shouldShowReminderPrompt(): boolean {
  const PROMPT_KEY = 'kharcha_reminder_prompt_shown';
  const shown = localStorage.getItem(PROMPT_KEY);
  return !shown;
}

export function markReminderPromptShown(): void {
  localStorage.setItem('kharcha_reminder_prompt_shown', 'true');
}