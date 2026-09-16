import React from 'react';
import { Package } from '../../types';
import { Check, Star, ArrowRight, Sparkles, Clock, Film, Zap } from 'lucide-react';
import { DEFAULT_LEOX_PACKAGES } from '../../pages/PackagesPage';

interface HomePackagesSectionProps {
  packages: Package[];
  navigate: (path: string) => void;
}

export const HomePackagesSection: React.FC<HomePackagesSectionProps> = ({ packages, navigate }) => {
  const displayPackages = packages && packages.length > 0 ? packages : DEFAULT_LEOX_PACKAGES;

  const handleBook = (pkg: Package) => {
    navigate(`/book?package=${encodeURIComponent(pkg.packageName)}`);
  };

  return (
    <section id="packages-section" className="py-24 bg-[#08080a] border-t border-[#181922] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#E50914]/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 text-xs font-bold uppercase tracking-widest text-[#FF4D55] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
            <span>LEOX PACKAGES &bull; SHOT ON iPHONE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white leading-tight">
            TRANSPARENT PRICING.
            <br />
            <span className="text-[#E50914]">INSTANT REEL DELIVERY.</span>
          </h2>

          <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Shot exclusively on the latest iPhones. Professionally edited and delivered on the spot so you can post while the energy is electric.
          </p>
        </div>

        {/* 4 Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-12">
          {displayPackages.map((pkg) => {
            const isPopular = pkg.badge === 'MOST POPULAR' || pkg.popular || pkg.packageName.toLowerCase().includes('pro+');
            const isRawIncluded = pkg.badge === 'RAW INCLUDED' || pkg.badge === 'ORIGINAL FOOTAGE INCLUDED' || pkg.packageName.toLowerCase().includes('max');

            const currentPrice = pkg.price || '₹1,599';
            const originalPrice = pkg.originalPrice || (
              pkg.packageName.includes('Elite') ? '₹2,499' :
              pkg.packageName.includes('Pro+') ? '₹5,999' :
              pkg.packageName.includes('Pro') ? '₹3,999' :
              pkg.packageName.includes('Max') ? '₹7,999' : ''
            );
            const discount = pkg.discount || (
              pkg.packageName.includes('Elite') ? '36% OFF' : '25% OFF'
            );
            const coverage = pkg.coverage || pkg.duration || (
              pkg.packageName.includes('Elite') ? 'Up to 1 Hour' :
              pkg.packageName.includes('Pro+') ? 'Up to 3.5 Hours' :
              pkg.packageName.includes('Pro') ? 'Up to 2.5 Hours' :
              pkg.packageName.includes('Max') ? 'Up to 4.5 Hours' : 'Per Event'
            );
            const reelsCount = pkg.reelsCount || (
              pkg.packageName.includes('Elite') ? '1 Edited Reel' :
              pkg.packageName.includes('Pro+') ? '3 Edited Reels' :
              pkg.packageName.includes('Pro') ? '2 Edited Reels' :
              pkg.packageName.includes('Max') ? '4 Edited Reels' : '1 Reel'
            );
            const buttonLabel = pkg.buttonText || `Book ${pkg.packageName}`;
            const features = (pkg.includedServices && pkg.includedServices.length > 0)
              ? pkg.includedServices
              : (pkg.features || []);

            return (
              <div
                key={pkg.id || pkg._id || pkg.packageName}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-2xl ${
                  isPopular
                    ? 'bg-[#12131c] border-2 border-[#E50914] shadow-[#E50914]/20 lg:-translate-y-2'
                    : 'bg-[#101117] border border-[#20222f] hover:border-[#E50914]/60 hover:-translate-y-1'
                }`}
              >
                {/* Header Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#E50914] text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-[#E50914]/40 flex items-center gap-1.5 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span>MOST POPULAR</span>
                  </div>
                )}

                {isRawIncluded && !isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#0D9488] text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-[#0D9488]/40 flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span>RAW INCLUDED</span>
                  </div>
                )}

                <div>
                  {/* Package Title */}
                  <h3 className="text-xl font-heading font-extrabold text-white mb-2">
                    {pkg.packageName}
                  </h3>

                  {/* Pricing Block */}
                  <div className="mb-5 pb-5 border-b border-[#1f212f]">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-3xl font-black text-white tracking-tight">
                        {currentPrice}
                      </span>
                      {originalPrice && (
                        <span className="text-sm line-through text-gray-500 font-medium">
                          {originalPrice}
                        </span>
                      )}
                      {discount && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-auto">
                          {discount}
                        </span>
                      )}
                    </div>

                    {/* Key Specs Pills */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161722] border border-[#232536] text-gray-300 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
                        <span className="truncate">{coverage}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161722] border border-[#232536] text-gray-300 text-xs font-semibold">
                        <Film className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
                        <span className="truncate">{reelsCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-6">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF4D55]">
                      Included Features:
                    </div>
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-300 leading-snug">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleBook(pkg)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                      isPopular
                        ? 'bg-[#E50914] hover:bg-[#FF2E36] text-white shadow-lg shadow-[#E50914]/30 hover:scale-[1.02]'
                        : 'bg-white/[0.08] hover:bg-[#E50914] text-white hover:scale-[1.02]'
                    }`}
                  >
                    <span>{buttonLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all packages banner */}
        <div className="text-center">
          <button
            onClick={() => navigate('/packages')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-[#E50914] transition-colors"
          >
            <span>VIEW DETAILED PACKAGE COMPARISON</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
