import React from 'react';
import { ArrowRight, Play, Camera, Film, Sparkles, MapPin } from 'lucide-react';

interface HeroSectionProps {
  navigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ navigate }) => {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#08080a] pt-20 pb-16">
      {/* Background Media with Cinematic Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop"
          alt="LEOX Cinematic Production"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-[1.15]"
        />
        {/* Layered Vignette & Lighting gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/60 to-[#08080a]/70" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#08080a]/50 to-[#08080a]" />
        
        {/* Subtle red spotlight glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#E50914]/20 blur-[130px] rounded-full pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Cinematic Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-semibold tracking-widest uppercase text-gray-300 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
          <span>LEOX VISUAL MEDIA &bull; MESAPAM SRI HARSHA</span>
        </div>

        {/* Main Brand Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight text-white mb-6 leading-[1.05]">
          CAPTURE THE MOMENT.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f0f0f2] to-[#9ca3af]">
            CREATE THE{' '}
          </span>
          <span className="text-[#E50914] relative inline-block">
            IMPACT.
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#E50914]/60 blur-[3px] rounded-full" />
          </span>
        </h1>

        {/* Supporting Description */}
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Premium photography, high-octane videography, and viral Instagram reels. We craft cinematic narratives for luxury weddings, high-energy festivals, and visionary creators.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            id="hero-book-shoot-btn"
            onClick={() => navigate('/book')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-sm font-bold tracking-wider uppercase transition-all duration-200 shadow-2xl shadow-[#E50914]/40 hover:shadow-[#E50914]/60 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group"
          >
            <span>BOOK A SHOOT</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
          </button>

          <button
            id="hero-view-portfolio-btn"
            onClick={() => navigate('/portfolio')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-sm font-bold tracking-wider uppercase border border-white/15 hover:border-white/30 transition-all duration-200 backdrop-blur-md flex items-center justify-center gap-2.5"
          >
            <Film className="w-4 h-4 text-[#E50914]" />
            <span>VIEW PORTFOLIO</span>
          </button>
        </div>

        {/* Key Metrics / Highlights strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl pt-8 border-t border-white/[0.08]">
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">24H</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Reel Turnaround</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">4K HDR</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Cinema Line Rig</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">2.5M+</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Social Views</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">100%</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Authentic Vision</div>
          </div>
        </div>
      </div>
    </section>
  );
};
