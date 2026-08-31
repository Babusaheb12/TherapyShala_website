import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Sparkles, Star, Store, UserPlus, 
  ArrowRight, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { CITY_LOCATIONS } from '../data/spaData';

export default function Hero({ onOpenBooking }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchTab, setSearchTab] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    const cityParam = selectedCity !== 'All Cities' ? `&city=${encodeURIComponent(selectedCity)}` : '';
    const typeParam = searchTab !== 'all' ? `&type=${encodeURIComponent(searchTab)}` : '';
    navigate(`/explore?search=${encodeURIComponent(searchTerm)}${cityParam}${typeParam}`);
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-[#FFF5F6] via-[#FFFDFD] to-white border-b border-[#AFB0B7]/20 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-[#F35271]/8 rounded-full blur-3xl pointer-events-none -mt-32" />
      <div className="absolute bottom-0 left-10 w-[600px] h-[600px] bg-[#FF5E7E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        
        <div className="w-full text-center space-y-7">
          
          {/* Balanced Luxury Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0D0D12] font-normal leading-[1.18] tracking-tight max-w-5xl mx-auto"
          >
            Discover & Book the Finest <br className="hidden sm:inline" />
            <span className="italic text-[#F35271] font-light">Spas, Salons & Wellness</span> Near You
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm sm:text-base md:text-lg text-[#757880] font-light max-w-3xl mx-auto leading-relaxed"
          >
            Compare verified centers, browse transparent pricing & services, choose your specialist, and book instant appointments across top cities.
          </motion.p>

          {/* Expansive Full-Width Marketplace Discovery Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-5xl lg:max-w-6xl mx-auto bg-white rounded-[2.5rem] p-4 sm:p-6 border-2 border-[#F35271]/25 shadow-[0_20px_50px_rgba(243,82,113,0.12)] text-left space-y-4 mt-8"
          >
            {/* Search Type Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 px-1 scrollbar-none border-b border-[#AFB0B7]/20">
              {[
                { id: 'all', label: 'All Centers' },
                { id: 'spa', label: 'Spas & Thermal Baths' },
                { id: 'salon', label: 'Salons & Hair Studios' },
                { id: 'wellness', label: 'Ayurvedic & Wellness' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSearchTab(tab.id)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all ${
                    searchTab === tab.id
                      ? 'bg-[#F35271] text-white shadow-sm'
                      : 'text-[#757880] hover:text-[#0D0D12] hover:bg-[#FFEEF1]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main Form Fields (Full Width) */}
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              
              {/* City Dropdown */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-[#FFF8F9] rounded-2xl border border-[#F35271]/20 lg:w-64 shrink-0">
                <MapPin className="w-5 h-5 text-[#F35271] shrink-0" />
                <div className="w-full">
                  <span className="text-[10px] uppercase font-bold text-[#757880] block -mb-0.5">Location</span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Select City"
                    className="w-full text-xs sm:text-sm font-bold text-[#0D0D12] bg-transparent outline-none cursor-pointer"
                  >
                    {CITY_LOCATIONS.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Keyword Search Input */}
              <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-[#FFF8F9] rounded-2xl border border-[#F35271]/20">
                <Search className="w-5 h-5 text-[#F35271] shrink-0" />
                <div className="w-full">
                  <span className="text-[10px] uppercase font-bold text-[#757880] block -mb-0.5">Search Query</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by spa name, haircut, deep tissue, facial..."
                    className="w-full text-xs sm:text-sm font-medium text-[#0D0D12] bg-transparent outline-none placeholder-[#757880]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-10 py-4.5 bg-[#F35271] hover:bg-[#E04362] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 transform active:scale-95"
              >
                <span>Find Centers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular Search Badges */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 px-1 scrollbar-none text-xs text-[#757880]">
              <span className="font-semibold shrink-0 text-[#0D0D12]">Popular:</span>
              {[
                'Swedish Massage',
                'Hydra-Facial',
                'Keratin Hair Spa',
                'Shirodhara',
                'Bridal Glow Pass',
                'Relax Spa Jaipur'
              ].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchTerm(term);
                    navigate(`/explore?search=${encodeURIComponent(term)}`);
                  }}
                  className="px-3.5 py-1 rounded-xl bg-[#FFEEF1] hover:bg-[#F35271] hover:text-white text-[#0D0D12] whitespace-nowrap transition-colors text-xs font-medium"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0D0D12] hover:bg-[#F35271] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
            >
              <Store className="w-4 h-4 text-[#FF5E7E]" />
              <span>Browse All Spas & Salons</span>
            </Link>

            <Link
              to="/list-your-business"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FFEEF1] hover:bg-[#F35271] hover:text-white text-[#F35271] text-xs font-semibold uppercase tracking-wider border border-[#F35271]/30 transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>List Your Spa / Salon (Free)</span>
            </Link>
          </motion.div>

          {/* Marketplace Trust Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-xs sm:text-sm text-[#757880]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#168821]" />
              <span><strong>500+ Verified</strong> Spas & Salons</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#FF5E7E] text-[#FF5E7E]" />
              <span><strong>4.9 / 5.0</strong> Across 50k+ Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F35271]" />
              <span><strong>100% Free</strong> Instant Booking</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
