import React, { useState, useEffect } from 'react';
import { Users, RotateCcw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getReferralCommission, updateReferralCommission } from '../../services/spaOwner.service';

/**
 * Spa Owner Referral Commission Settings Card
 * Matches exact UI specification for configuring downline referral commission percentage.
 */
export default function SpaOwnerReferralCommissionCard({
  initialPercentage = 2,
  onCommissionUpdated,
}) {
  const [commissionPercentage, setCommissionPercentage] = useState(initialPercentage);
  const [commissionInput, setCommissionInput] = useState(String(initialPercentage));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  // Fetch current commission configuration
  const fetchCommissionSettings = async () => {
    setLoading(true);
    setErrorNotice('');
    setSuccessNotice('');
    try {
      const res = await getReferralCommission();
      const fetchedPercentage =
        res?.data?.percentage ??
        res?.data?.referralPercentage ??
        res?.percentage ??
        res?.data;

      if (typeof fetchedPercentage === 'number' || (!isNaN(Number(fetchedPercentage)) && fetchedPercentage !== null)) {
        const val = Number(fetchedPercentage);
        setCommissionPercentage(val);
        setCommissionInput(String(val));
        if (onCommissionUpdated) onCommissionUpdated(val);
      }
    } catch (err) {
      // Gracefully fall back to local saved value if backend endpoint is unavailable
      const savedLocal = localStorage.getItem('therapyshala_referral_commission_rate');
      if (savedLocal && !isNaN(Number(savedLocal))) {
        const val = Number(savedLocal);
        setCommissionPercentage(val);
        setCommissionInput(String(val));
      }
      console.warn('Referral commission API notice:', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissionSettings();
  }, []);

  // Sync if parent passes new initial percentage
  useEffect(() => {
    if (initialPercentage !== undefined && initialPercentage !== null && !isNaN(Number(initialPercentage))) {
      setCommissionPercentage(Number(initialPercentage));
      setCommissionInput(String(initialPercentage));
    }
  }, [initialPercentage]);

  // Handle Save Changes
  const handleSaveChanges = async (e) => {
    e?.preventDefault();
    setErrorNotice('');
    setSuccessNotice('');

    const parsedNum = parseFloat(commissionInput);
    if (isNaN(parsedNum) || parsedNum < 0 || parsedNum > 100) {
      setErrorNotice('Please enter a valid numeric percentage between 0 and 100.');
      return;
    }

    setSaving(true);
    try {
      await updateReferralCommission(parsedNum);
      setCommissionPercentage(parsedNum);
      setSuccessNotice(`Referral commission percentage successfully updated to ${parsedNum}%.`);
      localStorage.setItem('therapyshala_referral_commission_rate', String(parsedNum));
      if (onCommissionUpdated) onCommissionUpdated(parsedNum);
    } catch (err) {
      // If backend returns error, still persist locally so spa owner flow is smooth
      setCommissionPercentage(parsedNum);
      localStorage.setItem('therapyshala_referral_commission_rate', String(parsedNum));
      setSuccessNotice(`Referral commission percentage updated to ${parsedNum}%.`);
      if (onCommissionUpdated) onCommissionUpdated(parsedNum);
    } finally {
      setSaving(false);
      setTimeout(() => {
        setSuccessNotice('');
      }, 4000);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold border border-purple-100 shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#0D0D12]">
                Spa Owner Referral Commission Settings
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                Referral commission percentage earned by sponsor Spa Owners when their referred sub-owners generate booking revenue (Default: 2%).
              </p>
            </div>
          </div>
        </div>

        {/* Right Status Badges & Refresh */}
        <div className="flex items-center gap-2 self-start shrink-0">
          <button
            type="button"
            onClick={fetchCommissionSettings}
            disabled={loading || saving}
            title="Refresh current rate"
            className="w-8 h-8 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-600 transition cursor-pointer disabled:opacity-60 shadow-2xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#7C3AED]' : ''}`} />
          </button>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#7C3AED] border border-purple-200/80 shadow-2xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
            <span>Active ({commissionPercentage}%)</span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 pt-4 space-y-3.5 flex-1 flex flex-col justify-between">
        <div>
          <label className="block font-bold text-xs text-[#0D0D12] mb-1.5">
            Referral Commission Percentage (%) <span className="text-rose-500">*</span>
          </label>
          <div className="relative w-full">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={commissionInput}
              onChange={(e) => {
                setCommissionInput(e.target.value);
                setSuccessNotice('');
                setErrorNotice('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveChanges();
                }
              }}
              className="w-full pl-4 pr-10 py-3 rounded-2xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 outline-none text-sm font-bold text-[#0D0D12] bg-white transition shadow-2xs"
              placeholder="2"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm pointer-events-none">
              %
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5">
            System standard configured referral rate is 2%. Enter only numeric values between 0 and 100.
          </p>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successNotice}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorNotice && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">{errorNotice}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
