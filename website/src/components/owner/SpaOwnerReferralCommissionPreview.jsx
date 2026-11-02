import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, RotateCcw, Users } from 'lucide-react';

const DEFAULT_COMMISSION = 2;

export default function SpaOwnerReferralCommissionPreview() {
  const [activePercentage, setActivePercentage] = useState(DEFAULT_COMMISSION);
  const [commissionInput, setCommissionInput] = useState(String(DEFAULT_COMMISSION));
  const [errorNotice, setErrorNotice] = useState('');
  const [previewNotice, setPreviewNotice] = useState('');

  const handleSavePreview = (event) => {
    event.preventDefault();
    const percentage = Number(commissionInput);

    if (
      commissionInput.trim() === '' ||
      !Number.isFinite(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      setErrorNotice('Enter a commission percentage between 0 and 100.');
      setPreviewNotice('');
      return;
    }

    setActivePercentage(percentage);
    setPreviewNotice(`Preview updated to ${percentage}%. This change is not saved.`);
    setErrorNotice('');
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-purple-600" />
            <h4 className="text-base font-extrabold text-[#0D0D12]">
              Spa Owner Referral Commission Settings
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Referral commission earned from bookings by referred Spa Owners (default: 2%).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start shrink-0">
          <button
            type="button"
            onClick={() => {
              setCommissionInput(String(activePercentage));
              setErrorNotice('');
              setPreviewNotice('');
            }}
            title="Reset preview value"
            aria-label="Reset preview value"
            className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-600 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="px-3 py-2 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Active ({activePercentage}%)
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSavePreview}
        className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row sm:items-end gap-4"
      >
        <div className="flex-1">
          <label
            htmlFor="spa-owner-referral-commission-preview"
            className="block font-bold text-sm text-[#0D0D12] mb-2"
          >
            Referral Commission Percentage (%) <span className="text-rose-500">*</span>
          </label>
          <div className="relative max-w-xl">
            <input
              id="spa-owner-referral-commission-preview"
              type="number"
              min="0"
              max="100"
              step="0.1"
              required
              value={commissionInput}
              onChange={(event) => {
                setCommissionInput(event.target.value);
                setErrorNotice('');
                setPreviewNotice('');
              }}
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 outline-none text-base font-semibold text-[#0D0D12] bg-white"
              placeholder="e.g. 2"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-base pointer-events-none">
              %
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            UI preview only. Changes are not sent to or saved by the server.
          </p>
        </div>

        <button
          type="submit"
          className="min-h-14 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Preview Changes</span>
        </button>
      </form>

      {previewNotice && (
        <div role="status" className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{previewNotice}</span>
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
