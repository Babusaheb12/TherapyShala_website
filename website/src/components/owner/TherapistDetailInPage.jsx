import React from 'react';
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
} from 'lucide-react';

export default function TherapistDetailInPage({
  therapist,
  onBack,
  ownerProfile,
  onToggleDuty,
}) {
  if (!therapist) return null;

  const isDuty = therapist.dutyStatus === 'ON_DUTY';

  return (
    <div className="space-y-6">
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
                {therapist.fullName}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-[#F35271] border border-rose-200">
                Therapist Dossier
              </span>
            </div>
            <p className="text-xs text-[#757880]">
              Spa Code: <strong className="font-mono text-[#F35271]">{therapist.spaCode || ownerProfile?.spaCode || 'SPA'}</strong> • ID: <span className="font-mono">{therapist.id || therapist.profileId || 'TH-001'}</span>
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleDuty && onToggleDuty(therapist.id || therapist.profileId)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs border ${
              isDuty
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDuty ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isDuty ? 'ON DUTY (Active)' : 'OFF DUTY (Paused)'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Dossier Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Portrait & Identity Hero */}
        <div className="space-y-6">
          {/* Identity Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs text-center space-y-4 relative overflow-hidden">
            <div className="h-2 absolute top-0 left-0 right-0 bg-gradient-to-r from-rose-400 via-[#F35271] to-amber-400" />

            <div className="relative inline-block mx-auto pt-2">
              <img
                src={
                  therapist.avatarUrl ||
                  'https://res.cloudinary.com/therapyshala/image/upload/v1/therapists/avatar.jpg'
                }
                alt={therapist.fullName}
                className="w-24 h-24 rounded-3xl object-cover mx-auto border-3 border-white shadow-md ring-2 ring-rose-100"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80';
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
                <span>{therapist.fullName}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h4>
              <p className="text-xs text-[#757880] mt-0.5">
                {therapist.gender || 'FEMALE'} • {therapist.experienceYears || 3} Years Certified Experience
              </p>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xs mt-1">
                ★ 4.9 <span className="text-gray-400 font-normal">({therapist.jobsCompleted || 24} Appointments)</span>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-2 text-xs">
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
                <span className="font-extrabold text-[#0D0D12]">{therapist.serviceRadiusKm || 10} KM</span>
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
                Verified
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 block font-semibold">Government ID</span>
                  <span className="font-bold text-[#0D0D12]">
                    {therapist.kyc?.idType || 'AADHAAR'}: {therapist.kyc?.idMasked || '•••• 1098'}
                  </span>
                </div>
                {therapist.kyc?.frontAssetId && (
                  <a
                    href={therapist.kyc.frontAssetId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[#F35271] text-xs font-bold transition flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View</span>
                  </a>
                )}
              </div>

              {therapist.kyc?.backAssetId && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 block font-semibold">ID Back Asset</span>
                    <span className="font-bold text-[#0D0D12]">Address Page</span>
                  </div>
                  <a
                    href={therapist.kyc.backAssetId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[#F35271] text-xs font-bold transition flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View</span>
                  </a>
                </div>
              )}

              {therapist.documents?.policeVerificationAssetId && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 block font-semibold">Police Clearance</span>
                    <span className="font-bold text-emerald-700">Clearance Verified</span>
                  </div>
                  <a
                    href={therapist.documents.policeVerificationAssetId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[#F35271] text-xs font-bold transition flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>PDF</span>
                  </a>
                </div>
              )}

              {therapist.documents?.professionalCertificateAssetId && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 block font-semibold">Spa Certification</span>
                    <span className="font-bold text-purple-700">Professional Diploma</span>
                  </div>
                  <a
                    href={therapist.documents.professionalCertificateAssetId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[#F35271] text-xs font-bold transition flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>PDF</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Complete Professional Portfolio (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bio & Spoken Languages */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-4 text-xs">
            <h4 className="font-bold text-[#0D0D12] uppercase tracking-wider text-[11px] text-rose-600">
              Practitioner Bio & Language Proficiencies
            </h4>

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
                  : (therapist.languagesSpoken || 'Hindi, English').split(',')
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
            {therapist.specializations && (
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
                Base Location & Coverage Area
              </h4>
              <span className="text-gray-500 text-[11px]">
                Radius: <strong className="text-[#0D0D12]">{therapist.serviceRadiusKm || 10} km</strong>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F35271] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0D0D12] block">
                    {therapist.area ? `${therapist.area}, ` : ''}{therapist.city || 'Delhi'}
                  </span>
                  <span className="text-gray-500 text-[11px] block mt-0.5">
                    {therapist.formattedAddress || 'Connaught Place, New Delhi, 110001'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Services Catalogue */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-bold text-[#0D0D12] uppercase tracking-wider text-[11px] text-rose-600">
                Offered Spa Services ({therapist.services?.length || 1})
              </h4>
              <span className="text-gray-500 text-[11px]">Instant Booking Enabled</span>
            </div>

            <div className="space-y-2.5">
              {(therapist.services || [
                {
                  name: 'Full Body Massage',
                  durationMinutes: 60,
                  discountPrice: 999,
                  basePrice: 1200,
                  description: '60 mins relaxing full body massage therapy',
                },
              ]).map((srv, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-gray-50 transition flex items-center justify-between gap-3"
                >
                  <div>
                    <h5 className="font-bold text-[#0D0D12] text-xs">{srv.name}</h5>
                    <p className="text-[11px] text-gray-500">
                      {srv.durationMinutes || 60} mins duration {srv.description ? `• ${srv.description}` : ''}
                    </p>
                  </div>

                  <div className="text-right">
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
    </div>
  );
}
