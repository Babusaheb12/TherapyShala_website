import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PageHeader({
  badge = "TherapyShala Marketplace",
  title,
  titleHighlight = "",
  description,
  breadcrumbs = [],
  actionButton = null
}) {
  return (
    <div className="relative pt-32 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-[#FFEEF1] via-[#FFF8F9] to-white border-b border-[#AFB0B7]/20 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F35271]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF5E7E]/5 rounded-full blur-2xl pointer-events-none -ml-20" />

      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <nav className="flex items-center gap-2 text-xs font-medium text-[#757880] mb-6 flex-wrap">
          <Link to="/" className="hover:text-[#F35271] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-[#AFB0B7]" />
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-[#F35271] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#0D0D12] font-semibold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            {badge && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F35271]/10 text-[#F35271] text-xs font-bold uppercase tracking-wider mb-4 border border-[#F35271]/20">
                {badge}
              </span>
            )}
            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#0D0D12] font-normal leading-[1.15] tracking-tight">
              {title} {titleHighlight && <span className="italic text-[#F35271] font-light">{titleHighlight}</span>}
            </h1>
            {description && (
              <p className="mt-4 text-base sm:text-lg text-[#757880] font-light leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </motion.div>

          {actionButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="shrink-0"
            >
              {actionButton}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
