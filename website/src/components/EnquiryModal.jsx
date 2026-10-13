import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, MessageSquare, AlertCircle, Tag, Check } from 'lucide-react';
import { submitSpaInquiry } from '../services/inquiry.service';

export default function EnquiryModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    service: 'Massage',
    message: '',
    sponsorCode: '',
  });

  const [showSponsorField, setShowSponsorField] = useState(false);
  const [sponsorApplied, setSponsorApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responseResult, setResponseResult] = useState(null);
  const [inquiryId, setInquiryId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplySponsorCode = () => {
    if (formData.sponsorCode?.trim()) {
      setSponsorApplied(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.ownerName || !formData.phone || !formData.email) {
      setErrorMsg('Please complete required fields (Name, Phone, Email).');
      return;
    }

    setLoading(true);

    try {
      const res = await submitSpaInquiry({
        businessName: formData.businessName || `${formData.ownerName}'s Inquiry`,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        servicesOffered: [formData.service],
        therapistCount: 1,
        branchCount: 1,
        message: formData.message,
        sponsorCode: formData.sponsorCode,
      });

      const assignedId = res?.data?._id || res?.data?.id || `TS-ENQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setInquiryId(assignedId);
      setResponseResult(res?.data || res);
      setSubmitted(true);

      try {
        const stored = JSON.parse(localStorage.getItem('therapyshala_enquiries') || '[]');
        localStorage.setItem('therapyshala_enquiries', JSON.stringify([
          { id: assignedId, ...formData, createdAt: new Date().toISOString() },
          ...stored
        ]));
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      const is500 = err?.status === 500 || err?.code === 'INTERNAL_ERROR';
      setErrorMsg(
        is500
          ? 'The server encountered a temporary delay. Please try submitting again.'
          : (err?.data?.error?.message || err?.message || 'Failed to submit inquiry.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setShowSponsorField(false);
    setSponsorApplied(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#0D0D12]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-xl border border-gray-100 relative my-auto p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#0D0D12]">
                {submitted ? 'Inquiry Submitted' : 'Quick Spa & Concierge Enquiry'}
              </h3>
              <p className="text-xs text-[#757880] mt-0.5">
                Direct submission to Therapyshala onboarding desk.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#757880] hover:text-[#0D0D12] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0D0D12] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0D0D12] mb-1">
                    Spa / Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Oasis Luxury Spa"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0D0D12] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rajesh@oasisspa.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0D0D12] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D0D12] mb-1">
                  Primary Service Category
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-xs bg-white"
                >
                  <option value="Massage">Massage</option>
                  <option value="Ayurveda">Ayurveda</option>
                  <option value="Facial">Facial</option>
                  <option value="Hydrotherapy">Hydrotherapy</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Nail & Lash">Nail &amp; Lash</option>
                </select>
              </div>

              {/* Sponsor Code Button & Section */}
              <div className="pt-0.5">
                {!showSponsorField ? (
                  <button
                    type="button"
                    onClick={() => setShowSponsorField(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-[#F35271]/50 bg-rose-50/40 text-[#F35271] hover:bg-rose-50 hover:border-[#F35271] text-[11px] font-semibold transition-all cursor-pointer group"
                  >
                    <Tag className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                    <span>+ Have a Sponsor / Partner Code?</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-50/60 via-[#FFFDFD] to-orange-50/40 border border-[#F35271]/25 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[#0D0D12] flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-[#F35271]" />
                        <span>Sponsor Code (Optional)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSponsorField(false);
                          setFormData((prev) => ({ ...prev, sponsorCode: '' }));
                          setSponsorApplied(false);
                        }}
                        className="text-[10px] text-[#757880] hover:text-[#0D0D12] font-medium transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex gap-1.5">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          name="sponsorCode"
                          value={formData.sponsorCode}
                          onChange={(e) => {
                            handleChange(e);
                            if (sponsorApplied) setSponsorApplied(false);
                          }}
                          placeholder="e.g. SPONSOR2026"
                          className="w-full uppercase font-mono px-3 py-2 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-xs bg-white tracking-wider text-[#0D0D12]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplySponsorCode}
                        disabled={!formData.sponsorCode?.trim()}
                        className="px-3 py-2 rounded-xl bg-[#0D0D12] hover:bg-[#F35271] text-white text-[11px] font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        {sponsorApplied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    </div>

                    {sponsorApplied && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Code '{formData.sponsorCode.toUpperCase()}' linked!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D0D12] mb-1">
                  Message / Details
                </label>
                <textarea
                  rows="3"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you'd like to onboard or enquire about..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
              >
                {loading ? 'Submitting to API...' : 'Submit Inquiry'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#0D0D12]">Inquiry Received</h4>
              <p className="text-xs text-[#757880]">
                Reference ID: <strong className="text-[#0D0D12] font-mono">{inquiryId}</strong>. Our onboarding team has received your submission.
              </p>
              {(responseResult?.sponsorCode || formData.sponsorCode) && (
                <div className="inline-flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-[#F35271] font-mono mx-auto">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3 h-3" />
                    <span>Sponsor: {(responseResult?.sponsorCode || formData.sponsorCode).toUpperCase()} (Attached)</span>
                  </div>
                  {(responseResult?.sponsorBusinessName || responseResult?.sponsorOwnerName) && (
                    <span className="text-[10px] text-gray-500 font-sans font-medium">
                      {responseResult.sponsorBusinessName || responseResult.sponsorOwnerName}
                    </span>
                  )}
                </div>
              )}
              <div className="pt-3 flex gap-2">
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Hello, I submitted an enquiry for ${formData.businessName || formData.ownerName} (Reference: ${inquiryId}${formData.sponsorCode ? `, Sponsor Code: ${formData.sponsorCode.toUpperCase()}` : ''})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[#0D0D12] text-xs font-semibold hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
