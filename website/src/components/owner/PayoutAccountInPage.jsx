import React from 'react';
import {
  ArrowLeft,
  Landmark,
  Building2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Save,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

export default function PayoutAccountInPage({
  payoutAccount,
  payoutAccountForm,
  setPayoutAccountForm,
  payoutAccountSaving,
  payoutAccountError,
  payoutAccountSuccessMsg,
  handleSavePayoutAccount,
  onBack,
}) {
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
                Settlement Account Configuration
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-[#F35271] border border-rose-200">
                In-Page Settings
              </span>
            </div>
            <p className="text-xs text-[#757880]">
              Configure direct bank deposit & UPI destination for your spa commission payouts
            </p>
          </div>
        </div>

        {payoutAccount?.isConfigured && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Account Active & Configured</span>
          </span>
        )}
      </div>

      {/* Success Notification */}
      {payoutAccountSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-semibold">{payoutAccountSuccessMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {payoutAccountError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{payoutAccountError}</span>
        </div>
      )}

      <form onSubmit={handleSavePayoutAccount} className="space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-6">
          {/* Method Selection */}
          <div>
            <label className="block text-xs font-bold text-[#0D0D12] uppercase tracking-wider mb-2">
              Preferred Settlement Method
            </label>
            <p className="text-[11px] text-gray-500 mb-3">
              Choose how you wish to receive automated and manual commission withdrawals:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              <button
                type="button"
                onClick={() =>
                  setPayoutAccountForm((prev) => ({
                    ...prev,
                    preferredMethod: 'BANK_TRANSFER',
                  }))
                }
                className={`p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer flex items-center gap-3 ${
                  payoutAccountForm.preferredMethod === 'BANK_TRANSFER'
                    ? 'border-[#F35271] bg-rose-50/40 text-[#F35271] shadow-2xs'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    payoutAccountForm.preferredMethod === 'BANK_TRANSFER'
                      ? 'bg-[#F35271] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Bank Transfer (NEFT / IMPS)</div>
                  <div className="text-[10px] text-gray-500 font-normal">
                    Direct deposit to verified bank account
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setPayoutAccountForm((prev) => ({
                    ...prev,
                    preferredMethod: 'UPI',
                  }))
                }
                className={`p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer flex items-center gap-3 ${
                  payoutAccountForm.preferredMethod === 'UPI'
                    ? 'border-[#F35271] bg-rose-50/40 text-[#F35271] shadow-2xs'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    payoutAccountForm.preferredMethod === 'UPI'
                      ? 'bg-[#F35271] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">UPI Transfer</div>
                  <div className="text-[10px] text-gray-500 font-normal">
                    Instant payout to VPA (GPay / PhonePe / Paytm)
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-4 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#F35271]" />
              <span>Bank & Payout Credentials</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Account Holder Name */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Account Beneficiary Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Roy or Spa Enterprises"
                  value={payoutAccountForm.accountHolderName}
                  onChange={(e) =>
                    setPayoutAccountForm((prev) => ({
                      ...prev,
                      accountHolderName: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-xs bg-gray-50/50"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                  value={payoutAccountForm.bankName}
                  onChange={(e) =>
                    setPayoutAccountForm((prev) => ({
                      ...prev,
                      bankName: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-xs bg-gray-50/50"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="Enter full bank account number"
                  value={payoutAccountForm.accountNumber}
                  onChange={(e) =>
                    setPayoutAccountForm((prev) => ({
                      ...prev,
                      accountNumber: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none font-mono text-xs bg-gray-50/50"
                />
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC0001234"
                  value={payoutAccountForm.ifscCode}
                  onChange={(e) =>
                    setPayoutAccountForm((prev) => ({
                      ...prev,
                      ifscCode: e.target.value.toUpperCase(),
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none font-mono uppercase text-xs bg-gray-50/50"
                />
              </div>

              {/* UPI ID */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  UPI ID (Virtual Payment Address)
                </label>
                <input
                  type="text"
                  placeholder="e.g. business@okhdfcbank or 9876543210@paytm"
                  value={payoutAccountForm.upiId}
                  onChange={(e) =>
                    setPayoutAccountForm((prev) => ({
                      ...prev,
                      upiId: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none font-mono text-xs bg-gray-50/50"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Required if your preferred method is UPI.
                </span>
              </div>
            </div>
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
            disabled={payoutAccountSaving}
            className="px-6 py-2.5 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{payoutAccountSaving ? 'Saving Account...' : 'Save & Verify Account'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
