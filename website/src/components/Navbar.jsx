import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Smartphone, User, LogIn, LogOut, MessageSquareText } from 'lucide-react';
import TherapyshalaLogo from './TherapyshalaLogo';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, ownerProfile, isOwnerAuthenticated, logoutOwner } = useAuth();

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
      e.preventDefault();
      setMobileMenuOpen(false);
      navigate(link.path);
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
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path && !link.href.startsWith('#');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`text-xs font-semibold tracking-wider transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-[#F35271]' : 'text-[#0D0D12]/80 hover:text-[#F35271]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

            {/* Action CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Enquiry Form Button */}
              <Link
                to="/enquiry"
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full border border-[#F35271] text-[#F35271] hover:bg-[#F35271] hover:text-white hover:border-[#F35271] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs cursor-pointer transform active:scale-95"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>ENQUIRY FORM</span>
              </Link>

              {/* Spa Owner Portal CTA or User Portal */}
              {isOwnerAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-[#F35271]/30 text-[#F35271] hover:bg-[#F35271] hover:text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#F35271] text-white flex items-center justify-center text-[10px]">
                      🏢
                    </div>
                    <span className="max-w-[120px] truncate">{ownerProfile?.businessName || ownerProfile?.ownerName || 'Spa Portal'}</span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-xs"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <span className="text-[10px] uppercase font-bold text-[#F35271] tracking-wider block">Spa Owner</span>
                        <p className="font-bold text-[#0D0D12] truncate">{ownerProfile?.businessName || 'Spa Partner'}</p>
                        <p className="text-[10px] text-[#757880] truncate">{ownerProfile?.email}</p>
                      </div>
                      <Link
                        to="/owner/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-[#0D0D12] hover:bg-rose-50 hover:text-[#F35271] font-medium"
                      >
                        Owner Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logoutOwner();
                          setUserDropdownOpen(false);
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 font-medium flex items-center gap-2 border-t border-gray-100 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFEEF1] border border-[#F35271]/30 text-[#F35271] hover:bg-[#F35271] hover:text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#F35271] text-white flex items-center justify-center text-[10px]">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="max-w-[100px] truncate">{user?.name || 'Account'}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#AFB0B7]/25 py-2 z-50 text-xs"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-bold text-[#0D0D12] truncate">{user?.name}</p>
                        <p className="text-[10px] text-[#757880] truncate">{user?.email || user?.phone}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-[#0D0D12] hover:bg-[#FFEEF1] hover:text-[#F35271] font-medium"
                      >
                        My Sanctuary Dashboard
                      </Link>
                      <Link
                        to="/account/appointments"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-[#0D0D12] hover:bg-[#FFEEF1] hover:text-[#F35271] font-medium"
                      >
                        My Appointments
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 font-medium flex items-center gap-2 border-t border-gray-100 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-[#F35271] text-white hover:bg-[#E04362] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-[0_6px_16px_rgba(243,82,113,0.35)] cursor-pointer transform active:scale-95"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>LOGIN</span>
                </Link>
              )}
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
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="font-serif-luxury text-xl font-medium text-[#0D0D12] hover:text-[#F35271] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-8 border-t border-[#AFB0B7]/25 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#FFEEF1] text-[#F35271] text-xs font-bold uppercase tracking-wider"
                  >
                    <User className="w-4 h-4" />
                    <span>My Sanctuary Account</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#F35271] text-white text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>LOGIN / SIGN UP</span>
                </Link>
              )}

              <Link
                to="/enquiry"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-[#F35271] text-[#F35271] hover:bg-[#F35271] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
              >
                <MessageSquareText className="w-4 h-4" />
                <span>ENQUIRY FORM</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
