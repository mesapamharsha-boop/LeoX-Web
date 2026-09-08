import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Instagram, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      error('Missing fields', 'Please provide your name, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      await api.sendMessage(formData);
      success('Message Dispatched!', 'Harsha will get in touch with you shortly.');
      setSent(true);
    } catch (err: any) {
      error('Failed to send message', err.message || 'Please reach out via email or WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>CONNECT WITH THE STUDIO</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white leading-tight">
            GET IN TOUCH.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
            Whether you have a confirmed event date or need creative advice for an upcoming shoot, we're ready to listen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-[#111218] border border-[#222432] space-y-6 shadow-2xl">
              <h3 className="text-xl font-heading font-bold text-white">
                Direct Contact
              </h3>

              <div className="space-y-4 text-sm">
                <a
                  href="mailto:mesapamharsha@gmail.com"
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#171822] hover:bg-[#1d1f2b] text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Email Director</div>
                    <div className="text-sm font-semibold text-white mt-0.5">mesapamharsha@gmail.com</div>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/leox_shoots/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#171822] hover:bg-[#1d1f2b] text-gray-300 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Instagram DM</div>
                    <div className="text-sm font-semibold text-white mt-0.5">@leox_shoots</div>
                  </div>
                </a>

                <a
                  href="https://wa.me/919849000000?text=Hi%20Harsha,%20I%20would%20like%20to%20inquire%20about%20a%20shoot%20with%20LEOX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#102418] hover:bg-[#153020] border border-emerald-500/30 text-gray-200 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">Instant Chat</div>
                    <div className="text-sm font-semibold text-white mt-0.5">Chat on WhatsApp</div>
                  </div>
                </a>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#171822] text-gray-300">
                  <MapPin className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Base Studios</div>
                    <div className="text-sm font-semibold text-white mt-0.5">Vijayawada &bull; Hyderabad</div>
                    <div className="text-xs text-gray-400">Available across all of India & International Destinations</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0f15] border border-[#1d1f2b]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#E50914] mb-1">Planning a shoot?</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                If you already have your event date and venue ready, use our full booking form to check calendar availability directly.
              </p>
              <button
                onClick={() => navigate('/book')}
                className="mt-4 w-full py-2.5 rounded-lg bg-[#E50914]/20 hover:bg-[#E50914] text-[#FF4D55] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Go to Direct Booking Portal &rarr;
              </button>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#111218] border border-[#222432] shadow-2xl">
              {sent ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-gray-300 max-w-md mx-auto">
                    Thank you for reaching out to LEOX. Harsha reviews every inquiry personally and will respond within 12 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold uppercase tracking-wider mt-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-heading font-bold text-white mb-4">
                    Send Studio Message
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
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
                        placeholder="rahul@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Wedding inquiry in Hyderabad"
                        className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Event Details / Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your event dates, city, venue, and what style of photography/videography you're envisioning..."
                      className="w-full px-4 py-3 rounded-xl bg-[#171822] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-xl shadow-[#E50914]/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>DISPATCHING...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND INQUIRY TO HARSHA</span>
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
