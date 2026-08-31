import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, MapPin, Phone, Clock, Store, UserPlus, Compass } from 'lucide-react';
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
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link to="/" className="mb-6 block">
                <TherapyshalaLogo className="w-12 h-12" textColor="text-white" />
              </Link>

              <p className="text-sm text-[#757880] font-light leading-relaxed mb-6 max-w-sm">
                India's premier multi-business marketplace connecting clients with verified luxury Spas, Salons, Wellness Centers, and Beauty Parlours.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="#instagram"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#F35271] transition-colors flex items-center justify-center text-white"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a
                  href="#facebook"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#F35271] transition-colors flex items-center justify-center text-white"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
                </a>
                <a
                  href="#twitter"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#F35271] transition-colors flex items-center justify-center text-white"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Customer Navigation */}
          <div className="lg:col-span-2">
            <h4 className="font-serif-luxury text-xl text-white font-normal mb-6">
              Explore
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-light text-[#EFE6DC]/70">
              <li><Link to="/explore" className="hover:text-[#F35271] transition-colors">Find Spas & Salons</Link></li>
              <li><Link to="/services" className="hover:text-[#F35271] transition-colors">All Services Menu</Link></li>
              <li><Link to="/packages" className="hover:text-[#F35271] transition-colors">Treatment Passes</Link></li>
              <li><Link to="/offers" className="hover:text-[#F35271] transition-colors">Offers & Coupons</Link></li>
              <li><Link to="/account" className="hover:text-[#F35271] transition-colors">Customer Portal</Link></li>
            </ul>
          </div>

          {/* Business Owners Network */}
          <div className="lg:col-span-3">
            <h4 className="font-serif-luxury text-lg font-normal mb-6 text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-[#F35271]" />
              <span>For Business Owners</span>
            </h4>
            <ul className="space-y-3 text-xs font-light text-white/70">
              <li>
                <Link to="/list-your-business" className="text-[#F35271] font-bold hover:underline flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>List Your Business (Free)</span>
                </Link>
              </li>
              <li>
                <Link to="/help-center" className="hover:text-white transition-colors">
                  Partner Help Center & FAQ
                </Link>
              </li>
              <li>
                <Link to="/therapist-terms" className="hover:text-white transition-colors">
                  Business & Therapist Terms
                </Link>
              </li>
              <li>
                <a href="mailto:partner@therapyshala.com" className="hover:text-white transition-colors">
                  partner@therapyshala.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-3">
            <h4 className="font-serif-luxury text-lg font-normal mb-4 text-white">VIP Sanctuary Club</h4>
            <p className="text-xs text-white/60 font-light leading-relaxed mb-4">
              Subscribe to receive weekly salon offers and ₹500 off your first appointment booking.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-full px-5 py-3.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F35271] transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#F35271] hover:bg-[#E04362] text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {subscribed && (
              <span className="text-xs text-[#F35271] font-medium animate-fade-in block mt-2">
                Thank you for joining our VIP list!
              </span>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Legal links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EFE6DC]/50 font-light gap-4">
          <div>
            © {new Date().getFullYear()} TherapyShala Multi-Business Spa & Salon Platform.
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            <Link to="/help-center" className="hover:text-white transition-colors">
              Help Center
            </Link>
            <Link to="/about-us" className="hover:text-white transition-colors">
              About Us
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
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
