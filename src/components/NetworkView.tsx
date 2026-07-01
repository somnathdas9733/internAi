import React from 'react';
import { Users, UserCheck, BookOpen, Calendar, HelpCircle, UserPlus, UserMinus, Check, Trash } from 'lucide-react';
import { Connection } from '../types';

interface NetworkViewProps {
  connections: Connection[];
  onAcceptInvitation: (id: string) => void;
  onIgnoreInvitation: (id: string) => void;
  onSendConnectionRequest: (id: string) => void;
  searchQuery: string;
}

export default function NetworkView({
  connections,
  onAcceptInvitation,
  onIgnoreInvitation,
  onSendConnectionRequest,
  searchQuery
}: NetworkViewProps) {
  const activeConnections = connections.filter(c => c.status === 'connected');
  const pendingReceived = connections.filter(c => c.status === 'pending_received');
  const pendingSent = connections.filter(c => c.status === 'pending_sent');
  const suggestions = connections.filter(c => c.status === 'suggested');

  // Filter connections based on search query
  const matchesQuery = (conn: Connection) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      conn.name.toLowerCase().includes(query) ||
      conn.headline.toLowerCase().includes(query) ||
      (conn.bio && conn.bio.toLowerCase().includes(query))
    );
  };

  const filteredActive = activeConnections.filter(matchesQuery);
  const filteredSuggestions = suggestions.filter(matchesQuery);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="ln-network-container">
      {/* Left Column: Stats Panel */}
      <div className="md:col-span-1 liquid-glass-card rounded-xl p-4 shadow-sm h-fit flex flex-col gap-2">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Manage my network</h3>
        
        <div className="flex flex-col gap-1 text-xs text-slate-600">
          <div className="flex justify-between items-center py-2 px-1.5 hover:bg-white/30 rounded-md cursor-pointer font-extrabold text-slate-800 transition-colors">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Connections</span>
            </span>
            <span className="text-xs font-bold text-slate-950">{activeConnections.length}</span>
          </div>

          <div className="flex justify-between items-center py-2 px-1.5 hover:bg-white/30 rounded-md cursor-pointer font-bold text-slate-700 transition-colors">
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-500" />
              <span>Following</span>
            </span>
            <span className="text-[11px] text-slate-400">1.5k</span>
          </div>

          <div className="flex justify-between items-center py-2 px-1.5 hover:bg-white/30 rounded-md cursor-pointer font-bold text-slate-700 transition-colors">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Newsletters</span>
            </span>
            <span className="text-[11px] text-slate-400">4</span>
          </div>

          <div className="flex justify-between items-center py-2 px-1.5 hover:bg-white/30 rounded-md cursor-pointer font-bold text-slate-700 transition-colors">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Events</span>
            </span>
            <span className="text-[11px] text-slate-400">2</span>
          </div>
        </div>
      </div>

      {/* Middle/Right Column: Manage Invitations and Suggested People */}
      <div className="md:col-span-3 flex flex-col gap-4">
        {/* Invitations Panel */}
        {pendingReceived.length > 0 && (
          <div className="liquid-glass-card rounded-xl shadow-sm" id="ln-pending-invites">
            <div className="p-3.5 border-b border-white/20 flex justify-between items-center bg-white/20">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invitations</h3>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{pendingReceived.length} pending</span>
            </div>

            <div className="flex flex-col">
              {pendingReceived.map((invite) => (
                <div 
                  key={invite.id} 
                  className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/20 last:border-b-0 hover:bg-white/30 transition-colors"
                >
                  <div className="flex gap-3">
                    <img 
                      src={invite.avatar} 
                      alt={invite.name} 
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex flex-col justify-center">
                      <h4 className="text-xs font-bold text-slate-900 hover:underline cursor-pointer">{invite.name}</h4>
                      <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider mt-0.5">{invite.headline}</p>
                      {invite.mutualConnections > 0 && (
                        <span className="text-[10px] font-semibold text-slate-400 mt-1">
                          👥 {invite.mutualConnections} mutual connections
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 self-end sm:self-center">
                    <button 
                      onClick={() => onIgnoreInvitation(invite.id)}
                      className="px-4 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 cursor-pointer transition-colors"
                    >
                      Ignore
                    </button>
                    <button 
                      onClick={() => onAcceptInvitation(invite.id)}
                      className="px-4 py-1.5 border border-[#0a66c2] bg-[#f3f9fc] hover:bg-[#e2f1f8] text-[#0a66c2] rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested connections Grid */}
        <div className="liquid-glass-card rounded-xl p-4 shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">People you may know in the industry</h3>
          
          {filteredSuggestions.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6 font-semibold">
              {searchQuery ? "No matching suggestions." : "You've sent invites to all suggested professionals! No other suggestions at this time."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSuggestions.map((suggest) => {
                return (
                  <div 
                    key={suggest.id} 
                    className="border border-white/30 rounded-xl overflow-hidden flex flex-col text-center hover:shadow-xs transition-all bg-white/20"
                    id={`ln-suggest-card-${suggest.id}`}
                  >
                    {/* Header banner background */}
                    <div className="h-12 bg-gradient-to-r from-slate-200/50 to-indigo-100/30" />
                    
                    {/* Info */}
                    <div className="px-3 pb-3 flex-1 flex flex-col items-center relative">
                      <img 
                        src={suggest.avatar} 
                        alt={suggest.name} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-white absolute top-[-28px] bg-white shadow-xs shrink-0"
                      />
                      
                      <div className="mt-9 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 hover:underline cursor-pointer">{suggest.name}</h4>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1 leading-normal line-clamp-2 px-1">
                            {suggest.headline}
                          </p>
                        </div>
                        
                        {suggest.mutualConnections > 0 && (
                          <span className="text-[10px] font-semibold text-slate-400 mt-2 block">
                            👥 {suggest.mutualConnections} mutual connections
                          </span>
                        )}
                      </div>

                      <button 
                        onClick={() => onSendConnectionRequest(suggest.id)}
                        className="mt-3.5 w-full py-2 px-3 border border-indigo-600 hover:bg-indigo-50/20 text-indigo-700 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Existing Connections Panel */}
        <div className="liquid-glass-card rounded-xl shadow-sm">
          <div className="p-3.5 border-b border-white/20 bg-white/20">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Active Connections ({filteredActive.length})</h3>
          </div>

          <div className="flex flex-col">
            {filteredActive.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6 font-semibold">
                No active connections match your filters.
              </p>
            ) : (
              filteredActive.map((conn) => (
                <div 
                  key={conn.id} 
                  className="p-3.5 flex items-center justify-between gap-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/20 transition-colors"
                >
                  <div className="flex gap-3">
                    <img 
                      src={conn.avatar} 
                      alt={conn.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex flex-col justify-center">
                      <h4 className="text-xs font-bold text-slate-900">{conn.name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium truncate max-w-[280px] sm:max-w-[450px]">
                        {conn.headline}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 font-bold uppercase tracking-wider py-1.5 px-3 rounded-full flex items-center gap-1 shrink-0">
                    <Check className="w-3 h-3" />
                    <span>Connected</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
