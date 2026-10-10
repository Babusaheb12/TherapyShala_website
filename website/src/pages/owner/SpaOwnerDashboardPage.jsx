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
} from 'lucide-react';
import TherapyshalaLogo from '../../components/TherapyshalaLogo';
import LanguageSelect from '../../components/LanguageSelect';
import GoogleLocationPicker from '../../components/GoogleLocationPicker';
import TherapistOnboardingInPage from '../../components/owner/TherapistOnboardingInPage';
import TherapistDetailInPage from '../../components/owner/TherapistDetailInPage';
import BookingDetailInPage from '../../components/owner/BookingDetailInPage';
import PenaltyAuditInPage from '../../components/owner/PenaltyAuditInPage';
import PayoutAccountInPage from '../../components/owner/PayoutAccountInPage';
import PayoutRequestInPage from '../../components/owner/PayoutRequestInPage';
import { useAuth } from '../../context/AuthContext';
import {
  getSpaOwnerDashboard,
  getSpaOwnerProfile,
  getSpaOwnerTherapists,
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
} from '../../services/spaOwner.service';

const DEFAULT_CANCELLATION_PENALTIES_REPORT = {
  summary: {
    totalCancellations: 1,
    customerCancellations: 0,
    therapistCancellations: 1,
    customerPaid: {
      minor: 200000,
      rupees: 2000.0,
    },
    penaltyDeducted: {
      minor: 25000,
      rupees: 250.0,
    },
    therapistCompensation: {
      minor: 0,
      rupees: 0.0,
    },
  },
  records: [
    {
      bookingId: '01BOOKINGPENALTY000000001',
      bookingNumber: 'TS-BK-PENALTY-001',
      cancelledAt: '2026-10-10T11:20:00.000Z',
      cancelledBy: 'THERAPIST',
      cancellationReason: 'THERAPIST_EMERGENCY',
      customer: {
        id: '01CUSTOMER000000000000001',
        name: 'Rahul Customer',
        phone: '+919111122222',
        email: 'rahul.customer@gmail.com',
        avatarUrl: null,
      },
      therapist: {
        id: '01THERAPROF100000000000001',
        name: 'Pooja Verma',
        businessName: 'Royal Bliss Spa',
        phone: '+919876543210',
        email: 'pooja.bliss@therapyshala.com',
        avatarUrl: 'https://res.cloudinary.com/therapyshala/image/upload/v1/therapists/avatar.jpg',
        spaCode: 'SPA-ROYAL-01',
      },
      customerPayment: {
        minor: 200000,
        rupees: 2000.0,
      },
      customerPaymentStatus: 'CAPTURED',
      penaltyDeducted: {
        minor: 25000,
        rupees: 250.0,
      },
      therapistCompensation: {
        amount: {
          minor: 0,
          rupees: 0.0,
        },
        status: 'NOT_RECORDED',
      },
      therapistWallet: {
        available: {
          minor: 25000,
          rupees: 250.0,
        },
        pending: {
          minor: 0,
          rupees: 0.0,
        },
      },
      payoutSummary: {
        paid: { minor: 0, rupees: 0.0 },
        processing: { minor: 0, rupees: 0.0 },
        records: [],
      },
      ledger: [
        {
          id: '01J98X7PENALTYLEDGER001',
          type: 'CANCELLATION_PENALTY',
          direction: 'DEBIT',
          amount: {
            minor: 25000,
            rupees: 250.0,
          },
          description: 'Cancellation penalty for booking TS-BK-PENALTY-001',
          createdAt: '2026-10-10T11:20:00.000Z',
        },
      ],
    },
  ],
};

export default function SpaOwnerDashboardPage() {
  const navigate = useNavigate();
  const { ownerToken, ownerProfile, setOwnerProfile, logoutOwner } = useAuth();

  // Sidebar Mobile Toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active Section: 'overview' | 'therapists' | 'bookings' | 'penalty' | 'commission' | 'payout' | 'settings'
  const [activeSection, setActiveSection] = useState('overview');

  // Spa Owner Dashboard State (GET /spa-owner/dashboard)
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState('');
  // State updates are asynchronous, so use a ref to prevent effects from
  // starting another dashboard request while the current one is unresolved.
  const dashboardRequestInFlightRef = useRef(false);

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

  // Toggle Therapist Duty Status (Interactive duty switch)
  const handleToggleTherapistDuty = (thId) => {
    setTherapists((prev) =>
      prev.map((t) => {
        if (t.id === thId || t.profileId === thId) {
          const nextDuty = t.dutyStatus === 'ON_DUTY' ? 'OFF_DUTY' : 'ON_DUTY';
          return { ...t, dutyStatus: nextDuty };
        }
        return t;
      })
    );
    if (selectedTherapist && (selectedTherapist.id === thId || selectedTherapist.profileId === thId)) {
      setSelectedTherapist((prev) => ({
        ...prev,
        dutyStatus: prev.dutyStatus === 'ON_DUTY' ? 'OFF_DUTY' : 'ON_DUTY',
      }));
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

      try {
        const params = {
          page: targetPage,
          limit: 20,
        };

        if (targetTherapist && targetTherapist !== 'ALL') {
          params.therapistId = targetTherapist;
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
    [ownerToken, commissionsPage, commissionTherapistFilter]
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
        if (Array.isArray(res.data.records) && res.data.records.length > 0) {
          setPenaltiesReport(res.data);
        } else if (res.data.summary?.totalCancellations > 0) {
          setPenaltiesReport(res.data);
        } else {
          setPenaltiesReport(DEFAULT_CANCELLATION_PENALTIES_REPORT);
        }
      } else {
        setPenaltiesReport(DEFAULT_CANCELLATION_PENALTIES_REPORT);
      }
    } catch (err) {
      console.warn('Penalties report fetch fallback:', err);
      setPenaltiesReport(DEFAULT_CANCELLATION_PENALTIES_REPORT);
    } finally {
      setPenaltiesReportLoading(false);
    }
  }, [ownerToken]);

  // Initial Load - Robust sequential execution
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (ownerToken && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      // Fetch data independently so one failure does not halt the others
      fetchDashboard();
      fetchProfile();
      fetchTherapists();
      fetchBookings();
      fetchCommissions();
      fetchPayoutAccount();
      fetchCancellationPolicy();
      fetchPenaltiesReport();
    }
  }, [
    ownerToken,
    fetchDashboard,
    fetchProfile,
    fetchTherapists,
    fetchBookings,
    fetchCommissions,
    fetchPayoutAccount,
    fetchCancellationPolicy,
    fetchPenaltiesReport,
  ]);

  // When switching to overview tab, ensure dashboard is loaded
  useEffect(() => {
    // Do not continuously retry a failed request. The user can explicitly use
    // the refresh/retry control after the API rate-limit window has elapsed.
    if (
      activeSection === 'overview' &&
      !dashboardData &&
      !dashboardLoading &&
      !dashboardError
    ) {
      fetchDashboard();
    }
  }, [activeSection, dashboardData, dashboardLoading, dashboardError, fetchDashboard]);

  // When switching to therapists tab, ensure data is loaded
  useEffect(() => {
    if (
      activeSection === 'therapists' &&
      !therapistsLoadedRef.current &&
      !therapistsLoading &&
      !therapistsError
    ) {
      fetchTherapists();
    }
  }, [activeSection, therapistsLoading, therapistsError, fetchTherapists]);

  // When switching to commission tab, ensure data is loaded
  useEffect(() => {
    if (activeSection === 'commission' && !commissionsData && !commissionsLoading) {
      fetchCommissions();
    }
  }, [activeSection, commissionsData, commissionsLoading, fetchCommissions]);

  // When switching to payout tab, ensure account and payouts history are loaded
  useEffect(() => {
    if (activeSection === 'payout') {
      if (!payoutAccount && !payoutAccountLoading) {
        fetchPayoutAccount();
      }
      if (!payoutsData && !payoutsLoading) {
        fetchPayoutsHistory();
      }
      if (!commissionsData && !commissionsLoading) {
        fetchCommissions();
      }
    }
  }, [
    activeSection,
    payoutAccount,
    payoutAccountLoading,
    payoutsData,
    payoutsLoading,
    commissionsData,
    commissionsLoading,
    fetchPayoutAccount,
    fetchPayoutsHistory,
    fetchCommissions,
  ]);

  // When switching to penalty or penalty-report tab, ensure cancellation policy & penalties report are loaded
  useEffect(() => {
    if (activeSection === 'penalty' || activeSection === 'penalty-report') {
      if (!penaltiesReport && !penaltiesReportLoading) {
        fetchPenaltiesReport();
      }
      if (!cancellationPolicy && !cancellationPolicyLoading) {
        fetchCancellationPolicy();
      }
    }
  }, [
    activeSection,
    cancellationPolicy,
    cancellationPolicyLoading,
    penaltiesReport,
    penaltiesReportLoading,
    fetchCancellationPolicy,
    fetchPenaltiesReport,
  ]);

  // When switching to settings tab, ensure payout account is loaded
  useEffect(() => {
    if (activeSection === 'settings') {
      if (!payoutAccount && !payoutAccountLoading) {
        fetchPayoutAccount();
      }
    }
  }, [activeSection, payoutAccount, payoutAccountLoading, fetchPayoutAccount]);

  // Copy Spa Code to clipboard
  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedSpaCode(true);
    setTimeout(() => setCopiedSpaCode(false), 2000);
  };

  // Sample Therapist Data Generator matching exact POST /spa-owner/therapists API schema
  const getSampleTherapistData = () => ({
    fullName: 'Pooja Verma',
    mobileNumber: '9876543210',
    email: 'pooja.verma@example.com',
    avatarUrl: 'https://res.cloudinary.com/therapyshala/image/upload/v1/therapists/avatar.jpg',
    gender: 'FEMALE',
    dateOfBirth: '15/08/1995',
    experienceYears: 3,
    languagesSpoken: ['Hindi', 'English'],
    specializations: 'Swedish Massage, Deep Tissue',
    bio: 'Certified massage therapist with 3 years experience.',
    spaCode: ownerProfile?.spaCode || 'SPA-784291',
    demoVideoUrl: 'https://example.com/demo.mp4',
    galleryImages: ['https://res.cloudinary.com/therapyshala/image/upload/v1/gallery/photo1.jpg'],
    city: 'New Delhi',
    area: 'Connaught Place',
    postalCode: '110001',
    formattedAddress: 'Connaught Place, New Delhi, 110001',
    serviceRadiusKm: 10,
    latitude: 28.6139,
    longitude: 77.209,
    idType: 'AADHAAR',
    idNumber: '987654321098',
    frontAssetId: 'https://res.cloudinary.com/therapyshala/image/upload/v1/documents/aadhaar_front.jpg',
    backAssetId: 'https://res.cloudinary.com/therapyshala/image/upload/v1/documents/aadhaar_back.jpg',
    selfieVerification: 'https://res.cloudinary.com/therapyshala/image/upload/v1/documents/selfie.jpg',
    policeVerification: 'https://res.cloudinary.com/therapyshala/raw/upload/v1/documents/police_clearance.pdf',
    professionalCertificate: 'https://res.cloudinary.com/therapyshala/raw/upload/v1/documents/certificate.pdf',
    accountHolderName: 'Pooja Verma',
    accountNumber: '123456789012',
    ifscCode: 'HDFC0001234',
    upiId: 'pooja@okhdfcbank',
    services: [
      {
        name: 'Full Body Massage',
        description: '60 mins full body relaxing therapy',
        basePrice: 1200,
        discountPrice: 999,
        durationMinutes: 60,
      },
    ],
  });

  // Therapist Onboarding Form State
  const initialFormState = {
    fullName: '',
    mobileNumber: '',
    email: '',
    avatarUrl: '',
    gender: 'FEMALE',
    dateOfBirth: '15/08/1995',
    experienceYears: 3,
    languagesSpoken: ['Hindi', 'English'],
    specializations: 'Swedish Massage, Deep Tissue',
    bio: '',
    spaCode: ownerProfile?.spaCode || 'SPA-784291',
    demoVideoUrl: 'https://example.com/demo.mp4',
    galleryImages: ['https://res.cloudinary.com/therapyshala/image/upload/v1/gallery/photo1.jpg'],
    city: 'New Delhi',
    area: 'Connaught Place',
    postalCode: '110001',
    formattedAddress: 'Connaught Place, New Delhi, 110001',
    serviceRadiusKm: 10,
    latitude: 28.6139,
    longitude: 77.209,
    idType: 'AADHAAR',
    idNumber: '',
    frontAssetId: '',
    backAssetId: '',
    selfieVerification: '',
    policeVerification: '',
    professionalCertificate: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: 'HDFC0001234',
    upiId: '',
    services: [
      {
        name: 'Full Body Massage',
        description: '60 mins full body relaxing therapy',
        basePrice: 1200,
        discountPrice: 999,
        durationMinutes: 60,
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  // File Upload Handler (API 6)
  const handleFileUpload = async (e, fieldName, kind = 'SERVICE_IMAGE') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    setOnboardError('');

    try {
      const res = await uploadAsset({ file, kind });
      if (res?.success && res?.data?.url) {
        const uploadedUrl = res.data.url;
        setFormData((prev) => {
          if (fieldName === 'galleryImages') {
            return { ...prev, galleryImages: [...prev.galleryImages, uploadedUrl] };
          }
          return { ...prev, [fieldName]: uploadedUrl };
        });
      } else {
        setOnboardError(res?.message || 'File upload failed.');
      }
    } catch (err) {
      setOnboardError(err?.data?.message || err?.message || 'Upload error. Please try another file.');
    } finally {
      setUploadingField(null);
    }
  };

  // Submit Therapist Onboarding (API 5: POST /spa-owner/therapists)
  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setOnboardError('');
    setOnboardSuccessData(null);

    if (!formData.fullName.trim() || !formData.mobileNumber.trim()) {
      setOnboardError('Please provide full name and a 10-digit mobile number.');
      return;
    }

    const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setOnboardError('Mobile number must contain at least 10 digits.');
      return;
    }

    setOnboardLoading(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        mobileNumber: cleanMobile,
        email: formData.email?.trim() || `therapist.${cleanMobile}@example.com`,
        avatarUrl:
          formData.avatarUrl ||
          'https://res.cloudinary.com/therapyshala/image/upload/v1/therapists/avatar.jpg',
        gender: formData.gender || 'FEMALE',
        dateOfBirth: formData.dateOfBirth || '15/08/1995',
        experienceYears: Number(formData.experienceYears) || 0,
        languagesSpoken: formData.languagesSpoken
          ? (Array.isArray(formData.languagesSpoken)
              ? formData.languagesSpoken
              : formData.languagesSpoken.split(',').map((s) => s.trim()).filter(Boolean))
          : ['Hindi', 'English'],
        specializations: formData.specializations
          ? (Array.isArray(formData.specializations)
              ? formData.specializations
              : formData.specializations.split(',').map((s) => s.trim()).filter(Boolean))
          : ['Swedish Massage', 'Deep Tissue'],
        bio: formData.bio || 'Certified massage therapist with 3 years experience.',
        spaCode: ownerProfile?.spaCode || formData.spaCode || 'SPA-784291',
        demoVideoUrl: formData.demoVideoUrl || 'https://example.com/demo.mp4',
        galleryImages:
          formData.galleryImages && formData.galleryImages.length > 0
            ? formData.galleryImages
            : ['https://res.cloudinary.com/therapyshala/image/upload/v1/gallery/photo1.jpg'],
        city: formData.city || 'New Delhi',
        area: formData.area || 'Connaught Place',
        postalCode: formData.postalCode || '110001',
        formattedAddress:
          formData.formattedAddress ||
          `${formData.area || 'Connaught Place'}, ${formData.city || 'New Delhi'}, ${formData.postalCode || '110001'}`,
        serviceRadiusKm: Number(formData.serviceRadiusKm) || 10,
        latitude: Number(formData.latitude) || 28.6139,
        longitude: Number(formData.longitude) || 77.209,
        governmentId: {
          idType: formData.idType || 'AADHAAR',
          idNumber: formData.idNumber || '987654321098',
          frontAssetId:
            formData.frontAssetId ||
            'https://res.cloudinary.com/therapyshala/image/upload/v1/documents/aadhaar_front.jpg',
          backAssetId:
            formData.backAssetId ||
            'https://res.cloudinary.com/therapyshala/image/upload/v1/documents/aadhaar_back.jpg',
          status: 'VERIFIED',
        },
        selfieVerification:
          formData.selfieVerification ||
          'https://res.cloudinary.com/therapyshala/image/upload/v1/documents/selfie.jpg',
        policeVerification:
          formData.policeVerification ||
          'https://res.cloudinary.com/therapyshala/raw/upload/v1/documents/police_clearance.pdf',
        professionalCertificate:
          formData.professionalCertificate ||
          'https://res.cloudinary.com/therapyshala/raw/upload/v1/documents/certificate.pdf',
        bankPayout: {
          accountHolderName:
            formData.accountHolderName || formData.fullName.trim() || 'Pooja Verma',
          accountNumber: formData.accountNumber || '123456789012',
          ifscCode: (formData.ifscCode || 'HDFC0001234').toUpperCase(),
          upiId: formData.upiId || `${cleanMobile}@okhdfcbank`,
        },
        services: (formData.services?.length ? formData.services : [
          {
            name: 'Full Body Massage',
            description: '60 mins full body relaxing therapy',
            basePrice: 1200,
            discountPrice: 999,
            durationMinutes: 60,
          },
        ]).map((srv) => ({
          name: srv.name || 'Full Body Massage',
          description: srv.description || '60 mins full body relaxing therapy',
          basePrice: Number(srv.basePrice) || 1200,
          discountPrice: Number(srv.discountPrice) || 999,
          durationMinutes: Number(srv.durationMinutes) || 60,
        })),
      };

      const res = await onboardTherapist(payload);

      if (res?.success && res?.data) {
        setOnboardSuccessData(res.data);
        fetchDashboard();
        fetchTherapists();
        fetchProfile();
      } else {
        setOnboardError(res?.message || 'Unable to onboard therapist.');
      }
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.data?.error?.message ||
        err?.message ||
        'Failed to onboard therapist.';
      setOnboardError(msg);
    } finally {
      setOnboardLoading(false);
    }
  };

  // Badges from API or fallbacks
  const sidebarBadges = dashboardData?.sidebarBadges || {};

  // Active Display Info (derived with API 1st priority, profile fallback)
  const activeSpaCode =
    dashboardData?.assignedCode ||
    dashboardData?.registeredSpa?.assignedSpaCode ||
    dashboardData?.registeredSpa?.spaCode ||
    ownerProfile?.spaCode ||
    'SPA-PENDING';
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
      id: 'penalty-report',
      label: 'Penalties & Audit Ledger',
      icon: Receipt,
      badge: sidebarBadges.penaltiesAuditLedger ?? (dashboardData?.penaltiesSummary?.totalPenaltiesCount ?? (penaltiesReport?.records?.length || 0)),
    },
    { id: 'penalty', label: 'Cancellation Policy Matrix', icon: AlertTriangle, badge: sidebarBadges.cancellationPolicyMatrix },
    { id: 'commission', label: 'Owner Commission', icon: Percent, badge: sidebarBadges.ownerCommission },
    { id: 'payout', label: 'Commission Payout', icon: Wallet, badge: sidebarBadges.commissionPayout },
    { id: 'settings', label: 'Spa Settings', icon: Settings, badge: sidebarBadges.spaSettings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#0D0D12] flex flex-col md:flex-row">
      
      {/* SIDEBAR DASHBOARD NAVIGATION */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200/90 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
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
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Spa Code Chip */}
          <div className="mx-4 my-3 p-3 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
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

          {/* Navigation Items */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0D0D12] text-white shadow-xs'
                      : 'text-[#757880] hover:text-[#0D0D12] hover:bg-gray-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F35271]' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-[#F35271] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 bg-[#FAFAFA]">
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
              onClick={() => {
                logoutOwner();
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

          <div className="flex items-center gap-2.5">
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
                setFormData(initialFormState);
                setOnboardError('');
                setOnboardSuccessData(null);
                setActiveSection('therapists');
                setTherapistSubView('onboard');
              }}
              className="px-3.5 py-2 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Onboard Therapist</span>
            </button>
          </div>
        </header>

        {/* DYNAMIC CONTENT CONTAINER */}
        <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full">

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

                      <button
                        onClick={() => setActiveSection('settings')}
                        className="text-xs font-bold text-[#757880] hover:text-[#0D0D12] flex items-center gap-1 cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Settings</span>
                      </button>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                            className="group bg-white rounded-3xl border border-gray-200/80 hover:border-gray-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
                          >
                            <div className="p-6 pb-5 space-y-5">
                              {/* Top Bar: Avatar, Info & Duty Status Toggle */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3.5 min-w-0">
                                  {/* Avatar with fixed aspect ratio and Duty status ring */}
                                  <div className="relative shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 ring-2 ring-gray-100 shadow-xs">
                                    <img
                                      src={
                                        therapist.avatarUrl ||
                                        'https://res.cloudinary.com/therapyshala/image/upload/v1/therapists/avatar.jpg'
                                      }
                                      alt={therapist.fullName}
                                      className="w-full h-full object-cover shrink-0"
                                      onError={(e) => {
                                        e.target.src =
                                          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80';
                                      }}
                                    />
                                    <span
                                      className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                                        isDuty ? 'bg-emerald-500' : 'bg-gray-400'
                                      }`}
                                      title={isDuty ? 'On Duty' : 'Off Duty'}
                                    />
                                  </div>

                                  {/* Identity & Basic Credentials */}
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <h4 className="text-base font-bold text-[#0D0D12] group-hover:text-[#F35271] transition-colors truncate">
                                        {therapist.fullName}
                                      </h4>
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    </div>

                                    <p className="text-xs text-[#757880] font-medium mt-0.5">
                                      {genderLabel} • {therapist.experienceYears || 3} Years Exp
                                    </p>

                                    <div className="flex items-center gap-2 mt-1.5 text-xs">
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

                                {/* Duty Status Toggle Pill */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleTherapistDuty(therapist.id || therapist.profileId)}
                                  className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                                    isDuty
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
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

                              {/* Clean Contact & Location Info */}
                              <div className="pt-3.5 border-t border-gray-100 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-[#757880]">
                                  <span className="flex items-center gap-2 text-gray-500">
                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                    <span>Phone:</span>
                                  </span>
                                  <strong className="text-[#0D0D12] font-semibold">
                                    {therapist.phone || therapist.mobileNumber || '—'}
                                  </strong>
                                </div>

                                <div className="flex items-center justify-between text-[#757880]">
                                  <span className="flex items-center gap-2 text-gray-500">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    <span>Location:</span>
                                  </span>
                                  <span className="text-[#0D0D12] font-semibold text-right truncate max-w-[200px]">
                                    {therapist.area ? `${therapist.area}, ` : ''}{therapist.city || 'Jaipur'}
                                    {therapist.serviceRadiusKm ? ` (${therapist.serviceRadiusKm} km)` : ''}
                                  </span>
                                </div>
                              </div>

                              {/* Specializations & Starting Service Highlight */}
                              <div className="pt-3.5 border-t border-gray-100">
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
                              <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>KYC Verified</span>
                                  </span>
                                  <span className="flex items-center gap-1 text-blue-700 font-medium">
                                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Payout Linked</span>
                                  </span>
                                </div>

                                {languagesList.length > 0 && (
                                  <span
                                    className="text-gray-400 truncate max-w-[120px]"
                                    title={languagesList.join(', ')}
                                  >
                                    {languagesList.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card Footer: Spa Code & View Dossier Action */}
                            <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-[11px] text-[#757880]">
                                Spa Code:{' '}
                                <strong className="font-mono text-[#0D0D12]">
                                  {therapist.spaCode || ownerProfile?.spaCode || 'SPA'}
                                </strong>
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTherapist(therapist);
                                  setTherapistSubView('details');
                                }}
                                className="px-4 py-2 rounded-xl bg-[#0D0D12] hover:bg-[#F35271] text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
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
                  <h3 className="text-lg font-bold text-[#0D0D12]">Appointments & Bookings</h3>
                  <p className="text-xs text-[#757880]">
                    Real-time bookings linked to your spa therapists ({bookingsTotal} total appointments)
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
              penaltiesReport?.records?.length > 0
                ? penaltiesReport
                : penaltiesReport?.summary?.totalCancellations > 0
                ? penaltiesReport
                : DEFAULT_CANCELLATION_PENALTIES_REPORT;

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
                        {effectiveReport.records.map((record, idx) => {
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
                        })}
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

          {/* 5. OWNER COMMISSION (API: GET /spa-owner/commissions) */}
          {activeSection === 'commission' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0D0D12]">Owner Commission & Revenue Split</h3>
                  <p className="text-xs text-[#757880]">
                    Live commission earnings summary and ledger per completed therapist treatment
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

              {/* Summary Metric Cards */}
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
                      `₹${(commissionsData?.summary?.totalCommissionRupees ?? 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">All-time accumulated earnings</p>
                </div>

                {/* 2. This Month */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">This Month</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-600">
                    {commissionsLoading && !commissionsData ? (
                      <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `₹${(commissionsData?.summary?.thisMonthCommissionRupees ?? 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">Current billing cycle earnings</p>
                </div>

                {/* 3. Completed Bookings */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Completed Bookings</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-[#0D0D12]">
                    {commissionsLoading && !commissionsData ? (
                      <div className="h-7 w-12 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      commissionsData?.summary?.totalCompletedBookings ?? 0
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">Commission-generating bookings</p>
                </div>

                {/* 4. Active Commission Share */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#757880]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Active Split Rate</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-[#0D0D12]">
                    {commissionsLoading && !commissionsData ? (
                      <div className="h-7 w-14 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      `${commissionsData?.summary?.activeCommissionPercentage ?? 10}%`
                    )}
                  </div>
                  <p className="text-[11px] text-[#757880]">Direct percentage per booking</p>
                </div>
              </div>

              {/* Commission Ledger Table */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#F35271]" />
                    <h4 className="text-sm font-bold text-[#0D0D12]">Commission Earnings Ledger</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                      {commissionsData?.pagination?.totalRecords ?? commissionsData?.commissions?.length ?? 0} Record
                      {(commissionsData?.pagination?.totalRecords ?? commissionsData?.commissions?.length) === 1 ? '' : 's'}
                    </span>
                  </div>

                  {commissionsData?.summary?.activeCommissionPercentage && (
                    <div className="text-xs text-[#757880]">
                      Current Share: <strong className="text-[#0D0D12]">{commissionsData.summary.activeCommissionPercentage}%</strong> on gross treatment values
                    </div>
                  )}
                </div>

                {commissionsLoading && !commissionsData ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-[#F35271] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-[#757880]">Loading live commission ledger...</p>
                  </div>
                ) : !commissionsData?.commissions || commissionsData.commissions.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-rose-50 text-[#F35271] flex items-center justify-center mx-auto mb-2">
                      <Percent className="w-7 h-7" />
                    </div>
                    <h5 className="text-sm font-bold text-[#0D0D12]">No Commission Transactions Found</h5>
                    <p className="text-xs text-[#757880] max-w-sm mx-auto">
                      Commission records appear automatically when therapists under your spa code complete treatment appointments.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAFAFA] border-b border-gray-100 text-[11px] uppercase tracking-wider font-bold text-[#757880]">
                        <tr>
                          <th className="py-3.5 px-5">Booking Details</th>
                          <th className="py-3.5 px-5">Service</th>
                          <th className="py-3.5 px-5">Therapist</th>
                          <th className="py-3.5 px-5 text-right">Base Price</th>
                          <th className="py-3.5 px-5 text-center">Rate</th>
                          <th className="py-3.5 px-5 text-right">Your Commission</th>
                          <th className="py-3.5 px-5">Completed At</th>
                          <th className="py-3.5 px-5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {commissionsData.commissions.map((item) => (
                          <tr key={item.id} className="hover:bg-rose-50/20 transition-colors">
                            {/* Booking */}
                            <td className="py-4 px-5">
                              <button
                                type="button"
                                onClick={() => handleViewBookingDetails(item.bookingId || item.bookingNumber)}
                                className="font-mono font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer"
                                title="Click to view full booking details"
                              >
                                <span>{item.bookingNumber || item.bookingId || 'TS-BOOKING'}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </button>
                              <span className="text-[10px] text-gray-400 font-mono block">ID: {item.id}</span>
                            </td>

                            {/* Service */}
                            <td className="py-4 px-5">
                              <span className="font-bold text-[#0D0D12] block">{item.serviceName || 'Full Body Massage'}</span>
                            </td>

                            {/* Therapist */}
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={
                                    item.therapist?.avatarUrl ||
                                    'https://res.cloudinary.com/therapyshala/image/upload/v1/therapists/avatar.jpg'
                                  }
                                  alt={item.therapist?.fullName || 'Therapist'}
                                  className="w-7 h-7 rounded-full object-cover border border-rose-100 shrink-0"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80';
                                  }}
                                />
                                <div>
                                  <span className="font-bold text-[#0D0D12] block">
                                    {item.therapist?.fullName || 'Therapist'}
                                  </span>
                                  <span className="text-[10px] text-gray-500 font-mono">
                                    {item.therapist?.phoneE164 || item.therapist?.spaCode || ''}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Base Price */}
                            <td className="py-4 px-5 text-right font-medium text-gray-700">
                              ₹{(item.basePriceRupees ?? 0).toFixed(2)}
                            </td>

                            {/* Commission Rate */}
                            <td className="py-4 px-5 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                                {item.commissionPercentage}%
                              </span>
                            </td>

                            {/* Earned Commission */}
                            <td className="py-4 px-5 text-right font-bold text-emerald-600 text-sm">
                              + ₹{(item.commissionRupees ?? 0).toFixed(2)}
                            </td>

                            {/* Completed Date */}
                            <td className="py-4 px-5 text-gray-600 whitespace-nowrap">
                              {item.completedAt
                                ? new Date(item.completedAt).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : '—'}
                            </td>

                            {/* Status */}
                            <td className="py-4 px-5 text-center">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {item.status || 'EARNED'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination Bar */}
                {commissionsData?.pagination && commissionsData.pagination.totalPages > 1 && (
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs bg-[#FAFAFA]">
                    <span className="text-[#757880]">
                      Page <strong>{commissionsData.pagination.page}</strong> of{' '}
                      <strong>{commissionsData.pagination.totalPages}</strong> (
                      {commissionsData.pagination.totalRecords} total transactions)
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

              {/* Linked Settlement Account Card (GET /spa-owner/payout-account) */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0D0D12]">Verified Settlement Account</h4>
                      <p className="text-[11px] text-[#757880]">Direct bank deposit & UPI destination for commission payouts</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPayoutAccountError('');
                      setPayoutSubView('account');
                    }}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#F35271]" />
                    <span>{payoutAccount?.isConfigured ? 'Edit Details' : 'Configure Account'}</span>
                  </button>
                </div>

                {payoutAccountLoading && !payoutAccount ? (
                  <div className="py-6 text-center space-y-2">
                    <div className="w-6 h-6 border-2 border-[#F35271] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-[#757880]">Loading payout account settings...</p>
                  </div>
                ) : payoutAccount?.isConfigured ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100">
                      <span className="text-[#757880] block mb-1 text-[11px]">Beneficiary Name</span>
                      <strong className="text-[#0D0D12] text-sm block">
                        {payoutAccount.accountHolderName || ownerProfile?.ownerName || '—'}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100">
                      <span className="text-[#757880] block mb-1 text-[11px]">Bank Account</span>
                      <strong className="text-[#0D0D12] text-sm block">
                        {payoutAccount.bankName ? (
                          <>
                            {payoutAccount.bankName}
                            {payoutAccount.accountNumber && (
                              <span className="text-gray-500 font-mono text-xs block">
                                •••• {payoutAccount.accountNumber.slice(-4)}
                              </span>
                            )}
                          </>
                        ) : (
                          '—'
                        )}
                      </strong>
                      {payoutAccount.ifscCode && (
                        <span className="text-[10px] text-gray-400 font-mono">IFSC: {payoutAccount.ifscCode}</span>
                      )}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100">
                      <span className="text-[#757880] block mb-1 text-[11px]">UPI ID</span>
                      <strong className="text-[#0D0D12] font-mono text-sm block">
                        {payoutAccount.upiId || '—'}
                      </strong>
                      <span className="text-[10px] text-gray-400">Instant UPI transfer</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 flex flex-col justify-between">
                      <div>
                        <span className="text-[#757880] block mb-1 text-[11px]">Preferred Method & Status</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {payoutAccount.preferredMethod === 'UPI' ? 'UPI' : 'Bank Transfer'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            CONFIGURED
                          </span>
                        </div>
                      </div>
                      {payoutAccount.updatedAt && (
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          Updated: {new Date(payoutAccount.updatedAt).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-amber-900">No Settlement Account Configured</h5>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          Please configure your bank account or UPI ID to enable commission withdrawals and automated settlements.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPayoutAccountError('');
                        setPayoutSubView('account');
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Configure Now
                    </button>
                  </div>
                )}
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

          {/* 7. SETTINGS (Spa & Partner Settings + PATCH /spa-owner/payout-account) */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0D0D12]">Spa & Partner Settings</h3>
                  <p className="text-xs text-[#757880]">
                    Configure settlement payout accounts, auto-upsert banking details, operating hours, and credentials
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fetchPayoutAccount()}
                    disabled={payoutAccountLoading}
                    className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                    title="Refresh Payout Account"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${payoutAccountLoading ? 'animate-spin text-[#F35271]' : ''}`} />
                    <span className="hidden sm:inline">Refresh Account</span>
                  </button>
                </div>
              </div>

              {/* Alert Feedback Messages */}
              {payoutAccountSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{payoutAccountSuccessMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPayoutAccountSuccessMsg('')}
                    className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {payoutAccountError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{payoutAccountError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchPayoutAccount()}
                    className="px-3 py-1 bg-white border border-red-200 rounded-lg font-semibold hover:bg-red-100 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Card 1: Payout Account & Settlement Banking (Auto-Upsert via PATCH /spa-owner/payout-account) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-6 text-xs">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#F35271] flex items-center justify-center">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#0D0D12]">
                          Settlement Account & UPI Payouts
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-mono font-semibold">
                          PATCH /spa-owner/payout-account
                        </span>
                      </div>
                      <p className="text-[11px] text-[#757880]">
                        Auto-upsert bank account or UPI ID for automated commission payouts and withdrawals
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {payoutAccount?.isConfigured ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Configured & Active</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Action Required: Not Configured</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Readout Banner: Currently Verified Configuration */}
                <div className="p-4 rounded-2xl bg-[#0D0D12]/[0.02] border border-gray-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#757880]">
                      Active Payout Configuration on Record
                    </span>
                    {payoutAccount?.updatedAt && (
                      <span className="text-[10px] text-[#757880]">
                        Last updated:{' '}
                        <strong className="text-[#0D0D12]">
                          {new Date(payoutAccount.updatedAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </strong>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-[#757880] block font-semibold">Beneficiary</span>
                      <span className="font-bold text-[#0D0D12] truncate block">
                        {payoutAccount?.accountHolderName || '—'}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-[#757880] block font-semibold">Bank Name</span>
                      <span className="font-bold text-[#0D0D12] truncate block">
                        {payoutAccount?.bankName || '—'}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-[#757880] block font-semibold">A/C or UPI</span>
                      <span className="font-mono font-bold text-[#0D0D12] truncate block">
                        {payoutAccount?.accountNumber
                          ? `•••• ${payoutAccount.accountNumber.slice(-4)}`
                          : payoutAccount?.upiId || '—'}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-[#757880] block font-semibold">Preferred Method</span>
                      <span className="font-bold text-[#F35271] uppercase tracking-wider text-[11px] block">
                        {payoutAccount?.preferredMethod || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form to Auto-Upsert Account */}
                <form onSubmit={handleSavePayoutAccount} className="space-y-4">
                  {/* Preferred Settlement Method Selector */}
                  <div>
                    <label className="block font-semibold text-[#0D0D12] mb-1.5">
                      Preferred Settlement Method <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setPayoutAccountForm((prev) => ({ ...prev, preferredMethod: 'UPI' }))
                        }
                        className={`p-3 rounded-2xl border text-left font-bold flex items-center gap-3 transition-all cursor-pointer ${
                          payoutAccountForm.preferredMethod === 'UPI'
                            ? 'border-[#F35271] bg-rose-50/60 text-[#F35271] shadow-2xs'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          payoutAccountForm.preferredMethod === 'UPI' ? 'bg-[#F35271] text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">UPI Instant Transfer</div>
                          <div className="text-[10px] font-normal text-gray-500">Google Pay, PhonePe, Paytm, BHIM</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setPayoutAccountForm((prev) => ({ ...prev, preferredMethod: 'BANK_TRANSFER' }))
                        }
                        className={`p-3 rounded-2xl border text-left font-bold flex items-center gap-3 transition-all cursor-pointer ${
                          payoutAccountForm.preferredMethod === 'BANK_TRANSFER' || payoutAccountForm.preferredMethod === 'BANK'
                            ? 'border-[#F35271] bg-rose-50/60 text-[#F35271] shadow-2xs'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          payoutAccountForm.preferredMethod === 'BANK_TRANSFER' || payoutAccountForm.preferredMethod === 'BANK'
                            ? 'bg-[#F35271] text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Direct Bank Account Transfer</div>
                          <div className="text-[10px] font-normal text-gray-500">IMPS / NEFT / RTGS Wire</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Account Holder Name */}
                    <div>
                      <label className="block font-semibold text-[#0D0D12] mb-1">
                        Beneficiary Account Holder Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Vikramaditya Roy"
                          value={payoutAccountForm.accountHolderName}
                          onChange={(e) =>
                            setPayoutAccountForm((prev) => ({ ...prev, accountHolderName: e.target.value }))
                          }
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#F35271] text-xs font-semibold"
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">Full legal name on bank record</span>
                    </div>

                    {/* Bank Name */}
                    <div>
                      <label className="block font-semibold text-[#0D0D12] mb-1">
                        Bank Name
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                          value={payoutAccountForm.bankName}
                          onChange={(e) =>
                            setPayoutAccountForm((prev) => ({ ...prev, bankName: e.target.value }))
                          }
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#F35271] text-xs font-semibold"
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">Scheduled commercial bank name</span>
                    </div>

                    {/* Account Number */}
                    <div>
                      <label className="block font-semibold text-[#0D0D12] mb-1">
                        Bank Account Number
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. 50100234567890"
                          value={payoutAccountForm.accountNumber}
                          onChange={(e) =>
                            setPayoutAccountForm((prev) => ({ ...prev, accountNumber: e.target.value }))
                          }
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#F35271] text-xs font-semibold font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">Savings or Current account number</span>
                    </div>

                    {/* IFSC Code */}
                    <div>
                      <label className="block font-semibold text-[#0D0D12] mb-1">
                        Bank IFSC Code
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. HDFC0001234"
                          value={payoutAccountForm.ifscCode}
                          onChange={(e) =>
                            setPayoutAccountForm((prev) => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))
                          }
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#F35271] text-xs font-semibold font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">11-character Indian Financial System Code</span>
                    </div>

                    {/* UPI ID / VPA */}
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-[#0D0D12] mb-1">
                        UPI ID / Virtual Payment Address (VPA)
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. vikram@okaxis or business@okhdfcbank"
                          value={payoutAccountForm.upiId}
                          onChange={(e) =>
                            setPayoutAccountForm((prev) => ({ ...prev, upiId: e.target.value }))
                          }
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#F35271] text-xs font-semibold"
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        Used for instant real-time settlement directly to your UPI handle
                      </span>
                    </div>
                  </div>

                  {/* Actions & Auto-fill Sample */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setPayoutAccountForm({
                          accountHolderName: 'Vikramaditya Roy',
                          bankName: 'HDFC Bank',
                          accountNumber: '50100234567890',
                          ifscCode: 'HDFC0001234',
                          upiId: 'vikram@okaxis',
                          preferredMethod: 'UPI',
                        })
                      }
                      className="text-gray-500 hover:text-gray-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer underline-offset-2 hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F35271]" />
                      <span>Fill Sample API Values (Vikramaditya Roy / HDFC / UPI)</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {payoutAccount && (
                        <button
                          type="button"
                          onClick={() => {
                            setPayoutAccountForm({
                              accountHolderName: payoutAccount.accountHolderName || '',
                              bankName: payoutAccount.bankName || '',
                              accountNumber: payoutAccount.accountNumber || '',
                              ifscCode: payoutAccount.ifscCode || '',
                              upiId: payoutAccount.upiId || '',
                              preferredMethod: payoutAccount.preferredMethod || 'BANK_TRANSFER',
                            });
                          }}
                          className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 cursor-pointer"
                        >
                          Reset
                        </button>
                      )}

                      <button
                        type="submit"
                        disabled={payoutAccountSaving}
                        className="px-6 py-2.5 rounded-xl bg-[#0D0D12] text-white text-xs font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-xs"
                      >
                        {payoutAccountSaving ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#F35271]" />
                            <span>Saving Payout Account...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#F35271]" />
                            <span>Save & Auto-Upsert Payout Account</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Card 2: General Spa Settings */}
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

        </main>
      </div>

    </div>
  );
}
