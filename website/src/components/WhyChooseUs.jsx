import React from 'react';
import { ShieldCheck, HeartHandshake, Award, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export default function WhyChooseUs() {
  const marketplacePillars = [
    {
      icon: ShieldCheck,
      title: "Verified Sanctuary Standards",
      desc: "Every listed spa and salon undergoes strict audits for sterilization, certified therapists, and pure botanical products."
    },
    {
      icon: Clock,
      title: "Instant 24/7 Booking",
      desc: "Browse real-time slots, select your preferred therapist, and receive instant confirmation with zero booking fees."
    },
    {
      icon: Award,
      title: "Certified Master Specialists",
      desc: "Connect with accredited practitioners in European massage, Korean skin aesthetics, and Ayurvedic healing traditions."
    },
    {
      icon: HeartHandshake,
      title: "Flexible Rescheduling",
      desc: "Plans change? Reschedule or cancel appointments with complete peace of mind up to 6 hours prior to your ritual."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#FFF8F9] border-t border-[#AFB0B7]/25 relative">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-bold block">
            Quality & Trust
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#0D0D12] font-normal leading-tight">
            Why Book Through <span className="italic text-[#F35271] font-light">TherapyShala</span>?
          </h2>
          <p className="text-xs sm:text-sm text-[#757880] font-light leading-relaxed">
            We hold every partner center to premier international hospitality and hygiene standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {marketplacePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-[#AFB0B7]/25 shadow-sm hover:shadow-md transition-all duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFEEF1] text-[#F35271] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-luxury text-xl text-[#0D0D12]">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#757880] font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
