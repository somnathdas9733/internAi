import React, { useState, useEffect } from 'react';
import { initialProfile, initialPosts, initialJobs, initialConnections, initialConversations, initialNotifications } from './mockData';
import { Profile, Post, Job, Connection, Conversation, Notification, Comment, Message } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import NetworkView from './components/NetworkView';
import JobsView from './components/JobsView';
import MessagingView from './components/MessagingView';
import NotificationsView from './components/NotificationsView';
import ProfileView from './components/ProfileView';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, AlertCircle, X, Bell, Building2, ChevronRight } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info';
}

export default function App() {
  // Navigation active view
  const [activeView, setActiveView] = useState<string>('feed');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Floating Toasts state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persistent States
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('ln_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('ln_posts');
    const loaded = saved ? JSON.parse(saved) : initialPosts;
    return loaded.filter((p: any) => p.id !== 'post_2');
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('ln_jobs');
    return saved ? JSON.parse(saved) : initialJobs;
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem('ln_connections');
    return saved ? JSON.parse(saved) : initialConnections;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('ln_conversations');
    return saved ? JSON.parse(saved) : initialConversations;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('ln_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [activeConvId, setActiveConvId] = useState<string>(() => {
    const saved = localStorage.getItem('ln_activeConvId');
    return saved || 'conv_1';
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('ln_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('ln_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('ln_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('ln_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('ln_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('ln_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ln_activeConvId', activeConvId);
  }, [activeConvId]);

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // POST HANDLERS
  const handleLikePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id !== postId) return p;
        const alreadyLiked = p.likes.includes("Somnath Das");
        const updatedLikes = alreadyLiked
          ? p.likes.filter(name => name !== "Somnath Das")
          : [...p.likes, "Somnath Das"];
        return { ...p, likes: updatedLikes };
      })
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      authorName: profile.name,
      authorAvatar: profile.avatar,
      authorHeadline: profile.headline,
      content,
      timestamp: "Just now"
    };

    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id !== postId) return p;
        return { ...p, comments: [newComment, ...p.comments] };
      })
    );
    addToast("Comment published successfully!");
  };

  const handleSharePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id !== postId) return p;
        return { ...p, sharesCount: p.sharesCount + 1 };
      })
    );
    addToast("Post shared with your connection network!", "success");
  };

  const handleCreatePost = (content: string, image?: string) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorName: profile.name,
      authorHeadline: profile.headline,
      authorAvatar: profile.avatar,
      content,
      image,
      likes: [],
      comments: [],
      sharesCount: 0,
      timestamp: "Just now"
    };

    setPosts(prev => [newPost, ...prev]);
    addToast("Your post was successfully published!");
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    addToast("Post deleted successfully.");
  };

  const handleDeleteAllPosts = () => {
    setPosts([]);
    addToast("All posts deleted successfully.");
  };

  // CONNECTION HANDLERS
  const handleAcceptInvitation = (inviteId: string) => {
    // 1. Move state to 'connected'
    setConnections(prev =>
      prev.map(c => (c.id === inviteId ? { ...c, status: 'connected' } : c))
    );
    
    // 2. Remove from notification indicators if relevant
    setNotifications(prev =>
      prev.filter(n => !(n.type === 'connection_request' && n.id === inviteId))
    );

    // 3. Create a welcoming notification alert
    const acceptedPerson = connections.find(c => c.id === inviteId);
    if (acceptedPerson) {
      const welcomeNotification: Notification = {
        id: `notif_accept_${Date.now()}`,
        type: 'connection_accept',
        senderName: acceptedPerson.name,
        senderAvatar: acceptedPerson.avatar,
        senderHeadline: acceptedPerson.headline,
        text: "and you are now connected. Say hello!",
        timestamp: "Just now",
        read: false
      };
      setNotifications(prev => [welcomeNotification, ...prev]);
      
      // 4. Create initial empty message thread
      const exists = conversations.some(c => c.participant.id === inviteId);
      if (!exists) {
        const newConv: Conversation = {
          id: `conv_${Date.now()}`,
          participant: acceptedPerson,
          messages: [
            {
              id: `init_${Date.now()}`,
              senderId: inviteId,
              text: `Thanks for accepting my connection request, Somnath! Excited to connect.`,
              timestamp: "Just now"
            }
          ],
          unread: true
        };
        setConversations(prev => [newConv, ...prev]);
      }
    }
    
    addToast("Invitation accepted! Connection established.");
  };

  const handleIgnoreInvitation = (inviteId: string) => {
    setConnections(prev =>
      prev.map(c => (c.id === inviteId ? { ...c, status: 'suggested' } : c))
    );
    addToast("Invitation ignored. Person moved to suggestions.");
  };

  const handleSendConnectionRequest = (suggestId: string) => {
    setConnections(prev =>
      prev.map(c => (c.id === suggestId ? { ...c, status: 'pending_sent' } : c))
    );
    addToast("Connection invitation sent successfully!");
  };

  // JOB HANDLERS
  const handleApplyJob = (jobId: string) => {
    setJobs(prevJobs =>
      prevJobs.map(j => (j.id === jobId ? { ...j, applied: true } : j))
    );
    
    // Add success notification
    const selectedJobObj = jobs.find(j => j.id === jobId);
    if (selectedJobObj) {
      const jobNotif: Notification = {
        id: `notif_job_${Date.now()}`,
        type: 'job_alert',
        senderName: selectedJobObj.company,
        senderAvatar: selectedJobObj.logo,
        text: `received your application for the '${selectedJobObj.title}' position. Tracking in Progress.`,
        timestamp: "Just now",
        read: false
      };
      setNotifications(prev => [jobNotif, ...prev]);
    }
    addToast("Application submitted successfully!", "success");
  };

  // MESSAGING HANDLERS
  const handleSendMessage = (convId: string, text: string) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: "Just now"
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id !== convId) return c;
        return {
          ...c,
          messages: [...c.messages, newMsg]
        };
      })
    );
  };

  const handleReceiveAiReply = (convId: string, replyText: string) => {
    const aiMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'ai', // partner id
      text: replyText,
      timestamp: "Just now"
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id !== convId) return c;
        return {
          ...c,
          messages: [...c.messages, aiMsg],
          unread: true
        };
      })
    );
  };

  // NOTIFICATION HANDLERS
  const handleMarkAsRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast("All notifications marked as read!");
  };

  const handleDeleteNotification = (notifId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
    addToast("Notification deleted.");
  };

  const activeConnectionsCount = connections.filter(c => c.status === 'connected').length;
  const unreadMessagesCount = conversations.filter(c => c.unread).length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F0F6FF] relative overflow-hidden flex flex-col font-sans" id="ln-app-root">
      {/* Decorative Floating Fluid Liquid Glass Blobs */}
      <div className="absolute top-[-10%] left-[5%] w-[45rem] h-[45rem] rounded-full bg-gradient-to-tr from-[#60a5fa]/25 to-[#c084fc]/15 blur-3xl pointer-events-none animate-fluid-one z-0" />
      <div className="absolute bottom-[10%] right-[-5%] w-[50rem] h-[50rem] rounded-full bg-gradient-to-br from-[#818cf8]/20 to-[#f472b6]/10 blur-3xl pointer-events-none animate-fluid-two z-0" />
      <div className="absolute top-[40%] left-[30%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-tr from-[#38bdf8]/15 to-[#818cf8]/15 blur-3xl pointer-events-none animate-fluid-three z-0" />

      {/* Universal Top Navigation Header */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
        connectionsCount={connections.filter(c => c.status === 'pending_received').length}
        profile={profile}
      />

      {/* Main Body Layout */}
      <main className="flex-1 max-w-[95%] xl:max-w-[1400px] 2xl:max-w-[1600px] w-full mx-auto px-4 py-6 relative z-10 transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >
            {activeView === 'feed' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start" id="ln-feed-view">
                {/* Left: Snap profile & Communities summary */}
                <div className="md:col-span-1">
                  <Sidebar 
                    profile={profile} 
                    onViewProfile={() => setActiveView('profile')}
                    connectionsCount={activeConnectionsCount}
                  />
                </div>

                {/* Middle: Interactive Post Creation Feed lists */}
                <div className="md:col-span-2">
                  <Feed
                    posts={posts}
                    profile={profile}
                    onLikePost={handleLikePost}
                    onAddComment={handleAddComment}
                    onSharePost={handleSharePost}
                    onCreatePost={handleCreatePost}
                    onDeletePost={handleDeletePost}
                    onDeleteAllPosts={handleDeleteAllPosts}
                    searchQuery={searchQuery}
                  />
                </div>

                {/* Right: Company Recommendations Panel */}
                <div className="hidden md:block md:col-span-1">
                  <div className="liquid-glass-card rounded-2xl p-5 md:p-6 shadow-md sticky top-20 h-[calc(100vh-104px)] flex flex-col" id="ln-feed-company-recommendations">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4 shrink-0">
                      <Building2 className="w-5.5 h-5.5 text-indigo-600" />
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Recommended Companies</h3>
                    </div>

                    <div className="flex flex-col gap-5 overflow-y-auto pr-1 flex-1 no-scrollbar">
                      {/* Recommendation 1: Google */}
                      <div className="group border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 p-4 rounded-xl transition-all duration-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-700 text-sm shrink-0 mt-0.5">
                              G
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-extrabold text-sm text-slate-950 break-words whitespace-normal leading-snug">Google</h4>
                              <p className="text-xs text-slate-500 font-medium break-words whitespace-normal leading-snug mt-0.5">Mountain View, CA</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                            98% Match
                          </span>
                        </div>

                        <div className="mt-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Required Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">React</span>
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">TypeScript</span>
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">Architecture</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => setActiveView('jobs')}
                          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 py-2.5 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <span>View Positions</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Recommendation 2: Stripe */}
                      <div className="group border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 p-4 rounded-xl transition-all duration-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <div className="w-11 h-11 rounded-lg bg-indigo-50 flex items-center justify-center font-black text-indigo-700 text-sm shrink-0 mt-0.5">
                              S
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-extrabold text-sm text-slate-950 break-words whitespace-normal leading-snug">Stripe</h4>
                              <p className="text-xs text-slate-500 font-medium break-words whitespace-normal leading-snug mt-0.5">San Francisco, CA</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full shrink-0">
                            95% Match
                          </span>
                        </div>

                        <div className="mt-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Required Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">Node.js</span>
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">Express</span>
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">TypeScript</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => setActiveView('jobs')}
                          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 py-2.5 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <span>View Positions</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Recommendation 3: Airbnb */}
                      <div className="group border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 p-4 rounded-xl transition-all duration-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center font-black text-red-600 text-sm shrink-0 mt-0.5">
                              A
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-extrabold text-sm text-slate-950 break-words whitespace-normal leading-snug">Airbnb</h4>
                              <p className="text-xs text-slate-500 font-medium break-words whitespace-normal leading-snug mt-0.5">Remote Friendly</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full shrink-0">
                            92% Match
                          </span>
                        </div>

                        <div className="mt-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Required Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">Tailwind CSS</span>
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">React</span>
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">UI/UX</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => setActiveView('jobs')}
                          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 py-2.5 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <span>View Positions</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'network' && (
              <div id="ln-network-view">
                <NetworkView
                  connections={connections}
                  onAcceptInvitation={handleAcceptInvitation}
                  onIgnoreInvitation={handleIgnoreInvitation}
                  onSendConnectionRequest={handleSendConnectionRequest}
                  searchQuery={searchQuery}
                />
              </div>
            )}

            {activeView === 'jobs' && (
              <div id="ln-jobs-view">
                <JobsView
                  jobs={jobs}
                  profile={profile}
                  onApplyJob={handleApplyJob}
                  searchQuery={searchQuery}
                />
              </div>
            )}

            {activeView === 'messaging' && (
              <div id="ln-messaging-view">
                <MessagingView
                  conversations={conversations}
                  activeConvId={activeConvId}
                  setActiveConvId={setActiveConvId}
                  onSendMessage={handleSendMessage}
                  onReceiveAiReply={handleReceiveAiReply}
                  searchQuery={searchQuery}
                />
              </div>
            )}

            {activeView === 'notifications' && (
              <div id="ln-notifications-view">
                <NotificationsView
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onDeleteNotification={handleDeleteNotification}
                  searchQuery={searchQuery}
                />
              </div>
            )}

            {activeView === 'profile' && (
              <div id="ln-profile-view">
                <ProfileView
                  profile={profile}
                  onUpdateProfile={setProfile}
                  connectionsCount={activeConnectionsCount}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating toast notification bubbles container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="bg-slate-950 border border-slate-800 text-white rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-xl pointer-events-auto min-w-[280px]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-100">{toast.message}</span>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
