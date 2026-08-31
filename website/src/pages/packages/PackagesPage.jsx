import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SERVICE_PACKAGES } from '../../data/spaData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHeader from '../../components/common/PageHeader';
import { Sparkles, Check, ArrowRight, MapPin, Store, UserPlus } from 'lucide-react';

export default function PackagesPage() {
  const navigate = useNavigate();

  const handleBookPackage = (pkg) => {
    navigate(`/book?businessSlug=${pkg.businessSlug}&packageId=${pkg.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12]">
      <Navbar />

      <PageHeader
        badge="Multi-Session Bundles"
        title="Sanctuary Treatment"
        titleHighlight="Passes"
        description="Experience multi-session wellness passes and bridal bundles curated by top spas and salons with up to 30% savings."
        breadcrumbs={[{ label: 'Packages' }]}
        actionButton={
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0D0D12] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#F35271] transition-all shadow-md"
          >
            <Store className="w-4 h-4 text-[#FF5E7E]" />
            <span>Browse Spas & Salons</span>
          </Link>
        }
      />

      <main className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SERVICE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-[#AFB0B7]/30 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div className="relative h-64 overflow-hidden">
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/75 via-[#0D0D12]/20 to-transparent" />

                <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#0D0D12] uppercase tracking-wider">
                    {pkg.category}
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-[#168821] text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                    {pkg.discountPercent}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center gap-1 text-xs text-white/80 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF5E7E]" />
                    <span>{pkg.businessName} ({pkg.businessCity})</span>
                  </div>
                  <h3 className="font-serif-luxury text-2xl md:text-3xl font-normal text-white">
                    {pkg.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 flex flex-col justify-between flex-grow space-y-6">
                <div>
                  <div className="flex items-baseline justify-between bg-[#FFF8F9] p-4 rounded-2xl border border-[#F35271]/20 mb-6">
                    <div>
                      {pkg.regularPrice && (
                        <span className="text-xs text-[#757880] line-through mr-2">{pkg.regularPrice}</span>
                      )}
                      <span className="font-serif-luxury text-3xl font-bold text-[#F35271]">{pkg.packagePrice}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#168821] bg-[#168821]/10 px-2.5 py-1 rounded-full">
                      {pkg.savingsText}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#757880] font-light leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-3">
                      Included Treatments ({pkg.sessionsCount} Total Sessions)
                    </h4>
                    {pkg.includedServices?.map((srv, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#0D0D12]">
                        <Check className="w-4 h-4 text-[#F35271] shrink-0 mt-0.5" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#AFB0B7]/20">
                  <Link
                    to={`/business/${pkg.businessSlug}`}
                    className="py-3.5 rounded-full text-center text-xs font-semibold text-[#0D0D12] border border-[#AFB0B7]/40 hover:border-[#F35271] transition-colors"
                  >
                    Center Profile
                  </Link>
                  <button
                    onClick={() => handleBookPackage(pkg)}
                    className="py-3.5 rounded-full text-center text-xs font-semibold text-white bg-[#F35271] hover:bg-[#E04362] transition-colors shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Buy Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
