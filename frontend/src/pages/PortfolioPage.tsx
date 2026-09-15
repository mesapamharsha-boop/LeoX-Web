import React, { useState, useMemo } from 'react';
import { PortfolioProject } from '../types';
import { Modal } from '../components/common/Modal';
import { Search, MapPin, Calendar, ExternalLink, Play, Filter, ArrowRight } from 'lucide-react';

interface PortfolioPageProps {
  projects: PortfolioProject[];
  navigate: (path: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ projects, navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [projects]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    return ['ALL', ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = selectedCategory === 'ALL' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchCity = selectedCity === 'ALL' || p.city.toLowerCase() === selectedCity.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.venue.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query);

      return matchCat && matchCity && matchSearch;
    });
  }, [projects, selectedCategory, selectedCity, searchQuery]);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>VISUAL ARCHIVE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white leading-tight">
            PORTFOLIO & PRODUCTIONS.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
            Explore our curated work across luxury weddings, electric music festivals, automotive launches, and viral reels.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mb-12 p-4 sm:p-6 rounded-2xl bg-[#101118] border border-[#20222f] space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by venue, city, or title..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#E50914] transition-colors"
              />
            </div>

            {/* City Dropdown */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E50914] shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-[#161722] border border-[#27293a] text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E50914]"
              >
                <option value="ALL">All Cities</option>
                {cities.filter(c => c !== 'ALL').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1d1e2b]">
            <span className="text-[11px] uppercase font-bold text-gray-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#E50914]" /> Category:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                    active
                      ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/30'
                      : 'bg-[#181925] text-gray-400 hover:text-white hover:bg-[#202130]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-2xl bg-[#101118] border border-[#20222f]">
            <p className="text-gray-400 text-sm">No projects match your current filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedCity('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#E50914] text-white text-xs font-bold uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id || project._id}
                onClick={() => setActiveProject(project)}
                className="group relative rounded-2xl overflow-hidden bg-[#111218] border border-[#20222f] hover:border-[#E50914]/80 transition-all duration-300 cursor-pointer flex flex-col shadow-2xl hover:-translate-y-1.5"
              >
                {/* Media */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#181a24]">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e14] via-black/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#E50914] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                    {project.category}
                  </div>

                  {project.videoUrl && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20">
                      <Play className="w-3.5 h-3.5 text-[#E50914] fill-[#E50914] ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-[#111218]">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-[#FF3842] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    
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
                      View Full Details
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E50914] transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <Modal
        isOpen={Boolean(activeProject)}
        onClose={() => setActiveProject(null)}
        title={activeProject?.title}
        maxWidth="4xl"
      >
        {activeProject && (
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden aspect-video bg-[#181924] border border-[#262837]">
              {activeProject.videoUrl ? (
                <video
                  src={activeProject.videoUrl}
                  controls
                  playsInline
                  poster={activeProject.coverImage}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeProject.coverImage}
                  alt={activeProject.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 rounded-md bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                  {activeProject.category}
                </span>
                {activeProject.clientName && (
                  <span className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs">
                    Client: {activeProject.clientName}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#151620] border border-[#262837]">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">City</div>
                <div className="text-sm font-semibold text-white mt-0.5">{activeProject.city}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Venue</div>
                <div className="text-sm font-semibold text-white mt-0.5">{activeProject.venue}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Event Date</div>
                <div className="text-sm font-semibold text-white mt-0.5">{activeProject.eventDate}</div>
              </div>
            </div>

            <div className="text-sm text-gray-300 leading-relaxed">
              {activeProject.description}
            </div>

            {activeProject.galleryImages && activeProject.galleryImages.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
                  GALLERY ({activeProject.galleryImages.length} SHOTS)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activeProject.galleryImages.map((img, i) => (
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

            <div className="pt-6 border-t border-[#222432] flex flex-col sm:flex-row items-center justify-between gap-4">
              {activeProject.instagramUrl && (
                <a
                  href={activeProject.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-[#E50914]" />
                  <span>View Project On Instagram</span>
                </a>
              )}

              <button
                onClick={() => {
                  const serviceParam = encodeURIComponent(activeProject.category);
                  const cityParam = encodeURIComponent(activeProject.city);
                  setActiveProject(null);
                  navigate(`/book?service=${serviceParam}&city=${cityParam}`);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#E50914]/30"
              >
                BOOK A SIMILAR SHOOT
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
