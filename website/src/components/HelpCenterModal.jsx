import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicHelpCenter } from '../services/content.service';
import { X, Phone, Mail, Clock, HelpCircle, ChevronDown, AlertCircle } from 'lucide-react';

export default function HelpCenterModal({ isOpen, onClose }) {
  const [helpData, setHelpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeGroupIndex, setActiveGroupIndex] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchHelp = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await getPublicHelpCenter();
        const payload = res?.data || res;
        if (isMounted) {
          if (payload && (payload.hotline || payload.email || payload.faqsGrouped)) {
            setHelpData(payload);
          } else {
            setErrorMsg('No Help Center content available.');
          }
        }
      } catch {
        if (isMounted) {
          setErrorMsg('Unable to load Help Center. Please try again.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHelp();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const toggleFaq = (categoryKey, idx) => {
    setActiveGroupIndex((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey] === idx ? -1 : idx,
    }));
  };

  if (!isOpen) return null;

  const faqsGrouped = helpData?.faqsGrouped || {};

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#FAF6F0] rounded-3xl border border-[#AFB0B7]/40 shadow-2xl w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#AFB0B7]/30 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFEEF1] flex items-center justify-center text-[#F35271]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-xl text-[#0D0D12] font-semibold">Help Center & Support</h3>
                <p className="text-xs text-[#757880]">24/7 Customer Care & Assistance Desk</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#0D0D12] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-[#F35271] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#757880] font-medium">Loading Help Center information...</p>
              </div>
            ) : errorMsg ? (
              <div className="py-12 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <p className="text-sm font-medium text-rose-700">{errorMsg}</p>
              </div>
            ) : (
              <>
                {/* Contact Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {helpData?.hotline && (
                    <div className="p-4 rounded-2xl bg-white border border-[#AFB0B7]/30 flex items-center gap-3 shadow-xs">
                      <div className="w-9 h-9 rounded-full bg-[#FFEEF1] flex items-center justify-center text-[#F35271] shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-[#757880] block">Hotline</span>
                        <a href={`tel:${helpData.hotline}`} className="text-xs font-semibold text-[#0D0D12] hover:text-[#F35271] truncate block">
                          {helpData.hotline}
                        </a>
                      </div>
                    </div>
                  )}

                  {helpData?.email && (
                    <div className="p-4 rounded-2xl bg-white border border-[#AFB0B7]/30 flex items-center gap-3 shadow-xs">
                      <div className="w-9 h-9 rounded-full bg-[#FFEEF1] flex items-center justify-center text-[#F35271] shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-[#757880] block">Email Support</span>
                        <a href={`mailto:${helpData.email}`} className="text-xs font-semibold text-[#0D0D12] hover:text-[#F35271] truncate block">
                          {helpData.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {helpData?.availability && (
                    <div className="p-4 rounded-2xl bg-white border border-[#AFB0B7]/30 flex items-center gap-3 shadow-xs">
                      <div className="w-9 h-9 rounded-full bg-[#FFEEF1] flex items-center justify-center text-[#F35271] shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-[#757880] block">Availability</span>
                        <span className="text-xs font-semibold text-[#0D0D12] block">
                          {helpData.availability}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Grouped FAQs */}
                {Object.keys(faqsGrouped).length > 0 && (
                  <div className="space-y-6 pt-2">
                    <h4 className="font-serif-luxury text-lg font-normal text-[#0D0D12]">Support Categories & Guides</h4>
                    {Object.entries(faqsGrouped).map(([categoryName, faqItems]) => (
                      <div key={categoryName} className="space-y-3">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-[#F35271]">{categoryName}</h5>
                        <div className="space-y-2">
                          {Array.isArray(faqItems) &&
                            faqItems.map((item, idx) => {
                              const isOpen = activeGroupIndex[categoryName] === idx;
                              return (
                                <div key={item.id || idx} className="bg-white rounded-2xl border border-[#AFB0B7]/30 overflow-hidden">
                                  <button
                                    onClick={() => toggleFaq(categoryName, idx)}
                                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-semibold text-[#0D0D12] hover:text-[#F35271]"
                                  >
                                    <span>{item.question}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-[#F35271]' : 'text-gray-400'}`} />
                                  </button>
                                  {isOpen && (
                                    <div className="px-4 pb-4 text-xs text-[#757880] border-t border-gray-100 pt-3 leading-relaxed">
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
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#AFB0B7]/30 bg-white flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold rounded-full transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
