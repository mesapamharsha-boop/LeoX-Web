import React from 'react';
import { Testimonial } from '../../types';
import { Star, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section className="py-24 bg-[#0a0b0f] border-t border-[#181922]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>AUTHENTIC FEEDBACK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white">
            CLIENT WORDS.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id || t._id}
              className="p-8 rounded-2xl bg-[#111218] border border-[#212330] hover:border-[#E50914]/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 text-[#E50914] mb-4">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E50914]" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm text-gray-300 leading-relaxed italic mb-6">
                  "{t.review}"
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-[#1e202a]">
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={t.customerName}
                    className="w-10 h-10 rounded-full object-cover border border-[#2c2e3d]"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#E50914]/20 text-[#E50914] font-bold flex items-center justify-center text-sm border border-[#E50914]/30">
                    {t.customerName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    {t.customerName}
                  </h4>
                  <div className="text-[11px] text-gray-400">
                    {t.customerRole} {t.eventType && `&bull; ${t.eventType}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
