import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, QrCode, Sparkles, Star, X, Bell } from 'lucide-react';

export default function DownloadCTA() {
  const [showIosComingSoon, setShowIosComingSoon] = useState(false);
  return (
    <section id="download" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        
        {/* Banner Frame */}
        <div className="rounded-[3rem] bg-gradient-to-r from-[#FF5E7E] to-[#E04362] p-10 sm:p-16 lg:p-20 text-white relative overflow-hidden shadow-[0_25px_60px_rgba(243,82,113,0.35)]">
          
          {/* Ambient Lighting Circles */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col">
              <span className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Exclusive Mobile Application
              </span>

              <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-none mb-6">
                Download the <span className="italic font-normal">Therapyshala App</span> today
              </h2>

              <p className="text-white/90 text-base sm:text-lg font-light leading-relaxed max-w-xl mb-8">
                Unlock instant live therapist calendars, $25 off your first booking, and VIP sanctuary rewards delivered straight to your phone.
              </p>

              {/* Badges & QR Code */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowIosComingSoon(true)}
                    className="inline-block hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <img
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                      alt="Download on the App Store"
                      className="h-[52px] w-auto"
                    />
                  </button>

                  <a
                    href="https://play.google.com/store/apps/details?id=com.bigwon.therapyshala&pcampaignid=web_share"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block hover:opacity-90 transition-opacity"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Get it on Google Play"
                      className="h-[52px] w-auto"
                    />
                  </a>
                </div>

                {/* Simulated QR Code */}
                <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                  <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center text-[#1F1B18]">
                    <QrCode className="w-10 h-10" />
                  </div>
                  <div className="text-xs text-white">
                    <div className="font-bold">Scan to Download</div>
                    <div className="text-[11px] text-white/80">iOS & Android</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Mockup Graphic */}
            <div className="lg:col-span-5 flex justify-center relative">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative w-64 sm:w-72"
              >
                {/* Floating iPhone mockup */}
                <div className="rounded-[3rem] bg-[#1F1B18] p-3 shadow-2xl border-4 border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="rounded-[2.4rem] overflow-hidden bg-[#FAF6F0] h-[480px] relative">
                    <img
                      src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
                      alt="App Interface"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F1B18]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-4 right-4 text-white">
                      <div className="flex items-center gap-1 text-[#D4AF37] mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <h4 className="font-serif-luxury text-xl leading-tight font-light">
                        Blooms Booking App
                      </h4>
                      <p className="text-[11px] text-white/80 mt-1">
                        4.9 ★ Rating over 8,500+ reviews
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

        </div>

      </div>

      {/* iOS App Coming Soon Modal */}
      <AnimatePresence>
        {showIosComingSoon && (
          <div className="fixed inset-0 z-50 bg-[#0D0D12]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center relative border border-gray-100"
            >
              <button
                onClick={() => setShowIosComingSoon(false)}
                className="absolute right-4 top-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-[#FFEEF1] text-[#F35271] flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-bold text-[#F35271] uppercase tracking-widest bg-[#FFEEF1] px-2.5 py-1 rounded-full inline-block mb-2">
                Apple App Store
              </span>

              <h3 className="text-xl font-bold text-[#0D0D12]">Coming Soon!</h3>

              <p className="text-xs text-[#757880] mt-2 leading-relaxed">
                Our iOS application is currently undergoing final App Store review. You can download the Android app on Google Play or continue booking through our website.
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.bigwon.therapyshala&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#F35271] text-white text-xs font-semibold hover:bg-[#E04362] transition-colors"
                >
                  Download on Google Play
                </a>
                <button
                  type="button"
                  onClick={() => setShowIosComingSoon(false)}
                  className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
