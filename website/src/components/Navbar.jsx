import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Smartphone, Calendar } from 'lucide-react';
import TherapyshalaLogo from './TherapyshalaLogo';

export default function Navbar({ onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    { name: 'Home', href: '#', path: '/' },
    { name: 'Services', href: '#services', path: '/#services' },
    { name: 'About', href: '#about', path: '/#about' },
    { name: 'Gallery', href: '#gallery', path: '/#gallery' },
    { name: 'Pricing', href: '#pricing', path: '/#pricing' },
    { name: 'Testimonials', href: '#testimonials', path: '/#testimonials' },
    { name: 'FAQ', href: '#faq', path: '/#faq' },
  ];

  const handleNavClick = (e, link) => {
    if (location.pathname === '/' && link.href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      if (link.href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const target = document.querySelector(link.href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      setMobileMenuOpen(false);
      navigate(link.path);
    }
  };

  const handleBookingClick = () => {
    setMobileMenuOpen(false);
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      navigate('/book');
    }
  };

  const handleGetAppClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const target = document.querySelector('#download');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate('/#download');
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-22 sm:h-24 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.07)] border-b border-gray-100"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
      >
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 h-full flex items-center justify-between">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center shrink-0 py-1.5">
            <TherapyshalaLogo className="h-14 sm:h-16 md:h-18 w-auto max-h-20 object-contain" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="text-xs font-semibold tracking-wider text-[#0D0D12]/80 hover:text-[#F35271] transition-colors duration-200 cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3.5">
            {/* Get App Button */}
            <button
              onClick={handleGetAppClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#F35271] text-[#F35271] hover:bg-[#F35271] hover:text-white hover:border-[#F35271] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-[0_8px_20px_rgba(243,82,113,0.35)] cursor-pointer transform active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>GET APP</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#0D0D12] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

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
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="font-serif-luxury text-2xl font-medium text-[#0D0D12] hover:text-[#F35271] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-8 border-t border-[#AFB0B7]/25 flex flex-col gap-3.5">
              <button
                onClick={handleGetAppClick}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full border border-[#F35271] text-[#F35271] hover:bg-[#F35271] hover:text-white active:bg-[#F35271] active:text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
              >
                <Smartphone className="w-4 h-4" />
                <span>GET APP</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
