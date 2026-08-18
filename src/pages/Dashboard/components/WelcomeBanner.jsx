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
    <div className="relative rounded-2xl bg-hero-gradient p-6 sm:p-8 text-white overflow-hidden animate-fade-in shadow-lg">
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-inner shrink-0">
          {initial}
        </div>
        <div className="flex-1">
          <p className="text-blue-100 text-sm font-medium mb-1">{greeting} 👋</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{displayName}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {user?.email && (
              <span className="flex items-center gap-1.5 text-sm text-blue-100/80">
                <i className="fa-solid fa-envelope text-xs" aria-hidden="true" />
                {user.email}
              </span>
            )}
            {user?.city && (
              <span className="flex items-center gap-1.5 text-sm text-blue-100/80">
                <i className="fa-solid fa-location-dot text-xs" aria-hidden="true" />
                {user.city}{user.area && `, ${user.area}`}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {verifyEmailAction}
          <Link
            to="/add-listing"
            className="inline-flex items-center gap-2 bg-brand-gold text-brand-navy hover:bg-brand-gold/90 border border-brand-gold px-5 py-3 rounded-2xl font-bold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            <i className="fa-solid fa-plus" />
            List New Product
          </Link>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 px-5 py-3 rounded-2xl font-bold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            <i className="fa-solid fa-list-check" />
            View All
          </Link>
        </div>
      </div>
    </div>
  );
}