import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import PageContainer from '@/components/ui/PageContainer';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  subscribeNotifications,
} from '@/services/notifications';

const TYPE_CONFIG = {
  CHANGES_REQUIRED: { variant: 'warning', icon: 'fa-pen-to-square', label: 'Changes Required' },
  APPROVED: { variant: 'blue', icon: 'fa-circle-check', label: 'Approved' },
  SUBMITTED: { variant: 'pending', icon: 'fa-clock', label: 'Pending Approval' },
  RESUBMITTED: { variant: 'pending', icon: 'fa-rotate-left', label: 'Resubmitted' },
  CANCELLED: { variant: 'danger', icon: 'fa-ban', label: 'Cancelled' },
};

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetchNotifications()
        .then((list) => {
          if (!cancelled) setNotifications(list);
        })
        .catch(() => {});
    };
    load();
    const unsubscribe = subscribeNotifications(load);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    if (filter === 'read') return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, filter]);

  const handleMarkAsRead = (id) => {
    markNotificationRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsRead(notifications);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
    if (notification.listingId) {
      navigate(`/listings/${notification.listingId}`);
    }
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on your listing activity and admin actions"
        action={
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-1.5">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm font-semibold text-slate-700 bg-transparent outline-none cursor-pointer appearance-none"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <i className="fa-solid fa-check-double text-xs" /> Mark all as read
              </button>
            )}
          </div>
        }
      />

      {/* Summary Card */}
      <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-card animate-fade-in">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-brand-gold to-brand-gold/70 flex items-center justify-center text-white shadow-sm shrink-0">
          <i className="fa-solid fa-bell" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-700">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'You are all caught up'}
          </p>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            Notifications about listing updates, approvals, and admin actions will appear here.
            Manage preferences from <Link to="/profile" className="text-brand-blue hover:underline font-semibold">Profile Settings</Link>.
          </p>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((n, i) => {
            const typeConfig = TYPE_CONFIG[n.type];
            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNotificationClick(n);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`flex items-start gap-4 bg-white rounded-2xl border p-5 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer opacity-0 animate-fade-in-up focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                  !n.read ? 'border-brand-blue/25 ring-1 ring-brand-blue/10' : 'border-slate-100'
                }`}
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
              >
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${n.gradient} flex items-center justify-center text-white shadow-sm shrink-0`}>
                  <i className={`fa-solid ${n.icon}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">{n.title}</h3>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-brand-blue shrink-0" aria-label="Unread notification" />
                    )}
                    <Badge variant={typeConfig.variant} icon={typeConfig.icon} className="text-[10px] px-2 py-1">
                      {typeConfig.label}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-1">{n.message}</p>
                  <p className="text-xs font-semibold text-slate-400 mt-2 flex items-center gap-1.5">
                    <i className="fa-regular fa-clock" aria-hidden="true" />
                    {n.time}
                  </p>
                </div>
                {!n.read && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }}
                    className="shrink-0 w-9 h-9 rounded-xl text-slate-400 hover:text-brand-blue hover:bg-slate-50 flex items-center justify-center transition-colors"
                    aria-label="Mark as read"
                  >
                    <i className="fa-solid fa-check text-sm" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="fa-bell-slash"
          title="No notifications"
          subtitle={filter === 'unread' ? 'No unread notifications. You are all caught up!' : 'No notifications yet. When buyers enquire or your account status changes, updates will show up here.'}
        />
      )}
    </PageContainer>
  );
}

export default Notifications;