import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategoryDiscovery from '../components/CategoryDiscovery';
import FeaturedBusinesses from '../components/FeaturedBusinesses';
import Services from '../components/Services';
import BusinessPartnerCTA from '../components/BusinessPartnerCTA';
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-screen bg-[#FFFDFD] text-[#0D0D12] font-sans selection:bg-[#F35271] selection:text-white relative"
      >
        {/* 1. Navbar without Book Appointment button */}
        <Navbar />

        {/* 2. Primary Hero Marketplace Search & Discovery */}
        <Hero onOpenBooking={handleOpenBooking} />

        {/* 3. Category Discovery Grid (Visual Taxonomy) */}
        <CategoryDiscovery />

        {/* 4. Featured Spas & Salons Multi-Business Directory */}
        <FeaturedBusinesses />

        {/* 5. Trending Services Across Network */}
        <Services onSelectServiceForBooking={handleSelectServiceForBooking} />

        {/* 6. Dedicated Partner Section: Grow Your Spa & Salon with TherapyShala */}
        <BusinessPartnerCTA />

        {/* 7. Marketplace Trust & Standards */}
        <WhyChooseUs />

        {/* 8. Mobile App Showcase */}
        <AppShowcase />

        {/* 9. Sanctuary Suites & Photo Gallery */}
        <Gallery />

        {/* 10. Verified Guest Testimonials */}
        <Testimonials />

        {/* 11. Multi-Session Treatment Passes */}
        <Pricing onOpenBooking={handleOpenBooking} />

        {/* 12. Marketplace Statistics */}
        <Statistics />

        {/* 13. Marketplace FAQ */}
        <FAQ />

        {/* 14. Mobile App Download CTA */}
        <DownloadCTA />

        {/* 15. Footer */}
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
