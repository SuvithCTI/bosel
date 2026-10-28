import React, { useState, useEffect } from 'react';
import { Menu, X, User, Phone, ArrowRight } from 'lucide-react';
import Logo from './Logo';

export default function Navbar({ activePage, setActivePage, sessionUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'programs', label: 'Programs' },
    { id: 'events', label: 'Events' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'franchise', label: 'Franchise' },
    { id: 'certificate', label: 'Certificates' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-50 shadow-md">
        {/* Main Navigation Bar */}
        <nav className="bg-[#0F2B5C] text-white px-3 sm:px-6 lg:px-10 py-2.5 sm:py-3 transition-colors">
          <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="shrink-0 max-w-[65%] sm:max-w-none">
              <Logo 
                lightText={true} 
                onClick={() => handleNavClick('home')} 
              />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'text-white bg-white/15 shadow-inner'
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-400 rounded-full" />
                    )}
                  </button>
                );
              })}

              {/* Login Profile / Portal Icon */}
              {sessionUser ? (
                <button
                  onClick={() => handleNavClick(sessionUser.role === 'Super Admin' ? 'admin' : 'login')}
                  title={`Logged in as ${sessionUser.name || sessionUser.studentName}`}
                  aria-label={`Profile: ${sessionUser.name || sessionUser.studentName}`}
                  className={`ml-2 w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm relative group cursor-pointer font-black text-sm select-none ${
                    activePage === 'login' || activePage === 'admin'
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-md scale-105'
                      : 'bg-amber-400 text-slate-950 hover:bg-amber-300 hover:scale-105 ring-2 ring-amber-400/60 shadow'
                  }`}
                >
                  <span>
                    {(sessionUser.name || sessionUser.studentName || 'U').trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="sr-only">{sessionUser.name || sessionUser.studentName}</span>
                  {/* Tooltip on hover */}
                  <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-md shadow-lg pointer-events-none whitespace-nowrap z-50">
                    {sessionUser.name || sessionUser.studentName}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick('login')}
                  title="Login Portal"
                  aria-label="Login Portal"
                  className={`ml-2 w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm relative group cursor-pointer ${
                    activePage === 'login'
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-md scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 hover:scale-105'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="sr-only">Login Portal</span>
                  {/* Tooltip on hover */}
                  <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-md shadow-lg pointer-events-none whitespace-nowrap z-50">
                    Login Portal
                  </span>
                </button>
              )}
            </div>

            {/* Mobile Controls: Quick Login & Hamburger Menu */}
            <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Mobile User Login Portal Icon */}
              <button
                type="button"
                onClick={() => handleNavClick(sessionUser?.role === 'Super Admin' ? 'admin' : 'login')}
                title={sessionUser ? `Logged in as ${sessionUser.name || sessionUser.studentName}` : 'Login Portal'}
                aria-label="Login Portal"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer ${
                  activePage === 'login' || activePage === 'admin'
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow font-black text-xs'
                    : sessionUser
                    ? 'bg-amber-400 text-slate-950 shadow font-black text-xs'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {sessionUser ? (
                  (sessionUser.name || sessionUser.studentName || 'U').charAt(0).toUpperCase()
                ) : (
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white cursor-pointer active:scale-95 transition"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-amber-400" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-start">
          {/* Dark Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu Panel */}
          <div className="relative w-full max-h-[88vh] overflow-y-auto bg-[#0A1D3D] text-white border-b-4 border-amber-400 shadow-2xl z-10 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
            {/* Top Close bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <Logo size="small" lightText={true} onClick={() => handleNavClick('home')} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 text-slate-200 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <div className="space-y-1.5 pt-1">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-base font-extrabold flex items-center justify-between transition cursor-pointer active:scale-[0.99] ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                        : 'text-slate-100 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-extrabold">{item.label}</span>
                    <ArrowRight className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Fast Action Buttons in Mobile Drawer */}
            <div className="pt-2 space-y-2.5 border-t border-white/15">
              <button
                type="button"
                onClick={() => handleNavClick('login')}
                className={`w-full py-3 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-md active:scale-[0.99] ${
                  activePage === 'login'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-sky-600 hover:bg-sky-500 text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Student & Coordinator Login</span>
              </button>
            </div>

            {/* Instant Mobile Call Support */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="text-[11px] text-slate-400">Need help? Call Secretariat:</span>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-1.5 font-bold text-amber-300 hover:underline"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 9876543210</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
