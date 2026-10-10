import React from 'react';
import {
  ArrowLeft,
  Receipt,
  User,
  Phone,
  Mail,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Building2,
  ShieldAlert,
} from 'lucide-react';

export default function PenaltyAuditInPage({ record, onBack }) {
  if (!record) return null;

  const penaltyRupees =
    record.penaltyAmount?.rupees ??
    (record.penaltyAmount?.minor ? record.penaltyAmount.minor / 100 : 0);
  const paidRupees =
    record.customerPaid?.rupees ??
    (record.customerPaid?.minor ? record.customerPaid.minor / 100 : 0);
  const compensationRupees =
    record.therapistCompensation?.rupees ??
    (record.therapistCompensation?.minor ? record.therapistCompensation.minor / 100 : 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 transition cursor-pointer shadow-2xs flex items-center gap-1.5 text-xs font-bold"
            title="Return to Penalties List"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Penalties Report</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-[#0D0D12]">
                Penalty Incident Audit Ledger
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-[#F35271] border border-rose-200">
                In-Page Audit
              </span>
            </div>
            <p className="text-xs text-[#757880]">
              Booking Ref: <strong className="font-mono text-[#0D0D12]">{record.bookingNumber || record.bookingId}</strong>
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
            record.cancelledBy === 'THERAPIST'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}
        >
          Cancelled by {record.cancelledBy || 'THERAPIST'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Cancellation Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-4 text-xs">
            <h4 className="font-bold text-[#0D0D12] text-xs uppercase tracking-wider text-rose-600 pb-2 border-b border-gray-100">
              Cancellation Incident Details
            </h4>

            <div className="space-y-3">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Reason Code</span>
                <span className="font-mono font-bold text-rose-700 text-sm">
                  {record.cancellationReason || 'THERAPIST_EMERGENCY'}
                </span>
              </div>

              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Timestamp</span>
                <span className="font-semibold text-gray-800">
                  {record.cancelledAt
                    ? new Date(record.cancelledAt).toLocaleString('en-IN')
                    : '10 Oct 2026, 11:20 AM'}
                </span>
              </div>

              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Booking ID</span>
                <span className="font-mono text-xs text-gray-700">{record.bookingId}</span>
              </div>
            </div>
          </div>

          {/* Customer & Practitioner Info */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-4 text-xs">
            <h4 className="font-bold text-[#0D0D12] text-xs uppercase tracking-wider text-rose-600 pb-2 border-b border-gray-100">
              Parties Involved
            </h4>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Customer</span>
                <strong className="text-[#0D0D12] block">{record.customer?.name || 'Rahul Customer'}</strong>
                <span className="text-gray-500 text-[11px] block">{record.customer?.phone || '+91 91111 22222'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Practitioner</span>
                <strong className="text-[#0D0D12] block">{record.therapist?.name || 'Pooja Verma'}</strong>
                <span className="text-gray-500 text-[11px] block">{record.therapist?.phone || '+91 98765 43210'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Audit Ledger & Financial Flows */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-5 text-xs">
            <h4 className="font-bold text-[#0D0D12] text-xs uppercase tracking-wider text-rose-600 pb-2 border-b border-gray-100">
              Audit Ledger & Financial Flows Breakdown
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-700">Penalty Debit</span>
                <div className="text-xl font-extrabold text-[#F35271]">
                  -₹{penaltyRupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-rose-600 font-medium">Deducted from owner balance</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-700">Customer Refund</span>
                <div className="text-xl font-extrabold text-blue-700">
                  ₹{paidRupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-blue-600 font-medium">100% full customer refund</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Therapist Comp</span>
                <div className="text-xl font-extrabold text-emerald-700">
                  ₹{compensationRupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-emerald-600 font-medium">Practitioner compensation</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 leading-relaxed">
              <span className="font-bold text-[#0D0D12] block">Policy Enforcement Audit Trail:</span>
              <p className="text-gray-600">
                This incident was triggered due to <strong className="text-black">{record.cancellationReason || 'THERAPIST_EMERGENCY'}</strong> by {record.cancelledBy}. The platform auto-debits the penalty fee and settles customer refund directly to source payment instrument in compliance with MioSalon / Therapyshala Sanctuary Policies.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-[#0D0D12] text-white text-xs font-bold hover:bg-gray-800 transition cursor-pointer shadow-xs"
            >
              Return to Incident List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
