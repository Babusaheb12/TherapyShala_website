import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplets, Scissors, HeartPulse, Smile, Flame, 
  Sparkles, ArrowRight, Store, Crown 
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'spa',
    title: 'Luxury Day Spas',
    subtitle: 'Thermal baths, aromatherapy & hydro-suites',
    count: '140+ Spas',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    typeQuery: 'spa'
  },
  {
    id: 'salon',
    title: 'Hair & Beauty Salons',
    subtitle: 'Balayage, hair botox, cuts & styling',
    count: '180+ Salons',
    icon: Scissors,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    typeQuery: 'salon'
  },
  {
    id: 'massage',
    title: 'Massage & Muscle Recovery',
    subtitle: 'Deep tissue, Swedish & volcanic stone',
    count: '110+ Centers',
    icon: Flame,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    typeQuery: 'massage'
  },
  {
    id: 'skincare',
    title: 'Aesthetic & Skin Lounges',
    subtitle: 'Korean hydra-facials, chemical peels & glow',
    count: '95+ Lounges',
    icon: Smile,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    typeQuery: 'skincare'
  },
  {
    id: 'wellness',
    title: 'Ayurvedic & Holistic Healing',
    subtitle: 'Shirodhara, sound baths & herbal detox',
    count: '75+ Retreats',
    icon: HeartPulse,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    typeQuery: 'wellness'
  },
  {
    id: 'bridal',
    title: 'Bridal & Luxury Grooming',
    subtitle: 'Couture makeovers, pre-wedding passes & nails',
    count: '60+ Studios',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    typeQuery: 'beauty'
  }
];

export default function CategoryDiscovery() {
  return (
    <section className="py-20 md:py-28 bg-[#FFFDFD] relative">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-bold mb-2.5 block">
              Marketplace Taxonomy
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#0D0D12] font-normal leading-tight">
              Explore by <span className="italic text-[#F35271] font-light">Wellness Category</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#757880] font-light mt-2 max-w-xl">
              From Swedish massage sanctuaries to cutting-edge aesthetic salons, discover verified businesses curated for your self-care goals.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F35271] hover:text-[#0D0D12] transition-colors self-start md:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/explore?type=${cat.typeQuery}`}
                className="group relative rounded-[2rem] overflow-hidden border border-[#AFB0B7]/25 shadow-sm hover:shadow-xl transition-all duration-500 bg-white h-72 flex flex-col justify-between p-6"
              >
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/90 via-[#0D0D12]/40 to-black/20" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md text-[#F35271] flex items-center justify-center shadow-md group-hover:bg-[#F35271] group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold tracking-wider">
                    {cat.count}
                  </span>
                </div>

                <div className="relative z-10 text-white space-y-1">
                  <h3 className="font-serif-luxury text-2xl font-normal text-white group-hover:text-[#FF5E7E] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-white/80 font-light line-clamp-1">
                    {cat.subtitle}
                  </p>
                  
                  <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#FF5E7E] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    <span>Browse Centers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
