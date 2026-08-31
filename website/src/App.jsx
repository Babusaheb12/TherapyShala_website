import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';

// Existing & Core Pages
import LandingPage from './pages/LandingPage';
import CmsPage from './pages/CmsPage';
import HelpCenterPage from './pages/HelpCenterPage';

// Multi-Business Marketplace Discovery & Profiles
import BusinessesDiscoveryPage from './pages/businesses/BusinessesDiscoveryPage';
import BusinessProfilePage from './pages/businesses/BusinessProfilePage';
import ListYourBusinessPage from './pages/business-registration/ListYourBusinessPage';

// Services & Packages Pages
import ServicesPage from './pages/services/ServicesPage';
import ServiceDetailPage from './pages/services/ServiceDetailPage';
import PackagesPage from './pages/packages/PackagesPage';
import PackageDetailPage from './pages/packages/PackageDetailPage';

// Online Multi-Business Booking Flow
import BookingFlowPage from './pages/booking/BookingFlowPage';

// Offers & Promotions
import OffersPage from './pages/offers/OffersPage';

// Sanctuary Branches Locator
import BranchesPage from './pages/branches/BranchesPage';

// Customer Account & Booking History
import CustomerAccountPage from './pages/account/CustomerAccountPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<LandingPage />} />

        {/* Multi-Business Discovery Routes */}
        <Route path="/explore" element={<BusinessesDiscoveryPage />} />
        <Route path="/businesses" element={<BusinessesDiscoveryPage />} />
        <Route path="/spas" element={<BusinessesDiscoveryPage />} />
        <Route path="/salons" element={<BusinessesDiscoveryPage />} />
        <Route path="/business/:slug" element={<BusinessProfilePage />} />

        {/* 10-Step Business Onboarding Setup */}
        <Route path="/list-your-business" element={<ListYourBusinessPage />} />
        <Route path="/register-business" element={<ListYourBusinessPage />} />

        {/* Services Catalog & Details */}
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />

        {/* Packages & Treatment Passes */}
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/packages/:id" element={<PackageDetailPage />} />

        {/* Online Appointment Booking Engine */}
        <Route path="/book" element={<BookingFlowPage />} />

        {/* Offers & Promo Codes */}
        <Route path="/offers" element={<OffersPage />} />

        {/* Branches */}
        <Route path="/branches" element={<BranchesPage />} />

        {/* Customer Account & Appointments */}
        <Route path="/account" element={<CustomerAccountPage />} />
        <Route path="/account/appointments" element={<CustomerAccountPage />} />
        <Route path="/account/packages" element={<CustomerAccountPage />} />
        <Route path="/account/reviews" element={<CustomerAccountPage />} />

        {/* Dedicated CMS Document Routes */}
        <Route path="/cms/:slug" element={<CmsPage />} />
        <Route path="/privacy" element={<CmsPage docTypeOverride="PRIVACY" docTitleOverride="Privacy Policy" />} />
        <Route path="/terms" element={<CmsPage docTypeOverride="TERMS" docTitleOverride="Terms & Conditions" />} />
        <Route path="/therapist-terms" element={<CmsPage docTypeOverride="THERAPIST_TERMS" docTitleOverride="Therapist Terms" />} />
        <Route path="/cancellation" element={<CmsPage docTypeOverride="CANCELLATION" docTitleOverride="Cancellation Policy" />} />
        <Route path="/refund" element={<CmsPage docTypeOverride="REFUND" docTitleOverride="Refund Policy" />} />
        <Route path="/about-us" element={<CmsPage docTypeOverride="ABOUT_US" docTitleOverride="About Us" />} />

        {/* Dedicated Help Center Route */}
        <Route path="/help-center" element={<HelpCenterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
