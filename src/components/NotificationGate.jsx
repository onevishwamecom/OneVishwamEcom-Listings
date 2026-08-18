import { useEffect, useState } from 'react';
import { useAuth } from '../store/authSlice';
import NotificationPermission from './NotificationPermission';

function shouldShowPrompt(user) {
  if (!user) return false;
  const notified = localStorage.getItem('notificationsPromptDismissed');
  if (notified) return false;
  const prefs = user.notifications;
  if (!prefs) return true;
  return prefs.email === false && prefs.whatsapp === false;
}

export default function NotificationGate() {
  const { user, isLoggedIn, loading } = useAuth();
  const [promptOpen, setPromptOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn && !loading && shouldShowPrompt(user)) {
      setPromptOpen(true);
    }
  }, [isLoggedIn, loading, user]);

  return (
    <NotificationPermission
      open={promptOpen}
      onClose={() => setPromptOpen(false)}
      onAccepted={() => setPromptOpen(false)}
    />
  );
}
