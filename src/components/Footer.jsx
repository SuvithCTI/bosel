import React from 'react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import Logo from './Logo';

export default function Footer({ setActivePage }) {
  const handleNav = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A1B36] text-slate-200 pt-6 sm:pt-16 pb-5 sm:pb-8 border-t-2 sm:border-t-4 border-amber-400">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Main Footer Grid: Compact on mobile, spacious on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-10 pb-4 sm:pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-2 sm:space-y-4">
            <div className="inline-block">
              <Logo size="small" lightText={true} />
            </div>
            <p className="text-[11px] sm:text-sm text-slate-300 font-normal leading-relaxed line-clamp-2 sm:line-clamp-none">
              Board of Skills and Educational Learning (B★SEL) is an autonomous educational initiative empowering students with cognitive development, life skills, and competitive excellence.
            </p>
          </div>

          {/* Quick Links: 2 columns on mobile for compact height, 1 column on desktop */}
          <div>
            <h4 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 sm:mb-4 border-l-2 border-amber-400 pl-2">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-2 gap-y-1 sm:space-y-2 text-[11px] sm:text-xs">
              <li>
                <button 
                  type="button"
                  onClick={() => handleNav('home')} 
                  className="hover:text-amber-400 py-0.5 sm:py-1 transition flex items-center gap-1 cursor-pointer text-slate-300 hover:text-white truncate"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => handleNav('events')} 
                  className="hover:text-amber-400 py-0.5 sm:py-1 transition flex items-center gap-1 cursor-pointer text-slate-300 hover:text-white truncate"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span>Events</span>
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => handleNav('certificate')} 
                  className="hover:text-amber-400 py-0.5 sm:py-1 transition flex items-center gap-1 cursor-pointer text-slate-300 hover:text-white truncate"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span>Certificates</span>
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => handleNav('contact')} 
                  className="hover:text-amber-400 py-0.5 sm:py-1 transition flex items-center gap-1 cursor-pointer text-slate-300 hover:text-white truncate"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span>Admission</span>
                </button>
              </li>
              <li className="col-span-2 md:col-span-1">
                <button 
                  type="button"
                  onClick={() => handleNav('login')} 
                  className="hover:text-amber-400 py-0.5 sm:py-1 transition flex items-center gap-1 cursor-pointer text-slate-300 hover:text-white truncate"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span>Student Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 sm:mb-4 border-l-2 border-amber-400 pl-2">
              Secretariat
            </h4>
            <ul className="space-y-1.5 sm:space-y-3 text-[11px] sm:text-xs text-slate-200 font-medium">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2 sm:line-clamp-none">
                  No. 42, Skill Tower, Gandhi Salai, T. Nagar, Chennai - 600017
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-amber-300 transition">+91 9876543210</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="mailto:contact@besellearning.org" className="hover:text-amber-300 transition">contact@besellearning.org</a>
              </li>
            </ul>

            <div className="mt-2 sm:mt-3.5 p-2 sm:p-3 bg-slate-800/80 rounded-lg sm:rounded-xl border border-slate-700 text-[10px] sm:text-xs text-slate-300">
              <span className="text-amber-300 font-bold">Helpline Hours: </span>
              Mon - Sat: 9:00 AM - 6:30 PM (IST)
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-3 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-400 font-medium text-center sm:text-left">
          <p>© 2026-2027 B★SEL Board. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            <button type="button" className="hover:text-amber-400 font-bold cursor-pointer transition" onClick={() => handleNav('privacy')}>Privacy</button>
            <span>•</span>
            <button type="button" className="hover:text-amber-400 font-bold cursor-pointer transition" onClick={() => handleNav('terms')}>Terms</button>
            <span>•</span>
            <button type="button" className="hover:text-amber-400 font-bold cursor-pointer transition" onClick={() => handleNav('contact')}>Franchise</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
