import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicFaqs, getPublicFaqCategories } from '../services/content.service';
import { FAQ_DATA } from '../data/spaData';
import { ChevronDown, Search, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [faqs, setFaqs] = useState(FAQ_DATA || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Search Debounce (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 1. Fetch Categories (GET /content/faqs/categories)
  useEffect(() => {
    let isMounted = true;
    getPublicFaqCategories()
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        if (list.length > 0) setCategories(list);
      })
      .catch(() => {
        // Fallback silently if categories request fails
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch FAQs (GET /content/faqs?category=<cat>&q=<search>&limit=20)
  const fetchFaqs = useCallback(async () => {
    try {
      const params = { limit: 20 };
      if (selectedCategory !== 'ALL') {
        params.category = selectedCategory;
      }
      if (debouncedSearch.trim()) {
        params.q = debouncedSearch.trim();
      }

      const res = await getPublicFaqs(params);
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res)
        ? res
        : [];

      if (list.length > 0) {
        setFaqs(list);
        setOpenIndex(0);
      } else if (debouncedSearch.trim()) {
        // Filter local FAQ_DATA
        const filtered = FAQ_DATA.filter(f => 
          f.question.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          f.answer.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        setFaqs(filtered);
      } else {
        setFaqs(FAQ_DATA);
      }
    } catch {
      // Offline fallback: filter default FAQ_DATA
      if (debouncedSearch.trim()) {
        const filtered = FAQ_DATA.filter(f => 
          f.question.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          f.answer.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        setFaqs(filtered);
      } else {
        setFaqs(FAQ_DATA);
      }
    }
  }, [selectedCategory, debouncedSearch]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#FFEEF1] relative border-t border-[#AFB0B7]/30">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-semibold mb-3 block">
            Clear Transparency
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-light text-[#0D0D12] tracking-tight leading-tight mb-6">
            Frequently Asked <span className="italic font-normal text-[#F35271]">Questions</span>
          </h2>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-4 mb-10">
          {/* Search Input */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F35271]" />
            <input
              type="text"
              placeholder="Search FAQ questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-full border border-[#AFB0B7]/30 text-sm text-[#0D0D12] placeholder-[#757880]/60 focus:outline-none focus:border-[#F35271] shadow-xs transition-all"
            />
          </div>

          {/* Dynamic Category Tabs */}
          {categories.length > 0 && (
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#F35271] text-white shadow-sm'
                    : 'bg-white/80 text-[#0D0D12] hover:bg-white border border-[#AFB0B7]/30'
                }`}
              >
                All FAQs
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#F35271] text-white shadow-sm'
                      : 'bg-white/80 text-[#0D0D12] hover:bg-white border border-[#AFB0B7]/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accordion / Loading / Error / Empty States */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white/70 rounded-2xl p-6 border border-[#AFB0B7]/20 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : errorMsg ? (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-3 shadow-sm">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-medium text-rose-700">{errorMsg}</p>
            <button
              type="button"
              onClick={fetchFaqs}
              className="px-4 py-2 bg-[#F35271] text-white text-xs font-semibold rounded-full hover:bg-[#E04362] transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        ) : faqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#AFB0B7]/30 p-12 text-center space-y-3 shadow-sm">
            <HelpCircle className="w-10 h-10 text-[#AFB0B7] mx-auto" />
            <p className="text-base font-serif-luxury text-[#0D0D12]">No FAQs found.</p>
            <p className="text-xs text-[#757880]">Try clearing your search query or selecting another category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.id || index}
                  className="bg-white rounded-2xl border border-[#AFB0B7]/30 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-serif-luxury text-xl font-normal text-[#0D0D12] hover:text-[#F35271] transition-colors">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-[#FFEEF1] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-[#F35271] text-white' : 'text-[#F35271]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-sm text-[#757880] font-light leading-relaxed border-t border-[#AFB0B7]/20 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
