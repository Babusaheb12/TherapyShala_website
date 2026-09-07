import React from 'react';
import { Award } from 'lucide-react';

export default function TrustedBy() {
  const pressAwards = [
    "VOGUE SPA & WELLNESS",
    "ELLE SPA",
    "HARPER'S BAZAAR",
    "LUXURY SPA AWARDS 2025"
  ];

  return (
    <section className="py-7 md:py-8 bg-[#FFF0F3] border-y border-[#F35271]/15">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          
          {/* Label */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#757880] shrink-0">
            <Award className="w-4 h-4 text-[#F35271]" />
            <span>FEATURED IN &amp; AWARDED BY</span>
          </div>

          {/* 4 Press Logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-3 sm:gap-4 w-full lg:w-auto">
            {pressAwards.map((item, idx) => (
              <div
                key={idx}
                className="px-6 py-3 rounded-full bg-white border border-[#AFB0B7]/20 shadow-xs flex items-center justify-center text-center"
              >
                <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#0D0D12]">
                  {item}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
