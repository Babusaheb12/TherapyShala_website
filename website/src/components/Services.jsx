import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES_DATA, SERVICE_CATEGORIES } from '../data/spaData';
import { Clock, Star, Sparkles, ArrowRight, MapPin, Store } from 'lucide-react';

export default function Services({ onSelectServiceForBooking }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = activeCategory === 'all'
    ? SERVICES_DATA
    : SERVICES_DATA.filter((service) => service.categoryId === activeCategory);

  const handleBookService = (service) => {
    if (onSelectServiceForBooking) {
      onSelectServiceForBooking(service);
    } else {
      navigate(`/book?businessSlug=${service.businessSlug}&serviceId=${service.id}`);
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-[#FFFDFD] relative">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-bold mb-2.5 block">
              Marketplace Menu
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#0D0D12] font-normal leading-tight">
              Popular <span className="italic text-[#F35271] font-light">Treatments & Rituals</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#757880] font-light mt-2 max-w-xl">
              Browse top-booked massages, rejuvenating facials, and hair treatments across partner spas and salons.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F35271] hover:text-[#0D0D12] transition-colors self-start md:self-auto"
          >
            <span>View Full Treatment Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-[#F35271] text-white shadow-md'
                  : 'bg-white text-[#757880] border border-[#AFB0B7]/30 hover:border-[#F35271] hover:text-[#0D0D12]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredServices.slice(0, 6).map((service) => (
              <motion.div
                key={`${service.businessSlug}-${service.id}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="group bg-white rounded-[2rem] overflow-hidden border border-[#AFB0B7]/25 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/75 via-transparent to-transparent opacity-80" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#0D0D12] uppercase tracking-wider shadow-sm">
                      {service.category}
                    </span>
                    {service.popular && (
                      <span className="px-3 py-1 rounded-full bg-[#F35271] text-white text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Most Loved
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-[11px] text-white/90 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF5E7E]" />
                      {service.businessName} ({service.businessCity})
                    </span>
                    <span className="bg-[#FFEEF1] px-2.5 py-0.5 rounded-full text-xs font-bold text-[#F35271]">
                      {service.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-[#757880] mb-2">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#F35271]" />
                        {service.duration}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[#0D0D12]">
                        <Star className="w-3.5 h-3.5 fill-[#FF5E7E] text-[#FF5E7E]" />
                        {service.rating} ({service.reviewsCount})
                      </span>
                    </div>

                    <Link to={`/services/${service.id}`}>
                      <h3 className="font-serif-luxury text-xl font-normal text-[#0D0D12] group-hover:text-[#F35271] transition-colors mb-2 line-clamp-1">
                        {service.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#757880] font-light leading-relaxed line-clamp-2">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#AFB0B7]/20">
                    <Link
                      to={`/services/${service.id}`}
                      className="py-2.5 rounded-full text-center text-xs font-semibold text-[#0D0D12] border border-[#AFB0B7]/30 hover:border-[#F35271] hover:text-[#F35271] transition-colors"
                    >
                      Details
                    </Link>

                    <button
                      onClick={() => handleBookService(service)}
                      className="py-2.5 rounded-full text-center text-xs font-semibold text-white bg-[#F35271] hover:bg-[#E04362] transition-colors shadow-md flex items-center justify-center gap-1"
                    >
                      <span>Book Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
