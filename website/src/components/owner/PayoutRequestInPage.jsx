import React from 'react';
import {
  ArrowLeft,
  Wallet,
  Send,
  AlertCircle,
  Building2,
  CreditCard,
  Landmark,
  ShieldAlert,
  Info,
} from 'lucide-react';

export default function PayoutRequestInPage({
  commissionsData,
  payoutAccount,
  payoutAmount,
  setPayoutAmount,
  payoutMethod,
  setPayoutMethod,
  payoutAdminNotes,
  setPayoutAdminNotes,
  payoutSubmitting,
  payoutSubmitError,
  handleRequestPayoutSubmit,
  onConfigureAccount,
  onBack,
}) {
  const availableRupees = commissionsData?.summary?.availableBalanceRupees ?? 0;
  const isAccountReady = payoutAccount?.isConfigured;

  const handleSetQuickPercentage = (percent) => {
    const val = (availableRupees * percent) / 100;
    setPayoutAmount(val > 0 ? String(Math.floor(val)) : '0');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 transition cursor-pointer shadow-2xs flex items-center gap-1.5 text-xs font-bold"
            title="Return to Payout Overview"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Payout Overview</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-[#0D0D12]">
                Request Commission Withdrawal
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-[#F35271] border border-rose-200">
                In-Page Request
              </span>
            </div>
            <p className="text-xs text-[#757880]">
              Withdraw accumulated spa earnings to your verified destination bank or UPI
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-right self-start sm:self-auto">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Available Withdrawable</span>
          <strong className="text-lg font-black text-[#F35271]">
            ₹{availableRupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </strong>
        </div>
      </div>

      {/* Error Banner */}
      {payoutSubmitError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{payoutSubmitError}</span>
        </div>
      )}

      {!isAccountReady && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="text-amber-900 block">Settlement Destination Not Configured</strong>
              <p className="text-amber-800 text-[11px]">
                You must configure your bank account or UPI before requesting withdrawals.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onConfigureAccount}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shrink-0 transition"
          >
            Configure Account Now
          </button>
        </div>
      )}

      <form onSubmit={handleRequestPayoutSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-6">
          {/* Amount Input & Quick Percentage Pills */}
          <div>
            <label className="block text-xs font-bold text-[#0D0D12] uppercase tracking-wider mb-1.5">
              Withdrawal Amount (₹) *
            </label>
            <div className="relative max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-gray-400 text-lg">
                ₹
              </span>
              <input
                type="number"
                required
                min="1"
                max={availableRupees}
                step="any"
                placeholder="Enter amount to withdraw"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-base font-extrabold text-[#0D0D12] bg-gray-50/50"
              />
            </div>

            {/* Quick Amount Percentage Chips */}
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-[11px] text-gray-500 font-medium">Quick select:</span>
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleSetQuickPercentage(pct)}
                  className="px-2.5 py-1 rounded-lg border border-gray-200 hover:border-[#F35271] hover:text-[#F35271] text-gray-600 text-[11px] font-bold transition cursor-pointer bg-white"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Transfer Method & Destination Preview */}
          <div className="border-t border-gray-100 pt-6 space-y-3">
            <label className="block text-xs font-bold text-[#0D0D12] uppercase tracking-wider">
              Transfer Method & Destination Account
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              <label
                className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${
                  payoutMethod === 'BANK_TRANSFER'
                    ? 'border-[#F35271] bg-rose-50/40 text-[#F35271]'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="payoutMethod"
                  value="BANK_TRANSFER"
                  checked={payoutMethod === 'BANK_TRANSFER'}
                  onChange={() => setPayoutMethod('BANK_TRANSFER')}
                  className="accent-[#F35271]"
                />
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Direct Bank Deposit</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                    {payoutAccount?.bankName
                      ? `${payoutAccount.bankName} •••• ${payoutAccount.accountNumber?.slice(-4) || ''}`
                      : 'Configured bank'}
                  </div>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${
                  payoutMethod === 'UPI'
                    ? 'border-[#F35271] bg-rose-50/40 text-[#F35271]'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="payoutMethod"
                  value="UPI"
                  checked={payoutMethod === 'UPI'}
                  onChange={() => setPayoutMethod('UPI')}
                  className="accent-[#F35271]"
                />
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    <span>Instant UPI</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                    {payoutAccount?.upiId || 'Configured UPI ID'}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Notes or Instructions */}
          <div className="border-t border-gray-100 pt-6">
            <label className="block text-xs font-bold text-[#0D0D12] uppercase tracking-wider mb-1.5">
              Payout Notes / Instructions (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Weekly settlement request, please expedite"
              value={payoutAdminNotes}
              onChange={(e) => setPayoutAdminNotes(e.target.value)}
              className="w-full max-w-lg px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-xs bg-gray-50/50"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={payoutSubmitting || !isAccountReady || availableRupees <= 0}
            className="px-6 py-2.5 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{payoutSubmitting ? 'Submitting Request...' : 'Submit Withdrawal Request'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
