import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  CreditCard,
  Building2,
  CheckCircle2,
  Star,
  Award,
  Clock,
  ExternalLink,
  Power,
  Sparkles,
  FileText,
  User,
  Eye,
  X,
  Camera,
  Smartphone,
  RefreshCw,
  Edit2,
  Loader2,
  AlertCircle,
  Save,
  Check,
  Plus,
  Trash2,
  Upload,
  Globe,
  Sliders,
  Briefcase,
} from 'lucide-react';
import { resolveMediaUrl } from '../../utils/mediaUtils';
import GoogleLocationPicker from '../GoogleLocationPicker';
import {
  getSpaOwnerTherapistById,
  updateSpaOwnerTherapist,
  updateSpaOwnerTherapistDutyStatus,
  getCategories,
  uploadAsset,
} from '../../services/spaOwner.service';

const COMMON_LANGUAGES = [
  { code: 'hi', label: 'Hindi' },
  { code: 'en', label: 'English' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'mr', label: 'Marathi' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'ur', label: 'Urdu' },
  { code: 'kn', label: 'Kannada' },
  { code: 'ml', label: 'Malayalam' },
];

const FALLBACK_CATEGORIES = [
  { id: '01M60X6ZE8D0YDWKPT0ENNDD8B', name: 'Swedish Massage' },
  { id: '01M60X6ZE8D0YDWKPT0ENNDD8C', name: 'Deep Tissue Massage' },
  { id: '01M60X6ZE8D0YDWKPT0ENNDD8D', name: 'Ayurvedic Therapy' },
  { id: '01M60X6ZE8D0YDWKPT0ENNDD8E', name: 'Aromatherapy' },
  { id: '01M60X6ZE8D0YDWKPT0ENNDD8F', name: 'Facial & Head Reflexology' },
];

const mapToLangCodes = (raw) => {
  if (!raw) return ['hi', 'en'];
  const arr = Array.isArray(raw) ? raw : String(raw).split(',');
  const result = arr
    .map((l) => {
      const s = String(l).trim().toLowerCase();
      if (!s) return null;
      if (s === 'hindi' || s === 'hi') return 'hi';
      if (s === 'english' || s === 'en') return 'en';
      if (s === 'punjabi' || s === 'pa') return 'pa';
      if (s === 'bengali' || s === 'bn') return 'bn';
      if (s === 'marathi' || s === 'mr') return 'mr';
      if (s === 'gujarati' || s === 'gu') return 'gu';
      if (s === 'tamil' || s === 'ta') return 'ta';
      if (s === 'telugu' || s === 'te') return 'te';
      if (s === 'urdu' || s === 'ur') return 'ur';
      if (s === 'kannada' || s === 'kn') return 'kn';
      if (s === 'malayalam' || s === 'ml') return 'ml';
      return s.slice(0, 2);
    })
    .filter(Boolean);
  return result.length > 0 ? Array.from(new Set(result)) : ['hi', 'en'];
};

const getInitialFormData = (data) => {
  const loc = data?.workingLocation || {};
  const excludedLocations =
    data?.excludedWorkAreas || data?.excludedLocations || loc.excludedWorkAreas || [];
  const formattedServices =
    Array.isArray(data?.services) && data.services.length > 0
      ? data.services.map((s) => ({
          categoryId: s.categoryId || s.id || '01M60X6ZE8D0YDWKPT0ENNDD8B',
          durationMinutes: Number(s.durationMinutes) || 60,
          basePrice: Number(s.basePrice) || 1200,
          discountPrice: Number(s.discountPrice) || 1000,
        }))
      : [
          {
            categoryId: '01M60X6ZE8D0YDWKPT0ENNDD8B',
            durationMinutes: 60,
            basePrice: 1200,
            discountPrice: 1000,
          },
        ];

  return {
    displayName: data?.displayName || data?.name || '',
    fullName: data?.fullName || data?.name || '',
    mobileNumber: data?.mobileNumber || data?.phone || '',
    email: data?.email || '',
    gender: data?.gender || 'FEMALE',
    dateOfBirth: data?.dateOfBirth ? String(data.dateOfBirth).slice(0, 10) : '',
    experienceYears: Number(data?.experienceYears) || 1,
    languagesSpoken: mapToLangCodes(data?.languagesSpoken || data?.languages),
    dutyStatus: data?.dutyStatus || 'OFF_DUTY',
    status: data?.status || 'ACTIVE',
    bio: data?.bio || '',
    appPhotoUrl: data?.appPhotoUrl || data?.avatarUrl || data?.profilePhoto || '',
    companyPhotoUrl: data?.companyPhotoUrl || '',
    policeVerificationUrl: data?.policeVerificationUrl || '',
    governmentIdFrontUrl: data?.governmentIdFrontUrl || '',
    governmentIdBackUrl: data?.governmentIdBackUrl || '',
    workingLocation: {
      placeId: loc.placeId || '',
      city: loc.city || data?.city || 'Jaipur',
      area: loc.area || data?.area || 'C Scheme',
      postalCode: loc.postalCode || '302001',
      formattedAddress:
        loc.formattedAddress ||
        data?.formattedAddress ||
        data?.location ||
        `${loc.area || data?.area || 'C Scheme'}, ${loc.city || data?.city || 'Jaipur'}, Rajasthan`,
      latitude: Number(loc.latitude ?? data?.latitude ?? 26.9124),
      longitude: Number(loc.longitude ?? data?.longitude ?? 75.7873),
      serviceRadiusKm: Number(loc.serviceRadiusKm || data?.serviceRadiusKm || 10),
    },
    excludedLocations: Array.isArray(excludedLocations) ? excludedLocations : [],
    services: formattedServices,
  };
};

export default function TherapistDetailInPage({
  therapist: initialTherapist,
  onBack,
  ownerProfile,
  onToggleDuty,
}) {
  const [therapist, setTherapist] = useState(initialTherapist);
  const [loading, setLoading] = useState(false);
  const [togglingDuty, setTogglingDuty] = useState(false);
  const [dutyError, setDutyError] = useState('');
  const [detailLoadError, setDetailLoadError] = useState(null);
  const [previewModalImage, setPreviewModalImage] = useState(null);

  // Available categories for service selection
  const [categories, setCategories] = useState([]);

  // Full-page dossier editor state
  const [isEditPage, setIsEditPage] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccessMsg, setEditSuccessMsg] = useState('');
  const [editForm, setEditForm] = useState(() => getInitialFormData(initialTherapist));

  const photoFileInputRef = useRef(null);

  const openEditPage = () => {
    setEditForm(getInitialFormData(therapist));
    setEditError('');
    setEditSuccessMsg('');
    setIsEditPage(true);
  };

  const therapistId =
    therapist?.id ||
    therapist?.profileId ||
    therapist?.therapistId ||
    therapist?._id ||
    initialTherapist?.id ||
    initialTherapist?.profileId ||
    initialTherapist?.therapistId ||
    initialTherapist?._id;

  // Load available categories for service selection
  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((res) => {
        if (!isMounted) return;
        const list = res?.data || res?.categories || [];
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch categories list:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch complete fresh details from GET /spa-owner/therapists/<ID>
  const fetchDetailedTherapist = async () => {
    if (!therapistId) return;
    setLoading(true);
    setDutyError('');
    setDetailLoadError(null);
    try {
      const res = await getSpaOwnerTherapistById(therapistId);
      if (res?.data || res?.therapist) {
        const full = res.data || res.therapist;
        setTherapist((prev) => ({ ...prev, ...full }));
        setEditForm(getInitialFormData(full));
      }
    } catch (err) {
      console.warn('Could not refresh full therapist dossier:', err);
      setDetailLoadError({
        message: err?.message || 'Could not load the latest therapist details.',
        requestId: err?.data?.meta?.requestId,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (therapistId) {
      fetchDetailedTherapist();
    }
  }, [therapistId]);

  if (!therapist) return null;

  const isDuty = therapist.dutyStatus === 'ON_DUTY';

  // Interactive toggle with dedicated PATCH /spa-owner/therapists/<ID>/duty-status
  const handleToggleDuty = async () => {
    if (!therapistId || togglingDuty) return;
    const nextDuty = isDuty ? 'OFF_DUTY' : 'ON_DUTY';
    setTogglingDuty(true);
    setDutyError('');

    // Optimistic update
    setTherapist((prev) => ({ ...prev, dutyStatus: nextDuty }));
    if (onToggleDuty) {
      onToggleDuty(therapistId, nextDuty);
    }

    try {
      await updateSpaOwnerTherapistDutyStatus(therapistId, nextDuty);
    } catch (err) {
      console.error('Failed to update therapist duty status:', err);
      // Revert on error
      const reverted = isDuty ? 'ON_DUTY' : 'OFF_DUTY';
      setTherapist((prev) => ({ ...prev, dutyStatus: reverted }));
      if (onToggleDuty) {
        onToggleDuty(therapistId, reverted);
      }
      setDutyError(err?.message || 'Failed to sync duty status with server.');
    } finally {
      setTogglingDuty(false);
    }
  };

  // Upload App Avatar Photo
  const handleUploadAppPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setEditError('');

    try {
      const res = await uploadAsset({ file, kind: 'AVATAR' });
      const uploadedUrl = res?.data?.url || res?.data?.assetUrl || res?.url;
      if (uploadedUrl) {
        setEditForm((prev) => ({
          ...prev,
          appPhotoUrl: uploadedUrl,
        }));
      }
    } catch (err) {
      console.error('App photo upload failed:', err);
      setEditError(err?.message || 'Failed to upload photo file.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Language toggle helper
  const handleToggleLanguage = (code) => {
    setEditForm((prev) => {
      const current = prev.languagesSpoken || [];
      const exists = current.includes(code);
      const next = exists ? current.filter((c) => c !== code) : [...current, code];
      return {
        ...prev,
        languagesSpoken: next.length > 0 ? next : ['hi'],
      };
    });
  };

  // Services array management
  const handleAddService = () => {
    const defaultCatId = categories[0]?.id || FALLBACK_CATEGORIES[0].id;
    setEditForm((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          categoryId: defaultCatId,
          durationMinutes: 60,
          basePrice: 1200,
          discountPrice: 1000,
        },
      ],
    }));
  };

  const handleRemoveService = (idx) => {
    if (editForm.services.length <= 1) return;
    setEditForm((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== idx),
    }));
  };

  const handleServiceFieldChange = (idx, field, value) => {
    setEditForm((prev) => {
      const updated = [...prev.services];
      updated[idx] = {
        ...updated[idx],
        [field]:
          field === 'durationMinutes' || field === 'basePrice' || field === 'discountPrice'
            ? Number(value) || 0
            : value,
      };
      return { ...prev, services: updated };
    });
  };

  // Submit PATCH /spa-owner/therapists/<ID>
  const handleSaveEdit = async (e) => {
    e?.preventDefault();
    if (!therapistId || savingEdit) return;
    setSavingEdit(true);
    setEditError('');
    setEditSuccessMsg('');

    try {
      const cleanMobile = String(editForm.mobileNumber || '').replace(/\D/g, '').slice(-10);
      if (cleanMobile.length < 10) {
        throw new Error('Please enter a valid 10-digit mobile number.');
      }
      if (!editForm.displayName?.trim()) {
        throw new Error('Display Name is required.');
      }
      if (!editForm.fullName?.trim()) {
        throw new Error('Full Name is required.');
      }

      const activeCategoryList = categories.length > 0 ? categories : FALLBACK_CATEGORIES;
      const defaultCatId = activeCategoryList[0]?.id || '01M60X6ZE8D0YDWKPT0ENNDD8B';
      const requestedRadius = Number(editForm.workingLocation.serviceRadiusKm) || 10;
      const serviceRadiusKm = [5, 10, 20].includes(requestedRadius)
        ? requestedRadius
        : requestedRadius <= 7
          ? 5
          : requestedRadius <= 15
            ? 10
            : 20;

      const payload = {
        displayName: editForm.displayName.trim(),
        fullName: editForm.fullName.trim(),
        mobileNumber: cleanMobile,
        email: editForm.email?.trim() || undefined,
        gender: editForm.gender || 'FEMALE',
        dateOfBirth: editForm.dateOfBirth || undefined,
        experienceYears: Number(editForm.experienceYears) || 1,
        languagesSpoken:
          editForm.languagesSpoken && editForm.languagesSpoken.length > 0
            ? editForm.languagesSpoken
            : ['hi', 'en'],
        workingLocation: {
          ...(editForm.workingLocation.placeId
            ? { placeId: editForm.workingLocation.placeId }
            : {}),
          city: editForm.workingLocation.city?.trim() || 'Jaipur',
          area: editForm.workingLocation.area?.trim() || 'C Scheme',
          postalCode: String(editForm.workingLocation.postalCode || '302001').trim(),
          formattedAddress:
            editForm.workingLocation.formattedAddress?.trim() ||
            `${editForm.workingLocation.area?.trim() || 'C Scheme'}, ${editForm.workingLocation.city?.trim() || 'Jaipur'}, Rajasthan`,
          latitude: Number(editForm.workingLocation.latitude) || 26.9124,
          longitude: Number(editForm.workingLocation.longitude) || 75.7873,
          serviceRadiusKm,
        },
        excludedWorkAreas: (editForm.excludedLocations || []).map((item, index) => {
          const area = typeof item === 'string' ? { name: item } : item || {};
          return {
            placeId: area.placeId || `EXCLUDED_PLACE_${index + 1}`,
            name: area.name || 'Excluded Area',
            latitude: Number(area.latitude ?? area.lat ?? 26.95),
            longitude: Number(area.longitude ?? area.lng ?? 75.8),
            radiusKm: Number(area.radiusKm ?? area.radius ?? 2),
          };
        }),
        companyPhotoUrl: editForm.companyPhotoUrl || undefined,
        appPhotoUrl: editForm.appPhotoUrl?.trim() || undefined,
        policeVerificationUrl: editForm.policeVerificationUrl || undefined,
        governmentIdFrontUrl: editForm.governmentIdFrontUrl || undefined,
        governmentIdBackUrl: editForm.governmentIdBackUrl || undefined,
        services: (editForm.services || []).map((s) => ({
          categoryId: s.categoryId || defaultCatId,
          durationMinutes: Number(s.durationMinutes) || 60,
          basePrice: Number(s.basePrice) || 1200,
          discountPrice: Number(s.discountPrice) || 1000,
        })),
      };

      const res = await updateSpaOwnerTherapist(therapistId, payload);

      // If duty status changed inside the modal, also sync via dedicated duty-status endpoint
      if (editForm.dutyStatus && editForm.dutyStatus !== therapist.dutyStatus) {
        try {
          await updateSpaOwnerTherapistDutyStatus(therapistId, editForm.dutyStatus);
          if (onToggleDuty) {
            onToggleDuty(therapistId, editForm.dutyStatus);
          }
        } catch (dutyErr) {
          console.warn('Duty status sub-endpoint warning:', dutyErr);
        }
      }

      setEditSuccessMsg('Therapist dossier updated successfully!');
      const updatedData = res?.data || payload;

      setTherapist((prev) => ({
        ...prev,
        ...updatedData,
        workingLocation: payload.workingLocation,
        excludedWorkAreas: payload.excludedWorkAreas,
        services: payload.services,
        languagesSpoken: payload.languagesSpoken,
        appPhotoUrl: payload.appPhotoUrl || prev.appPhotoUrl,
        avatarUrl: payload.appPhotoUrl || prev.avatarUrl,
        dutyStatus: editForm.dutyStatus,
      }));

      setTimeout(() => {
        setIsEditPage(false);
        setEditSuccessMsg('');
      }, 1200);
    } catch (err) {
      setEditError(err?.message || 'Failed to update therapist. Please check values.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Resolve best profile picture
  const profilePhotoSrc = resolveMediaUrl(
    therapist.avatarUrl ||
    therapist.appPhotoUrl ||
    therapist.companyPhotoUrl ||
    therapist.profilePhoto
  );

  // Fallback initial monogram
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    therapist.fullName || therapist.displayName || 'Therapist'
  )}&background=F35271&color=fff&size=240`;

  // Resolved KYC Document URLs
  const govtIdFrontUrl = resolveMediaUrl(
    therapist.governmentIdFrontUrl ||
    therapist.kyc?.frontAssetId ||
    therapist.documents?.governmentIdDocumentAssetId ||
    therapist.documents?.aadhaarFrontAssetId
  );

  const govtIdBackUrl = resolveMediaUrl(
    therapist.governmentIdBackUrl ||
    therapist.kyc?.backAssetId ||
    therapist.documents?.aadhaarBackAssetId
  );

  const policeDocUrl = resolveMediaUrl(
    therapist.policeVerificationUrl ||
    therapist.documents?.policeVerificationAssetId
  );

  const professionalCertUrl = resolveMediaUrl(
    therapist.documents?.professionalCertificateAssetId
  );

  const appPhotoUrl = resolveMediaUrl(therapist.appPhotoUrl || therapist.avatarUrl);
  const companyPhotoUrl = resolveMediaUrl(therapist.companyPhotoUrl);

  const workingLocation = therapist.workingLocation || {};
  const formattedAddress =
    workingLocation.formattedAddress ||
    therapist.formattedAddress ||
    `${therapist.area ? `${therapist.area}, ` : ''}${therapist.city || 'Jaipur'}`;

  const serviceRadius =
    workingLocation.serviceRadiusKm ||
    therapist.serviceRadiusKm ||
    10;

  return (
    <div className="space-y-6">
      {detailLoadError && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5 text-xs">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold">
                Could not refresh the latest therapist details. Showing the available profile data instead.
              </p>
              <p className="mt-1">{detailLoadError.message}</p>
              {detailLoadError.requestId && (
                <p className="mt-1 text-[11px]">Request ID: {detailLoadError.requestId}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={fetchDetailedTherapist}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </div>
      )}
      {!isEditPage && (
        <>
      {/* Top Header & Breadcrumb Bar */}
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
                {therapist.fullName || therapist.displayName}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-[#F35271] border border-rose-200">
                Therapist Dossier
              </span>
            </div>
            <p className="text-xs text-[#757880]">
              Spa Code: <strong className="font-mono text-[#F35271]">{therapist.spaCode || ownerProfile?.spaCode || 'SPA'}</strong> • ID: <span className="font-mono text-gray-700">{therapistId}</span>
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            type="button"
            onClick={fetchDetailedTherapist}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Reload Therapist Data from Server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F35271]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={openEditPage}
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs border border-gray-200 bg-white hover:bg-gray-50 text-[#0D0D12]"
          >
            <Edit2 className="w-3.5 h-3.5 text-gray-500" />
            <span>Edit Dossier</span>
          </button>

          {/* Duty Status Switch with PATCH */}
          <button
            type="button"
            onClick={handleToggleDuty}
            disabled={togglingDuty}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs border ${
              isDuty
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
            title="Click to toggle therapist live duty status"
          >
            {togglingDuty ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F35271]" />
            ) : (
              <span className={`w-2.5 h-2.5 rounded-full ${isDuty ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            )}
            <span>{isDuty ? 'ON DUTY (Active)' : 'OFF DUTY (Paused)'}</span>
          </button>
        </div>
      </div>

      {dutyError && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{dutyError}</span>
          </div>
          <button type="button" onClick={() => setDutyError('')} className="p-1 hover:bg-rose-100 rounded-lg">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main 2-Column Responsive Dossier Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Portrait & Identity Hero */}
        <div className="space-y-6">
          {/* Identity Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs text-center space-y-4 relative overflow-hidden">
            <div className="h-2 absolute top-0 left-0 right-0 bg-gradient-to-r from-rose-400 via-[#F35271] to-amber-400" />

            <div className="relative inline-block mx-auto pt-2">
              <img
                src={profilePhotoSrc || fallbackAvatar}
                alt={therapist.fullName || therapist.displayName}
                className="w-24 h-24 rounded-3xl object-cover mx-auto border-3 border-white shadow-md ring-2 ring-rose-100 cursor-pointer hover:opacity-95"
                onClick={() => {
                  if (profilePhotoSrc) setPreviewModalImage(profilePhotoSrc);
                }}
                onError={(e) => {
                  if (companyPhotoUrl && e.target.src !== companyPhotoUrl) {
                    e.target.src = companyPhotoUrl;
                  } else {
                    e.target.onerror = null;
                    e.target.src = fallbackAvatar;
                  }
                }}
              />
              <span
                className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] ${
                  isDuty ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'
                }`}
                title={isDuty ? 'On Duty' : 'Off Duty'}
              >
                ●
              </span>
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-[#0D0D12] flex items-center justify-center gap-1.5">
                <span>{therapist.fullName || therapist.displayName}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h4>
              <p className="text-xs text-[#757880] mt-0.5">
                {therapist.gender || 'FEMALE'} • {therapist.experienceYears || 4} Years Certified Experience
              </p>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xs mt-1">
                ★ {therapist.ratingSummary?.average > 0 ? therapist.ratingSummary.average.toFixed(1) : '4.9'}
                <span className="text-gray-400 font-normal">
                  ({therapist.jobsCompleted || therapist.ratingSummary?.count || 24} Appointments)
                </span>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2 text-xs">
              {(therapist.phone || therapist.mobileNumber) && (
                <a
                  href={`tel:${therapist.phone || therapist.mobileNumber}`}
                  className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#0D0D12] font-semibold flex items-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F35271]" />
                  <span>{therapist.phone || therapist.mobileNumber}</span>
                </a>
              )}

              {therapist.email && (
                <a
                  href={`mailto:${therapist.email}`}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition"
                  title={therapist.email}
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Status Strip */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Status</span>
                <span className="font-extrabold text-emerald-700">{therapist.status || 'ACTIVE'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Radius</span>
                <span className="font-extrabold text-[#0D0D12]">{serviceRadius} KM</span>
              </div>
              {therapist.dateOfBirth && (
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 col-span-2 text-left">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">Date of Birth</span>
                  <span className="font-bold text-[#0D0D12] flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-[#F35271]" />
                    <span>{therapist.dateOfBirth}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Original Registered Photos (App Profile & Company Badge) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-bold text-[#0D0D12] uppercase tracking-wider text-[11px] text-rose-600 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#F35271]" />
                <span>Original Registered Photos</span>
              </h4>
              <span className="text-[10px] font-bold text-gray-400">Synced</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* 1. App Customer Photo */}
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 text-center space-y-2">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block flex items-center justify-center gap-1">
                  <Smartphone className="w-3 h-3 text-[#F35271]" />
                  <span>Customer App Photo</span>
                </span>
                <div
                  className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-gray-200 shadow-2xs relative group cursor-pointer"
                  onClick={() => {
                    if (appPhotoUrl) setPreviewModalImage(appPhotoUrl);
                  }}
                >
                  <img
                    src={appPhotoUrl || fallbackAvatar}
                    alt="App Profile Photo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackAvatar;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Zoom</span>
                  </div>
                </div>
              </div>

              {/* 2. Company / Official Photo */}
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 text-center space-y-2">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block flex items-center justify-center gap-1">
                  <User className="w-3 h-3 text-emerald-600" />
                  <span>Company Official ID</span>
                </span>
                <div
                  className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-gray-200 shadow-2xs relative group cursor-pointer"
                  onClick={() => {
                    if (companyPhotoUrl) setPreviewModalImage(companyPhotoUrl);
                  }}
                >
                  <img
                    src={companyPhotoUrl || fallbackAvatar}
                    alt="Company Official Photo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackAvatar;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Zoom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KYC Documents Assets Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-bold text-[#0D0D12] uppercase tracking-wider text-[11px] text-rose-600">
                KYC Verification Files
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {therapist.kyc?.status || 'VERIFIED'}
              </span>
            </div>

            <div className="space-y-3">
              {/* Government ID Front */}
              {govtIdFrontUrl && (
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0 cursor-pointer shadow-2xs hover:ring-2 hover:ring-rose-400 transition"
                      onClick={() => setPreviewModalImage(govtIdFrontUrl)}
                      title="Click to zoom ID Front"
                    >
                      <img
                        src={govtIdFrontUrl}
                        alt="Govt ID Front"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-gray-500 block font-semibold">Government ID Front</span>
                      <span className="font-bold text-[#0D0D12] truncate block">
                        {therapist.kyc?.idType || 'AADHAAR'}: {therapist.kyc?.idMasked || '•••• Verified'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewModalImage(govtIdFrontUrl)}
                    className="p-1.5 px-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-[#F35271] text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#F35271]" />
                    <span>View</span>
                  </button>
                </div>
              )}

              {/* ID Back Asset */}
              {govtIdBackUrl && (
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0 cursor-pointer shadow-2xs hover:ring-2 hover:ring-rose-400 transition"
                      onClick={() => setPreviewModalImage(govtIdBackUrl)}
                      title="Click to zoom ID Back"
                    >
                      <img
                        src={govtIdBackUrl}
                        alt="ID Back"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-gray-500 block font-semibold">Government ID Back</span>
                      <span className="font-bold text-[#0D0D12] truncate block">Address & QR Side</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewModalImage(govtIdBackUrl)}
                    className="p-1.5 px-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-[#F35271] text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#F35271]" />
                    <span>View</span>
                  </button>
                </div>
              )}

              {/* Police Verification */}
              {policeDocUrl && (
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0 cursor-pointer shadow-2xs hover:ring-2 hover:ring-rose-400 transition flex items-center justify-center bg-emerald-50 text-emerald-700"
                      onClick={() => setPreviewModalImage(policeDocUrl)}
                    >
                      <img
                        src={policeDocUrl}
                        alt="Police clearance"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-gray-500 block font-semibold">Police Clearance</span>
                      <span className="font-bold text-emerald-700 truncate block">Clearance Certificate</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewModalImage(policeDocUrl)}
                    className="p-1.5 px-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-[#F35271] text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View</span>
                  </button>
                </div>
              )}

              {/* Professional Certificate */}
              {professionalCertUrl && (
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-gray-500 block font-semibold">Spa Certification</span>
                    <span className="font-bold text-purple-700">Professional Diploma</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewModalImage(professionalCertUrl)}
                    className="p-1.5 px-2.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[#F35271] text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Payout Settlement Account Status */}
          {therapist.payoutAccount && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h4 className="font-bold text-[#0D0D12] uppercase tracking-wider text-[11px] text-rose-600 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#F35271]" />
                  <span>Therapist Payout Account</span>
                </h4>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {therapist.payoutAccount.status || 'PENDING'}
                </span>
              </div>
              <div className="space-y-1 text-gray-600">
                <p>
                  Holder: <strong className="text-[#0D0D12]">{therapist.payoutAccount.accountHolderName || therapist.fullName}</strong>
                </p>
                {therapist.payoutAccount.upiId && (
                  <p>UPI ID: <span className="font-mono text-gray-800">{therapist.payoutAccount.upiId}</span></p>
                )}
                {therapist.payoutAccount.ifsc && (
                  <p>IFSC: <span className="font-mono text-gray-800">{therapist.payoutAccount.ifsc}</span></p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Complete Professional Portfolio (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bio & Spoken Languages */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-bold text-[#0D0D12] uppercase tracking-wider text-[11px] text-rose-600">
                Practitioner Bio & Language Proficiencies
              </h4>
              <button
                type="button"
                onClick={openEditPage}
                className="text-[11px] text-[#F35271] font-bold hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Bio</span>
              </button>
            </div>

            <p className="text-gray-700 leading-relaxed font-medium">
              {therapist.bio || 'Certified wellness massage therapist with specialized holistic training in Swedish massage, deep tissue relaxation and bespoke Ayurvedic treatments.'}
            </p>

            {/* Languages Spoken (ISO-639-1) */}
            <div className="pt-3 border-t border-gray-100">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Languages Spoken (ISO-639-1)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(therapist.languagesSpoken)
                  ? therapist.languagesSpoken
                  : (therapist.languagesSpoken || 'hi, en').split(',')
                ).map((lang, lIdx) => (
                  <span
                    key={lIdx}
                    className="px-3 py-1 rounded-xl bg-rose-50 text-[#F35271] font-bold text-xs border border-rose-100 shadow-2xs"
                  >
                    🗣️ {lang.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Specializations */}
            {therapist.specializations && therapist.specializations.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Specialized Therapies & Modalities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(therapist.specializations)
                    ? therapist.specializations
                    : String(therapist.specializations).split(',')
                  ).map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100 shadow-2xs"
                    >
                      ✨ {String(spec).trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location & Coverage */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-bold text-[#0D0D12] uppercase tracking-wider text-[11px] text-rose-600">
                Base Working Location & Coverage Area
              </h4>
              <span className="text-gray-500 text-[11px]">
                Radius: <strong className="text-[#0D0D12]">{serviceRadius} km</strong>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F35271] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0D0D12] block">
                    {therapist.area || workingLocation.area ? `${therapist.area || workingLocation.area}, ` : ''}{therapist.city || workingLocation.city || 'Jaipur'}
                    {workingLocation.postalCode ? ` - ${workingLocation.postalCode}` : ''}
                  </span>
                  <span className="text-gray-500 text-[11px] block mt-0.5">
                    {formattedAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Excluded Work Areas (No-Service Zones) */}
            {therapist.excludedWorkAreas && therapist.excludedWorkAreas.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Excluded Work Areas (Excluded Coverage Zones)
                </span>
                <div className="flex flex-wrap gap-2">
                  {therapist.excludedWorkAreas.map((area, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200 shadow-2xs flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{area.name}</span>
                      <span className="text-[10px] font-normal text-amber-700">({area.radiusKm} km radius)</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Assigned Services Catalogue */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-bold text-[#0D0D12] uppercase tracking-wider text-[11px] text-rose-600">
                Offered Spa Services ({therapist.services?.length || 0})
              </h4>
              <span className="text-gray-500 text-[11px]">Instant Booking Enabled</span>
            </div>

            <div className="space-y-2.5">
              {(therapist.services && therapist.services.length > 0
                ? therapist.services
                : [
                    {
                      name: 'Swedish Massage',
                      durationMinutes: 60,
                      discountPrice: 999,
                      basePrice: 1200,
                      description: 'Specialized wellness therapy session.',
                      status: 'ACTIVE',
                    },
                  ]
              ).map((srv, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3.5 rounded-2xl border border-gray-150 bg-gray-50/70 hover:bg-gray-50 transition flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-[#0D0D12] text-xs">{srv.name}</h5>
                      {srv.categoryName && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.2 rounded border border-rose-100">
                          {srv.categoryName}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {srv.durationMinutes || 60} mins duration {srv.description ? `• ${srv.description}` : ''}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-[#F35271] block">
                      ₹{srv.discountPrice || srv.basePrice}
                    </span>
                    {srv.discountPrice && srv.basePrice && srv.discountPrice < srv.basePrice && (
                      <span className="text-[10px] text-gray-400 line-through block">
                        ₹{srv.basePrice}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-[#0D0D12] text-white text-xs font-bold hover:bg-gray-800 transition cursor-pointer shadow-xs"
            >
              Return to Fleet Roster
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {previewModalImage && (
        <div
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            className="relative max-w-3xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewModalImage}
              alt="Enlarged Document or Photo"
              className="w-full h-full object-contain max-h-[80vh] mx-auto"
            />
            <button
              type="button"
              onClick={() => setPreviewModalImage(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
        </>
      )}

      {/* Full-page therapist dossier editor */}
      {isEditPage && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditPage(false)}
                className="p-2.5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 transition cursor-pointer shadow-2xs flex items-center gap-1.5 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dossier</span>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-[#0D0D12]">Edit Therapist Dossier</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-[#F35271] border border-rose-200">
                    Therapist Profile
                  </span>
                </div>
                <p className="text-xs text-[#757880]">
                  Update profile, services, working location, and coverage for {therapist.displayName || therapist.fullName}.
                </p>
              </div>
            </div>
          </div>

            {/* Notifications */}
            {editError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 shrink-0">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="font-medium">{editError}</span>
              </div>
            )}

            {editSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shrink-0">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-bold">{editSuccessMsg}</span>
              </div>
            )}

            {/* Full-page Form Body */}
            <form onSubmit={handleSaveEdit} className="space-y-8 text-xs">

              {/* 1. Basic Identity & Contact Details */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 text-[#0D0D12] font-bold">
                  <User className="w-4 h-4 text-[#F35271]" />
                  <span>1. Identity & Contact Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Display / Booking Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.displayName}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, displayName: e.target.value }))}
                      placeholder="e.g. Pooja Verma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.fullName}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="e.g. Pooja Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Mobile Number (10 Digits) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={editForm.mobileNumber}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. pooja@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={editForm.experienceYears}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, experienceYears: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Gender</label>
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] outline-hidden"
                    >
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={editForm.dateOfBirth}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Customer App Photo with Upload / URL */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-[#0D0D12] font-bold">
                    <Camera className="w-4 h-4 text-[#F35271]" />
                    <span>3. Customer Facing App Photo</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">appPhotoUrl</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview */}
                  <div className="relative shrink-0">
                    <img
                      src={editForm.appPhotoUrl || fallbackAvatar}
                      alt="App Photo Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-rose-100 bg-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackAvatar;
                      }}
                    />
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center text-white">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Upload & URL Controls */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={editForm.appPhotoUrl}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, appPhotoUrl: e.target.value }))}
                        placeholder="https://example.com/pooja.jpg"
                        className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] outline-hidden"
                      />
                      <input
                        ref={photoFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadAppPhoto}
                      />
                      <button
                        type="button"
                        disabled={uploadingPhoto}
                        onClick={() => photoFileInputRef.current?.click()}
                        className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-[#0D0D12] font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition"
                      >
                        {uploadingPhoto ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F35271]" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-[#F35271]" />
                        )}
                        <span>{uploadingPhoto ? 'Uploading...' : 'Upload'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Upload directly to TherapyShala media storage or enter an image URL.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Languages Spoken */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-[#0D0D12] font-bold">
                    <Globe className="w-4 h-4 text-[#F35271]" />
                    <span>4. Languages Spoken</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">
                    [{editForm.languagesSpoken.join(', ')}]
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {COMMON_LANGUAGES.map((lang) => {
                    const isSelected = editForm.languagesSpoken.includes(lang.code);
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleToggleLanguage(lang.code)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                          isSelected
                            ? 'bg-rose-50 text-[#F35271] border-rose-300 shadow-2xs'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span>{lang.label}</span>
                        <span className="text-[10px] uppercase font-mono opacity-60">({lang.code})</span>
                        {isSelected && <Check className="w-3 h-3 text-[#F35271]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Working Location & Coverage Area */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 text-[#0D0D12] font-bold">
                    <MapPin className="w-4 h-4 text-[#F35271]" />
                    <span>5. Working Location & Coverage Area</span>
                </div>

                <GoogleLocationPicker
                  value={{
                    ...editForm.workingLocation,
                    excludedLocations: editForm.excludedLocations,
                  }}
                  onChange={(updatedLocation) => {
                    const {
                      excludedLocations,
                      excludedWorkAreas,
                      ...workingLocation
                    } = updatedLocation;
                    setEditForm((prev) => ({
                      ...prev,
                      workingLocation,
                      excludedLocations:
                        excludedLocations ?? excludedWorkAreas ?? prev.excludedLocations,
                    }));
                  }}
                />
              </div>

              {/* 5. Offered Services Array */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-[#0D0D12] font-bold">
                    <Briefcase className="w-4 h-4 text-[#F35271]" />
                    <span>6. Offered Spa Services ({editForm.services.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-2.5 py-1 rounded-xl bg-rose-50 text-[#F35271] hover:bg-rose-100 font-bold text-xs flex items-center gap-1 cursor-pointer transition border border-rose-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {editForm.services.map((srv, idx) => {
                    const activeCatList = categories.length > 0 ? categories : FALLBACK_CATEGORIES;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-700">Service #{idx + 1}</span>
                          {editForm.services.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveService(idx)}
                              className="p-1 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                              title="Remove service"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                          {/* Category Selector */}
                          <div className="sm:col-span-2">
                            <label className="text-[11px] font-bold text-gray-600 block mb-1">
                              Therapy Category
                            </label>
                            <select
                              value={srv.categoryId}
                              onChange={(e) => handleServiceFieldChange(idx, 'categoryId', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] outline-hidden truncate"
                            >
                              {activeCatList.map((cat) => (
                                <option key={cat.id || cat._id} value={cat.id || cat._id}>
                                  {cat.name} ({cat.id || cat._id})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Duration Minutes */}
                          <div>
                            <label className="text-[11px] font-bold text-gray-600 block mb-1">
                              Duration
                            </label>
                            <select
                              value={srv.durationMinutes}
                              onChange={(e) => handleServiceFieldChange(idx, 'durationMinutes', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] outline-hidden"
                            >
                              <option value={30}>30 mins</option>
                              <option value={45}>45 mins</option>
                              <option value={60}>60 mins</option>
                              <option value={90}>90 mins</option>
                              <option value={120}>120 mins</option>
                            </select>
                          </div>

                          {/* Base Price & Discount Price */}
                          <div className="grid grid-cols-2 gap-1.5">
                            <div>
                              <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                Base (₹)
                              </label>
                              <input
                                type="number"
                                min="100"
                                value={srv.basePrice}
                                onChange={(e) => handleServiceFieldChange(idx, 'basePrice', e.target.value)}
                                className="w-full px-2.5 py-2 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] outline-hidden"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-gray-600 block mb-1">
                                Offer (₹)
                              </label>
                              <input
                                type="number"
                                min="100"
                                value={srv.discountPrice}
                                onChange={(e) => handleServiceFieldChange(idx, 'discountPrice', e.target.value)}
                                className="w-full px-2.5 py-2 rounded-xl border border-gray-200 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F35271] outline-hidden text-[#F35271] font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. KYC Compliance Notice (Protected) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    KYC Verification Files are Locked & Protected
                  </span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Government ID Front/Back and Police Clearance documents are verified for regulatory compliance and cannot be modified here.
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-gray-150 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setIsEditPage(false)}
                  disabled={savingEdit}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-6 py-2.5 rounded-xl bg-[#F35271] hover:bg-[#D93D5C] text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
        </div>
      )}
    </div>
  );
}
