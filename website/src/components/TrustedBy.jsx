import React from 'react';
import { PARTNERS_DATA } from '../data/spaData';
import { Award, Shield, Sparkles } from 'lucide-react';

export default function TrustedBy() {
  return (
    <section className="py-12 bg-[#FFEEF1] border-y border-[#AFB0B7]/30">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Label */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#757880] shrink-0">
            <Award className="w-4 h-4 text-[#F35271]" />
            <span>Featured In & Awarded By</span>
          </div>

          {/* Press Logos */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-8 sm:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {PARTNERS_DATA.map((partner, idx) => (
              <span
                key={idx}
                className="font-serif-luxury text-lg sm:text-xl font-bold tracking-widest text-[#0D0D12] hover:text-[#F35271] transition-colors cursor-pointer"
              >
                {partner.name}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
