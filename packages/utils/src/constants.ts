/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

/**
 * Application Routes
 */
export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  CHECKOUT: '/checkout',
  TICKETS: '/tickets',
  TICKET_DETAIL: (id: string) => `/tickets/${id}`,
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Votes/Contests
  VOTES: '/votes',
  VOTE_DETAIL: (id: string) => `/votes/${id}`,
  VOTE_CREATE: '/votes/create',
  VOTE_LEADERBOARD: (id: string) => `/votes/${id}/leaderboard`,
  VOTE_GALLERY: (id: string) => `/votes/${id}/gallery`,
  
  // Organizer
  ORGANIZER_DASHBOARD: '/organizer/dashboard',
  ORGANIZER_EVENTS: '/organizer/events',
  ORGANIZER_CREATE_EVENT: '/organizer/events/create',
  ORGANIZER_EDIT_EVENT: (id: string) => `/organizer/events/${id}/edit`,
  ORGANIZER_ANALYTICS: '/organizer/analytics',
  ORGANIZER_SETTINGS: '/organizer/settings',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_ANALYTICS: '/admin/analytics',
};

/**
 * Event Categories
 */
export const EVENT_CATEGORIES = [
  { value: 'MUSIC', label: 'Musique', icon: '🎵' },
  { value: 'SPORTS', label: 'Sports', icon: '⚽' },
  { value: 'ARTS', label: 'Arts & Culture', icon: '🎨' },
  { value: 'TECHNOLOGY', label: 'Technologie', icon: '💻' },
  { value: 'BUSINESS', label: 'Business', icon: '💼' },
  { value: 'FOOD', label: 'Gastronomie', icon: '🍽️' },
  { value: 'HEALTH', label: 'Santé & Bien-être', icon: '🧘' },
  { value: 'EDUCATION', label: 'Éducation', icon: '📚' },
  { value: 'ENTERTAINMENT', label: 'Divertissement', icon: '🎭' },
  { value: 'OTHER', label: 'Autre', icon: '📌' },
];

/**
 * Payment Methods
 */
export const PAYMENT_METHODS = [
  { value: 'CARD', label: 'Carte bancaire', icon: '💳' },
  { value: 'APPLE_PAY', label: 'Apple Pay', icon: '🍎' },
  { value: 'GOOGLE_PAY', label: 'Google Pay', icon: '🔵' },
  { value: 'PAYPAL', label: 'PayPal', icon: '🅿️' },
];

/**
 * Currencies
 */
export const CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
];

/**
 * Languages
 */
export const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  FULL: 'EEEE dd MMMM yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
};

/**
 * File Upload Limits
 */
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100],
};

/**
 * Validation Rules
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  EVENT_TITLE_MIN_LENGTH: 5,
  EVENT_TITLE_MAX_LENGTH: 100,
  EVENT_DESCRIPTION_MIN_LENGTH: 20,
  EVENT_DESCRIPTION_MAX_LENGTH: 5000,
  TICKET_MIN_QUANTITY: 1,
  TICKET_MAX_QUANTITY: 10,
};

/**
 * Cache Keys
 */
export const CACHE_KEYS = {
  EVENTS: 'events',
  EVENT_DETAIL: (id: string) => `event:${id}`,
  USER_PROFILE: 'user:profile',
  USER_TICKETS: 'user:tickets',
  CATEGORIES: 'categories',
  FEATURED_EVENTS: 'featured:events',
};

/**
 * Cache TTL (in seconds)
 */
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'Une erreur est survenue. Veuillez réessayer.',
  NETWORK: 'Erreur de connexion. Vérifiez votre connexion internet.',
  UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette page.',
  FORBIDDEN: "Vous n'avez pas les permissions nécessaires.",
  NOT_FOUND: 'Ressource introuvable.',
  VALIDATION: 'Veuillez vérifier les informations saisies.',
  SERVER: 'Erreur serveur. Veuillez réessayer plus tard.',
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  EVENT_CREATED: 'Événement créé avec succès !',
  EVENT_UPDATED: 'Événement mis à jour avec succès !',
  EVENT_DELETED: 'Événement supprimé avec succès !',
  TICKET_PURCHASED: 'Billet acheté avec succès !',
  TICKET_TRANSFERRED: 'Billet transféré avec succès !',
  PROFILE_UPDATED: 'Profil mis à jour avec succès !',
  PASSWORD_CHANGED: 'Mot de passe modifié avec succès !',
};

/**
 * Animation Durations (in ms)
 */
export const ANIMATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  VERY_SLOW: 500,
};

/**
 * Breakpoints (matching Tailwind)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

/**
 * Social Media Platforms
 */
export const SOCIAL_PLATFORMS = [
  { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/' },
  { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/' },
  { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/' },
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/' },
  { name: 'TikTok', icon: 'tiktok', url: 'https://tiktok.com/' },
];

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
  EVENT_REMINDER: { label: 'Rappel événement', color: 'blue' },
  TICKET_PURCHASED: { label: 'Billet acheté', color: 'green' },
  TICKET_TRANSFERRED: { label: 'Billet transféré', color: 'purple' },
  EVENT_UPDATED: { label: 'Événement mis à jour', color: 'yellow' },
  EVENT_CANCELLED: { label: 'Événement annulé', color: 'red' },
  REFUND_PROCESSED: { label: 'Remboursement effectué', color: 'green' },
  RECOMMENDATION: { label: 'Recommandation', color: 'blue' },
  MARKETING: { label: 'Marketing', color: 'purple' },
  SYSTEM: { label: 'Système', color: 'gray' },
};

/**
 * Ticket Status Colors
 */
export const TICKET_STATUS_COLORS = {
  VALID: 'green',
  USED: 'gray',
  CANCELLED: 'red',
  REFUNDED: 'orange',
  TRANSFERRED: 'blue',
  EXPIRED: 'gray',
};

/**
 * Event Status Colors
 */
export const EVENT_STATUS_COLORS = {
  DRAFT: 'gray',
  PUBLISHED: 'green',
  CANCELLED: 'red',
  POSTPONED: 'orange',
  COMPLETED: 'blue',
};

/**
 * Analytics Time Ranges
 */
export const ANALYTICS_TIME_RANGES = [
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: '90d', label: '90 derniers jours' },
  { value: '1y', label: '1 an' },
  { value: 'all', label: 'Tout' },
];

/**
 * QR Code Configuration
 */
export const QR_CODE = {
  SIZE: 300,
  ERROR_CORRECTION_LEVEL: 'H' as const,
  MARGIN: 4,
};

/**
 * Map Configuration
 */
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 48.8566, lng: 2.3522 }, // Paris
  DEFAULT_ZOOM: 12,
  SEARCH_RADIUS_KM: 50,
};

/**
 * Feature Flags
 */
export const FEATURES = {
  AI_RECOMMENDATIONS: true,
  DYNAMIC_PRICING: true,
  LIVE_STREAMING: true,
  NFT_TICKETS: false,
  SOCIAL_FEATURES: true,
  MARKETPLACE: true,
};
