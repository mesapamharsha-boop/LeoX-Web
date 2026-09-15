import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, Instagram, Phone, Calendar, ArrowRight, Shield, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl, formatWhatsAppDisplayNumber } from '../../config/whatsapp';
import { SiteSettings } from '../../types';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  settings?: SiteSettings | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, settings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/leox_shoots/';
  const whatsAppNumber = settings?.whatsAppNumber;
  const whatsappUrl = whatsAppNumber
    ? `https://wa.me/${whatsAppNumber.replace(/\D/g, '')}`
    : getWhatsAppUrl();
  const whatsappDisplay = whatsAppNumber || formatWhatsAppDisplayNumber();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Reels', path: '/reels' },
    { label: 'Packages', path: '/packages' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 bg-[#08080a] border-b border-[#1c1d25] transition-all duration-200 ${
        isScrolled ? 'py-3 shadow-2xl shadow-black/80' : 'py-4 shadow-xl shadow-black/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo
          size="md"
          onClick={() => handleNav('/')}
          className="transition-opacity hover:opacity-90"
        />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                id={`nav-link-${link.label.toLowerCase()}`}
                onClick={() => handleNav(link.path)}
                className={`relative px-3.5 py-2 text-sm font-medium transition-all duration-200 rounded-lg group ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#E50914] shadow-[0_0_8px_#E50914] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#FF3842] transition-colors p-2 rounded-lg hover:bg-white/[0.04]"
            aria-label="LEOX Instagram"
            id="nav-instagram-btn"
          >
            <Instagram className="w-4 h-4" />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#25D366] transition-colors p-2 rounded-lg hover:bg-emerald-500/10"
            aria-label={`Chat on WhatsApp at ${whatsappDisplay}`}
            title={`Chat on WhatsApp (${whatsappDisplay})`}
            id="nav-whatsapp-btn"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
          </a>

          <button
            id="nav-book-shoot-cta"
            onClick={() => handleNav('/book')}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#E50914]/25 hover:shadow-[#E50914]/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Calendar className="w-3.5 h-3.5 text-white/90" />
            <span>Book A Shoot</span>
            <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            id="mobile-book-cta-pill"
            onClick={() => handleNav('/book')}
            className="px-3 py-1.5 rounded-md bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider"
          >
            Book
          </button>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-[#E50914]"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-overlay"
          className="fixed inset-0 top-[60px] bg-[#08080a] z-50 lg:hidden flex flex-col justify-between p-6 border-t border-[#1c1d24] animate-fade-in"
        >
          <div className="flex flex-col gap-2 pt-4">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`flex items-center justify-between py-3.5 px-4 rounded-xl text-lg font-heading font-semibold transition-all ${
                    isActive
                      ? 'bg-[#E50914]/15 text-white border-l-4 border-[#E50914]'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className={`w-4 h-4 ${isActive ? 'text-[#E50914]' : 'text-gray-500'}`} />
                </button>
              );
            })}
          </div>

          <div className="space-y-3 pt-6 border-t border-[#1f202a]">
            <a
              id="mobile-drawer-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-[#102418] hover:bg-[#153020] border border-emerald-500/30 text-emerald-400 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Chat On WhatsApp ({whatsappDisplay})</span>
            </a>

            <button
              onClick={() => handleNav('/book')}
              className="w-full py-3.5 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-[#E50914]/30"
            >
              <Calendar className="w-4 h-4" />
              <span>Book A Shoot Now</span>
            </button>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white"
              >
                <Instagram className="w-4 h-4 text-[#E50914]" />
                <span>Instagram</span>
              </a>

              <button
                onClick={() => handleNav('/admin/login')}
                className="flex items-center gap-1.5 hover:text-gray-200"
              >
                <Shield className="w-3.5 h-3.5 text-gray-500" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
