import React from 'react';
import { PARTNERS_DATA } from '../data/spaData';
import { Award } from 'lucide-react';

export default function TrustedBy() {
  const featuredPartners = PARTNERS_DATA.slice(0, 4);

  return (
    <section className="py-10 bg-[#FFEEF1] border-y border-[#AFB0B7]/30">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Label */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#757880] shrink-0">
            <Award className="w-4 h-4 text-[#F35271]" />
            <span>Featured In & Awarded By</span>
          </div>

          {/* 4 Press Logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-4 sm:gap-6 w-full lg:w-auto">
            {featuredPartners.map((partner, idx) => (
              <div
                key={idx}
                className="px-5 py-3 rounded-2xl bg-white/80 border border-[#F35271]/20 hover:border-[#F35271] shadow-2xs hover:shadow-xs transition-all duration-300 flex items-center justify-center text-center"
              >
                <span className="font-serif-luxury text-xs sm:text-sm font-bold tracking-widest text-[#0D0D12]">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
