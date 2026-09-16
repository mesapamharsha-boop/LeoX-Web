import React from 'react';
import { Smartphone, Zap, ArrowRight, Instagram, Sparkles, Sliders, ShieldCheck } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>THE LEOX VISION</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white leading-tight">
            LEOX VISUAL MEDIA.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
            Next-generation short-form video and viral reel production. Shot on the latest iPhones, professionally edited on the spot, and delivered instantly for celebrations, creators, and brands.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-[#12131b] border border-[#222432] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop"
              alt="LEOX Production - Shot on iPhone"
              className="w-full h-full object-cover filter contrast-[1.1] brightness-90 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/75 backdrop-blur-md border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#E50914]">LEOX Media Production</div>
              <div className="text-sm font-heading font-bold text-white mt-0.5">Shot on the Latest iPhones &bull; Instant Delivery</div>
              <div className="text-xs text-gray-400 mt-1">Available for bookings across Vijayawada, Hyderabad & Pan-India</div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-gray-300 leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              REDEFINING HOW MOMENTS ARE SHARED.
            </h2>
            <p>
              Traditional videography forces you to wait weeks or months for event footage while the excitement fades. <strong className="text-white">LEOX</strong> was founded with a singular mission: capture the moment with the latest iPhone technology, edit on the spot, and deliver high-impact reels instantly.
            </p>
            <p>
              By leveraging advanced Apple ProRes video, cinema mobile color grading, and viral sound design, LEOX transforms celebrations, nightlife, corporate gatherings, and creator sessions into rhythm-synced vertical masterworks ready to dominate Instagram and TikTok.
            </p>
            <p>
              Our mobile-first approach ensures nimble, unobtrusive coverage that gets right into the heart of the action — capturing organic reactions without bulky equipment or lengthy setup delays.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="https://www.instagram.com/leox_shoots/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#E50914]" />
                <span>@leox_shoots</span>
              </a>
              <button
                onClick={() => navigate('/packages')}
                className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#E50914]/30 flex items-center gap-2"
              >
                <span>Explore LEOX Packages</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Production Standards Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#111218] border border-[#222432] mb-20 shadow-2xl">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-bold uppercase tracking-widest text-[#E50914] mb-2">PRODUCTION STANDARDS</div>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              POWERED BY THE LATEST iPHONES & INSTANT DELIVERY.
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Engineered for social-first platforms with zero waiting time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#171822] border border-[#282a3c] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#E50914]/10 text-[#E50914] flex items-center justify-center mb-4">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="text-white font-bold text-sm mb-2">Latest iPhone Technology</div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Utilizing the latest iPhone flagship devices with 4K ProRes capture, advanced computational video profiles, and fluid mobile action stabilization.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#171822] border border-[#282a3c] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#E50914]/10 text-[#E50914] flex items-center justify-center mb-4">
                  <Sliders className="w-5 h-5" />
                </div>
                <div className="text-white font-bold text-sm mb-2">On-The-Spot Professional Editing</div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Real-time color grading, trending audio synchronization, and algorithmic hook pacing edited directly during and immediately following your shoot.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#171822] border border-[#282a3c] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#E50914]/10 text-[#E50914] flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-white font-bold text-sm mb-2">Instant Delivery & Handover</div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Finished vertical reels delivered directly to your smartphone on the spot so you can publish while your event excitement is at its peak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
