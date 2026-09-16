import bcrypt from 'bcryptjs';
import {
  AdminModel,
  PortfolioModel,
  ReelModel,
  ServiceModel,
  PackageModel,
  TestimonialModel,
  SettingsModel,
  BookingModel,
  InquiryModel,
} from '../models/index';
import { dbManager } from '../database/db';

export async function seedDatabase() {
  console.log('[SEED] Starting LEOX database initialization...');

  // 1. Seed Admin
  const existingAdmins = await AdminModel.find();
  const rawPassword = process.env.ADMIN_PASSWORD || 'leoX@4536';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);

  const adminEmails = [
    (process.env.ADMIN_EMAIL || 'admin@leox').toLowerCase(),
    'producer@leox',
  ];

  for (const email of adminEmails) {
    const foundAdmin = existingAdmins.find(a => a.email.toLowerCase() === email);
    if (!foundAdmin) {
      await AdminModel.create({
        name: 'LEOX Director',
        email,
        password: hashedPassword,
        role: 'superadmin',
        lastLogin: new Date().toISOString(),
      });
      console.log(`[SEED] Admin account seeded: ${email}`);
    }
  }

  // 2. Seed Settings
  await SettingsModel.get();

  // 3. Seed Services
  const existingServices = await ServiceModel.find();
  if (existingServices.length === 0) {
    const initialServices = [
      {
        serviceName: 'Instagram Reels & Short-Form Content',
        slug: 'instagram-reels',
        description: 'High-octane, rhythm-synced vertical videos crafted specifically to dominate Instagram Algorithms and TikTok. Fast turnaround, trend audio integration, and 4K HDR quality.',
        startingPrice: '₹18,000',
        duration: 'Same-Day / 24-Hour Turnaround',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['3 to 8 Vertical 9:16 Reels', 'Sound Design & Color Grade', 'Same-Day Preview Clips', 'Optimized for Social Reach'],
        featured: true,
        published: true,
      },
      {
        serviceName: 'Event Photography',
        slug: 'event-photography',
        description: 'Cinematic stills capturing raw emotion, candid unscripted glances, and grand atmosphere. Shot on the latest iPhone Pro systems in 4K HDR.',
        startingPrice: '₹25,000',
        duration: 'Half-Day / Full-Day Coverage',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['200+ Master Color-Graded Photos', 'Cloud Private Gallery Access', 'High-Res Print Ready Files', 'Instant Sneak Peek Stills'],
        featured: true,
        published: true,
      },
      {
        serviceName: 'Event Videography',
        slug: 'event-videography',
        description: 'Motion picture storytelling with gimbal stabilization, cinematic drone visuals, and high-fidelity ambient sound capture. We turn your event into a theatrical movie.',
        startingPrice: '₹40,000',
        duration: 'Full Event Coverage',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['4K Cinematic Highlight Film (3-5 min)', 'Full Ceremony / Event Extended Cut', 'Licensed Score & Sound Mixing', 'Drone Aerial Footage'],
        featured: true,
        published: true,
      },
      {
        serviceName: 'Wedding & Celebration Content',
        slug: 'wedding-celebration-content',
        description: 'Complete celebration coverage tailored for modern couples. Dedicated reel creators alongside primary cameras so you never wait weeks to share moments.',
        startingPrice: '₹65,000',
        duration: 'Multi-Day / Single-Day Packages',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['On-Site Live Reel Deliveries', 'Teaser Reel in 12 Hours', 'Complete Traditional + Candid Coverage', 'Luxurious Photo Keepsake Album'],
        featured: true,
        published: true,
      },
      {
        serviceName: 'Personal Branding & Portraits',
        slug: 'personal-branding',
        description: 'Editorial-grade portraits, founder media kits, fitness aesthetics, and influencer identity shoots with dramatic lighting and contemporary styling.',
        startingPrice: '₹20,000',
        duration: '3-4 Hours Studio / Outdoor',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['30 High-End Magazine Retouched Images', 'Editorial Concept Consulting', 'Multiple Wardrobe Looks', 'LinkedIn & Press Kit Formats'],
        featured: false,
        published: true,
      },
      {
        serviceName: 'Creative Shoots & Commercial Media',
        slug: 'creative-commercial-shoots',
        description: 'Brand campaigns, luxury automobile launches, fashion lookbooks, and hospitality visual showcases produced with bespoke art direction.',
        startingPrice: '₹35,000',
        duration: 'Custom Production Schedule',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['Campaign Hero Video', 'Social Ad Cutdowns (9:16 & 1:1)', 'Commercial Licensing', 'Raw Footage Archive'],
        featured: false,
        published: true,
      },
    ];

    for (const s of initialServices) {
      await ServiceModel.create(s);
    }
    console.log('[SEED] Services initialized.');
  }

  // 4. Seed Packages
  const existingPackages = await PackageModel.find();
  if (existingPackages.length === 0) {
    const initialPackages = [
      {
        packageName: 'LEOX Elite',
        slug: 'leox-elite',
        description: 'Ideal for personal branding, quick portrait reels, and solo content sessions.',
        price: '₹1,599',
        originalPrice: '₹2,499',
        discount: '36% OFF',
        coverage: 'Up to 1 Hour',
        reelsCount: '1 Edited Reel',
        duration: 'Up to 1 Hour',
        includedServices: [
          'Up to 1 Hour On-Site Coverage',
          '1 High-Impact Edited Reel',
          'Instant Reel Delivery',
          'LEOX Branding Included',
          'Basic Color Grading & Audio Edit',
        ],
        badge: '',
        buttonText: 'Book LEOX Elite',
        featured: true,
        popular: false,
        published: true,
      },
      {
        packageName: 'LEOX Pro',
        slug: 'leox-pro',
        description: 'Perfect for couple shoots, boutique product launches, and celebratory events.',
        price: '₹2,999',
        originalPrice: '₹3,999',
        discount: '25% OFF',
        coverage: 'Up to 2.5 Hours',
        reelsCount: '2 Edited Reels',
        duration: 'Up to 2.5 Hours',
        includedServices: [
          'Up to 2.5 Hours On-Site Coverage',
          '2 High-Impact Edited Reels',
          'Instant Reel Delivery',
          'LEOX Branding Included',
          'Trending Music Sync & Color Grading',
        ],
        badge: '',
        buttonText: 'Book LEOX Pro',
        featured: true,
        popular: false,
        published: true,
      },
      {
        packageName: 'LEOX Pro+',
        slug: 'leox-pro-plus',
        description: 'Our top recommended package for luxury weddings, corporate summits, and high-energy gatherings.',
        price: '₹4,499',
        originalPrice: '₹5,999',
        discount: '25% OFF',
        coverage: 'Up to 3.5 Hours',
        reelsCount: '3 Edited Reels',
        duration: 'Up to 3.5 Hours',
        includedServices: [
          'Up to 3.5 Hours On-Site Coverage',
          '3 High-Impact Edited Reels',
          'Instant Reel Delivery',
          'LEOX Branding Included',
          'Priority On-Site Edit & Sync',
          'Shot on Latest iPhone',
        ],
        badge: 'MOST POPULAR',
        buttonText: 'Book LEOX Pro+',
        featured: true,
        popular: true,
        published: true,
      },
      {
        packageName: 'LEOX Max',
        slug: 'leox-max',
        description: 'Ultimate high-octane production with uncompressed RAW media dump and VIP priority turnaround.',
        price: '₹5,999',
        originalPrice: '₹7,999',
        discount: '25% OFF',
        coverage: 'Up to 4.5 Hours',
        reelsCount: '4 Edited Reels',
        duration: 'Up to 4.5 Hours',
        includedServices: [
          'Up to 4.5 Hours On-Site Coverage',
          '4 High-Impact Edited Reels',
          'Instant Reel Delivery',
          'RAW Video Footage Included',
          'LEOX Branding Included',
          'VIP Creator & Rush Delivery Queue',
        ],
        badge: 'RAW INCLUDED',
        buttonText: 'Book LEOX Max',
        featured: true,
        popular: false,
        published: true,
      },
    ];

    for (const p of initialPackages) {
      await PackageModel.create(p);
    }
    console.log('[SEED] Packages initialized with 4 LEOX packages.');
  }

  // 5. Seed Portfolio Projects (with CITY, VENUE, EVENT DATE)
  const existingPortfolio = await PortfolioModel.find();
  if (existingPortfolio.length === 0) {
    const initialPortfolio = [
      {
        title: 'The Royal Grandeur Wedding Gala',
        category: 'Wedding',
        description: 'An ethereal multi-day South Indian wedding celebration featuring royal ivory aesthetics, candlelit mandap styling, and electrifying sangeet choreography.',
        city: 'Vijayawada',
        venue: 'A Convention Centre, MG Road',
        eventDate: '2026-08-18',
        coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop',
        ],
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-ceremony-in-a-forest-43309-large.mp4',
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        featured: true,
        published: true,
        clientName: 'Aditya & Ananya',
      },
      {
        title: 'Neon Pulse Festival & EDM Night',
        category: 'Event',
        description: 'High-energy concert cinematography capturing 15,000 partygoers, pyrotechnics, heavy bass drops, and rapid-fire visual edits synchronized to the beat.',
        city: 'Hyderabad',
        venue: 'HITEX Exhibition Center, Hitec City',
        eventDate: '2026-07-24',
        coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
        ],
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-in-the-air-at-a-music-festival-43310-large.mp4',
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        featured: true,
        published: true,
        clientName: 'Submerge Events',
      },
      {
        title: 'Monochrome Luxe Fashion Editorial',
        category: 'Portraits',
        description: 'Bespoke haute-couture fashion portfolio exploring high-contrast rim lighting, stark shadows, and high-fashion architectural silhouettes.',
        city: 'Visakhapatnam',
        venue: 'Bayview Coastal Resort Suites',
        eventDate: '2026-06-30',
        coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
        ],
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        featured: true,
        published: true,
        clientName: 'Vogue Collective',
      },
      {
        title: 'Apex Hypercar Velocity Launch',
        category: 'Commercial',
        description: 'High-octane commercial visual series for a supercar reveal featuring dynamic smoke FX, macro lens passes on carbon fiber, and motion tracked reels.',
        city: 'Bangalore',
        venue: 'JW Marriott Prestige Golfshire Club',
        eventDate: '2026-05-19',
        coverImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop',
        ],
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-road-at-sunset-41618-large.mp4',
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        featured: true,
        published: true,
        clientName: 'Apex Motorworks',
      },
      {
        title: 'Seaside Sunset Destination Vows',
        category: 'Wedding',
        description: 'Intimate golden-hour beachfront wedding with warm sunset tones, acoustic seaside serenade, and viral couple portraits.',
        city: 'Goa',
        venue: 'Taj Exotica Beach Pavilion',
        eventDate: '2026-04-12',
        coverImage: 'https://images.unsplash.com/photo-1519225429980-715cb0215aed?q=80&w=1600&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop',
        ],
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        featured: false,
        published: true,
        clientName: 'Rohan & Sanjana',
      },
      {
        title: 'Heritage Palace Sangeet Night',
        category: 'Reels',
        description: 'Vibrant cultural extravaganza with mirror-work lehengas, dhol percussionists, and 12 rapid-fire reels delivered overnight for guests.',
        city: 'Hyderabad',
        venue: 'Taj Falaknuma Palace Durbar Hall',
        eventDate: '2026-03-08',
        coverImage: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1600&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
        ],
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        featured: false,
        published: true,
        clientName: 'Reddy Family Celebrations',
      },
    ];

    for (const p of initialPortfolio) {
      await PortfolioModel.create(p);
    }
    console.log('[SEED] Portfolio projects initialized.');
  }

  // 6. Seed Vertical Reels (9:16)
  const existingReels = await ReelModel.find();
  if (existingReels.length === 0) {
    const initialReels = [
      {
        title: 'Golden Hour Bridal Reveal',
        description: 'Slow-motion veil toss with warm cinematic sunlight and emotional reaction shot.',
        eventName: 'Ananya & Aditya Wedding',
        city: 'Vijayawada',
        venue: 'A Convention Centre',
        eventDate: '2026-08-18',
        thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-ceremony-in-a-forest-43309-large.mp4',
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        views: '128K',
        featured: true,
        published: true,
        order: 1,
      },
      {
        title: 'Bass Drop Crowd Surge',
        description: 'Instant hype reel captured on the latest iPhone with speed ramp transitions at main stage.',
        eventName: 'Neon Pulse Festival',
        city: 'Hyderabad',
        venue: 'Hitex Exhibition Grounds',
        eventDate: '2026-07-24',
        thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-in-the-air-at-a-music-festival-43310-large.mp4',
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        views: '240K',
        featured: true,
        published: true,
        order: 2,
      },
      {
        title: 'Hypercar Cold Start Smoke',
        description: 'Exhaust roar, titanium glow, and gimbal tracking shot through neon warehouse.',
        eventName: 'Apex GT Reveal',
        city: 'Bangalore',
        venue: 'Prestige Golfshire',
        eventDate: '2026-05-19',
        thumbnail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-road-at-sunset-41618-large.mp4',
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        views: '89K',
        featured: true,
        published: true,
        order: 3,
      },
      {
        title: 'Sangeet Choreography Breakdown',
        description: 'Multi-angle rhythm cut with synchronized audio drops for the groom squad.',
        eventName: 'Heritage Sangeet Spectacular',
        city: 'Hyderabad',
        venue: 'Taj Falaknuma Palace',
        eventDate: '2026-03-08',
        thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1000&auto=format&fit=crop',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-in-the-air-at-a-music-festival-43310-large.mp4',
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        views: '165K',
        featured: true,
        published: true,
        order: 4,
      },
      {
        title: 'Coastal Sunset Silhouette Walk',
        description: 'Romantic seaside walk filmed with anamorphic flare and 120fps fluid slow-mo.',
        eventName: 'Rohan & Sanjana Vows',
        city: 'Goa',
        venue: 'Taj Exotica Beach',
        eventDate: '2026-04-12',
        thumbnail: 'https://images.unsplash.com/photo-1519225429980-715cb0215aed?q=80&w=1000&auto=format&fit=crop',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-ceremony-in-a-forest-43309-large.mp4',
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        views: '94K',
        featured: false,
        published: true,
        order: 5,
      },
    ];

    for (const r of initialReels) {
      await ReelModel.create(r);
    }
    console.log('[SEED] Reels initialized.');
  }

  // 7. Seed Testimonials
  const existingTestimonials = await TestimonialModel.find();
  if (existingTestimonials.length === 0) {
    const initialTestimonials = [
      {
        customerName: 'Aditya & Ananya Varma',
        customerRole: 'Wedding Clients',
        eventType: 'Luxury Wedding (Vijayawada)',
        review: 'LEOX is unmatched. We had 3 viral reels on our Instagram before our reception breakfast was even served! Shot on the latest iPhones, the quality and colors are indistinguishable from cinema.',
        rating: 5,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
        published: true,
      },
      {
        customerName: 'Vikramaditya Roy',
        customerRole: 'Festival Director',
        eventType: 'Neon Pulse Festival (Hyderabad)',
        review: 'When you are coordinating 15,000 people and huge DJ sets, you need a crew that knows how to move fast and capture energy. LEOX nailed every bass drop and delivered highlight clips that drove our ticket sales through the roof.',
        rating: 5,
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
        published: true,
      },
      {
        customerName: 'Shreya Chunduri',
        customerRole: 'Fashion Designer & Founder',
        eventType: 'Brand Campaign Shoot (Bangalore)',
        review: 'LEOX has an extraordinary eye for movement and pacing. The mood, the rhythm of the reels, and the instant turnaround set our collection apart. Truly exceptional creators.',
        rating: 5,
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
        published: true,
      },
    ];

    for (const t of initialTestimonials) {
      await TestimonialModel.create(t);
    }
    console.log('[SEED] Testimonials initialized.');
  }

  // 8. Seed sample initial bookings for analytics demonstration
  const existingBookings = await BookingModel.find();
  if (existingBookings.length === 0) {
    const sampleBookings = [
      {
        fullName: 'Kalyan Chakravarthy',
        phone: '+91 98480 22334',
        email: 'kalyan.c@example.com',
        service: 'Wedding & Celebration Content',
        package: 'EVENT PREMIUM',
        eventDate: '2026-09-25',
        city: 'Vijayawada',
        venue: 'A Convention Centre',
        eventDetails: 'Grand engagement ceremony with 600 attendees, need 5 live reels and full photography coverage.',
        expectedGuests: '500-1000',
        budgetRange: '₹75,000 - ₹1,00,000',
        instagramHandle: 'kalyan_c',
        status: 'CONFIRMED' as const,
        internalNotes: 'Advance deposit received. Assigned lead iPhone creator and on-site editing station.',
      },
      {
        fullName: 'Meghana Rao',
        phone: '+91 99890 55412',
        email: 'meghana.rao@example.com',
        service: 'Instagram Reels & Short-Form Content',
        package: 'REEL PRO',
        eventDate: '2026-10-02',
        city: 'Hyderabad',
        venue: 'Novotel Convention Centre',
        eventDetails: 'Fashion exhibition showcase and runway walk; need 6 high-energy reels with same-day edits.',
        expectedGuests: '250',
        budgetRange: '₹35,000 - ₹50,000',
        instagramHandle: 'meghana_style',
        status: 'NEW' as const,
        internalNotes: 'Client contacted via Instagram DM previously.',
      },
      {
        fullName: 'Dr. Siddharth Varma',
        phone: '+91 97000 88910',
        email: 'siddharth.varma@example.com',
        service: 'Event Photography',
        package: 'EVENT ESSENTIAL',
        eventDate: '2026-10-15',
        city: 'Visakhapatnam',
        venue: 'The Gateway Hotel Beach Road',
        eventDetails: 'Annual Medical Conclave & Awards Gala dinner.',
        expectedGuests: '300',
        budgetRange: '₹45,000',
        instagramHandle: '',
        status: 'CONTACTED' as const,
        internalNotes: 'Sent quotation and schedule draft.',
      },
    ];

    for (const b of sampleBookings) {
      await BookingModel.create(b);
    }
    console.log('[SEED] Initial sample bookings initialized.');
  }

  dbManager.save();
  console.log('[SEED] Database initialization complete.');
}

// Run standalone if called directly
if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase().then(() => {
    console.log('[SEED] Completed successfully.');
    process.exit(0);
  }).catch(err => {
    console.error('[SEED] Error:', err);
    process.exit(1);
  });
}
