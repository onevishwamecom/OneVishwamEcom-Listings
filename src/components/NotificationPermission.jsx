import { useState } from 'react';
import { useAuth } from '../store/authSlice';

export default function NotificationPermission({ open, onClose, onAccepted }) {
  const { updateNotifications, loading } = useAuth();
  const [email, setEmail] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);

  if (!open) return null;

  const handleAccept = async () => {
    try {
      await updateNotifications({ email, whatsapp }).unwrap();
      onAccepted && onAccepted();
    } catch {
      /* error surfaced via auth error */
    }
  };

  const handleLater = () => {
    localStorage.setItem('notificationsPromptDismissed', 'later');
    onClose();
  };

  const handleDismiss = () => {
    localStorage.setItem('notificationsPromptDismissed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md rounded-3xl bg-white p-7 shadow-xl animate-fade-in-up">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
          aria-label="Dismiss"
        >
          <i className="fa-solid fa-xmark text-lg" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue mx-auto mb-5">
          <i className="fa-solid fa-bell text-xl" />
        </div>

        <h2 className="text-center text-xl font-extrabold text-slate-900">
          Enable Notifications
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Stay in the loop about new enquiries and updates to your listings.
        </p>

        <div className="mt-6 space-y-4">
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <i className="fa-solid fa-envelope text-brand-blue" />
              <span className="text-sm font-medium text-slate-700">Email Notifications</span>
            </div>
            <button
              type="button"
              onClick={() => setEmail(!email)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${email ? 'bg-brand-blue' : 'bg-slate-300'}`}
              aria-label="Toggle email notifications"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${email ? 'translate-x-4' : 'translate-x-1'}`} />
            </button>
          </label>

          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <i className="fa-brands fa-whatsapp text-brand-orange" />
              <span className="text-sm font-medium text-slate-700">WhatsApp Notifications</span>
            </div>
            <button
              type="button"
              onClick={() => setWhatsapp(!whatsapp)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${whatsapp ? 'bg-brand-orange' : 'bg-slate-300'}`}
              aria-label="Toggle whatsapp notifications"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${whatsapp ? 'translate-x-4' : 'translate-x-1'}`} />
            </button>
          </label>
        </div>

        <div className="mt-8 mb-2 flex items-center justify-center gap-2">
          <button
            onClick={handleLater}
            className="text-sm font-bold text-slate-500 hover:text-slate-700"
          >
            Not now
          </button>
          <button
            onClick={handleAccept}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-gold text-brand-navy px-5 py-2.5 text-sm font-bold hover:bg-brand-gold/90 transition-all"
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin" /> : null}
            Save Preferences
          </button>
        </div>

        <p className="text-center text-[10px] font-medium text-slate-400">
          You can change these anytime in Settings.
        </p>
      </div>
    </div>
  );
}
