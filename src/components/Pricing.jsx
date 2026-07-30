import React, { useState } from 'react';
import { PRICING_PACKAGES } from '../data/spaData';
import { Check, Sparkles, Crown } from 'lucide-react';

export default function Pricing({ onOpenBooking }) {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#FFEEF1] border-t border-[#AFB0B7]/30 relative">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-semibold mb-3 block">
            Exclusive Memberships & Ritual Packages
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-[#0D0D12] tracking-tight leading-tight">
            Select Your <span className="italic font-normal text-[#F35271]">Sanctuary Plan</span>
          </h2>
          <p className="mt-4 text-[#757880] text-base font-light">
            Enjoy priority mobile booking, complimentary product gifts, and private VIP suite access.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-white border border-[#AFB0B7]/30 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#F35271] text-white shadow-md'
                  : 'text-[#757880] hover:text-[#0D0D12]'
              }`}
            >
              Monthly Membership
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-[#F35271] text-white shadow-md'
                  : 'text-[#757880] hover:text-[#0D0D12]'
              }`}
            >
              <span>Annual Pass</span>
              <span className="text-[10px] bg-[#FFEEF1] text-[#F35271] px-2 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PACKAGES.map((pkg) => {
            const rawPrice = parseInt(pkg.price.replace(/[^0-9]/g, ''));
            const displayPrice = billingCycle === 'annual' 
              ? `₹${Math.round(rawPrice * 0.8).toLocaleString('en-IN')}`
              : pkg.price;

            return (
              <div
                key={pkg.id}
                className={`rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between transition-all duration-500 relative ${
                  pkg.highlight
                    ? 'bg-[#0D0D12] text-white shadow-[0_25px_60px_rgba(13,13,18,0.25)] border-2 border-[#F35271] lg:-translate-y-4'
                    : 'bg-white text-[#0D0D12] border border-[#AFB0B7]/30 shadow-sm hover:shadow-xl'
                }`}
              >
                {/* Highlight Badge */}
                {pkg.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F35271] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className={`font-serif-luxury text-3xl font-normal mb-2 ${pkg.highlight ? 'text-white' : 'text-[#0D0D12]'}`}>
                      {pkg.name}
                    </h3>
                    <p className={`text-xs font-light ${pkg.highlight ? 'text-white/80' : 'text-[#757880]'}`}>
                      {pkg.subtitle}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-[#AFB0B7]/30">
                    <span className="font-serif-luxury text-5xl font-light text-[#F35271]">
                      {displayPrice}
                    </span>
                    <span className={`text-xs uppercase tracking-wider ${pkg.highlight ? 'text-white/80' : 'text-[#757880]'}`}>
                      / month
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm font-light">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          pkg.highlight ? 'bg-[#F35271] text-white' : 'bg-[#FFEEF1] text-[#F35271]'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className={pkg.highlight ? 'text-white/90' : 'text-[#757880]'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={onOpenBooking}
                  className={`w-full py-4 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-300 ${
                    pkg.highlight
                      ? 'bg-[#F35271] hover:bg-[#E04362] text-white shadow-[0_10px_25px_rgba(243,82,113,0.4)]'
                      : 'bg-[#F35271] hover:bg-[#E04362] text-white shadow-md'
                  }`}
                >
                  {pkg.buttonText}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
