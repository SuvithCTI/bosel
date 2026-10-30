import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import Logo from './Logo';

export default function Footer({ setActivePage, onOpenLegal }) {
  const handleNav = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const linkClass =
    'py-0.5 transition-colors duration-200 text-slate-300 hover:text-amber-400 cursor-pointer truncate';

  return (
    <footer className="border-t-2 border-amber-400 bg-[#0A1B36] pt-5 pb-3 text-slate-200 sm:pt-7 sm:pb-4">
      <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-8">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-5 border-b border-slate-700/80 pb-4 sm:gap-6 sm:pb-5 md:grid-cols-3 md:gap-8">

          {/* Brand Information */}
          <div className="space-y-2">
            <div className="inline-block">
              <Logo size="small" lightText={true} />
            </div>

            <p className="max-w-md text-justify [text-align-last:left] text-[11px] leading-relaxed text-slate-300 sm:text-xs">
  Board of Skills and Educational Learning (B★SEL) is an autonomous educational initiative empowering students with cognitive development, life skills, and competitive excellence.
</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-2 border-l-2 border-amber-400 pl-2 text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
              Quick Links
            </h4>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] sm:text-xs md:grid-cols-1 md:gap-y-1">
              <li>
                <button type="button" onClick={() => handleNav('home')} className={linkClass}>
                  Home
                </button>
              </li>

              <li>
                <button type="button" onClick={() => handleNav('about')} className={linkClass}>
                  About Us
                </button>
              </li>

              <li>
                <button type="button" onClick={() => handleNav('programs')} className={linkClass}>
                  Programs
                </button>
              </li>

              <li>
                <button type="button" onClick={() => handleNav('events')} className={linkClass}>
                  Events
                </button>
              </li>

              <li>
                <button type="button" onClick={() => handleNav('achievements')} className={linkClass}>
                  Achievements
                </button>
              </li>

              <li>
                <button type="button" onClick={() => handleNav('franchise')} className={linkClass}>
                  Franchise
                </button>
              </li>

              <li>
                <button type="button" onClick={() => handleNav('certificate')} className={linkClass}>
                  Certificates
                </button>
              </li>

              <li>
                <button type="button" onClick={() => handleNav('contact')} className={linkClass}>
                  Contact Us
                </button>
              </li>

              <li className="col-span-2 md:col-span-1">
                <button type="button" onClick={() => handleNav('login')} className={linkClass}>
                  Student Login
                </button>
              </li>
            </ul>
          </div>

          {/* Secretariat Contact Details */}
          <div>
            <h4 className="mb-2 border-l-2 border-amber-400 pl-2 text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
              Secretariat
            </h4>

            <ul className="space-y-2 text-[11px] font-medium text-slate-200 sm:text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                <span>
                  No. 42, Skill Tower, Gandhi Salai, T. Nagar, Chennai - 600017
                </span>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                <a href="tel:+919876543210" className="transition-colors hover:text-amber-300">
                  +91 9876543210
                </a>
              </li>

              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <a
                  href="mailto:contact@besellearning.org"
                  className="break-all transition-colors hover:text-amber-300"
                >
                  contact@besellearning.org
                </a>
              </li>
            </ul>

            {/* Helpline Hours */}
            <div className="mt-3 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-[10px] text-slate-300 sm:text-xs">
              <span className="font-bold text-amber-300">Helpline Hours: </span>
              Mon - Sat: 9:00 AM - 6:30 PM (IST)
            </div>
          </div>
        </div>

        {/* Copyright and Legal Links */}
        <div className="flex flex-col items-center justify-between gap-2 pt-3 text-center text-[10px] font-medium text-slate-400 sm:flex-row sm:pt-4 sm:text-left sm:text-xs">
          <p>© 2026-2027 B★SEL Board. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              className="font-bold transition-colors hover:text-amber-400"
              onClick={() =>
                onOpenLegal ? onOpenLegal('privacy') : handleNav('privacy')
              }
            >
              Privacy
            </button>

            <span className="text-slate-600">•</span>

            <button
              type="button"
              className="font-bold transition-colors hover:text-amber-400"
              onClick={() =>
                onOpenLegal ? onOpenLegal('terms') : handleNav('terms')
              }
            >
              Terms
            </button>

            <span className="text-slate-600">•</span>

            <button
              type="button"
              className="font-bold transition-colors hover:text-amber-400"
              onClick={() => handleNav('franchise')}
            >
              Franchise
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}