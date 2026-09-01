import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  BUSINESS_TYPES, 
  REGISTRATION_CONSTITUTIONS, 
  BRANCH_STATUSES, 
  USER_ROLES, 
  DAYS_OF_WEEK, 
  createDefaultOperatingHours, 
  createBranchEntity, 
  createOrganizationEntity 
} from '../../models/business.model';
import { 
  validateOnboardingStep, 
  validateGSTIN, 
  validatePAN, 
  validateIFSC, 
  validateAadhaar, 
  validatePhone, 
  validateEmail, 
  validatePincode, 
  validateCoordinates 
} from '../../utils/businessValidators';
import { 
  businessService, 
  detectBankFromIFSC, 
  getBrowserGeolocation, 
  sendOwnerMobileOTP, 
  verifyOwnerMobileOTP, 
  sendPasswordlessMagicLink 
} from '../../services/business.service';
import { saveRegisteredBusiness } from '../../data/spaData';

import { 
  Building2, UserCheck, MapPin, FileSpreadsheet, GitBranch, 
  Clock, Landmark, Eye, CheckCircle2, ShieldCheck, Sparkles, 
  ArrowRight, ArrowLeft, Plus, Trash2, Edit3, Upload, Image as ImageIcon, 
  Phone, Mail, Globe, LocateFixed, AlertCircle, Check, KeyRound, 
  FileText, Store, ChevronDown, CheckCircle, Smartphone, ExternalLink,
  Layers, Lock, RefreshCw, X, ShieldAlert, SlidersHorizontal
} from 'lucide-react';

const ONBOARDING_STEPS = [
  { step: 1, title: "Basic Info", icon: Building2, desc: "Name, type & gallery" },
  { step: 2, title: "Owner / Admin", icon: UserCheck, desc: "Contact & OTP login" },
  { step: 3, title: "Address & GPS", icon: MapPin, desc: "Location & coordinates" },
  { step: 4, title: "Legal & GST", icon: FileSpreadsheet, desc: "GSTIN, PAN & constitution" },
  { step: 5, title: "Branch Setup", icon: GitBranch, desc: "Single/multi branch management" },
  { step: 6, title: "Operating Hours", icon: Clock, desc: "7-day business timings" },
  { step: 7, title: "Bank & KYC", icon: Landmark, desc: "Payout & compliance docs" },
  { step: 8, title: "Review & Activate", icon: Eye, desc: "Preview & go live" }
];

const CURATED_GALLERY_SAMPLES = [
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
];

export default function ListYourBusinessPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState('');
  const [stepErrors, setStepErrors] = useState({});

  // 1. Master Organization & Business State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    type: 'Spa & Salon',
    typeId: 'spa_salon',
    tagline: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    logo: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      CURATED_GALLERY_SAMPLES[0],
      CURATED_GALLERY_SAMPLES[1],
      CURATED_GALLERY_SAMPLES[2]
    ],

    // Step 2: Owner / Admin
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    isOtpVerified: false,
    otpCode: '',
    isPasswordlessEnabled: true,

    // Step 3: Business Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    latitude: 26.9124,
    longitude: 75.7873,

    // Step 4: Legal & GST
    isGstRegistered: true,
    gstin: '',
    legalBusinessName: '',
    panNumber: '',
    constitution: 'Private Limited Company',

    // Step 5: Branch Management
    isMultiBranch: false,
    branches: [
      {
        id: `branch-main-${Date.now()}`,
        name: 'Main Flagship Branch',
        isMain: true,
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        latitude: 26.9124,
        longitude: 75.7873,
        roomCapacity: 6,
        chairCapacity: 8,
        branchGSTIN: '',
        status: 'active',
        operatingHours: createDefaultOperatingHours()
      }
    ],

    // Step 6: Operating Hours
    operatingHours: createDefaultOperatingHours(),

    // Step 7: Bank & KYC
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: '',
    aadhaarNumber: '',
    aadhaarFrontDoc: 'Aadhaar_Front_Verified.pdf',
    aadhaarBackDoc: 'Aadhaar_Back_Verified.pdf',
    panCardDoc: 'PAN_Business_Card.pdf',
    businessProofDoc: 'GST_Registration_Certificate.pdf',
    cancelledChequeDoc: 'Bank_Cancelled_Cheque.pdf',
    termsAccepted: true
  });

  // OTP Verification Widget State
  const [otpState, setOtpState] = useState({
    sent: false,
    countdown: 0,
    loading: false,
    error: '',
    successMsg: ''
  });

  // GPS Picker State
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccessMsg, setGpsSuccessMsg] = useState('');

  // Branch Modal State
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [editingBranchIndex, setEditingBranchIndex] = useState(null);
  const [tempBranch, setTempBranch] = useState(createBranchEntity({ isMain: false }));

  // Gallery URL Input
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // OTP Countdown Timer
  useEffect(() => {
    let timer;
    if (otpState.countdown > 0) {
      timer = setInterval(() => {
        setOtpState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpState.countdown]);

  // Handle Form Change
  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-detect Bank Name when IFSC is typed
      if (field === 'ifscCode' && value && value.length >= 4) {
        const detected = detectBankFromIFSC(value);
        if (detected) updated.bankName = detected;
      }

      // Auto-sync owner details if blank
      if (field === 'phone' && !prev.ownerPhone) updated.ownerPhone = value;
      if (field === 'email' && !prev.ownerEmail) updated.ownerEmail = value;
      if (field === 'name' && !prev.legalBusinessName) updated.legalBusinessName = value;
      if (field === 'ownerName' && !prev.accountHolderName) updated.accountHolderName = value;

      return updated;
    });

    // Clear step error for field
    if (stepErrors[field]) {
      setStepErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Trigger Geolocation GPS coordinate grabber
  const handleFetchCurrentGPS = async () => {
    setGpsLoading(true);
    setGpsSuccessMsg('');
    try {
      const coords = await getBrowserGeolocation();
      setFormData(prev => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude
      }));
      setGpsSuccessMsg(`GPS Acquired: ${coords.latitude}, ${coords.longitude} (Accuracy ~${Math.round(coords.accuracy)}m)`);
      setTimeout(() => setGpsSuccessMsg(''), 4000);
    } catch (err) {
      alert(`Could not fetch current GPS location: ${err.message}. Default coordinates set.`);
    } finally {
      setGpsLoading(false);
    }
  };

  // Trigger OTP Send
  const handleSendOTP = async () => {
    const mobile = formData.ownerPhone || formData.phone;
    if (!validatePhone(mobile)) {
      setStepErrors(prev => ({ ...prev, ownerPhone: 'Please enter a valid 10-digit mobile number' }));
      return;
    }

    setOtpState(prev => ({ ...prev, loading: true, error: '', successMsg: '' }));
    try {
      const res = await sendOwnerMobileOTP(mobile);
      setOtpState({
        sent: true,
        countdown: 60,
        loading: false,
        error: '',
        successMsg: `${res.message} (Demo code: ${res.testOtp || '5829'})`
      });
    } catch (err) {
      setOtpState(prev => ({ ...prev, loading: false, error: err.message || 'Failed to dispatch OTP' }));
    }
  };

  // Trigger OTP Verify
  const handleVerifyOTP = async () => {
    const mobile = formData.ownerPhone || formData.phone;
    if (!formData.otpCode || formData.otpCode.length < 4) {
      setOtpState(prev => ({ ...prev, error: 'Please enter the 4-digit code (Use: 5829)' }));
      return;
    }

    setOtpState(prev => ({ ...prev, loading: true, error: '' }));
    try {
      await verifyOwnerMobileOTP(mobile, formData.otpCode);
      setFormData(prev => ({ ...prev, isOtpVerified: true }));
      setOtpState(prev => ({ ...prev, loading: false, successMsg: 'Mobile verified successfully!' }));
    } catch (err) {
      setOtpState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  // Gallery Management
  const handleAddGalleryPhoto = (url) => {
    if (!url) return;
    if (formData.gallery.length >= 5) {
      alert('Maximum 5 gallery photos allowed.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, url]
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryPhoto = (index) => {
    if (formData.gallery.length <= 3) {
      alert('Minimum 3 gallery photos required for public profile listing.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  // Operating Hours bulk apply
  const handleApplyHoursToAll = (sourceIndex) => {
    const source = formData.operatingHours[sourceIndex];
    const updated = formData.operatingHours.map(item => ({
      ...item,
      isOpen: source.isOpen,
      openingTime: source.openingTime,
      closingTime: source.closingTime
    }));
    setFormData(prev => ({ ...prev, operatingHours: updated }));
  };

  // Branch CRUD
  const handleSaveBranch = () => {
    if (!tempBranch.name || !tempBranch.city) {
      alert('Branch Name and City are required');
      return;
    }
    if (editingBranchIndex !== null) {
      const updated = [...formData.branches];
      updated[editingBranchIndex] = tempBranch;
      setFormData(prev => ({ ...prev, branches: updated }));
    } else {
      setFormData(prev => ({
        ...prev,
        branches: [...prev.branches, { ...tempBranch, id: `branch-${Date.now()}` }]
      }));
    }
    setBranchModalOpen(false);
    setEditingBranchIndex(null);
  };

  const handleRemoveBranch = (index) => {
    if (formData.branches.length <= 1) {
      alert('At least one primary branch is required.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.filter((_, i) => i !== index)
    }));
  };

  // Step Navigation & Validation
  const handleNextStep = () => {
    // If not final step, validate current step
    if (currentStep < 8) {
      const validation = validateOnboardingStep(currentStep, formData);
      if (!validation.isValid) {
        setStepErrors(validation.errors);
        window.scrollTo({ top: 200, behavior: 'smooth' });
        return;
      }
    }
    setStepErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 8));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStepErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Final Submit & Organization Entity Activation
  const handleFinalSubmit = () => {
    const generated = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `business-${Date.now()}`;
    const slug = `${generated}-${formData.city ? formData.city.toLowerCase() : 'sanctuary'}`;

    const organizationEntity = createOrganizationEntity({
      ...formData,
      slug,
      owner: {
        fullName: formData.ownerName,
        mobile: formData.ownerPhone || formData.phone,
        email: formData.ownerEmail || formData.email,
        isOtpVerified: formData.isOtpVerified,
        isPasswordlessEnabled: formData.isPasswordlessEnabled
      },
      address: {
        line1: formData.addressLine1,
        line2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        latitude: formData.latitude,
        longitude: formData.longitude
      },
      legal: {
        isGstRegistered: formData.isGstRegistered,
        gstin: formData.gstin,
        legalBusinessName: formData.legalBusinessName,
        panNumber: formData.panNumber,
        constitution: formData.constitution,
        verified: true
      },
      kyc: {
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        bankName: formData.bankName,
        upiId: formData.upiId,
        aadhaarNumber: formData.aadhaarNumber,
        verificationStatus: 'Verified'
      },
      branches: formData.branches.map(b => ({
        ...b,
        phone: b.phone || formData.phone,
        email: b.email || formData.email,
        address: b.address || formData.addressLine1,
        city: b.city || formData.city,
        state: b.state || formData.state,
        pincode: b.pincode || formData.pincode
      }))
    });

    // Save to persistence layer
    saveRegisteredBusiness(organizationEntity);
    businessService.saveBusinessToStorage(organizationEntity);

    setGeneratedSlug(slug);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12]">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-28 pb-12 bg-gradient-to-b from-[#FFEEF1] via-[#FFF5F7] to-white border-b border-[#AFB0B7]/20">
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F35271]/10 text-[#F35271] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            SpaMate Multi-Business Engine
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-normal text-[#0D0D12] max-w-4xl mx-auto">
            List & Expand Your <span className="text-[#F35271] italic">Spa or Salon</span> on TherapyShala
          </h1>
          <p className="text-[#757880] text-sm md:text-base max-w-2xl mx-auto mt-3">
            Register your single salon or multi-branch wellness franchise with verified GST compliance, instant OTP verification, branch capacity controls, and direct customer bookings.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-10 md:py-14">
        
        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Step Navigation Sidebar */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#AFB0B7]/25 shadow-sm sticky top-28 space-y-2">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#AFB0B7]/15">
                <div>
                  <h3 className="font-serif-luxury text-lg font-semibold text-[#0D0D12]">Registration Steps</h3>
                  <p className="text-xs text-[#757880]">Complete all 7 compliance sections</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F35271]/10 text-[#F35271] text-xs font-bold">
                  Step {currentStep} of 8
                </span>
              </div>

              <div className="space-y-1.5">
                {ONBOARDING_STEPS.map((s) => {
                  const Icon = s.icon;
                  const isCurrent = currentStep === s.step;
                  const isPast = currentStep > s.step;

                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => {
                        // Allow jumping to past or adjacent steps
                        if (isPast || s.step === currentStep + 1) {
                          setCurrentStep(s.step);
                        }
                      }}
                      className={`w-full flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all ${
                        isCurrent
                          ? 'bg-[#F35271] text-white shadow-md shadow-[#F35271]/20 font-medium'
                          : isPast
                          ? 'bg-[#FFEEF1]/60 text-[#0D0D12] hover:bg-[#FFEEF1]'
                          : 'text-[#757880] hover:bg-neutral-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? 'bg-white text-[#F35271]'
                          : isPast
                          ? 'bg-[#168821] text-white'
                          : 'bg-neutral-100 text-[#757880]'
                      }`}>
                        {isPast ? <Check className="w-4 h-4" /> : s.step}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{s.title}</div>
                        <div className={`text-[11px] truncate ${isCurrent ? 'text-white/80' : 'text-[#757880]'}`}>
                          {s.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 mt-4 border-t border-[#AFB0B7]/15 text-xs text-[#757880] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#168821]" />
                <span>Encrypted 256-Bit Business Onboarding</span>
              </div>
            </div>

            {/* Step Content Card */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-[#AFB0B7]/25 shadow-sm">
              
              {/* STEP 1: BUSINESS BASIC INFORMATION */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#AFB0B7]/20 pb-4">
                    <h2 className="font-serif-luxury text-2xl font-semibold text-[#0D0D12]">
                      1. Business Basic Information
                    </h2>
                    <p className="text-xs md:text-sm text-[#757880] mt-1">
                      Provide your public-facing salon or wellness brand credentials and image gallery.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Business Name <span className="text-[#F35271]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Aura Luxe Wellness Sanctuary"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                          stepErrors.name ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.name && <p className="text-xs text-[#F35271] mt-1">{stepErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Business Type <span className="text-[#F35271]">*</span>
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => {
                          const found = BUSINESS_TYPES.find(b => b.name === e.target.value);
                          handleChange('type', e.target.value);
                          if (found) handleChange('typeId', found.id);
                        }}
                        className="w-full px-4 py-3 rounded-2xl border border-[#AFB0B7]/40 text-sm outline-none focus:border-[#F35271] bg-white cursor-pointer"
                      >
                        {BUSINESS_TYPES.filter(b => b.id !== 'all').map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Tagline / Catchphrase
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Luxury Day Spa & Hydrotherapy Suites"
                        value={formData.tagline}
                        onChange={(e) => handleChange('tagline', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-[#AFB0B7]/40 text-sm outline-none focus:border-[#F35271]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Business Description / Bio <span className="text-[#F35271]">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe your spa/salon atmosphere, signature rituals, certifications, and customer experience..."
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                          stepErrors.description ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.description && <p className="text-xs text-[#F35271] mt-1">{stepErrors.description}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Business Phone <span className="text-[#F35271]">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#757880] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          placeholder="e.g. 9876599881"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                            stepErrors.phone ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                          }`}
                        />
                      </div>
                      {stepErrors.phone && <p className="text-xs text-[#F35271] mt-1">{stepErrors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Business Email <span className="text-[#F35271]">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#757880] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="concierge@yourbusiness.com"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                            stepErrors.email ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                          }`}
                        />
                      </div>
                      {stepErrors.email && <p className="text-xs text-[#F35271] mt-1">{stepErrors.email}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Website URL
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-[#757880] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          placeholder="https://yourbrand.com"
                          value={formData.website}
                          onChange={(e) => handleChange('website', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#AFB0B7]/40 text-sm outline-none focus:border-[#F35271]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Gallery (Min 3, Max 5 Photos) */}
                  <div className="pt-4 border-t border-[#AFB0B7]/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12]">
                          Business Gallery (Minimum 3, Maximum 5 Photos) <span className="text-[#F35271]">*</span>
                        </label>
                        <p className="text-xs text-[#757880]">
                          High quality photos of your interior, treatment rooms, and reception.
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        formData.gallery.length >= 3 && formData.gallery.length <= 5
                          ? 'bg-[#168821]/15 text-[#168821]'
                          : 'bg-[#F35271]/15 text-[#F35271]'
                      }`}>
                        {formData.gallery.length} / 5 Photos
                      </span>
                    </div>

                    {stepErrors.gallery && <p className="text-xs text-[#F35271]">{stepErrors.gallery}</p>}

                    {/* Gallery Preview Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {formData.gallery.map((img, idx) => (
                        <div key={idx} className="relative rounded-2xl overflow-hidden aspect-square border border-[#AFB0B7]/30 group">
                          <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryPhoto(idx)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#F35271] transition-colors"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-1.5 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded font-mono">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Add Photo Input / Sample Picker */}
                    {formData.gallery.length < 5 && (
                      <div className="flex gap-2 items-center pt-2">
                        <input
                          type="url"
                          placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                          value={newGalleryUrl}
                          onChange={(e) => setNewGalleryUrl(e.target.value)}
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs outline-none focus:border-[#F35271]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddGalleryPhoto(newGalleryUrl)}
                          className="px-4 py-2.5 rounded-xl bg-[#F35271] text-white text-xs font-bold hover:bg-[#E04362] transition-colors"
                        >
                          Add Photo
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: OWNER / ADMIN */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#AFB0B7]/20 pb-4">
                    <h2 className="font-serif-luxury text-2xl font-semibold text-[#0D0D12]">
                      2. Owner / Admin Credentials
                    </h2>
                    <p className="text-xs md:text-sm text-[#757880] mt-1">
                      Identity & mobile OTP verification for the master business administrator.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Owner / Admin Full Name <span className="text-[#F35271]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Devika Singhania"
                        value={formData.ownerName}
                        onChange={(e) => handleChange('ownerName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                          stepErrors.ownerName ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.ownerName && <p className="text-xs text-[#F35271] mt-1">{stepErrors.ownerName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Admin Mobile Number <span className="text-[#F35271]">*</span>
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-[#757880] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          placeholder="e.g. 9876599881"
                          value={formData.ownerPhone}
                          onChange={(e) => handleChange('ownerPhone', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                            stepErrors.ownerPhone ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                          }`}
                        />
                      </div>
                      {stepErrors.ownerPhone && <p className="text-xs text-[#F35271] mt-1">{stepErrors.ownerPhone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Admin Email <span className="text-[#F35271]">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#757880] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="owner@yourbrand.com"
                          value={formData.ownerEmail}
                          onChange={(e) => handleChange('ownerEmail', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                            stepErrors.ownerEmail ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                          }`}
                        />
                      </div>
                      {stepErrors.ownerEmail && <p className="text-xs text-[#F35271] mt-1">{stepErrors.ownerEmail}</p>}
                    </div>
                  </div>

                  {/* Interactive Mobile OTP Verification */}
                  <div className="p-5 rounded-3xl bg-[#FFEEF1]/40 border border-[#F35271]/30 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-[#F35271]" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D12]">
                          Mobile OTP Verification
                        </h4>
                      </div>

                      {formData.isOtpVerified ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#168821] text-white text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mobile Verified
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={otpState.loading || otpState.countdown > 0}
                          className="px-3.5 py-1.5 rounded-full bg-[#F35271] text-white text-xs font-bold hover:bg-[#E04362] transition-colors disabled:opacity-50"
                        >
                          {otpState.loading ? 'Sending...' : otpState.countdown > 0 ? `Resend in ${otpState.countdown}s` : 'Send OTP'}
                        </button>
                      )}
                    </div>

                    {!formData.isOtpVerified && (
                      <div className="space-y-2 pt-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter 4-digit code (Demo: 5829)"
                            value={formData.otpCode}
                            onChange={(e) => handleChange('otpCode', e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-sm outline-none focus:border-[#F35271]"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOTP}
                            disabled={otpState.loading || !formData.otpCode}
                            className="px-5 py-2.5 rounded-xl bg-[#0D0D12] text-white text-xs font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50"
                          >
                            Verify
                          </button>
                        </div>

                        {otpState.successMsg && (
                          <p className="text-xs text-[#168821] font-medium flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> {otpState.successMsg}
                          </p>
                        )}
                        {otpState.error && (
                          <p className="text-xs text-[#F35271] flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {otpState.error}
                          </p>
                        )}
                      </div>
                    )}
                    {stepErrors.isOtpVerified && (
                      <p className="text-xs text-[#F35271]">{stepErrors.isOtpVerified}</p>
                    )}
                  </div>

                  {/* Passwordless Login Option */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-[#AFB0B7]/25">
                    <div>
                      <div className="text-xs font-bold text-[#0D0D12]">Enable Passwordless Magic Link Login</div>
                      <div className="text-[11px] text-[#757880]">Sign in securely via instant one-click login links sent to your email</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPasswordlessEnabled}
                        onChange={(e) => handleChange('isPasswordlessEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F35271]"></div>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: BUSINESS ADDRESS & GPS */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#AFB0B7]/20 pb-4">
                    <h2 className="font-serif-luxury text-2xl font-semibold text-[#0D0D12]">
                      3. Primary Business Address & GPS
                    </h2>
                    <p className="text-xs md:text-sm text-[#757880] mt-1">
                      Accurate street address and GPS location coordinates for Google Maps routing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Address Line 1 <span className="text-[#F35271]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Plot No, Building Name, Street / Road"
                        value={formData.addressLine1}
                        onChange={(e) => handleChange('addressLine1', e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                          stepErrors.addressLine1 ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.addressLine1 && <p className="text-xs text-[#F35271] mt-1">{stepErrors.addressLine1}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Address Line 2 / Landmark
                      </label>
                      <input
                        type="text"
                        placeholder="Near Metro Station, Opposite Park, Floor No."
                        value={formData.addressLine2}
                        onChange={(e) => handleChange('addressLine2', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-[#AFB0B7]/40 text-sm outline-none focus:border-[#F35271]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        City <span className="text-[#F35271]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jaipur"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                          stepErrors.city ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.city && <p className="text-xs text-[#F35271] mt-1">{stepErrors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        State <span className="text-[#F35271]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rajasthan"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                          stepErrors.state ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.state && <p className="text-xs text-[#F35271] mt-1">{stepErrors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formData.country}
                        className="w-full px-4 py-3 rounded-2xl border border-[#AFB0B7]/30 bg-neutral-100 text-sm text-[#757880]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        PIN Code <span className="text-[#F35271]">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 302015"
                        value={formData.pincode}
                        onChange={(e) => handleChange('pincode', e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                          stepErrors.pincode ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.pincode && <p className="text-xs text-[#F35271] mt-1">{stepErrors.pincode}</p>}
                    </div>
                  </div>

                  {/* GPS Coordinates & Current Location Grabber */}
                  <div className="p-5 rounded-3xl bg-neutral-50 border border-[#AFB0B7]/25 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D12]">
                          GPS Coordinates & Map Picker
                        </h4>
                        <p className="text-[11px] text-[#757880]">
                          Used for driving directions and geo-radius proximity search for customers.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleFetchCurrentGPS}
                        disabled={gpsLoading}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D0D12] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
                      >
                        <LocateFixed className="w-3.5 h-3.5 text-[#F35271]" />
                        {gpsLoading ? 'Locating...' : 'Use Current GPS'}
                      </button>
                    </div>

                    {gpsSuccessMsg && (
                      <p className="text-xs text-[#168821] font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> {gpsSuccessMsg}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#757880] uppercase mb-1">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={formData.latitude}
                          onChange={(e) => handleChange('latitude', parseFloat(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs font-mono outline-none focus:border-[#F35271]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#757880] uppercase mb-1">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={formData.longitude}
                          onChange={(e) => handleChange('longitude', parseFloat(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs font-mono outline-none focus:border-[#F35271]"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: LEGAL & GST */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#AFB0B7]/20 pb-4">
                    <h2 className="font-serif-luxury text-2xl font-semibold text-[#0D0D12]">
                      4. Legal & GST Compliance
                    </h2>
                    <p className="text-xs md:text-sm text-[#757880] mt-1">
                      Tax compliance, entity constitution, and verified Indian Business PAN & GSTIN.
                    </p>
                  </div>

                  {/* GST Registered Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFEEF1]/50 border border-[#F35271]/25">
                    <div>
                      <div className="text-xs font-bold text-[#0D0D12]">GST Registered Business?</div>
                      <div className="text-[11px] text-[#757880]">Select Yes if your business holds a valid 15-digit GSTIN</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleChange('isGstRegistered', true)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                          formData.isGstRegistered ? 'bg-[#F35271] text-white shadow-sm' : 'bg-white border text-[#0D0D12]'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange('isGstRegistered', false)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                          !formData.isGstRegistered ? 'bg-[#0D0D12] text-white shadow-sm' : 'bg-white border text-[#0D0D12]'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.isGstRegistered && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                          GSTIN (15 Digits) <span className="text-[#F35271]">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={15}
                          placeholder="e.g. 08AAAAA0000A1Z5"
                          value={formData.gstin}
                          onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                          className={`w-full px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all uppercase ${
                            stepErrors.gstin ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                          }`}
                        />
                        {stepErrors.gstin && <p className="text-xs text-[#F35271] mt-1">{stepErrors.gstin}</p>}
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Legal Business Name (As on PAN/GST) <span className="text-[#F35271]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Aura Luxe Wellness Private Limited"
                        value={formData.legalBusinessName}
                        onChange={(e) => handleChange('legalBusinessName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                          stepErrors.legalBusinessName ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.legalBusinessName && <p className="text-xs text-[#F35271] mt-1">{stepErrors.legalBusinessName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Business PAN (10 Chars) <span className="text-[#F35271]">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="e.g. AABCA1234F"
                        value={formData.panNumber}
                        onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all uppercase ${
                          stepErrors.panNumber ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.panNumber && <p className="text-xs text-[#F35271] mt-1">{stepErrors.panNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Registration Constitution <span className="text-[#F35271]">*</span>
                      </label>
                      <select
                        value={formData.constitution}
                        onChange={(e) => handleChange('constitution', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-[#AFB0B7]/40 text-sm outline-none focus:border-[#F35271] bg-white cursor-pointer"
                      >
                        {REGISTRATION_CONSTITUTIONS.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: BRANCH MANAGEMENT */}
              {currentStep === 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#AFB0B7]/20 pb-4">
                    <h2 className="font-serif-luxury text-2xl font-semibold text-[#0D0D12]">
                      5. Branch Management
                    </h2>
                    <p className="text-xs md:text-sm text-[#757880] mt-1">
                      Configure single-store or multi-location branches, suite capacities, and branch managers.
                    </p>
                  </div>

                  {/* Single Branch vs Multi-Branch Mode */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleChange('isMultiBranch', false)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        !formData.isMultiBranch
                          ? 'border-[#F35271] bg-[#FFEEF1]/40 ring-2 ring-[#F35271]/20'
                          : 'border-[#AFB0B7]/30 hover:border-[#F35271]/40'
                      }`}
                    >
                      <Store className="w-5 h-5 text-[#F35271] mb-2" />
                      <div className="text-xs font-bold text-[#0D0D12]">Single Branch / Studio</div>
                      <div className="text-[11px] text-[#757880]">Standalone boutique or salon</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChange('isMultiBranch', true)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        formData.isMultiBranch
                          ? 'border-[#F35271] bg-[#FFEEF1]/40 ring-2 ring-[#F35271]/20'
                          : 'border-[#AFB0B7]/30 hover:border-[#F35271]/40'
                      }`}
                    >
                      <GitBranch className="w-5 h-5 text-[#F35271] mb-2" />
                      <div className="text-xs font-bold text-[#0D0D12]">Multi-Branch Franchise</div>
                      <div className="text-[11px] text-[#757880]">Multiple locations & city centers</div>
                    </button>
                  </div>

                  {/* Branch List */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D12]">
                        Configured Branches ({formData.branches.length})
                      </h4>
                      {formData.isMultiBranch && (
                        <button
                          type="button"
                          onClick={() => {
                            setTempBranch(createBranchEntity({ isMain: false, city: formData.city, state: formData.state }));
                            setEditingBranchIndex(null);
                            setBranchModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F35271] text-white text-xs font-bold hover:bg-[#E04362] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add New Branch
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {formData.branches.map((branch, idx) => (
                        <div
                          key={branch.id || idx}
                          className="p-4 rounded-2xl border border-[#AFB0B7]/30 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#0D0D12]">{branch.name}</span>
                              {branch.isMain && (
                                <span className="px-2 py-0.5 rounded-full bg-[#168821]/15 text-[#168821] text-[10px] font-bold">
                                  Flagship Main
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[#757880] text-[10px] font-bold uppercase">
                                {branch.status}
                              </span>
                            </div>
                            <div className="text-xs text-[#757880] mt-1 flex items-center gap-3 flex-wrap">
                              <span>📍 {branch.address || formData.addressLine1 || 'City Center'}, {branch.city || formData.city}</span>
                              <span>🚪 {branch.roomCapacity || 4} Rooms</span>
                              <span>💺 {branch.chairCapacity || 6} Chairs</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setTempBranch({ ...branch });
                                setEditingBranchIndex(idx);
                                setBranchModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl border border-[#AFB0B7]/40 text-xs font-semibold hover:bg-neutral-50 flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            {formData.branches.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveBranch(idx)}
                                className="p-2 rounded-xl text-neutral-400 hover:text-[#F35271] hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: OPERATING HOURS */}
              {currentStep === 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#AFB0B7]/20 pb-4">
                    <h2 className="font-serif-luxury text-2xl font-semibold text-[#0D0D12]">
                      6. Operating Hours (Monday–Sunday)
                    </h2>
                    <p className="text-xs md:text-sm text-[#757880] mt-1">
                      Set individual daily opening and closing times or bulk apply hours across the entire week.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {formData.operatingHours.map((schedule, idx) => (
                      <div
                        key={schedule.day}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          schedule.isOpen ? 'bg-white border-[#AFB0B7]/30' : 'bg-neutral-50 border-dashed border-[#AFB0B7]/30 opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-3 w-36">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={schedule.isOpen}
                              onChange={(e) => {
                                const updated = [...formData.operatingHours];
                                updated[idx].isOpen = e.target.checked;
                                setFormData(prev => ({ ...prev, operatingHours: updated }));
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#168821]"></div>
                          </label>
                          <span className="text-xs font-bold text-[#0D0D12]">{schedule.day}</span>
                        </div>

                        {schedule.isOpen ? (
                          <div className="flex items-center gap-2 flex-1 justify-start sm:justify-center">
                            <input
                              type="text"
                              value={schedule.openingTime}
                              onChange={(e) => {
                                const updated = [...formData.operatingHours];
                                updated[idx].openingTime = e.target.value;
                                setFormData(prev => ({ ...prev, operatingHours: updated }));
                              }}
                              className="w-28 px-2.5 py-1.5 rounded-xl border border-[#AFB0B7]/40 text-xs font-mono text-center outline-none focus:border-[#F35271]"
                              placeholder="09:00 AM"
                            />
                            <span className="text-xs text-[#757880]">to</span>
                            <input
                              type="text"
                              value={schedule.closingTime}
                              onChange={(e) => {
                                const updated = [...formData.operatingHours];
                                updated[idx].closingTime = e.target.value;
                                setFormData(prev => ({ ...prev, operatingHours: updated }));
                              }}
                              className="w-28 px-2.5 py-1.5 rounded-xl border border-[#AFB0B7]/40 text-xs font-mono text-center outline-none focus:border-[#F35271]"
                              placeholder="09:00 PM"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-[#F35271] font-bold px-3 py-1">Closed for Rituals</span>
                        )}

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleApplyHoursToAll(idx)}
                            className="text-[11px] text-[#F35271] hover:underline font-semibold"
                            title="Apply this day's timing to all 7 days"
                          >
                            Apply to all days
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 7: BANK & KYC */}
              {currentStep === 7 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#AFB0B7]/20 pb-4">
                    <h2 className="font-serif-luxury text-2xl font-semibold text-[#0D0D12]">
                      7. Bank Details & Compliance KYC
                    </h2>
                    <p className="text-xs md:text-sm text-[#757880] mt-1">
                      Direct automated payouts to your registered bank account and official KYC identity verification.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Account Holder Name <span className="text-[#F35271]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="As registered with the bank"
                        value={formData.accountHolderName}
                        onChange={(e) => handleChange('accountHolderName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                          stepErrors.accountHolderName ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.accountHolderName && <p className="text-xs text-[#F35271] mt-1">{stepErrors.accountHolderName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Account Number <span className="text-[#F35271]">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Bank Account Number"
                        value={formData.accountNumber}
                        onChange={(e) => handleChange('accountNumber', e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all ${
                          stepErrors.accountNumber ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.accountNumber && <p className="text-xs text-[#F35271] mt-1">{stepErrors.accountNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Confirm Account Number <span className="text-[#F35271]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Re-enter Bank Account Number"
                        value={formData.confirmAccountNumber}
                        onChange={(e) => handleChange('confirmAccountNumber', e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all ${
                          stepErrors.confirmAccountNumber ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.confirmAccountNumber && <p className="text-xs text-[#F35271] mt-1">{stepErrors.confirmAccountNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Bank IFSC Code <span className="text-[#F35271]">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        placeholder="e.g. HDFC0000054"
                        value={formData.ifscCode}
                        onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                        className={`w-full px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all uppercase ${
                          stepErrors.ifscCode ? 'border-[#F35271] bg-red-50/20' : 'border-[#AFB0B7]/40 focus:border-[#F35271]'
                        }`}
                      />
                      {stepErrors.ifscCode && <p className="text-xs text-[#F35271] mt-1">{stepErrors.ifscCode}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Bank Name (Auto Detected)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HDFC Bank Ltd"
                        value={formData.bankName}
                        onChange={(e) => handleChange('bankName', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-[#AFB0B7]/40 text-sm outline-none focus:border-[#F35271]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Business UPI ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. auraluxe@okhdfcbank"
                        value={formData.upiId}
                        onChange={(e) => handleChange('upiId', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-[#AFB0B7]/40 text-sm outline-none focus:border-[#F35271]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-1.5">
                        Admin Aadhaar Number (12 Digits)
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="e.g. 582910492819"
                        value={formData.aadhaarNumber}
                        onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-[#AFB0B7]/40 text-sm font-mono outline-none focus:border-[#F35271]"
                      />
                    </div>
                  </div>

                  {/* KYC Compliance Document Uploaders */}
                  <div className="pt-4 border-t border-[#AFB0B7]/20 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D12]">
                      KYC Documents & Verification Proofs
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: 'Aadhaar Front', field: 'aadhaarFrontDoc' },
                        { title: 'Aadhaar Back', field: 'aadhaarBackDoc' },
                        { title: 'PAN Card', field: 'panCardDoc' },
                        { title: 'Business / GST License', field: 'businessProofDoc' },
                        { title: 'Cancelled Cheque', field: 'cancelledChequeDoc' }
                      ].map((doc) => (
                        <div key={doc.field} className="p-3.5 rounded-2xl bg-neutral-50 border border-[#AFB0B7]/25 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-[#0D0D12]">{doc.title}</div>
                            <div className="text-[10px] text-[#168821] font-mono flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> {formData[doc.field]}
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-white border border-[#AFB0B7]/30 text-[10px] font-bold text-[#0D0D12]">
                            Attached
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 8: REVIEW, PREVIEW & GO LIVE */}
              {currentStep === 8 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#AFB0B7]/20 pb-4">
                    <h2 className="font-serif-luxury text-2xl font-semibold text-[#0D0D12]">
                      8. Review & Instant Platform Activation
                    </h2>
                    <p className="text-xs md:text-sm text-[#757880] mt-1">
                      Verify your complete multi-business structure before publishing live on TherapyShala.
                    </p>
                  </div>

                  {/* Architecture Visualizer Banner */}
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-[#FFEEF1] to-white border border-[#F35271]/30 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#F35271] flex items-center gap-1.5">
                      <Layers className="w-4 h-4" /> Multi-Business Architecture Entity Hierarchy
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0D0D12] flex-wrap">
                      <span className="px-3 py-1 rounded-xl bg-white shadow-sm border border-[#AFB0B7]/25">
                        🏢 {formData.name || 'Organization'}
                      </span>
                      <span>→</span>
                      <span className="px-3 py-1 rounded-xl bg-white shadow-sm border border-[#AFB0B7]/25">
                        🌿 {formData.branches.length} {formData.branches.length > 1 ? 'Branches' : 'Branch'}
                      </span>
                      <span>→</span>
                      <span className="px-3 py-1 rounded-xl bg-white shadow-sm border border-[#AFB0B7]/25">
                        👤 Admin ({formData.ownerName || 'Owner'})
                      </span>
                      <span>→</span>
                      <span className="px-3 py-1 rounded-xl bg-white shadow-sm border border-[#AFB0B7]/25">
                        ✨ Live Services & Bookings
                      </span>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-[#AFB0B7]/25 space-y-2">
                      <div className="text-xs font-bold text-[#757880] uppercase">Business & Admin</div>
                      <div className="text-sm font-bold text-[#0D0D12]">{formData.name}</div>
                      <div className="text-xs text-[#757880]">{formData.type} • {formData.city}, {formData.state}</div>
                      <div className="text-xs text-[#0D0D12] font-medium">Owner: {formData.ownerName} ({formData.phone})</div>
                    </div>

                    <div className="p-4 rounded-2xl border border-[#AFB0B7]/25 space-y-2">
                      <div className="text-xs font-bold text-[#757880] uppercase">Legal & Compliance</div>
                      <div className="text-xs text-[#0D0D12]"><strong>Entity:</strong> {formData.legalBusinessName}</div>
                      <div className="text-xs text-[#0D0D12]"><strong>GSTIN:</strong> {formData.isGstRegistered ? formData.gstin : 'Unregistered'}</div>
                      <div className="text-xs text-[#0D0D12]"><strong>PAN:</strong> {formData.panNumber} • {formData.constitution}</div>
                    </div>

                    <div className="p-4 rounded-2xl border border-[#AFB0B7]/25 space-y-2">
                      <div className="text-xs font-bold text-[#757880] uppercase">Branches & Timing</div>
                      <div className="text-xs text-[#0D0D12]"><strong>Branches:</strong> {formData.branches.length} Location(s)</div>
                      <div className="text-xs text-[#0D0D12]"><strong>Flagship:</strong> {formData.branches[0]?.name}</div>
                      <div className="text-xs text-[#0D0D12]"><strong>Hours:</strong> 7-Day Schedule Configured</div>
                    </div>

                    <div className="p-4 rounded-2xl border border-[#AFB0B7]/25 space-y-2">
                      <div className="text-xs font-bold text-[#757880] uppercase">Payout Account & KYC</div>
                      <div className="text-xs text-[#0D0D12]"><strong>Bank:</strong> {formData.bankName || 'Verified Bank'}</div>
                      <div className="text-xs text-[#0D0D12]"><strong>IFSC:</strong> {formData.ifscCode}</div>
                      <div className="text-xs text-[#168821] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> All 5 KYC Documents Attached
                      </div>
                    </div>
                  </div>

                  {/* Terms Acceptance */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={(e) => handleChange('termsAccepted', e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#F35271] rounded border-[#AFB0B7]"
                      />
                      <span className="text-xs text-[#757880] leading-relaxed">
                        I agree to the TherapyShala Partner Agreement, Service Level Standards, and Cancellation Policies. I confirm all tax and KYC credentials provided are accurate.
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Step Navigation Controls */}
              <div className="pt-8 mt-8 border-t border-[#AFB0B7]/20 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#AFB0B7]/40 text-xs font-bold text-[#0D0D12] hover:bg-neutral-50 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                ) : <div />}

                {currentStep < 8 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#F35271] text-white text-xs font-bold hover:bg-[#E04362] transition-colors shadow-md shadow-[#F35271]/20"
                  >
                    Continue to {ONBOARDING_STEPS[currentStep]?.title} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={!formData.termsAccepted}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#168821] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#12701b] transition-all shadow-lg shadow-[#168821]/20 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" /> Go Live & Publish Business
                  </button>
                )}
              </div>

            </div>
          </div>
        ) : (
          /* SUCCESS SCREEN */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-[#AFB0B7]/25 shadow-xl text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-[#168821]/15 text-[#168821] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-4 py-1.5 rounded-full bg-[#FFEEF1] text-[#F35271] text-xs font-bold uppercase tracking-wider">
                Registration Successful
              </span>
              <h2 className="font-serif-luxury text-3xl font-semibold text-[#0D0D12] mt-3">
                Welcome to SpaMate & TherapyShala!
              </h2>
              <p className="text-sm text-[#757880] mt-2">
                Your business <strong>{formData.name}</strong> is now registered as a verified entity with {formData.branches.length} branch(es).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-[#AFB0B7]/20 text-left space-y-2 text-xs">
              <div><strong>Entity Slug:</strong> <span className="font-mono text-[#F35271]">{generatedSlug}</span></div>
              <div><strong>Master Admin:</strong> {formData.ownerName} ({formData.phone})</div>
              <div><strong>GST Status:</strong> {formData.isGstRegistered ? `Verified (${formData.gstin})` : 'Unregistered'}</div>
              <div><strong>KYC Status:</strong> <span className="text-[#168821] font-bold">Approved</span></div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to={`/business/${generatedSlug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#F35271] text-white text-xs font-bold hover:bg-[#E04362] transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View Public Profile
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#AFB0B7]/40 text-xs font-bold hover:bg-neutral-50 transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
          </motion.div>
        )}

        {/* BRANCH EDIT/ADD MODAL */}
        <AnimatePresence>
          {branchModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#AFB0B7]/25 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#AFB0B7]/20">
                  <h3 className="font-serif-luxury text-lg font-semibold text-[#0D0D12]">
                    {editingBranchIndex !== null ? 'Edit Branch' : 'Add New Branch'}
                  </h3>
                  <button
                    onClick={() => setBranchModalOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#757880]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#0D0D12] uppercase mb-1">Branch Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Indiranagar Flagship Studio"
                      value={tempBranch.name}
                      onChange={(e) => setTempBranch({ ...tempBranch, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs outline-none focus:border-[#F35271]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#0D0D12] uppercase mb-1">Branch Phone</label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={tempBranch.phone}
                        onChange={(e) => setTempBranch({ ...tempBranch, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs outline-none focus:border-[#F35271]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0D0D12] uppercase mb-1">Branch Email</label>
                      <input
                        type="email"
                        placeholder="branch@yourbrand.com"
                        value={tempBranch.email}
                        onChange={(e) => setTempBranch({ ...tempBranch, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs outline-none focus:border-[#F35271]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#0D0D12] uppercase mb-1">Branch Street Address</label>
                    <input
                      type="text"
                      placeholder="Plot No, Main Road, Landmark"
                      value={tempBranch.address}
                      onChange={(e) => setTempBranch({ ...tempBranch, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs outline-none focus:border-[#F35271]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-[#0D0D12] uppercase mb-1">City *</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={tempBranch.city}
                        onChange={(e) => setTempBranch({ ...tempBranch, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs outline-none focus:border-[#F35271]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0D0D12] uppercase mb-1">State</label>
                      <input
                        type="text"
                        placeholder="State"
                        value={tempBranch.state}
                        onChange={(e) => setTempBranch({ ...tempBranch, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs outline-none focus:border-[#F35271]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0D0D12] uppercase mb-1">PIN Code</label>
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={tempBranch.pincode}
                        onChange={(e) => setTempBranch({ ...tempBranch, pincode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs outline-none focus:border-[#F35271]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-[#0D0D12] uppercase mb-1">Rooms Capacity</label>
                      <input
                        type="number"
                        min="1"
                        value={tempBranch.roomCapacity}
                        onChange={(e) => setTempBranch({ ...tempBranch, roomCapacity: parseInt(e.target.value, 10) || 1 })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs outline-none focus:border-[#F35271]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0D0D12] uppercase mb-1">Chairs Capacity</label>
                      <input
                        type="number"
                        min="1"
                        value={tempBranch.chairCapacity}
                        onChange={(e) => setTempBranch({ ...tempBranch, chairCapacity: parseInt(e.target.value, 10) || 1 })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs outline-none focus:border-[#F35271]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0D0D12] uppercase mb-1">Branch Status</label>
                      <select
                        value={tempBranch.status}
                        onChange={(e) => setTempBranch({ ...tempBranch, status: e.target.value })}
                        className="w-full px-2.5 py-2.5 rounded-xl border border-[#AFB0B7]/40 text-xs outline-none bg-white"
                      >
                        {BRANCH_STATUSES.map(st => (
                          <option key={st.id} value={st.id}>{st.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#AFB0B7]/20 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBranchModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#AFB0B7]/40 text-xs font-semibold hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBranch}
                    className="px-5 py-2 rounded-xl bg-[#F35271] text-white text-xs font-bold hover:bg-[#E04362]"
                  >
                    Save Branch
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
}
