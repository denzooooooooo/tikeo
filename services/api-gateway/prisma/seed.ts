import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const future = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

async function main() {
  console.log('🌍 Seeding Tikeo with African data...');

  // ─── CLEAN UP ───────────────────────────────────────────────────────────────
  await prisma.contestVote.deleteMany();
  await prisma.contestant.deleteMany();
  await prisma.contest.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.order.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.eventImage.deleteMany();
  await prisma.eventLike.deleteMany();
  await prisma.eventReview.deleteMany();
  await prisma.event.deleteMany();
  await prisma.organizerLike.deleteMany();
  await prisma.organizerSubscription.deleteMany();
  await prisma.organizerReview.deleteMany();
  await prisma.organizer.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.userPreferences.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleaned');

  // ─── USERS ──────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Tikeo2024!', 10);

  await prisma.user.create({
    data: {
      email: 'admin@tikeo.africa',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Tikeo',
      role: 'ADMIN',
      emailVerified: true,
      preferences: {
        create: {
          language: 'fr',
          currency: 'XOF',
          country: 'CI',
          city: 'Abidjan',
          latitude: 5.3599517,
          longitude: -4.0082563,
        },
      },
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'kofi.asante@gmail.com',
      password: hashedPassword,
      firstName: 'Kofi',
      lastName: 'Asante',
      role: 'USER',
      emailVerified: true,
      phone: '+225 07 12 34 56',
      preferences: {
        create: { language: 'fr', currency: 'XOF', country: 'CI', city: 'Abidjan', latitude: 5.3599517, longitude: -4.0082563 },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'aminata.diallo@gmail.com',
      password: hashedPassword,
      firstName: 'Aminata',
      lastName: 'Diallo',
      role: 'USER',
      emailVerified: true,
      phone: '+221 77 456 78 90',
      preferences: {
        create: { language: 'fr', currency: 'XOF', country: 'SN', city: 'Dakar', latitude: 14.6928, longitude: -17.4467 },
      },
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'chidi.okonkwo@gmail.com',
      password: hashedPassword,
      firstName: 'Chidi',
      lastName: 'Okonkwo',
      role: 'USER',
      emailVerified: true,
      phone: '+234 80 123 45 67',
      preferences: {
        create: { language: 'fr', currency: 'NGN', country: 'NG', city: 'Lagos', latitude: 6.5244, longitude: 3.3792 },
      },
    },
  });

  // Organizer users
  const orgUser1 = await prisma.user.create({
    data: { email: 'events@abidjanprod.ci', password: hashedPassword, firstName: 'Moussa', lastName: 'Coulibaly', role: 'ORGANIZER', emailVerified: true, phone: '+225 05 00 11 22' },
  });
  const orgUser2 = await prisma.user.create({
    data: { email: 'contact@dakarevenements.sn', password: hashedPassword, firstName: 'Fatou', lastName: 'Ndiaye', role: 'ORGANIZER', emailVerified: true, phone: '+221 76 234 56 78' },
  });
  const orgUser3 = await prisma.user.create({
    data: { email: 'info@lagosvibes.ng', password: hashedPassword, firstName: 'Emeka', lastName: 'Obi', role: 'ORGANIZER', emailVerified: true, phone: '+234 81 987 65 43' },
  });
  const orgUser4 = await prisma.user.create({
    data: { email: 'booking@doualaevents.cm', password: hashedPassword, firstName: 'Jean-Pierre', lastName: 'Mbarga', role: 'ORGANIZER', emailVerified: true, phone: '+237 6 77 88 99 00' },
  });
  const orgUser5 = await prisma.user.create({
    data: { email: 'contact@accraevents.gh', password: hashedPassword, firstName: 'Kwame', lastName: 'Mensah', role: 'ORGANIZER', emailVerified: true, phone: '+233 24 567 89 01' },
  });
  const orgUser6 = await prisma.user.create({
    data: { email: 'info@nairobishows.ke', password: hashedPassword, firstName: 'Wanjiru', lastName: 'Kamau', role: 'ORGANIZER', emailVerified: true, phone: '+254 72 345 67 89' },
  });

  console.log('✅ Users created');

  // ─── ORGANIZERS ─────────────────────────────────────────────────────────────
  const org1 = await prisma.organizer.create({
    data: {
      userId: orgUser1.id,
      companyName: 'Abidjan Productions',
      description: "Premier organisateur d'événements en Côte d'Ivoire. Concerts, festivals, soirées culturelles depuis 2010.",
      logo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
      website: 'https://abidjanprod.ci',
      instagramUrl: 'https://instagram.com/abidjanprod',
      facebookUrl: 'https://facebook.com/abidjanprod',
      verified: true, rating: 4.8, ratingCount: 342, totalEvents: 87, totalTicketsSold: 45230, followersCount: 12500,
    },
  });

  const org2 = await prisma.organizer.create({
    data: {
      userId: orgUser2.id,
      companyName: 'Dakar Événements',
      description: 'Spécialiste des événements culturels et musicaux au Sénégal. Organisateur du Festival Dakar Music Week.',
      logo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
      website: 'https://dakarevenements.sn',
      instagramUrl: 'https://instagram.com/dakarevenements',
      verified: true, rating: 4.6, ratingCount: 218, totalEvents: 54, totalTicketsSold: 28900, followersCount: 8700,
    },
  });

  const org3 = await prisma.organizer.create({
    data: {
      userId: orgUser3.id,
      companyName: 'Lagos Vibes Entertainment',
      description: "Nigeria's top event management company. Afrobeats concerts, fashion shows, and corporate events.",
      logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
      website: 'https://lagosvibes.ng',
      instagramUrl: 'https://instagram.com/lagosvibes',
      twitterUrl: 'https://twitter.com/lagosvibes',
      verified: true, rating: 4.9, ratingCount: 567, totalEvents: 134, totalTicketsSold: 89400, followersCount: 34200,
    },
  });

  const org4 = await prisma.organizer.create({
    data: {
      userId: orgUser4.id,
      companyName: 'Douala Events Pro',
      description: "Organisateur d'événements premium au Cameroun. Concerts, galas, conférences d'affaires.",
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
      website: 'https://doualaevents.cm',
      facebookUrl: 'https://facebook.com/doualaevents',
      verified: true, rating: 4.5, ratingCount: 156, totalEvents: 43, totalTicketsSold: 19800, followersCount: 5600,
    },
  });

  const org5 = await prisma.organizer.create({
    data: {
      userId: orgUser5.id,
      companyName: 'Accra Events Ghana',
      description: "Ghana's premier event organizer. Highlife concerts, cultural festivals, and business summits.",
      logo: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80',
      website: 'https://accraevents.gh',
      instagramUrl: 'https://instagram.com/accraevents',
      verified: true, rating: 4.7, ratingCount: 289, totalEvents: 67, totalTicketsSold: 34500, followersCount: 11200,
    },
  });

  const org6 = await prisma.organizer.create({
    data: {
      userId: orgUser6.id,
      companyName: 'Nairobi Shows Kenya',
      description: "East Africa's leading entertainment company. Music festivals, comedy shows, and tech conferences.",
      logo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80',
      website: 'https://nairobishows.ke',
      instagramUrl: 'https://instagram.com/nairobishows',
      verified: true, rating: 4.6, ratingCount: 198, totalEvents: 52, totalTicketsSold: 27600, followersCount: 9800,
    },
  });

  console.log('✅ Organizers created');

  // ─── EVENTS ─────────────────────────────────────────────────────────────────

  // ── CÔTE D'IVOIRE ──
  const event1 = await prisma.event.create({
    data: {
      title: 'Abidjan Music Festival 2025',
      slug: 'abidjan-music-festival-2025',
      description: "Le plus grand festival de musique africaine en Côte d'Ivoire. 3 jours de concerts avec les plus grands artistes du continent : Burna Boy, Wizkid, Davido, Aya Nakamura, Fally Ipupa. Une expérience inoubliable au cœur d'Abidjan.",
      shortDescription: "3 jours de concerts avec les plus grands artistes africains",
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80',
      teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      category: 'MUSIC',
      tags: ['afrobeats', 'festival', 'concert', 'abidjan', 'musique africaine'],
      organizerId: org1.id,
      venueName: "Stade Félix Houphouët-Boigny",
      venueAddress: 'Boulevard de la République',
      venueCity: 'Abidjan',
      venueCountry: "Côte d'Ivoire",
      venuePostalCode: '01 BP 1234',
      venueLatitude: 5.3364,
      venueLongitude: -4.0167,
      startDate: future(15),
      endDate: future(17),
      timezone: 'Africa/Abidjan',
      capacity: 50000,
      ticketsSold: 32450,
      ticketsAvailable: 17550,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      currency: 'XOF',
      minPrice: 5000,
      maxPrice: 75000,
      isFeatured: true,
      views: 45230,
      shares: 3420,
      publishedAt: new Date(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      { eventId: event1.id, name: 'Pelouse', description: 'Accès pelouse générale', price: 5000, quantity: 30000, sold: 22000, available: 8000, salesStart: new Date(), salesEnd: future(14), minPerOrder: 1, maxPerOrder: 10, isActive: true, benefits: ['Accès pelouse', 'Ambiance générale'] },
      { eventId: event1.id, name: 'Tribune', description: 'Places assises en tribune', price: 15000, quantity: 15000, sold: 8500, available: 6500, salesStart: new Date(), salesEnd: future(14), minPerOrder: 1, maxPerOrder: 6, isActive: true, benefits: ['Place assise', 'Vue panoramique'] },
      { eventId: event1.id, name: 'VIP', description: 'Espace VIP avec accès backstage', price: 50000, quantity: 3000, sold: 1500, available: 1500, salesStart: new Date(), salesEnd: future(14), minPerOrder: 1, maxPerOrder: 4, isActive: true, benefits: ['Espace VIP', 'Open bar', 'Accès backstage', 'Meet & Greet'] },
      { eventId: event1.id, name: 'VVIP', description: 'Loge privée avec service premium', price: 75000, quantity: 2000, sold: 450, available: 1550, salesStart: new Date(), salesEnd: future(14), minPerOrder: 1, maxPerOrder: 2, isActive: true, benefits: ['Loge privée', 'Service traiteur', 'Parking VIP'] },
    ],
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Nuit de la Mode Abidjan',
      slug: 'nuit-mode-abidjan-2025',
      description: "La plus grande soirée de mode africaine. Défilés des créateurs ivoiriens et internationaux, exposition de collections exclusives, networking avec les professionnels de la mode.",
      shortDescription: 'Défilés de mode africaine et internationale',
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
      teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      category: 'ARTS',
      tags: ['mode', 'fashion', 'défilé', 'abidjan', 'créateurs africains'],
      organizerId: org1.id,
      venueName: "Sofitel Abidjan Hôtel Ivoire",
      venueAddress: 'Boulevard Hassan II, Cocody',
      venueCity: 'Abidjan',
      venueCountry: "Côte d'Ivoire",
      venuePostalCode: '01 BP 1234',
      venueLatitude: 5.3600,
      venueLongitude: -3.9800,
      startDate: future(22),
      endDate: future(22),
      timezone: 'Africa/Abidjan',
      capacity: 800,
      ticketsSold: 620,
      ticketsAvailable: 180,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      currency: 'XOF',
      minPrice: 25000,
      maxPrice: 150000,
      isFeatured: true,
      views: 12340,
      shares: 890,
      publishedAt: new Date(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      { eventId: event2.id, name: 'Standard', price: 25000, quantity: 400, sold: 320, available: 80, salesStart: new Date(), salesEnd: future(21), minPerOrder: 1, maxPerOrder: 4, isActive: true, benefits: ['Accès défilé', 'Cocktail de bienvenue'] },
      { eventId: event2.id, name: 'Premium', price: 75000, quantity: 300, sold: 240, available: 60, salesStart: new Date(), salesEnd: future(21), minPerOrder: 1, maxPerOrder: 2, isActive: true, benefits: ['Place prioritaire', 'Cocktail VIP', 'Goody bag', 'Accès after-party'] },
      { eventId: event2.id, name: 'Table VIP', price: 150000, quantity: 100, sold: 60, available: 40, salesStart: new Date(), salesEnd: future(21), minPerOrder: 1, maxPerOrder: 1, isActive: true, benefits: ['Table privée (4 pers)', 'Champagne', 'Dîner gastronomique'] },
    ],
  });

  const event3 = await prisma.event.create({
    data: {
      title: 'Conférence Tech Africa Abidjan',
      slug: 'tech-africa-abidjan-2025',
      description: "La plus grande conférence technologique d'Afrique de l'Ouest. Startups, investisseurs, entrepreneurs et innovateurs se réunissent pour 2 jours de conférences, ateliers et networking. Thèmes : FinTech, AgriTech, HealthTech, IA.",
      shortDescription: "La conférence tech de référence en Afrique de l'Ouest",
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
      teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      category: 'TECHNOLOGY',
      tags: ['tech', 'startup', 'innovation', 'fintech', 'abidjan'],
      organizerId: org1.id,
      venueName: "Palais des Congrès d'Abidjan",
      venueAddress: 'Plateau, Avenue Botreau Roussel',
      venueCity: 'Abidjan',
      venueCountry: "Côte d'Ivoire",
      venuePostalCode: '01 BP 5678',
      venueLatitude: 5.3200,
      venueLongitude: -4.0200,
      startDate: future(30),
      endDate: future(31),
      timezone: 'Africa/Abidjan',
      capacity: 2000,
      ticketsSold: 1450,
      ticketsAvailable: 550,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      currency: 'XOF',
      minPrice: 0,
      maxPrice: 200000,
      isFeatured: false,
      views: 8900,
      shares: 1230,
      publishedAt: new Date(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      { eventId: event3.id, name: 'Gratuit (Étudiant)', price: 0, quantity: 500, sold: 480, available: 20, salesStart: new Date(), salesEnd: future(29), minPerOrder: 1, maxPerOrder: 1, isActive: true, benefits: ['Accès conférences', 'Certificat de participation'] },
      { eventId: event3.id, name: 'Standard', price: 50000, quantity: 1000, sold: 750, available: 250, salesStart: new Date(), salesEnd: future(29), minPerOrder: 1, maxPerOrder: 3, isActive: true, benefits: ['Accès toutes conférences', 'Déjeuner inclus', 'Kit participant'] },
      { eventId: event3.id, name: 'Business', price: 200000, quantity: 500, sold: 220, available: 280, salesStart: new Date(), salesEnd: future(29), minPerOrder: 1, maxPerOrder: 5, isActive: true, benefits: ['Accès VIP', 'Networking exclusif', 'Pitch session'] },
    ],
  });

  // ── SÉNÉGAL ──
  const event4 = await prisma.event.create({
    data: {
      title: 'Dakar Music Week 2025',
      slug: 'dakar-music-week-2025',
      description: "Une semaine dédiée à la musique africaine à Dakar. Concerts de mbalax, afrobeats, jazz africain. Artistes : Youssou N'Dour, Wally Seck, Viviane Chidid, Pape Diouf.",
      shortDescription: 'Une semaine de musique africaine au cœur de Dakar',
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80',
      teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      category: 'MUSIC',
      tags: ['mbalax', 'musique sénégalaise', 'dakar', 'youssou ndour', 'festival'],
      organizerId: org2.id,
      venueName: 'Arène Nationale de Dakar',
      venueAddress: 'Route de Rufisque, Pikine',
      venueCity: 'Dakar',
      venueCountry: 'Sénégal',
      venuePostalCode: 'BP 3456',
      venueLatitude: 14.6928,
      venueLongitude: -17.4467,
      startDate: future(20),
      endDate: future(26),
      timezone: 'Africa/Dakar',
      capacity: 25000,
      ticketsSold: 18900,
      ticketsAvailable: 6100,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      currency: 'XOF',
      minPrice: 3000,
      maxPrice: 50000,
      isFeatured: true,
      views: 34500,
      shares: 2890,
      publishedAt: new Date(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      { eventId: event4.id, name: 'Entrée Générale', price: 3000, quantity: 15000, sold: 12000, available: 3000, salesStart: new Date(), salesEnd: future(19), minPerOrder: 1, maxPerOrder: 10, isActive: true, benefits: ['Accès général'] },
      { eventId: event4.id, name: 'Tribune Couverte', price: 10000, quantity: 8000, sold: 5900, available: 2100, salesStart: new Date(), salesEnd: future(19), minPerOrder: 1, maxPerOrder: 6, isActive: true, benefits: ['Place assise couverte', 'Vue dégagée'] },
      { eventId: event4.id, name: 'VIP Lounge', price: 50000, quantity: 2000, sold: 1000, available: 1000, salesStart: new Date(), salesEnd: future(19), minPerOrder: 1, maxPerOrder: 4, isActive: true, benefits: ['Lounge VIP', 'Boissons incluses', 'Accès backstage'] },
    ],
  });

  const event5 = await prisma.event.create({
    data: {
      title: 'Festival Gorée Diaspora',
      slug: 'festival-goree-diaspora-2025',
      description: "Festival culturel sur l'île de Gorée célébrant la diaspora africaine. Art, musique, gastronomie, conférences sur l'histoire et la culture africaine.",
      shortDescription: "Festival culturel sur l'île historique de Gorée",
      coverImage: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=1920&q=80',
      category: 'ARTS',
      tags: ['culture', 'diaspora', 'gorée', 'patrimoine', 'art africain'],
      organizerId: org2.id,
      venueName: 'Île de Gorée',
      venueAddress: 'Île de Gorée',
      venueCity: 'Dakar',
      venueCountry: 'Sénégal',
      venuePostalCode: 'BP 1234',
      venueLatitude: 14.6667,
      venueLongitude: -17.4000,
      startDate: future(45),
      endDate: future(47),
      timezone: 'Africa/Dakar',
      capacity: 5000,
      ticketsSold: 2800,
      ticketsAvailable: 2200,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      currency: 'XOF',
      minPrice: 5000,
      maxPrice: 30000,
      isFeatured: false,
      views: 7800,
      shares: 560,
      publishedAt: new Date(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      { eventId: event5.id, name: 'Pass Journée', price: 5000, quantity: 3000, sold: 1800, available: 1200, salesStart: new Date(), salesEnd: future(44), minPerOrder: 1, maxPerOrder: 5, isActive: true, benefits: ['Accès 1 journée', 'Visite guidée'] },
      { eventId: event5.id, name: 'Pass 3 Jours', price: 12000, quantity: 1500, sold: 800, available: 700, salesStart: new Date(), salesEnd: future(44), minPerOrder: 1, maxPerOrder: 4, isActive: true, benefits: ['Accès 3 jours', 'Visite guidée', 'Repas traditionnel'] },
      { eventId: event5.id, name: 'VIP Diaspora', price: 30000, quantity: 500, sold: 200, available: 300, salesStart: new Date(), salesEnd: future(44), minPerOrder: 1, maxPerOrder: 2, isActive: true, benefits: ['Accès complet', 'Hébergement inclus', 'Dîner de gala'] },
    ],
  });

  // ── NIGERIA ──
  const event6 = await prisma.event.create({
    data: {
      title: 'Afrobeats Lagos Concert',
      slug: 'afrobeats-lagos-concert-2025',
      description: "The biggest Afrobeats concert in West Africa. Featuring Burna Boy, Wizkid, Davido, Rema, Asake, Fireboy DML and more. An unforgettable night of African music at the Tafawa Balewa Square.",
      shortDescription: 'The biggest Afrobeats concert in Lagos',
      coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80',
      teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      category: 'MUSIC',
      tags: ['afrobeats', 'lagos', 'burna boy', 'wizkid', 'davido', 'concert'],
      organizerId: org3.id,
      venueName: 'Tafawa Balewa Square',
      venueAddress: 'Lagos Island',
      venueCity: 'Lagos',
      venueCountry: 'Nigeria',
      venuePostalCode: '101001',
      venueLatitude: 6.4541,
      venueLongitude: 3.3947,
      startDate: future(10),
      endDate: future(10),
      timezone: 'Africa/Lagos',
      capacity: 80000,
      ticketsSold: 65000,
      ticketsAvailable: 15000,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      currency: 'NGN',
      minPrice: 5000,
      maxPrice: 150000,
      isFeatured: true,
      views: 89000,
      shares: 7800,
      publishedAt: new Date(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      { eventId: event6.id, name: 'Regular', price: 5000, quantity: 50000, sold: 42000, available: 8000, salesStart: new Date(), salesEnd: future(9), minPerOrder: 1, maxPerOrder: 10, isActive: true, benefits: ['General access'] },
      { eventId: event6.id, name: 'VIP', price: 50000, quantity: 20000, sold: 18000, available: 2000, salesStart: new Date(), salesEnd: future(9), minPerOrder: 1, maxPerOrder: 4, isActive: true, benefits: ['VIP area', 'Free drinks', 'Backstage access'] },
      { eventId: event6.id, name: 'VVIP Table', price: 150000, quantity: 10000, sold: 5000, available: 5000, salesStart: new Date(), salesEnd: future(9), minPerOrder: 1, maxPerOrder: 2, isActive: true, benefits: ['Private table', 'Premium service', 'Meet & Greet'] },
    ],
  });

  // ── CAMEROUN ──
  const event7 = await prisma.event.create({
    data: {
      title: 'Douala Jazz & Blues Festival',
      slug: 'douala-jazz-blues-festival-2025',
      description: "Le festival de jazz et blues le plus prisé d'Afrique centrale. 4 jours de concerts avec des artistes camerounais et internationaux dans le cadre magnifique du bord de mer de Douala.",
      shortDescription: 'Festival de jazz et blues au bord de mer de Douala',
      coverImage: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1920&q=80',
      teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      category: 'MUSIC',
      tags: ['jazz', 'blues', 'douala', 'cameroun', 'festival'],
      organizerId: org4.id,
      venueName: 'Esplanade du Port de Douala',
      venueAddress: 'Boulevard de la Liberté',
      venueCity: 'Douala',
      venueCountry: 'Cameroun',
      venuePostalCode: 'BP 4567',
      venueLatitude: 4.0511,
      venueLongitude: 9.7679,
      startDate: future(35),
      endDate: future(38),
      timezone: 'Africa/Douala',
      capacity: 15000,
      ticketsSold: 9800,
      ticketsAvailable: 5200,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      currency: 'XAF',
      minPrice: 5000,
      maxPrice: 80000,
      isFeatured: true,
      views: 18900,
      shares: 1450,
      publishedAt: new Date(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      { eventId: event7.id, name: 'Pass Journée', price: 5000, quantity: 8000, sold: 5500, available: 2500, salesStart: new Date(), salesEnd: future(34), minPerOrder: 1, maxPerOrder: 6, isActive: true, benefits: ['Accès 1 journée'] },
      { eventId: event7.id, name: 'Pass Festival', price: 15000, quantity: 5000, sold: 3200, available: 1800, salesStart: new Date(), salesEnd: future(34), minPerOrder: 1, maxPerOrder: 4, isActive: true, benefits: ['Accès 4 jours', 'Programme officiel'] },
      { eventId: event7.id, name: 'VIP Pass', price: 80000, quantity: 2000, sold: 1100, available: 900, salesStart: new Date(), salesEnd: future(34), minPerOrder: 1, maxPerOrder: 2, isActive: true, benefits: ['Accès VIP', 'Lounge privé', 'Rencontre artistes'] },
    ],
  });

  // ── GHANA ──
  const event8 = await prisma.event.create({
    data: {
      title: 'Accra Highlife Night',
      slug: 'accra-highlife-night-2025',
      description: "A celebration of Ghana's iconic Highlife music genre. Featuring legendary artists like Amakye Dede, Daddy Lumba, and new generation stars. A night of pure Ghanaian culture and music.",
      shortDescription: "A night of Ghana's iconic Highlife music",
      coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1920&q=80',
      teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      category: 'MUSIC',
      tags: ['highlife', 'ghana', 'accra', 'african music', 'concert'],
      organizerId: org5.id,
      venueName: 'National Theatre of Ghana',
      venueAddress: 'Liberation Road, Accra',
      venueCity: 'Accra',
      venueCountry: 'Ghana',
      venuePostalCode: 'GA-123',
      venueLatitude: 5.5600,
      venueLongitude: -0.2057,
      startDate: future(25),
      endDate: future(25),
      timezone: 'Africa/Accra',
      capacity: 5000,
      ticketsSold: 3800,
      ticketsAvailable: 1200,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      currency: 'GHS',
      minPrice: 50,
      maxPrice: 500,
      isFeatured: false,
      views: 12300,
      shares: 980,
      publishedAt: new Date(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      { eventId: event8.id, name: 'Standard', price: 50, quantity: 3000, sold: 2400, available: 600, salesStart: new Date(), salesEnd: future(24), minPerOrder: 1, maxPerOrder: 6, isActive: true, benefits: ['General admission'] },
      { eventId: event8.id, name: 'Premium', price: 150, quantity: 1500, sold: 1100, available: 400, salesStart: new Date(), salesEnd: future(24), minPerOrder: 1, maxPerOrder: 4, isActive: true, benefits: ['Reserved seating', 'Welcome drink'] },
      { eventId: event8.id, name: 'VIP', price: 500, quantity: 500, sold: 300, available: 200, salesStart: new Date(), salesEnd: future(24), minPerOrder: 1, maxPerOrder: 2, isActive: true, benefits: ['VIP lounge', 'Dinner included', 'Artist meet'] },
    ],
  });

  // ── KENYA ──
  const event9 = await prisma.event.create({
    data: {
      title: 'Nairobi Tech Summit 2025',
      slug: 'nairobi-tech-summit-2025',
      description: "East Africa's premier technology conference. Bringing together innovators, entrepreneurs, and investors from across the continent. Topics: AI, Blockchain, Mobile Money, AgriTech, and the future of African tech.",
      shortDescription: "East Africa's premier technology conference",
      coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&q=80',
      teaserVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      category: 'TECHNOLOGY',
      tags: ['tech', 'innovation', 'nairobi', 'kenya', 'startup', 'AI'],
      organizerId: org6.id,
      venueName: 'Kenyatta International Convention Centre',
      venueAddress: 'City Square, Nairobi',
      venueCity: 'Nairobi',
      venueCountry: 'Kenya',
      venuePostalCode: '00100',
      venueLatitude: -1.2921,
      venueLongitude: 36.8219,
      startDate: future(40),
      endDate: future(41),
      timezone: 'Africa/Nairobi',
      capacity: 3000,
      ticketsSold: 2100,
      ticketsAvailable: 900,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      currency: 'KES',
      minPrice: 0,
      maxPrice: 50000,
      isFeatured: true,
      views: 23400,
      shares: 2100,
      publishedAt: new Date(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      { eventId: event9.id, name: 'Free (Student)', price: 0, quantity: 500, sold: 490, available: 10, salesStart: new Date(), salesEnd: future(39), minPerOrder: 1, maxPerOrder: 1, isActive: true, benefits: ['Conference access', 'Certificate'] },
      { eventId: event9.id, name: 'Standard', price: 5000, quantity: 1500, sold: 1200, available: 300, salesStart: new Date(), salesEnd: future(39), minPerOrder: 1, maxPerOrder: 3, isActive: true, benefits: ['All sessions', 'Lunch included', 'Networking'] },
      { eventId: event9.id, name: 'Executive', price: 50000, quantity: 1000, sold: 410, available: 590, salesStart: new Date(), salesEnd: future(39), minPerOrder: 1, maxPerOrder: 5, isActive: true, benefits: ['VIP access', 'Investor meetings', 'Pitch competition'] },
    ],
  });

  // ── MALI ──
  const event10 = await prisma.event.create({
    data: {
      title: 'Festival au Désert - Bamako Edition',
      slug: 'festival-desert-bamako-2025',
      description: "Inspiré du légendaire Festival au Désert de Tombouctou, cette édition à Bamako célèbre la musique touarègue, le blues du désert et les traditions musicales du Mali. Tinariwen, Oumou Sangaré, Salif Keita.",
      shortDescription: 'Musique touarègue et blues du désert à Bamako',
      coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80',
      category: 'MUSIC',
      tags: ['touareg', 'blues désert', 'mali', 'bamako', 'tinariwen', 'salif keita'],
      organizerId: org2.id,
      venueName: 'Palais de la Culture Amadou Hampâté Bâ',
      venueAddress: 'Avenue de la Liberté, Bamako',
      venueCity: 'Bamako',
      venueCountry: 'Mali',
      venuePostalCode: 'BP 2345',
      venueLatitude: 12.6392,
      venueLongitude: -8.0029,
      startDate: future(55),
      endDate: future(57),
      timezone: 'Africa/Bamako',
      capacity: 10000,
      ticketsSold: 6500,
      ticketsAvailable: 3500,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      currency: 'XOF',
      minPrice: 2000,
      maxPrice: 25000,
      isFeatured: false,
      views: 9800,
      shares: 780,
      publishedAt: new Date(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      { eventId: event10.id, name: 'Entrée Générale', price: 2000, quantity: 7000, sold: 4500, available: 2500, salesStart: new Date(), salesEnd: future(54), minPerOrder: 1, maxPerOrder: 8, isActive: true, benefits: ['Accès général'] },
      { eventId: event10.id, name: 'Pass Premium', price: 8000, quantity: 2500, sold: 1700, available: 800, salesStart: new Date(), salesEnd: future(54), minPerOrder: 1, maxPerOrder: 4, isActive: true, benefits: ['Place assise', 'Accès 3 jours'] },
      { eventId: event10.id, name: 'VIP', price: 25000, quantity: 500, sold: 300, available: 200, salesStart: new Date(), salesEnd: future(54), minPerOrder: 1, maxPerOrder: 2, isActive: true, benefits: ['Lounge VIP', 'Repas traditionnel', 'Rencontre artistes'] },
    ],
  });

  // ── BURKINA FASO ──
  const event11 = await prisma.event.create({
    data: {
      title: 'FESPACO - Festival Panafricain du Cinéma',
      slug: 'fespaco-ouagadougou-2025',
      description: "Le plus grand festival de cinéma africain au monde. Projections de films africains, débats, rencontres avec les cinéastes. Une célébration du 7ème art africain à Ouagadougou.",
      shortDescription: 'Le plus grand festival de cinéma africain',
      coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80',
      category: 'ARTS',
      tags: ['cinéma', 'film africain', 'fespaco', 'ouagadougou', 'burkina faso'],
      organizerId: org2.id,
      venueName: 'CENASA - Centre National des Arts du Spectacle',
      venueAddress: 'Avenue Kwame Nkrumah',
      venueCity: 'Ouagadougou',
      venueCountry: 'Burkina Faso',
      venuePostalCode: 'BP 2505',
      venueLatitude: 12.3714,
      venueLongitude: -1.5197,
      startDate: future(60),
      endDate: future(67),
      timezone: 'Africa/Ouagadougou',
      capacity: 8000,
      ticketsSold: 5200,
      ticketsAvailable: 2800,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      currency: 'XOF',
      minPrice: 1000,
      maxPrice: 20000,
      isFeatured: false,
      views: 14500,
      shares: 1200,
      publishedAt: new Date(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      { eventId: event11.id, name: 'Pass Projection', price: 1000, quantity: 5000, sold: 3500, available: 1500, salesStart: new Date(), salesEnd: future(59), minPerOrder: 1, maxPerOrder: 5, isActive: true, benefits: ['Accès 1 projection'] },
      { eventId: event11.id, name: 'Pass Semaine', price: 5000, quantity: 2500, sold: 1500, available: 1000, salesStart: new Date(), salesEnd: future(59), minPerOrder: 1, maxPerOrder: 3, isActive: true, benefits: ['Accès toutes projections', 'Programme officiel'] },
      { eventId: event11.id, name: 'Accréditation Pro', price: 20000, quantity: 500, sold: 200, available: 300, salesStart: new Date(), salesEnd: future(59), minPerOrder: 1, maxPerOrder: 1, isActive: true, benefits: ['Accès complet', 'Rencontres professionnelles', 'Soirée de gala'] },
    ],
  });

  // ── TOGO ──
  const event12 = await prisma.event.create({
    data: {
      title: 'Lomé Carnival 2025',
      slug: 'lome-carnival-2025',
      description: "Le carnaval de Lomé, une explosion de couleurs, de musique et de danse. Défilés de chars, costumes traditionnels, concerts en plein air. La fête la plus attendue du Togo.",
      shortDescription: 'Le plus grand carnaval du Togo',
      coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&q=80',
      category: 'ENTERTAINMENT',
      tags: ['carnaval', 'lomé', 'togo', 'fête', 'défilé'],
      organizerId: org1.id,
      venueName: 'Boulevard du Mono, Lomé',
      venueAddress: 'Boulevard du Mono',
      venueCity: 'Lomé',
      venueCountry: 'Togo',
      venuePostalCode: 'BP 1234',
      venueLatitude: 6.1375,
      venueLongitude: 1.2123,
      startDate: future(18),
      endDate: future(19),
      timezone: 'Africa/Lome',
      capacity: 30000,
      ticketsSold: 22000,
      ticketsAvailable: 8000,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      currency: 'XOF',
      minPrice: 0,
      maxPrice: 30000,
      isFeatured: false,
      views: 19800,
      shares: 2300,
      publishedAt: new Date(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      { eventId: event12.id, name: 'Gratuit (Spectateur)', price: 0, quantity: 20000, sold: 18000, available: 2000, salesStart: new Date(), salesEnd: future(17), minPerOrder: 1, maxPerOrder: 5, isActive: true, benefits: ['Accès spectateur'] },
      { eventId: event12.id, name: 'Tribune VIP', price: 15000, quantity: 8000, sold: 3500, available: 4500, salesStart: new Date(), salesEnd: future(17), minPerOrder: 1, maxPerOrder: 4, isActive: true, benefits: ['Tribune couverte', 'Vue panoramique', 'Boissons'] },
      { eventId: event12.id, name: 'Loge Prestige', price: 30000, quantity: 2000, sold: 500, available: 1500, salesStart: new Date(), salesEnd: future(17), minPerOrder: 1, maxPerOrder: 2, isActive: true, benefits: ['Loge privée', 'Service traiteur', 'Parking'] },
    ],
  });

  console.log('✅ Events created');

  // ─── PROMO CODES ────────────────────────────────────────────────────────────
  await prisma.promoCode.createMany({
    data: [
      {
        code: 'TIKEO10',
        description: '10% de réduction sur tous les événements',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchase: 5000,
        maxUses: 1000,
        usedCount: 234,
        validFrom: new Date(),
        validUntil: future(90),
        isActive: true,
        applicableEvents: [],
      },
      {
        code: 'AFRICA2025',
        description: '15% de réduction - Célébration Afrique 2025',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minPurchase: 10000,
        maxUses: 500,
        usedCount: 89,
        validFrom: new Date(),
        validUntil: future(60),
        isActive: true,
        applicableEvents: [],
      },
      {
        code: 'BIENVENUE',
        description: '2000 FCFA de réduction pour les nouveaux inscrits',
        discountType: 'FIXED',
        discountValue: 2000,
        minPurchase: 8000,
        maxUses: 2000,
        usedCount: 456,
        validFrom: new Date(),
        validUntil: future(120),
        isActive: true,
        applicableEvents: [],
      },
      {
        code: 'FESTIVAL25',
        description: '25% de réduction sur les festivals',
        discountType: 'PERCENTAGE',
        discountValue: 25,
        minPurchase: 15000,
        maxUses: 200,
        usedCount: 45,
        validFrom: new Date(),
        validUntil: future(30),
        isActive: true,
        applicableEvents: [event1.id, event4.id, event7.id],
      },
    ],
  });

  console.log('✅ Promo codes created');

  // ─── CONTESTS ───────────────────────────────────────────────────────────────
  const contest1 = await prisma.contest.create({
    data: {
      title: 'Miss Tikeo Afrique 2025',
      slug: 'miss-tikeo-afrique-2025',
      description: 'Votez pour votre candidate préférée au concours Miss Tikeo Afrique 2025. 15 candidates représentant 15 pays africains.',
      coverImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80',
      category: 'Beauté',
      status: 'ACTIVE',
      organizerId: org1.id,
      startDate: new Date(),
      endDate: future(30),
      maxContestants: 15,
      votesPerUser: 3,
      isPublicResults: true,
      isFeatured: true,
      prize: 'Couronne + 5 000 000 FCFA + Contrat de mannequinat',
    },
  });

  await prisma.contestant.createMany({
    data: [
      { contestId: contest1.id, name: 'Aïcha Koné', bio: "Représentante de la Côte d'Ivoire, étudiante en droit", imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80', order: 1, votesCount: 4523 },
      { contestId: contest1.id, name: 'Fatou Diallo', bio: 'Représentante du Sénégal, ingénieure informatique', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', order: 2, votesCount: 3891 },
      { contestId: contest1.id, name: 'Amina Osei', bio: 'Représentante du Ghana, artiste peintre', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80', order: 3, votesCount: 3245 },
      { contestId: contest1.id, name: 'Ngozi Adeyemi', bio: 'Représentante du Nigeria, médecin', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80', order: 4, votesCount: 2987 },
      { contestId: contest1.id, name: 'Wanjiru Kamau', bio: 'Représentante du Kenya, athlète', imageUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80', order: 5, votesCount: 2654 },
      { contestId: contest1.id, name: 'Marie-Claire Mbarga', bio: 'Représentante du Cameroun, architecte', imageUrl: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&q=80', order: 6, votesCount: 2341 },
    ],
  });

  const contest2 = await prisma.contest.create({
    data: {
      title: 'Meilleur DJ Afrique 2025',
      slug: 'meilleur-dj-afrique-2025',
      description: 'Qui est le meilleur DJ africain de 2025 ? Votez pour votre artiste préféré parmi les 10 finalistes sélectionnés.',
      coverImage: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1200&q=80',
      category: 'Musique',
      status: 'ACTIVE',
      organizerId: org3.id,
      startDate: new Date(),
      endDate: future(14),
      maxContestants: 10,
      votesPerUser: 1,
      isPublicResults: true,
      isFeatured: true,
      prize: 'Contrat de résidence + 10 000 000 FCFA',
    },
  });

  await prisma.contestant.createMany({
    data: [
      { contestId: contest2.id, name: 'DJ Arafat Jr', bio: 'Abidjan, Côte d\'Ivoire - Spécialiste Coupé-Décalé', imageUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&q=80', order: 1, votesCount: 8934 },
      { contestId: contest2.id, name: 'DJ Neptune', bio: 'Lagos, Nigeria - Afrobeats & Amapiano', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', order: 2, votesCount: 7823 },
      { contestId: contest2.id, name: 'DJ Maphorisa', bio: 'Johannesburg, Afrique du Sud - Amapiano', imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80', order: 3, votesCount: 6712 },
      { contestId: contest2.id, name: 'DJ Spinall', bio: 'Lagos, Nigeria - Afrobeats', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', order: 4, votesCount: 5601 },
    ],
  });

  console.log('✅ Contests created');

  // ─── REVIEWS ────────────────────────────────────────────────────────────────
  await prisma.eventReview.createMany({
    data: [
      { eventId: event1.id, userId: user1.id, rating: 5, title: 'Incroyable !', content: "Le meilleur festival que j'ai jamais vu. Organisation parfaite, artistes au top !" },
      { eventId: event1.id, userId: user2.id, rating: 4, title: 'Très bien', content: 'Super ambiance, bonne organisation. Juste un peu de monde mais ça fait partie du jeu.' },
      { eventId: event4.id, userId: user1.id, rating: 5, title: 'Youssou N\'Dour était fantastique', content: 'Une nuit magique avec le roi du mbalax. Dakar Music Week est un must !' },
      { eventId: event6.id, userId: user3.id, rating: 5, title: 'Best concert ever!', content: 'Burna Boy and Wizkid on the same stage? Unbelievable! Lagos never disappoints.' },
    ],
  });

  // ─── NOTIFICATIONS ──────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { userId: user1.id, type: 'EVENT_REMINDER', title: 'Rappel : Abidjan Music Festival', message: "L'événement commence dans 3 jours. Préparez-vous !", read: false },
      { userId: user1.id, type: 'RECOMMENDATION', title: 'Événement recommandé', message: "Découvrez la Nuit de la Mode Abidjan - Basé sur vos préférences", read: false },
      { userId: user2.id, type: 'EVENT_REMINDER', title: 'Rappel : Dakar Music Week', message: "Plus que 5 jours avant le début du festival !", read: false },
      { userId: user3.id, type: 'RECOMMENDATION', title: 'New event near you', message: 'Afrobeats Lagos Concert - Only 10 days left!', read: true },
    ],
  });

  console.log('✅ Reviews and notifications created');
  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('  - 9 users (1 admin, 3 regular, 6 organizers)');
  console.log('  - 6 organizers (CI, SN, NG, CM, GH, KE)');
  console.log('  - 12 events across 8 African countries');
  console.log('  - 4 promo codes');
  console.log('  - 2 contests with contestants');
  console.log('  - Reviews and notifications');
  console.log('');
  console.log('🔑 Test credentials:');
  console.log('  Admin:     admin@tikeo.africa / Tikeo2024!');
  console.log('  User CI:   kofi.asante@gmail.com / Tikeo2024!');
  console.log('  User SN:   aminata.diallo@gmail.com / Tikeo2024!');
  console.log('  Organizer: events@abidjanprod.ci / Tikeo2024!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
