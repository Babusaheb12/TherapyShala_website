import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllBusinesses, BUSINESS_TYPES, CITY_LOCATIONS } from '../../data/spaData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHeader from '../../components/common/PageHeader';
import { 
  Search, MapPin, Star, Filter, ArrowRight, Sparkles, 
  Store, CheckCircle2, SlidersHorizontal, UserPlus, Phone 
} from 'lucide-react';

export default function BusinessesDiscoveryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialCity = searchParams.get('city') || 'All Cities';
  const initialType = searchParams.get('type') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedType, setSelectedType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [minRating, setMinRating] = useState('all');

  const allBusinesses = getAllBusinesses();

  const filteredBusinesses = useMemo(() => {
    return allBusinesses.filter((b) => {
      // City filter
      const bCity = b.city || (typeof b.address === 'object' ? b.address?.city : '') || '';
      if (selectedCity !== 'All Cities' && bCity.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      // Type filter
      if (selectedType !== 'all' && b.typeId !== selectedType && !b.type?.toLowerCase().includes(selectedType.toLowerCase())) {
        return false;
      }
      // Rating filter
      if (minRating !== 'all' && b.rating < parseFloat(minRating)) {
        return false;
      }
      // Search keyword
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = b.name?.toLowerCase().includes(q);
        const matchesCity = bCity.toLowerCase().includes(q);
        const addrStr = typeof b.address === 'object' ? `${b.address.line1 || ''} ${b.address.city || ''}` : (b.address || '');
        const matchesAddress = addrStr.toLowerCase().includes(q);
        const matchesServices = b.popularServices?.some(s => s.toLowerCase().includes(q));
        const matchesDesc = b.description?.toLowerCase().includes(q);
        return matchesName || matchesCity || matchesAddress || matchesServices || matchesDesc;
      }
      return true;
    });
  }, [allBusinesses, selectedCity, selectedType, minRating, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12]">
      <Navbar />

      <PageHeader
        badge="Marketplace Directory"
        title="Find Verified Spas &"
        titleHighlight="Salons"
        description="Explore top-rated luxury day spas, hair studios, Ayurvedic retreats, and beauty lounges across India with transparent pricing."
        breadcrumbs={[{ label: 'Explore Spas & Salons' }]}
      />

      <main className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-10 md:py-16">
        
        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-6 border border-[#AFB0B7]/25 shadow-sm space-y-6 mb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#757880]" />
              <input
                type="text"
                placeholder="Search spa, salon name, massage, facial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#FFF8F9] border border-[#F35271]/15 rounded-2xl text-xs sm:text-sm placeholder-[#757880] focus:border-[#F35271] outline-none"
              />
            </div>

            {/* City Selector */}
            <div className="md:col-span-3">
              <div className="flex items-center gap-2 px-3.5 py-3 bg-[#FFF8F9] border border-[#F35271]/15 rounded-2xl text-xs font-semibold">
                <MapPin className="w-4 h-4 text-[#F35271] shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  aria-label="City Filter"
                  className="w-full bg-transparent outline-none cursor-pointer"
                >
                  {CITY_LOCATIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="md:col-span-3">
              <div className="flex items-center gap-2 px-3.5 py-3 bg-[#FFF8F9] border border-[#F35271]/15 rounded-2xl text-xs font-semibold">
                <Star className="w-4 h-4 text-[#F35271] shrink-0" />
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  aria-label="Rating Filter"
                  className="w-full bg-transparent outline-none cursor-pointer"
                >
                  <option value="all">All Ratings (Any Star)</option>
                  <option value="4.8">4.8+ Stars (Top Tier)</option>
                  <option value="4.5">4.5+ Stars (High Rated)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Business Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none border-t border-[#AFB0B7]/20">
            {BUSINESS_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all ${
                  selectedType === type.id
                    ? 'bg-[#F35271] text-white shadow-md'
                    : 'bg-white text-[#757880] border border-[#AFB0B7]/30 hover:border-[#F35271] hover:text-[#0D0D12]'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs text-[#757880]">
            Showing <strong className="text-[#0D0D12]">{filteredBusinesses.length}</strong> verified centers
          </span>

          {(selectedCity !== 'All Cities' || selectedType !== 'all' || searchQuery) && (
            <button
              onClick={() => { setSelectedCity('All Cities'); setSelectedType('all'); setSearchQuery(''); setMinRating('all'); }}
              className="text-xs font-bold text-[#F35271] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Business Cards Grid */}
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#AFB0B7]/25 shadow-sm">
            <Store className="w-12 h-12 text-[#F35271] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">No Centers Found</h3>
            <p className="text-xs text-[#757880] mt-1 max-w-sm mx-auto">
              We couldn't find any centers matching your filters. Try selecting "All Cities" or changing your keyword.
            </p>
            <button
              onClick={() => { setSelectedCity('All Cities'); setSelectedType('all'); setSearchQuery(''); }}
              className="mt-5 px-6 py-2.5 rounded-full bg-[#F35271] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Show All Centers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBusinesses.map((biz) => (
              <motion.div
                key={biz.id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-[#AFB0B7]/25 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Cover Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={biz.coverImage}
                    alt={biz.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/80 via-transparent to-transparent opacity-85" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#0D0D12] uppercase tracking-wider shadow-sm">
                      {biz.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFEEF1] text-[#F35271] text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-[#F35271]" />
                      {biz.rating} ({biz.reviewsCount})
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center gap-1 text-[11px] text-white/90 mb-0.5">
                      <MapPin className="w-3 h-3 text-[#FF5E7E]" />
                      <span>{biz.shortLocation || (typeof biz.address === 'object' ? `${biz.address.city}, ${biz.address.state}` : `${biz.city || ''}, ${biz.state || ''}`)}</span>
                    </div>
                    <h3 className="font-serif-luxury text-xl text-white truncate">
                      {biz.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 flex flex-col justify-between flex-grow space-y-4">
                  <p className="text-xs text-[#757880] font-light line-clamp-2 leading-relaxed">
                    {biz.description}
                  </p>

                  {/* Popular Service Chips */}
                  {biz.popularServices && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {biz.popularServices.slice(0, 3).map((srv, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-[#FFEEF1] text-[#0D0D12] px-2 py-0.5 rounded-md truncate max-w-[160px]">
                          • {srv}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price & Hours */}
                  <div className="pt-3 border-t border-[#AFB0B7]/20 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#757880] block">Starting from:</span>
                      <span className="font-serif-luxury text-base font-bold text-[#F35271]">{biz.startingPrice}</span>
                    </div>
                    <span className="text-[11px] text-[#168821] bg-[#168821]/10 px-2.5 py-0.5 rounded-full font-bold">
                      Open Today
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#AFB0B7]/20">
                    <Link
                      to={`/business/${biz.slug}`}
                      className="py-3 rounded-full text-center text-xs font-semibold text-[#0D0D12] border border-[#AFB0B7]/30 hover:border-[#F35271] hover:text-[#F35271] transition-colors"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => navigate(`/book?businessSlug=${biz.slug}`)}
                      className="py-3 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md text-center"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
