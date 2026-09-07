import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, MapPin, Phone, Clock } from 'lucide-react';
import TherapyshalaLogo from './TherapyshalaLogo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0D0D12] text-white pt-20 pb-12 border-t border-white/10 relative overflow-hidden">
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <Link to="/" className="mb-5 inline-block">
                <TherapyshalaLogo className="h-20 sm:h-24 md:h-28 w-auto" />
              </Link>

              <p className="text-xs sm:text-sm text-[#757880] font-normal leading-relaxed mb-6 max-w-sm">
                A premier luxury beauty &amp; spa sanctuary designed for holistic rejuvenation, botanical skincare, and seamless appointment scheduling.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="#instagram"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#F35271] hover:border-[#F35271] transition-all flex items-center justify-center text-white"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a
                  href="#facebook"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#F35271] hover:border-[#F35271] transition-all flex items-center justify-center text-white"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
                </a>
                <a
                  href="#twitter"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#F35271] hover:border-[#F35271] transition-all flex items-center justify-center text-white"
                  aria-label="Twitter / X"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-bold text-white mb-5">
              Navigation
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-normal text-[#AFB0B7]">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services Menu</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Why Choose Us</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Packages</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><Link to="/help-center" className="hover:text-white transition-colors">Help Center &amp; Support</Link></li>
              <li><Link to="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white mb-5">
              Contact &amp; Location
            </h4>
            <div className="space-y-4 text-xs sm:text-sm text-[#AFB0B7] font-normal">
              {/* Operating Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#F35271] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-xs sm:text-sm">Operating Hours</span>
                  <span className="text-xs text-[#757880]">Mon - Sun: 09:00 AM - 09:00 PM</span>
                </div>
              </div>

              {/* Sanctuary Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F35271] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-xs sm:text-sm">Sanctuary Location</span>
                  <span className="text-xs text-[#757880]">Luxury Wellness Suite, City Center</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 pt-1">
                <Phone className="w-4 h-4 text-[#F35271] shrink-0" />
                <a href="tel:+919876543210" className="text-xs sm:text-sm font-semibold text-white hover:text-[#F35271] transition-colors">
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: VIP Sanctuary Club */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white mb-2">VIP Sanctuary Club</h4>
            <p className="text-xs text-[#757880] font-normal leading-relaxed mb-4">
              Subscribe to receive private seasonal offers and ₹500 off your first appointment booking.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full pl-5 pr-1.5 py-1.5 focus-within:border-[#F35271] transition-colors">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-[#757880] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-[#F35271] to-[#FF5E7E] hover:from-[#E04362] hover:to-[#F35271] text-white flex items-center justify-center shrink-0 transition-transform active:scale-90 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            {subscribed && (
              <span className="text-xs text-[#F35271] font-medium animate-fade-in block mt-2">
                Thank you for joining our VIP list!
              </span>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Legal links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#757880] font-normal gap-4">
          <div>
            © 2026 Therapyshala Beauty &amp; Spa Sanctuary. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center sm:justify-end text-xs text-[#757880]">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/therapist-terms" className="hover:text-white transition-colors">
              Therapist Terms
            </Link>
            <Link to="/cancellation" className="hover:text-white transition-colors">
              Cancellation Policy
            </Link>
            <Link to="/refund" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
