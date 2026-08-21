import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicAppFeedback } from '../services/content.service';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchLiveFeedback = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await getPublicAppFeedback({ limit: 20 });
      const items = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];

      const mapped = items.map((item) => ({
        id: item.id || item._id || item.publicId,
        name: item.user?.fullName || item.user?.name || item.userName || 'Valued Guest',
        role: 'Verified App Customer',
        avatar: item.user?.avatarUrl || item.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        rating: item.starCount ?? item.rating ?? 5,
        content: item.description || item.comment || item.message || item.content || 'Great experience!',
        treatment: item.category ? String(item.category).replace('_', ' ') : 'App Experience',
      }));

      setTestimonials(mapped);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Failed to load live app reviews:', err.message);
      setErrorMsg(err.message || 'Unable to fetch reviews from server.');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveFeedback();
  }, []);

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-semibold mb-3 block">
            Guest Testimonials & Feedback
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-[#0D0D12] tracking-tight leading-tight">
            Stories of <span className="italic font-normal text-[#F35271]">Tranquility</span> & Renewal
          </h2>
          <p className="mt-4 text-[#757880] text-base sm:text-lg font-light leading-relaxed">
            Read authentic reviews & published app feedback from guests who transformed their wellbeing at Therapyshala.
          </p>
        </div>

        {/* Testimonial Showcase Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#FAF9F6] rounded-[2.5rem] p-8 sm:p-14 border border-[#EBEBEB] shadow-[0_20px_50px_rgba(13,13,18,0.05)] relative">
            
            {/* Quote Icon watermark */}
            <Quote className="w-20 h-20 text-[#FCE8EC] absolute top-8 right-10 pointer-events-none" />

            {loading ? (
              <div className="py-12 text-center text-[#757880]">
                <div className="w-8 h-8 border-2 border-[#F35271] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-medium">Fetching verified guest reviews from API...</p>
              </div>
            ) : errorMsg ? (
              <div className="py-10 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
                <button
                  type="button"
                  onClick={fetchLiveFeedback}
                  className="px-4 py-2 bg-[#F35271] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 hover:bg-[#d63f5d] transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry Fetching Reviews
                </button>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="py-12 text-center text-[#757880] space-y-3 relative z-10">
                <MessageSquare className="w-10 h-10 text-[#F35271] mx-auto opacity-70" />
                <h3 className="font-serif-luxury text-2xl text-[#1F1B18]">No Published Guest Reviews</h3>
                <p className="text-xs font-light max-w-md mx-auto">
                  There are currently no customer reviews published in the system. Reviews approved via the admin dashboard will automatically appear live here.
                </p>
                <button
                  type="button"
                  onClick={fetchLiveFeedback}
                  className="px-4 py-2 border border-[#EFE6DC] rounded-xl text-xs font-bold text-[#1F1B18] inline-flex items-center gap-2 hover:bg-[#F3E3DF]/50 transition mt-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial?.id || currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-8 relative z-10"
                >
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(activeTestimonial?.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                    <span className="text-xs font-bold text-[#1F1B18] ml-2">
                      Verified Guest Review
                    </span>
                  </div>

                  {/* Content Quote */}
                  <p className="font-serif-luxury text-2xl sm:text-3xl text-[#1F1B18] font-light leading-relaxed italic">
                    "{activeTestimonial?.content}"
                  </p>

                  {/* Author Info & Avatar */}
                  <div className="flex items-center justify-between pt-6 border-t border-[#EFE6DC]">
                    <div className="flex items-center gap-4">
                      <img
                        src={activeTestimonial?.avatar}
                        alt={activeTestimonial?.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#D88373]/40 shadow-md"
                      />
                      <div>
                        <h4 className="font-serif-luxury text-xl font-medium text-[#1F1B18]">
                          {activeTestimonial?.name}
                        </h4>
                        <p className="text-xs text-[#6E645E] font-light">
                          {activeTestimonial?.role}
                        </p>
                        <span className="text-[11px] text-[#D88373] font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle className="w-3 h-3" />
                          Category: {activeTestimonial?.treatment}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    {testimonials.length > 1 && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handlePrev}
                          className="w-12 h-12 rounded-full border border-[#EFE6DC] hover:border-[#D88373] hover:bg-[#F3E3DF]/50 flex items-center justify-center text-[#1F1B18] transition-all"
                          aria-label="Previous Testimonial"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleNext}
                          className="w-12 h-12 rounded-full border border-[#EFE6DC] hover:border-[#D88373] hover:bg-[#F3E3DF]/50 flex items-center justify-center text-[#1F1B18] transition-all"
                          aria-label="Next Testimonial"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                </motion.div>
              </AnimatePresence>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
