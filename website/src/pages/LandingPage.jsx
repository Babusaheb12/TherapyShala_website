import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustedBy from '../components/TrustedBy';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import AppShowcase from '../components/AppShowcase';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Statistics from '../components/Statistics';
import FAQ from '../components/FAQ';
import DownloadCTA from '../components/DownloadCTA';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import EnquiryModal from '../components/EnquiryModal';
import { MessageSquareText } from 'lucide-react';

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  const handleOpenBooking = () => {
    setSelectedServiceForBooking(null);
    setBookingModalOpen(true);
  };

  const handleSelectServiceForBooking = (service) => {
    setSelectedServiceForBooking(service);
    setBookingModalOpen(true);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* 1. Header Navigation (Fixed at root) */}
      <Navbar onOpenBooking={handleOpenBooking} />

      <div
        className={`min-h-screen bg-[#FFFDFD] text-[#0D0D12] font-sans selection:bg-[#F35271] selection:text-white relative transition-opacity duration-700 ${
          loading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* 2. Hero Section */}
        <Hero onOpenBooking={handleOpenBooking} />

        {/* 3. Featured In & Awarded By Ribbon */}
        <TrustedBy />

        {/* 4. Bespoke Spa Therapy Menu & Treatment Cards */}
        <Services onSelectServiceForBooking={handleSelectServiceForBooking} />

        {/* 5. The Therapyshala Excellence Standard (01-06) */}
        <WhyChooseUs />

        {/* 6. Mobile Application Showcase */}
        <AppShowcase />

        {/* 7. Visual Atmosphere Photo Gallery */}
        <Gallery />

        {/* 8. Guest Stories & Testimonials */}
        <Testimonials />

        {/* 9. Sanctuary Plans & Memberships */}
        <Pricing onOpenBooking={handleOpenBooking} />

        {/* 10. Sanctuary Statistics */}
        <Statistics />

        {/* 11. Frequently Asked Questions */}
        <FAQ />

        {/* 12. App Download Banner */}
        <DownloadCTA />

        {/* 13. Footer */}
        <Footer />

        {/* Interactive Quick Booking Modal */}
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          preselectedService={selectedServiceForBooking}
        />

        {/* Interactive Quick Enquiry Modal */}
        <EnquiryModal
          isOpen={enquiryModalOpen}
          onClose={() => setEnquiryModalOpen(false)}
        />

        {/* Floating Concierge Quick Enquiry Button */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
          <button
            onClick={() => setEnquiryModalOpen(true)}
            className="group flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#0D0D12] hover:bg-[#F35271] text-white shadow-xl hover:shadow-[0_8px_25px_rgba(243,82,113,0.4)] transition-all duration-300 border border-white/10 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
          >
            <div className="w-2 h-2 rounded-full bg-[#168821] animate-ping" />
            <MessageSquareText className="w-4 h-4 text-[#FA7B9B] group-hover:text-white" />
            <span className="text-xs font-bold uppercase tracking-wider">Quick Enquiry</span>
          </button>
        </div>
      </div>
    </>
  );
}
