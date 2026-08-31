import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllBusinesses } from '../../data/spaData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  MapPin, Phone, Mail, Globe, Star, Clock, 
  Sparkles, Check, ArrowRight, ShieldCheck, HeartHandshake,
  Calendar, CheckCircle2, User, Gift, Share2, Tag, 
  ChevronRight, MessageSquare, Image, Navigation, UserCheck
} from 'lucide-react';

export default function BusinessProfilePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const allBusinesses = getAllBusinesses();

  const business = allBusinesses.find(b => b.slug === slug) || allBusinesses[0];

  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookService = (serviceId) => {
    navigate(`/book?businessSlug=${business.slug}&serviceId=${serviceId}`);
  };

  const handleBookPackage = (packageId) => {
    navigate(`/book?businessSlug=${business.slug}&packageId=${packageId}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12]">
      <Navbar />

      {/* Hero Cover Banner */}
      <div className="relative pt-24 pb-8 bg-gradient-to-b from-[#FFEEF1] to-white border-b border-[#AFB0B7]/20">
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-[#757880] mb-6">
            <Link to="/" className="hover:text-[#F35271]">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#AFB0B7]" />
            <Link to="/explore" className="hover:text-[#F35271]">Spas & Salons</Link>
            <ChevronRight className="w-3 h-3 text-[#AFB0B7]" />
            <span className="text-[#0D0D12] font-semibold">{business.name}</span>
          </nav>

          {/* Cover Image & Quick Details Header */}
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border border-[#AFB0B7]/25 h-[340px] md:h-[420px] group">
            <img
              src={business.coverImage}
              alt={business.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/85 via-[#0D0D12]/30 to-transparent" />

            {/* Top Bar on Cover */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#0D0D12] uppercase tracking-wider shadow-md">
                {business.type}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md hover:bg-[#F35271] hover:text-white flex items-center justify-center text-[#0D0D12] transition-colors shadow-md text-xs"
                  title="Share profile"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Info on Cover */}
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="bg-[#168821] text-white text-[11px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Business
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-black/40 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/20">
                    <Star className="w-3.5 h-3.5 fill-[#FF5E7E] text-[#FF5E7E]" />
                    <strong className="text-white">{business.rating}</strong> ({business.reviewsCount} Reviews)
                  </span>
                  <span className="text-xs text-white/80 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF5E7E]" />
                    {business.shortLocation}
                  </span>
                </div>

                <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-normal text-white">
                  {business.name}
                </h1>
                <p className="text-xs sm:text-sm text-white/80 font-light mt-1 max-w-xl line-clamp-1">
                  {business.tagline}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/book?businessSlug=${business.slug}`)}
                  className="px-8 py-3.5 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          </div>

          {copied && (
            <div className="mt-3 text-right text-xs font-semibold text-[#168821]">
              Profile Link Copied to Clipboard!
            </div>
          )}

          {/* Quick Contact Strip */}
          <div className="mt-6 bg-white rounded-2xl p-4 border border-[#AFB0B7]/25 shadow-sm flex items-center justify-between flex-wrap gap-4 text-xs text-[#0D0D12]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F35271]" />
              <span><strong>Hours:</strong> {business.openingHours} ({business.workingDays})</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#F35271]" />
              <a href={`tel:${business.phone}`} className="hover:text-[#F35271]">{business.phone}</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#F35271]" />
              <a href={`mailto:${business.email}`} className="hover:text-[#F35271]">{business.email}</a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F35271]" />
              <span className="text-[#757880] truncate max-w-xs">{business.address}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Container with Tabs */}
      <main className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-10 md:py-14">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 border-b border-[#AFB0B7]/25 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'services', label: `Services (${business.services?.length || 0})` },
            { id: 'packages', label: `Packages (${business.packages?.length || 0})` },
            { id: 'staff', label: `Specialists (${business.staff?.length || 0})` },
            { id: 'reviews', label: `Reviews (${business.reviewsCount || 0})` },
            { id: 'photos', label: 'Photo Gallery' },
            { id: 'location', label: 'Location & Hours' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#F35271] text-white shadow-md'
                  : 'bg-white text-[#757880] border border-[#AFB0B7]/30 hover:border-[#F35271] hover:text-[#0D0D12]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-10">
                {/* About Description */}
                <div className="bg-white rounded-3xl p-8 border border-[#AFB0B7]/25 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F35271]">
                    <Sparkles className="w-4 h-4" />
                    <span>About {business.name}</span>
                  </div>
                  <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12]">
                    The Sanctuary Experience
                  </h2>
                  <p className="text-sm text-[#757880] font-light leading-relaxed">
                    {business.description}
                  </p>
                </div>

                {/* Facilities & Amenities */}
                {business.facilities && (
                  <div className="bg-white rounded-3xl p-8 border border-[#AFB0B7]/25 shadow-sm space-y-5">
                    <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">
                      Facilities & Amenities
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {business.facilities.map((fac, idx) => (
                        <div key={idx} className="p-3.5 bg-[#FFF8F9] rounded-2xl border border-[#F35271]/15 flex items-center gap-3 text-xs font-medium text-[#0D0D12]">
                          <Sparkles className="w-4 h-4 text-[#F35271] shrink-0" />
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Services Showcase */}
                {business.services && (
                  <div className="bg-white rounded-3xl p-8 border border-[#AFB0B7]/25 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">
                        Featured Rituals
                      </h3>
                      <button
                        onClick={() => setActiveTab('services')}
                        className="text-xs font-bold text-[#F35271] uppercase hover:underline flex items-center gap-1"
                      >
                        <span>View All ({business.services.length})</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {business.services.slice(0, 2).map((srv) => (
                        <div key={srv.id} className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F35271]/15 flex flex-col justify-between space-y-3">
                          <div className="flex gap-3">
                            <img src={srv.image} alt={srv.title} className="w-16 h-16 rounded-xl object-cover" />
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#F35271]">{srv.duration}</span>
                              <h4 className="font-serif-luxury text-base text-[#0D0D12] line-clamp-1">{srv.title}</h4>
                              <span className="font-sans font-bold text-sm text-[#0D0D12]">{srv.price}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBookService(srv.id)}
                            className="w-full py-2 rounded-full bg-white hover:bg-[#F35271] hover:text-white border border-[#AFB0B7]/30 text-xs font-semibold transition-colors"
                          >
                            Book This Ritual
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. SERVICES TAB */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-luxury text-3xl text-[#0D0D12]">
                    Treatment & Rituals Menu
                  </h3>
                  <p className="text-xs text-[#757880] mt-0.5">
                    All prices include complimentary consultations and organic herbal teas.
                  </p>
                </div>

                <div className="space-y-4">
                  {business.services?.map((srv) => (
                    <div
                      key={srv.id}
                      className="bg-white rounded-3xl p-6 border border-[#AFB0B7]/25 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={srv.image}
                          alt={srv.title}
                          className="w-20 h-20 rounded-2xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-[#F35271] uppercase tracking-wider">
                              {srv.category} • {srv.duration}
                            </span>
                            {srv.discount && (
                              <span className="px-2 py-0.5 rounded-full bg-[#168821]/10 text-[#168821] text-[10px] font-bold">
                                {srv.discount}
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif-luxury text-lg sm:text-xl text-[#0D0D12]">
                            {srv.title}
                          </h4>
                          <p className="text-xs text-[#757880] font-light mt-0.5 max-w-md line-clamp-2">
                            {srv.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#AFB0B7]/20 flex sm:flex-col justify-between items-center sm:items-end gap-3">
                        <div>
                          <span className="font-serif-luxury text-2xl font-bold text-[#F35271] block">
                            {srv.price}
                          </span>
                          <span className="text-[10px] text-[#757880]">+18% GST</span>
                        </div>

                        <button
                          onClick={() => handleBookService(srv.id)}
                          className="px-6 py-2.5 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                        >
                          <span>Book</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. PACKAGES TAB */}
            {activeTab === 'packages' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-luxury text-3xl text-[#0D0D12]">
                    Treatment Packages & Passes
                  </h3>
                  <p className="text-xs text-[#757880] mt-0.5">
                    Save up to 30% by purchasing multi-session treatment bundles.
                  </p>
                </div>

                <div className="space-y-6">
                  {business.packages?.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-3xl p-8 border border-[#F35271]/30 shadow-sm space-y-6 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                          <span className="text-[11px] font-bold text-[#F35271] uppercase tracking-wider block mb-1">
                            {pkg.sessionsCount} Sessions • {pkg.validity}
                          </span>
                          <h4 className="font-serif-luxury text-2xl text-[#0D0D12]">
                            {pkg.name}
                          </h4>
                          <p className="text-xs text-[#757880] font-light mt-1">
                            {pkg.description}
                          </p>
                        </div>

                        <div className="text-right">
                          {pkg.regularPrice && (
                            <span className="text-xs text-[#757880] line-through block">
                              {pkg.regularPrice}
                            </span>
                          )}
                          <span className="font-serif-luxury text-3xl font-bold text-[#F35271]">
                            {pkg.price}
                          </span>
                          {pkg.savings && (
                            <span className="text-[10px] font-bold text-[#168821] bg-[#168821]/10 px-2.5 py-0.5 rounded-full block mt-1">
                              {pkg.savings}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#AFB0B7]/20 flex justify-end">
                        <button
                          onClick={() => handleBookPackage(pkg.id)}
                          className="px-6 py-3 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
                        >
                          <span>Buy / Book Package</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. STAFF / SPECIALISTS TAB */}
            {activeTab === 'staff' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-luxury text-3xl text-[#0D0D12]">
                    Certified Team & Therapists
                  </h3>
                  <p className="text-xs text-[#757880] mt-0.5">
                    Our specialists are certified in European spa and Ayurvedic healing protocols.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {business.staff?.map((staff) => (
                    <div
                      key={staff.id}
                      className="bg-white rounded-3xl p-6 border border-[#AFB0B7]/25 shadow-sm space-y-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#FFEEF1]"
                        />
                        <div>
                          <h4 className="font-serif-luxury text-lg text-[#0D0D12]">
                            {staff.name}
                          </h4>
                          <span className="text-[11px] font-bold text-[#F35271] block">
                            {staff.role}
                          </span>
                          <span className="text-xs text-[#757880]">{staff.experience}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#757880] font-light leading-relaxed">
                        {staff.bio}
                      </p>

                      <div className="pt-3 border-t border-[#AFB0B7]/20 flex items-center justify-between text-xs font-bold">
                        <span className="text-[#0D0D12] flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#FF5E7E] text-[#FF5E7E]" />
                          {staff.rating} Guest Score
                        </span>
                        <button
                          onClick={() => navigate(`/book?businessSlug=${business.slug}&therapistId=${staff.id}`)}
                          className="text-[#F35271] hover:underline"
                        >
                          Book with {staff.name.split(' ')[0]}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-luxury text-3xl text-[#0D0D12]">
                    Verified Guest Feedback
                  </h3>
                  <p className="text-xs text-[#757880] mt-0.5">
                    Rated <strong>{business.rating} out of 5</strong> across {business.reviewsCount} visits.
                  </p>
                </div>

                <div className="space-y-4">
                  {business.reviews?.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white rounded-3xl p-6 border border-[#AFB0B7]/25 shadow-sm space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#FFEEF1] text-[#F35271] font-bold text-xs flex items-center justify-center">
                            {rev.author.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-[#0D0D12] block">{rev.author}</span>
                            <span className="text-[10px] text-[#757880]">{rev.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-[#F35271]">
                          <Star className="w-3.5 h-3.5 fill-[#F35271]" />
                          <span>{rev.rating} / 5</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#757880] font-light leading-relaxed italic">
                        "{rev.comment}"
                      </p>

                      {rev.service && (
                        <span className="text-[10px] text-[#0D0D12] font-semibold bg-[#FFF8F9] px-2.5 py-1 rounded-lg inline-block">
                          Ritual: {rev.service}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PHOTOS TAB */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                <h3 className="font-serif-luxury text-3xl text-[#0D0D12]">
                  Sanctuary & Suite Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {business.gallery?.map((img, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden h-60 border border-[#AFB0B7]/20 shadow-sm group">
                      <img
                        src={img}
                        alt={`${business.name} photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. LOCATION & HOURS TAB */}
            {activeTab === 'location' && (
              <div className="bg-white rounded-3xl p-8 border border-[#AFB0B7]/25 shadow-sm space-y-6">
                <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">
                  Location & Operating Schedule
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-[#0D0D12]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#F35271] shrink-0 mt-1" />
                    <div>
                      <strong>Full Address:</strong>
                      <p className="text-[#757880] font-light mt-0.5">{business.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#F35271] shrink-0 mt-1" />
                    <div>
                      <strong>Operating Schedule:</strong>
                      <p className="text-[#757880] font-light mt-0.5">{business.openingHours} • {business.workingDays}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#F35271] shrink-0 mt-1" />
                    <div>
                      <strong>Direct Phone:</strong>
                      <a href={`tel:${business.phone}`} className="text-[#F35271] font-semibold hover:underline block mt-0.5">{business.phone}</a>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column (4 cols): Sticky Booking & Info Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#F35271]/30 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#757880] font-bold block mb-1">
                  Online Appointments
                </span>
                <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">
                  Reserve at {business.name}
                </h3>
              </div>

              <div className="space-y-2.5 text-xs text-[#757880] py-4 border-y border-[#AFB0B7]/20">
                <div className="flex items-center gap-2 text-[#0D0D12]">
                  <CheckCircle2 className="w-4 h-4 text-[#F35271]" />
                  <span>Instant appointment confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-[#0D0D12]">
                  <CheckCircle2 className="w-4 h-4 text-[#F35271]" />
                  <span>Choose therapist or any available slot</span>
                </div>
                <div className="flex items-center gap-2 text-[#0D0D12]">
                  <CheckCircle2 className="w-4 h-4 text-[#F35271]" />
                  <span>Free cancellation up to 6 hours before</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/book?businessSlug=${business.slug}`)}
                className="w-full py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-[#757880]">
                Questions? Call {business.phone}
              </div>
            </div>

            {/* Business Verification Badge */}
            <div className="bg-[#FFEEF1]/60 rounded-3xl p-6 border border-[#F35271]/20 flex items-start gap-3.5 text-xs">
              <ShieldCheck className="w-6 h-6 text-[#F35271] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#0D0D12]">TherapyShala Hygiene Certified</h4>
                <p className="text-[#757880] font-light mt-0.5 leading-relaxed">
                  This facility undergoes strict safety checks, sanitized linen protocols, and authentic organic product verifications.
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
