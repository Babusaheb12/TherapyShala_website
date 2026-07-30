import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES_DATA } from '../data/spaData';
import { Star, Clock, ArrowRight, Sparkles, Filter } from 'lucide-react';

export default function Services({ onSelectServiceForBooking }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Body Massage', 'Hydrotherapy', 'Facial Spa', 'Holistic Rituals'];

  const filteredServices = activeCategory === 'All'
    ? SERVICES_DATA
    : SERVICES_DATA.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-semibold mb-3 block">
              Bespoke Spa Therapies
            </span>
            <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-[#0D0D12] tracking-tight leading-none">
              Explore Our <span className="italic font-normal text-[#F35271]">Spa Therapy</span> Menu
            </h2>
          </div>
          <p className="text-[#757880] max-w-md font-light text-base leading-relaxed">
            From deep thermal hydrotherapy baths to volcanic hot stone massage rituals, every treatment is tailored for your physical and mental rejuvenation.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#F35271] text-white shadow-[0_8px_20px_rgba(243,82,113,0.3)]'
                  : 'bg-white text-[#757880] border border-[#AFB0B7]/40 hover:border-[#F35271] hover:text-[#F35271]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group bg-white rounded-3xl overflow-hidden border border-[#AFB0B7]/30 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Image & Badges Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Top Bar Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#0D0D12] uppercase tracking-wider shadow-sm">
                      {service.category}
                    </span>
                    {service.popular && (
                      <span className="px-3 py-1 rounded-full bg-[#F35271] text-white text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Most Loved
                      </span>
                    )}
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 right-4 bg-[#FFEEF1] px-3 py-1.5 rounded-full font-sans-modern font-bold text-sm text-[#F35271] shadow-md border border-[#F35271]/20">
                    {service.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div>
                    {/* Meta Duration & Rating */}
                    <div className="flex items-center gap-4 text-xs text-[#757880] mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#F35271]" />
                        {service.duration}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[#0D0D12]">
                        <Star className="w-3.5 h-3.5 fill-[#FF5E7E] text-[#FF5E7E]" />
                        {service.rating} ({service.reviewsCount})
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif-luxury text-2xl font-normal text-[#0D0D12] group-hover:text-[#F35271] transition-colors mb-3">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#757880] font-light leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => onSelectServiceForBooking(service)}
                    className="w-full py-3.5 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(243,82,113,0.3)] hover:shadow-[0_15px_30px_rgba(243,82,113,0.45)]"
                  >
                    <span>Reserve Spa Therapy</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
