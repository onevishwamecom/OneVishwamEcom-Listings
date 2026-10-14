import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authSlice";
import logo from "../assets/logo.png";
import logo2 from "../assets/Logo2.png";
import { confirmLogout } from "../utils/logout";

const menuItems = [
  { label: "Dashboard", icon: "fa-gauge-high", href: "/" },
  { label: "Listed Items", icon: "fa-list", href: "/listings" },
  { label: "List New Product", icon: "fa-plus", href: "/add-listing" },
  { label: "Notifications", icon: "fa-bell", href: "/notifications" },
  { label: "Profile", icon: "fa-user", href: "/profile" },
];

function Sidebar({ collapsed = false, onToggleCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = user?.fullName || "User";

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === href;
  };

  const handleLogout = () => confirmLogout({ logout, navigate });

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* ── Brand Header ── */}
      <div
        className={`flex items-center ${collapsed ? "justify-center px-2" : "justify-between px-5"} py-5 border-b border-white/[0.06]`}
      >
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logo} alt="OneVishwam Logo" className="h-10 w-auto object-contain" />
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="flex items-center justify-center group">
            <img src={logo2} alt="OneVishwam Logo" className="h-10 w-auto max-w-[50px] object-contain" />
          </Link>
        )}
        {!collapsed && (
          <button
            onClick={() => onToggleCollapse && onToggleCollapse(true)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-slate-200 transition-colors"
            aria-label="Collapse sidebar"
          >
            <i
              className="fa-solid fa-chevron-left text-xs"
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* ── Expand Button (collapsed mode) ── */}
      {collapsed && (
        <button
          onClick={() => onToggleCollapse && onToggleCollapse(false)}
          className="mx-auto mt-3 rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-slate-200 transition-colors"
          aria-label="Expand sidebar"
        >
          <i className="fa-solid fa-chevron-right text-xs" aria-hidden="true" />
        </button>
      )}

      {/* ── Navigation ── */}
      <nav className={`flex-1 py-4 ${collapsed ? "px-1.5" : "px-3"} space-y-1`}>
        {menuItems.map((item) => {
          const linkActive = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 rounded-xl transition-all duration-200 ${
                collapsed ? "justify-center px-2 py-3" : "px-4 py-3"
              } ${
                linkActive
                  ? "bg-brand-blue/20 text-white font-semibold sidebar-active-glow"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              }`}
              title={collapsed ? item.label : undefined}
              aria-current={linkActive ? "page" : undefined}
            >
              <i
                className={`fa-solid ${item.icon} text-base ${
                  linkActive ? "text-brand-blue" : "text-slate-400"
                }`}
                aria-hidden="true"
              />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {linkActive && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(37,99,235,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User Section ── */}
      <div
        className={`border-t border-white/[0.06] ${collapsed ? "p-2" : "p-3"}`}
      >
        {!collapsed && (
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue/80 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-brand-gold border-2 border-brand-navy" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">
                {displayName}
              </p>
              {user?.email && (
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              )}
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-xl text-sm font-medium text-brand-orange hover:bg-brand-orange/20 hover:text-brand-orange transition-colors ${
            collapsed ? "justify-center px-2 py-3" : "px-4 py-2.5"
          }`}
          title="Logout"
          aria-label="Logout"
        >
          <i
            className="fa-solid fa-right-from-bracket w-5 text-center"
            aria-hidden="true"
          />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Hamburger (shown on small screens) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 flex md:hidden items-center justify-center h-10 w-10 rounded-xl bg-brand-navy text-white shadow-elevated"
        aria-label="Open navigation menu"
      >
        <i className="fa-solid fa-bars" aria-hidden="true" />
      </button>

      {/* ── Mobile Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-sidebar-gradient md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 h-8 w-8 rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close navigation menu"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
        {sidebarContent}
      </aside>

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden md:block fixed top-0 left-0 z-40 h-screen bg-sidebar-gradient transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
        aria-label="Main navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export default Sidebar;
