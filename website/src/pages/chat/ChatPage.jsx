import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Send,
  Paperclip,
  Smile,
  Image as ImageIcon,
  Mic,
  MoreVertical,
  Phone,
  Video,
  Search,
  Check,
  CheckCheck,
  ArrowLeft,
  Calendar,
  ChevronRight,
  Star,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Info,
  X,
  PhoneOff,
  MicOff,
  Volume2,
  Share2,
  ExternalLink,
  Bot,
  UserCheck,
  Heart,
  FileText,
  Compass,
  Plus
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import notificationSound from '../../assets/notification.wav';

// Default initial conversations data
const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-ai-concierge',
    name: 'TherapyShala AI Concierge',
    type: 'ai',
    category: '24/7 Wellness Assistant',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    isVerified: true,
    rating: 5.0,
    reviewCount: 1420,
    unreadCount: 0,
    lastTime: 'Just now',
    location: 'TherapyShala Intelligent Core',
    address: 'Instant platform concierge for instant bookings, recommendations & queries',
    hours: '24 Hours / 7 Days',
    phone: '+91 1800 890 2244',
    pinned: true,
    messages: [
      {
        id: 'm1',
        sender: 'partner',
        text: 'Namaste! 🙏 Welcome to TherapyShala Concierge. I can help you discover verified spas, book appointments, check slot availability, or answer questions about wellness rituals.',
        timestamp: '10:00 AM',
        status: 'read'
      },
      {
        id: 'm2',
        sender: 'partner',
        type: 'suggestion_card',
        title: 'Popular Luxury Experiences Today',
        description: 'Selected treatments with exclusive 20-30% off passes at top sanctuaries in Jaipur & Bangalore.',
        badge: 'Top Pick',
        actionText: 'View Today Deals',
        timestamp: '10:01 AM',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-aura-luxe',
    name: 'Aura Luxe Wellness Sanctuary',
    type: 'sanctuary',
    category: 'Luxury Hydro-Spa & Salon',
    avatar: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80',
    isOnline: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 384,
    unreadCount: 1,
    lastTime: '10:24 AM',
    location: 'Tonk Road, Jaipur',
    address: 'Plot 18, Near Rambagh Palace, Tonk Road, Jaipur, Rajasthan',
    hours: '09:00 AM - 09:30 PM (Open Today)',
    phone: '+91 98290 11223',
    pinned: true,
    messages: [
      {
        id: 'al-1',
        sender: 'partner',
        text: 'Greetings from Aura Luxe! We have reserved your 90-minute Imperial Swedish Aromatherapy slot for tomorrow.',
        timestamp: '10:15 AM',
        status: 'read'
      },
      {
        id: 'al-2',
        sender: 'partner',
        type: 'booking_card',
        bookingId: 'TS-AUR-9842',
        serviceName: '90-Min Imperial Swedish Aromatherapy',
        therapist: 'Dr. Priya Sen',
        dateTime: 'Tomorrow, Saturday · 04:00 PM',
        room: 'Private Lotus Hydro-Suite #3',
        price: '₹3,499',
        statusBadge: 'Confirmed',
        timestamp: '10:16 AM',
        status: 'read'
      },
      {
        id: 'al-3',
        sender: 'user',
        text: 'Thank you! Is valet parking available at your Tonk Road branch?',
        timestamp: '10:20 AM',
        status: 'read'
      },
      {
        id: 'al-4',
        sender: 'partner',
        text: 'Yes, complimentary premium valet parking is available right at Gate 2 opposite Central Park. Feel free to reach 10 minutes early for our welcoming organic herbal infusion.',
        timestamp: '10:24 AM',
        status: 'unread'
      }
    ]
  },
  {
    id: 'conv-therapist-ananya',
    name: 'Ananya Sharma',
    type: 'therapist',
    category: 'Senior Ayurvedic & Deep Tissue Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    isOnline: false,
    lastSeen: 'Active 20m ago',
    isVerified: true,
    rating: 4.95,
    reviewCount: 219,
    unreadCount: 0,
    lastTime: 'Yesterday',
    location: 'Resident Therapist at Aura Luxe',
    address: 'Certified Kerala Ayurveda Practitioner (CIDESCO Gold Medalist)',
    hours: 'Available Slots: 11:00 AM - 07:00 PM',
    phone: '+91 91234 56780',
    messages: [
      {
        id: 'as-1',
        sender: 'partner',
        text: 'Namaste! Looking forward to your customized Marma & Abhyanga therapy session. To ensure the best release of muscular tension, I recommend light hydration and avoiding a heavy meal 1 hour prior.',
        timestamp: 'Yesterday 05:40 PM',
        status: 'read'
      },
      {
        id: 'as-2',
        sender: 'user',
        text: 'Got it, thank you Ananya! Should I mention any specific lower back stiffness during the intake?',
        timestamp: 'Yesterday 06:10 PM',
        status: 'read'
      },
      {
        id: 'as-3',
        sender: 'partner',
        text: 'Yes absolutely, I have noted your lower back focus. We will apply warm Dhanwantharam thailam along the lumbar spine for deeper soothing relief.',
        timestamp: 'Yesterday 06:15 PM',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-urban-glow',
    name: 'Urban Glow Luxury Hair & Skin Salon',
    type: 'sanctuary',
    category: 'Boutique Salon & Aesthetics',
    avatar: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80',
    isOnline: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 195,
    unreadCount: 0,
    lastTime: 'Oct 28',
    location: 'C-Scheme, Jaipur',
    address: 'Shop 4, Ahinsa Circle, C-Scheme, Jaipur',
    hours: '10:00 AM - 08:30 PM',
    phone: '+91 99887 66554',
    messages: [
      {
        id: 'ug-1',
        sender: 'partner',
        text: 'Hello! You have an unredeemed 25% birthday voucher valid on our Kérastase Caviar Hair Ritual. Would you like us to hold a slot for you this weekend?',
        timestamp: 'Oct 28, 02:15 PM',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-support',
    name: 'TherapyShala Help & Support',
    type: 'support',
    category: 'Platform Concierge & Grievances',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    isVerified: true,
    rating: 5.0,
    reviewCount: 520,
    unreadCount: 0,
    lastTime: 'Oct 24',
    location: 'TherapyShala Customer Care HQ',
    address: 'Priority 1-on-1 assistance for refunds, modifications, and partner verifications',
    hours: '08:00 AM - 11:00 PM',
    phone: '+91 80000 12345',
    messages: [
      {
        id: 'sp-1',
        sender: 'partner',
        text: 'Your reschedule request for Booking #TS-8812 was approved by the sanctuary without any cancellation penalty fee. Have a revitalizing experience!',
        timestamp: 'Oct 24, 11:30 AM',
        status: 'read'
      }
    ]
  }
];

const QUICK_PROMPTS = {
  ai: [
    'Recommend top couples spa in Jaipur',
    'What are the best deep-tissue massage packages?',
    'How do I cancel or reschedule my booking?',
    'Show me today discount coupons'
  ],
  sanctuary: [
    'Can I arrive 15 minutes early?',
    'Is valet parking available?',
    'Do you have steam & sauna access included?',
    'Can I upgrade my therapist to Senior Master?'
  ],
  therapist: [
    'I have minor neck stiffness today',
    'Which massage oil do you recommend?',
    'Can we focus more on shoulders and calves?'
  ],
  support: [
    'Where is my refund invoice?',
    'Help me modify my appointment time',
    'Need help with payment confirmation'
  ]
};

const EMOJI_PALETTE = ['🌸', '💆‍♀️', '✨', '🙏', '💖', '🌿', '🧖‍♂️', '⭐', '👍', '☕', '🕯️', '📅'];

export default function ChatPage() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState('conv-ai-concierge');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [callModal, setCallModal] = useState(null); // { type: 'audio' | 'video', active: true, duration: 0 }
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [soundPlaybackBlocked, setSoundPlaybackBlocked] = useState(false);

  // Mobile navigation state
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const notificationAudioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio(notificationSound);
    audio.preload = 'auto';
    notificationAudioRef.current = audio;
    return () => {
      audio.pause();
      notificationAudioRef.current = null;
    };
  }, []);

  const playIncomingMessageSound = () => {
    try {
      if (!notificationAudioRef.current) {
        notificationAudioRef.current = new Audio(notificationSound);
        notificationAudioRef.current.preload = 'auto';
      }
      notificationAudioRef.current.currentTime = 0;
      notificationAudioRef.current.volume = 1;
      notificationAudioRef.current.play().then(() => {
        setSoundPlaybackBlocked(false);
      }).catch((err) => {
        setSoundPlaybackBlocked(true);
        console.warn('Message notification audio was blocked:', err?.message);
      });
    } catch (err) {
      setSoundPlaybackBlocked(true);
      console.warn('Could not play message notification audio:', err);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isTyping]);

  // Mark active conversation messages as read
  useEffect(() => {
    if (activeId) {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeId && c.unreadCount > 0) {
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
  }, [activeId]);

  // Simulated Call Timer
  useEffect(() => {
    let timer;
    if (callModal) {
      timer = setInterval(() => {
        setCallModal((prev) => (prev ? { ...prev, duration: prev.duration + 1 } : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callModal?.active]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectConversation = (convId) => {
    setActiveId(convId);
    setMobileShowChat(true);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
  };

  const handleSendMessage = (customText = null) => {
    const messageContent = (customText || inputText).trim();
    if (!messageContent) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      status: 'sent'
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            lastTime: 'Just now',
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    if (!customText) {
      setInputText('');
    }
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);

    // Simulate Partner/AI Automated Contextual Response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';
      const conv = activeConversation;

      if (conv.type === 'ai') {
        if (messageContent.toLowerCase().includes('couple') || messageContent.toLowerCase().includes('jaipur')) {
          replyText =
            '✨ For couples in Jaipur, Aura Luxe Wellness Sanctuary offers an exclusive Hydro-Suite with dual volcanic stone therapy and rose petal bath. Would you like me to book a slot or show package rates?';
        } else if (messageContent.toLowerCase().includes('cancel') || messageContent.toLowerCase().includes('reschedule')) {
          replyText =
            'You can reschedule or cancel any appointment free of charge up to 4 hours before the session directly from your Account > Appointments tab, or I can help you here!';
        } else if (messageContent.toLowerCase().includes('price') || messageContent.toLowerCase().includes('coupon')) {
          replyText =
            '🎉 You have code "FIRSTWELLNESS" for 20% off up to ₹600 on any initial booking! Applied automatically at checkout.';
        } else {
          replyText =
            'Thank you for reaching out! I have searched our platform database. All our partners adhere to strict five-point hygiene audits, organic certified oils, and verified certified therapists. How else can I assist your wellness journey today?';
        }
      } else if (conv.type === 'sanctuary') {
        replyText =
          'Thank you for your note! Our front-desk concierge has recorded your preference. We ensure soothing ambient aromatherapy and temperature tailored to your comfort upon arrival.';
      } else if (conv.type === 'therapist') {
        replyText =
          'Noted with care! I will prepare the treatment room with custom botanical pressure oils and give special attention to that zone. See you soon! 🙏';
      } else {
        replyText =
          'Thank you for connecting with TherapyShala Support. A concierge specialist has verified your inquiry and is assisting you right away.';
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'partner',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        status: 'read'
      };

      playIncomingMessageSound();
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeId) {
            return {
              ...c,
              lastTime: 'Just now',
              messages: [...c.messages, botMsg]
            };
          }
          return c;
        })
      );
    }, 1300);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeImageURL = URL.createObjectURL(file);
    const newMsg = {
      id: `img-${Date.now()}`,
      sender: 'user',
      type: 'image',
      imageUrl: fakeImageURL,
      caption: file.name,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      status: 'read'
    };

    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, newMsg] } : c))
    );
    setShowAttachmentMenu(false);
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some((m) => m.text?.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === 'all') return true;
    if (filterType === 'sanctuary') return c.type === 'sanctuary';
    if (filterType === 'therapist') return c.type === 'therapist';
    if (filterType === 'ai_support') return c.type === 'ai' || c.type === 'support';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFF0F3]/40 flex flex-col font-sans-modern antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 pt-24 pb-8 flex flex-col">
        {/* Top Breadcrumb & Page Banner */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-[#AFB0B7]/25 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-[#757880]">
            <Link to="/" className="hover:text-[#DE4B73] transition-colors font-medium">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/explore" className="hover:text-[#DE4B73] transition-colors font-medium">Sanctuaries</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#DE4B73] font-semibold">Concierge & Messages</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sanctuary Network
            </span>
            <Link
              to="/book"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#DE4B73] to-[#FA7B9B] px-3.5 py-1.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Appointment
            </Link>
          </div>
        </div>

        {soundPlaybackBlocked && (
          <div
            role="alert"
            className="mb-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-xs">
              Your browser blocked message sounds. Enable sound to hear incoming replies.
            </p>
            <button
              type="button"
              onClick={playIncomingMessageSound}
              className="shrink-0 rounded-xl bg-amber-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-700"
            >
              Enable sound
            </button>
          </div>
        )}

        {/* Main Chat Layout Container */}
        <div className="flex-1 bg-white rounded-3xl border border-[#AFB0B7]/30 shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[640px] max-h-[calc(100vh-180px)]">
          {/* ================= LEFT SIDEBAR: CONVERSATION LIST ================= */}
          <div
            className={`w-full lg:w-88 xl:w-96 border-r border-gray-150 flex flex-col bg-[#FFF9FA]/60 ${mobileShowChat ? 'hidden lg:flex' : 'flex'
              }`}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-150/80 bg-white/90 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#DE4B73] to-[#FA7B9B] flex items-center justify-center text-white shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0D0D12] tracking-tight font-serif-luxury">
                      Messages
                    </h2>
                    <p className="text-[11px] text-[#757880]">Sanctuaries & Therapists</p>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectConversation('conv-ai-concierge')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FCE4EC] hover:bg-[#FA7B9B]/20 text-[#DE4B73] text-xs font-semibold flex items-center gap-1 transition-all"
                  title="Ask TherapyShala AI"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Ask</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search chats, therapists, rituals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200/80 rounded-xl text-xs text-[#0D0D12] placeholder-gray-400 focus:outline-none focus:border-[#DE4B73] focus:ring-1 focus:ring-[#DE4B73]/20 transition-all"
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

              {/* Quick Filters */}
              <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'sanctuary', label: 'Spas' },
                  { id: 'therapist', label: 'Therapists' },
                  { id: 'ai_support', label: 'AI & Help' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id)}
                    className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${filterType === tab.id
                      ? 'bg-[#DE4B73] text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/70'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100/80 p-2 space-y-1">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  No conversations match "{searchQuery}"
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = conv.id === activeId;
                  const lastMessage = conv.messages[conv.messages.length - 1];

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 relative group ${isActive
                        ? 'bg-white shadow-md border border-[#DE4B73]/20 ring-1 ring-[#DE4B73]/10'
                        : 'hover:bg-white/80 border border-transparent'
                        }`}
                    >
                      {/* Avatar with Online Pulse */}
                      <div className="relative shrink-0">
                        <img
                          src={conv.avatar}
                          alt={conv.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                        />
                        {conv.isOnline ? (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                        ) : (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gray-300 border-2 border-white" />
                        )}
                        {conv.type === 'ai' && (
                          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[#DE4B73] text-white flex items-center justify-center text-[9px] shadow-xs">
                            <Sparkles className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      {/* Content Preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h3 className="text-xs font-bold text-[#0D0D12] truncate font-serif-luxury">
                              {conv.name}
                            </h3>
                            {conv.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-[#DE4B73] shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                            {conv.lastTime}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#757880] truncate font-medium mb-1">
                          {conv.category}
                        </div>

                        {/* Last Message Snippet */}
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-gray-500 truncate flex-1">
                            {lastMessage?.type === 'booking_card' ? (
                              <span className="text-[#DE4B73] font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3 inline" /> Appointment Confirmed
                              </span>
                            ) : (
                              lastMessage?.text || 'Sent an attachment'
                            )}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-[#DE4B73] text-white text-[10px] font-bold">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Platform Trust Footer */}
            <div className="p-3 bg-white/70 border-t border-gray-150 text-[11px] text-gray-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified TherapyShala Sanctuary Encrypted Channel</span>
            </div>
          </div>

          {/* ================= RIGHT PANEL: ACTIVE CHAT WINDOW ================= */}
          <div
            className={`flex-1 flex flex-col bg-[#FFF9FA]/30 ${!mobileShowChat ? 'hidden lg:flex' : 'flex'
              }`}
          >
            {/* Active Chat Header */}
            <div className="px-4 py-3 bg-white border-b border-gray-150 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="lg:hidden p-2 -ml-1 text-gray-600 hover:text-[#0D0D12] hover:bg-gray-100 rounded-xl"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Partner Avatar & Status */}
                <div
                  className="relative cursor-pointer shrink-0"
                  onClick={() => setShowDetailsPanel(!showDetailsPanel)}
                >
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-[#FA7B9B]/30 shadow-xs"
                  />
                  {activeConversation.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2
                      onClick={() => setShowDetailsPanel(!showDetailsPanel)}
                      className="text-sm font-bold text-[#0D0D12] truncate cursor-pointer hover:text-[#DE4B73] transition-colors font-serif-luxury"
                    >
                      {activeConversation.name}
                    </h2>
                    {activeConversation.isVerified && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#FCE4EC] text-[#DE4B73] text-[10px] font-semibold">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#757880]">
                    {isTyping ? (
                      <span className="text-[#DE4B73] font-semibold flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#DE4B73] animate-bounce" />
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#DE4B73] animate-bounce [animation-delay:0.2s]" />
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#DE4B73] animate-bounce [animation-delay:0.4s]" />
                        typing...
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {activeConversation.rating}
                        </span>
                        <span>•</span>
                        <span className="truncate">{activeConversation.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">

                <button
                  onClick={() => setShowDetailsPanel(!showDetailsPanel)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${showDetailsPanel
                    ? 'bg-[#DE4B73] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  title="Sanctuary Info & Amenities"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body & Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#FFF9FA]/30 via-white to-[#FFF9FA]/40">
              {/* Privacy Notice Banner */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-gray-200/80 shadow-2xs text-[11px] text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>End-to-end encrypted concierge conversation</span>
                </div>
              </div>

              {/* Messages Iteration */}
              {activeConversation.messages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <img
                        src={activeConversation.avatar}
                        alt=""
                        className="w-7 h-7 rounded-xl object-cover ring-1 ring-gray-200 shrink-0 mb-1"
                      />
                    )}

                    <div className={`max-w-md sm:max-w-lg space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                      {/* Standard Text Message */}
                      {msg.text && (
                        <div
                          className={`p-3.5 text-xs sm:text-sm leading-relaxed rounded-2xl shadow-xs ${isUser
                            ? 'bg-gradient-to-r from-[#DE4B73] to-[#FA7B9B] text-white rounded-br-xs'
                            : 'bg-white text-[#0D0D12] border border-gray-200/70 rounded-bl-xs'
                            }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isUser ? 'text-white/80' : 'text-gray-400'
                              }`}
                          >
                            <span>{msg.timestamp}</span>
                            {isUser && (
                              <span>
                                {msg.status === 'read' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-white" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-white/70" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Interactive Booking Card Message */}
                      {msg.type === 'booking_card' && (
                        <div className="bg-white border-2 border-[#DE4B73]/25 rounded-2xl p-4 shadow-md max-w-sm">
                          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-150">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#DE4B73] bg-[#FCE4EC] px-2 py-0.5 rounded-full">
                              {msg.statusBadge}
                            </span>
                            <span className="text-[11px] font-mono font-semibold text-gray-500">
                              {msg.bookingId}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#0D0D12] mb-1 font-serif-luxury">
                            {msg.serviceName}
                          </h4>

                          <div className="space-y-1.5 text-xs text-gray-600 mb-3.5">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-[#DE4B73]" />
                              <span>{msg.dateTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-3.5 h-3.5 text-[#DE4B73]" />
                              <span>Therapist: {msg.therapist}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#DE4B73]" />
                              <span>{msg.room}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div>
                              <span className="text-[10px] text-gray-400 block">Total Paid</span>
                              <span className="text-sm font-bold text-[#0D0D12]">{msg.price}</span>
                            </div>
                            <Link
                              to="/account"
                              className="px-3.5 py-1.5 rounded-full bg-[#DE4B73] text-white text-xs font-semibold hover:bg-[#c93c62] transition-colors shadow-xs"
                            >
                              Manage Slot
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Interactive Promotion Card */}
                      {msg.type === 'suggestion_card' && (
                        <div className="bg-gradient-to-br from-[#FFF0F3] to-white border border-[#FA7B9B]/40 rounded-2xl p-4 shadow-sm max-w-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#DE4B73] text-white px-2 py-0.5 rounded-full">
                              {msg.badge}
                            </span>
                            <Sparkles className="w-4 h-4 text-[#DE4B73]" />
                          </div>
                          <h4 className="text-sm font-bold text-[#0D0D12] font-serif-luxury mb-1">
                            {msg.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                            {msg.description}
                          </p>
                          <Link
                            to="/offers"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#DE4B73] hover:text-[#c93c62]"
                          >
                            <span>{msg.actionText}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}

                      {/* Image Message */}
                      {msg.type === 'image' && (
                        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm max-w-xs">
                          <img src={msg.imageUrl} alt="attachment" className="w-full h-44 object-cover" />
                          {msg.caption && (
                            <div className="p-2 bg-white text-xs text-gray-700">{msg.caption}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator bubble */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <img
                    src={activeConversation.avatar}
                    alt=""
                    className="w-7 h-7 rounded-xl object-cover ring-1 ring-gray-200"
                  />
                  <div className="bg-white border border-gray-200/80 px-4 py-2.5 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DE4B73] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DE4B73] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DE4B73] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Contextual Action Chips */}
            <div className="px-4 py-2 bg-white/80 border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0">Quick Ask:</span>
              {(QUICK_PROMPTS[activeConversation.type] || QUICK_PROMPTS.ai).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1 rounded-full bg-[#FFF0F3] hover:bg-[#FCE4EC] text-[#DE4B73] text-[11px] font-medium whitespace-nowrap transition-all border border-[#FA7B9B]/30 hover:border-[#DE4B73] cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar & Controls */}
            <div className="p-3 sm:p-4 bg-white border-t border-gray-150 relative">
              {/* Emoji Picker Popup */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-20 left-4 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 z-30 flex flex-wrap gap-2 max-w-xs"
                  >
                    {EMOJI_PALETTE.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setInputText((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-xl p-1.5 hover:bg-gray-100 rounded-lg transition-transform hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Attachment Picker Popup */}
              <AnimatePresence>
                {showAttachmentMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-20 left-12 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-30 flex flex-col gap-1 min-w-[180px]"
                  >
                    <label className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FCE4EC]/50 hover:text-[#DE4B73] rounded-xl cursor-pointer">
                      <ImageIcon className="w-4 h-4 text-[#DE4B73]" />
                      <span>Upload Photos</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => {
                        handleSendMessage('📍 Shared location: Tonk Road, Jaipur');
                        setShowAttachmentMenu(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FCE4EC]/50 hover:text-[#DE4B73] rounded-xl cursor-pointer text-left"
                    >
                      <MapPin className="w-4 h-4 text-[#DE4B73]" />
                      <span>Send My Location</span>
                    </button>

                    <button
                      onClick={() => {
                        handleSendMessage('🗓️ Please check if slot 04:00 PM is free today');
                        setShowAttachmentMenu(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FCE4EC]/50 hover:text-[#DE4B73] rounded-xl cursor-pointer text-left"
                    >
                      <Calendar className="w-4 h-4 text-[#DE4B73]" />
                      <span>Check Slot Availability</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actual Input Row */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachmentMenu(!showAttachmentMenu);
                    setShowEmojiPicker(false);
                  }}
                  className="p-2.5 text-gray-500 hover:text-[#DE4B73] hover:bg-[#FCE4EC]/40 rounded-xl transition-all cursor-pointer"
                  title="Attach Media or Location"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowAttachmentMenu(false);
                  }}
                  className="p-2.5 text-gray-500 hover:text-[#DE4B73] hover:bg-[#FCE4EC]/40 rounded-xl transition-all cursor-pointer"
                  title="Emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
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
                    placeholder={`Message ${activeConversation.name}...`}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-[#0D0D12] placeholder-gray-400 focus:outline-none focus:border-[#DE4B73] focus:ring-2 focus:ring-[#DE4B73]/20 transition-all"
                  />
                </div>

                {inputText.trim() ? (
                  <button
                    onClick={() => handleSendMessage()}
                    className="p-3 rounded-2xl bg-gradient-to-r from-[#DE4B73] to-[#FA7B9B] text-white hover:shadow-md hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendMessage('🎙️ Voice message recorded (0:12s)')}
                    className="p-3 text-gray-500 hover:text-[#DE4B73] hover:bg-[#FCE4EC]/40 rounded-2xl transition-all cursor-pointer"
                    title="Send Voice Note"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT DRAWER: SANCTUARY & THERAPIST INFO ================= */}
          <AnimatePresence>
            {showDetailsPanel && (
              <motion.div
                initial={{ opacity: 0, x: 50, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 320 }}
                exit={{ opacity: 0, x: 50, width: 0 }}
                transition={{ duration: 0.25 }}
                className="hidden xl:flex flex-col border-l border-gray-150 bg-white p-5 overflow-y-auto space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Profile & Details
                  </h3>
                  <button
                    onClick={() => setShowDetailsPanel(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center">
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    className="w-20 h-20 rounded-3xl object-cover mx-auto ring-4 ring-[#FCE4EC] shadow-md mb-3"
                  />
                  <h4 className="text-sm font-bold text-[#0D0D12] font-serif-luxury">
                    {activeConversation.name}
                  </h4>
                  <p className="text-xs text-[#DE4B73] font-medium">{activeConversation.category}</p>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200 mt-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{activeConversation.rating}</span>
                    <span className="text-amber-500/70">({activeConversation.reviewCount} verified reviews)</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-150/80 space-y-2">
                    <div className="flex items-start gap-2.5 text-gray-600">
                      <Clock className="w-4 h-4 text-[#DE4B73] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#0D0D12] block">Operating Hours</span>
                        <span>{activeConversation.hours}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-gray-600 pt-2 border-t border-gray-200/60">
                      <MapPin className="w-4 h-4 text-[#DE4B73] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#0D0D12] block">Sanctuary Address</span>
                        <span>{activeConversation.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to="/book"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#DE4B73] to-[#FA7B9B] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all active:scale-98"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Online Slot</span>
                    </Link>

                    <Link
                      to="/services"
                      className="w-full py-2.5 rounded-xl bg-white border border-gray-200 text-[#0D0D12] text-xs font-bold text-center flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-all"
                    >
                      <Compass className="w-4 h-4 text-[#DE4B73]" />
                      <span>Browse Ritual Menu</span>
                    </Link>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-150">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Platform Guarantees
                  </h5>
                  <ul className="space-y-1.5 text-[11px] text-gray-600">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% Certified Practitioners</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Zero-Penalty Reschedules</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Safe Hygiene Assured</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ================= AUDIO / VIDEO CALL SIMULATION MODAL ================= */}
      <AnimatePresence>
        {false && (
          <div className="fixed inset-0 z-50 bg-[#0D0D12]/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1A1A24] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center text-white shadow-2xl relative overflow-hidden"
            >
              {/* Background ambient glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#DE4B73]/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#FA7B9B]/20 blur-3xl pointer-events-none" />

              <span className="text-[11px] uppercase tracking-widest text-[#FA7B9B] font-bold block mb-4">
                {callModal.type === 'video' ? 'Virtual Video Consultation' : 'Live Audio Consultation'}
              </span>

              <div className="relative inline-block mb-4">
                <img
                  src={activeConversation.avatar}
                  alt={activeConversation.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-[#DE4B73]/50 mx-auto shadow-xl"
                />
                <span className="absolute inset-0 rounded-full border-2 border-[#FA7B9B] animate-ping" />
              </div>

              <h3 className="text-lg font-bold font-serif-luxury mb-1">
                {activeConversation.name}
              </h3>
              <p className="text-xs text-gray-400 mb-3">{activeConversation.category}</p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-mono font-medium mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{formatDuration(callModal.duration)}</span>
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3.5 rounded-full transition-all cursor-pointer ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  <MicOff className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setCallModal(null)}
                  className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  title="End Call"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`p-3.5 rounded-full transition-all cursor-pointer ${isSpeakerOn ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  title="Speaker"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
