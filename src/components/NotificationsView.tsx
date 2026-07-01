import React from 'react';
import { Bell, Heart, MessageSquare, Check, Trash, UserPlus, Briefcase, Eye, EyeOff } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  searchQuery: string;
}

export default function NotificationsView({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  searchQuery
}: NotificationsViewProps) {

  // Filter notifications based on search query
  const filteredNotifications = notifications.filter(notif => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      notif.senderName.toLowerCase().includes(query) ||
      notif.text.toLowerCase().includes(query) ||
      (notif.senderHeadline && notif.senderHeadline.toLowerCase().includes(query))
    );
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-blue-500 fill-blue-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-green-600 fill-green-50" />;
      case 'connection_request':
        return <UserPlus className="w-4 h-4 text-purple-600" />;
      case 'connection_accept':
        return <UserPlus className="w-4 h-4 text-emerald-600" />;
      case 'job_alert':
        return <Briefcase className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getBgClass = (read: boolean) => {
    return read ? 'bg-white' : 'bg-[#f3f9fc] hover:bg-[#ebf5fb] border-l-4 border-l-[#0a66c2]';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="ln-notifications-container">
      {/* Left sidebar: Filter Controls */}
      <div className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm h-fit flex flex-col gap-4">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notifications</h3>
          <p className="text-xs text-slate-600 font-medium mt-1 leading-normal">Stay updated with professional network insights, likes, and invitations.</p>
        </div>

        <button 
          onClick={onMarkAllAsRead}
          disabled={notifications.every(n => n.read)}
          className="w-full text-center py-2.5 border border-slate-300 rounded-full text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-40 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* Main notifications list */}
      <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Updates</h3>
          <span className="text-[10px] text-slate-500 font-bold bg-slate-100 rounded-full px-2 py-0.5 uppercase tracking-wider">
            {notifications.filter(n => !n.read).length} unread
          </span>
        </div>

        <div className="flex flex-col">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-semibold">
              No notifications to display.
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div 
                key={notif.id}
                className={`p-4 border-b border-slate-100 last:border-b-0 flex items-start gap-3.5 transition-colors ${getBgClass(notif.read)}`}
                id={`ln-notif-item-${notif.id}`}
              >
                {/* Visual Category indicator icon */}
                <div className="p-2 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center self-center shadow-3xs shrink-0">
                  {getIcon(notif.type)}
                </div>

                {/* Sender Avatar */}
                <img 
                  src={notif.senderAvatar} 
                  alt={notif.senderName} 
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 self-center shrink-0"
                />

                {/* Text Description body */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-xs text-slate-700 font-medium leading-normal">
                    <span className="font-extrabold text-slate-900 hover:underline cursor-pointer">{notif.senderName} </span>
                    {notif.text}
                  </p>
                  {notif.senderHeadline && (
                    <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider mt-1 truncate max-w-[280px] sm:max-w-[450px]">
                      {notif.senderHeadline}
                    </p>
                  )}
                  <span className="text-[10px] font-bold text-slate-400 mt-1">{notif.timestamp}</span>
                </div>

                {/* Interactive Action buttons */}
                <div className="flex gap-1.5 self-center shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => onMarkAsRead(notif.id)}
                      className="p-1.5 hover:bg-slate-100 rounded-full cursor-pointer text-slate-500 hover:text-[#0a66c2] transition-colors"
                      title="Mark as read"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteNotification(notif.id)}
                    className="p-1.5 hover:bg-slate-100 rounded-full cursor-pointer text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete notification"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
