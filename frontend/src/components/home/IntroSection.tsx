import React from 'react';
import { Camera, Film, Smartphone, Flame, Sparkles, UserCheck, ArrowUpRight } from 'lucide-react';

interface IntroSectionProps {
  navigate: (path: string) => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ navigate }) => {
  const capabilities = [
    {
      icon: Camera,
      title: 'Event Photography',
      desc: 'Raw candid moments, emotional highlights, and high-contrast ambient portraits.',
    },
    {
      icon: Film,
      title: 'Event Videography',
      desc: 'Theatrical motion picture films, gimbal stabilization, and drone aerial framing.',
    },
    {
      icon: Smartphone,
      title: 'Instagram Reels & Shorts',
      desc: 'Vertical 9:16 viral edits with trend audio synchronization and same-day delivery.',
    },
    {
      icon: Flame,
      title: 'Short-Form Content',
      desc: 'High-speed pacing and color science designed to captivate algorithmic audiences.',
    },
    {
      icon: Sparkles,
      title: 'Creative & Fashion Shoots',
      desc: 'Haute-couture aesthetics, dramatic studio lighting, and high-concept art direction.',
    },
    {
      icon: UserCheck,
      title: 'Personal Branding',
      desc: 'Executive founder profiles, media kit packages, and modern digital presence.',
    },
  ];

  return (
    <section className="py-24 bg-[#0a0b0f] border-t border-[#161720] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Harsha Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
              <span>THE LEOX VISION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white leading-tight">
              YOUR STORY.
              <br />
              <span className="text-[#E50914]">OUR LENS.</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-normal">
              Founded by visual artist <strong className="text-white">Mesapam Sri Harsha</strong>, LEOX was born to disrupt outdated media coverage. We discard static, formulaic videography in favor of high-energy pacing, editorial grade color grading, and modern social-first storytelling.
            </p>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Whether documenting a 2,000-guest luxury celebration in Vijayawada, an electric festival crowd in Hyderabad, or an intimate destination ceremony in Goa, our team merges cinema-grade glass with instant digital distribution.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#FF3842] transition-colors group"
              >
                <span>Discover Harsha's Creative Journey</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          {/* Right Column: 6 Core Disciplines Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {capabilities.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#12131b] border border-[#20222f] hover:border-[#E50914]/50 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#E50914]/10 text-[#E50914] flex items-center justify-center mb-4 group-hover:bg-[#E50914] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-heading font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
