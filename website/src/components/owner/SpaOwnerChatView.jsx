import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Send,
  Phone,
  Calendar,
  Check,
  CheckCheck,
  Clock,
  User,
  ShieldCheck,
  Sparkles,
  Paperclip,
  Smile,
  MoreVertical,
  X,
  ChevronRight,
  FileText,
  MapPin,
  Star,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Bot,
  Bell,
  CheckCircle2,
  Trash2
} from 'lucide-react';

const INITIAL_OWNER_CHATS = [
  {
    id: 'chat-rahul',
    guestName: 'Rahul Verma',
    guestPhone: '+91 98290 84721',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    isVIP: true,
    unreadCount: 1,
    lastTime: '10:28 AM',
    booking: {
      id: 'TS-9021',
      service: '90-Min Imperial Swedish Aromatherapy',
      time: 'Today · 04:00 PM',
      therapist: 'Dr. Priya Sen',
      room: 'Lotus Suite #3',
      amount: '₹3,499',
      status: 'Confirmed'
    },
    messages: [
      {
        id: 'r1',
        sender: 'guest',
        text: 'Namaste! I have a booking today at 04:00 PM (Booking #TS-9021).',
        timestamp: '10:15 AM',
        status: 'read'
      },
      {
        id: 'r2',
        sender: 'owner',
        text: 'Namaste Mr. Verma! Yes, Dr. Priya Sen and Lotus Suite #3 are reserved for your Swedish session.',
        timestamp: '10:18 AM',
        status: 'read'
      },
      {
        id: 'r3',
        sender: 'guest',
        text: 'Due to severe traffic on Tonk Road, can I please push the slot by 30 minutes to 04:30 PM? Will that be fine?',
        timestamp: '10:28 AM',
        status: 'unread'
      }
    ]
  },
  {
    id: 'chat-neha',
    guestName: 'Neha Kapur',
    guestPhone: '+91 97112 34900',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    isVIP: false,
    unreadCount: 1,
    lastTime: '10:05 AM',
    booking: {
      id: 'TS-9034',
      service: 'Couple Hydro-Suite & Volcanic Stones',
      time: 'Tomorrow, Sat · 06:00 PM',
      therapist: 'Assigned on arrival',
      room: 'Royal Couple Chamber',
      amount: '₹6,499',
      status: 'Enquiry / Pending'
    },
    messages: [
      {
        id: 'n1',
        sender: 'guest',
        text: 'Hello! I am planning to book the Couple Hydro-Suite for Saturday evening. Does it include private steam & sauna time before the massage?',
        timestamp: '10:05 AM',
        status: 'unread'
      }
    ]
  },
  {
    id: 'chat-neha',
    guestName: 'Neha Kapur',
    guestPhone: '+91 97112 34900',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    isVIP: false,
    unreadCount: 1,
    lastTime: '10:05 AM',
    booking: {
      id: 'TS-9034',
      service: 'Couple Hydro-Suite & Volcanic Stones',
      time: 'Tomorrow, Sat · 06:00 PM',
      therapist: 'Assigned on arrival',
      room: 'Royal Couple Chamber',
      amount: '₹6,499',
      status: 'Enquiry / Pending'
    },
    messages: [
      {
        id: 'n1',
        sender: 'guest',
        text: 'Hello! I am planning to book the Couple Hydro-Suite for Saturday evening. Does it include private steam & sauna time before the massage?',
        timestamp: '10:05 AM',
        status: 'unread'
      }
    ]
  },
  {
    id: 'chat-amitabh',
    guestName: 'Amitabh Roy',
    guestPhone: '+91 94140 12890',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isOnline: false,
    isVIP: true,
    unreadCount: 0,
    lastTime: 'Yesterday',
    booking: {
      id: 'TS-8842',
      service: 'Deep Tissue Sports Recovery',
      time: 'Completed Yesterday',
      therapist: 'Ananya Sharma',
      room: 'Chamber 1',
      amount: '₹2,999',
      status: 'Completed'
    },
    messages: [
      {
        id: 'a1',
        sender: 'guest',
        text: 'Just wanted to share feedback - Ananya Sharma did a fantastic job with my lower back stiffness yesterday. Please ensure she is assigned for my next session too!',
        timestamp: 'Yesterday 07:30 PM',
        status: 'read'
      },
      {
        id: 'a2',
        sender: 'owner',
        text: 'Thank you so much Mr. Roy! We will gladly note Ananya as your preferred practitioner. Looking forward to hosting you again!',
        timestamp: 'Yesterday 07:45 PM',
        status: 'read'
      }
    ]
  },
  {
    id: 'chat-support',
    guestName: 'TherapyShala Partner Desk',
    guestPhone: 'Official Helpline (1800 890 2244)',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    isVIP: false,
    unreadCount: 0,
    lastTime: 'Oct 28',
    isPlatformDesk: true,
    booking: null,
    messages: [
      {
        id: 's1',
        sender: 'guest',
        text: 'Notice: Your spa hygiene audit score is 98.5% (Platinum Tier). This elevates your sanctuary in city search rankings.',
        timestamp: 'Oct 28, 03:00 PM',
        status: 'read'
      }
    ]
  }
];

const OWNER_TEMPLATES = [
  '✅ Reschedule Approved for 04:30 PM!',
  '📍 Valet parking is free at Gate 2',
  '🧖‍♂️ Yes, includes 20m private Jacuzzi & steam',
  '☕ Lemongrass tea & suite ready for you',
  '📄 GST Invoice sent to your email'
];

export default function SpaOwnerChatView({
  activeSpaName = 'Aura Luxe Sanctuary',
  spaLogo = null
}) {
  const effectiveLogo = spaLogo || '/logo.png';
  const [chats, setChats] = useState(INITIAL_OWNER_CHATS);
  const [activeChatId, setActiveChatId] = useState('chat-rahul');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  // Interactive Notification Feed State
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('all'); // 'all' | 'unread'
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'New Client Message',
      desc: 'Rahul Verma sent: "Due to severe traffic on Tonk Road, can I please push..."',
      time: '10:28 AM',
      read: false,
      type: 'message',
      targetChatId: 'chat-rahul',
      badge: 'Chat'
    },
    {
      id: 'notif-2',
      title: 'Appointment Confirmed',
      desc: 'Booking #TS-9021 (Imperial Swedish Aromatherapy) scheduled for Today at 04:00 PM',
      time: '10:15 AM',
      read: false,
      type: 'booking',
      targetChatId: 'chat-rahul',
      badge: 'Booking'
    },
    {
      id: 'notif-3',
      title: 'Inquiry Pending Reply',
      desc: 'Neha Kapur enquired about Couple Hydro-Suite & Volcanic Stones',
      time: '10:05 AM',
      read: false,
      type: 'inquiry',
      targetChatId: 'chat-neha',
      badge: 'Inquiry'
    },
    {
      id: 'notif-4',
      title: 'Hygiene Audit Passed',
      desc: 'Audit score 98.5% (Platinum Tier) verified by TherapyShala Platform Auditor',
      time: 'Yesterday',
      read: true,
      type: 'audit',
      targetChatId: 'chat-support',
      badge: 'Platform'
    }
  ]);

  // Responsive mobile state: true when active chat is open on mobile
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const handleToggleRead = (id, e) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notif) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    if (notif.targetChatId) {
      setActiveChatId(notif.targetChatId);
      setMobileShowChat(true);
    }
    setShowNotificationsModal(false);
  };

  const messagesEndRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isTyping]);

  // Mark messages as read when opening a chat
  useEffect(() => {
    if (activeChatId) {
      setChats((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId && c.unreadCount > 0) {
            return {
              ...c,
              unreadCount: 0,
              messages: c.messages.map((m) => ({ ...m, status: 'read' }))
            };
          }
          return c;
        })
      );
    }
  }, [activeChatId]);

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setMobileShowChat(true);
  };

  const handleSendMessage = (customText = null) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend) return;

    const newMsg = {
      id: `owner-msg-${Date.now()}`,
      sender: 'owner',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastTime: 'Just now',
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    if (!customText) setInputText('');

    // Simulate Guest Reply after 1.4s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyContent = 'Thank you so much! Really appreciate your quick response. See you soon! 🙏';
      if (textToSend.includes('Reschedule') || textToSend.includes('Approved')) {
        replyContent = 'That is awesome, thank you! I will reach by 04:25 PM. Really grateful for the flexibility!';
      } else if (textToSend.includes('Jacuzzi') || textToSend.includes('steam')) {
        replyContent = 'Sounds delightful! Going ahead and completing the advance booking online right now. 💆‍♀️';
      }

      const guestReply = {
        id: `guest-reply-${Date.now()}`,
        sender: 'guest',
        text: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };

      setChats((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              lastTime: 'Just now',
              messages: [...c.messages, guestReply]
            };
          }
          return c;
        })
      );
    }, 1400);
  };

  const filteredChats = chats.filter((c) => {
    const matchesSearch =
      c.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.guestPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterTab === 'all') return true;
    if (filterTab === 'unread') return c.unreadCount > 0;
    if (filterTab === 'today') return c.booking?.time.toLowerCase().includes('today');
    if (filterTab === 'support') return c.isPlatformDesk;
    return true;
  });

  return (
    <div className="space-y-3 sm:space-y-4 w-full min-w-0">
      {/* Top Header Card (Hidden on mobile when chat is active to maximize chat view) */}
      <div
        className={`bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-gray-200/80 shadow-xs flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 shrink-0 ${mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-[#F35271] truncate">
              Live Guest Communication Desk
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0D0D12] truncate">
            Client Messages & Inquiries
          </h2>
          <p className="text-xs text-[#757880] truncate sm:whitespace-normal">
            Direct communication with booked guests, prospective inquiries & Platform Support.
          </p>
        </div>

        {/* Quick Stats Badges & Notification Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notification Bell Button */}
          <button
            onClick={() => setShowNotificationsModal(true)}
            className="relative p-2 sm:px-3 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white hover:bg-[#FFEEF1] border border-gray-200/90 hover:border-[#F35271]/40 text-[#0D0D12] transition-all flex items-center gap-2 shadow-2xs cursor-pointer active:scale-95"
            title="Notifications & Alerts"
          >
            <div className="relative">
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#F35271]" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#F35271] ring-2 ring-white animate-pulse" />
              )}
            </div>
            <span className="text-xs font-bold hidden sm:inline">
              Alerts
            </span>
            {unreadNotifCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#F35271] text-white text-[10px] font-extrabold">
                {unreadNotifCount}
              </span>
            )}
          </button>

          <div className="px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#FFEEF1] border border-[#F35271]/20 text-center">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#F35271] block">Unread</span>
            <span className="text-xs sm:text-base font-extrabold text-[#0D0D12]">
              {chats.reduce((acc, c) => acc + c.unreadCount, 0)} Chats
            </span>
          </div>

          <div className="px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200/60 text-center">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-700 block">Avg Response</span>
            <span className="text-xs sm:text-base font-extrabold text-emerald-900">&lt; 2 Mins</span>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Chat Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-md overflow-hidden flex flex-col md:flex-row h-[calc(100dvh-120px)] sm:h-[calc(100dvh-140px)] md:h-[76vh] md:min-h-[580px] md:max-h-[780px] w-full min-w-0">
        {/* ================= LEFT SIDEBAR: CONVERSATIONS LIST ================= */}
        <div
          className={`w-full md:w-76 lg:w-88 xl:w-96 shrink-0 border-r border-gray-200/80 flex flex-col h-full min-h-0 overflow-hidden bg-[#FAFAFA]/70 ${mobileShowChat ? 'hidden md:flex' : 'flex'
            }`}
        >
          {/* Sanctuary Branding Header in Sidebar */}
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#FFEEF1] via-white to-white border-b border-gray-150 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-[#F35271]/25 shadow-2xs shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={effectiveLogo}
                  alt="Spa Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = '/logo.png';
                  }}
                />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#0D0D12] truncate block">
                  {activeSpaName}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block leading-none">
                  ● Live Sanctuary Desk
                </span>
              </div>
            </div>
          </div>
          {/* Search & Tabs */}
          <div className="p-3 sm:p-3.5 border-b border-gray-200/70 bg-white space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest or message..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#0D0D12] placeholder-gray-400 focus:outline-none focus:border-[#F35271]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] pb-0.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'today', label: "Today's Bookings" },
                { id: 'support', label: 'Support' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id)}
                  className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${filterTab === tab.id
                    ? 'bg-[#0D0D12] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2 space-y-1 divide-y divide-gray-100">
            {filteredChats.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No conversations found.
              </div>
            ) : (
              filteredChats.map((c) => {
                const isActive = c.id === activeChatId;
                const lastMsg = c.messages[c.messages.length - 1];

                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectChat(c.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${isActive
                      ? 'bg-white shadow-xs border border-[#F35271]/30 ring-1 ring-[#F35271]/20'
                      : 'hover:bg-white/80 border border-transparent'
                      }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={c.avatar}
                        alt={c.guestName}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                      />
                      {c.isOnline ? (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      ) : (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gray-300 border-2 border-white" />
                      )}
                    </div>

                    {/* Preview Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h4 className="text-xs font-bold text-[#0D0D12] truncate">
                            {c.guestName}
                          </h4>
                          {c.isVIP && (
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-700 text-[9px] font-bold border border-amber-200 shrink-0">
                              VIP
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                          {c.lastTime}
                        </span>
                      </div>

                      {c.booking && (
                        <div className="text-[10px] text-[#F35271] font-semibold truncate mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span className="truncate">{c.booking.time} · {c.booking.service}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-500 truncate">
                          {lastMsg?.text || 'Sent an attachment'}
                        </p>
                        {c.unreadCount > 0 && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-[#F35271] text-white text-[10px] font-bold">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL: ACTIVE CHAT SCREEN ================= */}
        <div
          className={`flex-1 min-w-0 flex flex-col bg-white overflow-hidden h-full ${!mobileShowChat ? 'hidden md:flex' : 'flex'
            }`}
        >
          {/* Active Chat Header */}
          <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-gray-150 flex items-center justify-between gap-2 bg-white min-w-0 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Back button on mobile */}
              <button
                onClick={() => setMobileShowChat(false)}
                className="md:hidden p-1.5 -ml-1 text-gray-600 hover:text-[#0D0D12] hover:bg-gray-100 rounded-xl shrink-0 cursor-pointer"
                aria-label="Back to conversations list"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.guestName}
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[#F35271]/20 shadow-xs"
                />
                {activeChat.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-[#0D0D12] truncate">
                    {activeChat.guestName}
                  </h3>
                  {activeChat.isVIP && (
                    <span className="hidden sm:inline px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[9px] font-bold border border-amber-200 shrink-0">
                      ★ Regular
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#757880] truncate">
                  <span className="truncate">{activeChat.guestPhone}</span>
                  {activeChat.booking && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] shrink-0">
                        {activeChat.booking.time}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons & Spa Sanctuary Brand Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Spa Logo Badge */}
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-[#FFEEF1] border border-[#F35271]/25 shadow-2xs"
                title={activeSpaName}
              >
                <img
                  src={effectiveLogo}
                  alt="Spa Logo"
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain rounded-xs"
                  onError={(e) => {
                    e.target.src = '/logo.png';
                  }}
                />
                <span className="text-[10px] sm:text-xs font-bold text-[#F35271] max-w-[85px] sm:max-w-[130px] truncate hidden xs:inline">
                  {activeSpaName}
                </span>
              </div>

              {activeChat.booking && (
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#0D0D12] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="View Guest Booking Details"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#F35271]" />
                  <span className="hidden sm:inline">Booking Info</span>
                </button>
              )}
            </div>
          </div>

          {/* Booking Context Banner */}
          {activeChat.booking && (
            <div className="px-3 sm:px-5 py-2 bg-gradient-to-r from-[#FFEEF1] via-white to-[#FFEEF1] border-b border-[#F35271]/20 flex flex-wrap items-center justify-between gap-1.5 text-xs min-w-0 shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 text-[11px] sm:text-xs truncate">
                <span className="font-bold text-[#0D0D12] truncate">{activeChat.booking.service}</span>
                <span className="text-gray-400">|</span>
                <span className="font-semibold text-[#F35271] shrink-0">{activeChat.booking.time}</span>
                <span className="hidden sm:inline text-gray-400">|</span>
                <span className="hidden sm:inline truncate">Therapist: <b>{activeChat.booking.therapist}</b></span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-gray-500 bg-white px-1.5 py-0.5 rounded-md border border-gray-200">
                  {activeChat.booking.id}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Paid ({activeChat.booking.amount})
                </span>
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 space-y-3 bg-[#FAFAFA]/40 min-w-0 overscroll-contain">
            {activeChat.messages.map((m) => {
              const isOwner = m.sender === 'owner';

              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 w-full ${isOwner ? 'justify-end' : 'justify-start'}`}
                >
                  {!isOwner && (
                    <img
                      src={activeChat.avatar}
                      alt={activeChat.guestName}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover shrink-0 mb-0.5 ring-1 ring-gray-200 shadow-2xs"
                    />
                  )}

                  <div className={`max-w-[80%] sm:max-w-md ${isOwner ? 'ml-auto' : 'mr-auto'}`}>
                    <div
                      className={`p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs break-words ${isOwner
                        ? 'bg-[#0D0D12] text-white rounded-br-xs'
                        : 'bg-white text-[#0D0D12] border border-gray-200/80 rounded-bl-xs'
                        }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isOwner ? 'text-gray-400' : 'text-gray-400'
                          }`}
                      >
                        <span>{m.timestamp}</span>
                        {isOwner && (
                          <span>
                            {m.status === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-[#F35271]" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Spa Sanctuary Logo avatar for Owner replies */}
                  {isOwner && (
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-[#F35271]/30 p-0.5 shadow-2xs shrink-0 mb-0.5 flex items-center justify-center overflow-hidden ring-1 ring-[#F35271]/20"
                      title={activeSpaName}
                    >
                      <img
                        src={effectiveLogo}
                        alt="Spa Logo"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = '/logo.png';
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.guestName}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover ring-1 ring-gray-200"
                />
                <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F35271] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F35271] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F35271] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Templates for Spa Owner */}
          <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 border-t border-gray-150 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0">Quick Reply:</span>
            {OWNER_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(tmpl)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-[#FFEEF1] text-gray-700 hover:text-[#F35271] border border-gray-200 hover:border-[#F35271]/40 text-[10px] sm:text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer shadow-2xs shrink-0 active:scale-95"
              >
                {tmpl}
              </button>
            ))}
          </div>

          {/* Input Box (Sticky & Always Visible at Bottom) */}
          <div className="p-2 sm:p-3 bg-white border-t border-gray-200 flex items-center gap-2 min-w-0 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Reply to ${activeChat.guestName}...`}
              className="flex-1 min-w-0 px-3.5 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0D0D12] placeholder-gray-400 focus:outline-none focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271]/20 font-medium"
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2 sm:p-2.5 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white disabled:opacity-40 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 flex items-center justify-center"
              title="Send reply"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Guest Booking Details Modal */}
      <AnimatePresence>
        {showBookingModal && activeChat.booking && (
          <div className="fixed inset-0 z-50 bg-[#0D0D12]/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-gray-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-150">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#F35271]" />
                  <h3 className="text-sm font-bold text-[#0D0D12]">
                    Booking Details ({activeChat.booking.id})
                  </h3>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guest:</span>
                    <span className="font-bold text-[#0D0D12]">{activeChat.guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-semibold text-gray-800">{activeChat.guestPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service:</span>
                    <span className="font-bold text-[#F35271]">{activeChat.booking.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time Slot:</span>
                    <span className="font-bold text-[#0D0D12]">{activeChat.booking.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Therapist:</span>
                    <span className="font-semibold text-[#0D0D12]">{activeChat.booking.therapist}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assigned Suite:</span>
                    <span className="font-semibold text-gray-700">{activeChat.booking.room}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-[#FFEEF1] border border-[#F35271]/20">
                  <span className="font-bold text-[#0D0D12]">Total Amount Paid</span>
                  <span className="text-base font-extrabold text-[#F35271]">{activeChat.booking.amount}</span>
                </div>
              </div>

              <button
                onClick={() => setShowBookingModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#0D0D12] text-white text-xs font-bold hover:bg-black transition-all cursor-pointer"
              >
                Close Summary
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Notifications Center Modal */}
      <AnimatePresence>
        {showNotificationsModal && (
          <div className="fixed inset-0 z-50 bg-[#0D0D12]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-gray-150 bg-gradient-to-r from-[#FFEEF1] via-white to-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#F35271] text-white flex items-center justify-center shadow-xs">
                    <Bell className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-[#0D0D12]">
                        Notifications & Activity
                      </h3>
                      {unreadNotifCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#F35271] text-white text-[10px] font-extrabold">
                          {unreadNotifCount} new
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#757880]">
                      Real-time guest inquiries, bookings & platform alerts
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowNotificationsModal(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Toolbar & Filters */}
              <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-150 flex items-center justify-between gap-2 text-xs">
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setNotificationFilter('all')}
                    className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${notificationFilter === 'all'
                      ? 'bg-[#0D0D12] text-white shadow-2xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setNotificationFilter('unread')}
                    className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${notificationFilter === 'unread'
                      ? 'bg-[#F35271] text-white shadow-2xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                  >
                    Unread ({unreadNotifCount})
                  </button>
                </div>

                {/* Bulk Controls */}
                <div className="flex items-center gap-2">
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[#F35271] hover:text-[#c93c62] font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark all as read</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Clear all notifications"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-gray-100/70">
                {notifications.filter((n) => (notificationFilter === 'unread' ? !n.read : true)).length === 0 ? (
                  <div className="py-12 text-center text-xs text-gray-400 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                      <Bell className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-gray-600">No notifications here</p>
                    <p className="text-[11px]">You're all caught up on guest messages and updates!</p>
                  </div>
                ) : (
                  notifications
                    .filter((n) => (notificationFilter === 'unread' ? !n.read : true))
                    .map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`pt-2 p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 relative group ${!notif.read
                          ? 'bg-[#FFEEF1]/50 hover:bg-[#FFEEF1] border border-[#F35271]/20'
                          : 'hover:bg-gray-50 border border-transparent'
                          }`}
                      >
                        {/* Status Dot / Unread Indicator */}
                        <div className="pt-1 shrink-0">
                          {!notif.read ? (
                            <span className="block w-2.5 h-2.5 rounded-full bg-[#F35271] shadow-xs" />
                          ) : (
                            <span className="block w-2.5 h-2.5 rounded-full bg-gray-300" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <h4 className={`text-xs truncate ${!notif.read ? 'font-bold text-[#0D0D12]' : 'font-medium text-gray-700'}`}>
                                {notif.title}
                              </h4>
                              <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded-md bg-white border border-gray-200 text-[#F35271]">
                                {notif.badge}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                              {notif.time}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 leading-relaxed mb-2 break-words">
                            {notif.desc}
                          </p>

                          {/* Footer Actions on Item */}
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#F35271] font-semibold flex items-center gap-1 group-hover:underline">
                              <span>Open in Chat</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>

                            {/* Single Item Read/Unread Toggle Button */}
                            <button
                              onClick={(e) => handleToggleRead(notif.id, e)}
                              className="text-[10px] text-gray-400 hover:text-[#0D0D12] px-2 py-0.5 rounded-md hover:bg-white border border-transparent hover:border-gray-200 font-medium transition-all"
                              title={notif.read ? 'Mark as Unread' : 'Mark as Read'}
                            >
                              {notif.read ? 'Mark as unread' : 'Mark as read'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 bg-gray-50 border-t border-gray-150 flex items-center justify-between text-xs text-gray-500">
                <span>Clicking any notification opens the conversation directly</span>
                <button
                  onClick={() => setShowNotificationsModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-[#0D0D12] text-white text-xs font-bold hover:bg-black transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
