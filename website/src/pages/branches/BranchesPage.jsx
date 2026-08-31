import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllBusinesses } from '../../data/spaData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHeader from '../../components/common/PageHeader';
import { MapPin, Phone, Clock, Star, Sparkles, ArrowRight, Store } from 'lucide-react';

export default function BranchesPage() {
  const navigate = useNavigate();
  const allBusinesses = getAllBusinesses();
  const [selectedBranchId, setSelectedBranchId] = useState(allBusinesses[0].id);

  const activeBranch = allBusinesses.find(b => b.id === selectedBranchId) || allBusinesses[0];

  const handleBookAtBranch = (slug) => {
    navigate(`/book?businessSlug=${slug}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12]">
      <Navbar />

      <PageHeader
        badge="Platform Partner Network"
        title="Sanctuary Locations &"
        titleHighlight="Branches"
        description="Immerse yourself in private treatment suites, hydrotherapy lounges, and Ayurvedic chambers across Jaipur, Bangalore, Mumbai, and Goa."
        breadcrumbs={[{ label: 'Branches' }]}
        actionButton={
          <button
            onClick={() => handleBookAtBranch(activeBranch.slug)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#F35271] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#E04362] transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book at {activeBranch.name.split(' ')[0]}</span>
          </button>
        }
      />

      <main className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allBusinesses.map((branch) => {
            const isSelected = selectedBranchId === branch.id;
            return (
              <div
                key={branch.id}
                onClick={() => setSelectedBranchId(branch.id)}
                className={`bg-white rounded-3xl overflow-hidden border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#F35271] ring-4 ring-[#F35271]/15 shadow-xl -translate-y-1'
                    : 'border-[#AFB0B7]/30 shadow-sm hover:border-[#F35271]/50'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={branch.coverImage} alt={branch.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/70 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-[#0D0D12] uppercase">
                      {branch.city}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F35271] text-white text-[10px] font-bold flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-white" />
                      {branch.rating}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif-luxury text-base font-semibold leading-tight">{branch.name}</h3>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                  <p className="text-xs text-[#757880] font-light line-clamp-2">{branch.address}</p>
                  <div className="pt-3 border-t border-[#AFB0B7]/20 flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? 'text-[#F35271]' : 'text-[#757880]'}>
                      {isSelected ? 'Currently Viewing' : 'Click to View'}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F35271]' : 'text-[#AFB0B7]'}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Branch Showcase */}
        <section className="bg-white rounded-[3rem] p-8 md:p-14 border border-[#AFB0B7]/30 shadow-lg space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="relative rounded-3xl overflow-hidden h-[360px] md:h-[420px] shadow-md">
                <img src={activeBranch.coverImage} alt={activeBranch.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FF5E7E] block mb-1">{activeBranch.tagline}</span>
                  <h2 className="font-serif-luxury text-3xl md:text-4xl text-white font-normal">{activeBranch.name}</h2>
                </div>
              </div>

              {activeBranch.facilities && (
                <div className="space-y-4">
                  <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">Sanctuary Amenities & Facilities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeBranch.facilities.map((fac, idx) => (
                      <div key={idx} className="p-3.5 bg-[#FFF8F9] rounded-2xl border border-[#F35271]/15 flex items-center gap-3 text-xs sm:text-sm font-medium text-[#0D0D12]">
                        <Sparkles className="w-4 h-4 text-[#F35271] shrink-0" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FFEEF1]/60 rounded-3xl p-8 border border-[#F35271]/20 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold">Location & Concierge</span>
                  <h3 className="font-serif-luxury text-2xl text-[#0D0D12] mt-1">{activeBranch.name}</h3>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm text-[#0D0D12]">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#F35271] shrink-0 mt-1" />
                    <div>
                      <strong className="block">Address:</strong>
                      <span className="text-[#757880] font-light leading-relaxed">{activeBranch.address}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#F35271] shrink-0 mt-1" />
                    <div>
                      <strong className="block">Hours:</strong>
                      <span className="text-[#757880] font-light">{activeBranch.openingHours} ({activeBranch.workingDays})</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#F35271] shrink-0 mt-1" />
                    <div>
                      <strong className="block">Phone:</strong>
                      <a href={`tel:${activeBranch.phone}`} className="text-[#F35271] font-semibold">{activeBranch.phone}</a>
                    </div>
                  </li>
                </ul>

                <button
                  onClick={() => handleBookAtBranch(activeBranch.slug)}
                  className="w-full py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Book Appointment at this Sanctuary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
