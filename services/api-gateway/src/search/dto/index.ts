export class SearchEventsDto {
  q?: string;
  category?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  isOnline?: boolean;
  isFeatured?: boolean;
  sortBy?: 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc' | 'popular' | 'recent';
  page?: number;
  limit?: number;
}

