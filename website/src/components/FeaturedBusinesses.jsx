import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllBusinesses } from '../data/spaData';
import { Star, MapPin, ArrowRight, Store, UserPlus } from 'lucide-react';

export default function FeaturedBusinesses() {
  const navigate = useNavigate();
  const allBusinesses = getAllBusinesses();
  const [activeCityTab, setActiveCityTab] = useState('All');

  const filteredBusinesses = activeCityTab === 'All'
    ? allBusinesses
    : allBusinesses.filter(b => b.city.toLowerCase() === activeCityTab.toLowerCase());

  return (
    <section id="featured-businesses" className="py-20 md:py-28 bg-[#FFF8F9] border-y border-[#AFB0B7]/25 relative">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-bold mb-2.5 block">
              Verified Partner Network
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#0D0D12] font-normal leading-tight">
              Featured <span className="italic text-[#F35271] font-light">Spas & Salons</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#757880] font-light mt-2 max-w-xl">
              Explore handpicked, hygienic, and highly-rated wellness centers ready to receive your instant booking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#AFB0B7]/30 hover:border-[#F35271] text-[#0D0D12] hover:text-[#F35271] text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
            >
              <span>Explore All ({allBusinesses.length}) Centers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {['All', 'Jaipur', 'Bangalore', 'Mumbai', 'Goa'].map((city) => (
            <button
              key={city}
              onClick={() => setActiveCityTab(city)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-300 ${
                activeCityTab === city
                  ? 'bg-[#F35271] text-white shadow-md'
                  : 'bg-white text-[#757880] border border-[#AFB0B7]/30 hover:border-[#F35271] hover:text-[#0D0D12]'
              }`}
            >
              {city === 'All' ? 'All Partner Cities' : `${city} Centers`}
            </button>
          ))}
        </div>

        {/* Business Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredBusinesses.slice(0, 8).map((biz) => (
              <motion.div
                key={biz.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[2rem] overflow-hidden border border-[#AFB0B7]/25 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Cover Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={biz.coverImage}
                    alt={biz.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/80 via-transparent to-transparent opacity-85" />

                  <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#0D0D12] uppercase tracking-wider shadow-sm">
                      {biz.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFEEF1] text-[#F35271] text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-[#F35271]" />
                      {biz.rating}
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <div className="flex items-center gap-1 text-[11px] text-white/90 mb-0.5">
                      <MapPin className="w-3 h-3 text-[#FF5E7E]" />
                      <span>{biz.shortLocation}</span>
                    </div>
                    <h3 className="font-serif-luxury text-lg font-normal text-white truncate">
                      {biz.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                  <p className="text-xs text-[#757880] font-light line-clamp-2 leading-relaxed">
                    {biz.description}
                  </p>

                  {/* Price Strip */}
                  <div className="pt-2 border-t border-[#AFB0B7]/20 flex justify-between items-center text-xs">
                    <span className="text-[#757880]">Starting from:</span>
                    <span className="font-serif-luxury text-base font-bold text-[#F35271]">{biz.startingPrice}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#AFB0B7]/20">
                    <Link
                      to={`/business/${biz.slug}`}
                      className="py-2.5 rounded-full text-center text-xs font-semibold text-[#0D0D12] border border-[#AFB0B7]/30 hover:border-[#F35271] hover:text-[#F35271] transition-colors"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => navigate(`/book?businessSlug=${biz.slug}`)}
                      className="py-2.5 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm text-center"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-white rounded-3xl p-6 md:p-8 border border-[#AFB0B7]/25 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEEF1] text-[#F35271] flex items-center justify-center shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-lg text-[#0D0D12]">Own a Spa, Salon, or Beauty Studio?</h4>
              <p className="text-xs text-[#757880] font-light mt-0.5">Join India's curated wellness network and receive customer bookings 24/7.</p>
            </div>
          </div>

          <Link
            to="/list-your-business"
            className="px-6 py-3 rounded-full bg-[#0D0D12] hover:bg-[#F35271] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md shrink-0"
          >
            + List Your Business for Free
          </Link>
        </div>

      </div>
    </section>
  );
}
