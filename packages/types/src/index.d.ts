export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
    role: UserRole;
    preferences?: UserPreferences;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum UserRole {
    USER = "USER",
    ORGANIZER = "ORGANIZER",
    ADMIN = "ADMIN",
    SCANNER = "SCANNER"
}
export interface UserPreferences {
    language: string;
    currency: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    interests: string[];
    location?: {
        city: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
}
export interface Event {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription?: string;
    images: EventImage[];
    coverImage: string;
    category: EventCategory;
    tags: string[];
    organizerId: string;
    organizer: Organizer;
    venue: Venue;
    startDate: Date;
    endDate: Date;
    timezone: string;
    capacity: number;
    ticketsSold: number;
    ticketsAvailable: number;
    status: EventStatus;
    visibility: EventVisibility;
    pricing: EventPricing;
    isFeatured: boolean;
    isOnline: boolean;
    streamingUrl?: string;
    metadata: EventMetadata;
    createdAt: Date;
    updatedAt: Date;
}
export interface EventImage {
    id: string;
    url: string;
    alt?: string;
    order: number;
}
export declare enum EventCategory {
    MUSIC = "MUSIC",
    SPORTS = "SPORTS",
    ARTS = "ARTS",
    TECHNOLOGY = "TECHNOLOGY",
    BUSINESS = "BUSINESS",
    FOOD = "FOOD",
    HEALTH = "HEALTH",
    EDUCATION = "EDUCATION",
    ENTERTAINMENT = "ENTERTAINMENT",
    OTHER = "OTHER"
}
export declare enum EventStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    CANCELLED = "CANCELLED",
    POSTPONED = "POSTPONED",
    COMPLETED = "COMPLETED"
}
export declare enum EventVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    UNLISTED = "UNLISTED"
}
export interface EventPricing {
    currency: string;
    minPrice: number;
    maxPrice: number;
    dynamicPricing: boolean;
}
export interface EventMetadata {
    views: number;
    likes: number;
    shares: number;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
}
export interface Venue {
    id: string;
    name: string;
    address: Address;
    capacity?: number;
    amenities?: string[];
    images?: string[];
}
export interface Address {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}
export interface Organizer {
    id: string;
    userId: string;
    companyName: string;
    description?: string;
    logo?: string;
    website?: string;
    socialMedia?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
    verified: boolean;
    rating?: number;
    totalEvents: number;
    totalTicketsSold: number;
    createdAt: Date;
}
export interface Ticket {
    id: string;
    eventId: string;
    event: Event;
    userId: string;
    user: User;
    ticketTypeId: string;
    ticketType: TicketType;
    qrCode: string;
    nfcCode?: string;
    status: TicketStatus;
    purchaseDate: Date;
    price: number;
    fees: number;
    total: number;
    orderId: string;
    order: Order;
    transferHistory?: TicketTransfer[];
    scannedAt?: Date;
    scannedBy?: string;
    metadata?: Record<string, any>;
}
export interface TicketType {
    id: string;
    eventId: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    sold: number;
    available: number;
    salesStart: Date;
    salesEnd: Date;
    minPerOrder: number;
    maxPerOrder: number;
    isActive: boolean;
    benefits?: string[];
    metadata?: Record<string, any>;
}
export declare enum TicketStatus {
    VALID = "VALID",
    USED = "USED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
    TRANSFERRED = "TRANSFERRED",
    EXPIRED = "EXPIRED"
}
export interface TicketTransfer {
    id: string;
    ticketId: string;
    fromUserId: string;
    toUserId: string;
    transferDate: Date;
    status: TransferStatus;
}
export declare enum TransferStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export interface Order {
    id: string;
    userId: string;
    user: User;
    eventId: string;
    event: Event;
    tickets: Ticket[];
    subtotal: number;
    fees: number;
    taxes: number;
    total: number;
    currency: string;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentIntentId?: string;
    billingAddress?: Address;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum OrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}
export declare enum PaymentMethod {
    CARD = "CARD",
    APPLE_PAY = "APPLE_PAY",
    GOOGLE_PAY = "GOOGLE_PAY",
    PAYPAL = "PAYPAL",
    BANK_TRANSFER = "BANK_TRANSFER"
}
export interface EventAnalytics {
    eventId: string;
    views: number;
    uniqueViews: number;
    clicks: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
    ticketsSold: number;
    averageOrderValue: number;
    topSources: TrafficSource[];
    demographics: Demographics;
    salesByDay: SalesByDay[];
    salesByTicketType: SalesByTicketType[];
}
export interface TrafficSource {
    source: string;
    visits: number;
    conversions: number;
    revenue: number;
}
export interface Demographics {
    ageGroups: Record<string, number>;
    genders: Record<string, number>;
    locations: Record<string, number>;
}
export interface SalesByDay {
    date: string;
    sales: number;
    revenue: number;
}
export interface SalesByTicketType {
    ticketTypeId: string;
    ticketTypeName: string;
    sold: number;
    revenue: number;
}
export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    read: boolean;
    createdAt: Date;
}
export declare enum NotificationType {
    EVENT_REMINDER = "EVENT_REMINDER",
    TICKET_PURCHASED = "TICKET_PURCHASED",
    TICKET_TRANSFERRED = "TICKET_TRANSFERRED",
    EVENT_UPDATED = "EVENT_UPDATED",
    EVENT_CANCELLED = "EVENT_CANCELLED",
    REFUND_PROCESSED = "REFUND_PROCESSED",
    RECOMMENDATION = "RECOMMENDATION",
    MARKETING = "MARKETING",
    SYSTEM = "SYSTEM"
}
export interface AIRecommendation {
    eventId: string;
    score: number;
    reason: string;
}
export interface AIGeneratedContent {
    title?: string;
    description?: string;
    shortDescription?: string;
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    suggestedPrice?: number;
    estimatedAttendance?: number;
}
export interface AIPricingRecommendation {
    basePrice: number;
    dynamicPrices: {
        earlyBird: number;
        regular: number;
        lastMinute: number;
    };
    confidence: number;
    factors: string[];
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ApiMeta;
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
}
export interface ApiMeta {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
}
export interface PaginatedResponse<T> {
    items: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface SearchFilters {
    query?: string;
    category?: EventCategory;
    location?: {
        city?: string;
        country?: string;
        radius?: number;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    dateRange?: {
        start: Date;
        end: Date;
    };
    priceRange?: {
        min: number;
        max: number;
    };
    tags?: string[];
    isOnline?: boolean;
    isFeatured?: boolean;
    sortBy?: 'date' | 'price' | 'popularity' | 'relevance';
    sortOrder?: 'asc' | 'desc';
}
export interface SearchResult {
    events: Event[];
    total: number;
    facets: SearchFacets;
}
export interface SearchFacets {
    categories: Record<string, number>;
    locations: Record<string, number>;
    priceRanges: Record<string, number>;
    dates: Record<string, number>;
}
export interface Contestant {
    id: string;
    name: string;
    image?: string;
    mainImage?: string;
    bio?: string;
    isWinner?: boolean;
    votesCount: number;
    socialLinks?: {
        instagram?: string;
        tiktok?: string;
        twitter?: string;
        [key: string]: string | undefined;
    };
}
export interface ContestLeaderboardEntry {
    contestantId: string;
    contestantName: string;
    contestantImage?: string;
    rank: number;
    votesCount: number;
    percentage: number;
    isWinner?: boolean;
    winnerPosition?: number;
}
//# sourceMappingURL=index.d.ts.map