import React, { useState, useEffect } from 'react';
import { Service, Package, Booking } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Calendar, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface BookingPageProps {
  services: Service[];
  packages: Package[];
  navigate: (path: string, state?: any) => void;
  urlParams: URLSearchParams;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  services,
  packages,
  navigate,
  urlParams,
}) => {
  const { error } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Read initial query params
  const initialService = urlParams.get('service') || (services[0]?.serviceName || 'Event Photography');
  const initialPackage = urlParams.get('package') || '';
  const initialCity = urlParams.get('city') || 'Vijayawada';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    service: initialService,
    package: initialPackage,
    eventDate: '',
    city: initialCity,
    venue: '',
    eventDetails: '',
    expectedGuests: '',
    budgetRange: '₹50,000 - ₹1,00,000',
    instagramHandle: '',
    additionalRequirements: '',
  });

  useEffect(() => {
    const s = urlParams.get('service');
    const p = urlParams.get('package');
    const c = urlParams.get('city');
    if (s || p || c) {
      setFormData((prev) => ({
        ...prev,
        ...(s ? { service: s } : {}),
        ...(p ? { package: p } : {}),
        ...(c ? { city: c } : {}),
      }));
    }
  }, [urlParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      error('Name required', 'Please provide your full name.');
      return;
    }
    if (!formData.phone.trim()) {
      error('Phone required', 'Please provide a contact phone or WhatsApp number.');
      return;
    }
    if (!formData.email.trim()) {
      error('Email required', 'Please provide an email address for confirmations.');
      return;
    }
    if (!formData.eventDate) {
      error('Date required', 'Please select your intended event date.');
      return;
    }
    if (!formData.venue.trim()) {
      error('Venue required', 'Please specify the venue or location.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createBooking({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        package: formData.package || undefined,
        eventDate: formData.eventDate,
        city: formData.city,
        venue: formData.venue,
        eventDetails: formData.eventDetails || `Inquiry for ${formData.service}`,
        expectedGuests: formData.expectedGuests || undefined,
        budgetRange: formData.budgetRange,
        instagramHandle: formData.instagramHandle || undefined,
        additionalRequirements: formData.additionalRequirements || undefined,
      });

      if (res.booking) {
        // Navigate to booking success page with created booking data stored in sessionStorage
        sessionStorage.setItem('last_booking', JSON.stringify(res.booking));
        navigate('/booking-success');
      }
    } catch (err: any) {
      error('Booking Submission Failed', err.message || 'Please check your connection or contact us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>RESERVE PRODUCTION CALENDAR</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white leading-tight">
            BOOK A SHOOT WITH LEOX.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            Fill out the event specifics below. We verify calendar availability and reach out within 6 hours with confirmation and customized shot list breakdown.
          </p>
        </div>

        {/* Booking Form Card */}
        <div className="rounded-3xl bg-[#111218] border border-[#222432] p-6 sm:p-12 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Personal / Contact Info */}
            <div>
              <h3 className="text-base font-heading font-bold text-white mb-4 pb-2 border-b border-[#20222f] flex items-center gap-2">
                <span className="text-[#E50914]">01.</span> Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sravan & Ananya"
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98490 12345"
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Instagram Handle (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.instagramHandle}
                    onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                    placeholder="@your_instagram_handle"
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Event Details */}
            <div>
              <h3 className="text-base font-heading font-bold text-white mb-4 pb-2 border-b border-[#20222f] flex items-center gap-2">
                <span className="text-[#E50914]">02.</span> Event & Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Service Required *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  >
                    {services.map((s) => (
                      <option key={s.id || s._id} value={s.serviceName}>
                        {s.serviceName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Package Selection (Optional)
                  </label>
                  <select
                    value={formData.package}
                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  >
                    <option value="">Custom / Undecided</option>
                    {packages.map((p) => (
                      <option key={p.id || p._id} value={p.packageName}>
                        {p.packageName} ({p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    City / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Vijayawada, Hyderabad, Goa"
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Venue Name / Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Novotel Varun Beach / A Convention Centre"
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Scope & Extras */}
            <div>
              <h3 className="text-base font-heading font-bold text-white mb-4 pb-2 border-b border-[#20222f] flex items-center gap-2">
                <span className="text-[#E50914]">03.</span> Scope & Vision
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Expected Guest Count
                  </label>
                  <input
                    type="text"
                    value={formData.expectedGuests}
                    onChange={(e) => setFormData({ ...formData, expectedGuests: e.target.value })}
                    placeholder="e.g. 200 - 500 Guests"
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Budget Range
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  >
                    <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                    <option value="₹2,50,000+">₹2,50,000+ (Luxury / Multi-Day)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Event Vision & Schedule Highlights
                  </label>
                  <textarea
                    rows={3}
                    value={formData.eventDetails}
                    onChange={(e) => setFormData({ ...formData, eventDetails: e.target.value })}
                    placeholder="Tell us about the timeline, key ceremonies, planned dances, entry themes, or aesthetic references..."
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Special Deliverables (Drone, 24-hr Reels, Multi-Camera, Album)
                  </label>
                  <input
                    type="text"
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                    placeholder="e.g. 4K Drone aerials, 3 Instagram Reels, Coffee table photo book"
                    className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-6 border-t border-[#20222f] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero advance required to submit inquiry. Calendar locks after creative review.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                id="submit-booking-btn"
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-xl shadow-[#E50914]/30 flex items-center justify-center gap-2.5 disabled:opacity-50 hover:-translate-y-0.5"
              >
                {submitting ? (
                  <span>CONFIRMING CALENDAR...</span>
                ) : (
                  <>
                    <span>SUBMIT BOOKING REQUEST</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
