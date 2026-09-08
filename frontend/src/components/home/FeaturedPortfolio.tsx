import React, { useState } from 'react';
import { PortfolioProject } from '../../types';
import { Modal } from '../common/Modal';
import { MapPin, Calendar, ExternalLink, ArrowRight, Camera, Film, Play } from 'lucide-react';

interface FeaturedPortfolioProps {
  projects: PortfolioProject[];
  navigate: (path: string) => void;
}

export const FeaturedPortfolio: React.FC<FeaturedPortfolioProps> = ({ projects, navigate }) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const displayProjects = projects.slice(0, 6);

  return (
    <section className="py-24 bg-[#0a0b0f] border-t border-[#171822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
              <span>THE ARCHIVE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white">
              FEATURED PRODUCTIONS.
            </h2>
          </div>

          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-[#E50914] transition-colors group"
          >
            <span>EXPLORE FULL PORTFOLIO</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Portfolio Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayProjects.map((project) => (
            <div
              key={project.id || project._id}
              onClick={() => setSelectedProject(project)}
              className="group relative rounded-2xl overflow-hidden bg-[#111218] border border-[#20222f] hover:border-[#E50914]/80 transition-all duration-500 cursor-pointer flex flex-col shadow-2xl hover:-translate-y-2"
            >
              {/* Media Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#181a24]">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e14] via-black/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

                {/* Category Pill */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#E50914] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                  {project.category}
                </div>

                {/* Video Indicator */}
                {project.videoUrl && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20">
                    <Play className="w-3.5 h-3.5 text-[#E50914] fill-[#E50914] ml-0.5" />
                  </div>
                )}
              </div>

              {/* Card Meta details */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-[#111218]">
                <div>
                  <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-[#FF3842] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  
                  {/* Event Information Pill Tagline */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
                      <span>{project.city} &bull; {project.venue}</span>
                    </div>
                    {project.eventDate && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        <span>{project.eventDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1d1f2b] flex items-center justify-between text-xs text-gray-400">
                  <span className="group-hover:text-white transition-colors font-medium">
                    View Project Gallery
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E50914] transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <Modal
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.title}
        maxWidth="4xl"
      >
        {selectedProject && (
          <div className="space-y-6">
            {/* Modal Cover Image */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-[#181924] border border-[#262837]">
              <img
                src={selectedProject.coverImage}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 rounded-md bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                  {selectedProject.category}
                </span>
                {selectedProject.clientName && (
                  <span className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs">
                    Client: {selectedProject.clientName}
                  </span>
                )}
              </div>
            </div>

            {/* Event Specific Location and Date Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#151620] border border-[#262837]">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">City</div>
                <div className="text-sm font-semibold text-white mt-0.5">{selectedProject.city}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Venue</div>
                <div className="text-sm font-semibold text-white mt-0.5">{selectedProject.venue}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Event Date</div>
                <div className="text-sm font-semibold text-white mt-0.5">{selectedProject.eventDate}</div>
              </div>
            </div>

            {/* Description */}
            <div className="text-sm text-gray-300 leading-relaxed">
              {selectedProject.description}
            </div>

            {/* Additional Gallery Images */}
            {selectedProject.galleryImages && selectedProject.galleryImages.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
                  PRODUCTION GALLERY ({selectedProject.galleryImages.length} SHOTS)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedProject.galleryImages.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-[#181924] border border-[#242533]">
                      <img
                        src={img}
                        alt={`Gallery shot ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 border-t border-[#222432] flex flex-col sm:flex-row items-center justify-between gap-4">
              {selectedProject.instagramUrl && (
                <a
                  href={selectedProject.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-[#E50914]" />
                  <span>View On Instagram Reel / Story</span>
                </a>
              )}

              <button
                onClick={() => {
                  setSelectedProject(null);
                  navigate(`/book?service=${encodeURIComponent(selectedProject.category)}&city=${encodeURIComponent(selectedProject.city)}`);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#E50914]/30"
              >
                BOOK A SIMILAR SHOOT
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
