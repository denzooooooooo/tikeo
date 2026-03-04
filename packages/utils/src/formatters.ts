/**
 * Format currency using Intl.NumberFormat
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'fr-FR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Map country name to ISO 4217 currency code
 */
export function getCurrencyByCountry(venueCountry: string): string {
  if (!venueCountry) return 'XOF';
  const c = venueCountry.toLowerCase();
  // West Africa - FCFA (XOF)
  if (c.includes("côte d'ivoire") || c.includes("cote d'ivoire") || c.includes('ivory coast')) return 'XOF';
  if (c.includes('sénégal') || c.includes('senegal')) return 'XOF';
  if (c.includes('mali')) return 'XOF';
  if (c.includes('burkina')) return 'XOF';
  if (c.includes('togo')) return 'XOF';
  if (c.includes('bénin') || c.includes('benin')) return 'XOF';
  if (c.includes('guinée-bissau') || c.includes('guinea-bissau')) return 'XOF';
  if (c.includes('niger') && !c.includes('nigeria')) return 'XOF';
  // Central Africa - FCFA (XAF)
  if (c.includes('cameroun') || c.includes('cameroon')) return 'XAF';
  if (c.includes('gabon')) return 'XAF';
  if (c.includes('congo (brazzaville)') || c.includes('republic of the congo')) return 'XAF';
  if (c.includes('centrafrique') || c.includes('central african')) return 'XAF';
  if (c.includes('tchad') || c.includes('chad')) return 'XAF';
  if (c.includes('guinée équatoriale') || c.includes('equatorial guinea')) return 'XAF';
  // Other Africa
  if (c.includes('nigeria')) return 'NGN';
  if (c.includes('ghana')) return 'GHS';
  if (c.includes('kenya')) return 'KES';
  if (c.includes('afrique du sud') || c.includes('south africa')) return 'ZAR';
  if (c.includes('maroc') || c.includes('morocco')) return 'MAD';
  if (c.includes('tunisie') || c.includes('tunisia')) return 'TND';
  if (c.includes('algérie') || c.includes('algeria')) return 'DZD';
  if (c.includes('égypte') || c.includes('egypt')) return 'EGP';
  if (c.includes('tanzanie') || c.includes('tanzania')) return 'TZS';
  if (c.includes('ouganda') || c.includes('uganda')) return 'UGX';
  if (c.includes('rwanda')) return 'RWF';
  if (c.includes('éthiopie') || c.includes('ethiopia')) return 'ETB';
  if (c.includes('guinée') || c.includes('guinea') && !c.includes('bissau') && !c.includes('equatorial')) return 'GNF';
  if (c.includes('congo (rdc)') || c.includes('democratic republic')) return 'CDF';
  if (c.includes('mozambique')) return 'MZN';
  if (c.includes('madagascar')) return 'MGA';
  // Europe
  if (c.includes('france') || c.includes('belgique') || c.includes('belgium') ||
      c.includes('allemagne') || c.includes('germany') || c.includes('espagne') ||
      c.includes('spain') || c.includes('italie') || c.includes('italy') ||
      c.includes('portugal') || c.includes('pays-bas') || c.includes('netherlands')) return 'EUR';
  if (c.includes('suisse') || c.includes('switzerland')) return 'CHF';
  if (c.includes('royaume-uni') || c.includes('united kingdom') || c.includes('uk')) return 'GBP';
  // Americas
  if (c.includes('états-unis') || c.includes('united states') || c.includes('usa')) return 'USD';
  if (c.includes('canada')) return 'CAD';
  if (c.includes('brésil') || c.includes('brazil')) return 'BRL';
  // Asia/Pacific
  if (c.includes('émirats') || c.includes('emirates') || c.includes('uae')) return 'AED';
  if (c.includes('japon') || c.includes('japan')) return 'JPY';
  if (c.includes('chine') || c.includes('china')) return 'CNY';
  if (c.includes('inde') || c.includes('india')) return 'INR';
  if (c.includes('australie') || c.includes('australia')) return 'AUD';
  // Default: XOF (West Africa FCFA)
  return 'XOF';
}

/**
 * Format event price based on venue country
 * Returns "Gratuit" for free events, otherwise formats with correct currency
 */
export function formatEventPrice(amount: number, venueCountry?: string): string {
  if (amount === 0) return 'Gratuit';
  const currency = getCurrencyByCountry(venueCountry || '');
  // Use compact formatting for large amounts (XOF, NGN, etc.)
  const largeAmountCurrencies = ['XOF', 'XAF', 'NGN', 'GNF', 'CDF', 'UGX', 'TZS', 'MGA', 'RWF'];
  if (largeAmountCurrencies.includes(currency)) {
    return `${amount.toLocaleString('fr-FR')} ${currency}`;
  }
  // Use Intl for standard currencies
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString('fr-FR')} ${currency}`;
  }
}

/**
 * Format number
 */
export function formatNumber(num: number, locale: string = 'fr-FR'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format date
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'full' = 'short',
  locale: string = 'fr-FR'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const formats = {
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  };

  return new Intl.DateTimeFormat(locale, formats[format] as Intl.DateTimeFormatOptions).format(d);
}

/**
 * Format time
 */
export function formatTime(date: Date | string, locale: string = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Format date time
 */
export function formatDateTime(date: Date | string, locale: string = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Get relative time (e.g., "il y a 2 heures")
 */
export function getRelativeTime(date: Date | string, locale: string = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "à l'instant";
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)} j`;

  return formatDate(d, 'short', locale);
}

/**
 * Format duration
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  if (minutes > 0) {
    return `${minutes}min ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('33')) {
    const formatted = cleaned.slice(2);
    return `+33 ${formatted.slice(0, 1)} ${formatted.slice(1, 3)} ${formatted.slice(3, 5)} ${formatted.slice(5, 7)} ${formatted.slice(7, 9)}`;
  }
  
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
  }
  
  return phone;
}

/**
 * Format credit card number
 */
export function formatCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cardNumber;
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number, suffix: string = '...'): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + suffix;
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Title case
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Get initials
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format address
 */
export function formatAddress(address: {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}): string {
  return `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`;
}

/**
 * Format compact number (e.g., 1.2K, 3.4M)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
}

/**
 * Format ordinal number (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(num: number, locale: string = 'fr-FR'): string {
  if (locale === 'fr-FR') {
    return num === 1 ? `${num}er` : `${num}e`;
  }
  
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Generate URL slug from text
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');           // Trim - from end of text
}

/**
 * Generate unique slug
 */
export function generateUniqueSlug(text: string): string {
  const baseSlug = slugify(text);
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${uniqueId}`;
}
