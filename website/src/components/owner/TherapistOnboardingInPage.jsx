import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  UserPlus,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  Loader2,
  Trash2,
  Plus,
  Phone,
  Mail,
  User,
  Calendar,
  Award,
  Info,
  MapPin,
  ShieldCheck,
  FileText,
  Lock,
  Eye,
  X,
  FileCheck2,
  Sparkle,
  Layers,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getCategories } from '../../services/spaOwner.service.js';
import GoogleLocationPicker from '../GoogleLocationPicker';
import LanguageSelect from '../LanguageSelect';
import TherapistGalleryField from './TherapistGalleryField';

// Fallback initial categories matching the exact API response provided by the user
const FALLBACK_CATEGORIES = [
  { id: "01M215EXGXZ21MVN5QNV2ZDZQ3", name: "Physical Therapists", slug: "physical-therapists", iconUrl: null },
  { id: "01M60XC6B7KCCZFF7VP1TMQRYB", name: "Deep Tissue Massages", slug: "deep-tissue-massages", iconUrl: null },
  { id: "01M60XCMG3MVJQEM8SVAHX0DE8", name: "Thai Massage", slug: "thai-massage", iconUrl: null },
  { id: "01M60XCX0D6XQMA1QFD0F6E0E1", name: "Ayurvedic Massage", slug: "ayurvedic-massage", iconUrl: null },
  { id: "01M60XD4GE8C1ZV4BFPRNR2ZHM", name: "Aromatherapy Massage", slug: "aromatherapy-massage", iconUrl: null },
  { id: "01M60XDBTGN2YQDQAE5F0YV35X", name: "Hot Stone Massage", slug: "hot-stone-massage", iconUrl: null },
  { id: "01M60XDK8T57VHEJ6WSEB4A3Q4", name: "Head Massage", slug: "head-massage", iconUrl: null },
  { id: "01M60XDVDQ7V405TRZ73RMYEYM", name: "Foot Massage", slug: "foot-massage", iconUrl: null },
  { id: "01M60XE2DV4RAE86YJ6ATHPXFQ", name: "Back & Shoulder Massage", slug: "back-shoulder-massage", iconUrl: null },
  { id: "01M60XE9TRTRT18H4ATF1WDX89", name: "Neck & Shoulder Massage", slug: "neck-shoulder-massage", iconUrl: null },
  { id: "01M60XEJEHGC181CTPRCSRP8JE", name: "Sports Massage", slug: "sports-massage", iconUrl: null },
  { id: "01M60XEZ2APTJBFDEKBR41BC1R", name: "Reflexology", slug: "reflexology", iconUrl: null },
  { id: "01M60XF7ACMEN5EPK9SB2QY9HH", name: "Prenatal Massage", slug: "prenatal-massage", iconUrl: null },
  { id: "01M60XFEEJZ4Z6FDF8PM30C0DG", name: "Postnatal Massage", slug: "postnatal-massage", iconUrl: null },
  { id: "01M60XFNBBPTNSJPR27YG2K71D", name: "Couple Massage", slug: "couple-massage", iconUrl: null },
  { id: "01M60XFXHAA8GRZPASBB3Q0K08", name: "Balinese Massage", slug: "balinese-massage", iconUrl: null },
  { id: "01M60XG4VVR10V7J35WJEGNZSD", name: "Abhyanga Massage", slug: "abhyanga-massage", iconUrl: null },
  { id: "01M60XGCG8GG2JJBXKF6XWQQVJ", name: "Relaxation Massage", slug: "relaxation-massage", iconUrl: null },
  { id: "01M60XGPJ4Y5YKBNAHHTGR3BEG", name: "Therapeutic Massage", slug: "therapeutic-massage", iconUrl: null },
  { id: "01M60X6ZE8D0YDWKPT0ENNDD8B", name: "Swedish Massage", slug: "swedish-massage", iconUrl: "https://img.icons8.com/?size=100&id=7669&format=png&color=000000" }
];

export default function TherapistOnboardingInPage({
  formData = {},
  setFormData,
  onboardLoading,
  onboardError,
  setOnboardError,
  onboardSuccessData,
  setOnboardSuccessData,
  handleOnboardSubmit,
  handleFileUpload,
  handleGalleryUpload,
  uploadingField,
  getSampleTherapistData,
  onBack,
  ownerProfile,
}) {
  // Local state for excluded location tag input
  const [exclusionInput, setExclusionInput] = useState('');

  // Categories API state (api/v1/categories)
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');

  // Maximum allowed Date of Birth (therapist must be at least 18 years old)
  const maxDobDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split('T')[0];
  })();

  // Trigger celebration multi-stage confetti when onboarding succeeds
  useEffect(() => {
    if (onboardSuccessData) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6, x: 0.5 },
          colors: ['#F35271', '#DE4B73', '#FFD700', '#10B981', '#6366F1'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 60,
            origin: { x: 0.05, y: 0.65 },
            colors: ['#F35271', '#FFD700', '#10B981'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 60,
            origin: { x: 0.95, y: 0.65 },
            colors: ['#F35271', '#FFD700', '#6366F1'],
          });
        }, 220);
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [onboardSuccessData]);

  // Fetch categories from api/v1/categories with Bearer token
  useEffect(() => {
    let isMounted = true;
    const fetchApiCategories = async () => {
      setCategoriesLoading(true);
      try {
        const res = await getCategories();
        if (isMounted && res?.success && Array.isArray(res?.data) && res.data.length > 0) {
          setCategories(res.data);
          setCategoriesError('');
        }
      } catch (err) {
        if (isMounted) {
          // If server or network fails, gracefully retain the cached/fallback category catalogue
          console.warn('Categories API notice:', err?.message || err);
        }
      } finally {
        if (isMounted) setCategoriesLoading(false);
      }
    };

    fetchApiCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle adding an excluded location
  const handleAddExcludedLocation = (e) => {
    e?.preventDefault();
    const trimmed = exclusionInput.trim();
    if (!trimmed) return;
    const current = formData.excludedLocations || [];
    if (!current.includes(trimmed)) {
      setFormData({
        ...formData,
        excludedLocations: [...current, trimmed],
      });
    }
    setExclusionInput('');
  };

  // Handle removing an excluded location
  const handleRemoveExcludedLocation = (locToRemove) => {
    const current = formData.excludedLocations || [];
    setFormData({
      ...formData,
      excludedLocations: current.filter((loc) => loc !== locToRemove),
    });
  };

  // Handle adding service
  const handleAddService = (defaultCategoryName = '') => {
    const currentServices = formData.services || [];
    const matchedCat = categories.find((c) => c.name === defaultCategoryName) || categories[0];
    setFormData({
      ...formData,
      services: [
        ...currentServices,
        {
          name: defaultCategoryName || matchedCat?.name || 'Swedish Massage',
          categoryId: matchedCat?.id || '01M60X6ZE8D0YDWKPT0ENNDD8B',
          description: '',
          basePrice: 1200,
          discountPrice: 999,
          durationMinutes: 60,
        },
      ],
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 transition cursor-pointer shadow-2xs flex items-center gap-1.5 text-xs font-bold"
            title="Return to Therapist Fleet"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fleet</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-[#0D0D12]">
                Onboard New Therapist
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-[#F35271] border border-rose-200">
                Therapist Registration
              </span>
            </div>
            <p className="text-xs text-[#757880]">
              Register therapist details, confidential KYC documents, working location exclusions & service catalogue for {ownerProfile?.spaCode || 'your spa'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {onboardError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">{onboardError}</span>
          </div>
          <button
            type="button"
            onClick={() => setOnboardError && setOnboardError('')}
            className="text-red-700 hover:text-red-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Animated Success Celebration Modal Overlay (Replaces static screen) */}
      <AnimatePresence>
        {onboardSuccessData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0D0D12]/65 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setOnboardSuccessData(null)}
          >
            <motion.div
              initial={{ scale: 0.72, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl border border-gray-150 relative overflow-hidden"
            >
              {/* Decorative top ribbon gradient */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-[#F35271] to-purple-500" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setOnboardSuccessData(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Animated Bouncing Celebration Checkmark Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 14, stiffness: 260, delay: 0.1 }}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-3.5 shadow-lg ring-8 ring-emerald-50"
              >
                <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
              </motion.div>

              {/* Title & Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-1"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  Successfully Activated
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0D0D12]">
                  Therapist Onboarded!
                </h3>
                <p className="text-xs text-[#757880]">
                  Therapist profile has been registered and assigned to your spa fleet.
                </p>
              </motion.div>

              {/* Credentials Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="my-4 p-4 rounded-2xl bg-gradient-to-br from-[#FFF5F7] to-[#FFF0F3] border border-rose-200/70 text-left text-xs space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-rose-200/60">
                  <span className="font-bold text-[#F35271] flex items-center gap-1.5 text-xs">
                    📱 Mobile App Access Credentials:
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-rose-200 text-gray-700 shadow-2xs">
                    {ownerProfile?.spaCode || 'SPA-873967'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                  <div>
                    <span className="text-gray-500 text-[11px] block">Display Name (App)</span>
                    <strong className="text-[#0D0D12] text-xs">
                      {onboardSuccessData.displayName || onboardSuccessData.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[11px] block">Full Name</span>
                    <strong className="text-[#0D0D12] text-xs truncate block">
                      {onboardSuccessData.fullName}
                    </strong>
                  </div>
                  <div className="col-span-2 pt-1.5 border-t border-rose-100 flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 text-[11px] block">Registered Mobile Number</span>
                      <strong className="text-[#0D0D12] font-mono text-sm text-[#F35271]">
                        {onboardSuccessData.mobileNumber || onboardSuccessData.phone}
                      </strong>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md shadow-2xs">
                      OTP Login Ready
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 pt-1 leading-relaxed">
                  Therapist can download the <strong>TherapyShala Partner App</strong> and log in with this mobile number.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1"
              >
                <button
                  type="button"
                  onClick={() => {
                    setOnboardSuccessData(null);
                    onBack();
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#0D0D12] hover:bg-black text-white text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <Users className="w-4 h-4 text-[#F35271]" />
                  <span>Done & View in Fleet</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOnboardSuccessData(null);
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[#F35271] text-xs font-bold transition-all cursor-pointer active:scale-98"
                >
                  Onboard Another
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full In-Page Form */}
      <form onSubmit={handleOnboardSubmit} className="space-y-8">

        {/* SECTION 1: Identity & Contact Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-[#0D0D12] text-sm">
                  Identity & Contact Details
                </h4>
                <p className="text-[11px] text-[#757880]">Public display name for customer app, legal verification identity & phone</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">

            {/* Field 1: Display Name + Info Icon */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="font-semibold text-[#0D0D12]">
                  Display Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative group/info cursor-help inline-flex items-center">
                  <Info className="w-3.5 h-3.5 text-rose-500 hover:text-rose-600 transition" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/info:block w-56 p-2.5 bg-gray-900 text-white text-[11px] leading-tight rounded-xl shadow-xl z-30 pointer-events-none">
                    <div className="font-bold text-rose-300 mb-0.5">App Display Name</div>
                    This name will be shown publicly to customers on the TherapyShala mobile app.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.displayName || ''}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="e.g. Pooja V."
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Visible on customer app</p>
            </div>

            {/* Field 2: Full Name + Info Icon */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="font-semibold text-[#0D0D12]">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative group/info cursor-help inline-flex items-center">
                  <Info className="w-3.5 h-3.5 text-blue-600 hover:text-blue-700 transition" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/info:block w-60 p-2.5 bg-gray-900 text-white text-[11px] leading-tight rounded-xl shadow-xl z-30 pointer-events-none">
                    <div className="font-bold text-blue-300 mb-0.5">TherapyShala Internal Security</div>
                    For security and legal verification purposes only. Strictly kept confidential within TherapyShala company and not shown to customers.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Pooja Devi Verma"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Internal records only</p>
            </div>

            {/* Field 3: Mobile Number (Compulsory) */}
            <div>
              <label className="block font-semibold text-[#0D0D12] mb-1.5">
                Mobile Number <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={formData.mobileNumber || ''}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white font-mono"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Used for therapist app OTP login</p>
            </div>

            {/* Field 4: Email (Optional) */}
            <div>
              <label className="block font-semibold text-[#0D0D12] mb-1.5">
                Email Address <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="therapist@example.com (optional)"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Optional contact email</p>
            </div>

            {/* Field 5: Gender */}
            <div>
              <label className="block font-semibold text-[#0D0D12] mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.gender || 'FEMALE'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white cursor-pointer"
              >
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="OTHER">Other</option>
              </select>
              <p className="text-[10px] text-gray-500 mt-1">Primary gender classification</p>
            </div>

            {/* Field 6: Date of Birth */}
            <div>
              <label className="block font-semibold text-[#0D0D12] mb-1.5">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  max={maxDobDate}
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Must be at least 18 years of age</p>
            </div>

            {/* Field 7: Experience in Years */}
            <div>
              <label className="block font-semibold text-[#0D0D12] mb-1.5">
                Experience in Years <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Award className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  max="50"
                  required
                  value={formData.experienceYears ?? 1}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  placeholder="e.g. 3"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Total professional spa/therapy experience</p>
            </div>

            {/* Field 8: Languages Spoken (ISO-639-1) */}
            <div className="sm:col-span-2 md:col-span-3 pt-1">
              <LanguageSelect
                value={formData.languages || ['Hindi', 'English']}
                onChange={(selectedLanguages) =>
                  setFormData({
                    ...formData,
                    languages: selectedLanguages,
                  })
                }
              />
            </div>

          </div>
        </div>

        {/* SECTION 2: Location, Google Maps Coverage, Service Radius & Excluded Work Areas */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-[#0D0D12] text-sm">
                  Operating Location, Service Radius & Excluded Work Areas
                </h4>
                <p className="text-[11px] text-[#757880]">
                  Select base location on Google Maps, set coverage radius (KM), and search areas on Google Places to mark as 🔴 Red Excluded Zones
                </p>
              </div>
            </div>

            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              Google Maps Verified
            </span>
          </div>

          {/* Google Location Picker: Base Location, KM Slider, and Google Places Red Zone Exclusions with Red Circles on Map */}
          <GoogleLocationPicker
            value={formData}
            onChange={(updatedLocation) =>
              setFormData((prev) => ({
                ...prev,
                ...updatedLocation,
                location: updatedLocation.formattedAddress || updatedLocation.area || prev.location,
                excludedLocations: updatedLocation.excludedLocations || prev.excludedLocations || [],
              }))
            }
          />
        </div>

        {/* SECTION 3: Photos & Verification Documents */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-[#0D0D12] text-sm">
                  Profile Photos & Government Verification Documents
                </h4>
                <p className="text-[11px] text-[#757880]">Internal security photo, public app photo, police clearance & government IDs</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">

            {/* Photo 1: Internal Profile Photo (Company Internal Only) */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#0D0D12] text-xs">Profile Photo</span>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md">Internal Only</span>
                    <div className="relative group/info cursor-help inline-flex items-center">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700 transition" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/info:block w-60 p-2.5 bg-gray-900 text-white text-[11px] leading-tight rounded-xl shadow-xl z-30 pointer-events-none">
                        <div className="font-bold text-rose-300 mb-0.5">TherapyShala Internal Record</div>
                        This photo is kept strictly with TherapyShala company for official verification and will NOT be shared on the customer app.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Official internal photograph for TherapyShala records only.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {(formData.companyPhotoUrl || formData.internalProfilePhoto) ? (
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-rose-200 shadow-xs shrink-0">
                    <img
                      src={formData.companyPhotoUrl || formData.internalProfilePhoto}
                      alt="Internal Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gray-200/80 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0 text-xl">
                    👤
                  </div>
                )}

                <div className="flex-1">
                  <label className="px-3.5 py-2.5 bg-white border border-gray-300 hover:border-gray-400 rounded-xl font-bold text-xs hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs w-full transition">
                    {uploadingField === 'internalProfilePhoto' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F35271]" />
                    ) : (
                      <UploadCloud className="w-3.5 h-3.5 text-gray-600" />
                    )}
                    <span>{(formData.companyPhotoUrl || formData.internalProfilePhoto) ? 'Change Photo' : 'Upload Company Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'internalProfilePhoto', 'AVATAR')}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Photo 2: App Profile Photo (Compulsory - Customer Facing) */}
            <div className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/30 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#0D0D12] text-xs">App Profile Photo</span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200">
                      * Compulsory (App)
                    </span>
                    <div className="relative group/info cursor-help inline-flex items-center">
                      <Info className="w-3.5 h-3.5 text-rose-500 hover:text-rose-600 transition" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/info:block w-64 p-2.5 bg-gray-900 text-white text-[11px] leading-tight rounded-xl shadow-xl z-30 pointer-events-none">
                        <div className="font-bold text-rose-300 mb-0.5">Public Customer App Photo</div>
                        This photo will be displayed publicly to customers on the TherapyShala mobile app. Uploading this image is compulsory.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-rose-900/80 leading-relaxed">
                  Customer-facing headshot shown when users browse and book therapists.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {(formData.appPhotoUrl || formData.appProfilePhoto) ? (
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-rose-400 shadow-xs shrink-0 ring-2 ring-rose-200">
                    <img
                      src={formData.appPhotoUrl || formData.appProfilePhoto}
                      alt="App Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-rose-100/60 border border-dashed border-rose-300 flex items-center justify-center text-rose-400 shrink-0 text-xl font-bold">
                    📸
                  </div>
                )}

                <div className="flex-1">
                  <label className="px-3.5 py-2.5 bg-[#F35271] hover:bg-[#E04362] text-white rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-xs w-full transition">
                    {uploadingField === 'appProfilePhoto' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UploadCloud className="w-3.5 h-3.5" />
                    )}
                    <span>{(formData.appPhotoUrl || formData.appProfilePhoto) ? 'Change App Photo ✓' : 'Upload App Photo *'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'appProfilePhoto', 'AVATAR')}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <TherapistGalleryField
                images={formData.gallery || []}
                onUpload={handleGalleryUpload}
                onRemove={(index) => setFormData((prev) => ({
                  ...prev,
                  gallery: (prev.gallery || []).filter((_, imageIndex) => imageIndex !== index),
                }))}
                uploading={uploadingField === 'gallery'}
              />
            </div>

            {/* Doc 1: Police Clearance (Optional) */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#0D0D12] text-xs">
                    Police Clearance Certificate <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] text-gray-500 bg-gray-200/80 px-2 py-0.5 rounded-md">Optional</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Background verification check or police clearance document (PDF / JPG).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="px-3.5 py-2.5 bg-white border border-gray-300 hover:border-gray-400 rounded-xl font-bold text-xs hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs w-full transition">
                  {uploadingField === 'policeClearance' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F35271]" />
                  ) : (
                    <FileCheck2 className="w-3.5 h-3.5 text-gray-600" />
                  )}
                  <span>{(formData.policeVerificationUrl || formData.policeClearance) ? 'Police Clearance Attached ✓' : 'Upload Police Clearance'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'policeClearance', 'SUPPORT_ATTACHMENT')}
                  />
                </label>
              </div>
            </div>

            {/* Doc 2: Government ID (Front) */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#0D0D12] text-xs">
                    Government ID (Front) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                    KYC Required
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Front side of Aadhaar, PAN or Passport showing full photo & ID number.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="px-3.5 py-2.5 bg-white border border-gray-300 hover:border-gray-400 rounded-xl font-bold text-xs hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs w-full transition">
                  {uploadingField === 'govtIdFront' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F35271]" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5 text-gray-600" />
                  )}
                  <span>{(formData.governmentIdFrontUrl || formData.govtIdFront) ? 'Government ID Front Attached ✓' : 'Upload ID Front'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'govtIdFront', 'KYC_FRONT')}
                  />
                </label>
              </div>
            </div>

            {/* Doc 3: Government ID (Back) */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70 flex flex-col justify-between space-y-4 sm:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#0D0D12] text-xs">
                    Government ID (Back) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                    KYC Required
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Back side of Aadhaar or Government ID with official residential address details.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="px-3.5 py-2.5 bg-white border border-gray-300 hover:border-gray-400 rounded-xl font-bold text-xs hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs w-full transition">
                  {uploadingField === 'govtIdBack' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F35271]" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5 text-gray-600" />
                  )}
                  <span>{(formData.governmentIdBackUrl || formData.govtIdBack) ? 'Government ID Back Attached ✓' : 'Upload ID Back'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'govtIdBack', 'KYC_BACK')}
                  />
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 4: Assign Therapist Services (Powered by api/v1/categories) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#0D0D12] text-sm">
                    Assign Therapist Services
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>{categories.length} Categories Available</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#757880]">
                  Select from official therapy categories (fetched via <code className="font-mono text-[#F35271]">/api/v1/categories</code>) and configure durations & rates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddService()}
                className="px-3.5 py-2 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Another Service</span>
              </button>
            </div>
          </div>

          {/* Quick Category Add Pills */}
          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800 text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F35271]" />
                <span>Quick Add from Therapy Categories:</span>
              </span>
              {categoriesLoading && (
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-[#F35271]" />
                  <span>Syncing categories...</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isAssigned = (formData.services || []).some((s) => s.name === cat.name);
                return (
                  <button
                    key={cat.id || cat.slug}
                    type="button"
                    disabled={isAssigned}
                    onClick={() => handleAddService(cat.name)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center gap-1 border ${isAssigned
                      ? 'bg-rose-50 border-rose-200 text-[#F35271] cursor-default opacity-80'
                      : 'bg-white hover:bg-rose-50 border-gray-200 hover:border-rose-200 text-gray-700 hover:text-[#F35271] shadow-2xs'
                      }`}
                    title={isAssigned ? 'Already assigned' : `Add ${cat.name}`}
                  >
                    {cat.iconUrl ? (
                      <img src={cat.iconUrl} alt={cat.name} className="w-3.5 h-3.5 object-contain" />
                    ) : (
                      <span className="text-[10px]">✨</span>
                    )}
                    <span>{cat.name}</span>
                    {isAssigned ? (
                      <CheckCircle2 className="w-3 h-3 text-[#F35271]" />
                    ) : (
                      <Plus className="w-3 h-3 text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services Configuration Table / Cards */}
          <div className="space-y-3">
            {(formData.services || []).map((srv, srvIdx) => (
              <div
                key={srvIdx}
                className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 items-end shadow-2xs"
              >
                {/* Category / Service Selector */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-[#0D0D12] mb-1">
                    Therapy Category *
                  </label>
                  <select
                    value={srv.name || ''}
                    onChange={(e) => {
                      const selectedCat = categories.find((c) => c.name === e.target.value);
                      const next = [...(formData.services || [])];
                      next[srvIdx].name = e.target.value;
                      if (selectedCat) {
                        next[srvIdx].categoryId = selectedCat.id;
                      }
                      setFormData({ ...formData, services: next });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white text-xs cursor-pointer shadow-2xs"
                  >
                    <option value="">Select Therapy Category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id || cat.slug} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block font-semibold text-[#0D0D12] mb-1">Duration (Mins) *</label>
                  <input
                    type="number"
                    required
                    min="15"
                    step="15"
                    value={srv.durationMinutes ?? 60}
                    onChange={(e) => {
                      const next = [...(formData.services || [])];
                      next[srvIdx].durationMinutes = Number(e.target.value);
                      setFormData({ ...formData, services: next });
                    }}
                    placeholder="60"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white text-center font-mono text-xs shadow-2xs"
                  />
                </div>

                {/* Discount Price */}
                <div>
                  <label className="block font-semibold text-[#0D0D12] mb-1">Discount Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={srv.discountPrice ?? 999}
                    onChange={(e) => {
                      const next = [...(formData.services || [])];
                      next[srvIdx].discountPrice = Number(e.target.value);
                      setFormData({ ...formData, services: next });
                    }}
                    placeholder="999"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-bold text-rose-600 bg-white text-center font-mono text-xs shadow-2xs"
                  />
                </div>

                {/* Base Price */}
                <div>
                  <label className="block font-semibold text-[#0D0D12] mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={srv.basePrice ?? 1200}
                    onChange={(e) => {
                      const next = [...(formData.services || [])];
                      next[srvIdx].basePrice = Number(e.target.value);
                      setFormData({ ...formData, services: next });
                    }}
                    placeholder="1200"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium text-gray-500 bg-white text-center font-mono text-xs shadow-2xs"
                  />
                </div>

                {/* Delete button */}
                <div className="flex items-center justify-end pb-0.5">
                  {(formData.services || []).length > 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        const next = formData.services.filter((_, idx) => idx !== srvIdx);
                        setFormData({ ...formData, services: next });
                      }}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer w-full flex items-center justify-center gap-1 font-semibold text-xs"
                      title="Remove service"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sm:hidden">Remove</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-400 italic text-center w-full block">Primary</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Submit Bar */}
        <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs transition cursor-pointer"
          >
            Cancel & Return to Fleet
          </button>

          <button
            type="submit"
            disabled={onboardLoading}
            className="px-8 py-3 rounded-2xl bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {onboardLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Onboarding Therapist...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Onboard Therapist</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
