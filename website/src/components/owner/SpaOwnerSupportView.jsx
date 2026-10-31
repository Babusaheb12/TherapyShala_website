import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  LifeBuoy,
  ChevronDown,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  X,
  Tag,
  Calendar,
  User,
  Building2,
  MessageSquareQuote,
  CornerDownRight,
  Headphones,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getSpaOwnerSupportOverview,
  getSpaOwnerSupportTickets,
  createSpaOwnerSupportTicket,
  getSpaOwnerSupportTicketById,
  replySpaOwnerSupportTicket,
} from '../../services/spaOwner.service';

const SUPPORT_CATEGORIES = [
  { id: 'GENERAL', label: 'General / Account Inquiry', icon: LifeBuoy, desc: 'General queries regarding your spa account & platform operations' },
  { id: 'BOOKING_CUSTOMER', label: 'Booking & Customer Reschedule', icon: MessageSquare, desc: 'Assistance with appointments, cancellations & customer inquiries' },
  { id: 'PAYOUTS_COMMISSION', label: 'Payouts, Commissions & Ledger', icon: Zap, desc: 'Direct bank deposits, UPI settlements & financial ledgers' },
  { id: 'THERAPIST_ONBOARDING', label: 'Therapist Onboarding & Verification', icon: ShieldCheck, desc: 'Document verification, background checks & duty roster' },
  { id: 'TECHNICAL_ISSUE', label: 'Technical Issue / Portal Glitch', icon: AlertCircle, desc: 'App synchronization, portal bugs or real-time notification drops' },
];

const DEFAULT_FAQS = [
  {
    q: 'How fast does the TherapyShala Partner Support team respond?',
    a: 'Our partner desk operates 24/7. Live chat and priority tickets receive average responses within 5 to 15 minutes during standard operational hours (09:00 AM – 10:00 PM IST).'
  },
  {
    q: 'How do I resolve a contested customer cancellation penalty?',
    a: 'You can contest any deduction within 7 business days directly from the "Penalties & Audit Ledger" tab or by opening a priority ticket here with the Booking ID and timestamped logs.'
  },
  {
    q: 'When are sub-spa referral commissions credited to my account balance?',
    a: 'Referral rewards (2% per booking) are credited immediately once the customer completes their spa session and the booking status is marked as Fulfilled.'
  },
  {
    q: 'How do I submit an emergency request to disable bookings for maintenance?',
    a: 'Use the "Emergency Support Desk" hotline below or mark your therapists "Off Duty" in the Therapists Fleet manager for instant automated slot locking.'
  }
];

export default function SpaOwnerSupportView({
  ownerName = 'Spa Owner',
  spaName = 'My Sanctuary Spa',
  spaCode = 'SPA-873967',
  ownerEmail = 'owner@therapyshala.com',
  ownerPhone = '+91 9876543210',
  onNavigateToChatDesk
}) {
  // Form State matching POST /spa-owner/support/tickets:
  // { category, priority, relatedBookingId, subject, message }
  const [category, setCategory] = useState('GENERAL');
  const [priority, setPriority] = useState('NORMAL'); // 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  const [relatedBookingId, setRelatedBookingId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState('');

  // Overview API state (GET /spa-owner/support)
  const [overviewData, setOverviewData] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  // Tickets List API state (GET /spa-owner/support/tickets)
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Ticket Thread & Reply Modal (GET /spa-owner/support/tickets/<ID> & POST .../replies)
  const [activeTicket, setActiveTicket] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketDetailLoading, setTicketDetailLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replyError, setReplyError] = useState('');

  const [openFaq, setOpenFaq] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // 1. Fetch Support Overview
  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const res = await getSpaOwnerSupportOverview();
      if (res?.success) {
        setOverviewData(res.data);
      }
    } catch (err) {
      console.warn('Support overview notice:', err?.message || err);
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  // 2. Fetch Support Tickets
  const fetchTickets = useCallback(async (filter = statusFilter) => {
    setTicketsLoading(true);
    setTicketsError('');
    try {
      const params = filter && filter !== 'ALL' ? { status: filter } : {};
      const res = await getSpaOwnerSupportTickets(params);
      if (res?.success && Array.isArray(res.data)) {
        setTickets(res.data);
      } else if (Array.isArray(res?.tickets)) {
        setTickets(res.tickets);
      } else if (Array.isArray(res)) {
        setTickets(res);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.warn('Tickets fetch notice:', err?.message || err);
      setTicketsError(err?.data?.message || err?.message || 'Failed to retrieve support tickets.');
    } finally {
      setTicketsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOverview();
    fetchTickets();
  }, [fetchOverview, fetchTickets]);

  // 3. Submit New Ticket (POST /api/v1/spa-owner/support/tickets)
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(null);

    if (!subject.trim()) {
      setSubmitError('Please provide a subject line describing your inquiry.');
      return;
    }
    if (!message.trim()) {
      setSubmitError('Please provide the details or message of your request.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      category: category.toUpperCase(),
      priority: priority || 'NORMAL',
      relatedBookingId: relatedBookingId.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
    };

    try {
      const res = await createSpaOwnerSupportTicket(payload);
      setIsSubmitting(false);

      if (res?.success || res?.id || res?.data?.id) {
        const created = res.data || res;
        setSubmitSuccess(created);
        try {
          confetti({
            particleCount: 85,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F35271', '#10B981', '#FFD700', '#6366F1'],
          });
        } catch {
          // ignore confetti errors
        }

        // Reset form inputs
        setSubject('');
        setMessage('');
        setRelatedBookingId('');
        setPriority('NORMAL');

        // Refresh tickets list
        fetchTickets();
      } else {
        setSubmitError(res?.message || 'Failed to create support ticket. Please verify inputs.');
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error('Support ticket submission error:', err);
      setSubmitError(err?.data?.message || err?.message || 'Failed to submit support ticket.');
    }
  };

  // 4. Open Ticket Details (GET /api/v1/spa-owner/support/tickets/<ID>)
  const handleOpenTicketThread = async (ticket) => {
    const ticketId = ticket.id || ticket._id;
    if (!ticketId) return;

    setActiveTicket(ticket);
    setTicketModalOpen(true);
    setTicketDetailLoading(true);
    setReplyError('');
    setReplyMessage('');

    try {
      const res = await getSpaOwnerSupportTicketById(ticketId);
      if (res?.success && res.data) {
        setActiveTicket(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch full ticket details, using list snapshot:', err?.message || err);
    } finally {
      setTicketDetailLoading(false);
    }
  };

  // 5. Send Reply (POST /api/v1/spa-owner/support/tickets/<ID>/replies)
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicket) return;

    const ticketId = activeTicket.id || activeTicket._id;
    setIsReplying(true);
    setReplyError('');

    try {
      const res = await replySpaOwnerSupportTicket(ticketId, {
        message: replyMessage.trim(),
      });

      setIsReplying(false);
      setReplyMessage('');

      // Refresh ticket details
      if (res?.success) {
        const updatedRes = await getSpaOwnerSupportTicketById(ticketId);
        if (updatedRes?.success && updatedRes.data) {
          setActiveTicket(updatedRes.data);
        }
      } else {
        // Optimistically append reply
        const newReplyObj = {
          id: `REP-${Date.now()}`,
          message: replyMessage.trim(),
          senderRole: 'SPA_OWNER',
          senderName: ownerName,
          createdAt: new Date().toISOString(),
        };
        setActiveTicket((prev) => ({
          ...prev,
          replies: [...(prev?.replies || []), newReplyObj],
        }));
      }

      fetchTickets();
    } catch (err) {
      setIsReplying(false);
      console.error('Failed to post ticket reply:', err);
      setReplyError(err?.data?.message || err?.message || 'Failed to post reply.');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(spaCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello TherapyShala Partner Support,\n\nI need assistance with my spa sanctuary.\n• Spa Code: ${spaCode}\n• Business: ${spaName}\n• Owner: ${ownerName}\n\nPlease connect me with an agent.`
  );

  const activeFaqs = overviewData?.faqs || DEFAULT_FAQS;
  const supportPhone = overviewData?.contactPhone || '+91 98765 43210';
  const supportEmail = overviewData?.contactEmail || 'partner-support@therapyshala.com';
  const supportHours = overviewData?.supportHours || '24/7 Dedicated Support';

  return (
    <div className="space-y-6 min-w-0 font-sans-modern">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-[#121019] via-[#1B1627] to-[#0F0D16] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-purple-900/30">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-12 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-[#F35271]">
                <LifeBuoy className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F35271]">
                Partner Care & Priority Support
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-300">
                Support Desk Live ({supportHours})
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Direct Spa Partner Support
            </h2>
            <p className="text-xs sm:text-sm text-gray-300/90 max-w-2xl mt-1 leading-relaxed">
              Have an issue with customer appointments, therapist verification, payouts, or penalties? Reach out directly to our dedicated partner desk or create a priority ticket.
            </p>
          </div>

          {/* Quick Info Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2">
              <span className="text-gray-300">Your Spa Code:</span>
              <span className="font-mono font-bold text-white tracking-wider">{spaCode}</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="hover:text-[#F35271] text-gray-300 transition-colors cursor-pointer"
                title="Copy Spa Code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#F35271]" />
              <span className="text-gray-200 font-semibold truncate max-w-[200px]">{spaName}</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Partner Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Direct Channels Contact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* WhatsApp Priority Desk */}
        <a
          href={`https://wa.me/919876543210?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white rounded-3xl p-5 border border-emerald-100 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center justify-between pb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Instant (5 Min)
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-[#0D0D12] text-sm group-hover:text-emerald-600 transition-colors">
              WhatsApp Partner Desk
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Chat directly with our lead partner ops manager on WhatsApp.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>Launch WhatsApp Chat</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </a>

        {/* Priority Phone Hotline */}
        <div className="group bg-white rounded-3xl p-5 border border-rose-100 hover:border-rose-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#F35271] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F35271] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Hotline
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-[#0D0D12] text-sm group-hover:text-[#F35271] transition-colors">
              Direct Phone Support
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Available 09:00 AM – 10:00 PM IST daily for urgent emergencies.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#F35271]">
            <a href={`tel:${supportPhone.replace(/\s+/g, '')}`} className="hover:underline font-mono">
              {supportPhone}
            </a>
            <Headphones className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Email Escalations Desk */}
        <div className="group bg-white rounded-3xl p-5 border border-purple-100 hover:border-purple-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Official
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-[#0D0D12] text-sm group-hover:text-purple-600 transition-colors">
              Formal Written Inquiries
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Official disputes, contract reviews & partner onboarding verification.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-600 truncate">
            <a href={`mailto:${supportEmail}`} className="hover:underline truncate max-w-[210px]">
              {supportEmail}
            </a>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </div>
        </div>
      </div>

      {/* 3. Main Ticket Creation & Existing Tickets Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 Cols): Open New Support Ticket Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#0D0D12]">
                  Create New Priority Support Ticket
                </h3>
                <span className="text-[10px] font-mono font-bold bg-rose-50 text-[#F35271] px-2 py-0.5 rounded-md border border-rose-200">
                  POST /support/tickets
                </span>
              </div>
              <p className="text-xs text-[#757880] mt-0.5">
                Submit an official partner ticket directly to TherapyShala Operations with high-priority SLA.
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#F35271] flex items-center justify-center shrink-0">
              <Send className="w-5 h-5" />
            </div>
          </div>

          {/* Submission Success Alert */}
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-start justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Ticket Created Successfully!</div>
                  <p className="text-xs text-emerald-800 font-normal mt-0.5">
                    Ticket ID: <strong className="font-mono">{submitSuccess.id || submitSuccess._id || 'TKT-NEW'}</strong>. Our partner desk has been notified.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubmitSuccess(null)}
                className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Submission Error Alert */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{submitError}</span>
              </div>
              <button
                type="button"
                onClick={() => setSubmitError('')}
                className="text-red-700 hover:text-red-900 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-5">
            {/* 1. Category Selection */}
            <div>
              <label className="block text-xs font-bold text-[#0D0D12] mb-2 uppercase tracking-wider">
                Inquiry Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUPPORT_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-[#F35271] bg-[#FFEEF1]/60 text-[#0D0D12] shadow-2xs ring-1 ring-[#F35271]'
                          : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/60 text-gray-700'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#F35271] text-white' : 'bg-white text-gray-500 border border-gray-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs block leading-snug">{cat.label}</span>
                        <span className="text-[10px] text-gray-500 line-clamp-1">{cat.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Priority & Related Booking ID Dual Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0D0D12] mb-1.5 uppercase tracking-wider">
                  Priority Level *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none text-xs font-semibold bg-white cursor-pointer shadow-2xs"
                >
                  <option value="LOW">🟢 Low (General feedback / non-urgent)</option>
                  <option value="NORMAL">🟡 Normal (Standard 24-hr resolution)</option>
                  <option value="HIGH">🟠 High (Appointment or client dispute)</option>
                  <option value="URGENT">🔴 Urgent (Immediate operational escalation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D0D12] mb-1.5 uppercase tracking-wider">
                  Related Booking ID <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={relatedBookingId}
                  onChange={(e) => setRelatedBookingId(e.target.value)}
                  placeholder="e.g. BK-109482 or UUID"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none text-xs font-mono bg-white shadow-2xs"
                />
              </div>
            </div>

            {/* 3. Subject Line */}
            <div>
              <label className="block text-xs font-bold text-[#0D0D12] mb-1.5 uppercase tracking-wider">
                Subject Line *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue or request..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none text-xs font-semibold text-[#0D0D12] bg-white shadow-2xs"
              />
            </div>

            {/* 4. Detailed Message */}
            <div>
              <label className="block text-xs font-bold text-[#0D0D12] mb-1.5 uppercase tracking-wider">
                Detailed Message / Explanation *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain the full issue, affected therapist or customer details, and any actions taken so our support team can resolve it immediately..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none text-xs text-[#0D0D12] bg-white leading-relaxed resize-none shadow-2xs"
              />
            </div>

            {/* Owner Credentials Footnote */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-150 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#F35271]" />
                <span>Ticket registered under: <strong>{ownerName}</strong> ({spaCode})</span>
              </span>
              <span className="font-mono text-gray-500 truncate max-w-[200px]">{ownerEmail}</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-5 rounded-2xl bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Ticket to Partner Desk...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket to Priority Support</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column (5 Cols): Active Tickets Ledger & Quick FAQ Accordion */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Support Tickets List */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <h4 className="font-bold text-sm text-[#0D0D12]">Your Support Tickets</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fetchTickets()}
                  disabled={ticketsLoading}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition cursor-pointer"
                  title="Refresh tickets list"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${ticketsLoading ? 'animate-spin text-[#F35271]' : ''}`} />
                </button>
                <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  {tickets.length} Tickets
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto pb-1">
              {['ALL', 'OPEN', 'IN_REVIEW', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setStatusFilter(st);
                    fetchTickets(st);
                  }}
                  className={`px-2.5 py-1 rounded-xl font-bold transition cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#0D0D12] text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Tickets List Items */}
            {ticketsLoading && tickets.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 space-y-2">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#F35271]" />
                <p>Loading your support tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl p-4">
                <LifeBuoy className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                <p className="font-semibold text-gray-600">No support tickets found</p>
                <p className="text-[11px] mt-0.5">Tickets created using the form on the left will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto overscroll-contain pr-1">
                {tickets.map((t) => {
                  const tId = t.id || t._id;
                  const isResolved = t.status === 'RESOLVED' || t.status === 'CLOSED';
                  const isReview = t.status === 'IN_REVIEW';
                  const repliesCount = Array.isArray(t.replies) ? t.replies.length : (t.repliesCount || 0);

                  return (
                    <div
                      key={tId}
                      className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/80 hover:border-purple-300 hover:bg-purple-50/20 transition-all space-y-2 cursor-pointer group"
                      onClick={() => handleOpenTicketThread(t)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#0D0D12]">{tId}</span>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                              isResolved
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isReview
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}
                          >
                            {t.status || 'OPEN'}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover:text-[#F35271] transition-colors">
                        {t.subject}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200/60">
                        <span className="font-medium text-[10px] uppercase text-gray-400">
                          {t.category || 'GENERAL'} • Priority: <strong className="text-gray-700">{t.priority || 'NORMAL'}</strong>
                        </span>
                        <span className="text-purple-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-[11px]">
                          <span>{repliesCount > 0 ? `${repliesCount} Replies` : 'View Thread'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Support FAQ Accordion */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="font-bold text-sm text-[#0D0D12]">Partner Knowledge & FAQs</h4>
            </div>

            <div className="space-y-2.5">
              {activeFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gray-200/70 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left text-xs font-bold text-[#0D0D12] hover:text-[#F35271] flex items-center justify-between gap-2 cursor-pointer bg-white"
                    >
                      <span className="leading-snug">{faq.q}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 shrink-0 text-gray-400 transition-transform ${
                          isOpen ? 'rotate-180 text-[#F35271]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs text-gray-600 leading-relaxed bg-gray-50/50 border-t border-gray-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Ticket Thread Dossier & Reply Modal (GET .../tickets/<ID> & POST .../replies) */}
      <AnimatePresence>
        {ticketModalOpen && activeTicket && (
          <div
            onClick={() => setTicketModalOpen(false)}
            className="fixed inset-0 z-50 bg-[#0D0D12]/65 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200 cursor-default"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-[#0D0D12]">
                        {activeTicket.id || activeTicket._id}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        {activeTicket.status || 'OPEN'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        {activeTicket.category || 'GENERAL'}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-800 mt-0.5 truncate max-w-md">
                      {activeTicket.subject}
                    </h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTicketModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Conversation History */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
                {ticketDetailLoading ? (
                  <div className="py-8 text-center text-gray-400 space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#F35271]" />
                    <p>Fetching full ticket thread & agent notes...</p>
                  </div>
                ) : (
                  <>
                    {/* Original Inquiry Message */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-500 border-b border-gray-200/50 pb-1.5">
                        <span className="font-bold text-[#0D0D12] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#F35271]" />
                          <span>Initial Ticket Submission ({ownerName})</span>
                        </span>
                        <span className="text-[10px]">
                          {activeTicket.createdAt ? new Date(activeTicket.createdAt).toLocaleString() : ''}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {activeTicket.message || 'No description provided.'}
                      </p>
                      {activeTicket.relatedBookingId && (
                        <div className="pt-1.5 text-[11px] text-gray-500 font-mono">
                          Linked Booking: <strong className="text-[#F35271]">{activeTicket.relatedBookingId}</strong>
                        </div>
                      )}
                    </div>

                    {/* Replies Thread */}
                    {Array.isArray(activeTicket.replies) && activeTicket.replies.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                          Conversation Timeline ({activeTicket.replies.length})
                        </span>
                        {activeTicket.replies.map((reply, rIdx) => {
                          const isSupportAgent =
                            reply.senderRole === 'SUPPORT' ||
                            reply.senderRole === 'ADMIN' ||
                            reply.isAgent;

                          return (
                            <div
                              key={rIdx}
                              className={`p-4 rounded-2xl border space-y-1.5 ${
                                isSupportAgent
                                  ? 'bg-purple-50/60 border-purple-200 text-purple-950 ml-4'
                                  : 'bg-white border-gray-200 text-gray-800 mr-4 shadow-2xs'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px] pb-1 border-b border-black/5">
                                <span className="font-bold flex items-center gap-1.5">
                                  {isSupportAgent ? (
                                    <>
                                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                                      <span className="text-purple-700">TherapyShala Partner Desk</span>
                                    </>
                                  ) : (
                                    <>
                                      <User className="w-3.5 h-3.5 text-[#F35271]" />
                                      <span>{reply.senderName || ownerName}</span>
                                    </>
                                  )}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {reply.createdAt ? new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              <p className="text-xs leading-relaxed whitespace-pre-wrap">
                                {reply.message || reply.content || reply.text}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Modal Footer: Reply Input (POST /api/v1/spa-owner/support/tickets/<ID>/replies) */}
              <div className="p-4 border-t border-gray-200 bg-white shrink-0">
                {replyError && (
                  <p className="text-xs text-red-600 font-semibold mb-2">
                    {replyError}
                  </p>
                )}
                <form onSubmit={handleSendReply} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply to the support agent..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none text-xs text-[#0D0D12] bg-gray-50/70 shadow-2xs"
                  />
                  <button
                    type="submit"
                    disabled={isReplying || !replyMessage.trim()}
                    className="px-4 py-2.5 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
                  >
                    {isReplying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
