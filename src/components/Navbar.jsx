import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../store/authSlice';
import { useListingStats } from './ListingStats';
import { fetchNotifications, subscribeNotifications } from '../services/notifications';
import { confirmLogout } from '../utils/logout';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/listings': 'Listed Items',
  '/add-listing': 'List New Product',
  '/notifications': 'Notifications',
  '/profile': 'Profile Settings',
};

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/listings/')) return 'Listing Details';
  return 'Dashboard';
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { total: totalListings } = useListingStats();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    let cancelled = false;
    const loadCount = () => {
      fetchNotifications()
        .then((list) => {
          if (!cancelled) setUnreadCount(list.filter((n) => !n.read).length);
        })
        .catch(() => {});
    };
    loadCount();
    const unsubscribe = subscribeNotifications(loadCount);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [dropdownOpen]);

  const displayName = user?.fullName || user?.name || 'User';

  const handleLogout = () => confirmLogout({ logout, navigate });

  return (
    <header className="sticky top-0 z-30 glass border-b border-slate-200/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Page Title ── */}
        <div className="flex items-center gap-3 ml-12 md:ml-0">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">{pageTitle}</h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* ── Right Section ── */}
        <div className="flex items-center gap-3">
          {/* Listings count pill */}
          <div className="hidden sm:flex items-center gap-2 bg-blue-50 rounded-full px-3.5 py-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse-soft" />
            <span className="text-xs font-semibold text-blue-700">
              {totalListings} Listings
            </span>
          </div>

          {/* Notifications */}
          <Link
            to="/notifications"
            className={`relative flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
              location.pathname === '/notifications'
                ? 'bg-brand-blue/10 text-brand-blue'
                : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'
            }`}
            aria-label="Notifications"
            title="Notifications"
          >
            <i className="fa-solid fa-bell text-base" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center shadow-sm border-2 border-white">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              type="button"
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100/80 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200"
            >
              <div className="h-10 w-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center transition-colors group-hover:bg-brand-blue group-hover:text-white shadow-sm">
                <i className="fa-solid fa-plus text-sm" />
              </div>
              <span className="hidden sm:block font-semibold text-slate-700">{displayName}</span>
              <i
                className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 top-full pt-2 w-56 z-50 dropdown-enter"
                role="menu"
                aria-orientation="vertical"
                aria-label="User menu"
              >
                <div className="bg-white rounded-2xl shadow-elevated-lg border border-slate-100 p-1.5 overflow-hidden">
                  {/* User info */}
                  <div className="px-3.5 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                    {user?.email && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                    )}
                    {user?.role === 'admin' && (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold bg-gradient-to-r from-brand-blue/10 to-brand-blue/5 text-brand-blue px-2 py-0.5 rounded-full">
                        <i className="fa-solid fa-shield-halved text-[8px]" aria-hidden="true" />
                        Admin
                      </span>
                    )}
                  </div>
                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/profile');
                      }}
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 px-3.5 py-2.5 text-sm text-slate-600 rounded-xl hover:bg-slate-50 hover:text-brand-blue focus:outline-none focus:bg-slate-50 transition-colors"
                    >
                      <i className="fa-solid fa-user-gear w-4 text-center text-slate-400" aria-hidden="true" />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/listings');
                      }}
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 px-3.5 py-2.5 text-sm text-slate-600 rounded-xl hover:bg-slate-50 hover:text-brand-blue focus:outline-none focus:bg-slate-50 transition-colors"
                    >
                      <i className="fa-solid fa-list w-4 text-center text-slate-400" aria-hidden="true" />
                      Listed Items
                    </button>
                  </div>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={handleLogout}
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-brand-orange hover:bg-brand-orange/10 transition-colors group/item"
                  >
                    <i className="fa-solid fa-right-from-bracket w-5 text-center transition-transform group-hover/item:-translate-x-1" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
