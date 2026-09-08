import React from 'react';
import { Logo } from './Logo';
import { Instagram, Mail, Phone, MapPin, ArrowUpRight, Shield, Heart } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#050507] border-t border-[#181920] text-gray-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Brand & Creator Bio */}
          <div className="lg:col-span-5 space-y-5">
            <Logo size="lg" onClick={() => handleNav('/')} />
            <p className="text-sm leading-relaxed text-gray-400 max-w-md">
              LEOX is a signature visual production company founded by <strong className="text-white">Mesapam Sri Harsha</strong>. We specialize in cinematic event photography, broadcast-grade videography, and viral Instagram reels designed to elevate personal and corporate milestones into enduring legacies.
            </p>

            <div className="pt-2 flex flex-col gap-2.5 text-xs">
              <a
                href="mailto:mesapamharsha@gmail.com"
                className="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#E50914]" />
                <span>mesapamharsha@gmail.com</span>
              </a>
              <a
                href="https://www.instagram.com/leox_shoots/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#E50914]" />
                <span>@leox_shoots (Official Instagram)</span>
              </a>
              <div className="flex items-center gap-2.5 text-gray-400">
                <MapPin className="w-4 h-4 text-[#E50914]" />
                <span>Vijayawada &bull; Hyderabad &bull; Available Pan-India</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
              EXPLORE LEOX
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Mesapam Sri Harsha', path: '/about' },
                { label: 'Cinematic Services', path: '/services' },
                { label: 'Portfolio & Events', path: '/portfolio' },
                { label: 'Viral 9:16 Reels', path: '/reels' },
                { label: 'Pricing & Packages', path: '/packages' },
                { label: 'Direct Booking Portal', path: '/book' },
                { label: 'Contact Studio', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleNav(item.path)}
                    className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#E50914] transition-all" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
              CREATIVE DISCIPLINES
            </h4>
            <div className="space-y-2 text-sm">
              <div className="p-3 rounded-lg bg-[#0e0f14] border border-[#1c1d25]">
                <div className="font-semibold text-white text-xs">Instagram Reels & Short-Form</div>
                <div className="text-xs text-gray-400 mt-0.5">Rapid 24-hour turnaround, rhythm sound design.</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e0f14] border border-[#1c1d25]">
                <div className="font-semibold text-white text-xs">Event & Wedding Cinematography</div>
                <div className="text-xs text-gray-400 mt-0.5">Multi-camera cinema setups, high-res drone footage.</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e0f14] border border-[#1c1d25]">
                <div className="font-semibold text-white text-xs">Personal Branding & Commercial</div>
                <div className="text-xs text-gray-400 mt-0.5">Founder portraits, magazine lookbooks, launch events.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#181920] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-white">LEOX</strong>. Founded by Mesapam Sri Harsha. All Rights Reserved.
          </div>

          <div className="flex items-center gap-5">
            <button onClick={() => handleNav('/privacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <span>&bull;</span>
            <button onClick={() => handleNav('/terms')} className="hover:text-white transition-colors">
              Terms of Service
            </button>
            <span>&bull;</span>
            <button
              id="footer-admin-link"
              onClick={() => handleNav('/admin/login')}
              className="flex items-center gap-1 hover:text-[#E50914] transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
