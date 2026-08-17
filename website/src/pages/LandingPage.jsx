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
import BookingProcess from '../components/BookingProcess';
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-screen bg-[#FAF6F0] text-[#1F1B18] font-sans selection:bg-[#E09F93] selection:text-white relative"
      >
        {/* 1. Navbar */}
        <Navbar onOpenBooking={handleOpenBooking} />

        {/* 2. Hero Section */}
        <Hero onOpenBooking={handleOpenBooking} />

        {/* 3. Trusted By */}
        <TrustedBy />

        {/* 4. Services Section */}
        <Services onSelectServiceForBooking={handleSelectServiceForBooking} />

        {/* 5. Why Choose Us */}
        <WhyChooseUs />

        {/* 6. Mobile App Showcase */}
        <AppShowcase />

        {/* 7. Gallery */}
        <Gallery />

        {/* 8. Customer Testimonials */}
        <Testimonials />

        {/* 9. Pricing Packages */}
        <Pricing onOpenBooking={handleOpenBooking} />

        {/* 10. Booking Process */}
        <BookingProcess onOpenBooking={handleOpenBooking} />

        {/* 11. Statistics */}
        <Statistics />

        {/* 12. FAQ */}
        <FAQ />

        {/* 13. Download App CTA */}
        <DownloadCTA />

        {/* 14. Footer */}
        <Footer />

        {/* Interactive Quick Booking Modal */}
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          preselectedService={selectedServiceForBooking}
        />
      </motion.div>
    </>
  );
}
