import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicHelpCenter } from '../services/content.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HelpCircle, Phone, Mail, Clock, ChevronDown, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

export default function HelpCenterPage() {
  const [helpData, setHelpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeGroupIndex, setActiveGroupIndex] = useState({});

  const fetchHelp = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await getPublicHelpCenter();
      const payload = res?.data || res;
      if (payload && (payload.hotline || payload.email || payload.faqsGrouped)) {
        setHelpData(payload);
      } else {
        setErrorMsg('No Help Center content available.');
      }
    } catch {
      setErrorMsg('Unable to load Help Center content from live server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHelp();
  }, []);

  const toggleFaq = (categoryKey, idx) => {
    setActiveGroupIndex((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey] === idx ? -1 : idx,
    }));
  };

  const faqsGrouped = helpData?.faqsGrouped || {};

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1B18] font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 lg:px-16 xl:px-20 max-w-[1720px] mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F35271] hover:text-[#E04362] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Page Hero */}
        <div className="bg-white rounded-3xl border border-[#AFB0B7]/30 p-8 md:p-12 mb-10 shadow-xs">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEEF1] flex items-center justify-center text-[#F35271] shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F35271] block">
                Customer Support Desk
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#0D0D12]">
                Help Center & Assistance
              </h1>
            </div>
          </div>
          <p className="text-sm text-[#757880] font-light max-w-xl">
            Find answers to common questions, browse support categories, or reach out directly to our dedicated luxury concierge care team.
          </p>
        </div>

        {/* Body Content */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-[#AFB0B7]/30 p-16 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#F35271] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-[#757880]">Loading Help Center details...</p>
          </div>
        ) : errorMsg ? (
          <div className="bg-white rounded-3xl border border-[#AFB0B7]/30 p-16 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm font-medium text-rose-700">{errorMsg}</p>
            <button
              type="button"
              onClick={fetchHelp}
              className="px-6 py-3 bg-[#F35271] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#E04362] transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {helpData?.hotline && (
                <div className="p-6 rounded-3xl bg-white border border-[#AFB0B7]/30 flex items-center gap-4 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFEEF1] flex items-center justify-center text-[#F35271] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#757880] tracking-wider block">Customer Support</span>
                    <a href={`tel:${helpData.hotline}`} className="text-sm font-bold text-[#0D0D12] hover:text-[#F35271] truncate block mt-0.5">
                      {helpData.hotline}
                    </a>
                  </div>
                </div>
              )}

              {helpData?.email && (
                <div className="p-6 rounded-3xl bg-white border border-[#AFB0B7]/30 flex items-center gap-4 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFEEF1] flex items-center justify-center text-[#F35271] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#757880] tracking-wider block">Email Care</span>
                    <a href={`mailto:${helpData.email}`} className="text-sm font-bold text-[#0D0D12] hover:text-[#F35271] truncate block mt-0.5">
                      {helpData.email}
                    </a>
                  </div>
                </div>
              )}

              {helpData?.availability && (
                <div className="p-6 rounded-3xl bg-white border border-[#AFB0B7]/30 flex items-center gap-4 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFEEF1] flex items-center justify-center text-[#F35271] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#757880] tracking-wider block">Desk Availability</span>
                    <span className="text-sm font-bold text-[#0D0D12] block mt-0.5">
                      {helpData.availability}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Grouped Guides */}
            {Object.keys(faqsGrouped).length > 0 && (
              <div className="bg-white rounded-3xl border border-[#AFB0B7]/30 p-8 md:p-12 shadow-sm space-y-8">
                <h3 className="font-serif-luxury text-2xl font-semibold text-[#0D0D12]">
                  Support Guides & Categories
                </h3>
                {Object.entries(faqsGrouped).map(([categoryName, faqItems]) => (
                  <div key={categoryName} className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#F35271]">{categoryName}</h4>
                    <div className="space-y-3">
                      {Array.isArray(faqItems) &&
                        faqItems.map((item, idx) => {
                          const isOpen = activeGroupIndex[categoryName] === idx;
                          return (
                            <div key={item.id || idx} className="bg-[#FAF6F0] rounded-2xl border border-[#AFB0B7]/20 overflow-hidden">
                              <button
                                onClick={() => toggleFaq(categoryName, idx)}
                                className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-[#0D0D12] hover:text-[#F35271]"
                              >
                                <span>{item.question}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-[#F35271]' : 'text-gray-400'}`} />
                              </button>
                              {isOpen && (
                                <div className="px-5 pb-5 text-sm text-[#757880] font-light border-t border-[#AFB0B7]/20 pt-4 leading-relaxed">
                                  {item.answer}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
