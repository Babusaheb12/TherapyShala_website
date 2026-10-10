import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MOCK_USER_PROFILE, MOCK_USER_APPOINTMENTS, MOCK_USER_PACKAGES } from '../../data/spaData';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHeader from '../../components/common/PageHeader';
import { 
  Calendar, Clock, Package, User, Star, MapPin, 
  Sparkles, CheckCircle2, ChevronRight, AlertCircle, 
  Plus, ArrowRight, Store, UserPlus 
} from 'lucide-react';

export default function CustomerAccountPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialTab = location.pathname.includes('packages') 
    ? 'packages' 
    : 'appointments';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [appointments, setAppointments] = useState(MOCK_USER_APPOINTMENTS);
  const [packages, setPackages] = useState(MOCK_USER_PACKAGES);
  const [profile, setProfile] = useState(() => ({
    ...MOCK_USER_PROFILE,
    ...(user || {})
  }));

  const [selectedAppointmentForCancel, setSelectedAppointmentForCancel] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const upcomingAppointments = appointments.filter(a => a.status === 'CONFIRMED');
  const pastAppointments = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCancelAppointment = (id) => {
    setAppointments(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'CANCELLED', canCancel: false, canReschedule: false } : a
    ));
    setSelectedAppointmentForCancel(null);
    showToast('Appointment cancelled. Store credit has been issued.');
  };

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12]">
      <Navbar />

      <PageHeader
        badge={profile.tier}
        title="Customer Sanctuary"
        titleHighlight="Portal"
        description="Manage your appointments across different spas and salons, view active package balances, and submit reviews."
        breadcrumbs={[{ label: 'My Account' }]}
        actionButton={
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#F35271] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#E04362] transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Appointment</span>
          </Link>
        }
      />

      <main className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16">
        
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-[#168821] text-white text-xs font-semibold shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-white/80 hover:text-white text-xs">Dismiss</button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Profile Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-[#AFB0B7]/30 shadow-md space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#FFEEF1] border-2 border-[#F35271] text-[#F35271] flex items-center justify-center font-serif-luxury text-2xl font-bold">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif-luxury text-xl text-[#0D0D12]">{profile.name}</h3>
                  <span className="text-[11px] font-bold text-[#F35271] bg-[#FFEEF1] px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                    {profile.tier}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#757880] border-t border-[#AFB0B7]/20 pt-4">
                <div className="flex justify-between"><span>Email:</span><span className="font-semibold text-[#0D0D12]">{profile.email}</span></div>
                <div className="flex justify-between"><span>Phone:</span><span className="font-semibold text-[#0D0D12]">{profile.phone}</span></div>
                <div className="flex justify-between"><span>Total Bookings:</span><span className="font-semibold text-[#0D0D12]">{profile.totalVisits} Visits</span></div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-3xl p-3 border border-[#AFB0B7]/30 shadow-sm space-y-1.5">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full p-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all ${
                  activeTab === 'appointments' ? 'bg-[#F35271] text-white shadow-md' : 'text-[#757880] hover:bg-[#FFEEF1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  <span>Upcoming Appointments</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'appointments' ? 'bg-white text-[#F35271]' : 'bg-[#FFEEF1] text-[#F35271]'
                }`}>{upcomingAppointments.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('packages')}
                className={`w-full p-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all ${
                  activeTab === 'packages' ? 'bg-[#F35271] text-white shadow-md' : 'text-[#757880] hover:bg-[#FFEEF1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>My Package Balances</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'packages' ? 'bg-white text-[#F35271]' : 'bg-[#FFEEF1] text-[#F35271]'
                }`}>{packages.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`w-full p-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all ${
                  activeTab === 'history' ? 'bg-[#F35271] text-white shadow-md' : 'text-[#757880] hover:bg-[#FFEEF1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" />
                  <span>Booking History</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'history' ? 'bg-white text-[#F35271]' : 'bg-[#FFEEF1] text-[#F35271]'
                }`}>{pastAppointments.length}</span>
              </button>
            </div>
          </div>

          {/* Right: Tab Contents (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. UPCOMING APPOINTMENTS */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">Upcoming Appointments</h3>
                  <Link to="/explore" className="text-xs uppercase font-bold text-[#F35271] hover:underline flex items-center gap-1">
                    <span>Book with another salon</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFB0B7]/25 shadow-sm space-y-6">
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-[#AFB0B7]/20">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#757880]">ID: {apt.id}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#168821]/10 text-[#168821]">{apt.status}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#757880]">{apt.paymentStatus}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-7 space-y-2">
                          <span className="text-[11px] font-bold text-[#F35271] uppercase tracking-wider">{apt.serviceCategory}</span>
                          <h4 className="font-serif-luxury text-xl sm:text-2xl text-[#0D0D12]">{apt.serviceTitle}</h4>
                          <div className="text-xs text-[#757880] space-y-1">
                            <div className="flex items-center gap-1 font-semibold text-[#0D0D12]">
                              <Store className="w-3.5 h-3.5 text-[#F35271]" />
                              <span>{apt.businessName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#F35271]" />
                              <span>{apt.businessAddress}</span>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-5 bg-[#FFEEF1]/60 p-4 rounded-2xl border border-[#F35271]/15 space-y-3">
                          <div className="flex items-center gap-3">
                            <img src={apt.therapistAvatar} alt={apt.therapistName} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <span className="text-[10px] text-[#757880] block">Specialist:</span>
                              <span className="text-xs font-bold text-[#0D0D12]">{apt.therapistName}</span>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-[#AFB0B7]/20 flex justify-between items-center text-xs">
                            <span className="font-bold text-[#F35271]">{apt.date} @ {apt.time}</span>
                            <span className="font-serif-luxury text-lg font-bold text-[#0D0D12]">{apt.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#AFB0B7]/20">
                        <button
                          onClick={() => setSelectedAppointmentForCancel(apt)}
                          className="px-5 py-2.5 rounded-full bg-[#FFEEF1] text-red-600 text-xs font-semibold uppercase tracking-wider hover:bg-red-50"
                        >
                          Cancel Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. PACKAGES */}
            {activeTab === 'packages' && (
              <div className="space-y-6">
                <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">My Active Package Balances</h3>
                <div className="space-y-6">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFB0B7]/25 shadow-sm space-y-4">
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                          <span className="font-mono text-xs text-[#757880] block mb-1">Pass ID: {pkg.id}</span>
                          <h4 className="font-serif-luxury text-2xl text-[#0D0D12]">{pkg.packageName}</h4>
                          <span className="text-xs text-[#F35271] font-semibold flex items-center gap-1 mt-1">
                            <Store className="w-3.5 h-3.5" />
                            {pkg.businessName}
                          </span>
                        </div>
                        <span className="font-serif-luxury text-3xl font-bold text-[#F35271]">
                          {pkg.remainingSessions} of {pkg.totalSessions} Sessions Left
                        </span>
                      </div>

                      <div className="pt-4 border-t border-[#AFB0B7]/20 flex justify-end">
                        <button
                          onClick={() => navigate(`/book?businessSlug=${pkg.businessSlug}`)}
                          className="px-6 py-3 rounded-full bg-[#F35271] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-[#E04362]"
                        >
                          Redeem Next Session
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">Booking History</h3>
                <div className="space-y-4">
                  {pastAppointments.map((apt) => (
                    <div key={apt.id} className="bg-white rounded-3xl p-6 border border-[#AFB0B7]/25 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif-luxury text-lg text-[#0D0D12]">{apt.serviceTitle}</h4>
                        <span className="text-xs font-bold text-[#168821]">{apt.status}</span>
                      </div>
                      <p className="text-xs text-[#757880]">Visited {apt.businessName} on {apt.date} with {apt.therapistName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />

      {selectedAppointmentForCancel && (
        <div className="fixed inset-0 z-50 bg-[#0D0D12]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#AFB0B7]/30 space-y-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-8 h-8" />
              <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">Cancel Appointment?</h3>
            </div>
            <p className="text-xs text-[#757880]">
              Are you sure you want to cancel your appointment at <strong>{selectedAppointmentForCancel.businessName}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#AFB0B7]/20">
              <button onClick={() => setSelectedAppointmentForCancel(null)} className="px-5 py-2.5 rounded-full border text-xs font-semibold">Keep</button>
              <button onClick={() => handleCancelAppointment(selectedAppointmentForCancel.id)} className="px-5 py-2.5 rounded-full bg-red-600 text-white text-xs font-semibold">Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
