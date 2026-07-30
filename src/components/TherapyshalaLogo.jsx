import React from 'react';

export default function TherapyshalaLogo({ className = "w-10 h-10", showText = true, textColor = "text-[#1F1B18]" }) {
  return (
    <div className="flex items-center gap-3.5 group cursor-pointer">
      {/* Round Vector Logo Badge */}
      <div className={`${className} rounded-full bg-gradient-to-br from-[#FFEEF1] to-[#F0C9D0]/30 border border-[#E06278]/40 p-2 shadow-[0_4px_20px_rgba(243,82,113,0.25)] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-105 relative overflow-hidden`}>
        {/* Ambient Subtle Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F35271]/10 to-transparent pointer-events-none" />

        {/* Crisp Botanical Lotus SVG Icon */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#F35271]">
          {/* Base Outer Petals */}
          <path
            d="M50 82C68 82 85 70 88 52C75 58 60 56 50 45C40 56 25 58 12 52C15 70 32 82 50 82Z"
            fill="url(#lotus-grad-1)"
            opacity="0.25"
          />
          {/* Main Lotus Bloom Petals */}
          <path
            d="M50 20C55 35 68 45 82 48C70 60 56 62 50 80C44 62 30 60 18 48C32 45 45 35 50 20Z"
            stroke="url(#lotus-stroke)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center Inner Rose Petal Core */}
          <path
            d="M50 35C53 45 60 50 68 52C60 60 54 60 50 72C46 60 40 60 32 52C40 50 47 45 50 35Z"
            fill="url(#lotus-grad-2)"
            stroke="#FF5E7E"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Central Stamen Dot */}
          <circle cx="50" cy="52" r="3.5" fill="#FF5E7E" />

          {/* Gradients */}
          <defs>
            <linearGradient id="lotus-stroke" x1="18" y1="20" x2="82" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F35271" />
              <stop offset="0.5" stopColor="#FF5E7E" />
              <stop offset="1" stopColor="#E04362" />
            </linearGradient>
            <linearGradient id="lotus-grad-1" x1="12" y1="52" x2="88" y2="82" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F35271" />
              <stop offset="1" stopColor="#FF5E7E" />
            </linearGradient>
            <linearGradient id="lotus-grad-2" x1="32" y1="35" x2="68" y2="72" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E06278" />
              <stop offset="1" stopColor="#F0C9D0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-serif-luxury text-2xl tracking-tight ${textColor} font-semibold leading-none`}>
            Therapyshala
          </span>
          <span className="text-[9.5px] tracking-[0.25em] uppercase text-[#F35271] font-semibold mt-1">
            Spa & Therapy Sanctuary
          </span>
        </div>
      )}
    </div>
  );
}
