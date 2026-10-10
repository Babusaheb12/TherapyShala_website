import React from 'react';
import {
  ArrowLeft,
  CalendarCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Loader2,
  AlertCircle,
  Hash,
} from 'lucide-react';

export default function BookingDetailInPage({
  bookingData,
  bookingId,
  loading,
  error,
  onBack,
  onRetry,
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

        {bookingData?.status && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
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
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#F35271] flex items-center justify-center font-bold text-sm">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#0D0D12]">
                    {bookingData.customer?.fullName || bookingData.customerName || 'Customer'}
                  </h5>
                  <p className="text-xs text-[#757880]">Verified Client</p>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-1 border-t border-gray-100">
                <div className="flex items-center justify-between text-[#757880]">
                  <span>Phone:</span>
                  <strong className="text-[#0D0D12]">
                    {bookingData.customer?.phone || bookingData.customerPhone || '—'}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-[#757880]">
                  <span>Email:</span>
                  <strong className="text-[#0D0D12] truncate max-w-[180px]">
                    {bookingData.customer?.email || bookingData.customerEmail || '—'}
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
                <img
                  src={
                    bookingData.therapist?.avatarUrl ||
                    'https://res.cloudinary.com/therapyshala/image/upload/v1/therapists/avatar.jpg'
                  }
                  alt={bookingData.therapist?.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-rose-100"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80';
                  }}
                />
                <div>
                  <h5 className="font-bold text-sm text-[#0D0D12]">
                    {bookingData.therapist?.fullName || 'Assigned Therapist'}
                  </h5>
                  <p className="text-xs text-[#757880]">
                    {bookingData.therapist?.phone || 'Fleet Practitioner'}
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
                  <strong className="text-sm text-[#0D0D12] block">
                    {bookingData.service?.name || bookingData.serviceName || 'Full Body Massage'}
                  </strong>
                  <span className="text-gray-500 text-[11px] block">
                    Duration: {bookingData.service?.durationMinutes || 60} mins
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Scheduled Slot</span>
                  <strong className="text-sm text-[#0D0D12] block">
                    {bookingData.scheduledDate || 'Today'}
                  </strong>
                  <span className="text-gray-500 text-[11px] block">
                    Time: {bookingData.scheduledTime || 'Slot Confirmed'}
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
                    'Client Home / Sanctuary Address'}
                </p>
              </div>

              {/* Financial & Settlement Breakdown */}
              <div className="pt-2 border-t border-gray-100 space-y-2.5">
                <h5 className="font-bold text-[#0D0D12] text-xs uppercase tracking-wider text-rose-600">
                  Payment & Commission Breakdown
                </h5>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Service Amount:</span>
                    <span className="font-semibold text-black">
                      ₹{bookingData.payment?.amount || bookingData.totalAmount || 1200}
                    </span>
                  </div>

                  {bookingData.payment?.discount && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount Applied:</span>
                      <span className="font-semibold">-₹{bookingData.payment.discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-extrabold text-[#0D0D12] pt-2 border-t border-gray-100">
                    <span>Total Paid by Customer:</span>
                    <span className="text-[#F35271]">
                      ₹{bookingData.payment?.finalAmount || bookingData.totalAmount || 999}
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
