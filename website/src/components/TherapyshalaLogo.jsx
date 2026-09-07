import React from 'react';

export default function TherapyshalaLogo({ className = "h-16 w-auto", showText = false, textColor = "text-[#0D0D12]" }) {
  const isDark = textColor.includes('white');

  return (
    <div className="flex items-center group cursor-pointer">
      {/* Official Logo Image Only */}
      <img
        src="/logo.png"
        alt="Therapyshala"
        className={`${className} object-contain transition-transform duration-300 group-hover:scale-105 rounded-xl`}
      />

      {showText && (
        <div className="flex flex-col ml-3">
          <div className="text-2xl font-bold tracking-tight leading-none">
            <span className={isDark ? "text-white" : "text-[#DE4B73]"}>Therapy</span>
            <span className="text-[#FA7B9B]">shala</span>
          </div>
          <span className={`text-[8px] sm:text-[8.5px] tracking-[0.22em] uppercase font-bold mt-1 ${isDark ? 'text-[#FA7B9B]' : 'text-[#DE4B73]'}`}>
            A Healthier You, A Happier Tomorrow
          </span>
        </div>
      )}
    </div>
  );
}
