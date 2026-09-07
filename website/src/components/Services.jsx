import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star, Sparkles, ArrowRight } from 'lucide-react';

const SPA_SERVICES = [
  {
    id: 1,
    title: "Aromatherapy Stress Relief Spa Massage",
    category: "BODY MASSAGE",
    categoryId: "body-massage",
    price: "₹2,299",
    duration: "60 mins",
    rating: "4.9",
    reviewsCount: 380,
    popular: true,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    description: "Custom blended essential oils (Bergamot, Ylang Ylang, Sandalwood) designed to restore hormonal balance and deep mental calmness."
  },
  {
    id: 2,
    title: "24k Gold Body Scrub & Clay Cocoon Wrap",
    category: "HOLISTIC RITUALS",
    categoryId: "holistic-rituals",
    price: "₹3,999",
    duration: "100 mins",
    rating: "5",
    reviewsCount: 168,
    popular: true,
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
    description: "Exfoliating 24k gold leaf body scrub, detoxifying Dead Sea clay wrap, followed by a nourishing rosehip seed oil massage."
  },
  {
    id: 3,
    title: "Swedish Relaxing Full Body Therapy",
    category: "BODY MASSAGE",
    categoryId: "body-massage",
    price: "₹1,999",
    duration: "60 mins",
    rating: "4.8",
    reviewsCount: 310,
    popular: false,
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80",
    description: "Gentle gliding strokes, kneading, and rhythmic tapping designed to enhance circulation and ease day-to-day physical stress."
  },
  {
    id: 4,
    title: "Signature Rose Botanical Spa Facial",
    category: "FACIAL SPA",
    categoryId: "facial-spa",
    price: "₹2,499",
    duration: "75 mins",
    rating: "4.9",
    reviewsCount: 320,
    popular: true,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    description: "Organic damask rose hydration, custom enzyme peels, and LED light renewal therapy."
  },
  {
    id: 5,
    title: "Thermal Hydrotherapy & Herbal Milk Bath",
    category: "HYDROTHERAPY",
    categoryId: "hydrotherapy",
    price: "₹1,999",
    duration: "60 mins",
    rating: "4.95",
    reviewsCount: 240,
    popular: true,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    description: "Warm mineral milk soak infused with wild lavender blossoms in a private hydro-jet jacuzzi suite."
  },
  {
    id: 6,
    title: "Deep Tissue Volcanic Hot Stone Ritual",
    category: "BODY MASSAGE",
    categoryId: "body-massage",
    price: "₹2,999",
    duration: "90 mins",
    rating: "5.0",
    reviewsCount: 412,
    popular: false,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
    description: "Targeted deep pressure friction combined with warm basalt volcanic stones and organic lavender elixirs."
  }
];

const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'body-massage', label: 'BODY MASSAGE' },
  { id: 'hydrotherapy', label: 'HYDROTHERAPY' },
  { id: 'facial-spa', label: 'FACIAL SPA' },
  { id: 'holistic-rituals', label: 'HOLISTIC RITUALS' }
];

export default function Services({ onSelectServiceForBooking }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = activeCategory === 'all'
    ? SPA_SERVICES
    : SPA_SERVICES.filter((s) => s.categoryId === activeCategory);

  const handleBook = (service) => {
    if (onSelectServiceForBooking) {
      onSelectServiceForBooking(service);
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-white relative">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-bold mb-3 block">
              BESPOKE SPA THERAPIES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-[#0D0D12] font-bold leading-tight tracking-tight">
              Explore Our <span className="italic font-light text-[#F35271]">Spa Therapy</span><br className="hidden sm:inline" />
              Menu
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#757880] font-normal leading-relaxed max-w-lg lg:pb-2">
            From deep thermal hydrotherapy baths to volcanic hot stone massage rituals, every treatment is tailored for your physical and mental rejuvenation.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#F35271] text-white shadow-md'
                  : 'bg-white text-[#757880] border border-[#AFB0B7]/30 hover:border-[#F35271] hover:text-[#0D0D12]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="group bg-white rounded-[2rem] overflow-hidden border border-[#AFB0B7]/25 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative h-64 overflow-hidden bg-[#FFF0F3]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#0D0D12] uppercase tracking-wider shadow-xs">
                      {service.category}
                    </span>
                    {service.popular && (
                      <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#F35271] to-[#FF5E7E] text-white text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> MOST LOVED
                      </span>
                    )}
                  </div>

                  {/* Price Tag Pill on Image */}
                  <div className="absolute bottom-3.5 right-4">
                    <span className="bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold text-[#F35271] shadow-md border border-[#F35271]/20">
                      {service.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow space-y-4">
                  <div>
                    {/* Meta Specs */}
                    <div className="flex items-center gap-4 text-xs text-[#757880] mb-2.5">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#F35271]" />
                        {service.duration}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[#0D0D12]">
                        <Star className="w-3.5 h-3.5 fill-[#FF5E7E] text-[#FF5E7E]" />
                        {service.rating} ({service.reviewsCount})
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#0D0D12] group-hover:text-[#F35271] transition-colors mb-2.5 line-clamp-2 leading-snug">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#757880] font-normal leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Primary CTA Button */}
                  <div className="pt-3">
                    <button
                      onClick={() => handleBook(service)}
                      className="w-full py-3.5 rounded-full text-center text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#F35271] to-[#FF5E7E] hover:from-[#E04362] hover:to-[#F35271] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
                    >
                      <span>RESERVE SPA THERAPY</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
