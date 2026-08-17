import React from 'react';
import { motion } from 'framer-motion';
import { WHY_CHOOSE_US } from '../data/spaData';
import { Award, Sparkles, ShieldCheck, Smartphone, Tag, Crown } from 'lucide-react';

export default function WhyChooseUs() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Award': return <Award className="w-6 h-6 text-[#F35271]" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-[#F35271]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-[#F35271]" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-[#F35271]" />;
      case 'Tag': return <Tag className="w-6 h-6 text-[#F35271]" />;
      case 'Crown': return <Crown className="w-6 h-6 text-[#F35271]" />;
      default: return <Sparkles className="w-6 h-6 text-[#F35271]" />;
    }
  };

  return (
    <section id="why-us" className="py-24 md:py-32 bg-[#FFEEF1] border-y border-[#AFB0B7]/30 relative overflow-hidden">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-semibold mb-3 block">
            The Therapyshala Excellence Standard
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-[#0D0D12] tracking-tight leading-tight">
            Why Discerning Clients Choose <span className="italic font-normal text-[#F35271]">Therapyshala</span>
          </h2>
          <p className="mt-4 text-[#757880] text-base sm:text-lg font-light leading-relaxed">
            We blend European skincare innovations with ancient Asian wellness traditions in an atmosphere of quiet luxury and clinical purity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 md:p-10 rounded-3xl border border-[#AFB0B7]/30 shadow-sm hover:shadow-xl transition-all duration-400 group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#FFEEF1] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {getIcon(item.icon)}
                </div>
                <span className="font-serif-luxury text-3xl font-light text-[#E06278]">
                  {item.id}
                </span>
              </div>

              <h3 className="font-serif-luxury text-2xl font-normal text-[#0D0D12] group-hover:text-[#F35271] transition-colors mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-[#757880] font-light leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
