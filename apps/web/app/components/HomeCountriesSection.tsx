import Link from 'next/link';
import Image from 'next/image';

const countries = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', events: 3200, image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&q=80', gradient: 'from-green-700/70 to-green-900/80', genre: 'Afrobeats', city: 'Lagos' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', events: 1850, image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80', gradient: 'from-orange-600/70 to-green-800/80', genre: 'Coupé-Décalé', city: 'Abidjan' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', events: 1420, image: 'https://images.unsplash.com/photo-1580746738099-b2d4b5d4b9b7?w=600&q=80', gradient: 'from-yellow-600/70 to-green-800/80', genre: 'Mbalax', city: 'Dakar' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', events: 620, image: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=600&q=80', gradient: 'from-green-700/70 to-yellow-700/80', genre: 'Ndombolo', city: 'Libreville' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', events: 980, image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80', gradient: 'from-green-700/70 to-red-800/80', genre: 'Makossa', city: 'Douala' },
  { code: 'CD', name: 'Congo RDC', flag: '🇨🇩', events: 1100, image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80', gradient: 'from-blue-700/70 to-yellow-700/80', genre: 'Rumba', city: 'Kinshasa' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', events: 1680, image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600&q=80', gradient: 'from-red-600/70 to-yellow-700/80', genre: 'Highlife', city: 'Accra' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', events: 2800, image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80', gradient: 'from-green-700/70 to-yellow-700/80', genre: 'Amapiano', city: 'Johannesburg' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', events: 2100, image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80', gradient: 'from-red-700/70 to-green-800/80', genre: 'Gnawa', city: 'Casablanca' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', events: 720, image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80', gradient: 'from-yellow-600/70 to-red-800/80', genre: 'Blues du désert', city: 'Bamako' },
];

export default function HomeCountriesSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#5B7CFF]/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#7B61FF]/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#5B7CFF]/10 to-[#7B61FF]/10 rounded-full mb-4 text-sm font-bold text-[#5B7CFF] border border-[#5B7CFF]/20">
            Afrique — Berceau de la musique mondiale
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Événements{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
              par pays
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            10 pays africains, des milliers d&apos;événements, une culture musicale unique
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {countries.map((c) => (
            <Link
              key={c.code}
              href={`/events?country=${c.code}`}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl shadow-md"
              style={{ aspectRatio: '3/4' }}
            >
              <div className="absolute inset-0">
                <Image src={c.image} alt={c.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-b ${c.gradient} group-hover:opacity-95 transition-opacity duration-300`} />
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 2px rgba(91,124,255,0.6)' }} />
              <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                <div>
                  <div className="text-2xl mb-1 filter drop-shadow-lg">{c.flag}</div>
                  <h3 className="text-sm font-bold text-white leading-tight drop-shadow-md">{c.name}</h3>
                  <p className="text-[11px] text-white/75 font-medium">{c.city}</p>
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full mb-1.5">
                    <span className="text-[10px] text-white/95 font-semibold">{c.genre}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-bold text-sm">{c.events.toLocaleString()}</span>
                    <span className="text-white/60 text-[10px]">événements</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/events" className="inline-flex items-center gap-2 px-7 py-3 border-2 border-[#5B7CFF] text-[#5B7CFF] rounded-xl font-semibold hover:bg-[#5B7CFF] hover:text-white transition-all text-sm">
            Explorer tous les pays
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
