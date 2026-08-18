import { useState } from 'react';

export function useNotifications(user, updateNotifications) {
  const [notifSaving, setNotifSaving] = useState(false);

  const handleNotificationToggle = (type) => {
    const prefs = {
      email: type === 'email' ? !user?.notifications?.email : user?.notifications?.email ?? false,
      whatsapp: type === 'whatsapp' ? !user?.notifications?.whatsapp : user?.notifications?.whatsapp ?? false,
    };
    updateNotifications(prefs);
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    const prefs = {
      email: user?.notifications?.email ?? false,
      whatsapp: user?.notifications?.whatsapp ?? false,
    };
    setNotifSaving(true);
    try {
      await updateNotifications(prefs).unwrap();
      localStorage.setItem('notificationsPromptDismissed', 'true');
    } catch {
      // Error handled by auth slice
    } finally {
      setNotifSaving(false);
    }
  };

  return {
    notifSaving,
    handleNotificationToggle,
    handleSavePreferences,
  };
}