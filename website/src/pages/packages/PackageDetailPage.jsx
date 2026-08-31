import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SERVICE_PACKAGES, getAllBusinesses } from '../../data/spaData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHeader from '../../components/common/PageHeader';
import { Sparkles, Check, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function PackageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const pkg = SERVICE_PACKAGES.find(p => p.id === id) || SERVICE_PACKAGES[0];
  const allBusinesses = getAllBusinesses();
  const provider = allBusinesses.find(b => b.slug === pkg.businessSlug) || allBusinesses[0];

  const handleBuyPackage = () => {
    navigate(`/book?businessSlug=${pkg.businessSlug}&packageId=${pkg.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12]">
      <Navbar />

      <PageHeader
        badge={`${pkg.sessionsCount}-Session Pass`}
        title={pkg.name}
        breadcrumbs={[
          { label: 'Packages', path: '/packages' },
          { label: pkg.name }
        ]}
      />

      <main className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-8 space-y-10">
            {pkg.image && (
              <div className="relative rounded-[2.5rem] overflow-hidden border border-[#AFB0B7]/30 shadow-lg h-[360px] md:h-[440px]">
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-[#F35271] text-xs font-bold uppercase tracking-wider mb-2">
                    {pkg.category}
                  </span>
                  <h2 className="font-serif-luxury text-3xl md:text-4xl text-white font-normal">{pkg.name}</h2>
                  <p className="text-sm text-white/80 font-light mt-1">{pkg.description}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#AFB0B7]/25 shadow-sm space-y-6">
              <h3 className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12]">
                Included Treatments ({pkg.sessionsCount} Total Sessions)
              </h3>
              <div className="space-y-3">
                {pkg.includedServices?.map((srv, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F35271]/15 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#0D0D12]">{srv}</span>
                    <span className="text-xs font-bold text-[#168821] bg-[#168821]/10 px-3 py-1 rounded-full">Full Session</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#F35271]/40 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#AFB0B7]/20 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#757880]">Package Summary</span>
                <span className="text-xs font-bold text-[#168821] bg-[#168821]/10 px-3 py-0.5 rounded-full">{pkg.discountPercent}</span>
              </div>

              <div className="space-y-4">
                {pkg.regularPrice && (
                  <div className="flex justify-between text-sm text-[#757880]">
                    <span>Original Value:</span>
                    <span className="line-through">{pkg.regularPrice}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#0D0D12]">Bundle Price:</span>
                  <span className="font-serif-luxury text-4xl font-bold text-[#F35271]">{pkg.packagePrice}</span>
                </div>
              </div>

              <button
                onClick={handleBuyPackage}
                className="w-full py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Purchase / Book Package</span>
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
