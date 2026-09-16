import React from 'react';
import { Smartphone, Film, Flame, Sparkles, Sliders, ArrowUpRight, Zap } from 'lucide-react';
import { SiteSettings } from '../../types';

interface IntroSectionProps {
  navigate: (path: string) => void;
  settings?: SiteSettings | null;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ navigate, settings }) => {
  const businessName = settings?.businessName || 'LEOX';
  const capabilities = [
    {
      icon: Smartphone,
      title: 'Shot On Latest iPhone',
      desc: 'Mobile-first 4K ProRes capture, cinematic framing, and gimbal stabilization.',
    },
    {
      icon: Zap,
      title: 'Instant Reel Delivery',
      desc: 'High-energy vertical reels professionally edited on the spot and delivered immediately.',
    },
    {
      icon: Film,
      title: 'Celebration & Event Content',
      desc: 'Capturing candid emotion, high points, and electric atmospheres without bulky equipment.',
    },
    {
      icon: Flame,
      title: 'Short-Form Content',
      desc: 'Rhythm-synced pacing and color grading designed to captivate Instagram and TikTok feeds.',
    },
    {
      icon: Sparkles,
      title: 'Creative & Fashion Shoots',
      desc: 'Editorial aesthetics, vibrant styling, and high-concept mobile art direction.',
    },
    {
      icon: Sliders,
      title: 'On-Site Color & Sound',
      desc: 'Instant audio syncing, viral sound design, and custom cinematic color grading.',
    },
  ];

  return (
    <section className="py-24 bg-[#0a0b0f] border-t border-[#161720] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & LEOX Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
              <span>THE LEOX VISION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white leading-tight">
              YOUR MOMENT.
              <br />
              <span className="text-[#E50914]">DELIVERED INSTANTLY.</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-normal">
              {businessName} was built to disrupt outdated event coverage. We discard static, formulaic videography and long turnaround times in favor of high-energy mobile pacing, professional color grading, and modern social-first storytelling shot exclusively on the latest iPhones.
            </p>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Whether documenting a luxury wedding in Vijayawada, an electric festival crowd in Hyderabad, or a high-energy creator shoot, our team delivers finished, viral-ready reels on the spot so you can share while the hype is at its peak.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/packages')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#FF3842] transition-colors group"
              >
                <span>Explore Official LEOX Packages</span>
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
