import React from 'react';
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
  ShieldCheck,
  CreditCard,
  Building2,
  Phone,
  Mail,
  User,
  Calendar,
  Award,
} from 'lucide-react';
import LanguageSelect from '../LanguageSelect';
import GoogleLocationPicker from '../GoogleLocationPicker';

export default function TherapistOnboardingInPage({
  formData,
  setFormData,
  onboardLoading,
  onboardError,
  setOnboardError,
  onboardSuccessData,
  setOnboardSuccessData,
  handleOnboardSubmit,
  handleFileUpload,
  uploadingField,
  getSampleTherapistData,
  onBack,
  ownerProfile,
}) {
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
                In-Page Full Form
              </span>
            </div>
            <p className="text-xs text-[#757880]">
              Provision credentials, KYC documents, service portfolio & mobile OTP login access for {ownerProfile?.spaCode || 'your spa'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setFormData(getSampleTherapistData());
              if (setOnboardError) setOnboardError('');
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Auto-fill sample test data"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>⚡ Auto-Fill Sample (Pooja Verma)</span>
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {onboardError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between shadow-2xs">
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

      {/* Success In-Page Screen */}
      {onboardSuccessData ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-200 shadow-sm space-y-6 max-w-2xl mx-auto my-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl font-extrabold text-[#0D0D12]">
              Therapist Onboarded Successfully!
            </h4>
            <p className="text-sm text-[#757880]">
              Account created and linked to <strong className="text-[#0D0D12]">{onboardSuccessData.fullName}</strong>.
            </p>
          </div>

          {onboardSuccessData.loginInstructions && (
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 text-left space-y-2 shadow-2xs">
              <span className="font-bold flex items-center gap-1.5 text-sm text-[#F35271]">
                📱 Mobile App Login Credentials:
              </span>
              <p className="leading-relaxed font-medium">
                {onboardSuccessData.loginInstructions}
              </p>
            </div>
          )}

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-2xl bg-[#0D0D12] text-white text-xs font-bold hover:bg-gray-800 transition cursor-pointer shadow-md"
            >
              Done & Return to Fleet Roster
            </button>
          </div>
        </div>
      ) : (
        /* Full In-Page Form */
        <form onSubmit={handleOnboardSubmit} className="space-y-8">
          
          {/* SECTION 1: Personal & Contact Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-[#0D0D12] text-sm">
                    Personal & Contact Profile
                  </h4>
                  <p className="text-[11px] text-[#757880]">Full legal identity, languages, and professional background</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0D0D12] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Pooja Verma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0D0D12] mb-1">
                  Mobile Number (10 digits) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0D0D12] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="pooja.verma@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0D0D12] mb-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white cursor-pointer"
                >
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0D0D12] mb-1">
                  Date of Birth (DD/MM/YYYY) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    placeholder="15/08/1995"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0D0D12] mb-1">
                  Experience in Years <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    placeholder="3"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                  />
                </div>
              </div>
            </div>

            {/* ISO-639-1 Language Selector Component */}
            <div className="pt-2">
              <LanguageSelect
                value={formData.languagesSpoken}
                onChange={(langs) => setFormData((prev) => ({ ...prev, languagesSpoken: langs }))}
              />
            </div>

            {/* Specializations & Bio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <label className="block font-semibold text-[#0D0D12] mb-1">Specializations</label>
                <input
                  type="text"
                  value={formData.specializations}
                  onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                  placeholder="e.g. Swedish Massage, Deep Tissue, Aromatherapy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D0D12] mb-1">Demo Video URL (Optional)</label>
                <input
                  type="url"
                  value={formData.demoVideoUrl}
                  onChange={(e) => setFormData({ ...formData, demoVideoUrl: e.target.value })}
                  placeholder="https://example.com/demo.mp4"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#0D0D12] mb-1">Therapist Bio</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Certified massage practitioner with extensive experience in luxury holistic wellness..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white resize-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Location & Address with Google Maps */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-[#0D0D12] text-sm">
                    Location, Address & Google Maps Coverage
                  </h4>
                  <p className="text-[11px] text-[#757880]">Google Places search, interactive map pin, coordinates & service radius</p>
                </div>
              </div>

              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Google Maps Verified
              </span>
            </div>

            <GoogleLocationPicker
              value={formData}
              onChange={(updatedLocation) =>
                setFormData((prev) => ({ ...prev, ...updatedLocation }))
              }
            />
          </div>

          {/* SECTION 3: KYC Verification & Documents */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-[#0D0D12] text-sm">
                    KYC Verification & Document Assets
                  </h4>
                  <p className="text-[11px] text-[#757880]">Government identity, police clearance and certifications</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Profile Avatar */}
              <div className="p-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 flex flex-col justify-between">
                <div>
                  <label className="block font-bold text-[#0D0D12] mb-1">Profile Avatar</label>
                  <p className="text-[10px] text-gray-500 mb-3">High resolution front-facing portrait photo</p>
                </div>
                <div className="flex items-center gap-3">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover border" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500">📷</div>
                  )}
                  <label className="px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-xs hover:bg-gray-100 cursor-pointer flex items-center gap-1.5 shadow-2xs">
                    {uploadingField === 'avatarUrl' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F35271]" />
                    ) : (
                      <UploadCloud className="w-3.5 h-3.5" />
                    )}
                    <span>Upload Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'avatarUrl', 'AVATAR')}
                    />
                  </label>
                </div>
              </div>

              {/* Aadhaar / PAN Front */}
              <div className="p-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 flex flex-col justify-between">
                <div>
                  <label className="block font-bold text-[#0D0D12] mb-1">Government ID (Front)</label>
                  <p className="text-[10px] text-gray-500 mb-3">Front side of Aadhaar, PAN or Passport</p>
                </div>
                <label className="px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-xs hover:bg-gray-100 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs w-full">
                  {uploadingField === 'frontAssetId' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F35271]" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5" />
                  )}
                  <span>{formData.frontAssetId ? 'ID Front Attached ✓' : 'Upload ID Front'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'frontAssetId', 'KYC_FRONT')}
                  />
                </label>
              </div>

              {/* Aadhaar / PAN Back */}
              <div className="p-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 flex flex-col justify-between">
                <div>
                  <label className="block font-bold text-[#0D0D12] mb-1">Government ID (Back)</label>
                  <p className="text-[10px] text-gray-500 mb-3">Back side with residential address</p>
                </div>
                <label className="px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-xs hover:bg-gray-100 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs w-full">
                  {uploadingField === 'backAssetId' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F35271]" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5" />
                  )}
                  <span>{formData.backAssetId ? 'ID Back Attached ✓' : 'Upload ID Back'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'backAssetId', 'KYC_BACK')}
                  />
                </label>
              </div>

              {/* Police Clearance */}
              <div className="p-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 flex flex-col justify-between">
                <div>
                  <label className="block font-bold text-[#0D0D12] mb-1">Police Clearance (Optional)</label>
                  <p className="text-[10px] text-gray-500 mb-3">Background check verification document</p>
                </div>
                <label className="px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-xs hover:bg-gray-100 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs w-full">
                  {uploadingField === 'policeVerification' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F35271]" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5" />
                  )}
                  <span>{formData.policeVerification ? 'Clearance Attached ✓' : 'Upload Clearance'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'policeVerification', 'SUPPORT_ATTACHMENT')}
                  />
                </label>
              </div>

              {/* Professional Certificate */}
              <div className="p-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 flex flex-col justify-between sm:col-span-2">
                <div>
                  <label className="block font-bold text-[#0D0D12] mb-1">Professional Spa Certificate</label>
                  <p className="text-[10px] text-gray-500 mb-3">Certified massage or holistic wellness training credential</p>
                </div>
                <label className="px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-xs hover:bg-gray-100 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs w-full">
                  {uploadingField === 'professionalCertificate' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F35271]" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5" />
                  )}
                  <span>{formData.professionalCertificate ? 'Certificate Attached ✓' : 'Upload Certificate'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'professionalCertificate', 'SUPPORT_ATTACHMENT')}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 4: Payout & Bank Account Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-[#0D0D12] text-sm">
                    Therapist Payout & Settlement Account
                  </h4>
                  <p className="text-[11px] text-[#757880]">Direct bank transfer and UPI details for service disbursements</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-[#0D0D12] mb-1">Beneficiary Name</label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  placeholder="e.g. Pooja Verma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D0D12] mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="123456789012"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D0D12] mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                  placeholder="HDFC0001234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D0D12] mb-1">UPI ID (VPA)</label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="pooja@okhdfcbank"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: Assigned Services */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#F35271] flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-bold text-[#0D0D12] text-sm">
                    Assigned Therapy Services Portfolio
                  </h4>
                  <p className="text-[11px] text-[#757880]">Define service catalogue, durations, and pricing</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const currentServices = formData.services || [];
                  setFormData({
                    ...formData,
                    services: [
                      ...currentServices,
                      {
                        name: 'Deep Tissue Massage',
                        description: 'Specialized firm pressure massage',
                        basePrice: 1500,
                        discountPrice: 1299,
                        durationMinutes: 60,
                      },
                    ],
                  });
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#F35271] font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Service</span>
              </button>
            </div>

            <div className="space-y-3">
              {(formData.services || []).map((srv, srvIdx) => (
                <div
                  key={srvIdx}
                  className="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end"
                >
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-[#0D0D12] mb-1">Service Name *</label>
                    <input
                      type="text"
                      required
                      value={srv.name}
                      onChange={(e) => {
                        const next = [...formData.services];
                        next[srvIdx].name = e.target.value;
                        setFormData({ ...formData, services: next });
                      }}
                      placeholder="Full Body Massage"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0D0D12] mb-1">Duration (Mins) *</label>
                    <input
                      type="number"
                      required
                      value={srv.durationMinutes}
                      onChange={(e) => {
                        const next = [...formData.services];
                        next[srvIdx].durationMinutes = Number(e.target.value);
                        setFormData({ ...formData, services: next });
                      }}
                      placeholder="60"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium bg-white text-center font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0D0D12] mb-1">Discount Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={srv.discountPrice}
                      onChange={(e) => {
                        const next = [...formData.services];
                        next[srvIdx].discountPrice = Number(e.target.value);
                        setFormData({ ...formData, services: next });
                      }}
                      placeholder="999"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-bold text-rose-600 bg-white text-center font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block font-semibold text-[#0D0D12] mb-1">Base Price (₹)</label>
                      <input
                        type="number"
                        value={srv.basePrice}
                        onChange={(e) => {
                          const next = [...formData.services];
                          next[srvIdx].basePrice = Number(e.target.value);
                          setFormData({ ...formData, services: next });
                        }}
                        placeholder="1200"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none font-medium text-gray-500 bg-white text-center font-mono"
                      />
                    </div>
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = formData.services.filter((_, idx) => idx !== srvIdx);
                          setFormData({ ...formData, services: next });
                        }}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition cursor-pointer"
                        title="Remove service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                  <span>Provisioning Therapist Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Provision & Onboard Therapist</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
