import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SERVICES_DATA, getAllBusinesses } from '../../data/spaData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHeader from '../../components/common/PageHeader';
import { Star, Clock, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Share2, MapPin, Store } from 'lucide-react';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);

  const service = SERVICES_DATA.find(s => s.id === parseInt(id)) || SERVICES_DATA[0];
  const allBusinesses = getAllBusinesses();
  const provider = allBusinesses.find(b => b.slug === service.businessSlug) || allBusinesses[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleProceedToBooking = () => {
    navigate(`/book?businessSlug=${service.businessSlug}&serviceId=${service.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12]">
      <Navbar />

      <PageHeader
        badge={`${service.category} Ritual`}
        title={service.title}
        breadcrumbs={[
          { label: 'Services', path: '/services' },
          { label: service.title }
        ]}
      />

      <main className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Image Banner */}
            <div className="relative rounded-[2.5rem] overflow-hidden border border-[#AFB0B7]/30 shadow-lg h-[360px] md:h-[480px]">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/70 via-transparent to-transparent" />

              <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#0D0D12] uppercase tracking-wider shadow-md">
                  {service.category}
                </span>

                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md hover:bg-[#F35271] hover:text-white flex items-center justify-center text-[#0D0D12] transition-colors shadow-md text-xs"
                  title="Share service link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white flex-wrap gap-4">
                <div className="flex items-center gap-4 text-xs sm:text-sm font-medium">
                  <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                    <Clock className="w-4 h-4 text-[#FF5E7E]" />
                    {service.duration}
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                    <Star className="w-4 h-4 fill-[#FF5E7E] text-[#FF5E7E]" />
                    {service.rating} ({service.reviewsCount} Reviews)
                  </span>
                </div>
                {copiedLink && (
                  <span className="bg-[#168821] text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Link Copied!
                  </span>
                )}
              </div>
            </div>

            {/* Provider Info Card */}
            <div className="bg-[#FFF8F9] rounded-3xl p-6 md:p-8 border border-[#F35271]/20 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <img src={provider.coverImage} alt={provider.name} className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#757880]">Provided by Verified Center</span>
                  <h3 className="font-serif-luxury text-xl text-[#0D0D12]">{provider.name}</h3>
                  <span className="text-xs text-[#757880] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F35271]" />
                    {provider.address}
                  </span>
                </div>
              </div>

              <Link
                to={`/business/${provider.slug}`}
                className="px-5 py-2.5 rounded-full bg-white border border-[#F35271] text-[#F35271] hover:bg-[#F35271] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                View Center Profile
              </Link>
            </div>

            {/* Ritual Overview */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#AFB0B7]/25 shadow-sm space-y-6">
              <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12]">
                About this Treatment
              </h2>

              <p className="text-sm text-[#757880] font-light leading-relaxed">
                {service.fullDescription || service.shortDescription}
              </p>

              {/* Benefits */}
              <div className="pt-6 border-t border-[#AFB0B7]/20">
                <h3 className="font-serif-luxury text-xl text-[#0D0D12] mb-4">
                  Key Therapeutic Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {service.benefits && service.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 bg-[#FFF8F9] rounded-2xl border border-[#F35271]/15">
                      <CheckCircle2 className="w-4 h-4 text-[#F35271] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#0D0D12] font-medium leading-snug">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#F35271]/30 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#AFB0B7]/20 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#757880]">
                  Reserve Treatment
                </span>
                <span className="text-[11px] font-bold text-[#168821] bg-[#168821]/10 px-2.5 py-0.5 rounded-full">
                  Instant Confirmation
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#757880]">Treatment Price:</span>
                  <span className="font-serif-luxury text-3xl font-bold text-[#F35271]">{service.price}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#757880]">
                  <span>GST (18%):</span>
                  <span>{service.gstAmount}</span>
                </div>
                <div className="pt-3 border-t border-[#AFB0B7]/20 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-[#0D0D12]">Total Payable:</span>
                  <span className="font-serif-luxury text-2xl font-bold text-[#0D0D12]">{service.totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToBooking}
                className="w-full py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Book This Ritual</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
