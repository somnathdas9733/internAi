import React from 'react';
import { Bookmark, Users2, Calendar, Hash, Plus } from 'lucide-react';
import { Profile } from '../types';

interface SidebarProps {
  profile: Profile;
  onViewProfile: () => void;
  connectionsCount: number;
}

export default function Sidebar({ profile, onViewProfile, connectionsCount }: SidebarProps) {
  return (
    <div className="flex flex-col gap-3 w-full" id="ln-sidebar-card">
      {/* Profile Overview Card */}
      <div className="liquid-glass-card rounded-xl overflow-hidden shadow-sm">
        {/* Profile Image Container instead of Banner */}
        <div className="pt-6 flex justify-center">
          <button 
            onClick={onViewProfile}
            className="cursor-pointer focus:outline-none"
          >
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-20 h-20 rounded-full border-4 border-white/60 object-cover shadow-md hover:scale-105 transition-transform bg-white/40"
            />
          </button>
        </div>
        
        {/* Profile info */}
        <div className="px-4 pb-5 text-center border-b border-white/30 relative">
          <div className="mt-3">
            <button 
              onClick={onViewProfile}
              className="font-extrabold text-slate-900 text-base leading-tight tracking-tight hover:underline cursor-pointer block w-full text-center"
            >
              {profile.name}
            </button>
            <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-normal font-semibold">
              {profile.headline}
            </p>
          </div>
        </div>

        {/* Analytics stats */}
        <div className="py-4 px-4 text-xs border-b border-white/30 flex flex-col gap-2.5 bg-white/20">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-500">Connections</span>
            <span className="text-indigo-600 font-extrabold">{connectionsCount}</span>
          </div>
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-500">Profile views</span>
            <span className="text-slate-900">412</span>
          </div>
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-500">Post impressions</span>
            <span className="text-slate-900">1,894</span>
          </div>
        </div>

        {/* Bookmark link */}
        <button className="w-full text-left p-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider hover:bg-white/25 flex items-center gap-2.5 border-none cursor-pointer transition-colors">
          <Bookmark className="w-5 h-5 text-slate-500" />
          <span>My items</span>
        </button>
      </div>

      {/* Community / Groups Card */}
      <div className="liquid-glass-card rounded-xl p-4 shadow-sm hidden md:block">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Groups</h3>
        
        <ul className="space-y-3">
          <li className="text-sm font-bold flex items-center gap-2.5 hover:text-[#0A66C2] text-slate-700 cursor-pointer">
            <span className="text-slate-400">#</span> React Developers Worldwide
          </li>
          <li className="text-sm font-bold flex items-center gap-2.5 hover:text-[#0A66C2] text-slate-700 cursor-pointer">
            <span className="text-slate-400">#</span> AI & Frontend Synergy 2026
          </li>
          <li className="text-sm font-bold flex items-center gap-2.5 hover:text-[#0A66C2] text-slate-700 cursor-pointer">
            <span className="text-slate-400">#</span> webperf
          </li>
        </ul>

        <div className="mt-4 pt-3 border-t border-white/30 flex justify-between items-center text-sm font-bold uppercase tracking-wider text-[#0a66c2]">
          <button className="hover:underline cursor-pointer">Groups</button>
          <button className="p-1 hover:bg-white/30 rounded-full cursor-pointer text-slate-400 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 text-sm font-bold uppercase tracking-wider text-[#0a66c2]">
          <button className="hover:underline cursor-pointer">Events</button>
        </div>
      </div>
    </div>
  );
}
