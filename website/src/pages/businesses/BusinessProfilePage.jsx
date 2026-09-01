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
  ChevronRight, MessageSquare, Image, Navigation, UserCheck,
  Building2, GitBranch, DoorOpen, ExternalLink, X, FileSpreadsheet,
  Award, ShieldAlert
} from 'lucide-react';

export default function BusinessProfilePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const allBusinesses = getAllBusinesses();

  const business = allBusinesses.find(b => b.slug === slug || b.id === slug) || allBusinesses[0];

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState(null);
  const [copied, setCopied] = useState(false);

  const activeBranch = (business.branches && business.branches[selectedBranchIndex]) || {
    name: 'Main Flagship Branch',
    address: typeof business.address === 'object' ? business.address.line1 : business.address,
    city: business.city,
    state: business.state,
    pincode: typeof business.address === 'object' ? business.address.pincode : '302015',
    phone: business.phone,
    email: business.email,
    roomCapacity: 6,
    chairCapacity: 8,
    latitude: typeof business.address === 'object' ? business.address.latitude : 26.9124,
    longitude: typeof business.address === 'object' ? business.address.longitude : 75.7873,
    operatingHours: business.operatingSchedule || []
  };

  const galleryPhotos = business.gallery && business.gallery.length >= 3 
    ? business.gallery 
    : [
        business.coverImage,
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80"
      ];

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

  const openGoogleMaps = () => {
    const lat = activeBranch.latitude || (typeof business.address === 'object' ? business.address.latitude : 26.9124);
    const lng = activeBranch.longitude || (typeof business.address === 'object' ? business.address.longitude : 75.7873);
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/90 via-[#0D0D12]/35 to-transparent" />

            {/* Top Bar on Cover */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#0D0D12] uppercase tracking-wider shadow-md">
                  {business.type}
                </span>
                {business.branches && business.branches.length > 1 && (
                  <span className="px-3.5 py-1.5 rounded-full bg-[#0D0D12]/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20">
                    <GitBranch className="w-3.5 h-3.5 text-[#F35271]" />
                    {business.branches.length} Branches
                  </span>
                )}
              </div>

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
                    <CheckCircle2 className="w-3 h-3" /> KYC & GST Verified
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-black/40 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/20">
                    <Star className="w-3.5 h-3.5 fill-[#FF5E7E] text-[#FF5E7E]" />
                    <strong className="text-white">{business.rating}</strong> ({business.reviewsCount} Reviews)
                  </span>
                  <span className="text-xs text-white/90 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF5E7E]" />
                    {business.shortLocation || `${business.city}, ${business.state}`}
                  </span>
                </div>

                <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-normal text-white">
                  {business.name}
                </h1>
                <p className="text-xs sm:text-sm text-white/80 font-light mt-1 max-w-xl line-clamp-1">
                  {business.tagline || business.description}
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

          {/* Quick Contact & Compliance Strip */}
          <div className="mt-6 bg-white rounded-2xl p-4 border border-[#AFB0B7]/25 shadow-sm flex items-center justify-between flex-wrap gap-4 text-xs text-[#0D0D12]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F35271]" />
              <span><strong>Hours:</strong> {business.openingHours} ({business.workingDays})</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#F35271]" />
              <a href={`tel:${business.phone}`} className="hover:text-[#F35271] font-semibold">{business.phone}</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#F35271]" />
              <a href={`mailto:${business.email}`} className="hover:text-[#F35271]">{business.email}</a>
            </div>
            {business.legal?.gstin && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-[#0D0D12] text-[11px] font-mono">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#168821]" />
                <span>GST: {business.legal.gstin}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Container with Tabs */}
      <main className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-10 md:py-14">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 border-b border-[#AFB0B7]/25 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'branches', label: `Branches (${business.branches?.length || 1})` },
            { id: 'services', label: `Services (${business.services?.length || 0})` },
            { id: 'packages', label: `Packages (${business.packages?.length || 0})` },
            { id: 'staff', label: `Specialists (${business.staff?.length || 0})` },
            { id: 'photos', label: `Gallery (${galleryPhotos.length})` },
            { id: 'location', label: 'Location & 7-Day Hours' }
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

                {/* Photo Gallery Spotlight (3-5 Photos) */}
                <div className="bg-white rounded-3xl p-8 border border-[#AFB0B7]/25 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">
                      Sanctuary Gallery
                    </h3>
                    <button
                      onClick={() => setActiveTab('photos')}
                      className="text-xs font-bold text-[#F35271] uppercase hover:underline"
                    >
                      View All Photos ({galleryPhotos.length})
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {galleryPhotos.slice(0, 3).map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedGalleryPhoto(img)}
                        className="rounded-2xl overflow-hidden aspect-4/3 cursor-pointer group relative border border-[#AFB0B7]/20"
                      >
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                          Click to Expand
                        </div>
                      </div>
                    ))}
                  </div>
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
              </div>
            )}

            {/* 2. BRANCHES TAB */}
            {activeTab === 'branches' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-luxury text-3xl text-[#0D0D12]">
                    Branch Network & Treatment Suites
                  </h3>
                  <p className="text-xs text-[#757880] mt-0.5">
                    Select a branch to view location specifics, suite capacities, and dedicated therapists.
                  </p>
                </div>

                <div className="space-y-4">
                  {(business.branches || [activeBranch]).map((branch, idx) => {
                    const isSelected = selectedBranchIndex === idx;
                    return (
                      <div
                        key={branch.id || idx}
                        onClick={() => setSelectedBranchIndex(idx)}
                        className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#F35271] bg-[#FFF8F9] ring-2 ring-[#F35271]/20 shadow-md'
                            : 'border-[#AFB0B7]/30 bg-white hover:border-[#F35271]/40'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif-luxury text-xl text-[#0D0D12]">{branch.name}</h4>
                              {branch.isMain && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#168821]/15 text-[#168821] text-[10px] font-bold">
                                  Flagship Center
                                </span>
                              )}
                              <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-[#757880] text-[10px] font-bold uppercase">
                                {branch.status || 'Active'}
                              </span>
                            </div>

                            <div className="text-xs text-[#757880] mt-2 space-y-1">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-[#F35271]" />
                                <span>{branch.address}, {branch.city}, {branch.state} {branch.pincode}</span>
                              </div>
                              <div className="flex items-center gap-3 pt-1">
                                <span>🚪 <strong>{branch.roomCapacity || 6}</strong> Private Suites</span>
                                <span>💺 <strong>{branch.chairCapacity || 8}</strong> Styling Chairs</span>
                                <span>📞 {branch.phone || business.phone}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openGoogleMaps();
                              }}
                              className="px-4 py-2 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold hover:bg-neutral-50 flex items-center gap-1.5"
                            >
                              <Navigation className="w-3.5 h-3.5 text-[#F35271]" />
                              <span>Directions</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/book?businessSlug=${business.slug}&branchId=${branch.id}`);
                              }}
                              className="px-5 py-2 rounded-full bg-[#F35271] text-white text-xs font-bold hover:bg-[#E04362]"
                            >
                              Book Here
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. SERVICES TAB */}
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

            {/* 4. PACKAGES TAB */}
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
                          <span className="text-xs line-through text-[#757880] block">{pkg.regularPrice}</span>
                          <span className="font-serif-luxury text-3xl font-bold text-[#F35271]">{pkg.price}</span>
                          <span className="block text-[10px] text-[#168821] font-bold">{pkg.savings}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookPackage(pkg.id)}
                        className="w-full py-3.5 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Gift className="w-4 h-4" />
                        <span>Reserve Package Pass</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. STAFF TAB */}
            {activeTab === 'staff' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-luxury text-3xl text-[#0D0D12]">
                    Certified Specialists & Vaidyas
                  </h3>
                  <p className="text-xs text-[#757880] mt-0.5">
                    Experience personalized treatments administered by certified master practitioners.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {business.staff?.map((st) => (
                    <div key={st.id} className="bg-white rounded-3xl p-6 border border-[#AFB0B7]/25 shadow-sm space-y-4">
                      <div className="flex items-center gap-4">
                        <img src={st.avatar} alt={st.name} className="w-16 h-16 rounded-2xl object-cover" />
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-[#168821] font-bold">
                            <UserCheck className="w-3.5 h-3.5" /> Certified Specialist
                          </div>
                          <h4 className="font-serif-luxury text-lg text-[#0D0D12]">{st.name}</h4>
                          <span className="text-xs text-[#757880]">{st.role} • {st.experience || '8 Yrs Exp'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#757880] font-light">{st.bio}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PHOTO GALLERY TAB (3-5 Photos) */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-luxury text-3xl text-[#0D0D12]">
                    Sanctuary Photo Gallery ({galleryPhotos.length} Photos)
                  </h3>
                  <p className="text-xs text-[#757880] mt-0.5">
                    Take a visual tour through our private hydrotherapy suites, styling lounges, and relaxation chambers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryPhotos.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedGalleryPhoto(img)}
                      className="rounded-3xl overflow-hidden aspect-4/3 border border-[#AFB0B7]/25 shadow-sm cursor-pointer group relative"
                    >
                      <img src={img} alt={`Gallery photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Click to Zoom
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. LOCATION & 7-DAY OPERATING HOURS TAB */}
            {activeTab === 'location' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-luxury text-3xl text-[#0D0D12]">
                    Location Coordinates & 7-Day Timings
                  </h3>
                  <p className="text-xs text-[#757880] mt-0.5">
                    Find our exact GPS location and weekly operating hours for every day.
                  </p>
                </div>

                {/* 7-Day Hours Table */}
                <div className="bg-white rounded-3xl p-6 border border-[#AFB0B7]/25 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F35271] flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Weekly Operating Schedule (Monday–Sunday)
                  </h4>
                  <div className="space-y-2">
                    {(activeBranch.operatingHours && activeBranch.operatingHours.length > 0 
                      ? activeBranch.operatingHours 
                      : [
                          { day: 'Monday', isOpen: true, openingTime: '09:00 AM', closingTime: '09:30 PM' },
                          { day: 'Tuesday', isOpen: true, openingTime: '09:00 AM', closingTime: '09:30 PM' },
                          { day: 'Wednesday', isOpen: true, openingTime: '09:00 AM', closingTime: '09:30 PM' },
                          { day: 'Thursday', isOpen: true, openingTime: '09:00 AM', closingTime: '09:30 PM' },
                          { day: 'Friday', isOpen: true, openingTime: '09:00 AM', closingTime: '09:30 PM' },
                          { day: 'Saturday', isOpen: true, openingTime: '09:00 AM', closingTime: '09:30 PM' },
                          { day: 'Sunday', isOpen: true, openingTime: '09:00 AM', closingTime: '09:30 PM' }
                        ]
                    ).map((sched, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-[#AFB0B7]/15 text-xs">
                        <span className="font-bold text-[#0D0D12]">{sched.day}</span>
                        {sched.isOpen ? (
                          <span className="font-mono text-[#0D0D12] bg-[#FFEEF1]/60 px-3 py-1 rounded-full">
                            {sched.openingTime} - {sched.closingTime}
                          </span>
                        ) : (
                          <span className="text-[#F35271] font-bold px-3 py-1">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* GPS Coordinates & Directions Action */}
                <div className="bg-white rounded-3xl p-6 border border-[#AFB0B7]/25 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#F35271]" /> GPS Pin & Navigation
                  </h4>
                  <p className="text-xs text-[#757880]">
                    {activeBranch.address || (typeof business.address === 'object' ? business.address.line1 : business.address)}, {business.city}, {business.state}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={openGoogleMaps}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0D0D12] text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
                    >
                      <Navigation className="w-4 h-4 text-[#F35271]" />
                      <span>Open Live GPS in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Sticky Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            
            {/* Direct Booking Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFB0B7]/30 shadow-lg space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#757880] block">
                  Treatments Starting From
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif-luxury text-3xl font-bold text-[#F35271]">
                    {business.startingPrice || '₹1,999'}
                  </span>
                  <span className="text-xs text-[#757880] font-light">/ session</span>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#AFB0B7]/20 text-xs">
                <div className="flex items-center justify-between text-[#757880]">
                  <span>Center Rating:</span>
                  <span className="font-bold text-[#0D0D12] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#FF5E7E] text-[#FF5E7E]" />
                    {business.rating} / 5.0
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#757880]">
                  <span>Selected Branch:</span>
                  <span className="font-bold text-[#0D0D12] truncate max-w-[150px]">{activeBranch.name}</span>
                </div>
                <div className="flex items-center justify-between text-[#757880]">
                  <span>Cancellation:</span>
                  <span className="text-[#168821] font-bold">Free up to 6h prior</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/book?businessSlug=${business.slug}`)}
                className="w-full py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Appointment</span>
              </button>

              <div className="text-center">
                <span className="text-[11px] text-[#757880]">Zero upfront reservation fees</span>
              </div>
            </div>

            {/* Legal & KYC Verification Card */}
            <div className="bg-[#FFF8F9] rounded-3xl p-6 border border-[#F35271]/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0D0D12]">
                <ShieldCheck className="w-4 h-4 text-[#168821]" />
                <span>TherapyShala Verified Entity</span>
              </div>
              <div className="space-y-1.5 text-xs text-[#757880]">
                <div><strong>Legal Name:</strong> {business.legal?.legalBusinessName || business.name}</div>
                <div><strong>Constitution:</strong> {business.legal?.constitution || 'Registered Entity'}</div>
                {business.legal?.gstin && <div><strong>GSTIN:</strong> {business.legal.gstin}</div>}
                <div><strong>KYC Status:</strong> <span className="text-[#168821] font-bold">Audited & Verified</span></div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* LIGHTBOX PHOTO MODAL */}
      <AnimatePresence>
        {selectedGalleryPhoto && (
          <div
            onClick={() => setSelectedGalleryPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl"
            >
              <img src={selectedGalleryPhoto} alt="Zoomed gallery photo" className="w-full h-full object-contain bg-black" />
              <button
                onClick={() => setSelectedGalleryPhoto(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#F35271] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
