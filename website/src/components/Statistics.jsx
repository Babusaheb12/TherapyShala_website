import React from 'react';
import { motion } from 'framer-motion';

export default function Statistics() {
  const stats = [
    { value: "15,000+", label: "Delighted Guests", subtext: "Across 4 flagship sanctuaries" },
    { value: "48,000+", label: "Appointments Completed", subtext: "Via app & online concierge" },
    { value: "120+", label: "Master Therapists", subtext: "Certified in organic protocols" },
    { value: "12+", label: "Years of Heritage", subtext: "Award-winning beauty excellence" },
  ];

  return (
    <section className="py-20 bg-[#1F1B18] text-white relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#D88373]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#D88373]/50 transition-colors"
            >
              <span className="font-serif-luxury text-4xl sm:text-5xl font-light text-[#E09F93] mb-2">
                {stat.value}
              </span>
              <h3 className="text-base font-semibold tracking-wide text-white mb-1">
                {stat.label}
              </h3>
              <p className="text-xs text-[#EFE6DC]/60 font-light">
                {stat.subtext}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
