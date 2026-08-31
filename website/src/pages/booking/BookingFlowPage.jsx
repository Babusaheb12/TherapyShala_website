import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getAllBusinesses, PROMOTIONS_DATA } from '../../data/spaData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Calendar as CalendarIcon, Clock, User, CheckCircle2, 
  Sparkles, ArrowRight, ArrowLeft, MapPin, Tag, 
  Download, Plus, Phone, Mail, ShieldCheck, HeartHandshake,
  UserCheck, AlertCircle, FileText, Store 
} from 'lucide-react';

const BOOKING_STEPS = [
  { step: 1, title: "Center & Service", shortTitle: "Service" },
  { step: 2, title: "Specialist", shortTitle: "Specialist" },
  { step: 3, title: "Date & Time", shortTitle: "Schedule" },
  { step: 4, title: "Guest Details", shortTitle: "Details" },
  { step: 5, title: "Review & Promo", shortTitle: "Review" },
  { step: 6, title: "Confirmed", shortTitle: "Confirmation" }
];

export default function BookingFlowPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const allBusinesses = getAllBusinesses();

  const queryBusinessSlug = searchParams.get('businessSlug');
  const queryServiceId = searchParams.get('serviceId');
  const queryTherapistId = searchParams.get('therapistId');

  const [currentStep, setCurrentStep] = useState(1);

  const [selectedBusiness, setSelectedBusiness] = useState(() => {
    return allBusinesses.find(b => b.slug === queryBusinessSlug) || allBusinesses[0];
  });

  const [selectedService, setSelectedService] = useState(() => {
    if (selectedBusiness.services && selectedBusiness.services.length > 0) {
      if (queryServiceId) {
        const found = selectedBusiness.services.find(s => s.id === parseInt(queryServiceId));
        if (found) return found;
      }
      return selectedBusiness.services[0];
    }
    return null;
  });

  const [selectedTherapist, setSelectedTherapist] = useState(() => {
    if (queryTherapistId && selectedBusiness.staff) {
      const found = selectedBusiness.staff.find(st => st.id === parseInt(queryTherapistId));
      if (found) return found;
    }
    return null;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11:00 AM');

  const [guestName, setGuestName] = useState('Ananya Sharma');
  const [guestPhone, setGuestPhone] = useState('+91 98765 43210');
  const [guestEmail, setGuestEmail] = useState('ananya.sharma@example.com');
  const [guestGender, setGuestGender] = useState('Female');
  const [specialRequests, setSpecialRequests] = useState('Please use light to medium pressure for neck & shoulder relaxation.');

  const [promoInput, setPromoInput] = useState('WELCOME500');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [confirmedBookingId, setConfirmedBookingId] = useState('');

  useEffect(() => {
    if (queryBusinessSlug) {
      const found = allBusinesses.find(b => b.slug === queryBusinessSlug);
      if (found) {
        setSelectedBusiness(found);
        if (found.services && found.services.length > 0) {
          if (queryServiceId) {
            const srv = found.services.find(s => s.id === parseInt(queryServiceId));
            setSelectedService(srv || found.services[0]);
          } else {
            setSelectedService(found.services[0]);
          }
        }
      }
    }
  }, [queryBusinessSlug, queryServiceId]);

  const handleBusinessChange = (biz) => {
    setSelectedBusiness(biz);
    if (biz.services && biz.services.length > 0) {
      setSelectedService(biz.services[0]);
    }
    setSelectedTherapist(null);
  };

  const morningSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '11:30 AM'];
  const afternoonSlots = ['01:00 PM', '02:30 PM', '03:30 PM', '04:30 PM'];
  const eveningSlots = ['05:30 PM', '06:30 PM', '07:30 PM', '08:30 PM'];

  const basePrice = selectedService?.rawPrice || 1499;
  const gstAmount = Math.round(basePrice * 0.18);
  const discountValue = appliedPromo ? (appliedPromo.code === 'WELCOME500' ? 500 : Math.round(basePrice * 0.2)) : 0;
  const finalPayable = Math.max(0, basePrice + gstAmount - discountValue);

  const handleApplyPromo = (e) => {
    if (e) e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    const found = PROMOTIONS_DATA.find(p => p.code.toUpperCase() === code);
    if (found) {
      setAppliedPromo(found);
    } else {
      setPromoError('Invalid coupon code. Try WELCOME500 or SPALUXE20');
    }
  };

  const handleCompleteBooking = () => {
    const bookingId = `TS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedBookingId(bookingId);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    setCurrentStep(6);
  };

  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TherapyShala//Multi-Business Booking//EN
BEGIN:VEVENT
UID:${confirmedBookingId}@therapyshala.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${selectedDate.replace(/-/g, '')}T110000Z
SUMMARY:TherapyShala: ${selectedService?.title} at ${selectedBusiness.name}
DESCRIPTION:Appointment at ${selectedBusiness.name}. Specialist: ${selectedTherapist ? selectedTherapist.name : 'Any Certified Specialist'}.
LOCATION:${selectedBusiness.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${confirmedBookingId}-appointment.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12] flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-20">
        
        {/* Step Header */}
        <div className="bg-[#FFEEF1] border-b border-[#AFB0B7]/20 py-8 mb-10">
          <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
            
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold">
                  TherapyShala Instant Booking Concierge
                </span>
                <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#0D0D12]">
                  {currentStep === 6 ? 'Appointment Confirmed!' : `Book Appointment at ${selectedBusiness.name}`}
                </h1>
              </div>

              {currentStep < 6 && (
                <div className="text-xs text-[#757880] font-medium">
                  Step <strong className="text-[#0D0D12] text-sm">{currentStep}</strong> of 5
                </div>
              )}
            </div>

            {/* Stepper Dots */}
            {currentStep < 6 && (
              <div className="grid grid-cols-5 gap-2 md:gap-4 items-center">
                {BOOKING_STEPS.slice(0, 5).map((s) => {
                  const isDone = currentStep > s.step;
                  const isCurrent = currentStep === s.step;
                  return (
                    <div
                      key={s.step}
                      className={`flex flex-col gap-1.5 cursor-pointer transition-all ${
                        isDone ? 'text-[#168821]' : isCurrent ? 'text-[#F35271]' : 'text-[#757880]'
                      }`}
                      onClick={() => {
                        if (isDone) setCurrentStep(s.step);
                      }}
                    >
                      <div className={`h-1.5 rounded-full transition-all duration-300 ${
                        isDone ? 'bg-[#168821]' : isCurrent ? 'bg-[#F35271]' : 'bg-[#AFB0B7]/30'
                      }`} />
                      <span className="text-[11px] font-semibold hidden sm:inline truncate">
                        {s.step}. {s.shortTitle}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* Wizard Container */}
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Main Interactive Step Area */}
            <div className={`${currentStep === 6 ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-8`}>
              
              {/* STEP 1: SELECT CENTER & SERVICE */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  {/* Select Center */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#AFB0B7]/25 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F35271]">
                        <Store className="w-4 h-4" />
                        <span>Step 1A: Choose Spa / Salon</span>
                      </div>
                      <Link to="/explore" className="text-xs text-[#F35271] font-bold hover:underline">
                        Browse All Centers
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                      {allBusinesses.map((biz) => (
                        <div
                          key={biz.id}
                          onClick={() => handleBusinessChange(biz)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                            selectedBusiness.id === biz.id
                              ? 'bg-[#FFEEF1] border-[#F35271] ring-2 ring-[#F35271]/20 shadow-sm'
                              : 'bg-white border-[#AFB0B7]/30 hover:border-[#F35271]/50'
                          }`}
                        >
                          <img src={biz.coverImage} alt={biz.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          <div className="min-w-0">
                            <h4 className="font-serif-luxury text-xs font-bold text-[#0D0D12] truncate">{biz.name}</h4>
                            <span className="text-[10px] text-[#757880] block truncate">{biz.shortLocation}</span>
                            <span className="text-[10px] text-[#F35271] font-bold">★ {biz.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select Service */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#AFB0B7]/25 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F35271]">
                      <Sparkles className="w-4 h-4" />
                      <span>Step 1B: Select Ritual from {selectedBusiness.name}</span>
                    </div>

                    <div className="space-y-3">
                      {selectedBusiness.services?.map((srv) => (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedService(srv)}
                          className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                            selectedService?.id === srv.id
                              ? 'bg-[#FFEEF1] border-[#F35271] ring-2 ring-[#F35271]/20 shadow-md'
                              : 'bg-white border-[#AFB0B7]/30 hover:border-[#F35271]/50'
                          }`}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <img
                              src={srv.image}
                              alt={srv.title}
                              className="w-16 h-16 rounded-2xl object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] uppercase font-bold text-[#F35271] tracking-wider">
                                {srv.category} • {srv.duration}
                              </span>
                              <h4 className="font-serif-luxury text-base sm:text-lg text-[#0D0D12] truncate">
                                {srv.title}
                              </h4>
                              <p className="text-xs text-[#757880] line-clamp-1 mt-0.5">
                                {srv.description}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-serif-luxury text-xl font-bold text-[#F35271] block">
                              {srv.price}
                            </span>
                            <span className="text-[10px] text-[#757880]">
                              +18% GST
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Next: Select Specialist</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* STEP 2: SELECT SPECIALIST */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#AFB0B7]/25 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F35271]">
                      <UserCheck className="w-4 h-4" />
                      <span>Step 2: Choose Specialist at {selectedBusiness.name}</span>
                    </div>

                    <div
                      onClick={() => setSelectedTherapist(null)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedTherapist === null
                          ? 'bg-[#FFEEF1] border-[#F35271] ring-2 ring-[#F35271]/20 shadow-md'
                          : 'bg-white border-[#AFB0B7]/30 hover:border-[#F35271]/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#F35271] text-white flex items-center justify-center font-serif-luxury text-xl font-bold">
                          ★
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif-luxury text-lg text-[#0D0D12]">
                              Any Available Specialist (Fastest)
                            </h4>
                            <span className="text-[10px] bg-[#168821]/10 text-[#168821] px-2 py-0.5 rounded-full font-bold">
                              Recommended
                            </span>
                          </div>
                          <p className="text-xs text-[#757880] mt-0.5">
                            Auto-assigns the top master therapist available at {selectedBusiness.name} for your slot.
                          </p>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-[#F35271] flex items-center justify-center shrink-0">
                        {selectedTherapist === null && <div className="w-3 h-3 rounded-full bg-[#F35271]" />}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {selectedBusiness.staff?.map((staff) => (
                        <div
                          key={staff.id}
                          onClick={() => setSelectedTherapist(staff)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                            selectedTherapist?.id === staff.id
                              ? 'bg-[#FFEEF1] border-[#F35271] ring-2 ring-[#F35271]/20 shadow-md'
                              : 'bg-white border-[#AFB0B7]/30 hover:border-[#F35271]/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-3.5 mb-3">
                              <img
                                src={staff.avatar}
                                alt={staff.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-[#FFEEF1]"
                              />
                              <div>
                                <h4 className="font-serif-luxury text-base text-[#0D0D12] font-medium leading-tight">
                                  {staff.name}
                                </h4>
                                <p className="text-[11px] text-[#F35271] font-semibold mt-0.5">
                                  {staff.role}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-[#757880] font-light line-clamp-2 mb-3">
                              {staff.bio || staff.specialization}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-[#AFB0B7]/20 pt-3 text-xs">
                            <span className="text-[#757880]">{staff.experience}</span>
                            <span className="font-bold text-[#0D0D12]">★ {staff.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="py-4 px-6 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12] hover:bg-[#FFEEF1] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>Next: Select Date & Time</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SELECT DATE & TIME */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#AFB0B7]/25 shadow-sm space-y-8">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F35271]">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Step 3: Choose Appointment Slot</span>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block">
                        Select Appointment Date
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-4 bg-white border border-[#AFB0B7]/40 rounded-2xl text-sm font-semibold focus:border-[#F35271] outline-none shadow-sm cursor-pointer"
                      />
                    </div>

                    <div className="space-y-6 pt-2">
                      <div>
                        <span className="text-xs font-bold text-[#757880] uppercase tracking-wider mb-2.5 block">
                          Morning Slots (09:00 AM - 12:00 PM)
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {morningSlots.map((slot) => (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`py-3 rounded-2xl text-xs font-semibold border transition-all ${
                                selectedTimeSlot === slot
                                  ? 'bg-[#F35271] text-white border-[#F35271] shadow-md ring-2 ring-[#F35271]/20'
                                  : 'bg-white text-[#0D0D12] border-[#AFB0B7]/40 hover:border-[#F35271]'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-[#757880] uppercase tracking-wider mb-2.5 block">
                          Afternoon Slots (12:00 PM - 05:00 PM)
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {afternoonSlots.map((slot) => (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`py-3 rounded-2xl text-xs font-semibold border transition-all ${
                                selectedTimeSlot === slot
                                  ? 'bg-[#F35271] text-white border-[#F35271] shadow-md ring-2 ring-[#F35271]/20'
                                  : 'bg-white text-[#0D0D12] border-[#AFB0B7]/40 hover:border-[#F35271]'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-[#757880] uppercase tracking-wider mb-2.5 block">
                          Evening Slots (05:00 PM - 09:00 PM)
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {eveningSlots.map((slot) => (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`py-3 rounded-2xl text-xs font-semibold border transition-all ${
                                selectedTimeSlot === slot
                                  ? 'bg-[#F35271] text-white border-[#F35271] shadow-md ring-2 ring-[#F35271]/20'
                                  : 'bg-white text-[#0D0D12] border-[#AFB0B7]/40 hover:border-[#F35271]'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="py-4 px-6 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12] hover:bg-[#FFEEF1] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="flex-1 py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>Next: Guest Details</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: GUEST INFORMATION */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#AFB0B7]/25 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F35271]">
                      <User className="w-4 h-4" />
                      <span>Step 4: Guest Contact Information</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Sophia Vance"
                          className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="guest@example.com"
                          className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                          Therapist Gender Preference
                        </label>
                        <select
                          value={guestGender}
                          onChange={(e) => setGuestGender(e.target.value)}
                          className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none shadow-sm cursor-pointer"
                        >
                          <option value="No Preference">No Preference</option>
                          <option value="Female">Female Specialist Only</option>
                          <option value="Male">Male Specialist Only</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Special Requests / Health Notes for {selectedBusiness.name}
                      </label>
                      <textarea
                        rows={3}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Mention any physical concerns, pressure preferences, allergies, or celebration notes..."
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none shadow-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="py-4 px-6 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12] hover:bg-[#FFEEF1] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                    </button>
                    <button
                      onClick={() => setCurrentStep(5)}
                      className="flex-1 py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>Next: Review & Promo</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: REVIEW & PROMO */}
              {currentStep === 5 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#AFB0B7]/25 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F35271]">
                      <FileText className="w-4 h-4" />
                      <span>Step 5: Review Booking Summary</span>
                    </div>

                    <div className="bg-[#FFF8F9] p-6 rounded-2xl border border-[#F35271]/20 space-y-4">
                      <div className="flex justify-between items-start pb-4 border-b border-[#AFB0B7]/20">
                        <div>
                          <span className="text-[11px] font-bold text-[#F35271] uppercase tracking-wider">
                            {selectedBusiness.name}
                          </span>
                          <h3 className="font-serif-luxury text-xl text-[#0D0D12]">
                            {selectedService?.title}
                          </h3>
                          <span className="text-xs text-[#757880]">{selectedService?.duration} • {selectedService?.category}</span>
                        </div>
                        <span className="font-serif-luxury text-2xl font-bold text-[#0D0D12]">
                          {selectedService?.price}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[#757880] block">Spa / Salon Location:</span>
                          <span className="font-bold text-[#0D0D12]">{selectedBusiness.address}</span>
                        </div>
                        <div>
                          <span className="text-[#757880] block">Assigned Specialist:</span>
                          <span className="font-bold text-[#0D0D12]">
                            {selectedTherapist ? selectedTherapist.name : 'Any Certified Specialist'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#757880] block">Appointment Slot:</span>
                          <span className="font-bold text-[#F35271]">{selectedDate} at {selectedTimeSlot}</span>
                        </div>
                        <div>
                          <span className="text-[#757880] block">Customer:</span>
                          <span className="font-bold text-[#0D0D12]">{guestName} ({guestPhone})</span>
                        </div>
                      </div>
                    </div>

                    {/* Promo Code Form */}
                    <div className="pt-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-2">
                        Apply Promo Code / Coupon
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="e.g. WELCOME500"
                          className="flex-1 p-3 bg-white border border-[#AFB0B7]/40 rounded-xl text-xs uppercase font-mono tracking-wider focus:border-[#F35271] outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-6 py-3 bg-[#0D0D12] hover:bg-[#F35271] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors"
                        >
                          Apply
                        </button>
                      </div>

                      {promoError && (
                        <p className="text-xs text-red-500 mt-2 font-medium">{promoError}</p>
                      )}
                      {appliedPromo && (
                        <p className="text-xs text-[#168821] mt-2 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Coupon "{appliedPromo.code}" applied! ({appliedPromo.discount})
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="py-4 px-6 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12] hover:bg-[#FFEEF1] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                    </button>
                    <button
                      onClick={handleCompleteBooking}
                      className="flex-1 py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-[0_10px_30px_rgba(243,82,113,0.4)] flex items-center justify-center gap-2"
                    >
                      <span>Confirm & Book Appointment</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: CONFIRMED */}
              {currentStep === 6 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-3xl mx-auto space-y-8 text-center"
                >
                  <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-[#AFB0B7]/30 shadow-2xl space-y-6">
                    <div className="w-20 h-20 rounded-full bg-[#FFEEF1] text-[#F35271] mx-auto flex items-center justify-center shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#168821] font-bold bg-[#168821]/10 px-3 py-1 rounded-full inline-block mb-3">
                        Booking Confirmed
                      </span>
                      <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#0D0D12]">
                        Your Appointment is Scheduled!
                      </h2>
                      <p className="text-sm text-[#757880] font-light mt-2 max-w-md mx-auto">
                        <strong>{selectedBusiness.name}</strong> has received your reservation. A confirmation SMS has been sent to {guestPhone}.
                      </p>
                    </div>

                    <div className="bg-[#FFEEF1]/60 p-6 sm:p-8 rounded-3xl border border-[#F35271]/20 text-left space-y-3.5 max-w-lg mx-auto text-xs sm:text-sm">
                      <div className="flex justify-between items-center pb-3 border-b border-[#AFB0B7]/20">
                        <span className="text-[#757880]">Booking ID:</span>
                        <span className="font-mono font-bold text-base text-[#F35271]">{confirmedBookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#757880]">Spa / Salon:</span>
                        <span className="font-bold text-[#0D0D12]">{selectedBusiness.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#757880]">Treatment:</span>
                        <span className="font-bold text-[#0D0D12]">{selectedService?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#757880]">Specialist:</span>
                        <span className="font-bold text-[#0D0D12]">
                          {selectedTherapist ? selectedTherapist.name : 'Any Certified Specialist'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#757880]">Date & Time:</span>
                        <span className="font-bold text-[#F35271]">{selectedDate} at {selectedTimeSlot}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-[#AFB0B7]/20 font-bold">
                        <span className="text-[#0D0D12]">Total Amount:</span>
                        <span className="font-serif-luxury text-xl text-[#F35271]">₹{finalPayable.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                      <button
                        onClick={handleDownloadCalendar}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#0D0D12] hover:bg-[#F35271] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Add to Calendar (.ics)</span>
                      </button>

                      <Link
                        to="/account"
                        className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FFEEF1] hover:bg-[#F35271] hover:text-white text-[#F35271] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        <span>View My Appointments</span>
                      </Link>

                      <button
                        onClick={() => setCurrentStep(1)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[#AFB0B7]/40 text-[#0D0D12] hover:border-[#F35271] text-xs font-semibold uppercase tracking-wider transition-colors"
                      >
                        Book Another
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}

            </div>

            {/* Right Column: Live Summary Sidebar */}
            {currentStep < 6 && (
              <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-7 border border-[#AFB0B7]/30 shadow-lg space-y-6">
                  <div className="flex items-center justify-between border-b border-[#AFB0B7]/20 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#757880]">
                      Booking Overview
                    </span>
                    <span className="text-[10px] font-bold text-[#F35271] bg-[#FFEEF1] px-2.5 py-0.5 rounded-full">
                      Step {currentStep}/5
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[#757880] block text-[11px]">Selected Center:</span>
                      <h4 className="font-serif-luxury text-base text-[#0D0D12] font-semibold mt-0.5">
                        {selectedBusiness.name}
                      </h4>
                      <span className="text-[11px] text-[#757880] block">{selectedBusiness.shortLocation}</span>
                    </div>

                    <div className="pt-2 border-t border-[#AFB0B7]/20">
                      <span className="text-[#757880] block text-[11px]">Service:</span>
                      <span className="font-semibold text-[#0D0D12]">{selectedService?.title} ({selectedService?.duration})</span>
                    </div>

                    <div>
                      <span className="text-[#757880] block text-[11px]">Specialist:</span>
                      <span className="font-semibold text-[#0D0D12]">
                        {selectedTherapist ? selectedTherapist.name : 'Any Available Specialist'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#757880] block text-[11px]">Date & Time:</span>
                      <span className="font-bold text-[#F35271]">{selectedDate} @ {selectedTimeSlot}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-[#AFB0B7]/20 text-xs">
                    <div className="flex justify-between text-[#757880]">
                      <span>Treatment Price:</span>
                      <span>₹{basePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#757880]">
                      <span>18% GST:</span>
                      <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between text-[#168821] font-bold">
                        <span>Discount ({appliedPromo.code}):</span>
                        <span>-₹{discountValue.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-[#AFB0B7]/20 text-sm font-bold">
                      <span className="text-[#0D0D12]">Total Payable:</span>
                      <span className="font-serif-luxury text-2xl text-[#F35271]">
                        ₹{finalPayable.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FFF8F9] p-3 rounded-xl border border-[#F35271]/15 text-[11px] text-[#757880] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#F35271] shrink-0" />
                    <span>Free rescheduling up to 6 hours before appointment.</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
