import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  UserPlus,
  CalendarCheck,
  AlertTriangle,
  Percent,
  Wallet,
  Settings,
  Phone,
  Mail,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  UploadCloud,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Menu,
  X,
  FileText,
  DollarSign,
  Eye,
  SlidersHorizontal,
  Bell,
  Lock,
  Calendar,
  ExternalLink,
  User,
  Hash,
  CalendarRange,
  RotateCcw,
  Star,
  Video,
  TrendingUp,
  Receipt,
  Landmark,
  Edit2,
  Smartphone,
  Send,
  Award,
  Share2,
  Tag,
  Network,
  Coins,
  MessageSquare,
  Volume2,
  VolumeX,
  LifeBuoy,
  HelpCircle,
} from 'lucide-react';
import notificationSound from '../../assets/notification.wav';
import TherapyshalaLogo from '../../components/TherapyshalaLogo';
import LanguageSelect from '../../components/LanguageSelect';
import GoogleLocationPicker from '../../components/GoogleLocationPicker';
import TherapistOnboardingInPage from '../../components/owner/TherapistOnboardingInPage';
import TherapistDetailInPage from '../../components/owner/TherapistDetailInPage';
import BookingDetailInPage from '../../components/owner/BookingDetailInPage';
import PenaltyAuditInPage from '../../components/owner/PenaltyAuditInPage';
import PayoutAccountInPage from '../../components/owner/PayoutAccountInPage';
import PayoutRequestInPage from '../../components/owner/PayoutRequestInPage';
import SubOwnerDetailModal from '../../components/owner/SubOwnerDetailModal';
import SpaOwnerChatView from '../../components/owner/SpaOwnerChatView';
import SpaOwnerReferralCommissionCard from '../../components/owner/SpaOwnerReferralCommissionCard';
import SpaOwnerProfileEditor from '../../components/owner/SpaOwnerProfileEditor';
import SpaOwnerSupportView from '../../components/owner/SpaOwnerSupportView';
import { resolveMediaUrl } from '../../utils/mediaUtils';
import { useAuth } from '../../context/AuthContext';
import {
  getSpaOwnerDashboard,
  getSpaOwnerProfile,
  getSpaOwnerTherapists,
  updateSpaOwnerTherapist,
  updateSpaOwnerTherapistDutyStatus,
  onboardTherapist,
  uploadAsset,
  getSpaOwnerBookings,
  getSpaOwnerBookingDetails,
  getSpaOwnerCommissions,
  getSpaOwnerPayoutAccount,
  updateSpaOwnerPayoutAccount,
  createSpaOwnerPayoutRequest,
  getSpaOwnerPayoutHistory,
  getSpaOwnerCancellationPolicy,
  getSpaOwnerCancellationPenaltiesReport,
  getSponsoredSpas,
  getSubOwners,
  getSpaOwnerNotifications,
  markSpaOwnerNotificationAsRead,
} from '../../services/spaOwner.service';
import {
  connectSpaOwnerSocket,
  disconnectSpaOwnerSocket,
  onSpaOwnerNotification,
  onSpaOwnerSocketReady,
  onSocketConnect,
  onSocketConnectError,
  onSocketDisconnect,
} from '../../services/spaOwnerSocket';

const getOwnerNotificationCategory = (type) => {
  type = String(type || '');
  if (type === 'OWNER_ACCOUNT_APPROVED') return 'account';
  if (type === 'SPONSORED_SPA_APPROVED') return 'sponsored';
  if (type.startsWith('THERAPIST_')) return 'therapists';
  if (type === 'SUPPORT_REPLY' || type === 'SUPPORT_TICKET_STATUS_CHANGED') return 'support';
  if (
    type === 'COMMISSION_EARNED' ||
    type === 'REFERRAL_COMMISSION_EARNED' ||
    type.startsWith('PAYOUT_')
  )
    return 'payments';
  if (
    type === 'NEW_APPOINTMENT' ||
    type.startsWith('BOOKING_') ||
    type === 'THERAPIST_CANCELLATION_PENALTY'
  )
    return 'bookings';
  return 'updates';
};

const getOwnerNotificationSection = (notification) => {
  const category = notification?.category || getOwnerNotificationCategory(notification?.raw?.type);
  if (category === 'bookings') return 'bookings';
  if (category === 'therapists') return 'therapists';
  if (category === 'support') return 'support';
  if (category === 'sponsored') return 'sponsored';
  if (category === 'payments')
    return notification?.raw?.type?.includes('COMMISSION') ? 'commission' : 'payout';
  return 'overview';
};

const EMPTY_CANCELLATION_PENALTIES_REPORT = {
  summary: {
    totalCancellations: 0,
    customerCancellations: 0,
    therapistCancellations: 0,
    customerPaid: {
      minor: 0,
      rupees: 0,
    },
    penaltyDeducted: {
      minor: 0,
      rupees: 0,
    },
    therapistCompensation: {
      minor: 0,
      rupees: 0,
    },
  },
  records: [],
};

export default function SpaOwnerDashboardPage() {
  const navigate = useNavigate();
  const { ownerToken, ownerProfile, setOwnerProfile, logoutOwner } = useAuth();

  // Sidebar Mobile Toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active Section: 'overview' | 'therapists' | 'bookings' | 'penalty' | 'commission' | 'payout' | 'settings' | 'profile'
  const [activeSection, setActiveSection] = useState(() => {
    try {
      const savedUser = localStorage.getItem('therapyshala_owner_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.isProfileComplete === false) {
          return 'profile';
        }
      }
    } catch {
      // fallback
    }
    return 'overview';
  });

  // Notification Popup State (Matching user screenshot)
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notificationActiveTab, setNotificationActiveTab] = useState('all');
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [soundPlaybackBlocked, setSoundPlaybackBlocked] = useState(false);
  const [dashboardNotifications, setDashboardNotifications] = useState([]);

  const notificationDropdownRef = useRef(null);
  const audioRef = useRef(null);

  // Saved & Realtime Notifications State (GET /api/v1/spa-owner/notifications)
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsUnreadCount, setNotificationsUnreadCount] = useState(0);
  const [notificationsNextCursor, setNotificationsNextCursor] = useState(null);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [activeAppointmentToast, setActiveAppointmentToast] = useState(null); // Realtime floating toast banner
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(notificationSound);
    audio.preload = 'auto';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Play notification sound helper. Browsers may require a user gesture first.
  const playNotificationSound = useCallback((force = false) => {
    if (isSoundMuted && !force) return;
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(notificationSound);
        audioRef.current.preload = 'auto';
      }
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1;
      audioRef.current.play().then(() => {
        setSoundPlaybackBlocked(false);
      }).catch((err) => {
        setSoundPlaybackBlocked(true);
        console.warn('Notification audio play deferred:', err?.message);
      });
    } catch (e) {
      setSoundPlaybackBlocked(true);
      console.warn('Audio play error:', e);
    }
  }, [isSoundMuted]);

  const toggleNotificationSound = () => {
    if (isSoundMuted) {
      setIsSoundMuted(false);
      playNotificationSound(true);
      return;
    }

    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setIsSoundMuted(true);
  };

  const enableNotificationSound = () => {
    setIsSoundMuted(false);
    playNotificationSound(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(e.target)) {
        setNotificationDropdownOpen(false);
      }
    };
    if (notificationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationDropdownOpen]);

  // Spa Owner Dashboard State (GET /spa-owner/dashboard)
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState('');
  // State updates are asynchronous, so use a ref to prevent effects from
  // starting another dashboard request while the current one is unresolved.
  const dashboardRequestInFlightRef = useRef(false);

  // Profile completion status check (e.g. from POST /spa-owner/login response: { isProfileComplete: false })
  const isProfileLocked = Boolean(
    ownerProfile?.isProfileComplete === false ||
    dashboardData?.registeredSpa?.isProfileComplete === false ||
    dashboardData?.isProfileComplete === false
  );

  const [lockedAttemptAlert, setLockedAttemptAlert] = useState(false);

  // Enforce lock gate: keep activeSection locked to 'profile' until profile is completed
  useEffect(() => {
    if (isProfileLocked && activeSection !== 'profile') {
      setActiveSection('profile');
    }
  }, [isProfileLocked, activeSection]);

  // Profile State (API 3)
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Therapists State (API 4)
  const [therapists, setTherapists] = useState([]);
  const [therapistsCount, setTherapistsCount] = useState(0);
  const [therapistsLoading, setTherapistsLoading] = useState(false);
  const [therapistsError, setTherapistsError] = useState('');
  const [selectedTherapistForModal, setSelectedTherapistForModal] = useState(null);
  // An empty array is a valid successful response, not evidence that the API
  // has not been loaded. Keep that state separately to prevent a fetch loop.
  const therapistsLoadedRef = useRef(false);
  const therapistsRequestInFlightRef = useRef(false);

  // Bookings State (API 1: GET /spa-owner/bookings)
  const [bookings, setBookings] = useState([]);
  const [bookingsTotal, setBookingsTotal] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [bookingsPage, setBookingsPage] = useState(1);
  const bookingsLimit = 20;
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState('');

  // Booking Filters
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [bookingTherapistFilter, setBookingTherapistFilter] = useState('ALL');
  const [bookingStartDate, setBookingStartDate] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState('');

  // Commissions State (API: GET /spa-owner/commissions)
  const [commissionsData, setCommissionsData] = useState(null);
  const [commissionsLoading, setCommissionsLoading] = useState(false);
  const [commissionsError, setCommissionsError] = useState('');
  const [commissionsPage, setCommissionsPage] = useState(1);
  const [commissionTherapistFilter, setCommissionTherapistFilter] = useState('ALL');
  const [commissionTypeFilter, setCommissionTypeFilter] = useState('ALL'); // 'ALL' | 'DIRECT' | 'REFERRAL'

  // Sub-Owner Modal State (API: GET /spa-owner/sub-owners/:identifier)
  const [subOwnerModalOpen, setSubOwnerModalOpen] = useState(false);
  const [selectedSubOwner, setSelectedSubOwner] = useState(null);

  // Booking Details Modal State (API 2: GET /spa-owner/bookings/{id})
  const [bookingDetailModalOpen, setBookingDetailModalOpen] = useState(false);
  const [selectedBookingPublicId, setSelectedBookingPublicId] = useState(null);
  const [bookingDetailData, setBookingDetailData] = useState(null);
  const [bookingDetailLoading, setBookingDetailLoading] = useState(false);
  const [bookingDetailError, setBookingDetailError] = useState('');

  // Single-Page View Modes (No popups)
  const [therapistSubView, setTherapistSubView] = useState('list'); // 'list' | 'onboard' | 'details'
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [therapistSearchTerm, setTherapistSearchTerm] = useState('');
  const [therapistDutyFilter, setTherapistDutyFilter] = useState('ALL'); // 'ALL' | 'ON_DUTY' | 'OFF_DUTY'

  const [bookingSubView, setBookingSubView] = useState('list'); // 'list' | 'details'
  const [payoutSubView, setPayoutSubView] = useState('overview'); // 'overview' | 'account' | 'request'
  const [showPayoutRequestForm, setShowPayoutRequestForm] = useState(false);

  // Copied Spa Code Feedback
  const [copiedSpaCode, setCopiedSpaCode] = useState(false);

  // Onboard Therapist In-Page State (API 5 & 6)
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);
  const [onboardLoading, setOnboardLoading] = useState(false);
  const [onboardError, setOnboardError] = useState('');
  const [onboardSuccessData, setOnboardSuccessData] = useState(null);

  // Payout Account State (GET & PATCH /spa-owner/payout-account)
  const [payoutAccount, setPayoutAccount] = useState(null);
  const [payoutAccountLoading, setPayoutAccountLoading] = useState(false);
  const [payoutAccountSaving, setPayoutAccountSaving] = useState(false);
  const [payoutAccountError, setPayoutAccountError] = useState('');
  const [payoutAccountSuccessMsg, setPayoutAccountSuccessMsg] = useState('');
  const [payoutAccountModalOpen, setPayoutAccountModalOpen] = useState(false);
  const [payoutAccountForm, setPayoutAccountForm] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    preferredMethod: 'BANK_TRANSFER',
  });

  // Request Payout Modal & State (POST /spa-owner/payout-requests)
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('BANK_TRANSFER');
  const [payoutAdminNotes, setPayoutAdminNotes] = useState('');
  const [payoutSubmitting, setPayoutSubmitting] = useState(false);
  const [payoutSubmitError, setPayoutSubmitError] = useState('');
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('');

  // Payout History State (GET /spa-owner/payouts)
  const [payoutsData, setPayoutsData] = useState(null);
  const [payoutsLoading, setPayoutsLoading] = useState(false);
  const [payoutsError, setPayoutsError] = useState('');
  const [payoutsPage, setPayoutsPage] = useState(1);
  const [payoutStatusFilter, setPayoutStatusFilter] = useState('ALL');

  // Cancellation Policy State (GET /admin/cancellation-policy)
  const [cancellationPolicy, setCancellationPolicy] = useState(null);
  const [cancellationPolicyLoading, setCancellationPolicyLoading] = useState(false);
  const [cancellationPolicyError, setCancellationPolicyError] = useState('');

  // Cancellation Penalties Report State (GET /spa-owner/cancellation-penalties/report)
  const [penaltiesReport, setPenaltiesReport] = useState(null);
  const [penaltiesReportLoading, setPenaltiesReportLoading] = useState(false);
  const [penaltiesReportError, setPenaltiesReportError] = useState('');
  const [penaltySubTab, setPenaltySubTab] = useState('report'); // 'report' | 'policy'
  const [selectedPenaltyRecord, setSelectedPenaltyRecord] = useState(null);
  const [penaltyAuditModalOpen, setPenaltyAuditModalOpen] = useState(false);

  // Uploading status indicators
  const [uploadingField, setUploadingField] = useState(null);

  // Sponsored Spas State (GET /spa-owner/sponsored-spas)
  const [sponsoredData, setSponsoredData] = useState(null);
  const [sponsoredLoading, setSponsoredLoading] = useState(false);
  const [sponsoredError, setSponsoredError] = useState('');
  const [copiedSponsorCode, setCopiedSponsorCode] = useState(false);

  // The sub-owner endpoint is scoped by this code; derive it from the live
  // dashboard/profile data instead of sending the invalid collection route.
  const activeSpaCode =
    dashboardData?.assignedCode ||
    dashboardData?.registeredSpa?.assignedSpaCode ||
    dashboardData?.registeredSpa?.spaCode ||
    ownerProfile?.spaCode ||
    'SPA-PENDING';

  // Fetch Sponsored Sub-Spas
  const fetchSponsoredSpas = useCallback(async () => {
    const token =
      ownerToken ||
      localStorage.getItem('therapyshala_owner_token') ||
      localStorage.getItem('therapyshala_admin_token');
    if (!token || activeSpaCode === 'SPA-PENDING') return;

    setSponsoredLoading(true);
    setSponsoredError('');
    try {
      const res = await getSponsoredSpas(activeSpaCode);
      if (res?.success && res?.data) {
        setSponsoredData(res.data);
      } else {
        setSponsoredError(res?.message || 'Failed to retrieve sponsored sub-spas.');
      }
    } catch (err) {
      console.error('Error fetching sponsored spas:', err);
      setSponsoredError(err?.data?.message || err?.message || 'Failed to load sponsored sub-spas.');
    } finally {
      setSponsoredLoading(false);
    }
  }, [ownerToken, activeSpaCode]);

  const handleCopySponsorCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedSponsorCode(true);
    setTimeout(() => setCopiedSponsorCode(false), 2000);
  };

  // Redirect if unauthenticated
  useEffect(() => {
    if (!ownerToken) {
      navigate('/login', { state: { from: '/owner/dashboard' } });
    }
  }, [ownerToken, navigate]);

  // 0. Fetch Spa Owner Dashboard (GET /spa-owner/dashboard)
  const fetchDashboard = useCallback(async () => {
    if (!ownerToken || dashboardRequestInFlightRef.current) return;
    dashboardRequestInFlightRef.current = true;
    setDashboardLoading(true);
    setDashboardError('');
    try {
      const res = await getSpaOwnerDashboard();
      if (res?.success && res?.data) {
        setDashboardData(res.data);
        if (res.data.registeredSpa) {
          setOwnerProfile((prev) => ({
            ...prev,
            ...res.data.registeredSpa,
          }));
        }
      } else {
        setDashboardError(res?.message || 'Failed to retrieve dashboard data.');
      }
    } catch (err) {
      if (err?.status === 401) {
        logoutOwner();
        navigate('/login');
        return;
      }
      setDashboardError(err?.data?.message || err?.message || 'Failed to load spa owner dashboard.');
    } finally {
      dashboardRequestInFlightRef.current = false;
      setDashboardLoading(false);
    }
  }, [ownerToken, setOwnerProfile, logoutOwner, navigate]);

  // 1. Fetch Owner Profile (API 3)
  const fetchProfile = useCallback(async () => {
    if (!ownerToken) return;
    setProfileLoading(true);
    setProfileError('');
    try {
      const res = await getSpaOwnerProfile();
      if (res?.success && res?.data) {
        setOwnerProfile(res.data);
      } else {
        setProfileError(res?.message || 'Failed to retrieve profile.');
      }
    } catch (err) {
      if (err?.status === 401) {
        logoutOwner();
        navigate('/login');
        return;
      }
      setProfileError(err?.data?.message || err?.message || 'Failed to load owner profile.');
    } finally {
      setProfileLoading(false);
    }
  }, [ownerToken, setOwnerProfile, logoutOwner, navigate]);

  // 2. Fetch Therapists List (API 4)
  const fetchTherapists = useCallback(async () => {
    if (!ownerToken || therapistsRequestInFlightRef.current) return;
    therapistsRequestInFlightRef.current = true;
    therapistsLoadedRef.current = true;
    setTherapistsLoading(true);
    setTherapistsError('');
    try {
      const res = await getSpaOwnerTherapists();
      if (res?.success) {
        setTherapists(Array.isArray(res.data) ? res.data : []);
        setTherapistsCount(res.count ?? (Array.isArray(res.data) ? res.data.length : 0));
      } else {
        setTherapistsError(res?.message || 'Failed to retrieve therapists list.');
      }
    } catch (err) {
      setTherapistsError(err?.data?.message || err?.message || 'Failed to load therapists.');
    } finally {
      therapistsRequestInFlightRef.current = false;
      setTherapistsLoading(false);
    }
  }, [ownerToken]);

  // 3. Fetch Bookings List (API 1: GET /spa-owner/bookings)
  const fetchBookings = useCallback(
    async (overrides = {}) => {
      if (!ownerToken) return;
      setBookingsLoading(true);
      setBookingsError('');

      const targetPage = overrides.page !== undefined ? overrides.page : bookingsPage;
      const targetStatus = overrides.status !== undefined ? overrides.status : bookingStatusFilter;
      const targetTherapist = overrides.therapistId !== undefined ? overrides.therapistId : bookingTherapistFilter;
      const targetStart = overrides.startDate !== undefined ? overrides.startDate : bookingStartDate;
      const targetEnd = overrides.endDate !== undefined ? overrides.endDate : bookingEndDate;

      try {
        const params = {
          page: targetPage,
          limit: bookingsLimit,
        };

        if (targetStatus && targetStatus !== 'ALL') {
          params.status = targetStatus;
        }

        if (targetTherapist && targetTherapist !== 'ALL') {
          params.therapistId = targetTherapist;
        }

        if (targetStart) {
          params.startDate = targetStart;
        }

        if (targetEnd) {
          params.endDate = targetEnd;
        }

        const res = await getSpaOwnerBookings(params);
        if (res?.success) {
          setBookings(Array.isArray(res.data) ? res.data : []);
          setBookingsTotal(res.total ?? (Array.isArray(res.data) ? res.data.length : 0));
          setBookingsCount(res.count ?? (Array.isArray(res.data) ? res.data.length : 0));
          if (res.page) setBookingsPage(res.page);
        } else {
          setBookingsError(res?.message || 'Failed to load bookings.');
        }
      } catch (err) {
        setBookingsError(err?.data?.message || err?.message || 'Failed to load appointments.');
      } finally {
        setBookingsLoading(false);
      }
    },
    [
      ownerToken,
      bookingsPage,
      bookingsLimit,
      bookingStatusFilter,
      bookingTherapistFilter,
      bookingStartDate,
      bookingEndDate,
    ]
  );

  // Filter change handler
  const handleFilterChange = (updates) => {
    const nextStatus = updates.status !== undefined ? updates.status : bookingStatusFilter;
    const nextTherapist = updates.therapistId !== undefined ? updates.therapistId : bookingTherapistFilter;
    const nextStart = updates.startDate !== undefined ? updates.startDate : bookingStartDate;
    const nextEnd = updates.endDate !== undefined ? updates.endDate : bookingEndDate;

    if (updates.status !== undefined) setBookingStatusFilter(updates.status);
    if (updates.therapistId !== undefined) setBookingTherapistFilter(updates.therapistId);
    if (updates.startDate !== undefined) setBookingStartDate(updates.startDate);
    if (updates.endDate !== undefined) setBookingEndDate(updates.endDate);

    setBookingsPage(1);
    fetchBookings({
      status: nextStatus,
      therapistId: nextTherapist,
      startDate: nextStart,
      endDate: nextEnd,
      page: 1,
    });
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setBookingStatusFilter('ALL');
    setBookingTherapistFilter('ALL');
    setBookingStartDate('');
    setBookingEndDate('');
    setBookingsPage(1);
    fetchBookings({
      status: 'ALL',
      therapistId: 'ALL',
      startDate: '',
      endDate: '',
      page: 1,
    });
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    const totalPages = Math.max(1, Math.ceil(bookingsTotal / bookingsLimit));
    if (newPage < 1 || newPage > totalPages || newPage === bookingsPage) return;
    setBookingsPage(newPage);
    fetchBookings({ page: newPage });
  };

  // Fetch Saved Notifications from API (GET /api/v1/spa-owner/notifications?limit=20)
  const fetchNotifications = useCallback(
    async ({ cursor = null, append = false } = {}) => {
      if (!ownerToken) return;
      try {
        setNotificationsLoading(true);
        const res = await getSpaOwnerNotifications({ limit: 20, cursor });
        if (res?.success && Array.isArray(res?.data)) {
          const formatted = res.data.map((n) => ({
            id: n.id || n._id || `notif-${Math.random()}`,
            title: n.title || 'New Notification',
            desc: n.message || n.desc || n.body || '',
            category: n.category || getOwnerNotificationCategory(n.type),
            read: Boolean(n.read || n.isRead || n.status === 'READ'),
            time: n.createdAt
              ? new Date(n.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : n.time || 'Just now',
            raw: n,
          }));

          setDashboardNotifications((prev) => {
            if (append) {
              const existingIds = new Set(prev.map((item) => item.id));
              const newItems = formatted.filter((item) => !existingIds.has(item.id));
              return [...prev, ...newItems];
            }
            return formatted;
          });

          if (res.meta?.unreadCount !== undefined) {
            setNotificationsUnreadCount(Number(res.meta.unreadCount) || 0);
          } else {
            setNotificationsUnreadCount(
              formatted.filter((n) => !n.read).length
            );
          }

          if (res.meta?.nextCursor !== undefined) {
            setNotificationsNextCursor(res.meta.nextCursor);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch spa owner notifications:', err?.message || err);
      } finally {
        setNotificationsLoading(false);
      }
    },
    [ownerToken]
  );

  // Mark single notification as read (PATCH /api/v1/spa-owner/notifications/<NOTIFICATION_ID>/read)
  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId) return;
    setDashboardNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setNotificationsUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markSpaOwnerNotificationAsRead(notificationId);
    } catch (err) {
      console.warn('Failed to mark notification as read:', err?.message || err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    const unreadNotifications = dashboardNotifications.filter((n) => !n.read);
    setDashboardNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setNotificationsUnreadCount(0);

    for (const n of unreadNotifications) {
      try {
        await markSpaOwnerNotificationAsRead(n.id);
      } catch (e) {
        // silent fallback
      }
    }
  };

  // Socket.io Realtime Notifications for Spa Owner Appointments & Bookings
  useEffect(() => {
    if (!ownerToken) {
      disconnectSpaOwnerSocket();
      setSocketStatus('disconnected');
      return;
    }

    const unsubscribeConnect = onSocketConnect(() => {
      console.log('[OwnerDashboard] Socket connected/reconnected: refreshing bookings & saved notifications');
      setSocketStatus('connected');
      fetchBookings();
      fetchNotifications();
    });

    const unsubscribeReady = onSpaOwnerSocketReady(() => {
      setSocketStatus('connected');
    });
    const unsubscribeConnectError = onSocketConnectError((error) => {
      console.error('[OwnerDashboard] Spa owner socket connection failed:', error?.message || error);
      setSocketStatus('error');
    });
    const unsubscribeDisconnect = onSocketDisconnect(() => {
      setSocketStatus('disconnected');
    });

    const unsubscribeNotification = onSpaOwnerNotification((notification, eventName) => {
      console.log(`[OwnerDashboard] ${eventName} received:`, notification);
      playNotificationSound();

      const bookingData =
        notification.data ||
        notification.appointment ||
        notification.booking ||
        notification;
      const toastId =
        notification.id || notification._id || notification.appointmentId || `toast-${Date.now()}`;
      const isAppointment =
        eventName === 'appointment:new' || notification.type === 'NEW_APPOINTMENT';
      const toastObj = {
        id: toastId,
        category:
          eventName === 'support:reply'
            ? 'support'
            : getOwnerNotificationCategory(notification.type),
        raw: notification,
        title:
          notification.title ||
          (eventName === 'support:reply'
            ? 'New support reply'
            : isAppointment
              ? 'New appointment'
              : 'New notification'),
        desc:
          notification.body ||
          notification.message ||
          notification.desc ||
          (isAppointment ? 'A new appointment was received.' : 'You have a new update.'),
        data: bookingData,
      };

      setActiveAppointmentToast(toastObj);

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = setTimeout(() => {
        setActiveAppointmentToast(null);
      }, 7000);

      // Prepend to notifications list
      const newNotifItem = {
        id: toastId,
        title: toastObj.title,
        desc: toastObj.desc,
        category: toastObj.category,
        read: false,
        time: 'Just now',
        raw: notification,
      };
      setDashboardNotifications((prev) => [
        newNotifItem,
        ...prev.filter((item) => item.id !== toastId),
      ]);
      setNotificationsUnreadCount((prev) => prev + 1);

      if (isAppointment) fetchBookings();
      fetchNotifications();
    });

    // Register listeners before connecting so the first connect/ready event is not missed.
    const socket = connectSpaOwnerSocket(ownerToken);
    setSocketStatus(socket?.connected ? 'connected' : 'connecting');

    return () => {
      unsubscribeConnect();
      unsubscribeReady();
      unsubscribeConnectError();
      unsubscribeDisconnect();
      unsubscribeNotification();
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [ownerToken, fetchBookings, fetchNotifications, playNotificationSound]);

  // Toggle Therapist Duty Status (Interactive duty switch backed by PATCH /spa-owner/therapists/<ID>)
  const handleToggleTherapistDuty = async (thId) => {
    if (!thId) return;
    const target = therapists.find((t) => t.id === thId || t.profileId === thId || t.therapistId === thId);
    const nextDuty = target?.dutyStatus === 'ON_DUTY' ? 'OFF_DUTY' : 'ON_DUTY';

    // Optimistic UI update
    setTherapists((prev) =>
      prev.map((t) => {
        if (t.id === thId || t.profileId === thId || t.therapistId === thId) {
          return { ...t, dutyStatus: nextDuty };
        }
        return t;
      })
    );
    if (selectedTherapist && (selectedTherapist.id === thId || selectedTherapist.profileId === thId || selectedTherapist.therapistId === thId)) {
      setSelectedTherapist((prev) => ({
        ...prev,
        dutyStatus: nextDuty,
      }));
    }

    try {
      await updateSpaOwnerTherapistDutyStatus(thId, nextDuty);
    } catch (err) {
      console.error('Failed to update therapist duty status on server:', err);
      // Revert upon error
      const prevDuty = target?.dutyStatus || 'OFF_DUTY';
      setTherapists((prev) =>
        prev.map((t) => {
          if (t.id === thId || t.profileId === thId || t.therapistId === thId) {
            return { ...t, dutyStatus: prevDuty };
          }
          return t;
        })
      );
      if (selectedTherapist && (selectedTherapist.id === thId || selectedTherapist.profileId === thId || selectedTherapist.therapistId === thId)) {
        setSelectedTherapist((prev) => ({
          ...prev,
          dutyStatus: prevDuty,
        }));
      }
    }
  };

  // Booking Details In-Page handler (API 2: GET /spa-owner/bookings/{id})
  const handleViewBookingDetails = async (bookingOrId) => {
    const targetId =
      typeof bookingOrId === 'string'
        ? bookingOrId
        : bookingOrId?.bookingId || bookingOrId?.publicId || bookingOrId?.id || bookingOrId?._id;
    if (!targetId) return;

    setSelectedBookingPublicId(targetId);
    setBookingSubView('details');
    setActiveSection('bookings');
    setBookingDetailModalOpen(false);
    setBookingDetailLoading(true);
    setBookingDetailError('');
    setBookingDetailData(null);

    try {
      const res = await getSpaOwnerBookingDetails(targetId);
      if (res?.success && res?.data) {
        setBookingDetailData(res.data);
      } else {
        setBookingDetailError(res?.message || 'Failed to retrieve booking details.');
      }
    } catch (err) {
      setBookingDetailError(err?.data?.message || err?.message || 'Failed to load booking details.');
    } finally {
      setBookingDetailLoading(false);
    }
  };

  // 4. Fetch Spa Owner Commissions (API: GET /spa-owner/commissions)
  const fetchCommissions = useCallback(
    async (overrides = {}) => {
      if (!ownerToken) return;
      setCommissionsLoading(true);
      setCommissionsError('');

      const targetPage = overrides.page !== undefined ? overrides.page : commissionsPage;
      const targetTherapist =
        overrides.therapistId !== undefined ? overrides.therapistId : commissionTherapistFilter;
      const targetType =
        overrides.commissionType !== undefined ? overrides.commissionType : commissionTypeFilter;

      try {
        const params = {
          page: targetPage,
          limit: 20,
        };

        if (targetTherapist && targetTherapist !== 'ALL') {
          params.therapistId = targetTherapist;
        }

        if (targetType && targetType !== 'ALL') {
          params.commissionType = targetType;
        }

        const res = await getSpaOwnerCommissions(params);
        if (res?.success && res?.data) {
          setCommissionsData(res.data);
          if (res.data.pagination?.page) {
            setCommissionsPage(res.data.pagination.page);
          }
        } else {
          setCommissionsError(res?.message || 'Failed to retrieve commission records.');
        }
      } catch (err) {
        setCommissionsError(
          err?.data?.message || err?.message || 'Failed to load commissions earnings history.'
        );
      } finally {
        setCommissionsLoading(false);
      }
    },
    [ownerToken, commissionsPage, commissionTherapistFilter, commissionTypeFilter]
  );

  // 5. Fetch Payout Account (API: GET /spa-owner/payout-account)
  const fetchPayoutAccount = useCallback(async () => {
    if (!ownerToken) return;
    setPayoutAccountLoading(true);
    setPayoutAccountError('');
    try {
      const res = await getSpaOwnerPayoutAccount();
      if (res?.success && res?.data) {
        setPayoutAccount(res.data);
        setPayoutAccountForm({
          accountHolderName: res.data.accountHolderName || '',
          bankName: res.data.bankName || '',
          accountNumber: res.data.accountNumber || '',
          ifscCode: res.data.ifscCode || '',
          upiId: res.data.upiId || '',
          preferredMethod: res.data.preferredMethod || 'BANK_TRANSFER',
        });
        if (res.data.preferredMethod) {
          setPayoutMethod(res.data.preferredMethod);
        }
      } else {
        setPayoutAccountError(res?.message || 'Failed to retrieve payout account details.');
      }
    } catch (err) {
      setPayoutAccountError(
        err?.data?.message || err?.message || 'Failed to load payout account details.'
      );
    } finally {
      setPayoutAccountLoading(false);
    }
  }, [ownerToken]);

  // Save / Update Payout Account (API: PATCH /spa-owner/payout-account)
  const handleSavePayoutAccount = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!ownerToken) return;
    setPayoutAccountSaving(true);
    setPayoutAccountError('');
    setPayoutAccountSuccessMsg('');

    try {
      const payload = {
        accountHolderName: payoutAccountForm.accountHolderName?.trim() || null,
        bankName: payoutAccountForm.bankName?.trim() || null,
        accountNumber: payoutAccountForm.accountNumber?.trim() || null,
        ifscCode: payoutAccountForm.ifscCode?.trim() || null,
        upiId: payoutAccountForm.upiId?.trim() || null,
        preferredMethod: payoutAccountForm.preferredMethod || 'BANK_TRANSFER',
      };

      const res = await updateSpaOwnerPayoutAccount(payload);
      if (res?.success && res?.data) {
        setPayoutAccount(res.data);
        setPayoutAccountForm({
          accountHolderName: res.data.accountHolderName || '',
          bankName: res.data.bankName || '',
          accountNumber: res.data.accountNumber || '',
          ifscCode: res.data.ifscCode || '',
          upiId: res.data.upiId || '',
          preferredMethod: res.data.preferredMethod || 'BANK_TRANSFER',
        });
        if (res.data.preferredMethod) {
          setPayoutMethod(res.data.preferredMethod);
        }
        setPayoutAccountSuccessMsg(res?.message || 'Payout account saved successfully!');
        setPayoutAccountModalOpen(false);
        setTimeout(() => setPayoutAccountSuccessMsg(''), 5000);
      } else {
        setPayoutAccountError(res?.message || 'Failed to update payout account.');
      }
    } catch (err) {
      setPayoutAccountError(
        err?.data?.message || err?.message || 'Failed to update payout account.'
      );
    } finally {
      setPayoutAccountSaving(false);
    }
  };

  // 6. Fetch Payout Requests History (API: GET /spa-owner/payouts)
  const fetchPayoutsHistory = useCallback(
    async (overrides = {}) => {
      if (!ownerToken) return;
      setPayoutsLoading(true);
      setPayoutsError('');

      const targetPage = overrides.page !== undefined ? overrides.page : payoutsPage;
      const targetStatus = overrides.status !== undefined ? overrides.status : payoutStatusFilter;

      try {
        const params = {
          page: targetPage,
          limit: 20,
        };

        if (targetStatus && targetStatus !== 'ALL') {
          params.status = targetStatus;
        }

        const res = await getSpaOwnerPayoutHistory(params);
        if (res?.success && res?.data) {
          setPayoutsData(res.data);
          if (res.data.pagination?.page) {
            setPayoutsPage(res.data.pagination.page);
          }
        } else {
          setPayoutsError(res?.message || 'Failed to load payout history.');
        }
      } catch (err) {
        setPayoutsError(
          err?.data?.message || err?.message || 'Failed to retrieve payout history.'
        );
      } finally {
        setPayoutsLoading(false);
      }
    },
    [ownerToken, payoutsPage, payoutStatusFilter]
  );

  // 7. Submit Payout Request (API: POST /spa-owner/payout-requests)
  const handleRequestPayoutSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!ownerToken) return;
    setPayoutSubmitting(true);
    setPayoutSubmitError('');

    const parsedAmount = Number(payoutAmount);
    const available = Number(commissionsData?.summary?.availableBalanceRupees ?? 0);

    if (!parsedAmount || parsedAmount <= 0) {
      setPayoutSubmitError('Please enter a valid withdrawal amount.');
      setPayoutSubmitting(false);
      return;
    }

    if (parsedAmount > available) {
      setPayoutSubmitError(`Withdrawal amount exceeds available balance (₹${available.toFixed(2)}).`);
      setPayoutSubmitting(false);
      return;
    }

    if (!payoutAccount?.isConfigured) {
      setPayoutSubmitError('Please configure your settlement bank account or UPI ID first.');
      setPayoutSubmitting(false);
      return;
    }

    try {
      const payload = {
        amountRupees: parsedAmount,
        payoutMethod: payoutMethod || payoutAccount?.preferredMethod || 'BANK_TRANSFER',
        adminNotes: payoutAdminNotes ? payoutAdminNotes.trim() : undefined,
      };

      const res = await createSpaOwnerPayoutRequest(payload);
      if (res?.success) {
        setPayoutModalOpen(false);
        setPayoutAmount('');
        setPayoutAdminNotes('');
        setPayoutSuccessMsg(
          `Payout request of ₹${parsedAmount.toFixed(2)} submitted successfully! Reference ID: ${res?.data?.id || ''}`
        );
        setTimeout(() => setPayoutSuccessMsg(''), 8000);
        // Refresh live balances and payout history
        fetchCommissions();
        fetchPayoutsHistory({ page: 1 });
      } else {
        setPayoutSubmitError(res?.message || 'Failed to submit payout request.');
      }
    } catch (err) {
      setPayoutSubmitError(
        err?.data?.message || err?.message || 'Failed to submit payout request.'
      );
    } finally {
      setPayoutSubmitting(false);
    }
  };

  // 8. Fetch Cancellation Policy (API: GET /admin/cancellation-policy)
  const fetchCancellationPolicy = useCallback(async () => {
    const token =
      ownerToken ||
      localStorage.getItem('therapyshala_owner_token') ||
      localStorage.getItem('therapyshala_admin_token');
    if (!token) return;

    setCancellationPolicyLoading(true);
    setCancellationPolicyError('');
    try {
      const res = await getSpaOwnerCancellationPolicy();
      if (res?.success && res?.data) {
        setCancellationPolicy(res.data);
      } else {
        setCancellationPolicyError(res?.message || 'Failed to retrieve cancellation policy.');
      }
    } catch (err) {
      setCancellationPolicyError(
        err?.data?.message || err?.message || 'Failed to load cancellation policy configuration.'
      );
    } finally {
      setCancellationPolicyLoading(false);
    }
  }, [ownerToken]);

  // 9. Fetch Cancellation Penalties Report (API: GET /spa-owner/cancellation-penalties/report?limit=100)
  const fetchPenaltiesReport = useCallback(async () => {
    const token =
      ownerToken ||
      localStorage.getItem('therapyshala_owner_token') ||
      localStorage.getItem('therapyshala_admin_token');
    if (!token) return;

    setPenaltiesReportLoading(true);
    setPenaltiesReportError('');
    try {
      const res = await getSpaOwnerCancellationPenaltiesReport({ limit: 100 });
      if (res?.success && res?.data) {
        setPenaltiesReport(res.data);
      } else {
        setPenaltiesReport(EMPTY_CANCELLATION_PENALTIES_REPORT);
      }
    } catch (err) {
      console.warn('Penalties report fetch fallback:', err);
      setPenaltiesReport(EMPTY_CANCELLATION_PENALTIES_REPORT);
    } finally {
      setPenaltiesReportLoading(false);
    }
  }, [ownerToken]);

  // Initial Load - Robust execution once per session
  const hasLoadedRef = useRef(false);
  const prevTokenRef = useRef(ownerToken);

  useEffect(() => {
    // Reset load guard if owner token changes (e.g. re-login)
    if (ownerToken !== prevTokenRef.current) {
      prevTokenRef.current = ownerToken;
      hasLoadedRef.current = false;
    }

    if (ownerToken && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      // Fetch initial data once on mount independently
      fetchDashboard();
      fetchProfile();
      fetchTherapists();
      fetchBookings();
      fetchNotifications();
      fetchCommissions();
      fetchPayoutAccount();
      fetchCancellationPolicy();
      fetchPenaltiesReport();
    }
  }, [ownerToken, fetchDashboard, fetchProfile, fetchTherapists, fetchBookings, fetchNotifications, fetchCommissions, fetchPayoutAccount, fetchCancellationPolicy, fetchPenaltiesReport]);

  // Dashboard and profile data are loaded independently. Start this request
  // only once a valid spa code is available for the parameterized route.
  useEffect(() => {
    if (ownerToken && activeSpaCode !== 'SPA-PENDING') {
      fetchSponsoredSpas();
    }
  }, [ownerToken, activeSpaCode, fetchSponsoredSpas]);

  // Copy Spa Code to clipboard
  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedSpaCode(true);
    setTimeout(() => setCopiedSpaCode(false), 2000);
  };

  // Sample Therapist Data Generator matching exact requested onboarding fields
  const getSampleTherapistData = () => ({
    displayName: 'Pooja V.',
    fullName: 'Pooja Devi Verma',
    mobileNumber: '9876543210',
    email: 'pooja@example.com',
    gender: 'FEMALE',
    dateOfBirth: '1995-01-15',
    experienceYears: 1,
    languages: ['Hindi', 'English'],
    languagesSpoken: ['hi', 'en'],
    workingLocation: {
      placeId: 'GOOGLE_PLACE_ID',
      city: 'Jaipur',
      area: 'C Scheme',
      postalCode: '302001',
      formattedAddress: 'C Scheme, Jaipur, Rajasthan',
      latitude: 26.9124,
      longitude: 75.7873,
      serviceRadiusKm: 10,
    },
    location: 'C Scheme, Jaipur, Rajasthan',
    formattedAddress: 'C Scheme, Jaipur, Rajasthan',
    city: 'Jaipur',
    area: 'C Scheme',
    postalCode: '302001',
    latitude: 26.9124,
    longitude: 75.7873,
    serviceRadiusKm: 10,
    placeId: 'GOOGLE_PLACE_ID',
    excludedLocations: [
      {
        placeId: 'EXCLUDED_GOOGLE_PLACE_ID',
        name: 'Industrial Area',
        latitude: 26.95,
        longitude: 75.8,
        radiusKm: 2,
      },
    ],
    excludedWorkAreas: [
      {
        placeId: 'EXCLUDED_GOOGLE_PLACE_ID',
        name: 'Industrial Area',
        latitude: 26.95,
        longitude: 75.8,
        radiusKm: 2,
      },
    ],
    companyPhotoUrl: 'https://example.com/company-photo.jpg',
    internalProfilePhoto: 'https://example.com/company-photo.jpg',
    appPhotoUrl: 'https://example.com/app-photo.jpg',
    appProfilePhoto: 'https://example.com/app-photo.jpg',
    policeVerificationUrl: 'https://example.com/police.pdf',
    policeClearance: 'https://example.com/police.pdf',
    governmentIdFrontUrl: 'https://example.com/id-front.jpg',
    govtIdFront: 'https://example.com/id-front.jpg',
    governmentIdBackUrl: 'https://example.com/id-back.jpg',
    govtIdBack: 'https://example.com/id-back.jpg',
    services: [
      {
        categoryId: '01M60X6ZE8D0YDWKPT0ENNDD8B',
        name: 'Swedish Massage',
        durationMinutes: 60,
        discountPrice: 999,
        basePrice: 1200,
      },
    ],
  });

  // Therapist Onboarding Form State
  const initialFormState = {
    displayName: '',
    fullName: '',
    mobileNumber: '',
    email: '',
    gender: 'FEMALE',
    dateOfBirth: '1998-05-15',
    experienceYears: 1,
    languages: ['Hindi', 'English'],
    languagesSpoken: ['hi', 'en'],
    location: '',
    formattedAddress: '',
    city: '',
    area: '',
    postalCode: '',
    latitude: 26.9124,
    longitude: 75.7873,
    serviceRadiusKm: 10,
    placeId: '',
    excludedLocations: [],
    excludedWorkAreas: [],
    companyPhotoUrl: '',
    internalProfilePhoto: '',
    appPhotoUrl: '',
    appProfilePhoto: '',
    policeVerificationUrl: '',
    policeClearance: '',
    governmentIdFrontUrl: '',
    govtIdFront: '',
    governmentIdBackUrl: '',
    govtIdBack: '',
    gallery: [],
    services: [
      {
        categoryId: '01M60X6ZE8D0YDWKPT0ENNDD8B',
        name: 'Swedish Massage',
        description: '60 mins relaxing therapy',
        basePrice: 1200,
        discountPrice: 999,
        durationMinutes: 60,
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  // File Upload Handler with /api/v1/assets/uploads integration and local fallback
  const handleFileUpload = async (e, fieldName, kind = 'SERVICE_IMAGE') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    setOnboardError('');

    try {
      // 1. Create instant local preview URL so the UI feels immediate
      const localPreviewUrl = URL.createObjectURL(file);
      setFormData((prev) => {
        const next = { ...prev };
        next[fieldName] = localPreviewUrl;
        if (fieldName === 'internalProfilePhoto') next.companyPhotoUrl = localPreviewUrl;
        if (fieldName === 'appProfilePhoto') next.appPhotoUrl = localPreviewUrl;
        if (fieldName === 'policeClearance') next.policeVerificationUrl = localPreviewUrl;
        if (fieldName === 'govtIdFront') next.governmentIdFrontUrl = localPreviewUrl;
        if (fieldName === 'govtIdBack') next.governmentIdBackUrl = localPreviewUrl;
        return next;
      });

      // 2. Upload asset via POST /api/v1/assets/uploads
      const res = await uploadAsset({ file, kind });
      if (res?.success && res?.data?.url) {
        const remoteUrl = res.data.url;
        setFormData((prev) => {
          const next = { ...prev };
          next[fieldName] = remoteUrl;
          if (fieldName === 'internalProfilePhoto') next.companyPhotoUrl = remoteUrl;
          if (fieldName === 'appProfilePhoto') next.appPhotoUrl = remoteUrl;
          if (fieldName === 'policeClearance') next.policeVerificationUrl = remoteUrl;
          if (fieldName === 'govtIdFront') next.governmentIdFrontUrl = remoteUrl;
          if (fieldName === 'govtIdBack') next.governmentIdBackUrl = remoteUrl;
          return next;
        });
      }
    } catch (err) {
      console.warn('Asset upload fallback:', err?.message || err);
      // Keep the preview URL, but note error if applicable
      if (err?.message && !err.message.includes('network')) {
        setOnboardError(err.message);
      }
    } finally {
      setUploadingField(null);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    const currentCount = (formData.gallery || []).length;
    const availableSlots = 5 - currentCount;
    if (files.length > availableSlots) {
      setOnboardError(`You can add only ${availableSlots} more gallery image${availableSlots === 1 ? '' : 's'} (maximum 5).`);
      return;
    }

    setUploadingField('gallery');
    setOnboardError('');
    const uploadedUrls = [];
    const uploadErrors = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        uploadErrors.push(`${file.name}: select an image file.`);
        continue;
      }

      try {
        const res = await uploadAsset({ file, kind: 'SERVICE_IMAGE' });
        if (res?.success === false) {
          throw new Error(res.message || 'The image upload was rejected.');
        }
        const url = res?.data?.url || res?.url;
        if (!url) throw new Error('The upload did not return an image URL.');
        uploadedUrls.push(url);
      } catch (err) {
        uploadErrors.push(`${file.name}: ${err?.message || 'upload failed.'}`);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...uploadedUrls].slice(0, 5),
      }));
    }
    if (uploadErrors.length > 0) {
      setOnboardError(`Gallery upload issue: ${uploadErrors.join(' ')}`);
    }
    setUploadingField(null);
  };

  // Submit Therapist Onboarding via POST /api/v1/spa-owner/therapists
  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setOnboardError('');
    setOnboardSuccessData(null);

    if (uploadingField) {
      setOnboardError('Please wait for the selected file upload to finish.');
      return;
    }

    // Compulsory field validation: Mobile Number
    const cleanMobile = (formData.mobileNumber || '').replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      setOnboardError('Mobile number is compulsory and must contain at least 10 digits.');
      return;
    }

    // Compulsory field validation: App Profile Photo
    const appPhoto = formData.appPhotoUrl || formData.appProfilePhoto || formData.avatarUrl;
    if (!appPhoto) {
      setOnboardError('App Profile Photo is compulsory because it will be shown to customers on the app.');
      return;
    }

    const gallery = Array.isArray(formData.gallery) ? formData.gallery : [];
    if (gallery.length < 3 || gallery.length > 5) {
      setOnboardError('Add at least 3 and no more than 5 gallery images before onboarding.');
      return;
    }

    // Compulsory field validation: Display Name & Full Name
    if (!formData.displayName?.trim()) {
      setOnboardError('Display Name is required (shown to customers on the app).');
      return;
    }

    if (!formData.fullName?.trim()) {
      setOnboardError('Full Legal Name is required (for TherapyShala internal security purposes).');
      return;
    }

    // Compulsory field validation: Date of Birth (must be at least 18)
    const dobString = formData.dateOfBirth ? String(formData.dateOfBirth).trim() : '';
    if (!dobString) {
      setOnboardError('Provide a valid date of birth; therapist must be at least 18.');
      return;
    }
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (isNaN(birthDate.getTime()) || isNaN(age) || age < 18) {
      setOnboardError('Provide a valid date of birth; therapist must be at least 18.');
      return;
    }

    setOnboardLoading(true);

    try {
      // Map languages to 2-letter ISO codes (e.g. 'Hindi' -> 'hi', 'English' -> 'en')
      const rawLangs = formData.languagesSpoken || formData.languages || ['Hindi', 'English'];
      const langCodes = (Array.isArray(rawLangs) ? rawLangs : [rawLangs]).map((l) => {
        const str = String(l).trim().toLowerCase();
        if (str === 'hindi' || str === 'hi') return 'hi';
        if (str === 'english' || str === 'en') return 'en';
        if (str === 'bengali' || str === 'bn') return 'bn';
        if (str === 'marathi' || str === 'mr') return 'mr';
        if (str === 'telugu' || str === 'te') return 'te';
        if (str === 'tamil' || str === 'ta') return 'ta';
        if (str === 'gujarati' || str === 'gu') return 'gu';
        if (str === 'urdu' || str === 'ur') return 'ur';
        if (str === 'kannada' || str === 'kn') return 'kn';
        if (str === 'malayalam' || str === 'ml') return 'ml';
        if (str === 'punjabi' || str === 'pa') return 'pa';
        return str.slice(0, 2);
      });

      // Prepare workingLocation object
      const city = formData.city || formData.workingLocation?.city || 'Jaipur';
      const area = formData.area || formData.workingLocation?.area || 'C Scheme';
      const postalCode = formData.postalCode || formData.workingLocation?.postalCode || '302001';
      const formattedAddress =
        formData.formattedAddress ||
        formData.location ||
        formData.workingLocation?.formattedAddress ||
        `${area}, ${city}, Rajasthan`;
      const latitude = Number(
        formData.latitude ?? formData.lat ?? formData.workingLocation?.latitude ?? 26.9124
      );
      const longitude = Number(
        formData.longitude ?? formData.lng ?? formData.workingLocation?.longitude ?? 75.7873
      );
      // serviceRadiusKm must strictly be literal 5, 10, or 20 per backend API schema
      const rawRadius = Number(
        formData.serviceRadiusKm ??
          formData.radiusKm ??
          formData.workingLocation?.serviceRadiusKm ??
          10
      );
      let serviceRadiusKm = 10;
      if ([5, 10, 20].includes(rawRadius)) {
        serviceRadiusKm = rawRadius;
      } else if (rawRadius <= 7) {
        serviceRadiusKm = 5;
      } else if (rawRadius <= 15) {
        serviceRadiusKm = 10;
      } else {
        serviceRadiusKm = 20;
      }

      const placeId =
        formData.placeId || formData.workingLocation?.placeId || 'GOOGLE_PLACE_ID';

      const workingLocation = {
        placeId,
        city,
        area,
        postalCode,
        formattedAddress,
        latitude,
        longitude,
        serviceRadiusKm,
      };

      // Prepare excludedWorkAreas array
      const rawExcluded = formData.excludedWorkAreas?.length
        ? formData.excludedWorkAreas
        : formData.excludedLocations || [];

      const excludedWorkAreas = rawExcluded.map((item, idx) => {
        if (typeof item === 'string') {
          return {
            placeId: `EXCLUDED_PLACE_${idx + 1}`,
            name: item,
            latitude: 26.95,
            longitude: 75.8,
            radiusKm: 2,
          };
        }
        return {
          placeId: item.placeId || `EXCLUDED_PLACE_${idx + 1}`,
          name: item.name || 'Industrial Area',
          latitude: Number(item.latitude ?? item.lat ?? 26.95),
          longitude: Number(item.longitude ?? item.lng ?? 75.8),
          radiusKm: Number(item.radiusKm ?? item.radius ?? 2),
        };
      });

      // Prepare services array
      const formattedServices = (formData.services || []).map((srv) => ({
        categoryId: srv.categoryId || srv.id || '01M60X6ZE8D0YDWKPT0ENNDD8B',
        durationMinutes: Number(srv.durationMinutes) || 60,
        discountPrice: Number(srv.discountPrice) || 999,
        basePrice: Number(srv.basePrice) || 1200,
      }));

      if (formattedServices.length === 0) {
        formattedServices.push({
          categoryId: '01M60X6ZE8D0YDWKPT0ENNDD8B',
          durationMinutes: 60,
          discountPrice: 999,
          basePrice: 1200,
        });
      }

      // Exact request payload as specified by user
      const payload = {
        displayName: formData.displayName.trim(),
        fullName: formData.fullName.trim(),
        mobileNumber: cleanMobile.slice(-10),
        email: formData.email?.trim() || undefined,
        gender: formData.gender || 'FEMALE',
        dateOfBirth: formData.dateOfBirth || '1995-01-15',
        experienceYears: Number(formData.experienceYears) || 1,
        languagesSpoken: langCodes.length > 0 ? langCodes : ['hi', 'en'],
        workingLocation,
        excludedWorkAreas:
          excludedWorkAreas.length > 0
            ? excludedWorkAreas
            : [
                {
                  placeId: 'EXCLUDED_GOOGLE_PLACE_ID',
                  name: 'Industrial Area',
                  latitude: 26.95,
                  longitude: 75.8,
                  radiusKm: 2,
                },
              ],
        companyPhotoUrl:
          formData.companyPhotoUrl || formData.internalProfilePhoto || undefined,
        appPhotoUrl: appPhoto,
        policeVerificationUrl:
          formData.policeVerificationUrl || formData.policeClearance || undefined,
        governmentIdFrontUrl:
          formData.governmentIdFrontUrl || formData.govtIdFront || undefined,
        governmentIdBackUrl:
          formData.governmentIdBackUrl || formData.govtIdBack || undefined,
        galleryImages: gallery,
        services: formattedServices,
      };

      console.log('Dispatching POST /api/v1/spa-owner/therapists payload:', payload);

      const res = await onboardTherapist(payload);

      if (res?.success) {
        const createdData = res.data || {};
        const newTherapist = {
          _id: createdData.id || createdData._id || `THP-${Date.now().toString().slice(-6)}`,
          id: createdData.id || createdData._id || `THP-${Date.now().toString().slice(-6)}`,
          displayName: payload.displayName,
          fullName: payload.fullName,
          name: payload.displayName || payload.fullName,
          mobileNumber: payload.mobileNumber,
          phone: payload.mobileNumber,
          email: payload.email || '',
          gender: payload.gender,
          dateOfBirth: payload.dateOfBirth,
          experienceYears: payload.experienceYears,
          experience: `${payload.experienceYears} years`,
          languages: formData.languages || ['Hindi', 'English'],
          languagesSpoken: payload.languagesSpoken,
          location: workingLocation.formattedAddress,
          address: workingLocation.formattedAddress,
          workingLocation,
          excludedWorkAreas: payload.excludedWorkAreas,
          profilePhoto: payload.companyPhotoUrl || payload.appPhotoUrl,
          internalProfilePhoto: payload.companyPhotoUrl,
          appProfilePhoto: payload.appPhotoUrl,
          avatarUrl: payload.appPhotoUrl,
          policeClearance: payload.policeVerificationUrl,
          govtIdFront: payload.governmentIdFrontUrl,
          govtIdBack: payload.governmentIdBackUrl,
          galleryImages: payload.galleryImages,
          gallery: payload.galleryImages,
          services: payload.services,
          onDuty: true,
          status: 'ACTIVE',
          rating: 5.0,
          completedBookings: 0,
          createdAt: new Date().toISOString(),
          ...createdData,
        };

        setTherapists((prev) => [newTherapist, ...prev]);
        setTherapistsCount((prev) => prev + 1);

        setOnboardSuccessData({
          ...newTherapist,
          loginInstructions: {
            mobileNumber: cleanMobile,
            spaCode: ownerProfile?.spaCode || 'SPA-SANCTUARY',
            accessNote:
              'Therapist can log into the TherapyShala Partner Mobile App using this mobile number and OTP.',
          },
        });
      } else {
        setOnboardError(
          res?.message ||
            'Failed to complete therapist onboarding. Please review the details and try again.'
        );
      }
    } catch (err) {
      console.error('Onboard therapist API error:', err);
      if (err?.data?.errors && Array.isArray(err.data.errors)) {
        const errorDetails = err.data.errors
          .map((e) => `${e.path?.join('.') || e.field || ''}: ${e.message}`)
          .join(', ');
        setOnboardError(`Validation error: ${errorDetails}`);
      } else {
        setOnboardError(
          err?.message ||
            'Failed to connect to therapist onboarding service. Please verify your details.'
        );
      }
    } finally {
      setOnboardLoading(false);
    }
  };

  // Badges from API or fallbacks
  const sidebarBadges = dashboardData?.sidebarBadges || {};

  // Active Display Info (derived with API 1st priority, profile fallback)
  const activeBusinessName =
    dashboardData?.registeredSpa?.businessName || ownerProfile?.businessName || 'Sanctuary';
  const activeOwnerName =
    dashboardData?.registeredSpa?.authorizedOwner ||
    dashboardData?.registeredSpa?.ownerName ||
    ownerProfile?.ownerName ||
    'Spa Partner';
  const activeOwnerEmail =
    dashboardData?.registeredSpa?.registeredEmail ||
    dashboardData?.registeredSpa?.email ||
    ownerProfile?.email ||
    'partner@therapyshala.com';
  const activeOwnerPhone =
    dashboardData?.registeredSpa?.phone ||
    dashboardData?.registeredSpa?.mobileNumber ||
    ownerProfile?.phone ||
    ownerProfile?.mobileNumber ||
    '+91 85299 15523';

  // Nav menu items list
  const navItems = [
    { id: 'overview', label: 'Overview & Profile', icon: Building2, badge: sidebarBadges.overviewProfile },
    {
      id: 'therapists',
      label: 'Therapists Fleet',
      icon: Users,
      badge: sidebarBadges.therapistsFleet ?? (dashboardData?.therapistsSummary?.total ?? therapistsCount),
    },
    {
      id: 'bookings',
      label: 'Appointments & Booking',
      icon: CalendarCheck,
      badge: sidebarBadges.appointmentsBooking ?? (dashboardData?.bookingsSummary?.total ?? bookingsTotal),
    },
    {
      id: 'therapist-commission',
      label: 'Therapist Commission',
      icon: Percent,
      badge: null,
    },
    { id: 'commission', label: 'Commission Ledger', icon: Percent, badge: sidebarBadges.ownerCommission },
    { id: 'payout', label: 'Commission Payout', icon: Wallet, badge: sidebarBadges.commissionPayout },
    {
      id: 'sponsored',
      label: 'Spa Owner Referral Network',
      icon: Share2,
      badge: sponsoredData?.totalSponsoredSpas,
    },
    {
      id: 'penalty-report',
      label: 'Penalties & Audit Ledger',
      icon: Receipt,
      badge: sidebarBadges.penaltiesAuditLedger ?? (dashboardData?.penaltiesSummary?.totalPenaltiesCount ?? (penaltiesReport?.records?.length || 0)),
    },
    { id: 'penalty', label: 'Cancellation Policy Matrix', icon: AlertTriangle, badge: sidebarBadges.cancellationPolicyMatrix },
    { id: 'settings', label: 'Spa Settings', icon: Settings, badge: sidebarBadges.spaSettings },
    {
      id: 'messages',
      label: 'Client Messages & Chat',
      icon: MessageSquare,
      badge: 2,
    },
    {
      id: 'profile',
      label: 'Spa Profile & App Showcase',
      icon: User,
      badge: isProfileLocked ? 'Required' : '5 Img',
    },
    {
      id: 'support',
      label: 'Help & Partner Support',
      icon: LifeBuoy,
      badge: '24/7',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#0D0D12] flex flex-col md:flex-row">
      
      {/* SIDEBAR DASHBOARD NAVIGATION */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200/90 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header (Fixed at top) */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <TherapyshalaLogo className="h-9 w-auto object-contain" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#F35271] block">
                Spa Owner Portal
              </span>
              <span className="text-xs font-bold text-[#0D0D12] truncate max-w-[150px] block">
                {activeBusinessName}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Middle Section */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 py-2">
          {/* Spa Code Chip */}
          <div className="mx-4 my-2 p-3 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">Assigned Code</span>
              <span className="font-mono font-bold text-xs text-[#0D0D12]">
                {activeSpaCode}
              </span>
            </div>
            <button
              onClick={() => handleCopyCode(activeSpaCode)}
              className="p-1.5 rounded-lg bg-white shadow-2xs hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
              title="Copy Spa Code"
            >
              {copiedSpaCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Locked Notice inside sidebar if profile is incomplete */}
          {isProfileLocked && (
            <div className="mx-3.5 mb-2.5 p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200/90 text-amber-900 shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Lock className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-bold">Portal Features Locked</span>
              </div>
              <p className="text-[10px] text-amber-800 leading-tight">
                Complete and save your <strong>Spa Profile & App Showcase</strong> to unlock all sections.
              </p>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="px-3 py-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isLocked = isProfileLocked && item.id !== 'profile';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (isLocked) {
                      setLockedAttemptAlert(true);
                      setTimeout(() => setLockedAttemptAlert(false), 4500);
                      return;
                    }
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isLocked
                      ? 'opacity-40 cursor-not-allowed text-gray-400 bg-transparent hover:bg-transparent select-none'
                      : isActive
                      ? 'bg-[#0D0D12] text-white shadow-xs cursor-pointer'
                      : 'text-[#757880] hover:text-[#0D0D12] hover:bg-gray-100/70 cursor-pointer'
                  }`}
                  title={isLocked ? 'Locked until Spa Profile & App Showcase is completed' : item.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isLocked ? 'text-gray-300' : isActive ? 'text-[#F35271]' : 'text-gray-400'}`} />
                    <span className={isLocked ? 'text-gray-400' : ''}>{item.label}</span>
                  </div>

                  {isLocked ? (
                    <span className="p-1 rounded-md bg-gray-100 text-gray-400 flex items-center justify-center shrink-0" title="Locked">
                      <Lock className="w-3 h-3 text-gray-400" />
                    </span>
                  ) : isProfileLocked && item.id === 'profile' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                      Required
                    </span>
                  ) : item.badge !== undefined && item.badge > 0 ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-[#F35271] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Fixed at bottom) */}
        <div className="p-4 border-t border-gray-100 bg-[#FAFAFA] shrink-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0D0D12] truncate">
                {activeOwnerName}
              </p>
              <p className="text-[10px] text-[#757880] truncate">
                {activeOwnerEmail}
              </p>
            </div>
            <button
              onClick={async () => {
                await logoutOwner();
                navigate('/login');
              }}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* BACKDROP FOR MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#0D0D12]/50 md:hidden backdrop-blur-2xs"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER BAR */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#0D0D12]">
                {navItems.find((n) => n.id === activeSection)?.label || 'Spa Dashboard'}
              </h1>
              <p className="text-[11px] text-[#757880]">
                {activeBusinessName} • {activeSpaCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search matching user screenshot */}
            <div className="hidden lg:flex items-center relative">
              <input
                type="text"
                placeholder="Customer Mobile/Name/ID"
                className="w-56 xl:w-64 pl-3.5 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs text-[#0D0D12] placeholder-gray-400 focus:outline-none focus:border-[#F35271]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick Add Button matching screenshot (+) */}
            <button
              onClick={() => {
                if (isProfileLocked) {
                  setLockedAttemptAlert(true);
                  setTimeout(() => setLockedAttemptAlert(false), 4500);
                  return;
                }
                setFormData(initialFormState);
                setOnboardError('');
                setOnboardSuccessData(null);
                setActiveSection('therapists');
                setTherapistSubView('onboard');
              }}
              disabled={isProfileLocked}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors shadow-2xs ${
                isProfileLocked
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  : 'border-gray-200/90 hover:bg-gray-50 text-gray-700 cursor-pointer'
              }`}
              title={isProfileLocked ? 'Locked: Complete Spa Profile & App Showcase first' : 'Quick Add Therapist'}
            >
              {isProfileLocked ? <Lock className="w-3.5 h-3.5 text-gray-400" /> : <UserPlus className="w-4 h-4" />}
            </button>

            {/* Quick Support Desk Button */}
            <button
              onClick={() => {
                if (isProfileLocked) {
                  setLockedAttemptAlert(true);
                  setTimeout(() => setLockedAttemptAlert(false), 4500);
                  return;
                }
                setActiveSection('support');
              }}
              disabled={isProfileLocked}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors shadow-2xs ${
                isProfileLocked
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  : activeSection === 'support'
                  ? 'border-[#F35271] bg-rose-50 text-[#F35271] cursor-pointer'
                  : 'border-gray-200/90 hover:bg-gray-50 text-gray-700 cursor-pointer'
              }`}
              title={isProfileLocked ? 'Locked: Complete Spa Profile & App Showcase first' : 'Help & Priority Support Desk'}
            >
              <LifeBuoy className="w-4 h-4" />
            </button>

            {/* Bell Icon & Dropdown Popup (Matching screenshot exactly) */}
            <div className="relative" ref={notificationDropdownRef}>
              <button
                onClick={() => {
                  setNotificationDropdownOpen((prev) => !prev);
                }}
                className={`relative w-10 h-10 rounded-2xl border transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                  notificationDropdownOpen
                    ? 'border-[#DE4B73] bg-[#FFEEF1] text-[#DE4B73]'
                    : 'border-rose-200/70 bg-[#FFF5F7] hover:bg-[#FFEEF1] text-[#DE4B73]'
                }`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {/* Green Live/Unread Indicator dot */}
                {(notificationsUnreadCount > 0 || dashboardNotifications.some((n) => !n.read)) && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </button>

              {/* Popup Dropdown Card matching screenshot */}
              <AnimatePresence>
                {notificationDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2.5 w-[330px] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-gray-200/90 overflow-hidden z-50 text-left font-sans-modern"
                  >
                    {/* Header Row */}
                    <div className="p-4 sm:p-5 pb-3 flex items-center justify-between border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#DE4B73] flex items-center justify-center shadow-2xs">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-[#0D0D12]">
                              Notifications
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                              socketStatus === 'connected'
                                ? 'bg-emerald-50 border-emerald-200/80 text-emerald-700'
                                : socketStatus === 'connecting'
                                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                                  : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                socketStatus === 'connected'
                                  ? 'bg-emerald-500 animate-pulse'
                                  : socketStatus === 'connecting'
                                    ? 'bg-amber-500 animate-pulse'
                                    : 'bg-gray-400'
                              }`} />
                              {socketStatus === 'connected'
                                ? 'Live'
                                : socketStatus === 'connecting'
                                  ? 'Connecting'
                                  : socketStatus === 'error'
                                    ? 'Offline'
                                    : 'Disconnected'}
                            </span>
                          </div>
                          <p className="text-xs text-[#757880]">
                            {(notificationsUnreadCount > 0
                              ? notificationsUnreadCount
                              : dashboardNotifications.filter((n) => !n.read).length) === 0
                              ? 'All caught up!'
                              : `${notificationsUnreadCount || dashboardNotifications.filter((n) => !n.read).length} unread updates`}
                          </p>
                        </div>
                      </div>

                      {socketStatus === 'error' && (
                        <div className="mx-4 sm:mx-5 mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
                          Live notifications are disconnected. Saved notifications remain available; retry by refreshing the dashboard.
                        </div>
                      )}

                      {soundPlaybackBlocked && (
                        <div className="mx-4 sm:mx-5 mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-center justify-between gap-3">
                          <p className="text-[11px] leading-relaxed text-amber-900">
                            Browser blocked notification audio. Enable sound to hear the alert.
                          </p>
                          <button
                            type="button"
                            onClick={enableNotificationSound}
                            className="shrink-0 rounded-lg bg-amber-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-amber-700"
                          >
                            Enable sound
                          </button>
                        </div>
                      )}

                      {/* Top Right Controls (Volume & Refresh) */}
                      <div className="flex items-center gap-1 text-gray-500">
                        <button
                          onClick={toggleNotificationSound}
                          className={`p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer ${
                            isSoundMuted ? 'text-red-500' : 'text-emerald-600'
                          }`}
                          title={isSoundMuted ? 'Sound Muted (Click to Enable)' : 'Sound Enabled (Click to Mute)'}
                        >
                          {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            fetchDashboard();
                            fetchBookings();
                            fetchNotifications();
                          }}
                          className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                          title="Refresh Notifications & Bookings"
                        >
                          <RefreshCw
                            className={`w-4 h-4 ${
                              dashboardLoading || bookingsLoading || notificationsLoading
                                ? 'animate-spin text-[#DE4B73]'
                                : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Filter Segmented Bar */}
                    <div className="p-3 bg-[#F8F9FA]/80 border-b border-gray-150/70">
                      <div className="bg-[#E9ECEF]/70 p-1 rounded-2xl flex items-center gap-1 text-xs overflow-x-auto">
                        {[
                          { id: 'all', label: 'All' },
                          { id: 'unread', label: 'Unread' },
                          { id: 'bookings', label: 'Bookings' },
                          { id: 'therapists', label: 'Therapists' },
                          { id: 'payments', label: 'Payments' },
                          { id: 'support', label: 'Support' },
                          { id: 'account', label: 'Account' },
                          { id: 'sponsored', label: 'Sponsored' },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setNotificationActiveTab(tab.id)}
                            className={`shrink-0 px-3 py-1.5 rounded-xl font-bold transition-all text-center cursor-pointer ${
                              notificationActiveTab === tab.id
                                ? 'bg-white text-[#0D0D12] shadow-xs'
                                : 'text-gray-500 hover:text-gray-800'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notification Body List or Empty State */}
                    <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100 p-2">
                      {(() => {
                        const filtered = dashboardNotifications.filter((n) => {
                          if (notificationActiveTab === 'unread') return !n.read;
                          if (notificationActiveTab !== 'all')
                            return n.category === notificationActiveTab;
                          return true;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="py-10 px-4 text-center space-y-2">
                              <div className="w-10 h-10 mx-auto text-gray-400 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 stroke-[1.5]" />
                              </div>
                              <h4 className="text-sm font-bold text-[#0D0D12]">
                                No notifications
                              </h4>
                              <p className="text-xs text-gray-500 max-w-[240px] mx-auto leading-relaxed">
                                Booking, therapist, payout, support, and account updates will appear here.
                              </p>
                            </div>
                          );
                        }

                        return (
                          <>
                            {filtered.map((n) => (
                              <div
                                key={n.id}
                                onClick={() => {
                                  if (!n.read) {
                                    handleMarkAsRead(n.id);
                                  }
                                  setActiveSection(getOwnerNotificationSection(n));
                                  setNotificationDropdownOpen(false);
                                }}
                                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                                  !n.read ? 'bg-[#FFF0F3]/40 hover:bg-[#FFF0F3]/70' : 'hover:bg-gray-50'
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                    !n.read ? 'bg-[#DE4B73]' : 'bg-transparent'
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <h5
                                      className={`text-xs truncate ${
                                        !n.read ? 'font-bold text-[#0D0D12]' : 'font-medium text-gray-700'
                                      }`}
                                    >
                                      {n.title}
                                    </h5>
                                    <span className="text-[10px] text-gray-400 shrink-0">{n.time}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5 line-clamp-2">
                                    {n.desc}
                                  </p>
                                </div>
                              </div>
                            ))}

                            {notificationsNextCursor && (
                              <div className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    fetchNotifications({
                                      cursor: notificationsNextCursor,
                                      append: true,
                                    })
                                  }
                                  disabled={notificationsLoading}
                                  className="text-xs text-[#DE4B73] hover:underline font-bold cursor-pointer py-1"
                                >
                                  {notificationsLoading ? 'Loading more...' : 'Load previous notifications'}
                                </button>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    {/* Bottom Footer Actions */}
                    <div className="p-3 bg-gray-50/80 border-t border-gray-150 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleMarkAllAsRead()}
                        className="text-xs font-semibold text-[#DE4B73] hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                      <button
                        onClick={() => {
                          setActiveSection('bookings');
                          setNotificationDropdownOpen(false);
                        }}
                        className="text-xs font-bold text-gray-700 hover:text-black flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Appointments</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                fetchDashboard();
                fetchProfile();
                fetchTherapists();
                fetchBookings();
              }}
              disabled={dashboardLoading || profileLoading || therapistsLoading || bookingsLoading}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
              title="Sync Data"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  dashboardLoading || profileLoading || therapistsLoading || bookingsLoading ? 'animate-spin' : ''
                }`}
              />
            </button>

            <button
              onClick={() => {
                if (isProfileLocked) {
                  setLockedAttemptAlert(true);
                  setTimeout(() => setLockedAttemptAlert(false), 4500);
                  return;
                }
                setFormData(initialFormState);
                setOnboardError('');
                setOnboardSuccessData(null);
                setActiveSection('therapists');
                setTherapistSubView('onboard');
              }}
              className={`px-3.5 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                isProfileLocked
                  ? 'bg-gray-400 opacity-60 cursor-not-allowed'
                  : 'bg-[#F35271] hover:bg-[#E04362]'
              }`}
              title={isProfileLocked ? 'Locked: Complete Spa Profile & App Showcase first' : 'Onboard Therapist'}
            >
              {isProfileLocked ? <Lock className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Onboard Therapist</span>
            </button>
          </div>
        </header>

        {/* DYNAMIC CONTENT CONTAINER */}
        <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full">

          {/* Locked Navigation Attempt Alert */}
          {lockedAttemptAlert && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  Portal Access Restricted: All sidebar sections are locked. Please complete and save your <strong>Spa Profile & App Showcase</strong> below to unlock full portal access.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLockedAttemptAlert(false)}
                className="text-amber-700 hover:text-amber-900 cursor-pointer font-bold ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Persistent Profile Setup Gate Banner */}
          {isProfileLocked && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-2 border-amber-300/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-[#0D0D12]">
                      Action Compulsory: Complete Spa Profile & App Showcase
                    </h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-900 font-extrabold uppercase tracking-wider">
                      Sidebar Sections Locked
                    </span>
                  </div>
                  <p className="text-xs text-[#757880] mt-0.5">
                    All other portal modules (Therapists, Appointments, Commissions, Payouts, Settings) are locked. Please provide your business profile, sanctuary showcase media, KYC documents, and settlement account below to unlock your dashboard.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 bg-white px-3.5 py-2 rounded-2xl border border-amber-200 shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Mandatory Step</span>
                </span>
              </div>
            </div>
          )}

          {/* 1. OVERVIEW & PROFILE (API 3) */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              
              {/* Error Banner */}
              {(dashboardError || profileError) && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{dashboardError || profileError}</span>
                  </div>
                  <button
                    onClick={() => {
                      fetchDashboard();
                      fetchProfile();
                      fetchTherapists();
                      fetchBookings();
                    }}
                    className="px-3 py-1 bg-white border border-red-200 rounded-lg font-semibold hover:bg-red-100 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Partner Sponsor Program Banner in Overview */}
              <div className="bg-gradient-to-r from-rose-50/70 via-white to-amber-50/50 rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F35271] text-white flex items-center justify-center shadow-xs shrink-0 mt-1 sm:mt-0">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#F35271] bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                        Partner Sponsor Network
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {sponsoredData?.totalSponsoredSpas ? `${sponsoredData.totalSponsoredSpas} Sub-Spas Registered` : '0 Sub-Spas Registered'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-[#0D0D12]">
                        My Sponsor Code:
                      </h3>
                      <span className="font-mono font-black text-sm tracking-wider text-[#F35271] bg-white px-2.5 py-0.5 rounded-lg border border-rose-200">
                        {sponsoredData?.mySponsorCode || activeSpaCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#757880] mt-1">
                      Share this code with new Spa Owners. When they register in the Enquiry form, they link to your partner network.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-rose-100">
                  <button
                    onClick={() => handleCopySponsorCode(sponsoredData?.mySponsorCode || activeSpaCode)}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-[#0D0D12] text-xs font-bold hover:bg-gray-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedSponsorCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSponsorCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('sponsored');
                      fetchSponsoredSpas();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#0D0D12] hover:bg-[#F35271] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>View Network</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 1. Core Metrics KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active Therapists */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between text-[#757880] mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Active Therapists</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-[#0D0D12]">
                    {dashboardLoading ? (
                      <div className="h-8 w-12 bg-gray-200 rounded-md animate-pulse" />
                    ) : (
                      dashboardData?.metrics?.activeTherapists ??
                      (dashboardData?.therapistsSummary?.active ?? therapistsCount)
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880] mt-1">
                    {dashboardData?.metrics?.activeTherapistsSubtext ||
                      (dashboardData?.therapistsSummary
                        ? `${dashboardData.therapistsSummary.onDuty || 0} on duty • ${dashboardData.therapistsSummary.total || 0} total`
                        : 'Practitioners registered under spa code')}
                  </p>
                </div>

                {/* Total Bookings */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between text-[#757880] mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Bookings</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CalendarCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-[#0D0D12]">
                    {dashboardLoading ? (
                      <div className="h-8 w-12 bg-gray-200 rounded-md animate-pulse" />
                    ) : (
                      dashboardData?.metrics?.totalBookings ??
                      (dashboardData?.bookingsSummary?.total ?? bookingsTotal)
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880] mt-1">
                    {dashboardData?.metrics?.totalBookingsSubtext ||
                      (dashboardData?.bookingsSummary
                        ? `${dashboardData.bookingsSummary.completed || 0} completed • ${dashboardData.bookingsSummary.pending || 0} pending`
                        : 'Appointments booked for spa')}
                  </p>
                </div>

                {/* Owner Revenue */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between text-[#757880] mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Owner Revenue</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-[#0D0D12]">
                    {dashboardLoading ? (
                      <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse" />
                    ) : (
                      dashboardData?.metrics?.ownerRevenueFormatted ||
                      (dashboardData?.metrics?.ownerRevenueRupees !== undefined
                        ? `₹${Number(dashboardData.metrics.ownerRevenueRupees).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : dashboardData?.financials?.totalCommissionRupees !== undefined
                        ? `₹${Number(dashboardData.financials.totalCommissionRupees).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : '₹0.00')
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    {dashboardData?.metrics?.revenueShareSubtext ||
                      `${dashboardData?.metrics?.revenueSharePercentage ?? 10}% Revenue Share active`}
                  </p>
                </div>

                {/* Account Status */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between text-[#757880] mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Account Status</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-600">
                    {dashboardData?.metrics?.accountStatus ||
                      dashboardData?.registeredSpa?.status ||
                      ownerProfile?.status ||
                      'ACTIVE'}
                  </div>
                  <p className="text-[11px] text-[#757880] mt-1">
                    {dashboardData?.metrics?.accountStatusSubtext ||
                      (dashboardData?.registeredSpa?.isVerified
                        ? 'Verified partner license'
                        : 'Partner license active')}
                  </p>
                </div>
              </div>

              {/* 2. Financial Performance & Commission Breakdown */}
              {dashboardData?.financials && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#0D0D12] uppercase tracking-wider">
                          Financial Performance & Commission Ledger
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                          {dashboardData.financials.activeCommissionPercentage || 10}% Revenue Share
                        </span>
                      </div>
                      <p className="text-xs text-[#757880] mt-0.5">
                        Real-time revenue split across bookings and payouts
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveSection('commission')}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-[#0D0D12] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5 text-[#F35271]" />
                        <span>Commission Ledger</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveSection('payout');
                          setPayoutSubView('request');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#0D0D12] hover:bg-gray-800 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Wallet className="w-3.5 h-3.5 text-[#F35271]" />
                        <span>Request Payout</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-[#757880] block mb-1">
                        Gross Booking Sales
                      </span>
                      <strong className="text-base font-extrabold text-[#0D0D12]">
                        ₹{Number(dashboardData.financials.grossBookingSalesRupees || 0).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                        Total Commission
                      </span>
                      <strong className="text-base font-extrabold text-emerald-700">
                        ₹{Number(dashboardData.financials.totalCommissionRupees || 0).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
                      <span className="text-[10px] uppercase font-bold text-rose-800 block mb-1">
                        Available Balance
                      </span>
                      <strong className="text-base font-extrabold text-[#F35271]">
                        ₹{Number(dashboardData.financials.availablePayoutBalanceRupees || 0).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-[#757880] block mb-1">
                        This Month Earned
                      </span>
                      <strong className="text-base font-extrabold text-[#0D0D12]">
                        ₹{Number(dashboardData.financials.thisMonthCommissionRupees || 0).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-[#757880] block mb-1">
                        Total Paid Out
                      </span>
                      <strong className="text-base font-extrabold text-[#0D0D12]">
                        ₹{Number(dashboardData.financials.totalPaidOutRupees || 0).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-[#757880] block mb-1">
                        Pending Payout
                      </span>
                      <strong className="text-base font-extrabold text-[#0D0D12]">
                        ₹{Number(dashboardData.financials.pendingPayoutRupees || 0).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Operational Snapshot Grid: Bookings Summary & Therapists Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bookings Summary Breakdown */}
                {dashboardData?.bookingsSummary && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#0D0D12] uppercase tracking-wider">
                              Appointments Status
                            </h4>
                            <span className="text-[11px] text-[#757880]">
                              {dashboardData.bookingsSummary.total || 0} Total appointments recorded
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveSection('bookings')}
                          className="text-[11px] font-bold text-[#F35271] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-2">
                        <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-center">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 block">Completed</span>
                          <span className="text-lg font-black text-emerald-700">
                            {dashboardData.bookingsSummary.completed || 0}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-100 text-center">
                          <span className="text-[10px] uppercase font-bold text-amber-800 block">Pending</span>
                          <span className="text-lg font-black text-amber-700">
                            {dashboardData.bookingsSummary.pending || 0}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-100 text-center">
                          <span className="text-[10px] uppercase font-bold text-blue-800 block">Accepted</span>
                          <span className="text-lg font-black text-blue-700">
                            {dashboardData.bookingsSummary.accepted || 0}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-center">
                          <span className="text-[10px] uppercase font-bold text-indigo-800 block">In Progress</span>
                          <span className="text-lg font-black text-indigo-700">
                            {dashboardData.bookingsSummary.inProgress || 0}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-100 text-center">
                          <span className="text-[10px] uppercase font-bold text-rose-800 block">Cancelled</span>
                          <span className="text-lg font-black text-rose-700">
                            {dashboardData.bookingsSummary.cancelled || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Therapists Fleet Status Breakdown */}
                {dashboardData?.therapistsSummary && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#0D0D12] uppercase tracking-wider">
                              Therapists Fleet Duty
                            </h4>
                            <span className="text-[11px] text-[#757880]">
                              {dashboardData.therapistsSummary.total || 0} Practitioners affiliated
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveSection('therapists')}
                          className="text-[11px] font-bold text-[#F35271] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>Fleet Roster</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                          <span className="text-[10px] uppercase font-bold text-[#757880] block">Total</span>
                          <span className="text-lg font-black text-[#0D0D12]">
                            {dashboardData.therapistsSummary.total || 0}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-center">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 block">Active</span>
                          <span className="text-lg font-black text-emerald-700">
                            {dashboardData.therapistsSummary.active || 0}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-teal-50/80 border border-teal-100 text-center">
                          <span className="text-[10px] uppercase font-bold text-teal-800 block">On Duty</span>
                          <span className="text-lg font-black text-teal-700 flex items-center justify-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                            {dashboardData.therapistsSummary.onDuty || 0}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                          <span className="text-[10px] uppercase font-bold text-[#757880] block">Inactive</span>
                          <span className="text-lg font-black text-gray-500">
                            {dashboardData.therapistsSummary.inactive || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Recent Bookings Feed (Live from Dashboard API) */}
              {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#0D0D12] uppercase tracking-wider">
                          Recent Appointments
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#F35271] text-[10px] font-extrabold">
                          Live Feed
                        </span>
                      </div>
                      <p className="text-xs text-[#757880] mt-0.5">
                        Latest appointments booked with your registered therapists
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveSection('bookings')}
                      className="text-xs font-bold text-[#F35271] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>View All Appointments</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-[10px] uppercase font-bold text-[#757880] tracking-wider">
                          <th className="py-3 px-3">Booking ID / Code</th>
                          <th className="py-3 px-3">Service</th>
                          <th className="py-3 px-3">Customer</th>
                          <th className="py-3 px-3">Therapist</th>
                          <th className="py-3 px-3">Scheduled Date</th>
                          <th className="py-3 px-3">Amount</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dashboardData.recentBookings.map((b) => {
                          const isCompleted = b.status === 'COMPLETED';
                          const isPending = b.status?.includes('PENDING');
                          const isCancelled = b.status?.includes('CANCEL');

                          return (
                            <tr
                              key={b.bookingId || b.bookingNumber}
                              className="hover:bg-gray-50/70 transition-colors"
                            >
                              <td className="py-3 px-3 font-mono font-bold text-[#0D0D12]">
                                <div className="truncate max-w-[140px]" title={b.bookingNumber || b.bookingId}>
                                  {b.bookingNumber ? b.bookingNumber.slice(0, 18) + '...' : b.bookingId}
                                </div>
                              </td>
                              <td className="py-3 px-3 font-semibold text-[#0D0D12]">
                                {b.serviceName || 'Full Body Massage'}
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-semibold text-[#0D0D12]">
                                  {b.customer?.fullName || 'Customer'}
                                </div>
                                <div className="text-[10px] text-[#757880]">
                                  {b.customer?.phoneE164 || '—'}
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  {b.therapist?.avatarUrl ? (
                                    <img
                                      src={b.therapist.avatarUrl}
                                      alt={b.therapist.name}
                                      className="w-6 h-6 rounded-full object-cover border border-gray-200"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-rose-50 text-[#F35271] text-[10px] font-bold flex items-center justify-center">
                                      {b.therapist?.name?.[0] || 'T'}
                                    </div>
                                  )}
                                  <span className="font-semibold text-[#0D0D12]">
                                    {b.therapist?.name || 'Assigned Therapist'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-[#757880]">
                                {b.scheduledDate
                                  ? new Date(b.scheduledDate).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : '—'}
                              </td>
                              <td className="py-3 px-3 font-bold text-[#0D0D12]">
                                ₹{Number(b.amountRupees || 0).toLocaleString('en-IN', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex flex-col gap-1 items-start">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                      isCompleted
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : isPending
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : isCancelled
                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                                    }`}
                                  >
                                    {b.status}
                                  </span>
                                  {b.paymentStatus && (
                                    <span className="text-[9px] font-mono text-[#757880]">
                                      {b.paymentStatus}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => handleViewBookingDetails(b)}
                                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#0D0D12] hover:text-white text-[#0D0D12] text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  View Dossier
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. Registered Spa Profile Card */}
              {(() => {
                const spaInfo = dashboardData?.registeredSpa || ownerProfile || {};
                const spaCodeVal =
                  dashboardData?.assignedCode ||
                  spaInfo.assignedSpaCode ||
                  spaInfo.spaCode ||
                  'SPA-PENDING';
                const categories =
                  spaInfo.offeredTreatmentCategories ||
                  spaInfo.servicesOffered ||
                  ['Massage', 'Ayurveda', 'Facial'];

                return (
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-sm font-bold text-[#0D0D12] uppercase tracking-wider flex items-center gap-2">
                        <span>Registered Spa Sanctuary Dossier</span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified Partner</span>
                        </span>
                      </h3>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveSection('profile')}
                          className="text-xs font-bold text-[#F35271] hover:text-[#E04362] bg-[#FFEEF1] hover:bg-[#F35271] hover:text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Edit App Profile & Media</span>
                        </button>
                        <button
                          onClick={() => setActiveSection('settings')}
                          className="text-xs font-bold text-[#757880] hover:text-[#0D0D12] flex items-center gap-1 cursor-pointer px-2 py-1.5"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>Settings</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                      <div>
                        <span className="text-[#757880] block mb-1">Business Sanctuary Name</span>
                        <strong className="text-sm font-semibold text-[#0D0D12]">
                          {spaInfo.businessName || '—'}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[#757880] block mb-1">Authorized Owner</span>
                        <strong className="text-sm font-semibold text-[#0D0D12]">
                          {spaInfo.authorizedOwner || spaInfo.ownerName || '—'}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[#757880] block mb-1">Assigned Spa Code</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-mono font-bold text-[#F35271]">
                            {spaCodeVal}
                          </strong>
                          <button
                            onClick={() => handleCopyCode(spaCodeVal)}
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
                            title="Copy code"
                          >
                            {copiedSpaCode ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[#757880] block mb-1">Registered Email</span>
                        <span className="text-sm text-[#0D0D12] font-medium">
                          {spaInfo.registeredEmail || spaInfo.email || '—'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#757880] block mb-1">Contact Phone</span>
                        <span className="text-sm text-[#0D0D12] font-medium">
                          {spaInfo.contactPhone || spaInfo.phone || '—'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#757880] block mb-1">Registered Date</span>
                        <span className="text-sm text-[#0D0D12] font-medium">
                          {spaInfo.registeredDate ||
                            (spaInfo.createdAt
                              ? new Date(spaInfo.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Verified')}
                        </span>
                      </div>

                      <div className="md:col-span-2 lg:col-span-3 pt-3 border-t border-gray-100">
                        <span className="text-[#757880] block mb-2 font-semibold">
                          Offered Treatment Categories:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((srv, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 rounded-xl bg-gray-100 text-[#0D0D12] font-semibold text-xs border border-gray-200/60"
                              >
                                {srv}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">Massage, Ayurveda, Facial</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* 2. THERAPISTS FLEET (In-Page Roster, Onboarding & Dossier - NO POPUPS) */}
          {activeSection === 'therapists' && (
            therapistSubView === 'onboard' ? (
              <TherapistOnboardingInPage
                formData={formData}
                setFormData={setFormData}
                onboardLoading={onboardLoading}
                onboardError={onboardError}
                setOnboardError={setOnboardError}
                onboardSuccessData={onboardSuccessData}
                setOnboardSuccessData={setOnboardSuccessData}
                handleOnboardSubmit={handleOnboardSubmit}
                handleFileUpload={handleFileUpload}
                handleGalleryUpload={handleGalleryUpload}
                uploadingField={uploadingField}
                getSampleTherapistData={getSampleTherapistData}
                onBack={() => {
                  setTherapistSubView('list');
                  setOnboardSuccessData(null);
                }}
                ownerProfile={ownerProfile}
              />
            ) : therapistSubView === 'details' && selectedTherapist ? (
              <TherapistDetailInPage
                therapist={selectedTherapist}
                onBack={() => {
                  setTherapistSubView('list');
                  setSelectedTherapist(null);
                }}
                ownerProfile={ownerProfile}
                onToggleDuty={handleToggleTherapistDuty}
              />
            ) : (
              <div className="space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0D0D12]">Therapist Fleet Roster</h3>
                    <p className="text-xs text-[#757880]">
                      {therapists.length} registered practitioner{therapists.length === 1 ? '' : 's'} linked to {ownerProfile?.spaCode || 'your spa'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fetchTherapists()}
                      disabled={therapistsLoading}
                      className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                      title="Refresh Fleet"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${therapistsLoading ? 'animate-spin text-[#F35271]' : ''}`} />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData(initialFormState);
                        setOnboardError('');
                        setOnboardSuccessData(null);
                        setTherapistSubView('onboard');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Onboard New Therapist</span>
                    </button>
                  </div>
                </div>

                {/* Fleet KPI Summary Bar (4 Cards) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[#757880]">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Total Fleet</span>
                      <Users className="w-4 h-4 text-[#F35271]" />
                    </div>
                    <div className="text-2xl font-extrabold text-[#0D0D12]">{therapists.length}</div>
                    <p className="text-[11px] text-gray-500">Registered practitioners</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[#757880]">
                      <span className="text-[11px] font-bold uppercase tracking-wider">On Duty Available</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-700">
                      {therapists.filter((t) => t.dutyStatus === 'ON_DUTY').length}
                    </div>
                    <p className="text-[11px] text-emerald-600 font-medium">Ready for bookings</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[#757880]">
                      <span className="text-[11px] font-bold uppercase tracking-wider">KYC Verified</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-extrabold text-[#0D0D12]">
                      {therapists.filter((t) => t.kyc?.status === 'VERIFIED').length || therapists.length}
                    </div>
                    <p className="text-[11px] text-gray-500">100% verified credentials</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[#757880]">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Coverage Radius</span>
                      <MapPin className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-[#0D0D12]">10 - 25 KM</div>
                    <p className="text-[11px] text-gray-500">Google Maps Verified</p>
                  </div>
                </div>

                {/* Toolbar: Search & Filter Controls */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={therapistSearchTerm}
                      onChange={(e) => setTherapistSearchTerm(e.target.value)}
                      placeholder="Search therapist by name, phone, city, or specialization..."
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none bg-gray-50/50"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-semibold">Duty:</span>
                    <button
                      type="button"
                      onClick={() => setTherapistDutyFilter('ALL')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                        therapistDutyFilter === 'ALL'
                          ? 'bg-[#0D0D12] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      All ({therapists.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTherapistDutyFilter('ON_DUTY')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        therapistDutyFilter === 'ON_DUTY'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>On Duty</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTherapistDutyFilter('OFF_DUTY')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                        therapistDutyFilter === 'OFF_DUTY'
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Off Duty
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {therapistsError && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{therapistsError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchTherapists()}
                      className="px-3 py-1 bg-white border border-red-200 rounded-lg font-semibold hover:bg-red-100 cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {therapists.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-4">
                    <div className="w-16 h-16 rounded-full bg-rose-50 text-[#F35271] flex items-center justify-center mx-auto mb-2">
                      <Users className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-[#0D0D12]">No Therapists Onboarded Yet</h4>
                    <p className="text-xs text-[#757880] max-w-sm mx-auto">
                      Onboard therapists for your spa so they can take customer appointments on the mobile app.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(initialFormState);
                        setOnboardError('');
                        setOnboardSuccessData(null);
                        setTherapistSubView('onboard');
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#F35271] text-white text-xs font-bold hover:bg-[#E04362] cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Onboard First Therapist</span>
                    </button>
                  </div>
                ) : (
                  /* Luxury Therapists Fleet Grid */
                  <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {therapists
                      .filter((th) => {
                        const term = therapistSearchTerm.toLowerCase().trim();
                        const matchesSearch =
                          !term ||
                          th.fullName?.toLowerCase().includes(term) ||
                          th.phone?.toLowerCase().includes(term) ||
                          th.email?.toLowerCase().includes(term) ||
                          th.city?.toLowerCase().includes(term) ||
                          th.area?.toLowerCase().includes(term);
                        const matchesDuty =
                          therapistDutyFilter === 'ALL' ||
                          (therapistDutyFilter === 'ON_DUTY' && th.dutyStatus === 'ON_DUTY') ||
                          (therapistDutyFilter === 'OFF_DUTY' && th.dutyStatus !== 'ON_DUTY');
                        return matchesSearch && matchesDuty;
                      })
                      .map((therapist, idx) => {
                        const isDuty = therapist.dutyStatus === 'ON_DUTY';
                        const languagesList = Array.isArray(therapist.languagesSpoken)
                          ? therapist.languagesSpoken
                          : (therapist.languagesSpoken || 'Hindi, English')
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean);

                        const specializationsList = Array.isArray(therapist.specializations)
                          ? therapist.specializations
                          : String(therapist.specializations || 'Swedish Massage, Deep Tissue')
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean);

                        const primaryService = therapist.services?.[0] || {
                          name: 'Full Body Massage',
                          discountPrice: 999,
                          durationMinutes: 60,
                        };

                        const genderLabel = therapist.gender
                          ? therapist.gender.charAt(0).toUpperCase() + therapist.gender.slice(1).toLowerCase()
                          : 'Female';

                        return (
                          <div
                            key={therapist.id || therapist.profileId || idx}
                            className="group bg-white rounded-3xl border border-gray-200/90 hover:border-gray-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
                          >
                            <div className="p-6 pb-5 space-y-4">
                              {/* Top Meta Strip: Status & Duty Toggle */}
                              <div className="flex items-center justify-between gap-2 pb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                  Fleet Practitioner
                                </span>

                                {/* Duty Status Toggle Pill */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleTherapistDuty(therapist.id || therapist.profileId)}
                                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                                    isDuty
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                  }`}
                                  title="Toggle Duty Availability"
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      isDuty ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                                    }`}
                                  />
                                  <span>{isDuty ? 'ON DUTY' : 'OFF DUTY'}</span>
                                </button>
                              </div>

                              {/* Identity Hero: Avatar & Full Name (Uncut) */}
                              <div className="flex items-center gap-4">
                                {/* Avatar with fixed aspect ratio and Duty status ring */}
                                <div className="relative shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 ring-2 ring-gray-100 shadow-xs">
                                  <img
                                    src={
                                      resolveMediaUrl(
                                        therapist.avatarUrl ||
                                        therapist.companyPhotoUrl ||
                                        therapist.appPhotoUrl ||
                                        therapist.profilePhoto
                                      ) || `https://ui-avatars.com/api/?name=${encodeURIComponent(therapist.fullName || therapist.displayName || 'Therapist')}&background=F35271&color=fff&size=160`
                                    }
                                    alt={therapist.fullName || therapist.displayName}
                                    className="w-full h-full object-cover shrink-0"
                                    onError={(e) => {
                                      const altSrc = resolveMediaUrl(therapist.companyPhotoUrl);
                                      if (altSrc && e.target.src !== altSrc) {
                                        e.target.src = altSrc;
                                      } else {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(therapist.fullName || therapist.displayName || 'Therapist')}&background=F35271&color=fff&size=160`;
                                      }
                                    }}
                                  />
                                  <span
                                    className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                                      isDuty ? 'bg-emerald-500' : 'bg-gray-400'
                                    }`}
                                    title={isDuty ? 'On Duty' : 'Off Duty'}
                                  />
                                </div>

                                {/* Identity & Full Name */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="text-base font-bold text-[#0D0D12] group-hover:text-[#F35271] transition-colors leading-snug">
                                      {therapist.fullName}
                                    </h4>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                  </div>

                                  <p className="text-xs text-[#757880] font-medium mt-0.5">
                                    {genderLabel} • {therapist.experienceYears || 3} Years Exp
                                  </p>

                                  <div className="flex items-center gap-2 mt-1 text-xs">
                                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                      <span>4.9</span>
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-[#757880] text-[11px]">
                                      {therapist.jobsCompleted || 24} jobs completed
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Clean Contact & Location Info */}
                              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-[#757880] gap-2">
                                  <span className="flex items-center gap-2 text-gray-500 shrink-0">
                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                    <span>Phone:</span>
                                  </span>
                                  <a
                                    href={`tel:${therapist.phone || therapist.mobileNumber || ''}`}
                                    className="text-[#0D0D12] font-semibold hover:text-[#F35271] transition-colors font-mono"
                                  >
                                    {therapist.phone || therapist.mobileNumber || '—'}
                                  </a>
                                </div>

                                <div className="flex items-center justify-between text-[#757880] gap-2">
                                  <span className="flex items-center gap-2 text-gray-500 shrink-0">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    <span>Location:</span>
                                  </span>
                                  <span className="text-[#0D0D12] font-semibold text-right">
                                    {therapist.area ? `${therapist.area}, ` : ''}{therapist.city || 'Jaipur'}
                                    {therapist.serviceRadiusKm ? ` (${therapist.serviceRadiusKm} km)` : ''}
                                  </span>
                                </div>
                              </div>

                              {/* Specializations & Starting Service Highlight */}
                              <div className="pt-3 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    Specializations
                                  </span>
                                  {primaryService && (
                                    <span className="text-[11px] font-bold text-[#F35271]">
                                      From ₹{primaryService.discountPrice || primaryService.basePrice || 999}
                                      <span className="text-[10px] font-normal text-gray-400 ml-1">
                                        ({primaryService.durationMinutes || 60}m)
                                      </span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                  {specializationsList.map((spec, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className="px-2.5 py-1 rounded-xl bg-gray-50 text-[#0D0D12] text-[11px] font-semibold border border-gray-200/60"
                                    >
                                      {spec}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Trust & Compliance Row */}
                              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg font-medium border border-emerald-100">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>KYC Verified</span>
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg font-medium border border-blue-100">
                                    <CreditCard className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    <span>Payout Linked</span>
                                  </span>
                                </div>

                                {languagesList.length > 0 && (
                                  <span
                                    className="text-gray-500 font-medium text-[11px]"
                                    title={languagesList.join(', ')}
                                  >
                                    {languagesList.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card Footer: Spa Code & View Dossier Action */}
                            <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
                              <span className="text-[11px] text-[#757880]">
                                Spa Code:{' '}
                                <strong className="font-mono text-[#0D0D12]">
                                  {therapist.spaCode || ownerProfile?.spaCode || 'SPA-973464'}
                                </strong>
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTherapist(therapist);
                                  setTherapistSubView('details');
                                }}
                                className="px-4 py-2 rounded-xl bg-[#0D0D12] hover:bg-[#F35271] text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Full Dossier</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )
          )}

          {/* 3. BOOKINGS & APPOINTMENTS (API 1: GET /spa-owner/bookings) */}
          {activeSection === 'bookings' && (
            bookingSubView === 'details' && selectedBookingPublicId ? (
              <BookingDetailInPage
                bookingId={selectedBookingPublicId}
                bookingData={bookingDetailData}
                loading={bookingDetailLoading}
                error={bookingDetailError}
                onBack={() => {
                  setBookingSubView('list');
                  setSelectedBookingPublicId(null);
                  setBookingDetailData(null);
                }}
                onRetry={() => handleViewBookingDetails(selectedBookingPublicId)}
              />
            ) : (
              <div className="space-y-6">
              
              {/* Header & Stats Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold text-[#0D0D12]">Appointments & Bookings</h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-extrabold text-emerald-700 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Realtime Active
                    </span>
                  </div>
                  <p className="text-xs text-[#757880]">
                    Live real-time bookings linked to your spa therapists ({bookingsTotal} total appointments)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700">
                    Total: <strong className="text-black">{bookingsTotal}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => fetchBookings()}
                    disabled={bookingsLoading}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                    title="Refresh Bookings"
                  >
                    <RefreshCw className={`w-4 h-4 ${bookingsLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Filters Container */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0D0D12]">
                    <SlidersHorizontal className="w-4 h-4 text-[#F35271]" />
                    <span>Filter Appointments</span>
                  </div>

                  {(bookingStatusFilter !== 'ALL' ||
                    bookingTherapistFilter !== 'ALL' ||
                    bookingStartDate ||
                    bookingEndDate) && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs font-bold text-[#F35271] hover:text-[#E04362] flex items-center gap-1 cursor-pointer transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Booking Status
                    </label>
                    <select
                      value={bookingStatusFilter}
                      onChange={(e) => handleFilterChange({ status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] focus:border-transparent outline-none cursor-pointer"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="ACCEPTED">Accepted / Confirmed</option>
                      <option value="REQUESTED">Requested</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="PENDING_PAYMENT">Pending Payment</option>
                      <option value="EXPIRED">Expired</option>
                    </select>
                  </div>

                  {/* Therapist Filter */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Assigned Therapist
                    </label>
                    <select
                      value={bookingTherapistFilter}
                      onChange={(e) => handleFilterChange({ therapistId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] focus:border-transparent outline-none cursor-pointer"
                    >
                      <option value="ALL">All Linked Therapists</option>
                      {therapists.map((t) => (
                        <option key={t.publicId || t.id} value={t.publicId || t.id}>
                          {t.fullName} ({t.city || 'Spa'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Starting After
                    </label>
                    <input
                      type="date"
                      value={bookingStartDate}
                      onChange={(e) => handleFilterChange({ startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Starting Before
                    </label>
                    <input
                      type="date"
                      value={bookingEndDate}
                      onChange={(e) => handleFilterChange({ endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {bookingsError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{bookingsError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchBookings()}
                    className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Loading Skeleton */}
              {bookingsLoading ? (
                <div className="bg-white rounded-3xl p-6 border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse" />
                  </div>
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="flex items-center justify-between py-3 border-b border-gray-50 gap-4">
                      <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse shrink-0" />
                      <div className="h-4 w-36 bg-gray-200 rounded-md animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse hidden sm:block" />
                      <div className="h-4 w-28 bg-gray-200 rounded-md animate-pulse" />
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                      <div className="h-8 w-24 bg-gray-200 rounded-xl animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                /* Empty States */
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xs">
                  <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-[#0D0D12]">
                    {bookingStatusFilter !== 'ALL' ||
                    bookingTherapistFilter !== 'ALL' ||
                    bookingStartDate ||
                    bookingEndDate
                      ? 'No Bookings Match Selected Filters'
                      : 'No Bookings Found'}
                  </h4>
                  <p className="text-xs text-[#757880] max-w-sm mx-auto mt-1">
                    {bookingStatusFilter !== 'ALL' ||
                    bookingTherapistFilter !== 'ALL' ||
                    bookingStartDate ||
                    bookingEndDate
                      ? 'Try adjusting or clearing your date, status, or therapist filters to view other bookings.'
                      : 'When customers book appointments with your therapists, they will appear here with live OTP, pricing, and treatment details.'}
                  </p>
                  {(bookingStatusFilter !== 'ALL' ||
                    bookingTherapistFilter !== 'ALL' ||
                    bookingStartDate ||
                    bookingEndDate) && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-4 px-4 py-2 rounded-xl bg-[#F35271] text-white text-xs font-bold hover:bg-[#E04362] transition cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                /* Bookings Table */
                <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-200 text-[#757880] uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-4">Booking Number</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Therapist</th>
                          <th className="p-4">Service Items</th>
                          <th className="p-4">Scheduled Slot</th>
                          <th className="p-4">Total Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.map((b, i) => {
                          const targetId = b.publicId || b.id || b._id;
                          const primaryService = b.serviceItems?.[0];
                          const totalServicesCount = b.serviceItems?.length || 0;
                          const statusClass =
                            b.status === 'ACCEPTED' || b.status === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : b.status === 'IN_PROGRESS'
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : b.status === 'COMPLETED'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : b.status === 'CANCELLED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200';

                          return (
                            <tr
                              key={targetId || i}
                              onClick={() => handleViewBookingDetails(b)}
                              className="hover:bg-[#FDF2F4]/30 transition-colors cursor-pointer"
                            >
                              {/* Booking Number */}
                              <td className="p-4">
                                <div className="font-mono font-bold text-[#0D0D12] text-xs">
                                  {b.bookingNumber || `TS-${targetId?.slice(0, 8)}`}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[10px] text-gray-500 font-mono">
                                    {targetId?.slice(0, 10)}...
                                  </span>
                                  {b.assignmentMode && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gray-100 text-gray-600">
                                      {b.assignmentMode}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Customer */}
                              <td className="p-4">
                                <div className="flex items-center gap-2.5">
                                  {b.customer?.avatarUrl ? (
                                    <img
                                      src={b.customer.avatarUrl}
                                      alt={b.customer.fullName || 'Customer'}
                                      className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200 text-[#F35271] font-bold text-[11px] flex items-center justify-center shrink-0">
                                      {(b.customer?.fullName || b.customerName || 'C')[0]?.toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-semibold text-[#0D0D12]">
                                      {b.customer?.fullName || b.customerName || 'Guest User'}
                                    </div>
                                    <div className="text-[11px] text-[#757880]">
                                      {b.customer?.phoneE164 || b.customer?.email || 'N/A'}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Therapist */}
                              <td className="p-4">
                                <div className="font-semibold text-[#0D0D12]">
                                  {b.therapist?.fullName || b.therapistName || 'Assigned Therapist'}
                                </div>
                                <div className="text-[11px] text-[#757880] flex items-center gap-1 mt-0.5">
                                  <span>{b.therapist?.businessName || ownerProfile?.businessName || 'Spa'}</span>
                                  {b.therapist?.spaCode && (
                                    <span className="text-[10px] bg-gray-100 px-1 py-0.2 rounded font-mono text-gray-600">
                                      {b.therapist.spaCode}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Service Items */}
                              <td className="p-4">
                                <div className="font-semibold text-[#0D0D12]">
                                  {primaryService?.serviceName || primaryService?.packageTitle || b.serviceName || 'Treatment Service'}
                                </div>
                                <div className="text-[11px] text-[#757880] flex items-center gap-1.5 mt-0.5">
                                  {primaryService?.durationMinutes && (
                                    <span>{primaryService.durationMinutes} mins</span>
                                  )}
                                  {primaryService?.quantity && primaryService.quantity > 1 && (
                                    <span>• Qty: {primaryService.quantity}</span>
                                  )}
                                  {totalServicesCount > 1 && (
                                    <span className="text-[10px] text-[#F35271] font-bold">
                                      +{totalServicesCount - 1} more
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Slot Time & Date */}
                              <td className="p-4">
                                <div className="font-semibold text-[#0D0D12]">
                                  {b.slotStart ? new Date(b.slotStart).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  }) : 'Today'}
                                </div>
                                <div className="text-[11px] text-[#757880] mt-0.5">
                                  {b.slotStart && b.slotEnd ? (
                                    `${new Date(b.slotStart).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} - ${new Date(b.slotEnd).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
                                  ) : (
                                    '10:00 AM - 12:00 PM'
                                  )}
                                </div>
                              </td>

                              {/* Total Amount & Payment */}
                              <td className="p-4">
                                <div className="font-bold text-[#F35271] text-xs">
                                  ₹{(b.totalRupees != null ? b.totalRupees : b.totalAmount || 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                                  <span className={`px-1.5 py-0.2 rounded font-bold ${
                                    b.paymentStatus === 'CAPTURED' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {b.paymentStatus || 'CAPTURED'}
                                  </span>
                                  <span>{b.paymentMethodId || 'ONLINE'}</span>
                                </div>
                              </td>

                              {/* Status Badge */}
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusClass}`}>
                                  {b.status || 'ACCEPTED'}
                                </span>
                              </td>

                              {/* Action */}
                              <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => handleViewBookingDetails(b)}
                                  className="px-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#F35271] hover:text-[#F35271] text-gray-700 text-xs font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Details</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Bar */}
                  <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-gray-50/50">
                    <span className="text-[#757880]">
                      Showing{' '}
                      <strong className="text-[#0D0D12]">
                        {bookingsTotal > 0 ? (bookingsPage - 1) * bookingsLimit + 1 : 0}
                      </strong>{' '}
                      to{' '}
                      <strong className="text-[#0D0D12]">
                        {Math.min(bookingsPage * bookingsLimit, bookingsTotal)}
                      </strong>{' '}
                      of <strong className="text-[#0D0D12]">{bookingsTotal}</strong> bookings
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePageChange(bookingsPage - 1)}
                        disabled={bookingsPage <= 1 || bookingsLoading}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-bold text-gray-700 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>

                      <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 font-bold text-gray-800">
                        Page {bookingsPage} of {Math.max(1, Math.ceil(bookingsTotal / bookingsLimit))}
                      </span>

                      <button
                        type="button"
                        onClick={() => handlePageChange(bookingsPage + 1)}
                        disabled={
                          bookingsPage >= Math.max(1, Math.ceil(bookingsTotal / bookingsLimit)) ||
                          bookingsLoading
                        }
                        className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-bold text-gray-700 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </div>
            )
          )}

          {/* SPA OWNER PROFILE & APP SHOWCASE MEDIA (GALLERY 5 IMAGES & VIDEO) */}
          {activeSection === 'profile' && (
            <SpaOwnerProfileEditor
              initialProfile={{
                ...(dashboardData?.registeredSpa || ownerProfile || {}),
                ...(payoutAccount || {})
              }}
              activeSpaCode={activeSpaCode}
              isLockedMode={isProfileLocked}
              onNavigateToOverview={() => setActiveSection('overview')}
              onSaveSuccess={(updated) => {
                const completeData = { ...updated, isProfileComplete: true };
                if (typeof setOwnerProfile === 'function') {
                  setOwnerProfile((prev) => ({ ...prev, ...completeData }));
                }
                if (typeof setDashboardData === 'function') {
                  setDashboardData((prev) => (prev ? {
                    ...prev,
                    isProfileComplete: true,
                    registeredSpa: { ...(prev.registeredSpa || {}), ...completeData }
                  } : prev));
                }
                try {
                  const saved = localStorage.getItem('therapyshala_owner_user');
                  if (saved) {
                    const parsed = JSON.parse(saved);
                    localStorage.setItem('therapyshala_owner_user', JSON.stringify({ ...parsed, ...completeData }));
                  }
                } catch (e) {
                  console.warn('Storage sync error', e);
                }
              }}
            />
          )}

          {/* CLIENT MESSAGES & GUEST INQUIRIES CHAT */}
          {activeSection === 'messages' && (
            <SpaOwnerChatView
              activeSpaName={activeBusinessName}
              spaLogo={
                ownerProfile?.spaLogo ||
                dashboardData?.registeredSpa?.spaLogo ||
                ownerProfile?.profilePhoto ||
                dashboardData?.registeredSpa?.profilePhoto ||
                '/logo.png'
              }
            />
          )}

          {/* 4. CANCELLATION PENALTIES REPORT & AUDIT LEDGER (API: GET /spa-owner/cancellation-penalties/report) */}
          {activeSection === 'penalty-report' && (() => {
            if (selectedPenaltyRecord) {
              return (
                <PenaltyAuditInPage
                  record={selectedPenaltyRecord}
                  onBack={() => setSelectedPenaltyRecord(null)}
                />
              );
            }

            const effectiveReport =
              penaltiesReport && penaltiesReport.summary
                ? penaltiesReport
                : EMPTY_CANCELLATION_PENALTIES_REPORT;

            return (
              <div className="space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#0D0D12]">Cancellation Penalties Report & Audit Ledger</h3>
                    <p className="text-xs text-[#757880]">
                      Live penalty deductions incident report, customer refund tracking, and therapist compensation audit
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Refresh Button */}
                    <button
                      type="button"
                      onClick={() => fetchPenaltiesReport()}
                      disabled={penaltiesReportLoading}
                      className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                      title="Refresh Penalties Report"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${penaltiesReportLoading ? 'animate-spin text-[#F35271]' : ''}`} />
                      <span className="hidden sm:inline">Refresh Report</span>
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {penaltiesReportError && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{penaltiesReportError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchPenaltiesReport()}
                      className="px-3 py-1 bg-white border border-red-200 rounded-lg font-semibold hover:bg-red-100 cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Summary Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. Penalty Deducted */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[#757880]">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Penalty Deductions</span>
                      <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-[#F35271]">
                      {penaltiesReportLoading && !penaltiesReport ? (
                        <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        `₹${(
                          effectiveReport?.summary?.penaltyDeducted?.rupees ??
                          (effectiveReport?.summary?.penaltyDeducted?.minor ? effectiveReport.summary.penaltyDeducted.minor / 100 : 0)
                        ).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      )}
                    </div>
                    <p className="text-[11px] text-[#757880]">Total penalty fees deducted</p>
                  </div>

                  {/* 2. Total Cancellations */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[#757880]">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Total Cancellations</span>
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-[#0D0D12]">
                      {penaltiesReportLoading && !penaltiesReport ? (
                        <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        effectiveReport?.summary?.totalCancellations ?? 0
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                        Customer: {effectiveReport?.summary?.customerCancellations ?? 0}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">
                        Therapist: {effectiveReport?.summary?.therapistCancellations ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* 3. Customer Paid */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[#757880]">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Customer Paid</span>
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-blue-600">
                      {penaltiesReportLoading && !penaltiesReport ? (
                        <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        `₹${(
                          effectiveReport?.summary?.customerPaid?.rupees ??
                          (effectiveReport?.summary?.customerPaid?.minor ? effectiveReport.summary.customerPaid.minor / 100 : 0)
                        ).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      )}
                    </div>
                    <p className="text-[11px] text-[#757880]">Captured booking value</p>
                  </div>

                  {/* 4. Therapist Compensation */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[#757880]">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Therapist Compensation</span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-600">
                      {penaltiesReportLoading && !penaltiesReport ? (
                        <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        `₹${(
                          effectiveReport?.summary?.therapistCompensation?.rupees ??
                          (effectiveReport?.summary?.therapistCompensation?.minor ? effectiveReport.summary.therapistCompensation.minor / 100 : 0)
                        ).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      )}
                    </div>
                    <p className="text-[11px] text-[#757880]">Compensated to therapists</p>
                  </div>
                </div>

                {/* Cancellation Penalties Audit Records Table */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#F35271]" />
                      <h4 className="text-sm font-bold text-[#0D0D12]">Cancellation Penalty Records & Audit Log</h4>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500">
                      {effectiveReport?.records?.length || 0} Incident Records
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAFAFA] border-b border-gray-100 text-[11px] uppercase tracking-wider font-bold text-[#757880]">
                        <tr>
                          <th className="py-3.5 px-5">Booking</th>
                          <th className="py-3.5 px-5">Cancelled By / Reason</th>
                          <th className="py-3.5 px-5">Customer</th>
                          <th className="py-3.5 px-5">Therapist</th>
                          <th className="py-3.5 px-5 text-right">Customer Paid</th>
                          <th className="py-3.5 px-5 text-right">Penalty Deducted</th>
                          <th className="py-3.5 px-5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(!effectiveReport.records || effectiveReport.records.length === 0) ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-gray-500">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                  <ShieldCheck className="w-5 h-5" />
                                </div>
                                <p className="font-semibold text-sm text-[#0D0D12]">No Cancellation Penalty Records</p>
                                <p className="text-xs text-gray-400">All bookings have completed smoothly with zero penalty deductions.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          effectiveReport.records.map((record, idx) => {
                          const cancelledByTherapist = record.cancelledBy === 'THERAPIST';
                          const custRupees =
                            record.customerPayment?.rupees ??
                            (record.customerPayment?.minor ? record.customerPayment.minor / 100 : 0);
                          const penaltyRupees =
                            record.penaltyDeducted?.rupees ??
                            (record.penaltyDeducted?.minor ? record.penaltyDeducted.minor / 100 : 0);

                          return (
                            <tr key={record.bookingId || idx} className="hover:bg-rose-50/20 transition-colors">
                              {/* Booking Info */}
                              <td className="py-4 px-5">
                                <div className="font-bold text-[#0D0D12] text-xs">
                                  {record.bookingNumber || 'TS-BK-N/A'}
                                </div>
                                <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                                  {record.bookingId}
                                </div>
                                <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span>
                                    {record.cancelledAt
                                      ? new Date(record.cancelledAt).toLocaleString('en-IN', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          hour12: true,
                                        })
                                      : 'N/A'}
                                  </span>
                                </div>
                              </td>

                              {/* Cancelled By & Reason */}
                              <td className="py-4 px-5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                                    cancelledByTherapist
                                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                                  }`}
                                >
                                  {record.cancelledBy || 'UNKNOWN'}
                                </span>
                                <div className="text-[11px] font-medium text-gray-700 mt-1 capitalize">
                                  {(record.cancellationReason || 'Not Specified').replace(/_/g, ' ').toLowerCase()}
                                </div>
                              </td>

                              {/* Customer Info */}
                              <td className="py-4 px-5">
                                <div className="font-bold text-[#0D0D12]">
                                  {record.customer?.name || 'Customer'}
                                </div>
                                {record.customer?.phone && (
                                  <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                    <Phone className="w-3 h-3 text-gray-400" />
                                    <span>{record.customer.phone}</span>
                                  </div>
                                )}
                                {record.customer?.email && (
                                  <div className="text-[10px] text-gray-400 truncate max-w-[140px]">
                                    {record.customer.email}
                                  </div>
                                )}
                              </td>

                              {/* Therapist Info */}
                              <td className="py-4 px-5">
                                <div className="font-bold text-[#0D0D12]">
                                  {record.therapist?.name || 'Therapist'}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {record.therapist?.spaCode && (
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-700 font-bold">
                                      {record.therapist.spaCode}
                                    </span>
                                  )}
                                  {record.therapist?.businessName && (
                                    <span className="text-[11px] text-gray-500 truncate max-w-[120px]">
                                      {record.therapist.businessName}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Customer Paid */}
                              <td className="py-4 px-5 text-right font-bold text-[#0D0D12]">
                                <div>₹{custRupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {record.customerPaymentStatus || 'CAPTURED'}
                                </span>
                              </td>

                              {/* Penalty Deducted */}
                              <td className="py-4 px-5 text-right font-extrabold text-[#F35271]">
                                <div className="text-sm">
                                  -₹{penaltyRupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <span className="text-[10px] font-normal text-rose-500">
                                  Deducted
                                </span>
                              </td>

                              {/* Action */}
                              <td className="py-4 px-5 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedPenaltyRecord(record);
                                  }}
                                  className="px-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#F35271] hover:bg-rose-50/50 text-[#0D0D12] hover:text-[#F35271] font-bold text-[11px] transition cursor-pointer inline-flex items-center gap-1"
                                >
                                  <FileText className="w-3.5 h-3.5 text-[#F35271]" />
                                  <span>Audit Ledger</span>
                                </button>
                              </td>
                            </tr>
                          );
                        }))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 5. CANCELLATION POLICY & FEE MATRIX (API: GET /admin/cancellation-policy) */}
          {activeSection === 'penalty' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0D0D12]">Cancellation Policy & Penalty Rules Matrix</h3>
                  <p className="text-xs text-[#757880]">
                    Live platform cancellation fee configurations, tiered penalty matrix, and grace period guidelines
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Indicator */}
                  {cancellationPolicy && (
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${
                      cancellationPolicy.enabled
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cancellationPolicy.enabled ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      <span>{cancellationPolicy.enabled ? 'Policy Enforced' : 'Policy Inactive'}</span>
                    </span>
                  )}

                  {/* Refresh Button */}
                  <button
                    type="button"
                    onClick={() => fetchCancellationPolicy()}
                    disabled={cancellationPolicyLoading}
                    className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                    title="Refresh Cancellation Policy"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${cancellationPolicyLoading ? 'animate-spin text-[#F35271]' : ''}`} />
                    <span className="hidden sm:inline">Refresh Policy</span>
                  </button>
                </div>
              </div>

              {/* Policy Error Banner */}
              {cancellationPolicyError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{cancellationPolicyError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchCancellationPolicy()}
                    className="px-3 py-1 bg-white border border-red-200 rounded-lg font-semibold hover:bg-red-100 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Live Metric Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Free Cancellation Window */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Free Window</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-[#0D0D12]">
                    {cancellationPolicyLoading && !cancellationPolicy ? (
                      <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `${cancellationPolicy?.freeCancellationWindowHours ?? 24} Hours`
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-600 font-semibold">Zero penalty window before start</p>
                </div>

                {/* 2. Grace Period */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Grace Period</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-blue-600">
                    {cancellationPolicyLoading && !cancellationPolicy ? (
                      <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `${cancellationPolicy?.gracePeriodMinutes ?? 5} Mins`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">Immediate cancel without charge</p>
                </div>

                {/* 3. Late Cancellation Fee */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Late Cancel Fee</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-amber-600">
                    {cancellationPolicyLoading && !cancellationPolicy ? (
                      <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `${cancellationPolicy?.lateCancellationFeePercentage ?? cancellationPolicy?.cancellationFeeValue ?? 25}%`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">Cancelled near treatment time</p>
                </div>

                {/* 4. No-Show Fee Rate */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">No-Show Penalty</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-[#F35271]">
                    {cancellationPolicyLoading && !cancellationPolicy ? (
                      <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `${cancellationPolicy?.noShowFeePercentage ?? cancellationPolicy?.noShowFee?.feeValue ?? 50}%`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">Client / Therapist absence rate</p>
                </div>
              </div>

              {/* Tiered Cancellation Fee Rules Matrix Table */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#F35271]" />
                    <h4 className="text-sm font-bold text-[#0D0D12]">Tiered Cancellation Fee Rules Matrix</h4>
                  </div>
                  <span className="text-[11px] text-[#757880]">
                    Applies automatically to all spa bookings
                  </span>
                </div>

                {cancellationPolicyLoading && !cancellationPolicy ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-[#F35271] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-[#757880]">Loading live cancellation rules...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAFAFA] border-b border-gray-100 text-[11px] uppercase tracking-wider font-bold text-[#757880]">
                        <tr>
                          <th className="py-3.5 px-5">Time Window Before Treatment</th>
                          <th className="py-3.5 px-5 text-center">Fee Type</th>
                          <th className="py-3.5 px-5 text-center">Deduction Rate</th>
                          <th className="py-3.5 px-5 text-center">Customer Refund</th>
                          <th className="py-3.5 px-5">Spa Settlement Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {Array.isArray(cancellationPolicy?.rules) && cancellationPolicy.rules.length > 0 ? (
                          cancellationPolicy.rules.map((rule, idx) => {
                            const isFree = (rule.feeValue ?? 0) === 0;
                            const isMax = rule.maxHoursBefore === null || rule.maxHoursBefore === undefined;
                            const windowLabel = isMax
                              ? `More than ${rule.minHoursBefore} hours prior`
                              : rule.minHoursBefore === 0
                              ? `Less than ${rule.maxHoursBefore} hours prior (Late Window)`
                              : `Between ${rule.minHoursBefore}h and ${rule.maxHoursBefore}h prior`;

                            return (
                              <tr key={idx} className="hover:bg-rose-50/20 transition-colors">
                                <td className="py-4 px-5 font-bold text-[#0D0D12]">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{windowLabel}</span>
                                  </div>
                                </td>

                                <td className="py-4 px-5 text-center">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                                    {rule.feeType || 'PERCENTAGE'}
                                  </span>
                                </td>

                                <td className="py-4 px-5 text-center">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                      isFree
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : rule.feeValue > 15
                                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}
                                  >
                                    {rule.feeValue}%
                                  </span>
                                </td>

                                <td className="py-4 px-5 text-center font-bold text-gray-900">
                                  {100 - (rule.feeValue ?? 0)}%
                                </td>

                                <td className="py-4 px-5 text-[#757880]">
                                  {isFree
                                    ? 'Zero deduction, slot re-opened immediately'
                                    : `Spa owner credited platform share on retained ${rule.feeValue}% fee`}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="py-6 text-center text-[#757880]">
                              Standard 4-hour cancellation window applies.
                            </td>
                          </tr>
                        )}

                        {/* Special No-Show Row */}
                        <tr className="bg-rose-50/10 hover:bg-rose-50/20 transition-colors">
                          <td className="py-4 px-5 font-bold text-rose-700">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                              <span>No-Show / Unannounced Absence</span>
                            </div>
                          </td>
                          <td className="py-4 px-5 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              PERCENTAGE
                            </span>
                          </td>
                          <td className="py-4 px-5 text-center">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              {cancellationPolicy?.noShowFeePercentage ?? cancellationPolicy?.noShowFee?.feeValue ?? 50}%
                            </span>
                          </td>
                          <td className="py-4 px-5 text-center font-bold text-rose-700">
                            {100 - (cancellationPolicy?.noShowFeePercentage ?? cancellationPolicy?.noShowFee?.feeValue ?? 50)}%
                          </td>
                          <td className="py-4 px-5 text-rose-800 font-medium">
                            Compensated to Spa Owner & Therapist for reserved time slot
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Policy Explanation & Protection Guidelines */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>TherapyShala Spa Owner & Therapist Protection Guidelines</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#757880]">
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <strong className="text-[#0D0D12] block">Client Late Cancellations</strong>
                    <p className="text-[11px]">
                      When customers cancel within the late window (&lt; 4h), the retained fee is credited to your wallet balance according to your revenue split.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <strong className="text-[#0D0D12] block">Therapist Reliability Matrix</strong>
                    <p className="text-[11px]">
                      Therapists under your spa code must notify the client at least 2 hours prior in emergencies to prevent automatic reliability flags.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <strong className="text-[#0D0D12] block">Dispute Window</strong>
                    <p className="text-[11px]">
                      Any disputed deduction can be contested within 7 days by submitting booking logs or chat evidence to platform support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. THERAPIST COMMISSION */}
          {activeSection === 'therapist-commission' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0D0D12]">Therapist Commission</h3>
                  <p className="text-xs text-[#757880] mt-0.5">
                    View commission rates, splits, and earnings for therapists registered under your spa sanctuary.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#F35271] flex items-center justify-center mx-auto">
                  <Percent className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h4 className="text-base font-bold text-[#0D0D12]">Therapist Commission Management</h4>
                  <p className="text-xs text-[#757880]">
                    Therapist commission rates and service splits are configured at the platform level. Detailed per-therapist breakdowns and custom split overrides will appear here once configured by the platform administrator.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. OWNER COMMISSION (API: GET /spa-owner/commissions) */}
          {activeSection === 'commission' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0D0D12]">Spa Owner Commission Dashboard</h3>
                  <p className="text-xs text-[#757880]">
                    Direct commission, referral commission, and available wallet balance
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Therapist Filter */}
                  <select
                    value={commissionTherapistFilter}
                    onChange={(e) => {
                      const newTherapist = e.target.value;
                      setCommissionTherapistFilter(newTherapist);
                      setCommissionsPage(1);
                      fetchCommissions({ therapistId: newTherapist, page: 1 });
                    }}
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-[#0D0D12] focus:outline-none focus:border-[#F35271] cursor-pointer"
                  >
                    <option value="ALL">All Therapists</option>
                    {therapists.map((th) => (
                      <option key={th.id || th.profileId} value={th.id || th.profileId}>
                        {th.fullName} ({th.phone || th.phoneE164 || th.mobileNumber || 'Therapist'})
                      </option>
                    ))}
                  </select>

                  {/* Refresh Button */}
                  <button
                    type="button"
                    onClick={() => fetchCommissions()}
                    disabled={commissionsLoading}
                    className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                    title="Refresh Commission Data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${commissionsLoading ? 'animate-spin text-[#F35271]' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {commissionsError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{commissionsError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchCommissions()}
                    className="px-3 py-1 bg-white border border-red-200 rounded-lg font-semibold hover:bg-red-100 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Summary Metric Cards (Direct, Referral, Total, Available Balance) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Commission */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Commission</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-[#F35271]">
                    {commissionsLoading && !commissionsData ? (
                      <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `₹${Number(commissionsData?.summary?.totalCommissionRupees ?? 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">Total accumulated commission earnings</p>
                </div>

                {/* 2. Direct Earnings */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Direct Earnings</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Coins className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-600">
                    {commissionsLoading && !commissionsData ? (
                      <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `₹${Number(
                        commissionsData?.summary?.directCommissionRupees ??
                          (commissionsData?.summary?.totalCommissionRupees ?? 0)
                      ).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">From own fleet therapist treatments</p>
                </div>

                {/* 3. Referral Earnings */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Referral Earnings</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-purple-600">
                    {commissionsLoading && !commissionsData ? (
                      <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `₹${Number(commissionsData?.summary?.referralCommissionRupees ?? 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">From sponsored sub-owner network</p>
                </div>

                {/* 4. Available Wallet Balance */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Available Balance</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Landmark className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-blue-700">
                    {commissionsLoading && !commissionsData ? (
                      <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `₹${Number(commissionsData?.summary?.availableBalanceRupees ?? 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">Ready for bank payout withdrawal</p>
                </div>
              </div>

              {/* Commission Rates & Bookings Bar */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <span className="text-gray-500 block text-[11px]">Direct Commission:</span>
                    <strong className="text-emerald-700 font-extrabold text-sm">
                      {commissionsData?.summary?.activeCommissionPercentage ?? 10}%
                    </strong>
                  </div>
                  <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                  <div>
                    <span className="text-gray-500 block text-[11px]">Referral Commission:</span>
                    <strong className="text-purple-700 font-extrabold text-sm">
                      {commissionsData?.summary?.activeReferralPercentage ?? 2}%
                    </strong>
                  </div>
                  <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                  <div>
                    <span className="text-gray-500 block text-[11px]">Completed Bookings:</span>
                    <strong className="text-gray-900 font-extrabold text-sm">
                      {commissionsData?.summary?.totalCompletedBookings ?? 0}
                    </strong>
                  </div>
                </div>

                {/* Filter Tabs: All / Direct / Referral */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                  {['ALL', 'DIRECT', 'REFERRAL'].map((tab) => {
                    const isActive = commissionTypeFilter === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setCommissionTypeFilter(tab);
                          setCommissionsPage(1);
                          fetchCommissions({ commissionType: tab, page: 1 });
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-[#0D0D12] shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab === 'ALL' ? 'All' : tab === 'DIRECT' ? 'Direct' : 'Referral'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Commission History Table */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#F35271]" />
                    <h4 className="text-sm font-bold text-[#0D0D12]">Commission History</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                      {(() => {
                        const raw = commissionsData?.commissions || [];
                        const filtered = raw.filter((item) => {
                          if (commissionTypeFilter === 'ALL') return true;
                          return (item.commissionType || 'DIRECT').toUpperCase() === commissionTypeFilter;
                        });
                        return `${filtered.length} Record${filtered.length === 1 ? '' : 's'}`;
                      })()}
                    </span>
                  </div>

                  <div className="text-xs text-[#757880]">
                    Showing {commissionTypeFilter === 'ALL' ? 'all commission transactions' : `${commissionTypeFilter.toLowerCase()} commissions`}
                  </div>
                </div>

                {(() => {
                  const raw = commissionsData?.commissions || [];
                  const displayed = raw.filter((item) => {
                    if (commissionTypeFilter === 'ALL') return true;
                    return (item.commissionType || 'DIRECT').toUpperCase() === commissionTypeFilter;
                  });

                  if (commissionsLoading && !commissionsData) {
                    return (
                      <div className="p-8 text-center space-y-3">
                        <div className="w-8 h-8 border-2 border-[#F35271] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-[#757880]">Loading commission records...</p>
                      </div>
                    );
                  }

                  if (displayed.length === 0) {
                    return (
                      <div className="p-12 text-center space-y-3">
                        <div className="w-14 h-14 rounded-full bg-rose-50 text-[#F35271] flex items-center justify-center mx-auto mb-2">
                          <Percent className="w-7 h-7" />
                        </div>
                        <h5 className="text-sm font-bold text-[#0D0D12]">No commissions found</h5>
                        <p className="text-xs text-[#757880] max-w-sm mx-auto">
                          {commissionTypeFilter === 'ALL'
                            ? 'Commission transactions will appear once completed therapist treatments are processed.'
                            : `No ${commissionTypeFilter.toLowerCase()} commission transactions found for the selected criteria.`}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAFAFA] border-b border-gray-100 text-[10px] uppercase tracking-wider font-bold text-[#757880]">
                          <tr>
                            <th className="py-3.5 px-4">Booking Number</th>
                            <th className="py-3.5 px-4">Service</th>
                            <th className="py-3.5 px-4 text-center">Type</th>
                            <th className="py-3.5 px-4">Spa Owner</th>
                            <th className="py-3.5 px-4">Business Name</th>
                            <th className="py-3.5 px-4">Source Spa Owner</th>
                            <th className="py-3.5 px-4">Source Business</th>
                            <th className="py-3.5 px-4">Therapist</th>
                            <th className="py-3.5 px-4 text-right">Booking Amount</th>
                            <th className="py-3.5 px-4 text-center">Commission %</th>
                            <th className="py-3.5 px-4 text-right">Commission Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {displayed.map((item) => {
                            const isReferral = (item.commissionType || '').toUpperCase() === 'REFERRAL';
                            const sourceOwner = item.sourceSpaOwner?.ownerName || item.sourceOwnerName;
                            const sourceBusiness = item.sourceSpaOwner?.businessName || item.sourceBusinessName;
                            const sourceCode = item.sourceSpaOwner?.spaCode || item.sourceSpaCode;

                            return (
                              <tr key={item.id || item._id} className="hover:bg-rose-50/20 transition-colors">
                                {/* Booking Number */}
                                <td className="py-4 px-4 font-mono font-bold">
                                  <button
                                    type="button"
                                    onClick={() => handleViewBookingDetails(item.bookingId || item.bookingNumber)}
                                    className="text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer text-left"
                                    title="View booking details"
                                  >
                                    <span>{item.bookingNumber || item.bookingId || 'TS-BOOKING'}</span>
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                  </button>
                                </td>

                                {/* Service */}
                                <td className="py-4 px-4">
                                  <span className="font-semibold text-[#0D0D12] block">
                                    {item.serviceName || 'Full Body Therapy'}
                                  </span>
                                </td>

                                {/* Commission Type */}
                                <td className="py-4 px-4 text-center">
                                  {isReferral ? (
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                                      Referral
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                                      Direct
                                    </span>
                                  )}
                                </td>

                                {/* Spa Owner */}
                                <td className="py-4 px-4 text-[#0D0D12] font-medium">
                                  {item.spaOwner?.ownerName || item.ownerName || '—'}
                                </td>

                                {/* Business Name */}
                                <td className="py-4 px-4 text-gray-700">
                                  {item.spaOwner?.businessName || item.businessName || '—'}
                                </td>

                                {/* Source Spa Owner */}
                                <td className="py-4 px-4">
                                  {isReferral ? (
                                    <span className="font-semibold text-purple-900">
                                      {sourceOwner || '—'}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>

                                {/* Source Business */}
                                <td className="py-4 px-4">
                                  {isReferral ? (
                                    <div>
                                      <span className="text-gray-800 font-medium block">
                                        {sourceBusiness || '—'}
                                      </span>
                                      {sourceCode && (
                                        <span className="text-[10px] text-gray-400 font-mono">
                                          {sourceCode}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>

                                {/* Therapist */}
                                <td className="py-4 px-4">
                                  <span className="font-semibold text-[#0D0D12]">
                                    {item.therapist?.fullName || item.therapistName || '—'}
                                  </span>
                                </td>

                                {/* Booking Amount */}
                                <td className="py-4 px-4 text-right font-medium text-gray-700 whitespace-nowrap">
                                  ₹{Number(item.basePriceRupees ?? item.bookingAmount ?? 0).toFixed(2)}
                                </td>

                                {/* Commission % */}
                                <td className="py-4 px-4 text-center">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                                    {item.commissionPercentage ?? (isReferral ? 2 : 10)}%
                                  </span>
                                </td>

                                {/* Commission Amount */}
                                <td className="py-4 px-4 text-right font-extrabold text-emerald-600 text-sm whitespace-nowrap">
                                  ₹{Number(item.commissionRupees ?? item.amount ?? 0).toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}

                {/* Pagination Controls */}
                {commissionsData?.pagination && commissionsData.pagination.totalPages > 1 && (
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs bg-[#FAFAFA]">
                    <span className="text-[#757880]">
                      Page <strong>{commissionsData.pagination.page}</strong> of{' '}
                      <strong>{commissionsData.pagination.totalPages}</strong> (
                      {commissionsData.pagination.totalRecords} total records)
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const prev = commissionsPage - 1;
                          if (prev >= 1) {
                            setCommissionsPage(prev);
                            fetchCommissions({ page: prev });
                          }
                        }}
                        disabled={commissionsPage <= 1 || commissionsLoading}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 text-xs font-semibold cursor-pointer"
                      >
                        Previous
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const next = commissionsPage + 1;
                          if (next <= commissionsData.pagination.totalPages) {
                            setCommissionsPage(next);
                            fetchCommissions({ page: next });
                          }
                        }}
                        disabled={commissionsPage >= commissionsData.pagination.totalPages || commissionsLoading}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 text-xs font-semibold cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. COMMISSION PAYOUT (Live Integrated APIs) */}
          {activeSection === 'payout' && (
            payoutSubView === 'account' ? (
              <PayoutAccountInPage
                payoutAccount={payoutAccount}
                payoutAccountForm={payoutAccountForm}
                setPayoutAccountForm={setPayoutAccountForm}
                payoutAccountSaving={payoutAccountSaving}
                payoutAccountError={payoutAccountError}
                payoutAccountSuccessMsg={payoutAccountSuccessMsg}
                handleSavePayoutAccount={handleSavePayoutAccount}
                onBack={() => {
                  setPayoutSubView('overview');
                  setPayoutAccountError('');
                }}
              />
            ) : payoutSubView === 'request' ? (
              <PayoutRequestInPage
                commissionsData={commissionsData}
                payoutAccount={payoutAccount}
                payoutAmount={payoutAmount}
                setPayoutAmount={setPayoutAmount}
                payoutMethod={payoutMethod}
                setPayoutMethod={setPayoutMethod}
                payoutAdminNotes={payoutAdminNotes}
                setPayoutAdminNotes={setPayoutAdminNotes}
                payoutSubmitting={payoutSubmitting}
                payoutSubmitError={payoutSubmitError}
                handleRequestPayoutSubmit={handleRequestPayoutSubmit}
                onConfigureAccount={() => setPayoutSubView('account')}
                onBack={() => {
                  setPayoutSubView('overview');
                  setPayoutSubmitError('');
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#0D0D12]">Commission Payouts & Settlements</h3>
                    <p className="text-xs text-[#757880]">
                      Manage withdrawable earnings, settlement bank accounts, and withdrawal requests
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Account Settings Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setPayoutAccountError('');
                        setPayoutSubView('account');
                      }}
                      className="px-3.5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Landmark className="w-4 h-4 text-[#F35271]" />
                      <span>Payout Account</span>
                    </button>

                    {/* Refresh Button */}
                    <button
                      type="button"
                      onClick={() => {
                        fetchCommissions();
                        fetchPayoutAccount();
                        fetchPayoutsHistory();
                      }}
                      disabled={payoutsLoading || payoutAccountLoading}
                      className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                      title="Refresh Payout Data"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${payoutsLoading || payoutAccountLoading ? 'animate-spin text-[#F35271]' : ''}`} />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>

                    {/* Request Payout Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setPayoutSubmitError('');
                        const avail = commissionsData?.summary?.availableBalanceRupees ?? 0;
                        setPayoutAmount(avail > 0 ? String(avail) : '');
                        setPayoutSubView('request');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>Request Payout</span>
                    </button>
                  </div>
                </div>

              {/* Success Notification */}
              {payoutSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-semibold">{payoutSuccessMsg}</span>
                </div>
              )}

              {payoutAccountSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-semibold">{payoutAccountSuccessMsg}</span>
                </div>
              )}

              {/* Error Notifications */}
              {payoutsError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{payoutsError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchPayoutsHistory()}
                    className="px-3 py-1 bg-white border border-red-200 rounded-lg font-semibold hover:bg-red-100 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Payout Metric Cards (Live from commissions summary) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Available For Withdrawal */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Available Balance</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-600">
                    {commissionsLoading && !commissionsData ? (
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `₹${(commissionsData?.summary?.availableBalanceRupees ?? 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">Withdrawable commission balance</p>
                </div>

                {/* 2. Pending Clearing */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Pending Payouts</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-amber-500">
                    {commissionsLoading && !commissionsData ? (
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `₹${(commissionsData?.summary?.pendingPayoutRupees ?? 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">In-flight requested withdrawals</p>
                </div>

                {/* 3. Total Lifetime Withdrawn */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Paid Out</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-[#0D0D12]">
                    {commissionsLoading && !commissionsData ? (
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `₹${(commissionsData?.summary?.totalPaidOutRupees ?? 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">Lifetime successfully disbursed</p>
                </div>

                {/* 4. Total Gross Commission */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Commission</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-[#F35271]">
                    {commissionsLoading && !commissionsData ? (
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `₹${(commissionsData?.summary?.totalCommissionRupees ?? 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">All-time commission earned</p>
                </div>
              </div>


              {/* Payout History Ledger Table (GET /spa-owner/payouts) */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#F35271]" />
                    <h4 className="text-sm font-bold text-[#0D0D12]">Payout Requests & History</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                      {payoutsData?.pagination?.totalRecords ?? payoutsData?.payouts?.length ?? 0} Record
                      {(payoutsData?.pagination?.totalRecords ?? payoutsData?.payouts?.length) === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Filter */}
                    <select
                      value={payoutStatusFilter}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        setPayoutStatusFilter(newStatus);
                        setPayoutsPage(1);
                        fetchPayoutsHistory({ status: newStatus, page: 1 });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-[#0D0D12] focus:outline-none focus:border-[#F35271] cursor-pointer"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="REQUESTED">Requested</option>
                      <option value="APPROVED">Approved</option>
                      <option value="PAID">Paid</option>
                      <option value="REJECTED">Rejected</option>
                    </select>

                    {/* Refresh Table */}
                    <button
                      type="button"
                      onClick={() => fetchPayoutsHistory()}
                      disabled={payoutsLoading}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 cursor-pointer"
                      title="Refresh Ledger"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${payoutsLoading ? 'animate-spin text-[#F35271]' : ''}`} />
                    </button>
                  </div>
                </div>

                {payoutsLoading && !payoutsData ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-[#F35271] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-[#757880]">Loading payout transaction records...</p>
                  </div>
                ) : !payoutsData?.payouts || payoutsData.payouts.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-rose-50 text-[#F35271] flex items-center justify-center mx-auto mb-2">
                      <Wallet className="w-7 h-7" />
                    </div>
                    <h5 className="text-sm font-bold text-[#0D0D12]">No Payout Requests Found</h5>
                    <p className="text-xs text-[#757880] max-w-sm mx-auto">
                      Whenever you request a withdrawal or a settlement is processed, the transaction record will appear here.
                    </p>
                    {commissionsData?.summary?.availableBalanceRupees > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setPayoutSubmitError('');
                          setPayoutAmount(String(commissionsData.summary.availableBalanceRupees));
                          setPayoutSubView('request');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#F35271] text-white text-xs font-bold hover:bg-[#E04362] cursor-pointer mt-2"
                      >
                        Request First Payout
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAFAFA] border-b border-gray-100 text-[11px] uppercase tracking-wider font-bold text-[#757880]">
                        <tr>
                          <th className="py-3.5 px-5">Payout Reference</th>
                          <th className="py-3.5 px-5">Amount</th>
                          <th className="py-3.5 px-5">Method & Destination</th>
                          <th className="py-3.5 px-5">Beneficiary</th>
                          <th className="py-3.5 px-5 text-center">Status</th>
                          <th className="py-3.5 px-5">Notes / Ref</th>
                          <th className="py-3.5 px-5">Date Requested</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {payoutsData.payouts.map((item) => (
                          <tr key={item.id} className="hover:bg-rose-50/20 transition-colors">
                            {/* Payout Reference */}
                            <td className="py-4 px-5">
                              <span className="font-mono font-bold text-[#0D0D12] block">
                                {item.id}
                              </span>
                            </td>

                            {/* Amount */}
                            <td className="py-4 px-5">
                              <span className="font-extrabold text-[#0D0D12] text-sm">
                                ₹{(item.amountRupees ?? 0).toFixed(2)}
                              </span>
                            </td>

                            {/* Method & Destination */}
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  item.payoutMethod === 'UPI'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                  {item.payoutMethod || 'BANK'}
                                </span>
                                <span className="font-mono text-gray-700 text-xs">
                                  {item.payoutMethod === 'UPI'
                                    ? item.accountDetails?.upiId || '—'
                                    : `${item.accountDetails?.bankName || 'Bank'} (•••• ${item.accountDetails?.accountNumber?.slice(-4) || '—'})`}
                                </span>
                              </div>
                            </td>

                            {/* Beneficiary */}
                            <td className="py-4 px-5 text-gray-700 font-medium">
                              {item.accountDetails?.accountHolderName || '—'}
                            </td>

                            {/* Status */}
                            <td className="py-4 px-5 text-center">
                              {item.status === 'PAID' ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  PAID
                                </span>
                              ) : item.status === 'APPROVED' ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                  APPROVED
                                </span>
                              ) : item.status === 'REJECTED' ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                                  REJECTED
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  REQUESTED
                                </span>
                              )}
                            </td>

                            {/* Notes / Ref */}
                            <td className="py-4 px-5 text-gray-600 max-w-xs truncate text-[11px]">
                              {item.transactionReference ? (
                                <span className="font-mono font-bold text-gray-800">
                                  Txn: {item.transactionReference}
                                </span>
                              ) : item.adminNotes ? (
                                <span>{item.adminNotes}</span>
                              ) : (
                                '—'
                              )}
                            </td>

                            {/* Date Requested */}
                            <td className="py-4 px-5 text-gray-600 whitespace-nowrap">
                              {item.requestedAt
                                ? new Date(item.requestedAt).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination Footer */}
                {payoutsData?.pagination && payoutsData.pagination.totalPages > 1 && (
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs bg-[#FAFAFA]">
                    <span className="text-[#757880]">
                      Page <strong>{payoutsData.pagination.page}</strong> of{' '}
                      <strong>{payoutsData.pagination.totalPages}</strong> (
                      {payoutsData.pagination.totalRecords} total payouts)
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const prev = payoutsPage - 1;
                          if (prev >= 1) {
                            setPayoutsPage(prev);
                            fetchPayoutsHistory({ page: prev });
                          }
                        }}
                        disabled={payoutsPage <= 1 || payoutsLoading}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 text-xs font-semibold cursor-pointer"
                      >
                        Previous
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const next = payoutsPage + 1;
                          if (next <= payoutsData.pagination.totalPages) {
                            setPayoutsPage(next);
                            fetchPayoutsHistory({ page: next });
                          }
                        }}
                        disabled={payoutsPage >= payoutsData.pagination.totalPages || payoutsLoading}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 text-xs font-semibold cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}

          {/* 7. SETTINGS (Spa & Partner Business Settings) */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0D0D12]">Spa & Partner Settings</h3>
                  <p className="text-xs text-[#757880]">
                    Configure operating hours, contact credentials, and notification preferences
                  </p>
                </div>
              </div>

              {/* General Spa Settings */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-6 text-xs">
                <div>
                  <h4 className="font-bold text-[#0D0D12] uppercase tracking-wider text-[11px] mb-3 text-rose-600">
                    Business Profile & Operating Hours
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#0D0D12] mb-1">Spa Business Name</label>
                      <input
                        type="text"
                        defaultValue={ownerProfile?.businessName}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#0D0D12] mb-1">Spa Identifier Code</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          defaultValue={ownerProfile?.spaCode}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 font-mono font-bold text-[#F35271]"
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={() => handleCopyCode(ownerProfile?.spaCode)}
                          className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                          title="Copy Spa Code"
                        >
                          {copiedSpaCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#0D0D12] mb-1">Operating Hours</label>
                      <input
                        type="text"
                        defaultValue="09:00 AM - 09:00 PM (Daily)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#0D0D12] mb-1">Support Contact Email</label>
                      <input
                        type="email"
                        defaultValue={ownerProfile?.email}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-[#0D0D12] uppercase tracking-wider text-[11px] mb-3 text-rose-600">
                    Alerts & Notifications
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#F35271]" />
                      <span>Instant SMS & WhatsApp notification on new appointment bookings</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#F35271]" />
                      <span>Weekly settlement payout confirmation receipt via email</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => alert('Settings updated successfully.')}
                    className="px-5 py-2.5 rounded-xl bg-[#0D0D12] text-white text-xs font-bold hover:bg-gray-800 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. SPONSORED SUB-SPAS & REFERRAL NETWORK (API: GET /spa-owner/sponsored-spas) */}
          {activeSection === 'sponsored' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#F35271] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
                      Partner Referral Network
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-[#757880]">Sub-Spa Fleet Overview</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0D0D12] mt-1">
                    Sponsored Sub-Spas Network
                  </h2>
                  <p className="text-xs text-[#757880] mt-0.5">
                    Track, mentor, and monitor all partner spas registered across the platform using your sponsor code.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchSponsoredSpas}
                    disabled={sponsoredLoading}
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#0D0D12] hover:bg-gray-50 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${sponsoredLoading ? 'animate-spin text-[#F35271]' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {sponsoredError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{sponsoredError}</span>
                  </div>
                  <button
                    onClick={fetchSponsoredSpas}
                    className="px-3 py-1 bg-white border border-red-200 rounded-lg font-semibold hover:bg-red-100 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* 1. Hero Sponsor Code & Quick Share Hub */}
              <div className="bg-gradient-to-br from-[#121019] via-[#1B1627] to-[#0F0D16] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-purple-900/30">
                <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute right-1/3 -top-12 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-4xl space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-[#F35271]">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F35271]">
                        Official Sponsor Program
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-purple-300/90 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-700/40">
                      Earn 2% Lifetime Booking Commission
                    </span>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1">
                        Your Unique Sponsor Referral Code
                      </span>
                      <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                        <strong className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest">
                          {sponsoredData?.mySponsorCode || sponsoredData?.sponsor?.spaCode || activeSpaCode}
                        </strong>
                        <button
                          type="button"
                          onClick={() => handleCopySponsorCode(sponsoredData?.mySponsorCode || sponsoredData?.sponsor?.spaCode || activeSpaCode)}
                          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedSponsorCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleCopySponsorCode(sponsoredData?.mySponsorCode || sponsoredData?.sponsor?.spaCode || activeSpaCode)}
                        className="px-4 py-3 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        {copiedSponsorCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedSponsorCode ? 'Code Copied!' : 'Copy Sponsor Code'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const code = sponsoredData?.mySponsorCode || sponsoredData?.sponsor?.spaCode || activeSpaCode;
                          const url = `https://wa.me/?text=${encodeURIComponent(
                            `Hi! Register your Spa & Salon on Therapyshala using my Sponsor Code: ${code}. Submit your onboarding enquiry here: ${window.location.origin}/enquiry`
                          )}`;
                          window.open(url, '_blank');
                        }}
                        className="px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Share on WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const code = sponsoredData?.mySponsorCode || sponsoredData?.sponsor?.spaCode || activeSpaCode;
                          const inviteUrl = `${window.location.origin}/enquiry?sponsor=${encodeURIComponent(code)}`;
                          navigator.clipboard.writeText(inviteUrl);
                          setCopiedSponsorCode(true);
                          setTimeout(() => setCopiedSponsorCode(false), 2000);
                        }}
                        className="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        title="Copy direct invite link"
                      >
                        <Share2 className="w-4 h-4 text-gray-300" />
                        <span>Copy Link</span>
                      </button>
                    </div>
                  </div>

                  {/* 3-Step Process Flow Mini Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-300 text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                      <span className="text-gray-300 text-[11px]">Share your code with partner wellness spas</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                      <span className="text-gray-300 text-[11px]">Sub-owners register & verify their center</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                      <span className="text-gray-300 text-[11px]">Earn real-time cash commission on their bookings</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Settings & Sponsor Profile 2-Column Responsive Layout */}
              {/* 2. Settings & Sponsor Profile */}
              <div className="space-y-6">
                {/* Commission Settings Card */}
                <div>
                  <SpaOwnerReferralCommissionCard
                    initialPercentage={sponsoredData?.activeReferralPercentage ?? 2}
                    onCommissionUpdated={(newRate) => {
                      setSponsoredData((prev) => (prev ? { ...prev, activeReferralPercentage: newRate } : prev));
                    }}
                  />
                </div>

                {/* Sponsor Profile Summary (Horizontal full-width card matching original) */}
                <div>
                  {(() => {
                    const sponsor = sponsoredData?.sponsor || {
                      ownerName: ownerProfile?.ownerName || dashboardData?.registeredSpa?.ownerName || 'akash',
                      businessName: ownerProfile?.businessName || dashboardData?.registeredSpa?.businessName || 'akash',
                      spaCode: activeSpaCode,
                      email: ownerProfile?.email || dashboardData?.registeredSpa?.email || '—',
                      phone: ownerProfile?.phone || dashboardData?.registeredSpa?.phone || '—',
                      status: ownerProfile?.status || 'ACTIVE',
                    };

                    return (
                      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold border border-purple-100 shadow-2xs">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#0D0D12]">Sponsor Profile</h4>
                              <p className="text-xs text-[#757880]">
                                Your sponsor identity in the TherapyShala referral network
                              </p>
                            </div>
                          </div>
                          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            <span>{sponsor.status || 'ACTIVE'}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs pt-1">
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Sponsor Name</span>
                            <strong className="text-xs text-[#0D0D12] block truncate font-bold mt-0.5">
                              {sponsor.ownerName || '—'}
                            </strong>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Business Name</span>
                            <strong className="text-xs text-[#0D0D12] block truncate font-bold mt-0.5">
                              {sponsor.businessName || '—'}
                            </strong>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Spa Code</span>
                            <span className="font-mono text-xs font-bold text-[#F35271] block mt-0.5">
                              {sponsor.spaCode || activeSpaCode}
                            </span>
                          </div>
                          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Email</span>
                            <span className="text-xs text-gray-700 font-medium block truncate mt-0.5" title={sponsor.email}>
                              {sponsor.email || '—'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Mobile</span>
                            <span className="font-mono text-xs text-gray-800 font-medium block truncate mt-0.5">
                              {sponsor.phone || '—'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Account Status</span>
                            <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                              {sponsor.status || 'ACTIVE'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* 3. Sub-Owner Summary KPI Cards & Downline Roster */}
              {(() => {
                const subOwnersList = sponsoredData?.subOwners || sponsoredData?.sponsoredSpas || [];
                const totalCount =
                  sponsoredData?.totalSubOwners ?? sponsoredData?.totalSponsoredSpas ?? subOwnersList.length;
                const activeCount =
                  sponsoredData?.activeSubOwners ??
                  sponsoredData?.activeSponsoredSpas ??
                  subOwnersList.filter((s) => (s.status || 'ACTIVE') === 'ACTIVE').length;
                const referralRate = sponsoredData?.activeReferralPercentage ?? 2;
                const totalReferralEarnings = Number(sponsoredData?.totalReferralEarningsRupees ?? 0);
                const sponsorName =
                  sponsoredData?.sponsor?.ownerName || ownerProfile?.ownerName || 'My Spa';

                return (
                  <>
                    {/* 4 KPI Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* 1. Total Sub-Owners */}
                      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
                        <div className="flex items-center justify-between text-[#757880]">
                          <span className="text-[11px] font-bold uppercase tracking-wider">Total Sub-Owners</span>
                          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center shadow-2xs">
                            <Building2 className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-2xl font-extrabold text-[#0D0D12]">
                          {sponsoredLoading ? (
                            <div className="h-7 w-12 bg-gray-200 rounded animate-pulse" />
                          ) : (
                            totalCount
                          )}
                        </div>
                        <p className="text-[11px] text-[#757880]">All affiliated downline partners</p>
                      </div>

                      {/* 2. Active Sub-Owners */}
                      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
                        <div className="flex items-center justify-between text-[#757880]">
                          <span className="text-[11px] font-bold uppercase tracking-wider">Active Sub-Owners</span>
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-2xl font-extrabold text-emerald-600">
                          {sponsoredLoading ? (
                            <div className="h-7 w-12 bg-gray-200 rounded animate-pulse" />
                          ) : (
                            activeCount
                          )}
                        </div>
                        <p className="text-[11px] text-[#757880]">Live verified operational spas</p>
                      </div>

                      {/* 3. Referral Commission Rate */}
                      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
                        <div className="flex items-center justify-between text-[#757880]">
                          <span className="text-[11px] font-bold uppercase tracking-wider">Referral Rate</span>
                          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
                            <Percent className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-2xl font-extrabold text-purple-600">
                          {sponsoredLoading ? (
                            <div className="h-7 w-12 bg-gray-200 rounded animate-pulse" />
                          ) : (
                            `${referralRate}%`
                          )}
                        </div>
                        <p className="text-[11px] text-[#757880]">Per booking revenue share</p>
                      </div>

                      {/* 4. Total Referral Earnings */}
                      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
                        <div className="flex items-center justify-between text-[#757880]">
                          <span className="text-[11px] font-bold uppercase tracking-wider">Total Referral Earnings</span>
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
                            <Coins className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-2xl font-extrabold text-[#F35271]">
                          {sponsoredLoading ? (
                            <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                          ) : (
                            `₹${totalReferralEarnings.toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          )}
                        </div>
                        <p className="text-[11px] text-[#757880]">Cumulative referral commission</p>
                      </div>
                    </div>

                    {/* 4. Sub-Owners Table & Rich Empty State */}
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
                      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#F35271]" />
                          <h4 className="text-sm font-bold text-[#0D0D12]">Sub-Owner Details</h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                            {subOwnersList.length} Partner{subOwnersList.length === 1 ? '' : 's'}
                          </span>
                        </div>
                        <p className="text-xs text-[#757880]">
                          Referred Spa Owners generating commission for your account
                        </p>
                      </div>

                      {sponsoredLoading ? (
                        <div className="p-14 text-center text-xs text-gray-500 space-y-2">
                          <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#F35271]" />
                          <p className="font-semibold">Loading referral network data...</p>
                        </div>
                      ) : subOwnersList.length === 0 ? (
                        <div className="p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5">
                          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-[#F35271] flex items-center justify-center mx-auto shadow-inner border border-rose-100">
                            <Share2 className="w-8 h-8" />
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-base sm:text-lg font-extrabold text-[#0D0D12]">
                              Build Your Wellness Partner Downline
                            </h4>
                            <p className="text-xs text-[#757880] leading-relaxed">
                              You haven't referred any partner spas yet. Invite wellness center and salon owners using your sponsor code <strong>{sponsoredData?.mySponsorCode || sponsoredData?.sponsor?.spaCode || activeSpaCode}</strong> to start earning 2% commission on their booking revenue.
                            </p>
                          </div>

                          {/* 3 Step Interactive Card */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-1">
                              <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-wider">Step 1</span>
                              <div className="font-bold text-xs text-gray-900">Share Code</div>
                              <p className="text-[11px] text-gray-500 leading-tight">Send your sponsor code to spa & salon owners.</p>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-1">
                              <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">Step 2</span>
                              <div className="font-bold text-xs text-gray-900">Sub-Owner Signs Up</div>
                              <p className="text-[11px] text-gray-500 leading-tight">They enter your sponsor code when registering.</p>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-1">
                              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Step 3</span>
                              <div className="font-bold text-xs text-gray-900">Earn Cash</div>
                              <p className="text-[11px] text-gray-500 leading-tight">Receive 2% cash on every booking they fulfill.</p>
                            </div>
                          </div>

                          <div className="pt-2 flex flex-wrap justify-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleCopySponsorCode(
                                  sponsoredData?.mySponsorCode ||
                                    sponsoredData?.sponsor?.spaCode ||
                                    activeSpaCode
                                )
                              }
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D0D12] hover:bg-[#F35271] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Sponsor Code</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const code = sponsoredData?.mySponsorCode || sponsoredData?.sponsor?.spaCode || activeSpaCode;
                                const url = `https://wa.me/?text=${encodeURIComponent(
                                  `Hi! Register your Spa & Salon on Therapyshala using my Sponsor Code: ${code}. Submit your onboarding enquiry here: ${window.location.origin}/enquiry`
                                )}`;
                                window.open(url, '_blank');
                              }}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Invite on WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAFAFA] border-b border-gray-100 text-[10px] uppercase tracking-wider font-bold text-[#757880]">
                              <tr>
                                <th className="py-3.5 px-4">Owner Name</th>
                                <th className="py-3.5 px-4">Spa / Business</th>
                                <th className="py-3.5 px-4">Spa Code</th>
                                <th className="py-3.5 px-4">Email</th>
                                <th className="py-3.5 px-4">Mobile</th>
                                <th className="py-3.5 px-4 text-center">Status</th>
                                <th className="py-3.5 px-4 text-center">Linked Therapists</th>
                                <th className="py-3.5 px-4 text-right">Referral Earnings</th>
                                <th className="py-3.5 px-4">Sponsor</th>
                                <th className="py-3.5 px-4 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {subOwnersList.map((spa) => {
                                const isLive = (spa.status || 'ACTIVE').toUpperCase() === 'ACTIVE';
                                const earnings = Number(spa.totalReferralEarningsRupees ?? 0);

                                return (
                                  <tr
                                    key={spa.id || spa._id || spa.spaCode}
                                    className="hover:bg-rose-50/20 transition-colors"
                                  >
                                    {/* Owner Name */}
                                    <td className="py-4 px-4 font-semibold text-[#0D0D12]">
                                      {spa.ownerName || '—'}
                                    </td>

                                    {/* Business Name */}
                                    <td className="py-4 px-4 font-medium text-gray-800">
                                      {spa.businessName || '—'}
                                    </td>

                                    {/* Spa Code */}
                                    <td className="py-4 px-4 font-mono font-bold text-[#F35271]">
                                      {spa.spaCode || '—'}
                                    </td>

                                    {/* Email */}
                                    <td className="py-4 px-4 text-gray-600 truncate max-w-[140px]">
                                      {spa.email || '—'}
                                    </td>

                                    {/* Mobile */}
                                    <td className="py-4 px-4 font-mono text-gray-700 whitespace-nowrap">
                                      {spa.phone || '—'}
                                    </td>

                                    {/* Status */}
                                    <td className="py-4 px-4 text-center">
                                      <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                          isLive
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                        }`}
                                      >
                                        {spa.status || 'ACTIVE'}
                                      </span>
                                    </td>

                                    {/* Linked Therapists */}
                                    <td className="py-4 px-4 text-center">
                                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                                        {spa.linkedTherapistsCount ?? (spa.declaredTherapists || 0)}
                                      </span>
                                    </td>

                                    {/* Referral Earnings */}
                                    <td className="py-4 px-4 text-right font-extrabold text-emerald-600 text-sm whitespace-nowrap">
                                      ₹{earnings.toFixed(2)}
                                    </td>

                                    {/* Sponsor */}
                                    <td className="py-4 px-4 text-gray-700">
                                      {spa.sponsorOwnerName || sponsorName || '—'}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-4 px-4 text-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedSubOwner(spa);
                                          setSubOwnerModalOpen(true);
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-[#F35271] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 mx-auto"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>View Details</span>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}

              {/* Pending Inquiries Section (if any) */}
              {Array.isArray(sponsoredData?.pendingInquiries) && sponsoredData.pendingInquiries.length > 0 && (
                <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
                  <div className="p-5 border-b border-amber-100 bg-amber-50/40 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#0D0D12]">
                        Pending Applications Under Your Sponsor Code
                      </h3>
                      <p className="text-xs text-[#757880] mt-0.5">
                        These inquiries were submitted with your sponsor code and are awaiting admin review.
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                      {sponsoredData.pendingInquiries.length} Pending
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {sponsoredData.pendingInquiries.map((inq, idx) => (
                      <div key={inq.id || inq._id || idx} className="p-4 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-[#0D0D12] block text-sm">{inq.businessName}</strong>
                          <span className="text-[#757880]">Owner: {inq.ownerName} • {inq.phone}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[10px]">
                          Pending Approval
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HELP & PARTNER SUPPORT DESK */}
          {activeSection === 'support' && (
            <SpaOwnerSupportView
              ownerName={activeOwnerName}
              spaName={activeBusinessName}
              spaCode={activeSpaCode}
              ownerEmail={activeOwnerEmail}
              ownerPhone={activeOwnerPhone}
              onNavigateToChatDesk={() => setActiveSection('messages')}
            />
          )}

          {/* Sub-Owner Details Modal */}
          <SubOwnerDetailModal
            isOpen={subOwnerModalOpen}
            onClose={() => {
              setSubOwnerModalOpen(false);
              setSelectedSubOwner(null);
            }}
            subOwner={selectedSubOwner}
            sponsor={sponsoredData?.sponsor || ownerProfile}
          />

          {/* Realtime Floating Toast Banner for New Appointments (appointment:new) */}
          <AnimatePresence>
            {activeAppointmentToast && (
              <motion.div
                initial={{ opacity: 0, y: -25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -25, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed top-6 right-6 z-50 max-w-sm sm:max-w-md w-full bg-white rounded-3xl shadow-2xl border-2 border-[#F35271] p-4 flex items-start gap-3.5 backdrop-blur-md bg-white/95"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#F35271] flex items-center justify-center shrink-0 shadow-inner">
                  <CalendarCheck className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-[#F35271]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F35271] animate-ping" />
                      New Booking Received
                    </span>
                    <button
                      onClick={() => setActiveAppointmentToast(null)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h5 className="font-extrabold text-[#0D0D12] text-sm mt-1">
                    {activeAppointmentToast.title}
                  </h5>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                    {activeAppointmentToast.desc}
                  </p>
                  {soundPlaybackBlocked && !isSoundMuted && (
                    <button
                      type="button"
                      onClick={enableNotificationSound}
                      className="mt-2 text-xs font-bold text-amber-700 underline underline-offset-2"
                    >
                      Enable notification sound
                    </button>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveSection(
                          getOwnerNotificationSection(activeAppointmentToast)
                        );
                        setActiveAppointmentToast(null);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <span>
                        {`Open ${
                          {
                            bookings: 'Bookings',
                            therapists: 'Therapists',
                            payments: 'Payments',
                            support: 'Support',
                            sponsored: 'Sponsored Spas',
                            account: 'Account',
                            updates: 'Dashboard',
                          }[activeAppointmentToast.category] || 'Dashboard'
                        }`}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveAppointmentToast(null)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

    </div>
  );
}
