import React, { useState } from 'react';
import { ArrowLeft, User, MapPin, Share2, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { resolveMediaUrl } from '../../utils/mediaUtils';
import BookingTherapistAvatar from './BookingTherapistAvatar';

export default function BookingDetailInPage({
  bookingData,
  bookingId,
  loading,
  error,
  onBack,
  onRetry,
  canManageJobRequest = false,
  onAcceptJobRequest,
  onDeclineJobRequest,
}) {
  const [shareNotice, setShareNotice] = useState(null);
  const address = bookingData?.address || {};
  const addressText = address.formattedAddress || address.street || bookingData?.formattedAddress || '';
  const hasCoordinates = Number.isFinite(address.latitude) && Number.isFinite(address.longitude)
    && Math.abs(address.latitude) <= 90 && Math.abs(address.longitude) <= 180;
  const locationQuery = hasCoordinates ? `${address.latitude},${address.longitude}` : addressText;
  const locationUrl = locationQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}` : '';
  const shareLocation = async () => {
    setShareNotice(null);
    if (!locationUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Service Location', text: addressText || 'Service destination', url: locationUrl });
        return;
      } catch (shareError) {
        if (shareError.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(locationUrl);
      setShareNotice({ bookingId, text: 'Location link copied!' });
    } catch {
      setShareNotice({ bookingId, text: 'Could not copy the link. Copy it from the field below.', showLink: true });
    }
  };

  const customer = bookingData?.customer || bookingData?.customerProfile || {};
  const customerAvatarUrl = resolveMediaUrl(customer.avatarUrl || customer.imageUrl);

  const therapist = bookingData?.therapist || {};
  const items = bookingData?.serviceItems || [];
  const baseAmount = items.length && items.every((item) => Number.isFinite(item.unitPriceMinor))
    ? items.reduce((sum, item) => sum + item.unitPriceMinor * (item.quantity ?? 1), 0) / 100
    : bookingData?.payment?.amount ?? bookingData?.totalAmount;
  const totalAmount = bookingData?.totalRupees ?? bookingData?.payment?.finalAmount ?? bookingData?.totalAmount;
  const money = (value) => value == null ? '—' : new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: bookingData?.currency || 'INR', maximumFractionDigits: 2,
  }).format(value);
  const timezone = bookingData?.providerTimezone || 'Asia/Kolkata';
  const slot = (value, options) => {
    if (!value || Number.isNaN(new Date(value).getTime())) return '—';
    try {
      return new Intl.DateTimeFormat('en-IN', { ...options, timeZone: timezone }).format(new Date(value));
    } catch {
      return '—';
    }
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
            title="Return to Appointments"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Appointments</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-[#0D0D12]">
                {bookingData?.bookingNumber || 'Appointment Details'}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-[#F35271] border border-rose-200">
                In-Page View
              </span>
            </div>
            <p className="text-xs text-[#757880]">
              Public Booking ID: <span className="font-mono font-bold text-[#0D0D12]">{bookingId}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {bookingData?.status && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                bookingData.status === 'ACCEPTED' || bookingData.status === 'CONFIRMED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : bookingData.status === 'IN_PROGRESS'
                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                  : bookingData.status === 'COMPLETED'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : bookingData.status === 'CANCELLED'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {bookingData.status}
            </span>
          )}
          {canManageJobRequest && (
            <>
              <button
                type="button"
                onClick={onAcceptJobRequest}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={onDeclineJobRequest}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition"
              >
                Decline
              </button>
            </>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-2xs space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#F35271]" />
          <p className="text-xs text-gray-500 font-medium">Fetching real-time appointment details from backend...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold text-sm">{error}</span>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition cursor-pointer"
          >
            Retry Fetching
          </button>
        </div>
      ) : bookingData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Booking Meta & Customer */}
          <div className="space-y-6">
            {/* Customer Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-4">
              <h4 className="font-bold text-[#0D0D12] text-xs uppercase tracking-wider text-rose-600 pb-2 border-b border-gray-100">
                Customer Information
              </h4>

              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl bg-rose-50 text-[#F35271] flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                  <User className="w-6 h-6" />
                  {customerAvatarUrl && (
                    <img
                      src={customerAvatarUrl}
                      alt={customer.fullName || 'Customer profile'}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#0D0D12]">
                    {customer.fullName || customer.name || bookingData.customerName || 'Customer'}
                  </h5>
                  <p className="text-xs text-[#757880]">
                    {customer.publicId ? `Customer ID: ${customer.publicId}` : 'Customer profile'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-1 border-t border-gray-100">
                <div className="flex items-center justify-between text-[#757880]">
                  <span>Phone:</span>
                  <strong className="text-[#0D0D12]">
                    {customer.phoneE164 || customer.phone || bookingData.customerPhone || '—'}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-[#757880]">
                  <span>Email:</span>
                  <strong className="text-[#0D0D12] truncate max-w-[180px]">
                    {customer.email || bookingData.customerEmail || '—'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Assigned Therapist Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-4">
              <h4 className="font-bold text-[#0D0D12] text-xs uppercase tracking-wider text-rose-600 pb-2 border-b border-gray-100">
                Assigned Therapist
              </h4>

              <div className="flex items-center gap-3">
                <BookingTherapistAvatar therapist={therapist} className="w-12 h-12 rounded-2xl" />
                <div className="min-w-0 flex-1 space-y-1">
                  <h5 className="break-words font-bold text-sm text-[#0D0D12]">
                    {therapist.fullName || 'Not assigned'}
                  </h5>
                  <p className="break-words text-xs text-[#757880]">
                    {therapist.phoneE164 || therapist.phone || '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Service, Schedule & Payment Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-2xs space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h4 className="font-bold text-[#0D0D12] text-xs uppercase tracking-wider text-rose-600">
                  Appointment Service & Timing
                </h4>
                {bookingData.startOtp && (
                  <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-mono font-bold text-xs">
                    Start OTP: {bookingData.startOtp}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Service Booked</span>
                  {items.length ? items.map((item, index) => (
                    <div key={`${item.servicePublicId || item.serviceId || 'service'}-${index}`}>
                      <strong className="text-sm text-[#0D0D12] block">
                        {item.serviceName || item.packageTitle || '—'}
                        {(item.quantity ?? 1) > 1 && ` × ${item.quantity}`}
                      </strong>
                      {item.packageTitle && item.packageTitle !== item.serviceName && (
                        <span className="text-gray-500 block">{item.packageTitle}</span>
                      )}
                      <span className="text-gray-500 text-[11px] block">
                        Duration: {item.durationMinutes != null ? `${item.durationMinutes} mins` : '—'}
                      </span>
                    </div>
                  )) : (
                    <>
                      <strong className="text-sm text-[#0D0D12] block">
                        {bookingData.service?.name || bookingData.serviceName || '—'}
                      </strong>
                      <span className="text-gray-500 text-[11px] block">
                        Duration: {bookingData.service?.durationMinutes != null ? `${bookingData.service.durationMinutes} mins` : '—'}
                      </span>
                    </>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Scheduled Slot</span>
                  <strong className="text-sm text-[#0D0D12] block">
                    {bookingData.slotStart ? slot(bookingData.slotStart, { day: 'numeric', month: 'short', year: 'numeric' }) : bookingData.scheduledDate || '—'}
                  </strong>
                  <span className="text-gray-500 text-[11px] block">
                    Time: {bookingData.slotStart ? `${slot(bookingData.slotStart, { hour: 'numeric', minute: '2-digit' })} – ${slot(bookingData.slotEnd, { hour: 'numeric', minute: '2-digit' })} (${timezone})` : bookingData.scheduledTime || '—'}
                  </span>
                </div>
              </div>

              {/* Service Destination Address */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
                <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F35271]" />
                  <span>Service Destination Address</span>
                </span>
                <p className="text-gray-800 font-medium">
                  {bookingData.address?.formattedAddress ||
                    bookingData.address?.street ||
                    bookingData.formattedAddress ||
                    '—'}
                </p>
                {locationUrl && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button type="button" onClick={shareLocation}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#F35271] px-3 py-2 text-xs font-bold text-white hover:bg-[#E04362]">
                      <Share2 className="h-3.5 w-3.5" /> Share Location
                    </button>
                    <a href={locationUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#F35271]">
                      <ExternalLink className="h-3.5 w-3.5" /> Open in Maps
                    </a>
                  </div>
                )}
                {shareNotice?.bookingId === bookingId && (
                  <div className="space-y-2 pt-1">
                    <p role="status" className="text-xs text-gray-600">{shareNotice.text}</p>
                    {shareNotice.showLink && (
                      <input aria-label="Service location link" readOnly value={locationUrl}
                        onFocus={(event) => event.target.select()}
                        className="w-full rounded-lg border border-gray-200 bg-white p-2 text-xs" />
                    )}
                  </div>
                )}
              </div>

              {/* Financial & Settlement Breakdown */}
              <div className="pt-2 border-t border-gray-100 space-y-2.5">
                <h5 className="font-bold text-[#0D0D12] text-xs uppercase tracking-wider text-rose-600">
                  Payment Breakdown
                </h5>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Service Amount:</span>
                    <span className="font-semibold text-black">
                      {money(baseAmount)}
                    </span>
                  </div>

                  {bookingData.payment?.discount && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount Applied:</span>
                      <span className="font-semibold">-₹{bookingData.payment.discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Payment Status:</span><span className="font-semibold">{bookingData.paymentStatus || '—'}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Payment Method:</span><span className="font-semibold">{bookingData.paymentMethodId || '—'}</span>
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-[#0D0D12] pt-2 border-t border-gray-100">
                    <span>{bookingData.paymentStatus === 'CAPTURED' ? 'Total Paid by Customer:' : 'Booking Total:'}</span>
                    <span className="text-[#F35271]">
                      {money(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl bg-[#0D0D12] text-white text-xs font-bold hover:bg-gray-800 transition cursor-pointer shadow-xs"
              >
                Return to Appointments
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
