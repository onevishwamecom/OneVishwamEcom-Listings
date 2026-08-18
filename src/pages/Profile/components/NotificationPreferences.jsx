export function NotificationPreferences({ user, notifSaving, handleNotificationToggle, handleSavePreferences }) {
  return (
    <form onSubmit={handleSavePreferences} className="animate-fade-in space-y-6 max-w-xl" noValidate>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Communication Preferences</h3>
        <p className="text-sm font-medium text-slate-500 mb-6">
          Choose how you would like to be notified about important account activity.
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between gap-4 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <i className="fa-solid fa-envelope" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-700">Email Notifications</p>
              <p className="text-sm font-medium text-slate-500">Receive account and listing alerts via email.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleNotificationToggle('email')}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${user?.notifications?.email ? 'bg-brand-blue' : 'bg-slate-300'}`}
            aria-label="Toggle email notifications"
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${user?.notifications?.email ? 'translate-x-4' : 'translate-x-1'}`} />
          </button>
        </label>

        <label className="flex items-center justify-between gap-4 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <i className="fa-brands fa-whatsapp" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-700">WhatsApp Notifications</p>
              <p className="text-sm font-medium text-slate-500">Receive important alerts via WhatsApp (where available).</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleNotificationToggle('whatsapp')}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${user?.notifications?.whatsapp ? 'bg-brand-orange' : 'bg-slate-300'}`}
            aria-label="Toggle whatsapp notifications"
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${user?.notifications?.whatsapp ? 'translate-x-4' : 'translate-x-1'}`} />
          </button>
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={notifSaving}
          className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy px-6 py-3 rounded-2xl text-sm font-bold hover:bg-brand-gold/90 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
        >
          {notifSaving ? <i className="fa-solid fa-circle-notch fa-spin text-sm" /> : null}
          Save Preferences
        </button>
      </div>
    </form>
  );
}