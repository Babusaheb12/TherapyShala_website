import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, UserPlus, Compass, Sparkles, Package, Tag, Store } from 'lucide-react';
import TherapyshalaLogo from './TherapyshalaLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Services', path: '/services' },
    { name: 'Packages', path: '/packages' },
    { name: 'About Us', path: '/about-us' },
    { name: 'List Your Business', path: '/list-your-business', isPartnerBtn: true },
    { name: 'Account', path: '/account' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_10px_30px_rgba(13,13,18,0.06)] py-3 border-b border-[#AFB0B7]/25'
            : 'bg-white/85 backdrop-blur-md py-4 border-b border-[#AFB0B7]/15'
          }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <TherapyshalaLogo className="w-9 h-9" textColor="text-[#0D0D12]" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

              if (link.isPartnerBtn) {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#F35271] bg-[#FFEEF1] hover:bg-[#F35271] hover:text-white px-4 py-2 rounded-full border border-[#F35271]/30 transition-all duration-300 shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>List Your Business</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 relative py-1 ${isActive
                      ? 'text-[#F35271] font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#F35271]'
                      : 'text-[#0D0D12]/80 hover:text-[#F35271]'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#0D0D12] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-8 pb-12 lg:hidden flex flex-col justify-between overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif-luxury text-2xl text-[#0D0D12]"
              >
                Home
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-serif-luxury text-2xl font-medium transition-colors ${link.isPartnerBtn
                      ? 'text-[#F35271] font-semibold'
                      : location.pathname === link.path
                        ? 'text-[#F35271]'
                        : 'text-[#0D0D12] hover:text-[#F35271]'
                    }`}
                >
                  {link.isPartnerBtn ? `+ ${link.name}` : link.name}
                </Link>
              ))}
            </div>

            <div className="pt-8 border-t border-[#AFB0B7]/25 text-center text-xs text-[#757880]">
              TherapyShala
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
