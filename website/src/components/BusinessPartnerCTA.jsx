import React from 'react';
import { Link } from 'react-router-dom';
import { Store, UserPlus, Sparkles, CheckCircle2, ArrowRight, TrendingUp, Users, CalendarCheck, ShieldCheck } from 'lucide-react';

export default function BusinessPartnerCTA() {
  const partnerPerks = [
    {
      title: "Get Discovered by Thousands",
      desc: "Gain instant visibility with high-intent clients searching for wellness, massage, and beauty rituals in your city."
    },
    {
      title: "Automated 24/7 Appointments",
      desc: "Receive real-time customer bookings with customizable time slots, therapist allocation, and zero booking commission."
    },
    {
      title: "Custom Services & Passes",
      desc: "Showcase single therapies, bridal bundles, and multi-session treatment passes with transparent pricing and GST details."
    },
    {
      title: "Dedicated Public Business Profile",
      desc: "Get your own verified profile (therapyshala.com/business/your-spa) complete with photo gallery, reviews, and staff bios."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#0D0D12] text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F35271]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF5E7E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Perks (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#FF5E7E] text-xs font-bold uppercase tracking-widest mb-4 border border-white/15">
                <Store className="w-3.5 h-3.5" />
                <span>SpaMate • For Business Owners</span>
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
                Grow Your Spa & Salon on <span className="italic font-light text-[#F35271]">TherapyShala</span>
              </h2>
              <p className="text-sm sm:text-base text-white/70 font-light mt-3 leading-relaxed max-w-xl">
                Join India’s premier open wellness marketplace. List your center, customize your menu, and receive direct customer appointments in 10 minutes.
              </p>
            </div>

            {/* Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {partnerPerks.map((p, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#F35271] font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#F35271] shrink-0" />
                    <h4 className="text-white font-serif-luxury text-base">{p.title}</h4>
                  </div>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/list-your-business"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-[0_10px_30px_rgba(243,82,113,0.4)] transition-all transform hover:-translate-y-0.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>List Your Business for Free</span>
              </Link>
              
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <span>View Registered Centers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 10-Step Setup Highlight Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-white/15 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#F35271]">
                  10-Step Rapid Setup
                </span>
                <span className="px-3 py-1 rounded-full bg-[#168821]/20 text-[#168821] text-xs font-bold">
                  Zero Setup Fee
                </span>
              </div>

              <div className="space-y-3.5 text-xs text-white/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F35271]/20 text-[#F35271] font-bold flex items-center justify-center text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <strong className="text-white">Business Info & Location</strong>
                    <p className="text-white/60 text-[11px]">Add your name, category, flagship and branches</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F35271]/20 text-[#F35271] font-bold flex items-center justify-center text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <strong className="text-white">Services & Treatment Passes</strong>
                    <p className="text-white/60 text-[11px]">List pricing, duration, and multi-session bundles</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F35271]/20 text-[#F35271] font-bold flex items-center justify-center text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <strong className="text-white">Staff, Suites & Payouts</strong>
                    <p className="text-white/60 text-[11px]">Add certified specialists, hydro-tubs, and GST details</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <Link
                  to="/list-your-business"
                  className="w-full py-3.5 rounded-full bg-white text-[#0D0D12] hover:bg-[#F35271] hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider block text-center"
                >
                  Start Onboarding Now →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
