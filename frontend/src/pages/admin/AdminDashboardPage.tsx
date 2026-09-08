import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  Booking,
  Inquiry,
  PortfolioProject,
  Reel,
  Service,
  Package,
  Testimonial,
  SiteSettings,
  AnalyticsData,
} from '../../types';
import { Logo } from '../../components/common/Logo';
import { Modal } from '../../components/common/Modal';
import {
  LayoutDashboard,
  CalendarCheck,
  Inbox,
  Film,
  Play,
  Layers,
  Sparkles,
  MessageSquare,
  Settings,
  KeyRound,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  Users,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

type TabType =
  | 'overview'
  | 'bookings'
  | 'inquiries'
  | 'portfolio'
  | 'reels'
  | 'services'
  | 'packages'
  | 'testimonials'
  | 'settings'
  | 'security';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { admin, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Filter & Search states
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('ALL');
  const [bookingSearch, setBookingSearch] = useState<string>('');

  // Modals
  const [activeBookingModal, setActiveBookingModal] = useState<Booking | null>(null);
  const [activeInquiryModal, setActiveInquiryModal] = useState<Inquiry | null>(null);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<PortfolioProject> | null>(null);
  const [reelModalOpen, setReelModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<Partial<Reel> | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<Package> | null>(null);
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);

  // Security password state
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passSubmitting, setPassSubmitting] = useState(false);

  // Protect Admin route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load all CMS collections
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        analyticsRes,
        bookingsRes,
        inquiriesRes,
        portfolioRes,
        reelsRes,
        servicesRes,
        packagesRes,
        testimonialsRes,
        settingsRes,
      ] = await Promise.all([
        api.getAnalytics().catch(() => null),
        api.getBookings(),
        api.getInquiries(),
        api.getPortfolio({ all: true }),
        api.getReels({ all: true }),
        api.getServices({ all: true }),
        api.getPackages({ all: true }),
        api.getTestimonials({ all: true }),
        api.getSettings(),
      ]);

      if (analyticsRes?.analytics) setAnalytics(analyticsRes.analytics);
      if (bookingsRes?.bookings) setBookings(bookingsRes.bookings);
      if (inquiriesRes?.inquiries) setInquiries(inquiriesRes.inquiries);
      if (portfolioRes?.projects) setPortfolio(portfolioRes.projects);
      if (reelsRes?.reels) setReels(reelsRes.reels);
      if (servicesRes?.services) setServices(servicesRes.services);
      if (packagesRes?.packages) setPackages(packagesRes.packages);
      if (testimonialsRes?.testimonials) setTestimonials(testimonialsRes.testimonials);
      if (settingsRes?.settings) setSiteSettings(settingsRes.settings);
    } catch (err: any) {
      error('Failed to load admin data', err.message);
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated, loadAllData]);

  // ---------------- BOOKINGS HANDLERS ----------------
  const handleUpdateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      const res = await api.updateBooking(id, { status });
      setBookings((prev) => prev.map((b) => (b.id === id ? res.booking : b)));
      if (activeBookingModal && activeBookingModal.id === id) {
        setActiveBookingModal(res.booking);
      }
      success('Booking Updated', `Status changed to ${status}`);
    } catch (err: any) {
      error('Failed to update booking', err.message);
    }
  };

  const handleUpdateBookingNotes = async (id: string, notes: string) => {
    try {
      const res = await api.updateBooking(id, { internalNotes: notes });
      setBookings((prev) => prev.map((b) => (b.id === id ? res.booking : b)));
      if (activeBookingModal && activeBookingModal.id === id) {
        setActiveBookingModal(res.booking);
      }
      success('Internal Notes Saved');
    } catch (err: any) {
      error('Failed to save notes', err.message);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking?')) return;
    try {
      await api.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setActiveBookingModal(null);
      success('Booking Removed');
    } catch (err: any) {
      error('Delete failed', err.message);
    }
  };

  // ---------------- INQUIRIES HANDLERS ----------------
  const handleUpdateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      const res = await api.updateInquiry(id, { status });
      setInquiries((prev) => prev.map((i) => (i.id === id ? res.inquiry : i)));
      if (activeInquiryModal && activeInquiryModal.id === id) {
        setActiveInquiryModal(res.inquiry);
      }
      success('Inquiry Updated', `Status marked as ${status}`);
    } catch (err: any) {
      error('Update failed', err.message);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await api.deleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      setActiveInquiryModal(null);
      success('Inquiry Deleted');
    } catch (err: any) {
      error('Delete failed', err.message);
    }
  };

  // ---------------- PORTFOLIO CMS HANDLERS ----------------
  const handleSavePortfolioProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.category) {
      error('Title and category required');
      return;
    }
    try {
      if (editingProject.id) {
        const res = await api.updatePortfolio(editingProject.id, editingProject);
        setPortfolio((prev) => prev.map((p) => (p.id === editingProject.id ? res.project : p)));
        success('Project Updated Successfully');
      } else {
        const res = await api.createPortfolio(editingProject);
        setPortfolio((prev) => [res.project, ...prev]);
        success('Project Added to Archive');
      }
      setPortfolioModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      error('Failed to save project', err.message);
    }
  };

  const handleDeletePortfolioProject = async (id: string) => {
    if (!window.confirm('Permanently remove this project from portfolio?')) return;
    try {
      await api.deletePortfolio(id);
      setPortfolio((prev) => prev.filter((p) => p.id !== id));
      success('Project Deleted');
    } catch (err: any) {
      error('Failed to delete project', err.message);
    }
  };

  // ---------------- REELS CMS HANDLERS ----------------
  const handleSaveReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReel?.title || !editingReel?.thumbnail) {
      error('Title and thumbnail required');
      return;
    }
    try {
      if (editingReel.id) {
        const res = await api.updateReel(editingReel.id, editingReel);
        setReels((prev) => prev.map((r) => (r.id === editingReel.id ? res.reel : r)));
        success('Reel Updated');
      } else {
        const res = await api.createReel(editingReel);
        setReels((prev) => [res.reel, ...prev]);
        success('Reel Added');
      }
      setReelModalOpen(false);
      setEditingReel(null);
    } catch (err: any) {
      error('Failed to save reel', err.message);
    }
  };

  const handleDeleteReel = async (id: string) => {
    if (!window.confirm('Delete this reel?')) return;
    try {
      await api.deleteReel(id);
      setReels((prev) => prev.filter((r) => r.id !== id));
      success('Reel Deleted');
    } catch (err: any) {
      error('Failed to delete reel', err.message);
    }
  };

  // ---------------- SERVICES CMS HANDLERS ----------------
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.serviceName) {
      error('Service name required');
      return;
    }
    try {
      if (editingService.id) {
        const res = await api.updateService(editingService.id, editingService);
        setServices((prev) => prev.map((s) => (s.id === editingService.id ? res.service : s)));
        success('Service Updated');
      } else {
        const res = await api.createService(editingService);
        setServices((prev) => [...prev, res.service]);
        success('Service Created');
      }
      setServiceModalOpen(false);
      setEditingService(null);
    } catch (err: any) {
      error('Failed to save service', err.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      success('Service Deleted');
    } catch (err: any) {
      error('Failed to delete service', err.message);
    }
  };

  // ---------------- PACKAGES CMS HANDLERS ----------------
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage?.packageName || !editingPackage?.price) {
      error('Package name and price required');
      return;
    }
    try {
      if (editingPackage.id) {
        const res = await api.updatePackage(editingPackage.id, editingPackage);
        setPackages((prev) => prev.map((p) => (p.id === editingPackage.id ? res.package : p)));
        success('Package Updated');
      } else {
        const res = await api.createPackage(editingPackage);
        setPackages((prev) => [...prev, res.package]);
        success('Package Created');
      }
      setPackageModalOpen(false);
      setEditingPackage(null);
    } catch (err: any) {
      error('Failed to save package', err.message);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await api.deletePackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
      success('Package Deleted');
    } catch (err: any) {
      error('Failed to delete package', err.message);
    }
  };

  // ---------------- TESTIMONIALS CMS HANDLERS ----------------
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.customerName || !editingTestimonial?.review) {
      error('Customer name and review required');
      return;
    }
    try {
      if (editingTestimonial.id) {
        const res = await api.updateTestimonial(editingTestimonial.id, editingTestimonial);
        setTestimonials((prev) => prev.map((t) => (t.id === editingTestimonial.id ? res.testimonial : t)));
        success('Review Updated');
      } else {
        const res = await api.createTestimonial(editingTestimonial);
        setTestimonials((prev) => [...prev, res.testimonial]);
        success('Review Added');
      }
      setTestimonialModalOpen(false);
      setEditingTestimonial(null);
    } catch (err: any) {
      error('Failed to save review', err.message);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      success('Review Deleted');
    } catch (err: any) {
      error('Failed to delete review', err.message);
    }
  };

  // ---------------- SETTINGS HANDLER ----------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    try {
      const res = await api.updateSettings(siteSettings);
      setSiteSettings(res.settings);
      success('Settings Updated Successfully');
    } catch (err: any) {
      error('Failed to update settings', err.message);
    }
  };

  // ---------------- SECURITY PASSWORD HANDLER ----------------
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      error('Mismatch', 'New password and confirmation do not match.');
      return;
    }
    if (passData.newPassword.length < 6) {
      error('Weak Password', 'New password must be at least 6 characters.');
      return;
    }
    setPassSubmitting(true);
    try {
      await api.changePassword({
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      success('Security Updated', 'Password successfully changed.');
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      error('Password Change Failed', err.message || 'Current password was incorrect.');
    } finally {
      setPassSubmitting(false);
    }
  };

  // Navigation tabs config
  const navTabs: Array<{ id: TabType; label: string; icon: any; count?: number }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, count: bookings.filter((b) => b.status === 'NEW').length },
    { id: 'inquiries', label: 'Inquiries', icon: Inbox, count: inquiries.filter((i) => i.status === 'NEW').length },
    { id: 'portfolio', label: 'Portfolio CMS', icon: Film, count: portfolio.length },
    { id: 'reels', label: 'Reels CMS', icon: Play, count: reels.length },
    { id: 'services', label: 'Services CMS', icon: Layers },
    { id: 'packages', label: 'Packages CMS', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'security', label: 'Security & Auth', icon: KeyRound },
  ];

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchStatus = bookingFilterStatus === 'ALL' || b.status === bookingFilterStatus;
    const query = bookingSearch.trim().toLowerCase();
    const matchSearch =
      !query ||
      b.fullName.toLowerCase().includes(query) ||
      b.phone.includes(query) ||
      b.city.toLowerCase().includes(query) ||
      b.service.toLowerCase().includes(query) ||
      b.venue.toLowerCase().includes(query);
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#07080b] flex text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d0e14] border-r border-[#1a1c26] flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-5 space-y-6">
          {/* Brand Header */}
          <div className="space-y-1">
            <Logo size="md" onClick={() => navigate('/')} />
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#E50914] pt-1">
              DIRECTOR CONTROL CMS
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/25'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {Boolean(tab.count) && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isActive ? 'bg-black/40 text-white' : 'bg-[#E50914]/20 text-[#FF4D55]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & quick links footer */}
        <div className="p-4 border-t border-[#1a1c26] space-y-3 bg-[#0a0b10]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E50914]/20 text-[#FF3842] flex items-center justify-center font-bold text-xs border border-[#E50914]/40">
              MSH
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{admin?.name || 'Mesapam Sri Harsha'}</div>
              <div className="text-[10px] text-gray-400 truncate">{admin?.email || 'harsha@leox'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => navigate('/')}
              className="px-2 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-medium text-gray-300 hover:text-white flex items-center justify-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Public Site</span>
            </button>

            <button
              onClick={logout}
              className="px-2 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-[11px] font-medium text-red-300 hover:text-red-200 flex items-center justify-center gap-1 transition-colors border border-red-800/30"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#1a1c26] bg-[#0a0b10] px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Tab Switcher */}
            <div className="md:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as TabType)}
                className="bg-[#151622] border border-[#27293a] text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                {navTabs.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <h1 className="text-base sm:text-lg font-heading font-bold text-white uppercase tracking-wider">
              {navTabs.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#E50914]' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingProject({
                  title: '',
                  category: 'Reels',
                  city: 'Vijayawada',
                  venue: '',
                  eventDate: new Date().toISOString().split('T')[0],
                  coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
                  galleryImages: [],
                  description: '',
                  featured: true,
                  published: true,
                });
                setPortfolioModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          </div>
        </header>

        {/* Dynamic Body based on Active Tab */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          {/* ===================== OVERVIEW TAB ===================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Analytics Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] shadow-xl">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider">Total Bookings</span>
                    <CalendarCheck className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div className="text-3xl font-heading font-extrabold text-white">
                    {analytics?.totalBookings ?? bookings.length}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Active event pipeline</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] shadow-xl">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider">New Inquiries</span>
                    <Inbox className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-heading font-extrabold text-white">
                    {inquiries.filter((i) => i.status === 'NEW').length}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2">
                    Awaiting response
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] shadow-xl">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider">Conversion Rate</span>
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-heading font-extrabold text-white">
                    {analytics?.conversionRate ? `${analytics.conversionRate}%` : '78%'}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2">
                    Inquiry to confirmed shoot
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] shadow-xl">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider">Top Category</span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-heading font-bold text-white truncate mt-1">
                    {analytics?.mostRequestedService || 'Instagram Reels'}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2">
                    Most requested in 2026
                  </div>
                </div>
              </div>

              {/* Recent Bookings Queue */}
              <div className="rounded-2xl bg-[#111218] border border-[#20222e] overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#1e202c] flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-heading font-bold text-white">
                      Recent Booking Requests
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Review incoming client events and verify crew scheduling
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold uppercase tracking-wider text-[#E50914] hover:underline"
                  >
                    View All Bookings &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#161722] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#212332]">
                      <tr>
                        <th className="px-6 py-3.5">Client</th>
                        <th className="px-6 py-3.5">Service</th>
                        <th className="px-6 py-3.5">Event Date</th>
                        <th className="px-6 py-3.5">Location</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e202c]">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{b.fullName}</div>
                            <div className="text-gray-400">{b.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-300 font-medium">{b.service}</td>
                          <td className="px-6 py-4 text-gray-300">{b.eventDate}</td>
                          <td className="px-6 py-4 text-gray-400">
                            {b.city} &bull; {b.venue}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                b.status === 'NEW'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : b.status === 'CONFIRMED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : b.status === 'COMPLETED'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-gray-500/20 text-gray-300'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setActiveBookingModal(b)}
                              className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-[#E50914] text-white text-[11px] font-semibold transition-colors"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== BOOKINGS TAB ===================== */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#111218] border border-[#20222e]">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search client name, phone, city, or venue..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#171824] border border-[#282a3c] text-xs text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Filter Status:</span>
                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="bg-[#171824] border border-[#282a3c] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="ALL">All Statuses ({bookings.length})</option>
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="rounded-2xl bg-[#111218] border border-[#20222e] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#161722] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#212332]">
                      <tr>
                        <th className="px-6 py-3.5">Ref ID</th>
                        <th className="px-6 py-3.5">Client Details</th>
                        <th className="px-6 py-3.5">Service & Package</th>
                        <th className="px-6 py-3.5">Event Date</th>
                        <th className="px-6 py-3.5">Location</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e202c]">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-mono text-gray-400">{b.id}</td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{b.fullName}</div>
                            <div className="text-gray-400">{b.phone} &bull; {b.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-200 font-medium">{b.service}</div>
                            {b.package && <div className="text-[11px] text-[#FF4D55]">{b.package}</div>}
                          </td>
                          <td className="px-6 py-4 text-gray-300">{b.eventDate}</td>
                          <td className="px-6 py-4 text-gray-400">
                            {b.city} &bull; {b.venue}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as Booking['status'])}
                              className="bg-[#161722] border border-[#262837] text-white text-[11px] rounded-md px-2 py-1 font-semibold focus:outline-none"
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => setActiveBookingModal(b)}
                              className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-[#E50914] text-white font-semibold transition-colors"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                              title="Delete booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            No bookings matching criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== INQUIRIES TAB ===================== */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] hover:border-[#E50914]/50 transition-all flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                            inq.status === 'NEW'
                              ? 'bg-blue-500/20 text-blue-300'
                              : inq.status === 'REPLIED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}
                        >
                          {inq.status}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-base font-heading font-bold text-white">{inq.name}</h4>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {inq.email} &bull; {inq.phone}
                      </div>

                      <div className="mt-4 p-3 rounded-xl bg-[#171822] text-xs text-gray-300 leading-relaxed italic line-clamp-4">
                        "{inq.message}"
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#1e202c] flex items-center justify-between">
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                        className="bg-[#171822] border border-[#282a3c] text-xs text-white rounded-lg px-2 py-1"
                      >
                        <option value="NEW">NEW</option>
                        <option value="READ">READ</option>
                        <option value="REPLIED">REPLIED</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>

                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${inq.email}?subject=Regarding%20your%20LEOX%20Shoot%20Inquiry`}
                          className="px-2.5 py-1 rounded-lg bg-[#E50914]/20 hover:bg-[#E50914] text-[#FF4D55] hover:text-white text-xs font-semibold transition-colors"
                        >
                          Reply
                        </a>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500">
                    No inquiries recorded in database.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== PORTFOLIO CMS TAB ===================== */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  Manage projects displayed on the public portfolio page and homepage archive.
                </p>
                <button
                  onClick={() => {
                    setEditingProject({
                      title: '',
                      category: 'Reels',
                      city: 'Vijayawada',
                      venue: '',
                      eventDate: new Date().toISOString().split('T')[0],
                      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
                      galleryImages: [],
                      description: '',
                      featured: true,
                      published: true,
                    });
                    setPortfolioModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-[#111218] border border-[#20222e] overflow-hidden flex flex-col justify-between shadow-xl group"
                  >
                    <div className="relative aspect-video bg-[#171822]">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#E50914] text-[10px] font-extrabold uppercase text-white">
                        {p.category}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base font-heading font-bold text-white mb-1">{p.title}</h4>
                        <div className="text-xs text-gray-400">
                          {p.city} &bull; {p.venue} &bull; {p.eventDate}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#1e202c] flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {p.featured && <span className="text-[#E50914] font-bold">Featured</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProject(p);
                              setPortfolioModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePortfolioProject(p.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== REELS CMS TAB ===================== */}
          {activeTab === 'reels' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  Manage 9:16 vertical reels displayed across the public feed.
                </p>
                <button
                  onClick={() => {
                    setEditingReel({
                      title: '',
                      eventName: '',
                      city: 'Vijayawada',
                      venue: '',
                      eventDate: new Date().toISOString().split('T')[0],
                      thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
                      instagramUrl: 'https://www.instagram.com/leox_shoots/',
                      views: '125K Views',
                      featured: true,
                      published: true,
                    });
                    setReelModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Reel</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {reels.map((r) => (
                  <div
                    key={r.id}
                    className="relative rounded-2xl overflow-hidden bg-[#111218] border border-[#20222e] aspect-[9/16] flex flex-col justify-between p-3 group shadow-xl"
                  >
                    <img src={r.thumbnail} alt={r.title} className="absolute inset-0 w-full h-full object-cover brightness-75" />
                    <div className="relative z-10 flex justify-between items-center text-[10px] text-white font-bold">
                      <span className="px-2 py-0.5 rounded bg-black/60">{r.views}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingReel(r);
                            setReelModalOpen(true);
                          }}
                          className="p-1 rounded bg-black/60 hover:bg-[#E50914]"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteReel(r.id)}
                          className="p-1 rounded bg-black/60 hover:bg-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="relative z-10 text-white space-y-0.5">
                      <div className="text-[10px] uppercase text-[#FF4D55] font-bold truncate">{r.eventName}</div>
                      <div className="text-xs font-bold truncate">{r.title}</div>
                      <div className="text-[10px] text-gray-300">{r.city}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== SERVICES CMS TAB ===================== */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">Manage production service offerings and deliverables.</p>
                <button
                  onClick={() => {
                    setEditingService({
                      serviceName: '',
                      slug: '',
                      description: '',
                      startingPrice: '₹25,000',
                      duration: 'Full Day Coverage',
                      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
                      deliverables: ['Cinematic Color Grading', 'Raw Master Audio', 'Cloud Gallery'],
                      featured: true,
                      published: true,
                    });
                    setServiceModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E50914] text-white text-xs font-bold uppercase"
                >
                  Add Service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s) => (
                  <div key={s.id} className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-heading font-bold text-white">{s.serviceName}</h4>
                        <span className="text-xs font-bold text-[#E50914]">{s.startingPrice}</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">{s.description}</p>
                    </div>

                    <div className="pt-4 border-t border-[#1e202c] flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingService(s);
                          setServiceModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(s.id!)}
                        className="p-1 text-gray-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== PACKAGES CMS TAB ===================== */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">Manage curated client packages and prices.</p>
                <button
                  onClick={() => {
                    setEditingPackage({
                      packageName: '',
                      slug: '',
                      description: '',
                      price: '₹75,000',
                      duration: '1 Full Day Event',
                      includedServices: ['2 Cinema Cameras', '1 Drone Rig', '2 Instagram Reels'],
                      popular: false,
                      featured: true,
                      published: true,
                    });
                    setPackageModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E50914] text-white text-xs font-bold uppercase"
                >
                  Add Package
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] flex flex-col justify-between shadow-xl">
                    <div>
                      <h4 className="text-lg font-heading font-bold text-white">{pkg.packageName}</h4>
                      <div className="text-2xl font-black text-white mt-1">{pkg.price}</div>
                      <div className="text-xs text-gray-400 mt-1">{pkg.duration}</div>
                      <p className="text-xs text-gray-300 mt-3">{pkg.description}</p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-[#1e202c] flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingPackage(pkg);
                          setPackageModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-white/[0.06] text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id!)}
                        className="p-1 text-gray-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TESTIMONIALS CMS TAB ===================== */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">Manage client reviews and ratings.</p>
                <button
                  onClick={() => {
                    setEditingTestimonial({
                      customerName: '',
                      customerRole: 'Client',
                      eventType: 'Wedding',
                      review: '',
                      rating: 5,
                      published: true,
                    });
                    setTestimonialModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E50914] text-white text-xs font-bold uppercase"
                >
                  Add Review
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="text-sm font-bold text-white">{t.customerName}</div>
                      <div className="text-xs text-gray-400">{t.customerRole} &bull; {t.eventType}</div>
                      <p className="text-xs text-gray-300 mt-3 italic leading-relaxed">"{t.review}"</p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-[#1e202c] flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingTestimonial(t);
                          setTestimonialModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-white/[0.06] text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id!)}
                        className="p-1 text-gray-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== SETTINGS TAB ===================== */}
          {activeTab === 'settings' && siteSettings && (
            <div className="max-w-3xl space-y-6">
              <div className="p-8 rounded-2xl bg-[#111218] border border-[#20222e] shadow-xl">
                <h3 className="text-lg font-heading font-bold text-white mb-6">
                  Site & Business Settings
                </h3>

                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Business Brand Name
                      </label>
                      <input
                        type="text"
                        value={siteSettings.businessName}
                        onChange={(e) => setSiteSettings({ ...siteSettings, businessName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Director / Owner Name
                      </label>
                      <input
                        type="text"
                        value={siteSettings.ownerName}
                        onChange={(e) => setSiteSettings({ ...siteSettings, ownerName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Studio Notification Email
                      </label>
                      <input
                        type="email"
                        value={siteSettings.email}
                        onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Studio Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={siteSettings.phone}
                        onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Instagram Profile URL
                      </label>
                      <input
                        type="url"
                        value={siteSettings.instagramUrl}
                        onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="text"
                        value={siteSettings.whatsAppNumber}
                        onChange={(e) => setSiteSettings({ ...siteSettings, whatsAppNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Hero Headline
                    </label>
                    <input
                      type="text"
                      value={siteSettings.heroHeading}
                      onChange={(e) => setSiteSettings({ ...siteSettings, heroHeading: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Hero Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={siteSettings.heroSubheading}
                      onChange={(e) => setSiteSettings({ ...siteSettings, heroSubheading: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Save All Settings
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ===================== SECURITY TAB ===================== */}
          {activeTab === 'security' && (
            <div className="max-w-md space-y-6">
              <div className="p-8 rounded-2xl bg-[#111218] border border-[#20222e] shadow-xl">
                <h3 className="text-lg font-heading font-bold text-white mb-2">
                  Update Admin Password
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  Ensure strong credentials for production control access.
                </p>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={passData.currentPassword}
                      onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      New Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={passData.newPassword}
                      onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={passData.confirmPassword}
                      onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passSubmitting}
                    className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {passSubmitting ? 'UPDATING...' : 'CHANGE PASSWORD'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Booking Details Modal */}
      <Modal
        isOpen={Boolean(activeBookingModal)}
        onClose={() => setActiveBookingModal(null)}
        title={`Booking #${activeBookingModal?.id}`}
        maxWidth="2xl"
      >
        {activeBookingModal && (
          <div className="space-y-6 text-xs text-gray-300">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#161722]">
              <div>
                <span className="text-gray-400 block font-bold">Client Name</span>
                <span className="text-sm font-semibold text-white">{activeBookingModal.fullName}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold">Phone Number</span>
                <span className="text-sm font-semibold text-white">{activeBookingModal.phone}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold">Email</span>
                <span className="text-white">{activeBookingModal.email}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold">Instagram</span>
                <span className="text-white">{activeBookingModal.instagramHandle || 'N/A'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#161722]">
              <div>
                <span className="text-gray-400 block font-bold">Service Required</span>
                <span className="text-sm font-semibold text-white">{activeBookingModal.service}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold">Package</span>
                <span className="text-white">{activeBookingModal.package || 'Custom'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold">Event Date</span>
                <span className="text-sm font-semibold text-white">{activeBookingModal.eventDate}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold">Location</span>
                <span className="text-white">{activeBookingModal.city} &bull; {activeBookingModal.venue}</span>
              </div>
            </div>

            {activeBookingModal.eventDetails && (
              <div>
                <span className="text-gray-400 block font-bold mb-1">Event Vision / Notes:</span>
                <div className="p-3 rounded-lg bg-[#161722] text-white leading-relaxed">
                  {activeBookingModal.eventDetails}
                </div>
              </div>
            )}

            <div>
              <span className="text-gray-400 block font-bold mb-1">Internal Producer Notes:</span>
              <textarea
                rows={3}
                defaultValue={activeBookingModal.internalNotes || ''}
                onBlur={(e) => handleUpdateBookingNotes(activeBookingModal.id, e.target.value)}
                placeholder="Add private crew assignments, deposit status, or gear reservations..."
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div className="pt-4 border-t border-[#20222f] flex justify-between items-center">
              <select
                value={activeBookingModal.status}
                onChange={(e) => handleUpdateBookingStatus(activeBookingModal.id, e.target.value as Booking['status'])}
                className="bg-[#161722] border border-[#27293a] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <button
                onClick={() => handleDeleteBooking(activeBookingModal.id)}
                className="px-3 py-1.5 rounded-lg bg-red-900/40 text-red-300 hover:bg-red-900/80 font-bold"
              >
                Delete Booking
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Portfolio Edit Modal */}
      <Modal
        isOpen={portfolioModalOpen}
        onClose={() => setPortfolioModalOpen(false)}
        title={editingProject?.id ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
        maxWidth="2xl"
      >
        {editingProject && (
          <form onSubmit={handleSavePortfolioProject} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Category *</label>
                <select
                  value={editingProject.category || 'Reels'}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                >
                  <option value="Reels">Reels</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Festival">Festival</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={editingProject.city || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Venue *</label>
                <input
                  type="text"
                  required
                  value={editingProject.venue || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Event Date</label>
                <input
                  type="date"
                  value={editingProject.eventDate || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, eventDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingProject.coverImage || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Instagram Project URL</label>
                <input
                  type="url"
                  value={editingProject.instagramUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Project Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#20222f] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPortfolioModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/[0.06] text-white font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold"
              >
                Save Project
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Reels Edit Modal */}
      <Modal
        isOpen={reelModalOpen}
        onClose={() => setReelModalOpen(false)}
        title={editingReel?.id ? 'Edit Reel' : 'Add 9:16 Reel'}
        maxWidth="lg"
      >
        {editingReel && (
          <form onSubmit={handleSaveReel} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Reel Title *</label>
              <input
                type="text"
                required
                value={editingReel.title || ''}
                onChange={(e) => setEditingReel({ ...editingReel, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Event / Client Name *</label>
                <input
                  type="text"
                  required
                  value={editingReel.eventName || ''}
                  onChange={(e) => setEditingReel({ ...editingReel, eventName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={editingReel.city || ''}
                  onChange={(e) => setEditingReel({ ...editingReel, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Vertical Thumbnail URL (9:16) *</label>
              <input
                type="url"
                required
                value={editingReel.thumbnail || ''}
                onChange={(e) => setEditingReel({ ...editingReel, thumbnail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Instagram Reel URL *</label>
              <input
                type="url"
                required
                value={editingReel.instagramUrl || ''}
                onChange={(e) => setEditingReel({ ...editingReel, instagramUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Views Display Count (e.g. 180K Views)</label>
              <input
                type="text"
                value={editingReel.views || ''}
                onChange={(e) => setEditingReel({ ...editingReel, views: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>

            <div className="pt-4 border-t border-[#20222f] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReelModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/[0.06] text-white font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#E50914] text-white font-bold"
              >
                Save Reel
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Services Edit Modal */}
      <Modal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        title={editingService?.id ? 'Edit Service' : 'Add Service'}
        maxWidth="md"
      >
        {editingService && (
          <form onSubmit={handleSaveService} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Service Name *</label>
              <input
                type="text"
                required
                value={editingService.serviceName || ''}
                onChange={(e) => setEditingService({ ...editingService, serviceName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Starting Price *</label>
              <input
                type="text"
                required
                value={editingService.startingPrice || ''}
                onChange={(e) => setEditingService({ ...editingService, startingPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Image URL</label>
              <input
                type="url"
                value={editingService.image || ''}
                onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Description</label>
              <textarea
                rows={3}
                value={editingService.description || ''}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div className="pt-4 border-t border-[#20222f] flex justify-end gap-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#E50914] text-white font-bold"
              >
                Save Service
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Package Edit Modal */}
      <Modal
        isOpen={packageModalOpen}
        onClose={() => setPackageModalOpen(false)}
        title={editingPackage?.id ? 'Edit Package' : 'Add Package'}
        maxWidth="md"
      >
        {editingPackage && (
          <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Package Name *</label>
              <input
                type="text"
                required
                value={editingPackage.packageName || ''}
                onChange={(e) => setEditingPackage({ ...editingPackage, packageName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Price *</label>
              <input
                type="text"
                required
                value={editingPackage.price || ''}
                onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Duration</label>
              <input
                type="text"
                value={editingPackage.duration || ''}
                onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Short Description</label>
              <textarea
                rows={2}
                value={editingPackage.description || ''}
                onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div className="pt-4 border-t border-[#20222f] flex justify-end gap-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#E50914] text-white font-bold"
              >
                Save Package
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Testimonial Edit Modal */}
      <Modal
        isOpen={testimonialModalOpen}
        onClose={() => setTestimonialModalOpen(false)}
        title={editingTestimonial?.id ? 'Edit Review' : 'Add Review'}
        maxWidth="md"
      >
        {editingTestimonial && (
          <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={editingTestimonial.customerName || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, customerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Role / Event Type</label>
              <input
                type="text"
                value={editingTestimonial.eventType || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, eventType: e.target.value })}
                placeholder="e.g. Hyderabad Wedding"
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Client Review *</label>
              <textarea
                rows={3}
                required
                value={editingTestimonial.review || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, review: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div className="pt-4 border-t border-[#20222f] flex justify-end gap-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#E50914] text-white font-bold"
              >
                Save Review
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
