import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CmsPage from './pages/CmsPage';
import HelpCenterPage from './pages/HelpCenterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
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
        <Route path="/cms/help-center" element={<HelpCenterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
