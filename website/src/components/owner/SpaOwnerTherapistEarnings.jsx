import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock3,
  Coins,
  Loader2,
  RefreshCw,
  Users,
  Wallet,
} from 'lucide-react';
import {
  createSpaOwnerTherapistPayment,
  getSpaOwnerTherapistEarnings,
  getSpaOwnerTherapistWithdrawals,
} from '../../services/spaOwner.service';

const PAYMENT_METHODS = [
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'UPI', label: 'UPI' },
  { value: 'CASH', label: 'Cash' },
];

const toRupees = (minor) => (Number(minor) || 0) / 100;

export default function SpaOwnerTherapistEarnings() {
  const [earningsData, setEarningsData] = useState(null);
  const [therapistDirectory, setTherapistDirectory] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedTherapistId, setSelectedTherapistId] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const [withdrawalsError, setWithdrawalsError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    reference: '',
    note: '',
  });

  const fetchEarnings = useCallback(async (therapistId) => {
    setLoading(true);
    setErrorNotice('');
    try {
      const response = await getSpaOwnerTherapistEarnings({ therapistId });
      if (response?.success === false || !Array.isArray(response?.data?.therapists)) {
        throw new Error(response?.message || 'Therapist earnings data is unavailable.');
      }
      setEarningsData(response.data);
      if (!therapistId) {
        setTherapistDirectory(response.data.therapists);
      }
    } catch (error) {
      setErrorNotice(
        error?.data?.message || error?.message || 'Failed to load therapist earnings.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWithdrawals = useCallback(async () => {
    setWithdrawalsLoading(true);
    setWithdrawalsError('');
    try {
      const response = await getSpaOwnerTherapistWithdrawals();
      if (response?.success === false || !Array.isArray(response?.data)) {
        throw new Error(response?.message || 'Therapist withdrawal requests are unavailable.');
      }
      setWithdrawals(response.data);
    } catch (error) {
      setWithdrawalsError(
        error?.data?.message || error?.message || 'Failed to load therapist withdrawal requests.'
      );
    } finally {
      setWithdrawalsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarnings();
    fetchWithdrawals();
  }, [fetchEarnings, fetchWithdrawals]);

  const therapists = earningsData?.therapists || [];
  const selectedTherapist = therapists.find(
    (item) => String(item.therapist?.id || item.therapist?.publicId) === selectedTherapistId
  );
  const visibleTherapists = selectedTherapist ? [selectedTherapist] : therapists;
  const totals = selectedTherapist
    ? selectedTherapist
    : earningsData?.totals || { earnedMinor: 0, paidMinor: 0, outstandingMinor: 0 };
  const currency = earningsData?.currency || selectedTherapist?.currency || 'INR';

  const formatMoney = useMemo(
    () =>
      (minor) => {
        if (minor == null) return '—';
        new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(toRupees(minor));
      },
    [currency]
  );
  const formatTrackedMoney = (minor) => (minor == null ? 'Not tracked' : formatMoney(minor));

  const earnings = visibleTherapists
    .flatMap((record) =>
      (record.earnings || []).map((earning) => ({
        ...earning,
        therapistName: record.therapist?.name || 'Therapist',
      }))
    )
    .sort((a, b) => new Date(a.completedAt || 0) - new Date(b.completedAt || 0));

  const payments = visibleTherapists
    .flatMap((record) =>
      (record.payments || []).map((payment) => ({
        ...payment,
        therapistName: record.therapist?.name || 'Therapist',
      }))
    )
    .sort((a, b) => new Date(b.paidAt || 0) - new Date(a.paidAt || 0));

  const visibleWithdrawals = withdrawals.filter((request) => {
    if (!selectedTherapistId) return true;
    return String(request.therapist?.id || request.therapist?.publicId) === selectedTherapistId;
  });

  const selectedOutstandingMinor = selectedTherapist?.outstandingMinor;

  const handleRecordPayment = async (event) => {
    event.preventDefault();
    setErrorNotice('');
    setSuccessNotice('');

    if (!selectedTherapist) {
      setErrorNotice('Select the therapist you paid.');
      return;
    }
    if (selectedOutstandingMinor == null) {
      setErrorNotice('This therapist has legacy earnings that are not eligible for settlement.');
      return;
    }

    const rupees = Number(paymentForm.amount);
    const amountMinor = Math.round(rupees * 100);
    if (!Number.isFinite(rupees) || rupees <= 0 || !Number.isSafeInteger(amountMinor)) {
      setErrorNotice('Enter a valid payment amount greater than ₹0.');
      return;
    }
    if (amountMinor > selectedOutstandingMinor) {
      setErrorNotice(
        `Payment exceeds this therapist's pending amount of ${formatMoney(selectedOutstandingMinor)}.`
      );
      return;
    }

    setSaving(true);
    try {
      const response = await createSpaOwnerTherapistPayment({
        therapistId: selectedTherapist.therapist?.id || selectedTherapist.therapist?.publicId,
        amountMinor,
        paymentMethod: paymentForm.paymentMethod,
        reference: paymentForm.reference,
        note: paymentForm.note,
      });
      if (response?.success === false) {
        throw new Error(response.message || 'Failed to record therapist payment.');
      }

      const refreshed = await getSpaOwnerTherapistEarnings({
        therapistId: selectedTherapistId || undefined,
      });
      if (refreshed?.success === false || !Array.isArray(refreshed?.data?.therapists)) {
        throw new Error(
          refreshed?.message || 'Payment was recorded, but refreshed earnings could not be loaded.'
        );
      }
      setEarningsData(refreshed.data);
      if (!selectedTherapistId) {
        setTherapistDirectory(refreshed.data.therapists);
      }
      setPaymentForm((previous) => ({
        ...previous,
        amount: '',
        reference: '',
        note: '',
      }));
      setSuccessNotice(
        `${formatMoney(amountMinor)} payment recorded. It was allocated to the oldest unpaid bookings first.`
      );
      fetchWithdrawals();
    } catch (error) {
      setErrorNotice(
        error?.data?.message || error?.message || 'Failed to record therapist payment.'
      );
    } finally {
      setSaving(false);
    }
  };

  const metricCards = [
    { label: 'Total Therapist Earnings', value: totals.earnedMinor, icon: Coins, tone: 'rose' },
    { label: 'Already Paid', value: totals.paidMinor, icon: CheckCircle2, tone: 'emerald' },
    { label: 'Pending Payment', value: totals.outstandingMinor, icon: Clock3, tone: 'amber' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#0D0D12]">Therapist Earnings & Settlements</h3>
          <p className="text-xs text-[#757880] mt-0.5">
            Review therapist earnings, pending balances, and record payments already made.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            fetchEarnings(selectedTherapistId || undefined);
            fetchWithdrawals();
          }}
          disabled={loading || withdrawalsLoading || saving}
          className="px-3.5 py-2.5 rounded-xl border border-gray-200 hover:bg-white text-gray-700 text-xs font-bold transition flex items-center gap-2 disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading || withdrawalsLoading ? 'animate-spin' : ''}`} />
          Refresh Earnings
        </button>
      </div>

      {errorNotice && (
        <div role="alert" className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchEarnings(selectedTherapistId || undefined)}
            className="px-3 py-1 bg-white border border-red-200 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metricCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-[#757880]">
              <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                tone === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  tone === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-[#F35271]'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#0D0D12]">
              {loading && !earningsData ? '—' : formatMoney(value)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-sm text-[#0D0D12] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#F35271]" />
              Linked Therapists ({therapistDirectory.length})
            </h4>
            <p className="text-[11px] text-gray-500 mt-1">Select a therapist to review their earnings and record settlement.</p>
          </div>
          <select
            aria-label="Filter earnings by therapist"
            value={selectedTherapistId}
            onChange={(event) => {
              const therapistId = event.target.value;
              setSelectedTherapistId(therapistId);
              setEarningsData(null);
              fetchEarnings(therapistId || undefined);
            }}
            className="w-full sm:w-72 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold"
          >
            <option value="">All therapists</option>
            {therapistDirectory.map((record) => {
              const id = record.therapist?.id || record.therapist?.publicId;
              return (
                <option key={id} value={id}>
                  {record.therapist?.name || 'Therapist'} — pending {formatTrackedMoney(record.outstandingMinor)}
                </option>
              );
            })}
          </select>
        </div>

        {therapists.length === 0 && !loading ? (
          <p className="py-8 text-center text-sm text-gray-500">No linked therapist earnings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-100">
                  <th className="py-3 pr-4">Therapist</th>
                  <th className="py-3 px-3 text-right">Total Earned</th>
                  <th className="py-3 px-3 text-right">Already Paid</th>
                  <th className="py-3 pl-3 text-right">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visibleTherapists.map((record) => {
                  const id = record.therapist?.id || record.therapist?.publicId;
                  return (
                    <tr key={id}>
                      <td className="py-3 pr-4">
                        <div className="font-bold text-[#0D0D12]">{record.therapist?.name || 'Therapist'}</div>
                        <div className="text-[10px] text-gray-500">{record.therapist?.phoneE164 || id}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold">{formatMoney(record.earnedMinor)}</td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-700">{formatTrackedMoney(record.paidMinor)}</td>
                      <td className="py-3 pl-3 text-right font-bold text-amber-700">{formatTrackedMoney(record.outstandingMinor)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <form onSubmit={handleRecordPayment} className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-2xs space-y-4">
        <div>
          <h4 className="font-bold text-sm text-[#0D0D12] flex items-center gap-2">
            <Banknote className="w-4 h-4 text-[#F35271]" />
            Record Therapist Payment
          </h4>
          <p className="text-[11px] text-gray-500 mt-1">
            Record a payment you have already made. Payments are applied to the oldest unpaid booking first.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="settlement-therapist" className="block text-xs font-semibold mb-1.5">Therapist *</label>
            <select
              id="settlement-therapist"
              required
              value={selectedTherapistId}
              onChange={(event) => {
                const therapistId = event.target.value;
                setSelectedTherapistId(therapistId);
                setEarningsData(null);
                fetchEarnings(therapistId || undefined);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-xs"
            >
              <option value="">Select therapist</option>
              {therapistDirectory.map((record) => {
                const id = record.therapist?.id || record.therapist?.publicId;
                return <option key={id} value={id}>{record.therapist?.name || 'Therapist'}</option>;
              })}
            </select>
            {selectedTherapist && (
              <p className="text-[10px] text-gray-500 mt-1">
                Pending: {formatTrackedMoney(selectedTherapist.outstandingMinor)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="settlement-amount" className="block text-xs font-semibold mb-1.5">Amount (₹) *</label>
            <input
              id="settlement-amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={paymentForm.amount}
              onChange={(event) => setPaymentForm((previous) => ({ ...previous, amount: event.target.value }))}
              placeholder="e.g. 5000"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs"
            />
          </div>
          <div>
            <label htmlFor="settlement-method" className="block text-xs font-semibold mb-1.5">Payment Method *</label>
            <select
              id="settlement-method"
              value={paymentForm.paymentMethod}
              onChange={(event) => setPaymentForm((previous) => ({ ...previous, paymentMethod: event.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-xs"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>{method.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="settlement-reference" className="block text-xs font-semibold mb-1.5">Reference (optional)</label>
            <input
              id="settlement-reference"
              value={paymentForm.reference}
              onChange={(event) => setPaymentForm((previous) => ({ ...previous, reference: event.target.value }))}
              placeholder="Bank / UPI transaction ID"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label htmlFor="settlement-note" className="block text-xs font-semibold mb-1.5">Note (optional)</label>
            <input
              id="settlement-note"
              value={paymentForm.note}
              onChange={(event) => setPaymentForm((previous) => ({ ...previous, note: event.target.value }))}
              placeholder="e.g. November settlement"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs"
            />
          </div>
          <button
            type="submit"
            disabled={
              saving ||
              loading ||
              !selectedTherapist ||
              selectedOutstandingMinor == null ||
              selectedOutstandingMinor <= 0
            }
            className="px-5 py-2.5 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Record Payment
          </button>
        </div>

        {successNotice && (
          <p role="status" className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            {successNotice}
          </p>
        )}
      </form>

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-2xs space-y-4">
        <h4 className="font-bold text-sm text-[#0D0D12] flex items-center gap-2">
          <Wallet className="w-4 h-4 text-[#F35271]" />
          Booking Earnings ({earnings.length})
        </h4>
        <p className="text-[11px] text-gray-500">
          Ordered oldest first. Recorded payments are automatically allocated to the oldest unpaid earnings by the server.
          Legacy earnings without settlement tracking are display-only and cannot be paid through this page.
        </p>
        {earnings.length === 0 ? (
          <p className="py-6 text-center text-xs text-gray-500">No booking earnings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-100">
                  {!selectedTherapist && <th className="py-3 pr-3">Therapist</th>}
                  <th className="py-3 px-3">Booking</th>
                  <th className="py-3 px-3">Completed</th>
                  <th className="py-3 px-3 text-right">Service</th>
                  <th className="py-3 px-3 text-right">Platform Fee</th>
                  <th className="py-3 px-3 text-right">Spa Owner Fee</th>
                  <th className="py-3 px-3 text-right">Earned</th>
                  <th className="py-3 px-3 text-right">Paid</th>
                  <th className="py-3 pl-3 text-right">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {earnings.map((earning) => (
                  <tr key={earning.id}>
                    {!selectedTherapist && <td className="py-3 pr-3 font-semibold">{earning.therapistName}</td>}
                    <td className="py-3 px-3 font-mono">
                      {earning.bookingNumber || earning.bookingId || '—'}
                      {(earning.paidMinor == null || earning.outstandingMinor == null) && (
                        <span className="block font-sans text-[10px] text-gray-500">Untracked legacy earning</span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {earning.completedAt ? new Date(earning.completedAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="py-3 px-3 text-right">{formatMoney(earning.serviceAmountMinor)}</td>
                    <td className="py-3 px-3 text-right">{formatMoney(earning.platformCommissionMinor)}</td>
                    <td className="py-3 px-3 text-right">{formatMoney(earning.spaOwnerCommissionMinor)}</td>
                    <td className="py-3 px-3 text-right font-semibold">{formatMoney(earning.earnedMinor)}</td>
                    <td className="py-3 px-3 text-right text-emerald-700">{formatTrackedMoney(earning.paidMinor)}</td>
                    <td className="py-3 pl-3 text-right font-bold text-amber-700">{formatTrackedMoney(earning.outstandingMinor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-2xs space-y-4">
        <h4 className="font-bold text-sm text-[#0D0D12] flex items-center gap-2">
          <Banknote className="w-4 h-4 text-[#F35271]" />
          Payment History ({payments.length})
        </h4>
        {payments.length === 0 ? (
          <p className="py-6 text-center text-xs text-gray-500">No therapist payments recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <article key={payment.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm text-[#0D0D12]">{payment.therapistName}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleString('en-IN') : 'Date unavailable'}
                      {' · '}{payment.paymentMethod?.replaceAll('_', ' ') || 'Payment'}
                      {payment.reference ? ` · Ref: ${payment.reference}` : ''}
                    </p>
                    {payment.note && <p className="text-[11px] text-gray-600 mt-1">{payment.note}</p>}
                  </div>
                  <p className="font-extrabold text-emerald-700">{formatMoney(payment.amountMinor)}</p>
                </div>
                {Array.isArray(payment.allocations) && payment.allocations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200/70 text-[11px] text-gray-600 space-y-1">
                    <p className="font-bold text-gray-700">Booking allocations</p>
                    {payment.allocations.map((allocation, index) => (
                      <div key={`${allocation.earningId || allocation.bookingId}-${index}`} className="flex justify-between gap-3">
                        <span>{allocation.bookingNumber || allocation.bookingId || allocation.earningId || 'Booking'}</span>
                        <span className="font-semibold">{formatMoney(allocation.amountMinor)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-sm text-[#0D0D12] flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-amber-600" />
              Therapist Withdrawal Requests ({visibleWithdrawals.length})
            </h4>
            <p className="text-[11px] text-gray-500 mt-1">
              Withdrawal requests submitted by your linked therapists.
            </p>
          </div>
          {withdrawalsLoading && <Loader2 className="w-4 h-4 animate-spin text-[#F35271]" />}
        </div>

        {withdrawalsError && (
          <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3">
            <span>{withdrawalsError}</span>
            <button type="button" onClick={fetchWithdrawals} className="font-bold underline">
              Retry
            </button>
          </div>
        )}

        {!withdrawalsError && !withdrawalsLoading && visibleWithdrawals.length === 0 ? (
          <p className="py-6 text-center text-xs text-gray-500">No withdrawal requests found.</p>
        ) : (
          <div className="space-y-3">
            {visibleWithdrawals.map((request) => (
                <article key={request.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm text-[#0D0D12]">
                        {request.therapist?.name || 'Therapist'}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {request.therapist?.phoneE164 || request.therapist?.id || '—'}
                        {' · Requested '}
                        {request.requestedAt
                          ? new Date(request.requestedAt).toLocaleString('en-IN')
                          : 'date unavailable'}
                      </p>
                      {request.reason && (
                        <p className="text-[11px] text-gray-600 mt-1">Reason: {request.reason}</p>
                      )}
                    </div>
                    <div className="sm:text-right">
                      <p className="font-extrabold text-[#0D0D12]">
                        {request.amountRupees != null
                          ? formatMoney(Number(request.amountRupees) * 100)
                          : formatMoney(request.amountMinor)}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Request: {request.status?.replaceAll('_', ' ') || '—'}
                        {' · Owner review: '}
                        {request.ownerReviewStatus?.replaceAll('_', ' ') || '—'}
                      </p>
                      {request.reviewedAt && (
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          Reviewed {new Date(request.reviewedAt).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
