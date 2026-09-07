import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Star, ShieldCheck, Zap } from 'lucide-react';

export default function Hero({ onOpenBooking }) {
  const handleReserveClick = () => {
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      const target = document.querySelector('#services');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#FFFDFD] overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#F35271]/5 rounded-full blur-3xl pointer-events-none -mt-20" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#FF5E7E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7">
            
            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF0F3] border border-[#F35271]/20 text-[#F35271] text-xs font-bold uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F35271]" />
              <span>SANCTUARY OF LUXURY SPA THERAPY</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-bold text-[#0D0D12] leading-[1.08] tracking-tight"
            >
              Unveil your <span className="italic font-light text-[#F35271]">Radiant</span><br />
              tranquility &amp; deep spa<br />
              calm
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-sm sm:text-base text-[#757880] font-normal max-w-xl leading-relaxed"
            >
              Experience bespoke thermal hydrotherapy baths, volcanic hot stone massages, 24k gold body scrubs, and botanical facial therapies. Reserved in seconds online.
            </motion.p>

            {/* Reserve Treatment Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pt-2"
            >
              <button
                onClick={handleReserveClick}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#F35271] to-[#FF5E7E] hover:from-[#E04362] hover:to-[#F35271] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_15px_30px_rgba(243,82,113,0.35)] hover:shadow-[0_20px_35px_rgba(243,82,113,0.45)] transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                <span>RESERVE TREATMENT</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Horizontal Divider */}
            <div className="border-t border-[#AFB0B7]/25 pt-6 mt-6">
              {/* Social Proof Row */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-wrap items-center gap-5 sm:gap-6"
              >
                {/* Overlapping Avatars */}
                <div className="flex items-center -space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Guest avatar"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-xs"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt="Guest avatar"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-xs"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                    alt="Guest avatar"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-xs"
                  />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#F35271] text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
                    15K+
                  </div>
                </div>

                {/* Rating Stars & Text */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 text-[#F35271]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#F35271] text-[#F35271]" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#0D0D12] ml-1">4.9 / 5.0</span>
                  </div>
                  <span className="text-[11px] text-[#757880] mt-0.5">
                    Trusted by over 15,000+ discerning clients
                  </span>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Right Column: Hero Image with Floating Glass Badges */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative mx-auto max-w-lg lg:max-w-none"
            >
              {/* Main Spa Treatment Photo Frame */}
              <div className="relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(13,13,18,0.12)] border border-[#AFB0B7]/20 aspect-[4/3] sm:aspect-[1.15/1] bg-[#FFF0F3]">
                <img
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80"
                  alt="Spa Massage Therapy"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge 1: 100% Certified (Top Left) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="absolute -top-4 -left-3 sm:-top-6 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-[0_15px_35px_rgba(13,13,18,0.08)] border border-[#AFB0B7]/20 flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] border border-[#F35271]/20 flex items-center justify-center text-[#F35271] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-[#0D0D12]">
                    100% Certified
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#757880]">
                    Master Therapists &amp; Organic Oils
                  </span>
                </div>
              </motion.div>

              {/* Floating Badge 2: Fast Booking (Bottom Right) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="absolute -bottom-4 -right-3 sm:-bottom-6 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-[0_15px_35px_rgba(13,13,18,0.08)] border border-[#AFB0B7]/20 flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F35271] to-[#FF7B95] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#757880] tracking-wider">
                    FAST BOOKING
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#0D0D12]">
                    Book in &lt; 30 Seconds
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-[#F35271]">
                    Instant Confirmation
                  </span>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
