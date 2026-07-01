import React from 'react';
import { Home, Bell, User, Search, Sparkles } from 'lucide-react';
import { Profile } from '../types';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  connectionsCount: number;
  profile: Profile;
}

export default function Navbar({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  unreadMessagesCount,
  unreadNotificationsCount,
  connectionsCount,
  profile
}: NavbarProps) {
  const navItems = [
    { id: 'feed', label: 'Home', icon: Home, badge: 0 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
    { id: 'profile', label: 'Me', icon: User, badge: 0, isProfile: true }
  ];

  return (
    <header className="sticky top-0 z-40 w-full liquid-glass-navbar" id="ln-navbar">
      <div className="max-w-[95%] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between gap-6 transition-all duration-300" id="ln-navbar-container">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 shrink-0" id="ln-navbar-left">
          <button 
            onClick={() => setActiveView('feed')} 
            className="flex items-center gap-2 hover:opacity-95 transition-all duration-300 group"
            title="internAi Home"
            id="ln-logo-btn"
          >
            <div className="relative flex items-center justify-center shrink-0">
              {/* Sparkles */}
              <div className="absolute -top-1.5 -right-1.5 text-indigo-500 animate-pulse">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/>
                </svg>
              </div>
              <div className="absolute -top-0.5 -right-3 text-indigo-400 opacity-80 animate-pulse delay-150">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z"/>
                </svg>
              </div>
              
              {/* Logo Body */}
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-700 shadow-md border border-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  {/* Styled letter i */}
                  <circle cx="35" cy="30" r="10" fill="currentColor" />
                  <rect x="25" y="48" width="20" height="32" rx="4" fill="currentColor" />
                  
                  {/* Styled letter A */}
                  <path d="M50 80L68 32C69 29.5 72 29.5 73 32L91 80" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="58" y1="64" x2="83" y2="64" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col items-start leading-none">
              <div className="flex items-center">
                <span className="text-base font-black text-slate-800 tracking-tight">intern</span>
                <span className="text-base font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">Ai</span>
              </div>
              <span className="text-[7px] font-black uppercase tracking-[0.18em] text-slate-400 mt-0.5">Learn • Grow • Succeed</span>
            </div>
          </button>
        </div>

        {/* Center: Navigation Links (Rearranged and Centered) */}
        <nav className="flex items-center md:gap-4 lg:gap-6 h-full justify-center flex-1 max-w-md mx-auto" id="ln-main-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setSearchQuery(''); // clear search on view transition
                }}
                className={`relative flex flex-col items-center justify-center h-full px-3.5 cursor-pointer transition-colors border-b-2 hover:text-slate-900 ${
                  isActive 
                    ? 'border-slate-950 text-slate-950 font-black scale-102' 
                    : 'border-transparent text-slate-500 hover:text-slate-850'
                }`}
                id={`ln-nav-tab-${item.id}`}
              >
                <div className="relative flex items-center justify-center">
                  {item.isProfile ? (
                    <img 
                      src={profile.avatar} 
                      alt="Profile Avatar" 
                      className="w-7 h-7 rounded-full border border-slate-200 object-cover shadow-sm"
                    />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                  {item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-bold rounded-full px-1 text-[9px] min-w-[14px] h-[14px] flex items-center justify-center animate-pulse">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:block mt-1">
                  {item.label}
                  {item.isProfile && ' ▾'}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: Search Bar */}
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl flex items-center shrink-0 transition-all duration-300" id="ln-navbar-right">
          <div className="absolute left-3.5 pointer-events-none flex items-center gap-1.5 text-slate-400">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="w-[1px] h-3 bg-slate-200"></span>
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          </div>
          <input
            type="text"
            placeholder="Search network or ask AI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full liquid-glass-input text-sm text-slate-855 pl-16 pr-12 py-2 rounded-xl outline-none placeholder-slate-400 border border-slate-200/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-150 transition-all duration-200"
            id="ln-global-search"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 font-bold uppercase tracking-wider"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
