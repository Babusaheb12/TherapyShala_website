import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Building2, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';
import {
  getSpaOwnerTherapistCommission,
  updateSpaOwnerTherapistCommission,
} from '../../services/spaOwner.service';

export default function SpaOwnerTherapistCommissionCard() {
  const [percentage, setPercentage] = useState(null);
  const [commissionInput, setCommissionInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const fetchCommission = useCallback(async () => {
    setLoading(true);
    setErrorNotice('');
    setSuccessNotice('');
    try {
      const response = await getSpaOwnerTherapistCommission();
      const value = response?.data?.percentage ?? response?.percentage;
      if (value !== undefined && value !== null && Number.isFinite(Number(value))) {
        const parsedValue = Number(value);
        setPercentage(parsedValue);
        setCommissionInput(String(parsedValue));
      } else {
        setPercentage(null);
        setCommissionInput('');
      }
    } catch (err) {
      setErrorNotice(err?.data?.message || err?.message || 'Failed to load spa owner commission.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommission();
  }, [fetchCommission]);

  const handleSave = async (event) => {
    event.preventDefault();
    setErrorNotice('');
    setSuccessNotice('');

    const value = Number(commissionInput);
    if (commissionInput.trim() === '' || !Number.isFinite(value) || value < 0 || value > 100) {
      setErrorNotice('Enter a commission percentage between 0 and 100.');
      return;
    }

    setSaving(true);
    try {
      const response = await updateSpaOwnerTherapistCommission(value);
      if (response?.success === false) {
        throw new Error(response.message || 'Failed to update spa owner commission.');
      }
      const savedValue = response?.data?.percentage ?? response?.percentage ?? value;
      const parsedSavedValue = Number(savedValue);
      setPercentage(parsedSavedValue);
      setCommissionInput(String(parsedSavedValue));
      setSuccessNotice(`Spa owner commission saved at ${parsedSavedValue}%.`);
    } catch (err) {
      setErrorNotice(err?.data?.message || err?.message || 'Failed to update spa owner commission.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#F35271]" />
            <h4 className="text-base font-extrabold text-[#0D0D12]">
              Spa Owner Commission (%)
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Default commission percentage allocated to Spa Owners from therapist bookings.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start shrink-0">
          <button
            type="button"
            onClick={fetchCommission}
            disabled={loading || saving}
            title="Refresh current commission"
            aria-label="Refresh current commission"
            className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-600 transition cursor-pointer disabled:opacity-60"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span
            className={`px-3 py-2 rounded-full text-xs font-bold border ${
              percentage === null
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {loading && percentage === null
              ? 'Loading...'
              : percentage === null
                ? 'Not Configured'
                : `Active (${percentage}%)`}
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row sm:items-end gap-4"
      >
        <div className="flex-1">
          <label
            htmlFor="spa-owner-therapist-commission"
            className="block font-bold text-sm text-[#0D0D12] mb-2"
          >
            Spa Owner Commission Percentage (%) <span className="text-rose-500">*</span>
          </label>
          <div className="relative max-w-xl">
            <input
              id="spa-owner-therapist-commission"
              type="number"
              min="0"
              max="100"
              step="0.1"
              required
              value={commissionInput}
              onChange={(event) => {
                setCommissionInput(event.target.value);
                setErrorNotice('');
                setSuccessNotice('');
              }}
              placeholder="e.g. 10 or 15"
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-gray-300 focus:border-[#F35271] focus:ring-2 focus:ring-[#F35271]/10 outline-none text-base font-semibold text-[#0D0D12] bg-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-base pointer-events-none">
              %
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || loading}
          className="min-h-14 px-6 py-3 rounded-2xl bg-[#F00046] hover:bg-[#D90040] text-white text-sm font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{saving ? 'Saving...' : 'Save Spa Commission'}</span>
        </button>
      </form>

      {successNotice && (
        <div role="status" className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successNotice}</span>
        </div>
      )}
      {errorNotice && (
        <div role="alert" className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-semibold">{errorNotice}</span>
        </div>
      )}
    </section>
  );
}
