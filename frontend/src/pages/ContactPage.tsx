import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Instagram, MessageCircle, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { getWhatsAppUrl, formatWhatsAppDisplayNumber } from '../config/whatsapp';
import { SiteSettings } from '../types';

interface ContactPageProps {
  navigate: (path: string) => void;
  settings?: SiteSettings | null;
}

const SERVICE_OPTIONS = [
  'Event / Wedding Cinematography',
  'Instagram Reels & Short-Form Pacing',
  'Personal Branding & Executive Portraits',
  'Commercial & Brand Campaign Films',
  'Fashion & Editorial Magazine Lookbook',
  'Music Video & Live Stage Coverage',
  'Other Custom Shoot / Multi-Day Project',
];

export const ContactPage: React.FC<ContactPageProps> = ({ navigate, settings }) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Event / Wedding Cinematography',
    subject: '',
    message: '',
  });

  const email = settings?.email || 'leoxshoots@gmail.com';
  const whatsAppNumber = settings?.whatsAppNumber;
  const whatsappUrl = whatsAppNumber
    ? `https://wa.me/${whatsAppNumber.replace(/\D/g, '')}`
    : getWhatsAppUrl();
  const whatsappDisplay = whatsAppNumber || formatWhatsAppDisplayNumber();
  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/leox_shoots/';
  const address = settings?.address || 'Vijayawada • Hyderabad • Pan-India';

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = 'Please enter your full name.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your phone or WhatsApp number.';
    } else if (formData.phone.trim().length < 8) {
      errs.phone = 'Please provide a valid phone number (at least 8 digits).';
    }

    if (!formData.service) {
      errs.service = 'Please select a service or shoot type.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please share your event dates, city, and shoot details.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Please provide at least 10 characters describing your inquiry.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      error('Please check the form', 'Some required fields are missing or invalid.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.sendMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        subject: formData.subject.trim() || `${formData.service} Inquiry from ${formData.name}`,
        message: formData.message.trim(),
      });

      success(
        'Enquiry Received!',
        res.message || "Thank you! Your enquiry has been received. We'll get back to you shortly."
      );
      setSent(true);
    } catch (err: any) {
      error(
        'Failed to send enquiry',
        err.message || 'Please reach out via WhatsApp or email directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSent(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: 'Event / Wedding Cinematography',
      subject: '',
      message: '',
    });
    setFormErrors({});
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>CONNECT WITH LEOX STUDIO</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white leading-tight">
            GET IN TOUCH.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
            Whether you have a confirmed event date or need creative direction for an upcoming cinematic production, our studio team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-[#111218] border border-[#222432] space-y-6 shadow-2xl">
              <h3 className="text-xl font-heading font-bold text-white">
                Direct Contact Channels
              </h3>

              <div className="space-y-4 text-sm">
                {/* WhatsApp Chat Button */}
                <a
                  id="contact-whatsapp-link"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#0f1d14] hover:bg-[#14291c] border border-emerald-500/40 text-gray-200 transition-all duration-200 group shadow-lg shadow-emerald-950/40"
                  aria-label={`Chat with LEOX on WhatsApp at ${whatsappDisplay}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5 fill-current text-[#25D366]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                      <span>WhatsApp Direct Desk</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-base font-semibold text-white mt-0.5 group-hover:text-emerald-300 transition-colors">
                      Chat with LEOX
                    </div>
                    <div className="text-xs text-emerald-400 font-mono mt-0.5 font-medium">
                      {whatsappDisplay}
                    </div>
                  </div>
                </a>

                {/* Email Direct */}
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#171822] hover:bg-[#1d1f2b] border border-[#25283a] text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Studio Desk Email</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{email}</div>
                  </div>
                </a>

                {/* Instagram Direct */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#171822] hover:bg-[#1d1f2b] border border-[#25283a] text-gray-300 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Official Instagram DM</div>
                    <div className="text-sm font-semibold text-white mt-0.5">LEOX Shoots</div>
                  </div>
                </a>

                {/* Studio Hub */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#171822] border border-[#25283a] text-gray-300">
                  <MapPin className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Base Studios</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{address}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Available across all of India & International Destinations</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0f15] border border-[#1d1f2b]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#E50914] mb-1">Planning a shoot with dates?</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                If you already have your exact event schedule and venue set, book your crew directly through our multi-step booking portal.
              </p>
              <button
                onClick={() => navigate('/book')}
                className="mt-4 w-full py-2.5 rounded-lg bg-[#E50914]/15 hover:bg-[#E50914] text-[#FF4D55] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors border border-[#E50914]/30 hover:border-[#E50914]"
              >
                Go to Direct Booking Portal &rarr;
              </button>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#111218] border border-[#222432] shadow-2xl">
              {sent ? (
                <div className="py-12 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-heading font-extrabold text-white">
                      Enquiry Received!
                    </h3>
                    <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                      Thank you! Your enquiry has been received. We'll get back to you shortly.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#171822] border border-[#27293a] max-w-md mx-auto text-left text-xs text-gray-300 space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#E50914]">Submission Summary:</div>
                    <div><span className="text-gray-400 font-medium">Name:</span> <strong className="text-white">{formData.name}</strong></div>
                    <div><span className="text-gray-400 font-medium">Service:</span> <strong className="text-white">{formData.service}</strong></div>
                    <div><span className="text-gray-400 font-medium">Contact:</span> <strong className="text-white">{formData.email} &bull; {formData.phone}</strong></div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[#222432] pb-4 mb-2">
                    <h3 className="text-xl font-heading font-bold text-white">
                      Send Studio Enquiry
                    </h3>
                    <span className="text-[11px] text-gray-400">
                      * Required fields
                    </span>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                          formErrors.name ? 'border-[#E50914] ring-1 ring-[#E50914]' : 'border-[#27293a] focus:border-[#E50914]'
                        }`}
                      />
                      {formErrors.name && (
                        <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        placeholder="rahul@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                          formErrors.email ? 'border-[#E50914] ring-1 ring-[#E50914]' : 'border-[#27293a] focus:border-[#E50914]'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone and Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                          formErrors.phone ? 'border-[#E50914] ring-1 ring-[#E50914]' : 'border-[#27293a] focus:border-[#E50914]'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.phone}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Service / Type of Shoot *
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => handleFieldChange('service', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                          formErrors.service ? 'border-[#E50914] ring-1 ring-[#E50914]' : 'border-[#27293a] focus:border-[#E50914]'
                        }`}
                      >
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#111218] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                      {formErrors.service && (
                        <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.service}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Subject / Event Location
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleFieldChange('subject', e.target.value)}
                      placeholder="e.g. Wedding inquiry in Hyderabad / 3-day Celebration"
                      className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Message / Shoot Requirements *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      placeholder="Share your planned dates, venue, guest count, reel count, or specific visual styling preferences..."
                      className={`w-full px-4 py-3 rounded-xl bg-[#171822] border text-white text-sm focus:outline-none transition-colors ${
                        formErrors.message ? 'border-[#E50914] ring-1 ring-[#E50914]' : 'border-[#27293a] focus:border-[#E50914]'
                      }`}
                    />
                    {formErrors.message && (
                      <p className="mt-1.5 text-xs text-[#FF4D55] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{formErrors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-xl shadow-[#E50914]/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SENDING ENQUIRY...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND ENQUIRY TO LEOX</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
