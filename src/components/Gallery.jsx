import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_DATA } from '../data/spaData';
import { Maximize2, X, Sparkles } from 'lucide-react';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  const categories = ['All', 'Spa Sanctuary', 'Massage Suites', 'Hydrotherapy'];

  const filteredGallery = selectedCategory === 'All'
    ? GALLERY_DATA
    : GALLERY_DATA.filter((img) => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-[#FFEEF1] border-t border-[#AFB0B7]/30 relative">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-semibold mb-3 block">
              Visual Atmosphere
            </span>
            <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-[#0D0D12] tracking-tight leading-none">
              Sanctuary <span className="italic font-normal text-[#F35271]">Gallery</span>
            </h2>
          </div>
          <p className="text-[#757880] max-w-md font-light text-base leading-relaxed">
            Step inside our architectural spaces created for solitude, peace, and deep botanical indulgence.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-[#F35271] text-white shadow-md'
                  : 'bg-white text-[#757880] border border-[#AFB0B7]/40 hover:border-[#F35271] hover:text-[#F35271]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Editorial Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredGallery.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setActiveLightboxImage(item)}
                className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(31,27,24,0.05)] border border-[#EFE6DC] h-80 sm:h-96"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1B18]/80 via-[#1F1B18]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8" />

                {/* Hover Content Details */}
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-white flex items-end justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#E09F93]">
                      {item.category}
                    </span>
                    <h3 className="font-serif-luxury text-2xl font-normal leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1F1B18]/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setActiveLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1F1B18] hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={activeLightboxImage.image}
                alt={activeLightboxImage.title}
                className="w-full max-h-[75vh] object-cover"
              />
              <div className="p-6 bg-white flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#D88373] font-semibold">
                    {activeLightboxImage.category}
                  </span>
                  <h3 className="font-serif-luxury text-2xl text-[#1F1B18]">
                    {activeLightboxImage.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
