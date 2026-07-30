import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SERVICES_DATA, THERAPISTS_LIST } from '../data/spaData';
import { X, Calendar, Clock, User, CheckCircle2, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, preselectedService }) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(preselectedService || SERVICES_DATA[0]);
  const [selectedTherapist, setSelectedTherapist] = useState(THERAPISTS_LIST[0]);
  const [selectedDate, setSelectedDate] = useState('2026-07-30');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const timeSlots = ['09:00 AM', '10:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'];

  const handleConfirm = (e) => {
    e.preventDefault();
    setConfirmed(true);
    // Fire celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const resetAndClose = () => {
    setStep(1);
    setConfirmed(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#0D0D12]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-2xl border border-[#AFB0B7]/30 relative my-auto"
        >
          {/* Top Header */}
          <div className="bg-[#FFEEF1] p-6 sm:p-8 border-b border-[#AFB0B7]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step > 1 && !confirmed && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="p-2 rounded-full hover:bg-white text-[#0D0D12]"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#F35271] font-bold">
                  Therapyshala Live Concierge
                </span>
                <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">
                  {confirmed ? 'Booking Confirmed!' : `Step ${step} of 3: ${step === 1 ? 'Select Ritual' : step === 2 ? 'Select Specialist' : 'Select Time & Guest'}`}
                </h3>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="w-10 h-10 rounded-full bg-white hover:bg-[#F35271] hover:text-white flex items-center justify-center text-[#0D0D12] transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            {!confirmed ? (
              <>
                {/* Step 1: Select Service */}
                {step === 1 && (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <p className="text-xs text-[#757880]">Select your desired treatment ritual:</p>
                    <div className="grid grid-cols-1 gap-3">
                      {SERVICES_DATA.map((srv) => (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedService(srv)}
                          className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                            selectedService.id === srv.id
                              ? 'bg-[#FFEEF1] border-[#F35271] shadow-md ring-2 ring-[#F35271]/30'
                              : 'bg-white border-[#AFB0B7]/30 hover:border-[#F35271]/50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <img src={srv.image} alt={srv.title} className="w-14 h-14 rounded-xl object-cover" />
                            <div>
                              <h4 className="font-serif-luxury text-lg text-[#0D0D12]">{srv.title}</h4>
                              <p className="text-xs text-[#757880]">{srv.duration} • {srv.category}</p>
                            </div>
                          </div>
                          <span className="font-serif-luxury text-xl font-bold text-[#F35271]">{srv.price}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      className="w-full mt-6 py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all"
                    >
                      Next: Choose Specialist
                    </button>
                  </div>
                )}

                {/* Step 2: Select Specialist */}
                {step === 2 && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#757880]">Select your preferred master therapist:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {THERAPISTS_LIST.map((therapist) => (
                        <div
                          key={therapist.id}
                          onClick={() => setSelectedTherapist(therapist)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                            selectedTherapist.id === therapist.id
                              ? 'bg-[#FFEEF1] border-[#F35271] shadow-md ring-2 ring-[#F35271]/30'
                              : 'bg-white border-[#AFB0B7]/30 hover:border-[#F35271]/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <img src={therapist.avatar} alt={therapist.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                              <h4 className="font-serif-luxury text-base text-[#0D0D12]">{therapist.name}</h4>
                              <p className="text-[11px] text-[#F35271] font-semibold">{therapist.specialization}</p>
                            </div>
                          </div>
                          <div className="text-[11px] text-[#757880] flex justify-between border-t border-[#AFB0B7]/30 pt-2">
                            <span>{therapist.experience}</span>
                            <span className="font-bold text-[#0D0D12]">★ {therapist.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep(3)}
                      className="w-full mt-6 py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all"
                    >
                      Next: Choose Date & Time
                    </button>
                  </div>
                )}

                {/* Step 3: Date, Time & Guest Info */}
                {step === 3 && (
                  <form onSubmit={handleConfirm} className="space-y-6">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-2">Select Date</label>
                      <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-2">Available Time Slots</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                              selectedTime === slot
                                ? 'bg-[#F35271] text-white border-[#F35271]'
                                : 'bg-white text-[#0D0D12] border-[#AFB0B7]/40 hover:border-[#F35271]'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sophia Vance"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full p-3 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full p-3 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-lg transition-all"
                    >
                      Confirm & Reserve Appointment
                    </button>
                  </form>
                )}
              </>
            ) : (
              /* Step 4: Confirmed State */
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#FFEEF1] text-[#F35271] mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="font-serif-luxury text-3xl text-[#0D0D12] mb-2">
                    Reservation Confirmed!
                  </h3>
                  <p className="text-sm text-[#757880] max-w-md mx-auto font-light">
                    Thank you, <span className="font-bold text-[#0D0D12]">{guestName || 'Valued Guest'}</span>. We have saved your spot for <span className="font-bold text-[#F35271]">{selectedService.title}</span> on <span className="font-bold text-[#0D0D12]">{selectedDate}</span> at <span className="font-bold text-[#0D0D12]">{selectedTime}</span>.
                  </p>
                </div>

                <div className="bg-[#FFEEF1] p-6 rounded-2xl border border-[#F35271]/20 max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#757880]">Specialist:</span>
                    <span className="font-bold text-[#0D0D12]">{selectedTherapist.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757880]">Total Price:</span>
                    <span className="font-bold text-[#F35271]">{selectedService.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757880]">App Pass:</span>
                    <span className="font-bold text-[#0D0D12]">Synced to Mobile App</span>
                  </div>
                </div>

                <button
                  onClick={resetAndClose}
                  className="px-8 py-3.5 rounded-full bg-[#0D0D12] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#F35271] transition-colors"
                >
                  Done & Return
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
