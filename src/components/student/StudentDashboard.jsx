import React, { useMemo, useState, useEffect } from 'react';

import {
  UserRound,
  Bell,
  LogOut,
  ChevronRight,
  ChevronDown,
  CheckCheck,
  BellRing,
  Clock,
  Menu,
  X,
  Award,
  BookOpen,
} from 'lucide-react';

import StudentCourse from './StudentCourse';
import StudentProfile from './StudentProfile';
import StudentNotifications from './StudentNotifications';

const navigationItems = [
 
];

const NOTIFICATION_STORAGE_KEY = 'bsel_notifications';

export default function StudentDashboard({
  student,
  onLogout,
  onUpdateStudent,
  onViewCertificate,
}) {
  const [activeSection, setActiveSection] = useState('course');

  const [notificationMenuOpen, setNotificationMenuOpen] =
    useState(false);

  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);

  const [profilePopupOpen, setProfilePopupOpen] =
    useState(false);

  const [certificatePopupOpen, setCertificatePopupOpen] =
    useState(false);

  const [notificationPopupOpen, setNotificationPopupOpen] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [notifications, setNotifications] = useState([]);

  const displayName =
    student?.name || student?.studentName || 'Student';

  const studentId =
    student?.id || student?.userId || 'Not assigned';

  const initials = useMemo(
    () =>
      displayName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase(),
    [displayName]
  );

  // Load notifications.
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const saved = localStorage.getItem(
          NOTIFICATION_STORAGE_KEY
        );

        const parsed = saved ? JSON.parse(saved) : [];

        setNotifications(
          Array.isArray(parsed) ? parsed : []
        );
      } catch (error) {
        console.error(
          'Unable to load notifications:',
          error
        );

        setNotifications([]);
      }
    };

    loadNotifications();

    window.addEventListener('storage', loadNotifications);

    window.addEventListener(
      'bsel_notifications_changed',
      loadNotifications
    );

    return () => {
      window.removeEventListener(
        'storage',
        loadNotifications
      );

      window.removeEventListener(
        'bsel_notifications_changed',
        loadNotifications
      );
    };
  }, []);

  // Filter notifications for the logged-in student.
  const studentNotifications = useMemo(() => {
    const currentStudentId = String(
      student?.userId || student?.id || ''
    ).toLowerCase();

    const currentCourse = String(
      student?.program || student?.course || ''
    ).toLowerCase();

    return notifications.filter((notification) => {
      const targetUserId = String(
        notification.targetUserId || ''
      ).toLowerCase();

      const targetCourse = String(
        notification.targetCourse || ''
      ).toLowerCase();

      return (
        (!targetUserId ||
          targetUserId === currentStudentId) &&
        (!targetCourse ||
          targetCourse === currentCourse)
      );
    });
  }, [notifications, student]);

  const unreadCount = studentNotifications.filter(
    (notification) => !notification.read
  ).length;

  const selectSection = (section) => {
    setActiveSection(section);
    setNotificationMenuOpen(false);
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  };

  // Notifications open in a modal.
  const openNotifications = () => {
    setNotificationMenuOpen(false);
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    setNotificationPopupOpen(true);
  };

  const closeNotificationsPopup = () => {
    setNotificationPopupOpen(false);
  };

  const openProfilePopup = () => {
    setProfileMenuOpen(false);
    setNotificationMenuOpen(false);
    setMobileMenuOpen(false);
    setProfilePopupOpen(true);
  };

  const closeProfilePopup = () => {
    setProfilePopupOpen(false);
  };

  const openCertificates = () => {
    setProfileMenuOpen(false);
    setNotificationMenuOpen(false);
    setMobileMenuOpen(false);
    setCertificatePopupOpen(true);
  };

  const closeCertificatesPopup = () => {
    setCertificatePopupOpen(false);
  };

  // Update a notification's read status.
  const saveNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);

    try {
      localStorage.setItem(
        NOTIFICATION_STORAGE_KEY,
        JSON.stringify(updatedNotifications)
      );

      window.dispatchEvent(
        new Event('bsel_notifications_changed')
      );
    } catch (error) {
      console.error(
        'Unable to update notifications:',
        error
      );
    }
  };

  const handleNotificationClick = (notification) => {
    const updatedNotifications = notifications.map(
      (item) =>
        item.id === notification.id
          ? { ...item, read: true }
          : item
    );

    saveNotifications(updatedNotifications);
    openNotifications();
  };

  const handleMarkAllRead = () => {
    const studentNotificationIds = new Set(
      studentNotifications.map(
        (notification) => notification.id
      )
    );

    const updatedNotifications = notifications.map(
      (notification) =>
        studentNotificationIds.has(notification.id)
          ? { ...notification, read: true }
          : notification
    );

    saveNotifications(updatedNotifications);
  };

  const getNavigationClass = (isActive) =>
    `inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition lg:px-4 ${
      isActive
        ? 'bg-blue-950 text-white shadow-md shadow-blue-950/10'
        : 'text-slate-600 hover:bg-blue-50 hover:text-blue-950'
    }`;

  const renderSection = () => {
    switch (activeSection) {
      case 'course':
      default:
        return (
          <StudentCourse
            student={student}
            onViewCertificate={onViewCertificate}
          />
        );
    }
  };

  const renderNavigationItems = (mobile = false) =>
    navigationItems.map((item) => {
      const Icon = item.icon;
      const isActive = activeSection === item.id;

      return (
        <button
          key={item.id}
          type="button"
          onClick={() => selectSection(item.id)}
          aria-current={isActive ? 'page' : undefined}
          className={
            mobile
              ? `flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-bold transition ${
                  isActive
                    ? 'bg-blue-950 text-white shadow-md'
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-950'
                }`
              : getNavigationClass(isActive)
          }
        >
          <Icon
            className={`h-5 w-5 shrink-0 ${
              isActive
                ? 'text-amber-400'
                : 'text-slate-400'
            }`}
          />

          <span>{item.label}</span>

          {mobile && isActive && (
            <ChevronRight className="ml-auto h-4 w-4 text-amber-400" />
          )}
        </button>
      );
    });

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 lg:px-8">
          {/* LOGO */}
          <div className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white sm:h-11 sm:w-11">
              <img
                src="/bsel_logo.jpg"
                alt="B★SEL Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-base font-black tracking-tight text-blue-950 sm:text-xl">
                B★SEL
              </h1>

              <p className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:block">
                Student Learning Portal
              </p>
            </div>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav
            aria-label="Student navigation"
            className="hidden items-center gap-2 md:flex"
          >
            {renderNavigationItems()}
          </nav>

          {/* HEADER ACTIONS */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <div className="hidden border-r border-slate-200 pr-3 text-right lg:block">
              <p className="max-w-36 truncate text-sm font-bold text-slate-900">
                {displayName}
              </p>

              <p className="text-xs text-slate-500">
                ID: {studentId}
              </p>
            </div>

            {/* NOTIFICATIONS DROPDOWN */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setNotificationMenuOpen((previous) => !previous);
                  setProfileMenuOpen(false);
                  setMobileMenuOpen(false);
                }}
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition sm:h-10 sm:w-10 ${
                  notificationMenuOpen
                    ? 'border-blue-200 bg-blue-50 text-blue-950'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-950'
                }`}
                aria-label={`Notifications, ${unreadCount} unread`}
                aria-expanded={notificationMenuOpen}
              >
                <Bell className="h-5 w-5" />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-600 px-1 text-[9px] font-black text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close notification menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setNotificationMenuOpen(false)}
                  />

                  <div className="fixed right-3 top-[65px] z-50 w-[calc(100vw-24px)] max-w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:absolute sm:right-0 sm:top-12 sm:w-96">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4">
                      <div>
                        <h3 className="text-sm font-black text-blue-950">
                          Notifications
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {unreadCount > 0
                            ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                            : 'You are all caught up'}
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-950">
                        <BellRing className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="max-h-[55vh] overflow-y-auto">
                      {studentNotifications.length > 0 ? (
                        studentNotifications
                          .slice()
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt || 0).getTime() -
                              new Date(a.createdAt || 0).getTime()
                          )
                          .slice(0, 5)
                          .map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition hover:bg-blue-50 ${
                                !notification.read
                                  ? 'bg-blue-50/60'
                                  : 'bg-white'
                              }`}
                            >
                              <div
                                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                  notification.read
                                    ? 'bg-slate-100 text-slate-500'
                                    : 'bg-amber-100 text-blue-950'
                                }`}
                              >
                                <Bell className="h-4 w-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-extrabold text-slate-900">
                                    {notification.title || 'B★SEL Update'}
                                  </p>

                                  {!notification.read && (
                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-700" />
                                  )}
                                </div>

                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                                  {notification.message ||
                                    notification.description ||
                                    'You have a new notification.'}
                                </p>

                                {notification.createdAt && (
                                  <p className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
                                    <Clock className="h-3 w-3" />

                                    {Number.isNaN(
                                      new Date(notification.createdAt).getTime()
                                    )
                                      ? ''
                                      : new Date(
                                          notification.createdAt
                                        ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </button>
                          ))
                      ) : (
                        <div className="px-4 py-9 text-center">
                          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <Bell className="h-5 w-5" />
                          </div>

                          <p className="mt-3 text-sm font-bold text-slate-700">
                            No notifications yet
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Course updates and announcements will appear here.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 border-t border-slate-100 p-3">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-blue-950"
                        >
                          <CheckCheck className="h-4 w-4" />
                          Mark all as read
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={openNotifications}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-3 py-3 text-xs font-extrabold text-white transition hover:bg-blue-800"
                      >
                        View all notifications
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* PROFILE DROPDOWN */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((previous) => !previous);
                  setNotificationMenuOpen(false);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-1.5 py-1.5 transition sm:gap-2 sm:px-3 ${
                  profileMenuOpen
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-slate-200 bg-white hover:bg-blue-50'
                }`}
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-blue-950 ring-2 ring-amber-200 sm:h-9 sm:w-9">
                  {initials || 'S'}
                </div>

                <span className="hidden text-sm font-bold text-blue-950 sm:block">
                  Profile
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform ${
                    profileMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:w-60">
                    <div className="border-b border-slate-100 px-3 py-3">
                      <p className="truncate text-sm font-extrabold text-blue-950">
                        {displayName}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        Student ID: {studentId}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={openProfilePopup}
                      className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-950"
                    >
                      <UserRound className="h-5 w-5 text-blue-800" />
                      <span>My Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={openCertificates}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-amber-50 hover:text-blue-950"
                    >
                      <Award className="h-5 w-5 text-amber-600" />
                      <span>Certificates</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onLogout?.();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((previous) => !previous);
                setNotificationMenuOpen(false);
                setProfileMenuOpen(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-blue-50 md:hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 top-[65px] z-40 bg-slate-950/20 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="absolute left-0 right-0 top-full z-50 border-t border-slate-200 bg-white p-4 shadow-xl md:hidden">
              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-black text-blue-950 ring-2 ring-amber-200">
                  {initials || 'S'}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-blue-950">
                    {displayName}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    Student ID: {studentId}
                  </p>
                </div>
              </div>

              <p className="mb-2 px-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                Student Navigation
              </p>

              <nav
                aria-label="Mobile student navigation"
                className="space-y-1.5"
              >
                {renderNavigationItems(true)}
              </nav>

              <button
                type="button"
                onClick={openNotifications}
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-950"
              >
                <span className="relative">
                  <Bell className="h-5 w-5" />

                  {unreadCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-black text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </span>

                <span>Notifications</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={openProfilePopup}
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-950"
              >
                <UserRound className="h-5 w-5" />
                <span>My Profile</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={openCertificates}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-bold text-slate-700 transition hover:bg-amber-50 hover:text-blue-950"
              >
                <Award className="h-5 w-5 text-amber-600" />
                <span>Certificates</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout?.();
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </>
        )}
      </header>

      {/* DASHBOARD CONTENT */}
      <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <section className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F2B5C] via-[#143B7A] to-[#1E4D99] p-4 text-white shadow-lg sm:mb-6 sm:rounded-3xl sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border-[30px] border-white/5" />

          <div className="pointer-events-none absolute -bottom-24 right-32 h-52 w-52 rounded-full bg-amber-400/10 blur-2xl" />

          <div className="relative">
            <h2 className="mt-3 text-xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              Welcome back, {displayName.split(' ')[0]}!
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-blue-100 sm:text-sm sm:leading-6 lg:text-base">
              Manage your registered course, keep your profile updated,
              and stay informed about important B★SEL announcements.
            </p>
          </div>
        </section>

        <main className="min-w-0">{renderSection()}</main>

        <footer className="mt-6 border-t border-slate-200 py-4 text-center text-[10px] text-slate-500 sm:mt-8 sm:py-5 sm:text-xs">
          © {new Date().getFullYear()} B★SEL Learning Platform. All rights reserved.
        </footer>
      </div>

      {/* MY PROFILE POPUP */}
      {profilePopupOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          onClick={closeProfilePopup}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-profile-title"
            className="relative flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-slate-50 shadow-2xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <h2
                  id="student-profile-title"
                  className="text-lg font-black text-blue-950 sm:text-xl"
                >
                  My Profile
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  View and update your student information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeProfilePopup}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
                aria-label="Close profile popup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
              <StudentProfile
                student={student}
                onUpdateStudent={onUpdateStudent}
              />
            </div>
          </div>
        </div>
      )}
      
{/* RESULTS & CERTIFICATES POPUP */}

{/* RESULTS & CERTIFICATES POPUP */}
{certificatePopupOpen && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-950/70 p-2 backdrop-blur-sm sm:p-4"
    onClick={closeCertificatesPopup}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-certificates-title"
      className="relative flex max-h-[65vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-slate-50 shadow-2xl sm:max-h-[60vh] sm:rounded-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      {/* COMPACT HEADER */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-2 sm:px-5 sm:py-2.5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 sm:h-9 sm:w-9">
            <Award className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          <div className="min-w-0">
            <h2
              id="student-certificates-title"
              className="text-sm font-black text-blue-950 sm:text-base"
            >
              Results & Certificates
            </h2>

            <p className="hidden text-[11px] text-slate-500 sm:block">
              View your published examination results and certificates.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={closeCertificatesPopup}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
          aria-label="Close certificates popup"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* COMPACT SCROLLABLE CONTENT */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 sm:p-3">
        {Array.isArray(student?.results) &&
        student.results.length > 0 ? (
          <div className="space-y-2">
            {student.results.map((result, index) => (
              <div
                key={result.id || `${result.exam || 'result'}-${index}`}
                className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-white p-2.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-sm font-extrabold text-slate-900">
                    {result.exam || 'Examination Result'}
                  </h3>

                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-600">
                    <span>
                      Score:{' '}
                      <strong className="text-slate-900">
                        {result.score ?? 'Pending'}
                      </strong>
                    </span>

                    <span>
                      Rank:{' '}
                      <strong className="text-slate-900">
                        {result.rank ?? 'Pending'}
                      </strong>
                    </span>

                    {result.certificateNo && (
                      <span className="min-w-0">
                        Certificate:{' '}
                        <strong className="break-all font-mono text-slate-800">
                          {result.certificateNo}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>

                {result.certificateNo && (
                  <button
                    type="button"
                    onClick={() => {
                      const certificateData = {
                        studentName:
                          student?.name ||
                          student?.studentName ||
                          'Student',
                        courseName:
                          student?.program ||
                          student?.course ||
                          'Abacus Speed Math (Level 4) & Fine Arts',
                        level:
                          student?.level || 'As per registration',
                        grade: result.grade || 'A+',
                        certificateNo: result.certificateNo,
                        centreName:
                          student?.institution || 'Not specified',
                      };

                      closeCertificatesPopup();

                      window.requestAnimationFrame(() => {
                        onViewCertificate?.(certificateData);
                      });
                    }}
                    className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-xs font-extrabold text-slate-950 transition hover:bg-amber-500 sm:w-auto"
                  >
                    <Award className="h-4 w-4" />
                    View Certificate
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-amber-200 bg-amber-50/50 px-4 py-5 text-center">
            <Award className="h-7 w-7 text-amber-500" />

            <h3 className="mt-2 text-sm font-extrabold text-slate-800">
              Results not published yet
            </h3>

            <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-slate-500">
              Your examination results and certificates will appear here
              after they are published for your registered examinations.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
)}



      {/* NOTIFICATIONS POPUP */}
      {notificationPopupOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          onClick={closeNotificationsPopup}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-notifications-title"
            className="relative flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-slate-50 shadow-2xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-950">
                  <BellRing className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h2
                    id="student-notifications-title"
                    className="text-lg font-black text-blue-950 sm:text-xl"
                  >
                    Notifications
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    View course updates and important announcements.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeNotificationsPopup}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
                aria-label="Close notifications popup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
              <StudentNotifications student={student} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
