import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_SCREENS } from '../data/spaData';
import { Smartphone, Star, Calendar, Bell, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import TherapyshalaLogo from './TherapyshalaLogo';

export default function AppShowcase() {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  const currentScreen = APP_SCREENS[activeScreenIndex];

  return (
    <section id="app-showcase" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#F35271]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFEEF1] text-[#F35271] text-xs font-semibold uppercase tracking-widest mb-4">
            <Smartphone className="w-3.5 h-3.5" />
            Designed For Effortless Luxury
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-[#0D0D12] tracking-tight leading-tight">
            Experience the <span className="italic font-normal text-[#F35271]">Therapyshala App</span>
          </h2>
          <p className="mt-4 text-[#757880] text-base sm:text-lg font-light leading-relaxed">
            Reserve appointments, track loyalty points, and select your master therapist with single-tap precision.
          </p>
        </div>

        {/* Interactive App Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Interactive Feature Navigator */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {APP_SCREENS.map((screen, idx) => (
              <motion.div
                key={screen.id}
                onClick={() => setActiveScreenIndex(idx)}
                className={`p-6 sm:p-8 rounded-3xl cursor-pointer border transition-all duration-400 ${
                  activeScreenIndex === idx
                    ? 'bg-[#FFEEF1] border-[#F35271] shadow-md scale-[1.02]'
                    : 'bg-white border-[#AFB0B7]/30 hover:border-[#F35271]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#F35271]">
                    {screen.activeTab}
                  </span>
                  {activeScreenIndex === idx && (
                    <span className="w-2 h-2 rounded-full bg-[#F35271] animate-pulse" />
                  )}
                </div>

                <h3 className="font-serif-luxury text-2xl font-normal text-[#0D0D12] mb-2">
                  {screen.title}
                </h3>

                <p className="text-sm text-[#757880] font-light leading-relaxed mb-3">
                  {screen.subtitle}
                </p>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#F35271]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{screen.featureHighlight}</span>
                </div>
              </motion.div>
            ))}

            {/* App Store CTA Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href="#download" className="inline-block hover:opacity-90 transition-opacity">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="h-[44px] w-auto"
                />
              </a>
              <a href="#download" className="inline-block hover:opacity-90 transition-opacity">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-[44px] w-auto"
                />
              </a>
            </div>
          </div>

          {/* Right Column: Floating iPhone Frame Preview */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px]">
              
              {/* Sleek iPhone 16 Pro Shell */}
              <div className="relative mx-auto rounded-[3.5rem] bg-[#1F1B18] p-4 shadow-[0_30px_70px_rgba(31,27,24,0.3)] border-4 border-[#3a332f]">
                
                {/* Dynamic Island / Notch */}
                <div className="absolute top-7 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#000000] rounded-full z-30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1F1B18] ml-auto mr-3" />
                </div>

                {/* Screen Content Window */}
                <div className="relative rounded-[2.8rem] overflow-hidden bg-[#FAF6F0] h-[640px] flex flex-col justify-between pt-10 pb-6 px-4">
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentScreen.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col h-full justify-between"
                    >
                      {/* App Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#EFE6DC]">
                        <TherapyshalaLogo className="w-7 h-7" showText={false} />
                        <span className="text-xs font-bold text-[#1F1B18]">Therapyshala App</span>
                        <Bell className="w-4 h-4 text-[#6E645E]" />
                      </div>

                      {/* Screen Artwork */}
                      <div className="my-4 relative rounded-2xl overflow-hidden shadow-md flex-grow">
                        <img
                          src={currentScreen.screenImage}
                          alt={currentScreen.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1B18]/70 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#E09F93]">
                            {currentScreen.activeTab}
                          </span>
                          <h4 className="font-serif-luxury text-lg font-normal leading-tight">
                            {currentScreen.title}
                          </h4>
                        </div>
                      </div>

                      {/* Interactive App Screen Card */}
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#EFE6DC] text-left">
                        <div className="flex items-center justify-between text-xs font-bold text-[#1F1B18] mb-1">
                          <span>Verified Therapist</span>
                          <div className="flex items-center gap-1 text-[#D4AF37]">
                            <Star className="w-3 h-3 fill-current" />
                            <span>5.0</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#6E645E]">
                          Book slot for Genevieve Moreau (Facialist)
                        </p>
                        <button className="w-full mt-3 py-2 bg-[#D88373] text-white rounded-xl text-xs font-semibold">
                          Confirm Booking
                        </button>
                      </div>

                      {/* Simulated iOS Home Bar */}
                      <div className="w-32 h-1 bg-[#1F1B18]/30 rounded-full mx-auto mt-4" />
                    </motion.div>
                  </AnimatePresence>

                </div>
              </div>

              {/* Decorative Ambient Card behind phone */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-[#EFE6DC] hidden sm:flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-full bg-[#F3E3DF] text-[#D88373] flex items-center justify-center font-bold">
                  4.9★
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1F1B18]">App Store Rating</div>
                  <div className="text-[10px] text-[#6E645E]">Over 8,500+ Reviews</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
