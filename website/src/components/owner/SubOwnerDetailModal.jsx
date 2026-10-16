import React from 'react';
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Users,
  Coins,
  QrCode,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function SubOwnerDetailModal({ isOpen, onClose, subOwner, sponsor }) {
  if (!isOpen || !subOwner) return null;

  const isLive = (subOwner.status || 'ACTIVE').toUpperCase() === 'ACTIVE';
  const referralEarnings = Number(subOwner.totalReferralEarningsRupees ?? 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all text-[#0D0D12]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-gray-900 via-[#181824] to-[#0D0D12] text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F35271] text-white">
              Sub-Owner Partner Profile
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isLive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
              }`}
            >
              {subOwner.status || 'ACTIVE'}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white">
            {subOwner.businessName || 'Spa Partner Center'}
          </h3>
          <p className="text-xs text-gray-300 font-mono mt-0.5">
            Spa Code: <strong className="text-white">{subOwner.spaCode || '—'}</strong>
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Earnings & Fleet Highlight Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#757880] flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#F35271]" /> Referral Earnings
              </span>
              <div className="text-xl font-extrabold text-[#F35271]">
                ₹{referralEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[10px] text-[#757880]">Revenue generated for sponsor</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#757880] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" /> Linked Fleet
              </span>
              <div className="text-xl font-extrabold text-[#0D0D12]">
                {subOwner.linkedTherapistsCount ?? (subOwner.therapistCount || 0)} Therapists
              </div>
              <p className="text-[10px] text-[#757880]">Active therapists in roster</p>
            </div>
          </div>

          {/* Owner Information */}
          <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50/50 space-y-3">
            <h4 className="text-xs font-bold text-[#0D0D12] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#F35271]" /> Owner & Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-gray-500 font-medium block">Owner Full Name</span>
                <strong className="text-gray-900 font-semibold">{subOwner.ownerName || '—'}</strong>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-medium block">Business / Spa Name</span>
                <strong className="text-gray-900 font-semibold">{subOwner.businessName || '—'}</strong>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-medium block flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" /> Mobile Number
                </span>
                <strong className="text-gray-900 font-semibold font-mono">{subOwner.phone || '—'}</strong>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-medium block flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-400" /> Email Address
                </span>
                <strong className="text-gray-900 font-semibold">{subOwner.email || '—'}</strong>
              </div>
            </div>
          </div>

          {/* Sponsor Network Association */}
          <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50/50 space-y-3">
            <h4 className="text-xs font-bold text-[#0D0D12] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Sponsor Network
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-gray-500 font-medium block">Sponsor Name</span>
                <strong className="text-gray-900 font-semibold">
                  {subOwner.sponsorOwnerName || sponsor?.ownerName || '—'}
                </strong>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-medium block">Sponsor Business</span>
                <strong className="text-gray-900 font-semibold">
                  {sponsor?.businessName || 'TherapyShala Partner'}
                </strong>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-medium block">Sponsor Spa Code</span>
                <strong className="text-gray-900 font-semibold font-mono">
                  {sponsor?.spaCode || '—'}
                </strong>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-medium block">Network Status</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Affiliated & Verified
                </span>
              </div>
            </div>
          </div>

          {/* Services Offered (if any) */}
          {Array.isArray(subOwner.servicesOffered) && subOwner.servicesOffered.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#F35271]" /> Services Offered
              </span>
              <div className="flex flex-wrap gap-1.5">
                {subOwner.servicesOffered.map((srv, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Registration Date */}
          <div className="text-[11px] text-gray-500 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" /> Onboarded Date:
            </span>
            <span className="font-semibold text-gray-700">
              {subOwner.registeredDate || subOwner.createdAt
                ? new Date(subOwner.registeredDate || subOwner.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Active Partner'}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
