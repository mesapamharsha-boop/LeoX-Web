import React from 'react';
import { Package } from '../types';
import { Check, Star, ArrowRight, ShieldCheck, MessageCircle, Clock, Film, Sparkles, Zap } from 'lucide-react';
import { getWhatsAppUrl } from '../config/whatsapp';

export const DEFAULT_LEOX_PACKAGES: Package[] = [
  {
    id: 'lx_pkg_elite',
    packageName: 'LEOX Elite',
    slug: 'leox-elite',
    price: '₹1,599',
    originalPrice: '₹2,499',
    discount: '36% OFF',
    coverage: 'Up to 1 Hour',
    reelsCount: '1 Edited Reel',
    description: 'Up to 1 Hour On-Site Coverage with 1 High-Impact Edited Reel and Instant Delivery.',
    duration: 'Up to 1 Hour',
    includedServices: [
      'Up to 1 Hour On-Site Coverage',
      '1 High-Impact Edited Reel',
      'Instant Reel Delivery',
      'LEOX Branding Included',
      'Basic Color Grading & Audio Edit',
    ],
    buttonText: 'Book LEOX Elite',
    badge: '',
    featured: true,
    popular: false,
    published: true,
  },
  {
    id: 'lx_pkg_pro',
    packageName: 'LEOX Pro',
    slug: 'leox-pro',
    price: '₹2,999',
    originalPrice: '₹3,999',
    discount: '25% OFF',
    coverage: 'Up to 2.5 Hours',
    reelsCount: '2 Edited Reels',
    description: 'Up to 2.5 Hours On-Site Coverage with 2 High-Impact Edited Reels and Trending Music Sync.',
    duration: 'Up to 2.5 Hours',
    includedServices: [
      'Up to 2.5 Hours On-Site Coverage',
      '2 High-Impact Edited Reels',
      'Instant Reel Delivery',
      'LEOX Branding Included',
      'Trending Music Sync & Color Grading',
    ],
    buttonText: 'Book LEOX Pro',
    badge: '',
    featured: true,
    popular: false,
    published: true,
  },
  {
    id: 'lx_pkg_pro_plus',
    packageName: 'LEOX Pro+',
    slug: 'leox-pro-plus',
    price: '₹4,499',
    originalPrice: '₹5,999',
    discount: '25% OFF',
    coverage: 'Up to 3.5 Hours',
    reelsCount: '3 Edited Reels',
    badge: 'MOST POPULAR',
    description: 'Up to 3.5 Hours On-Site Coverage with 3 High-Impact Edited Reels and Priority On-Site Sync.',
    duration: 'Up to 3.5 Hours',
    includedServices: [
      'Up to 3.5 Hours On-Site Coverage',
      '3 High-Impact Edited Reels',
      'Instant Reel Delivery',
      'LEOX Branding Included',
      'Priority On-Site Edit & Sync',
      'Shot on Latest iPhone',
    ],
    buttonText: 'Book LEOX Pro+',
    featured: true,
    popular: true,
    published: true,
  },
  {
    id: 'lx_pkg_max',
    packageName: 'LEOX Max',
    slug: 'leox-max',
    price: '₹5,999',
    originalPrice: '₹7,999',
    discount: '25% OFF',
    coverage: 'Up to 4.5 Hours',
    reelsCount: '4 Edited Reels',
    badge: 'RAW INCLUDED',
    description: 'Up to 4.5 Hours On-Site Coverage with 4 High-Impact Edited Reels and RAW Video Footage Included.',
    duration: 'Up to 4.5 Hours',
    includedServices: [
      'Up to 4.5 Hours On-Site Coverage',
      '4 High-Impact Edited Reels',
      'Instant Reel Delivery',
      'RAW Video Footage Included',
      'LEOX Branding Included',
      'VIP Creator & Rush Delivery Queue',
    ],
    buttonText: 'Book LEOX Max',
    featured: true,
    popular: false,
    published: true,
  },
];

interface PackagesPageProps {
  packages: Package[];
  navigate: (path: string) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ packages, navigate }) => {
  // Use packages from API/database, or fallback to exact 4 LEOX packages
  const displayPackages: Package[] = (packages && packages.length > 0)
    ? packages
    : DEFAULT_LEOX_PACKAGES;

  const handleBook = (pkg: Package) => {
    const pkgParam = encodeURIComponent(pkg.packageName);
    navigate(`/book?package=${pkgParam}`);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#FDFBF7]">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-[#EAE3D8] bg-[#F7F2E7]/80 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6B4F45]">
            <button onClick={() => navigate('/')} className="hover:text-[#7B182B] transition-colors">
              Home
            </button>
            <span>/</span>
            <span className="text-[#7B182B] font-bold">LEOX Packages</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-[#0D9488] bg-[#0D9488]/10 px-3 py-1 rounded-full border border-[#0D9488]/20">
            <Zap className="w-3.5 h-3.5" />
            <span>INSTANT REEL DELIVERY ON ALL PACKAGES</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7B182B]/10 border border-[#7B182B]/20 text-xs font-bold uppercase tracking-widest text-[#7B182B] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL LEOX PACKAGES</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-[#2C1A14] leading-tight tracking-tight">
            TRANSPARENT PRICING.<br />
            <span className="text-[#7B182B]">CINEMATIC RESULTS.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#5C443C] leading-relaxed max-w-2xl mx-auto">
            Choose from 4 purpose-built LEOX production tiers. All packages include professional color grading, trending audio synchronization, and guaranteed instant reel delivery.
          </p>
        </div>

        {/* 4 LEOX Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-7 mb-16 items-stretch">
          {displayPackages.map((pkg) => {
            const isPopular = pkg.badge === 'MOST POPULAR' || pkg.popular || pkg.packageName.toLowerCase().includes('pro+');
            const isRawIncluded = pkg.badge === 'RAW INCLUDED' || pkg.packageName.toLowerCase().includes('max');

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
              pkg.packageName.includes('Max') ? '4 Edited Reels' : '1 Edited Reel'
            );
            const buttonLabel = pkg.buttonText || `Book ${pkg.packageName}`;
            const features = (pkg.includedServices && pkg.includedServices.length > 0)
              ? pkg.includedServices
              : (pkg.features || []);

            return (
              <div
                key={pkg.id || pkg._id || pkg.slug || pkg.packageName}
                id={`card-${pkg.slug || pkg.packageName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xl ${
                  isPopular
                    ? 'bg-[#FFFDF9] border-2 border-[#7B182B] shadow-[#7B182B]/15 lg:-translate-y-2 ring-1 ring-[#7B182B]/20'
                    : 'bg-[#FFFDF9] border border-[#7B182B]/20 hover:border-[#7B182B]/60 hover:shadow-2xl'
                }`}
              >
                {/* Header Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#7B182B] text-white text-[11px] font-black tracking-widest uppercase shadow-lg shadow-[#7B182B]/30 flex items-center gap-1.5 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span>MOST POPULAR</span>
                  </div>
                )}

                {isRawIncluded && !isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0D9488] text-white text-[11px] font-black tracking-widest uppercase shadow-lg shadow-[#0D9488]/30 flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span>RAW INCLUDED</span>
                  </div>
                )}

                <div>
                  {/* Package Title */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl sm:text-2xl font-heading font-black text-[#2C1A14]">
                      {pkg.packageName}
                    </h3>
                  </div>

                  {/* Pricing Block */}
                  <div className="mt-3 mb-5 pb-5 border-b border-[#EFE8DC]">
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <span className="text-3xl sm:text-4xl font-black text-[#241510] tracking-tight">
                        {currentPrice}
                      </span>
                      {originalPrice && (
                        <span className="text-base sm:text-lg line-through text-[#8C766E] font-medium">
                          {originalPrice}
                        </span>
                      )}
                      {discount && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide bg-[#E6F4F1] text-[#0D9488] border border-[#0D9488]/30 ml-auto sm:ml-0">
                          {discount}
                        </span>
                      )}
                    </div>

                    {/* Key Specs Pills: Clock & Reel Icons */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F7F2E7] border border-[#E9E0D1] text-[#4A352F] text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 text-[#7B182B] shrink-0" />
                        <span className="truncate">{coverage}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F7F2E7] border border-[#E9E0D1] text-[#4A352F] text-xs font-semibold">
                        <Film className="w-3.5 h-3.5 text-[#7B182B] shrink-0" />
                        <span className="truncate">{reelsCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features List with Checkmarks */}
                  <div className="space-y-3 mb-6">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#7B182B]">
                      Included in {pkg.packageName}:
                    </div>
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#4A352F] leading-snug">
                        <div className="w-4 h-4 rounded-full bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Booking Button */}
                <div className="pt-2">
                  <button
                    id={`btn-book-${pkg.packageName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    onClick={() => handleBook(pkg)}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                      isPopular
                        ? 'bg-[#7B182B] hover:bg-[#5E0F1E] text-white shadow-lg shadow-[#7B182B]/30 hover:scale-[1.02]'
                        : 'bg-[#2C1A14] hover:bg-[#7B182B] text-white hover:scale-[1.02]'
                    }`}
                  >
                    <span>{buttonLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-center text-[#8C766E] mt-2 font-medium">
                    Instant date lock & WhatsApp dispatch
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Multi-Day / Custom Project Banner */}
        <div className="p-7 sm:p-9 rounded-3xl bg-[#F7F2E7] border border-[#E5DAC8] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#7B182B]/10 text-[#7B182B] flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-heading font-bold text-[#2C1A14]">
                Looking for Custom Multi-Day, Wedding, or Destination Coverage?
              </h4>
              <p className="text-xs sm:text-sm text-[#5C443C] mt-1 leading-relaxed">
                Connect directly with LEOX for custom multi-day logistics, multi-creator coverage, and expedited commercial deliverables.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              id="packages-whatsapp-quote-btn"
              href={getWhatsAppUrl({ message: 'Hi LEOX, I would like to inquire about a custom shoot package and quote.' })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#123824] hover:bg-[#18482e] text-emerald-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Inquiry</span>
            </a>
            <button
              id="packages-contact-btn"
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-[#FDFBF7] text-[#2C1A14] text-xs font-bold uppercase tracking-wider border border-[#D5C6B1] transition-colors shadow-sm"
            >
              Contact Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
