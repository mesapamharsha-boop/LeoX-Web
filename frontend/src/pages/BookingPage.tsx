import React, { useState, useEffect } from 'react';
import { Service, Package } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, Send, AlertCircle, CheckCircle2, Calendar, MapPin, Phone, Mail, Sparkles, Check, Clock, Film } from 'lucide-react';
import { DEFAULT_LEOX_PACKAGES } from './PackagesPage';
import {
  validateAndNormalizeCustomerWhatsApp,
  validateProviderWhatsAppNumber,
  PROVIDER_WHATSAPP_NUMBER,
} from '../config/whatsapp';

interface BookingPageProps {
  services: Service[];
  packages: Package[];
  navigate: (path: string, state?: any) => void;
  urlParams: URLSearchParams;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  service?: string;
  eventDate?: string;
  city?: string;
  venue?: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  services,
  packages,
  navigate,
  urlParams,
}) => {
  const { error, success } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);
  const [providerConfigError, setProviderConfigError] = useState<string | null>(() => {
    const check = validateProviderWhatsAppNumber();
    return check.isValid ? null : check.errorMessage || null;
  });

  // Read initial query params
  const initialService = urlParams.get('service') || (services[0]?.serviceName || 'Event Photography');
  const initialPackage = urlParams.get('package') || '';
  const initialCity = urlParams.get('city') || 'Vijayawada';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    instagramHandle: '',
    service: initialService,
    package: initialPackage,
    eventDate: '',
    city: initialCity,
    venue: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const availablePackages: Package[] = (packages && packages.length > 0) ? packages : DEFAULT_LEOX_PACKAGES;
  const selectedPackage = availablePackages.find(
    (p) => p.packageName.toLowerCase().trim() === (formData.package || '').toLowerCase().trim()
  );

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

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear inline error immediately upon typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): { isValid: boolean; normalizedPhone: string } => {
    const newErrors: FormErrors = {};

    // 1. Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    // 2. Phone / WhatsApp Number
    const phoneResult = validateAndNormalizeCustomerWhatsApp(formData.phone);
    if (!phoneResult.isValid) {
      newErrors.phone = phoneResult.errorMessage || 'Please enter a valid WhatsApp number.';
    }

    // 3. Email Address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // 4. Service Required
    if (!formData.service.trim()) {
      newErrors.service = 'Please select a service.';
    }

    // 5. Event Date
    if (!formData.eventDate.trim()) {
      newErrors.eventDate = 'Please select an event date.';
    }

    // 6. City / Location
    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city/location.';
    }

    // 7. Venue Name / Address
    if (!formData.venue.trim()) {
      newErrors.venue = 'Please enter the venue/address.';
    }

    setErrors(newErrors);

    return {
      isValid: Object.keys(newErrors).length === 0,
      normalizedPhone: phoneResult.normalized,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid } = validateForm();

    if (!isValid) {
      error('Form Incomplete', 'Please check the required fields marked below.');
      return;
    }

    // Validate the Provider's WhatsApp number.
    const providerCheck = validateProviderWhatsAppNumber();
    if (!providerCheck.isValid) {
      const errMsg = providerCheck.errorMessage || 'Provider WhatsApp number is incomplete or invalid.';
      setProviderConfigError(errMsg);
      error('Provider Number Incomplete', errMsg);
      return;
    }

    setSubmitting(true);
    setProviderConfigError(null);

    try {
      // Direct server-side submission:
      // 1. Records booking in database
      // 2. Triggers server-side WhatsApp Cloud API message to the configured provider WhatsApp number (+91 8374404536)
      // 3. Mirrors to unified inquiries inbox
      const response = await api.createBooking({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        service: formData.service,
        package: selectedPackage?.packageName || formData.package || undefined,
        eventDate: formData.eventDate,
        city: formData.city.trim(),
        venue: formData.venue.trim(),
        instagramHandle: formData.instagramHandle.trim() || undefined,
        eventDetails: selectedPackage
          ? `[Package: ${selectedPackage.packageName} (${selectedPackage.price}${selectedPackage.discount ? ` • ${selectedPackage.discount}` : ''})] Coverage: ${selectedPackage.coverage || selectedPackage.duration || 'Standard'}, Deliverables: ${selectedPackage.reelsCount || 'Edited Reels'}. Instant Reel Delivery.`
          : `Online booking request for ${formData.service} (${formData.package || 'Custom package'})`,
      });

      setSubmittedBooking(response.booking || {
        ...formData,
        id: `LX-${Date.now().toString().slice(-6)}`,
      });

      success(
        'Booking Request Submitted',
        'Your booking details have been recorded and automatically dispatched to our WhatsApp business desk.'
      );
    } catch (err: any) {
      console.error('[BookingSubmit] Error:', err);
      error(
        'Submission Failed',
        err?.message || 'Could not submit your booking. Please try again.'
      );
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
            Lock in your event dates with South India&apos;s premier cinematic production crew. Complete the details below to submit your booking request directly to our production desk.
          </p>
        </div>

        {/* Success Confirmation Screen */}
        {submittedBooking ? (
          <div className="rounded-3xl bg-[#111218] border border-[#232535] p-8 sm:p-12 shadow-2xl space-y-8 animate-fadeIn">
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                Booking Request Received!
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Thank you, <span className="text-white font-bold">{submittedBooking.fullName}</span>. Your event details have been recorded and dispatched to our production desk. Confirmation has been sent to your email. For immediate inquiries, reach us at{' '}
                <a href="mailto:leoxshoots@gmail.com" className="text-[#FF4D55] hover:underline font-semibold">
                  leoxshoots@gmail.com
                </a>.
              </p>
            </div>

            {/* Summary Ticket */}
            <div className="p-6 rounded-2xl bg-[#161722] border border-[#27293a] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#232535] gap-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">
                    Booking Reference
                  </span>
                  <span className="text-base font-mono font-bold text-white">
                    {submittedBooking.id || submittedBooking._id || 'LX-CONFIRMED'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Transmitted to WhatsApp Desk</span>
                </div>
              </div>

              {submittedBooking.package && (
                <div className="p-3.5 rounded-xl bg-[#7B182B]/15 border border-[#7B182B]/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF4D55]" />
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Selected Package</span>
                      <span className="text-white font-bold text-sm">{submittedBooking.package}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Instant Reel Delivery
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 font-bold block">Service</span>
                    <span className="text-white font-semibold">{submittedBooking.service}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 font-bold block">Event Date</span>
                    <span className="text-white font-semibold">{submittedBooking.eventDate}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 font-bold block">Location</span>
                    <span className="text-white font-semibold">
                      {submittedBooking.city} &bull; {submittedBooking.venue}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 font-bold block">Contact</span>
                    <span className="text-white font-semibold">{submittedBooking.phone}</span>
                    <span className="text-gray-400 text-[11px] block">{submittedBooking.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setSubmittedBooking(null);
                  setFormData({
                    fullName: '',
                    phone: '',
                    email: '',
                    instagramHandle: '',
                    service: services[0]?.serviceName || 'Event Photography',
                    package: '',
                    eventDate: '',
                    city: 'Vijayawada',
                    venue: '',
                  });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Book Another Shoot
              </button>

              <button
                type="button"
                onClick={() => navigate('/portfolio')}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#E50914]/30"
              >
                Explore Portfolio Archive
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form Card */
          <div className="rounded-3xl bg-[#111218] border border-[#222432] p-6 sm:p-12 shadow-2xl">
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
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
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="e.g. Sravan & Ananya"
                    className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                      errors.fullName
                        ? 'border-[#E50914] focus:border-[#FF4D55]'
                        : 'border-[#27293a] focus:border-[#E50914]'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 98490 12345"
                    className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                      errors.phone
                        ? 'border-[#E50914] focus:border-[#FF4D55]'
                        : 'border-[#27293a] focus:border-[#E50914]'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="yourname@gmail.com"
                    className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                      errors.email
                        ? 'border-[#E50914] focus:border-[#FF4D55]'
                        : 'border-[#27293a] focus:border-[#E50914]'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Instagram Handle (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.instagramHandle}
                    onChange={(e) => handleChange('instagramHandle', e.target.value)}
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
                    onChange={(e) => handleChange('service', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                      errors.service
                        ? 'border-[#E50914] focus:border-[#FF4D55]'
                        : 'border-[#27293a] focus:border-[#E50914]'
                    }`}
                  >
                    <option value="">Select a service...</option>
                    {services.map((s) => (
                      <option key={s.id || s._id} value={s.serviceName}>
                        {s.serviceName}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.service}</span>
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                      LEOX Package Selection
                    </label>
                    {formData.package && (
                      <button
                        type="button"
                        onClick={() => handleChange('package', '')}
                        className="text-[11px] text-gray-400 hover:text-white underline"
                      >
                        Clear Selection (Custom Request)
                      </button>
                    )}
                  </div>

                  {/* 4 Interactive Package Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {availablePackages.map((pkg) => {
                      const isSelected = (formData.package || '').toLowerCase().trim() === pkg.packageName.toLowerCase().trim();
                      return (
                        <button
                          key={pkg.id || pkg._id || pkg.packageName}
                          type="button"
                          onClick={() => handleChange('package', pkg.packageName)}
                          className={`p-3.5 rounded-xl text-left transition-all border relative flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#7B182B]/20 border-[#7B182B] shadow-lg shadow-[#7B182B]/25 ring-1 ring-[#7B182B]'
                              : 'bg-[#171822] border-[#27293a] hover:border-[#7B182B]/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              {pkg.badge ? (
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  pkg.badge === 'MOST POPULAR' ? 'bg-[#7B182B] text-white' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}>
                                  {pkg.badge}
                                </span>
                              ) : (
                                <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Standard</span>
                              )}
                              {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                            </div>

                            <div className="font-bold text-white text-sm">
                              {pkg.packageName}
                            </div>

                            <div className="flex items-baseline gap-1.5 mt-1">
                              <span className="text-base font-extrabold text-[#FF4D55]">{pkg.price}</span>
                              {pkg.originalPrice && (
                                <span className="text-[10px] text-gray-500 line-through">{pkg.originalPrice}</span>
                              )}
                              {pkg.discount && (
                                <span className="text-[9px] text-emerald-400 font-bold ml-auto">{pkg.discount}</span>
                              )}
                            </div>

                            <div className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500 shrink-0" />
                              <span className="truncate">{pkg.coverage || pkg.duration}</span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                              <Film className="w-3 h-3 text-gray-500 shrink-0" />
                              <span className="truncate">{pkg.reelsCount || '1 Edited Reel'}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Package Highlight Box */}
                  {selectedPackage ? (
                    <div className="p-4 rounded-xl bg-[#1c1318] border border-[#7B182B]/40 text-xs space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#7B182B]/20 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{selectedPackage.packageName}</span>
                          {selectedPackage.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-[#7B182B] text-white text-[10px] font-black">
                              {selectedPackage.badge}
                            </span>
                          )}
                          {selectedPackage.discount && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              {selectedPackage.discount}
                            </span>
                          )}
                        </div>
                        <div className="text-white font-black text-sm">
                          {selectedPackage.price}
                          {selectedPackage.originalPrice && (
                            <span className="ml-1.5 text-xs text-gray-400 line-through font-normal">
                              {selectedPackage.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#FF4D55]" />
                          <span>Coverage: <strong className="text-white">{selectedPackage.coverage || selectedPackage.duration}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-[#FF4D55]" />
                          <span>Deliverables: <strong className="text-white">{selectedPackage.reelsCount || '1 Reel'}</strong></span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Included Deliverables:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {(selectedPackage.includedServices || selectedPackage.features || []).map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-200">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 italic">
                      Click one of the 4 packages above, or choose from the dropdown below for custom bookings.
                    </div>
                  )}

                  {/* Fallback Dropdown */}
                  <select
                    value={formData.package}
                    onChange={(e) => handleChange('package', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914] transition-colors"
                  >
                    <option value="">Custom Package / Undecided</option>
                    {availablePackages.map((p) => (
                      <option key={p.id || p._id || p.packageName} value={p.packageName}>
                        {p.packageName} ({p.price}{p.discount ? ` - ${p.discount}` : ''})
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
                    onChange={(e) => handleChange('eventDate', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                      errors.eventDate
                        ? 'border-[#E50914] focus:border-[#FF4D55]'
                        : 'border-[#27293a] focus:border-[#E50914]'
                    }`}
                  />
                  {errors.eventDate && (
                    <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.eventDate}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    City / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="e.g. Vijayawada, Hyderabad, Goa"
                    className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                      errors.city
                        ? 'border-[#E50914] focus:border-[#FF4D55]'
                        : 'border-[#27293a] focus:border-[#E50914]'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Venue Name / Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => handleChange('venue', e.target.value)}
                    placeholder="e.g. Novotel Varun Beach / A Convention Centre"
                    className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                      errors.venue
                        ? 'border-[#E50914] focus:border-[#FF4D55]'
                        : 'border-[#27293a] focus:border-[#E50914]'
                    }`}
                  />
                  {errors.venue && (
                    <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.venue}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Provider WhatsApp Configuration Notice */}
            {providerConfigError && (
              <div className="p-4 rounded-2xl bg-[#1c1214] border border-[#ff4d55]/40 flex items-start gap-3 text-xs text-gray-300">
                <AlertCircle className="w-4 h-4 text-[#FF4D55] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#FF4D55] mb-1">Provider WhatsApp Verification Notice</p>
                  <p>{providerConfigError}</p>
                  <p className="mt-1 text-gray-400">
                    Configured constant: <code className="text-gray-200 bg-[#2b191c] px-1.5 py-0.5 rounded">{PROVIDER_WHATSAPP_NUMBER}</code>
                  </p>
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="pt-6 border-t border-[#20222f] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero advance required. Instant server-to-server WhatsApp delivery.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                id="submit-booking-btn"
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-xl shadow-[#E50914]/30 flex items-center justify-center gap-2.5 disabled:opacity-50 hover:-translate-y-0.5 cursor-pointer"
              >
                {submitting ? (
                  <span>SUBMITTING BOOKING...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT BOOKING REQUEST</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  );
};

