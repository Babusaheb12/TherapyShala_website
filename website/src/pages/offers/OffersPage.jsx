import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PROMOTIONS_DATA, GIFT_VOUCHERS_DATA } from '../../data/spaData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHeader from '../../components/common/PageHeader';
import { Tag, Copy, Check, Gift, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function OffersPage() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState(GIFT_VOUCHERS_DATA[1]);
  const [customRecipient, setCustomRecipient] = useState('Sophia Vance');
  const [customSender, setCustomSender] = useState('Ananya Sharma');

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const handleUseOffer = (code) => {
    navigate(`/book?promo=${code}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12]">
      <Navbar />

      <PageHeader
        badge="Special Seasonal Savings"
        title="Sanctuary Offers &"
        titleHighlight="Promotions"
        description="Unlock exclusive weekday rates, limited-time holiday specials, promo codes, and customizable digital gift vouchers."
        breadcrumbs={[{ label: 'Offers' }]}
      />

      <main className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16 space-y-16">
        
        {/* Active Promo Codes */}
        <section className="space-y-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold">
              Instant Savings
            </span>
            <h2 className="font-serif-luxury text-3xl md:text-4xl text-[#0D0D12]">
              Active Promo Coupons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROMOTIONS_DATA.map((promo) => (
              <div
                key={promo.id}
                className="bg-white rounded-3xl p-8 border border-[#AFB0B7]/30 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#FFEEF1] text-[11px] font-bold text-[#F35271] uppercase tracking-wider">
                      {promo.badge}
                    </span>
                    <span className="text-xs text-[#757880]">{promo.validTill}</span>
                  </div>

                  <div>
                    <h3 className="font-serif-luxury text-2xl text-[#0D0D12]">
                      {promo.title}
                    </h3>
                    <p className="text-xs text-[#757880] mt-1 font-light leading-relaxed">
                      {promo.description}
                    </p>
                  </div>

                  <div className="bg-[#FFF8F9] p-3 rounded-xl border border-[#F35271]/20 flex items-center justify-between text-xs">
                    <span className="text-[#757880]">Discount Value:</span>
                    <span className="font-serif-luxury text-xl font-bold text-[#F35271]">{promo.discount}</span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#AFB0B7]/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 bg-[#FFEEF1] px-4 py-2.5 rounded-xl border border-[#F35271]/30">
                    <span className="font-mono text-xs font-bold text-[#0D0D12] tracking-widest">
                      {promo.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(promo.code)}
                      className="text-[#F35271] hover:text-[#0D0D12] transition-colors p-1"
                      title="Copy promo code"
                    >
                      {copiedCode === promo.code ? (
                        <Check className="w-4 h-4 text-[#168821]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => handleUseOffer(promo.code)}
                    className="py-2.5 px-5 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Use Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Digital Gift Vouchers */}
        <section className="bg-gradient-to-br from-[#FFEEF1] via-[#FFF8F9] to-white rounded-[3rem] p-8 md:p-14 border border-[#AFB0B7]/30 space-y-12 shadow-sm">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span>The Gift of Rejuvenation</span>
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#0D0D12] mt-1">
              Personalized Digital Spa Vouchers
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-3">
                  Select Voucher Value
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {GIFT_VOUCHERS_DATA.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVoucher(v)}
                      className={`p-3.5 rounded-2xl text-center border transition-all ${
                        selectedVoucher.id === v.id
                          ? 'bg-[#F35271] text-white border-[#F35271] shadow-md ring-2 ring-[#F35271]/20'
                          : 'bg-white text-[#0D0D12] border-[#AFB0B7]/30 hover:border-[#F35271]'
                      }`}
                    >
                      <span className="font-serif-luxury text-lg font-bold block">{v.denomination}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1">To (Recipient Name)</label>
                  <input
                    type="text"
                    value={customRecipient}
                    onChange={(e) => setCustomRecipient(e.target.value)}
                    className="w-full p-3 bg-white border border-[#AFB0B7]/40 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1">From (Your Name)</label>
                  <input
                    type="text"
                    value={customSender}
                    onChange={(e) => setCustomSender(e.target.value)}
                    className="w-full p-3 bg-white border border-[#AFB0B7]/40 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => navigate('/explore')}
                className="w-full py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" />
                <span>Gift Voucher ({selectedVoucher.denomination})</span>
              </button>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md rounded-[2.5rem] p-8 bg-white border border-[#F35271]/30 ring-4 ring-[#F35271]/10 shadow-2xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#F35271] block">TherapyShala Gift Pass</span>
                    <h4 className="font-serif-luxury text-xl mt-1">{selectedVoucher.title}</h4>
                  </div>
                  <span className="font-serif-luxury text-3xl font-bold text-[#F35271]">{selectedVoucher.denomination}</span>
                </div>
                <div className="py-4 border-y border-[#AFB0B7]/20 text-xs space-y-2">
                  <div><strong>For:</strong> {customRecipient}</div>
                  <div><strong>From:</strong> {customSender}</div>
                </div>
                <div className="text-[10px] text-[#757880]">Valid across all registered TherapyShala spas & salons</div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
