import React from 'react';
import { Award, Sparkles, ShieldCheck, Smartphone, Tag, Crown } from 'lucide-react';

export default function WhyChooseUs() {
  const excellenceStandards = [
    {
      num: "01",
      icon: Award,
      title: "Master Certified Spa Therapists",
      desc: "Every therapist undergoes 500+ hours of international certification in European spa protocols and Eastern body therapies."
    },
    {
      num: "02",
      icon: Sparkles,
      title: "100% Organic Botanical Spa Oils",
      desc: "Cruelty-free, vegan-certified botanical elixirs harvested from sustainable eco-farms across Provence and Kyoto."
    },
    {
      num: "03",
      icon: ShieldCheck,
      title: "Clinical Sanctuary Hygiene",
      desc: "UV-C medical sterilization, single-use organic linen, and private air-purified treatment sanctuaries."
    },
    {
      num: "04",
      icon: Smartphone,
      title: "Instant Mobile Spa Booking",
      desc: "Seamlessly select your favorite spa therapist, view real-time calendar availability, and manage reschedule in seconds."
    },
    {
      num: "05",
      icon: Tag,
      title: "Transparent Bespoke Pricing",
      desc: "Zero surprise fees. Complimentary herbal elixir tasting, consultation, and post-therapy gift kit included."
    },
    {
      num: "06",
      icon: Crown,
      title: "Private VIP Hydrotherapy Suites",
      desc: "Sound-dampened private suites equipped with ambient temperature control, custom acoustic soundscapes, and en-suite hydro-tubs."
    }
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-[#FFF5F6] border-t border-[#F35271]/15 relative">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-bold block">
            THE THERAPYSHALA EXCELLENCE STANDARD
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-[#0D0D12] font-bold leading-tight tracking-tight">
            Why Discerning Clients <br className="hidden sm:inline" />
            Choose <span className="italic font-light text-[#F35271]">Therapyshala</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#757880] font-normal leading-relaxed max-w-2xl mx-auto pt-1">
            We blend European skincare innovations with ancient Asian wellness traditions in an atmosphere of quiet luxury and clinical purity.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {excellenceStandards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[2rem] p-7 sm:p-8 border border-[#AFB0B7]/20 shadow-[0_10px_30px_rgba(13,13,18,0.03)] hover:shadow-[0_15px_35px_rgba(243,82,113,0.1)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Icon & Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] border border-[#F35271]/20 text-[#F35271] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold text-[#F35271]">
                      {item.num}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#0D0D12] mb-2.5 leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#757880] font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
