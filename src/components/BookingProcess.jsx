import React from 'react';
import { motion } from 'framer-motion';
import { BOOKING_STEPS } from '../data/spaData';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';

export default function BookingProcess({ onOpenBooking }) {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-semibold mb-3 block">
            Seamless Reservation Journey
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-[#0D0D12] tracking-tight leading-tight">
            How Your <span className="italic font-normal text-[#F35271]">Sanctuary Experience</span> Unfolds
          </h2>
          <p className="mt-4 text-[#757880] text-base sm:text-lg font-light leading-relaxed">
            From mobile appointment confirmation to your post-treatment herbal elixir, we ensure complete peace of mind.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {BOOKING_STEPS.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white p-8 rounded-3xl border border-[#AFB0B7]/30 shadow-sm hover:shadow-xl transition-all duration-400 flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="w-12 h-12 rounded-full bg-[#FFEEF1] text-[#F35271] font-serif-luxury text-xl font-bold flex items-center justify-center group-hover:scale-110 transition-transform">
                    {step.step}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#F35271] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="font-serif-luxury text-2xl font-normal text-[#0D0D12] group-hover:text-[#F35271] transition-colors mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-[#757880] font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Booking Banner Trigger */}
        <div className="mt-16 text-center">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-3 text-xs font-semibold tracking-wider uppercase text-white bg-[#F35271] hover:bg-[#E04362] px-10 py-4 rounded-full shadow-[0_15px_30px_rgba(243,82,113,0.3)] hover:shadow-[0_20px_40px_rgba(243,82,113,0.45)] transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Launch Quick Reservation Modal</span>
          </button>
        </div>

      </div>
    </section>
  );
}
