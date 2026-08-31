import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES_DATA, SERVICE_CATEGORIES } from '../../data/spaData';
import PageHeader from '../../components/common/PageHeader';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Search, Star, Clock, ArrowRight, Sparkles, Filter, CheckCircle2, SlidersHorizontal, MapPin, Store, UserPlus } from 'lucide-react';

export default function ServicesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredAndSortedServices = useMemo(() => {
    let result = [...SERVICES_DATA];

    if (selectedCategory !== 'all') {
      result = result.filter(s => s.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.businessName && s.businessName.toLowerCase().includes(q)) ||
        (s.businessCity && s.businessCity.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.rawPrice - b.rawPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.rawPrice - a.rawPrice);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        result.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleBookService = (service) => {
    navigate(`/book?businessSlug=${service.businessSlug}&serviceId=${service.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12]">
      <Navbar />

      <PageHeader
        badge="Platform Services Menu"
        title="Explore Marketplace"
        titleHighlight="Treatments"
        description="Discover botanical facials, deep tissue massages, hair botox, and hydrotherapy rituals across verified spas and salons."
        breadcrumbs={[{ label: 'Services' }]}
        actionButton={
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0D0D12] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#F35271] transition-all shadow-md"
          >
            <Store className="w-4 h-4 text-[#FF5E7E]" />
            <span>Browse by Center</span>
          </Link>
        }
      />

      <main className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16">
        
        {/* Search & Categories Bar */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#757880]" />
              <input
                type="text"
                placeholder="Search massages, facials, hair spa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#AFB0B7]/30 rounded-full text-sm placeholder-[#757880] focus:border-[#F35271] outline-none shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#757880]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4">
              <span className="text-xs text-[#757880] whitespace-nowrap">
                Showing <strong className="text-[#0D0D12]">{filteredAndSortedServices.length}</strong> rituals
              </span>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#757880]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort services"
                  className="bg-white border border-[#AFB0B7]/30 text-[#0D0D12] text-xs font-semibold py-2.5 px-3.5 rounded-full outline-none cursor-pointer"
                >
                  <option value="popular">Sort: Most Popular</option>
                  <option value="rating">Sort: Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="duration">Duration: Longest First</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#F35271] text-white shadow-md'
                    : 'bg-white text-[#757880] border border-[#AFB0B7]/30 hover:border-[#F35271] hover:text-[#0D0D12]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredAndSortedServices.map((service) => (
              <motion.div
                key={`${service.businessSlug}-${service.id}`}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white rounded-3xl overflow-hidden border border-[#AFB0B7]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
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

                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-white">
                    <span className="text-[11px] text-white/90 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF5E7E]" />
                      {service.businessName} ({service.businessCity})
                    </span>
                    <span className="bg-[#FFEEF1] px-2.5 py-0.5 rounded-full text-xs font-bold text-[#F35271]">
                      {service.price}
                    </span>
                  </div>
                </div>

                <div className="p-7 flex flex-col justify-between flex-grow space-y-4">
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
                      className="py-2.5 rounded-full text-center text-xs font-semibold text-[#0D0D12] border border-[#AFB0B7]/40 hover:border-[#F35271] hover:text-[#F35271] transition-colors"
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

      </main>

      <Footer />
    </div>
  );
}
