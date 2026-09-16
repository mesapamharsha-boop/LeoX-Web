import React from 'react';
import { CalendarCheck, Smartphone, Sliders, Zap } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'BOOK',
      desc: 'Choose your LEOX package and book your session.',
      icon: CalendarCheck,
    },
    {
      num: '02',
      title: 'SHOOT',
      desc: 'Our creator shoots your content using the latest iPhone technology.',
      icon: Smartphone,
    },
    {
      num: '03',
      title: 'EDIT',
      desc: 'Your videos are professionally edited on the spot.',
      icon: Sliders,
    },
    {
      num: '04',
      title: 'DELIVER',
      desc: 'Receive your edited videos instantly.',
      icon: Zap,
    },
  ];

  return (
    <section className="py-24 bg-[#08080a] border-t border-[#181922]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white">
            THE LEOX WORKFLOW.
          </h2>
          <p className="mt-4 text-gray-400 text-sm sm:text-base">
            From booking to delivery in record time. No delays, no waiting weeks.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col items-start p-7 rounded-2xl bg-[#101117] border border-[#20222f] hover:border-[#E50914]/60 transition-all duration-300 group shadow-lg hover:-translate-y-1"
              >
                {/* Step Number with Red Accent */}
                <div className="flex items-center justify-between w-full mb-5">
                  <span className="text-3xl font-heading font-black text-white/20 group-hover:text-[#E50914] transition-colors">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-gray-400 group-hover:bg-[#E50914]/15 group-hover:text-[#E50914] flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-sm font-heading font-extrabold uppercase tracking-wider text-white mb-2 leading-snug group-hover:text-[#FF3842] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
