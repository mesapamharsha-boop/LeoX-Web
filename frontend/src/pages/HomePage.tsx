import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { IntroSection } from '../components/home/IntroSection';
import { ServicesGrid } from '../components/home/ServicesGrid';
import { FeaturedPortfolio } from '../components/home/FeaturedPortfolio';
import { ReelsShowcase } from '../components/home/ReelsShowcase';
import { WhyLeoxSection } from '../components/home/WhyLeoxSection';
import { ProcessSection } from '../components/home/ProcessSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { CtaSection } from '../components/home/CtaSection';
import { Service, PortfolioProject, Reel, Testimonial, SiteSettings } from '../types';

interface HomePageProps {
  services: Service[];
  projects: PortfolioProject[];
  reels: Reel[];
  testimonials: Testimonial[];
  settings?: SiteSettings | null;
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  services,
  projects,
  reels,
  testimonials,
  settings,
  navigate,
}) => {
  return (
    <div className="w-full">
      <HeroSection navigate={navigate} settings={settings} />
      <IntroSection navigate={navigate} settings={settings} />
      <ServicesGrid services={services} navigate={navigate} />
      <FeaturedPortfolio projects={projects} navigate={navigate} />
      <ReelsShowcase reels={reels} navigate={navigate} />
      <WhyLeoxSection />
      <ProcessSection />
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      <CtaSection navigate={navigate} />
    </div>
  );
};
