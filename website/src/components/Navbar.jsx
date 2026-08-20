import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Menu, X, Smartphone } from 'lucide-react';
import TherapyshalaLogo from './TherapyshalaLogo';

export default function Navbar({ onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#why-us' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'FAQ', href: '/#faq' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_10px_30px_rgba(13,13,18,0.05)] py-3 border-b border-[#AFB0B7]/30'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <TherapyshalaLogo className="w-11 h-11" textColor="text-[#0D0D12]" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#0D0D12]/80 hover:text-[#F35271] transition-colors duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#F35271] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/#app-showcase"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#F35271] px-4 py-2.5 rounded-full border-2 border-[#F35271] bg-white hover:bg-[#FFEEF1] transition-all duration-300"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#F35271]" />
              Get App
            </a>

            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white bg-[#F35271] hover:bg-[#E04362] px-6 py-3 rounded-full shadow-[0_10px_25px_rgba(243,82,113,0.3)] hover:shadow-[0_15px_30px_rgba(243,82,113,0.45)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Appointment
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-8 pb-12 lg:hidden flex flex-col justify-between overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif-luxury text-3xl font-medium text-[#0D0D12] hover:text-[#F35271] transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <Link
                to="/help-center"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif-luxury text-3xl font-medium text-[#F35271]"
              >
                Help Center
              </Link>
            </div>

            <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-[#AFB0B7]/30">
              {onOpenBooking && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full py-4 text-sm font-semibold tracking-wider uppercase text-white bg-[#F35271] hover:bg-[#E04362] rounded-full shadow-lg text-center flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </button>
              )}
              <a
                href="/#app-showcase"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 text-sm font-semibold tracking-wider uppercase text-[#F35271] bg-white border-2 border-[#F35271] rounded-full text-center flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-[#F35271]" />
                Get App
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
