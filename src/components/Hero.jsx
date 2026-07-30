import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowUpRight, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';

export default function Hero({ onOpenBooking }) {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-[#F35271]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#FFEEF1]/80 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Small Subtitle Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full bg-[#FFEEF1] border border-[#F35271]/30 text-[#F35271] text-xs font-semibold uppercase tracking-widest mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sanctuary of Luxury Spa Therapy</span>
            </motion.div>

            {/* Main Luxury Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#0D0D12] tracking-tight leading-[1.1] mb-6"
            >
              Unveil your <span className="font-normal italic text-[#F35271]">Radiant</span> tranquility & deep spa calm
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-[#757880] max-w-xl leading-relaxed mb-8 font-light"
            >
              Experience bespoke thermal hydrotherapy baths, volcanic hot stone massages, 24k gold body scrubs, and botanical facial therapies. Reserved in seconds via our mobile app.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-3 text-sm font-semibold tracking-wider uppercase text-white bg-[#F35271] hover:bg-[#E04362] px-8 py-4 rounded-full shadow-[0_15px_30px_rgba(243,82,113,0.35)] hover:shadow-[0_20px_40px_rgba(243,82,113,0.45)] transition-all duration-300 transform hover:-translate-y-0.5 group"
              >
                <span>Reserve Treatment</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <a
                href="#app-showcase"
                className="inline-flex items-center gap-3 text-sm font-semibold tracking-wider uppercase text-[#F35271] bg-white border-2 border-[#F35271] hover:bg-[#FFEEF1] px-8 py-4 rounded-full transition-all duration-300"
              >
                <Smartphone className="w-4 h-4 text-[#F35271]" />
                <span>Explore Mobile App</span>
              </a>
            </motion.div>

            {/* Social Proof & Customer Avatars */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-center gap-6 pt-6 border-t border-[#AFB0B7]/30"
            >
              {/* Avatars */}
              <div className="flex -space-x-3">
                <img
                  className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Client Avatar 1"
                />
                <img
                  className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
                  alt="Client Avatar 2"
                />
                <img
                  className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80"
                  alt="Client Avatar 3"
                />
                <div className="w-11 h-11 rounded-full border-2 border-white bg-[#F35271] text-white text-xs font-semibold flex items-center justify-center shadow-sm">
                  15K+
                </div>
              </div>

              {/* Rating Text */}
              <div>
                <div className="flex items-center gap-1 text-[#FF5E7E] mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FF5E7E]" />
                  ))}
                  <span className="text-xs font-bold text-[#0D0D12] ml-1">4.9 / 5.0</span>
                </div>
                <p className="text-xs text-[#757880]">Trusted by over 15,000+ discerning clients</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Visual Artwork */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Main Image Frame */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(31,27,24,0.2)] border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=80"
                  alt="Luxury Spa Massage Therapy"
                  className="w-full h-[520px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1B18]/40 via-transparent to-transparent" />
              </div>

              {/* Floating Card 1: Review Badge (Top Left) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_15px_35px_rgba(31,27,24,0.1)] border border-[#EFE6DC] max-w-[210px] hidden sm:flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-full bg-[#F3E3DF] text-[#D88373] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1F1B18]">100% Certified</div>
                  <div className="text-[11px] text-[#6E645E]">Master Therapists & Organic Oils</div>
                </div>
              </motion.div>

              {/* Floating Card 2: App Booking Stat (Bottom Right) */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-8 -right-4 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-[0_20px_45px_rgba(31,27,24,0.12)] border border-[#EFE6DC] z-20 hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#D88373] text-white flex items-center justify-center font-bold text-lg font-serif-luxury shadow-md">
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[#6E645E] font-medium">Fast Booking</div>
                    <div className="text-sm font-bold text-[#1F1B18]">Book in &lt; 30 Seconds</div>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-[#D88373] font-semibold">
                      <span>Instant App Confirmation</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
