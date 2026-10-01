import { Link } from 'react-router-dom';

export function WelcomeBanner({ user, verifyEmailAction }) {
  const displayName = user?.fullName || user?.name || 'User';
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-brand-navy to-slate-900 p-5 sm:p-6 text-white overflow-hidden shadow-sm border border-slate-800/60 animate-fade-in">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-brand-gold/10 rounded-full blur-2xl translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0 border border-white/20">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-300 tracking-wide">{greeting} 👋</span>
              {user?.role && (
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                  {user.role}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white truncate">{displayName}</h1>
            {user?.email && (
              <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                <i className="fa-solid fa-envelope text-[10px] text-slate-400" aria-hidden="true" />
                {user.email}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          {verifyEmailAction}
          <Link
            to="/add-listing"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy hover:bg-brand-gold/90 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all duration-150 active:scale-[0.98]"
          >
            <i className="fa-solid fa-plus text-xs" />
            List Product
          </Link>
          <Link
            to="/listings"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/15 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-150"
          >
            <i className="fa-solid fa-list-check text-xs" />
            Listings
          </Link>
        </div>
      </div>
    </div>
  );
}