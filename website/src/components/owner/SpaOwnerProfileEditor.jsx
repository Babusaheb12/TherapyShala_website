import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Building2,
  Mail,
  Phone,
  Camera,
  Image as ImageIcon,
  Video,
  Info,
  Check,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Trash2,
  Sparkles,
  Eye,
  Smartphone,
  Save,
  HelpCircle,
  Clock,
  MapPin,
  Lock,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  X,
  Landmark,
  CreditCard,
  Hash,
  Loader2,
  PartyPopper,
  ArrowRight
} from 'lucide-react';
import {
  uploadAsset,
  updateSpaOwnerProfile,
  getSpaOwnerProfile
} from '../../services/spaOwner.service';
import confetti from 'canvas-confetti';

export default function SpaOwnerProfileEditor({
  initialProfile = null,
  activeSpaCode = 'SPA-873967',
  onSaveSuccess = () => {},
  isLockedMode = false,
  onNavigateToOverview = null
}) {
  const [formData, setFormData] = useState({
    name: initialProfile?.ownerName || initialProfile?.authorizedOwner || initialProfile?.name || '',
    ownerName: initialProfile?.ownerName || initialProfile?.authorizedOwner || initialProfile?.name || '',
    email: initialProfile?.email || initialProfile?.registeredEmail || '',
    phone: initialProfile?.phone || initialProfile?.contactPhone || '',
    spaName: initialProfile?.businessName || initialProfile?.spaName || '',
    businessName: initialProfile?.businessName || initialProfile?.spaName || '',
    spaBio: initialProfile?.bio || initialProfile?.spaBio || '',
    bio: initialProfile?.bio || initialProfile?.spaBio || '',
    profilePhoto: initialProfile?.ownerPhotoUrl || initialProfile?.profilePhoto || '',
    ownerPhotoUrl: initialProfile?.ownerPhotoUrl || initialProfile?.profilePhoto || '',
    spaLogo: initialProfile?.spaLogoUrl || initialProfile?.spaLogo || initialProfile?.logo || '',
    spaLogoUrl: initialProfile?.spaLogoUrl || initialProfile?.spaLogo || initialProfile?.logo || '',
    galleryImages: Array.isArray(initialProfile?.galleryImages) ? initialProfile.galleryImages : [],
    videoUrl: initialProfile?.videoUrl || '',
    govtIdFront: initialProfile?.governmentIdFrontUrl || initialProfile?.govtIdFront || '',
    governmentIdFrontUrl: initialProfile?.governmentIdFrontUrl || initialProfile?.govtIdFront || '',
    govtIdBack: initialProfile?.governmentIdBackUrl || initialProfile?.govtIdBack || '',
    governmentIdBackUrl: initialProfile?.governmentIdBackUrl || initialProfile?.govtIdBack || '',
    city: initialProfile?.city || '',
    address: initialProfile?.address || '',
    // Settlement & Banking Account details
    preferredMethod: initialProfile?.payoutAccount?.preferredMethod || initialProfile?.preferredMethod || 'BANK_TRANSFER',
    accountHolderName: initialProfile?.payoutAccount?.accountHolderName || initialProfile?.accountHolderName || '',
    bankName: initialProfile?.payoutAccount?.bankName || initialProfile?.bankName || '',
    accountNumber: initialProfile?.payoutAccount?.accountNumber || initialProfile?.accountNumber || '',
    ifscCode: initialProfile?.payoutAccount?.ifscCode || initialProfile?.ifscCode || '',
    upiId: initialProfile?.payoutAccount?.upiId || initialProfile?.upiId || ''
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [celebrationData, setCelebrationData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadingField, setUploadingField] = useState(null); // 'ownerPhotoUrl' | 'spaLogoUrl' | 'governmentIdFrontUrl' | 'governmentIdBackUrl' | 'gallery'
  const [previewModalImage, setPreviewModalImage] = useState(null);
  const [showGovtIdTooltip, setShowGovtIdTooltip] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Trigger rich multi-stage confetti burst
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#F35271', '#DE4B73', '#FFD700', '#10B981', '#8B5CF6'],
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
          colors: ['#F35271', '#FFD700', '#8B5CF6'],
        });
      }, 220);
    } catch (e) {
      console.warn('Confetti launch error:', e);
    }
  };

  const profileInputRef = useRef(null);
  const spaLogoInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const govtIdFrontInputRef = useRef(null);
  const govtIdBackInputRef = useRef(null);

  // Helper to extract embed URL for YouTube/Vimeo
  const getEmbedUrl = (url) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch')) {
        const id = new URL(url).searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (url.includes('vimeo.com/')) {
        const id = url.split('vimeo.com/')[1]?.split('?')[0];
        return id ? `https://player.vimeo.com/video/${id}` : null;
      }
    } catch {
      return null;
    }
    return null;
  };

  // Sync when initialProfile updates
  useEffect(() => {
    if (initialProfile) {
      setFormData((prev) => ({
        ...prev,
        name: initialProfile?.ownerName || initialProfile?.authorizedOwner || initialProfile?.name || prev.name,
        ownerName: initialProfile?.ownerName || initialProfile?.authorizedOwner || initialProfile?.name || prev.ownerName,
        email: initialProfile?.email || initialProfile?.registeredEmail || prev.email,
        phone: initialProfile?.phone || initialProfile?.contactPhone || prev.phone,
        spaName: initialProfile?.businessName || initialProfile?.spaName || prev.spaName,
        businessName: initialProfile?.businessName || initialProfile?.spaName || prev.businessName,
        spaBio: initialProfile?.bio || initialProfile?.spaBio || prev.spaBio,
        bio: initialProfile?.bio || initialProfile?.spaBio || prev.bio,
        profilePhoto: initialProfile?.ownerPhotoUrl || initialProfile?.profilePhoto || prev.profilePhoto,
        ownerPhotoUrl: initialProfile?.ownerPhotoUrl || initialProfile?.profilePhoto || prev.ownerPhotoUrl,
        spaLogo: initialProfile?.spaLogoUrl || initialProfile?.spaLogo || initialProfile?.logo || prev.spaLogo,
        spaLogoUrl: initialProfile?.spaLogoUrl || initialProfile?.spaLogo || initialProfile?.logo || prev.spaLogoUrl,
        galleryImages: Array.isArray(initialProfile?.galleryImages) && initialProfile.galleryImages.length > 0 ? initialProfile.galleryImages : prev.galleryImages,
        videoUrl: initialProfile?.videoUrl || prev.videoUrl,
        govtIdFront: initialProfile?.governmentIdFrontUrl || initialProfile?.govtIdFront || prev.govtIdFront,
        governmentIdFrontUrl: initialProfile?.governmentIdFrontUrl || initialProfile?.govtIdFront || prev.governmentIdFrontUrl,
        govtIdBack: initialProfile?.governmentIdBackUrl || initialProfile?.govtIdBack || prev.govtIdBack,
        governmentIdBackUrl: initialProfile?.governmentIdBackUrl || initialProfile?.govtIdBack || prev.governmentIdBackUrl,
        preferredMethod: initialProfile?.payoutAccount?.preferredMethod || initialProfile?.preferredMethod || prev.preferredMethod,
        accountHolderName: initialProfile?.payoutAccount?.accountHolderName || initialProfile?.accountHolderName || prev.accountHolderName,
        bankName: initialProfile?.payoutAccount?.bankName || initialProfile?.bankName || prev.bankName,
        accountNumber: initialProfile?.payoutAccount?.accountNumber || initialProfile?.accountNumber || prev.accountNumber,
        ifscCode: initialProfile?.payoutAccount?.ifscCode || initialProfile?.ifscCode || prev.ifscCode,
        upiId: initialProfile?.payoutAccount?.upiId || initialProfile?.upiId || prev.upiId
      }));
    }
  }, [initialProfile]);

  // Fetch fresh profile details from GET /spa-owner/profile on mount
  useEffect(() => {
    let isMounted = true;
    const loadFreshProfile = async () => {
      try {
        const res = await getSpaOwnerProfile();
        if (isMounted && res?.success && res?.data) {
          const p = res.data;
          setFormData((prev) => ({
            ...prev,
            name: p.ownerName || p.authorizedOwner || p.name || prev.name,
            ownerName: p.ownerName || p.authorizedOwner || p.name || prev.ownerName,
            spaName: p.businessName || p.spaName || prev.spaName,
            businessName: p.businessName || p.spaName || prev.businessName,
            email: p.email || p.registeredEmail || prev.email,
            phone: p.phone || p.contactPhone || prev.phone,
            spaBio: p.bio || p.spaBio || prev.spaBio,
            bio: p.bio || p.spaBio || prev.bio,
            profilePhoto: p.ownerPhotoUrl || p.profilePhoto || prev.profilePhoto,
            ownerPhotoUrl: p.ownerPhotoUrl || p.profilePhoto || prev.ownerPhotoUrl,
            spaLogo: p.spaLogoUrl || p.spaLogo || p.logo || prev.spaLogo,
            spaLogoUrl: p.spaLogoUrl || p.spaLogo || p.logo || prev.spaLogoUrl,
            galleryImages: Array.isArray(p.galleryImages) && p.galleryImages.length > 0 ? p.galleryImages : prev.galleryImages,
            videoUrl: p.videoUrl || prev.videoUrl,
            govtIdFront: p.governmentIdFrontUrl || p.govtIdFront || prev.govtIdFront,
            governmentIdFrontUrl: p.governmentIdFrontUrl || p.govtIdFront || prev.governmentIdFrontUrl,
            govtIdBack: p.governmentIdBackUrl || p.govtIdBack || prev.govtIdBack,
            governmentIdBackUrl: p.governmentIdBackUrl || p.govtIdBack || prev.governmentIdBackUrl,
            preferredMethod: p.payoutAccount?.preferredMethod || prev.preferredMethod,
            accountHolderName: p.payoutAccount?.accountHolderName || prev.accountHolderName,
            bankName: p.payoutAccount?.bankName || prev.bankName,
            accountNumber: p.payoutAccount?.accountNumber || prev.accountNumber,
            ifscCode: p.payoutAccount?.ifscCode || prev.ifscCode,
            upiId: p.payoutAccount?.upiId || prev.upiId
          }));
        }
      } catch (err) {
        console.warn('GET /spa-owner/profile initial fetch notice:', err?.message);
      }
    };
    loadFreshProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  // Generic Single File Upload Helper using POST /api/v1/assets/uploads
  const uploadSingleFile = async (file, kind, fieldName, aliasName) => {
    if (!file) return;
    setUploadingField(fieldName);
    setErrorMessage('');
    try {
      const res = await uploadAsset({ file, kind });
      const uploadedUrl = res?.data?.url || res?.url;
      if (uploadedUrl) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: uploadedUrl,
          ...(aliasName ? { [aliasName]: uploadedUrl } : {})
        }));
      } else {
        throw new Error(res?.message || 'File uploaded but no URL was returned.');
      }
    } catch (err) {
      console.error(`Upload failed for ${fieldName}:`, err);
      const msg = err?.data?.message || err?.message || 'Failed to upload asset. Please try again.';
      setErrorMessage(msg);
    } finally {
      setUploadingField(null);
    }
  };

  // 1. Owner Profile Photo -> kind: 'AVATAR'
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadSingleFile(file, 'AVATAR', 'ownerPhotoUrl', 'profilePhoto');
    }
  };

  // 2. Spa Sanctuary Logo -> kind: 'SERVICE_IMAGE'
  const handleSpaLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadSingleFile(file, 'SERVICE_IMAGE', 'spaLogoUrl', 'spaLogo');
    }
  };

  // 3. Government ID Front -> kind: 'KYC_FRONT'
  const handleGovtIdFrontChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadSingleFile(file, 'KYC_FRONT', 'governmentIdFrontUrl', 'govtIdFront');
    }
  };

  // 4. Government ID Back -> kind: 'KYC_BACK'
  const handleGovtIdBackChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadSingleFile(file, 'KYC_BACK', 'governmentIdBackUrl', 'govtIdBack');
    }
  };

  // 5. Gallery Images (up to 5) -> kind: 'SERVICE_IMAGE'
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const availableSlots = 5 - formData.galleryImages.length;
    if (availableSlots <= 0) return;

    const filesToUpload = files.slice(0, availableSlots);
    setUploadingField('gallery');
    setErrorMessage('');

    try {
      const uploadedUrls = [];
      for (const file of filesToUpload) {
        const res = await uploadAsset({ file, kind: 'SERVICE_IMAGE' });
        const url = res?.data?.url || res?.url;
        if (url) {
          uploadedUrls.push(url);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          galleryImages: [...prev.galleryImages, ...uploadedUrls].slice(0, 5)
        }));
      }
    } catch (err) {
      console.error('Gallery upload error:', err);
      const msg = err?.data?.message || err?.message || 'Failed to upload gallery images.';
      setErrorMessage(msg);
    } finally {
      setUploadingField(null);
    }
  };

  // Remove single gallery image
  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Handle Submit Form -> PATCH /spa-owner/profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const frontId = formData.governmentIdFrontUrl || formData.govtIdFront;
    const backId = formData.governmentIdBackUrl || formData.govtIdBack;

    // Government ID (Front & Back) is compulsory
    if (!frontId || !backId) {
      setErrorMessage(
        'Government ID (Front & Back) is compulsory for partner verification. Please attach both ID sides to proceed.'
      );
      return;
    }

    // Validate Bank IFSC Code strictly matching backend requirement: /^[A-Z]{4}0[A-Z0-9]{6}$/
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const cleanIfsc = (formData.ifscCode || '').trim().toUpperCase();
    if (!cleanIfsc) {
      setErrorMessage(
        'Bank IFSC Code is required for partner settlement. Please enter an 11-character Indian Bank IFSC Code (e.g. HDFC0001234).'
      );
      return;
    }
    if (!ifscRegex.test(cleanIfsc)) {
      setErrorMessage(
        `Invalid IFSC Code "${cleanIfsc}": Must be exactly 11 characters starting with 4 bank letters, followed by "0", and ending with 6 letters/digits (e.g. HDFC0001234 or SBIN0001234).`
      );
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    const payload = {
      isProfileComplete: true,
      ownerName: (formData.ownerName || formData.name || '').trim(),
      businessName: (formData.businessName || formData.spaName || '').trim(),
      ownerPhotoUrl: formData.ownerPhotoUrl || formData.profilePhoto || '',
      spaLogoUrl: formData.spaLogoUrl || formData.spaLogo || '',
      bio: (formData.bio || formData.spaBio || '').trim(),
      governmentIdFrontUrl: frontId,
      governmentIdBackUrl: backId,
      galleryImages: Array.isArray(formData.galleryImages) ? formData.galleryImages : [],
      videoUrl: (formData.videoUrl || '').trim(),
      payoutAccount: {
        accountHolderName: (formData.accountHolderName || formData.ownerName || formData.name || '').trim(),
        bankName: (formData.bankName || 'HDFC Bank').trim(),
        accountNumber: (formData.accountNumber || '').trim(),
        ifscCode: cleanIfsc,
        upiId: (formData.upiId || '').trim(),
        preferredMethod: formData.preferredMethod || 'BANK_TRANSFER'
      }
    };

    try {
      const res = await updateSpaOwnerProfile(payload);
      setSaving(false);
      setSaveSuccess(true);
      setCelebrationData({
        businessName: payload.businessName || 'Spa Sanctuary',
        ownerName: payload.ownerName,
        activeSpaCode,
        photoCount: (payload.galleryImages?.length || 0) + (payload.ownerPhotoUrl ? 1 : 0),
        hasVideo: !!payload.videoUrl,
        payoutMethod: payload.payoutAccount?.preferredMethod || 'BANK_TRANSFER'
      });
      setShowCelebrationModal(true);
      triggerCelebration();
      onSaveSuccess(res?.data || payload);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err) {
      setSaving(false);
      console.error('Profile update failed:', err);
      const backendErrors = err?.data?.errors;
      let msg = err?.data?.message || err?.message || 'Failed to update profile. Please verify your details.';
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        const details = backendErrors
          .map((b) => b.message || `${b.path?.join('.')}: ${b.code}`)
          .join(' • ');
        msg = `${msg}: ${details}`;
      }
      setErrorMessage(msg);
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0 font-sans-modern">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {isLockedMode ? (
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Account Setup Incomplete • Save Below To Unlock Full Portal</span>
              </span>
            ) : (
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-[#F35271] bg-[#FFEEF1] px-2.5 py-0.5 rounded-full">
                Sanctuary Branding & Public Profile
              </span>
            )}
            <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
              {activeSpaCode}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0D0D12]">
            Spa Owner Profile & App Showcase
          </h2>
          <p className="text-xs sm:text-sm text-[#757880] mt-1">
            Build and customize your public spa sanctuary profile. Photos and bio added here are showcased directly to customers on the TherapyShala mobile app and web discovery.
          </p>
        </div>

        {/* Live App Preview / Celebration Showcase Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setCelebrationData({
                businessName: formData.businessName || formData.spaName || 'Spa Sanctuary',
                ownerName: formData.ownerName || formData.name || 'Spa Owner',
                activeSpaCode,
                photoCount: (formData.galleryImages?.length || 0) + (formData.ownerPhotoUrl ? 1 : 0),
                hasVideo: !!formData.videoUrl,
                payoutMethod: formData.preferredMethod || 'BANK_TRANSFER'
              });
              setShowCelebrationModal(true);
              triggerCelebration();
            }}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Preview Live App Showcase with Celebration Animation"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Live on Customer App</span>
            <PartyPopper className="w-3.5 h-3.5 text-[#F35271]" />
          </button>
        </div>
      </div>

      {/* Error / Validation Notification Alert */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-red-700 hover:text-red-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}



      {/* Success Notification Alert */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Spa Owner profile & KYC verification documents saved successfully!</span>
          </div>
          <button
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= SECTION 1: OWNER & SPA IDENTITY ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-150">
            <div className="w-10 h-10 rounded-2xl bg-[#FFEEF1] text-[#F35271] flex items-center justify-center shadow-2xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0D0D12]">
                Owner Details, Profile Photo & Spa Logo
              </h3>
              <p className="text-xs text-[#757880]">
                Personal credentials, representative photo, and official brand logo for your spa sanctuary
              </p>
            </div>
          </div>

          {/* Photo & Logo Dual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* 1. Owner Profile Photo */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-[#FFEEF1] shadow-xs bg-white relative flex items-center justify-center">
                  {uploadingField === 'ownerPhotoUrl' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 text-white p-2 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-[#F35271] mb-1" />
                      <span className="text-[10px] font-bold">Uploading...</span>
                    </div>
                  ) : (formData.ownerPhotoUrl || formData.profilePhoto) ? (
                    <img
                      src={formData.ownerPhotoUrl || formData.profilePhoto}
                      alt="Spa Owner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                </div>

                {/* Camera Icon Overlay */}
                <button
                  type="button"
                  disabled={uploadingField === 'ownerPhotoUrl'}
                  onClick={() => profileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#F35271] text-white shadow-md hover:bg-[#E04362] transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Change Profile Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  type="file"
                  ref={profileInputRef}
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                />
              </div>

              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-[#0D0D12]">Owner Profile Photo</h4>
                <p className="text-[11px] text-[#757880] leading-relaxed">
                  Headshot of the authorized spa owner or partner representative (Kind: AVATAR).
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    disabled={uploadingField === 'ownerPhotoUrl'}
                    onClick={() => profileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-[#0D0D12] transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {uploadingField === 'ownerPhotoUrl' ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-[#F35271]" />
                        <span>Uploading...</span>
                      </>
                    ) : (formData.ownerPhotoUrl || formData.profilePhoto) ? (
                      'Change Photo'
                    ) : (
                      'Upload Photo'
                    )}
                  </button>
                  {(formData.ownerPhotoUrl || formData.profilePhoto) && (
                    <button
                      type="button"
                      disabled={uploadingField === 'ownerPhotoUrl'}
                      onClick={() => setFormData((p) => ({ ...p, profilePhoto: '', ownerPhotoUrl: '' }))}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Spa Sanctuary Logo (Kind: SERVICE_IMAGE) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/30 border border-rose-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-rose-100 shadow-xs bg-white flex items-center justify-center p-2 relative">
                  {uploadingField === 'spaLogoUrl' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 text-white p-2 text-center rounded-xl">
                      <Loader2 className="w-6 h-6 animate-spin text-[#F35271] mb-1" />
                      <span className="text-[10px] font-bold">Uploading...</span>
                    </div>
                  ) : (formData.spaLogoUrl || formData.spaLogo) ? (
                    <img
                      src={formData.spaLogoUrl || formData.spaLogo}
                      alt="Spa Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-rose-300">
                      <Building2 className="w-10 h-10" />
                      <span className="text-[9px] font-bold mt-1 text-rose-400">LOGO</span>
                    </div>
                  )}
                </div>

                {/* Camera / Upload Icon Overlay */}
                <button
                  type="button"
                  disabled={uploadingField === 'spaLogoUrl'}
                  onClick={() => spaLogoInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#0D0D12] text-white shadow-md hover:bg-gray-800 transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Upload Spa Logo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  type="file"
                  ref={spaLogoInputRef}
                  accept="image/*"
                  onChange={handleSpaLogoChange}
                  className="hidden"
                />
              </div>

              <div className="flex-1 space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <h4 className="text-sm font-bold text-[#0D0D12]">Spa Sanctuary Logo</h4>
                  <span className="text-[10px] font-bold text-[#F35271] bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200">
                    Brand Logo
                  </span>
                </div>
                <p className="text-[11px] text-[#757880] leading-relaxed">
                  Official logo badge shown on client chat headers, booking cards & app discovery (Kind: SERVICE_IMAGE).
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    disabled={uploadingField === 'spaLogoUrl'}
                    onClick={() => spaLogoInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-xs font-bold text-[#0D0D12] transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {uploadingField === 'spaLogoUrl' ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-[#F35271]" />
                        <span>Uploading...</span>
                      </>
                    ) : (formData.spaLogoUrl || formData.spaLogo) ? (
                      'Change Spa Logo'
                    ) : (
                      'Upload Spa Logo'
                    )}
                  </button>
                  {(formData.spaLogoUrl || formData.spaLogo) && (
                    <button
                      type="button"
                      disabled={uploadingField === 'spaLogoUrl'}
                      onClick={() => setFormData((p) => ({ ...p, spaLogo: '', spaLogoUrl: '' }))}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Core Info Fields Grid (Name, Email, Phone, Spa Business Name) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
            {/* Owner Full Name */}
            <div>
              <label className="text-xs font-bold text-[#0D0D12] block mb-1.5">
                Owner Full Name <span className="text-[#F35271]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.ownerName || formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                      ownerName: e.target.value
                    }))
                  }
                  placeholder="e.g. Akash Verma"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs sm:text-sm text-[#0D0D12] focus:bg-white focus:outline-none focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271]/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Email Address (Non-editable / Disabled) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0D0D12]">
                  Registered Email
                </label>
                <span className="text-[10px] text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-gray-400" />
                  <span>Non-editable</span>
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  readOnly
                  value={formData.email}
                  placeholder="owner@therapyshala.com"
                  className="w-full pl-10 pr-9 py-2.5 bg-gray-100/90 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-500 font-medium cursor-not-allowed select-none"
                />
                <Lock className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Official registered email cannot be changed directly for security reasons.
              </span>
            </div>

            {/* Contact Phone Number (Non-editable / Disabled) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0D0D12]">
                  Contact Phone Number
                </label>
                <span className="text-[10px] text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-gray-400" />
                  <span>Non-editable</span>
                </span>
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  disabled
                  readOnly
                  value={formData.phone}
                  placeholder="+91 98290 84721"
                  className="w-full pl-10 pr-9 py-2.5 bg-gray-100/90 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-500 font-medium cursor-not-allowed select-none"
                />
                <Lock className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Verified OTP contact number cannot be modified directly.
              </span>
            </div>

            {/* Spa Business Name */}
            <div>
              <label className="text-xs font-bold text-[#0D0D12] block mb-1.5">
                Spa Sanctuary Business Name <span className="text-[#F35271]">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.businessName || formData.spaName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      spaName: e.target.value,
                      businessName: e.target.value
                    }))
                  }
                  placeholder="e.g. Aura Luxe Wellness Sanctuary"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs sm:text-sm text-[#0D0D12] focus:bg-white focus:outline-none focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271]/20 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Spa Bio Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#0D0D12]">
                Spa Sanctuary Bio & Description <span className="text-[#F35271]">*</span>
              </label>
              <span className="text-[11px] text-[#757880]">
                {(formData.bio || formData.spaBio).length}/500 chars
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={500}
              required
              value={formData.bio || formData.spaBio}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  spaBio: e.target.value,
                  bio: e.target.value
                }))
              }
              placeholder="Tell guests about your specialty rituals, luxurious treatment rooms, organic oils, and hygiene standards..."
              className="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs sm:text-sm text-[#0D0D12] focus:bg-white focus:outline-none focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271]/20 transition-all font-medium leading-relaxed"
            />
          </div>
        </div>

        {/* ================= SECTION: GOVERNMENT ID VERIFICATION (COMPULSORY KYC) ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFEEF1] text-[#F35271] flex items-center justify-center shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#0D0D12]">
                    Government ID Verification
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#F35271] bg-[#FFEEF1] px-2.5 py-0.5 rounded-full border border-[#F35271]/20">
                    Compulsory
                  </span>

                  {/* INFO ICON WITH HOVER/CLICK TOOLTIP (Exact user requirement) */}
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onMouseEnter={() => setShowGovtIdTooltip(true)}
                      onMouseLeave={() => setShowGovtIdTooltip(false)}
                      onClick={() => setShowGovtIdTooltip(!showGovtIdTooltip)}
                      className="p-1 rounded-full text-[#F35271] hover:bg-[#FFEEF1] transition-colors cursor-pointer"
                      title="Privacy Guarantee"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {showGovtIdTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 sm:w-80 p-3.5 bg-[#0D0D12] text-white text-xs rounded-2xl shadow-xl z-30 pointer-events-none"
                        >
                          <div className="flex items-start gap-2.5">
                            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-emerald-400 font-bold text-xs mb-1">
                                Strictly Private & Confidential
                              </strong>
                              <p className="text-[11px] text-gray-300 leading-relaxed">
                                This government ID will NOT be shared with customers or shown on the mobile app. It is strictly retained by TherapyShala for partner verification, security vetting, and regulatory compliance.
                              </p>
                            </div>
                          </div>
                          <div className="w-3 h-3 bg-[#0D0D12] transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <p className="text-xs text-[#757880]">
                  Official identity verification (Aadhaar Card, PAN Card, or Passport)
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Internal Company Use Only</span>
            </span>
          </div>

          {/* 2-Column Upload Cards for Front and Back */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Government ID (Front) */}
            <div className="p-4 sm:p-5 rounded-2xl border border-gray-200/90 bg-gray-50/40 space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0D0D12] block">
                  Government ID (Front) <span className="text-[#F35271]">*</span>
                </label>
                <p className="text-[11px] text-[#757880]">
                  Front side of Aadhaar, PAN or Passport (Kind: KYC_FRONT)
                </p>
              </div>

              {uploadingField === 'governmentIdFrontUrl' ? (
                <div className="rounded-2xl border-2 border-dashed border-[#F35271] bg-rose-50/40 aspect-3/2 flex flex-col items-center justify-center p-4 text-center">
                  <Loader2 className="w-8 h-8 text-[#F35271] animate-spin mb-2" />
                  <span className="text-xs font-bold text-[#0D0D12]">Uploading ID Front...</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">Sending to /api/v1/assets/uploads</span>
                </div>
              ) : (formData.governmentIdFrontUrl || formData.govtIdFront) ? (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 aspect-3/2 bg-white flex items-center justify-center group shadow-xs">
                  {String(formData.governmentIdFrontUrl || formData.govtIdFront).toLowerCase().includes('.pdf') ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <FileCheck className="w-10 h-10 text-[#F35271] mb-2" />
                      <span className="text-xs font-bold text-[#0D0D12]">PDF Document Attached</span>
                      <span className="text-[10px] text-gray-400 font-mono truncate max-w-[200px] mt-0.5">
                        {String(formData.governmentIdFrontUrl || formData.govtIdFront).split('/').pop()}
                      </span>
                      <a
                        href={formData.governmentIdFrontUrl || formData.govtIdFront}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#F35271] hover:underline"
                      >
                        <span>View Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <img
                      src={formData.governmentIdFrontUrl || formData.govtIdFront}
                      alt="Government ID Front"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0D0D12]/75 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>ID Front Attached</span>
                  </span>

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-[#0D0D12]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const target = formData.governmentIdFrontUrl || formData.govtIdFront;
                        if (String(target).toLowerCase().includes('.pdf')) {
                          window.open(target, '_blank');
                        } else {
                          setPreviewModalImage(target);
                        }
                      }}
                      className="p-2 rounded-xl bg-white text-[#0D0D12] hover:bg-gray-100 transition-all cursor-pointer shadow-md"
                      title="View Full Size"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, govtIdFront: '', governmentIdFrontUrl: '' }))}
                      className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer shadow-md"
                      title="Remove Front ID"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => govtIdFrontInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-[#F35271]/40 hover:border-[#F35271] bg-white hover:bg-[#FFEEF1]/30 aspect-3/2 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#FFEEF1] text-[#F35271] group-hover:scale-110 flex items-center justify-center transition-transform shadow-2xs mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#0D0D12] block">
                    Upload ID Front
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    JPG, PNG or PDF (Max 10MB)
                  </span>
                  <input
                    type="file"
                    ref={govtIdFrontInputRef}
                    accept="image/*,.pdf"
                    onChange={handleGovtIdFrontChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Government ID (Back) */}
            <div className="p-4 sm:p-5 rounded-2xl border border-gray-200/90 bg-gray-50/40 space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0D0D12] block">
                  Government ID (Back) <span className="text-[#F35271]">*</span>
                </label>
                <p className="text-[11px] text-[#757880]">
                  Back side with residential address (Kind: KYC_BACK)
                </p>
              </div>

              {uploadingField === 'governmentIdBackUrl' ? (
                <div className="rounded-2xl border-2 border-dashed border-[#F35271] bg-rose-50/40 aspect-3/2 flex flex-col items-center justify-center p-4 text-center">
                  <Loader2 className="w-8 h-8 text-[#F35271] animate-spin mb-2" />
                  <span className="text-xs font-bold text-[#0D0D12]">Uploading ID Back...</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">Sending to /api/v1/assets/uploads</span>
                </div>
              ) : (formData.governmentIdBackUrl || formData.govtIdBack) ? (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 aspect-3/2 bg-white flex items-center justify-center group shadow-xs">
                  {String(formData.governmentIdBackUrl || formData.govtIdBack).toLowerCase().includes('.pdf') ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <FileCheck className="w-10 h-10 text-[#F35271] mb-2" />
                      <span className="text-xs font-bold text-[#0D0D12]">PDF Document Attached</span>
                      <span className="text-[10px] text-gray-400 font-mono truncate max-w-[200px] mt-0.5">
                        {String(formData.governmentIdBackUrl || formData.govtIdBack).split('/').pop()}
                      </span>
                      <a
                        href={formData.governmentIdBackUrl || formData.govtIdBack}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#F35271] hover:underline"
                      >
                        <span>View Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <img
                      src={formData.governmentIdBackUrl || formData.govtIdBack}
                      alt="Government ID Back"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0D0D12]/75 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>ID Back Attached</span>
                  </span>

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-[#0D0D12]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const target = formData.governmentIdBackUrl || formData.govtIdBack;
                        if (String(target).toLowerCase().includes('.pdf')) {
                          window.open(target, '_blank');
                        } else {
                          setPreviewModalImage(target);
                        }
                      }}
                      className="p-2 rounded-xl bg-white text-[#0D0D12] hover:bg-gray-100 transition-all cursor-pointer shadow-md"
                      title="View Full Size"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, govtIdBack: '', governmentIdBackUrl: '' }))}
                      className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer shadow-md"
                      title="Remove Back ID"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => govtIdBackInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-[#F35271]/40 hover:border-[#F35271] bg-white hover:bg-[#FFEEF1]/30 aspect-3/2 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#FFEEF1] text-[#F35271] group-hover:scale-110 flex items-center justify-center transition-transform shadow-2xs mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#0D0D12] block">
                    Upload ID Back
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    JPG, PNG or PDF (Max 10MB)
                  </span>
                  <input
                    type="file"
                    ref={govtIdBackInputRef}
                    accept="image/*,.pdf"
                    onChange={handleGovtIdBackChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-950">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-900 leading-relaxed">
              <b>Confidentiality Guarantee:</b> Your government identification documents are protected with high-level security and used solely for TherapyShala onboarding and identity verification. They are strictly confidential and will never be shared with clients or visible publicly on the mobile app.
            </p>
          </div>
        </div>

        {/* ================= SECTION 2: GALLERY IMAGES (5 IMAGES) + INFO TOOLTIP ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFEEF1] text-[#F35271] flex items-center justify-center shadow-2xs">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#0D0D12]">
                    Gallery Images (5 Photos)
                  </h3>

                  {/* INFO ICON WITH HOVER/CLICK TOOLTIP (Exact user requirement) */}
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      onClick={() => setShowTooltip(!showTooltip)}
                      className="p-1 rounded-full text-[#F35271] hover:bg-[#FFEEF1] transition-colors cursor-pointer"
                      title="Learn where these images appear"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {/* Popover / Tooltip */}
                    <AnimatePresence>
                      {showTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 sm:w-80 p-3.5 bg-[#0D0D12] text-white text-xs rounded-2xl shadow-xl z-30 pointer-events-none"
                        >
                          <div className="flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-[#F35271] shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-[#F35271] font-bold text-xs mb-1">
                                These images will be displayed on the app!
                              </strong>
                              <p className="text-[11px] text-gray-300 leading-relaxed">
                                These 5 gallery photos will be showcased directly to guests across the TherapyShala Mobile App home discovery screen, sanctuary detail cover banners, and booking flows. We recommend uploading high-resolution photos of treatment rooms, hydrotherapy baths, and serene ambiance.
                              </p>
                            </div>
                          </div>
                          {/* Downward triangle arrow */}
                          <div className="w-3 h-3 bg-[#0D0D12] transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <p className="text-xs text-[#757880]">
                  High quality sanctuary photos showcased directly on mobile customer discovery
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              {formData.galleryImages.length} of 5 Photos Uploaded
            </span>
          </div>

          {/* Gallery Image Grid (5 Slots) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Uploaded Images */}
            {formData.galleryImages.map((imgUrl, index) => (
              <div
                key={index}
                className="relative group rounded-2xl overflow-hidden aspect-square border-2 border-gray-200 bg-gray-50 shadow-2xs"
              >
                <img
                  src={imgUrl}
                  alt={`Spa gallery photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Photo Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0D0D12]/70 backdrop-blur-xs text-white text-[10px] font-bold">
                  Photo #{index + 1}
                </span>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-[#0D0D12]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewModalImage(imgUrl)}
                    className="p-2 rounded-xl bg-white/90 text-[#0D0D12] hover:bg-white hover:scale-110 transition-all cursor-pointer shadow-md"
                    title="View Fullscreen"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 hover:scale-110 transition-all cursor-pointer shadow-md"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Active Upload Slot (Next available) */}
            {formData.galleryImages.length < 5 && (
              <label
                onClick={() => {
                  if (uploadingField !== 'gallery') {
                    galleryInputRef.current?.click();
                  }
                }}
                className={`rounded-2xl border-2 border-dashed border-[#F35271]/50 hover:border-[#F35271] bg-[#FFEEF1]/30 hover:bg-[#FFEEF1]/60 aspect-square flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all group shadow-2xs ${
                  uploadingField === 'gallery' ? 'opacity-75 pointer-events-none' : ''
                }`}
              >
                {uploadingField === 'gallery' ? (
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#F35271] animate-spin mb-1.5" />
                    <span className="text-xs font-bold text-[#0D0D12]">Uploading...</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">SERVICE_IMAGE</span>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-2xl bg-[#FFEEF1] text-[#F35271] group-hover:scale-110 flex items-center justify-center transition-transform shadow-2xs mb-2">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#0D0D12] block">
                      Add Image
                    </span>
                    <span className="text-[10px] font-semibold text-[#F35271] mt-0.5">
                      Slot #{formData.galleryImages.length + 1}
                    </span>
                  </>
                )}
              </label>
            )}

            {/* Remaining Inactive Empty Slots (Up to 5 total) */}
            {Array.from({ length: Math.max(0, 4 - formData.galleryImages.length) }).map((_, idx) => {
              const slotNumber = formData.galleryImages.length + 2 + idx;
              return (
                <div
                  key={`empty-${slotNumber}`}
                  onClick={() => galleryInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 aspect-square flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-gray-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-300 flex items-center justify-center mb-1.5">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">
                    Empty Slot
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Slot #{slotNumber}
                  </span>
                </div>
              );
            })}

            <input
              type="file"
              ref={galleryInputRef}
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              className="hidden"
            />
          </div>

          {/* Quick Guidance Box */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Mobile App Display Guarantee:</span>
              <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                Photo #1 will be shown as the sanctuary cover banner in customer searches. Minimum recommended resolution: 1200x800px. High resolution imagery increases booking conversions by 48%.
              </p>
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: SANCTUARY VIDEO URL (OPTIONAL) ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-150">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0D0D12]">
                  Sanctuary Video URL
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">
                  Optional
                </span>
              </div>
              <p className="text-xs text-[#757880]">
                Add a hosted video link of your sanctuary ambience or walkthrough tour
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0D0D12] block mb-1.5">
                Video Link URL (YouTube, Vimeo, or Hosted Video)
              </label>
              <div className="relative">
                <Video className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                  className="w-full pl-10 pr-24 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs sm:text-sm text-[#0D0D12] focus:bg-white focus:outline-none focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271]/20 transition-all font-medium"
                />
                {formData.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, videoUrl: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#757880] mt-1.5 leading-relaxed">
                Guests can click the video tour button on the TherapyShala mobile app to experience an immersive preview of your spa sanctuary.
              </p>
            </div>

            {/* Live Video Preview if valid embed/link exists */}
            {formData.videoUrl && (
              <div className="pt-2">
                <div className="text-xs font-bold text-[#0D0D12] mb-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Video Preview:</span>
                </div>
                <div className="max-w-xl rounded-2xl overflow-hidden border border-gray-200 bg-black aspect-video shadow-xs relative">
                  {getEmbedUrl(formData.videoUrl) ? (
                    <iframe
                      src={getEmbedUrl(formData.videoUrl)}
                      title="Sanctuary Walkthrough Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : formData.videoUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={formData.videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-gray-900 to-gray-800">
                      <Video className="w-8 h-8 text-[#F35271] mb-2" />
                      <span className="text-xs font-bold">External Video URL Linked</span>
                      <a
                        href={formData.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 mt-1"
                      >
                        <span>Open link in new tab</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= SECTION 4: SETTLEMENT & PAYOUT BANKING ACCOUNT ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#F35271] flex items-center justify-center shadow-2xs">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#0D0D12]">
                    Settlement & Payout Banking Account
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#F35271] border border-rose-200/60 text-[10px] font-bold uppercase">
                    Payout Method
                  </span>
                </div>
                <p className="text-xs text-[#757880]">
                  Configure your preferred settlement method for receiving appointment earnings and payout transfers
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  accountHolderName: prev.ownerName || prev.name || 'Akash Sharma',
                  bankName: 'HDFC Bank',
                  accountNumber: '8411648984553',
                  ifscCode: 'HDFC0001234',
                  upiId: 'akash@upi',
                  preferredMethod: 'BANK_TRANSFER'
                }))
              }
              className="text-xs font-semibold text-[#F35271] hover:text-[#E04362] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Sample Banking Details</span>
            </button>
          </div>

          <div className="space-y-5">
            {/* Preferred Settlement Method Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0D0D12] mb-2">
                Preferred Settlement Method <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, preferredMethod: 'UPI' }))
                  }
                  className={`p-4 rounded-2xl border text-left font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                    formData.preferredMethod === 'UPI'
                      ? 'border-[#F35271] bg-rose-50/60 text-[#F35271] shadow-2xs ring-1 ring-[#F35271]/30'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      formData.preferredMethod === 'UPI'
                        ? 'bg-[#F35271] text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-[#0D0D12] flex items-center gap-1.5">
                      <span>UPI Instant Transfer</span>
                      {formData.preferredMethod === 'UPI' && (
                        <Check className="w-4 h-4 text-[#F35271]" />
                      )}
                    </div>
                    <div className="text-[11px] font-normal text-gray-500 mt-0.5">
                      Google Pay, PhonePe, Paytm, BHIM
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, preferredMethod: 'BANK_TRANSFER' }))
                  }
                  className={`p-4 rounded-2xl border text-left font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                    formData.preferredMethod === 'BANK_TRANSFER' || formData.preferredMethod === 'BANK'
                      ? 'border-[#F35271] bg-rose-50/60 text-[#F35271] shadow-2xs ring-1 ring-[#F35271]/30'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      formData.preferredMethod === 'BANK_TRANSFER' || formData.preferredMethod === 'BANK'
                        ? 'bg-[#F35271] text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-[#0D0D12] flex items-center gap-1.5">
                      <span>Direct Bank Account Transfer</span>
                      {(formData.preferredMethod === 'BANK_TRANSFER' || formData.preferredMethod === 'BANK') && (
                        <Check className="w-4 h-4 text-[#F35271]" />
                      )}
                    </div>
                    <div className="text-[11px] font-normal text-gray-500 mt-0.5">
                      IMPS / NEFT / RTGS Wire
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Beneficiary Account Holder Name */}
              <div>
                <label className="block text-xs font-bold text-[#0D0D12] mb-1.5">
                  Beneficiary Account Holder Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Vikramaditya Roy"
                    value={formData.accountHolderName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, accountHolderName: e.target.value }))
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs sm:text-sm font-medium text-[#0D0D12] focus:bg-white focus:outline-none focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271]/20 transition-all"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Full legal name on bank record</span>
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-xs font-bold text-[#0D0D12] mb-1.5">
                  Bank Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bankName: e.target.value }))
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs sm:text-sm font-medium text-[#0D0D12] focus:bg-white focus:outline-none focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271]/20 transition-all"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Scheduled commercial bank name</span>
              </div>

              {/* Bank Account Number */}
              <div>
                <label className="block text-xs font-bold text-[#0D0D12] mb-1.5">
                  Bank Account Number
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. 50100234567890"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, accountNumber: e.target.value }))
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold font-mono text-[#0D0D12] focus:bg-white focus:outline-none focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271]/20 transition-all"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Savings or Current account number</span>
              </div>

              {/* Bank IFSC Code */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#0D0D12]">
                    Bank IFSC Code <span className="text-rose-500">*</span>
                  </label>
                  {formData.ifscCode && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        /^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}
                    >
                      {/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)
                        ? 'Valid Format ✓'
                        : `${formData.ifscCode.length}/11 chars`}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Hash className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={11}
                    required
                    placeholder="e.g. HDFC0001234"
                    value={formData.ifscCode}
                    onChange={(e) => {
                      const clean = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, '')
                        .slice(0, 11);
                      setFormData((prev) => ({ ...prev, ifscCode: clean }));
                    }}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border rounded-2xl text-xs sm:text-sm font-semibold font-mono text-[#0D0D12] focus:bg-white focus:outline-none transition-all uppercase ${
                      formData.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                        : 'border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271]/20'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  11-character Indian Financial System Code (e.g. <b>HDFC0001234</b> — 5th character must be '0')
                </span>
                {formData.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode) && (
                  <span className="text-[10px] text-rose-600 font-medium mt-1 block">
                    Must start with 4 bank letters, followed by 0, then 6 alphanumeric digits.
                  </span>
                )}
              </div>

              {/* UPI ID / Virtual Payment Address (VPA) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#0D0D12] mb-1.5">
                  UPI ID / Virtual Payment Address (VPA)
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. vikram@okaxis or business@okhdfcbank"
                    value={formData.upiId}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, upiId: e.target.value }))
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs sm:text-sm font-medium text-[#0D0D12] focus:bg-white focus:outline-none focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271]/20 transition-all"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Used for instant real-time settlement directly to your UPI handle
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SUBMIT / SAVE ACTION BAR ================= */}
        <div className="p-4 sm:p-5 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile automatically syncs with TherapyShala verification engine</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={saving}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                saveSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-300'
                  : 'bg-gradient-to-r from-[#F35271] to-[#FA7B9B] hover:from-[#E04362] hover:to-[#F35271] hover:shadow-lg'
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Saving Profile...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                  <span>Profile Saved Successfully!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Spa Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Fullscreen Image Preview Modal */}
      <AnimatePresence>
        {previewModalImage && (
          <div
            onClick={() => setPreviewModalImage(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-3xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewModalImage}
                alt="Enlarged gallery photo"
                className="w-full h-full object-contain bg-black"
              />
              <button
                onClick={() => setPreviewModalImage(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Spa Owner Profile & App Showcase Celebration Modal */}
      <AnimatePresence>
        {showCelebrationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0D0D12]/65 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowCelebrationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.72, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl border border-rose-150 relative overflow-hidden"
            >
              {/* Decorative top ribbon */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-[#F35271] to-purple-500" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowCelebrationModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Animated Bouncing Celebration Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 14, stiffness: 260, delay: 0.1 }}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-tr from-[#F35271] to-rose-400 text-white flex items-center justify-center mx-auto mb-3.5 shadow-lg ring-8 ring-rose-50"
              >
                <Sparkles className="w-9 h-9" />
              </motion.div>

              {/* Title & Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-1"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Live App Showcase Published
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0D0D12]">
                  Spa Sanctuary Profile Published!
                </h3>
                <p className="text-xs text-[#757880]">
                  Your public spa profile, gallery showcase, and KYC credentials are now live on the TherapyShala mobile app and web discovery.
                </p>
              </motion.div>

              {/* Showcase Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="my-4 p-4 rounded-2xl bg-gradient-to-br from-[#FFF5F7] to-[#FFF0F3] border border-rose-200/70 text-left text-xs space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-rose-200/60">
                  <span className="font-bold text-[#F35271] flex items-center gap-1.5 text-xs truncate max-w-[280px]">
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span>{celebrationData?.businessName || formData.businessName || formData.spaName || 'Spa Sanctuary'}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-rose-200 text-gray-700 shadow-2xs shrink-0">
                    {activeSpaCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 text-[11px] block">Authorized Owner</span>
                    <strong className="text-[#0D0D12] text-xs truncate block">
                      {celebrationData?.ownerName || formData.ownerName || formData.name || 'Spa Owner'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[11px] block">App Showcase Media</span>
                    <strong className="text-[#0D0D12] text-xs block">
                      {(formData.galleryImages?.length || 0)} Photos {formData.videoUrl ? '• Video Active' : ''}
                    </strong>
                  </div>
                  <div className="col-span-2 pt-1.5 border-t border-rose-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>KYC Verification Documents Linked</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md shrink-0">
                      Sync Complete
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1"
              >
                {onNavigateToOverview && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowCelebrationModal(false);
                      onNavigateToOverview();
                    }}
                    className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#0D0D12] hover:bg-black text-white text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>View Sanctuary Overview</span>
                    <ArrowRight className="w-4 h-4 text-[#F35271]" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowCelebrationModal(false)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[#F35271] text-xs font-bold transition-all cursor-pointer active:scale-98"
                >
                  Continue Editing
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
