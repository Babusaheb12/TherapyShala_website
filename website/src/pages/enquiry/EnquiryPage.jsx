import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Phone, Mail, MapPin, CheckCircle2, 
  MessageSquare, Clock, ArrowLeft, AlertCircle, Building2, User, Users, Store
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { submitSpaInquiry } from '../../services/inquiry.service';

const AVAILABLE_SERVICES = [
  'Massage',
  'Ayurveda',
  'Facial',
  'Hydrotherapy',
  'Skincare',
  'Nail & Lash',
  'Hair Care'
];

export default function EnquiryPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    therapistCount: 5,
    branchCount: 1,
    servicesOffered: ['Massage', 'Ayurveda', 'Facial'],
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [responseResult, setResponseResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (srv) => {
    setFormData((prev) => {
      const exists = prev.servicesOffered.includes(srv);
      const updated = exists
        ? prev.servicesOffered.filter((s) => s !== srv)
        : [...prev.servicesOffered, srv];
      return { ...prev, servicesOffered: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.businessName.trim() || !formData.ownerName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMsg('Please complete all required fields (Business Name, Owner Name, Email, Phone).');
      return;
    }

    setLoading(true);

    try {
      const res = await submitSpaInquiry(formData);
      setResponseResult(res?.data || res);
      setSubmitted(true);

      // Save locally as well for offline session history
      try {
        const stored = JSON.parse(localStorage.getItem('therapyshala_enquiries') || '[]');
        localStorage.setItem('therapyshala_enquiries', JSON.stringify([
          { ...(res?.data || formData), submittedAt: new Date().toISOString() },
          ...stored
        ]));
      } catch (err) {
        console.error('Storage error', err);
      }
    } catch (err) {
      console.error('Inquiry submission error:', err);
      setErrorMsg(err?.data?.error?.message || err?.message || 'Failed to submit inquiry to server. Please verify your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setResponseResult(null);
    setFormData({
      businessName: '',
      ownerName: '',
      email: '',
      phone: '',
      therapistCount: 5,
      branchCount: 1,
      servicesOffered: ['Massage', 'Ayurveda', 'Facial'],
      message: '',
    });
  };

  const inquiryId = responseResult?._id || responseResult?.id || `TS-ENQ-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="min-h-screen bg-white text-[#0D0D12] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto w-full">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#757880] hover:text-[#F35271] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F35271] block mb-1.5">
            Partner Onboarding &amp; Sanctuary Inquiries
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0D0D12]">
            Spa &amp; Salon Enquiry Form
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#757880]">
            Submit your onboarding inquiry to list your spa and therapists, or connect with our luxury concierge desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 bg-[#FFFDFD] rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0D0D12] mb-1.5">
                        Spa / Business Name *
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          placeholder="e.g. Oasis Luxury Spa"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-sm transition-all bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0D0D12] mb-1.5">
                        Owner / Representative Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          name="ownerName"
                          value={formData.ownerName}
                          onChange={handleChange}
                          placeholder="e.g. Rajesh Sharma"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-sm transition-all bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0D0D12] mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="rajesh@oasisspa.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-sm transition-all bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0D0D12] mb-1.5">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-sm transition-all bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0D0D12] mb-1.5">
                        Therapist Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        name="therapistCount"
                        value={formData.therapistCount}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-sm transition-all bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0D0D12] mb-1.5">
                        Branch Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        name="branchCount"
                        value={formData.branchCount}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-sm transition-all bg-white"
                      />
                    </div>
                  </div>

                  {/* Services Offered Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0D0D12] mb-2">
                      Services Offered (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_SERVICES.map((srv) => {
                        const isSelected = formData.servicesOffered.includes(srv);
                        return (
                          <button
                            key={srv}
                            type="button"
                            onClick={() => toggleService(srv)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#F35271] text-white shadow-xs'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{srv}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0D0D12] mb-1.5">
                      Message / Onboarding Details
                    </label>
                    <textarea
                      rows="3"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="e.g. We want to onboard our spa and therapists with private wellness suites..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-sm transition-all bg-white resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <span>Submitting Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Public Spa Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#0D0D12]">Inquiry Submitted Successfully!</h3>
                    <p className="text-sm text-[#757880] mt-1.5 max-w-md mx-auto">
                      Thank you, <strong className="text-[#0D0D12]">{formData.ownerName}</strong>. Your spa onboarding inquiry for <strong className="text-[#0D0D12]">{formData.businessName}</strong> has been received with status <span className="font-semibold text-green-600">PENDING</span>.
                    </p>
                  </div>

                  {/* Reference Card */}
                  <div className="max-w-md mx-auto p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#757880]">Inquiry Reference ID:</span>
                      <strong className="text-[#0D0D12] font-mono">{inquiryId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#757880]">Email:</span>
                      <strong className="text-[#0D0D12]">{formData.email}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#757880]">Phone:</span>
                      <strong className="text-[#0D0D12]">{formData.phone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#757880]">Therapists:</span>
                      <strong className="text-[#0D0D12]">{formData.therapistCount}</strong>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(
                        `Hi Therapyshala, I submitted spa inquiry for ${formData.businessName} (Ref: ${inquiryId}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#20ba59] transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 rounded-xl border border-gray-200 text-[#0D0D12] text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                    >
                      Submit Another
                    </button>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact Details (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-200/70 space-y-5">
              <h3 className="text-base font-bold text-[#0D0D12]">
                Spa Partner Onboarding Desk
              </h3>
              
              <div className="space-y-4 text-xs text-[#757880]">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#F35271] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#0D0D12] block">Partner Helpline</span>
                    <a href="tel:+919876543210" className="hover:text-[#F35271] transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#F35271] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#0D0D12] block">Partner Desk Email</span>
                    <a href="mailto:partners@therapyshala.com" className="hover:text-[#F35271] transition-colors">
                      partners@therapyshala.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#F35271] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#0D0D12] block">Verification Review</span>
                    <span>Within 24 to 48 Hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#F35271] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#0D0D12] block">Headquarters</span>
                    <span>City Center, Tonk Road, Jaipur</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
