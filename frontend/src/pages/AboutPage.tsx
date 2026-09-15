import React from 'react';
import { Camera, Film, Award, CheckCircle2, ArrowRight, Instagram, Mail, Sparkles } from 'lucide-react';

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
            <span>BEHIND THE LENS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white leading-tight">
            LEOX VISUAL MEDIA.
          </h1>
          <p className="mt-4 text-lg text-gray-300 leading-relaxed font-normal">
            Visual director, lead cinematography, and the creative engine behind LEOX. Bringing high-energy, cinematic storytelling to contemporary celebrations across India.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#12131b] border border-[#222432] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
              alt="LeoX - Lead Director & Cinematographer"
              className="w-full h-full object-cover filter contrast-[1.1] brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#E50914]">Director & Cinematographer</div>
              <div className="text-sm font-heading font-bold text-white mt-0.5">LeoX Shoots</div>
              <div className="text-xs text-gray-400 mt-1">Available for bookings across Vijayawada, Hyderabad & Pan-India</div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-gray-300 leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              REDEFINING HOW MOMENTS ARE REMEMBERED.
            </h2>
            <p>
              Growing up with an obsession for dynamic visual framing and musical timing, <strong className="text-white">LEOX</strong> was founded with a clear vision: eliminate traditional, static video capture that gathers dust on hard drives.
            </p>
            <p>
              Instead, LEOX engineers every project like a theatrical short film. With precision color science, gimbal flow, and high-impact sound design, your celebrations and brand milestones command attention on both big cinema displays and mobile screens.
            </p>
            <p>
              Under LeoX's direction, the studio has covered high-profile luxury weddings, electronic music festivals with thousands of attendees, and exclusive automobile product launches.
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
                onClick={() => navigate('/book')}
                className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#E50914]/30"
              >
                Book LeoX For Your Event
              </button>
            </div>
          </div>
        </div>

        {/* Gear & Production Standards */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#111218] border border-[#222432] mb-20 shadow-2xl">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-bold uppercase tracking-widest text-[#E50914] mb-2">PRODUCTION RIG</div>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              CINEMA GEAR & TECHNICAL EXCELLENCE.
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              We never compromise on optics, sensor readouts, or audio fidelity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#171822] border border-[#282a3c]">
              <div className="text-[#E50914] font-bold text-sm mb-1">Cinema Cameras</div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Dual Sony FX3 & Alpha 7 IV full-frame sensors capable of 4K 120p slow motion, 10-bit 4:2:2 internal color grading, and dual-native ISO for pristine low-light rendering.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-[#171822] border border-[#282a3c]">
              <div className="text-[#E50914] font-bold text-sm mb-1">Optics & Glass</div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Sony G-Master f/1.2 and f/2.8 prime lenses (24mm, 35mm, 50mm, 85mm, 70-200mm) delivering creamy background separation, sharp micro-contrast, and cinematic flares.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-[#171822] border border-[#282a3c]">
              <div className="text-[#E50914] font-bold text-sm mb-1">Aerial & Audio Rig</div>
              <p className="text-xs text-gray-300 leading-relaxed">
                DJI Pro 4K Drone cinematography, DJI RS3 Pro gimbals for fluid walking shots, and 32-bit float wireless Sennheiser audio transmitters capturing pristine vow audio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
