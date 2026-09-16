import React from 'react';
import { Eye, Zap, Smartphone, Sliders, ShieldCheck, Share2 } from 'lucide-react';

export const WhyLeoxSection: React.FC = () => {
  const pillars = [
    {
      icon: Eye,
      title: 'CREATIVE VISION',
      desc: 'LEOX blends dynamic framing with authentic human emotions so your short-form videos feel impactful, vibrant, and visually compelling.',
    },
    {
      icon: Zap,
      title: 'INSTANT DELIVERY',
      desc: 'No more waiting weeks for footage. With our on-site creator workflows, receive professionally edited vertical reels delivered instantly on the spot.',
    },
    {
      icon: Smartphone,
      title: 'LATEST iPHONE SHOOTING',
      desc: 'Shot exclusively on the latest iPhones utilizing advanced sensor profiles, Apple ProRes video, and gimbal mobile stabilization.',
    },
    {
      icon: Share2,
      title: 'SOCIAL-FIRST CONTENT',
      desc: 'Native vertical 9:16 engineering, high-bitrate mobile exports, and viral audio cues tailored for Instagram and TikTok algorithm acceleration.',
    },
    {
      icon: Sliders,
      title: 'ON-SITE EDITING',
      desc: 'Color grading, beat-matching, and hook optimization performed in real-time so your content is ready to post while your event is still happening.',
    },
    {
      icon: ShieldCheck,
      title: 'SEAMLESS RELIABILITY',
      desc: 'Instant cloud backup, rapid mobile transfer, and on-time guarantees give you complete peace of mind for your celebrations and brand moments.',
    },
  ];

  return (
    <section className="py-24 bg-[#0a0b0f] border-t border-[#181922] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>THE LEOX ADVANTAGE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white">
            WHY VISIONARIES CHOOSE LEOX.
          </h2>
          <p className="mt-4 text-gray-400 text-sm sm:text-base">
            We operate at the leading edge of iPhone cinematography and instant social media distribution.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-[#111218] border border-[#212330] hover:border-[#E50914]/50 transition-all duration-300 group hover:-translate-y-1 shadow-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center mb-6 group-hover:bg-[#E50914] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-3 tracking-wide group-hover:text-[#FF3842] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
