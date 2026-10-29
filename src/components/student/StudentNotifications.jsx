
import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BookOpen,
  CalendarDays,
  Award,
  FileText,
  CheckCircle2,
  Circle,
  CheckCheck,
  Clock,
  Info,
  BellRing,
} from 'lucide-react';

const NOTIFICATION_STORAGE_KEY = 'bsel_notifications';

const sampleNotifications = [
  {
    id: 'welcome-course-update',
    title: 'Welcome to your student portal',
    message:
      'Your student dashboard is ready. Check My Course for your registration information and visit this section for future announcements.',
    category: 'General',
    createdAt: '2026-10-29T09:00:00.000Z',
    read: false,
    targetUserId: null,
    targetCourse: null,
  },
  {
    id: 'sample-exam-notice',
    title: 'Examination updates',
    message:
      'Please check your registered examination details regularly. Examination dates and hall-ticket information will appear when published.',
    category: 'Examination',
    createdAt: '2026-10-28T09:00:00.000Z',
    read: false,
    targetUserId: null,
    targetCourse: null,
  },
];

const categoryConfig = {
  Course: {
    icon: BookOpen,
    iconClass: 'bg-blue-100 text-blue-800',
    badgeClass: 'bg-blue-50 text-blue-800',
  },
  Examination: {
    icon: CalendarDays,
    iconClass: 'bg-violet-100 text-violet-800',
    badgeClass: 'bg-violet-50 text-violet-800',
  },
  Results: {
    icon: Award,
    iconClass: 'bg-amber-100 text-amber-800',
    badgeClass: 'bg-amber-50 text-amber-800',
  },
  Registration: {
    icon: FileText,
    iconClass: 'bg-sky-100 text-sky-800',
    badgeClass: 'bg-sky-50 text-sky-800',
  },
  General: {
    icon: Info,
    iconClass: 'bg-slate-100 text-slate-700',
    badgeClass: 'bg-slate-100 text-slate-700',
  },
};

function readNotifications() {
  try {
    const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        const storedIds = new Set(parsed.map((item) => item.id));

        return [
          ...parsed,
          ...sampleNotifications.filter(
            (item) => !storedIds.has(item.id)
          ),
        ];
      }
    }
  } catch (error) {
    console.error('Unable to read notifications:', error);
  }

  return sampleNotifications;
}

function formatNotificationDate(value) {
  if (!value) return 'Date unavailable';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function StudentNotifications({ student }) {
  const [notifications, setNotifications] = useState(readNotifications);
  const [filter, setFilter] = useState('all');

  const studentId = student?.id || student?.userId || '';
  const courseName = student?.program || student?.course || '';

  useEffect(() => {
    const syncNotifications = () => {
      setNotifications(readNotifications());
    };

    window.addEventListener('storage', syncNotifications);
    window.addEventListener(
      'bsel_notifications_changed',
      syncNotifications
    );

    return () => {
      window.removeEventListener('storage', syncNotifications);
      window.removeEventListener(
        'bsel_notifications_changed',
        syncNotifications
      );
    };
  }, []);

  const relevantNotifications = useMemo(() => {
    return notifications
      .filter((notification) => {
        const matchesStudent =
          !notification.targetUserId ||
          String(notification.targetUserId) === String(studentId);

        const matchesCourse =
          !notification.targetCourse ||
          !courseName ||
          String(notification.targetCourse).toLowerCase() ===
            String(courseName).toLowerCase();

        return matchesStudent && matchesCourse;
      })
      .sort((a, b) => {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      });
  }, [notifications, studentId, courseName]);

  const unreadCount = relevantNotifications.filter(
    (notification) => !notification.read
  ).length;

  const visibleNotifications = relevantNotifications.filter(
    (notification) => {
      if (filter === 'unread') return !notification.read;
      if (filter === 'read') return notification.read;
      return true;
    }
  );

  const persistNotifications = (updatedNotifications) => {
    try {
      localStorage.setItem(
        NOTIFICATION_STORAGE_KEY,
        JSON.stringify(updatedNotifications)
      );

      setNotifications(updatedNotifications);

      window.dispatchEvent(
        new Event('bsel_notifications_changed')
      );
    } catch (error) {
      console.error('Unable to save notifications:', error);
    }
  };

  const markAsRead = (notificationId) => {
    const updated = notifications.map((notification) => {
      if (notification.id !== notificationId) return notification;

      return { ...notification, read: true };
    });

    persistNotifications(updated);
  };

  const markAllAsRead = () => {
    const visibleIds = new Set(
      relevantNotifications.map((notification) => notification.id)
    );

    const updated = notifications.map((notification) => {
      if (!visibleIds.has(notification.id)) return notification;

      return { ...notification, read: true };
    });

    persistNotifications(updated);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] sm:tracking-[0.18em] text-amber-600">
            Stay informed
          </p>

          <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-black tracking-tight text-blue-950">
            Notifications
          </h2>

          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-500">
            View course announcements, examination updates, and important
            messages.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 self-start rounded-lg sm:rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-blue-950 transition hover:bg-blue-50"
          >
            <CheckCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Summary banner */}
      <section className="overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0F2B5C] to-[#1E4D99] p-4 sm:p-7 text-white shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-white/10">
            <BellRing className="h-5 w-5 sm:h-7 sm:w-7 text-amber-300" />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] sm:text-[10px] font-black text-blue-950">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-black">
              {unreadCount} unread
            </p>

            <p className="mt-1 text-xs sm:text-sm leading-5 sm:leading-normal text-blue-100">
              {unreadCount === 1
                ? 'You have one notification to review.'
                : 'Keep up with the latest updates for your account.'}
            </p>
          </div>
        </div>
      </section>

      {/* Filters and notification list */}
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3 sm:p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All notifications' },
            { id: 'unread', label: 'Unread' },
            { id: 'read', label: 'Read' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold transition ${
                filter === item.id
                  ? 'bg-blue-950 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}

              {item.id === 'unread' && unreadCount > 0 && (
                <span className="ml-1.5 sm:ml-2 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] sm:text-[10px] text-blue-950">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="mt-4 sm:mt-5 space-y-3">
          {visibleNotifications.length > 0 ? (
            visibleNotifications.map((notification) => {
              const category =
                categoryConfig[notification.category] ||
                categoryConfig.General;

              const Icon = category.icon;

              return (
                <article
                  key={notification.id}
                  className={`rounded-xl sm:rounded-2xl border p-3 sm:p-5 transition ${
                    notification.read
                      ? 'border-slate-200 bg-white'
                      : 'border-blue-200 bg-blue-50/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5 sm:gap-4">
                    <div
                      className={`flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl ${category.iconClass}`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h3 className="break-words text-xs sm:text-sm font-extrabold leading-5 sm:leading-normal text-slate-900">
                          {notification.title}
                        </h3>

                        {!notification.read && (
                          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-700" />
                        )}
                      </div>

                      <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold ${category.badgeClass}`}
                        >
                          {notification.category || 'General'}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] leading-4 text-slate-500">
                          <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                          {formatNotificationDate(notification.createdAt)}
                        </span>
                      </div>

                      <p className="mt-2 sm:mt-3 whitespace-pre-line text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
                        {notification.message}
                      </p>

                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notification.id)}
                          className="mt-2.5 sm:mt-3 inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-extrabold text-blue-900 hover:text-blue-700"
                        >
                          <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          Mark as read
                        </button>
                      )}
                    </div>

                    <div className="hidden shrink-0 pt-1 sm:block">
                      {notification.read ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Circle className="h-4 w-4 fill-blue-100 text-blue-700" />
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-xl sm:rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 sm:px-5 py-9 sm:py-12 text-center">
              <Bell className="mx-auto h-7 w-7 sm:h-9 sm:w-9 text-slate-400" />

              <h3 className="mt-3 text-xs sm:text-sm font-extrabold text-slate-800">
                {filter === 'unread'
                  ? 'You are all caught up!'
                  : filter === 'read'
                    ? 'No read notifications'
                    : 'No notifications yet'}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-[11px] sm:text-xs leading-5 text-slate-500">
                {filter === 'unread'
                  ? 'You have no unread notifications at the moment.'
                  : 'New announcements and updates relevant to your account will appear here.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
