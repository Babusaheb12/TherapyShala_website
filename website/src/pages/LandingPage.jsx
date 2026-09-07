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

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);

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
      </div>
    </>
  );
}
