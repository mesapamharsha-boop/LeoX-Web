import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a] text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#20222f] pb-6">
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            TERMS & CONDITIONS
          </h1>
          <p className="text-xs text-gray-400 mt-2">Effective Date: January 1, 2026 &bull; LEOX Media Productions</p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">1. Booking & Reservation</h2>
          <p>
            An inquiry submitted via our website does not guarantee calendar reservation until confirmed by LEOX. Once a date is verified, the specified advance deposit must be transferred to lock your production date.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">2. Delivery Timelines</h2>
          <p>
            LEOX packages feature instant on-site editing and delivery during or immediately following your scheduled session. Edited reels are transferred directly to your smartphone so you can publish immediately.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">3. Cancellation & Rescheduling</h2>
          <p>
            Should an event date shift due to unforeseen circumstances, LEOX will make every reasonable effort to accommodate the new schedule subject to creator calendar availability.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">4. Artistic License & Content Rights</h2>
          <p>
            LEOX maintains artistic freedom regarding mobile color grading, trending music synchronization, and sequence pacing. Clients receive full commercial/personal usage and posting rights for all delivered assets.
          </p>
        </section>
      </div>
    </div>
  );
};
