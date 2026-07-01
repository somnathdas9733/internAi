import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreHorizontal, MessageSquare, Loader2, Search, CheckCheck } from 'lucide-react';
import { Conversation, Message, Connection } from '../types';

interface MessagingViewProps {
  conversations: Conversation[];
  activeConvId: string;
  setActiveConvId: (id: string) => void;
  onSendMessage: (convId: string, text: string) => void;
  onReceiveAiReply: (convId: string, replyText: string) => void;
  searchQuery: string;
}

export default function MessagingView({
  conversations,
  activeConvId,
  setActiveConvId,
  onSendMessage,
  onReceiveAiReply,
  searchQuery
}: MessagingViewProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  // Scroll to bottom whenever messages list or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isTyping]);

  // Mark unread conversation as read when selected
  useEffect(() => {
    if (activeConv && activeConv.unread) {
      activeConv.unread = false;
    }
  }, [activeConvId]);

  const handleSend = async () => {
    if (!inputText.trim() || !activeConv) return;
    
    const userText = inputText.trim();
    onSendMessage(activeConv.id, userText);
    setInputText('');

    // Trigger AI response simulation
    setIsTyping(true);
    
    try {
      // Build full conversation payload for context
      const messagesPayload = [
        ...activeConv.messages,
        { id: "temp_user", senderId: "me", text: userText, timestamp: "" }
      ];

      const response = await fetch('/api/ai/chat-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesPayload,
          partnerName: activeConv.participant.name,
          partnerHeadline: activeConv.participant.headline
        })
      });

      if (!response.ok) throw new Error('API reply failed');
      const data = await response.json();
      
      // Simulate natural thinking/typing delay
      setTimeout(() => {
        onReceiveAiReply(activeConv.id, data.response || "Thanks! I'll get back to you shortly.");
        setIsTyping(false);
      }, 1200);

    } catch (err) {
      setTimeout(() => {
        onReceiveAiReply(activeConv.id, "Sorry, I am out of office right now, but let's connect soon!");
        setIsTyping(false);
      }, 1000);
    }
  };

  // Filter conversations based on universal search
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      conv.participant.name.toLowerCase().includes(query) ||
      conv.participant.headline.toLowerCase().includes(query) ||
      conv.messages.some(m => m.text.toLowerCase().includes(query))
    );
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 h-[75vh]" id="ln-messaging-grid">
      {/* Left Pane: Conversations List */}
      <div className="md:col-span-1 border-r border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversations</h3>
          <span className="text-[10px] text-slate-500 font-bold bg-slate-100 rounded-full px-2 py-0.5 uppercase tracking-wider">
            {conversations.filter(c => c.unread).length} unread
          </span>
        </div>

        {/* Search Conversation input */}
        <div className="p-2.5 border-b border-slate-100">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search messages..."
              className="w-full bg-[#EDF3F8] text-xs pl-8 pr-3 py-2 rounded-md outline-none border border-transparent focus:bg-white focus:ring-2 focus:ring-[#0a66c2]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No chats found.</p>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = activeConvId === conv.id;
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 border-b border-slate-100 cursor-pointer flex gap-3 transition-colors ${
                    isSelected ? 'bg-sky-50/50 border-l-4 border-l-[#0a66c2]' : 'hover:bg-slate-50 bg-white'
                  }`}
                  id={`ln-chat-item-${conv.id}`}
                >
                  <div className="relative shrink-0">
                    <img 
                      src={conv.participant.avatar} 
                      alt={conv.participant.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    {conv.unread && (
                      <span className="absolute top-0 right-0 bg-[#0a66c2] w-3 h-3 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className={`text-xs font-bold truncate tracking-tight ${conv.unread ? 'text-slate-900 font-black' : 'text-slate-800'}`}>
                        {conv.participant.name}
                      </h4>
                      <span className="text-[9px] text-slate-400 truncate ml-1 font-semibold">{lastMsg?.timestamp || 'Today'}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium truncate leading-tight mt-0.5">{conv.participant.headline}</p>
                    <p className={`text-xs truncate mt-1.5 font-medium ${conv.unread ? 'text-slate-950 font-bold' : 'text-slate-500'}`}>
                      {lastMsg ? lastMsg.text : 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Chat Room */}
      <div className="md:col-span-2 flex flex-col h-full bg-white rounded-r-xl overflow-hidden">
        {activeConv ? (
          <div className="flex flex-col h-full" id="ln-active-chatroom">
            {/* Thread Header */}
            <div className="p-3.5 border-b border-slate-150 flex items-center justify-between bg-slate-50/20">
              <div className="flex gap-2.5 items-center">
                <img 
                  src={activeConv.participant.avatar} 
                  alt={activeConv.participant.name} 
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-black text-slate-900 hover:underline cursor-pointer tracking-tight">{activeConv.participant.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-[350px]">
                    {activeConv.participant.headline}
                  </p>
                </div>
              </div>
              <button className="p-1.5 hover:bg-slate-100 rounded-full cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages scroll area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
              {activeConv.messages.map((msg) => {
                const isMe = msg.senderId === 'me';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img 
                        src={activeConv.participant.avatar} 
                        alt={activeConv.participant.name} 
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 mr-2 self-start mt-1"
                      />
                    )}
                    
                    <div className="flex flex-col max-w-[75%]">
                      <div className={`p-3 rounded-xl text-xs leading-relaxed shadow-xs font-medium ${
                        isMe 
                          ? 'bg-[#0a66c2] text-white rounded-br-none font-semibold' 
                          : 'bg-white border border-slate-250 text-slate-800 rounded-bl-none'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      
                      <div className={`flex items-center gap-1 text-[8.5px] text-slate-400 mt-1 font-semibold ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span>{msg.timestamp || 'Just now'}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <img 
                    src={activeConv.participant.avatar} 
                    alt={activeConv.participant.name} 
                    className="w-7 h-7 rounded-full object-cover mr-2 self-start mt-1"
                  />
                  <div className="bg-white border border-slate-200 rounded-xl p-3 rounded-bl-none shadow-xs text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="font-bold text-slate-600">{activeConv.participant.name} is writing</span>
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-0" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300" />
                    </span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message composer input */}
            <div className="p-3 border-t border-slate-100 flex gap-2.5 items-center bg-white">
              <input 
                type="text" 
                placeholder="Write a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-[#EDF3F8] text-xs p-2.5 border border-transparent rounded-md outline-none focus:bg-white focus:ring-2 focus:ring-[#0a66c2] font-medium"
                id="ln-message-composer-input"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="bg-[#0a66c2] hover:bg-[#004182] text-white font-bold uppercase tracking-wider text-xs py-2.5 px-4 rounded-md cursor-pointer transition-colors disabled:opacity-40 shadow-sm"
                title="Send Message"
                id="ln-message-composer-send-btn"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
            <MessageSquare className="w-10 h-10 text-slate-300" />
            <p className="text-xs font-bold uppercase tracking-wider">Select a conversation to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
