import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { submitSpaInquiry } from '../services/inquiry.service';

export default function EnquiryModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    service: 'Massage',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      });

      const assignedId = res?.data?._id || res?.data?.id || `TS-ENQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setInquiryId(assignedId);
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
      setErrorMsg(err?.data?.error?.message || err?.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
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
              <div className="pt-3 flex gap-2">
                <a
                  href={`https://wa.me/919876543210?text=Hello,%20I%20have%20an%20enquiry%20reference%20${inquiryId}`}
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
